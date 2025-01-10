package session

import (
	"encoding/gob"

	"github.com/alexedwards/scs/v2"
	"github.com/magitools/magiedit/database"
	"github.com/magitools/magiedit/utils"
)

var sessionManager *scs.SessionManager

func init() {
	gob.Register(database.User{})
	gob.Register(utils.Alert{})
}

func GetManager() *scs.SessionManager {
	if sessionManager == nil {
		sessionManager = scs.New()
	}
	return sessionManager
}
