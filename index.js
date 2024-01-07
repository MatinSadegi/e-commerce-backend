import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import connectDB from "./config/db.js";
import userRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import attributesRoutes from "./routes/attributesRoutes.js";
import cartRoutes from './routes/cartRoutes.js'
import { notFound, errorHandler } from "./middlewares/errorHandler.js";
const app = express();

const server = createServer(app);
dotenv.config();
connectDB();
app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "50mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));
//Routes
app.use("/api/user", userRoutes);
app.use("/api/product", productRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/attributes", attributesRoutes);
app.use("/api/cart", cartRoutes);

app.use("/", (req, res) => {
  res.send("HELLOOOO");
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, console.log(`server is running on port ${PORT}`));
