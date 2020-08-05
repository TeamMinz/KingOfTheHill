const fs = require('fs');
const https = require('https');
const express = require('express');
const yargs = require('yargs');
const cors = require('cors');
const jwt = require('jsonwebtoken');


if (process.env.NODE_ENV == 'development') {
    //We will be using self signed certs in development. We need to make sure that we specifically allow that.
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

//Process command line arguments
let argv = yargs.describe('EXT_OWNER_ID', 'The extension\'s owner id')
                .alias('o', 'EXT_OWNER_ID')
                .describe('EXT_SECRET', 'The extension\'s secret')
                .alias('s', 'EXT_SECRET')
                .describe('EXT_CLIENT_ID', 'The extension\'s clientId')
                .alias('c', 'EXT_CLIENT_ID')
                .argv;


//Fetch some environment variables that we will need.

function getOption(option) {
    if (argv[option]) {
        return argv[option];
    } else if (process.env[option]) {
        return process.env[option];
    }
    //Panic
    console.error(`Missing required "${option}" environment variable.`);
    process.exit(1);
}

const OWNER_ID = getOption('EXT_OWNER_ID');
const SECRET =  Buffer.from(getOption('EXT_SECRET'), 'base64');
const CLIENT_ID = getOption('EXT_CLIENT_ID');

//Load our TLS cert and key.

const TLS_CERT_PATH = "../conf/.crt";
const TLS_KEY_PATH = "../conf/.key";

const TLS = {
    key: fs.readFileSync(TLS_KEY_PATH),
    cert: fs.readFileSync(TLS_CERT_PATH), 
};

//Create some middleware to help authorize the requests.

function authorizeHeader(req, res, next) {
    if (!req.headers.authorization) {
        //TODO sent appropriate response code.
        return;
    }

    const authstr = req.headers.authorization;
    const bearerPrefix = 'Bearer ';


    if (authstr.startsWith(bearerPrefix)) {
        const token = authstr.substring(bearerPrefix.length);

        jwt.verify(token, SECRET, function (err, payload) {
            if (err) {
                console.log(err);
                res.status(401).send('Failed to authorize JWT token.');
                return;
            }

            req.twitch = payload;

            next();
        });

    } else {
        res.status(401).send('Failed to authorize JWT token.');
        return;
    }
}


const app = express();

app.use(cors());
app.use(authorizeHeader);

app.use('/queue', require('./routes/queue.js')(OWNER_ID, SECRET, CLIENT_ID));

app.get('/test', function (req, res) {
    console.log("Got a fully authenticated test from " + JSON.stringify(req.twitch));
});

https.createServer(TLS, app).listen(8081, () => {
    console.log("EBS now listening.");
});