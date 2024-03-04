import React,{ useState, useEffect } from "react";
import { updateServer } from "../../../actions/actionServer";
import ServerForm from "../AgentForm/AgentForm";
import {useTranslation} from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCubes } from '@fortawesome/free-solid-svg-icons/faCubes';
import PageHeader, { parentRoutes } from "../../../components/Header/PageHeader";
import { Form } from "../../../components/Form"
import ViewServer from "../ViewAgent/ViewServer"

const parentRouteList = parentRoutes('/agents')
const newRoutes = [
    ...parentRouteList.routes,
    {name: "generic.update",path:"/updateagent",isActive: true},
];

export default function UpdateAgent(props) {
    const [currentTab, setCurrentTab] = useState('form');
    const { t } = useTranslation('common');
    
    const tabList = [
        { name: 'buttons.Edit', key: 'form' },
        { name: 'agents.details', key: 'details' },
        { name: 'agents.usage', key: 'usage' },
    ]
    
    const userData = {
    }

    const onSuccess = () => {
        const pool = new URLSearchParams(props.location.search).get('pool') || null
        if (pool) {
            props.history.push('/update_server_pool/' + pool + '?tab=agents');
        } else {
            props.history.push('/agents');
        }
    }

    return (
        <div>
            <PageHeader location={props.location} routes={typeof newRoutes !== 'undefined' ? newRoutes : null} title={t('agents.update-agent')} icon={<FontAwesomeIcon icon={faCubes} />} />
            <Form 
                {...props}
                tabList={tabList}
                currentTab={currentTab}
                setCurrentTab={setCurrentTab}
                userData={userData}
                section="agents"
                type="update"
                dispatchFunc={updateServer}
                onSuccess={onSuccess}
                form={<ServerForm serverId={props.match.params.id} />}
                tabs={<ViewServer currentTab={currentTab} {...props} />}
            />
        </div>

    )
}
