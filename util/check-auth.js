const { AuthenticationError } = require('apollo-server-express');
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config');

module.exports = ({ req, connection }) => {

    if (connection) {
        return connection.context.user;
    }

    if (req.headers.authorization) {
        const token = req.headers.authorization.split(' ')[1];
        if (token) {
            try {
                const user = jwt.verify(token, SECRET_KEY);
                return user;
            } catch (err) {
                throw new AuthenticationError('Your session expired. Sign in again.');
            }
        }
        throw new Error('Authentication token must be \'Bearer [token]\'');
    }
    throw new Error('Authentication token must be provided');


};