const mongoose = require('mongoose');
const Staff = require('./staff');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const adminExists = await Staff.findOne({ username: 'admin' });
    if (!adminExists) {
      const admin = new Staff({ username: 'admin', password: 'admin123' });
      await admin.save();
      console.log('✅ Admin user created');
    }
    mongoose.disconnect();
  })
  .catch(console.error);
