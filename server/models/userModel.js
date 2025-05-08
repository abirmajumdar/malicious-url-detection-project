const mongoose = require('mongoose');
const searchSchema = mongoose.Schema({
    url: { type: String, required: true },
    result: { type: String, required: true },  // 'Phishing' or 'Legitimate'
    confidence: { type: String, required: true }, // Confidence percentage
    date: { type: Date, default: Date.now }
  });

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  searches: [searchSchema],
});

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
