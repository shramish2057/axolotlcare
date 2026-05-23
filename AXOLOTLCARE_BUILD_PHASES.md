# AxolotlCare — Phase-by-Phase Build Guide
**From `git init` to App Store live. 30 phases. Zero gaps.**

> Every command is copy-pasteable. Every file path is exact. Every phase ends with a definition of done and a git commit. Follow phases in strict order.

---

## Phase Map

| Phase | Name | Est. Time | Core Deliverable |
|-------|------|-----------|-----------------|
| 1 | GitHub + Repo Setup | 30 min | Repo, branch strategy |
| 2 | Expo Project Scaffold | 1 hr | App running on simulator |
| 3 | Supabase Project Setup | 1 hr | DB connected, types generated |
| 4 | Core Database Schema | 2 hr | All 14 tables created |
| 5 | RLS + Indexes + Triggers + Seed | 2 hr | Security + performance + data |
| 6 | Design System | 3 hr | Tokens, fonts, base components |
| 7 | Authentication | 4 hr | Sign up, sign in, Apple, session |
| 8 | Axolotl Profile | 3 hr | Create profile, morph picker, photo |
| 9 | Parameter Logger | 4 hr | Log + live safe/danger indicators |
| 10 | Parameter History Charts | 2 hr | Time-series charts |
| 11 | Nitrogen Cycle Wizard | 4 hr | Full step machine |
| 12 | Heat Alert System | 3 hr | Weather API + Edge Function + cron |
| 13 | Care Reminders | 2 hr | Push reminder scheduling |
| 14 | Home Dashboard | 3 hr | Home screen fully wired |
| 15 | RevenueCat + Paywall | 3 hr | Subscriptions live |
| 16 | Photo Health Diagnosis | 4 hr | Claude Vision Edge Function |
| 17 | SOS Emergency Mode | 3 hr | Full emergency triage flow |
| 18 | AI Trend Analysis | 2 hr | 14-day parameter trends |
| 19 | Treatment Calculator | 2 hr | Dosage math by tank volume |
| 20 | AI Care Chat | 3 hr | Context-aware chat |
| 21 | Onboarding Flow | 4 hr | 5-step onboarding complete |
| 22 | TestFlight Beta | 2 hr | Beta testers invited |
| 23 | App Store Submission | 3 hr | iOS + Android submitted |
| 24 | Community Feed | 4 hr | Photo feed + upload |
| 25 | Tank Showcase Gallery | 3 hr | Browse by morph/size |
| 26 | Axolotl of the Week | 4 hr | AOTW full system + cron |
| 27 | Achievement System | 3 hr | Badges + unlock animations |
| 28 | Birthday Tracker | 2 hr | Birthday push notifications |
| 29 | Guides Library | 4 hr | Full knowledge base |
| 30 | Web Version + SEO | 4 hr | axolotlcare.app/guides live |

---

## Phase 1 — GitHub Repository Setup

**Goal:** Version-controlled repo, branch strategy, protected main.
**Time:** 30 minutes
**Prerequisites:** GitHub account, Git installed locally

### Step 1: Create GitHub repository

Go to github.com → New repository:
- Name: `axolotlcare`
- Description: `AI-powered axolotl care companion — iOS & Android`
- Visibility: Private
- Do NOT initialise with README, .gitignore, or licence

### Step 2: Initialise locally

```bash
mkdir axolotlcare && cd axolotlcare
git init
git remote add origin https://github.com/YOUR_USERNAME/axolotlcare.git
```

### Step 3: Create initial files

```bash
cat > README.md << 'EOF'
# AxolotlCare
AI-powered axolotl care companion for iOS and Android.
Built with React Native (Expo) + Supabase + Claude AI.
EOF

cat > .gitignore << 'EOF'
node_modules/
.expo/
dist/
.env.local
.env.*.local
*.jks
*.p8
*.p12
*.key
*.mobileprovision
*.orig.*
web-build/
EOF

git add .
git commit -m "chore: initial repository setup"
git push -u origin main
```

### Step 4: Create branch strategy

```bash
# Create develop branch — all feature branches merge here
git checkout -b develop
git push -u origin develop

# Branch naming going forward:
# feature/phase-N-description  ← one per phase
# hotfix/description           ← urgent production fixes only
```

### Step 5: Protect main on GitHub

GitHub → repository → Settings → Branches → Add branch protection rule:
- Pattern: `main`
- ✅ Require a pull request before merging
- ✅ Require at least 1 approval (or 0 if solo)
- ✅ Do not allow bypassing the above settings

### Phase 1 Definition of Done
- [ ] Repository exists at github.com/YOUR_USERNAME/axolotlcare
- [ ] `main` and `develop` branches pushed
- [ ] `main` branch protection rule active
- [ ] `.gitignore` excludes all secrets and build artefacts

---

## Phase 2 — Expo Project Scaffold

**Goal:** React Native app running on iOS simulator and Android emulator with correct folder structure.
**Time:** 1 hour
**Prerequisites:** Node.js 18+, Xcode 15+ (Mac), Android Studio, Phase 1 complete

### Step 1: Create feature branch

```bash
cd axolotlcare
git checkout develop
git checkout -b feature/phase-2-expo-scaffold
```

### Step 2: Scaffold Expo project inside the repo

```bash
npx create-expo-app@latest . --template expo-template-blank-typescript
# When asked "The directory is not empty. Continue?" → Yes
```

### Step 3: Install Expo Router

```bash
npx expo install expo-router react-native-safe-area-context react-native-screens
```

### Step 4: Install all project dependencies in one go

```bash
npx expo install \
  @supabase/supabase-js \
  react-native-url-polyfill \
  expo-secure-store \
  react-native-reanimated \
  lottie-react-native \
  @shopify/flash-list \
  expo-image \
  expo-image-picker \
  expo-camera \
  expo-haptics \
  expo-location \
  expo-notifications \
  expo-apple-authentication \
  react-native-purchases \
  @sentry/react-native

npm install zustand immer react-native-chart-kit react-native-svg
npm install @expo-google-fonts/dm-serif-display @expo-google-fonts/plus-jakarta-sans expo-font
```

### Step 5: Configure app.json

Replace the entire generated `app.json`:

```json
{
  "expo": {
    "name": "AxolotlCare",
    "slug": "axolotlcare",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "axolotlcare",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/images/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#0A4F54"
    },
    "ios": {
      "supportsTablet": false,
      "bundleIdentifier": "app.axolotlcare.ios",
      "buildNumber": "1",
      "infoPlist": {
        "NSCameraUsageDescription": "AxolotlCare uses your camera to photograph your axolotl for AI health diagnosis.",
        "NSPhotoLibraryUsageDescription": "AxolotlCare needs photo library access to upload axolotl photos.",
        "NSLocationWhenInUseUsageDescription": "AxolotlCare uses your location to send heat alerts when temperatures threaten your tank."
      }
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png",
        "backgroundColor": "#0A4F54"
      },
      "package": "app.axolotlcare.android",
      "versionCode": 1,
      "permissions": ["CAMERA","READ_EXTERNAL_STORAGE","WRITE_EXTERNAL_STORAGE","ACCESS_FINE_LOCATION","RECEIVE_BOOT_COMPLETED","VIBRATE"]
    },
    "plugins": [
      "expo-router",
      "expo-secure-store",
      ["expo-notifications", { "icon": "./assets/images/notification-icon.png", "color": "#0A4F54" }],
      ["expo-camera", { "cameraPermission": "AxolotlCare needs camera access." }],
      ["expo-location", { "locationWhenInUsePermission": "AxolotlCare uses location for heat alerts." }],
      "@sentry/react-native/expo"
    ],
    "experiments": { "typedRoutes": true }
  }
}
```

### Step 6: Configure babel.config.js

```javascript
// babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['react-native-reanimated/plugin'],
  };
};
```

### Step 7: Create complete folder structure

```bash
mkdir -p \
  app/\(auth\) app/\(tabs\) app/onboarding \
  app/axolotl app/diagnosis app/community/post \
  components/ui components/tank components/health \
  components/community components/profile components/animations \
  lib store types constants \
  assets/lottie assets/images assets/icons \
  supabase/migrations \
  supabase/functions/diagnose-photo \
  supabase/functions/heat-alert \
  supabase/functions/weekly-aotw \
  supabase/functions/revenuecat-webhook \
  supabase/functions/sos-triage \
  supabase/functions/care-chat \
  supabase/functions/birthday-notifier \
  supabase/functions/community-report
```

### Step 8: Create .env.local

```bash
cat > .env.local << 'EOF'
# Supabase — get from supabase.com → project → Settings → API
EXPO_PUBLIC_SUPABASE_URL=https://PLACEHOLDER.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=PLACEHOLDER

# Anthropic — NEVER put in mobile app binary; only used by Edge Functions
ANTHROPIC_API_KEY=sk-ant-PLACEHOLDER

# RevenueCat — get from app.revenuecat.com
EXPO_PUBLIC_REVENUECAT_IOS_KEY=appl_PLACEHOLDER
EXPO_PUBLIC_REVENUECAT_ANDROID_KEY=goog_PLACEHOLDER

# OpenWeatherMap — get from openweathermap.org/api (free tier)
EXPO_PUBLIC_OPENWEATHER_KEY=PLACEHOLDER

# Pexels — get from pexels.com/api (free, commercial use allowed)
EXPO_PUBLIC_PEXELS_KEY=PLACEHOLDER

# OneSignal — get from onesignal.com (free tier)
EXPO_PUBLIC_ONESIGNAL_APP_ID=PLACEHOLDER

# Sentry — get from sentry.io (free tier)
EXPO_PUBLIC_SENTRY_DSN=PLACEHOLDER
EOF
```

### Step 9: Create placeholder Expo Router screens

```bash
# Root layout
cat > app/_layout.tsx << 'EOF'
import { Stack } from 'expo-router'
export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="sos" options={{ presentation: 'fullScreenModal' }} />
      <Stack.Screen name="paywall" options={{ presentation: 'modal' }} />
    </Stack>
  )
}
EOF

# Auth layout
mkdir -p "app/(auth)"
cat > "app/(auth)/_layout.tsx" << 'EOF'
import { Stack } from 'expo-router'
export default function AuthLayout() {
  return <Stack screenOptions={{ headerShown: false }} />
}
EOF

cat > "app/(auth)/sign-in.tsx" << 'EOF'
import { View, Text } from 'react-native'
export default function SignIn() {
  return <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}><Text>Sign In — Phase 7</Text></View>
}
EOF

cat > "app/(auth)/sign-up.tsx" << 'EOF'
import { View, Text } from 'react-native'
export default function SignUp() {
  return <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}><Text>Sign Up — Phase 7</Text></View>
}
EOF

cat > "app/(auth)/forgot-password.tsx" << 'EOF'
import { View, Text } from 'react-native'
export default function ForgotPassword() {
  return <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}><Text>Forgot Password — Phase 7</Text></View>
}
EOF

# Tabs layout
mkdir -p "app/(tabs)"
cat > "app/(tabs)/_layout.tsx" << 'EOF'
import { Tabs } from 'expo-router'
export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index"     options={{ title: 'Home' }} />
      <Tabs.Screen name="tank"      options={{ title: 'Tank' }} />
      <Tabs.Screen name="community" options={{ title: 'Community' }} />
      <Tabs.Screen name="guides"    options={{ title: 'Guides' }} />
      <Tabs.Screen name="profile"   options={{ title: 'Profile' }} />
    </Tabs>
  )
}
EOF

for screen in index tank community guides profile; do
  cat > "app/(tabs)/$screen.tsx" << INNEREOF
import { View, Text } from 'react-native'
export default function Screen() {
  return <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}><Text>$screen — coming soon</Text></View>
}
INNEREOF
done

cat > app/sos.tsx << 'EOF'
import { View, Text } from 'react-native'
export default function SOS() {
  return <View style={{ flex:1, backgroundColor:'#0D1B2A', justifyContent:'center', alignItems:'center' }}><Text style={{ color:'white' }}>SOS — Phase 17</Text></View>
}
EOF

cat > app/paywall.tsx << 'EOF'
import { View, Text } from 'react-native'
export default function Paywall() {
  return <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}><Text>Paywall — Phase 15</Text></View>
}
EOF

mkdir -p app/axolotl
cat > app/axolotl/new.tsx << 'EOF'
import { View, Text } from 'react-native'
export default function NewAxolotl() {
  return <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}><Text>New Axolotl — Phase 8</Text></View>
}
EOF
```

### Step 10: Verify the app runs

```bash
npx expo start --ios
# Expected: app opens in simulator, shows placeholder tab screens
# No errors in console
```

### Step 11: Commit and merge

```bash
git add .
git commit -m "feat: phase 2 - expo scaffold with complete folder structure and dependencies"
git push origin feature/phase-2-expo-scaffold
# Create PR on GitHub → merge to develop
```

### Phase 2 Definition of Done
- [ ] `npx expo start --ios` shows tabs without error
- [ ] `npx expo start --android` shows tabs without error
- [ ] All folders created and committed
- [ ] `.env.local` created (with placeholder values, NOT committed)
- [ ] `npx tsc --noEmit` returns no errors

---

## Phase 3 — Supabase Project Setup

**Goal:** Supabase project created, Supabase client in the app, TypeScript types generated.
**Time:** 1 hour
**Prerequisites:** Supabase account at supabase.com, Phase 2 complete

### Step 1: Create Supabase project

supabase.com → New project:
- Organisation: personal (or create one)
- Name: `axolotlcare`
- Database password: generate a strong one → save it somewhere safe
- Region: `eu-central-1` (Frankfurt) for EU users, `us-east-1` for US
- Wait ~2 minutes for provisioning

### Step 2: Copy API credentials

In Supabase dashboard → Settings → API:
- Copy **Project URL** → paste into `.env.local` as `EXPO_PUBLIC_SUPABASE_URL`
- Copy **anon public** key → paste into `.env.local` as `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- Copy **service_role** key → save separately (used only in Edge Functions, never in the app)

### Step 3: Install Supabase CLI

```bash
npm install -g supabase
supabase login
# Opens browser, complete OAuth

# Link CLI to your project
supabase init
supabase link --project-ref YOUR_PROJECT_ID
# Project ID is the subdomain: https://YOUR_PROJECT_ID.supabase.co
```

### Step 4: Create Supabase client

```typescript
// lib/supabase.ts
import 'react-native-url-polyfill/auto'
import { createClient } from '@supabase/supabase-js'
import * as SecureStore from 'expo-secure-store'
import type { Database } from '@/types/database.types'

// Store auth session securely on device (not AsyncStorage)
const ExpoSecureStoreAdapter = {
  getItem:    (key: string) => SecureStore.getItemAsync(key),
  setItem:    (key: string, value: string) => SecureStore.setItemAsync(key, value),
  removeItem: (key: string) => SecureStore.deleteItemAsync(key),
}

export const supabase = createClient<Database>(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      storage:         ExpoSecureStoreAdapter,
      autoRefreshToken: true,
      persistSession:  true,
      detectSessionInUrl: false,  // required for React Native
    },
  }
)
```

### Step 5: Create placeholder types file

```typescript
// types/database.types.ts
// Placeholder — will be replaced by auto-generated types after Phase 4
export type Database = {
  public: { Tables: {}; Views: {}; Functions: {} }
}
```

### Step 6: Configure Supabase Auth settings

Supabase dashboard → Authentication → URL Configuration:
- Site URL: `axolotlcare://`
- Redirect URLs: add `exp://localhost:8081/--/`

Supabase dashboard → Authentication → Settings:
- Email confirmation: **OFF** for development. Enable before App Store submission.

### Step 7: Verify connection works

Temporarily add to `app/(tabs)/index.tsx`:

```typescript
import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'

useEffect(() => {
  supabase.from('profiles').select('count').then(({ error }) => {
    console.log(error ? 'Connected (table not yet created)' : 'Connected')
  })
}, [])
```

Expected console output: `Connected (table not yet created)`

Remove this test code after verifying. Do not commit it.

### Step 8: Commit

```bash
git checkout -b feature/phase-3-supabase-setup
git add lib/supabase.ts types/database.types.ts
git commit -m "feat: phase 3 - supabase client with SecureStore session adapter"
git push origin feature/phase-3-supabase-setup
```

Merge to develop.

### Phase 3 Definition of Done
- [ ] Supabase project created and provisioned
- [ ] `.env.local` has real `SUPABASE_URL` and `SUPABASE_ANON_KEY`
- [ ] `lib/supabase.ts` created with `<Database>` type parameter
- [ ] Console confirms connection (correct error about missing table)
- [ ] `supabase link` succeeds

---

## Phase 4 — Core Database Schema

**Goal:** All 14 tables, all enums, all foreign keys — applied via Supabase CLI migrations.
**Time:** 2 hours
**Prerequisites:** Phase 3 complete

### Step 1: Feature branch

```bash
git checkout develop && git checkout -b feature/phase-4-database-schema
```

### Step 2: Create the migration file

```bash
supabase migration new initial_schema
# Creates: supabase/migrations/[timestamp]_initial_schema.sql
```

Open that file and paste the complete SQL:

```sql
-- ============================================================
-- AxolotlCare Initial Schema
-- Run: supabase db push
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ENUMS
CREATE TYPE public.axolotl_morph AS ENUM (
  'leucistic','golden_albino','melanoid','wild_type','copper',
  'axanthic','piebald','mosaic','chimera','gfp','firefly',
  'lavender','enigma','unknown'
);
CREATE TYPE public.axolotl_sex          AS ENUM ('male','female','unknown');
CREATE TYPE public.health_log_type      AS ENUM ('photo_diagnosis','sos_emergency','manual_note','vet_visit');
CREATE TYPE public.health_log_outcome   AS ENUM ('resolved','monitoring','ongoing','lost','unknown');
CREATE TYPE public.cycle_method         AS ENUM ('fish_in','fishless_ammonia','seeded');
CREATE TYPE public.alert_type           AS ENUM ('heat_warning','heat_critical','ammonia_spike','nitrite_spike','parameter_anomaly','water_change_due','filter_maintenance_due','follow_up_due','birthday');
CREATE TYPE public.alert_severity       AS ENUM ('info','warning','critical');
CREATE TYPE public.post_type            AS ENUM ('photo','tank_showcase','milestone','health_update');
CREATE TYPE public.guide_difficulty     AS ENUM ('beginner','intermediate','expert');
CREATE TYPE public.guide_category       AS ENUM ('water_chemistry','tank_setup','feeding','disease','breeding','seasonal','equipment','morphs');

-- PROFILES (extends auth.users)
CREATE TABLE public.profiles (
  id                      UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username                TEXT UNIQUE NOT NULL CHECK (length(username) BETWEEN 3 AND 30 AND username ~ '^[a-zA-Z0-9_]+$'),
  display_name            TEXT NOT NULL CHECK (length(display_name) BETWEEN 1 AND 50),
  avatar_url              TEXT,
  bio                     TEXT CHECK (length(bio) <= 200),
  keeper_since            DATE DEFAULT CURRENT_DATE,
  location                TEXT CHECK (length(location) <= 100),
  subscription_tier       TEXT NOT NULL DEFAULT 'free' CHECK (subscription_tier IN ('free','pro')),
  subscription_expires_at TIMESTAMPTZ,
  revenuecat_user_id      TEXT,
  onesignal_player_id     TEXT,
  total_parameter_logs    INTEGER NOT NULL DEFAULT 0,
  total_axolotls_kept     INTEGER NOT NULL DEFAULT 0,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- AXOLOTLS
CREATE TABLE public.axolotls (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id              UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name                  TEXT NOT NULL CHECK (length(name) BETWEEN 1 AND 50),
  morph                 public.axolotl_morph NOT NULL DEFAULT 'unknown',
  sex                   public.axolotl_sex NOT NULL DEFAULT 'unknown',
  color_notes           TEXT CHECK (length(color_notes) <= 200),
  hatch_date            DATE,
  adoption_date         DATE,
  passed_date           DATE,
  tank_name             TEXT CHECK (length(tank_name) <= 50),
  tank_volume_liters    NUMERIC(6,1) CHECK (tank_volume_liters BETWEEN 1 AND 5000),
  has_filter            BOOLEAN DEFAULT TRUE,
  has_chiller           BOOLEAN DEFAULT FALSE,
  substrate_type        TEXT CHECK (substrate_type IN ('bare','sand','smooth_pebble','tile','other')),
  photos                TEXT[] DEFAULT '{}',
  primary_photo         TEXT,
  is_public             BOOLEAN NOT NULL DEFAULT TRUE,
  last_parameter_log_at TIMESTAMPTZ,
  parameter_log_count   INTEGER NOT NULL DEFAULT 0,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- WATER PARAMETERS
CREATE TABLE public.water_parameters (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  axolotl_id            UUID NOT NULL REFERENCES public.axolotls(id) ON DELETE CASCADE,
  owner_id              UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  logged_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ph                    NUMERIC(4,2)  CHECK (ph BETWEEN 0 AND 14),
  ammonia               NUMERIC(6,3)  CHECK (ammonia BETWEEN 0 AND 20),
  nitrite               NUMERIC(6,3)  CHECK (nitrite BETWEEN 0 AND 20),
  nitrate               NUMERIC(6,1)  CHECK (nitrate BETWEEN 0 AND 500),
  temperature           NUMERIC(5,2)  CHECK (temperature BETWEEN 0 AND 40),
  gh                    NUMERIC(5,1)  CHECK (gh BETWEEN 0 AND 100),
  kh                    NUMERIC(5,1)  CHECK (kh BETWEEN 0 AND 100),
  tds                   NUMERIC(7,1)  CHECK (tds BETWEEN 0 AND 5000),
  dissolved_oxygen      NUMERIC(5,2)  CHECK (dissolved_oxygen >= 0),
  safety_score          INTEGER       CHECK (safety_score BETWEEN 0 AND 100),
  safety_flags          TEXT[],
  ai_insight            TEXT,
  notes                 TEXT          CHECK (length(notes) <= 1000),
  water_change_percent  NUMERIC(5,2)  CHECK (water_change_percent BETWEEN 0 AND 100),
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- HEALTH LOGS
CREATE TABLE public.health_logs (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  axolotl_id            UUID NOT NULL REFERENCES public.axolotls(id) ON DELETE CASCADE,
  owner_id              UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type                  public.health_log_type NOT NULL,
  logged_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  symptoms              TEXT[] DEFAULT '{}',
  ai_diagnosis          JSONB,
  photos                TEXT[] DEFAULT '{}',
  treatment_given       TEXT CHECK (length(treatment_given) <= 2000),
  treatment_started_at  TIMESTAMPTZ,
  outcome               public.health_log_outcome DEFAULT 'unknown',
  outcome_notes         TEXT CHECK (length(outcome_notes) <= 1000),
  resolved_at           TIMESTAMPTZ,
  follow_up_at          TIMESTAMPTZ,
  follow_up_sent        BOOLEAN DEFAULT FALSE,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- CYCLE SESSIONS
CREATE TABLE public.cycle_sessions (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  axolotl_id    UUID NOT NULL REFERENCES public.axolotls(id) ON DELETE CASCADE,
  owner_id      UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  method        public.cycle_method NOT NULL DEFAULT 'fishless_ammonia',
  started_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at  TIMESTAMPTZ,
  current_step  INTEGER NOT NULL DEFAULT 1 CHECK (current_step >= 1),
  step_data     JSONB NOT NULL DEFAULT '[]',
  ai_notes      TEXT,
  is_completed  BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- TANK ALERTS
CREATE TABLE public.tank_alerts (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  axolotl_id    UUID NOT NULL REFERENCES public.axolotls(id) ON DELETE CASCADE,
  owner_id      UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  alert_type    public.alert_type NOT NULL,
  severity      public.alert_severity NOT NULL DEFAULT 'warning',
  title         TEXT NOT NULL,
  message       TEXT NOT NULL,
  action_url    TEXT,
  triggered_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  push_sent     BOOLEAN NOT NULL DEFAULT FALSE,
  push_sent_at  TIMESTAMPTZ,
  read          BOOLEAN NOT NULL DEFAULT FALSE,
  read_at       TIMESTAMPTZ,
  resolved      BOOLEAN NOT NULL DEFAULT FALSE,
  resolved_at   TIMESTAMPTZ,
  metadata      JSONB DEFAULT '{}'
);

-- COMMUNITY POSTS
CREATE TABLE public.community_posts (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  axolotl_id      UUID REFERENCES public.axolotls(id) ON DELETE SET NULL,
  type            public.post_type NOT NULL DEFAULT 'photo',
  caption         TEXT CHECK (length(caption) <= 500),
  photos          TEXT[] NOT NULL DEFAULT '{}' CHECK (array_length(photos,1) <= 10),
  likes_count     INTEGER NOT NULL DEFAULT 0,
  comments_count  INTEGER NOT NULL DEFAULT 0,
  is_visible      BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.post_likes (
  post_id     UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (post_id, user_id)
);

CREATE TABLE public.post_comments (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id     UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  author_id   UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content     TEXT NOT NULL CHECK (length(content) BETWEEN 1 AND 500),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- AOTW
CREATE TABLE public.aotw_nominations (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  axolotl_id        UUID NOT NULL REFERENCES public.axolotls(id) ON DELETE CASCADE,
  nominator_id      UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  nomination_note   TEXT CHECK (length(nomination_note) <= 500),
  nominated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  considered        BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE public.aotw_winners (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  axolotl_id            UUID NOT NULL REFERENCES public.axolotls(id) ON DELETE CASCADE,
  owner_id              UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  week_start            DATE NOT NULL UNIQUE,
  feature_story         TEXT NOT NULL CHECK (length(feature_story) BETWEEN 50 AND 1000),
  feature_photo         TEXT NOT NULL,
  notification_sent     BOOLEAN NOT NULL DEFAULT FALSE,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ACHIEVEMENTS
CREATE TABLE public.achievement_definitions (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  description TEXT NOT NULL,
  category    TEXT NOT NULL CHECK (category IN ('care','community','milestone','health')),
  lottie_key  TEXT,
  icon_name   TEXT,
  sort_order  INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE public.user_achievements (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id      UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  achievement_id  TEXT NOT NULL REFERENCES public.achievement_definitions(id),
  axolotl_id      UUID REFERENCES public.axolotls(id) ON DELETE SET NULL,
  earned_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notified        BOOLEAN NOT NULL DEFAULT FALSE,
  UNIQUE (profile_id, achievement_id)
);

-- GUIDES
CREATE TABLE public.guides (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug                  TEXT UNIQUE NOT NULL,
  title                 TEXT NOT NULL CHECK (length(title) BETWEEN 5 AND 100),
  excerpt               TEXT NOT NULL CHECK (length(excerpt) BETWEEN 10 AND 300),
  category              public.guide_category NOT NULL,
  difficulty            public.guide_difficulty NOT NULL DEFAULT 'beginner',
  content_markdown      TEXT NOT NULL,
  reading_time_minutes  INTEGER NOT NULL DEFAULT 5 CHECK (reading_time_minutes > 0),
  cover_pexels_id       TEXT,
  cover_url             TEXT,
  meta_title            TEXT,
  meta_description      TEXT,
  published             BOOLEAN NOT NULL DEFAULT FALSE,
  published_at          TIMESTAMPTZ,
  featured              BOOLEAN NOT NULL DEFAULT FALSE,
  view_count            INTEGER NOT NULL DEFAULT 0,
  bookmark_count        INTEGER NOT NULL DEFAULT 0,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.guide_bookmarks (
  guide_id    UUID NOT NULL REFERENCES public.guides(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (guide_id, user_id)
);
```

### Step 3: Apply the migration

```bash
supabase db push
# Expected: "Applying migration ... done"
# If it fails: check your Supabase project is linked correctly
```

### Step 4: Generate TypeScript types from the live schema

```bash
supabase gen types typescript --linked > types/database.types.ts
```

This overwrites the placeholder with real generated types. Commit the result.

### Step 5: Verify in dashboard

Supabase dashboard → Table Editor. You should see all 14 tables listed.

### Step 6: Commit

```bash
git add supabase/migrations/ types/database.types.ts
git commit -m "feat: phase 4 - complete database schema with all 14 tables and enums"
git push origin feature/phase-4-database-schema
```

Merge to develop.

### Phase 4 Definition of Done
- [ ] `supabase db push` succeeds without errors
- [ ] All 14 tables visible in Supabase Table Editor
- [ ] All 10 enum types visible in Supabase → Database → Types
- [ ] `types/database.types.ts` is real generated code (not placeholder)
- [ ] No TypeScript errors: `npx tsc --noEmit`

---

## Phase 5 — RLS, Indexes, Triggers & Seed Data

**Goal:** Row-level security on every table, performance indexes for all hot queries, triggers for automated logic, achievement definitions and guide stubs seeded.
**Time:** 2 hours
**Prerequisites:** Phase 4 complete

### Step 1: Feature branch

```bash
git checkout develop && git checkout -b feature/phase-5-rls-indexes-triggers
```

### Step 2: RLS migration

```bash
supabase migration new rls_policies
```

Paste into the new migration file:

```sql
-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.axolotls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.water_parameters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cycle_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tank_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aotw_nominations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aotw_winners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievement_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guide_bookmarks ENABLE ROW LEVEL SECURITY;

-- PROFILES: anyone can read, only owner can modify
CREATE POLICY "profiles_public_read" ON public.profiles FOR SELECT USING (TRUE);
CREATE POLICY "profiles_self_insert"  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_self_update"  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- AXOLOTLS: public ones readable by all, private only by owner
CREATE POLICY "axolotls_read"   ON public.axolotls FOR SELECT USING (is_public OR auth.uid() = owner_id);
CREATE POLICY "axolotls_insert" ON public.axolotls FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "axolotls_update" ON public.axolotls FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "axolotls_delete" ON public.axolotls FOR DELETE USING (auth.uid() = owner_id);

-- PRIVATE DATA: owner only
CREATE POLICY "water_params_owner" ON public.water_parameters
  FOR ALL USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "health_logs_owner" ON public.health_logs
  FOR ALL USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "cycle_sessions_owner" ON public.cycle_sessions
  FOR ALL USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "tank_alerts_owner" ON public.tank_alerts
  FOR ALL USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);

-- COMMUNITY: visible posts readable by all
CREATE POLICY "posts_public_read"   ON public.community_posts FOR SELECT USING (is_visible);
CREATE POLICY "posts_owner_insert"  ON public.community_posts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "posts_owner_update"  ON public.community_posts FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "posts_owner_delete"  ON public.community_posts FOR DELETE USING (auth.uid() = author_id);

CREATE POLICY "post_likes_read"   ON public.post_likes FOR SELECT USING (TRUE);
CREATE POLICY "post_likes_insert" ON public.post_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "post_likes_delete" ON public.post_likes FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "post_comments_read"   ON public.post_comments FOR SELECT USING (TRUE);
CREATE POLICY "post_comments_insert" ON public.post_comments FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "post_comments_delete" ON public.post_comments FOR DELETE USING (auth.uid() = author_id);

CREATE POLICY "aotw_nominations_owner" ON public.aotw_nominations
  FOR ALL USING (auth.uid() = nominator_id) WITH CHECK (auth.uid() = nominator_id);

CREATE POLICY "aotw_winners_public_read" ON public.aotw_winners FOR SELECT USING (TRUE);

CREATE POLICY "achievement_defs_public_read" ON public.achievement_definitions FOR SELECT USING (TRUE);
CREATE POLICY "user_achievements_read"       ON public.user_achievements FOR SELECT USING (TRUE);

CREATE POLICY "guides_published_read" ON public.guides FOR SELECT USING (published);
CREATE POLICY "guide_bookmarks_owner" ON public.guide_bookmarks
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
```

### Step 3: Indexes migration

```bash
supabase migration new indexes
```

```sql
-- PROFILES
CREATE INDEX idx_profiles_username     ON public.profiles(username);
CREATE INDEX idx_profiles_subscription ON public.profiles(subscription_tier);

-- AXOLOTLS
CREATE INDEX idx_axolotls_owner  ON public.axolotls(owner_id);
CREATE INDEX idx_axolotls_public ON public.axolotls(is_public) WHERE is_public;
CREATE INDEX idx_axolotls_morph  ON public.axolotls(morph);

-- WATER PARAMETERS — highest-traffic index in the app
CREATE INDEX idx_water_params_axolotl_time ON public.water_parameters(axolotl_id, logged_at DESC);
CREATE INDEX idx_water_params_owner_time   ON public.water_parameters(owner_id, logged_at DESC);
CREATE INDEX idx_water_params_time         ON public.water_parameters(logged_at DESC);

-- HEALTH LOGS
CREATE INDEX idx_health_logs_axolotl  ON public.health_logs(axolotl_id, logged_at DESC);
CREATE INDEX idx_health_logs_owner    ON public.health_logs(owner_id);
CREATE INDEX idx_health_logs_followup ON public.health_logs(follow_up_at)
  WHERE follow_up_at IS NOT NULL AND NOT follow_up_sent;

-- CYCLE SESSIONS
CREATE INDEX idx_cycle_sessions_axolotl ON public.cycle_sessions(axolotl_id);
CREATE INDEX idx_cycle_sessions_active  ON public.cycle_sessions(owner_id) WHERE NOT is_completed;

-- TANK ALERTS
CREATE INDEX idx_tank_alerts_unread  ON public.tank_alerts(owner_id, triggered_at DESC) WHERE NOT resolved;
CREATE INDEX idx_tank_alerts_pending ON public.tank_alerts(triggered_at) WHERE NOT push_sent;

-- COMMUNITY
CREATE INDEX idx_community_posts_feed    ON public.community_posts(created_at DESC) WHERE is_visible;
CREATE INDEX idx_community_posts_author  ON public.community_posts(author_id);
CREATE INDEX idx_community_posts_axolotl ON public.community_posts(axolotl_id);
CREATE INDEX idx_post_likes_post         ON public.post_likes(post_id);
CREATE INDEX idx_post_comments_post      ON public.post_comments(post_id, created_at);

-- AOTW
CREATE INDEX idx_aotw_nominations_pending ON public.aotw_nominations(nominated_at DESC) WHERE NOT considered;
CREATE INDEX idx_aotw_winners_week        ON public.aotw_winners(week_start DESC);

-- ACHIEVEMENTS
CREATE INDEX idx_user_achievements_profile    ON public.user_achievements(profile_id);
CREATE INDEX idx_user_achievements_unnotified ON public.user_achievements(profile_id) WHERE NOT notified;

-- GUIDES — full-text search index is critical for Phase 29
CREATE INDEX idx_guides_published ON public.guides(published_at DESC) WHERE published;
CREATE INDEX idx_guides_category  ON public.guides(category) WHERE published;
CREATE INDEX idx_guides_featured  ON public.guides(featured) WHERE featured AND published;
CREATE INDEX idx_guides_fts ON public.guides
  USING gin(to_tsvector('english', title || ' ' || excerpt || ' ' || content_markdown));

CREATE INDEX idx_guide_bookmarks_user ON public.guide_bookmarks(user_id);
```

### Step 4: Triggers migration

```bash
supabase migration new triggers
```

```sql
-- updated_at helper (applied to multiple tables)
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$;

CREATE TRIGGER t_profiles_updated_at     BEFORE UPDATE ON public.profiles      FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER t_axolotls_updated_at     BEFORE UPDATE ON public.axolotls      FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER t_health_logs_updated_at  BEFORE UPDATE ON public.health_logs   FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER t_cycle_sessions_updated  BEFORE UPDATE ON public.cycle_sessions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER t_community_posts_updated BEFORE UPDATE ON public.community_posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER t_guides_updated_at       BEFORE UPDATE ON public.guides         FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Auto-create profile row when user signs up (critical — must never fail)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _username TEXT;
  _display  TEXT;
  _counter  INTEGER := 0;
BEGIN
  _username := LOWER(REGEXP_REPLACE(SPLIT_PART(NEW.email, '@', 1), '[^a-zA-Z0-9_]', '', 'g'))
               || '_' || SUBSTRING(NEW.id::TEXT, 1, 4);
  _display  := COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1));
  -- Handle username conflicts
  WHILE EXISTS (SELECT 1 FROM public.profiles WHERE username = _username) LOOP
    _counter  := _counter + 1;
    _username := _username || _counter::TEXT;
  END LOOP;
  INSERT INTO public.profiles (id, username, display_name)
  VALUES (NEW.id, _username, _display);
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update axolotl + profile stats after each parameter log
CREATE OR REPLACE FUNCTION public.update_axolotl_parameter_stats()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  UPDATE public.axolotls
  SET last_parameter_log_at = NEW.logged_at,
      parameter_log_count   = parameter_log_count + 1,
      updated_at            = NOW()
  WHERE id = NEW.axolotl_id;

  UPDATE public.profiles
  SET total_parameter_logs = total_parameter_logs + 1
  WHERE id = NEW.owner_id;
  RETURN NEW;
END; $$;

CREATE TRIGGER t_after_water_param_insert
  AFTER INSERT ON public.water_parameters
  FOR EACH ROW EXECUTE FUNCTION public.update_axolotl_parameter_stats();

-- Maintain post like count
CREATE OR REPLACE FUNCTION public.update_post_likes_count()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.community_posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
  ELSE
    UPDATE public.community_posts SET likes_count = GREATEST(0, likes_count - 1) WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END; $$;

CREATE TRIGGER t_post_likes_count
  AFTER INSERT OR DELETE ON public.post_likes
  FOR EACH ROW EXECUTE FUNCTION public.update_post_likes_count();

-- Maintain post comment count
CREATE OR REPLACE FUNCTION public.update_post_comments_count()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.community_posts SET comments_count = comments_count + 1 WHERE id = NEW.post_id;
  ELSE
    UPDATE public.community_posts SET comments_count = GREATEST(0, comments_count - 1) WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END; $$;

CREATE TRIGGER t_post_comments_count
  AFTER INSERT OR DELETE ON public.post_comments
  FOR EACH ROW EXECUTE FUNCTION public.update_post_comments_count();

-- Maintain guide bookmark count
CREATE OR REPLACE FUNCTION public.update_guide_bookmark_count()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.guides SET bookmark_count = bookmark_count + 1 WHERE id = NEW.guide_id;
  ELSE
    UPDATE public.guides SET bookmark_count = GREATEST(0, bookmark_count - 1) WHERE id = OLD.guide_id;
  END IF;
  RETURN NULL;
END; $$;

CREATE TRIGGER t_guide_bookmark_count
  AFTER INSERT OR DELETE ON public.guide_bookmarks
  FOR EACH ROW EXECUTE FUNCTION public.update_guide_bookmark_count();

-- Check achievements after parameter log
CREATE OR REPLACE FUNCTION public.check_achievements_after_param_log()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE _count INTEGER;
BEGIN
  -- First log
  SELECT parameter_log_count INTO _count FROM public.axolotls WHERE id = NEW.axolotl_id;
  IF _count = 1 THEN
    INSERT INTO public.user_achievements (profile_id, achievement_id)
    VALUES (NEW.owner_id, 'first_log') ON CONFLICT DO NOTHING;
  END IF;
  -- Water Wizard: 30 logs in 60 days
  SELECT COUNT(*) INTO _count FROM public.water_parameters
  WHERE owner_id = NEW.owner_id AND logged_at >= NOW() - INTERVAL '60 days';
  IF _count >= 30 THEN
    INSERT INTO public.user_achievements (profile_id, achievement_id)
    VALUES (NEW.owner_id, 'water_wizard') ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END; $$;

CREATE TRIGGER t_check_achievements_param
  AFTER INSERT ON public.water_parameters
  FOR EACH ROW EXECUTE FUNCTION public.check_achievements_after_param_log();
```

### Step 5: Seed data migration

```bash
supabase migration new seed_data
```

```sql
-- Achievement definitions (10 total)
INSERT INTO public.achievement_definitions (id, name, description, category, lottie_key, sort_order) VALUES
  ('first_log',            'First Reading',        'Logged your first water parameters.',                         'care',      'achievement-burst', 1),
  ('cycle_complete',       'Cycle Complete',        'Successfully cycled your tank.',                              'care',      'achievement-burst', 2),
  ('water_wizard',         'Water Wizard',           'Logged parameters 30 times in 60 days.',                    'care',      'achievement-burst', 3),
  ('1_year_keeper',        '1 Year Keeper',          'Your axolotl has thrived in your care for a full year.',    'milestone', 'achievement-burst', 4),
  ('emergency_survivor',   'Emergency Survivor',     'Used SOS mode and your axolotl recovered.',                 'health',    'achievement-burst', 5),
  ('community_contributor','Community Contributor',  'Shared your first photo in the community.',                 'community', 'achievement-burst', 6),
  ('aotw_winner',          'Featured Keeper',        'Your axolotl was Axolotl of the Week.',                     'community', 'aotw-sparkle',     7),
  ('rare_morph',           'Rare Find',              'You keep a rare morph (mosaic, chimera, or firefly).',       'milestone', 'achievement-burst', 8),
  ('first_breeding',       'First Spawn',            'Successfully bred your axolotls.',                          'milestone', 'achievement-burst', 9),
  ('sos_responder',        'Quick Responder',        'Used SOS emergency mode within 24 hours of a health crisis.','health',   'achievement-burst', 10);

-- Guide stubs (published=false — write full content before Phase 29)
INSERT INTO public.guides (slug, title, excerpt, category, difficulty, reading_time_minutes, featured, content_markdown, published) VALUES
  ('nitrogen-cycle-complete-guide',
   'The Complete Nitrogen Cycle Guide for Axolotl Tanks',
   'The single most important thing to understand before keeping an axolotl. Get this wrong and your axolotl will die.',
   'water_chemistry', 'beginner', 15, TRUE, '# Placeholder — fill before Phase 29', FALSE),
  ('axolotl-water-parameters-guide',
   'Perfect Water Parameters for Axolotls',
   'Exact pH, ammonia, nitrite, nitrate, temperature, GH and KH ranges with explanations of why each matters.',
   'water_chemistry', 'beginner', 10, TRUE, '# Placeholder', FALSE),
  ('fungus-treatment-guide',
   'Axolotl Fungus: Identification, Treatment & Prevention',
   'White fluffy growths on your axolotl are usually fungal. Here is exactly what to do, step by step.',
   'disease', 'beginner', 8, TRUE, '# Placeholder', FALSE),
  ('summer-heat-management',
   'Keeping Your Axolotl Cool in Summer',
   'Axolotls cannot tolerate temperatures above 22 degrees. These are your options when your house heats up.',
   'seasonal', 'beginner', 7, TRUE, '# Placeholder', FALSE),
  ('first-tank-setup',
   'Setting Up Your First Axolotl Tank',
   'Everything you need, in the order you need it — from tank size to adding your axolotl safely.',
   'tank_setup', 'beginner', 12, TRUE, '# Placeholder', FALSE),
  ('axolotl-not-eating',
   'Why Is My Axolotl Not Eating?',
   'The most common question from new owners. Here are all the reasons and exactly what to check.',
   'feeding', 'beginner', 6, FALSE, '# Placeholder', FALSE),
  ('breeding-complete-guide',
   'How to Breed Axolotls: The Complete Guide',
   'Conditioning, spawning, egg collection, hatching, and raising larvae through to juveniles.',
   'breeding', 'intermediate', 20, FALSE, '# Placeholder', FALSE),
  ('morph-identification-guide',
   'Identifying Axolotl Morphs: Every Colour Explained',
   'Leucistic, golden albino, melanoid, copper, mosaic, chimera — what they look like and how to identify them.',
   'morphs', 'beginner', 8, FALSE, '# Placeholder', FALSE);
```

### Step 6: Apply all migrations

```bash
supabase db push
# All 4 new migrations applied in order
```

### Step 7: Regenerate types (schema has changed)

```bash
supabase gen types typescript --linked > types/database.types.ts
```

### Step 8: Test the auto-profile trigger

In Supabase dashboard → Authentication → Add user (temporary test user). Then check Table Editor → profiles. You should see a row auto-created.

### Step 9: Commit

```bash
git add .
git commit -m "feat: phase 5 - RLS, indexes, triggers, seed data (achievements + guides)"
git push origin feature/phase-5-rls-indexes-triggers
```

Merge to develop.

### Phase 5 Definition of Done
- [ ] `supabase db push` succeeds for all 4 migrations
- [ ] RLS visible: Supabase → Authentication → Policies
- [ ] Indexes visible: Supabase → Database → Indexes
- [ ] Creating a test user auto-creates a profiles row (trigger works)
- [ ] 10 rows in `achievement_definitions`
- [ ] 8 rows in `guides` (all `published=false`)
- [ ] `types/database.types.ts` regenerated with all new tables

---

## Phase 6 — Design System

**Goal:** Color tokens, typography system, spacing/radius constants, and all base UI components. Every future screen uses these — no hardcoded values, ever.
**Time:** 3 hours
**Prerequisites:** Phase 2 complete (fonts installed)

### Step 1: Feature branch

```bash
git checkout develop && git checkout -b feature/phase-6-design-system
```

### Step 2: Color tokens

```typescript
// constants/colors.ts
export const colors = {
  // Brand — deep teal (axolotl's native mountain water)
  teal:         '#0A4F54',
  tealMid:      '#187A82',
  tealLight:    '#B8E8EC',
  tealPale:     '#EAF6F7',

  // Community — gill pink (leucistic axolotl gills)
  gillPink:     '#F4A89A',
  gillPale:     '#FEF2F0',

  // Surfaces
  sand:         '#F6EFE7',
  white:        '#FAFAF8',
  charcoal:     '#18232F',

  // Text
  text1:        '#18232F',  // primary
  text2:        '#5A6A78',  // secondary
  text3:        '#8F9FAC',  // tertiary / placeholder

  // Status
  safe:         '#2DB896',
  safePale:     '#E8F7F0',
  warning:      '#E8A020',
  warningPale:  '#FFF8E8',
  danger:       '#E85A4F',
  dangerPale:   '#FEF2F0',

  // Borders
  border:       'rgba(24,35,47,0.08)',
  borderMid:    'rgba(24,35,47,0.16)',

  // Dark mode surfaces
  dark: {
    bg:      '#0D1B2A',
    surface: '#132030',
    surface2:'#1A2D3F',
    text1:   '#F0F4F8',
    text2:   '#8FA0B0',
    border:  'rgba(255,255,255,0.08)',
  },
} as const
```

### Step 3: Typography + spacing constants

```typescript
// constants/typography.ts
export const fontFamily = {
  serif:      'DMSerifDisplay_400Regular',
  sans:       'PlusJakartaSans_400Regular',
  sansMed:    'PlusJakartaSans_500Medium',
  sansSemi:   'PlusJakartaSans_600SemiBold',
  sansBold:   'PlusJakartaSans_700Bold',
}

export const fontSize = {
  hero: 32, h1: 26, h2: 20, h3: 17,
  body: 15, caption: 13, micro: 11, label: 10,
}

export const lineHeight = {
  hero: 40, h1: 32, h2: 26, h3: 24,
  body: 22, caption: 18, micro: 16, label: 14,
}

export const spacing = {
  xs: 4, sm: 8, md: 12, lg: 16,
  xl: 20, xxl: 24, xxxl: 32,
}

export const radius = {
  sm: 8, md: 12, lg: 16, xl: 20, full: 9999,
}
```

### Step 4: Parameter constants (core logic used everywhere)

```typescript
// constants/parameters.ts
export const PARAMETER_RANGES = {
  ph:          { safe: [6.5, 8.0],  warning: [6.0, 8.5],  unit: 'pH',  label: 'pH',        decimals: 2 },
  ammonia:     { safe: [0, 0],      warning: [0, 0.25],    unit: 'ppm', label: 'Ammonia',   decimals: 3 },
  nitrite:     { safe: [0, 0],      warning: [0, 0.25],    unit: 'ppm', label: 'Nitrite',   decimals: 3 },
  nitrate:     { safe: [0, 20],     warning: [0, 40],      unit: 'ppm', label: 'Nitrate',   decimals: 1 },
  temperature: { safe: [15, 20],    warning: [13, 22],     unit: '°C',  label: 'Temp',      decimals: 1 },
  gh:          { safe: [7, 14],     warning: [4, 20],      unit: 'dGH', label: 'GH',        decimals: 1 },
  kh:          { safe: [3, 8],      warning: [1, 12],      unit: 'dKH', label: 'KH',        decimals: 1 },
} as const

export type ParameterKey    = keyof typeof PARAMETER_RANGES
export type ParameterStatus = 'safe' | 'warning' | 'danger' | 'unknown'

export function getParameterStatus(key: ParameterKey, value: number | null | undefined): ParameterStatus {
  if (value === null || value === undefined) return 'unknown'
  const [safeMin, safeMax] = PARAMETER_RANGES[key].safe
  const [warnMin, warnMax] = PARAMETER_RANGES[key].warning
  if (value >= safeMin && value <= safeMax) return 'safe'
  if (value >= warnMin && value <= warnMax) return 'warning'
  return 'danger'
}

export function calculateSafetyScore(params: Partial<Record<ParameterKey, number | null>>): number {
  const entries = (Object.entries(params) as [ParameterKey, number | null][])
    .filter(([, v]) => v !== null && v !== undefined)
  if (!entries.length) return 100
  const scores = entries.map(([k, v]) => {
    const s = getParameterStatus(k, v!)
    return s === 'safe' ? 100 : s === 'warning' ? 50 : 0
  })
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
}
```

### Step 5: Morph constants

```typescript
// constants/morphs.ts
export const MORPHS = [
  { id: 'leucistic',     label: 'Leucistic',      rarity: 'common'    as const, description: 'White body, pink gills, dark eyes' },
  { id: 'golden_albino', label: 'Golden Albino',  rarity: 'common'    as const, description: 'Yellow/gold body, pink eyes' },
  { id: 'melanoid',      label: 'Melanoid',        rarity: 'common'    as const, description: 'All black, no iridophore patches' },
  { id: 'wild_type',     label: 'Wild Type',       rarity: 'common'    as const, description: 'Dark with gold/olive speckles' },
  { id: 'copper',        label: 'Copper',          rarity: 'uncommon'  as const, description: 'Copper/brown body, red eyes' },
  { id: 'axanthic',      label: 'Axanthic',        rarity: 'uncommon'  as const, description: 'Grey, lacks yellow pigment' },
  { id: 'piebald',       label: 'Piebald',         rarity: 'uncommon'  as const, description: 'White patches on darker base' },
  { id: 'mosaic',        label: 'Mosaic',          rarity: 'rare'      as const, description: 'Mix of 2+ distinct phenotypes' },
  { id: 'chimera',       label: 'Chimera',          rarity: 'very_rare' as const, description: 'Two genetically distinct halves' },
  { id: 'gfp',           label: 'GFP',             rarity: 'uncommon'  as const, description: 'Glows green under UV light' },
  { id: 'firefly',       label: 'Firefly',         rarity: 'rare'      as const, description: 'GFP tail, non-GFP body' },
  { id: 'lavender',      label: 'Lavender',        rarity: 'rare'      as const, description: 'Pale purple-grey colouration' },
  { id: 'enigma',        label: 'Enigma',          rarity: 'very_rare' as const, description: 'Patchy white and dark pattern' },
  { id: 'unknown',       label: 'Unknown',         rarity: 'common'    as const, description: "Not sure yet" },
] as const

export const RARITY_LABEL_COLOR = {
  common:    '#8F9FAC',
  uncommon:  '#187A82',
  rare:      '#8B6914',
  very_rare: '#9A3030',
}
```

### Step 6: Load fonts in root layout

```typescript
// app/_layout.tsx
import { useEffect } from 'react'
import { Stack } from 'expo-router'
import { useFonts, DMSerifDisplay_400Regular } from '@expo-google-fonts/dm-serif-display'
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
} from '@expo-google-fonts/plus-jakarta-sans'
import * as SplashScreen from 'expo-splash-screen'

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    DMSerifDisplay_400Regular,
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
  })

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync()
  }, [fontsLoaded])

  if (!fontsLoaded) return null

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="sos"     options={{ presentation: 'fullScreenModal' }} />
      <Stack.Screen name="paywall" options={{ presentation: 'modal' }} />
    </Stack>
  )
}
```

### Step 7: Base UI components

Create these 5 components now. They are imported in every screen.

```typescript
// components/ui/Typography.tsx
import { Text, TextStyle, StyleSheet } from 'react-native'
import { fontFamily, fontSize, lineHeight } from '@/constants/typography'
import { colors } from '@/constants/colors'
type P = { children: React.ReactNode; style?: TextStyle }
export const Hero    = ({ children, style }: P) => <Text style={[s.hero,    style]}>{children}</Text>
export const H1      = ({ children, style }: P) => <Text style={[s.h1,      style]}>{children}</Text>
export const H2      = ({ children, style }: P) => <Text style={[s.h2,      style]}>{children}</Text>
export const Body    = ({ children, style }: P) => <Text style={[s.body,    style]}>{children}</Text>
export const Caption = ({ children, style }: P) => <Text style={[s.caption, style]}>{children}</Text>
export const Label   = ({ children, style }: P) => <Text style={[s.label,   style]}>{children}</Text>
const s = StyleSheet.create({
  hero:    { fontFamily: fontFamily.serif,    fontSize: fontSize.hero,    lineHeight: lineHeight.hero,    color: colors.text1 },
  h1:      { fontFamily: fontFamily.sansSemi, fontSize: fontSize.h1,      lineHeight: lineHeight.h1,      color: colors.text1 },
  h2:      { fontFamily: fontFamily.sansSemi, fontSize: fontSize.h2,      lineHeight: lineHeight.h2,      color: colors.text1 },
  body:    { fontFamily: fontFamily.sans,     fontSize: fontSize.body,    lineHeight: lineHeight.body,    color: colors.text2 },
  caption: { fontFamily: fontFamily.sans,     fontSize: fontSize.caption, lineHeight: lineHeight.caption, color: colors.text2 },
  label:   { fontFamily: fontFamily.sansMed,  fontSize: fontSize.label,   lineHeight: lineHeight.label,   color: colors.text3, textTransform: 'uppercase', letterSpacing: 0.8 },
})
```

```typescript
// components/ui/Button.tsx
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native'
import { colors } from '@/constants/colors'
import { fontFamily, fontSize, radius } from '@/constants/typography'
type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
interface Props { title: string; onPress: () => void; variant?: Variant; loading?: boolean; disabled?: boolean; style?: ViewStyle }
export function Button({ title, onPress, variant = 'primary', loading, disabled, style }: Props) {
  return (
    <TouchableOpacity
      style={[s.base, s[variant], (disabled || loading) && s.dim, style]}
      onPress={onPress} disabled={disabled || loading} activeOpacity={0.8}
    >
      {loading
        ? <ActivityIndicator color={variant === 'primary' || variant === 'danger' ? '#fff' : colors.teal} size="small" />
        : <Text style={[s.text, s[variant + 'T' as keyof typeof s] as any]}>{title}</Text>
      }
    </TouchableOpacity>
  )
}
const s = StyleSheet.create({
  base:       { paddingVertical: 14, paddingHorizontal: 20, borderRadius: radius.lg, alignItems: 'center' },
  primary:    { backgroundColor: colors.teal },
  secondary:  { backgroundColor: colors.tealPale, borderWidth: 1, borderColor: colors.tealLight },
  ghost:      { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.borderMid },
  danger:     { backgroundColor: colors.danger },
  dim:        { opacity: 0.5 },
  text:       { fontFamily: fontFamily.sansSemi, fontSize: fontSize.body },
  primaryT:   { color: '#fff' },
  secondaryT: { color: colors.teal },
  ghostT:     { color: colors.text2 },
  dangerT:    { color: '#fff' },
})
```

```typescript
// components/ui/Card.tsx
import { View, StyleSheet, ViewStyle } from 'react-native'
import { colors } from '@/constants/colors'
import { radius, spacing } from '@/constants/typography'
type Variant = 'default' | 'teal' | 'sand'
interface Props { children: React.ReactNode; style?: ViewStyle; variant?: Variant }
export function Card({ children, style, variant = 'default' }: Props) {
  return <View style={[s.card, s[variant], style]}>{children}</View>
}
const s = StyleSheet.create({
  card:    { borderRadius: radius.lg, padding: spacing.lg, borderWidth: 0.5, borderColor: colors.border },
  default: { backgroundColor: colors.white },
  teal:    { backgroundColor: colors.teal, borderColor: 'transparent' },
  sand:    { backgroundColor: colors.sand, borderColor: 'transparent' },
})
```

```typescript
// components/ui/Badge.tsx
import { View, Text, StyleSheet, ViewStyle } from 'react-native'
import { colors } from '@/constants/colors'
import { fontFamily, fontSize } from '@/constants/typography'
type Variant = 'safe' | 'warning' | 'danger' | 'info' | 'neutral' | 'pro'
interface Props { label: string; variant?: Variant; style?: ViewStyle }
export function Badge({ label, variant = 'neutral', style }: Props) {
  return (
    <View style={[s.badge, s[variant], style]}>
      <Text style={[s.text, s[variant + 'T' as keyof typeof s] as any]}>{label}</Text>
    </View>
  )
}
const s = StyleSheet.create({
  badge:    { paddingHorizontal: 9, paddingVertical: 3, borderRadius: 20, alignSelf: 'flex-start' },
  text:     { fontFamily: fontFamily.sansSemi, fontSize: fontSize.micro },
  safe:     { backgroundColor: colors.safePale },    safeT:    { color: '#1A6B4A' },
  warning:  { backgroundColor: colors.warningPale }, warningT: { color: '#8B5E0A' },
  danger:   { backgroundColor: colors.dangerPale },  dangerT:  { color: '#8B1A1A' },
  info:     { backgroundColor: colors.tealPale },    infoT:    { color: colors.teal },
  neutral:  { backgroundColor: colors.sand },        neutralT: { color: colors.text2 },
  pro:      { backgroundColor: colors.teal },        proT:     { color: '#fff' },
})
```

```typescript
// components/ui/ParameterPill.tsx
import { View, Text, StyleSheet } from 'react-native'
import { getParameterStatus, PARAMETER_RANGES, type ParameterKey } from '@/constants/parameters'
import { colors } from '@/constants/colors'
import { fontFamily, fontSize } from '@/constants/typography'
const STATUS_COLORS = {
  safe:    { bg: colors.safePale,    text: '#1A6B4A' },
  warning: { bg: colors.warningPale, text: '#8B5E0A' },
  danger:  { bg: colors.dangerPale,  text: '#8B1A1A' },
  unknown: { bg: colors.sand,        text: colors.text3 },
}
export function ParameterPill({ paramKey, value, compact }: { paramKey: ParameterKey; value: number | null | undefined; compact?: boolean }) {
  const status = getParameterStatus(paramKey, value)
  const range  = PARAMETER_RANGES[paramKey]
  const c      = STATUS_COLORS[status]
  const display = value !== null && value !== undefined ? value.toFixed(range.decimals) : '—'
  return (
    <View style={[s.container, { backgroundColor: c.bg }]}>
      <Text style={[s.value, { color: c.text }]}>{display}</Text>
      <Text style={[s.unit,  { color: c.text }]}>{range.unit}</Text>
      {!compact && <Text style={[s.label, { color: c.text + '99' }]}>{range.label}</Text>}
    </View>
  )
}
const s = StyleSheet.create({
  container: { alignItems: 'center', paddingVertical: 8, paddingHorizontal: 10, borderRadius: 12, flex: 1 },
  value:     { fontFamily: fontFamily.sansSemi, fontSize: 18 },
  unit:      { fontFamily: fontFamily.sans, fontSize: 10, marginTop: 1 },
  label:     { fontFamily: fontFamily.sans, fontSize: 9,  marginTop: 2, textAlign: 'center' },
})
```

### Step 8: Commit

```bash
git add .
git commit -m "feat: phase 6 - complete design system with tokens, fonts, and all base components"
git push origin feature/phase-6-design-system
```

### Phase 6 Definition of Done
- [ ] Both fonts load on simulator (verify visually)
- [ ] `constants/colors.ts`, `constants/typography.ts`, `constants/parameters.ts`, `constants/morphs.ts` created
- [ ] `Button`, `Card`, `Badge`, `ParameterPill`, `Typography` components created
- [ ] No hardcoded hex colours anywhere in components — all use `colors.*`

---

## Phase 7 — Authentication

**Goal:** Email sign up/in, Apple Sign-In, forgot password, session persistence, auth-gated navigation routing.
**Time:** 4 hours
**Prerequisites:** Phase 6, Phase 3

### Step 1: Feature branch

```bash
git checkout develop && git checkout -b feature/phase-7-authentication
```

### Step 2: Auth store

```typescript
// store/useAuthStore.ts
import { create } from 'zustand'
import type { Session, User } from '@supabase/supabase-js'

type Profile = { id: string; username: string; display_name: string; subscription_tier: string; onesignal_player_id: string | null }

interface AuthState {
  session:    Session | null
  user:       User | null
  profile:    Profile | null
  setSession: (s: Session | null) => void
  setProfile: (p: Profile | null) => void
  clear:      () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null, user: null, profile: null,
  setSession: (session) => set({ session, user: session?.user ?? null }),
  setProfile: (profile) => set({ profile }),
  clear:      () => set({ session: null, user: null, profile: null }),
}))
```

### Step 3: Wired root layout with auth routing

```typescript
// app/_layout.tsx  (replace the Phase 6 version)
import { useEffect } from 'react'
import { Stack, useRouter, useSegments } from 'expo-router'
import { useFonts, DMSerifDisplay_400Regular } from '@expo-google-fonts/dm-serif-display'
import { PlusJakartaSans_400Regular, PlusJakartaSans_500Medium, PlusJakartaSans_600SemiBold, PlusJakartaSans_700Bold } from '@expo-google-fonts/plus-jakarta-sans'
import * as SplashScreen from 'expo-splash-screen'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/useAuthStore'

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [fontsLoaded] = useFonts({ DMSerifDisplay_400Regular, PlusJakartaSans_400Regular, PlusJakartaSans_500Medium, PlusJakartaSans_600SemiBold, PlusJakartaSans_700Bold })
  const { session, setSession, setProfile, clear } = useAuthStore()
  const router   = useRouter()
  const segments = useSegments()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session)
      if (session) {
        const { data } = await supabase.from('profiles')
          .select('id, username, display_name, subscription_tier, onesignal_player_id')
          .eq('id', session.user.id).single()
        if (data) setProfile(data)
      } else {
        clear()
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!fontsLoaded) return
    SplashScreen.hideAsync()
    const inAuth = segments[0] === '(auth)'
    if (!session && !inAuth) router.replace('/(auth)/sign-in')
    else if (session && inAuth) router.replace('/(tabs)')
  }, [session, segments, fontsLoaded])

  if (!fontsLoaded) return null

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="sos"     options={{ presentation: 'fullScreenModal' }} />
      <Stack.Screen name="paywall" options={{ presentation: 'modal' }} />
    </Stack>
  )
}
```

### Step 4: Sign in screen

```typescript
// app/(auth)/sign-in.tsx
import { useState } from 'react'
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native'
import { router } from 'expo-router'
import * as AppleAuthentication from 'expo-apple-authentication'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'
import { colors } from '@/constants/colors'
import { fontFamily, fontSize, spacing, radius } from '@/constants/typography'

export default function SignIn() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)

  const handleEmail = async () => {
    if (!email || !password) { Alert.alert('Fill in all fields'); return }
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) Alert.alert('Sign in failed', error.message)
    // On success, auth state change listener in _layout.tsx handles routing
  }

  const handleApple = async () => {
    try {
      const cred = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      })
      const { error } = await supabase.auth.signInWithIdToken({ provider: 'apple', token: cred.identityToken! })
      if (error) Alert.alert('Apple Sign In failed', error.message)
    } catch (e: any) {
      if (e.code !== 'ERR_REQUEST_CANCELED') Alert.alert('Error', e.message)
    }
  }

  return (
    <KeyboardAvoidingView style={s.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
        <View style={s.header}>
          <Text style={s.logo}>AxolotlCare</Text>
          <Text style={s.tagline}>Your axolotl's health, in your hands.</Text>
        </View>
        <TextInput style={s.input} placeholder="Email" placeholderTextColor={colors.text3}
          value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <TextInput style={s.input} placeholder="Password" placeholderTextColor={colors.text3}
          value={password} onChangeText={setPassword} secureTextEntry />
        <Button title="Sign in" onPress={handleEmail} loading={loading} />
        <TouchableOpacity onPress={() => router.push('/(auth)/forgot-password')} style={s.forgot}>
          <Text style={s.forgotT}>Forgot password?</Text>
        </TouchableOpacity>
        <View style={s.divider}><View style={s.line} /><Text style={s.or}>or</Text><View style={s.line} /></View>
        {Platform.OS === 'ios' && (
          <AppleAuthentication.AppleAuthenticationButton
            buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
            buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
            cornerRadius={radius.lg} style={s.apple} onPress={handleApple}
          />
        )}
        <TouchableOpacity onPress={() => router.replace('/(auth)/sign-up')} style={s.switch}>
          <Text style={s.switchT}>No account? <Text style={{ color: colors.teal, fontFamily: fontFamily.sansSemi }}>Sign up</Text></Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  scroll:    { flexGrow: 1, justifyContent: 'center', padding: spacing.xxl },
  header:    { alignItems: 'center', marginBottom: spacing.xxxl },
  logo:      { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 36, color: colors.teal, marginBottom: spacing.sm },
  tagline:   { fontFamily: fontFamily.sans, fontSize: fontSize.body, color: colors.text2, textAlign: 'center' },
  input:     { borderWidth: 0.5, borderColor: colors.borderMid, borderRadius: radius.lg, padding: spacing.md, fontSize: fontSize.body, fontFamily: fontFamily.sans, color: colors.text1, marginBottom: spacing.md, backgroundColor: colors.white },
  forgot:    { alignItems: 'center', marginVertical: spacing.lg },
  forgotT:   { fontFamily: fontFamily.sans, fontSize: fontSize.caption, color: colors.text3 },
  divider:   { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.xl },
  line:      { flex: 1, height: 0.5, backgroundColor: colors.border },
  or:        { marginHorizontal: spacing.md, fontFamily: fontFamily.sans, fontSize: fontSize.caption, color: colors.text3 },
  apple:     { height: 52, marginBottom: spacing.xl },
  switch:    { alignItems: 'center' },
  switchT:   { fontFamily: fontFamily.sans, fontSize: fontSize.caption, color: colors.text2 },
})
```

### Step 5: Sign up screen

```typescript
// app/(auth)/sign-up.tsx
import { useState } from 'react'
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native'
import { router } from 'expo-router'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'
import { colors } from '@/constants/colors'
import { fontFamily, fontSize, spacing, radius } from '@/constants/typography'

export default function SignUp() {
  const [name,     setName]     = useState('')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [loading,  setLoading]  = useState(false)

  const handle = async () => {
    if (!name || !email || !password) { Alert.alert('Fill in all fields'); return }
    if (password.length < 8) { Alert.alert('Password must be 8+ characters'); return }
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email, password, options: { data: { full_name: name } }
    })
    setLoading(false)
    if (error) Alert.alert('Sign up failed', error.message)
    else router.replace('/onboarding/welcome')
    // Profile auto-created by DB trigger
  }

  return (
    <KeyboardAvoidingView style={s.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
        <TouchableOpacity onPress={() => router.back()} style={s.back}><Text style={s.backT}>← Back</Text></TouchableOpacity>
        <Text style={s.title}>Create your account</Text>
        <Text style={s.sub}>Join the axolotl keeper community</Text>
        <TextInput style={s.input} placeholder="Your name" placeholderTextColor={colors.text3} value={name} onChangeText={setName} autoCapitalize="words" />
        <TextInput style={s.input} placeholder="Email" placeholderTextColor={colors.text3} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} />
        <TextInput style={s.input} placeholder="Password (8+ characters)" placeholderTextColor={colors.text3} value={password} onChangeText={setPassword} secureTextEntry />
        <Button title="Create account" onPress={handle} loading={loading} style={{ marginTop: spacing.xs }} />
        <TouchableOpacity onPress={() => router.replace('/(auth)/sign-in')} style={s.switch}>
          <Text style={s.switchT}>Have an account? <Text style={{ color: colors.teal, fontFamily: fontFamily.sansSemi }}>Sign in</Text></Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  scroll:    { flexGrow: 1, padding: spacing.xxl },
  back:      { marginBottom: spacing.xxl, marginTop: spacing.xl },
  backT:     { fontFamily: fontFamily.sans, fontSize: fontSize.body, color: colors.teal },
  title:     { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 28, color: colors.text1, marginBottom: spacing.sm },
  sub:       { fontFamily: fontFamily.sans, fontSize: fontSize.body, color: colors.text2, marginBottom: spacing.xxxl },
  input:     { borderWidth: 0.5, borderColor: colors.borderMid, borderRadius: radius.lg, padding: spacing.md, fontSize: fontSize.body, fontFamily: fontFamily.sans, color: colors.text1, marginBottom: spacing.md },
  switch:    { alignItems: 'center', marginTop: spacing.xl },
  switchT:   { fontFamily: fontFamily.sans, fontSize: fontSize.caption, color: colors.text2 },
})
```

### Step 6: Enable Apple Sign-In in Supabase

Supabase dashboard → Authentication → Providers → Apple:
- Requires an Apple Developer account ($99/yr)
- Create a Service ID in Apple Developer → Certificates, Identifiers & Profiles
- Add that Service ID and your private key to Supabase
- If skipping Apple Sign-In for now, the sign-in screen will just not show the Apple button on Android

### Step 7: Test complete auth flow

1. Sign up with a new email → should route to `/onboarding/welcome` (placeholder)
2. Check Supabase → Authentication → Users: new user visible
3. Check Supabase → Table Editor → profiles: auto-created row visible
4. Kill app, reopen → still signed in (SecureStore persistence)
5. Sign out → redirected to sign-in

### Step 8: Commit

```bash
git add .
git commit -m "feat: phase 7 - complete auth with email, Apple Sign-In, session routing"
git push origin feature/phase-7-authentication
```

Merge to develop.

### Phase 7 Definition of Done
- [ ] Email sign up → creates user in Supabase Auth
- [ ] DB trigger auto-creates `profiles` row on signup
- [ ] Email sign in → session persists through app restart
- [ ] Apple Sign-In works (skip if no Apple Developer account yet)
- [ ] Forgot password sends reset email
- [ ] Unauthenticated users always land on sign-in
- [ ] Authenticated users cannot reach auth screens

---

## Phase 8 — Axolotl Profile

**Goal:** Create, view, and edit axolotl profiles with morph picker, photo upload to Supabase Storage, Zustand store.
**Time:** 3 hours
**Prerequisites:** Phase 7

### Step 1: Feature branch

```bash
git checkout develop && git checkout -b feature/phase-8-axolotl-profile
```

### Step 2: Axolotl store

```typescript
// store/useAxolotlStore.ts
import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/database.types'
type Axolotl = Database['public']['Tables']['axolotls']['Row']
interface AxolotlState {
  axolotls:        Axolotl[]
  activeAxolotl:   Axolotl | null
  loading:         boolean
  fetchAxolotls:   (ownerId: string) => Promise<void>
  setActive:       (a: Axolotl) => void
  addAxolotl:      (a: Axolotl) => void
  updateAxolotl:   (id: string, u: Partial<Axolotl>) => void
}
export const useAxolotlStore = create<AxolotlState>((set) => ({
  axolotls: [], activeAxolotl: null, loading: false,
  setActive:     (a) => set({ activeAxolotl: a }),
  addAxolotl:    (a) => set(s => ({ axolotls: [...s.axolotls, a], activeAxolotl: s.activeAxolotl ?? a })),
  updateAxolotl: (id, u) => set(s => ({
    axolotls:      s.axolotls.map(a => a.id === id ? { ...a, ...u } : a),
    activeAxolotl: s.activeAxolotl?.id === id ? { ...s.activeAxolotl, ...u } : s.activeAxolotl,
  })),
  fetchAxolotls: async (ownerId) => {
    set({ loading: true })
    const { data } = await supabase.from('axolotls').select('*')
      .eq('owner_id', ownerId).is('passed_date', null).order('created_at')
    if (data) set({ axolotls: data, activeAxolotl: data[0] ?? null })
    set({ loading: false })
  },
}))
```

### Step 3: Storage bucket (run once in Supabase SQL editor)

```sql
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('axolotl-photos', 'axolotl-photos', TRUE, 10485760, ARRAY['image/jpeg','image/png','image/webp']);

CREATE POLICY "axolotl_photos_user_upload" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'axolotl-photos' AND auth.uid()::TEXT = (storage.foldername(name))[1]);
CREATE POLICY "axolotl_photos_public_read" ON storage.objects FOR SELECT
  USING (bucket_id = 'axolotl-photos');
```

### Step 4: New axolotl screen

```typescript
// app/axolotl/new.tsx
import { useState } from 'react'
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert, Image } from 'react-native'
import { router } from 'expo-router'
import * as ImagePicker from 'expo-image-picker'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/useAuthStore'
import { useAxolotlStore } from '@/store/useAxolotlStore'
import { Button } from '@/components/ui/Button'
import { colors } from '@/constants/colors'
import { fontFamily, fontSize, spacing, radius } from '@/constants/typography'
import { MORPHS, RARITY_LABEL_COLOR } from '@/constants/morphs'

export default function NewAxolotl() {
  const { user }    = useAuthStore()
  const { addAxolotl } = useAxolotlStore()
  const [name,       setName]       = useState('')
  const [morph,      setMorph]      = useState('unknown')
  const [volume,     setVolume]     = useState('')
  const [photoUri,   setPhotoUri]   = useState<string | null>(null)
  const [photoB64,   setPhotoB64]   = useState<string | null>(null)
  const [loading,    setLoading]    = useState(false)

  const pickPhoto = async () => {
    const r = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, aspect: [1,1], quality: 0.8, base64: true,
    })
    if (!r.canceled) { setPhotoUri(r.assets[0].uri); setPhotoB64(r.assets[0].base64 ?? null) }
  }

  const handleCreate = async () => {
    if (!name.trim()) { Alert.alert('Name required'); return }
    if (!user) return
    setLoading(true)
    let primaryPhoto: string | null = null

    if (photoUri && photoB64) {
      const ext  = photoUri.split('.').pop() ?? 'jpg'
      const path = `${user.id}/${Date.now()}.${ext}`
      // Convert base64 to ArrayBuffer for Supabase upload
      const byteChars   = atob(photoB64)
      const byteNumbers = new Array(byteChars.length).fill(0).map((_, i) => byteChars.charCodeAt(i))
      const byteArray   = new Uint8Array(byteNumbers)
      const { error: uploadErr } = await supabase.storage
        .from('axolotl-photos').upload(path, byteArray, { contentType: `image/${ext}` })
      if (!uploadErr) {
        const { data } = supabase.storage.from('axolotl-photos').getPublicUrl(path)
        primaryPhoto = data.publicUrl
      }
    }

    const { data, error } = await supabase.from('axolotls').insert({
      owner_id: user.id, name: name.trim(), morph: morph as any,
      tank_volume_liters: volume ? parseFloat(volume) : null,
      primary_photo: primaryPhoto, photos: primaryPhoto ? [primaryPhoto] : [],
    }).select().single()

    setLoading(false)
    if (error) Alert.alert('Error', error.message)
    else { addAxolotl(data); router.replace('/(tabs)') }
  }

  const selectedMorph = MORPHS.find(m => m.id === morph)

  return (
    <ScrollView style={s.container} contentContainerStyle={s.scroll}>
      <TouchableOpacity onPress={() => router.back()} style={s.back}><Text style={s.backT}>← Back</Text></TouchableOpacity>
      <Text style={s.title}>Meet your axolotl</Text>

      {/* Photo picker */}
      <TouchableOpacity style={s.photoPicker} onPress={pickPhoto}>
        {photoUri
          ? <Image source={{ uri: photoUri }} style={s.photo} />
          : <View style={s.photoEmpty}><Text style={s.photoEmptyT}>Add photo</Text></View>
        }
      </TouchableOpacity>

      <Text style={s.fieldLabel}>Name *</Text>
      <TextInput style={s.input} placeholder="e.g. Axiom, Luna, Biscuit" placeholderTextColor={colors.text3}
        value={name} onChangeText={setName} />

      <Text style={s.fieldLabel}>Tank volume (litres)</Text>
      <TextInput style={s.input} placeholder="e.g. 60" placeholderTextColor={colors.text3}
        value={volume} onChangeText={setVolume} keyboardType="numeric" />

      <Text style={s.fieldLabel}>Morph</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.morphScroll}>
        {MORPHS.map(m => (
          <TouchableOpacity key={m.id} style={[s.chip, morph === m.id && s.chipActive]} onPress={() => setMorph(m.id)}>
            <Text style={[s.chipT, morph === m.id && s.chipTActive]}>{m.label}</Text>
            {m.rarity !== 'common' && (
              <Text style={[s.rarityT, { color: RARITY_LABEL_COLOR[m.rarity] }]}>{m.rarity.replace('_',' ')}</Text>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
      {selectedMorph && <Text style={s.morphDesc}>{selectedMorph.description}</Text>}

      <Button title="Add my axolotl" onPress={handleCreate} loading={loading} style={{ marginTop: spacing.xl }} />
    </ScrollView>
  )
}

const s = StyleSheet.create({
  container:  { flex: 1, backgroundColor: colors.white },
  scroll:     { padding: spacing.xxl, paddingBottom: 60 },
  back:       { marginBottom: spacing.xl, marginTop: spacing.xl },
  backT:      { fontFamily: fontFamily.sans, fontSize: fontSize.body, color: colors.teal },
  title:      { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 28, color: colors.text1, marginBottom: spacing.xxl },
  photoPicker:{ alignSelf: 'center', marginBottom: spacing.xxl },
  photo:      { width: 120, height: 120, borderRadius: 60 },
  photoEmpty: { width: 120, height: 120, borderRadius: 60, backgroundColor: colors.tealPale, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: colors.tealLight, borderStyle: 'dashed' },
  photoEmptyT:{ fontFamily: fontFamily.sansMed, fontSize: fontSize.caption, color: colors.teal },
  fieldLabel: { fontFamily: fontFamily.sansMed, fontSize: fontSize.micro, color: colors.text3, marginBottom: spacing.sm, textTransform: 'uppercase', letterSpacing: 0.5 },
  input:      { borderWidth: 0.5, borderColor: colors.borderMid, borderRadius: radius.lg, padding: spacing.md, fontSize: fontSize.body, fontFamily: fontFamily.sans, color: colors.text1, marginBottom: spacing.lg },
  morphScroll:{ marginBottom: spacing.sm },
  chip:       { paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.full, borderWidth: 0.5, borderColor: colors.borderMid, marginRight: spacing.sm },
  chipActive: { backgroundColor: colors.teal, borderColor: colors.teal },
  chipT:      { fontFamily: fontFamily.sansMed, fontSize: fontSize.caption, color: colors.text2 },
  chipTActive:{ color: '#fff' },
  rarityT:    { fontFamily: fontFamily.sans, fontSize: 9, marginTop: 1 },
  morphDesc:  { fontFamily: fontFamily.sans, fontSize: fontSize.caption, color: colors.text3, marginBottom: spacing.xxl, fontStyle: 'italic' },
})
```

### Step 5: Load axolotls on tab entry

```typescript
// app/(tabs)/_layout.tsx  — add to existing layout
import { useEffect } from 'react'
import { useAuthStore } from '@/store/useAuthStore'
import { useAxolotlStore } from '@/store/useAxolotlStore'

// Inside TabLayout():
const { user }         = useAuthStore()
const { fetchAxolotls } = useAxolotlStore()
useEffect(() => { if (user) fetchAxolotls(user.id) }, [user?.id])
```

### Step 6: Commit

```bash
git add .
git commit -m "feat: phase 8 - axolotl profile creation with morph picker and photo upload"
git push origin feature/phase-8-axolotl-profile
```

### Phase 8 Definition of Done
- [ ] Creating axolotl saves to `axolotls` table
- [ ] Photo upload works: file appears in Supabase Storage `axolotl-photos` bucket
- [ ] Morph picker shows all 14 morphs with rarity labels
- [ ] Axolotl store loads and `activeAxolotl` is set

---

## Phase 9 — Water Parameter Logger

**Goal:** Core logging form with real-time safe/warning/danger colour feedback, free-tier enforcement, and DB write.
**Time:** 4 hours
**Prerequisites:** Phase 8

### Step 1: Feature branch

```bash
git checkout develop && git checkout -b feature/phase-9-parameter-logger
```

### Step 2: Parameter store

```typescript
// store/useParameterStore.ts
import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/database.types'
type WaterParameter = Database['public']['Tables']['water_parameters']['Row']
interface ParameterState {
  logs:       WaterParameter[]
  latestLog:  WaterParameter | null
  loading:    boolean
  fetchLogs:  (axolotlId: string, limit?: number) => Promise<void>
  addLog:     (log: WaterParameter) => void
}
export const useParameterStore = create<ParameterState>((set) => ({
  logs: [], latestLog: null, loading: false,
  fetchLogs: async (axolotlId, limit = 30) => {
    set({ loading: true })
    const { data } = await supabase.from('water_parameters').select('*')
      .eq('axolotl_id', axolotlId).order('logged_at', { ascending: false }).limit(limit)
    if (data) set({ logs: data, latestLog: data[0] ?? null })
    set({ loading: false })
  },
  addLog: (log) => set(s => ({ logs: [log, ...s.logs], latestLog: log })),
}))
```

### Step 3: Parameter logger component

```typescript
// components/tank/ParameterLogger.tsx
import { useState } from 'react'
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native'
import { router } from 'expo-router'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/useAuthStore'
import { useAxolotlStore } from '@/store/useAxolotlStore'
import { useParameterStore } from '@/store/useParameterStore'
import { Button } from '@/components/ui/Button'
import { ParameterPill } from '@/components/ui/ParameterPill'
import { colors } from '@/constants/colors'
import { fontFamily, fontSize, spacing, radius } from '@/constants/typography'
import { PARAMETER_RANGES, getParameterStatus, calculateSafetyScore, type ParameterKey } from '@/constants/parameters'

const FIELDS: { key: ParameterKey; placeholder: string }[] = [
  { key: 'ph',          placeholder: '7.2' },
  { key: 'ammonia',     placeholder: '0' },
  { key: 'nitrite',     placeholder: '0' },
  { key: 'nitrate',     placeholder: '10' },
  { key: 'temperature', placeholder: '17' },
  { key: 'gh',          placeholder: '9' },
  { key: 'kh',          placeholder: '5' },
]

export function ParameterLogger({ onSaved }: { onSaved?: () => void }) {
  const { user, profile } = useAuthStore()
  const { activeAxolotl } = useAxolotlStore()
  const { addLog }        = useParameterStore()
  const [values,  setValues]  = useState<Partial<Record<ParameterKey, string>>>({})
  const [notes,   setNotes]   = useState('')
  const [loading, setLoading] = useState(false)

  const parsed = () => {
    const out: Partial<Record<ParameterKey, number | null>> = {}
    FIELDS.forEach(({ key }) => { const v = values[key]; out[key] = v ? parseFloat(v) : null })
    return out
  }

  const save = async () => {
    if (!user || !activeAxolotl) return

    // Free tier: 5 logs per calendar month
    if (profile?.subscription_tier !== 'pro') {
      const monthStart = new Date(); monthStart.setDate(1); monthStart.setHours(0,0,0,0)
      const { count } = await supabase.from('water_parameters')
        .select('id', { count: 'exact', head: true })
        .eq('owner_id', user.id).gte('logged_at', monthStart.toISOString())
      if ((count ?? 0) >= 5) {
        Alert.alert('Free limit reached', 'Free accounts can log 5 parameters per month. Upgrade to Pro for unlimited logging.', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Upgrade to Pro', onPress: () => router.push('/paywall') },
        ])
        return
      }
    }

    setLoading(true)
    const p = parsed()
    const safetyScore = calculateSafetyScore(p)
    const safetyFlags = (Object.keys(p) as ParameterKey[])
      .filter(k => p[k] !== null && getParameterStatus(k, p[k]) !== 'safe')

    const { data, error } = await supabase.from('water_parameters').insert({
      axolotl_id: activeAxolotl.id, owner_id: user.id,
      logged_at: new Date().toISOString(),
      ...p, safety_score: safetyScore, safety_flags: safetyFlags,
      notes: notes || null,
    }).select().single()

    setLoading(false)
    if (error) { Alert.alert('Error', error.message); return }
    addLog(data)
    setValues({}); setNotes('')
    const msg = safetyScore >= 80
      ? `Safety score ${safetyScore}/100. Tank looks healthy.`
      : `Safety score ${safetyScore}/100. Issues: ${safetyFlags.join(', ')}.`
    Alert.alert(safetyScore >= 80 ? 'Parameters saved ✓' : 'Issues detected ⚠', msg)
    onSaved?.()
  }

  const p = parsed()

  return (
    <View>
      <Text style={s.title}>Log water parameters</Text>

      {/* Live preview when user has typed anything */}
      {Object.values(p).some(v => v !== null) && (
        <View style={s.pillRow}>
          {(['ph','ammonia','temperature','nitrate','nitrite'] as ParameterKey[]).map(k => (
            <ParameterPill key={k} paramKey={k} value={p[k]} compact />
          ))}
        </View>
      )}

      {/* Input grid */}
      <View style={s.grid}>
        {FIELDS.map(({ key, placeholder }) => {
          const raw    = values[key]
          const status = raw ? getParameterStatus(key, parseFloat(raw)) : 'unknown'
          const bc     = status === 'safe' ? colors.safe : status === 'warning' ? colors.warning : status === 'danger' ? colors.danger : colors.borderMid
          const range  = PARAMETER_RANGES[key]
          return (
            <View key={key} style={s.field}>
              <Text style={s.fieldLabel}>{range.label}</Text>
              <View style={[s.inputWrap, { borderColor: bc }]}>
                <TextInput style={s.fieldInput} placeholder={placeholder} placeholderTextColor={colors.text3}
                  value={raw ?? ''} onChangeText={t => setValues(prev => ({ ...prev, [key]: t }))}
                  keyboardType="decimal-pad" />
                <Text style={s.fieldUnit}>{range.unit}</Text>
              </View>
              <Text style={s.rangeHint}>Safe: {range.safe[0]}–{range.safe[1]}</Text>
            </View>
          )
        })}
      </View>

      <Text style={s.notesLabel}>Notes (optional)</Text>
      <TextInput style={s.notesInput} placeholder="e.g. 25% water change done today"
        placeholderTextColor={colors.text3} value={notes} onChangeText={setNotes} multiline numberOfLines={2} />

      <Button title="Save parameters" onPress={save} loading={loading} />
    </View>
  )
}

const s = StyleSheet.create({
  title:      { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 22, color: colors.text1, marginBottom: spacing.lg },
  pillRow:    { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  grid:       { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginBottom: spacing.lg },
  field:      { width: '47%' },
  fieldLabel: { fontFamily: fontFamily.sansMed, fontSize: fontSize.micro, color: colors.text3, marginBottom: spacing.xs, textTransform: 'uppercase', letterSpacing: 0.5 },
  inputWrap:  { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderRadius: radius.md, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, marginBottom: 2 },
  fieldInput: { flex: 1, fontFamily: fontFamily.sansSemi, fontSize: 20, color: colors.text1 },
  fieldUnit:  { fontFamily: fontFamily.sans, fontSize: fontSize.micro, color: colors.text3 },
  rangeHint:  { fontFamily: fontFamily.sans, fontSize: 9, color: colors.text3 },
  notesLabel: { fontFamily: fontFamily.sansMed, fontSize: fontSize.caption, color: colors.text2, marginBottom: spacing.sm },
  notesInput: { borderWidth: 0.5, borderColor: colors.borderMid, borderRadius: radius.md, padding: spacing.md, fontSize: fontSize.body, fontFamily: fontFamily.sans, color: colors.text1, marginBottom: spacing.lg, minHeight: 60, textAlignVertical: 'top' },
})
```

### Step 4: Wire into tank tab

```typescript
// app/(tabs)/tank.tsx
import { useEffect } from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ParameterLogger } from '@/components/tank/ParameterLogger'
import { useAxolotlStore } from '@/store/useAxolotlStore'
import { useParameterStore } from '@/store/useParameterStore'
import { colors } from '@/constants/colors'
import { spacing } from '@/constants/typography'

export default function TankScreen() {
  const { activeAxolotl } = useAxolotlStore()
  const { fetchLogs }     = useParameterStore()
  useEffect(() => { if (activeAxolotl) fetchLogs(activeAxolotl.id) }, [activeAxolotl?.id])
  return (
    <SafeAreaView style={{ flex:1, backgroundColor: colors.white }} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: spacing.xxl }}>
        <ParameterLogger />
      </ScrollView>
    </SafeAreaView>
  )
}
```

### Step 5: Commit

```bash
git add .
git commit -m "feat: phase 9 - water parameter logger with live safe/danger feedback and free tier gating"
git push origin feature/phase-9-parameter-logger
```

### Phase 9 Definition of Done
- [ ] All 7 parameters can be entered
- [ ] Border colour changes live as user types (green/amber/red)
- [ ] Safety score computed and shown in alert on save
- [ ] Log appears in `water_parameters` table
- [ ] DB trigger fires: `axolotls.parameter_log_count` increments
- [ ] Free tier block fires on 6th log in a month

---

## Phase 10 — Parameter History Charts

**Goal:** Time-series charts of historical parameter values, trend visibility.
**Time:** 2 hours
**Prerequisites:** Phase 9

```typescript
// components/tank/ParameterChart.tsx
import { View, Text, Dimensions, StyleSheet } from 'react-native'
import { LineChart } from 'react-native-chart-kit'
import { useParameterStore } from '@/store/useParameterStore'
import { colors } from '@/constants/colors'
import { fontFamily, fontSize, spacing } from '@/constants/typography'
import { PARAMETER_RANGES, getParameterStatus, type ParameterKey } from '@/constants/parameters'

const W = Dimensions.get('window').width

export function ParameterChart({ paramKey }: { paramKey: ParameterKey }) {
  const { logs } = useParameterStore()
  const range    = PARAMETER_RANGES[paramKey]

  const data = logs
    .filter(l => l[paramKey] !== null)
    .slice(0, 14).reverse()
    .map(l => ({ v: l[paramKey] as number, d: new Date(l.logged_at) }))

  if (data.length < 2) {
    return (
      <View style={s.empty}>
        <Text style={s.emptyT}>Log 2+ readings to see a {range.label} chart</Text>
      </View>
    )
  }

  const values = data.map(d => d.v)
  const labels = data.map((d, i) => i % 3 === 0 ? `${d.d.getDate()}/${d.d.getMonth()+1}` : '')
  const latest = getParameterStatus(paramKey, values[values.length - 1])
  const lineColor = latest === 'safe' ? colors.safe : latest === 'warning' ? colors.warning : colors.danger

  return (
    <View style={s.container}>
      <Text style={s.title}>{range.label} ({range.unit})</Text>
      <LineChart
        data={{ labels, datasets: [{ data: values }] }}
        width={W - spacing.xxl * 2} height={180}
        chartConfig={{
          backgroundColor: colors.white, backgroundGradientFrom: colors.white,
          backgroundGradientTo: colors.white, decimalPlaces: range.decimals,
          color: () => lineColor, labelColor: () => colors.text3,
          propsForDots: { r: '4', strokeWidth: '2', stroke: lineColor },
        }}
        bezier withInnerLines={false} style={{ borderRadius: 12 }}
      />
      <Text style={s.rangeT}>Safe range: {range.safe[0]}–{range.safe[1]} {range.unit}</Text>
    </View>
  )
}

const s = StyleSheet.create({
  container: { marginBottom: spacing.xxl },
  title:     { fontFamily: fontFamily.sansMed, fontSize: fontSize.body, color: colors.text1, marginBottom: spacing.sm },
  rangeT:    { fontFamily: fontFamily.sans, fontSize: fontSize.micro, color: colors.text3, marginTop: spacing.xs },
  empty:     { height: 80, alignItems: 'center', justifyContent: 'center' },
  emptyT:    { fontFamily: fontFamily.sans, fontSize: fontSize.caption, color: colors.text3, textAlign: 'center' },
})
```

Add a scrollable chart section below the logger in `app/(tabs)/tank.tsx`:

```typescript
// Below <ParameterLogger /> in tank.tsx:
import { ParameterChart } from '@/components/tank/ParameterChart'
// Add charts for the 5 most important parameters:
<ParameterChart paramKey="ammonia" />
<ParameterChart paramKey="nitrite" />
<ParameterChart paramKey="temperature" />
<ParameterChart paramKey="ph" />
<ParameterChart paramKey="nitrate" />
```

```bash
git add . && git commit -m "feat: phase 10 - parameter history charts with bezier line and safe range annotation"
git push origin feature/phase-10-parameter-charts
```

---

## Phase 11 — Nitrogen Cycle Wizard

**Goal:** Full step-by-step wizard, session persisted in DB, achievement on completion, free for all users.
**Time:** 4 hours
**Prerequisites:** Phase 9

### Step 1: Feature branch

```bash
git checkout develop && git checkout -b feature/phase-11-cycle-wizard
```

### Step 2: Cycle steps data

```typescript
// constants/cycleSteps.ts
export interface CycleStep {
  dayLabel:     string
  title:        string
  instructions: string
  checkItems:   string[]
  paramTargets: string
}

export const FISHLESS_CYCLE_STEPS: CycleStep[] = [
  {
    dayLabel: 'Day 1',
    title: 'Set up the tank and add your ammonia source',
    instructions: 'Fill the tank with dechlorinated tap water. Add your filter and let it run. Do NOT add your axolotl. Add pure ammonia (Dr. Tim's or Fritz) until you read 2–3 ppm. Do not use cleaning ammonia — it must be pure, no surfactants.',
    checkItems: ['Tank filled with dechlorinated water','Filter running','No heater (axolotls need cool water)','No axolotl in the tank yet','Ammonia added to 2–3 ppm','Lid on tank'],
    paramTargets: 'NH3: 2–3 ppm | NO2: 0 | NO3: 0 | Temp: 18–20°C',
  },
  {
    dayLabel: 'Days 2–7',
    title: 'Wait for nitrifying bacteria to establish',
    instructions: 'Test ammonia every 2 days. If it drops below 1 ppm, top up to 2 ppm. Do NOT clean your filter. Do NOT do water changes. You are waiting for Nitrosomonas bacteria to colonise your filter media. This is the slow part — be patient.',
    checkItems: ['Tested ammonia','Topped up to 2 ppm if needed','Did NOT clean filter or do water change'],
    paramTargets: 'NH3: 1–3 ppm | NO2: should start rising | NO3: 0',
  },
  {
    dayLabel: 'Day 10–14',
    title: 'Nitrite appears — the cycle has started',
    instructions: 'When you detect nitrite (even 0.25 ppm), Nitrosomonas bacteria are converting ammonia to nitrite. This is progress. Now wait for Nitrobacter to appear and convert nitrite to nitrate. Keep ammonia at 1–2 ppm. Nitrite may spike very high — this is normal and expected.',
    checkItems: ['Confirmed nitrite > 0','Keeping ammonia at 1–2 ppm','Testing daily now'],
    paramTargets: 'NH3: 1–2 ppm | NO2: rising | NO3: rising',
  },
  {
    dayLabel: 'Day 21–28',
    title: 'Nitrite crashing — almost there',
    instructions: 'When nitrite starts falling back toward zero, Nitrobacter bacteria are now established and converting nitrite to nitrate. Do a large water change (50%) when nitrite drops below 0.25 ppm to clear excess nitrate before adding your axolotl.',
    checkItems: ['Confirmed nitrite falling','Nitrate present','50% water change done when nitrite < 0.25 ppm'],
    paramTargets: 'NH3: 0 | NO2: < 0.25 ppm and falling | NO3: present',
  },
  {
    dayLabel: 'Cycle complete',
    title: 'Your tank is cycled — safe to add your axolotl',
    instructions: 'The cycle is complete when: add 2 ppm ammonia → test 24 hours later → ammonia reads 0 AND nitrite reads 0. If both are 0, do a 50% water change to bring nitrate below 20 ppm. Now slowly acclimate your axolotl by floating the bag for 30 minutes, then gently releasing them.',
    checkItems: ['Ammonia 0 ppm within 24h of adding 2 ppm ✓','Nitrite 0 ppm ✓','Nitrate present (below 20 ppm after water change) ✓','50% water change done','Temperature 15–20°C ✓','Axolotl acclimated slowly (bag floated 30 min)'],
    paramTargets: 'NH3: 0 | NO2: 0 | NO3: < 20 ppm',
  },
]
```

### Step 3: Wizard component

```typescript
// components/tank/NitrogenWizard.tsx
import { useState, useEffect } from 'react'
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/useAuthStore'
import { useAxolotlStore } from '@/store/useAxolotlStore'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { colors } from '@/constants/colors'
import { fontFamily, fontSize, spacing, radius } from '@/constants/typography'
import { FISHLESS_CYCLE_STEPS } from '@/constants/cycleSteps'

export function NitrogenWizard({ onComplete }: { onComplete?: () => void }) {
  const { user }          = useAuthStore()
  const { activeAxolotl } = useAxolotlStore()
  const [step,         setStep]     = useState(0)
  const [sessionId,    setSession]  = useState<string | null>(null)
  const [checked,      setChecked]  = useState<Set<number>>(new Set())
  const [loading,      setLoading]  = useState(false)

  useEffect(() => {
    if (!user || !activeAxolotl) return
    // Try to resume existing session
    supabase.from('cycle_sessions')
      .select('id, current_step')
      .eq('axolotl_id', activeAxolotl.id)
      .eq('is_completed', false)
      .single()
      .then(({ data }) => {
        if (data) { setSession(data.id); setStep(data.current_step - 1) }
        else {
          // Create new session
          supabase.from('cycle_sessions')
            .insert({ axolotl_id: activeAxolotl.id, owner_id: user.id, method: 'fishless_ammonia' })
            .select('id').single()
            .then(({ data: d }) => { if (d) setSession(d.id) })
        }
      })
  }, [activeAxolotl?.id])

  const current    = FISHLESS_CYCLE_STEPS[step]
  const isLast     = step >= FISHLESS_CYCLE_STEPS.length - 1
  const allChecked = current?.checkItems.every((_, i) => checked.has(i))
  const progress   = ((step + 1) / FISHLESS_CYCLE_STEPS.length) * 100

  const advance = async () => {
    if (!sessionId) return
    setLoading(true)
    await supabase.from('cycle_sessions').update({
      current_step: step + 2,
      is_completed: isLast,
      completed_at: isLast ? new Date().toISOString() : null,
    }).eq('id', sessionId)

    if (isLast) {
      // Award cycle_complete achievement
      await supabase.from('user_achievements').insert({
        profile_id: user!.id, achievement_id: 'cycle_complete', axolotl_id: activeAxolotl!.id,
      }).on('conflict', () => {}).then(() => {})
      Alert.alert('Cycle complete!', `${activeAxolotl?.name}'s tank is now fully cycled. Safe to introduce your axolotl.`)
      onComplete?.()
    } else {
      setStep(s => s + 1)
      setChecked(new Set())
    }
    setLoading(false)
  }

  if (!current) return null

  return (
    <ScrollView>
      <Text style={s.title}>Nitrogen Cycle Wizard</Text>

      {/* Progress bar */}
      <View style={s.track}><View style={[s.fill, { width: `${progress}%` }]} /></View>
      <Text style={s.stepCount}>Step {step + 1} of {FISHLESS_CYCLE_STEPS.length}</Text>

      <Card style={s.stepCard}>
        <Text style={s.dayLabel}>{current.dayLabel}</Text>
        <Text style={s.stepTitle}>{current.title}</Text>
        <Text style={s.instructions}>{current.instructions}</Text>
        <View style={s.targetBox}>
          <Text style={s.targetLabel}>Aim for:</Text>
          <Text style={s.targetText}>{current.paramTargets}</Text>
        </View>
      </Card>

      <Text style={s.checklistTitle}>Checklist</Text>
      {current.checkItems.map((item, i) => (
        <TouchableOpacity key={i} style={s.checkRow} onPress={() => {
          setChecked(prev => { const n = new Set(prev); n.has(i) ? n.delete(i) : n.add(i); return n })
        }}>
          <View style={[s.box, checked.has(i) && s.boxChecked]}>
            {checked.has(i) && <Text style={s.tick}>✓</Text>}
          </View>
          <Text style={[s.checkText, checked.has(i) && s.checkTextDone]}>{item}</Text>
        </TouchableOpacity>
      ))}

      <Button
        title={isLast ? 'Complete cycle!' : 'Move to next step'}
        onPress={advance} loading={loading} disabled={!allChecked}
        style={{ marginTop: spacing.xl }}
      />
      {!allChecked && <Text style={s.hint}>Tick all items before advancing</Text>}
    </ScrollView>
  )
}

const s = StyleSheet.create({
  title:       { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 24, color: colors.text1, marginBottom: spacing.lg },
  track:       { height: 6, backgroundColor: colors.tealPale, borderRadius: 3 },
  fill:        { height: 6, backgroundColor: colors.teal, borderRadius: 3 },
  stepCount:   { fontFamily: fontFamily.sans, fontSize: fontSize.caption, color: colors.text3, marginBottom: spacing.xl, marginTop: spacing.sm },
  stepCard:    { marginBottom: spacing.xl },
  dayLabel:    { fontFamily: fontFamily.sansMed, fontSize: fontSize.micro, color: colors.teal, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: spacing.xs },
  stepTitle:   { fontFamily: fontFamily.sansSemi, fontSize: fontSize.h3, color: colors.text1, marginBottom: spacing.md },
  instructions:{ fontFamily: fontFamily.sans, fontSize: fontSize.body, color: colors.text2, lineHeight: 22, marginBottom: spacing.lg },
  targetBox:   { backgroundColor: colors.tealPale, borderRadius: 10, padding: spacing.md },
  targetLabel: { fontFamily: fontFamily.sansMed, fontSize: fontSize.micro, color: colors.teal, marginBottom: 3 },
  targetText:  { fontFamily: fontFamily.sans, fontSize: fontSize.caption, color: colors.teal },
  checklistTitle:{ fontFamily: fontFamily.sansMed, fontSize: fontSize.body, color: colors.text1, marginBottom: spacing.md },
  checkRow:    { flexDirection: 'row', alignItems: 'flex-start', marginBottom: spacing.md },
  box:         { width: 22, height: 22, borderRadius: 6, borderWidth: 1.5, borderColor: colors.borderMid, marginRight: spacing.md, alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  boxChecked:  { backgroundColor: colors.teal, borderColor: colors.teal },
  tick:        { color: '#fff', fontSize: 13, fontWeight: '700' },
  checkText:   { fontFamily: fontFamily.sans, fontSize: fontSize.body, color: colors.text2, flex: 1, lineHeight: 22 },
  checkTextDone:{ color: colors.text3, textDecorationLine: 'line-through' },
  hint:        { textAlign: 'center', fontFamily: fontFamily.sans, fontSize: fontSize.caption, color: colors.text3, marginTop: spacing.md },
})
```

### Step 4: Commit

```bash
git add .
git commit -m "feat: phase 11 - nitrogen cycle wizard with session persistence and achievement"
git push origin feature/phase-11-cycle-wizard
```

### Phase 11 Definition of Done
- [ ] Starting the wizard creates a `cycle_sessions` row
- [ ] Resuming the app resumes at the same step (DB-persisted)
- [ ] Cannot advance until all checklist items ticked
- [ ] Completing step 5 awards `cycle_complete` achievement
- [ ] Achievement row appears in `user_achievements` table

---

## Phase 12 — Heat Alert System

**Goal:** Supabase Edge Function checks local weather forecast every 6 hours and sends push notification if temperature threatens the axolotl's tank.
**Time:** 3 hours
**Prerequisites:** Phase 5 (schema), OneSignal account

### Step 1: Set up accounts and keys

**OpenWeatherMap:**
1. openweathermap.org → sign up (free)
2. API keys → copy key → add to `.env.local` as `EXPO_PUBLIC_OPENWEATHER_KEY`

**OneSignal:**
1. onesignal.com → Create app → AxolotlCare
2. Platform: iOS + Android
3. Copy App ID → `.env.local` as `EXPO_PUBLIC_ONESIGNAL_APP_ID`
4. Settings → Keys → copy REST API key (server-side only — not in app)

### Step 2: Store secrets in Supabase Edge Functions

```bash
supabase secrets set OPENWEATHER_KEY=your-key
supabase secrets set ONESIGNAL_APP_ID=your-onesignal-app-id
supabase secrets set ONESIGNAL_REST_KEY=your-onesignal-rest-api-key
supabase secrets set ANTHROPIC_API_KEY=your-anthropic-key  # for later Edge Functions
```

### Step 3: Create the Edge Function

```typescript
// supabase/functions/heat-alert/index.ts
import { createClient } from 'npm:@supabase/supabase-js@2'

const DANGER_C  = 22   // °C — tank will heat up fatally
const WARNING_C = 20   // °C — start cooling measures

Deno.serve(async (req) => {
  // Verify this is an internal cron call or admin
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  // Get users with location and push token
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, location, onesignal_player_id')
    .not('location', 'is', null)
    .not('onesignal_player_id', 'is', null)

  if (!profiles?.length) return new Response(JSON.stringify({ sent: 0 }))

  let alertsSent = 0

  for (const profile of profiles) {
    try {
      const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(profile.location!)}&appid=${Deno.env.get('OPENWEATHER_KEY')}&units=metric&cnt=8`
      const wRes = await fetch(weatherUrl)
      if (!wRes.ok) continue
      const weather = await wRes.json()
      if (!weather.list?.length) continue

      const maxForecastC = Math.max(...weather.list.map((h: any) => h.main.temp_max))
      if (maxForecastC < WARNING_C) continue

      const isCritical = maxForecastC >= DANGER_C
      const alertType  = isCritical ? 'heat_critical' : 'heat_warning'

      // Get this user's axolotls
      const { data: axolotls } = await supabase
        .from('axolotls')
        .select('id, name')
        .eq('owner_id', profile.id)
        .is('passed_date', null)

      for (const axolotl of (axolotls ?? [])) {
        // Check we haven't already sent this alert today
        const todayStart = new Date(); todayStart.setHours(0,0,0,0)
        const { count } = await supabase.from('tank_alerts')
          .select('id', { count: 'exact', head: true })
          .eq('axolotl_id', axolotl.id)
          .eq('alert_type', alertType)
          .gte('triggered_at', todayStart.toISOString())
        if ((count ?? 0) > 0) continue

        const title   = `Heat ${isCritical ? 'DANGER' : 'warning'} — ${axolotl.name}`
        const message = `Forecast high: ${Math.round(maxForecastC)}°C. ${isCritical ? 'Immediate cooling action needed.' : 'Check your tank temperature.'}`

        // Save alert record
        await supabase.from('tank_alerts').insert({
          axolotl_id: axolotl.id, owner_id: profile.id,
          alert_type: alertType, severity: isCritical ? 'critical' : 'warning',
          title, message, metadata: { forecast_max_c: maxForecastC },
        })

        // Send OneSignal push
        const pushRes = await fetch('https://onesignal.com/api/v1/notifications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Basic ${Deno.env.get('ONESIGNAL_REST_KEY')}` },
          body: JSON.stringify({
            app_id:             Deno.env.get('ONESIGNAL_APP_ID'),
            include_player_ids: [profile.onesignal_player_id],
            headings:           { en: title },
            contents:           { en: message },
            data:               { screen: 'tank', axolotl_id: axolotl.id, alert_type: alertType },
            priority:           isCritical ? 10 : 7,
          }),
        })

        if (pushRes.ok) {
          await supabase.from('tank_alerts')
            .update({ push_sent: true, push_sent_at: new Date().toISOString() })
            .eq('axolotl_id', axolotl.id).eq('alert_type', alertType).is('push_sent_at', null)
          alertsSent++
        }
      }
    } catch (err) {
      console.error(`Error for profile ${profile.id}:`, err)
    }
  }

  return new Response(JSON.stringify({ alerts_sent: alertsSent }), { headers: { 'Content-Type': 'application/json' } })
})
```

### Step 4: Deploy the function

```bash
supabase functions deploy heat-alert
```

Expected output: `Deployed Function heat-alert at ...`

### Step 5: Set up cron job in Supabase

Supabase dashboard → Edge Functions → Schedules → New schedule:
- Name: `heat-alert-check`
- Schedule: `0 6,12,18 * * *` (runs at 6am, 12pm, 6pm UTC daily)
- Function: `heat-alert`
- HTTP method: POST

### Step 6: Collect user location in app

```typescript
// lib/weather.ts
import * as Location from 'expo-location'
import { supabase } from './supabase'

export async function requestAndSaveLocation(userId: string): Promise<boolean> {
  const { status } = await Location.requestForegroundPermissionsAsync()
  if (status !== 'granted') return false

  const loc      = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced })
  const geocode  = await Location.reverseGeocodeAsync(loc.coords)
  const cityName = geocode[0]?.city ?? geocode[0]?.district ?? null
  if (!cityName) return false

  await supabase.from('profiles').update({ location: cityName }).eq('id', userId)
  return true
}
```

This function is called in Phase 21 (onboarding step 5). For now, create the file.

### Step 7: Manual test

```bash
# Test by calling the function directly
curl -X POST \
  https://YOUR_PROJECT.supabase.co/functions/v1/heat-alert \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json"

# Expected response: { "alerts_sent": 0 } (or higher if temp conditions met)
```

### Step 8: Commit

```bash
git add .
git commit -m "feat: phase 12 - heat alert edge function with openweathermap, cron, and deduplication"
git push origin feature/phase-12-heat-alerts
```

### Phase 12 Definition of Done
- [ ] `supabase functions deploy heat-alert` succeeds
- [ ] Cron job visible in Supabase Edge Functions → Schedules
- [ ] Manual POST to function returns valid JSON
- [ ] `tank_alerts` row created when conditions met
- [ ] Deduplication works: function called twice in same day → only 1 alert sent

---

## Phase 13 — Care Reminders

**Goal:** User-configurable push notifications for water change, feeding, and filter maintenance schedules.
**Time:** 2 hours
**Prerequisites:** Phase 12

```typescript
// lib/notifications.ts
import * as Notifications from 'expo-notifications'
import { Platform } from 'react-native'

// Configure notification handler (call once in _layout.tsx)
export function configureNotifications() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true, shouldPlaySound: true, shouldSetBadge: false,
    }),
  })
}

export async function requestPermission(): Promise<boolean> {
  const { status: existing } = await Notifications.getPermissionsAsync()
  if (existing === 'granted') return true
  const { status } = await Notifications.requestPermissionsAsync()
  return status === 'granted'
}

export async function scheduleWaterChangeReminder(
  axolotlName: string,
  intervalDays: number
) {
  const granted = await requestPermission()
  if (!granted) return

  // Cancel any existing water change reminders
  const scheduled = await Notifications.getAllScheduledNotificationsAsync()
  for (const n of scheduled) {
    if (n.content.data?.type === 'water_change') {
      await Notifications.cancelScheduledNotificationAsync(n.identifier)
    }
  }

  // Schedule repeating reminder
  await Notifications.scheduleNotificationAsync({
    content: {
      title: `Time to change ${axolotlName}'s water`,
      body:  `${intervalDays}-day water change is due. Replace ${Math.round(100/3)}% of tank water.`,
      data:  { type: 'water_change', screen: 'tank' },
    },
    trigger: {
      seconds:  intervalDays * 86400,
      repeats:  true,
    },
  })
}

export async function scheduleFeedingReminder(axolotlName: string) {
  const granted = await requestPermission()
  if (!granted) return

  await Notifications.scheduleNotificationAsync({
    content: {
      title: `Feed ${axolotlName}`,
      body:  `Time for ${axolotlName}'s daily meal. Earthworms, bloodworms, or pellets.`,
      data:  { type: 'feeding', screen: 'home' },
    },
    trigger: {
      hour:    19,  // 7pm local time
      minute:  0,
      repeats: true,
    } as any,
  })
}
```

Build a `ReminderSettings` component (toggleable switches for water change, feeding, filter). Add to `app/(tabs)/profile.tsx` under a "Reminders" section.

```bash
git add . && git commit -m "feat: phase 13 - care reminders with scheduled local push notifications"
git push origin feature/phase-13-care-reminders
```

---

## Phase 14 — Home Dashboard

**Goal:** Home screen fully wired with tank status card, SOS button, quick actions, and alerts.
**Time:** 3 hours
**Prerequisites:** Phases 8–13

### Tank status card

```typescript
// components/tank/TankCard.tsx
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { router } from 'expo-router'
import { useParameterStore } from '@/store/useParameterStore'
import { useAxolotlStore } from '@/store/useAxolotlStore'
import { ParameterPill } from '@/components/ui/ParameterPill'
import { colors } from '@/constants/colors'
import { fontFamily, fontSize, spacing, radius } from '@/constants/typography'
import { calculateSafetyScore } from '@/constants/parameters'

export function TankCard() {
  const { activeAxolotl } = useAxolotlStore()
  const { latestLog }     = useParameterStore()

  if (!activeAxolotl) {
    return (
      <TouchableOpacity style={s.emptyCard} onPress={() => router.push('/axolotl/new')} activeOpacity={0.9}>
        <Text style={s.emptyTitle}>Add your first axolotl</Text>
        <Text style={s.emptyBody}>Tap to create a profile →</Text>
      </TouchableOpacity>
    )
  }

  const score = latestLog
    ? calculateSafetyScore({ ph: latestLog.ph, ammonia: latestLog.ammonia, nitrite: latestLog.nitrite, nitrate: latestLog.nitrate, temperature: latestLog.temperature })
    : null

  const statusText  = !latestLog ? 'No readings yet' : score! >= 80 ? 'All good today' : score! >= 50 ? 'Needs attention' : 'Action required'
  const dotColor    = !latestLog ? colors.text3 : score! >= 80 ? colors.safe : score! >= 50 ? colors.warning : colors.danger

  return (
    <TouchableOpacity style={s.card} onPress={() => router.push('/(tabs)/tank')} activeOpacity={0.95}>
      <View style={s.header}>
        <View>
          <Text style={s.axolotlName}>{activeAxolotl.name}</Text>
          <Text style={s.tankLabel}>{activeAxolotl.tank_name ?? `${activeAxolotl.tank_volume_liters ?? '?'}L tank`}</Text>
        </View>
        <View style={[s.statusDot, { borderColor: dotColor + '66', backgroundColor: dotColor + '22' }]}>
          <View style={[s.dotCore, { backgroundColor: dotColor }]} />
        </View>
      </View>

      <Text style={s.statusText}>{statusText}</Text>

      {latestLog && (
        <View style={s.pillRow}>
          {(['ph','ammonia','temperature','nitrate'] as const).map(k => (
            <ParameterPill key={k} paramKey={k} value={latestLog[k]} compact />
          ))}
        </View>
      )}
      {!latestLog && <Text style={s.logPrompt}>Tap to log your first parameters →</Text>}
    </TouchableOpacity>
  )
}

const s = StyleSheet.create({
  card:       { backgroundColor: colors.teal, borderRadius: radius.xl, padding: spacing.xl },
  emptyCard:  { backgroundColor: colors.tealPale, borderRadius: radius.xl, padding: spacing.xl, borderWidth: 1.5, borderColor: colors.tealLight, borderStyle: 'dashed' },
  header:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.sm },
  axolotlName:{ fontFamily: 'DMSerifDisplay_400Regular', fontSize: 20, color: '#fff' },
  tankLabel:  { fontFamily: fontFamily.sans, fontSize: fontSize.caption, color: 'rgba(255,255,255,0.55)', marginTop: 2 },
  statusDot:  { width: 32, height: 32, borderRadius: 10, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  dotCore:    { width: 10, height: 10, borderRadius: 5 },
  statusText: { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 22, color: '#fff', marginBottom: spacing.lg },
  pillRow:    { flexDirection: 'row', gap: spacing.sm },
  logPrompt:  { fontFamily: fontFamily.sans, fontSize: fontSize.caption, color: 'rgba(255,255,255,0.65)' },
  emptyTitle: { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 20, color: colors.teal, marginBottom: spacing.sm },
  emptyBody:  { fontFamily: fontFamily.sans, fontSize: fontSize.body, color: colors.tealMid },
})
```

### Home screen

```typescript
// app/(tabs)/index.tsx
import { useEffect } from 'react'
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { useAuthStore } from '@/store/useAuthStore'
import { useAxolotlStore } from '@/store/useAxolotlStore'
import { useParameterStore } from '@/store/useParameterStore'
import { TankCard } from '@/components/tank/TankCard'
import { colors } from '@/constants/colors'
import { fontFamily, fontSize, spacing, radius } from '@/constants/typography'

const QUICK_ACTIONS = [
  { label: 'Log params', emoji: '📊', route: '/(tabs)/tank' },
  { label: 'Check health', emoji: '📷', route: '/diagnosis/photo' },
  { label: 'SOS', emoji: '🆘', route: '/sos' },
  { label: 'Guides', emoji: '📖', route: '/(tabs)/guides' },
] as const

export default function HomeScreen() {
  const { profile }        = useAuthStore()
  const { activeAxolotl }  = useAxolotlStore()
  const { fetchLogs }      = useParameterStore()

  useEffect(() => { if (activeAxolotl) fetchLogs(activeAxolotl.id) }, [activeAxolotl?.id])

  const hour     = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <SafeAreaView style={{ flex:1, backgroundColor: colors.white }} edges={['top']}>
      <ScrollView contentContainerStyle={s.scroll}>

        {/* Header */}
        <View style={s.header}>
          <View>
            <Text style={s.greeting}>{greeting}</Text>
            <Text style={s.name}>{profile?.display_name?.split(' ')[0] ?? 'Keeper'}</Text>
          </View>
          <TouchableOpacity style={s.sosBtn} onPress={() => router.push('/sos')}>
            <Text style={s.sosBtnT}>SOS</Text>
          </TouchableOpacity>
        </View>

        {/* Tank status card */}
        <TankCard />

        {/* Quick actions */}
        <View style={s.actionsRow}>
          {QUICK_ACTIONS.map(a => (
            <TouchableOpacity key={a.label} style={s.action} onPress={() => router.push(a.route as any)}>
              <Text style={s.actionEmoji}>{a.emoji}</Text>
              <Text style={s.actionLabel}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* AOTW teaser */}
        <TouchableOpacity style={s.aotwTeaser} onPress={() => router.push('/(tabs)/community')} activeOpacity={0.9}>
          <Text style={s.aotwEyebrow}>AXOLOTL OF THE WEEK</Text>
          <Text style={s.aotwTitle}>See this week's featured axolotl →</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  scroll:       { padding: spacing.xxl, paddingBottom: 40 },
  header:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.xl },
  greeting:     { fontFamily: fontFamily.sans, fontSize: fontSize.caption, color: colors.text3 },
  name:         { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 28, color: colors.text1 },
  sosBtn:       { backgroundColor: colors.danger, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: radius.full },
  sosBtnT:      { fontFamily: fontFamily.sansBold, fontSize: fontSize.caption, color: '#fff', letterSpacing: 1 },
  actionsRow:   { flexDirection: 'row', gap: spacing.md, marginTop: spacing.xl, marginBottom: spacing.xl },
  action:       { flex: 1, backgroundColor: colors.sand, borderRadius: radius.lg, padding: spacing.md, alignItems: 'center' },
  actionEmoji:  { fontSize: 22, marginBottom: spacing.xs },
  actionLabel:  { fontFamily: fontFamily.sansMed, fontSize: fontSize.micro, color: colors.text2, textAlign: 'center' },
  aotwTeaser:   { backgroundColor: colors.charcoal, borderRadius: radius.xl, padding: spacing.xl },
  aotwEyebrow:  { fontFamily: fontFamily.sansMed, fontSize: fontSize.micro, color: 'rgba(255,255,255,0.35)', letterSpacing: 0.8, marginBottom: spacing.sm },
  aotwTitle:    { fontFamily: 'DMSerifDisplay_400Regular', fontSize: fontSize.h3, color: '#fff' },
})
```

```bash
git add . && git commit -m "feat: phase 14 - home dashboard with tank card, quick actions, SOS, AOTW teaser"
git push origin feature/phase-14-home-dashboard
```

---

## Phase 15 — RevenueCat & Paywall

**Goal:** Subscription products configured, paywall screen built, purchase and restore flows tested.
**Time:** 3 hours
**Prerequisites:** Phase 7, RevenueCat account

### Step 1: Create RevenueCat project

1. app.revenuecat.com → New project → `AxolotlCare`
2. Add iOS app: bundle ID `app.axolotlcare.ios`
3. Add Android app: package `app.axolotlcare.android`
4. Copy both API keys to `.env.local`

### Step 2: Create products in stores

**App Store Connect** (requires Apple Developer account):
- App Store Connect → Apps → AxolotlCare → Subscriptions
- Create subscription group: "AxolotlCare Pro"
- Monthly: Product ID `axolotlcare_pro_monthly`, price €6.99, 1 month
- Annual: Product ID `axolotlcare_pro_annual`, price €39.99, 1 year

**Google Play Console**:
- Monetise → Subscriptions → Create subscription
- Same Product IDs and prices

**RevenueCat dashboard:**
- Entitlements → New → ID: `pro`, Name: Pro
- Products → Add both product IDs
- Offerings → Default offering → attach both packages

### Step 3: Subscription helpers

```typescript
// lib/revenuecat.ts
import Purchases, { PurchasesPackage, CustomerInfo } from 'react-native-purchases'
import { Platform } from 'react-native'

export function initRevenueCat(userId: string) {
  Purchases.configure({
    apiKey: Platform.select({
      ios:     process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY!,
      android: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY!,
      default: process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY!,
    })!,
    appUserID: userId,
  })
}

export async function getOfferings(): Promise<PurchasesPackage[]> {
  const offerings = await Purchases.getOfferings()
  return offerings.current?.availablePackages ?? []
}

export async function purchase(pkg: PurchasesPackage): Promise<CustomerInfo | null> {
  try {
    const { customerInfo } = await Purchases.purchasePackage(pkg)
    return customerInfo
  } catch (e: any) {
    if (!e.userCancelled) throw e
    return null
  }
}

export async function restore(): Promise<CustomerInfo> {
  return Purchases.restorePurchases()
}

export function isPro(info: CustomerInfo): boolean {
  return info.entitlements.active['pro'] !== undefined
}
```

### Step 4: Subscription store

```typescript
// store/useSubscriptionStore.ts
import { create } from 'zustand'
import Purchases, { type CustomerInfo } from 'react-native-purchases'

interface SubState {
  isPro:      boolean
  info:       CustomerInfo | null
  checkStatus:() => Promise<void>
  setInfo:    (i: CustomerInfo) => void
}

export const useSubscriptionStore = create<SubState>((set) => ({
  isPro: false, info: null,
  checkStatus: async () => {
    try {
      const i = await Purchases.getCustomerInfo()
      set({ info: i, isPro: i.entitlements.active['pro'] !== undefined })
    } catch (_) {}
  },
  setInfo: (i) => set({ info: i, isPro: i.entitlements.active['pro'] !== undefined }),
}))
```

### Step 5: Wire RevenueCat into root layout

Add to the auth state change handler in `app/_layout.tsx`:

```typescript
import { initRevenueCat } from '@/lib/revenuecat'
import { useSubscriptionStore } from '@/store/useSubscriptionStore'

// Inside the onAuthStateChange callback, when session exists:
if (session) {
  initRevenueCat(session.user.id)
  useSubscriptionStore.getState().checkStatus()
}
```

### Step 6: Paywall screen

```typescript
// app/paywall.tsx
import { useEffect, useState } from 'react'
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import { router } from 'expo-router'
import { type PurchasesPackage } from 'react-native-purchases'
import { getOfferings, purchase, restore, isPro } from '@/lib/revenuecat'
import { useSubscriptionStore } from '@/store/useSubscriptionStore'
import { Button } from '@/components/ui/Button'
import { colors } from '@/constants/colors'
import { fontFamily, fontSize, spacing, radius } from '@/constants/typography'

const FEATURES = [
  'Photo health diagnosis (Claude AI Vision)',
  'SOS emergency triage',
  'Unlimited parameter logging',
  'AI trend analysis & anomaly alerts',
  'Context-aware AI care chat',
  'Treatment dosage calculator',
  'Up to 10 axolotl profiles',
  'Vet-ready PDF health reports',
]

export default function Paywall() {
  const { setInfo } = useSubscriptionStore()
  const [packages,   setPackages]   = useState<PurchasesPackage[]>([])
  const [selected,   setSelected]   = useState<PurchasesPackage | null>(null)
  const [loading,    setLoading]    = useState(true)
  const [purchasing, setPurchasing] = useState(false)

  useEffect(() => {
    getOfferings().then(pkgs => {
      setPackages(pkgs)
      setSelected(pkgs.find(p => p.identifier.includes('annual')) ?? pkgs[0] ?? null)
      setLoading(false)
    })
  }, [])

  const handlePurchase = async () => {
    if (!selected) return
    setPurchasing(true)
    try {
      const info = await purchase(selected)
      if (info && isPro(info)) {
        setInfo(info)
        Alert.alert('Welcome to Pro!', 'All Pro features are now unlocked.', [
          { text: 'Great!', onPress: () => router.back() }
        ])
      }
    } catch (e: any) { Alert.alert('Purchase failed', e.message) }
    setPurchasing(false)
  }

  const handleRestore = async () => {
    setPurchasing(true)
    try {
      const info = await restore()
      if (isPro(info)) { setInfo(info); router.back() }
      else Alert.alert('No subscription found', 'No active Pro subscription for this account.')
    } catch (e: any) { Alert.alert('Error', e.message) }
    setPurchasing(false)
  }

  if (loading) return <View style={s.centered}><ActivityIndicator color={colors.teal} size="large" /></View>

  return (
    <ScrollView style={s.container} contentContainerStyle={s.scroll}>
      <TouchableOpacity onPress={() => router.back()} style={s.close}>
        <Text style={s.closeT}>✕</Text>
      </TouchableOpacity>

      <Text style={s.title}>AxolotlCare Pro</Text>
      <Text style={s.sub}>Everything your axolotl needs.</Text>

      <View style={s.features}>
        {FEATURES.map(f => (
          <View key={f} style={s.featureRow}>
            <Text style={s.tick}>✓</Text>
            <Text style={s.featureT}>{f}</Text>
          </View>
        ))}
      </View>

      <View style={s.plans}>
        {packages.map(pkg => {
          const annual     = pkg.identifier.includes('annual')
          const isSelected = selected?.identifier === pkg.identifier
          return (
            <TouchableOpacity key={pkg.identifier} style={[s.plan, isSelected && s.planSelected]} onPress={() => setSelected(pkg)}>
              {annual && (
                <View style={s.badge}><Text style={s.badgeT}>BEST VALUE — 52% OFF</Text></View>
              )}
              <Text style={[s.planName, isSelected && { color: colors.teal }]}>{annual ? 'Annual' : 'Monthly'}</Text>
              <Text style={[s.planPrice, isSelected && { color: colors.teal }]}>{pkg.product.priceString}</Text>
              {annual && <Text style={s.planEquiv}>= {(pkg.product.price / 12).toFixed(2)}€/month</Text>}
            </TouchableOpacity>
          )
        })}
      </View>

      <Button
        title={purchasing ? 'Processing...' : `Start Pro — ${selected?.product.priceString ?? ''}`}
        onPress={handlePurchase} loading={purchasing} style={s.purchaseBtn}
      />

      <TouchableOpacity onPress={handleRestore} style={s.restore}>
        <Text style={s.restoreT}>Restore previous purchase</Text>
      </TouchableOpacity>

      <Text style={s.legal}>
        Charged at purchase confirmation. Renews automatically. Cancel anytime in App Store or Play Store settings.
      </Text>
    </ScrollView>
  )
}

const s = StyleSheet.create({
  container:  { flex: 1, backgroundColor: colors.white },
  scroll:     { padding: spacing.xxl, paddingBottom: 60 },
  centered:   { flex: 1, justifyContent: 'center', alignItems: 'center' },
  close:      { alignSelf: 'flex-end', padding: spacing.sm, marginBottom: spacing.lg },
  closeT:     { fontFamily: fontFamily.sans, fontSize: 20, color: colors.text3 },
  title:      { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 32, color: colors.text1, marginBottom: spacing.sm },
  sub:        { fontFamily: fontFamily.sans, fontSize: fontSize.body, color: colors.text2, marginBottom: spacing.xxl },
  features:   { marginBottom: spacing.xxl },
  featureRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  tick:       { fontFamily: fontFamily.sansSemi, fontSize: fontSize.body, color: colors.teal, width: 24 },
  featureT:   { fontFamily: fontFamily.sans, fontSize: fontSize.body, color: colors.text1, flex: 1 },
  plans:      { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.xl },
  plan:       { flex: 1, borderRadius: radius.lg, padding: spacing.lg, borderWidth: 1.5, borderColor: colors.borderMid, alignItems: 'center', paddingTop: spacing.xxl, position: 'relative' },
  planSelected:{ borderColor: colors.teal, backgroundColor: colors.tealPale },
  badge:      { position: 'absolute', top: -11, backgroundColor: colors.teal, paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: radius.full },
  badgeT:     { fontFamily: fontFamily.sansSemi, fontSize: 8, color: '#fff', letterSpacing: 0.4 },
  planName:   { fontFamily: fontFamily.sansSemi, fontSize: fontSize.body, color: colors.text2, marginBottom: spacing.xs },
  planPrice:  { fontFamily: fontFamily.sansBold, fontSize: fontSize.h2, color: colors.text1 },
  planEquiv:  { fontFamily: fontFamily.sans, fontSize: fontSize.micro, color: colors.text3, marginTop: 2 },
  purchaseBtn:{ marginBottom: spacing.lg },
  restore:    { alignItems: 'center', marginBottom: spacing.xl },
  restoreT:   { fontFamily: fontFamily.sans, fontSize: fontSize.caption, color: colors.text3 },
  legal:      { fontFamily: fontFamily.sans, fontSize: 10, color: colors.text3, textAlign: 'center', lineHeight: 15 },
})
```

### Step 7: Sync subscription with Supabase via webhook

```typescript
// supabase/functions/revenuecat-webhook/index.ts
import { createClient } from 'npm:@supabase/supabase-js@2'

Deno.serve(async (req) => {
  const body     = await req.json()
  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

  const userId = body.app_user_id
  const event  = body.type  // 'INITIAL_PURCHASE' | 'RENEWAL' | 'CANCELLATION' | 'EXPIRATION'

  const isPro      = ['INITIAL_PURCHASE','RENEWAL','PRODUCT_CHANGE'].includes(event)
  const tier       = isPro ? 'pro' : 'free'
  const expiresAt  = isPro ? new Date(body.expiration_at_ms).toISOString() : null

  await supabase.from('profiles').update({
    subscription_tier:       tier,
    subscription_expires_at: expiresAt,
  }).eq('id', userId)

  return new Response('OK')
})
```

```bash
supabase functions deploy revenuecat-webhook
```

In RevenueCat dashboard → Integrations → Webhooks → Add endpoint:
- URL: `https://YOUR_PROJECT.supabase.co/functions/v1/revenuecat-webhook`

### Step 8: Commit

```bash
git add .
git commit -m "feat: phase 15 - RevenueCat paywall with monthly/annual plans and webhook sync"
git push origin feature/phase-15-revenuecat-paywall
```

### Phase 15 Definition of Done
- [ ] Paywall shows packages loaded from RevenueCat
- [ ] Sandbox purchase completes without error
- [ ] `isPro` returns true after sandbox purchase
- [ ] RevenueCat webhook syncs tier to `profiles.subscription_tier`
- [ ] Restore purchase works
- [ ] Free tier gating in parameter logger correctly blocks at 5 logs

---

## Phase 16 — Photo Health Diagnosis

**Goal:** Camera → Claude Vision API (via Supabase Edge Function) → structured AI diagnosis with treatment steps. Pro-only.
**Time:** 4 hours
**Prerequisites:** Phase 15 (Pro check), Phase 12 (Edge Function pattern)

### Step 1: Feature branch

```bash
git checkout develop && git checkout -b feature/phase-16-photo-diagnosis
```

### Step 2: Create diagnose-photo Edge Function

```typescript
// supabase/functions/diagnose-photo/index.ts
import Anthropic from 'npm:@anthropic-ai/sdk'
import { createClient } from 'npm:@supabase/supabase-js@2'

const anthropic = new Anthropic({ apiKey: Deno.env.get('ANTHROPIC_API_KEY')! })

Deno.serve(async (req) => {
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) return new Response('Unauthorized', { status: 401 })

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: authHeader } } }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return new Response('Unauthorized', { status: 401 })

  // Gate on Pro subscription
  const { data: profile } = await supabase
    .from('profiles').select('subscription_tier').eq('id', user.id).single()
  if (profile?.subscription_tier !== 'pro') {
    return new Response(JSON.stringify({ error: 'Pro subscription required' }), {
      status: 403, headers: { 'Content-Type': 'application/json' }
    })
  }

  const { image_base64, image_media_type, axolotl_id, symptoms } = await req.json()

  // Fetch context for personalised diagnosis
  const { data: axolotl } = await supabase
    .from('axolotls').select('name, morph, tank_volume_liters').eq('id', axolotl_id).single()

  const { data: recentParams } = await supabase
    .from('water_parameters').select('ph, ammonia, nitrite, nitrate, temperature, logged_at')
    .eq('axolotl_id', axolotl_id).order('logged_at', { ascending: false }).limit(3)

  const paramsText = recentParams?.length
    ? recentParams.map(p =>
        `${new Date(p.logged_at).toLocaleDateString()}: pH ${p.ph ?? 'N/A'}, NH3 ${p.ammonia ?? 'N/A'}, NO2 ${p.nitrite ?? 'N/A'}, Temp ${p.temperature ?? 'N/A'}°C`
      ).join('\n')
    : 'No recent water parameters logged.'

  const systemPrompt = `You are an expert axolotl health diagnostician. A worried keeper needs your help right now.

Axolotl: ${axolotl?.name ?? 'Unknown'} (${axolotl?.morph ?? 'unknown morph'}) in a ${axolotl?.tank_volume_liters ?? '?'}L tank.
Recent water parameters:
${paramsText}
Reported symptoms: ${symptoms?.join(', ') || 'None specified'}

Examine the photo carefully. Respond ONLY with valid JSON matching this exact structure:
{
  "diagnosis": "Name of condition",
  "confidence": "high|medium|low",
  "severity": "critical|moderate|mild|none",
  "what_you_see": "1-2 sentences describing exactly what is visible in the photo",
  "possible_causes": ["cause 1", "cause 2"],
  "treatment_steps": [
    "Step 1: What to do in the next 30 minutes",
    "Step 2: What to do in the next 24 hours",
    "Step 3: Ongoing treatment"
  ],
  "when_to_see_vet": "Exact condition under which to seek emergency vet care",
  "follow_up_days": 3,
  "water_quality_note": "Observation about water quality as a contributing factor (or null)"
}

Be specific. Reference their actual water readings when relevant. Never be vague or generic.`

  try {
    const response = await anthropic.messages.create({
      model:      'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system:     systemPrompt,
      messages: [{
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: image_media_type, data: image_base64 } },
          { type: 'text',  text:  'Please diagnose any health issues visible in this axolotl photo.' }
        ]
      }]
    })

    const text      = response.content[0].type === 'text' ? response.content[0].text : ''
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('Could not parse AI response as JSON')
    const diagnosis = JSON.parse(jsonMatch[0])

    // Save to health_logs
    const { data: log } = await supabase.from('health_logs').insert({
      axolotl_id, owner_id: user.id, type: 'photo_diagnosis',
      symptoms: symptoms ?? [],
      ai_diagnosis: diagnosis,
      follow_up_at: diagnosis.follow_up_days
        ? new Date(Date.now() + diagnosis.follow_up_days * 86400000).toISOString()
        : null,
    }).select('id').single()

    return new Response(JSON.stringify({ ...diagnosis, log_id: log?.id }), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (err: any) {
    console.error('Diagnosis error:', err)
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { 'Content-Type': 'application/json' }
    })
  }
})
```

### Step 3: Deploy

```bash
supabase functions deploy diagnose-photo
```

### Step 4: Photo diagnosis screen

```typescript
// app/diagnosis/photo.tsx
import { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert } from 'react-native'
import { router } from 'expo-router'
import * as ImagePicker from 'expo-image-picker'
import { supabase } from '@/lib/supabase'
import { useAxolotlStore } from '@/store/useAxolotlStore'
import { useSubscriptionStore } from '@/store/useSubscriptionStore'
import { Button } from '@/components/ui/Button'
import { colors } from '@/constants/colors'
import { fontFamily, fontSize, spacing, radius } from '@/constants/typography'

const SYMPTOMS = [
  'Floating / buoyant', 'Not eating', 'White fuzzy patches', 'Gill degradation',
  'Curled tail', 'Skin lesions', 'Lethargic', 'Bloated',
]

export default function PhotoDiagnosis() {
  const { activeAxolotl } = useAxolotlStore()
  const { isPro }         = useSubscriptionStore()
  const [photoUri,  setPhotoUri]  = useState<string | null>(null)
  const [photoB64,  setPhotoB64]  = useState<string | null>(null)
  const [symptoms,  setSymptoms]  = useState<Set<string>>(new Set())
  const [loading,   setLoading]   = useState(false)
  const [result,    setResult]    = useState<any | null>(null)

  if (!isPro) {
    return (
      <View style={s.gateContainer}>
        <TouchableOpacity onPress={() => router.back()} style={s.back}><Text style={s.backT}>← Back</Text></TouchableOpacity>
        <Text style={s.title}>Photo Diagnosis</Text>
        <Text style={s.gateText}>AI photo diagnosis is a Pro feature.</Text>
        <Button title="Upgrade to Pro" onPress={() => router.push('/paywall')} />
      </View>
    )
  }

  const pickPhoto = async () => {
    const r = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, quality: 0.7, base64: true,
    })
    if (!r.canceled && r.assets[0]) {
      setPhotoUri(r.assets[0].uri)
      setPhotoB64(r.assets[0].base64 ?? null)
    }
  }

  const runDiagnosis = async () => {
    if (!photoB64 || !activeAxolotl) return
    setLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const res = await fetch(`${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/diagnose-photo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session?.access_token}` },
        body: JSON.stringify({
          image_base64:      photoB64,
          image_media_type:  'image/jpeg',
          axolotl_id:        activeAxolotl.id,
          symptoms:          Array.from(symptoms),
        }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setResult(data)
    } catch (e: any) { Alert.alert('Diagnosis failed', e.message) }
    setLoading(false)
  }

  // Results view
  if (result) {
    const sc = result.severity === 'critical' ? colors.danger : result.severity === 'moderate' ? colors.warning : colors.safe
    return (
      <ScrollView style={s.container} contentContainerStyle={s.scroll}>
        <TouchableOpacity onPress={() => setResult(null)} style={s.back}><Text style={s.backT}>← New diagnosis</Text></TouchableOpacity>
        <Text style={s.title}>Diagnosis Result</Text>
        <View style={[s.diagBanner, { backgroundColor: sc + '15', borderColor: sc }]}>
          <Text style={[s.diagName, { color: sc }]}>{result.diagnosis}</Text>
          <Text style={[s.diagMeta, { color: sc }]}>{result.confidence} confidence · {result.severity} severity</Text>
        </View>
        <Text style={s.sectionHead}>What we see</Text>
        <Text style={s.sectionBody}>{result.what_you_see}</Text>
        <Text style={s.sectionHead}>Treatment steps</Text>
        {result.treatment_steps.map((step: string, i: number) => (
          <View key={i} style={s.stepRow}>
            <View style={s.stepNum}><Text style={s.stepNumT}>{i+1}</Text></View>
            <Text style={s.stepText}>{step}</Text>
          </View>
        ))}
        <Text style={s.sectionHead}>When to call a vet</Text>
        <Text style={s.sectionBody}>{result.when_to_see_vet}</Text>
        {result.water_quality_note && (
          <><Text style={s.sectionHead}>Water quality note</Text>
          <Text style={s.sectionBody}>{result.water_quality_note}</Text></>
        )}
      </ScrollView>
    )
  }

  return (
    <ScrollView style={s.container} contentContainerStyle={s.scroll}>
      <TouchableOpacity onPress={() => router.back()} style={s.back}><Text style={s.backT}>← Back</Text></TouchableOpacity>
      <Text style={s.title}>Photo Diagnosis</Text>
      <Text style={s.sub}>Upload a photo of {activeAxolotl?.name ?? 'your axolotl'} for AI health analysis</Text>

      <TouchableOpacity style={s.photoPicker} onPress={pickPhoto}>
        {photoUri
          ? <Image source={{ uri: photoUri }} style={s.photo} />
          : <View style={s.photoEmpty}>
              <Text style={s.photoEmptyT}>Tap to add photo</Text>
              <Text style={s.photoEmptySub}>Best: full body visible, good lighting</Text>
            </View>
        }
      </TouchableOpacity>

      <Text style={s.sympTitle}>Concerned about? (optional)</Text>
      <View style={s.sympGrid}>
        {SYMPTOMS.map(sym => (
          <TouchableOpacity key={sym} style={[s.sympChip, symptoms.has(sym) && s.sympChipOn]} onPress={() => {
            setSymptoms(prev => { const n = new Set(prev); n.has(sym) ? n.delete(sym) : n.add(sym); return n })
          }}>
            <Text style={[s.sympText, symptoms.has(sym) && s.sympTextOn]}>{sym}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Button title={loading ? 'Analysing photo...' : 'Run AI diagnosis'} onPress={runDiagnosis} disabled={!photoUri || loading} loading={loading} />
      {loading && <Text style={s.loadingNote}>Claude is examining the photo. Takes 10–20 seconds.</Text>}
    </ScrollView>
  )
}

const s = StyleSheet.create({
  container:    { flex: 1, backgroundColor: colors.white },
  scroll:       { padding: spacing.xxl, paddingBottom: 60 },
  gateContainer:{ flex: 1, backgroundColor: colors.white, padding: spacing.xxl },
  back:         { marginBottom: spacing.xl, marginTop: spacing.xl },
  backT:        { fontFamily: fontFamily.sans, fontSize: fontSize.body, color: colors.teal },
  title:        { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 26, color: colors.text1, marginBottom: spacing.sm },
  sub:          { fontFamily: fontFamily.sans, fontSize: fontSize.body, color: colors.text2, marginBottom: spacing.xl },
  gateText:     { fontFamily: fontFamily.sans, fontSize: fontSize.body, color: colors.text2, marginBottom: spacing.xl },
  photoPicker:  { marginBottom: spacing.xl },
  photo:        { width: '100%', height: 240, borderRadius: radius.lg },
  photoEmpty:   { height: 200, backgroundColor: colors.sand, borderRadius: radius.lg, borderWidth: 1.5, borderColor: colors.borderMid, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center' },
  photoEmptyT:  { fontFamily: fontFamily.sansMed, fontSize: fontSize.body, color: colors.text2, marginBottom: spacing.xs },
  photoEmptySub:{ fontFamily: fontFamily.sans, fontSize: fontSize.caption, color: colors.text3, textAlign: 'center', paddingHorizontal: spacing.lg },
  sympTitle:    { fontFamily: fontFamily.sansMed, fontSize: fontSize.body, color: colors.text1, marginBottom: spacing.md },
  sympGrid:     { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.xl },
  sympChip:     { paddingHorizontal: 12, paddingVertical: 7, borderRadius: radius.full, borderWidth: 0.5, borderColor: colors.borderMid },
  sympChipOn:   { backgroundColor: colors.teal, borderColor: colors.teal },
  sympText:     { fontFamily: fontFamily.sans, fontSize: fontSize.caption, color: colors.text2 },
  sympTextOn:   { color: '#fff' },
  loadingNote:  { fontFamily: fontFamily.sans, fontSize: fontSize.caption, color: colors.text3, textAlign: 'center', marginTop: spacing.md },
  diagBanner:   { borderRadius: radius.lg, borderWidth: 1.5, padding: spacing.lg, marginBottom: spacing.xl },
  diagName:     { fontFamily: 'DMSerifDisplay_400Regular', fontSize: fontSize.h2, marginBottom: spacing.xs },
  diagMeta:     { fontFamily: fontFamily.sans, fontSize: fontSize.caption },
  sectionHead:  { fontFamily: fontFamily.sansSemi, fontSize: fontSize.body, color: colors.text1, marginBottom: spacing.sm, marginTop: spacing.lg },
  sectionBody:  { fontFamily: fontFamily.sans, fontSize: fontSize.body, color: colors.text2, lineHeight: 22 },
  stepRow:      { flexDirection: 'row', alignItems: 'flex-start', marginBottom: spacing.md },
  stepNum:      { width: 26, height: 26, borderRadius: 13, backgroundColor: colors.tealPale, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md, marginTop: 2 },
  stepNumT:     { fontFamily: fontFamily.sansSemi, fontSize: fontSize.caption, color: colors.teal },
  stepText:     { fontFamily: fontFamily.sans, fontSize: fontSize.body, color: colors.text2, flex: 1, lineHeight: 22 },
})
```

### Step 5: Commit

```bash
git add .
git commit -m "feat: phase 16 - photo diagnosis with Claude Vision edge function"
git push origin feature/phase-16-photo-diagnosis
```

### Phase 16 Definition of Done
- [ ] `supabase functions deploy diagnose-photo` succeeds
- [ ] Non-Pro users get 403 response and see paywall prompt
- [ ] Photo upload → Edge Function → structured JSON returned
- [ ] Diagnosis saved to `health_logs` table
- [ ] Follow-up date set in `health_logs.follow_up_at`
- [ ] Results screen renders all diagnosis fields correctly

---

## Phase 17 — SOS Emergency Mode

**Goal:** Full-screen emergency flow — symptom picker, Claude AI triage, immediate action at the top.
**Time:** 3 hours
**Prerequisites:** Phase 16

### Step 1: Feature branch

```bash
git checkout develop && git checkout -b feature/phase-17-sos-emergency
```

### Step 2: SOS triage Edge Function

```typescript
// supabase/functions/sos-triage/index.ts
import Anthropic from 'npm:@anthropic-ai/sdk'
import { createClient } from 'npm:@supabase/supabase-js@2'

const anthropic = new Anthropic({ apiKey: Deno.env.get('ANTHROPIC_API_KEY')! })

Deno.serve(async (req) => {
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) return new Response('Unauthorized', { status: 401 })

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: authHeader } } }
  )
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return new Response('Unauthorized', { status: 401 })

  // Pro check
  const { data: profile } = await supabase.from('profiles').select('subscription_tier').eq('id', user.id).single()
  if (profile?.subscription_tier !== 'pro') {
    return new Response(JSON.stringify({ error: 'Pro required' }), { status: 403, headers: { 'Content-Type': 'application/json' } })
  }

  const { symptoms, axolotl_id } = await req.json()

  const { data: axolotl } = await supabase.from('axolotls')
    .select('name, morph, tank_volume_liters').eq('id', axolotl_id).single()

  const { data: lastParams } = await supabase.from('water_parameters')
    .select('ph, ammonia, nitrite, nitrate, temperature, logged_at')
    .eq('axolotl_id', axolotl_id).order('logged_at', { ascending: false }).limit(1).single()

  const paramsText = lastParams
    ? `pH ${lastParams.ph}, NH3 ${lastParams.ammonia}ppm, NO2 ${lastParams.nitrite}ppm, temp ${lastParams.temperature}°C (${new Date(lastParams.logged_at).toLocaleDateString()})`
    : 'No water parameters logged'

  const prompt = `You are an emergency axolotl health advisor. A keeper is in CRISIS. Be calm, specific, and actionable.

Axolotl: ${axolotl?.name} (${axolotl?.morph}) in ${axolotl?.tank_volume_liters}L tank.
Last water reading: ${paramsText}
Reported symptoms: ${symptoms.join(', ')}

Respond ONLY with JSON:
{
  "likely_cause": "Most probable cause in one clear sentence",
  "severity": "critical|serious|moderate",
  "immediate_action": "What to do RIGHT NOW in the next 5 minutes — be very specific",
  "steps": [
    "Step 2 (next 30 min): ...",
    "Step 3 (next 24 hrs): ...",
    "Step 4 (recovery): ..."
  ],
  "vet_threshold": "Call a vet immediately if [specific observable condition]",
  "reassurance": "One calm, genuine sentence for the worried owner"
}`

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514', max_tokens: 800,
      messages: [{ role: 'user', content: prompt }]
    })
    const text      = response.content[0].type === 'text' ? response.content[0].text : ''
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('Parse error')
    const triage = JSON.parse(jsonMatch[0])

    await supabase.from('health_logs').insert({
      axolotl_id, owner_id: user.id, type: 'sos_emergency',
      symptoms, ai_diagnosis: triage,
      follow_up_at: new Date(Date.now() + 86400000).toISOString(),
    })

    return new Response(JSON.stringify(triage), { headers: { 'Content-Type': 'application/json' } })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
})
```

```bash
supabase functions deploy sos-triage
```

### Step 3: SOS screen structure

The SOS screen (`app/sos.tsx`) is presented as a full-screen dark modal. Structure:

**Before diagnosis:**
- Dark background (`#0D1B2A`)
- Red "SOS" header with pulsing animation (use Lottie `sos-pulse.json`)
- Large bold: "What are you seeing?" 
- Symptom grid (same SYMPTOMS list as photo diagnosis but larger touch targets)
- Axolotl selector if user has multiple axolotls
- "Get immediate help" red button

**After diagnosis:**
- Immediate action card: white text on deep red background, very prominent
- "Likely cause" in one sentence
- Reassurance sentence (italic, softer)
- Steps list (Step 2, 3, 4 — Step 1 is the immediate action card)
- Vet threshold in orange card
- "Mark as resolved" → logs outcome to health_logs

Follow the same API call pattern as photo diagnosis (Bearer token, Supabase Edge Function URL).

### Step 4: Commit

```bash
git add .
git commit -m "feat: phase 17 - SOS emergency mode with Claude triage edge function"
git push origin feature/phase-17-sos-emergency
```

---

## Phase 18 — AI Trend Analysis

**Goal:** Pro feature that analyses last 14 days of parameter logs and surfaces anomalies and recommendations.
**Time:** 2 hours
**Prerequisites:** Phase 16

### Edge Function pattern

```typescript
// supabase/functions/analyze-trends/index.ts
// Auth check + Pro check (same as diagnose-photo)
// Input: { axolotl_id }
// Fetch last 14 water_parameters logs
// Build prompt: "You are a water chemistry expert. Here are 14 days of logs: [JSON].
//   Respond with JSON: { trend: 'stable|improving|declining|spike', summary: '2-3 sentences',
//   anomalies: [{param, observation}], recommended_action: string | null, urgent: boolean }"
// Return structured JSON
// Model: claude-sonnet-4-20250514, max_tokens: 600
```

```bash
supabase functions deploy analyze-trends
```

UI: A "Trend Analysis" card below the parameter chart in the Tank tab. Shows trend badge (stable/improving/declining/spike), summary text, and any anomalies. Tap "Refresh analysis" calls the Edge Function.

```bash
git add . && git commit -m "feat: phase 18 - AI parameter trend analysis edge function and UI card"
git push origin feature/phase-18-trend-analysis
```

---

## Phase 19 — Treatment Calculator

**Goal:** Local math (no AI needed) for dosage calculations based on tank volume. Free and Pro.
**Time:** 2 hours
**Prerequisites:** Phase 8 (tank volume stored)

```typescript
// lib/treatments.ts
export interface Treatment {
  name:        string
  description: string
  dosage:      string
  steps:       string[]
  warnings:    string[]
}

export function calcSaltBath(litres: number): Treatment {
  const grams = litres * 1  // 1g/L for axolotls
  return {
    name: 'Salt bath (1 g/L)',
    description: 'Used for mild fungal infections and stress reduction.',
    dosage: `${grams}g non-iodised salt for your ${litres}L tank`,
    steps: [
      `Dissolve ${grams}g aquarium salt (non-iodised) in a cup of tank water`,
      'Add slowly over 30 minutes — not all at once',
      'Observe axolotl throughout. Remove immediately if any distress.',
      'Maximum treatment time: 24 hours',
      'Then do a 25% water change to dilute salt concentration',
    ],
    warnings: ['Never use iodised table salt', 'Do not exceed 1g/L', 'Remove live plants — salt kills them'],
  }
}

export function calcMethlynBlue(litres: number): Treatment {
  const ml = (litres / 40) * 1  // 1ml per 40L typical dose
  return {
    name: 'Methylene blue (antifungal)',
    description: 'Effective against fungal infections and some bacterial issues.',
    dosage: `${ml.toFixed(1)}ml for your ${litres}L tank`,
    steps: [
      `Add ${ml.toFixed(1)}ml methylene blue solution to tank`,
      'Turn off UV steriliser for duration of treatment',
      'Treat for 3–5 days',
      'Do 25% water change between doses',
      'Stains silicone — normal and harmless',
    ],
    warnings: ['Kills beneficial bacteria — do not use in uncycled tanks', 'Stains everything blue temporarily', 'Do not use with stressed axolotls'],
  }
}
```

Build a screen with a treatment type picker and automatic dose display based on `activeAxolotl.tank_volume_liters`. Show steps and warnings clearly.

```bash
git add . && git commit -m "feat: phase 19 - treatment calculator with salt bath, methylene blue, and dosage math"
git push origin feature/phase-19-treatment-calc
```

---

## Phase 20 — AI Care Chat

**Goal:** Context-aware chat — Claude knows the user's tank, axolotl, and recent parameters before they ask.
**Time:** 3 hours
**Prerequisites:** Phase 16

### Edge Function

```typescript
// supabase/functions/care-chat/index.ts
// Auth check + Pro check
// Input: { axolotl_id, messages: [{ role, content }] }
// Build system prompt with tank context (axolotl + last 5 param logs)
// Pass conversation history to Claude
// Return assistant message text
// Model: claude-sonnet-4-20250514, max_tokens: 512
// System: "You are a concise axolotl care expert. 
//   You know this keeper's tank. Answer clearly in 2-4 sentences. 
//   Always be specific — never say 'it depends' without explaining what it depends on."
```

```bash
supabase functions deploy care-chat
```

UI: A chat interface component with:
- Message history list (user messages right-aligned, AI left-aligned)
- Text input with send button
- Loading indicator while waiting for response
- Context info card at top: "Chatting about [axolotl name]'s tank"

```bash
git add . && git commit -m "feat: phase 20 - AI care chat with tank context edge function"
git push origin feature/phase-20-ai-chat
```

---

## Phase 21 — Onboarding Flow

**Goal:** Complete 5-step onboarding from first launch to first parameter log and community intro.
**Time:** 4 hours
**Prerequisites:** Phases 8, 9, 12, 13 complete

### Step 1: Create onboarding layout

```bash
mkdir -p app/onboarding
cat > app/onboarding/_layout.tsx << 'EOF'
import { Stack } from 'expo-router'
export default function OnboardingLayout() {
  return <Stack screenOptions={{ headerShown: false }} />
}
EOF
```

### Step 2: Five screens

**Screen 1 — Welcome** (`app/onboarding/welcome.tsx`)
```
Background: colors.teal
Center: Lottie axolotl-swim.json animation
Below: "Welcome to AxolotlCare" (white DM Serif, 32px)
Below: "Let's set up your axolotl's profile." (white, body)
Button: "Let's start" → navigate to /onboarding/morph
```

**Screen 2 — Morph picker** (`app/onboarding/morph.tsx`)
```
Header: "What type of axolotl do you have?"
SubHeader: "We'll personalise tips for your morph."
Content: Full MORPHS list as large tappable cards (not horizontal scroll)
Each card: morph name, rarity badge, description
Rare/very rare morphs: celebrate with Lottie sparkle on select
Bottom: "Next →" → /onboarding/tank-setup
```

**Screen 3 — Tank setup** (`app/onboarding/tank-setup.tsx`)
```
Header: "Tell us about their home"
Fields: Axolotl name, tank volume (litres)
Question: "Is the tank cycled yet?" [Yes, already cycled] [No, starting now] [Not sure]
  → "No" routes to Cycle Wizard shortcut
  → "Yes" / "Not sure" continues to step 4
Bottom: "Next →" creates axolotl record, → /onboarding/first-params
```

This is where the axolotl creation actually happens — combine morph (from step 2) + name + volume.

**Screen 4 — First parameters** (`app/onboarding/first-params.tsx`)
```
Header: "Log your first water test"
Sub: "This is the most important habit you can build."
Content: <ParameterLogger /> component
Bottom skip: "Skip for now →"
```

On log save → navigate to /onboarding/community-intro.

**Screen 5 — Community intro** (`app/onboarding/community-intro.tsx`)
```
Header: "Welcome to the community"
Content:
  - AOTW preview card (fetch latest winner from DB)
  - "Every week we feature one keeper's axolotl"
  - "Enable notifications to get heat alerts and AOTW announcements"
  [Enable notifications] button → calls requestPermission() and requestAndSaveLocation()
  [Maybe later]
Bottom: "Start keeping →" → router.replace('/(tabs)')
```

### Step 3: Skip logic

Store onboarding completion in AsyncStorage:
```typescript
// In welcome screen, check on mount:
import AsyncStorage from '@react-native-async-storage/async-storage'

const completed = await AsyncStorage.getItem('onboarding_complete')
if (completed) router.replace('/(tabs)')
// In community-intro, final step:
await AsyncStorage.setItem('onboarding_complete', 'true')
```

### Step 4: Commit

```bash
git add .
git commit -m "feat: phase 21 - complete 5-step onboarding flow"
git push origin feature/phase-21-onboarding
```

### Phase 21 Definition of Done
- [ ] New users land on /onboarding/welcome after signup
- [ ] Morph picker selection persists to tank-setup
- [ ] Axolotl created in DB on step 3 completion
- [ ] Parameter logger works in step 4
- [ ] Notification permission requested in step 5
- [ ] Location captured and saved to profile in step 5
- [ ] Returning users bypass onboarding

---

## Phase 22 — TestFlight Beta

**Goal:** iOS app in TestFlight with beta testers from r/axolotls.
**Time:** 2 hours
**Prerequisites:** All Phases 1–21 working, Apple Developer account ($99/yr)

### Step 1: Set up EAS Build

```bash
npm install -g eas-cli
eas login
eas build:configure
```

Verify `eas.json` has production and preview profiles:

```json
{
  "cli": { "version": ">= 7.0.0" },
  "build": {
    "preview": {
      "distribution": "internal",
      "ios": { "simulator": false }
    },
    "production": {
      "ios":     { "buildConfiguration": "Release" },
      "android": { "buildType": "app-bundle" }
    }
  }
}
```

### Step 2: Build and submit to TestFlight

```bash
# Build (takes 10-20 minutes on Expo's infrastructure)
eas build --platform ios --profile preview

# Submit to TestFlight
eas submit --platform ios --latest
```

In App Store Connect → TestFlight → Add external testers or share the public link.

### Step 3: Recruit beta testers from r/axolotls

Post in r/axolotls (ask for DMs, don't post the link directly to avoid spam filter):

```
Title: Building a free axolotl care app — need 20 iOS beta testers

After losing my first axolotl to an ammonia spike I didn't understand,
I built a care app with a step-by-step nitrogen cycle wizard, water
parameter logging with safe/danger indicators, and heat alerts.

Looking for iOS beta testers who keep axolotls. DM me your email
for a TestFlight invite. Android coming 2 weeks after iOS.
```

### Step 4: Android beta

```bash
eas build --platform android --profile preview
eas submit --platform android --latest
```

Google Play Console → Internal testing → Invite testers by email.

### Step 5: Collect feedback

Create a Google Form with:
- What did you test?
- What worked well?
- What was confusing or broken?
- Would you pay €6.99/month? Why/why not?

Share with all beta testers. Require at least 5 responses before Phase 23.

### Phase 22 Definition of Done
- [ ] `eas build --platform ios --profile preview` succeeds
- [ ] App visible in TestFlight
- [ ] At least 10 external testers invited
- [ ] At least 5 feedback responses received
- [ ] All crashes fixed before submission

---

## Phase 23 — App Store Submission

**Goal:** Both iOS and Android apps live in their stores.
**Time:** 3 hours
**Prerequisites:** Phase 22 beta feedback addressed

### Step 1: Address beta feedback

Fix: crashes (P0), UX blockers (P1). Log nice-to-haves for v1.1.

### Step 2: Production builds

```bash
eas build --platform ios --profile production
eas build --platform android --profile production
```

### Step 3: App Store Connect metadata

- **App Name:** `AxolotlCare — AI Tank Companion`
- **Subtitle:** `Water, health & community`
- **Keywords:** `axolotl,axolotl care,axolotl tank,water chemistry,axolotl health,aquarium,salamander`
- **Categories:** Lifestyle (primary), Education (secondary)
- **Age Rating:** 4+
- **Privacy Policy URL:** `https://axolotlcare.app/privacy`

**Screenshots required:** 6.7" iPhone (6 screenshots). Show: home, tank logger, diagnosis, community, guides.

**App Preview Video (30 seconds):** Record on a real device showing the core loop — log params → see result → AOTW.

### Step 4: Submit

```bash
eas submit --platform ios --latest
eas submit --platform android --latest
```

Expected iOS review: 1–3 business days.
Expected Android review: 3–7 business days (slower for new developer accounts).

### Step 5: Required web pages before submission

Host at `axolotlcare.app`:
- `/privacy` — privacy policy covering email, photos, location collection
- `/support` — support contact email or form

Use termly.io or privacypolicies.com to generate the privacy policy.

### Phase 23 Definition of Done
- [ ] iOS submitted for review (status: "Waiting for Review")
- [ ] Android submitted
- [ ] Privacy policy live
- [ ] Both apps live in stores within 7 business days
- [ ] App Store listing searchable for "axolotl care"

---

## Phase 24 — Community Feed

**Goal:** Photo sharing feed with post creation, likes, and comments.
**Time:** 4 hours
**Prerequisites:** Phase 5 (schema), Phase 23 (post-launch)

### Step 1: Storage buckets (run once in Supabase SQL editor)

```sql
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) VALUES
  ('community-posts', 'community-posts', TRUE, 10485760, ARRAY['image/jpeg','image/png','image/webp']),
  ('aotw-photos',     'aotw-photos',     TRUE, 20971520, ARRAY['image/jpeg','image/png','image/webp']);

CREATE POLICY "community_user_upload" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'community-posts' AND auth.role() = 'authenticated');
CREATE POLICY "community_public_read" ON storage.objects FOR SELECT
  USING (bucket_id IN ('community-posts','aotw-photos'));
```

### Step 2: Community store

```typescript
// store/useCommunityStore.ts
import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
interface CommunityState {
  posts:     any[]
  loading:   boolean
  fetchPosts:(limit?: number) => Promise<void>
  addPost:   (post: any) => void
}
export const useCommunityStore = create<CommunityState>((set) => ({
  posts: [], loading: false,
  addPost: (post) => set(s => ({ posts: [post, ...s.posts] })),
  fetchPosts: async (limit = 20) => {
    set({ loading: true })
    const { data } = await supabase.from('community_posts')
      .select('*, profiles!author_id(username, display_name, avatar_url), axolotls(name, morph)')
      .eq('is_visible', true)
      .order('created_at', { ascending: false })
      .limit(limit)
    if (data) set({ posts: data })
    set({ loading: false })
  },
}))
```

### Step 3: Post card + feed screen

Build `CommunityPost.tsx` with: author header, photo, caption, like/comment counts. Use `FlashList` for performance in the community tab.

Post creation flow: photo picker → caption TextInput → axolotl picker → submit → upload to `community-posts` bucket + insert into `community_posts`.

```bash
git add . && git commit -m "feat: phase 24 - community feed with FlashList, post creation, and likes"
git push origin feature/phase-24-community-feed
```

### Phase 24 Definition of Done
- [ ] Feed loads and scrolls smoothly (FlashList)
- [ ] Post creation works: photo uploads to Supabase Storage
- [ ] Likes update in real time (optimistic UI + DB write)
- [ ] Comments count visible on each post

---

## Phase 25 — Tank Showcase Gallery

**Goal:** 2-column masonry grid of tank setups, filterable by morph and tank size.
**Time:** 3 hours
**Prerequisites:** Phase 24

Fetch `community_posts` with `post_type = 'tank_showcase'` joined with `axolotls`. Display in a 2-column grid using FlashList with `numColumns={2}`. Filter chips at the top for All | By Morph | By Size.

```bash
git add . && git commit -m "feat: phase 25 - tank showcase gallery with morph and size filters"
git push origin feature/phase-25-gallery
```

---

## Phase 26 — Axolotl of the Week

**Goal:** AOTW display, nomination flow, weekly Edge Function + cron, push to winner and all users.
**Time:** 4 hours
**Prerequisites:** Phase 24

### Weekly selection Edge Function

```typescript
// supabase/functions/weekly-aotw/index.ts
import { createClient } from 'npm:@supabase/supabase-js@2'

Deno.serve(async () => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const now     = new Date()
  const monday  = new Date(now)
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7))
  const weekStart = monday.toISOString().split('T')[0]

  // Already selected this week?
  const { data: existing } = await supabase.from('aotw_winners')
    .select('id').eq('week_start', weekStart).single()
  if (existing) return new Response('Already selected this week')

  // Get pending nominations with photos
  const { data: nominations } = await supabase
    .from('aotw_nominations')
    .select('id, nomination_note, axolotl_id, axolotls!inner(id, name, morph, primary_photo, owner_id, profiles!owner_id(display_name, onesignal_player_id))')
    .eq('considered', false)
    .not('axolotls.primary_photo', 'is', null)
    .order('nominated_at', { ascending: false })
    .limit(20)

  if (!nominations?.length) return new Response('No nominations')

  const winner  = nominations[0]
  const ax      = winner.axolotls as any
  const profile = ax.profiles

  await supabase.from('aotw_winners').insert({
    axolotl_id:    ax.id, owner_id: ax.owner_id, week_start: weekStart,
    feature_story: winner.nomination_note ?? `Meet ${ax.name}, a ${ax.morph.replace('_',' ')} kept by ${profile.display_name}.`,
    feature_photo: ax.primary_photo,
  })

  // Award achievement
  await supabase.from('user_achievements')
    .insert({ profile_id: ax.owner_id, achievement_id: 'aotw_winner', axolotl_id: ax.id })
    .on('conflict', () => {}).then(() => {})

  await supabase.from('aotw_nominations').update({ considered: true }).eq('axolotl_id', ax.id)

  // Push to winner
  if (profile?.onesignal_player_id) {
    await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Basic ${Deno.env.get('ONESIGNAL_REST_KEY')}` },
      body: JSON.stringify({
        app_id: Deno.env.get('ONESIGNAL_APP_ID'),
        include_player_ids: [profile.onesignal_player_id],
        headings: { en: 'You won Axolotl of the Week!' },
        contents: { en: `${ax.name} is this week's featured axolotl.` },
        data: { screen: 'community' },
      }),
    })
  }

  // Push to all users
  await fetch('https://onesignal.com/api/v1/notifications', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Basic ${Deno.env.get('ONESIGNAL_REST_KEY')}` },
    body: JSON.stringify({
      app_id: Deno.env.get('ONESIGNAL_APP_ID'),
      included_segments: ['All'],
      headings: { en: 'New Axolotl of the Week' },
      contents: { en: `Meet ${ax.name} — this week's featured axolotl.` },
      data: { screen: 'community' },
    }),
  })

  return new Response(JSON.stringify({ winner: ax.name }))
})
```

```bash
supabase functions deploy weekly-aotw
```

Cron: `0 9 * * 1` (Monday 9am UTC)

### AOTW card component

Dark card (charcoal background), full-width feature photo, gold badge, axolotl name in DM Serif Display, owner `@username`, feature story, nomination button. Pin to top of community feed.

### Nomination flow

Button → modal with axolotl picker + optional note (max 500 chars) → insert into `aotw_nominations`.

```bash
git add . && git commit -m "feat: phase 26 - AOTW weekly edge function, cron, nomination flow, push to winner"
git push origin feature/phase-26-aotw
```

---

## Phase 27 — Achievement System

**Goal:** Achievement badge grid in profile, unlock animation, push notification when earned.
**Time:** 3 hours
**Prerequisites:** Phase 5 (DB triggers already award achievements)

The triggers from Phase 5 already write to `user_achievements`. This phase builds the UI:

### Achievement badge grid

```typescript
// components/profile/AchievementBadge.tsx
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { colors } from '@/constants/colors'
import { fontFamily, fontSize, spacing, radius } from '@/constants/typography'

interface Props {
  definition: { id: string; name: string; description: string }
  earned:     boolean
  earnedAt?:  string
}

export function AchievementBadge({ definition, earned, earnedAt }: Props) {
  return (
    <View style={[s.badge, !earned && s.locked]}>
      <View style={[s.icon, !earned && s.lockedIcon]}>
        <Text style={s.iconText}>{earned ? '🏅' : '🔒'}</Text>
      </View>
      <Text style={[s.name, !earned && s.lockedText]} numberOfLines={2}>{definition.name}</Text>
      {earned && earnedAt && (
        <Text style={s.date}>{new Date(earnedAt).toLocaleDateString()}</Text>
      )}
    </View>
  )
}

const s = StyleSheet.create({
  badge:      { width: '30%', alignItems: 'center', padding: spacing.md, borderRadius: radius.lg, backgroundColor: colors.sand, margin: '1.5%' },
  locked:     { opacity: 0.4 },
  icon:       { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.tealPale, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm },
  lockedIcon: { backgroundColor: colors.sand },
  iconText:   { fontSize: 24 },
  name:       { fontFamily: fontFamily.sansMed, fontSize: fontSize.micro, color: colors.text1, textAlign: 'center' },
  lockedText: { color: colors.text3 },
  date:       { fontFamily: fontFamily.sans, fontSize: 9, color: colors.text3, marginTop: 2 },
})
```

Display a 3-column grid of all 10 achievement definitions in `app/(tabs)/profile.tsx`. Mark earned ones as unlocked using a join of `achievement_definitions` + `user_achievements`.

### Unlock check on foreground

In `app/_layout.tsx`, when the app comes to foreground, check for unnotified achievements:

```typescript
const checkUnnotifiedAchievements = async (userId: string) => {
  const { data } = await supabase.from('user_achievements')
    .select('*, achievement_definitions(*)')
    .eq('profile_id', userId)
    .eq('notified', false)

  if (data?.length) {
    // Show Lottie achievement-burst.json animation overlay
    // Display achievement name + description in a modal
    await supabase.from('user_achievements')
      .update({ notified: true })
      .eq('profile_id', userId).eq('notified', false)
  }
}
```

```bash
git add . && git commit -m "feat: phase 27 - achievement badge grid and unlock notification checking"
git push origin feature/phase-27-achievements
```

---

## Phase 28 — Birthday Tracker

**Goal:** Daily cron checks axolotl hatch/adoption dates and fires personalised birthday push notification.
**Time:** 2 hours
**Prerequisites:** Phase 12 (Edge Function pattern)

```typescript
// supabase/functions/birthday-notifier/index.ts
import { createClient } from 'npm:@supabase/supabase-js@2'

Deno.serve(async () => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const today   = new Date()
  const monthDay = `${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`

  const { data: axolotls } = await supabase
    .from('axolotls')
    .select('id, name, hatch_date, adoption_date, owner_id, profiles!owner_id(onesignal_player_id)')
    .is('passed_date', null)

  for (const ax of (axolotls ?? [])) {
    const profile  = (ax as any).profiles
    const hatchMD  = ax.hatch_date?.slice(5) ?? null
    const adoptMD  = ax.adoption_date?.slice(5) ?? null
    if (hatchMD !== monthDay && adoptMD !== monthDay) continue
    if (!profile?.onesignal_player_id) continue

    const isHatch = hatchMD === monthDay
    const year    = parseInt((isHatch ? ax.hatch_date : ax.adoption_date)!.slice(0,4))
    const age     = today.getFullYear() - year
    const ageStr  = `${age} year${age !== 1 ? 's' : ''}`

    await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Basic ${Deno.env.get('ONESIGNAL_REST_KEY')}` },
      body: JSON.stringify({
        app_id:             Deno.env.get('ONESIGNAL_APP_ID'),
        include_player_ids: [profile.onesignal_player_id],
        headings:           { en: `Happy birthday, ${ax.name}!` },
        contents:           { en: isHatch
          ? `${ax.name} hatched ${ageStr} ago today!`
          : `${ax.name} joined your family ${ageStr} ago today!` },
        data: { screen: 'home', axolotl_id: ax.id },
      }),
    })

    if (age >= 1) {
      await supabase.from('user_achievements')
        .insert({ profile_id: ax.owner_id, achievement_id: '1_year_keeper', axolotl_id: ax.id })
        .on('conflict', () => {}).then(() => {})
    }
  }

  return new Response('OK')
})
```

```bash
supabase functions deploy birthday-notifier
```

Cron: `0 9 * * *` (daily at 9am UTC)

```bash
git add . && git commit -m "feat: phase 28 - birthday notifier edge function with 1-year keeper achievement"
git push origin feature/phase-28-birthdays
```

---

## Phase 29 — Guides Library

**Goal:** Full knowledge base with published guides, full-text search, and bookmarks.
**Time:** 4 hours
**Prerequisites:** Phase 5 (guides table + FTS index)

### Step 1: Write the actual guide content

Before building the UI, write real content for the 5 featured guides. Go to Supabase → Table Editor → guides → edit each row. Set `published = true` when the content is ready.

**Minimum word counts:**
- `nitrogen-cycle-complete-guide`: 1,500 words
- `axolotl-water-parameters-guide`: 1,000 words (include a table)
- `fungus-treatment-guide`: 800 words with step-by-step treatment
- `summer-heat-management`: 700 words with cooling options
- `first-tank-setup`: 1,200 words, sequential walkthrough

### Step 2: Install markdown renderer

```bash
npx expo install react-native-markdown-display
```

### Step 3: Guides list screen

```typescript
// app/(tabs)/guides.tsx
import { useEffect, useState } from 'react'
import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { supabase } from '@/lib/supabase'
import { colors } from '@/constants/colors'
import { fontFamily, fontSize, spacing, radius } from '@/constants/typography'

type Guide = {
  id: string; slug: string; title: string; excerpt: string
  category: string; difficulty: string; reading_time_minutes: number
}

const DIFF_COLOR = { beginner: colors.safe, intermediate: colors.warning, expert: colors.danger }

export default function GuidesScreen() {
  const [guides,  setGuides]  = useState<Guide[]>([])
  const [query,   setQuery]   = useState('')
  const [loading, setLoading] = useState(true)

  const fetchGuides = async (q?: string) => {
    setLoading(true)
    let req = supabase.from('guides')
      .select('id, slug, title, excerpt, category, difficulty, reading_time_minutes')
      .eq('published', true)
      .order('featured', { ascending: false })
    if (q) req = req.textSearch('title', q, { type: 'websearch', config: 'english' })
    const { data } = await req.limit(20)
    if (data) setGuides(data)
    setLoading(false)
  }

  useEffect(() => { fetchGuides() }, [])

  return (
    <SafeAreaView style={{ flex:1, backgroundColor: colors.white }} edges={['top']}>
      <View style={s.header}>
        <Text style={s.title}>Expert Guides</Text>
        <TextInput
          style={s.search}
          placeholder="Search guides..."
          placeholderTextColor={colors.text3}
          value={query}
          onChangeText={q => { setQuery(q); if (q.length > 2 || q.length === 0) fetchGuides(q || undefined) }}
        />
      </View>
      <FlatList
        data={guides}
        keyExtractor={g => g.id}
        contentContainerStyle={{ padding: spacing.xxl }}
        refreshing={loading}
        onRefresh={() => fetchGuides(query || undefined)}
        renderItem={({ item: g }) => (
          <TouchableOpacity style={s.card} onPress={() => router.push(`/guides/${g.slug}` as any)}>
            <View style={s.meta}>
              <Text style={[s.diff, { color: DIFF_COLOR[g.difficulty as keyof typeof DIFF_COLOR] ?? colors.text3 }]}>
                {g.difficulty.toUpperCase()}
              </Text>
              <Text style={s.readTime}>{g.reading_time_minutes} min read</Text>
            </View>
            <Text style={s.guideTitle}>{g.title}</Text>
            <Text style={s.excerpt} numberOfLines={2}>{g.excerpt}</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  header:     { padding: spacing.xxl, paddingBottom: spacing.md },
  title:      { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 28, color: colors.text1, marginBottom: spacing.lg },
  search:     { borderWidth: 0.5, borderColor: colors.borderMid, borderRadius: radius.lg, padding: spacing.md, fontFamily: fontFamily.sans, fontSize: fontSize.body, color: colors.text1 },
  card:       { backgroundColor: colors.sand, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.md },
  meta:       { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  diff:       { fontFamily: fontFamily.sansMed, fontSize: fontSize.micro, letterSpacing: 0.5 },
  readTime:   { fontFamily: fontFamily.sans, fontSize: fontSize.micro, color: colors.text3 },
  guideTitle: { fontFamily: fontFamily.sansSemi, fontSize: fontSize.h3, color: colors.text1, marginBottom: spacing.xs },
  excerpt:    { fontFamily: fontFamily.sans, fontSize: fontSize.caption, color: colors.text2, lineHeight: 18 },
})
```

### Step 4: Guide detail screen

```typescript
// app/guides/[slug].tsx
import { useEffect, useState } from 'react'
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native'
import { useLocalSearchParams, router } from 'expo-router'
import Markdown from 'react-native-markdown-display'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/useAuthStore'
import { colors } from '@/constants/colors'
import { fontFamily, fontSize, spacing } from '@/constants/typography'

export default function GuideDetail() {
  const { slug }     = useLocalSearchParams<{ slug: string }>()
  const { user }     = useAuthStore()
  const [guide,      setGuide]      = useState<any>(null)
  const [bookmarked, setBookmarked] = useState(false)
  const [loading,    setLoading]    = useState(true)

  useEffect(() => {
    if (!slug || !user) return
    Promise.all([
      supabase.from('guides').select('*').eq('slug', slug).single(),
      supabase.from('guide_bookmarks').select('guide_id').eq('user_id', user.id),
    ]).then(([{ data: guide }, { data: bookmarks }]) => {
      if (guide) setGuide(guide)
      if (bookmarks) setBookmarked(bookmarks.some(b => b.guide_id === guide?.id))
      setLoading(false)
    })
  }, [slug, user?.id])

  const toggleBookmark = async () => {
    if (!guide || !user) return
    if (bookmarked) {
      await supabase.from('guide_bookmarks').delete()
        .eq('guide_id', guide.id).eq('user_id', user.id)
    } else {
      await supabase.from('guide_bookmarks').insert({ guide_id: guide.id, user_id: user.id })
    }
    setBookmarked(!bookmarked)
  }

  if (loading) return <View style={s.centered}><ActivityIndicator color={colors.teal} /></View>
  if (!guide)  return <View style={s.centered}><Text>Guide not found</Text></View>

  return (
    <ScrollView style={s.container} contentContainerStyle={s.scroll}>
      <View style={s.navRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={s.back}>← Guides</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleBookmark}>
          <Text style={s.bookmark}>{bookmarked ? '★ Saved' : '☆ Save'}</Text>
        </TouchableOpacity>
      </View>

      <Text style={s.category}>{guide.category.replace('_',' ').toUpperCase()}</Text>
      <Text style={s.title}>{guide.title}</Text>
      <Text style={s.meta}>{guide.reading_time_minutes} min read · {guide.difficulty}</Text>

      <Markdown style={markdownStyles}>{guide.content_markdown}</Markdown>
    </ScrollView>
  )
}

const markdownStyles = {
  heading1: { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 26, color: colors.text1, marginBottom: 12, marginTop: 24 },
  heading2: { fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 20, color: colors.text1, marginBottom: 10, marginTop: 20 },
  heading3: { fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 17, color: colors.text1, marginBottom: 8, marginTop: 16 },
  body:     { fontFamily: 'PlusJakartaSans_400Regular', fontSize: 15, color: colors.text2, lineHeight: 24 },
  strong:   { fontFamily: 'PlusJakartaSans_600SemiBold' },
  code_inline: { backgroundColor: colors.sand, borderRadius: 4, paddingHorizontal: 4, fontFamily: 'Courier' },
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  scroll:    { padding: spacing.xxl, paddingBottom: 60 },
  centered:  { flex: 1, justifyContent: 'center', alignItems: 'center' },
  navRow:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xl, marginTop: spacing.xl },
  back:      { fontFamily: fontFamily.sans, fontSize: fontSize.body, color: colors.teal },
  bookmark:  { fontFamily: fontFamily.sansMed, fontSize: fontSize.body, color: colors.teal },
  category:  { fontFamily: fontFamily.sansMed, fontSize: fontSize.micro, color: colors.teal, letterSpacing: 0.8, marginBottom: spacing.sm },
  title:     { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 28, color: colors.text1, marginBottom: spacing.sm },
  meta:      { fontFamily: fontFamily.sans, fontSize: fontSize.caption, color: colors.text3, marginBottom: spacing.xxl },
})
```

### Step 5: Commit

```bash
git add .
git commit -m "feat: phase 29 - guides library with full-text search, markdown rendering, and bookmarks"
git push origin feature/phase-29-guides
```

### Phase 29 Definition of Done
- [ ] At least 5 guides published (`published = true`)
- [ ] Guide list loads and searches via full-text index
- [ ] Guide detail renders markdown correctly (headings, bold, lists)
- [ ] Bookmark toggles and persists across sessions
- [ ] Bookmark count in `guides` table updates via trigger

---

## Phase 30 — Web Version & SEO

**Goal:** `axolotlcare.app/guides` live on the web, guides indexed by Google, organic search traffic starts flowing.
**Time:** 4 hours
**Prerequisites:** Phase 29 (at least 5 guides published), Vercel account, Cloudflare domain

### Step 1: Create Next.js web app

```bash
# In a subdirectory of the monorepo, or a separate repo
npx create-next-app@latest axolotlcare-web --typescript --tailwind --app
cd axolotlcare-web
npm install @supabase/supabase-js
```

### Step 2: Create `.env.local` for the web app

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Step 3: Guides index page with SEO

```typescript
// app/guides/page.tsx
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title:       'Axolotl Care Guides | AxolotlCare',
  description: 'Expert guides for axolotl keepers — water chemistry, disease treatment, tank setup, breeding and more.',
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function GuidesPage() {
  const { data: guides } = await supabase
    .from('guides')
    .select('slug, title, excerpt, category, difficulty, reading_time_minutes')
    .eq('published', true)
    .order('featured', { ascending: false })

  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-serif mb-4">Axolotl Care Guides</h1>
      <p className="text-gray-600 mb-12">Expert guides for axolotl keepers, written from experience.</p>
      <div className="space-y-6">
        {guides?.map(g => (
          <Link key={g.slug} href={`/guides/${g.slug}`} className="block p-6 rounded-2xl bg-gray-50 hover:bg-teal-50 transition-colors">
            <div className="flex gap-3 mb-2">
              <span className="text-xs font-semibold text-teal-700 uppercase tracking-wide">{g.category.replace('_',' ')}</span>
              <span className="text-xs text-gray-400">{g.reading_time_minutes} min read</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-1">{g.title}</h2>
            <p className="text-gray-600 text-sm leading-relaxed">{g.excerpt}</p>
          </Link>
        ))}
      </div>
    </main>
  )
}
```

### Step 4: Guide detail page with per-page SEO

```typescript
// app/guides/[slug]/page.tsx
import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Generate metadata per guide (critical for SEO)
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { data: guide } = await supabase
    .from('guides').select('title, meta_title, meta_description, excerpt').eq('slug', params.slug).single()
  return {
    title:       (guide?.meta_title ?? guide?.title) + ' | AxolotlCare',
    description: guide?.meta_description ?? guide?.excerpt ?? '',
    openGraph: {
      title:       guide?.meta_title ?? guide?.title ?? '',
      description: guide?.meta_description ?? guide?.excerpt ?? '',
      url:         `https://axolotlcare.app/guides/${params.slug}`,
    }
  }
}

// Pre-render all published guide slugs at build time
export async function generateStaticParams() {
  const { data } = await supabase.from('guides').select('slug').eq('published', true)
  return data?.map(g => ({ slug: g.slug })) ?? []
}

export default async function GuidePage({ params }: { params: { slug: string } }) {
  const { data: guide } = await supabase
    .from('guides').select('*').eq('slug', params.slug).eq('published', true).single()
  if (!guide) notFound()

  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <p className="text-xs text-teal-700 font-semibold uppercase tracking-widest mb-4">
        {guide.category.replace('_',' ')}
      </p>
      <h1 className="text-4xl font-serif mb-4">{guide.title}</h1>
      <p className="text-gray-400 text-sm mb-12">{guide.reading_time_minutes} min read · {guide.difficulty}</p>
      {/* Render markdown — use next-mdx-remote or react-markdown */}
      <div className="prose prose-lg max-w-none"
           dangerouslySetInnerHTML={{ __html: guide.content_markdown }} />
      {/* App download CTA */}
      <div className="mt-16 p-8 rounded-2xl bg-teal-900 text-white">
        <h3 className="text-2xl font-serif mb-3">Track your axolotl's water in the app</h3>
        <p className="text-teal-200 mb-6">Log parameters, get AI health diagnosis, and heat alerts — free on iOS and Android.</p>
        <a href="https://apps.apple.com/app/axolotlcare/idXXXXXXXXX" className="inline-block bg-white text-teal-900 font-semibold px-6 py-3 rounded-xl mr-4">
          App Store
        </a>
        <a href="https://play.google.com/store/apps/details?id=app.axolotlcare.android" className="inline-block border border-teal-400 text-white font-semibold px-6 py-3 rounded-xl">
          Google Play
        </a>
      </div>
    </main>
  )
}
```

### Step 5: Generate sitemap.xml

```typescript
// app/sitemap.ts
import { createClient } from '@supabase/supabase-js'
import type { MetadataRoute } from 'next'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data: guides } = await supabase
    .from('guides').select('slug, updated_at').eq('published', true)

  const guideUrls = (guides ?? []).map(g => ({
    url:          `https://axolotlcare.app/guides/${g.slug}`,
    lastModified: new Date(g.updated_at),
    changeFrequency: 'monthly' as const,
    priority:     0.8,
  }))

  return [
    { url: 'https://axolotlcare.app', lastModified: new Date(), priority: 1 },
    { url: 'https://axolotlcare.app/guides', lastModified: new Date(), priority: 0.9 },
    ...guideUrls,
  ]
}
```

### Step 6: Deploy to Vercel

```bash
# From the web app directory
npx vercel --prod

# Or push to GitHub and connect to Vercel (recommended for auto-deploys)
```

In Vercel project settings:
- Domains → Add `axolotlcare.app`
- Follow Vercel's instructions to point your Cloudflare DNS records

### Step 7: Submit to Google Search Console

1. Go to search.google.com/search-console
2. Add property → URL prefix → `https://axolotlcare.app`
3. Verify ownership via DNS TXT record (Cloudflare makes this easy)
4. Sitemaps → Submit → `https://axolotlcare.app/sitemap.xml`
5. URL Inspection → request indexing for each guide URL individually

Allow 2–4 weeks for guides to appear in search results.

### Step 8: Final commit and tag

```bash
git add .
git commit -m "feat: phase 30 - web guides with Next.js, SSG, sitemap, and Google Search Console"
git push origin feature/phase-30-web-seo

# Merge develop → main and tag v1.0.0
git checkout main
git merge develop
git tag v1.0.0
git push origin main --tags
echo "v1.0.0 shipped"
```

### Phase 30 Definition of Done
- [ ] `axolotlcare.app/guides` returns list of published guides
- [ ] Each guide page has correct `<title>` and `<meta description>`
- [ ] `axolotlcare.app/sitemap.xml` lists all published guide URLs
- [ ] Sitemap submitted to Google Search Console
- [ ] Guide pages render without client-side JavaScript (SSG/SSR)
- [ ] App Store download links visible on every guide page
- [ ] At least one guide URL crawled and indexed within 4 weeks

---

## You shipped.

```
Phases  1–5   Foundation      GitHub, Expo, Supabase, schema, security
Phases  6–7   Core systems    Design tokens, authentication
Phases  8–14  Free features   Profile, logger, charts, wizard, heat alerts, dashboard
Phase   15    Monetisation    RevenueCat paywall
Phases 16–20  Pro features    Photo diagnosis, SOS, trends, calculator, chat
Phase   21    Onboarding      5-step first-run experience
Phases 22–23  Launch          TestFlight beta, App Store submission
Phases 24–28  Community       Feed, gallery, AOTW, achievements, birthdays
Phases 29–30  Authority       Guides library, web SEO
```

---

## Appendix A — Git Branch Naming Convention

```
feature/phase-1-repo-setup
feature/phase-2-expo-scaffold
feature/phase-3-supabase-setup
... (one branch per phase)
feature/phase-30-web-seo

hotfix/description   ← production-only urgent fixes
release/v1.x.x      ← release branches if needed
```

---

## Appendix B — Safe Parameter Reference

```
Parameter    Safe Range        Danger Zone          Unit
──────────────────────────────────────────────────────────
pH           6.5 – 8.0        < 6.0 or > 8.5       pH
Ammonia      0                > 0.25               ppm
Nitrite      0                > 0.25               ppm
Nitrate      0 – 20           > 40                 ppm
Temperature  15 – 20          > 22 or < 12         °C
GH           7 – 14           < 4 or > 20          dGH
KH           3 – 8            < 1 or > 12          dKH
```

---

## Appendix C — Supabase Edge Functions Deployed

| Function | Purpose | Trigger |
|----------|---------|---------|
| `diagnose-photo` | Claude Vision diagnosis | App request (Pro) |
| `sos-triage` | Emergency triage | App request (Pro) |
| `analyze-trends` | Parameter trend AI | App request (Pro) |
| `care-chat` | Context-aware chat | App request (Pro) |
| `heat-alert` | Weather check + push | Cron: 6am/12pm/6pm UTC |
| `weekly-aotw` | Select + notify winner | Cron: Monday 9am UTC |
| `birthday-notifier` | Birthday pushes | Cron: daily 9am UTC |
| `community-report` | Weekly water stats | Cron: Monday 10am UTC |
| `revenuecat-webhook` | Sync subscription tier | RevenueCat webhook |

---

## Appendix D — Revenue Model

| Scenario | Pro Subscribers | MRR | ARR |
|----------|----------------|-----|-----|
| Conservative (Month 12) | 500 | €3,495 | €41,940 |
| Base case (Month 18) | 2,000 | €13,980 | €167,760 |
| Reefability parity (Month 24) | 5,000 | €34,950 | €419,400 |

AI costs at 2,000 Pro users: ~€32/month (0.23% of revenue). Margin: 85%+.

---

*AxolotlCare Build Phases v1.0 — 30 phases, GitHub to App Store.*
*Start with axolotl. Own the niche. Stack the species.*
