import { registerUser } from './controllers/authController.js';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
dotenv.config();

// Connect DB
await connectDB();

const req = {
  body: {
    name: 'Test Registration User',
    email: `tester_${Date.now()}@example.com`,
    password: 'password123',
  },
  protocol: 'http',
  get: (header) => {
    if (header === 'host') return 'localhost:5000';
    return '';
  },
};

const res = {
  statusCode: 200,
  status: (code) => {
    res.statusCode = code;
    console.log('API RESPONSE STATUS:', code);
    return res;
  },
  json: (data) => {
    console.log('API RESPONSE JSON:', data);
    mongoose.connection.close();
    process.exit(0);
  },
};

console.log('Executing test user registration request...');
try {
  await registerUser(req, res);
} catch (error) {
  console.error('CRITICAL CONTROLLER ERROR:', error);
  mongoose.connection.close();
  process.exit(1);
}
