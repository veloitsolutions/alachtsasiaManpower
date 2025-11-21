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

  const handleFilterChange = (key: keyof Filters, value: string) => {
    onFilterChange({
      ...filters,
      [key]: value,
    });
  };

  const resetFilters = () => {
    onFilterChange({
      workerCategory: '',
      nationality: '',
      gender: '',
      jobTitle: '',
      maritalStatus: '',
      minAge: '',
      maxAge: '',
      search: '',
    });
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
            onClick={() => setIsMobileOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {hasActiveFilters && (
          <button className="reset-filters-btn" onClick={resetFilters}>
            Clear All Filters
          </button>
        )}

        <div className="filter-group">
          <label htmlFor="search">Search</label>
          <input
            type="text"
            id="search"
            placeholder="Search by name, role..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <label htmlFor="workerCategory">Worker Category</label>
          <select
            id="workerCategory"
            value={filters.workerCategory}
            onChange={(e) => handleFilterChange('workerCategory', e.target.value)}
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
            value={filters.jobTitle}
            onChange={(e) => handleFilterChange('jobTitle', e.target.value)}
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
            value={filters.nationality}
            onChange={(e) => handleFilterChange('nationality', e.target.value)}
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
            value={filters.gender}
            onChange={(e) => handleFilterChange('gender', e.target.value)}
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
            value={filters.maritalStatus}
            onChange={(e) => handleFilterChange('maritalStatus', e.target.value)}
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
              value={filters.minAge}
              onChange={(e) => handleFilterChange('minAge', e.target.value)}
              className="filter-input age-input"
              min="18"
              max="65"
            />
            <span className="age-separator">-</span>
            <input
              type="number"
              placeholder="Max"
              value={filters.maxAge}
              onChange={(e) => handleFilterChange('maxAge', e.target.value)}
              className="filter-input age-input"
              min="18"
              max="65"
            />
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="mobile-filter-overlay"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
};

export default ManpowerFilter;
