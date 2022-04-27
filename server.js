const path = require("path")
const express = require('express')
const routes = require('./controllers')
const sequelize = require('./config/connection')

// Handlebar for template
const exphbs = require("express-handlebars")
const hbs = exphbs.create({})

// Session to store cookies
const session = require('express-session')
// connects session to our sequelize database
const SequelizeStore = require('connect-session-sequelize')(session.Store)

const sess = {
  // should be replaced by an actual secret and placed in the .env file
  secret: 'Super secret secret',
  // what is needed to tell our session to use cookies
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
}

const app = express()
const PORT = process.env.PORT || 3001

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))

app.use(session(sess))

app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')

// turn on routes
app.use(routes)

// turn on connection to db and server
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now listening'))
})