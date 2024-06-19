const express= require('express')
const app = express();



app.use(express.json());


 
app.get("/get", (req,res)=>{
res.send("started on 8000")
})



app.listen(8000 , ()=>{
console.log("on 8000");
} )