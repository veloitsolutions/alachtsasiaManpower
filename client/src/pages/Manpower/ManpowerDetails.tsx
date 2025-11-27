import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, MapPin, Briefcase, DollarSign, User, Calendar,
  Heart, BookOpen, Globe, Phone, Award, FileText, Download
} from 'lucide-react';
import { API_ENDPOINTS, ASSETS_CONFIG } from '../../config/api';
import './ManpowerDetails.css';

const capitalizeFirst = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

interface Worker {
  _id: string;
  nameEng?: string;
  nameArabic?: string;
  name: string;
  photo?: string;
  passportPhoto?: string;
  fullPhoto?: string;
  nationality: string;
  jobTitle?: string | string[];
  jobType?: string;
  age: number;
  gender: string;
  experience: string;
  gulfExperience?: string[];
  salary: string;
  salaryCurrency?: string;
  manpowerFees: string;
  manpowerFeesCurrency?: string;
  agencyFeeOption?: string;
  hourlyRate?: number;
  hourlyRateCurrency?: string;
  type?: string;
  workerCategory?: string;
  otherWorkerCategory?: string;
  companyWorker?: string;
  otherCompanyWorker?: string;
  maritalStatus: string;
  numberOfChildren?: number;
  religion: string;
  skills?: string[];
  languages: string[];
  education?: string;
  description?: string;
  aboutWorker?: string;
  candidateContactNumber?: string;
  candidateContactNumber2?: string;
  countryCode?: string;
  countryCode2?: string;
  isContactNumberVisible?: boolean;
  whatsappNumber?: string;
  previousEmployers?: string;
  resume?: string;
  video?: string;
  videoFile?: string;
  currentLocation?: string;
  drivingLicense?: string[];
  horoscope?: string;
  probationPeriod?: number;
  referenceName?: string;
  isReferenceNameVisible?: boolean;
  offer?: string;
  otherCountriesWorkersDetails?: Array<{
    country: string;
    salary: string;
    salaryCurrency: string;
    manpowerFees: string;
    manpowerFeesCurrency: string;
  }>;
}

const ManpowerDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [worker, setWorker] = useState<Worker | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const fromAdmin = new URLSearchParams(window.location.search).get('from') === 'admin';

  useEffect(() => {
    if (id) {
      fetchWorkerDetails();
    }
  }, [id]);

  const fetchWorkerDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_ENDPOINTS.MANPOWER}/${id}`);

      if (!response.ok) throw new Error('Failed to fetch worker details');

      const data = await response.json();
      setWorker(data);
    } catch (error) {
      setError('Failed to load worker details');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="manpower-details-page">
        <div className="container">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading worker details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !worker) {
    return (
      <div className="manpower-details-page">
        <div className="container">
          <div className="error-state">
            <h2>Worker Not Found</h2>
            <p>{error || 'The requested worker could not be found.'}</p>
            <button onClick={() => navigate(fromAdmin ? '/admin/manpower' : '/manpower')} className="back-btn">
              Back to {fromAdmin ? 'Admin Panel' : 'Manpower'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="manpower-details-page">
      <div className="container">
        <button onClick={() => navigate(fromAdmin ? '/admin/manpower' : '/manpower')} className="back-button">
          <ArrowLeft size={20} />
          <span>Back to {fromAdmin ? 'Admin Panel' : 'Workers'}</span>
        </button>

        <div className="worker-details-grid">
          <div className="worker-sidebar">
            <div className="worker-image-section">
              <img
                src={`${ASSETS_CONFIG.BASE_URL}${worker.photo}`}
                alt={worker.name}
                className="worker-image"
                onClick={() => setIsPhotoModalOpen(true)}
                style={{ cursor: 'pointer' }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder-avatar.png';
                }}
              />
            </div>

            <div className="worker-quick-info">
              <h1>{worker.nameEng || worker.name}</h1>
              {worker.nameArabic && <h2 className="arabic-name">{worker.nameArabic}</h2>}
              <div className="tags-container" style={{ marginBottom: '24px' }}>
                {(Array.isArray(worker.jobTitle) ? worker.jobTitle : worker.jobTitle?.split(',')).map((job, index) => (
                  <span key={index} className="tag skill-tag">
                    {capitalizeFirst(typeof job === 'string' ? job.trim() : job)}
                  </span>
                ))}
              </div>
              
              <div className="info-items">
                <div className="info-item">
                  <User size={20} />
                  <div>
                    <span className="label">Age & Gender</span>
                    <span className="value">{worker.age} years • {worker.gender}</span>
                  </div>
                </div>
                
                <div className="info-item">
                  <MapPin size={20} />
                  <div>
                    <span className="label">Nationality</span>
                    <span className="value">{capitalizeFirst(worker.nationality)}</span>
                  </div>
                </div>
                
                
                <div className="info-item">
                  <Calendar size={20} />
                  <div>
                    <span className="label">Experience</span>
                    <span className="value">{worker.experience}</span>
                  </div>
                </div>
              </div>

              <div className="pricing-section">
                {worker.jobType !== 'hourlybasis' ? (
                  <div className="price-item">
                    <DollarSign size={20} />
                    <div>
                      <span className="label">Monthly Salary</span>
                      <span className="price">{worker.salary} {worker.salaryCurrency || ''}</span>
                    </div>
                  </div>
                ) : (
                  <div className="price-item">
                    <DollarSign size={20} />
                    <div>
                      <span className="label">Hourly Rate</span>
                      <span className="price">{worker.hourlyRate} {worker.hourlyRateCurrency || ''}/hr</span>
                    </div>
                  </div>
                )}
                <div className="price-item">
                  <Award size={20} />
                  <div>
                    <span className="label">Manpower Fees</span>
                    <span className="price">
                      {worker.agencyFeeOption ? worker.agencyFeeOption : `${worker.manpowerFees} ${worker.manpowerFeesCurrency || ''}`}
                    </span>
                  </div>
                </div>
              </div>

              {worker.resume && (
                <a
                  href={`${ASSETS_CONFIG.BASE_URL}${worker.resume}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="download-resume-btn"
                >
                  <Download size={20} />
                  Download Resume
                </a>
              )}
            </div>
          </div>

          <div className="worker-main-content">
            <section className="details-section">
              <h2>Personal Information</h2>
              <div className="details-grid">
                {worker.jobType && (
                  <div className="detail-item">
                    <Briefcase size={18} />
                    <div>
                      <span className="label">Job Type</span>
                      <span className="value">{worker.jobType}</span>
                    </div>
                  </div>
                )}
                
                <div className="detail-item">
                  <Heart size={18} />
                  <div>
                    <span className="label">Marital Status</span>
                    <span className="value">{worker.maritalStatus}</span>
                  </div>
                </div>
                
                {worker.numberOfChildren !== undefined && (
                  <div className="detail-item">
                    <User size={18} />
                    <div>
                      <span className="label">Number of Children</span>
                      <span className="value">{worker.numberOfChildren}</span>
                    </div>
                  </div>
                )}
                
                {worker.religion && (
                  <div className="detail-item">
                    <BookOpen size={18} />
                    <div>
                      <span className="label">Religion</span>
                      <span className="value">{capitalizeFirst(worker.religion)}</span>
                    </div>
                  </div>
                )}
                
                <div className="detail-item">
                  <FileText size={18} />
                  <div>
                    <span className="label">Worker Category</span>
                    <span className="value">{worker.otherWorkerCategory || worker.workerCategory || worker.type}</span>
                  </div>
                </div>
                
                {worker.companyWorker && (
                  <div className="detail-item">
                    <Briefcase size={18} />
                    <div>
                      <span className="label">Company Worker Type</span>
                      <span className="value">{worker.otherCompanyWorker || worker.companyWorker}</span>
                    </div>
                  </div>
                )}
                
                {worker.currentLocation && (
                  <div className="detail-item">
                    <MapPin size={18} />
                    <div>
                      <span className="label">Current Location</span>
                      <span className="value">{worker.currentLocation}</span>
                    </div>
                  </div>
                )}
                
                {worker.horoscope && (
                  <div className="detail-item">
                    <Award size={18} />
                    <div>
                      <span className="label">Horoscope</span>
                      <span className="value">{worker.horoscope}</span>
                    </div>
                  </div>
                )}
                
                {worker.probationPeriod && (
                  <div className="detail-item">
                    <Calendar size={18} />
                    <div>
                      <span className="label">Probation Period</span>
                      <span className="value">{worker.probationPeriod} months</span>
                    </div>
                  </div>
                )}

                {worker.isContactNumberVisible && worker.candidateContactNumber && (
                  <div className="detail-item">
                    <Phone size={18} />
                    <div>
                      <span className="label">Contact Number</span>
                      <span className="value">{worker.countryCode} {worker.candidateContactNumber}</span>
                    </div>
                  </div>
                )}
                
                {worker.isContactNumberVisible && worker.candidateContactNumber2 && (
                  <div className="detail-item">
                    <Phone size={18} />
                    <div>
                      <span className="label">Contact Number 2</span>
                      <span className="value">{worker.countryCode2} {worker.candidateContactNumber2}</span>
                    </div>
                  </div>
                )}
                
                {worker.whatsappNumber && (
                  <div className="detail-item">
                    <Phone size={18} />
                    <div>
                      <span className="label">WhatsApp</span>
                      <span className="value">{worker.whatsappNumber}</span>
                    </div>
                  </div>
                )}
                
                {worker.isReferenceNameVisible && worker.referenceName && (
                  <div className="detail-item">
                    <User size={18} />
                    <div>
                      <span className="label">Reference Name</span>
                      <span className="value">{worker.referenceName}</span>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {worker.gulfExperience && worker.gulfExperience.length > 0 && (
              <section className="details-section">
                <h2>
                  <Award size={20} />
                  Gulf Experience
                </h2>
                <div className="tags-container">
                  {worker.gulfExperience.map((country, index) => (
                    <span key={index} className="tag skill-tag">
                      {capitalizeFirst(country)}
                    </span>
                  ))}
                </div>
              </section>
            )}
            
            {worker.drivingLicense && worker.drivingLicense.length > 0 && (
              <section className="details-section">
                <h2>
                  <Award size={20} />
                  Driving License
                </h2>
                <div className="tags-container">
                  {worker.drivingLicense.map((license, index) => (
                    <span key={index} className="tag skill-tag">
                      {capitalizeFirst(license)}
                    </span>
                  ))}
                </div>
              </section>
            )}
            
            {worker.offer && (
              <section className="details-section">
                <h2>Special Offer</h2>
                <p className="description">{worker.offer}</p>
              </section>
            )}

            {(worker.aboutWorker || worker.description) && (
              <section className="details-section">
                <h2>About Worker</h2>
                <p className="description">{worker.aboutWorker || worker.description}</p>
              </section>
            )}

            {worker.skills && worker.skills.length > 0 && (
              <section className="details-section">
                <h2>Skills</h2>
                <div className="tags-container">
                  {worker.skills.map((skill, index) => (
                    <span key={index} className="tag skill-tag">
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {worker.languages && worker.languages.length > 0 && (
              <section className="details-section">
                <h2>
                  <Globe size={20} />
                  Languages
                </h2>
                <div className="tags-container">
                  {worker.languages.map((language, index) => (
                    <span key={index} className="tag language-tag">
                      {capitalizeFirst(language)}
                    </span>
                  ))}
                </div>
              </section>
            )}
            
            {worker.otherCountriesWorkersDetails && worker.otherCountriesWorkersDetails.length > 0 && worker.otherCountriesWorkersDetails.some(detail => detail.country && detail.salary && detail.manpowerFees) && (
              <section className="details-section">
                <h2>
                  <Globe size={20} />
                  Other Countries Details
                </h2>
                <div className="details-grid">
                  {worker.otherCountriesWorkersDetails.filter(detail => detail.country && detail.salary && detail.manpowerFees).map((detail, index) => (
                    <div key={index} className="detail-item">
                      <MapPin size={18} />
                      <div>
                        <span className="label">{detail.country}</span>
                        <span className="value">Salary: {detail.salary} {detail.salaryCurrency}</span>
                        <span className="value">Fees: {detail.manpowerFees} {detail.manpowerFeesCurrency}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
            
            {worker.fullPhoto && (
              <section className="details-section">
                <h2>Full Photo</h2>
                <div className="video-container">
                  <img
                    src={`${ASSETS_CONFIG.BASE_URL}${worker.fullPhoto}`}
                    alt={`${worker.name} - Full Photo`}
                    style={{ width: '100%', maxHeight: '600px', objectFit: 'contain', borderRadius: '8px' }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
              </section>
            )}
            
            {(worker.videoFile || worker.video) && (
              <section className="details-section">
                <h2>Video</h2>
                <div className="video-container">
                  <iframe
                    width="100%"
                    height="400"
                    src={(() => {
                      const url = worker.videoFile || worker.video || '';
                      if (url.includes('youtube.com/watch')) {
                        const videoId = url.split('v=')[1]?.split('&')[0];
                        return `https://www.youtube.com/embed/${videoId}`;
                      }
                      if (url.includes('youtu.be/')) {
                        const videoId = url.split('youtu.be/')[1]?.split('?')[0];
                        return `https://www.youtube.com/embed/${videoId}`;
                      }
                      if (url.includes('youtube.com/embed/')) return url;
                      return url;
                    })()}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </section>
            )}

            {worker.education && (
              <section className="details-section">
                <h2>Education</h2>
                <p className="education-text">{worker.education}</p>
              </section>
            )}

            {worker.previousEmployers && (
              <section className="details-section">
                <h2>Previous Employment</h2>
                <p className="previous-employers">{worker.previousEmployers}</p>
              </section>
            )}

            <section className="contact-section">
              <h2>Interested in hiring?</h2>
              <p>Contact us to discuss this worker's availability and requirements</p>
              <button
                onClick={() => navigate('/contact')}
                className="contact-btn"
              >
                Contact Us
              </button>
            </section>
          </div>
        </div>

        {isPhotoModalOpen && (
          <div className="photo-modal" onClick={() => setIsPhotoModalOpen(false)}>
            <div className="photo-modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="photo-modal-close" onClick={() => setIsPhotoModalOpen(false)}>&times;</button>
              <img
                src={`${ASSETS_CONFIG.BASE_URL}${worker.photo}`}
                alt={worker.name}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder-avatar.png';
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManpowerDetails;
