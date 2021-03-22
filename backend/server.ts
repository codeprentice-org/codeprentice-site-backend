import express from 'express';
import { Request, Response, NextFunction } from "express";
import bodyParser from 'body-parser'
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
dotenv.config({ path: "./config/.env.config" });

// API Imports
import { USER_API } from "./routes/user.route";
import { PROJECT_API } from "./routes/project.route";

// Connect to database
mongoose.connect(
    "mongodb+srv://test:" 
    + process.env.MONGODB_ATLAS_DB_PWD 
    + "@messenger-db.jzhdw.mongodb.net/codeprentice-testing-db?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
);
const database = mongoose.connection;
database.on("error", () => console.log("Unable to connect to the database"));
database.once("open", () => console.log("Connected to database"));

// Express config
const app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded( { extended: false } ))


// For sending view 
app.use(express.static(path.join(__dirname, ".././frontend/build")));
app.get("/", (req: Request, res: Response) => {
        res.sendFile(path.join(__dirname, ".././frontend/build/index.html"));
})


// Config API Routes
app.use("/user", USER_API);
app.use("/project", PROJECT_API);

// Start Express server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
