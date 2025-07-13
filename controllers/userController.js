const { default: axios } = require('axios');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/UserModelSchema');
const NEWS_API_KEY = 'a96838d0835c4e2587a6fd622093a6ec';
const NEWS_API = 'https://newsapi.org/v2/top-headlines';


const registerUser = async (req, res) => {

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const { email, password, preferences } = req.body;

    if (!email || !password || preferences.length == 0) {
        throw Object.assign(new Error('Please provide email, password and news preferences'), { status: 400 });
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
        throw Object.assign(new Error('User already exists'), { status: 400 });
    }

    if (!emailRegex.test(email)) {
        throw Object.assign(new Error('Invalid email format'), { status: 400 });
    }

    if (password.length <= 7) {
        throw Object.assign(new Error('Password should have atleast 8 characters'), { status: 400 })
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
        email,
        password: hashedPassword,
        preferences
    });

    await newUser.save();

    return res.status(201).json({
        msg: 'User registered successfully',
        email,
        hashedPassword,
        preferences
    });
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw Object.assign(new Error('Please provide email and password'), { status: 400 });
    }

    const user = await User.findOne({ email })
    if (!user && !user.password) {
        throw Object.assign(new Error('Invalid credentials'), { status: 400 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw Object.assign(new Error('Invalid credentials'), { status: 400 });
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' })
    return res.json({  msg: 'User loggen in successfully',token, email })
};

const getPreferences = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email })
    if (!user) {
        throw Object.assign(new Error('Invalid credentials'), { status: 400 });
    }
    const preferences = await user.preferences;
    return res.status(201).json({
        msg: 'User preferences',
        preferences,
    })
};

const updatePreferences = async (req, res) => {
    const { email } = req.user;
    const { newPreferences } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        throw Object.assign(new Error('Invalid credentials'), { status: 400 });
    }
    const updatedUser = await user.updateOne({ preferences: newPreferences });
    if(!updatedUser) {
        throw Object.assign(new Error('User not updated', {status: 400}))
    }
    return res.status(201).json({
        msg:"user preferences updated",
        newPreferences,
    })
};

const getNews = async (req, res) => {
    const { email } = req.user;

    const user = await User.findOne({ email });
    if (!user) {
        throw Object.assign(new Error('Invalid credentials'), { status: 400 });
    }
    const preferences =  user.preferences;
    const newsPromises =  preferences.map(category =>
        axios.get(NEWS_API, {
            params: {
                category,
                country: 'us',
                apiKey: NEWS_API_KEY,
            }
        })
    );
    const responses = await Promise.all(newsPromises);
    const articles = responses.flatMap(r => r.data.articles);
    return res.status(200).json({ email, preferences, articles });
};


module.exports = { registerUser, loginUser, getPreferences, updatePreferences, getNews };