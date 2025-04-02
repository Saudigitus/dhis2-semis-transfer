import React from 'react'
import './App.module.css'
import { AppWrapper } from 'dhis2-semis-components'
import TransferExecute from '../pages/trasferExecute/TransferExecute'
import { Router } from '../components/routes'

const MyApp = () => {

    return (
        <AppWrapper dataStoreKey='semis/values'>
            <Router/>
        </AppWrapper>
    )
}

export default MyApp
