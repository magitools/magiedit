-- name: CreateAuthor :one
INSERT INTO users (
    email, password
) values (?, ?)
RETURNING *;

-- name: GetUserByEmail :one
SELECT * FROM users
WHERE email = ? LIMIT 1;

-- name: GetKeysByUser :many
SELECT * from keys
WHERE user_id = ?
ORDER BY id;
