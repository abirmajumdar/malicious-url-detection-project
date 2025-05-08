const User = require('../models/userModel')

const showUrlSearch=async(req,res)=>{
    try {
        // Find the user by their email (assuming user data is attached to the request)
        const {email} = req.body
        const user = await User.findOne({ email});
    
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
    
        // Return the user's searches
        res.status(200).json(user.searches);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }
}


const showAllUrlSearches = async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await User.find();

    if (!users) {
      return res.status(404).json({ message: 'No users found' });
    }

    // Collect all searches from each user and include user email
    const allSearches = users.flatMap(user => 
      user.searches.map(search => ({
        userEmail: user.email,  // Include the user's email
        url: search.url,
        result: search.result,
        confidence: search.confidence,
        date: search.date
      }))
    );

    // Sort all searches by date in ascending order (oldest first)
    const sortedSearches = allSearches.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Return the sorted searches
    res.status(200).json(sortedSearches);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



module.exports = {showUrlSearch,showAllUrlSearches}