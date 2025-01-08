//go:build !dev
// +build !dev

package main

import (
	"embed"
	"net/http"

	"github.com/charmbracelet/log"
)

//go:embed public
var publicFS embed.FS

func public() http.Handler {
	return http.FileServerFS(publicFS)
}

//go:embed static
var staticFS embed.FS

func static() http.Handler {
	log.Info("loading static assets in dev")
	return http.FileServerFS(staticFS)
}
