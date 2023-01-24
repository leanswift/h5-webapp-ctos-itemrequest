/**
 * To start the node web server to serve the static pages of the h5 application
 * from the current directory, execute the js in node from the command line eg,
 * node dev-web-server.js
 */
var connect = require('connect');
var serveStatic = require('serve-static');
var http = require("http");
var https = require("https");

//var port = "8080"; // default web server port
//var path = "."; // current directory
//var proxyPort = "8181"; // default proxy server port
//var h5Server = "localhost"; // H5 server
//var h5ServerPort = "22107"; // H5 Server port
//var h5Credentials = "username:password"; //H5 User Credentials

var port = "8080"; // default web server port
var path = "."; // current directory
var proxyPort = "8181"; // default proxy server port
var h5Server = "antoccino.leanswift.com"; // H5 server
var h5ServerPort = "22107"; // H5 Server port
var h5Credentials = "lsdemo01@leanswift.com:Leanswift@12345"; //H5 User Credentials ; KHMA01@leanswift.com:L3@nswift02  kach01@leanswift.com:Nehasind82013
//var h5Server = "uosqa-bel1.cloud.infor.com"; // H5 server
//var h5ServerPort = "63906"; // H5 Server port
//var h5Credentials = "INFORBC\\CTOSQA2:Q8ZDTW2g8QxFUA7";  //H5 User Credentials ; KHMA01@leanswift.com:L3@nswift02 INFORBC\CTOSQA2 Q8ZDTW2g8QxFUA7  INFORBC\\CTOSQA2:Q8ZDTW2g8QxFUA7

console.log('Starting web server at localhost:' + port + '/mne/apps/itemrequest');
connect().use('/mne/apps/itemrequest', serveStatic(path)).listen(port);

startProxyServerForRemoteM3(proxyPort, h5Server, h5ServerPort);

function startProxyServerForRemoteM3(localPort, remoteHost, remotePort) {
	console.log("Starting proxy http://localhost:" + localPort + " -> http://" + remoteHost + ":" + remotePort);

	var server = http.createServer(function(request, response) {

		var authH5User = 'Basic ' + Buffer.from(h5Credentials).toString('base64');
		request.headers["Authorization"] = authH5User;
		var options = {
			hostname : remoteHost,
			port : remotePort,
			path : request.url,
			method : request.method,
			headers : request.headers,
			rejectUnauthorized : false
		};

		try {
			var proxyRequest = http.request(options);
			proxyRequest.on("response", function(proxyResponse) {
				try {
					proxyResponse.on("data", function(chunk) {
						response.write(chunk, "binary");
					});
					proxyResponse.on("end", function() {
						response.end();
					});
					proxyResponse.on("error", function(e) {
						console.log("Request error: " + e);
					});
					proxyResponse.headers["Access-Control-Allow-Origin"] = "*";
					response.writeHead(proxyResponse.statusCode, proxyResponse.headers);
				} catch (ex) {
					console.log("Exception on receiving response " + ex);
				}
			});
			request.on("data", function(chunk) {
				try {
					proxyRequest.write(chunk, "binary");
				} catch (ex) {
					console.log("Error writing the data " + ex);
				}
			});
			request.on("end", function() {
				try {
					proxyRequest.end();
				} catch (ex) {
					console.log("Error while ending the proxy request " + ex);
				}
			});
		} catch (ex) {
			console.log("Exception occurred " + ex);
		}
	});

	server.on("clientError", function(e) {
		console.log("Client error: " + e);
	});

	process.on("uncaughtException", function(e) {
		console.log("Uncaught exception: " + e);
	});

	server.listen(localPort);
}