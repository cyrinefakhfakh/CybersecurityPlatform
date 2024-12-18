const express = require('express');
const mongoose = require('mongoose');
const courseRoutes = require('./routes/courseRoutes');
const authRoutes = require('./routes/authRoutes');
const Course = require('./models/Course');
const User = require('./models/User');
const auth = require('./middleware/auth');
const sendEmail = require('./utils/sendEmail');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());
app.use('/api/courses', courseRoutes);
app.use('/api/auth', authRoutes);

const mongoURI = process.env.MONGO_URI || 'mongodb+srv://sirinefakhfakh03:dukkS842523AsXSR@cluster0.nmpyr.mongodb.net/';
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Increase timeout to 5 seconds
};

mongoose.connect(mongoURI, options)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err.message));

  app.post('/api/enroll', auth, async (req, res) => {
    const { courseId } = req.body;
    
    console.log('===== ENROLLMENT DEBUG =====');
    console.log('Course ID:', courseId);
    console.log('User ID from token:', req.user.id);
    console.log('User Role:', req.user.role);
  
    if (!courseId) {
      return res.status(400).json({ message: 'Course ID is required.' });
    }
  
    try {
      // Find the course first
      const course = await Course.findById(courseId);
      if (!course) {
        console.log('Course not found:', courseId);
        return res.status(404).json({ message: 'Invalid course selected. Course not found.' });
      }
  
      // Find the user and explicitly log user details
      const user = await User.findById(req.user.id);
      if (!user) {
        console.error('User not found with ID:', req.user.id);
        return res.status(404).json({ message: 'User not found.' });
      }
  
      // Log current user document to inspect its structure
      console.log('User Document:', JSON.stringify(user, null, 2));
  
      // Ensure enrolledCourses is an array, initializing if not exists
      if (!user.enrolledCourses) {
        user.enrolledCourses = [];
      }
  
      // Check for existing enrollment with multiple comparison methods
      const isEnrolled = Array.isArray(user.enrolledCourses) 
        ? user.enrolledCourses.some(
            enrolledCourse => 
              enrolledCourse.toString() === courseId || 
              enrolledCourse === courseId
          )
        : false;
  
      if (isEnrolled) {
        return res.status(400).json({ message: 'You are already enrolled in this course.' });
      }
  
      // Add course to enrolled courses
      user.enrolledCourses.push(courseId);
      await user.save();
  
      res.status(200).json({ 
        success: true, 
        message: 'Enrolled successfully.',
        enrolledCourses: user.enrolledCourses
      });
  
    } catch (error) {
      console.error('Detailed Enrollment Error:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
        userId: req.user.id,
        courseId: courseId
      });
  
      res.status(500).json({
        message: 'Server error during enrollment',
        errorName: error.name,
        errorMessage: error.message
      });
    }
  });

  app.post('/api/send-verification-email', auth, async (req, res) => {
    const { email } = req.body;
  
    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }
  
    try {
      console.log('Verification Email Request Details:', {
        email,
        userId: req.user.id,
      });
  
      const emailSubject = 'Course Enrollment Confirmation';
      const emailText = `Hello,\n\nYou have successfully enrolled in your selected course. Please verify your email to complete the process.\n\nThank you.`;
      const emailHtml = `<p>Hello,</p><p>You have successfully enrolled in your selected course. Please verify your email to complete the process.</p><p>Thank you.</p>`;
  
      await sendEmail({ to: email, subject: emailSubject, text: emailText, html: emailHtml });
  
      res.status(200).json({ success: true, message: 'Verification email sent successfully.' });
    } catch (error) {
      console.error('Error sending verification email:', error);
      res.status(500).json({ 
        message: 'Failed to send verification email.', 
        errorName: error.name,
        errorMessage: error.message,
        stack: error.stack 
      });
    }
  });
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));