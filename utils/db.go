package utils

import (
	"database/sql"
	_ "github.com/tursodatabase/go-libsql"
)

func GetDB() *sql.DB {
	dbName := "file:./local.db"

	db, err := sql.Open("libsql", dbName)
	if err != nil {
		panic(err)
	}
	return db
}
