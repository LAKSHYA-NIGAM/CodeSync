const express=require('express');
const cors=require('cors');
const authRoutes=require('./routes/auth.routes');
const roomRoute=require("./routes/room.route");
const app= express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
    res.json({ status: "healthy", service: "CodeSync Backend", timestamp: new Date().toISOString() });
});
app.use("/api/auth",authRoutes);
app.use("/api/room", roomRoute);
app.use("/api/route", roomRoute);


module.exports=app;