//+build dev
//go:build dev
// +build dev

package main

import (
	"github.com/charmbracelet/log"
	"net/http"
	"os"
)

func public() http.Handler {
	log.Info("loading public assets in dev")
	return http.StripPrefix("/public/", http.FileServerFS(os.DirFS("public")))
}

func static() http.Handler {
	log.Info("loading static assets in dev")
	return http.StripPrefix("/static/", http.FileServerFS(os.DirFS("static")))
}
