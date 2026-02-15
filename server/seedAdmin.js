const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
})
    .then(() => console.log('MongoDB Connected for Admin Seeding'))
    .catch(err => console.log(err));

const seedAdmin = async () => {
    const email = "admin@pizza.com";
    const password = "admin";

    const userExist = await User.findOne({ email });
    if (userExist) {
        console.log("Admin already exists");
        mongoose.connection.close();
        return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const adminUser = new User({
        name: "Admin User",
        email: email,
        password: hashedPassword,
        role: "admin",
        isVerified: true
    });

    await adminUser.save();
    console.log("Admin Created: admin@pizza.com / admin");
    mongoose.connection.close();
};

seedAdmin();
