// src/app.js
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import doctorRoutes from './routes/doctorRoutes.js';
import patientRoutes from './routes/patientRoutes.js';
import { securityHeaders } from './middlewares/security.js';

// تحميل متغيرات البيئة
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());
app.use(securityHeaders);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/patients', patientRoutes);












// إضافة هذا السطر لتقديم الملفات الثابتة من مجلد uploads
app.use('/uploads', express.static('uploads'));



// Server start
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});