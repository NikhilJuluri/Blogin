import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv"; 
import session from "express-session";
import passportjs from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "./config/passport.js";
dotenv.config({ path :"./config/config.env" });
import router from "./routes/index.js";
import Db from "./config/db.js" ;



const app = express(); 

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
const PORT = process.env.PORT; 

// enable
app.use(
  session({
    secret: process.env.SECRET_CODE,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passportjs.initialize());
app.use(passportjs.session());

// global
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});


app.use("/",router);

app.listen(3000, () => {
  console.log(`http://localhost:${PORT}`);
});

