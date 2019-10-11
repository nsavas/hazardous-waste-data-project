let express = require('express');
let bodyParser = require('body-parser');
let morgan = require('morgan');
let pg = require('pg'); // PostgreSQL and PostGIS module

// Read environment variables
const dotenv = require('dotenv');
dotenv.config();

// API port
const PORT = 3000;

// Setup connection
const username = process.env.DB_USER;
const password = process.env.DB_PASS;
const dbport = process.env.DB_PORT;
const host = process.env.DB_HOST;
const database = process.env.DB_NAME;

let pool = new pg.Pool({
    port: dbport,
    password: password,
    database: database,
    max: 10,
    host: host,
    user: username
});

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Allows us to request from client to backend
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Queries all the epa chemical release data from a given city and state and sends result back to client
app.post('/postgre-api/get-tri-releases-by-city', function(request, response) {
    let cityName = request.body.city;
    let cityState = request.body.state;
    let query = "SELECT * FROM full_epa_tri_releases WHERE city = '" + cityName + "' AND state = '" + cityState + "'";

    pool.connect((err, db, done) => { 
        if (err) return response.status(400).send(err);
        else {
            db.query(query, (err, table) => {
                done();
                if (err) return response.status(400).send(err);
                else {
                    console.log("Query successful.");
                    db.end();
                    response.status(201).send({ result: table.rows });
                }
            });
        }
    });
})

app.listen(PORT, () => console.log('Listening on port ' + PORT));