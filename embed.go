package main

import (
	"embed"
	"io/fs"
)

//go:embed templates/*
var templates embed.FS

//go:embed static/*
var statics embed.FS

func getStaticSubFS() fs.FS {
	return statics
	// sub, err := fs.Sub(statics, "static")
	// if err != nil {
	// 	panic(err)
	// }
	// return sub
}
func getTemplateSubFS() fs.FS {
	return templates
	// sub, err := fs.Sub(templates, "templates")
	// if err != nil {
	// 	panic(err)
	// }
	// return sub
}
