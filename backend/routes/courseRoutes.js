const express = require('express');
const mongoose = require('mongoose'); // Add this import
const { body, validationResult } = require('express-validator');
const Course = require('../models/Course');
const router = express.Router();

// GET all courses
router.get('/', async (req, res) => {
  try {
    console.log('Fetching courses...');
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error.message);
    res.status(500).json({ message: 'Failed to fetch courses', error: error.message });
  }
});

// POST new course
router.post(
  '/add',
  [
    body('title').notEmpty().withMessage('Course title is required'),
    body('description').notEmpty().withMessage('Course description is required'),
    body('instructor').notEmpty().withMessage('Instructor name is required'),
    body('category').notEmpty().withMessage('Category is required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('duration').isInt({ min: 1 }).withMessage('Duration must be at least 1'),
    body('level')
      .isIn(['Beginner', 'Intermediate', 'Advanced', 'Expert'])
      .withMessage('Level must be one of Beginner, Intermediate, Advanced, or Expert'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      console.log('Request body:', req.body);
      const newCourse = new Course(req.body);
      await newCourse.save();
      res.status(201).json({ message: 'Course added successfully', course: newCourse });
    } catch (error) {
      console.error('Error saving course:', error.message);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

// DELETE course
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid course ID.' });
    }

    // Find and delete the course
    const course = await Course.findByIdAndDelete(id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    res.status(200).json({ message: 'Course deleted successfully.', course });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
});

module.exports = router;