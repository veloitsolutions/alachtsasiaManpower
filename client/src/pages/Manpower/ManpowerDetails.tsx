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
  name: string;
  image?: string;
  photo?: string;
  nationality: string;
  occupation?: string;
  jobTitle?: string;
  age: number;
  gender: string;
  experience: string;
  salary: string;
  manpowerFees: string;

  type?: string;
  workerCategory?: string;
  maritalStatus: string;
  numberOfChildren?: number;
  religion: string;
  skills?: string[];
  languages: string[];
  education?: string;
  description?: string;
  aboutWorker?: string;
  contactNumber: string;
  previousEmployers: string;
  resume: string;
}

const ManpowerDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [worker, setWorker] = useState<Worker | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
            <button onClick={() => navigate('/manpower')} className="back-btn">
              Back to Manpower
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="manpower-details-page">
      <div className="container">
        <button onClick={() => navigate('/manpower')} className="back-button">
          <ArrowLeft size={20} />
          <span>Back to Workers</span>
        </button>

        <div className="worker-details-grid">
          <div className="worker-sidebar">
            <div className="worker-image-section">
              <img
                src={`${ASSETS_CONFIG.BASE_URL}${worker.photo || worker.image}`}
                alt={worker.name}
                className="worker-image"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder-avatar.png';
                }}
              />

            </div>

            <div className="worker-quick-info">
              <h1>{capitalizeFirst(worker.name)}</h1>
              <div className="tags-container" style={{ marginBottom: '24px' }}>
                {(worker.jobTitle || worker.occupation)?.split(',').map((job, index) => (
                  <span key={index} className="tag skill-tag">
                    {capitalizeFirst(job.trim())}
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
                <div className="price-item">
                  <DollarSign size={20} />
                  <div>
                    <span className="label">Monthly Salary</span>
                    <span className="price">{worker.salary}</span>
                  </div>
                </div>
                <div className="price-item">
                  <Award size={20} />
                  <div>
                    <span className="label">Manpower Fees</span>
                    <span className="price">{worker.manpowerFees}</span>
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
                <div className="detail-item">
                  <Heart size={18} />
                  <div>
                    <span className="label">Marital Status</span>
                    <span className="value">{worker.maritalStatus}</span>
                  </div>
                </div>
                
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
                    <span className="value">{worker.workerCategory || worker.type}</span>
                  </div>
                </div>
                
                {worker.numberOfChildren !== undefined && worker.numberOfChildren > 0 && (
                  <div className="detail-item">
                    <User size={18} />
                    <div>
                      <span className="label">Number of Children</span>
                      <span className="value">{worker.numberOfChildren}</span>
                    </div>
                  </div>
                )}

                {worker.contactNumber && (
                  <div className="detail-item">
                    <Phone size={18} />
                    <div>
                      <span className="label">Contact</span>
                      <span className="value">{worker.contactNumber}</span>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {(worker.jobTitle || worker.occupation) && (
              <section className="details-section">
                <h2>
                  <Briefcase size={20} />
                  Job Titles
                </h2>
                <div className="tags-container">
                  {(worker.jobTitle || worker.occupation)?.split(',').map((job, index) => (
                    <span key={index} className="tag skill-tag">
                      {capitalizeFirst(job.trim())}
                    </span>
                  ))}
                </div>
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
      </div>
    </div>
  );
};

export default ManpowerDetails;
