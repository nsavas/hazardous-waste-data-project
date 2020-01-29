let express = require('express');
let bodyParser = require('body-parser');
let morgan = require('morgan');
let promise = require('bluebird');

// Read env variables
const dotenv = require('dotenv');
dotenv.config();

// API port
const PORT = 3000;

// Get credentials
const username = process.env.DB_USER;
const password = process.env.DB_PASS;
const dbport = process.env.DB_PORT;
const host = process.env.DB_HOST;
const database = process.env.DB_NAME;

// Initialization options
let options = {
    promiseLib: promise
};

// Set up connection
let pgp = require('pg-promise')(options); // PostgreSQL and PostGIS module
let connString = "postgres://" + username + ":" + password + "@" + host + ":" + dbport + "/" + database;
let db = pgp(connString);

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Enable CORS
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Receives city/state and sends back corresponding data as well as geojson for the heatmap
app.post('/postgre-api/get-tri-releases-by-city', function (request, response) {
    let cityName = request.body.city;
    let cityState = request.body.state;

    // Geojson query
    let query1 = "SELECT row_to_json(fc) as result_geometry FROM ("
        + "SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM ("
        + "SELECT 'Feature' As type, ST_AsGeoJSON(facilitygeometry)::json As geometry FROM "
        + "full_epa_tri_releases WHERE city = '" + cityName + "' AND state = '" + cityState + "' GROUP BY facilitygeometry) As f) As fc;"

    // Data query
    let query2 = "SELECT row_to_json(fc) as result_data FROM (SELECT array_to_json(array_agg(f)) As features FROM("
        + "SELECT year, facilityname, streetaddress, city, county, state, zipcode, latitude, longitude,"
        + "federalfacility, industrysector, chemical, cleanairactchemical, metal, carcinogen, unitofmeasure,"
        + "fugitiveair_51, stackair_52, water_53, underground_54, underground_class_i_541, underground_class_ii_v_542,"
        + "landfills_551, rcra_c_landfills_551a, otherlandfills_551b, landtreatment_552, surfaceimpoundment_553,"
        + "rcra_surfaceimpoundment_553a, othersurfaceimpoundment_553b, otherdisposal_554, onsitereleasetotal,"
        + "potw_transfersforrelease_61, potw_transfersfortreatment_61, potw_totaltransfers,"
        + "offsitereleasetotal, offsiterecycledtotal, offsiteenergyrecoverytotal, offsitetreatedtotal,"
        + "totaltransfer, totalreleases, releases_81, energyrecoveryonsite_82, recyclingonsite_84, treatmentonsite_86,"
        + "productionwaste_81_to_87, parentcompanyname FROM full_epa_tri_releases "
        + "WHERE city = '" + cityName + "' AND state = '" + cityState + "') As f) As fc";

    // Waits for both queries to complete before sending data
    db.connect().then(obj => {
        obj.multi(query1 + query2).then(([result_geometry, result_data]) => {
            console.log("Query successful.");
            obj.done();
            response.status(201).send({
                result_geometry: result_geometry[0].result_geometry,
                result_data: result_data[0].result_data.features
            });
        })
    })
        .catch(err => {
            return response.status(400).send(err);
        })
});

app.post('/postgre-api/get-release-method-totals-by-city', function (request, response) {
    let cityName = request.body.city;
    let cityState = request.body.state;

    let query = "SELECT SUM(fugitiveair_51) AS fugitiveair, SUM(stackair_52) AS stackair, SUM(water_53) AS water,"
        + "SUM(COALESCE(underground_54, 0) + COALESCE(underground_class_i_541, 0) + COALESCE(underground_class_ii_v_542, 0)) AS underground,"
        + "SUM(COALESCE(landfills_551, 0) + COALESCE(rcra_c_landfills_551a, 0) + COALESCE(otherlandfills_551b, 0)) AS landfill,"
        + "SUM(landtreatment_552) AS landtreatment,"
        + "SUM(COALESCE(surfaceimpoundment_553, 0) + COALESCE(rcra_surfaceimpoundment_553a, 0) + COALESCE(othersurfaceimpoundment_553b, 0)) AS surfaceimpoundment,"
        + "SUM(otherdisposal_554) AS otherdisposal FROM full_epa_tri_releases WHERE unitofmeasure = 'Pounds' AND city = '" + cityName + "' AND state = '" + cityState + "';"

    db.connect().then(obj => {
        obj.query(query).then(([result]) => {
            console.log("Query successful.");
            obj.done();
            response.status(201).send({
                result: result
            });
        })
    })
        .catch(err => {
            return response.status(400).send(err);
        })
});

app.listen(PORT, () => console.log('Listening on port ' + PORT));