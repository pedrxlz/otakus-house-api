require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");

var cors = require("cors");

const app = express();

const cookieParser = require("cookie-parser");

// database
const connectDB = require("./db/connect");

//  routers
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const bookingRouter = require("./routes/bookingRoutes");

app.use(cors());
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/booking", bookingRouter);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
