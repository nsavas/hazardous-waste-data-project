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

// Enable CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Queries all the epa chemical release data from a given city and state and sends result back to client
app.post('/postgre-api/get-tri-releases-by-city', function(request, response) {
    let cityName = request.body.city;
    let cityState = request.body.state;

    let query = "SELECT row_to_json(fc) as result_geometry, row_to_json(td) as result_data FROM ("
                +  "SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM ("
                +  "SELECT 'Feature' As type, ST_AsGeoJSON(facilitygeometry)::json As geometry FROM "
                +  "full_epa_tri_releases WHERE city = '" + cityName + "' AND state = '" + cityState + "') As f),"
                +  " array_to_json(array_agg(d)) As fc";


    let query2 = "SELECT year, facilityname, streetaddress, city, county, state, zipcode, latitude, longitude,"
                +  "federalfacility, industrysector, chemical, cleanairactchemical, metal, carcinogen, unitofmeasure,"
                +  "fugitiveair_51, stackair_52, water_53, underground_54, underground_class_i_541, underground_class_ii_v_542,"
                +  "landfills_551, rcra_c_landfills_551a, otherlandfills_551b, landtreatment_552, surfaceimpoundment_553,"
                +  "rcra_surfaceimpoundment_553a, othersurfaceimpoundment_553b, otherdisposal_554, onsitereleasetotal,"
                +  "potw_transfersforrelease_61, potw_transfersfortreatment_61, potw_totaltransfers,"
                +  "offsitereleasetotal, offsiterecycledtotal, offsiteenergyrecoverytotal, offsitetreatedtotal,"
                +  "totaltransfer, totalreleases, releases_81, energyrecoveryonsite_82, recyclingonsite_84, treatmentonsite_86,"
                +  "productionwaste_81_to_87, parentcompanyname FROM full_epa_tri_releases "
                +  "WHERE city = '" + cityName + "' AND state = '" + cityState + "'";
    
    pool.connect((err, db, done) => {
        if (err) return response.status(400).send(err);
        else {
            db.query(query, (err, table) => {
                done();
                if (err) return response.status(400).send(err);
                else {
                    console.log("Query successful.");
                    response.status(201).send({ result: table });
                }
            });
        }
    });
})

app.listen(PORT, () => console.log('Listening on port ' + PORT));