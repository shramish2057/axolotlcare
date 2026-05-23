# Phase 4 Core Database Schema Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the AxolotlCare core Supabase schema and replace placeholder database types with generated TypeScript types.

**Architecture:** Phase 4 is a schema-only backend step. A single initial migration creates the required extensions, enum types, relational tables, checks, primary keys, unique constraints, and foreign keys; the generated `types/database.types.ts` becomes the app-facing contract for later phases.

**Tech Stack:** Supabase CLI, PostgreSQL, Expo TypeScript, generated Supabase database types.

---

### Task 1: Schema Verification Query

**Files:**
- Create: `supabase/snippets/phase4_schema_verification.sql`

- [ ] **Step 1: Add the verification SQL before the migration**

```sql
with expected_tables(table_name) as (
  values
    ('profiles'),
    ('axolotls'),
    ('water_parameters'),
    ('health_logs'),
    ('cycle_sessions'),
    ('tank_alerts'),
    ('community_posts'),
    ('post_likes'),
    ('post_comments'),
    ('aotw_nominations'),
    ('aotw_winners'),
    ('achievement_definitions'),
    ('user_achievements'),
    ('guides'),
    ('guide_bookmarks')
),
expected_enums(type_name) as (
  values
    ('axolotl_morph'),
    ('axolotl_sex'),
    ('health_log_type'),
    ('health_log_outcome'),
    ('cycle_method'),
    ('alert_type'),
    ('alert_severity'),
    ('post_type'),
    ('guide_difficulty'),
    ('guide_category')
)
select
  (select count(*) from expected_tables) as expected_table_count,
  (select count(*) from expected_enums) as expected_enum_count,
  coalesce(
    (
      select array_agg(expected_tables.table_name order by expected_tables.table_name)
      from expected_tables
      left join information_schema.tables
        on tables.table_schema = 'public'
       and tables.table_name = expected_tables.table_name
      where tables.table_name is null
    ),
    '{}'::text[]
  ) as missing_tables,
  coalesce(
    (
      select array_agg(expected_enums.type_name order by expected_enums.type_name)
      from expected_enums
      left join pg_type
        on pg_type.typname = expected_enums.type_name
      left join pg_namespace
        on pg_namespace.oid = pg_type.typnamespace
       and pg_namespace.nspname = 'public'
      where pg_type.typname is null
    ),
    '{}'::text[]
  ) as missing_enums;
```

- [ ] **Step 2: Run verification before migration**

Run against local Supabase:

```bash
docker exec -i supabase_db_axolotlcare psql -U postgres -d postgres < supabase/snippets/phase4_schema_verification.sql
```

Expected: the query reports all expected tables and enums as missing.

### Task 2: Initial Schema Migration

**Files:**
- Create: `supabase/migrations/20260523190000_initial_schema.sql`

- [ ] **Step 1: Create the initial migration**

Add the SQL from `AXOLOTLCARE_BUILD_PHASES.md` Phase 4 exactly, preserving the ten enum types and fifteen expected tables:

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE TYPE public.axolotl_morph AS ENUM ('leucistic','golden_albino','melanoid','wild_type','copper','axanthic','piebald','mosaic','chimera','gfp','firefly','lavender','enigma','unknown');
CREATE TYPE public.axolotl_sex AS ENUM ('male','female','unknown');
CREATE TYPE public.health_log_type AS ENUM ('photo_diagnosis','sos_emergency','manual_note','vet_visit');
CREATE TYPE public.health_log_outcome AS ENUM ('resolved','monitoring','ongoing','lost','unknown');
CREATE TYPE public.cycle_method AS ENUM ('fish_in','fishless_ammonia','seeded');
CREATE TYPE public.alert_type AS ENUM ('heat_warning','heat_critical','ammonia_spike','nitrite_spike','parameter_anomaly','water_change_due','filter_maintenance_due','follow_up_due','birthday');
CREATE TYPE public.alert_severity AS ENUM ('info','warning','critical');
CREATE TYPE public.post_type AS ENUM ('photo','tank_showcase','milestone','health_update');
CREATE TYPE public.guide_difficulty AS ENUM ('beginner','intermediate','expert');
CREATE TYPE public.guide_category AS ENUM ('water_chemistry','tank_setup','feeding','disease','breeding','seasonal','equipment','morphs');
```

The migration must then create these public tables: `profiles`, `axolotls`, `water_parameters`, `health_logs`, `cycle_sessions`, `tank_alerts`, `community_posts`, `post_likes`, `post_comments`, `aotw_nominations`, `aotw_winners`, `achievement_definitions`, `user_achievements`, `guides`, and `guide_bookmarks`.

- [ ] **Step 2: Apply the migration locally**

```bash
npx supabase db reset --local
```

Expected: migration applies without SQL errors.

- [ ] **Step 3: Run schema verification again**

```bash
docker exec -i supabase_db_axolotlcare psql -U postgres -d postgres < supabase/snippets/phase4_schema_verification.sql
```

Expected: `missing_tables` and `missing_enums` are empty arrays.

### Task 3: Linked Project Migration and Types

**Files:**
- Modify: `types/database.types.ts`

- [ ] **Step 1: Apply migration to linked Supabase project**

```bash
npx supabase db push
```

Expected: linked project applies the initial schema migration without errors.

- [ ] **Step 2: Generate TypeScript types**

```bash
npx supabase gen types typescript --linked > types/database.types.ts
```

Expected: `types/database.types.ts` contains generated table and enum definitions, not the placeholder.

- [ ] **Step 3: Verify TypeScript**

```bash
npm run typecheck
```

Expected: `tsc --noEmit` exits with code 0.

### Task 4: Commit and Push

**Files:**
- Add: `supabase/migrations/20260523190000_initial_schema.sql`
- Add: `supabase/snippets/phase4_schema_verification.sql`
- Modify: `types/database.types.ts`
- Add: `docs/superpowers/plans/2026-05-23-phase-4-core-database-schema.md`

- [ ] **Step 1: Commit Phase 4**

```bash
git add docs/superpowers/plans/2026-05-23-phase-4-core-database-schema.md supabase/migrations/20260523190000_initial_schema.sql supabase/snippets/phase4_schema_verification.sql types/database.types.ts
git commit -m "feat: phase 4 core database schema"
```

- [ ] **Step 2: Push feature branch and merge to develop**

```bash
git push -u origin feature/phase-4-database-schema
git checkout develop
git merge --no-ff feature/phase-4-database-schema
git push origin develop
```
