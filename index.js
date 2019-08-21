/** 
 * Primary file the the API
 */

//Dependencies

var http = require('http')
var https = require('https')
var url = require('url')
var StringDecoder = require('string_decoder').StringDecoder
var config = require('./config')
var fs = require('fs')
//The server should respond to all request with a string


// Instantiate the HTTP server
var httpServer = http.createServer(function (req, res) {
    unifiedServer(req, res)
})

//Start the server, and have it listen on port 3000
httpServer.listen(config.httpPort, function () {
    console.log(`The server is listening on port ${config.httpPort}  now,on ${config.envName} mode`)
})


// Instantiate the HTTPS Server
var  httpsServerOptions = {
    'key': fs.readFileSync('./https/key.pem') ,
    'cert':fs.readFileSync('./https/cert.pem')
}
var httpsServer = https.createServer(httpsServerOptions,function (req, res) {
    unifiedServer(req, res)
})

//start the https server
httpsServer.listen(config.httpsPort, function () {
    console.log(`The server is listening on port ${config.httpsPort}  now,on ${config.envName} mode`)
})





// All the server logic for both http and https server
var unifiedServer = function (req, res) {
    // Get the URL and parse it
    var parsedUrl = url.parse(req.url, true)

    //Get the path 
    //get the untrimmed path
    var path = parsedUrl.pathname
    var trimmedPath = path.replace(/^\/+|\/+$/g, '')
    //get the query string as an object 
    var queryStringObject = parsedUrl.query
    //get the http method
    var method = req.method.toLowerCase()
    //Get the headers as an object
    var headers = req.headers
    //parsing the payload, if any
    var decoder = new StringDecoder('utf-8')
    var buffer = ''
    req.on('data', function (data) {
        buffer += decoder.write(data)
    })

    req.on('end', function () {
        buffer += decoder.end()
        //Route the request to appropriate handler on the notFound otherwise
        var chosenHandler = typeof (router[trimmedPath]) != 'undefined' ? router[trimmedPath] : handlers.notFound
        //construct the data object to send to the handler
        var data = {
            trimmedPath,
            queryStringObject,
            method,
            headers,
            'payload': buffer
        }
        //Route the request to the handler specified in the router 
        chosenHandler(data, function (statusCode, payload) {
            // Use the status code called back by the handler, or default to 200
            statusCode = typeof (statusCode) == 'number' ? statusCode : 200
            //Use the payload called back by the handler or default to {}
            payload = typeof (payload) == 'object' ? payload : {}

            // Convert the payload to a string 
            var payloadString = JSON.stringify(payload) //payload send back by the handler to the user

            //Send the response
            res.setHeader('Content-Type', 'application/json')
            res.writeHead(statusCode)
            res.end(payloadString)
            console.log('Returning this response :', statusCode, payload)
        })
    })

}
//Define the handlers
var handlers = {}

    //Sample handler
    handlers.sample = function (data, callback) {
        //Callback a http status code, and a payload object
        callback(406, { 'name': 'sample handler' })
    }

    //Not found handler
    handlers.notFound = function (data, callback) {
        callback(404)
    }
    //Define a request router
    var router = {
        'sample': handlers.sample
    }
