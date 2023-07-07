import React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { RouteList } from '.';

function Router() {
    return (
        <HashRouter>
            <Routes>
                {
                    RouteList().map((route, index) => (
                        <Route
                            key={index}
                            path={route.path}
                            element={
                                <route.layout>
                                    {route.component()}
                                </route.layout>
                            }
                        />
                    ))
                }
            </Routes>
        </HashRouter>
    )
}
export { Router }
