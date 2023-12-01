
const express = require("express")
const jwt = require("jsonwebtoken")
const {authorization} = require("../middlewares/auth")
require("dotenv").config()
const userRouter = express.Router()
const bcrypt = require("bcrypt")
const { usermodel } = require("../models/user.Schema")
userRouter.use(express.json())
const { passport } = require("./auth");

userRouter.post("/sign", async (req, res) => {
  const { email, name, password } = req.body
  console.log(req.body)
  try {
        let presentUser = await usermodel.findOne({ email })

        if (presentUser) {
          res.status(201).send({ "ok":false, "msg": " user already Registration" });
        } else {

            bcrypt.hash(password, 5, async (err, hash) => {
                if (err) {
                    res.send({ "ok": false, "msg": "Something went wrong while hashing" });
                }

                const user = new usermodel({ name, email, password: hash });
                await user.save();

                res.status(200).send({ "ok": true, "msg": "Registration Successfull" });
            });
        }


    } catch (err) {
        res.send({ mes: err.message });
    }
})

userRouter.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const user = await usermodel.findOne({ email });
      console.log(user);
      if (!user) {
        res.send({"ok":false, "msg": "User Not found, Please Register First" });
      } else {
        bcrypt.compare(password, user.password, (err, result) => {
          if (result) {
            let token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
              expiresIn: "30m",
            });
  
            res.send({
              "ok":true,
              "msg": "login successfully",
              "name": user.name,
              "token": token
            });
          } else {
            res.send({"ok":false,"msg":"Wrong Credentials"});
          }
        });
      }
    } catch (err) {
      res.send({ "msg": err.message });
    }
  });

  userRouter.get("/alldata",async (req, res) => {
    try {
      
       const result = await usermodel.find({},{password:0})
       res.send({ "ok":true, allData: result});
    } catch (err) {
      res.send({ "msg": err.message });
    }
  });

  userRouter.get("/auth/google",passport.authenticate("google", { scope: ["profile", "email"] }));
  userRouter.get("/auth/google/callback",passport.authenticate("google", {failureRedirect: "/login",session: false}),
  async function (req, res) {
    //in this request object you can get details of the user that we set in google.auth.js file
    const isPresent = await usermodel.findOne({ email: req.user.email });
    if (isPresent) {
      const token = jwt.sign({id:isPresent._id},process.env.JWT_SECRET,{expiresIn:"35s"})
              res.cookie("token",token,{maxAge:1000*35})
              // res.status(202).send({msg:`login done`})
              res.redirect(`http://localhost:3000/Home`)
    } else {
      req.user.password = bcrypt.hashSync(req.user.password, 2);
      const user = new usermodel(req.user);
      await user.save();
      const isPresent = await usermodel.findOne({ email: req.user.email });
      const token = jwt.sign({id:isPresent._id},process.env.JWT_SECRET,{expiresIn:"35s"})
              res.cookie("token",token,{maxAge:1000*35})
              // res.status(202).send({msg:`login done`})
              res.redirect(`http://localhost:3000/Home`)
    }
  }
);

  module.exports={userRouter}