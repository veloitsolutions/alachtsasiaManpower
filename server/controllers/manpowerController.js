import asyncHandler from 'express-async-handler';
import Manpower from '../models/manpower.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { validateManpower } from '../utils/validation.js';

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
    maritalStatus,
    minAge,
    maxAge,
    search,
    page = 1,
    limit = 20,
  } = req.query;

  let query = {};

  // Sanitize inputs
  if (workerCategory) query.workerCategory = String(workerCategory).trim();
  if (type) query.type = String(type).trim();
  if (nationality) query.nationality = String(nationality).trim();
  if (gender && ['Male', 'Female'].includes(gender)) query.gender = gender;
  if (jobTitle) query.jobTitle = String(jobTitle).trim();
  if (maritalStatus) query.maritalStatus = String(maritalStatus).trim();

  if (minAge || maxAge) {
    query.age = {};
    if (minAge) query.age.$gte = Math.max(18, Number(minAge));
    if (maxAge) query.age.$lte = Math.min(100, Number(maxAge));
  }

  if (search) {
    const sanitizedSearch = String(search).trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    query.$or = [
      { nameEng: { $regex: sanitizedSearch, $options: 'i' } },
      { jobTitle: { $regex: sanitizedSearch, $options: 'i' } },
    ];
  }

  // Pagination
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
  const skip = (pageNum - 1) * limitNum;

  const manpower = await Manpower.find(query).sort({ createdAt: -1 }).limit(limitNum).skip(skip);
  
  // Add virtual name field
  const manpowerWithName = manpower.map(worker => {
    const obj = worker.toObject({ virtuals: true });
    return obj;
  });

  res.json(manpowerWithName);
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
  // Validate input
  const validatedData = validateManpower(req.body);
  const {
    nameEng,
    nameArabic,
    jobTitle,
    jobType,
    nationality,
    religion,
    languages,
    gender,
    age,
    maritalStatus,
    numberOfChildren,
    experience,
    gulfExperience,
    salary,
    salaryCurrency,
    manpowerFees,
    manpowerFeesCurrency,
    agencyFeeOption,
    hourlyRate,
    hourlyRateCurrency,
    candidateContactNumber,
    candidateContactNumber2,
    countryCode,
    countryCode2,
    isContactNumberVisible,
    whatsappNumber,
    workerCategory,
    otherWorkerCategory,
    companyWorker,
    otherCompanyWorker,
    currentLocation,
    drivingLicense,
    horoscope,
    probationPeriod,
    referenceName,
    isReferenceNameVisible,
    offer,
    aboutWorker,
    videoFile,
    otherCountriesWorkersDetails,
  } = req.body;

  // Handle file uploads
  let photoPath = '';
  let passportPhotoPath = '';
  let fullPhotoPath = '';
  let resumePath = '';
  
  if (req.files) {
    if (req.files.photo && req.files.photo[0]) {
      photoPath = `/uploads/manpower/${req.files.photo[0].filename}`;
    }
    if (req.files.passportPhoto && req.files.passportPhoto[0]) {
      passportPhotoPath = `/uploads/manpower/${req.files.passportPhoto[0].filename}`;
      if (!photoPath) photoPath = passportPhotoPath;
    }
    if (req.files.fullPhoto && req.files.fullPhoto[0]) {
      fullPhotoPath = `/uploads/manpower/${req.files.fullPhoto[0].filename}`;
    }
    if (req.files.resume && req.files.resume[0]) {
      resumePath = `/uploads/manpower/resumes/${req.files.resume[0].filename}`;
    }
  }

  // Parse arrays
  const parseArray = (value) => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : value.split(',').map(s => s.trim());
      } catch (e) {
        return value.split(',').map(s => s.trim());
      }
    }
    return [];
  };

  // Parse otherCountriesWorkersDetails
  let parsedOtherCountries = [];
  if (otherCountriesWorkersDetails) {
    try {
      parsedOtherCountries = typeof otherCountriesWorkersDetails === 'string' 
        ? JSON.parse(otherCountriesWorkersDetails) 
        : otherCountriesWorkersDetails;
    } catch (e) {
      parsedOtherCountries = [];
    }
  }

  const manpower = new Manpower({
    nameEng: validatedData.nameEng,
    nameArabic: validatedData.nameArabic,
    jobTitle: parseArray(validatedData.jobTitle),
    jobType: validatedData.jobType,
    nationality: validatedData.nationality,
    religion: validatedData.religion,
    languages: parseArray(validatedData.languages),
    gender: validatedData.gender,
    age: validatedData.age,
    maritalStatus: validatedData.maritalStatus,
    numberOfChildren: validatedData.numberOfChildren || 0,
    experience: validatedData.experience,
    gulfExperience: parseArray(validatedData.gulfExperience),
    salary: validatedData.salary,
    salaryCurrency: validatedData.salaryCurrency,
    manpowerFees: validatedData.manpowerFees,
    manpowerFeesCurrency: validatedData.manpowerFeesCurrency,
    agencyFeeOption: validatedData.agencyFeeOption,
    hourlyRate: validatedData.hourlyRate,
    hourlyRateCurrency: validatedData.hourlyRateCurrency,
    candidateContactNumber: validatedData.candidateContactNumber,
    candidateContactNumber2: validatedData.candidateContactNumber2,
    countryCode: validatedData.countryCode,
    countryCode2: validatedData.countryCode2,
    isContactNumberVisible: validatedData.isContactNumberVisible,
    whatsappNumber: validatedData.whatsappNumber,
    photo: photoPath,
    passportPhoto: passportPhotoPath,
    fullPhoto: fullPhotoPath,
    resume: resumePath,
    videoFile,
    video: validatedData.videoFile,
    workerCategory: validatedData.workerCategory,
    otherWorkerCategory: validatedData.otherWorkerCategory,
    companyWorker: validatedData.companyWorker,
    otherCompanyWorker: validatedData.otherCompanyWorker,
    currentLocation: validatedData.currentLocation,
    drivingLicense: parseArray(validatedData.drivingLicense),
    horoscope: validatedData.horoscope,
    probationPeriod: validatedData.probationPeriod,
    referenceName: validatedData.referenceName,
    isReferenceNameVisible: validatedData.isReferenceNameVisible,
    offer: validatedData.offer,
    aboutWorker: validatedData.aboutWorker,
    otherCountriesWorkersDetails: typeof validatedData.otherCountriesWorkersDetails === 'string' 
      ? JSON.parse(validatedData.otherCountriesWorkersDetails) 
      : validatedData.otherCountriesWorkersDetails || [],
  });

  const createdManpower = await manpower.save();
  res.status(201).json(createdManpower);
});

// @desc    Update a manpower
// @route   PUT /api/manpower/:id
// @access  Private/Admin
const updateManpower = asyncHandler(async (req, res) => {
  const manpower = await Manpower.findById(req.params.id);

  if (!manpower) {
    res.status(404);
    throw new Error('Worker not found');
  }

  // Validate input
  const validatedData = validateManpower(req.body);

  // Parse arrays helper
  const parseArray = (value) => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : value.split(',').map(s => s.trim());
      } catch (e) {
        return value.split(',').map(s => s.trim());
      }
    }
    return [];
  };

  // Update fields
  const fields = [
    'nameEng', 'nameArabic', 'jobType', 'nationality', 'religion',
    'gender', 'maritalStatus', 'experience', 'salary', 'salaryCurrency',
    'manpowerFees', 'manpowerFeesCurrency', 'agencyFeeOption', 'candidateContactNumber',
    'candidateContactNumber2', 'countryCode', 'countryCode2', 'whatsappNumber',
    'workerCategory', 'otherWorkerCategory', 'companyWorker', 'otherCompanyWorker',
    'currentLocation', 'horoscope', 'referenceName', 'offer',
    'aboutWorker', 'videoFile'
  ];

  fields.forEach(field => {
    if (validatedData[field] !== undefined) {
      manpower[field] = validatedData[field];
    }
  });

  // Handle numeric fields
  if (validatedData.age) manpower.age = validatedData.age;
  if (validatedData.numberOfChildren !== undefined) manpower.numberOfChildren = validatedData.numberOfChildren;
  if (validatedData.hourlyRate) manpower.hourlyRate = validatedData.hourlyRate;
  if (validatedData.probationPeriod !== undefined) manpower.probationPeriod = validatedData.probationPeriod;

  // Handle boolean fields
  if (validatedData.isContactNumberVisible !== undefined) {
    manpower.isContactNumberVisible = validatedData.isContactNumberVisible;
  }
  if (validatedData.isReferenceNameVisible !== undefined) {
    manpower.isReferenceNameVisible = validatedData.isReferenceNameVisible;
  }

  // Handle array fields
  if (validatedData.jobTitle) manpower.jobTitle = parseArray(validatedData.jobTitle);
  if (validatedData.languages) manpower.languages = parseArray(validatedData.languages);
  if (validatedData.gulfExperience) manpower.gulfExperience = parseArray(validatedData.gulfExperience);
  if (validatedData.drivingLicense) manpower.drivingLicense = parseArray(validatedData.drivingLicense);

  // Handle otherCountriesWorkersDetails
  if (validatedData.otherCountriesWorkersDetails) {
    manpower.otherCountriesWorkersDetails = typeof validatedData.otherCountriesWorkersDetails === 'string' 
      ? JSON.parse(validatedData.otherCountriesWorkersDetails) 
      : validatedData.otherCountriesWorkersDetails;
  }

  // Handle file uploads
  if (req.files) {
    if (req.files.photo && req.files.photo[0]) {
      if (manpower.photo) {
        const oldPath = path.join(__dirname, '..', manpower.photo);
        try {
          await fs.unlink(oldPath);
        } catch (err) {
          console.error('Error deleting old photo:', err);
        }
      }
      manpower.photo = `/uploads/manpower/${req.files.photo[0].filename}`;
    }
    
    if (req.files.passportPhoto && req.files.passportPhoto[0]) {
      if (manpower.passportPhoto) {
        const oldPath = path.join(__dirname, '..', manpower.passportPhoto);
        try {
          await fs.unlink(oldPath);
        } catch (err) {
          console.error('Error deleting old passport photo:', err);
        }
      }
      manpower.passportPhoto = `/uploads/manpower/${req.files.passportPhoto[0].filename}`;
      if (!manpower.photo) manpower.photo = manpower.passportPhoto;
    }
    
    if (req.files.fullPhoto && req.files.fullPhoto[0]) {
      if (manpower.fullPhoto) {
        const oldPath = path.join(__dirname, '..', manpower.fullPhoto);
        try {
          await fs.unlink(oldPath);
        } catch (err) {
          console.error('Error deleting old full photo:', err);
        }
      }
      manpower.fullPhoto = `/uploads/manpower/${req.files.fullPhoto[0].filename}`;
    }
    
    if (req.files.resume && req.files.resume[0]) {
      if (manpower.resume) {
        const oldPath = path.join(__dirname, '..', manpower.resume);
        try {
          await fs.unlink(oldPath);
        } catch (err) {
          console.error('Error deleting old resume:', err);
        }
      }
      manpower.resume = `/uploads/manpower/resumes/${req.files.resume[0].filename}`;
    }
  }

  const updatedManpower = await manpower.save();
  res.json(updatedManpower);
});

// @desc    Delete a manpower
// @route   DELETE /api/manpower/:id
// @access  Private/Admin
const deleteManpower = asyncHandler(async (req, res) => {
  const manpower = await Manpower.findById(req.params.id);

  if (manpower) {
    // Delete files asynchronously
    const deletePromises = [];
    
    if (manpower.photo) {
      const imagePath = path.join(__dirname, '..', manpower.photo);
      deletePromises.push(fs.unlink(imagePath).catch(err => console.error('Error deleting photo:', err)));
    }

    if (manpower.resume) {
      const resumePath = path.join(__dirname, '..', manpower.resume);
      deletePromises.push(fs.unlink(resumePath).catch(err => console.error('Error deleting resume:', err)));
    }

    await Promise.all(deletePromises);
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
  const genders = await Manpower.distinct('gender');

  res.json({
    types,
    nationalities,
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
