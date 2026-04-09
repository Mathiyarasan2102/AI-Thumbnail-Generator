import User from '../models/user.js';
import bcrypt from 'bcrypt'

//Controllers For User Registration
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        //Find user by email
        const existingUser = await User.findOne({ email });
        if (existingUser) {
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
        const { email, password } = req.body;

        //Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'Invalid credentials' })
        }

        //Setting User data in session
        req.session.isLoggedIn = true;
        req.session.userId = user._id;

        return res.json({
            message: 'Login successful',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,

            }
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message })
    }
}

//controllers For User Logout
export const logoutUser = async (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: err.message });
        }

    })
    return res.json({ message: 'Logout successful' });
}

//controllers for user verify 
export const verifyUser = async (req, res) => {
    try {
        const { userId } = req.session;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' })
        }
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'Invalid user' })
        }
        return res.json({ message: 'User verified', user });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message })
    }
}