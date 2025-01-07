package main

import (
	"fmt"
	"html/template"
	"net/http"

	"github.com/charmbracelet/log"
)

func main() {
	log.Info("Starting setup...")

	server := http.NewServeMux()

	staticFS := getStaticSubFS()
	templateFS := getTemplateSubFS()

	log.Info("Setting up static routes")
	server.Handle("/static/", http.FileServer(http.FS(staticFS)))

	log.Info("Loading templates")
	templs := template.Must(template.New("").ParseFS(templateFS, "**/*.html"))
	port := 4444
	server.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		templs.ExecuteTemplate(w, "index.html", nil)
	})

	log.Info(fmt.Sprintf("Server started on port %d", 4444))
	http.ListenAndServe(fmt.Sprintf(":%d", port), server)
}
