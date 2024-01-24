const express = require("express");
const router = express.Router();
const SIGNUPNUSER = require("../model/signupschema");
const bcrypt = require("bcryptjs");

router.post("/signupuser", async (req, res) => {
  // console.log(req.body);
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(422).json({ Error: "Please... fill the data" });
    console.log("fill the data");
  }

  try {
    const preuser = await SIGNUPNUSER.findOne({ email: email });
    if (preuser) {
      res.status(422).json("this signupuser is already present");
    } else {
      const finalsignupuser = new SIGNUPNUSER({
        name,
        email,
        password,
      });

      const storesignupuser = await finalsignupuser.save();
      console.log(storesignupuser);
      res
        .status(201)
        .json({ message: "User added successfully", user: storesignupuser });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//login user api
router.post("/loginuser", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(422).json({ error: "fill all the data" });
  }
  try {
    const userlogin = await SIGNUPNUSER.findOne({ email: email });
    if (userlogin) {
      const isMatch = await bcrypt.compare(password, userlogin.password);
      if (!isMatch) {
        res.status(422).json({ error: "Invalid Details" });
      } else {
        res.status(201).json(userlogin);
      }
    } else {
      res.status(422).json({ error: "Invalid Details" });
    }
  } catch (error) {
    res.status(422).json({ error: "Invalid detail" });
  }
});

module.exports = router;
