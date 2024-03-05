import React from "react";
import {useTranslation} from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PageHeader, { parentRoutes } from "../../../components/Header/PageHeader";
import { Form } from "../../../components/Form/Form.js"
import { faFlask } from '@fortawesome/free-solid-svg-icons/faFlask';
import {createStagingConfig} from '../../../actions/actionStaging';
import StagingConfigForm from "../StagingConfigForm/StagingConfigForm";

const parentRouteList = parentRoutes('/staging')
const newRoutes = [
    ...parentRouteList.routes,
    {name: "generic.create",path:"/createstaging",isActive: true},
];

export default function CreateStagingConfig(props) {
    const { t } = useTranslation('common');

    const tabList = [
        { name: 'generic.create', key: 'form' },
    ]    

    const onSuccess = () => {
        props.history.push('/staging');
    }

    return (
        <div>
        <PageHeader location={props.location} routes={typeof newRoutes !== 'undefined' ? newRoutes : null} title={t('staging.create-staging-config')} icon={<FontAwesomeIcon icon={faFlask} />} />
        <Form 
            tabList={tabList}
            currentTab="form"
            section="staging"
            dispatchFunc={createStagingConfig}
            onSuccess={onSuccess}
            form={<StagingConfigForm />}
        />
    </div>
    )
}
