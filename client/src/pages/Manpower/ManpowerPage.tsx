import React, { useState, useEffect } from 'react';
import { Users, Search } from 'lucide-react';
import ManpowerFilter from '../../components/ManpowerFilter/ManpowerFilter';
import ManpowerCard from '../../components/ManpowerCard/ManpowerCard';
import { API_ENDPOINTS } from '../../config/api';
import './ManpowerPage.css';

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
  type?: string;
  workerCategory?: string;
  maritalStatus: string;
  religion: string;
}

interface FilterOptions {
  types: string[];
  nationalities: string[];
  occupations: string[];
  genders: string[];
}

interface Filters {
  workerCategory: string;
  nationality: string;
  gender: string;
  jobTitle: string;
  maritalStatus: string;
  minAge: string;
  maxAge: string;
  search: string;
}

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

const ManpowerPage: React.FC = () => {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    types: [],
    nationalities: [],
    occupations: [],
    genders: [],
  });
  const [filters, setFilters] = useState<Filters>({
    workerCategory: '',
    nationality: '',
    gender: '',
    jobTitle: '',
    maritalStatus: '',
    minAge: '',
    maxAge: '',
    search: '',
  });

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  useEffect(() => {
    fetchWorkers(1);
  }, [filters]);

  const fetchFilterOptions = async () => {
    try {
      const response = await fetch(`${API_ENDPOINTS.MANPOWER}/filters/options`);
      if (!response.ok) throw new Error('Failed to fetch filter options');
      const data = await response.json();
      setFilterOptions(data);
    } catch (error) {
      console.error('Error fetching filter options:', error);
    }
  };

  const fetchWorkers = async (page = 1) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          queryParams.append(key, value);
        }
      });
      
      queryParams.append('page', String(page));
      queryParams.append('limit', '20');

      const url = `${API_ENDPOINTS.MANPOWER}?${queryParams.toString()}`;
      const response = await fetch(url);

      if (!response.ok) throw new Error('Failed to fetch workers');

      const result = await response.json();
      
      if (result.data && result.pagination) {
        setWorkers(result.data);
        setPagination(result.pagination);
      } else {
        setWorkers(Array.isArray(result) ? result : []);
      }
    } catch (error) {
      setError('Failed to load workers');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  return (
    <div className="manpower-page">
      {/* Hero Section */}
      <section className="manpower-hero-section">
        <div className="container">
          <div className="manpower-hero-content">
            <h1>Available Manpower</h1>
            <p>Find skilled and experienced workers for your requirements</p>
          </div>
        </div>
      </section>

      {/* Manpower Section */}
      <section className="section manpower-section">
        <div className="container">
          <h2 className="section-title">Available Workers ({loading ? '...' : workers.length})</h2>
          <div className="manpower-layout">
          <aside className="manpower-sidebar">
            <ManpowerFilter
              filters={filters}
              onFilterChange={handleFilterChange}
              filterOptions={filterOptions}
            />
          </aside>

          <main className="manpower-main">

            {/* <div className="manpower-header">
              <h2>
                Available Workers ({loading ? '...' : workers.length})
              </h2>
            </div> */}

            {error && (
              <div className="error-message">
                <p>{error}</p>
              </div>
            )}

            {loading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading workers...</p>
              </div>
            ) : workers.length === 0 ? (
              <div className="empty-state">
                <Search size={64} />
                <h3>No Workers Found</h3>
                <p>Try adjusting your filters to see more results</p>
              </div>
            ) : (
              <>
                <div className="manpower-grid">
                  {workers.map((worker) => (
                    <ManpowerCard key={worker._id} worker={worker} />
                  ))}
                </div>
                
                {pagination.pages > 1 && (
                  <div className="pagination" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '2rem' }}>
                    <button 
                      onClick={() => fetchWorkers(pagination.page - 1)} 
                      disabled={pagination.page === 1}
                      style={{ padding: '0.5rem 1rem', cursor: pagination.page === 1 ? 'not-allowed' : 'pointer', opacity: pagination.page === 1 ? 0.5 : 1 }}
                    >
                      Previous
                    </button>
                    <span>
                      Page {pagination.page} of {pagination.pages} ({pagination.total} total)
                    </span>
                    <button 
                      onClick={() => fetchWorkers(pagination.page + 1)} 
                      disabled={pagination.page === pagination.pages}
                      style={{ padding: '0.5rem 1rem', cursor: pagination.page === pagination.pages ? 'not-allowed' : 'pointer', opacity: pagination.page === pagination.pages ? 0.5 : 1 }}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ManpowerPage;
