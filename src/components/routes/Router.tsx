import React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import RouteList from './RouteList';

export default function Router() {
    return (
        <HashRouter>
            <Routes>
                {
                    RouteList().map((route, index) => (
                        route && (
                            <Route
                                key={index}
                                path={route.path}
                                element={
                                    <route.layout>
                                        
                                        {route.component()}
                                    </route.layout>
                                }
                            />
                        )
                    ))
                }
            </Routes>
        </HashRouter>
    )
}
