CREATE TABLE IF NOT EXISTS candidates (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(255)  NOT NULL,
    email           VARCHAR(255)  NOT NULL UNIQUE,
    current_title   VARCHAR(255),
    linkedin_url    VARCHAR(512),
    linkedin_posts  JSONB         NOT NULL DEFAULT '[]',
    github_repos    JSONB         NOT NULL DEFAULT '[]',
    tweets          JSONB         NOT NULL DEFAULT '[]',
    upskilling      JSONB         NOT NULL DEFAULT '[]',
    ai_summary      TEXT,
    match_score     FLOAT,
    interview_notes TEXT,
    interviewed_at  TIMESTAMPTZ,
    created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS jobs (
    id           SERIAL PRIMARY KEY,
    title        VARCHAR(255) NOT NULL,
    description  TEXT,
    requirements TEXT,
    status       VARCHAR(50)  NOT NULL DEFAULT 'open',
    created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
