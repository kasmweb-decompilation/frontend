import React,{ useState } from "react";
import { updateZone } from "../../../actions/actionZones";
import ZoneForm from "../ZoneForm/ZoneForm";
import {useTranslation} from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMap } from '@fortawesome/pro-light-svg-icons/faMap';
import PageHeader, { parentRoutes } from "../../../components/Header/PageHeader";
import { Form } from "../../../components/Form"

const parentRouteList = parentRoutes('/zones')
const newRoutes = [
    ...parentRouteList.routes,
    {name: "generic.update",path:"/updatezone",isActive: true},
];

export default function UpdateServer(props) {
    const [currentTab, setCurrentTab] = useState('form');
    const { t } = useTranslation('common');
    
    const tabList = [
        { name: 'buttons.Edit', key: 'form' },
    ]
    
    const userData = {
    }
    const onSuccess = () => {
        props.history.push('/zones');
    }

    return (
        <div>
            <PageHeader location={props.location} routes={typeof newRoutes !== 'undefined' ? newRoutes : null} title={t('zones.update-deployment-zone')} icon={<FontAwesomeIcon icon={faMap} />} />
            <Form 
                tabList={tabList}
                currentTab={currentTab}
                userData={userData}
                section="zones"
                type="update"
                dispatchFunc={updateZone}
                onSuccess={onSuccess}
                form={<ZoneForm zoneId={props.match.params.id} />}
            />
        </div>

    )
}
