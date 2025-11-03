import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.routes.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";
const app = express();
dotenv.config({});

//middleeware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOption = {
  origin: ["http://localhost:5121"],
  credentials: true,
};
app.use(cors(corsOption));

const PORT = process.env.PORT || 5001;

// API
app.use("/api/user", userRoute);
app.use("/api/company", companyRoute);
app.use("/api/job", jobRoute);
app.use("/api/application", applicationRoute)

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});
