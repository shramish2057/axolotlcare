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
),
missing_tables as (
  select expected_tables.table_name
  from expected_tables
  left join information_schema.tables
    on tables.table_schema = 'public'
   and tables.table_name = expected_tables.table_name
  where tables.table_name is null
),
missing_enums as (
  select expected_enums.type_name
  from expected_enums
  left join pg_type
    on pg_type.typname = expected_enums.type_name
  left join pg_namespace
    on pg_namespace.oid = pg_type.typnamespace
   and pg_namespace.nspname = 'public'
  where pg_type.typname is null
)
select
  (select count(*) from expected_tables) as expected_table_count,
  (select count(*) from expected_enums) as expected_enum_count,
  coalesce(
    (select array_agg(table_name order by table_name) from missing_tables),
    '{}'::text[]
  ) as missing_tables,
  coalesce(
    (select array_agg(type_name order by type_name) from missing_enums),
    '{}'::text[]
  ) as missing_enums;
