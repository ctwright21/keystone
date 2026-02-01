# Keystone Design System

> A masculine, techy, edgy design system for a gamified habit tracking application.

---

## Design Philosophy

**Core Principles:**
- **Precision** — Sharp edges, clean lines, purposeful layouts
- **Power** — Bold contrasts, electric accents, commanding presence
- **Progress** — Visual momentum, satisfying feedback, achievement celebration
- **Performance** — Fast, responsive, no-nonsense interface

**Aesthetic Keywords:** Industrial, cyberpunk-lite, command center, digital athlete, tactical

---

## Color System

### Dark Theme (Primary)

#### Base Colors
| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| `--bg-deepest` | `#0A0A0F` | `10, 10, 15` | App background, base layer |
| `--bg-deep` | `#12121A` | `18, 18, 26` | Card backgrounds, panels |
| `--bg-elevated` | `#1A1A24` | `26, 26, 36` | Elevated surfaces, modals |
| `--bg-surface` | `#22222E` | `34, 34, 46` | Input fields, interactive areas |
| `--bg-hover` | `#2A2A38` | `42, 42, 56` | Hover states |

#### Border Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `--border-subtle` | `#2A2A38` | Dividers, subtle separation |
| `--border-default` | `#3A3A48` | Card borders, input borders |
| `--border-strong` | `#4A4A58` | Emphasized borders |
| `--border-focus` | `var(--accent-primary)` | Focus rings |

#### Text Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `--text-primary` | `#F0F0F5` | Headlines, primary content |
| `--text-secondary` | `#A0A0B0` | Body text, descriptions |
| `--text-tertiary` | `#6A6A7A` | Captions, hints, disabled |
| `--text-inverse` | `#0A0A0F` | Text on light/accent backgrounds |

### Accent Colors

#### Primary Accent — Electric Cyan
| Token | Hex | Usage |
|-------|-----|-------|
| `--accent-primary` | `#00F0FF` | Primary actions, key metrics, focus |
| `--accent-primary-hover` | `#00D4E0` | Hover state |
| `--accent-primary-muted` | `#00F0FF1A` | Backgrounds (10% opacity) |
| `--accent-primary-glow` | `#00F0FF40` | Glow effects (25% opacity) |

#### Secondary Accent — Ultraviolet
| Token | Hex | Usage |
|-------|-----|-------|
| `--accent-secondary` | `#8B5CF6` | Secondary actions, categories |
| `--accent-secondary-hover` | `#7C4FE0` | Hover state |
| `--accent-secondary-muted` | `#8B5CF61A` | Backgrounds |

#### Tertiary Accent — Ember Orange
| Token | Hex | Usage |
|-------|-----|-------|
| `--accent-tertiary` | `#FF6B2C` | Streaks, fire elements, urgency |
| `--accent-tertiary-hover` | `#E55A20` | Hover state |
| `--accent-tertiary-muted` | `#FF6B2C1A` | Backgrounds |

### Semantic Colors

#### Status Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `--success` | `#10B981` | Completed, achieved, positive |
| `--success-muted` | `#10B9811A` | Success backgrounds |
| `--warning` | `#FBBF24` | Caution, at-risk streaks |
| `--warning-muted` | `#FBBF241A` | Warning backgrounds |
| `--error` | `#EF4444` | Failed, missed, broken streak |
| `--error-muted` | `#EF44441A` | Error backgrounds |

#### Score/Level Colors (Gradient Tiers)
| Tier | Color | Hex | Score Range |
|------|-------|-----|-------------|
| Bronze | Copper | `#CD7F32` | 0-25% |
| Silver | Steel | `#8A9BA8` | 26-50% |
| Gold | Gold | `#FFD700` | 51-75% |
| Platinum | Ice | `#E5E4E2` | 76-90% |
| Diamond | Cyan | `#00F0FF` | 91-100% |

### Gradients

```css
/* Primary Power Gradient — for major achievements, level ups */
--gradient-power: linear-gradient(135deg, #00F0FF 0%, #8B5CF6 100%);

/* Fire Streak Gradient — for active streaks */
--gradient-streak: linear-gradient(135deg, #FF6B2C 0%, #FBBF24 100%);

/* Achievement Shimmer — for unlocked badges */
--gradient-achievement: linear-gradient(135deg, #FFD700 0%, #FF6B2C 50%, #8B5CF6 100%);

/* Dark Depth Gradient — for backgrounds */
--gradient-depth: linear-gradient(180deg, #12121A 0%, #0A0A0F 100%);

/* Score Progress Gradient */
--gradient-progress: linear-gradient(90deg, #EF4444 0%, #FBBF24 33%, #10B981 66%, #00F0FF 100%);
```

---

## Typography

### Font Stack

```css
/* Primary — Interface text */
--font-primary: 'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;

/* Mono — Stats, numbers, scores, code-like elements */
--font-mono: 'JetBrains Mono', 'SF Mono', 'Fira Code', monospace;

/* Display — Large headlines, achievement names (optional) */
--font-display: 'Rajdhani', 'Orbitron', 'Inter', sans-serif;
```

### Type Scale

| Token | Size | Weight | Line Height | Letter Spacing | Usage |
|-------|------|--------|-------------|----------------|-------|
| `--text-display-xl` | 48px / 3rem | 700 | 1.1 | -0.02em | Hero scores, major achievements |
| `--text-display-lg` | 36px / 2.25rem | 700 | 1.15 | -0.02em | Weekly score, level display |
| `--text-display-md` | 28px / 1.75rem | 600 | 1.2 | -0.01em | Section headers |
| `--text-heading-lg` | 24px / 1.5rem | 600 | 1.25 | -0.01em | Card titles, page titles |
| `--text-heading-md` | 20px / 1.25rem | 600 | 1.3 | 0 | Subsection headers |
| `--text-heading-sm` | 16px / 1rem | 600 | 1.4 | 0.01em | Small headers, labels |
| `--text-body-lg` | 16px / 1rem | 400 | 1.5 | 0 | Primary body text |
| `--text-body-md` | 14px / 0.875rem | 400 | 1.5 | 0 | Secondary body text |
| `--text-body-sm` | 12px / 0.75rem | 400 | 1.4 | 0.01em | Captions, timestamps |
| `--text-label` | 11px / 0.6875rem | 600 | 1.3 | 0.05em | Labels, badges, tags (uppercase) |

### Number/Score Typography

```css
/* Large scores — weekly totals, main metrics */
.score-display-xl {
  font-family: var(--font-mono);
  font-size: 64px;
  font-weight: 700;
  letter-spacing: -0.03em;
  font-variant-numeric: tabular-nums;
}

/* Medium scores — daily scores, habit points */
.score-display-md {
  font-family: var(--font-mono);
  font-size: 32px;
  font-weight: 600;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
}

/* Stat numbers — streaks, counts */
.stat-number {
  font-family: var(--font-mono);
  font-size: 20px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}
```

---

## Spacing System

Based on 4px grid with preference for 8px increments.

| Token | Value | Usage |
|-------|-------|-------|
| `--space-1` | 4px | Minimal spacing, icon padding |
| `--space-2` | 8px | Tight spacing, inline elements |
| `--space-3` | 12px | Default element spacing |
| `--space-4` | 16px | Standard padding, gaps |
| `--space-5` | 20px | Card padding |
| `--space-6` | 24px | Section spacing |
| `--space-8` | 32px | Large section gaps |
| `--space-10` | 40px | Major section divisions |
| `--space-12` | 48px | Page-level spacing |
| `--space-16` | 64px | Hero/feature spacing |

---

## Border Radius

Sharp, angular feel with selective rounding.

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-none` | 0px | Hard edges, tactical elements |
| `--radius-sm` | 2px | Subtle rounding, inputs |
| `--radius-md` | 4px | Buttons, small cards |
| `--radius-lg` | 6px | Cards, modals |
| `--radius-xl` | 8px | Large cards, containers |
| `--radius-badge` | 4px | Badges, tags |
| `--radius-full` | 9999px | Pills, circular elements (use sparingly) |

**Design Note:** Avoid excessive rounding. This design favors sharp corners with subtle radius. Use `--radius-full` only for specific elements like avatar indicators or progress dots.

---

## Shadows & Glows

### Shadows (Subtle, atmospheric)

```css
/* Elevation shadows */
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.4);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.4), 0 1px 3px rgba(0, 0, 0, 0.3);
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.4), 0 4px 6px rgba(0, 0, 0, 0.3);
--shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.5), 0 8px 10px rgba(0, 0, 0, 0.4);

/* Inset shadow for depth */
--shadow-inset: inset 0 2px 4px rgba(0, 0, 0, 0.3);
```

### Glow Effects (Key differentiator)

```css
/* Primary glow — active elements, focus */
--glow-primary: 0 0 20px rgba(0, 240, 255, 0.3), 0 0 40px rgba(0, 240, 255, 0.1);
--glow-primary-intense: 0 0 20px rgba(0, 240, 255, 0.5), 0 0 60px rgba(0, 240, 255, 0.2);

/* Achievement glow — unlocked badges */
--glow-achievement: 0 0 20px rgba(255, 215, 0, 0.4), 0 0 40px rgba(255, 107, 44, 0.2);

/* Streak glow — active streaks */
--glow-streak: 0 0 15px rgba(255, 107, 44, 0.4), 0 0 30px rgba(251, 191, 36, 0.2);

/* Success glow */
--glow-success: 0 0 15px rgba(16, 185, 129, 0.4);

/* Error pulse */
--glow-error: 0 0 15px rgba(239, 68, 68, 0.4);
```

---

## Component Specifications

### Buttons

#### Primary Button
```css
.btn-primary {
  background: var(--accent-primary);
  color: var(--text-inverse);
  font-weight: 600;
  font-size: 14px;
  padding: 12px 24px;
  border-radius: var(--radius-md);
  border: none;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background: var(--accent-primary-hover);
  box-shadow: var(--glow-primary);
  transform: translateY(-1px);
}

.btn-primary:active {
  transform: translateY(0);
}
```

#### Secondary Button
```css
.btn-secondary {
  background: transparent;
  color: var(--text-primary);
  font-weight: 600;
  font-size: 14px;
  padding: 12px 24px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-default);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  border-color: var(--accent-primary);
  color: var(--accent-primary);
  background: var(--accent-primary-muted);
}
```

#### Ghost Button
```css
.btn-ghost {
  background: transparent;
  color: var(--text-secondary);
  font-weight: 500;
  font-size: 14px;
  padding: 12px 24px;
  border-radius: var(--radius-md);
  border: none;
  transition: all 0.2s ease;
}

.btn-ghost:hover {
  color: var(--text-primary);
  background: var(--bg-hover);
}
```

### Cards

#### Base Card
```css
.card {
  background: var(--bg-deep);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
  transition: all 0.2s ease;
}

.card:hover {
  border-color: var(--border-default);
  background: var(--bg-elevated);
}
```

#### Stat Card (for metrics)
```css
.card-stat {
  background: var(--bg-deep);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
  position: relative;
  overflow: hidden;
}

.card-stat::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--gradient-power);
}

.card-stat .stat-value {
  font-family: var(--font-mono);
  font-size: 32px;
  font-weight: 700;
  color: var(--text-primary);
}

.card-stat .stat-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
```

#### Achievement Card (locked)
```css
.card-achievement-locked {
  background: var(--bg-deep);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
  opacity: 0.6;
  filter: grayscale(0.8);
}
```

#### Achievement Card (unlocked)
```css
.card-achievement-unlocked {
  background: linear-gradient(135deg, var(--bg-elevated) 0%, var(--bg-deep) 100%);
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
  box-shadow: var(--glow-achievement);
  position: relative;
}

.card-achievement-unlocked::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--gradient-achievement);
}
```

### Inputs

#### Text Input
```css
.input {
  background: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-sm);
  padding: 12px 16px;
  font-size: 14px;
  color: var(--text-primary);
  transition: all 0.2s ease;
}

.input::placeholder {
  color: var(--text-tertiary);
}

.input:focus {
  outline: none;
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px var(--accent-primary-muted);
}
```

#### Checkbox / Toggle (Habit completion)
```css
.checkbox {
  width: 24px;
  height: 24px;
  background: var(--bg-surface);
  border: 2px solid var(--border-strong);
  border-radius: var(--radius-sm);
  transition: all 0.2s ease;
  cursor: pointer;
}

.checkbox:checked {
  background: var(--accent-primary);
  border-color: var(--accent-primary);
  box-shadow: var(--glow-primary);
}

.checkbox:checked::after {
  /* Checkmark icon */
  content: '✓';
  color: var(--text-inverse);
  font-weight: 700;
}
```

### Progress Indicators

#### Progress Bar
```css
.progress-bar {
  height: 8px;
  background: var(--bg-surface);
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: var(--gradient-power);
  border-radius: var(--radius-sm);
  transition: width 0.5s ease;
  box-shadow: var(--glow-primary);
}
```

#### Score Progress (Segmented)
```css
.progress-segmented {
  display: flex;
  gap: 4px;
}

.progress-segment {
  height: 8px;
  flex: 1;
  background: var(--bg-surface);
  border-radius: var(--radius-sm);
}

.progress-segment.filled {
  background: var(--accent-primary);
  box-shadow: var(--glow-primary);
}
```

#### Circular Progress (for daily score)
```css
.progress-circular {
  width: 120px;
  height: 120px;
  position: relative;
}

.progress-circular svg {
  transform: rotate(-90deg);
}

.progress-circular .track {
  stroke: var(--bg-surface);
  stroke-width: 8;
  fill: none;
}

.progress-circular .fill {
  stroke: var(--accent-primary);
  stroke-width: 8;
  fill: none;
  stroke-linecap: round;
  filter: drop-shadow(0 0 10px var(--accent-primary-glow));
  transition: stroke-dashoffset 0.5s ease;
}

.progress-circular .value {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: var(--font-mono);
  font-size: 28px;
  font-weight: 700;
}
```

---

## Gamification Elements

### Streak Display

```css
.streak-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--accent-tertiary-muted);
  border: 1px solid var(--accent-tertiary);
  border-radius: var(--radius-badge);
  padding: 6px 12px;
  box-shadow: var(--glow-streak);
}

.streak-badge .fire-icon {
  color: var(--accent-tertiary);
  animation: flicker 1s ease-in-out infinite;
}

.streak-badge .streak-count {
  font-family: var(--font-mono);
  font-weight: 700;
  font-size: 16px;
  color: var(--accent-tertiary);
}

@keyframes flicker {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}
```

### Badge Designs

#### Badge Container
```css
.badge {
  width: 64px;
  height: 64px;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

/* Tier variations */
.badge-bronze {
  background: linear-gradient(135deg, #CD7F32 0%, #8B4513 100%);
  border: 2px solid #CD7F32;
}

.badge-silver {
  background: linear-gradient(135deg, #C0C0C0 0%, #8A9BA8 100%);
  border: 2px solid #C0C0C0;
}

.badge-gold {
  background: linear-gradient(135deg, #FFD700 0%, #DAA520 100%);
  border: 2px solid #FFD700;
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.3);
}

.badge-platinum {
  background: linear-gradient(135deg, #E5E4E2 0%, #B4B4B4 100%);
  border: 2px solid #E5E4E2;
  box-shadow: 0 0 15px rgba(229, 228, 226, 0.3);
}

.badge-diamond {
  background: linear-gradient(135deg, #00F0FF 0%, #8B5CF6 100%);
  border: 2px solid #00F0FF;
  box-shadow: var(--glow-primary-intense);
}
```

### Level/XP Display

```css
.level-display {
  display: flex;
  align-items: center;
  gap: 16px;
}

.level-badge {
  width: 48px;
  height: 48px;
  background: var(--gradient-power);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-mono);
  font-size: 20px;
  font-weight: 700;
  color: var(--text-inverse);
  box-shadow: var(--glow-primary);
}

.xp-bar {
  flex: 1;
  height: 12px;
  background: var(--bg-surface);
  border-radius: var(--radius-sm);
  overflow: hidden;
  position: relative;
}

.xp-bar-fill {
  height: 100%;
  background: var(--gradient-power);
  border-radius: var(--radius-sm);
  transition: width 0.5s ease;
}

.xp-text {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 600;
  color: var(--text-primary);
}
```

### Weekly Score Heatmap

```css
.week-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
}

.day-cell {
  aspect-ratio: 1;
  background: var(--bg-surface);
  border-radius: var(--radius-sm);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.day-cell .day-label {
  font-size: 10px;
  font-weight: 600;
  color: var(--text-tertiary);
  text-transform: uppercase;
}

.day-cell .day-score {
  font-family: var(--font-mono);
  font-size: 18px;
  font-weight: 700;
}

/* Score-based coloring */
.day-cell[data-score="low"] { background: rgba(239, 68, 68, 0.2); }
.day-cell[data-score="medium"] { background: rgba(251, 191, 36, 0.2); }
.day-cell[data-score="high"] { background: rgba(16, 185, 129, 0.2); }
.day-cell[data-score="perfect"] { 
  background: rgba(0, 240, 255, 0.2);
  box-shadow: var(--glow-primary);
}
```

### Achievement Unlock Animation

```css
@keyframes achievement-unlock {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes shine {
  0% {
    background-position: -200% center;
  }
  100% {
    background-position: 200% center;
  }
}

.achievement-unlocked {
  animation: achievement-unlock 0.5s ease-out;
}

.achievement-unlocked::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.2) 50%,
    transparent 100%
  );
  background-size: 200% 100%;
  animation: shine 1.5s ease-in-out;
}
```

---

## Animations & Transitions

### Default Transitions
```css
--transition-fast: 150ms ease;
--transition-base: 200ms ease;
--transition-slow: 300ms ease;
--transition-bounce: 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
```

### Micro-interactions

```css
/* Button press */
.btn:active {
  transform: scale(0.98);
}

/* Habit completion pop */
@keyframes complete-pop {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

.habit-complete {
  animation: complete-pop 0.3s ease;
}

/* Score increment */
@keyframes score-bump {
  0% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
  100% { transform: translateY(0); }
}

.score-increment {
  animation: score-bump 0.2s ease;
}

/* Streak fire pulse */
@keyframes fire-pulse {
  0%, 100% { 
    transform: scale(1);
    filter: brightness(1);
  }
  50% { 
    transform: scale(1.1);
    filter: brightness(1.2);
  }
}

.streak-fire {
  animation: fire-pulse 2s ease-in-out infinite;
}
```

---

## Icons

### Style Guidelines
- Use **outlined** icons with 1.5-2px stroke weight
- 24x24px default size
- Sharp, geometric forms preferred
- Consistent corner radius (match --radius-sm)

### Recommended Icon Libraries
1. **Lucide Icons** — Clean, consistent, great for UI
2. **Phosphor Icons** — More variety, maintains sharpness
3. **Heroicons** — Good for general interface

### Key Icons Needed
| Function | Suggested Icon |
|----------|---------------|
| Complete habit | Check, CheckCircle |
| Streak | Flame, Fire |
| Achievement | Trophy, Medal, Star |
| Level up | ArrowUp, TrendingUp |
| Score | Target, Crosshair |
| Daily | Sun, Calendar |
| Weekly | CalendarDays, BarChart |
| Settings | Cog, Sliders |
| Profile | User, UserCircle |
| Add habit | Plus, PlusCircle |
| Edit | Pencil, Edit |
| Delete | Trash, X |
| Timer | Clock, Timer |
| Notification | Bell |

---

## Layout Grid

### Container Widths
```css
--container-sm: 640px;   /* Mobile-focused views */
--container-md: 768px;   /* Standard content */
--container-lg: 1024px;  /* Dashboard layouts */
--container-xl: 1280px;  /* Wide displays */
```

### Standard Grid
```css
.grid-layout {
  display: grid;
  gap: var(--space-4);
}

/* Dashboard grid */
.grid-dashboard {
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}

/* Habit list */
.grid-habits {
  grid-template-columns: 1fr;
  gap: var(--space-3);
}

/* Stats row */
.grid-stats {
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: var(--space-4);
}

/* Badge showcase */
.grid-badges {
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: var(--space-4);
}
```

---

## Component Library Summary

### Core Components
- [ ] Button (Primary, Secondary, Ghost, Icon)
- [ ] Card (Base, Stat, Achievement, Habit)
- [ ] Input (Text, Checkbox, Toggle, Select)
- [ ] Progress (Bar, Circular, Segmented)
- [ ] Badge (Tier variants, Streak)
- [ ] Modal / Dialog
- [ ] Toast / Notification
- [ ] Tooltip

### Gamification Components
- [ ] Score Display (Daily, Weekly, All-time)
- [ ] Streak Counter
- [ ] Level/XP Bar
- [ ] Achievement Card (Locked/Unlocked)
- [ ] Badge Showcase
- [ ] Weekly Heatmap
- [ ] Habit Row (with completion state)
- [ ] Leaderboard Row (if social features)

### Layout Components
- [ ] Page Container
- [ ] Navigation (Bottom tab / Sidebar)
- [ ] Header
- [ ] Section Divider
- [ ] Empty State

---

## Implementation Notes for Claude Code

### CSS Variables Setup

Create a `variables.css` or include in your global styles:

```css
:root {
  /* Copy all color tokens */
  --bg-deepest: #0A0A0F;
  --bg-deep: #12121A;
  /* ... etc */
  
  /* Copy all spacing tokens */
  --space-1: 4px;
  /* ... etc */
  
  /* Copy all other tokens */
}
```

### Tailwind Configuration (if using Tailwind)

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        bg: {
          deepest: '#0A0A0F',
          deep: '#12121A',
          elevated: '#1A1A24',
          surface: '#22222E',
          hover: '#2A2A38',
        },
        accent: {
          primary: '#00F0FF',
          secondary: '#8B5CF6',
          tertiary: '#FF6B2C',
        },
        // ... continue mapping
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        display: ['Rajdhani', 'sans-serif'],
      },
      borderRadius: {
        sm: '2px',
        md: '4px',
        lg: '6px',
        xl: '8px',
      },
      boxShadow: {
        'glow-primary': '0 0 20px rgba(0, 240, 255, 0.3), 0 0 40px rgba(0, 240, 255, 0.1)',
        'glow-achievement': '0 0 20px rgba(255, 215, 0, 0.4), 0 0 40px rgba(255, 107, 44, 0.2)',
        // ... continue mapping
      },
    },
  },
}
```

### React Component Structure Suggestion

```
/components
  /ui
    Button.tsx
    Card.tsx
    Input.tsx
    Progress.tsx
    Badge.tsx
  /gamification
    ScoreDisplay.tsx
    StreakCounter.tsx
    LevelBar.tsx
    AchievementCard.tsx
    BadgeShowcase.tsx
    WeeklyHeatmap.tsx
  /habits
    HabitRow.tsx
    HabitList.tsx
    HabitForm.tsx
  /layout
    PageContainer.tsx
    Navigation.tsx
    Header.tsx
```

---

## Quick Reference Card

| Element | Key Values |
|---------|------------|
| Background | `#0A0A0F` → `#12121A` → `#1A1A24` |
| Primary Accent | `#00F0FF` (Electric Cyan) |
| Streak Color | `#FF6B2C` (Ember Orange) |
| Achievement | Gold `#FFD700` + Orange gradient |
| Border Radius | 2-6px (sharp, minimal) |
| Primary Font | Inter |
| Score Font | JetBrains Mono |
| Key Animation | Glow effects on active elements |

---

*Design System v1.0 — Keystone*
