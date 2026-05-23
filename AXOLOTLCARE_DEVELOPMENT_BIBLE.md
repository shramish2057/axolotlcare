# AxolotlCare — Complete Development Bible
**Version 1.0 · May 2026 · axolotlcare.app**

> This document is the single source of truth for building AxolotlCare from zero to live App Store product. Every decision, every line of schema, every screen, every API call — documented in the order you build it. Read it end to end before writing a single line of code.

---

## Table of Contents

1. [Product Vision & Strategy](#1-product-vision--strategy)
2. [Technical Architecture](#2-technical-architecture)
3. [Project Setup](#3-project-setup)
4. [Supabase Schema](#4-supabase-schema)
5. [Authentication](#5-authentication)
6. [Phase 1 — MVP Build](#6-phase-1--mvp-build)
7. [Phase 2 — Community](#7-phase-2--community)
8. [Phase 3 — Knowledge Base](#8-phase-3--knowledge-base)
9. [Phase 4 — Scale & Multi-Species](#9-phase-4--scale--multi-species)
10. [UI Design System](#10-ui-design-system)
11. [AI Integration](#11-ai-integration)
12. [Monetisation & RevenueCat](#12-monetisation--revenuecat)
13. [Push Notifications](#13-push-notifications)
14. [App Store Submission](#14-app-store-submission)
15. [GTM & Launch Strategy](#15-gtm--launch-strategy)
16. [Revenue Projections](#16-revenue-projections)

---

## 1. Product Vision & Strategy

### 1.1 One-Sentence Vision

AxolotlCare is the AI companion every axolotl owner needs — and the community they will never want to leave.

### 1.2 The Problem

Axolotls are among the most demanding freshwater pets to keep alive. They require:

- Water temperature strictly between 60–68°F (15–20°C) — too warm and they die
- Ammonia and nitrite at exactly 0 ppm — any spike is lethal within hours
- A fully cycled nitrogen cycle before introducing the animal — most beginners skip this
- pH between 6.5–8.0, GH 7–14 dGH, KH 3–8 dKH — parameters most owners have never heard of

**The gap:** 1M+ axolotls are kept as pets globally. Their owners live on Reddit (r/axolotls, 780K members), Facebook groups (160K+), and forum threads asking the same water chemistry questions every single day. The only existing "axolotl app" in the App Store is `Axolotl Expert` by a niche-farming developer who copy-pastes the same template across reef, discus, shrimp, and axolotl — it has fewer than 5 ratings and charges $6.99/week (a dark pattern that destroys retention). Every other "axolotl app" is a virtual pet simulation game.

**The opportunity:** Reefability built the exact same product for saltwater reef tanks. It hit 83,000 subscribers, 91,000 downloads, and charges $15–25/month. Axolotl keeping is the same hobbyist psychology — anxious, emotionally attached, willing to pay for something that protects an animal they love.

### 1.3 The Three Pillars

| Pillar | What it does | Business purpose |
|--------|-------------|-----------------|
| **AI Health Engine** | Water parameter logging, photo diagnosis, SOS triage, trend analysis | Drives subscription revenue |
| **Expert Knowledge Base** | Deep species-specific guides, disease encyclopedia, breeding guide | Drives organic discovery & SEO |
| **Community & Recognition** | Axolotl of the Week, photo gallery, achievement badges, birthday tracker | Drives retention & word of mouth |

No competitor has all three. Axolotl Expert has a thin version of the first pillar. Nobody has the second or third.

### 1.4 Competitive Landscape

| Competitor | Niche | Rating count | Model | Fatal flaw |
|-----------|-------|-------------|-------|-----------|
| Axolotl Expert | Axolotl | <5 ratings | $6.99/week | Template clone, no community, dark pricing |
| Reefability | Saltwater reef | 83K subs | $15–25/mo | Does NOT cover freshwater — **your analog, not your competitor** |
| KoiAI / KoiQuanta | Koi | Low hundreds | $10–20/mo | Koi only, no axolotl |
| AquaticLog | All aquariums | 13 years old | Freemium | Generic, no AI, no community |
| TankSync | All aquariums | <10 ratings | Freemium | Brand new, generic |

**The gap is real and verified.**

### 1.5 Business Model

```
Free tier  → No ads, no nags, genuinely useful
             • Parameter logging (5/month)
             • Nitrogen cycle wizard (unlimited)
             • Heat alerts (unlimited)
             • Care reminders
             • Full community access
             • All guides
             • 2 axolotl profiles

Pro tier   → €6.99/month or €39.99/year
             • Unlimited parameter logging
             • Photo health diagnosis (Claude Vision)
             • SOS emergency mode + AI triage
             • AI trend analysis & anomaly detection
             • AI care chat (context-aware)
             • Treatment calculator
             • Up to 10 axolotl profiles
             • Vet-ready PDF health reports
             • Data export (CSV + PDF)
```

**Revenue logic:** At 2,000 Pro subscribers × €6.99/month = **€167,760 ARR**. At 5,000 (Reefability-comparable penetration of addressable community) = **€419,400 ARR**. Margins are 85%+ because your only variable cost is Claude API calls (~$0.01–0.05 per diagnosis).

### 1.6 Domain & Brand

- **App domain:** `axolotlcare.app` — register on Cloudflare Registrar (~€14/year)
- **App name:** AxolotlCare
- **App Store display name:** AxolotlCare — AI Tank Companion
- **Tagline:** Your axolotl's health, in your hands
- **Color identity:** Deep teal + gill pink (see Section 10)
- **Typography:** DM Serif Display (headings) + Plus Jakarta Sans (UI)

---

## 2. Technical Architecture

### 2.1 Tech Stack Decision

| Layer | Choice | Reason |
|-------|--------|--------|
| Mobile framework | **React Native + Expo SDK 52** | Single codebase for iOS + Android. Expo managed workflow removes native config complexity. Expo Router for file-based navigation. |
| Backend | **Supabase** | Postgres database + Auth + Storage + Realtime + Edge Functions in one. Free tier generous for MVP. Auto-generated TypeScript types. |
| State management | **Zustand** | Lightweight, no boilerplate, works perfectly with React Native. |
| AI features | **Anthropic Claude API** | Claude claude-sonnet-4-20250514 for chat and diagnosis. Claude Vision for photo analysis. |
| Subscriptions | **RevenueCat** | Handles App Store + Play Store billing, webhooks, entitlements. The correct way to manage mobile subscriptions. |
| Push notifications | **OneSignal** | Cross-platform push. Free tier covers thousands of users. Integrates with Supabase via Edge Functions. |
| Weather API | **OpenWeatherMap** | Heat alert feature. Free tier: 1000 calls/day. |
| Photography | **Pexels API** | Guide cover images. Free for commercial use with attribution. |
| Error tracking | **Sentry** | Free tier, React Native SDK, catches crashes before users report them. |
| Analytics | **PostHog** | Open source product analytics. Self-hostable. Understand conversion funnels. |

### 2.2 Architecture Diagram

```
┌─────────────────────────────────────────────────┐
│                  React Native App                │
│  (Expo Router · Zustand · Reanimated · Lottie)  │
└────────────────────┬────────────────────────────┘
                     │
         ┌───────────┼───────────┐
         │           │           │
    ┌────▼────┐ ┌────▼────┐ ┌───▼──────┐
    │Supabase │ │ Claude  │ │RevenueCat│
    │  Auth   │ │   API   │ │   SDK    │
    │Database │ │(AI+Vis) │ │(Billing) │
    │ Storage │ └─────────┘ └──────────┘
    │Realtime │
    │  Edge   │◄──── OneSignal (Push)
    │Functions│◄──── OpenWeatherMap (Heat Alert)
    └─────────┘◄──── Pexels API (Photography)
```

### 2.3 Complete Dependency List

```json
{
  "dependencies": {
    "expo": "~52.0.0",
    "expo-router": "~4.0.0",
    "react": "18.3.1",
    "react-native": "0.76.0",

    "@supabase/supabase-js": "^2.46.0",
    "react-native-url-polyfill": "^2.0.0",

    "react-native-reanimated": "~3.16.0",
    "lottie-react-native": "^7.0.0",
    "@shopify/flash-list": "^1.7.1",

    "react-native-purchases": "^8.0.0",

    "@anthropic-ai/sdk": "^0.32.0",

    "zustand": "^5.0.0",
    "immer": "^10.1.1",

    "expo-notifications": "~0.29.0",
    "expo-image-picker": "~16.0.0",
    "expo-location": "~18.0.0",
    "expo-secure-store": "~14.0.0",
    "expo-image": "~2.0.0",
    "expo-haptics": "~14.0.0",
    "expo-camera": "~16.0.0",

    "@react-native-async-storage/async-storage": "^2.1.0",
    "react-native-safe-area-context": "^4.14.0",
    "react-native-screens": "~4.3.0",

    "@sentry/react-native": "~6.3.0"
  },
  "devDependencies": {
    "typescript": "~5.3.0",
    "@types/react": "~18.3.0",
    "supabase": "^1.207.0"
  }
}
```

---

## 3. Project Setup

### 3.1 Initialise the Project

```bash
# Create the project
npx create-expo-app@latest axolotlcare --template expo-template-blank-typescript
cd axolotlcare

# Install Expo Router
npx expo install expo-router react-native-safe-area-context react-native-screens

# Install all dependencies
npx expo install \
  @supabase/supabase-js \
  react-native-url-polyfill \
  react-native-reanimated \
  lottie-react-native \
  @shopify/flash-list \
  react-native-purchases \
  @anthropic-ai/sdk \
  zustand \
  immer \
  expo-notifications \
  expo-image-picker \
  expo-location \
  expo-secure-store \
  expo-image \
  expo-haptics \
  expo-camera \
  @react-native-async-storage/async-storage \
  @sentry/react-native
```

### 3.2 Complete Folder Structure

```
axolotlcare/
├── app/                          # Expo Router pages
│   ├── _layout.tsx               # Root layout (auth check, providers)
│   ├── +not-found.tsx
│   ├── (auth)/
│   │   ├── _layout.tsx
│   │   ├── sign-in.tsx
│   │   ├── sign-up.tsx
│   │   └── forgot-password.tsx
│   ├── (tabs)/
│   │   ├── _layout.tsx           # Bottom tab navigator
│   │   ├── index.tsx             # Home dashboard
│   │   ├── tank.tsx              # Parameter logger + AI
│   │   ├── community.tsx         # Feed, gallery, AOTW
│   │   ├── guides.tsx            # Knowledge base
│   │   └── profile.tsx           # User profile + achievements
│   ├── onboarding/
│   │   ├── _layout.tsx
│   │   ├── welcome.tsx           # Step 1: Welcome + axolotl name
│   │   ├── morph.tsx             # Step 2: Morph picker
│   │   ├── tank-setup.tsx        # Step 3: Tank details
│   │   ├── first-params.tsx      # Step 4: First parameter log
│   │   └── community-intro.tsx   # Step 5: AOTW + community intro
│   ├── sos.tsx                   # SOS emergency (modal, full screen)
│   ├── axolotl/
│   │   ├── [id].tsx              # Individual axolotl profile
│   │   └── new.tsx               # Add new axolotl
│   ├── diagnosis/
│   │   ├── photo.tsx             # Photo upload + AI diagnosis
│   │   └── result.tsx            # Diagnosis result screen
│   └── community/
│       ├── post/[id].tsx         # Single community post
│       └── aotw.tsx              # AOTW detail screen
│
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Badge.tsx
│   │   ├── Separator.tsx
│   │   ├── Typography.tsx        # Heading, Body, Caption components
│   │   ├── ParameterPill.tsx     # pH/NH3/temp display chip
│   │   ├── SafeAreaView.tsx
│   │   └── LoadingSpinner.tsx
│   ├── tank/
│   │   ├── ParameterLogger.tsx   # The core logging form
│   │   ├── ParameterHistory.tsx  # Chart of logged values
│   │   ├── TankCard.tsx          # Home screen tank summary card
│   │   ├── NitrogenWizard.tsx    # Step-by-step cycle wizard
│   │   ├── HeatAlert.tsx         # Heat warning component
│   │   └── TreatmentCalc.tsx     # Dosage calculator
│   ├── health/
│   │   ├── PhotoDiagnosis.tsx    # Camera + upload flow
│   │   ├── DiagnosisResult.tsx   # AI diagnosis display
│   │   ├── SOSSymptomPicker.tsx  # Symptom selection grid
│   │   └── AIChat.tsx            # Context-aware chat interface
│   ├── community/
│   │   ├── AOTWCard.tsx          # Axolotl of the Week featured card
│   │   ├── PhotoGrid.tsx         # Masonry photo gallery
│   │   ├── CommunityPost.tsx     # Single post card
│   │   ├── NominateButton.tsx    # AOTW nomination CTA
│   │   └── WaterReport.tsx       # Weekly community stats
│   ├── profile/
│   │   ├── AchievementBadge.tsx  # Individual achievement display
│   │   ├── AchievementGrid.tsx   # Profile achievements section
│   │   ├── AxolotlCard.tsx       # Mini axolotl profile card
│   │   └── KeeperStats.tsx       # Days keeping, logs count etc.
│   └── animations/
│       ├── SwimAnimation.tsx     # Lottie axolotl swim
│       ├── BubbleAnimation.tsx   # Lottie bubbles
│       ├── WaterFill.tsx         # Lottie safe parameter fill
│       └── SparkleAnimation.tsx  # Lottie AOTW celebration
│
├── lib/
│   ├── supabase.ts               # Supabase client + typed helpers
│   ├── ai.ts                     # Claude API wrapper functions
│   ├── weather.ts                # OpenWeatherMap heat alert logic
│   ├── pexels.ts                 # Pexels API for guide photography
│   ├── revenuecat.ts             # RevenueCat subscription helpers
│   ├── notifications.ts          # OneSignal + Expo notifications
│   ├── parameters.ts             # Parameter safe range logic & scoring
│   └── achievements.ts           # Achievement unlock logic
│
├── store/
│   ├── useAuthStore.ts           # Auth state (user, session)
│   ├── useAxolotlStore.ts        # Axolotl profiles + current selection
│   ├── useParameterStore.ts      # Parameter log cache
│   ├── useCommunityStore.ts      # Feed, AOTW, posts
│   └── useSubscriptionStore.ts   # RevenueCat entitlement state
│
├── types/
│   ├── database.types.ts         # Auto-generated from Supabase
│   ├── axolotl.ts                # App-level types
│   └── api.ts                    # API response types
│
├── constants/
│   ├── colors.ts                 # Full design token color system
│   ├── typography.ts             # Font sizes, weights, line heights
│   ├── parameters.ts             # Safe ranges for all water params
│   ├── morphs.ts                 # All axolotl morph definitions
│   └── achievements.ts           # Achievement definitions
│
├── assets/
│   ├── lottie/
│   │   ├── axolotl-swim.json
│   │   ├── water-fill.json
│   │   ├── bubbles.json
│   │   ├── sos-pulse.json
│   │   ├── achievement-burst.json
│   │   └── aotw-sparkle.json
│   ├── images/
│   │   ├── morphs/               # Reference images per morph
│   │   └── onboarding/
│   └── icons/
│       └── tab-icons/            # Custom SVG tab bar icons
│
├── supabase/
│   ├── migrations/
│   │   ├── 001_initial_schema.sql
│   │   ├── 002_rls_policies.sql
│   │   ├── 003_indexes.sql
│   │   ├── 004_triggers.sql
│   │   └── 005_seed_data.sql
│   ├── functions/
│   │   ├── heat-alert/           # Edge Function: check weather + push
│   │   ├── weekly-aotw/          # Edge Function: select AOTW + notify
│   │   └── community-report/     # Edge Function: generate weekly stats
│   └── config.toml
│
├── .env.local                    # Never commit this
├── app.json
├── babel.config.js
├── tsconfig.json
└── package.json
```

### 3.3 Environment Variables

Create `.env.local` at project root. **Never commit this file.**

```bash
# Supabase
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Anthropic (Claude AI)
# NOTE: For production, proxy through a Supabase Edge Function
# Never expose this key in the mobile app binary
ANTHROPIC_API_KEY=sk-ant-your-key-here

# RevenueCat
EXPO_PUBLIC_REVENUECAT_IOS_KEY=appl_your-ios-key
EXPO_PUBLIC_REVENUECAT_ANDROID_KEY=goog_your-android-key

# OpenWeatherMap
EXPO_PUBLIC_OPENWEATHER_KEY=your-openweather-key

# Pexels
EXPO_PUBLIC_PEXELS_KEY=your-pexels-key

# OneSignal
EXPO_PUBLIC_ONESIGNAL_APP_ID=your-onesignal-app-id

# Sentry
EXPO_PUBLIC_SENTRY_DSN=https://your-sentry-dsn
```

> **Security note:** The Anthropic API key must NEVER go in the mobile app. Proxy all Claude API calls through a Supabase Edge Function. The Edge Function holds the secret key server-side. The mobile app calls the Edge Function with the user's Supabase auth token.

### 3.4 Supabase Client Configuration

```typescript
// lib/supabase.ts
import 'react-native-url-polyfill/auto'
import { createClient } from '@supabase/supabase-js'
import * as SecureStore from 'expo-secure-store'
import type { Database } from '@/types/database.types'

const ExpoSecureStoreAdapter = {
  getItem: (key: string) => SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
  removeItem: (key: string) => SecureStore.deleteItemAsync(key),
}

export const supabase = createClient<Database>(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      storage: ExpoSecureStoreAdapter,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
)
```

---

## 4. Supabase Schema

Run these migrations in order using `supabase db push` or the Supabase dashboard SQL editor.

### 4.1 Migration 001 — Core Tables

```sql
-- ============================================================
-- 001_initial_schema.sql
-- AxolotlCare core tables
-- ============================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- for full-text search on guides

-- ============================================================
-- PROFILES
-- Extends Supabase auth.users with app-specific data
-- ============================================================
CREATE TABLE public.profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username        TEXT UNIQUE NOT NULL CHECK (
                    length(username) >= 3 AND
                    length(username) <= 30 AND
                    username ~ '^[a-zA-Z0-9_]+$'
                  ),
  display_name    TEXT NOT NULL CHECK (length(display_name) >= 1 AND length(display_name) <= 50),
  avatar_url      TEXT,
  bio             TEXT CHECK (length(bio) <= 200),
  keeper_since    DATE DEFAULT CURRENT_DATE,
  location        TEXT CHECK (length(location) <= 100),

  -- Subscription state (mirrored from RevenueCat via webhook)
  subscription_tier       TEXT NOT NULL DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro')),
  subscription_expires_at TIMESTAMPTZ,
  revenuecat_user_id      TEXT,

  -- Push notification
  onesignal_player_id TEXT,

  -- Metadata
  total_parameter_logs    INTEGER NOT NULL DEFAULT 0,
  total_axolotls_kept     INTEGER NOT NULL DEFAULT 0,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- AXOLOTLS
-- Individual axolotl profiles owned by a user
-- ============================================================
CREATE TYPE axolotl_morph AS ENUM (
  'leucistic',
  'golden_albino',
  'melanoid',
  'wild_type',
  'copper',
  'axanthic',
  'piebald',
  'mosaic',
  'chimera',
  'gfp',          -- GFP (genetically fluorescent protein)
  'firefly',
  'lavender',
  'enigma',
  'unknown'
);

CREATE TYPE axolotl_sex AS ENUM ('male', 'female', 'unknown');

CREATE TABLE public.axolotls (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id        UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,

  -- Identity
  name            TEXT NOT NULL CHECK (length(name) >= 1 AND length(name) <= 50),
  morph           axolotl_morph NOT NULL DEFAULT 'unknown',
  sex             axolotl_sex NOT NULL DEFAULT 'unknown',
  color_notes     TEXT CHECK (length(color_notes) <= 200),

  -- Timeline
  hatch_date      DATE,
  adoption_date   DATE,
  passed_date     DATE,    -- if the axolotl has passed

  -- Tank details
  tank_name           TEXT CHECK (length(tank_name) <= 50),
  tank_volume_liters  NUMERIC(6,1) CHECK (tank_volume_liters > 0 AND tank_volume_liters <= 5000),
  has_filter          BOOLEAN DEFAULT TRUE,
  has_chiller         BOOLEAN DEFAULT FALSE,
  substrate_type      TEXT CHECK (substrate_type IN ('bare', 'sand', 'smooth_pebble', 'tile', 'other')),

  -- Photos (array of Supabase Storage URLs)
  photos          TEXT[] DEFAULT '{}',
  primary_photo   TEXT,   -- URL of main display photo

  -- Privacy
  is_public       BOOLEAN NOT NULL DEFAULT TRUE,

  -- Stats (cached, updated by triggers)
  last_parameter_log_at   TIMESTAMPTZ,
  parameter_log_count     INTEGER NOT NULL DEFAULT 0,

  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- WATER PARAMETERS
-- Core data — every parameter log entry
-- ============================================================
CREATE TABLE public.water_parameters (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  axolotl_id      UUID NOT NULL REFERENCES public.axolotls(id) ON DELETE CASCADE,
  owner_id        UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,

  -- When
  logged_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Parameters (all nullable — user may not test everything each time)
  ph              NUMERIC(4,2) CHECK (ph >= 0 AND ph <= 14),
  ammonia         NUMERIC(6,3) CHECK (ammonia >= 0 AND ammonia <= 20),      -- ppm
  nitrite         NUMERIC(6,3) CHECK (nitrite >= 0 AND nitrite <= 20),      -- ppm
  nitrate         NUMERIC(6,1) CHECK (nitrate >= 0 AND nitrate <= 500),     -- ppm
  temperature     NUMERIC(5,2) CHECK (temperature >= 0 AND temperature <= 40), -- celsius
  gh              NUMERIC(5,1) CHECK (gh >= 0 AND gh <= 100),               -- dGH
  kh              NUMERIC(5,1) CHECK (kh >= 0 AND kh <= 100),               -- dKH
  tds             NUMERIC(7,1) CHECK (tds >= 0 AND tds <= 5000),            -- ppm (optional)
  dissolved_oxygen NUMERIC(5,2) CHECK (dissolved_oxygen >= 0),              -- mg/L (optional)

  -- AI-generated safety assessment (computed and stored)
  safety_score    INTEGER CHECK (safety_score >= 0 AND safety_score <= 100),
  safety_flags    TEXT[],   -- ['ammonia_elevated', 'temp_high', ...]
  ai_insight      TEXT,     -- Short AI-generated plain-English summary

  -- Notes
  notes           TEXT CHECK (length(notes) <= 1000),

  -- Water change associated with this log
  water_change_percent NUMERIC(5,2) CHECK (water_change_percent >= 0 AND water_change_percent <= 100),

  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- HEALTH LOGS
-- Photo diagnoses, SOS events, manual health notes
-- ============================================================
CREATE TYPE health_log_type AS ENUM (
  'photo_diagnosis',
  'sos_emergency',
  'manual_note',
  'vet_visit'
);

CREATE TYPE health_log_outcome AS ENUM (
  'resolved',
  'monitoring',
  'ongoing',
  'lost',
  'unknown'
);

CREATE TABLE public.health_logs (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  axolotl_id      UUID NOT NULL REFERENCES public.axolotls(id) ON DELETE CASCADE,
  owner_id        UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,

  type            health_log_type NOT NULL,
  logged_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Symptoms (for SOS and manual notes)
  symptoms        TEXT[] DEFAULT '{}',

  -- AI diagnosis result (JSON for flexibility)
  -- Structure: { diagnosis, confidence, severity, treatment_steps[], follow_up_days }
  ai_diagnosis    JSONB,

  -- Photos (Supabase Storage URLs)
  photos          TEXT[] DEFAULT '{}',

  -- Treatment
  treatment_given TEXT CHECK (length(treatment_given) <= 2000),
  treatment_started_at TIMESTAMPTZ,

  -- Outcome
  outcome         health_log_outcome DEFAULT 'unknown',
  outcome_notes   TEXT CHECK (length(outcome_notes) <= 1000),
  resolved_at     TIMESTAMPTZ,

  -- Follow-up reminder
  follow_up_at    TIMESTAMPTZ,
  follow_up_sent  BOOLEAN DEFAULT FALSE,

  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- NITROGEN CYCLE SESSIONS
-- Tracks a user's tank cycling process step by step
-- ============================================================
CREATE TYPE cycle_method AS ENUM (
  'fish_in',          -- cycling with axolotl already in tank (emergency)
  'fishless_ammonia',  -- pure ammonia method (recommended)
  'seeded'            -- using established filter media
);

CREATE TABLE public.cycle_sessions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  axolotl_id      UUID NOT NULL REFERENCES public.axolotls(id) ON DELETE CASCADE,
  owner_id        UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,

  method          cycle_method NOT NULL DEFAULT 'fishless_ammonia',
  started_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at    TIMESTAMPTZ,

  -- Current step (1-based)
  current_step    INTEGER NOT NULL DEFAULT 1 CHECK (current_step >= 1),

  -- Day-by-day step data stored as JSONB
  -- Structure: { step_number, title, instructions, completed_at, readings: { ph, ammonia, nitrite, nitrate } }
  step_data       JSONB NOT NULL DEFAULT '[]',

  -- AI notes generated during the cycle
  ai_notes        TEXT,

  is_completed    BOOLEAN NOT NULL DEFAULT FALSE,

  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TANK ALERTS
-- System-generated alerts (heat warnings, parameter spikes, etc.)
-- ============================================================
CREATE TYPE alert_type AS ENUM (
  'heat_warning',
  'heat_critical',
  'ammonia_spike',
  'nitrite_spike',
  'parameter_anomaly',
  'water_change_due',
  'filter_maintenance_due',
  'follow_up_due',
  'birthday'
);

CREATE TYPE alert_severity AS ENUM ('info', 'warning', 'critical');

CREATE TABLE public.tank_alerts (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  axolotl_id      UUID NOT NULL REFERENCES public.axolotls(id) ON DELETE CASCADE,
  owner_id        UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,

  alert_type      alert_type NOT NULL,
  severity        alert_severity NOT NULL DEFAULT 'warning',
  title           TEXT NOT NULL,
  message         TEXT NOT NULL,
  action_url      TEXT,    -- deep link to relevant screen

  triggered_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  push_sent       BOOLEAN NOT NULL DEFAULT FALSE,
  push_sent_at    TIMESTAMPTZ,
  read            BOOLEAN NOT NULL DEFAULT FALSE,
  read_at         TIMESTAMPTZ,
  resolved        BOOLEAN NOT NULL DEFAULT FALSE,
  resolved_at     TIMESTAMPTZ,

  -- Extra context (e.g. forecast temp that triggered heat warning)
  metadata        JSONB DEFAULT '{}'
);

-- ============================================================
-- COMMUNITY POSTS
-- User-generated content: photos, tank showcases, milestones
-- ============================================================
CREATE TYPE post_type AS ENUM (
  'photo',
  'tank_showcase',
  'milestone',
  'health_update'
);

CREATE TABLE public.community_posts (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  axolotl_id      UUID REFERENCES public.axolotls(id) ON DELETE SET NULL,

  type            post_type NOT NULL DEFAULT 'photo',
  caption         TEXT CHECK (length(caption) <= 500),
  photos          TEXT[] NOT NULL DEFAULT '{}' CHECK (array_length(photos, 1) <= 10),

  -- Engagement (cached counts)
  likes_count     INTEGER NOT NULL DEFAULT 0,
  comments_count  INTEGER NOT NULL DEFAULT 0,

  is_visible      BOOLEAN NOT NULL DEFAULT TRUE,

  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Post likes
CREATE TABLE public.post_likes (
  post_id         UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (post_id, user_id)
);

-- Post comments
CREATE TABLE public.post_comments (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id         UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  author_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content         TEXT NOT NULL CHECK (length(content) >= 1 AND length(content) <= 500),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- AXOLOTL OF THE WEEK
-- ============================================================

-- Nominations submitted by users
CREATE TABLE public.aotw_nominations (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  axolotl_id      UUID NOT NULL REFERENCES public.axolotls(id) ON DELETE CASCADE,
  nominator_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  nomination_note TEXT CHECK (length(nomination_note) <= 500),
  nominated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  considered      BOOLEAN NOT NULL DEFAULT FALSE  -- marked true after review
);

-- Weekly winners
CREATE TABLE public.aotw_winners (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  axolotl_id      UUID NOT NULL REFERENCES public.axolotls(id) ON DELETE CASCADE,
  owner_id        UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,

  week_start      DATE NOT NULL UNIQUE,  -- Monday of the winning week
  feature_story   TEXT NOT NULL CHECK (length(feature_story) >= 50 AND length(feature_story) <= 1000),
  feature_photo   TEXT NOT NULL,         -- Supabase Storage URL of hero photo

  notification_sent BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- ACHIEVEMENTS
-- ============================================================

-- Achievement definitions (seeded, not user-created)
CREATE TABLE public.achievement_definitions (
  id              TEXT PRIMARY KEY,   -- e.g. 'cycle_complete', '1_year_keeper'
  name            TEXT NOT NULL,
  description     TEXT NOT NULL,
  category        TEXT NOT NULL CHECK (category IN ('care', 'community', 'milestone', 'health')),
  lottie_key      TEXT,               -- key for assets/lottie/ animation
  icon_name       TEXT,               -- Tabler icon name fallback
  sort_order      INTEGER NOT NULL DEFAULT 0
);

-- User earned achievements
CREATE TABLE public.user_achievements (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id      UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  achievement_id  TEXT NOT NULL REFERENCES public.achievement_definitions(id),
  axolotl_id      UUID REFERENCES public.axolotls(id) ON DELETE SET NULL,
  earned_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notified        BOOLEAN NOT NULL DEFAULT FALSE,
  UNIQUE (profile_id, achievement_id)
);

-- ============================================================
-- GUIDES
-- Expert knowledge base articles
-- ============================================================
CREATE TYPE guide_difficulty AS ENUM ('beginner', 'intermediate', 'expert');
CREATE TYPE guide_category AS ENUM (
  'water_chemistry',
  'tank_setup',
  'feeding',
  'disease',
  'breeding',
  'seasonal',
  'equipment',
  'morphs'
);

CREATE TABLE public.guides (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug            TEXT UNIQUE NOT NULL,
  title           TEXT NOT NULL CHECK (length(title) >= 5 AND length(title) <= 100),
  excerpt         TEXT NOT NULL CHECK (length(excerpt) >= 10 AND length(excerpt) <= 300),
  category        guide_category NOT NULL,
  difficulty      guide_difficulty NOT NULL DEFAULT 'beginner',
  content_markdown TEXT NOT NULL,
  reading_time_minutes INTEGER NOT NULL DEFAULT 5 CHECK (reading_time_minutes > 0),
  cover_pexels_id TEXT,    -- Pexels photo ID for dynamic cover loading
  cover_url       TEXT,    -- Fallback static URL

  -- SEO
  meta_title      TEXT,
  meta_description TEXT,

  published       BOOLEAN NOT NULL DEFAULT FALSE,
  published_at    TIMESTAMPTZ,
  featured        BOOLEAN NOT NULL DEFAULT FALSE,

  -- Engagement
  view_count      INTEGER NOT NULL DEFAULT 0,
  bookmark_count  INTEGER NOT NULL DEFAULT 0,

  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User guide bookmarks
CREATE TABLE public.guide_bookmarks (
  guide_id        UUID NOT NULL REFERENCES public.guides(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (guide_id, user_id)
);
```

### 4.2 Migration 002 — Row Level Security Policies

```sql
-- ============================================================
-- 002_rls_policies.sql
-- RLS: users can only see/edit their own data
-- Community content is publicly readable
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.axolotls          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.water_parameters  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_logs       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cycle_sessions    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tank_alerts       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_likes        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_comments     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aotw_nominations  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aotw_winners      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guides            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guide_bookmarks   ENABLE ROW LEVEL SECURITY;

-- -------------------------------------------------------
-- PROFILES
-- -------------------------------------------------------
-- Anyone can view public profile data
CREATE POLICY "profiles_public_read" ON public.profiles
  FOR SELECT USING (TRUE);

-- Users can update only their own profile
CREATE POLICY "profiles_self_update" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Profile created automatically via trigger on auth.users insert
CREATE POLICY "profiles_self_insert" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- -------------------------------------------------------
-- AXOLOTLS
-- -------------------------------------------------------
-- Public axolotls visible to everyone; private only to owner
CREATE POLICY "axolotls_read" ON public.axolotls
  FOR SELECT USING (
    is_public = TRUE OR auth.uid() = owner_id
  );

CREATE POLICY "axolotls_insert" ON public.axolotls
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "axolotls_update" ON public.axolotls
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "axolotls_delete" ON public.axolotls
  FOR DELETE USING (auth.uid() = owner_id);

-- -------------------------------------------------------
-- WATER PARAMETERS
-- -------------------------------------------------------
-- Only owner can see their parameter logs
CREATE POLICY "water_params_owner_all" ON public.water_parameters
  FOR ALL USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- -------------------------------------------------------
-- HEALTH LOGS
-- -------------------------------------------------------
CREATE POLICY "health_logs_owner_all" ON public.health_logs
  FOR ALL USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- -------------------------------------------------------
-- CYCLE SESSIONS
-- -------------------------------------------------------
CREATE POLICY "cycle_sessions_owner_all" ON public.cycle_sessions
  FOR ALL USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- -------------------------------------------------------
-- TANK ALERTS
-- -------------------------------------------------------
CREATE POLICY "tank_alerts_owner_all" ON public.tank_alerts
  FOR ALL USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- -------------------------------------------------------
-- COMMUNITY POSTS
-- -------------------------------------------------------
CREATE POLICY "community_posts_public_read" ON public.community_posts
  FOR SELECT USING (is_visible = TRUE);

CREATE POLICY "community_posts_owner_insert" ON public.community_posts
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "community_posts_owner_update" ON public.community_posts
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "community_posts_owner_delete" ON public.community_posts
  FOR DELETE USING (auth.uid() = author_id);

-- -------------------------------------------------------
-- POST LIKES
-- -------------------------------------------------------
CREATE POLICY "post_likes_read" ON public.post_likes
  FOR SELECT USING (TRUE);

CREATE POLICY "post_likes_insert" ON public.post_likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "post_likes_delete" ON public.post_likes
  FOR DELETE USING (auth.uid() = user_id);

-- -------------------------------------------------------
-- POST COMMENTS
-- -------------------------------------------------------
CREATE POLICY "post_comments_read" ON public.post_comments
  FOR SELECT USING (TRUE);

CREATE POLICY "post_comments_insert" ON public.post_comments
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "post_comments_delete" ON public.post_comments
  FOR DELETE USING (auth.uid() = author_id);

-- -------------------------------------------------------
-- AOTW NOMINATIONS
-- -------------------------------------------------------
CREATE POLICY "aotw_nominations_read" ON public.aotw_nominations
  FOR SELECT USING (auth.uid() = nominator_id);

CREATE POLICY "aotw_nominations_insert" ON public.aotw_nominations
  FOR INSERT WITH CHECK (auth.uid() = nominator_id);

-- -------------------------------------------------------
-- AOTW WINNERS
-- -------------------------------------------------------
-- Anyone can see AOTW winners
CREATE POLICY "aotw_winners_public_read" ON public.aotw_winners
  FOR SELECT USING (TRUE);

-- Only service role (Edge Functions) can insert winners
-- Application inserts via Edge Function with service role key

-- -------------------------------------------------------
-- USER ACHIEVEMENTS
-- -------------------------------------------------------
-- Any authenticated user can view achievements (for profile display)
CREATE POLICY "user_achievements_read" ON public.user_achievements
  FOR SELECT USING (TRUE);

-- Only service role inserts achievements (triggered server-side)

-- -------------------------------------------------------
-- GUIDES
-- -------------------------------------------------------
CREATE POLICY "guides_published_read" ON public.guides
  FOR SELECT USING (published = TRUE);

-- -------------------------------------------------------
-- GUIDE BOOKMARKS
-- -------------------------------------------------------
CREATE POLICY "guide_bookmarks_read" ON public.guide_bookmarks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "guide_bookmarks_insert" ON public.guide_bookmarks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "guide_bookmarks_delete" ON public.guide_bookmarks
  FOR DELETE USING (auth.uid() = user_id);

-- Achievement definitions are public read
ALTER TABLE public.achievement_definitions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "achievement_definitions_public_read" ON public.achievement_definitions
  FOR SELECT USING (TRUE);
```

### 4.3 Migration 003 — Indexes

```sql
-- ============================================================
-- 003_indexes.sql
-- Performance indexes for all critical query paths
-- ============================================================

-- PROFILES
CREATE INDEX idx_profiles_username ON public.profiles(username);
CREATE INDEX idx_profiles_subscription ON public.profiles(subscription_tier);

-- AXOLOTLS
CREATE INDEX idx_axolotls_owner ON public.axolotls(owner_id);
CREATE INDEX idx_axolotls_public ON public.axolotls(is_public) WHERE is_public = TRUE;
CREATE INDEX idx_axolotls_morph ON public.axolotls(morph);

-- WATER PARAMETERS
-- Most queried: all logs for a specific axolotl, ordered by time
CREATE INDEX idx_water_params_axolotl_time
  ON public.water_parameters(axolotl_id, logged_at DESC);

-- For community water report (anonymised aggregate)
CREATE INDEX idx_water_params_logged_at ON public.water_parameters(logged_at DESC);

-- HEALTH LOGS
CREATE INDEX idx_health_logs_axolotl ON public.health_logs(axolotl_id, logged_at DESC);
CREATE INDEX idx_health_logs_owner ON public.health_logs(owner_id);
CREATE INDEX idx_health_logs_followup
  ON public.health_logs(follow_up_at)
  WHERE follow_up_at IS NOT NULL AND follow_up_sent = FALSE;

-- CYCLE SESSIONS
CREATE INDEX idx_cycle_sessions_axolotl ON public.cycle_sessions(axolotl_id);
CREATE INDEX idx_cycle_sessions_active
  ON public.cycle_sessions(owner_id)
  WHERE is_completed = FALSE;

-- TANK ALERTS
CREATE INDEX idx_tank_alerts_owner_unread
  ON public.tank_alerts(owner_id, triggered_at DESC)
  WHERE resolved = FALSE;
CREATE INDEX idx_tank_alerts_push_pending
  ON public.tank_alerts(triggered_at)
  WHERE push_sent = FALSE;

-- COMMUNITY POSTS
CREATE INDEX idx_community_posts_feed
  ON public.community_posts(created_at DESC)
  WHERE is_visible = TRUE;
CREATE INDEX idx_community_posts_author ON public.community_posts(author_id);
CREATE INDEX idx_community_posts_axolotl ON public.community_posts(axolotl_id);

-- POST LIKES
CREATE INDEX idx_post_likes_post ON public.post_likes(post_id);

-- POST COMMENTS
CREATE INDEX idx_post_comments_post ON public.post_comments(post_id, created_at);

-- AOTW
CREATE INDEX idx_aotw_nominations_axolotl ON public.aotw_nominations(axolotl_id);
CREATE INDEX idx_aotw_nominations_pending
  ON public.aotw_nominations(nominated_at DESC)
  WHERE considered = FALSE;
CREATE INDEX idx_aotw_winners_week ON public.aotw_winners(week_start DESC);

-- USER ACHIEVEMENTS
CREATE INDEX idx_user_achievements_profile ON public.user_achievements(profile_id);
CREATE INDEX idx_user_achievements_unnotified
  ON public.user_achievements(profile_id)
  WHERE notified = FALSE;

-- GUIDES
CREATE INDEX idx_guides_published ON public.guides(published_at DESC) WHERE published = TRUE;
CREATE INDEX idx_guides_category ON public.guides(category) WHERE published = TRUE;
CREATE INDEX idx_guides_featured ON public.guides(featured) WHERE featured = TRUE AND published = TRUE;
-- Full text search index on guides
CREATE INDEX idx_guides_fts ON public.guides
  USING gin(to_tsvector('english', title || ' ' || excerpt || ' ' || content_markdown));

-- GUIDE BOOKMARKS
CREATE INDEX idx_guide_bookmarks_user ON public.guide_bookmarks(user_id);
```

### 4.4 Migration 004 — Triggers & Functions

```sql
-- ============================================================
-- 004_triggers.sql
-- Automated behaviours: profile creation, stats updates,
-- achievement checking, cached count maintenance
-- ============================================================

-- -------------------------------------------------------
-- 1. Auto-create profile on user signup
-- -------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name)
  VALUES (
    NEW.id,
    -- Generate username from email prefix, sanitised
    LOWER(REGEXP_REPLACE(SPLIT_PART(NEW.email, '@', 1), '[^a-zA-Z0-9_]', '', 'g'))
      || '_' || SUBSTRING(NEW.id::TEXT, 1, 4),
    COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- -------------------------------------------------------
-- 2. Update profiles.updated_at automatically
-- -------------------------------------------------------
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER axolotls_updated_at
  BEFORE UPDATE ON public.axolotls
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER health_logs_updated_at
  BEFORE UPDATE ON public.health_logs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER cycle_sessions_updated_at
  BEFORE UPDATE ON public.cycle_sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER community_posts_updated_at
  BEFORE UPDATE ON public.community_posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- -------------------------------------------------------
-- 3. Update axolotl parameter log stats after each log
-- -------------------------------------------------------
CREATE OR REPLACE FUNCTION public.update_axolotl_parameter_stats()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.axolotls
  SET
    last_parameter_log_at = NEW.logged_at,
    parameter_log_count   = parameter_log_count + 1,
    updated_at            = NOW()
  WHERE id = NEW.axolotl_id;

  -- Also increment profile total
  UPDATE public.profiles
  SET total_parameter_logs = total_parameter_logs + 1
  WHERE id = NEW.owner_id;

  RETURN NEW;
END;
$$;

CREATE TRIGGER after_water_parameter_insert
  AFTER INSERT ON public.water_parameters
  FOR EACH ROW EXECUTE FUNCTION public.update_axolotl_parameter_stats();

-- -------------------------------------------------------
-- 4. Maintain likes_count on community_posts
-- -------------------------------------------------------
CREATE OR REPLACE FUNCTION public.update_post_likes_count()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.community_posts
    SET likes_count = likes_count + 1
    WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.community_posts
    SET likes_count = GREATEST(0, likes_count - 1)
    WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$;

CREATE TRIGGER post_likes_count_trigger
  AFTER INSERT OR DELETE ON public.post_likes
  FOR EACH ROW EXECUTE FUNCTION public.update_post_likes_count();

-- -------------------------------------------------------
-- 5. Maintain comments_count on community_posts
-- -------------------------------------------------------
CREATE OR REPLACE FUNCTION public.update_post_comments_count()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.community_posts
    SET comments_count = comments_count + 1
    WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.community_posts
    SET comments_count = GREATEST(0, comments_count - 1)
    WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$;

CREATE TRIGGER post_comments_count_trigger
  AFTER INSERT OR DELETE ON public.post_comments
  FOR EACH ROW EXECUTE FUNCTION public.update_post_comments_count();

-- -------------------------------------------------------
-- 6. Maintain bookmark_count on guides
-- -------------------------------------------------------
CREATE OR REPLACE FUNCTION public.update_guide_bookmark_count()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.guides SET bookmark_count = bookmark_count + 1 WHERE id = NEW.guide_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.guides SET bookmark_count = GREATEST(0, bookmark_count - 1) WHERE id = OLD.guide_id;
  END IF;
  RETURN NULL;
END;
$$;

CREATE TRIGGER guide_bookmark_count_trigger
  AFTER INSERT OR DELETE ON public.guide_bookmarks
  FOR EACH ROW EXECUTE FUNCTION public.update_guide_bookmark_count();

-- -------------------------------------------------------
-- 7. Check and award achievements after key events
-- -------------------------------------------------------
CREATE OR REPLACE FUNCTION public.check_achievements_after_parameter_log()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  log_count INTEGER;
  axolotl_created DATE;
BEGIN
  -- Water Wizard: 30 consecutive parameter logs
  SELECT COUNT(*) INTO log_count
  FROM public.water_parameters
  WHERE owner_id = NEW.owner_id
    AND logged_at >= NOW() - INTERVAL '60 days';

  IF log_count >= 30 THEN
    INSERT INTO public.user_achievements (profile_id, achievement_id)
    VALUES (NEW.owner_id, 'water_wizard')
    ON CONFLICT (profile_id, achievement_id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER check_achievements_on_parameter_log
  AFTER INSERT ON public.water_parameters
  FOR EACH ROW EXECUTE FUNCTION public.check_achievements_after_parameter_log();

-- -------------------------------------------------------
-- 8. Check 1-year keeper achievement
-- (Run this function periodically via Edge Function cron)
-- -------------------------------------------------------
CREATE OR REPLACE FUNCTION public.check_annual_keeper_achievements()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.user_achievements (profile_id, achievement_id, axolotl_id)
  SELECT DISTINCT
    a.owner_id,
    '1_year_keeper',
    a.id
  FROM public.axolotls a
  WHERE
    a.adoption_date IS NOT NULL
    AND a.adoption_date <= CURRENT_DATE - INTERVAL '1 year'
    AND a.passed_date IS NULL
    AND NOT EXISTS (
      SELECT 1 FROM public.user_achievements ua
      WHERE ua.profile_id = a.owner_id AND ua.achievement_id = '1_year_keeper'
    );
END;
$$;
```

### 4.5 Migration 005 — Seed Data

```sql
-- ============================================================
-- 005_seed_data.sql
-- Achievement definitions and initial guide stubs
-- ============================================================

-- ACHIEVEMENTS
INSERT INTO public.achievement_definitions (id, name, description, category, lottie_key, sort_order) VALUES
  ('cycle_complete',       'Cycle Complete',       'Successfully cycled your tank before introducing your axolotl.',           'care',      'achievement-burst', 1),
  ('first_log',            'First Reading',        'Logged your first water parameters.',                                      'care',      'achievement-burst', 2),
  ('water_wizard',         'Water Wizard',          'Logged parameters 30 times. Your tank chemistry is under control.',       'care',      'achievement-burst', 3),
  ('1_year_keeper',        '1 Year Keeper',         'Your axolotl has thrived in your care for a full year.',                  'milestone', 'achievement-burst', 4),
  ('emergency_survivor',   'Emergency Survivor',    'Used SOS mode and your axolotl recovered.',                               'health',    'achievement-burst', 5),
  ('community_contributor','Community Contributor', 'Shared your first photo in the community gallery.',                       'community', 'achievement-burst', 6),
  ('aotw_winner',          'Featured Keeper',       'Your axolotl was selected as Axolotl of the Week.',                       'community', 'aotw-sparkle',     7),
  ('rare_morph',           'Rare Find',             'You keep a rare morph — mosaic, chimera, or firefly.',                    'milestone', 'achievement-burst', 8),
  ('first_breeding',       'First Spawn',           'Successfully bred your axolotls.',                                        'milestone', 'achievement-burst', 9),
  ('sos_responder',        'Quick Responder',       'Used SOS emergency mode within 24 hours of a health crisis.',             'health',    'achievement-burst', 10);

-- GUIDE STUBS (published: false — fill in content before launch)
INSERT INTO public.guides (slug, title, excerpt, category, difficulty, reading_time_minutes, featured, content_markdown) VALUES
  ('nitrogen-cycle-complete-guide',
   'The Complete Nitrogen Cycle Guide for Axolotl Tanks',
   'The single most important thing to understand before keeping an axolotl. Get this wrong and your axolotl will die.',
   'water_chemistry', 'beginner', 15, TRUE, '# Placeholder — fill before launch'),

  ('axolotl-water-parameters-guide',
   'Perfect Water Parameters for Axolotls',
   'Exact pH, ammonia, nitrite, nitrate, temperature, GH and KH ranges with explanations of why each one matters.',
   'water_chemistry', 'beginner', 10, TRUE, '# Placeholder'),

  ('fungus-treatment-guide',
   'Axolotl Fungus: Identification, Treatment & Prevention',
   'White fluffy growths on your axolotl are usually fungal. Here is exactly what to do, step by step.',
   'disease', 'beginner', 8, TRUE, '# Placeholder'),

  ('summer-heat-management',
   'Keeping Your Axolotl Cool in Summer',
   'Axolotls cannot tolerate temperatures above 22°C. These are your options when your house heats up.',
   'seasonal', 'beginner', 7, TRUE, '# Placeholder'),

  ('first-tank-setup',
   'Setting Up Your First Axolotl Tank',
   'Everything you need, in the order you need it — from choosing a tank size to adding your axolotl safely.',
   'tank_setup', 'beginner', 12, TRUE, '# Placeholder'),

  ('axolotl-not-eating',
   'Why Is My Axolotl Not Eating?',
   'The most common question from new owners. Here are all the reasons and exactly what to check.',
   'feeding', 'beginner', 6, FALSE, '# Placeholder'),

  ('breeding-complete-guide',
   'How to Breed Axolotls: The Complete Guide',
   'Conditioning, spawning, egg collection, hatching, and raising axolotl larvae through to juveniles.',
   'breeding', 'intermediate', 20, FALSE, '# Placeholder'),

  ('morph-identification-guide',
   'Identifying Axolotl Morphs: Every Colour Explained',
   'Leucistic, golden albino, melanoid, copper, mosaic, chimera — what they all look like and how to identify them.',
   'morphs', 'beginner', 8, FALSE, '# Placeholder');
```

---

## 5. Authentication

### 5.1 Auth Flow Overview

```
New user:
  Sign up (email + password OR Apple Sign-In)
    → Supabase creates auth.users entry
    → Trigger auto-creates profiles row
    → App routes to /onboarding/welcome

Returning user:
  Sign in
    → Supabase session stored in SecureStore
    → App routes to /(tabs)/index
    → Zustand stores load user + axolotl data
```

### 5.2 Root Layout

```typescript
// app/_layout.tsx
import { useEffect } from 'react'
import { Stack } from 'expo-router'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/useAuthStore'
import { useRouter, useSegments } from 'expo-router'
import Purchases from 'react-native-purchases'

export default function RootLayout() {
  const { session, setSession } = useAuthStore()
  const router = useRouter()
  const segments = useSegments()

  useEffect(() => {
    // Configure RevenueCat
    Purchases.configure({
      apiKey: Platform.select({
        ios: process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY!,
        android: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY!,
      })!
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        if (session) {
          await Purchases.logIn(session.user.id)
        }
      }
    )
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)'
    const inOnboarding = segments[0] === 'onboarding'

    if (!session && !inAuthGroup) {
      router.replace('/(auth)/sign-in')
    } else if (session && inAuthGroup) {
      router.replace('/(tabs)')
    }
  }, [session, segments])

  return <Stack screenOptions={{ headerShown: false }} />
}
```

### 5.3 Sign Up Screen (Simplified)

```typescript
// app/(auth)/sign-up.tsx
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { router } from 'expo-router'

export default function SignUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSignUp = async () => {
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) {
      setError(error.message)
    } else {
      router.replace('/onboarding/welcome')
    }
    setLoading(false)
  }

  // Render your UI here
}
```

---

## 6. Phase 1 — MVP Build

**Timeline:** Weeks 1–8  
**Goal:** Paying users. App Store live. First €3K MRR.

### 6.1 Phase 1 Feature Checklist

```
✅ Authentication (email + Apple Sign-In)
✅ Profile creation
✅ Axolotl profile (name, morph, tank details, photo)
✅ Water parameter logger
✅ Parameter safe/danger indicators
✅ Nitrogen cycle wizard
✅ Heat alert (OpenWeatherMap + push)
✅ Care reminders (water change, feeding, filter)
✅ Photo health diagnosis (Claude Vision)
✅ SOS emergency mode
✅ Treatment calculator
✅ RevenueCat paywall (Pro monthly + annual)
✅ Push notifications (OneSignal)
✅ Basic onboarding (5 steps)
✅ iOS App Store submission
✅ Android Play Store submission
```

### 6.2 Parameter Safety Logic

```typescript
// constants/parameters.ts
export const PARAMETER_RANGES = {
  ph: {
    safe: { min: 6.5, max: 8.0 },
    warning: { min: 6.0, max: 8.5 },
    unit: 'pH',
    label: 'pH'
  },
  ammonia: {
    safe: { min: 0, max: 0 },        // must be exactly 0
    warning: { min: 0, max: 0.25 },  // any detectable ammonia is bad
    unit: 'ppm',
    label: 'Ammonia (NH₃)'
  },
  nitrite: {
    safe: { min: 0, max: 0 },
    warning: { min: 0, max: 0.25 },
    unit: 'ppm',
    label: 'Nitrite (NO₂)'
  },
  nitrate: {
    safe: { min: 0, max: 20 },
    warning: { min: 0, max: 40 },
    unit: 'ppm',
    label: 'Nitrate (NO₃)'
  },
  temperature: {
    safe: { min: 15, max: 20 },      // celsius
    warning: { min: 13, max: 22 },
    unit: '°C',
    label: 'Temperature'
  },
  gh: {
    safe: { min: 7, max: 14 },
    warning: { min: 4, max: 20 },
    unit: 'dGH',
    label: 'Hardness (GH)'
  },
  kh: {
    safe: { min: 3, max: 8 },
    warning: { min: 1, max: 12 },
    unit: 'dKH',
    label: 'Carbonate Hardness (KH)'
  }
} as const

export type ParameterKey = keyof typeof PARAMETER_RANGES
export type ParameterStatus = 'safe' | 'warning' | 'danger' | 'unknown'

export function getParameterStatus(key: ParameterKey, value: number | null): ParameterStatus {
  if (value === null || value === undefined) return 'unknown'
  const range = PARAMETER_RANGES[key]
  if (value >= range.safe.min && value <= range.safe.max) return 'safe'
  if (value >= range.warning.min && value <= range.warning.max) return 'warning'
  return 'danger'
}

export function calculateSafetyScore(params: Partial<Record<ParameterKey, number | null>>): number {
  const entries = Object.entries(params).filter(([, v]) => v !== null && v !== undefined)
  if (entries.length === 0) return 100
  const scores = entries.map(([key, value]) => {
    const status = getParameterStatus(key as ParameterKey, value as number)
    return status === 'safe' ? 100 : status === 'warning' ? 50 : 0
  })
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
}
```

### 6.3 AI Integration — Claude API Wrapper

```typescript
// lib/ai.ts
// IMPORTANT: These functions must be called via Supabase Edge Function proxy
// Never call the Anthropic API directly from the React Native app

export interface DiagnosisResult {
  diagnosis: string
  confidence: 'high' | 'medium' | 'low'
  severity: 'critical' | 'moderate' | 'mild' | 'none'
  possible_causes: string[]
  treatment_steps: string[]
  when_to_see_vet: string
  follow_up_days: number | null
}

export interface TrendAnalysis {
  trend: 'stable' | 'improving' | 'declining' | 'spike'
  summary: string
  action_required: boolean
  recommended_action: string | null
}

// These are the Supabase Edge Function endpoints
// The Edge Function holds the Anthropic key securely
export const AI_ENDPOINTS = {
  photo_diagnosis: '/functions/v1/diagnose-photo',
  sos_triage: '/functions/v1/sos-triage',
  trend_analysis: '/functions/v1/analyze-trends',
  care_chat: '/functions/v1/care-chat',
}
```

### 6.4 Supabase Edge Function — Photo Diagnosis

```typescript
// supabase/functions/diagnose-photo/index.ts
import Anthropic from 'npm:@anthropic-ai/sdk'
import { createClient } from 'npm:@supabase/supabase-js'

const anthropic = new Anthropic({
  apiKey: Deno.env.get('ANTHROPIC_API_KEY')!,
})

Deno.serve(async (req) => {
  // Validate auth
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) return new Response('Unauthorized', { status: 401 })

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: authHeader } } }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return new Response('Unauthorized', { status: 401 })

  // Check Pro subscription
  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_tier')
    .eq('id', user.id)
    .single()

  if (profile?.subscription_tier !== 'pro') {
    return new Response(JSON.stringify({ error: 'Pro subscription required' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  const { image_base64, image_type, axolotl_id, symptoms } = await req.json()

  // Fetch axolotl context for personalised diagnosis
  const { data: axolotl } = await supabase
    .from('axolotls')
    .select('name, morph, tank_volume_liters')
    .eq('id', axolotl_id)
    .single()

  // Get recent water params for context
  const { data: recentParams } = await supabase
    .from('water_parameters')
    .select('ph, ammonia, nitrite, nitrate, temperature, logged_at')
    .eq('axolotl_id', axolotl_id)
    .order('logged_at', { ascending: false })
    .limit(3)

  const systemPrompt = `You are an expert axolotl health diagnostician. You have deep knowledge of axolotl diseases, water chemistry, and treatment protocols. You are helping a worried axolotl owner who needs clear, actionable advice.

Axolotl details:
- Name: ${axolotl?.name}
- Morph: ${axolotl?.morph}
- Tank volume: ${axolotl?.tank_volume_liters}L

Recent water parameters:
${recentParams?.map(p => `${new Date(p.logged_at).toDateString()}: pH ${p.ph}, NH3 ${p.ammonia}ppm, NO2 ${p.nitrite}ppm, NO3 ${p.nitrate}ppm, Temp ${p.temperature}°C`).join('\n') ?? 'No recent logs'}

Reported symptoms: ${symptoms?.join(', ') ?? 'None specified'}

Respond with a JSON object matching this exact structure:
{
  "diagnosis": "Clear name of the condition",
  "confidence": "high|medium|low",
  "severity": "critical|moderate|mild|none",
  "possible_causes": ["cause 1", "cause 2"],
  "treatment_steps": ["Step 1: ...", "Step 2: ...", "Step 3: ..."],
  "when_to_see_vet": "Clear instruction on when emergency vet is needed",
  "follow_up_days": 3
}

Be specific and actionable. Never say "consult a vet" without also giving immediate steps the owner can take right now.`

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    system: systemPrompt,
    messages: [{
      role: 'user',
      content: [
        {
          type: 'image',
          source: {
            type: 'base64',
            media_type: image_type,
            data: image_base64,
          }
        },
        {
          type: 'text',
          text: 'Please diagnose any health issues visible in this axolotl photo and provide treatment steps.'
        }
      ]
    }]
  })

  const content = response.content[0]
  if (content.type !== 'text') {
    return new Response(JSON.stringify({ error: 'AI response error' }), { status: 500 })
  }

  // Parse JSON from response
  const jsonMatch = content.text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    return new Response(JSON.stringify({ error: 'Could not parse diagnosis' }), { status: 500 })
  }

  const diagnosis = JSON.parse(jsonMatch[0])

  // Log the health event to database
  await supabase.from('health_logs').insert({
    axolotl_id,
    owner_id: user.id,
    type: 'photo_diagnosis',
    symptoms: symptoms ?? [],
    ai_diagnosis: diagnosis,
    follow_up_at: diagnosis.follow_up_days
      ? new Date(Date.now() + diagnosis.follow_up_days * 86400000).toISOString()
      : null
  })

  return new Response(JSON.stringify(diagnosis), {
    headers: { 'Content-Type': 'application/json' }
  })
})
```

### 6.5 Heat Alert Edge Function

```typescript
// supabase/functions/heat-alert/index.ts
// Called by a cron job every 6 hours
// Checks weather for each active user's location and sends push if needed

import { createClient } from 'npm:@supabase/supabase-js'

const DANGER_TEMP_C = 22  // ambient temp that puts tank at risk
const WARNING_TEMP_C = 20

Deno.serve(async () => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!  // service role for cron
  )

  // Get all users with location set
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, location, onesignal_player_id')
    .not('location', 'is', null)
    .not('onesignal_player_id', 'is', null)

  if (!profiles) return new Response('OK')

  for (const profile of profiles) {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(profile.location)}&appid=${Deno.env.get('OPENWEATHER_KEY')}&units=metric&cnt=8`

    const weatherRes = await fetch(weatherUrl)
    const weather = await weatherRes.json()

    const maxTemp = Math.max(...weather.list.map((h: any) => h.main.temp_max))

    if (maxTemp >= DANGER_TEMP_C) {
      // Get their axolotls
      const { data: axolotls } = await supabase
        .from('axolotls')
        .select('id, name')
        .eq('owner_id', profile.id)
        .is('passed_date', null)

      for (const axolotl of axolotls ?? []) {
        // Create alert record
        await supabase.from('tank_alerts').insert({
          axolotl_id: axolotl.id,
          owner_id: profile.id,
          alert_type: 'heat_critical',
          severity: 'critical',
          title: `Heat warning for ${axolotl.name}`,
          message: `Forecast high of ${Math.round(maxTemp)}°C today. Check your chiller or cooling fan immediately.`,
          metadata: { forecast_max: maxTemp }
        })

        // Send OneSignal push
        await fetch('https://onesignal.com/api/v1/notifications', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${Deno.env.get('ONESIGNAL_REST_KEY')}`
          },
          body: JSON.stringify({
            app_id: Deno.env.get('ONESIGNAL_APP_ID'),
            include_player_ids: [profile.onesignal_player_id],
            headings: { en: `Heat warning — ${axolotl.name}` },
            contents: { en: `Forecast high of ${Math.round(maxTemp)}°C. Act now to keep your tank below 20°C.` },
            data: { screen: 'tank', axolotl_id: axolotl.id }
          })
        })
      }
    }
  }

  return new Response('OK')
})
```

---

## 7. Phase 2 — Community

**Timeline:** Weeks 9–20  
**Goal:** Community features live. Churn drops. Word of mouth starts.

### 7.1 Phase 2 Feature Checklist

```
✅ Community photo feed
✅ Photo upload to Supabase Storage
✅ Tank showcase gallery (browse by morph, size)
✅ Post likes + comments
✅ Axolotl of the Week (AOTW) — manual curation
✅ AOTW nominations from users
✅ Achievement engine
✅ Achievement push notifications
✅ Morph recognition + rarity badges
✅ Birthday tracker + push celebration
✅ Weekly community water report
✅ AI care chat (context-aware, Pro feature)
✅ Follow other keepers
✅ Profile public pages
```

### 7.2 Supabase Storage Configuration

```sql
-- Run in Supabase dashboard > Storage > Policies

-- Create buckets
INSERT INTO storage.buckets (id, name, public) VALUES
  ('axolotl-photos', 'axolotl-photos', TRUE),
  ('community-posts', 'community-posts', TRUE),
  ('aotw-photos', 'aotw-photos', TRUE);

-- Policy: authenticated users can upload to axolotl-photos/{user_id}/
CREATE POLICY "axolotl_photos_user_upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'axolotl-photos' AND
  auth.uid()::TEXT = (storage.foldername(name))[1]
);

-- Policy: anyone can read public photos
CREATE POLICY "axolotl_photos_public_read"
ON storage.objects FOR SELECT
USING (bucket_id IN ('axolotl-photos', 'community-posts', 'aotw-photos'));
```

### 7.3 Weekly AOTW Edge Function

```typescript
// supabase/functions/weekly-aotw/index.ts
// Called every Monday at 09:00 UTC via Supabase cron
// Selects winner from nominations and notifies community

import { createClient } from 'npm:@supabase/supabase-js'

Deno.serve(async () => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const weekStart = new Date()
  weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1) // This Monday
  const weekStartDate = weekStart.toISOString().split('T')[0]

  // Check if winner already selected this week
  const { data: existing } = await supabase
    .from('aotw_winners')
    .select('id')
    .eq('week_start', weekStartDate)
    .single()

  if (existing) return new Response('Already selected this week')

  // Get unreviewed nominations with high-quality public axolotls
  const { data: nominations } = await supabase
    .from('aotw_nominations')
    .select(`
      id,
      axolotl_id,
      nomination_note,
      axolotls (
        id, name, morph, primary_photo, owner_id,
        profiles!axolotls_owner_id_fkey (username, display_name)
      )
    `)
    .eq('considered', false)
    .not('axolotls.primary_photo', 'is', null)
    .order('nominated_at', { ascending: false })
    .limit(20)

  if (!nominations || nominations.length === 0) {
    console.log('No nominations available this week')
    return new Response('No nominations')
  }

  // For MVP: pick the most recent nomination with a photo
  // Future: add scoring (likes, rare morph bonus, etc.)
  const winner = nominations[0]
  const axolotl = winner.axolotls as any
  const profile = axolotl.profiles

  // Insert winner
  await supabase.from('aotw_winners').insert({
    axolotl_id: axolotl.id,
    owner_id: axolotl.owner_id,
    week_start: weekStartDate,
    feature_story: winner.nomination_note ?? `Meet ${axolotl.name}, a beautiful ${axolotl.morph} axolotl kept by ${profile.display_name}.`,
    feature_photo: axolotl.primary_photo,
  })

  // Award AOTW achievement to owner
  await supabase.from('user_achievements').insert({
    profile_id: axolotl.owner_id,
    achievement_id: 'aotw_winner',
    axolotl_id: axolotl.id,
  }).onConflict('profile_id, achievement_id').ignore()

  // Mark nominations as considered
  await supabase.from('aotw_nominations')
    .update({ considered: true })
    .eq('axolotl_id', axolotl.id)

  // Send push to winner
  const { data: winnerProfile } = await supabase
    .from('profiles')
    .select('onesignal_player_id')
    .eq('id', axolotl.owner_id)
    .single()

  if (winnerProfile?.onesignal_player_id) {
    await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Deno.env.get('ONESIGNAL_REST_KEY')}`
      },
      body: JSON.stringify({
        app_id: Deno.env.get('ONESIGNAL_APP_ID'),
        include_player_ids: [winnerProfile.onesignal_player_id],
        headings: { en: '🏆 You won Axolotl of the Week!' },
        contents: { en: `${axolotl.name} is this week's featured axolotl. Congratulations!` },
        data: { screen: 'aotw' }
      })
    })
  }

  // Send push to ALL users (community notification)
  await fetch('https://onesignal.com/api/v1/notifications', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${Deno.env.get('ONESIGNAL_REST_KEY')}`
    },
    body: JSON.stringify({
      app_id: Deno.env.get('ONESIGNAL_APP_ID'),
      included_segments: ['All'],
      headings: { en: 'New Axolotl of the Week' },
      contents: { en: `Meet ${axolotl.name} — this week's featured axolotl. Tap to see their story.` },
      data: { screen: 'aotw' }
    })
  })

  return new Response('AOTW selected successfully')
})
```

---

## 8. Phase 3 — Knowledge Base

**Timeline:** Months 6–12  
**Goal:** SEO authority. Organic user acquisition. Guides rank on Google.

### 8.1 Phase 3 Feature Checklist

```
✅ 20+ complete expert guides (not stubs)
✅ Disease encyclopedia with photos
✅ Breeding complete guide
✅ Seasonal care push notifications
✅ Guide search (full-text, Supabase)
✅ Guide bookmarks
✅ "Related guides" surfaced by AI in chat
✅ Web version: axolotlcare.app/guides (Next.js or Astro SSG)
✅ Partner content with 2+ axolotl YouTubers
✅ SEO meta tags per guide
✅ Guide reading time tracking
```

### 8.2 Guide Full-Text Search

```typescript
// lib/supabase.ts — add this helper
export async function searchGuides(query: string) {
  const { data, error } = await supabase
    .from('guides')
    .select('id, slug, title, excerpt, category, difficulty, reading_time_minutes, cover_url')
    .textSearch('title || excerpt || content_markdown', query, {
      type: 'websearch',
      config: 'english'
    })
    .eq('published', true)
    .limit(10)

  return { data, error }
}
```

### 8.3 Content Priority — Write These First

Write guides in this order. Each one targets a high-volume search query:

| Guide slug | Target search query | Monthly searches (est.) |
|-----------|--------------------|-----------------------|
| `nitrogen-cycle-complete-guide` | "axolotl tank cycling" | 12,000 |
| `axolotl-water-parameters-guide` | "axolotl water parameters" | 18,000 |
| `fungus-treatment-guide` | "axolotl fungus treatment" | 8,000 |
| `axolotl-not-eating` | "axolotl not eating" | 9,000 |
| `summer-heat-management` | "axolotl too warm summer" | 5,000 |
| `first-tank-setup` | "axolotl tank setup" | 14,000 |
| `breeding-complete-guide` | "how to breed axolotls" | 6,000 |
| `morph-identification-guide` | "axolotl morph types" | 7,000 |

---

## 9. Phase 4 — Scale & Multi-Species

**Timeline:** Year 2  
**Goal:** Second species live. Platform thinking. Defensible data moat.

### 9.1 Multi-Species Architecture

The database is already species-agnostic. To add dart frogs:

1. Add `species` column to `axolotls` table (or create a separate `pets` table)
2. Create new `parameter_ranges` config per species in `constants/`
3. Create new guide content under `category = 'dart_frog'`
4. New onboarding flow branch for dart frog setup
5. New morph enum for dart frog morphs/locales

**Time to launch second species: 3–4 weeks**, not months.

### 9.2 Proprietary Dataset Value

By the time you have 2,000 active users logging parameters, you have:

- ~200,000 axolotl water parameter readings
- Correlated health outcomes (from health_logs)
- Seasonal temperature patterns across geographies
- Before/after data for treatments (follow_up outcomes)

This dataset has real value for:
- Fine-tuning your own diagnosis model (reducing Claude API costs)
- Research partnerships (axolotls are critically endangered, researchers want this data)
- Predictive "your tank is trending toward a spike" features

### 9.3 Breeder Mode (Phase 4 Feature)

Additional tables for serious breeders:

```sql
CREATE TABLE public.breeding_events (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id    UUID REFERENCES public.profiles(id),
  female_id   UUID REFERENCES public.axolotls(id),
  male_id     UUID REFERENCES public.axolotls(id),
  spawned_at  TIMESTAMPTZ,
  egg_count   INTEGER,
  hatch_count INTEGER,
  survival_rate NUMERIC(5,2),
  notes       TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 10. UI Design System

### 10.1 Color Tokens

```typescript
// constants/colors.ts
export const colors = {
  // Brand
  teal:       '#0A4F54',
  tealMid:    '#187A82',
  tealLight:  '#B8E8EC',
  tealPale:   '#EAF6F7',

  // Community
  gillPink:   '#F4A89A',
  gillPale:   '#FEF2F0',

  // Neutral
  sand:       '#F6EFE7',
  charcoal:   '#18232F',
  white:      '#FAFAF8',

  // Text
  text1:      '#18232F',
  text2:      '#5A6A78',
  text3:      '#8F9FAC',

  // Status
  safe:       '#2DB896',
  warning:    '#E8A020',
  danger:     '#E85A4F',
  safePale:   '#E8F7F0',
  warningPale:'#FFF3E0',
  dangerPale: '#FEF2F0',

  // Dark mode equivalents
  dark: {
    background: '#0D1B2A',
    surface:    '#132030',
    surface2:   '#1A2D3F',
    text1:      '#F0F4F8',
    text2:      '#8FA0B0',
    border:     'rgba(255,255,255,0.08)',
  }
} as const
```

### 10.2 Typography System

```typescript
// constants/typography.ts
export const typography = {
  fonts: {
    serif: 'DMSerifDisplay_400Regular',
    sans:  'PlusJakartaSans_400Regular',
    sansMedium: 'PlusJakartaSans_500Medium',
    sansSemiBold: 'PlusJakartaSans_600SemiBold',
  },
  sizes: {
    hero:    { fontSize: 32, lineHeight: 40 },
    h1:      { fontSize: 26, lineHeight: 32 },
    h2:      { fontSize: 20, lineHeight: 26 },
    h3:      { fontSize: 17, lineHeight: 24 },
    body:    { fontSize: 15, lineHeight: 22 },
    caption: { fontSize: 13, lineHeight: 18 },
    micro:   { fontSize: 11, lineHeight: 16 },
    label:   { fontSize: 10, lineHeight: 14, letterSpacing: 0.8 },
  }
} as const
```

### 10.3 Core UI Components

#### ParameterPill Component

```typescript
// components/ui/ParameterPill.tsx
import { View, Text, StyleSheet } from 'react-native'
import { getParameterStatus, PARAMETER_RANGES, type ParameterKey } from '@/constants/parameters'
import { colors } from '@/constants/colors'

interface Props {
  paramKey: ParameterKey
  value: number | null
}

const statusColors = {
  safe:    { bg: colors.safePale,    text: '#1A6B4A' },
  warning: { bg: colors.warningPale, text: '#8B5E0A' },
  danger:  { bg: colors.dangerPale,  text: '#8B1A1A' },
  unknown: { bg: '#F0F0F0',          text: colors.text3 },
}

export function ParameterPill({ paramKey, value }: Props) {
  const status = getParameterStatus(paramKey, value)
  const range = PARAMETER_RANGES[paramKey]
  const { bg, text } = statusColors[status]

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <Text style={[styles.value, { color: text }]}>
        {value !== null ? value.toString() : '—'}
      </Text>
      <Text style={[styles.unit, { color: text }]}>{range.unit}</Text>
      <Text style={[styles.label, { color: text + 'AA' }]}>{range.label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 12,
    flex: 1,
  },
  value: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  unit: {
    fontSize: 10,
    marginTop: 1,
  },
  label: {
    fontSize: 9,
    marginTop: 2,
    textAlign: 'center',
  }
})
```

### 10.4 Lottie Animation Files

Source your Lottie files from [LottieFiles.com](https://lottiefiles.com). Search for:

| File | LottieFiles search term | Used in |
|------|------------------------|---------|
| `axolotl-swim.json` | "axolotl swim" or "salamander" | Onboarding welcome |
| `water-fill.json` | "water fill circle" | Parameter safe state |
| `bubbles.json` | "bubbles floating" | Birthday screen |
| `sos-pulse.json` | "pulse red" or "alert pulse" | SOS entry screen |
| `achievement-burst.json` | "confetti burst" or "celebration" | Achievement unlock |
| `aotw-sparkle.json` | "sparkle stars" | AOTW reveal |

> **Important:** Download Lottie files in JSON format. Place in `assets/lottie/`. All Lottie files must work offline — no hosted Lottie URLs.

### 10.5 Bottom Tab Navigator

```typescript
// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router'
import { View, StyleSheet } from 'react-native'
import Svg, { Path, Circle } from 'react-native-svg'
import { colors } from '@/constants/colors'

// Custom SVG icons — no emoji, no icon libraries needed
const HomeIcon = ({ color }: { color: string }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
)

const TankIcon = ({ color }: { color: string }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path d="M3 5h18v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5z" stroke={color} strokeWidth={1.5} strokeLinecap="round"/>
    <Path d="M3 10q4 3 6 0t6 0 6 3" stroke={color} strokeWidth={1.5} strokeLinecap="round" fill="none"/>
  </Svg>
)

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: 'rgba(24,35,47,0.06)',
          borderTopWidth: 0.5,
          height: 84,
          paddingBottom: 20,
        },
        tabBarActiveTintColor: colors.teal,
        tabBarInactiveTintColor: colors.text3,
        tabBarLabelStyle: {
          fontSize: 10,
          fontFamily: 'PlusJakartaSans_500Medium',
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: ({ color }) => <HomeIcon color={color} /> }} />
      <Tabs.Screen name="tank" options={{ title: 'Tank', tabBarIcon: ({ color }) => <TankIcon color={color} /> }} />
      <Tabs.Screen name="community" options={{ title: 'Community' }} />
      <Tabs.Screen name="guides" options={{ title: 'Guides' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  )
}
```

---

## 11. AI Integration

### 11.1 AI Feature Map

| Feature | Model | Input | Output | Tier |
|---------|-------|-------|--------|------|
| Photo diagnosis | claude-sonnet-4-20250514 + Vision | Photo + symptoms + tank history | DiagnosisResult JSON | Pro |
| SOS triage | claude-sonnet-4-20250514 | Symptoms + recent params | Step-by-step protocol | Pro |
| Trend analysis | claude-sonnet-4-20250514 | Last 14 days of parameter logs | TrendAnalysis JSON | Pro |
| Care chat | claude-sonnet-4-20250514 | User message + tank context | Conversational response | Pro |
| Parameter insight | claude-haiku-4-5-20251001 | Single parameter log | 1-sentence insight | Free |

### 11.2 System Prompts

#### Parameter Insight (Free — uses Haiku for cost efficiency)

```
You are a concise axolotl water quality assistant.
Given a water parameter reading, respond with ONE sentence (max 20 words) of plain English advice.
Be specific. Never be generic. Mention the actual values.
Examples:
- "pH 7.2 is perfect for axolotls — right in the middle of the safe range."
- "Ammonia at 0.5ppm is dangerous. Do a 25% water change immediately."
```

#### SOS Triage (Pro)

```
You are an emergency axolotl health advisor. A keeper is in crisis right now.
Be calm but urgent. Give immediate, specific, numbered steps.
Never give vague advice. Always give the first action they should take in the next 5 minutes.

Tank context will be provided. Reported symptoms will be listed.
Respond with:
1. Most likely cause (1 sentence)
2. Immediate action (what to do RIGHT NOW)
3. Steps 2-5 (ordered by priority)
4. When to involve a vet (specific condition, not just "if it gets worse")
```

### 11.3 Cost Estimation

```
Photo diagnosis (claude-sonnet-4-20250514 with vision):
  ~1,500 input tokens + 500 output tokens = ~$0.006 per diagnosis

SOS triage (claude-sonnet-4-20250514):
  ~800 input tokens + 600 output tokens = ~$0.003 per SOS

Parameter insight (claude-haiku-4-5-20251001):
  ~200 input tokens + 50 output tokens = ~$0.00004 per log

At 2,000 Pro users each using:
  - 2 photo diagnoses/month = 4,000 × $0.006 = $24/month
  - 1 SOS/month average = 2,000 × $0.003 = $6/month
  - 20 parameter logs/month = 40,000 × $0.00004 = $1.60/month

Total AI cost at 2,000 Pro users: ~$32/month
Revenue at 2,000 Pro users: €13,980/month
AI cost as % of revenue: 0.23%
```

---

## 12. Monetisation & RevenueCat

### 12.1 Subscription Configuration

Configure in RevenueCat dashboard and App Store Connect / Google Play Console:

| Product ID | Price | Duration | Platform |
|-----------|-------|----------|----------|
| `axolotlcare_pro_monthly` | €6.99 | Monthly | iOS + Android |
| `axolotlcare_pro_annual` | €39.99 | Annual | iOS + Android |

**Annual saving:** €39.99 vs €83.88 (12 × €6.99) = **52% saving**. Always show this prominently.

### 12.2 RevenueCat Integration

```typescript
// lib/revenuecat.ts
import Purchases, { PurchasesPackage } from 'react-native-purchases'

export async function getOfferings() {
  const offerings = await Purchases.getOfferings()
  return offerings.current?.availablePackages ?? []
}

export async function purchasePackage(pkg: PurchasesPackage) {
  try {
    const { customerInfo } = await Purchases.purchasePackage(pkg)
    return { success: true, customerInfo }
  } catch (e: any) {
    if (!e.userCancelled) {
      throw e
    }
    return { success: false, customerInfo: null }
  }
}

export async function restorePurchases() {
  const customerInfo = await Purchases.restorePurchases()
  return customerInfo
}

export function hasProAccess(customerInfo: any): boolean {
  return customerInfo?.entitlements?.active?.['pro'] !== undefined
}
```

### 12.3 RevenueCat Webhook → Supabase

In RevenueCat dashboard, set webhook URL to your Supabase Edge Function:

```typescript
// supabase/functions/revenuecat-webhook/index.ts
Deno.serve(async (req) => {
  const body = await req.json()
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const userId = body.app_user_id
  const event = body.type  // 'INITIAL_PURCHASE', 'RENEWAL', 'CANCELLATION', etc.

  let tier = 'free'
  let expiresAt = null

  if (['INITIAL_PURCHASE', 'RENEWAL', 'PRODUCT_CHANGE'].includes(event)) {
    tier = 'pro'
    expiresAt = new Date(body.expiration_at_ms).toISOString()
  }

  await supabase.from('profiles')
    .update({
      subscription_tier: tier,
      subscription_expires_at: expiresAt,
    })
    .eq('id', userId)

  return new Response('OK')
})
```

### 12.4 Paywall Screen Logic

Show the paywall at these moments — never show it earlier:

1. User taps "Upload photo for diagnosis" (highest WTP moment)
2. User taps "SOS Emergency" (second highest WTP moment)
3. User tries to log their 6th parameter reading in a month
4. After onboarding, during community intro (soft CTA, not hard gate)

---

## 13. Push Notifications

### 13.1 Notification Types & Timing

| Notification | Trigger | Timing |
|-------------|---------|--------|
| Heat warning | Forecast > 20°C | 8am local time |
| Heat critical | Forecast > 22°C | Immediate |
| Ammonia spike (detected by AI) | After parameter log analysis | Immediate |
| Water change reminder | User-configured schedule | Configured time |
| Axolotl birthday | Hatch/adoption date match | 9am local time |
| AOTW announcement | Monday 9am UTC | Every Monday |
| AOTW winner | When selected | Immediate |
| Achievement unlocked | On achievement grant | Immediate |
| Follow-up reminder | health_log.follow_up_at | That day at 9am |

### 13.2 Notification Permission Request

```typescript
// lib/notifications.ts
import * as Notifications from 'expo-notifications'
import { Platform } from 'react-native'

export async function requestNotificationPermission(): Promise<boolean> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync()

  if (existingStatus === 'granted') return true

  const { status } = await Notifications.requestPermissionsAsync()
  return status === 'granted'
}

// Request permission during onboarding, after user has seen value
// (after step 3 — first parameter log — not at app open)
```

---

## 14. App Store Submission

### 14.1 App Store Connect Setup

**App name:** AxolotlCare — AI Tank Companion  
**Subtitle:** Water, health & community  
**Bundle ID:** app.axolotlcare.ios  
**SKU:** axolotlcare-ios-001

**Keywords (100 chars max):**
```
axolotl,axolotl care,axolotl tank,water chemistry,axolotl health,axolotl app,salamander care
```

**Category:** Lifestyle (Primary), Education (Secondary)

**Age rating:** 4+ (no objectionable content)

### 14.2 App Store Description

```
AxolotlCare is the AI companion every axolotl owner needs.

Your axolotl depends on perfect water chemistry. One ammonia spike can be fatal 
within hours. Most owners learn this too late — from a Reddit thread, after the 
damage is done. AxolotlCare puts expert guidance and real AI in your pocket, 
where you actually are: standing at your tank.

──────────────────
AI HEALTH ENGINE
──────────────────
• Photo health diagnosis: upload a photo, get an AI diagnosis with specific 
  treatment steps — fungus, gill issues, bloating, stress markings and more
• SOS Emergency mode: describe what's wrong, get immediate triage and a 
  step-by-step rescue protocol
• Water parameter logger: track pH, ammonia, nitrite, nitrate, temperature, 
  GH and KH with safe/danger indicators
• Nitrogen cycle wizard: step-by-step guidance for cycling a new tank — the 
  #1 reason axolotls die in the first month, solved completely free
• Heat alerts: we check your local weather forecast and warn you before your 
  tank gets dangerously warm

──────────────────
EXPERT GUIDES
──────────────────
Deep, species-specific knowledge on water chemistry, disease treatment, tank 
setup, feeding, breeding and seasonal care. Not generic pet advice — 
axolotl-specific guidance written with experienced keepers.

──────────────────
COMMUNITY
──────────────────
• Axolotl of the Week: a weekly featured keeper with their story
• Tank showcase gallery: browse beautiful setups from the community
• Achievement badges: Cycle Complete, 1 Year Keeper, Water Wizard, 
  Emergency Survivor — earned through real care
• Axolotl birthday tracker with celebration push notifications

──────────────────
FREE FEATURES
──────────────────
Parameter logging · Nitrogen cycle wizard · Heat alerts · Care reminders · 
Full community access · All expert guides · 2 axolotl profiles

──────────────────
PRO — €6.99/month
──────────────────
Photo diagnosis · SOS emergency · AI trend analysis · Treatment calculator · 
AI care chat · Up to 10 profiles · Vet-ready health reports

Your axolotl is counting on you. AxolotlCare makes sure you're ready.
```

### 14.3 Privacy Policy Requirements

AxolotlCare collects:
- Email address (auth)
- Photos (uploaded by user, stored in Supabase)
- Water parameter data
- Location (for heat alerts, only if permission granted)
- Push notification token

All data is stored securely in Supabase (EU region). Water parameter data is anonymised before use in community aggregates. Photos are stored privately by default unless user opts into community sharing.

Host your privacy policy at: `axolotlcare.app/privacy`

### 14.4 TestFlight Beta Plan

```
Week 1-4 build:   Internal testing only (your devices)
Week 5-6:         TestFlight beta — invite 20 people from r/axolotls
                  (post "looking for beta testers" in the subreddit)
Week 7:           Fix issues from beta feedback
Week 8:           App Store submission
Review time:      1-3 business days (Apple)
```

---

## 15. GTM & Launch Strategy

### 15.1 Pre-Launch (Week 7)

- [ ] Post "building an axolotl care app" update on r/axolotls — soft announcement, no app link yet
- [ ] Build email waitlist at axolotlcare.app (simple landing page)
- [ ] Connect with 3 axolotl YouTubers via DM — offer free Pro lifetime for an honest review
- [ ] Prepare the Reddit launch post (see 15.2)
- [ ] Screenshot all key screens for App Store screenshots
- [ ] Record 30-second demo video for App Store preview

### 15.2 Reddit Launch Post Template

```
Title: I built an AI care app for axolotl owners after losing my first axolotl 
to an ammonia spike I didn't understand

---

[Tell your genuine story here — why you built this]

After [story], I spent [X weeks] building AxolotlCare. It does three things:

1. Water parameter logger with safe/danger indicators (free)
2. Nitrogen cycle wizard — step by step, day by day (free — because this is 
   why most axolotls die and nobody should have to figure it out alone)
3. Heat alerts — checks your local weather forecast and pushes you a warning 
   before your tank gets dangerous (free)

For Pro ($6.99/month): photo health diagnosis, SOS emergency mode, AI trend 
analysis.

It's live on the App Store today: [link]

I'm the only developer. If something's broken or you have a feature request, 
reply here and I'll fix it this week. I mean that literally.

Download link: [App Store link]
Android coming in [2 weeks]
```

### 15.3 Post-Launch Week 1 Tasks

- Monitor r/axolotls and r/axolotl daily — answer every question by linking to your guide
- Reply to every App Store review within 24 hours
- Post in axolotl Facebook groups (Axolotl Keepers, 160K+ members)
- DM the 5 most active r/axolotls contributors — offer free Pro, ask for honest feedback
- Set up Google Alerts for "axolotl app", "axolotl care app", "axolotlcare"

---

## 16. Revenue Projections

### 16.1 Conservative Scenario

```
Month 1:   200 downloads,  10 Pro subs   = €69.90 MRR
Month 3:   600 downloads,  50 Pro subs   = €349.50 MRR
Month 6:   1,500 downloads, 200 Pro subs  = €1,398 MRR
Month 12:  4,000 downloads, 600 Pro subs  = €4,194 MRR
Month 18:  8,000 downloads, 1,500 Pro subs = €10,485 MRR = €125,820 ARR
```

### 16.2 Base Case Scenario (Reefability-comparable)

```
Month 6:   2,000 downloads,  500 Pro subs  = €3,495 MRR
Month 12:  8,000 downloads, 1,500 Pro subs  = €10,485 MRR
Month 18: 20,000 downloads, 3,500 Pro subs  = €24,465 MRR = €293,580 ARR
Month 24: 40,000 downloads, 6,000 Pro subs  = €41,940 MRR = €503,280 ARR
```

### 16.3 Cost Structure

| Cost | Monthly (at €10K MRR) |
|------|-----------------------|
| Supabase Pro | €25 |
| Claude API | ~€50 |
| OneSignal | Free (<10K users), then €9 |
| OpenWeatherMap | Free (under limit) |
| Pexels API | Free |
| App Store fee | 15% of IAP revenue (after year 1) |
| Sentry | Free tier |
| Vercel (web guides) | Free tier |
| **Total non-Apple** | **~€85/month** |

**Gross margin at €10K MRR:** ~85% after Apple's 15% cut.

---

## Appendix A — Axolotl Morph Reference

| Morph ID | Display Name | Rarity | Notes |
|---------|-------------|--------|-------|
| `leucistic` | Leucistic | Common | White body, pink gills, dark eyes |
| `golden_albino` | Golden Albino | Common | Yellow/gold body, pink eyes |
| `melanoid` | Melanoid | Common | All black, no shiny patches |
| `wild_type` | Wild Type | Common | Dark with gold speckles |
| `copper` | Copper | Uncommon | Copper/brown, red eyes |
| `axanthic` | Axanthic | Uncommon | Grey, no yellow pigment |
| `piebald` | Piebald | Uncommon | Patches of leucistic + dark |
| `mosaic` | Mosaic | Rare | Mix of 2+ colour phenotypes |
| `chimera` | Chimera | Very Rare | Two genetically distinct halves |
| `gfp` | GFP | Uncommon | Glows green under UV light |
| `firefly` | Firefly | Rare | GFP tail, non-GFP body |
| `lavender` | Lavender | Rare | Pale purple-grey |
| `enigma` | Enigma | Very Rare | Patchy white and dark pattern |

---

## Appendix B — Safe Parameter Reference Card

```
PARAMETER    SAFE RANGE      DANGER ZONE        UNIT
─────────────────────────────────────────────────────
pH           6.5 – 8.0      < 6.0 or > 8.5     pH
Ammonia      0              > 0.25              ppm
Nitrite      0              > 0.25              ppm
Nitrate      0 – 20         > 40                ppm
Temperature  15 – 20        > 22 or < 12        °C
GH           7 – 14         < 4 or > 20         dGH
KH           3 – 8          < 1 or > 12         dKH
```

---

## Appendix C — Quick Reference Commands

```bash
# Start local Supabase
supabase start

# Apply migrations
supabase db push

# Generate TypeScript types from schema
supabase gen types typescript --local > types/database.types.ts

# Deploy Edge Functions
supabase functions deploy diagnose-photo
supabase functions deploy heat-alert
supabase functions deploy weekly-aotw
supabase functions deploy revenuecat-webhook
supabase functions deploy community-report

# Start Expo dev server
npx expo start

# Build for iOS (requires Mac + Xcode)
npx expo build:ios

# Build for Android
npx expo build:android

# Submit to App Store (requires EAS account)
eas submit --platform ios
eas submit --platform android
```

---

*AxolotlCare Development Bible — v1.0*  
*Built to be the Reefability of freshwater exotic pets.*  
*Start with axolotl. Own the niche. Stack the species.*

---
