const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: true
        },

        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user"
        },

        profilePicture: {
            type: String,
            default: ""
        },

        isActive: {
            type: Boolean,
            default: true
        },

        isEmailVerified: {
            type: Boolean,
            default: false
        },

        lastLogin: {
            type: Date
        }
    },
    {
        timestamps: true
    }
);

userSchema.pre("save", async function () {
    if(!this.isModified("password")){
        return ;
    }
    this.password = await bcrypt.hash(this.password, 10);
});
userSchema.methods.comparePassword = async function (password) {return await bcrypt.compare(password, this.password);
    }
const User = mongoose.model("User", userSchema);

module.exports = User;