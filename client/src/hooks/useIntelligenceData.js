import { useEffect, useState } from 'react';
import { intelligenceService } from '../services/intelligenceService';
import { extractErrorMessage } from '../services/api';

const useIntelligenceData = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const payload = await intelligenceService.getOverview();
        setData(payload);
      } catch (err) {
        setError(extractErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return {
    data,
    error,
    loading,
    setError,
  };
};

export default useIntelligenceData;
