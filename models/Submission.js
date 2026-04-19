const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { 
    type: String, 
    required: true,
    match: [/^\S+@\S+\.\S+$/, 'Invalid email']
  },
  phone: { 
    type: String, 
    required: true,
    match: [/^\d{10}$/, 'Phone must be 10 digits']
  },
  internship: { type: Boolean, default: false },
  resume: { type: String }, // Stores file path
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Submission', submissionSchema);
