const User = require('../models/userModel')

const userRegister = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Simple validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and Password are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // Create new user
    const newUser = new User({ email, password });
    await newUser.save();

    return res.status(201).json({ message: 'User created successfully', User:{email,password} });
  } catch (error) {
    console.error('Error in userController:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
  
};


const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and Password are required' });
    }

    // Find user by email
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(401).json({ message: 'Invalid credentials' }); // Unauthorized
    }

    // Check if password matches
    if (existingUser.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Login success
    return res.status(200).json({ message: 'Login successful' ,"User":{email,password}});
  } catch (error) {
    console.error('Error in userLogin:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

const saveUserController=async(req,res)=>{
  try {
    const {email,url,prediction_rf,confidence_rf} = req.body
    const user = await User.findOne({email});
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Add the new search to the user's searches
    user.searches.push({url: url, result:prediction_rf, confidence:confidence_rf });
    await user.save();

    res.status(201).json({ message: 'Search saved successfully' });
    
  }
  catch(e){
    console.log(e)
  }
 
}


module.exports = {userRegister,userLogin,saveUserController};
