import { User } from "../models/user.model.js"
import bcrypt from "bcryptjs"
import { generateToken } from "../utils/generateToken.js";
import { deleteMediaFromCloudinary, uploadMedia } from "../utils/cloudinary.js";
import jwt from 'jsonwebtoken'
import nodemailer from "nodemailer";

export const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password || !role) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            })
        }
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                success: false,
                message: "User with this email already exists."
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        await User.create({
            name,
            email,
            password: hashedPassword,
            role
        });
        return res.status(201).json({
            success: true,
            message: "Account created succesfully"
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to register"
        })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Both fields are required."
            })
        }
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(500).json({
                success: false,
                message: "incorrect email or password"
            })
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password)
        if (!isPasswordMatch) {
            return res.status(500).json({
                success: false,
                message: "incorrect email or password"
            })
        }
        generateToken(res, user, `Welcome back ${user.name}`)
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to login"
        })
    }
}

// Route to request password reset
export const forgotPassword = async (req, res) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });
  
      if (!user) return res.status(404).json({ message: "No user found with this email." });
  
      const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });
  
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
  
      const resetLink = `http://localhost:5173/reset-password/${resetToken}`;
  
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Reset Your Password",
        html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link expires in 15 minutes.</p>`,
      });
  
      return res.status(200).json({ message: "Password reset email sent." });
    } catch (error) {
      console.error("Forgot Password Error:", error);
      return res.status(500).json({ message: "Server error", error: error.message });
    }
  };


export const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        console.log("Token param:", req.params.token);
        console.log("Body:", req.body);
        if (!user) return res.status(400).json({ message: "Invalid token." });
        
        const hashed = await bcrypt.hash(newPassword, 10);
        user.password = hashed;
        await user.save();


        return res.status(200).json({ message: "Password updated successfully." });
    } catch (err) {
        return res.status(400).json({ message: "Reset link expired or invalid." });
    }
};


export const logout = async (_,res) => {
    try {
        return res.status(200).cookie("token", "", {maxAge:0}).json({
            message:"Logged out successfully.",
            success:true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Failed to logout"
        }) 
    }
}

export const getUserProfile = async (req, res) => {
    try {
        const userId = req.id
        const user = await User.findById(userId)
        .select("-password")
        .populate({
          path: "enrolledCourses",
          populate: {
            path: "creator",
            select: "name photoUrl",
          },
        });
              if (!user) {
            return res.satus(404).json({
                success: false,
                message: "Profile not found"
            })
        }
        return res.status(200).json({
            success: true,
            user
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to load user"
        })
    }
}

export const updateProfile = async (req, res) => {
    try {
      const userId = req.id;
      const { name } = req.body;
      const profilePhoto = req.file;
  
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          message: "User not found",
          success: false
        });
      }
  
      let updatedData = { name };
  
      // If a new photo is uploaded
      if (profilePhoto) {
        // Delete old photo if it exists
        if (user.photoUrl) {
          const publicId = user.photoUrl.split("/").pop().split(".")[0];
          await deleteMediaFromCloudinary(publicId);
        }
  
        // Upload new photo
        const cloudResponse = await uploadMedia(profilePhoto.path);
        updatedData.photoUrl = cloudResponse.secure_url;
      }
  
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        updatedData,
        { new: true }
      ).select("-password");
  
      return res.status(200).json({
        success: true,
        user: updatedUser,
        message: "Profile updated successfully."
      });
  
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Failed to update profile"
      });
    }
  };
  