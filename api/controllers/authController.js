import User from '../models/userModel.js'
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;

    if(
        !username || !email || !password 
        || 
        username === '' || email === '' || password === ''
    ) {
        next(errorHandler(400, 'All fields are required'))
    }
    
    const hashedPassword = bcryptjs.hashSync(password, 10);
   
    const newUser = new User({ username, email, password: hashedPassword });

        try {
            await newUser.save();
            res.status(200).json('Sign up successful')
        } catch (error) {
            next(error);
        }

}

export const signin = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password || email === '' || password === '') {
        next(errorHandler (400, 'All fields are required'));
    }

    try {
        const validUser = await User.findOne({ email });
        if(!validUser) {
            next(errorHandler(404, 'User not found'));
        }
        // bcrypt.js convert the password to hashed then compare it with the Hashed Password
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if(!validPassword) {
            next(errorHandler(400, 'Invalid password'));
        }
        
        const token = jwt.sign(
            {id:validUser._id},
            process.env.JWT_SECRET,
            { expiresIn: '1hr'}
        )
        res.status(200).cookie('access_token', token, 
            { 
                httpOnly: true,
            }).json('Signin Successful');

    } catch (error) {
        next(error);
    }

}