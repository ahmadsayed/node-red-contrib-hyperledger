  module.exports = function(RED) {
      const https = require('https');
	  const http = require('http');
      var util = require('util');

      function EnrollNode(config) {
          RED.nodes.createNode(this, config);
          var node = this;
		  var str = "";
          node.on('input', function(msg) {
			  var str = "";
              var options = {
                  host: msg.peer,
                  port: msg.port,
                  path: '/registrar',
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
              req.end(JSON.stringify(msg.payload));
          });
      }


      RED.nodes.registerType("enroll", EnrollNode);
  }