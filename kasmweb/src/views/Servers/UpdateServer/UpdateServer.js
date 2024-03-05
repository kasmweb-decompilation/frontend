import React,{ useState, useEffect } from "react";
import { updateServer } from "../../../actions/actionServer";
import ServerForm from "../ServerForm/ServerForm";
import {useTranslation} from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faServer } from '@fortawesome/free-solid-svg-icons/faServer';
import PageHeader, { parentRoutes } from "../../../components/Header/PageHeader";
import { Form, saveSuccess, saveError } from "../../../components/Form/Form.js"

const parentRouteList = parentRoutes('/servers')
const newRoutes = [
    ...parentRouteList.routes,
    {name: "generic.update",path:"/updateagent",isActive: true},
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
        const pool = new URLSearchParams(props.location.search).get('pool') || null
        if (pool) {
            props.history.push('/update_server_pool/' + pool + '?tab=servers');
        } else {
            props.history.push('/servers');
        }
    }

    return (
        <div>
            <PageHeader location={props.location} routes={typeof newRoutes !== 'undefined' ? newRoutes : null} title={t('servers.update-server')} icon={<FontAwesomeIcon icon={faServer} />} />
            <Form 
                tabList={tabList}
                currentTab={currentTab}
                userData={userData}
                section="servers"
                type="update"
                dispatchFunc={updateServer}
                onSuccess={onSuccess}
                form={<ServerForm serverId={props.match.params.id} />}
            />
        </div>

    )
}
