package routers

import (
	"context"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/magitools/magiedit/handlers/web"
)

func InitWebRouter() *chi.Mux {
	router := chi.NewMux()
	router.Use(func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			ctx := context.WithValue(r.Context(), "authed", false)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	})
	router.Get("/", web.Index)
	router.Get("/register", web.RegisterShow)
	router.Post("/register", web.RegisterStore)

	return router
}
