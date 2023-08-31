import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import connectDB from "./config/db.js";

const app = express();
const server = createServer(app);
dotenv.config();
connectDB();
app.use(bodyParser.json({ limit: "50mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());

//Routes
app.use("/", (req, res) => {
  res.send("HELLOOOO")
});




const PORT = process.env.PORT || 5000;
server.listen(PORT, console.log(`server is running on port ${PORT}`));
 