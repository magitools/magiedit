package web

import (
	"context"
	"database/sql"
	"errors"
	"net/http"

	"github.com/charmbracelet/log"
	"github.com/magitools/magiedit/database"
	"github.com/magitools/magiedit/session"
	"github.com/magitools/magiedit/templates/views/key"
	"github.com/magitools/magiedit/utils"
	"golang.org/x/crypto/bcrypt"
)

func KeyShow(w http.ResponseWriter, r *http.Request) {
	queries := database.New(utils.GetDB())

	manager := session.GetManager()
	user, ok := manager.Get(r.Context(), "user").(database.User)
	if !ok {
		log.Error("could not get user from session")
	}

	keys, err := queries.GetKeysByUser(r.Context(), user.ID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			log.Error("could not find any keys, continuing")
		} else {
			panic(err)
		}
	}
	key.Show(keys).Render(r.Context(), w)
}

func KeyStore(w http.ResponseWriter, r *http.Request) {
	manager := session.GetManager()
	r.ParseForm()
	email := r.PostFormValue("email")
	password := r.PostFormValue("password")

	if email == "" || password == "" {
		log.Error("request is missing some data")
		return
	}
	db := utils.GetDB()
	queries := database.New(db)
	user, err := queries.GetUserByEmail(context.Background(), email)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			log.Error("could not find user", email)
			http.Redirect(w, r, "/login", http.StatusFound)
			return
		}
		panic(err)
	}
	matched := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))

	if matched != nil {
		log.Error("wrong password", email)
		http.Redirect(w, r, "/login", http.StatusFound)
		return
	}
	manager.Put(r.Context(), "authed", true)
	manager.Put(r.Context(), "user", user)
	http.Redirect(w, r, "/app", http.StatusFound)
	return
}
