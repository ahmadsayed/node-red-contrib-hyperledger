module.exports = function(RED) {
	const https = require('https');
	var util = require('util');

    function DeployNode(config) {
        RED.nodes.createNode(this,config);
          var node = this;
		  var str = "";
          node.on('deploy', function(msg) {
			  var str = "";
			  var host = "";
			  var port = 0;
			  if (typeof msg.peer == 'undefined') {
				  host = node.host;
			  } else {
				  host = msg.peer;
			  }
			  if (typeof msg.port == 'undefined') {
				  port = node.port;
			  } else {
				  port = msg.port;
			  }
			  var jsonDeployRequest = 
			  {
			  "jsonrpc": "2.0",
			  "method" : "deploy"
			  "params": {
				"type": 1,
				"chaincodeID": {
				  "path": n.chaincodeID
				},
				"ctorMsg": {
				  "function": "init",
				  "args": [
					"hi there"
				  ]
				},
				"secureContext": "user_type1_0"
			  },
			  "id": 1
			};
              var options = {
                  host: host,
                  port: port,
                  path: '/chaincode',
                  method: 'POST',
				  headers: {
					"content-type": "application/json",
				},
				json: jsonDeployRequest
              };

              var req = https.request(options, function(res) {

                  res.on('data', function(body) {
					  str += body;
                  });

                  res.on('end', function() {                      
   	                  this.chaincodeID = JSON.parse(str).message;

                  });
              });
			  
              req.end(JSON.stringify(jsonDeployRequest));
		  });
    }
    RED.nodes.registerType("deploy",DeployNode);
}