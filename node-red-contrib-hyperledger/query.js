module.exports = function(RED) {
    var hfc = require('hfc');
	const https = require('https');
	const http = require('http');
	var util = require('util');

    function QueryNode(config) {
        RED.nodes.createNode(this,config);
          var node = this;
		  var str = "";
          node.on('input', function(msg) {
              var options = {
                  host: msg.peer,
                  port: msg.port,
                  path: '/chaincode',
                  method: 'POST',
				  headers: {
					"content-type": "application/json",
				},
				json: msg.payload
              };

              var req = https.request(options, function(res) {

                  res.on('data', function(body) {
					  str += body;
                  });

                  res.on('end', function() {
                      msg.payload= str;
   	                  node.send(msg);

                  });
              });
              msg.payload.jsonrpc="2.0";
			  msg.payload.method="query";
              req.end(JSON.stringify(msg.payload));
		  });
    }
    RED.nodes.registerType("query",QueryNode);
}