import React,{ useState } from "react";
import {useTranslation} from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PageHeader, { parentRoutes } from "../../../components/Header/PageHeader";
import { Form } from "../../../components/Form"
import { faServer } from '@fortawesome/free-solid-svg-icons/faServer';
import { createServer } from "../../../actions/actionServer";
import ServerForm from "../ServerForm/ServerForm";

const parentRouteList = parentRoutes('/servers')
const newRoutes = [
    ...parentRouteList.routes,
    {name: "generic.create",path:"/create_server",isActive: true},
];

const tabList = [
    { name: 'generic.create', key: 'form' },
]
  
export default function CreateServer(props) {
    const { t } = useTranslation('common');

    const onSuccess = () => {
        props.history.push('/servers');
    }

    return (
        <div>
        <PageHeader location={props.location} routes={typeof newRoutes !== 'undefined' ? newRoutes : null} title={t('servers.create-server')} icon={<FontAwesomeIcon icon={faServer} />} />
        <Form 
            tabList={tabList}
            currentTab="form"
            section="servers"
            userData={{
                server_type: "Desktop"
            }}
            title="create-server"
            successMessage="successfully-created-server"
            dispatchFunc={createServer}
            onSuccess={onSuccess}
            form={<ServerForm />}
        />
    </div>
    )
}
