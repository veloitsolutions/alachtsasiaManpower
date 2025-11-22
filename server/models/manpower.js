import mongoose from 'mongoose';

const OtherCountryWorkerSchema = new mongoose.Schema({
  country: { type: String },
  salary: { type: String },
  salaryCurrency: { type: String, default: 'QAR' },
  manpowerFees: { type: String },
  manpowerFeesCurrency: { type: String, default: 'QAR' }
}, { _id: false });

const manpowerSchema = new mongoose.Schema(
  {
    // Basic Info
    nameEng: { type: String },
    nameArabic: { type: String },
    jobTitle: { type: [String], default: [], required: true },
    jobType: { type: String },
    
    // Nationality & Religion
    nationality: { type: String },
    religion: { type: String, required: true },
    
    // Languages
    languages: { type: [String], default: [] },
    
    // Personal Details
    gender: { type: String, required: true },
    age: { type: Number, required: true, min: 18 },
    maritalStatus: { type: String, required: true },
    numberOfChildren: { type: Number, default: 0, min: 0 },
    
    // Experience
    experience: { type: String },
    gulfExperience: { type: [String], default: [] },
    
    // Salary & Fees
    salary: { type: String, required: true },
    salaryCurrency: { type: String, default: 'QAR' },
    manpowerFees: { type: String, required: true },
    manpowerFeesCurrency: { type: String, default: 'QAR' },
    agencyFeeOption: { type: String },
    hourlyRate: { type: Number },
    hourlyRateCurrency: { type: String, default: 'QAR' },
    
    // Contact Information
    candidateContactNumber: { type: String },
    candidateContactNumber2: { type: String },
    countryCode: { type: String, default: '+966' },
    countryCode2: { type: String, default: '+966' },
    isContactNumberVisible: { type: Boolean, default: false },
    whatsappNumber: { type: String },
    
    // Documents & Media
    photo: { type: String, required: true },
    passportPhoto: { type: String },
    fullPhoto: { type: String },
    resume: { type: String },
    video: { type: String },
    videoFile: { type: String },
    
    // Worker Category
    workerCategory: { type: String, required: true },
    otherWorkerCategory: { type: String },
    companyWorker: { type: String },
    otherCompanyWorker: { type: String },
    
    // Location
    currentLocation: { type: String },
    
    // Driver License
    drivingLicense: { type: [String], default: [] },
    
    // Other Details
    horoscope: { type: String },
    probationPeriod: { type: Number },
    referenceName: { type: String },
    isReferenceNameVisible: { type: Boolean, default: false },
    offer: { type: String },
    aboutWorker: { type: String },
    
    // Other Countries Details
    otherCountriesWorkersDetails: {
      type: [OtherCountryWorkerSchema],
      validate: {
        validator: function(arr) {
          return arr.length <= 5;
        },
        message: 'otherCountriesWorkersDetails cannot exceed 5 items'
      },
      default: []
    },
  },
  {
    timestamps: true,
  }
);

// Virtual field for backward compatibility
manpowerSchema.virtual('name').get(function() {
  return this.nameEng || this.nameArabic || '';
});

// Ensure virtuals are included in JSON
manpowerSchema.set('toJSON', { virtuals: true });
manpowerSchema.set('toObject', { virtuals: true });

// Indexes for better query performance
manpowerSchema.index({ nationality: 1, gender: 1, workerCategory: 1 });
manpowerSchema.index({ createdAt: -1 });
manpowerSchema.index({ jobTitle: 1 });
manpowerSchema.index({ age: 1 });
manpowerSchema.index({ maritalStatus: 1 });
manpowerSchema.index({ nameEng: 'text', jobTitle: 'text' });



const Manpower = mongoose.model('Manpower', manpowerSchema);

export default Manpower;
