const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { SECRET_KEY } = require('../../config')
const User = require('../../models/User');
const { UserInputError } = require('apollo-server')
const {validateRegisterInput, validateLoginInput} = require('../../util/validators')

function generateToken(user) {
    return jwt.sign({
        id: user.id,
        email: user.email,
        username: user.username,
    },
    SECRET_KEY,
    {
        expiresIn: '1h'
    });
}



module.exports = {
    Mutation: {
        async login(_, {username, password}) {

            const {errors, valid} = validateLoginInput(username, password);
            if(!valid) {
                throw new UserInputError('Errors', {errors})
            }

            const user = await User.findOne({username});
            if(!user) {
                errors.general = 'User not found';
                throw new UserInputError('Invalid credentials', {errors});
                }

            const isMatch = await bcrypt.compare(password, user.password);
            if(!isMatch) {
                errors.general = 'Invalid credentials';
                throw new UserInputError('Invalid credentials', {errors});
            }
            const token = generateToken(user);
            return {    
                ...user._doc,
                id: user._id,
                token
            };
        },

        async register(_, { registerInput: { username, email, password, confirmPassword } }) {
            //TODO validate user data
            //TODO make sure user doesn't already exist
            const { valid, errors } = validateRegisterInput(username, email, password, confirmPassword);
            if (!valid) {
                throw new UserInputError('Errors', { errors })
            }
            //TODO hash password and create an auth token
            const user = await User.findOne({ username });
            if (user) {
                throw new UserInputError('username is taken', {
                    errors: {
                        username: 'This username is taken'
                    }
                });
            }
            password = await bcrypt.hash(password, 12);

            const newUser = new User({
                email,
                username,
                password,
                createdAt: new Date().toISOString()
            });

            const res = await newUser.save();

            const token = generateToken(res);

            return {
                ...res._doc,
                id: res._id,
                token

            }
        }
    }
}