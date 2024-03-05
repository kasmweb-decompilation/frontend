import React from "react";
import {useTranslation} from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PageHeader, { parentRoutes } from "../../../components/Header/PageHeader";
import { Form } from "../../../components/Form/Form.js"
import { faMap } from '@fortawesome/free-solid-svg-icons/faMap';
import { createZone } from "../../../actions/actionZones";
import ZoneForm from "../ZoneForm/ZoneForm";

const parentRouteList = parentRoutes('/zones')
const newRoutes = [
    ...parentRouteList.routes,
    {name: "generic.create",path:"/createzone",isActive: true},
];

const tabList = [
    { name: 'generic.create', key: 'form' },
]

export default function CreateServer(props) {
    const { t } = useTranslation('common');

    const onSuccess = () => {
        props.history.push('/zones');
    }

    return (
        <div>
        <PageHeader location={props.location} routes={typeof newRoutes !== 'undefined' ? newRoutes : null} title={t('zones.create-deployment-zone')} icon={<FontAwesomeIcon icon={faMap} />} />
        <Form 
            tabList={tabList}
            currentTab="form"
            section="zones"
            dispatchFunc={createZone}
            onSuccess={onSuccess}
            form={<ZoneForm />}
        />
    </div>
    )
}
