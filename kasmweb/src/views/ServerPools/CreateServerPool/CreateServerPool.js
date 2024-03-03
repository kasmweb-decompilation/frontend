import React,{ useState } from "react";
import ServerPoolForm from "../ServerPoolForm/ServerPoolForm";
import {useTranslation} from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faObjectGroup } from '@fortawesome/pro-light-svg-icons/faObjectGroup';
import PageHeader, { parentRoutes } from "../../../components/Header/PageHeader";
import { Form } from "../../../components/Form"
import { createServerPool } from "../../../actions/actionServerPool";

const parentRouteList = parentRoutes('/server_pools')
const newRoutes = [
    ...parentRouteList.routes,
    {name: "generic.create",path:"/create_server_pool",isActive: true},
];

const tabList = [
    { name: 'generic.create', key: 'form' },
]

export default function CreatePool(props) {
    const [currentTab, setCurrentTab] = useState('form');
    const { t } = useTranslation('common');

    const onSuccess = () => {
        props.history.push("/server_pools");
    }

    return (
        <div>
        <PageHeader location={props.location} routes={typeof newRoutes !== 'undefined' ? newRoutes : null} title={t('pools.create-pool')} icon={<FontAwesomeIcon icon={faObjectGroup} />} />
        <Form 
            tabList={tabList}
            currentTab={currentTab}
            section="pools"
            title="create-pool"
            successMessage="successfully-created-pool"
            dispatchFunc={createServerPool}
            onSuccess={onSuccess}
            form={<ServerPoolForm />}
        />
    </div>
    )
}
