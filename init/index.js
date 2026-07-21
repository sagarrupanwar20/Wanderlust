const mongoose = require("mongoose");
const initdata = require("./data.js");
const listing = require("../models/listing.js");

const mongo_url = "mongodb://127.0.0.1:27017/wanderlust"

main()
.then((res)=>{
    console.log("connected to db");
}).catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(mongo_url);
};

const initDB = async ()=>{
   await  listing.deleteMany({});
   initdata.data = initdata.data.map((obj)=>({...obj, owner:'6a5782a6aa12d75ba78999c7'}));
   await listing.insertMany(initdata.data);
   console.log("data was initalize");
};
initDB();