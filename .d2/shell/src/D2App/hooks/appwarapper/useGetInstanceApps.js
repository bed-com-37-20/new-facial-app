import { useSetRecoilState } from 'recoil';
import { useState, useEffect } from 'react';
import { useDataEngine } from "@dhis2/app-runtime";
import { InstanceAppState } from '../../schema/instanceAppsSchema';
const ModulesQuery = {
  results: {
    resource: "apps"
  }
};
const useGetInstanceApps = () => {
  const engine = useDataEngine();
  const [error, setError] = useState(false);
  const setData = useSetRecoilState(InstanceAppState);
  const [loading, setLoading] = useState(false);
  const getInstanceApps = async () => {
    await engine.query(ModulesQuery, {
      onComplete: response => {
        setData(response === null || response === void 0 ? void 0 : response.results);
        setLoading(false);
      },
      onError: () => {
        setError(true);
        setLoading(false);
      }
    });
  };
  useEffect(() => {
    getInstanceApps();
  }, []);
  return {
    loading,
    error
  };
};
export { useGetInstanceApps };