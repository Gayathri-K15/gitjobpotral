import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum:['student','recruiter'],
        required:true
    },
    profile: {
        
        dob: { type: Date },  // Date of Birth
        address: { type: String }, // Address
        
        
        technicalSkills: [{ type: String }],  // Separate for technical skills
        certifications: [{ type: String }],  // List of certifications
        honours: { type: String },  // Honours achieved
        minors: { type: String },   // Minor specializations
        
        education: {
            level: { type: String },  // Education Level (e.g., BTech, MTech, etc.)
            institution: { type: String }, // Institution Name
            yearOfPassout: { type: Number }, // Year of Graduation
            cgpa: { type: Number } // CGPA Score
        },

        experience: [{
            company: { type: String }, // Company Name
            role: { type: String }, // Job Role
            years: { type: Number } // Years of experience
        }],

        
        

        company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' }, 
        
        profilePhoto: { type: String, default: "" }
    }
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);