import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import Db from "./db.js" 

dotenv.config({ path:"./config/config.env" });
//const userData = [];
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL:"https://blogin-bl89.onrender.com/auth/google/callback",
    }, 
     
   // console.log()
   async (accessToken, refreshToken, profile, done) => {  
      let findingUser = 
       await Db.query("SELECT * FROM googleuserdata WHERE google_id = $1",[profile.id]); 
    //  console.log("done 1 google Strategy");
      if(findingUser.rows.length > 0){
      return done(null,findingUser.rows[0])
      }else{
      //  console.log(profile);
        const resultdata = await Db.query(
          "INSERT INTO googleuserdata(google_id,username,mail,profilepic) VALUES($1,$2,$3,$4) RETURNING *",[profile.id,profile.displayName,profile.emails[0].value,profile.photos[0].value]
          ); 
        const user =  resultdata.rows[0];
      return done(null, user); 
      
   }
    }
  )
);
// ---------- SERIALIZE ----------
passport.serializeUser((user, done) => {
  // What goes into session:
  // req.session.passport.user = user.id
  done(null,user.user_id); 
});

// ---------- DESERIALIZE ----------
passport.deserializeUser(async (id, done) => {
  // Convert id from session back to full user object  
  let result = await Db.query("SELECT * FROM googleuserdata WHERE googleuserdata.user_id = $1",[id]);
  let user = result.rows[0];
  done(null, user);
 // console.log("req.user",user);
    
});

// Export configured passport to use in server.js
export default passport;
 
 





