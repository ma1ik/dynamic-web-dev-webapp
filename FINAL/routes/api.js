// Movie API Proxy Code
const express = require("express");
const axios = require("axios");
let router = express.Router();

router.get('/*', async function(req, res, next) {
    let query = req.query;
    query.api_key = process.env.API_KEY;
    const response = await axios.get(process.env.API_BASE + req.path, { params: query, transformResponse: (req) => {return req;} });
    res.status(response.status);
    res.statusText = response.statusText;
    for (let headerIndex in response.headers) {
        if (response.headers.hasOwnProperty(headerIndex)) {
            res.setHeader(headerIndex.toString(), Buffer.from(response.headers[headerIndex]).toString());
        }
    }
    res.end(response.data);
});

module.exports = router;