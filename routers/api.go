package routers

import "github.com/go-chi/chi/v5"

func InitApiRouter() *chi.Mux {
	router := chi.NewMux()
	return router
}
