import React,{ useState } from "react";
import {updateStagingConfig} from "../../../actions/actionStaging";
import StagingConfigForm from "../StagingConfigForm/StagingConfigForm";
import {useTranslation} from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMap } from '@fortawesome/pro-light-svg-icons/faMap';
import PageHeader, { parentRoutes } from "../../../components/Header/PageHeader";
import { Form } from "../../../components/Form"

const parentRouteList = parentRoutes('/staging')
const newRoutes = [
    ...parentRouteList.routes,
    {name: "generic.update",path:"/updatestaging",isActive: true},
];

export default function UpdateStagingConfig(props) {
    const [currentTab, setCurrentTab] = useState('form');
    const { t } = useTranslation('common');
    
    const tabList = [
        { name: 'buttons.Edit', key: 'form' },
    ]
    
    const userData = {
        staging_config_id: props.match.params.id
    }
    const onSuccess = () => {
        props.history.push('/staging');
    }

    const dataTransform = (userData) => {
        if (userData.server_pool_id === '') {
            userData.server_pool_id = null;
        }
        if (userData.autoscale_config_id === '') {
            userData.autoscale_config_id = null;
        }
        if (userData.zone_id === '') {
            userData.zone_id = null;
        }
        return userData
    }

    return (
        <div>
            <PageHeader location={props.location} routes={typeof newRoutes !== 'undefined' ? newRoutes : null} title={t('staging.update-staging-config')} icon={<FontAwesomeIcon icon={faMap} />} />
            <Form 
                tabList={tabList}
                currentTab={currentTab}
                userData={userData}
                section="staging"
                dataTransform={dataTransform}
                type="update"
                dispatchFunc={updateStagingConfig}
                onSuccess={onSuccess}
                form={<StagingConfigForm stagingConfigId={props.match.params.id} />}
            />
        </div>

    )
}
