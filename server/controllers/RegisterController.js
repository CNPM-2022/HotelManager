const argon2 = require('argon2');
const jwt = require('jsonwebtoken');

const User = require('../models/User');


// @route   POST api/auth/register
// @desc    Register user
// @access  Public
const RegisterController = async (req, res) => {
    const { username, email, Name, phoneNumber, password } = req.body;
    console.log(req.body);
    // Simple validation
    if (!username || !password || !email || !Name || !phoneNumber) {
        return res.status(400).json({ success: false, message: 'Username,email,Name and/or password must be filled out' });
    }

    try {
        // Check for existing user
        const user = await User.findOne({ username });

        if (user) return res.status(400).json({ success: false, message: 'Username already taken' });

        // All good
        const hashedPassword = await argon2.hash(password);
        const newUser = new User({ username, email, Name, phoneNumber, password: hashedPassword });
        await newUser.save();

        // Return token
        const accessToken = jwt.sign({ userId: newUser._id }, process.env.ACCESS_TOKEN_SECRET);

        res.json({
            success: true,
            message: 'User created successfully',
            accessToken,
            user: newUser,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

module.exports = RegisterController;
