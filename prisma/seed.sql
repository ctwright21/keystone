-- Keystone Database Seed Script
-- Run this SQL to populate the database with sample data
-- Note: This uses the same password hash as the seed.ts file

-- ============================================================================
-- SUPER ADMIN USER
-- Email: admin@keystone.app
-- Password: admin123
-- ============================================================================

INSERT INTO users (id, email, name, password, role, timezone, "createdAt", "updatedAt")
VALUES (
  'seed-user-admin',
  'admin@keystone.app',
  'Super Admin',
  '$2b$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- admin123
  'SUPER_ADMIN',
  'America/New_York',
  NOW(),
  NOW()
)
ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name, role = EXCLUDED.role;

-- Admin stats
INSERT INTO user_stats (id, "userId", "totalXp", level, rank, "currentStreak", "longestStreak", "totalCompletions", "totalHabitsCreated", "weeksCompleted", "perfectWeeks", "createdAt", "updatedAt")
VALUES (
  'seed-stats-admin',
  'seed-user-admin',
  0,
  1,
  'BRONZE',
  0,
  0,
  0,
  0,
  0,
  0,
  NOW(),
  NOW()
)
ON CONFLICT ("userId") DO NOTHING;

-- ============================================================================
-- DEMO USER
-- Email: demo@keystone.app
-- Password: demo123
-- ============================================================================

INSERT INTO users (id, email, name, password, role, timezone, "createdAt", "updatedAt")
VALUES (
  'seed-user-demo',
  'demo@keystone.app',
  'Demo User',
  '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4EdTZqHLqOpU2KGu', -- demo123
  'USER',
  'America/New_York',
  NOW(),
  NOW()
)
ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name;

-- ============================================================================
-- USER STATS
-- ============================================================================

INSERT INTO user_stats (id, "userId", "totalXp", level, rank, "currentStreak", "longestStreak", "totalCompletions", "totalHabitsCreated", "weeksCompleted", "perfectWeeks", "createdAt", "updatedAt")
VALUES (
  'seed-stats-demo',
  'seed-user-demo',
  850,
  5,
  'BRONZE',
  3,
  7,
  45,
  5,
  3,
  0,
  NOW(),
  NOW()
)
ON CONFLICT ("userId") DO UPDATE SET
  "totalXp" = EXCLUDED."totalXp",
  level = EXCLUDED.level;

-- ============================================================================
-- HABITS
-- ============================================================================

INSERT INTO habits (id, "userId", name, description, type, status, color, icon, "sortOrder", "xpValue", "createdAt", "updatedAt")
VALUES
  ('seed-habit-0', 'seed-user-demo', 'Morning Exercise', '30 minutes of exercise to start the day', 'POSITIVE', 'ACTIVE', '#10B981', 'dumbbell', 0, 15, NOW(), NOW()),
  ('seed-habit-1', 'seed-user-demo', 'Read for 20 minutes', 'Read a book or educational content', 'POSITIVE', 'ACTIVE', '#8B5CF6', 'book', 1, 10, NOW(), NOW()),
  ('seed-habit-2', 'seed-user-demo', 'Drink 8 glasses of water', 'Stay hydrated throughout the day', 'POSITIVE', 'ACTIVE', '#00F0FF', 'droplets', 2, 10, NOW(), NOW()),
  ('seed-habit-3', 'seed-user-demo', 'No social media before noon', 'Avoid distractions in the morning', 'NEGATIVE', 'ACTIVE', '#EF4444', 'ban', 3, 10, NOW(), NOW()),
  ('seed-habit-4', 'seed-user-demo', 'Meditate', '10 minutes of mindfulness', 'POSITIVE', 'ACTIVE', '#FBBF24', 'brain', 4, 10, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  color = EXCLUDED.color,
  icon = EXCLUDED.icon;

-- ============================================================================
-- WEEKS (Current week and 2 past weeks)
-- Note: Dates are calculated relative to current date
-- ============================================================================

-- Current week (starts on Sunday)
INSERT INTO weeks (id, "userId", "startDate", "endDate", "createdAt", "updatedAt")
VALUES (
  'seed-week-0',
  'seed-user-demo',
  date_trunc('week', CURRENT_DATE + INTERVAL '1 day') - INTERVAL '1 day',
  date_trunc('week', CURRENT_DATE + INTERVAL '1 day') + INTERVAL '5 days 23 hours 59 minutes 59 seconds',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  "startDate" = EXCLUDED."startDate",
  "endDate" = EXCLUDED."endDate";

-- Last week
INSERT INTO weeks (id, "userId", "startDate", "endDate", "createdAt", "updatedAt")
VALUES (
  'seed-week-1',
  'seed-user-demo',
  date_trunc('week', CURRENT_DATE + INTERVAL '1 day') - INTERVAL '8 days',
  date_trunc('week', CURRENT_DATE + INTERVAL '1 day') - INTERVAL '1 day 1 second',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  "startDate" = EXCLUDED."startDate",
  "endDate" = EXCLUDED."endDate";

-- 2 weeks ago
INSERT INTO weeks (id, "userId", "startDate", "endDate", "createdAt", "updatedAt")
VALUES (
  'seed-week-2',
  'seed-user-demo',
  date_trunc('week', CURRENT_DATE + INTERVAL '1 day') - INTERVAL '15 days',
  date_trunc('week', CURRENT_DATE + INTERVAL '1 day') - INTERVAL '8 days 1 second',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  "startDate" = EXCLUDED."startDate",
  "endDate" = EXCLUDED."endDate";

-- ============================================================================
-- WEEK HABIT SNAPSHOTS
-- ============================================================================

-- Snapshots for current week
INSERT INTO week_habit_snapshots (id, "weekId", "habitId", name, description, type, color, icon, "sortOrder", "xpValue", "createdAt")
SELECT
  'seed-snapshot-0-' || h.id,
  'seed-week-0',
  h.id,
  h.name,
  h.description,
  h.type,
  h.color,
  h.icon,
  h."sortOrder",
  h."xpValue",
  NOW()
FROM habits h
WHERE h."userId" = 'seed-user-demo'
ON CONFLICT ("weekId", "habitId") DO NOTHING;

-- Snapshots for last week
INSERT INTO week_habit_snapshots (id, "weekId", "habitId", name, description, type, color, icon, "sortOrder", "xpValue", "createdAt")
SELECT
  'seed-snapshot-1-' || h.id,
  'seed-week-1',
  h.id,
  h.name,
  h.description,
  h.type,
  h.color,
  h.icon,
  h."sortOrder",
  h."xpValue",
  NOW()
FROM habits h
WHERE h."userId" = 'seed-user-demo'
ON CONFLICT ("weekId", "habitId") DO NOTHING;

-- Snapshots for 2 weeks ago
INSERT INTO week_habit_snapshots (id, "weekId", "habitId", name, description, type, color, icon, "sortOrder", "xpValue", "createdAt")
SELECT
  'seed-snapshot-2-' || h.id,
  'seed-week-2',
  h.id,
  h.name,
  h.description,
  h.type,
  h.color,
  h.icon,
  h."sortOrder",
  h."xpValue",
  NOW()
FROM habits h
WHERE h."userId" = 'seed-user-demo'
ON CONFLICT ("weekId", "habitId") DO NOTHING;

-- ============================================================================
-- HABIT COMPLETIONS
-- Creates a realistic pattern of completions
-- ============================================================================

-- Week 2 (2 weeks ago) - ~80% completion rate
INSERT INTO habit_completions (id, "weekId", "habitId", "dayIndex", completed, "xpEarned", "createdAt", "updatedAt")
SELECT
  'seed-completion-2-' || h.id || '-' || d.day_index,
  'seed-week-2',
  h.id,
  d.day_index,
  true,
  h."xpValue",
  NOW(),
  NOW()
FROM habits h
CROSS JOIN (SELECT generate_series(0, 6) AS day_index) d
WHERE h."userId" = 'seed-user-demo'
  AND random() < 0.80
ON CONFLICT ("weekId", "habitId", "dayIndex") DO NOTHING;

-- Week 1 (last week) - ~75% completion rate
INSERT INTO habit_completions (id, "weekId", "habitId", "dayIndex", completed, "xpEarned", "createdAt", "updatedAt")
SELECT
  'seed-completion-1-' || h.id || '-' || d.day_index,
  'seed-week-1',
  h.id,
  d.day_index,
  true,
  h."xpValue",
  NOW(),
  NOW()
FROM habits h
CROSS JOIN (SELECT generate_series(0, 6) AS day_index) d
WHERE h."userId" = 'seed-user-demo'
  AND random() < 0.75
ON CONFLICT ("weekId", "habitId", "dayIndex") DO NOTHING;

-- Current week - ~60% completion rate, only up to today
INSERT INTO habit_completions (id, "weekId", "habitId", "dayIndex", completed, "xpEarned", "createdAt", "updatedAt")
SELECT
  'seed-completion-0-' || h.id || '-' || d.day_index,
  'seed-week-0',
  h.id,
  d.day_index,
  true,
  h."xpValue",
  NOW(),
  NOW()
FROM habits h
CROSS JOIN (SELECT generate_series(0, EXTRACT(DOW FROM CURRENT_DATE)::int) AS day_index) d
WHERE h."userId" = 'seed-user-demo'
  AND random() < 0.60
ON CONFLICT ("weekId", "habitId", "dayIndex") DO NOTHING;

-- ============================================================================
-- WEEK SCORES
-- ============================================================================

-- Calculate and insert week scores
INSERT INTO week_scores (id, "weekId", "totalCompletions", "possibleCompletions", percentage, "xpEarned", "bonusXp", "createdAt", "updatedAt")
SELECT
  'seed-score-' || w.id,
  w.id,
  COALESCE(c.total_completions, 0),
  35, -- 5 habits * 7 days
  COALESCE((c.total_completions::float / 35) * 100, 0),
  COALESCE(c.total_xp, 0),
  0,
  NOW(),
  NOW()
FROM weeks w
LEFT JOIN (
  SELECT
    "weekId",
    COUNT(*) as total_completions,
    SUM("xpEarned") as total_xp
  FROM habit_completions
  GROUP BY "weekId"
) c ON c."weekId" = w.id
WHERE w."userId" = 'seed-user-demo'
ON CONFLICT ("weekId") DO UPDATE SET
  "totalCompletions" = EXCLUDED."totalCompletions",
  percentage = EXCLUDED.percentage,
  "xpEarned" = EXCLUDED."xpEarned";

-- ============================================================================
-- ACHIEVEMENTS
-- ============================================================================

INSERT INTO achievements (id, "userId", code, "unlockedAt")
VALUES
  ('seed-achievement-1', 'seed-user-demo', 'first_habit', NOW() - INTERVAL '14 days'),
  ('seed-achievement-2', 'seed-user-demo', 'five_habits', NOW() - INTERVAL '13 days'),
  ('seed-achievement-3', 'seed-user-demo', 'first_completion', NOW() - INTERVAL '14 days'),
  ('seed-achievement-4', 'seed-user-demo', 'streak_3', NOW() - INTERVAL '11 days'),
  ('seed-achievement-5', 'seed-user-demo', 'first_bronze', NOW() - INTERVAL '7 days'),
  ('seed-achievement-6', 'seed-user-demo', 'first_silver', NOW() - INTERVAL '7 days')
ON CONFLICT ("userId", code) DO NOTHING;

-- ============================================================================
-- HABIT STREAKS
-- ============================================================================

INSERT INTO habit_streaks (id, "userId", "habitId", "currentStreak", "longestStreak", "lastCompleted", "createdAt", "updatedAt")
SELECT
  'seed-streak-' || h.id,
  'seed-user-demo',
  h.id,
  FLOOR(random() * 5)::int,
  FLOOR(random() * 7 + 1)::int,
  NOW(),
  NOW(),
  NOW()
FROM habits h
WHERE h."userId" = 'seed-user-demo'
ON CONFLICT ("userId", "habitId") DO UPDATE SET
  "currentStreak" = EXCLUDED."currentStreak",
  "longestStreak" = EXCLUDED."longestStreak";

-- ============================================================================
-- XP LOGS
-- ============================================================================

INSERT INTO xp_logs (id, "userId", amount, source, "sourceId", note, "createdAt")
VALUES
  ('seed-xp-1', 'seed-user-demo', 50, 'ACHIEVEMENT', 'first_habit', 'First habit created', NOW() - INTERVAL '14 days'),
  ('seed-xp-2', 'seed-user-demo', 100, 'ACHIEVEMENT', 'five_habits', '5 habits created', NOW() - INTERVAL '13 days'),
  ('seed-xp-3', 'seed-user-demo', 50, 'ACHIEVEMENT', 'first_bronze', 'First bronze trophy', NOW() - INTERVAL '7 days'),
  ('seed-xp-4', 'seed-user-demo', 100, 'ACHIEVEMENT', 'first_silver', 'First silver trophy', NOW() - INTERVAL '7 days')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- VERIFICATION QUERY
-- Run this to verify the seed worked
-- ============================================================================

SELECT
  'Users' as entity, COUNT(*) as count FROM users WHERE id LIKE 'seed-%'
UNION ALL
SELECT 'Habits', COUNT(*) FROM habits WHERE id LIKE 'seed-%'
UNION ALL
SELECT 'Weeks', COUNT(*) FROM weeks WHERE id LIKE 'seed-%'
UNION ALL
SELECT 'Completions', COUNT(*) FROM habit_completions WHERE id LIKE 'seed-%'
UNION ALL
SELECT 'Achievements', COUNT(*) FROM achievements WHERE id LIKE 'seed-%';
