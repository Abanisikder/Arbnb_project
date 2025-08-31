const mongoose=require("mongoose");
const initData=require("./data.js");
const listing=require("../models/listing.js");
main().then((res)=>{
    console.log(res);
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wonderlust');


}
const initDb=async()=>{
    await listing.deleteMany({});
   initData.data= initData.data.map((obj)=>({...obj,owner:'68a68a77a8ba59831cc841d9'}));
    await listing.insertMany(initData.data);
    console.log("data is saved successfully");
}
initDb();
