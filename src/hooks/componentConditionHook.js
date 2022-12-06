import { useState } from 'react';

function useComponentCondition() {
  const [loadingValue, setLoadingValue] = useState(true);
  const [errorValue, setErrorValue] = useState(false);

  // Loading managment
  const startLoading = () => {
    setLoadingValue(true);
    onErrorUnSet();
  };
  const stopLoading = () => setLoadingValue(false);

  // Error managment
  const onErrorSet = () => {
    stopLoading();
    setErrorValue(true);
  };
  const onErrorUnSet = () => setErrorValue(false);

  return {
    loadingValue,
    errorValue,
    onErrorSet,
    onErrorUnSet,
    startLoading,
    stopLoading,
  };
}

export default useComponentCondition;
