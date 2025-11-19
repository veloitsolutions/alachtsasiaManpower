import asyncHandler from 'express-async-handler';
import Manpower from '../models/manpower.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @desc    Fetch all manpower with optional filters
// @route   GET /api/manpower
// @access  Public
const getManpower = asyncHandler(async (req, res) => {
  const {
    workerCategory,
    type,
    nationality,
    gender,
    jobTitle,
    occupation,
    maritalStatus,
    minAge,
    maxAge,
    search,
  } = req.query;

  let query = {};

  if (workerCategory) query.workerCategory = workerCategory;
  if (type) query.type = type; // Legacy support
  if (nationality) query.nationality = nationality;
  if (gender) query.gender = gender;
  if (jobTitle) query.jobTitle = jobTitle;
  if (occupation) query.occupation = occupation; // Legacy support
  if (maritalStatus) query.maritalStatus = maritalStatus;

  if (minAge || maxAge) {
    query.age = {};
    if (minAge) query.age.$gte = Number(minAge);
    if (maxAge) query.age.$lte = Number(maxAge);
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { jobTitle: { $regex: search, $options: 'i' } },
      { occupation: { $regex: search, $options: 'i' } },
    ];
  }

  const manpower = await Manpower.find(query).sort({ createdAt: -1 });
  res.json(manpower);
});

// @desc    Fetch single manpower
// @route   GET /api/manpower/:id
// @access  Public
const getManpowerById = asyncHandler(async (req, res) => {
  const manpower = await Manpower.findById(req.params.id);

  if (manpower) {
    res.json(manpower);
  } else {
    res.status(404);
    throw new Error('Worker not found');
  }
});

// @desc    Create a manpower
// @route   POST /api/manpower
// @access  Private/Admin
const createManpower = asyncHandler(async (req, res) => {
  const {
    name,
    jobTitle,
    workerCategory,
    nationality,
    religion,
    languages,
    gender,
    maritalStatus,
    numberOfChildren,
    age,
    experience,
    salary,
    manpowerFees,
    aboutWorker,
    // Legacy fields for backward compatibility
    occupation,
    type,
    description,
  } = req.body;

  // Handle file uploads
  let photoPath = '';
  let resumePath = '';
  
  if (req.files) {
    if (req.files.photo && req.files.photo[0]) {
      photoPath = `/uploads/manpower/${req.files.photo[0].filename}`;
    } else if (req.files.image && req.files.image[0]) {
      photoPath = `/uploads/manpower/${req.files.image[0].filename}`;
    }
    
    if (req.files.resume && req.files.resume[0]) {
      resumePath = `/uploads/manpower/resumes/${req.files.resume[0].filename}`;
    }
  }

  const manpower = new Manpower({
    name,
    jobTitle: jobTitle || occupation,
    workerCategory: workerCategory || type,
    nationality,
    religion: religion || '',
    languages: languages ? (Array.isArray(languages) ? languages : languages.split(',').map(s => s.trim())) : [],
    gender,
    maritalStatus,
    numberOfChildren: numberOfChildren ? Number(numberOfChildren) : 0,
    age: Number(age),
    experience,
    salary,
    manpowerFees,
    photo: photoPath,
    resume: resumePath,
    aboutWorker: aboutWorker || description || '',
    // Legacy fields for backward compatibility
    image: photoPath,
    type: workerCategory || type,
    occupation: jobTitle || occupation,
  });

  const createdManpower = await manpower.save();
  res.status(201).json(createdManpower);
});

// @desc    Update a manpower
// @route   PUT /api/manpower/:id
// @access  Private/Admin
const updateManpower = asyncHandler(async (req, res) => {
  const {
    name,
    jobTitle,
    workerCategory,
    nationality,
    religion,
    languages,
    gender,
    maritalStatus,
    numberOfChildren,
    age,
    experience,
    salary,
    manpowerFees,
    aboutWorker,
    // Legacy fields for backward compatibility
    occupation,
    type,
    description,
  } = req.body;

  const manpower = await Manpower.findById(req.params.id);

  if (manpower) {
    manpower.name = name || manpower.name;
    manpower.jobTitle = jobTitle || occupation || manpower.jobTitle;
    manpower.workerCategory = workerCategory || type || manpower.workerCategory;
    manpower.nationality = nationality || manpower.nationality;
    manpower.religion = religion !== undefined ? religion : manpower.religion;
    manpower.languages = languages ? (Array.isArray(languages) ? languages : languages.split(',').map(s => s.trim())) : manpower.languages;
    manpower.gender = gender || manpower.gender;
    manpower.maritalStatus = maritalStatus || manpower.maritalStatus;
    manpower.numberOfChildren = numberOfChildren !== undefined ? Number(numberOfChildren) : manpower.numberOfChildren;
    manpower.age = age ? Number(age) : manpower.age;
    manpower.experience = experience || manpower.experience;
    manpower.salary = salary || manpower.salary;
    manpower.manpowerFees = manpowerFees || manpower.manpowerFees;
    manpower.aboutWorker = aboutWorker !== undefined ? aboutWorker : (description !== undefined ? description : manpower.aboutWorker);

    // If new photo is uploaded
    if (req.files && (req.files.photo || req.files.image)) {
      const photoFile = req.files.photo || req.files.image;
      if (manpower.photo || manpower.image) {
        const oldImagePath = path.join(__dirname, '..', manpower.photo || manpower.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      manpower.photo = `/uploads/manpower/${photoFile[0].filename}`;
    }

    // If new resume is uploaded
    if (req.files && req.files.resume) {
      if (manpower.resume) {
        const oldResumePath = path.join(__dirname, '..', manpower.resume);
        if (fs.existsSync(oldResumePath)) {
          fs.unlinkSync(oldResumePath);
        }
      }
      manpower.resume = `/uploads/manpower/resumes/${req.files.resume[0].filename}`;
    }

    const updatedManpower = await manpower.save();
    res.json(updatedManpower);
  } else {
    res.status(404);
    throw new Error('Worker not found');
  }
});

// @desc    Delete a manpower
// @route   DELETE /api/manpower/:id
// @access  Private/Admin
const deleteManpower = asyncHandler(async (req, res) => {
  const manpower = await Manpower.findById(req.params.id);

  if (manpower) {
    // Delete the photo/image file if it exists
    if (manpower.photo || manpower.image) {
      const imagePath = path.join(__dirname, '..', manpower.photo || manpower.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // Delete the resume file if it exists
    if (manpower.resume) {
      const resumePath = path.join(__dirname, '..', manpower.resume);
      if (fs.existsSync(resumePath)) {
        fs.unlinkSync(resumePath);
      }
    }

    await Manpower.deleteOne({ _id: manpower._id });
    res.json({ message: 'Worker removed' });
  } else {
    res.status(404);
    throw new Error('Worker not found');
  }
});

// @desc    Get filter options (unique values for filters)
// @route   GET /api/manpower/filters/options
// @access  Public
const getFilterOptions = asyncHandler(async (req, res) => {
  const types = await Manpower.distinct('type');
  const nationalities = await Manpower.distinct('nationality');
  const occupations = await Manpower.distinct('occupation');
  const genders = await Manpower.distinct('gender');

  res.json({
    types,
    nationalities,
    occupations,
    genders,
  });
});

export {
  getManpower,
  getManpowerById,
  createManpower,
  updateManpower,
  deleteManpower,
  getFilterOptions,
};
