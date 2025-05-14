import './app.css'
import React from 'react'
import { Router } from '../components/routes'
import { AppWrapper } from 'dhis2-semis-components'

const Transfer = () => {

    return (
        <AppWrapper dataStoreKey='dataStore/semis/values'>
            <Router />
        </AppWrapper>
    )
}

export default Transfer
