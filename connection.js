const mongoose = require("mongoose");
//require("dotenv").config();

mongoose.set('strictQuery', false);

mongoose.connect(
  "mongodb://bukubook:bukubook@ac-nqma1ng-shard-00-00.q69pqbn.mongodb.net:27017,ac-nqma1ng-shard-00-01.q69pqbn.mongodb.net:27017,ac-nqma1ng-shard-00-02.q69pqbn.mongodb.net:27017/?ssl=true&replicaSet=atlas-og9t91-shard-0&authSource=admin&retryWrites=true&w=majority",
  (conn) => {
    console.log("connected to mongodb");
  },
  (err) => {
      console.error("Connection to mongodb errors!", err.message)
  }
);