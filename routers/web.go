package routers

import (
	"context"
	"net/http"

	"github.com/charmbracelet/log"
	"github.com/go-chi/chi/v5"
	"github.com/magitools/magiedit/handlers/web"
	"github.com/magitools/magiedit/session"
	"github.com/magitools/magiedit/utils"
)

func authenticationMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Info("in middleware")
		manager := session.GetManager()
		authed := manager.GetBool(r.Context(), "authed")
		log.Info("Authenticated Value is ", authed)
		if authed {
			next.ServeHTTP(w, r)
		} else {
			http.Redirect(w, r, "/login", http.StatusFound)
			return
		}
	})
}

func alertMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		manager := session.GetManager()

		alert := manager.Get(r.Context(), "alert")
		ctx := context.WithValue(r.Context(), "alert", nil)
		if alert != nil {
			alert, ok := alert.(utils.Alert)
			if !ok {
				log.Error("could not parse alert messege")
			} else {
				ctx = context.WithValue(r.Context(), "alert", alert)
			}
		}
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func defaultValuesMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), "authed", false)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func setTitle(title string, handler http.HandlerFunc) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), "pageTitle", title)
		handler.ServeHTTP(w, r.WithContext(ctx))
	})
}

func InitWebRouter() *chi.Mux {
	router := chi.NewMux()
	router.Use(defaultValuesMiddleware)
	router.Use(alertMiddleware)
	router.Get("/", setTitle("Welcome!", web.Index))
	router.Get("/register", web.RegisterShow)
	router.Post("/register", web.RegisterStore)
	router.Get("/login", web.LoginShow)
	router.Post("/login", web.LoginStore)
	router.Group(func(r chi.Router) {
		r.Use(authenticationMiddleware)
		r.Get("/keys", web.KeyShow)
		r.Post("/keys", web.KeyStore)
	})
	return router
}
