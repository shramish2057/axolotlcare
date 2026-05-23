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
CREATE TYPE public.axolotl_sex AS ENUM ('male','female','unknown');
CREATE TYPE public.health_log_type AS ENUM ('photo_diagnosis','sos_emergency','manual_note','vet_visit');
CREATE TYPE public.health_log_outcome AS ENUM ('resolved','monitoring','ongoing','lost','unknown');
CREATE TYPE public.cycle_method AS ENUM ('fish_in','fishless_ammonia','seeded');
CREATE TYPE public.alert_type AS ENUM ('heat_warning','heat_critical','ammonia_spike','nitrite_spike','parameter_anomaly','water_change_due','filter_maintenance_due','follow_up_due','birthday');
CREATE TYPE public.alert_severity AS ENUM ('info','warning','critical');
CREATE TYPE public.post_type AS ENUM ('photo','tank_showcase','milestone','health_update');
CREATE TYPE public.guide_difficulty AS ENUM ('beginner','intermediate','expert');
CREATE TYPE public.guide_category AS ENUM ('water_chemistry','tank_setup','feeding','disease','breeding','seasonal','equipment','morphs');

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
