import { req, res } from 'express'
import user from '../models/user';
import bcrypt from 'bcrypt'

//Controllers For User Registration
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        //Find user by email
        const user = await user.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' })
        }

        //Encrypt the password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({ name, email, password: hashedPassword })
        await newUser.save()

        //Setting User data in session
        req.session.isLoggedIn = true;
        req.session.userId = newUser._id;

        return res.json({
            message: 'Account created successfully',
            user: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,

            }
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message })
    }
}

//Controllers For User Login
export const loginUser = async (req, res) => {
    try {
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message })
    }
}