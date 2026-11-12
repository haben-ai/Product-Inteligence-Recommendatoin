-- Tigrigna Beauty & Care — market-research survey
-- Run once in Supabase: Dashboard → SQL Editor → New query → paste → Run.

create table if not exists public.survey_responses (
  id             uuid primary key default gen_random_uuid(),
  created_at     timestamptz not null default now(),
  lang           text not null check (lang in ('ti', 'en')),
  survey_version int  not null,
  -- { "q1_age": { "choices": ["25_34"] }, "q4_difficulties": { "choices": ["other"], "other": "..." }, ... }
  answers        jsonb not null check (jsonb_typeof(answers) = 'object' and octet_length(answers::text) < 16000)
);

-- Row-level security: the website's public key may only INSERT. Nobody can read
-- responses with that key; founders read them in the dashboard (Table Editor / CSV export).
alter table public.survey_responses enable row level security;

drop policy if exists "Anyone can submit a response" on public.survey_responses;
create policy "Anyone can submit a response"
  on public.survey_responses
  for insert
  to anon
  with check (true);

revoke all on public.survey_responses from anon, authenticated;
grant insert on public.survey_responses to anon;

-- Handy view for analysis: one row per response with each answer as its own column.
create or replace view public.survey_responses_flat
with (security_invoker = true) as
select
  id,
  created_at,
  lang,
  survey_version,
  answers -> 'q1_age' -> 'choices' ->> 0                as q1_age,
  answers -> 'q2_interest' -> 'choices' ->> 0           as q2_interest,
  answers -> 'q3_difficulty_freq' -> 'choices' ->> 0    as q3_difficulty_freq,
  answers -> 'q4_difficulties' -> 'choices'             as q4_difficulties,
  answers -> 'q4_difficulties' ->> 'other'              as q4_other,
  answers -> 'q5_sources' -> 'choices'                  as q5_sources,
  answers -> 'q5_sources' ->> 'other'                   as q5_other,
  answers -> 'q6_label_confidence' -> 'choices' ->> 0   as q6_label_confidence,
  answers -> 'q7_language' -> 'choices' ->> 0           as q7_language,
  answers -> 'q7_language' ->> 'other'                  as q7_other,
  answers -> 'q8_purchase_drivers' -> 'choices'         as q8_purchase_drivers,
  answers -> 'q8_purchase_drivers' ->> 'other'          as q8_other,
  answers -> 'q9_usefulness' -> 'choices' ->> 0         as q9_usefulness,
  answers -> 'q10_features' -> 'choices'                as q10_features,
  answers -> 'q10_features' ->> 'other'                 as q10_other
from public.survey_responses;

revoke all on public.survey_responses_flat from anon, authenticated;
