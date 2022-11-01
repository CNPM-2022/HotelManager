const argon2 = require('argon2');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

// @route   POST api/auth/login
// @desc    login user
// @access  Public

const LoginController = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password)
        return res.status(400).json({ success: false, message: 'Please fill out username or password' });

    try {
        // Check for existing user
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ success: false, message: 'Incorrect username or password' });
        }
        const passwordValid = await argon2.verify(user.password, password);
        if (!passwordValid)
            return res.status(400).json({
                success: false,
                message: 'Incorrect username or password',
            });

        // All good
        const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET);

        res.json({
            success: true,
            message: 'User logged in successfully',
            accessToken,
            user: {
                id: user._id,
                username: user.username,
                isAdmin: user.isAdmin,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

module.exports = LoginController;
