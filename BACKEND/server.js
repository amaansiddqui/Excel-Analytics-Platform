import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import 'dotenv/config'; // or require('dotenv').config(); if using CommonJS
import authRoutes from './routes/authRoutes.js';
import dashboardRoutes from './routes/dashboard.js';
import fileRoutes from './routes/fileRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import superAdminRoutes from './routes/superAdminRoutes.js';
import insightsRouter from './routes/insights.js';

dotenv.config();

console.log("MONGO_URI:", process.env.MONGO_URI);
console.log('SENDGRID_API_KEY:', process.env.SENDGRID_API_KEY);

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log("MongoDB connected");
  app.listen(process.env.PORT || 5000, () =>
    console.log(`Server started on port ${process.env.PORT || 5000}`)
  );
})
.catch(err => console.log("MongoDB connection error:", err));


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/user', userRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/insights', insightsRouter);
app.use('/', fileRoutes);

