import mongoose from 'mongoose';

const manpowerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    jobTitle: {
      type: String,
      required: true,
    },
    workerCategory: {
      type: String,
      required: true,
      enum: ['Domestic Worker', 'Recruitment worker', 'Returned labor', 'Monthly contract labor', 'Multi Skilled Labour', 'Company Worker'],
    },
    nationality: {
      type: String,
      required: true,
    },
    religion: {
      type: String,
      required: false,
      default: '',
    },
    languages: {
      type: [String],
      default: [],
    },
    gender: {
      type: String,
      required: true,
      enum: ['Male', 'Female', 'Other'],
    },
    maritalStatus: {
      type: String,
      required: true,
      enum: ['Single', 'Married', 'Divorced', 'Widowed'],
    },
    numberOfChildren: {
      type: Number,
      required: false,
      default: 0,
      min: 0,
    },
    age: {
      type: Number,
      required: true,
      min: 18,
      max: 65,
    },
    experience: {
      type: String,
      required: true,
    },
    salary: {
      type: String,
      required: true,
    },
    manpowerFees: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      required: true,
    },
    resume: {
      type: String,
      required: false,
      default: '',
    },
    aboutWorker: {
      type: String,
      required: false,
      default: '',
    },
    // Legacy fields for backward compatibility
    image: {
      type: String,
      required: false,
    },
    type: {
      type: String,
      required: false,
    },
    occupation: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to handle backward compatibility
manpowerSchema.pre('save', function(next) {
  // If photo is set but image is not, copy photo to image for backward compatibility
  if (this.photo && !this.image) {
    this.image = this.photo;
  }
  // If image is set but photo is not, copy image to photo
  if (this.image && !this.photo) {
    this.photo = this.image;
  }
  
  // Handle other backward compatibility fields
  if (this.workerCategory && !this.type) {
    this.type = this.workerCategory;
  }
  if (this.jobTitle && !this.occupation) {
    this.occupation = this.jobTitle;
  }
  if (this.aboutWorker && !this.description) {
    this.description = this.aboutWorker;
  }
  
  next();
});

// Virtual fields for backward compatibility
manpowerSchema.virtual('imageUrl').get(function() {
  return this.photo || this.image;
});

const Manpower = mongoose.model('Manpower', manpowerSchema);

export default Manpower;
