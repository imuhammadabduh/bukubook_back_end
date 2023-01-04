const MySql = require("mysql2");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config()


// MySql Connection
const MySqlClient = async ({ host, port, user }) => {
  try {
    const client = await MySql.createConnection({
      host: process.env.DB_HOST ?? "localhost",
      user: process.env.DB_USER ?? "root",
      password: process.env.DB_PASS ?? "",
      database: process.env.DB_NAME ?? "bukubook",
    });

    console.log("Connected to MySql");
  } catch (e) {
    console.log("Database connection Error");
    console.error(e.message);
  }
};


// Mongo Connection
const MongoClient = async () => {
 mongoose.set("strictQuery", false);

 const mongoUri = `mongodb://${process.env.DB_NAME}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}`;

 mongoose.connect(
   "mongodb://bukubook:bukubook@ac-nqma1ng-shard-00-00.q69pqbn.mongodb.net:27017,ac-nqma1ng-shard-00-01.q69pqbn.mongodb.net:27017,ac-nqma1ng-shard-00-02.q69pqbn.mongodb.net:27017/?ssl=true&replicaSet=atlas-og9t91-shard-0&authSource=admin&retryWrites=true&w=majority",
   (conn) => {
     console.log("connected to mongodb");
   },
   (err) => {
     console.error("Connection to mongodb errors!", err.message);
   }
 );

 return mongose
}


// Create Database Connection
const db = (async () => {
  const dbHost = process.env.DB_HOST
  const dbPort = process.env.DB_PORT
  const dbUser = process.env.DB_USER;
  const dbPassword = process.env.DB_PASS
  const dbName = process.env.DB_NAME


  // MySql Connection
  if (process.env.DB_CONN == "MySql") {
    return await MySqlClient({
      host: dbHost,
      port: dbPort,
      user: dbUser,
      password: dbPassword,
      database: dbName 
    })
  }

  // Mongo Connection
  if (process.env.DB_CONN == "Mongo") {
    return await MongoClient()
  }
})()

module.exports = db;