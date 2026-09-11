# DESIGN: WhatToShip UI/UX Specification (Google Gemini Reference)

> **Design Archetype**: Google Gemini AI Workspace & Clean Intelligence Canvas.  
> **Target Experience**: Fast, ambient, focused, and distraction-free. Combining Google Gemini's signature floating prompt capsule, aura glow accents, high-radius surfaces, and structured intelligence canvas with high-density data visualization.

---

## 1. Visual Language & Principles

### A. Core Design Philosophy
1. **Ambient & Lightweight**: Like Google Gemini, the UI stays out of the way. Content and data take center stage with ample whitespace and soft elevation.
2. **The "Gemini Sparkle" Identity**: Subtle radiant gradients (sapphire blue, electric cyan, amethyst purple, and warm coral) used sparingly on active states, primary badges, and key AI insights—never overwhelming the data.
3. **Floating High-Radius Surfaces**: Generous rounded corners (`rounded-2xl` for cards, `rounded-full` for search pills and tag badges) creating an approachable, ultra-modern SaaS feel.
4. **Instant Tactile Feedback**: Micro-interactions on hover, active states, and keyboard navigation that feel responsive (< 50ms transition).

---

## 2. Color Palette & Design Tokens (Dark & Light)

WhatToShip implements a Gemini-accurate dark theme by default, with an adaptive clean light mode.

### Dark Mode (Default — Google Gemini Dark)
- **Base Background (`canvas`)**: `#131314` (Deep charcoal, true to Gemini Web)
- **Surface Elevation 1 (`surface-1`)**: `#1e1f20` (Card surfaces and sidebar)
- **Surface Elevation 2 (`surface-2`)**: `#282a2c` (Dropdowns, modals, hover states)
- **Surface Elevation 3 (`surface-3`)**: `#333538` (Active pills, badge backgrounds)
- **Border Outline (`border-subtle`)**: `rgba(255, 255, 255, 0.08)`
- **Border Focus (`border-glow`)**: `rgba(66, 133, 244, 0.4)`
- **Text Primary (`text-primary`)**: `#e3e3e3` (High contrast, soft white)
- **Text Secondary (`text-secondary`)**: `#c4c7c5` (Google Gemini gray)
- **Text Muted (`text-muted`)**: `#8e918f`

### Light Mode (Adaptive — Google Gemini Light)
- **Base Background (`canvas`)**: `#f0f4f9` (Soft cool gray-blue)
- **Surface Elevation 1 (`surface-1`)**: `#ffffff` (Crisp white card)
- **Surface Elevation 2 (`surface-2`)**: `#e9eef6` (Soft elevation)
- **Border Outline (`border-subtle`)**: `rgba(0, 0, 0, 0.08)`
- **Text Primary (`text-primary`)**: `#1f1f1f`
- **Text Secondary (`text-secondary`)**: `#444746`

### The Gemini Aura Gradient (Accents)
- **Gemini Sparkle Gradient**: `linear-gradient(135deg, #1ba1e2 0%, #4285f4 35%, #9b72cb 70%, #d96570 100%)`
- **Glow Shadow**: `0 0 24px -4px rgba(66, 133, 244, 0.15)`
- **Difficulty Color Semantics**:
  - *Extremely Easy*: Emerald Green (`#34a853` / `bg-emerald-500/15 text-emerald-400 border-emerald-500/30`)
  - *Easy*: Cyan / Sky (`#00e5ff` / `bg-cyan-500/15 text-cyan-400 border-cyan-500/30`)
  - *Moderate*: Amber / Gold (`#fbbc04` / `bg-amber-500/15 text-amber-400 border-amber-500/30`)
  - *Hard*: Coral / Orange (`#fa7b17` / `bg-orange-500/15 text-orange-400 border-orange-500/30`)
  - *Extremely Hard*: Crimson Rose (`#ea4335` / `bg-rose-500/15 text-rose-400 border-rose-500/30`)

---

## 3. Typography & Sizing

- **Primary Font**: `Google Sans`, `Plus Jakarta Sans`, or `Inter` (`system-ui, -apple-system, sans-serif`).
- **Monospace Font (for metrics, volume, code)**: `JetBrains Mono` or `Fira Code` with `tabular-nums` enabled so numbers don't jump when sorting.
- **Hierarchy**:
  - `Hero Display`: 40px – 56px, font-weight 600, tight tracking (`tracking-tight`), with subtle Gemini gradient text accent.
  - `Section Header`: 22px – 28px, font-weight 600.
  - `Card Title`: 16px – 18px, font-weight 600, hover underline or glow.
  - `Body / Copy`: 14px – 15px, line-height 1.6, color `text-secondary`.
  - `Meta / Badge`: 11px – 12px, font-weight 500, uppercase tracking.

---

## 4. Screen Contracts & Component Hierarchy

```
┌──────────────────────────────────────────────────────────────────────────┐
│  Navbar: [ Logo ✦ WhatToShip ] [ Collections ] [ Trends ]  [ Theme ☼ ]  │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│                 What will you ship next?                                 │
│       Explore 13,445 software ideas, search volume, and build plans      │
│                                                                          │
│   ┌──────────────────────────────────────────────────────────────────┐   │
│   │ ✦  Search software ideas, calculators, or niche SaaS...    [ ⌘K ]│   │
│   └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│   [ ✦ Instant Wins ] [ 💰 High-Yield SaaS ] [ 🔥 Breakouts ] [ 🤖 AI ]   │
│                                                                          │
├───────────────────┬──────────────────────────────────────────────────────┤
│  FILTERS (Drawer) │  RESULTS (13,445 ideas)             Sort: Volume ▼   │
│                   │                                                      │
│  Type:            │  ┌────────────────────────────────────────────────┐  │
│  [x] All          │  │ English to Nepali Converter         Easy SEO   │  │
│  [ ] Online Tool  │  │ 500k/mo • +7% • Tech 2/5 • Revenue 2/5         │  │
│  [ ] SaaS         │  └────────────────────────────────────────────────┘  │
│                   │  ┌────────────────────────────────────────────────┐  │
│  Difficulty:      │  │ Accounts Payable Paperless Software   Ext Easy │  │
│  [x] Easy only    │  │ 585/mo • +612% • Tech 4/5 • Revenue 4/5        │  │
│                   │  └────────────────────────────────────────────────┘  │
└───────────────────┴──────────────────────────────────────────────────────┘
```

### Screen 1: The Gemini-Style Search Capsule (Homepage Hero)
- **Positioning**: Center-focused, uncluttered hero section.
- **Search Capsule**:
  - Pill shape (`rounded-full h-14 max-w-2xl mx-auto`).
  - Subtle frosted glass effect (`backdrop-blur-xl bg-surface-1/90 border border-white/10`).
  - Leading iconic Gemini Sparkle (`Sparkles` icon with gradient stroke).
  - Trailing shortcut badge (`kbd` `⌘K` or `/`).
  - On focus: smooth transition with Gemini aura border ring (`ring-2 ring-blue-500/50 shadow-glow`).
- **Interactive Suggestion Pills (Horizontally Scrollable Chips)**:
  - Floating beneath the search bar:
    - `✦ Instant Wins (<48h TTM)`
    - `✦ High-Yield Micro-SaaS`
    - `✦ Breakout Trends (>100%)`
    - `✦ AI-Native Generators`
    - `✦ Financial Calculators`
  - Clicking any pill instantly applies pre-configured multi-dimensional filters.

### Screen 2: The Idea Card (Gemini Surface Elevation)
- **Card Container**: `rounded-2xl bg-surface-1 border border-white/5 hover:border-white/15 p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg`.
- **Top Row**:
  - Keyword title with clean typography.
  - Category pill and Difficulty Chip (colored according to semantics).
- **Middle Row (Metrics Bar)**:
  - Search Volume in bold tabular numbers (e.g. `258.5k/mo`).
  - Trend pill with arrow indicator (e.g. `+612%` in emerald or `-12%` in gray).
  - Tech complexity dots (`●●○○○` 2/5) and Revenue rating badge (`$ $ $ ○ ○`).
- **Action Footbar**:
  - "Inspect Blueprint" button with hover arrow (`→`).
  - Quick bookmark star icon.

### Screen 3: Gemini Canvas Intelligence Dossier (`/ideas/[slug]`)
Designed like **Google Gemini's Canvas / Chat response window**:
- **Header**:
  - Full keyword title with breadcrumb: `Home > Calculators > Bottleneck Calculator`.
  - Floating Quick Action Bar: `[ ✦ Copy AI Prompt ]`, `[ Export PDF ]`, `[ Share ]`, `[ Bookmark ]`.
- **Left Panel (Overview & Radar Scorecard)**:
  - 8-axis Radar Chart / Gauge Cards:
    1. Technical Complexity (1-5)
    2. AI-Friendliness (1-5)
    3. Time-to-Market (1-5)
    4. Maintenance Overhead (1-5)
    5. Revenue Potential (1-5)
    6. Market Competition (1-5)
    7. Integrations Required (1-5)
    8. Compliance Risk (1-5)
  - Key business vitals: Monthly Volume, Trend growth rate, Target search intent.
- **Right Panel (The Deep Breakdown Canvas)**:
  - **Tabbed or Linear Structured Cards**:
    1. `Market Viability`: Deep breakdown of searcher profile, buyer intent, and demand stability.
    2. `Technical Architecture`: Recommended frontend/backend, client vs server boundaries, and APIs.
    3. `Monetization Blueprint`: Pricing tiers ($29, $79, $199), revenue models, and affiliate angles.
    4. `Programmatic SEO Playbook`: Primary keywords, long-tail clusters, and JSON-LD schema.
    5. `Execution Roadmap`: 48-hour prototype checklist vs 2-week launch checklist.
    6. `AI Prompt Starter`: Dedicated dark-mode code container with 1-click copy button, pre-configured prompt ready to paste into Claude, Gemini, or Codex to start coding immediately.
    7. `Competitive Wedge`: Incumbent weaknesses on Google SERP and unfair advantage opportunities.

---

## 5. Micro-Interactions & Animation Guidelines

- **Restrained Motion**: No gratuitous animations. Use standard 150ms – 200ms ease-out transitions on hover, modal open, and drawer toggle.
- **Skeleton Shimmer**: When queries execute, show Gemini-style soft pulsating skeleton pills rather than harsh spinners.
- **Clipboard Feedback**: When clicking "Copy AI Prompt", the button transforms into a green checkmark (`Check` icon) with text "Copied to clipboard!" for 2.5 seconds.
- **Keyboard Navigation**:
  - Pressing `/` or `Cmd+K` anywhere focuses the search capsule.
  - Pressing `Esc` clears search or closes modal/drawer.
  - Arrow keys `Up` / `Down` navigate search results.

---

## 6. Accessibility & Responsive Standards

- **Contrast Ratios**: All text meets WCAG 2.1 AA standard (4.5:1 for body text, 3:1 for large headers).
- **Responsive Breakpoints**:
  - `< 640px (Mobile)`: Single column, bottom drawer for filters, sticky floating search button.
  - `640px - 1024px (Tablet)`: 2-column card grid, collapsible filter bar.
  - `> 1024px (Desktop)`: 3-column card grid or split-screen canvas mode.
- **Semantic HTML**: Proper `main`, `nav`, `aside`, `article`, `header`, `footer` tags; screen-reader accessible ARIA labels on all icon-only buttons.
