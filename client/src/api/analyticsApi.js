import axios from 'axios';
import { useEffect, useState } from 'react';

export const useTaskStatusByTeam = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatusData = async () => {
      try {
        const res = await axios.get('/api/analytics/task-status-by-team');
        setData(res.data);
      } catch (err) {
        console.error('Failed to fetch task status data', err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatusData();
  }, []);

  return { data, isLoading, error };
};
