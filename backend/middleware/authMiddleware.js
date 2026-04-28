/**
 * =============================================================================
 * AUTHENTICATION MIDDLEWARE — middleware/authMiddleware.js
 * =============================================================================
 *
 * STUDENT DEFENSE NOTE:
 * This is a "Middleware" function. It acts as a security checkpoint before 
 * allowing a request to reach our protected routes (like adding a patient or 
 * viewing the dashboard).
 * 
 * How it works:
 * 1. It checks the "Authorization" header of the incoming HTTP request.
 * 2. It looks for a "Bearer token" (which was given to the user during login).
 * 3. It uses the jsonwebtoken library to verify that the token is valid, hasn't
 *    expired, and was created by our server.
 * 4. If valid, it attaches the decoded user data (id, role, name) to `req.user`
 *    and calls `next()` to let the request proceed to the main controller.
 * =============================================================================
 */

const jwt = require('jsonwebtoken');

exports.protect = (req, res, next) => {
    let token;

    // 1. Extract the token from the "Authorization" header
    // The standard format expected from the frontend is: "Bearer <token_string>"
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    // 2. If no token is found, block the request
    if (!token) {
        return res.status(401).json({ message: 'Not authorized to access this route. No token provided.' });
    }

    try {
        // 3. Verify the token using our secret key
        // This will throw an error if the token is invalid, tampered with, or expired.
        const decoded = jwt.verify(
            token, 
            process.env.JWT_SECRET || 'fallback_secret_key_for_development'
        );

        // 4. Attach the decoded user information to the request object
        // This makes `req.user` available in any controller that comes after this middleware.
        req.user = decoded;

        // 5. Proceed to the next middleware or the main controller
        next();
    } catch (error) {
        console.error('Token verification failed:', error.message);
        return res.status(401).json({ message: 'Not authorized. Token is invalid or expired.' });
    }
};
