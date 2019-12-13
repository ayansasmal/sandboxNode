import { createServer } from "http";

//create a server object:
createServer(function(req, res) {
  console.log("started server!");
  res.write("Hello World!!"); //write a response to the client
  res.end(); //end the response
}).listen(8080); //the server object listens on port 8080
