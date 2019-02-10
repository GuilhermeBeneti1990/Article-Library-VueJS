const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/finalproject_stats', {useNewUrlParser: true })
    .catch(e => {
        const msg = "ERROR, can not connect with mongoDB"
        console.log('\x1b[41m%s\x1b[37m', msg, '\x1b[0m')
    })