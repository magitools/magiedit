CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    email text not null,
    password text not null
);

CREATE TABLE IF NOT EXISTS keys (
    id INTEGER PRIMARY KEY,
    user_id INTEGER not null,
    name text not null,
    value text not null,
    created_at NUMERIC
);

CREATE TABLE IF NOT EXISTS sessions (
	token TEXT PRIMARY KEY,
	data BLOB NOT NULL,
	expiry REAL NOT NULL
);

CREATE INDEX IF NOT EXISTS sessions_expiry_idx ON sessions(expiry);
