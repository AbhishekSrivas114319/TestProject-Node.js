const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose"); // importing mongooset
const userRoute = require("./routes/user");
const dotenv = require("dotenv");


dotenv.config();

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000; 
// To remove CROS (cross-resource-origin-platform) problem
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // to allow all client we use *
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS,GET,POST,PUT,PATCH,DELETE"
  ); //these are the allowed methods
  res.setHeader("Access-Control-Allow-Headers", "*"); // allowed headers (Auth for extra data related to authoriaztiom)
  next();
});


app.use("/user",userRoute);

//errorHandeling Middleware
app.use((err, req, res, next) => {
    res.status(err.statusCode || 500);
    res.send({
      error: {
        status: err.statusCode || 500,
        message: err,
      },
    });
});

mongoose
  .connect(process.env.DB_CONNECT, {
    //To remove Deprication Warnings
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    app.listen(PORT, () => {
        console.log("server running")
    })
  })
  .catch((err) => {
    console.log(err);
  });
