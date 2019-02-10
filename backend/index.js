const app = require('express')()
// consign -> dependecies manager
const consign = require('consign')
const db = require('./config/db')
const mongoose = require('mongoose')

require('./config/mongodb')

app.db = db
app.mongoose = mongoose

consign()
    .include('./config/passport.js')
    .then('./config/middlewares.js')
    .then('./api/validator.js')
    .then('./api')
    .then('./schedule')
    .then('./config/routes.js')
    .into(app)

app.listen(3000, () => {
    console.log("Server Start...")
})
