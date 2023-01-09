const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            unique: true,
        },
        Name: {
            type: String,
        },
        phoneNumber: {
            type: String,
        },
        typeUser: {
            type: String,
            enum: ['Inland', 'Foreign'],
            default: 'Inland',
        },
        CMND: {
            type: String,
            default: '',
        },
        address: {
            type: String,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true },
);

module.exports = User = mongoose.model('users', UserSchema);
