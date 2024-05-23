require("dotenv").config();
require("express-async-errors");

//Express
const express = require("express");
const app = express();

//Other Packages
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");
const rateLimiter = require("express-rate-limit");
const helmet = require("helmet");
const xss = require("xss-clean");

//cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

//Connect Database
const connectDB = require("./db/connect");

//Routers
const adminRouter = require("./routers/adminRouter");
const buyerRouter = require("./routers/buyerRouter");
const vendorRouter = require("./routers/vendorRouter");
const businessRouter = require("./routers/businessRouter");
const productRouter = require("./routers/productRouter");
const reviewRouter = require("./routers/reviewRouter");
const cartRouter = require("./routers/cartRouter");

//Middleware
const notfoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

//Set up security packages
app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 10 * 60 * 1000,
    max: 100,
  })
);
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(mongoSanitize());

app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(fileUpload({ useTempFiles: true }));

//Mount Routers
app.use("/api/v1/multi-vendor-store", adminRouter);
app.use("/api/v1/multi-vendor-store", buyerRouter);
app.use("/api/v1/multi-vendor-store", vendorRouter);
app.use("/api/v1/multi-vendor-store", businessRouter);
app.use("/api/v1/multi-vendor-store", productRouter);
app.use("/api/v1/multi-vendor-store", reviewRouter);
app.use("/api/v1/multi-vendor-store", cartRouter);

app.use(notfoundMiddleware);
app.use(errorHandlerMiddleware);
const port = process.env.PORT || 2021;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () => console.log(`Server is running on port ${port}`));
  } catch (error) {
    console.log(error);
  }
};

start();
