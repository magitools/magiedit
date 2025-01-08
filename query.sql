-- name: CreateAuthor :one
INSERT INTO users (
    email, password
) values (?, ?)
RETURNING *;
