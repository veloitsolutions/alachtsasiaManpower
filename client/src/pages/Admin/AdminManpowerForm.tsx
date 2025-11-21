import React, { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, ArrowLeft } from 'lucide-react';
import { ASSETS_CONFIG } from '../../config/api';
import { jobTypes, genders, maritalStatuses, jobTitles, workerCategories, companyWorkerTypes, religionsData, horoscopeOptions } from './workerOptions';
import { primaryCountriesData1, primaryCountriesData2, allCountriesData } from './location';
import { primaryLanguagesData, allLanguagesData } from './languages';

interface OtherCountryWorkerDetail {
  country: string;
  salary: string;
  salaryCurrency: string;
  manpowerFees: string;
  manpowerFeesCurrency: string;
}

interface FormData {
  jobTitle: string[];
  jobType: string;
  nameEng: string;
  nameArabic: string;
  nationality: string;
  religion: string;
  languages: string[];
  gender: string;
  age: number | null;
  maritalStatus: string;
  numberOfChildren: number | null;
  salary: string;
  salaryCurrency: string;
  manpowerFees: string;
  manpowerFeesCurrency: string;
  agencyFeeOption: string;
  experience: string;
  aboutWorker: string;
  photo: File | null;
  resume: File | null;
  workerCategory: string;
  otherWorkerCategory: string;
  companyWorker: string;
  otherCompanyWorker: string;
  horoscope: string;
  offer: string;
  candidateContactNumber: string;
  candidateContactNumber2: string;
  countryCode: string;
  countryCode2: string;
  isContactNumberVisible: boolean;
  currentLocation: string;
  drivingLicense: string[];
  gulfExperience: string[];
  probationPeriod: number | null;
  referenceName: string;
  isReferenceNameVisible: boolean;
  hourlyRate: number | null;
  hourlyRateCurrency: string;
  whatsappNumber: string;
  videoFile: string;
  otherCountriesWorkersDetails: OtherCountryWorkerDetail[];
}

interface AdminManpowerFormProps {
  onSubmit: (data: FormData, photo: File | null, resume: File | null, fullPhoto?: File | null) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<FormData> & { existingPhoto?: string; existingFullPhoto?: string; existingResume?: string };
  isLoading?: boolean;
}

const currencyOptions = ["QAR", "AED", "BHD", "OMR", "SAR", "USD", "HKD", "SGD", "EUR", "MYR", "INR", "CNY", "JPY", "AUD", "CAD"];

const AdminManpowerForm: React.FC<AdminManpowerFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<FormData>({
    jobTitle: initialData?.jobTitle || [],
    jobType: initialData?.jobType || 'full-time',
    nameEng: initialData?.nameEng || '',
    nameArabic: initialData?.nameArabic || '',
    nationality: initialData?.nationality || '',
    religion: initialData?.religion || '',
    languages: initialData?.languages || [],
    gender: initialData?.gender || '',
    age: initialData?.age || null,
    maritalStatus: initialData?.maritalStatus || '',
    numberOfChildren: initialData?.numberOfChildren || null,
    salary: initialData?.salary || '',
    salaryCurrency: initialData?.salaryCurrency || 'QAR',
    manpowerFees: initialData?.manpowerFees || '',
    manpowerFeesCurrency: initialData?.manpowerFeesCurrency || 'QAR',
    agencyFeeOption: initialData?.agencyFeeOption || '',
    experience: initialData?.experience || '',
    aboutWorker: initialData?.aboutWorker || '',
    photo: null,
    resume: null,
    workerCategory: initialData?.workerCategory || '',
    otherWorkerCategory: initialData?.otherWorkerCategory || '',
    companyWorker: initialData?.companyWorker || '',
    otherCompanyWorker: initialData?.otherCompanyWorker || '',
    horoscope: initialData?.horoscope || '',
    offer: initialData?.offer || '',
    candidateContactNumber: initialData?.candidateContactNumber || '',
    candidateContactNumber2: initialData?.candidateContactNumber2 || '',
    countryCode: initialData?.countryCode || '+966',
    countryCode2: initialData?.countryCode2 || '+966',
    isContactNumberVisible: initialData?.isContactNumberVisible || false,
    currentLocation: initialData?.currentLocation || '',
    drivingLicense: initialData?.drivingLicense || [],
    gulfExperience: initialData?.gulfExperience || [],
    probationPeriod: initialData?.probationPeriod || null,
    referenceName: initialData?.referenceName || '',
    isReferenceNameVisible: initialData?.isReferenceNameVisible || false,
    hourlyRate: initialData?.hourlyRate || null,
    hourlyRateCurrency: initialData?.hourlyRateCurrency || 'QAR',
    whatsappNumber: initialData?.whatsappNumber || '',
    videoFile: initialData?.videoFile || '',
    otherCountriesWorkersDetails: initialData?.otherCountriesWorkersDetails || [{ country: '', salary: '', salaryCurrency: 'QAR', manpowerFees: '', manpowerFeesCurrency: 'QAR' }],
  });

  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>(initialData?.existingPhoto ? `${ASSETS_CONFIG.BASE_URL}${initialData.existingPhoto}` : '');
  const [fullPhoto, setFullPhoto] = useState<File | null>(null);
  const [fullPhotoPreview, setFullPhotoPreview] = useState<string>(initialData?.existingFullPhoto ? `${ASSETS_CONFIG.BASE_URL}${initialData.existingFullPhoto}` : '');
  const [resume, setResume] = useState<File | null>(null);
  const [resumeName, setResumeName] = useState<string>(initialData?.existingResume ? initialData.existingResume.split('/').pop() || 'Existing Resume' : '');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});
  const [isOtherCountriesOpen, setIsOtherCountriesOpen] = useState(false);
  const [otherCountriesDropdownStates, setOtherCountriesDropdownStates] = useState<boolean[]>([]);

  const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      Object.entries(dropdownRefs.current).forEach(([key, ref]) => {
        if (ref && !ref.contains(event.target as Node)) {
          setOpenDropdowns(prev => ({ ...prev, [key]: false }));
        }
      });
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleFullPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setFullPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => setFullPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setResume(file);
      setResumeName(file.name);
    }
  };

  const toggleDropdown = (key: string) => {
    setOpenDropdowns(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleMultiSelect = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field as keyof FormData] as string[]).includes(value)
        ? (prev[field as keyof FormData] as string[]).filter(v => v !== value)
        : [...(prev[field as keyof FormData] as string[]), value],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.nameEng && !formData.nameArabic) newErrors.name = 'At least one name is required';
    if (!formData.age || formData.age < 18) newErrors.age = 'Age must be at least 18';
    if (!formData.jobTitle.length) newErrors.jobTitle = 'Job title is required';
    if (!formData.nationality) newErrors.nationality = 'Nationality is required';
    if (!formData.salary) newErrors.salary = 'Salary is required';
    if (!formData.manpowerFees) newErrors.manpowerFees = 'Manpower fees are required';
    if (!photo && !initialData?.existingPhoto) newErrors.photo = 'Photo is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await onSubmit(formData, photo, resume, fullPhoto);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const renderDropdown = (key: string, options: any[], selectedValue: string | string[], isMulti = false) => {
    const isOpen = openDropdowns[key];
    const selected = Array.isArray(selectedValue) ? selectedValue : [selectedValue];

    return (
      <div className="custom-select" ref={el => { if (el) dropdownRefs.current[key] = el; }}>
        <button
          type="button"
          onClick={() => toggleDropdown(key)}
          className="select-button"
        >
          <span>
            {Array.isArray(selectedValue) && selectedValue.length > 0
              ? selectedValue.map(v => options.find(o => o.value === v)?.label.en).join(', ')
              : selectedValue && options.find(o => o.value === selectedValue)?.label.en
              || 'Select...'}
          </span>
          <ChevronDown className={`chevron ${isOpen ? 'open' : ''}`} />
        </button>
        {isOpen && (
          <div className="select-dropdown">
            {options.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  if (isMulti) {
                    handleMultiSelect(key, opt.value);
                  } else {
                    setFormData(prev => ({ ...prev, [key]: opt.value }));
                    toggleDropdown(key);
                  }
                }}
                className="select-option"
              >
                <span className="flex items-center gap-2">
                  {isMulti && selected.includes(opt.value) && <Check className="w-4 h-4" />}
                  {opt.label.en}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="modern-form-container">
      <div className="form-header" style={{ background: 'linear-gradient(135deg, var(--primary-red) 0%, #c2185b 100%)' }}>
        <h2>{initialData ? 'Edit Worker' : 'Add New Worker'}</h2>
      </div>

      {Object.keys(errors).length > 0 && (
        <div className="form-error-banner">
          <p>Please fill in all required fields</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="modern-form">
        {/* Job Title */}
        <div className="form-group">
          <label><span>Job Title *</span> {formData.jobTitle.length > 0 && <Check className="check-icon" />}</label>
          <div className="grid grid-cols-3 gap-3 mb-2">
            {jobTitles.slice(0, 9).map(job => (
              <button
                key={job.value}
                type="button"
                onClick={() => handleMultiSelect('jobTitle', job.value)}
                style={formData.jobTitle.includes(job.value) ? {
                  background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
                  color: 'white',
                  border: '2px solid #db2777',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                } : {
                  background: 'white',
                  border: '2px solid #d1d5db',
                  color: '#374151'
                }}
                className="p-4 rounded text-center text-sm font-medium transition-all cursor-pointer"
              >
                <div>{job.label.en}</div>
                <div className="text-xs mt-1 font-arabic">{job.label.ar}</div>
              </button>
            ))}
          </div>
          {renderDropdown('jobTitle', jobTitles, formData.jobTitle, true)}
        </div>

        {/* Driver License */}
        {formData.jobTitle.includes('driver') && (
          <div className="form-group">
            <label><span>Driver License</span> {formData.drivingLicense.length > 0 && <Check className="check-icon" />}</label>
            {renderDropdown('drivingLicense', allCountriesData, formData.drivingLicense, true)}
          </div>
        )}

        {/* Name Fields */}
        <div className="form-row-2">
          <div className="form-group">
            <label><span>Name in English *</span> {formData.nameEng && <Check className="check-icon" />}</label>
            <input type="text" name="nameEng" value={formData.nameEng} onChange={handleInputChange} className="form-input" />
          </div>
          <div className="form-group">
            <label><span>Name in Arabic</span> {formData.nameArabic && <Check className="check-icon" />}</label>
            <input type="text" name="nameArabic" value={formData.nameArabic} onChange={handleInputChange} className="form-input" />
          </div>
        </div>

        {/* Nationality */}
        <div className="form-group">
          <label><span>Select Nationality *</span> {formData.nationality && <Check className="check-icon" />}</label>
          <div className="grid grid-cols-5 gap-3 mb-2">
            {primaryCountriesData1.slice(0, 5).map(c => (
              <button
                key={c.value}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, nationality: c.value }))}
                style={formData.nationality === c.value ? {
                  background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
                  color: 'white',
                  border: '2px solid #db2777',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                } : {
                  background: 'white',
                  border: '2px solid #d1d5db',
                  color: '#374151'
                }}
                className="p-3 rounded text-center text-sm font-medium transition-all cursor-pointer"
              >
                <div>{c.label.en}</div>
                <div className="text-xs mt-1 font-arabic">{c.label.ar}</div>
              </button>
            ))}
          </div>
          {renderDropdown('nationality', allCountriesData, formData.nationality)}
        </div>

        {/* Languages */}
        <div className="form-group">
          <label><span>Select Languages</span> {formData.languages.length > 0 && <Check className="check-icon" />}</label>
          <div className="grid grid-cols-5 gap-3 mb-2">
            {primaryLanguagesData.slice(0, 5).map(lang => (
              <button
                key={lang.value}
                type="button"
                onClick={() => handleMultiSelect('languages', lang.value)}
                style={formData.languages.includes(lang.value) ? {
                  background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
                  color: 'white',
                  border: '2px solid #db2777',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                } : {
                  background: 'white',
                  border: '2px solid #d1d5db',
                  color: '#374151'
                }}
                className="p-3 rounded text-center text-sm font-medium transition-all cursor-pointer"
              >
                <div>{lang.label.en}</div>
                <div className="text-xs mt-1 font-arabic">{lang.label.ar}</div>
              </button>
            ))}
          </div>
          {renderDropdown('languages', allLanguagesData, formData.languages, true)}
        </div>

        {/* Religion */}
        <div className="form-group">
          <label><span>Religion</span> {formData.religion && <Check className="check-icon" />}</label>
          <div className="grid grid-cols-5 gap-3 mb-2">
            {religionsData.slice(0, 5).map(r => (
              <button
                key={r.value}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, religion: r.value }))}
                style={formData.religion === r.value ? {
                  background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
                  color: 'white',
                  border: '2px solid #db2777',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                } : {
                  background: 'white',
                  border: '2px solid #d1d5db',
                  color: '#374151'
                }}
                className="p-3 rounded text-center text-sm font-medium transition-all cursor-pointer"
              >
                <div>{r.label.en}</div>
                <div className="text-xs mt-1 font-arabic">{r.label.ar}</div>
              </button>
            ))}
          </div>
          <input type="text" name="religion" value={formData.religion} onChange={handleInputChange} className="form-input" placeholder="Enter religion" />
        </div>

        {/* Gender */}
        <div className="form-group">
          <label><span>Gender *</span> {formData.gender && <Check className="check-icon" />}</label>
          <div className="grid grid-cols-3 gap-3">
            {genders.map(g => (
              <button
                key={g.value}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, gender: g.value }))}
                style={formData.gender === g.value ? {
                  background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
                  color: 'white',
                  border: '2px solid #db2777',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                } : {
                  background: 'white',
                  border: '2px solid #d1d5db',
                  color: '#374151'
                }}
                className="p-3 rounded text-center text-sm font-medium transition-all cursor-pointer"
              >
                <div>{g.label.en}</div>
                <div className="text-xs mt-1 font-arabic">{g.label.ar}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Marital Status */}
        <div className="form-group">
          <label><span>Marital Status *</span> {formData.maritalStatus && <Check className="check-icon" />}</label>
          <div className="grid grid-cols-6 gap-3">
            {maritalStatuses.slice(0, 6).map(m => (
              <button
                key={m.value}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, maritalStatus: m.value }))}
                style={formData.maritalStatus === m.value ? {
                  background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
                  color: 'white',
                  border: '2px solid #db2777',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                } : {
                  background: 'white',
                  border: '2px solid #d1d5db',
                  color: '#374151'
                }}
                className="p-3 rounded text-center text-sm font-medium transition-all cursor-pointer"
              >
                <div>{m.label.en}</div>
                <div className="text-xs mt-1 font-arabic">{m.label.ar}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Number of Children */}
        <div className="form-group">
          <label>Number of Children</label>
          <input type="number" name="numberOfChildren" value={formData.numberOfChildren || ''} onChange={handleInputChange} min="0" className="form-input" />
        </div>

        {/* Age, Experience, Gulf Experience */}
        <div className="form-row-3">
          <div className="form-group">
            <label><span>Age *</span> {formData.age && <Check className="check-icon" />}</label>
            <input type="number" name="age" value={formData.age || ''} onChange={handleInputChange} min="18" className="form-input" />
          </div>
          <div className="form-group">
            <label><span>Experience (Years) *</span> {formData.experience && <Check className="check-icon" />}</label>
            <input type="text" name="experience" value={formData.experience} onChange={handleInputChange} className="form-input" />
          </div>
          <div className="form-group">
            <label><span>Gulf Experience</span> {formData.gulfExperience.length > 0 && <Check className="check-icon" />}</label>
            {renderDropdown('gulfExperience', primaryCountriesData2, formData.gulfExperience, true)}
          </div>
        </div>

        {/* Salary, Fees, Fee Option */}
        <div className="form-row-3">
          <div className="form-group">
            <label><span>Salary *</span> {formData.salary && <Check className="check-icon" />}</label>
            <div className="flex gap-2">
              <input type="text" name="salary" value={formData.salary} onChange={handleInputChange} className="form-input flex-1" />
              <select name="salaryCurrency" value={formData.salaryCurrency} onChange={handleInputChange} className="form-input w-24">
                {currencyOptions.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label><span>Manpower Fees *</span> {formData.manpowerFees && <Check className="check-icon" />}</label>
            <div className="flex gap-2">
              <input type="text" name="manpowerFees" value={formData.manpowerFees} onChange={handleInputChange} className="form-input flex-1" />
              <select name="manpowerFeesCurrency" value={formData.manpowerFeesCurrency} onChange={handleInputChange} className="form-input w-24">
                {currencyOptions.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label><span>Manpower Fee Option</span> {formData.agencyFeeOption && <Check className="check-icon" />}</label>
            <select name="agencyFeeOption" value={formData.agencyFeeOption || ''} onChange={handleInputChange} className="form-input">
              <option value="">Select Option</option>
              <option value="Negotiable">Negotiable</option>
              <option value="No Manpower Fee">No Manpower Fee</option>
              <option value="Free recruitment">Free recruitment</option>
            </select>
          </div>
        </div>
        
        {/* Candidate Contact Information */}
        <div className="form-group">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Candidate Contact Information</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
              {/* Mobile Number 1 */}
              <div>
                <label className="block mb-2">Mobile Number 1</label>
                <div className="flex gap-2">
                  <select name="countryCode" value={formData.countryCode} onChange={handleInputChange} className="form-input w-24">
                    {allCountriesData.filter(c => c.countryCode).map(c => (
                      <option key={c.value} value={c.countryCode}>{c.countryCode}</option>
                    ))}
                  </select>
                  <input type="tel" name="candidateContactNumber" value={formData.candidateContactNumber} onChange={handleInputChange} className="form-input flex-1" placeholder="Enter mobile number" />
                </div>
              </div>
              
              {/* Mobile Number 2 */}
              <div>
                <label className="block mb-2">Mobile Number 2 (Optional)</label>
                <div className="flex gap-2">
                  <select name="countryCode2" value={formData.countryCode2} onChange={handleInputChange} className="form-input w-24">
                    {allCountriesData.filter(c => c.countryCode).map(c => (
                      <option key={c.value} value={c.countryCode}>{c.countryCode}</option>
                    ))}
                  </select>
                  <input type="tel" name="candidateContactNumber2" value={formData.candidateContactNumber2} onChange={handleInputChange} className="form-input flex-1" placeholder="Enter mobile number" />
                </div>
              </div>
            </div>
            
            {/* Visibility Checkbox */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isContactNumberVisible"
                name="isContactNumberVisible"
                checked={formData.isContactNumberVisible}
                onChange={(e) => setFormData(prev => ({ ...prev, isContactNumberVisible: e.target.checked }))}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="isContactNumberVisible" className="text-sm font-medium text-gray-700">
                Make contact number visible to clients
              </label>
            </div>
          </div>
        </div>

        {/* Attached Documents */}
        <div className="form-group">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Attached Documents</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
              {/* Small-sized photo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-center">Small-sized photo</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-2 text-center hover:border-blue-400 transition-colors">
                  <input type="file" id="passportPhoto" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                  <label htmlFor="passportPhoto" className="cursor-pointer block">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Preview" style={{ maxHeight: '120px', width: '100%', objectFit: 'contain' }} className="rounded" />
                    ) : (
                      <div className="text-gray-500 text-sm py-6">Click to upload</div>
                    )}
                  </label>
                </div>
              </div>
              
              {/* Full-sized photo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-center">Full-sized photo</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-2 text-center hover:border-blue-400 transition-colors">
                  <input type="file" id="fullPhoto" accept="image/*" onChange={handleFullPhotoChange} className="hidden" />
                  <label htmlFor="fullPhoto" className="cursor-pointer block">
                    {fullPhotoPreview ? (
                      <img src={fullPhotoPreview} alt="Full Preview" style={{ maxHeight: '120px', width: '100%', objectFit: 'contain' }} className="rounded" />
                    ) : (
                      <div className="text-gray-500 text-sm py-6">Click to upload</div>
                    )}
                  </label>
                </div>
              </div>
              {/* Resume */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-center">Resume</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-2 text-center hover:border-blue-400 transition-colors" style={{ minHeight: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <input type="file" id="resume" accept=".pdf,.doc,.docx" onChange={handleResumeChange} className="hidden" />
                  <label htmlFor="resume" className="cursor-pointer block">
                    <div className="text-gray-500 text-sm py-6">{resumeName || 'Click to upload'}</div>
                  </label>
                </div>
              </div>
            </div>
            
            {/* Video URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Video (YouTube)</label>
              <input
                type="text"
                name="videoFile"
                value={formData.videoFile}
                onChange={handleInputChange}
                placeholder="Enter YouTube link"
                className="form-input w-full"
              />
            </div>
          </div>
        </div>

        {/* Worker Category */}
        <div className="form-group">
          <label><span>Worker Category</span> {(formData.workerCategory || formData.otherWorkerCategory) && <Check className="check-icon" />}</label>
          <div className="grid grid-cols-3 gap-3 mb-2">
            {workerCategories.map(cat => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, workerCategory: cat.value, otherWorkerCategory: '' }))}
                style={formData.workerCategory === cat.value ? {
                  background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
                  color: 'white',
                  border: '2px solid #db2777',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                } : {
                  background: 'white',
                  border: '2px solid #d1d5db',
                  color: '#374151'
                }}
                className="p-3 rounded text-center text-sm font-medium transition-all cursor-pointer"
              >
                <div>{cat.label.en}</div>
                <div className="text-xs mt-1 font-arabic">{cat.label.ar}</div>
              </button>
            ))}
          </div>
          <input type="text" name="otherWorkerCategory" value={formData.otherWorkerCategory} onChange={handleInputChange} placeholder="Other category" className="form-input" />
        </div>

        {/* Company Worker (if category is company worker) */}
        {formData.workerCategory === 'company worker' && (
          <div className="form-group">
            <label><span>Company Worker Type</span> {(formData.companyWorker || formData.otherCompanyWorker) && <Check className="check-icon" />}</label>
            <div className="grid grid-cols-3 gap-3 mb-2">
              {companyWorkerTypes.map(type => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, companyWorker: type.value, otherCompanyWorker: '' }))}
                  style={formData.companyWorker === type.value ? {
                    background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
                    color: 'white',
                    border: '2px solid #db2777',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                  } : {
                    background: 'white',
                    border: '2px solid #d1d5db',
                    color: '#374151'
                  }}
                  className="p-3 rounded text-center text-sm font-medium transition-all cursor-pointer"
                >
                  <div>{type.label.en}</div>
                  <div className="text-xs mt-1 font-arabic">{type.label.ar}</div>
                </button>
              ))}
            </div>
            <input type="text" name="otherCompanyWorker" value={formData.otherCompanyWorker} onChange={handleInputChange} placeholder="Other type" className="form-input" />
          </div>
        )}

        {/* Job Type and Current Location */}
        <div className="form-row-2">
          <div className="form-group">
            <label><span>Job Type</span> {formData.jobType && <Check className="check-icon" />}</label>
            {renderDropdown('jobType', jobTypes, formData.jobType)}
          </div>
          <div className="form-group">
            <label><span>Current Location</span> {formData.currentLocation && <Check className="check-icon" />}</label>
            {renderDropdown('currentLocation', allCountriesData, formData.currentLocation)}
          </div>
        </div>

        {/* Hourly Rate (if job type is hourly) */}
        {formData.jobType === 'hourlybasis' && (
          <div className="form-group">
            <label><span>Hourly Rate</span> {formData.hourlyRate && <Check className="check-icon" />}</label>
            <div className="flex gap-2">
              <input type="number" name="hourlyRate" value={formData.hourlyRate || ''} onChange={handleInputChange} className="form-input flex-1" />
              <select name="hourlyRateCurrency" value={formData.hourlyRateCurrency} onChange={handleInputChange} className="form-input w-24">
                {currencyOptions.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
        )}

        {/* Other Countries Workers Details */}
        <div className="form-group">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="font-medium text-blue-700">Other Countries Workers Details (Max 5)</span>
              <button
                type="button"
                onClick={() => setIsOtherCountriesOpen(!isOtherCountriesOpen)}
                style={{
                  background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
                  color: 'white',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  border: 'none',
                  cursor: 'pointer'
                }}
                className="flex items-center gap-1 transition-all"
              >
                <span className={`transition-transform duration-200 ${isOtherCountriesOpen ? 'rotate-45' : ''}`}>+</span>
                Add
              </button>
            </div>
            
            {isOtherCountriesOpen && (
              <div className="mt-4 space-y-4">
                {formData.otherCountriesWorkersDetails.map((item, index) => (
                  <div key={index} className="border p-3 rounded-lg flex flex-wrap md:flex-nowrap gap-4">
                    {/* Country Select */}
                    <div className="flex-grow min-w-[180px]">
                      <label className="block text-sm mb-1">Country / البلد</label>
                      <select
                        value={item.country}
                        onChange={(e) => {
                          const newDetails = [...formData.otherCountriesWorkersDetails];
                          newDetails[index].country = e.target.value;
                          setFormData(prev => ({ ...prev, otherCountriesWorkersDetails: newDetails }));
                        }}
                        className="w-full p-2 border rounded bg-white text-sm"
                      >
                        <option value="">Select Country</option>
                        {allCountriesData.map(c => (
                          <option key={c.value} value={c.value}>{c.label.en}</option>
                        ))}
                      </select>
                    </div>
                    {/* Salary */}
                    <div className="flex-grow min-w-[150px]">
                      <label className="block text-sm mb-1">Salary / الراتب</label>
                      <div className="flex">
                        <input
                          type="text"
                          className="w-full p-2 border rounded-l text-sm"
                          value={item.salary}
                          onChange={(e) => {
                            const newDetails = [...formData.otherCountriesWorkersDetails];
                            newDetails[index].salary = e.target.value;
                            setFormData(prev => ({ ...prev, otherCountriesWorkersDetails: newDetails }));
                          }}
                          placeholder="Salary"
                        />
                        <select
                          className="p-2 border rounded-r min-w-[60px] text-sm"
                          value={item.salaryCurrency}
                          onChange={(e) => {
                            const newDetails = [...formData.otherCountriesWorkersDetails];
                            newDetails[index].salaryCurrency = e.target.value;
                            setFormData(prev => ({ ...prev, otherCountriesWorkersDetails: newDetails }));
                          }}
                        >
                          {currencyOptions.map((currency) => (
                            <option key={currency} value={currency}>{currency}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    {/* Manpower Fees */}
                    <div className="flex-grow min-w-[150px]">
                      <label className="block text-sm mb-1">Manpower Fees / رسوم الوكالة</label>
                      <div className="flex">
                        <input
                          type="text"
                          className="w-full p-2 border rounded-l text-sm"
                          value={item.manpowerFees}
                          onChange={(e) => {
                            const newDetails = [...formData.otherCountriesWorkersDetails];
                            newDetails[index].manpowerFees = e.target.value;
                            setFormData(prev => ({ ...prev, otherCountriesWorkersDetails: newDetails }));
                          }}
                          placeholder="Fee"
                        />
                        <select
                          className="p-2 border rounded-r min-w-[60px] text-sm"
                          value={item.manpowerFeesCurrency}
                          onChange={(e) => {
                            const newDetails = [...formData.otherCountriesWorkersDetails];
                            newDetails[index].manpowerFeesCurrency = e.target.value;
                            setFormData(prev => ({ ...prev, otherCountriesWorkersDetails: newDetails }));
                          }}
                        >
                          {currencyOptions.map((currency) => (
                            <option key={currency} value={currency}>{currency}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    {/* Remove Button */}
                    {formData.otherCountriesWorkersDetails.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const newDetails = formData.otherCountriesWorkersDetails.filter((_, i) => i !== index);
                          setFormData(prev => ({ ...prev, otherCountriesWorkersDetails: newDetails }));
                        }}
                        className="self-center text-red-500 hover:text-red-700 font-bold"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                {formData.otherCountriesWorkersDetails.length < 5 && (
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        otherCountriesWorkersDetails: [
                          ...prev.otherCountriesWorkersDetails,
                          { country: '', salary: '', salaryCurrency: 'QAR', manpowerFees: '', manpowerFeesCurrency: 'QAR' }
                        ]
                      }));
                    }}
                    style={{
                      background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
                      color: 'white',
                      padding: '0.5rem 1rem',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                      border: 'none',
                      cursor: 'pointer',
                      marginTop: '0.5rem'
                    }}
                    className="transition-all"
                  >
                    Add Country / إضافة بلد
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Probation Period and Horoscope */}
        <div className="form-row-2">
          <div className="form-group">
            <label>Probation Period (Months)</label>
            <input type="number" name="probationPeriod" value={formData.probationPeriod || ''} onChange={handleInputChange} min="0" className="form-input" placeholder="Enter months" />
          </div>
          <div className="form-group">
            <label>Horoscope</label>
            <select name="horoscope" value={formData.horoscope} onChange={handleInputChange} className="form-input">
              <option value="">Select...</option>
              {horoscopeOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label.en}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Reference Name */}
        <div className="form-group">
          <label>Reference Name</label>
          <input type="text" name="referenceName" value={formData.referenceName} onChange={handleInputChange} className="form-input" placeholder="Enter reference name" />
          <div className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              id="isReferenceNameVisible"
              name="isReferenceNameVisible"
              checked={formData.isReferenceNameVisible}
              onChange={(e) => setFormData(prev => ({ ...prev, isReferenceNameVisible: e.target.checked }))}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="isReferenceNameVisible" className="text-sm font-medium text-gray-700">
              Make reference name visible to clients
            </label>
          </div>
        </div>

        {/* About Maid */}
        <div className="form-group">
          <label>About Maid</label>
          <textarea name="aboutWorker" value={formData.aboutWorker} onChange={handleInputChange} rows={4} className="form-textarea" placeholder="Tell us about the maid..." />
        </div>

        {/* Submit Buttons */}
        <div className="form-actions">
          <button type="button" onClick={onCancel} className="btn-cancel">
            <ArrowLeft size={16} /> Cancel
          </button>
          <button type="submit" className="btn-submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Worker'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminManpowerForm;
