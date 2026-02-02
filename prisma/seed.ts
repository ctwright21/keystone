import { PrismaClient, HabitType, HabitStatus, RankTier, XPSource, UserRole } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed...");

  const hashedPassword = await hash("demo123", 12);
  const adminPassword = await hash("admin123", 12);

  // Create a super admin user
  const admin = await prisma.user.upsert({
    where: { email: "admin@keystone.app" },
    update: {},
    create: {
      email: "admin@keystone.app",
      name: "Super Admin",
      password: adminPassword,
      role: UserRole.SUPER_ADMIN,
      timezone: "America/New_York",
    },
  });

  console.log(`Created super admin: ${admin.email}`);

  // Create admin stats
  await prisma.userStats.upsert({
    where: { userId: admin.id },
    update: {},
    create: {
      userId: admin.id,
      totalXp: 0,
      level: 1,
      rank: RankTier.BRONZE,
    },
  });

  // Create a demo user
  const user = await prisma.user.upsert({
    where: { email: "demo@keystone.app" },
    update: {},
    create: {
      email: "demo@keystone.app",
      name: "Demo User",
      password: hashedPassword,
      role: UserRole.USER,
      timezone: "America/New_York",
    },
  });

  console.log(`Created user: ${user.email}`);

  // Create user stats
  const stats = await prisma.userStats.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      totalXp: 850,
      level: 5,
      rank: RankTier.BRONZE,
      currentStreak: 3,
      longestStreak: 7,
      totalCompletions: 45,
      totalHabitsCreated: 5,
      weeksCompleted: 3,
      perfectWeeks: 0,
    },
  });

  console.log("Created user stats");

  // Create sample habits
  const habits = [
    {
      name: "Morning Exercise",
      description: "30 minutes of exercise to start the day",
      type: HabitType.POSITIVE,
      color: "#10B981",
      icon: "dumbbell",
      xpValue: 15,
      sortOrder: 0,
    },
    {
      name: "Read for 20 minutes",
      description: "Read a book or educational content",
      type: HabitType.POSITIVE,
      color: "#8B5CF6",
      icon: "book",
      xpValue: 10,
      sortOrder: 1,
    },
    {
      name: "Drink 8 glasses of water",
      description: "Stay hydrated throughout the day",
      type: HabitType.POSITIVE,
      color: "#00F0FF",
      icon: "droplets",
      xpValue: 10,
      sortOrder: 2,
    },
    {
      name: "No social media before noon",
      description: "Avoid distractions in the morning",
      type: HabitType.NEGATIVE,
      color: "#EF4444",
      icon: "ban",
      xpValue: 10,
      sortOrder: 3,
    },
    {
      name: "Meditate",
      description: "10 minutes of mindfulness",
      type: HabitType.POSITIVE,
      color: "#FBBF24",
      icon: "brain",
      xpValue: 10,
      sortOrder: 4,
    },
  ];

  const createdHabits = [];
  for (const habitData of habits) {
    const habit = await prisma.habit.upsert({
      where: {
        id: `seed-habit-${habitData.sortOrder}`,
      },
      update: habitData,
      create: {
        id: `seed-habit-${habitData.sortOrder}`,
        userId: user.id,
        ...habitData,
      },
    });
    createdHabits.push(habit);
  }

  console.log(`Created ${createdHabits.length} habits`);

  // Create weeks with completions
  const now = new Date();
  const currentWeekStart = new Date(now);
  currentWeekStart.setHours(0, 0, 0, 0);
  const dayOfWeek = currentWeekStart.getDay();
  currentWeekStart.setDate(currentWeekStart.getDate() - dayOfWeek);

  // Create current week and 2 past weeks
  for (let weeksAgo = 0; weeksAgo < 3; weeksAgo++) {
    const weekStart = new Date(currentWeekStart);
    weekStart.setDate(weekStart.getDate() - (weeksAgo * 7));

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    const weekId = `seed-week-${weeksAgo}`;

    const week = await prisma.week.upsert({
      where: {
        id: weekId,
      },
      update: {
        startDate: weekStart,
        endDate: weekEnd,
      },
      create: {
        id: weekId,
        userId: user.id,
        startDate: weekStart,
        endDate: weekEnd,
      },
    });

    console.log(`Created week ${weeksAgo}: ${weekStart.toDateString()} - ${weekEnd.toDateString()}`);

    // Create snapshots for each habit
    for (const habit of createdHabits) {
      await prisma.weekHabitSnapshot.upsert({
        where: {
          weekId_habitId: {
            weekId: week.id,
            habitId: habit.id,
          },
        },
        update: {},
        create: {
          weekId: week.id,
          habitId: habit.id,
          name: habit.name,
          description: habit.description,
          type: habit.type,
          color: habit.color,
          icon: habit.icon,
          sortOrder: habit.sortOrder,
          xpValue: habit.xpValue,
        },
      });
    }

    // Create completions based on week
    // Past weeks have more completions, current week has fewer (in progress)
    const maxDayIndex = weeksAgo === 0 ? dayOfWeek : 6;
    let completionCount = 0;
    let xpEarned = 0;

    for (const habit of createdHabits) {
      for (let day = 0; day <= maxDayIndex; day++) {
        // Simulate ~70-85% completion rate for past weeks, ~60% for current
        const completionChance = weeksAgo === 0 ? 0.6 : (0.7 + Math.random() * 0.15);

        if (Math.random() < completionChance) {
          await prisma.habitCompletion.upsert({
            where: {
              weekId_habitId_dayIndex: {
                weekId: week.id,
                habitId: habit.id,
                dayIndex: day,
              },
            },
            update: {},
            create: {
              weekId: week.id,
              habitId: habit.id,
              dayIndex: day,
              completed: true,
              xpEarned: habit.xpValue,
            },
          });
          completionCount++;
          xpEarned += habit.xpValue;
        }
      }
    }

    // Create/update week score
    const possibleCompletions = createdHabits.length * (maxDayIndex + 1);
    const percentage = possibleCompletions > 0 ? (completionCount / possibleCompletions) * 100 : 0;

    await prisma.weekScore.upsert({
      where: { weekId: week.id },
      update: {
        totalCompletions: completionCount,
        possibleCompletions: createdHabits.length * 7,
        percentage,
        xpEarned,
      },
      create: {
        weekId: week.id,
        totalCompletions: completionCount,
        possibleCompletions: createdHabits.length * 7,
        percentage,
        xpEarned,
      },
    });

    console.log(`  - ${completionCount} completions (${Math.round(percentage)}%), +${xpEarned} XP`);
  }

  // Grant some achievements
  const achievements = [
    "first_habit",
    "five_habits",
    "first_completion",
    "streak_3",
    "first_bronze",
    "weeks_4", // This would normally require 4 weeks, but for demo purposes
  ];

  for (const code of achievements) {
    await prisma.achievement.upsert({
      where: {
        userId_code: {
          userId: user.id,
          code,
        },
      },
      update: {},
      create: {
        userId: user.id,
        code,
      },
    });
  }

  console.log(`Granted ${achievements.length} achievements`);

  // Create some XP logs
  await prisma.xPLog.createMany({
    data: [
      {
        userId: user.id,
        amount: 50,
        source: XPSource.ACHIEVEMENT,
        note: "First habit created",
      },
      {
        userId: user.id,
        amount: 100,
        source: XPSource.ACHIEVEMENT,
        note: "5 habits created",
      },
      {
        userId: user.id,
        amount: 50,
        source: XPSource.ACHIEVEMENT,
        note: "First bronze trophy",
      },
    ],
    skipDuplicates: true,
  });

  console.log("Created XP logs");

  // Create habit streaks
  for (const habit of createdHabits) {
    await prisma.habitStreak.upsert({
      where: {
        userId_habitId: {
          userId: user.id,
          habitId: habit.id,
        },
      },
      update: {},
      create: {
        userId: user.id,
        habitId: habit.id,
        currentStreak: Math.floor(Math.random() * 5),
        longestStreak: Math.floor(Math.random() * 7) + 1,
        lastCompleted: new Date(),
      },
    });
  }

  console.log("Created habit streaks");

  console.log("\n✅ Seed completed successfully!");
  console.log("\nDemo account credentials:");
  console.log("  Email: demo@keystone.app");
  console.log("  Password: demo123");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
