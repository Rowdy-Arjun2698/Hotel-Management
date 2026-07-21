//create serve
const express= require("express")
const cookieParser=require("cookie-parser");
const authRoute=require("./routes/auth.routes")
const tableRoute=require("./routes/table.routes")
const menuRoute=require("./routes/menu.routes")
const customerRoute=require("./routes/customer.routes")
const path=require("path")
const cors=require("cors")
const app=express();

app.use(cors({
    origin:true,
    credentials:true
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/",(req,res)=>{
    res.send("Hello World !")
})
app.use("/api/hotel",authRoute);
app.use("/api/table",tableRoute);
app.use("/api/menu",menuRoute)
app.use("/api/customer",customerRoute);
module.exports=app;