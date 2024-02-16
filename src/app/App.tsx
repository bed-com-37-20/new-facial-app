import React from 'react'
import "./App.module.css"
import 'bootstrap/dist/css/bootstrap.min.css';
import "react-select/dist/react-select.css";
import "../assets/style/globalStyle.css"
import { Router } from '../components';
import { RecoilRoot } from 'recoil';
import { DataStoreProvider } from "@dhis2/app-service-datastore";
import { CircularLoader, CenteredContent } from "@dhis2/ui";
import AppWrapper from './AppWrapper';

export default function App() {
    return (
        <DataStoreProvider
            namespace="emis-apps-configuration"
            loadingComponent={
                <CenteredContent>
                    <CircularLoader />
                </CenteredContent>
            }
        >
            <RecoilRoot>
                <AppWrapper>
                    <Router />
                </AppWrapper>
            </RecoilRoot>
        </DataStoreProvider>
    )
}
