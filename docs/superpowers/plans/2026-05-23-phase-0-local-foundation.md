# AxolotlCare Phase 0 Local Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the document-only AxolotlCare workspace into a version-controlled Expo-ready app foundation.

**Architecture:** Keep the two provided documents as product source of truth, initialize local repository hygiene, then scaffold the Expo Router app in the same root. Phase 0 stops at a runnable placeholder app with the documented folder structure and environment placeholders.

**Tech Stack:** Git, Expo SDK, React Native, Expo Router, TypeScript.

---

### Task 1: Repository Foundation

**Files:**
- Create: `README.md`
- Create: `.gitignore`
- Preserve: `AXOLOTLCARE_DEVELOPMENT_BIBLE.md`
- Preserve: `AXOLOTLCARE_BUILD_PHASES.md`

- [ ] **Step 1: Initialize git**

Run: `git init`
Expected: repository initialized in the current directory.

- [ ] **Step 2: Create project README**

Create `README.md` with the product summary from the build guide:

```markdown
# AxolotlCare

AI-powered axolotl care companion for iOS and Android.
Built with React Native (Expo), Supabase, and Claude AI.
```

- [ ] **Step 3: Create ignore rules**

Create `.gitignore` with Expo, dependency, secret, and mobile build artifacts:

```gitignore
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
```

- [ ] **Step 4: Commit the local foundation**

Run: `git add . && git commit -m "chore: phase 0 local foundation"`
Expected: first local commit exists. Remote setup is deferred until the GitHub owner/name is known.

### Task 2: Expo Scaffold

**Files:**
- Create: `package.json`
- Create: `app.json`
- Create: `babel.config.js`
- Create: `tsconfig.json`
- Create: `app/**`
- Create: `components/**`
- Create: `lib/**`
- Create: `store/**`
- Create: `types/**`
- Create: `constants/**`
- Create: `supabase/**`

- [ ] **Step 1: Generate the Expo TypeScript app**

Run: `npx create-expo-app@latest . --template expo-template-blank-typescript`
Expected: Expo app files are generated in the existing root.

- [ ] **Step 2: Install project dependencies**

Run the dependency commands from Phase 2 of `AXOLOTLCARE_BUILD_PHASES.md`.
Expected: packages install without dependency resolution errors.

- [ ] **Step 3: Configure Expo Router and app metadata**

Replace generated app config with the documented AxolotlCare `app.json`, add the Reanimated Babel plugin, and create placeholder router screens.
Expected: Expo Router can resolve auth, tabs, onboarding, SOS, paywall, axolotl, diagnosis, and community routes.

- [ ] **Step 4: Add environment placeholder**

Create `.env.local` with placeholder values from the build guide.
Expected: secrets are present locally and ignored by git.

- [ ] **Step 5: Verify TypeScript**

Run: `npx tsc --noEmit`
Expected: TypeScript completes without errors.

- [ ] **Step 6: Commit the scaffold**

Run: `git add . && git commit -m "feat: phase 0 expo scaffold"`
Expected: scaffold changes are committed locally.
