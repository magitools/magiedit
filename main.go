package main

import (
	"context"
	_ "embed"
	"fmt"
	"net/http"

	"github.com/charmbracelet/log"
	"github.com/go-chi/chi/v5"
	"github.com/magitools/magiedit/routers"
	"github.com/magitools/magiedit/session"
	"github.com/magitools/magiedit/utils"
)

//go:embed schema.sql
var ddl string

func main() {
	log.Info("Starting setup...")

	server := chi.NewMux()

	log.Info("Setting up public routes")
	server.Handle("/public/*", public())
	log.Info("Setting up static routes")
	server.Handle("/static/*", static())
	port := 8080

	log.Info("Registering web routes")
	server.Mount("/", routers.InitWebRouter())
	log.Info("Registering static routes")
	server.Mount("/api", routers.InitApiRouter())
	log.Info("Migrating db")
	db := utils.GetDB()
	if _, err := db.ExecContext(context.Background(), ddl); err != nil {
		panic(err)
	}
	log.Info("Initializing session")
	manager := session.GetManager()

	log.Info("All done!")
	log.Info(fmt.Sprintf("Server started on port %d", port))
	http.ListenAndServe(fmt.Sprintf(":%d", port), manager.LoadAndSave(server))
}
