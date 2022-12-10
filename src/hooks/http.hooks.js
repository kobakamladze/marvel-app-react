import axios from 'axios';
import { useCallback, useState } from 'react';

function useHttp() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const request = useCallback(url => {
    setLoading(() => true);

    return axios
      .get(url)
      .then(({ data: { data: response } }) => response)
      .catch(() => setError(() => true))
      .finally(() => setLoading(() => false));
  }, []);

  const clearError = useCallback(() => setError(() => false), []);

  return { loading, error, request, clearError };
}

export default useHttp;
