import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;
         
        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };
        const file = req.file;
        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: 'User already exist with this email.',
                success: false,
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            profile:{
                profilePhoto:cloudResponse.secure_url,
            }
        });

        return res.status(201).json({
            message: "Account created successfully.",
            success: true
        });
    } catch (error) {
        console.log(error);
    }
}
export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        
        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            })
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            })
        };
        // check role is correct or not
        if (role !== user.role) {
            return res.status(400).json({
                message: "Account doesn't exist with current role.",
                success: false
            })
        };

        const tokenData = {
            userId: user._id
        }
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpsOnly: true, sameSite: 'strict' }).json({
            message: `Welcome back ${user.fullname}`,
            user,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully.",
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
export const updateProfile = async (req, res) => {
    try {
        const {
            fullname, email, phoneNumber, bio, skills, dob, address,
            experience, educationLevel, institution, yearOfPassout, cgpa,
            technicalSkills, certifications, honours, minors
        } = req.body;
        
        
        
        

        let skillsArray = skills ? skills.split(",") : [];
        let technicalSkillsArray = technicalSkills ? technicalSkills.split(",") : [];
        let certificationsArray = certifications ? certifications.split(",") : [];
        let experienceArray = experience ? JSON.parse(experience) : [];

        const userId = req.id; // middleware authentication
        let user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({
                message: "User not found.",
                success: false
            });
        }

        // Updating user fields
        if (fullname) user.fullname = fullname;
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (dob) user.profile.dob = dob;
        if (address) user.profile.address = address;
        
        if (technicalSkills) user.profile.technicalSkills = technicalSkillsArray;
        if (certifications) user.profile.certifications = certificationsArray;
        if (honours) user.profile.honours = honours;
        if (minors) user.profile.minors = minors;

        if (!Array.isArray(experienceArray)) {
            try {
                experienceArray = JSON.parse(req.body.experience);
                if (!Array.isArray(experienceArray)) {
                    throw new Error("Parsed experience is not an array");
                }
            } catch (error) {
                console.log("Error parsing experience:", error);
                experienceArray = []; // Default to empty array
            }
        }
        
        console.log("Final experience array:", experienceArray);
        
        const processedExperience = experienceArray.map(exp => ({
            company: exp.company || "",
            role: exp.role || "",
            duration: exp.duration || ""
        }));
        

        // Updating education
        if (educationLevel) user.profile.education.level = educationLevel;
        if (institution) user.profile.education.institution = institution;
        if (yearOfPassout) user.profile.education.yearOfPassout = yearOfPassout;
        if (cgpa) user.profile.education.cgpa = cgpa;

        // Resume Upload
        

        await user.save();

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        };

        return res.status(200).json({
            message: "Profile updated successfully.",
            user,
            success: true
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
};
