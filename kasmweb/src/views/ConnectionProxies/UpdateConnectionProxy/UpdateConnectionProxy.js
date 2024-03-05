import React,{ useState } from "react";
import { updateConnectionProxy } from "../../../actions/actionConnectionProxies";
import ConnectionProxyForm from "../ConnectionProxyForm/ConnectionProxyForm";
import {useTranslation} from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlug } from '@fortawesome/free-solid-svg-icons/faPlug';
import PageHeader, { parentRoutes } from "../../../components/Header/PageHeader";
import { Form } from "../../../components/Form/Form.js"

const parentRouteList = parentRoutes('/connection_proxies')
const newRoutes = [
    ...parentRouteList.routes,
    {name: "generic.update",path:"/updateconnection_proxy",isActive: true},
];

export default function UpdateConnectionProxy(props) {
    const [currentTab, setCurrentTab] = useState('form');
    const { t } = useTranslation('common');
    
    const tabList = [
        { name: 'buttons.Edit', key: 'form' },
    ]
    
    const userData = {
        connection_proxy_id: props.match.params.id
    }
    const onSuccess = () => {
        props.history.push('/connection_proxies');
    }

    return (
        <div>
            <PageHeader location={props.location} routes={typeof newRoutes !== 'undefined' ? newRoutes : null} title={t('connection_proxies.update-connection-proxy')} icon={<FontAwesomeIcon icon={faPlug} />} />
            <Form 
                tabList={tabList}
                currentTab={currentTab}
                userData={userData}
                section="connection_proxies"
                type="update"
                dispatchFunc={updateConnectionProxy}
                onSuccess={onSuccess}
                form={<ConnectionProxyForm connectionProxyId={props.match.params.id} />}
            />
        </div>

    )
}
