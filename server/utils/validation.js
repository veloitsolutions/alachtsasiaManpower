import Joi from 'joi';

export const manpowerValidationSchema = Joi.object({
  nameEng: Joi.string().trim().min(2).max(100).pattern(/^[a-zA-Z\s]+$/).allow('').messages({
    'string.pattern.base': 'Name must contain only letters and spaces'
  }),
  nameArabic: Joi.string().trim().max(100).allow(''),
  jobTitle: Joi.alternatives().try(
    Joi.array().items(Joi.string().trim()).min(1),
    Joi.string().trim()
  ).required(),
  jobType: Joi.string().valid('full-time', 'part-time', 'contract', 'hourlybasis').allow(''),
  country: Joi.string().trim().max(50),
  nationality: Joi.string().trim().max(50),
  religion: Joi.string().trim().max(50).required(),
  language: Joi.alternatives().try(
    Joi.array().items(Joi.string().trim()),
    Joi.string().trim()
  ).allow(''),
  languages: Joi.alternatives().try(
    Joi.array().items(Joi.string().trim()),
    Joi.string().trim()
  ).allow(''),
  gender: Joi.string().valid('Male', 'Female', 'Other').required(),
  age: Joi.number().integer().min(18).max(100).required(),
  maritalStatus: Joi.string().valid('Single', 'Married', 'Divorcee', 'Widow', 'SingleMother', 'Separated').required(),
  numberOfChildren: Joi.number().integer().min(0).max(20).allow(null),
  experience: Joi.string().trim().max(50).allow(''),
  gulfExperience: Joi.alternatives().try(
    Joi.array().items(Joi.string().trim()),
    Joi.string().trim()
  ).allow(''),
  salary: Joi.string().trim().pattern(/^[0-9,.\s]+$/).required().messages({
    'string.pattern.base': 'Salary must contain only numbers'
  }),
  salaryCurrency: Joi.string().valid('QAR', 'AED', 'BHD', 'OMR', 'SAR', 'USD', 'HKD', 'SGD', 'EUR', 'MYR', 'INR', 'CNY', 'JPY', 'AUD', 'CAD').default('QAR'),
  manpowerFees: Joi.string().trim().pattern(/^[0-9,.\s]+$/).required().messages({
    'string.pattern.base': 'Manpower fees must contain only numbers'
  }),
  manpowerFeesCurrency: Joi.string().valid('QAR', 'AED', 'BHD', 'OMR', 'SAR', 'USD', 'HKD', 'SGD', 'EUR', 'MYR', 'INR', 'CNY', 'JPY', 'AUD', 'CAD').default('QAR'),
  agencyFeeOption: Joi.string().max(100).allow(''),
  hourlyRate: Joi.number().min(0).max(10000).allow(null),
  hourlyRateCurrency: Joi.string().valid('QAR', 'AED', 'BHD', 'OMR', 'SAR', 'USD', 'HKD', 'SGD', 'EUR', 'MYR', 'INR', 'CNY', 'JPY', 'AUD', 'CAD').default('QAR'),
  candidateContactNumber: Joi.string().trim().pattern(/^[0-9+\s()-]+$/).max(20).allow(''),
  candidateContactNumber2: Joi.string().trim().pattern(/^[0-9+\s()-]+$/).max(20).allow(''),
  countryCode: Joi.string().pattern(/^\+[0-9]{1,4}$/).default('+966'),
  countryCode2: Joi.string().pattern(/^\+[0-9]{1,4}$/).default('+966'),
  isContactNumberVisible: Joi.boolean().default(false),
  whatsappNumber: Joi.string().trim().pattern(/^[0-9+\s()-]+$/).max(20).allow(''),
  workerCategory: Joi.string().max(100).required(),
  otherWorkerCategory: Joi.string().max(100).allow(''),
  companyWorker: Joi.string().max(100).allow(''),
  otherCompanyWorker: Joi.string().max(100).allow(''),
  locationOnMap: Joi.string().max(100).allow(''),
  currentLocation: Joi.string().max(100).allow(''),
  drivingLicense: Joi.alternatives().try(
    Joi.array().items(Joi.string().trim()).max(10),
    Joi.string().trim()
  ).allow(''),
  horoscope: Joi.string().max(50).allow(''),
  probationPeriod: Joi.number().integer().min(0).max(24).allow(null),
  referenceName: Joi.string().trim().max(100).allow(''),
  isReferenceNameVisible: Joi.boolean().default(false),
  offer: Joi.string().max(500).allow(''),
  aboutWorker: Joi.string().max(2000).allow(''),
  videoFile: Joi.string().uri().max(500).allow(''),
  otherCountriesWorkersDetails: Joi.alternatives().try(
    Joi.array().items(Joi.object({
      country: Joi.string().max(50),
      salary: Joi.string().pattern(/^[0-9,.\s]+$/),
      salaryCurrency: Joi.string().valid('QAR', 'AED', 'BHD', 'OMR', 'SAR', 'USD', 'HKD', 'SGD', 'EUR', 'MYR', 'INR', 'CNY', 'JPY', 'AUD', 'CAD'),
      manpowerFees: Joi.string().pattern(/^[0-9,.\s]+$/),
      manpowerFeesCurrency: Joi.string().valid('QAR', 'AED', 'BHD', 'OMR', 'SAR', 'USD', 'HKD', 'SGD', 'EUR', 'MYR', 'INR', 'CNY', 'JPY', 'AUD', 'CAD')
    })).max(5),
    Joi.string()
  ).allow('')
}).options({ stripUnknown: true });

export const validateManpower = (data) => {
  const { error, value } = manpowerValidationSchema.validate(data, { abortEarly: false });
  if (error) {
    const errors = error.details.map(detail => detail.message);
    throw new Error(errors.join(', '));
  }
  return value;
};
