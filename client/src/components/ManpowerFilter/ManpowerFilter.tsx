import React, { useState, useEffect } from 'react';
import { Filter, X } from 'lucide-react';
import './ManpowerFilter.css';

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

interface ManpowerFilterProps {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
  filterOptions: FilterOptions;
}

const ManpowerFilter: React.FC<ManpowerFilterProps> = ({
  filters,
  onFilterChange,
  filterOptions,
}) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Local staged filters - user can change these and then click Apply
  const [localFilters, setLocalFilters] = useState<Filters>(filters);

  // Keep local staged filters in sync when parent applies new filters
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleLocalChange = (key: keyof Filters, value: string) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    const cleared: Filters = {
      workerCategory: '',
      nationality: '',
      gender: '',
      jobTitle: '',
      maritalStatus: '',
      minAge: '',
      maxAge: '',
      search: '',
    };
    // Clear applied filters immediately and also clear staged filters
    onFilterChange(cleared);
    setLocalFilters(cleared);
  };

  const applyFilters = () => {
    onFilterChange(localFilters);
    setIsMobileOpen(false);
  };

  const cancelFilters = () => {
    // Revert staged changes to currently applied filters and close
    setLocalFilters(filters);
    setIsMobileOpen(false);
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <>
      {/* Mobile Filter Toggle Button */}
      <button
        className="mobile-filter-toggle"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        <Filter size={20} />
        <span>Filters</span>
        {hasActiveFilters && <span className="filter-badge">{Object.values(filters).filter(v => v).length}</span>}
      </button>

      {/* Filter Sidebar */}
      <div className={`manpower-filter ${isMobileOpen ? 'mobile-open' : ''}`}>
        <div className="filter-header">
          <div className="filter-title">
            <Filter size={20} />
            <h3>Filters</h3>
          </div>
          <button
            className="mobile-close-btn"
            onClick={() => cancelFilters()}
          >
            <X size={20} />
          </button>
        </div>

        

        <div className="filter-group">
          <label htmlFor="search">Search</label>
          <input
            type="text"
            id="search"
            placeholder="Search by name, role..."
            value={localFilters.search}
            onChange={(e) => handleLocalChange('search', e.target.value)}
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <label htmlFor="workerCategory">Worker Category</label>
          <select
            id="workerCategory"
            value={localFilters.workerCategory}
            onChange={(e) => handleLocalChange('workerCategory', e.target.value)}
            className="filter-select"
          >
            <option value="">All Categories</option>
            {filterOptions?.types?.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="jobTitle">Job Title</label>
          <select
            id="jobTitle"
            value={localFilters.jobTitle}
            onChange={(e) => handleLocalChange('jobTitle', e.target.value)}
            className="filter-select"
          >
            <option value="">All Job Titles</option>
            {filterOptions?.occupations?.map((occupation) => (
              <option key={occupation} value={occupation}>
                {occupation}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="nationality">Nationality</label>
          <select
            id="nationality"
            value={localFilters.nationality}
            onChange={(e) => handleLocalChange('nationality', e.target.value)}
            className="filter-select"
          >
            <option value="">All Nationalities</option>
            {filterOptions?.nationalities?.map((nationality) => (
              <option key={nationality} value={nationality}>
                {nationality}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="gender">Gender</label>
          <select
            id="gender"
            value={localFilters.gender}
            onChange={(e) => handleLocalChange('gender', e.target.value)}
            className="filter-select"
          >
            <option value="">All Genders</option>
            {filterOptions?.genders?.map((gender) => (
              <option key={gender} value={gender}>
                {gender}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="maritalStatus">Marital Status</label>
          <select
            id="maritalStatus"
            value={localFilters.maritalStatus}
            onChange={(e) => handleLocalChange('maritalStatus', e.target.value)}
            className="filter-select"
          >
            <option value="">All</option>
            <option value="Single">Single</option>
            <option value="Married">Married</option>
            <option value="Divorced">Divorced</option>
            <option value="Widowed">Widowed</option>
          </select>
        </div>



        <div className="filter-group">
          <label>Age Range</label>
          <div className="age-range-inputs">
            <input
              type="number"
              placeholder="Min"
              value={localFilters.minAge}
              onChange={(e) => handleLocalChange('minAge', e.target.value)}
              className="filter-input age-input"
              min="18"
              max="65"
            />
            <span className="age-separator">-</span>
            <input
              type="number"
              placeholder="Max"
              value={localFilters.maxAge}
              onChange={(e) => handleLocalChange('maxAge', e.target.value)}
              className="filter-input age-input"
              min="18"
              max="65"
            />
          </div>
        </div>

        {/* Action Buttons (Clear + Apply) */}
        <div className="filter-actions" style={{ display: 'flex', gap: 10, marginTop: 6 }}>
          <button className="reset-filters-btn" onClick={resetFilters} style={{ flex: 1 }}>
            Clear
          </button>
          <button className="reset-filters-btn" onClick={applyFilters} style={{ flex: 1, background: 'var(--primary-red)', color: '#fff' }}>
            Apply
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="mobile-filter-overlay"
          onClick={() => cancelFilters()}
        />
      )}
    </>
  );
};

export default ManpowerFilter;
