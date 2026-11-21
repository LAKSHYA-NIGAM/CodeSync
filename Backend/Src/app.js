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



// 404 handler for unmatched API routes
app.use("/api", (req, res) => {
    res.status(404).json({ error: `Endpoint ${req.method} ${req.originalUrl} not found` });
});

// Centralized error handling middleware
app.use((err, req, res, next) => {
    console.error("[CodeSync Error]", err);
    const status = err.status || 500;
    res.status(status).json({
        error: err.message || "Internal server error",
        timestamp: new Date().toISOString()
    });
});

module.exports=app;