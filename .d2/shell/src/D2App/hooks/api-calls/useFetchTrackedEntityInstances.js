import { useDataQuery } from '@dhis2/app-runtime';
import { useState, useEffect, useCallback } from 'react';
const TEI_QUERY = {
  trackedEntityInstances: {
    resource: 'trackedEntityInstances',
    params: _ref => {
      let {
        orgUnitId
      } = _ref;
      return {
        ou: orgUnitId
        // program: 'N6eVEDUrpYU',
        // fields: '*',
      };
    }
  }
};

const useFetchTrackedEntityInstances = () => {
  var _data$trackedEntityIn;
  const [orgUnitId, setOrgUnitId] = useState('');
  const [forceRefetch, setForceRefetch] = useState(0);
  const {
    loading,
    error,
    data,
    refetch
  } = useDataQuery(TEI_QUERY, {
    variables: {
      orgUnitId
    },
    lazy: true
  });
  const refetchTrackedEntities = useCallback(newOrgUnitId => {
    setOrgUnitId(newOrgUnitId);
    setForceRefetch(prev => prev + 1); // Force refetch when orgUnit changes
  }, []);
  useEffect(() => {
    if (orgUnitId) {
      refetch({
        orgUnitId
      });
    }
  }, [orgUnitId, refetch, forceRefetch]);
  return {
    loading,
    error,
    trackedEntityInstances: (data === null || data === void 0 ? void 0 : (_data$trackedEntityIn = data.trackedEntityInstances) === null || _data$trackedEntityIn === void 0 ? void 0 : _data$trackedEntityIn.trackedEntityInstances) || [],
    refetch: refetchTrackedEntities
  };
};
export default useFetchTrackedEntityInstances;