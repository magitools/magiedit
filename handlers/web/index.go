package web

import (
	"net/http"

	"github.com/magitools/magiedit/templates/views"
)

func Index(w http.ResponseWriter, r *http.Request) {
	views.Index().Render(r.Context(), w)
}
