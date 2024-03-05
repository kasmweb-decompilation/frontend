import React from "react";
import {useTranslation} from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PageHeader, { parentRoutes } from "../../../components/Header/PageHeader";
import { Form } from "../../../components/Form/Form.js"
import { faPlug } from '@fortawesome/free-solid-svg-icons/faPlug';
import { createConnectionProxy } from "../../../actions/actionConnectionProxies";
import ConnectionProxyForm from "../ConnectionProxyForm/ConnectionProxyForm";

const parentRouteList = parentRoutes('/connection_proxies')
const newRoutes = [
    ...parentRouteList.routes,
    {name: "generic.create",path:"/create_connection_proxy",isActive: true},
];

const tabList = [
    { name: 'generic.create', key: 'form' },
]

export default function CreateConnectionProxy(props) {
    const { t } = useTranslation('common');

    const onSuccess = () => {
        props.history.push('/connection_proxies');
    }

    return (
        <div>
        <PageHeader location={props.location} routes={typeof newRoutes !== 'undefined' ? newRoutes : null} title={t('connection_proxies.create-connection-proxy')} icon={<FontAwesomeIcon icon={faPlug} />} />
        <Form 
            tabList={tabList}
            currentTab="form"
            section="connection_proxies"
            dispatchFunc={createConnectionProxy}
            onSuccess={onSuccess}
            form={<ConnectionProxyForm />}
        />
    </div>
    )
}
