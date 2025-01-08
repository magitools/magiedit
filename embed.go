package main

import (
	"embed"
	"io/fs"
)

//go:embed static/*
var statics embed.FS

func getStaticSubFS() fs.FS {
	return statics
}
