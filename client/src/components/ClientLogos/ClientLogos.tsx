import React, { useState, useEffect } from "react";
import "./ClientLogos.css";
import { API_ENDPOINTS, ASSETS_CONFIG } from '../../config/api';

interface ClientLogo {
  _id?: string;
  name: string;
  logo: string;
}

const ClientLogos: React.FC = () => {
  const [clients, setClients] = useState<ClientLogo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchClientLogos = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.CLIENTS);

        if (!response.ok) {
          throw new Error('Failed to fetch client logos');
        }

        const data = await response.json();

        // Transform data to include full URL for logos
        const transformedData = data.map((client: ClientLogo) => ({
          ...client,
          logo: client.logo.includes('http') ? client.logo : `${ASSETS_CONFIG.BASE_URL}${client.logo}`
        }));

        setClients(transformedData);
      } catch (error) {
        console.error('Error fetching client logos:', error);
        setError('Failed to load client logos');

        // Fallback to default logos if API fails
        setClients([
          { name: "Client 1", logo: "/client/1.png" },
          { name: "Client 2", logo: "/client/2.png" },
          { name: "Client 3", logo: "/client/3.png" },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchClientLogos();
  }, []);

  return (
    <section className="clients-section">
      <div className="container">
        <h2 className="section-title">Trusted By Industry Leaders</h2>
        <p className="clients-description">
          We're proud to work with some of the world's most innovative companies
        </p>

        {loading ? (
          <div className="clients-loading">Loading client logos...</div>
        ) : error ? (
          <div className="clients-error">{error}</div>
        ) : clients.length === 0 ? (
          <div className="clients-empty">No client logos found.</div>
        ) : (
          <div className="clients-grid">
            {clients.map((client, index) => (
              <div key={client._id || index} className="client-logo">
                <img src={client.logo} alt={`${client.name} logo`} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ClientLogos;
