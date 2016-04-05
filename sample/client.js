var ioreq = require("../");

var io = require("socket.io-client")("http://localhost:3000");

io.on("connect", function(){
  console.log("connect!");

  process.stdin.on("data", function(data){

    ioreq(io).request("toUpper", data.toString())
      .then(function(res){
        console.log(res);
      })
      .catch(function(err){
        console.error(err.stack || err);
      });

  });
});
