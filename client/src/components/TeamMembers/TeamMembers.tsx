import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS, ASSETS_CONFIG } from '../../config/api';
import './TeamMembers.css';

interface TeamMember {
  _id: string;
  name: string;
  role: string;
  image: string;
  bio: string;
}

const TeamMembers: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINTS.TEAM_MEMBERS);

      if (!response.ok) {
        throw new Error('Failed to fetch team members');
      }

      const data = await response.json();
      setTeamMembers(data);
    } catch (error) {
      setError('Failed to load team members');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="section team-section">
        <div className="container">
          <h2 className="section-title">Our Leadership Team</h2>
          <div className="team-loading">Loading team members...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="section team-section">
        <div className="container">
          <h2 className="section-title">Our Leadership Team</h2>
          <div className="team-error">{error}</div>
        </div>
      </section>
    );
  }

  return (
    <section className="section team-section">
      <div className="container">
        <h2 className="section-title">Our Leadership Team</h2>
        <div className="team-grid">
          {teamMembers.length === 0 ? (
            <p>No team members available at the moment.</p>
          ) : (
            teamMembers.map((member) => (
              <div key={member._id} className="team-member">
                <div className="member-image">
                  <img 
                    src={`${ASSETS_CONFIG.BASE_URL}${member.image}`}
                    alt={member.name}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-avatar.png';
                    }}
                  />
                </div>
                <h3 className="member-name">{member.name}</h3>
                <p className="member-role">{member.role}</p>
                {/* {member.bio && (
                  <p className="member-bio">{member.bio}</p>
                )} */}
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default TeamMembers;
