import './app.css'
import React from 'react'
import { Router } from '../components/routes'
import { useConfig } from '@dhis2/app-runtime'
import { AppWrapper } from 'dhis2-semis-components'
import { HashRouter } from 'react-router-dom'

const Transfer = () => {
    const { baseUrl } = useConfig()

    return (
        <AppWrapper baseUrl={baseUrl} dataStoreKey='dataStore/semis/values'>
            <HashRouter>
                <Router />
            </HashRouter>
        </AppWrapper>
    )
}

export default Transfer