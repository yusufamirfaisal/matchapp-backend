const express = require('express');
const bodyParser = require('body-parser');
const jsend = require('jsend')
const cors = require('cors')

const port = process.env.PORT || 4000;
const corsOptions = {
    origin: "http://localhost:3000",
    methods: ['GET', 'POST']
}

const app = express();

app.use(cors(corsOptions))
app.use(jsend.middleware)
app.use('/', (req, res, next) => {
    res.locals.user = "admin"
    next()
})
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/api', require('./api'))


app.listen(port, () => console.log(`matchapp listening on port ${port}!`));