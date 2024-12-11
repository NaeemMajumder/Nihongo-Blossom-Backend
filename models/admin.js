// Admin model
const mongoose = require('mongoose');


const adminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    adminStatus: {
        type: Boolean,
        default: true // Default value is true for admin
    }
});

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
