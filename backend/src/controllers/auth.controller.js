const userService = require('../services/user.service');
const { hashPassword, comparePassword } = require('../utils/hash');
const { generateToken } = require('../config/jwt');
const { successResponse, errorResponse } = require('../utils/response');

// REGISTER
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // 1. Validation
        if (!name || !email || !password) {
            return errorResponse(res, 'All fields are required', 400);
        }

        // 2. Check if user already exists
        const existingUser = await userService.findUserByEmail(email);
        if (existingUser) {
            return errorResponse(res, 'Email already registered', 400);
        }

        // 3. Hash password
        const hashedPassword = await hashPassword(password);

        // 4. Create User (Default role 'user')
        const newUser = await userService.createUser({
            name,
            email,
            password: hashedPassword,
            role: 'user' // Default to 'user', admin must be set manually in DB for safety in this test
        });

        // 5. Generate Token
        // Exclude password from token payload
        const userForToken = { id: newUser.id, email: newUser.email, role: newUser.role };
        const token = generateToken(userForToken);

        // 6. Response
        return successResponse(res, { user: userForToken, token }, 'Registration successful', 201);

    } catch (error) {
        return errorResponse(res, 'Registration failed', 500, error);
    }
};

// LOGIN
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Validation
        if (!email || !password) {
            return errorResponse(res, 'Email and password are required', 400);
        }

        // 2. Find User
        const user = await userService.findUserByEmail(email);
        if (!user) {
            return errorResponse(res, 'Invalid credentials', 401); 
        }

        // 3. Verify Password
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            return errorResponse(res, 'Invalid credentials', 401);
        }

        // 4. Generate Token
        const userForToken = { id: user.id, email: user.email, role: user.role };
        const token = generateToken(userForToken);

        // 5. Response
        return successResponse(res, { user: userForToken, token }, 'Login successful');

    } catch (error) {
        return errorResponse(res, 'Login failed', 500, error);
    }
};

module.exports = {
    register,
    login
};
