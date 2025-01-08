package web

import (
	"net/http"

	"github.com/magitools/magiedit/templates/views/auth"
)

func RegisterShow(w http.ResponseWriter, r *http.Request) {
	auth.Register().Render(r.Context(), w)
}

func RegisterStore(w http.ResponseWriter, r *http.Request) {}
