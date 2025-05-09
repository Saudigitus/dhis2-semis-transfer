import React from 'react'
import './app.css'
import { AppWrapper } from 'dhis2-semis-components'
import { Router } from '../components/routes'

const MyApp = () => {

    return (
        <AppWrapper dataStoreKey='dataStore/semis/values'>
            <Router/>
        </AppWrapper>
    )
}

export default MyApp
