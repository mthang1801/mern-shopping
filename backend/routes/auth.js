const Router = require('express').Router;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db =require("../utils/database");
const router = Router();

const createToken = () => {
  return jwt.sign({}, 'secret', { expiresIn: '1h' });
};

router.post('/login',  async (req, res, next) => {
 try {
  const email = req.body.email;
  const pw = req.body.password;
  // Check if user login is valid
  const user = await db.getDB().db("shop").collection("users").findOne({email : email});
 
  const checkPassword = await bcrypt.compare(pw, user.password);
  if(!checkPassword){
    res.status(401).json({ message: 'Authentication failed, invalid username or password.' });
  }
  // If yes, create token and return it to client
  const token = createToken();
  // res.status(200).json({ token: token, user: { email: 'dummy@dummy.com' } });
  res.status(201).json({ token: token, user: { email: email} });
 } catch (error) {
   console.log(error);
   res.status(401).json({ message: 'Authentication failed, invalid username or password.' });
 }
});

router.post('/signup', (req, res, next) => {
  const email = req.body.email;
  const pw = req.body.password;
  // Hash password before storing it in database => Encryption at Rest
  bcrypt
    .hash(pw, 12)
    .then( async hashedPW => {
      // Store hashedPW in database
      try {
        const result = await db.getDB().db("shop").collection("users").insertOne({email : email, password : hashedPW});
        console.log(result);
        const token = createToken();
         res.status(201).json({ token: token, user: { email: email} });
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Creating the user failed.' })
      }
    })
});

module.exports = router;
