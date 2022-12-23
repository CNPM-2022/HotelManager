import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';

// @desc    Change information of user
// @route   PUT /api/user/change-info
// @access  Private

const changeInfo = asyncHandler(async (req, res) => {
    const { username, email, Name, phoneNumber, CMND, address, typeUser, isAdmin } = req.body;
    const id = req.params.id;

    if (!username && !email && !Name && !CMND && !address && !typeUser && !isAdmin) {
        res.status(400);
        throw new Error('Please fill one of the fields');
    }

    try {
        const user = await User.findById(id);
        if (user) {
            user.username = username;
            user.email = email;
            user.Name = Name;
            user.phoneNumber = phoneNumber;
            user.CMND = CMND;
            user.address = address;
            user.typeUser = typeUser;
            if (isAdmin == undefined) {
                user.isAdmin = user.isAdmin;
            } else {
                user.isAdmin = isAdmin;
            }
        }

        const updatedUser = await user.save();

        if (updatedUser) {
            res.status(200).json({
                success: true,
                message: 'User updated successfully',
                updatedUser,
            });
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @desc    Change information of user by user
// @route   PUT /api/user/change-info/all
// @access  Private

const changeInfoAll = asyncHandler(async (req, res) => {
    const { username, email, Name, phoneNumber, CMND, address, isAdmin, password, newPassword, typeUser } = req.body;
    const id = req.params.id;

    try {
        const user = await User.findById(id);
        const isMatch = await argon2.verify(user.password, password);
        const newHashedPassword = await argon2.hash(newPassword);

        if (!isMatch) {
            res.status(400);
            throw new Error('Password is incorrect');
        }

        if (user) {
            user.username = username;
            user.email = email;
            user.Name = Name;
            user.phoneNumber = phoneNumber;
            user.CMND = CMND;
            user.address = address;
            user.isAdmin = isAdmin;
            user.password = newHashedPassword;
            user.typeUser = typeUser;
        }
        const updatedUser = await user.save();
        const accessToken = jwt.sign({ userId: updatedUser._id }, process.env.ACCESS_TOKEN_SECRET);
        if (updatedUser) {
            res.status(200).json({
                success: true,
                message: 'User updated successfully',
                updatedUser,
                accessToken,
            });
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// @desc    Change password of user
// @route   PUT /api/user/change-password
// @access  Private

const changePassword = async (req, res) => {
    const { password, newPassword } = req.body;
    const id = req.params.id;

    if (!password && !newPassword) {
        res.status(400);
        throw new Error('Please fill one of the fields');
    }
    try {
        const user = await User.findById(id);
        const isMatch = await argon2.verify(user.password, password);
        const newHashedPassword = await argon2.hash(newPassword);
        if (user) {
            if (isMatch) {
                user.password = newHashedPassword;
            } else {
                res.status(400);
                throw new Error('Password is incorrect');
            }
        }
        const updatedUser = await user.save();
        const accessToken = jwt.sign({ userId: updatedUser._id }, process.env.ACCESS_TOKEN_SECRET);
        if (updatedUser) {
            res.status(200).json({
                success: true,
                message: 'Password changed successfully',
                updatedUser,
                accessToken,
            });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc   Get all users
// @route   GET /api/users
// @access  Private

const getUsers = asyncHandler(async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json({ success: true, lenghtOfUsers: users.length, users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @desc   Get users with pagination
// @route   GET /api/users/pagination
// @access  Private
const getUsersWithPagination = asyncHandler(async (req, res) => {
    const { page, limit } = req.params;
    try {
        const startIndex = (Number(page) - 1) * Number(limit);
        const endIndex = Number(page) * Number(limit);
        const results = {};

        if (endIndex < (await User.countDocuments().exec())) {
            results.next = {
                page: Number(page) + 1,
                limit: Number(limit),
            };
        }

        if (startIndex > 0) {
            results.previous = {
                page: Number(page) - 1,
                limit: Number(limit),
            };
        }

        results.results = await User.find().limit(Number(limit)).skip(startIndex).exec();
        const lengthOfAllUsers = await User.countDocuments().exec();
        res.status(200).json({
            success: true,
            message: 'Get users with pagination success',
            lenghtOfUsers: results.results.length,
            lengthOfAllUsers: lengthOfAllUsers,
            results,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @desc   add new user
// @route   POST /api/users
// @access  Private
const addUser = asyncHandler(async (req, res) => {
    const { username, email, password, Name, phoneNumber, CMND, address, isAdmin, typeUser } = req.body;
    if (!username || !email || !password || !Name || !CMND || !address || !phoneNumber || !typeUser) {
        res.status(400);
        throw new Error('Please fill all the fields');
    }
    try {
        const username_db = await User.findOne({ username });
        if (username_db) {
            res.status(400);
            throw new Error('User already exists');
        }
        const hashedPassword = await argon2.hash(password);
        const newUser = new User({
            username: username,
            email,
            password: hashedPassword,
            Name,
            phoneNumber,
            CMND,
            address,
            isAdmin,
            typeUser,
        });
        const user = await newUser.save();
        if (user) {
            res.status(200).json({ success: true, message: 'User created successfully', user });
        } else {
            res.status(400);
            throw new Error('Invalid user data');
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @desc   Get user by id
// @route   GET /api/users/:id
// @access  Private
const getUserById = asyncHandler(async (req, res) => {
    const id = req.params.id;
    try {
        const user = await User.findById(id);
        if (user) {
            res.status(200).json({ success: true, user });
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @desc    delete user
// @route   DELETE /api/user/delete
// @access  Private

const deleteUser = asyncHandler(async (req, res) => {
    const id = req.params.id;
    try {
        const user = await User.findById(id);
        if (user) {
            await user.remove();
            res.status(200).json({ success: true, message: 'User deleted successfully' });
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export {
    changeInfo,
    changeInfoAll,
    changePassword,
    getUsers,
    getUsersWithPagination,
    addUser,
    getUserById,
    deleteUser,
};
