import { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config/api';

interface WorkerStats {
  workerId: string;
  workerNameEng: string;
  workerNameArabic: string;
  stats: {
    VIEW?: number;
    CALL?: number;
    SHARE?: number;
    WHATSAPP?: number;
    DOWNLOAD_RESUME?: number;
    [key: string]: number | undefined;
  };
}

interface UseAnalyticsDataReturn {
  workersData: WorkerStats[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const useAnalyticsData = (): UseAnalyticsDataReturn => {
  const [workersData, setWorkersData] = useState<WorkerStats[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const userInfoString = localStorage.getItem('userInfo');
  const userInfo = userInfoString ? JSON.parse(userInfoString) : null;
  const token = userInfo?.token;

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_ENDPOINTS.BASE_URL}/api/analytics/worker-data`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error('Session expired. Please sign in again.');
        }
        throw new Error('Failed to fetch analytics data');
      }

      const data = await response.json();
      setWorkersData(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
      console.error('Error fetching analytics data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  return {
    workersData,
    loading,
    error,
    refetch: fetchData
  };
};

export default useAnalyticsData;
