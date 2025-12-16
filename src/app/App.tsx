import './app.css'
import React from 'react'
import { Router } from '../components/routes'
import { AppWrapper } from 'dhis2-semis-components'
import { HashRouter } from 'react-router-dom'
import { useConfig } from '@dhis2/app-runtime'
import translation from '../locales/index'
import { D2I18n } from 'dhis2-semis-types'

const Transfer = ({ i18n }: { i18n: D2I18n }) => {
    const { baseUrl } = useConfig()
    const language: any = i18n == undefined ? translation : i18n

    return (
        // <AppWrapper
        //     i18n={i18n}
        //     baseUrl={baseUrl}
        //     dataStoreKey="dataStore/semis/values"
        //     schoolCalendarKey='dataStore/semis/schoolCalendar'
        // >
        //     <HashRouter>
                <Router i18n={language} />
        //     </HashRouter >
        // </AppWrapper>
    )
}

export default Transfer