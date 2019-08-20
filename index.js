/** 
 * Primary file the the API
 */

 //Dependencies

 var http = require('http')
var url = require('url')
 //The server should respond to all request with a string

var server = http.createServer(function(req, res){
    // Get the URL and parse it
    var parsedUrl = url.parse(req.url, true)
    
    //Get the path 
    //get the untrimmed path
    var path = parsedUrl.pathname
    var trimmedPath = path.replace(/^\/+|\/+$/g,'')
   
    //Send the response
    res.end('Hello world\n')

    //Log the request path 

  
})


 //Start the server, and have it listen on port 3000
 server.listen(3000, function(){
     console.log("The server is listening on port 3000 now")
 })