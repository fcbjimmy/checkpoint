require("dotenv").config();
require("express-async-errors");

//express
const express = require("express");
const app = express();

//extra packages/security packages
const cors = require("cors");
// const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

//db

//middleware
const authRoutes = require("./routes/authRoutes");
const leaveRoutes = require("./routes/leaveRoutes");
const userRoutes = require("./routes/userRoutes");
const hrRoutes = require("./routes/hrRoutes");
const helperRoutes = require("./routes/helperRoutes");
const notFound = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

//routes
// app.use(bodyParser.json({ limit: "600kb" }));
// app.use(fileUpload({ useTempFiles: true }));
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("hello world!");
});
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/leave", leaveRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/hr", hrRoutes);
app.use("/api/v1/helper", helperRoutes);
app.use(notFound);
app.use(errorHandlerMiddleware);

//port
const port = process.env.PORT || 4000;

//initialize server
const start = async () => {
  try {
    app.listen(port, console.log(`server is listening on port ${port}`));
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

start();
