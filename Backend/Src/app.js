const express=require('express');
const cors=require('cors');
const authRoutes=require('./routes/auth.routes');
const roomRoute=require("./routes/room.route");
const app= express();
app.use(cors());
app.use(express.json());
app.use("/api/auth",authRoutes);
app.use("/api/route",roomRoute);


module.exports=app;