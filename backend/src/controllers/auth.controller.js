import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";
import generateToken from "../lib/utils.js";

export const signup = async (req, res) => {
    const { fullName , email , password } = req.body;
    try {
        if(!fullName || !email || !password) res.status(400).json({ error : "All field must be filled" });
        if(password.length < 6) res.status(400).json({ error : "Password must be atleast 6 characters"});
        
        const user = await User.findOne({email});
        if(user) res.status(400).json({ error : "User with email already exist" });

        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = bcrypt.hashSync(password , salt);
        
        const newUser = new User({
            fullName , 
            email ,
            password : hashedPassword
        });

        if(newUser) {
            // generate jwt token
            generateToken(newUser._id , res);
            await newUser.save();
            res.status(201).json({ 
                message : "User created successfully" ,
                _id : newUser._id ,
                fullName : newUser.fullName ,
                email : newUser.email ,
                profilePic : newUser.profilePic
            });
        }
        else res.status(400).json({ error : "Invalid user details" });

    } catch(error) {
        res.status(500).json({ error : "Internal server error" });
    }
};

export const login = async (req, res) => {
    const { email , password } = req.body;
    try {
        const user = await User.findOne({ email });
        if(!user) res.status(400).json({ error : "invalid credentials" });

        const isPasswordCorrect = bcrypt.compareSync(password , user.password);

        if(!isPasswordCorrect) res.status(400).json({ error : "invalid credentials" });

        generateToken(user._id , res);
        res.status(200).json({ 
            _id : user._id ,
            fullName : user.fullName ,
            email : user.email ,
            profilePic : user.profilePic
        });
    } catch (error) {
        res.status(500).json({ error : "internal server error" });  
    }
};

export const logout = (req, res) => {
    try {
        res.cookie("jwt" , "" , { maxAge : 0 });
        res.status(200).json({ message : "logged out successfully" });
    } catch (error) {
        res.status(500).json({ error : "internal server error" });
    }
};

export const updateProfile = async (req , res) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user._id;
        
        if(!profilePic) res.status(400).json({ message : "profile picture is required" });

        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await User.findByIdAndUpdate(userId , {profilePic : uploadResponse.secure_url} , {new : true});

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message : "internal server error" });
    }
}

export const checkAuth = async (req , res) => {
    try {
        res.status(200).json(req.user); 
    } catch (error) {
        res.status(500).json({ message : "internal server error" });
    }
}