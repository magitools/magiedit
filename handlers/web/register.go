package web

import (
	"context"
	"net/http"

	"github.com/charmbracelet/log"
	"github.com/magitools/magiedit/database"
	"github.com/magitools/magiedit/templates/views/auth"
	"github.com/magitools/magiedit/utils"
	"golang.org/x/crypto/bcrypt"
)

type RegisterBody struct {
}

func RegisterShow(w http.ResponseWriter, r *http.Request) {
	auth.Register().Render(r.Context(), w)
}

func RegisterStore(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	email := r.PostFormValue("email")
	password := r.PostFormValue("password")

	if email == "" || password == "" {
		log.Error("request is missing some data")
		return
	}
	passwordHash, err := bcrypt.GenerateFromPassword([]byte(password), 16)
	if err != nil {
		panic(err)
	}
	db := utils.GetDB()
	queries := database.New(db)
	_, err = queries.CreateAuthor(context.Background(), database.CreateAuthorParams{
		Email:    email,
		Password: string(passwordHash),
	})
	if err != nil {
		panic(err)
	}
	http.Redirect(w, r, "/login", http.StatusFound)
	return
}
