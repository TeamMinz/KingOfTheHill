const express = require('express');

if (process.env.NODE_ENV == 'development') {
    //We will be using self signed certs in development. We need to make sure that we specifically allow that.
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

//Fetch some environment variables that we will need.




const app = express();

app.listen(8081, () => {
    console.log("EBS now listening.");
});