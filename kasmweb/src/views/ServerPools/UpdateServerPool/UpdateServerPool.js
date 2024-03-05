import React,{ useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux'
import ServerPoolForm from "../ServerPoolForm/ServerPoolForm";
import {useTranslation} from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faObjectGroup } from '@fortawesome/free-solid-svg-icons/faObjectGroup';
import PageHeader, { parentRoutes } from "../../../components/Header/PageHeader";
import { Form } from "../../../components/Form/Form.js"
import AutoScale from "../../AutoScale/AutoScale";
import Servers from "../../Servers/Servers";
import Agents from "../../Agents/Agents";
import { updateServerPool } from "../../../actions/actionServerPool";
import { hasAuth } from "../../../utils/axios";

const parentRouteList = parentRoutes('/server_pools')
const newRoutes = [
    ...parentRouteList.routes,
    {name: "generic.update",path:"/updateserver_pool",isActive: true},
];

export default function UpdatePool(props) {
    const [currentTab, setCurrentTab] = useState('form');
    const { t } = useTranslation('common');
    const server_pools = useSelector(state => state.server_pools.server_pools) || []
    const pool = server_pools.find(pool => pool.server_pool_id === props.match.params.id)    

    const onSuccess = () => {
        props.history.push("/server_pools");
    }

    const userData = {
        server_pool_id: props.match.params.id
    }

    let tabList = []
    tabList.push({ name: 'buttons.Edit', key: 'form' })
    if (pool && pool.server_pool_type === 'Server Pool') tabList.push({ name: 'servers.servers', key: 'servers' })
    if (pool && pool.server_pool_type === 'Docker Agent') tabList.push({ name: 'agents.Docker Agents', key: 'agents' })
    tabList.push({ name: 'autoscale.AutoScale Configurations', key: 'autoscale' })

    return (
        <div>
        <PageHeader location={props.location} routes={typeof newRoutes !== 'undefined' ? newRoutes : null} title={t('pools.update-pool')} icon={<FontAwesomeIcon icon={faObjectGroup} />} />
        <Form 
            {...props}
            tabList={tabList}
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
            section="pools"
            type="update"
            title="update-pool"
            successMessage="successfully-updated-pool"
            userData={userData}
            dispatchFunc={updateServerPool}
            onSuccess={onSuccess}
            form={<ServerPoolForm serverPoolId={props.match.params.id} />}
            tabs={
                <React.Fragment>
                    {hasAuth('servers') && pool && pool.server_pool_type === 'Server Pool' && currentTab === 'servers' && (
                        <Servers inline={true} pool={props.match.params.id} />
                    )}
                    {hasAuth('agents') && pool && pool.server_pool_type === 'Docker Agent' && currentTab === 'agents' && (
                        <Agents inline={true} pool={props.match.params.id} />
                    )}
                    {hasAuth('autoscale') && currentTab === 'autoscale' &&
                        <AutoScale inline={true} pool={props.match.params.id} serverPoolType={pool && pool.server_pool_type} />
                    }
                </React.Fragment>
            }
        />
    </div>
    )
}
