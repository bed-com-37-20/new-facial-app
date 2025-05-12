import { useDataQuery } from '@dhis2/app-runtime';

export const useFetchOrganisationUnits = () => {
    const query = {
        organisationUnits: {
            resource: 'organisationUnits',
            params: {
                fields: 'id,displayName,path',
                paging: 'false',
            },
        },
    };

    const { loading, error, data } = useDataQuery(query);

    return {
        loading,
        error,
        organisationUnits: data?.organisationUnits?.organisationUnits || [],
    };
};

export const useFetchPrograms = () => {
    const query = {
        programs: {
            resource: 'programs',
            params: {
                fields: 'id,displayName,programType',
                paging: 'false',
            },
        },
    };

    const { loading, error, data } = useDataQuery(query);

    return {
        loading,
        error,
        programs: data?.programs?.programs || [],
    };
};