import { useDataQuery } from '@dhis2/app-runtime';
import { useState, useEffect, useCallback } from 'react';

interface Attribute {
    code: string;
    value: string;
    displayName: string;
}

interface TrackedEntityInstance {
    trackedEntityInstance: string;
    orgUnit: string;
    attributes: Attribute[];
}

interface FetchTrackedEntityInstancesResult {
    loading: boolean;
    error: Error | null;
    trackedEntityInstances: TrackedEntityInstance[];
    refetch: (orgUnitId: string) => void;
}

const TEI_QUERY = {
    trackedEntityInstances: {
        resource: 'trackedEntityInstances',
        params: ({ orgUnitId }: { orgUnitId: string }) => ({
            ou: orgUnitId,
            // program: 'N6eVEDUrpYU',
            // fields: '*',
        }),
    },
};

const useFetchTrackedEntityInstances = (): FetchTrackedEntityInstancesResult => {
    const [orgUnitId, setOrgUnitId] = useState<string>('');
    const [forceRefetch, setForceRefetch] = useState(0);
    const { loading, error, data, refetch } = useDataQuery(TEI_QUERY, {
        variables: { orgUnitId },
        lazy: true,
    });

    const refetchTrackedEntities = useCallback((newOrgUnitId: string) => {
        setOrgUnitId(newOrgUnitId);
        setForceRefetch(prev => prev + 1); // Force refetch when orgUnit changes
    }, []);

    useEffect(() => {
        if (orgUnitId) {
            refetch({ orgUnitId });
        }
    }, [orgUnitId, refetch, forceRefetch]);

    return {
        loading,
        error,
        trackedEntityInstances: data?.trackedEntityInstances?.trackedEntityInstances || [],
        refetch: refetchTrackedEntities,
    };
};

export default useFetchTrackedEntityInstances;