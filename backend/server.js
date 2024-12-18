const express = require('express');
const mongoose = require('mongoose');
const courseRoutes = require('./routes/courseRoutes');
const authRoutes = require('./routes/authRoutes');
const Course = require('./models/Course');
const User = require('./models/User');
const auth = require('./middleware/auth');
const app = express();
app.use(express.json());
mongoose.connect(process.env.MONGO_URI, {})
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));
app.use('/api/courses', courseRoutes);
app.use('/api/auth', authRoutes);
app.post('/api/enroll', auth, async (req, res) => {
  const { courseId } = req.body;
  if (!courseId) {
    return res.status(400).json({ message: 'Course ID is required.' });
  }
  try {
    console.log('Enrollment Request Details:');
    console.log('Course ID:', courseId);
    console.log('User ID from token:', req.user?.id);  // Add this line to debug

    const course = await Course.findById(courseId);
    if (!course) {
      console.log('Course not found:', courseId);
      return res.status(404).json({ message: 'Invalid course selected. Course not found.' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      console.log('User not found:', req.user.id);
      return res.status(404).json({ message: 'User not found.' });
    }

    if (user.enrolledCourses.includes(courseId)) {
      return res.status(400).json({ message: 'You are already enrolled in this course.' });
    }

    user.enrolledCourses.push(courseId);
    await user.save();
    res.status(200).json({ success: true, message: 'Enrolled successfully.' });
  } catch (error) {
    console.error('Detailed Enrollment Error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      errorName: error.name,
      errorMessage: error.message,
      stack: error.stack 
    });
  }
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));