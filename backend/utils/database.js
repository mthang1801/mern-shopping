const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
const MongoURL = "mongodb+srv://mvt:Th@ng1995@cluster0-wqvyp.mongodb.net/test?retryWrites=true&w=majority";

let _db;

const initDB = callback => {
  if(_db){
    console.log("Database has been initialized");
    return callback(null, _db);
  }
  MongoClient.connect(MongoURL, {useNewUrlParser : true, useUnifiedTopology: true})
    .then(client => {
      _db = client;
      console.log("Database connected");
      callback(null, _db);
    })
    .catch(err => {
      callback(err);
    })
}

const getDB = () =>{
  if(!_db){
    throw new Error("Database is not initialized");
  }
  return _db ; 
}


module.exports = {
  initDB,
  getDB
}

