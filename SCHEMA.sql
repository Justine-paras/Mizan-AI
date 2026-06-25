create table documents (
 id uuid primary key,
 name text,
 url text,
 created_at timestamp
);

create table analyses (
 id uuid primary key,
 document_id uuid,
 score integer,
 risk text,
 issues jsonb,
 summary text
);

create table messages (
 id uuid primary key,
 analysis_id uuid,
 role text,
 content text
);

create table reports (
 id uuid primary key,
 analysis_id uuid,
 url text
);