import express from "express";
const router = express.Router(); 
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20"; 
import Db from "../config/db.js";

function authentication(req,res,next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/");
  }
}

router.get("/",(req,res)=>{ 
  res.render("layouts/login.ejs");
});



router.get("/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
); 

router.get("/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => { 
    console.log(req.user);
    res.redirect("/allPost")
  }
);
 
 router.get("/dashboard",authentication,async(req, res) => {
   const result = await Db.query("SELECT googleuserdata.user_id,googleuserdata.username,googleuserdata.mail,googleuserdata.profilepic,user_posts.id AS post_id,user_posts.title,user_posts.data,user_posts.date,user_posts.status FROM googleuserdata LEFT JOIN user_posts ON googleuserdata.user_id = user_posts.user_id WHERE googleuserdata.user_id = $1",
  [req.user.user_id]  
  );
   
  // console.log(result.rows);
   
  res.render("./layouts/dashboard.ejs",{
      Data : result.rows
  })
}); 
 
 
 router.get("/add",authentication,(req, res) => {
  res.render("./layouts/add.ejs")
}); 
  
router.get("/allPost",authentication,async (req, res) => { 
   
   let result = await Db.query(
  "SELECT * FROM user_posts WHERE status = $1",["public"]
);
  res.render("./layouts/allposts.ejs",{
      Posts : result.rows,
      user : req.user.username
  })
}); 
    
  
  
  

router.get("/profile",authentication,(req, res) => { 
      let userdata = req.user;
  res.render("./layouts/profile.ejs",{
    user : userdata
  })
}); 
  
  
  
  
  
router.post("/add",authentication,async (req, res) => {   
      let title = req.body.title;
      let data =req.body.description;
      let status = req.body.status;
      let userId = req.user.user_id; 
      let username = req.user.username;
       console.log(title);
       console.log(data); 
   let userData = await Db.query(
  "INSERT INTO user_posts (title,status,data,user_id,username,date) VALUES ($1,$2,$3,$4,$5,CURRENT_DATE)RETURNING *",
  [title,status,data,userId,username]
);   

  const posts = userData.rows;
  res.redirect("/dashboard");
}); 
 
 
 router.get('/logout', (req, res, next) => {
  req.logout((err) => { // Pass a callback here
    if (err) {
      return next(err); // Handle errors if any
    }
    res.redirect('/'); // Redirect after successful logout
  });
});

 
 

export default router;