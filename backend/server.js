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
const PDFDocument = require('pdfkit');
const fs = require('fs');
const fsPromises = require('fs').promises; 
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const app = express();
app.use(express.json());
app.use(cors());
app.use('/api/courses', courseRoutes);
app.use('/api/auth', authRoutes);

const mongoURI = process.env.MONGO_URI || 'mongodb+srv://sirinefakhfakh03:dukkS842523AsXSR@cluster0.nmpyr.mongodb.net/';
const options = {
  serverSelectionTimeoutMS: 5000, // Increase timeout to 5 seconds
};
app.post('/refresh-token', async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token is required' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newToken = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ token: newToken });
  } catch (error) {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
});
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

const path = require('path');
const tempDir = path.resolve(process.cwd(), 'temp');

async function ensureTempDir() {
  try {
    await fsPromises.access(tempDir);
  } catch {
    await fsPromises.mkdir(tempDir, { recursive: true });
    console.log('Created temp directory at:', tempDir);
  }
}

async function generateCertificate(user, courseName, grade, filePath) {
  return new Promise((resolve, reject) => {
    console.log('Starting certificate generation for:', {
      userName: user.name,
      courseName,
      grade,
      filePath
    });

    const doc = new PDFDocument({
      layout: 'landscape',
      size: 'A4',
      margin: 50,
      info: {
        Title: 'Course Completion Certificate',
        Author: 'Cyber Platform'
      }
    });

    const writeStream = fs.createWriteStream(filePath);
    writeStream.on('error', (err) => {
      console.error('Write stream error:', err);
      reject(err);
    });
    writeStream.on('finish', () => {
      console.log('PDF generation completed');
      resolve();
    });

    doc.pipe(writeStream);

    try {
      // Gradient background
      const gradient = doc.linearGradient(0, 0, doc.page.width, doc.page.height);
      gradient.stop(0, '#e6f3ff')  // Light blue
             .stop(1, '#ffffff');   // White
      doc.rect(0, 0, doc.page.width, doc.page.height)
         .fill(gradient);

      // Decorative border with double lines
      const margin = 30;
      // Outer border
      doc.rect(margin, margin, doc.page.width - margin * 2, doc.page.height - margin * 2)
         .lineWidth(3)
         .stroke('#1a4d80');  // Dark blue
      // Inner border
      doc.rect(margin + 10, margin + 10, doc.page.width - (margin + 10) * 2, doc.page.height - (margin + 10) * 2)
         .lineWidth(1)
         .stroke('#1a4d80');

      // Certificate header
      doc.rect(0, 70, doc.page.width, 80)
         .fill('#1a4d80');

      // Main title
      doc.font('Helvetica-Bold')
         .fontSize(44)
         .fillColor('#ffffff')
         .text('Certificate of Completion', {
           align: 'center',
           y: 90
         });

      // Decorative line under title
      doc.moveTo(doc.page.width * 0.3, 160)
         .lineTo(doc.page.width * 0.7, 160)
         .lineWidth(2)
         .stroke('#1a4d80');

      // Main content
      doc.fillColor('#1a4d80');
      doc.font('Helvetica')
         .fontSize(24)
         .text('This is to certify that', {
           align: 'center',
           y: 190
         });

      // Student name with decorative underline
      doc.font('Helvetica-Bold')
         .fontSize(36)
         .text(user.name || 'Student', {
           align: 'center',
           y: 230
         });

      // Course completion text
      doc.font('Helvetica')
         .fontSize(24)
         .text('has successfully completed the course', {
           align: 'center',
           y: 290
         });

      // Course name with background highlight
      doc.rect(doc.page.width * 0.2, 330, doc.page.width * 0.6, 60)
         .fill('#e6f3ff');
      doc.font('Helvetica-Bold')
         .fontSize(32)
         .text(courseName, {
           align: 'center',
           y: 345
         });

      // Grade
      doc.font('Helvetica')
         .fontSize(24)
         .text(`with a grade of ${grade}%`, {
           align: 'center',
           y: 410
         });

      // Date with decorative elements
      const dateText = `Awarded on ${new Date().toLocaleDateString()}`;
      doc.fontSize(18)
         .text(dateText, {
           align: 'center',
           y: 470
         });

      // Platform signature with seal effect
      doc.circle(doc.page.width - 150, doc.page.height - 100, 40)
         .lineWidth(2)
         .stroke('#1a4d80');
      doc.font('Helvetica-Bold')
         .fontSize(16)
         .text('Cyber Platform', {
           align: 'right',
           y: doc.page.height - 90,
           x: -180
         });

      console.log('Finishing PDF generation');
      doc.end();
    } catch (error) {
      console.error('Error during PDF generation:', error);
      reject(error);
    }
  });
}

// Updated email sending function with promise-based fs operations
async function sendCertificateEmail(email, filePath, courseName, grade) {
  // Verify file exists and has content using promises
  try {
    const stats = await fsPromises.stat(filePath);
    if (stats.size === 0) {
      throw new Error('Generated PDF is empty');
    }

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: `"${process.env.EMAIL_SENDER_NAME}" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your Course Completion Certificate',
      text: `Congratulations on completing ${courseName} with a grade of ${grade}%!`,
      html: `
        <h1>Congratulations!</h1>
        <p>You have successfully completed <strong>${courseName}</strong> with a grade of <strong>${grade}%</strong>!</p>
        <p>Your certificate is attached to this email.</p>
        <p>Best regards,<br>Cyber Platform Team</p>
      `,
      attachments: [{
        filename: 'certificate.pdf',
        path: filePath,
        contentType: 'application/pdf'
      }]
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error in sendCertificateEmail:', error);
    throw error;  // Re-throw to be handled by the calling function
  }
}

function validateEmailConfig() {
  const requiredEnvVars = [
    'EMAIL_HOST',
    'EMAIL_PORT',
    'EMAIL_USER',
    'EMAIL_PASS',
    'EMAIL_SENDER_NAME'
  ];
  
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  if (missingVars.length > 0) {
    throw new Error(`Missing required email configuration: ${missingVars.join(', ')}`);
  }
}

app.post('/api/generate-certificate', auth, async (req, res) => {
  const { courseName, grade, email } = req.body;
  let filePath = null;

  try {
    validateEmailConfig();

    if (!courseName || !grade || !email) {
      return res.status(400).json({
        message: 'Missing required fields: courseName, grade, and email are required'
      });
    }

    await ensureTempDir();

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const fileName = `certificate-${user._id}-${Date.now()}.pdf`;
    filePath = path.join(tempDir, fileName);
    console.log('Generating certificate at:', filePath);

    await generateCertificate(user, courseName, grade, filePath);
    
    // Send email with certificate
    await sendCertificateEmail(email, filePath, courseName, grade);
    
    res.status(200).json({
      success: true,
      message: 'Certificate generated and sent successfully'
    });

  } catch (error) {
    console.error('Certificate generation/sending error:', {
      error: error.message,
      stack: error.stack,
      userId: req.user?.id,
      email: email
    });

    res.status(500).json({
      message: 'Failed to process certificate',
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });

  } finally {
    if (filePath) {
      try {
        await fsPromises.unlink(filePath);
        console.log('Temporary file cleaned up:', filePath);
      } catch (err) {
        console.error('Error cleaning up temporary file:', err);
      }
    }
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


  mongoose.connect(mongoURI, options)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err.message));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});