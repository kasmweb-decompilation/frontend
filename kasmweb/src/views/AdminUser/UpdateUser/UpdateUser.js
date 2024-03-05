import React,{ useState } from "react";
import { useSelector } from 'react-redux'
import UserForm from "../UserForm/UserForm";
import View from "../ViewUser/ViewUser";
import {useTranslation} from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons/faUser';
import PageHeader, { parentRoutes } from "../../../components/Header/PageHeader";
import { Form } from "../../../components/Form/Form.js"
import { updateUser } from "../../../actions/actionAdminUser";

const parentRouteList = parentRoutes('/adminUser')
const newRoutes = [
    ...parentRouteList.routes,
    {name: "generic.update",path:"/updateuser",isActive: true},
];

export default function UpdateUser(props) {
    const [currentTab, setCurrentTab] = useState('form');
    const user = useSelector(state => state.admin.user) || null
    const usageDumpLoading = useSelector(state => state.admin.usageDumpLoading)
    const { t } = useTranslation('common');
    let tabList = []
    tabList.push({ name: 'users.Edit User', key: 'form' })
    tabList.push({ name: 'users.Groups', key: 'groups' })
    tabList.push({ name: 'users.settings', key: 'settings' })
    tabList.push({ name: 'groups.permissions', key: 'permissions' })
    tabList.push({ name: 'users.workspaces', key: 'workspaces' })
    if (user && user.kasms && user.kasms.length > 0) tabList.push({ name: 'users.Active Sessions', key: 'user_kasms' })
    if (!usageDumpLoading) tabList.push({ name: 'users.Session Usage Details', key: 'usage_details' })
    tabList.push({ name: 'file_mapping.File Mapping', key: 'file_mapping' })
    tabList.push({ name: 'storage_mapping.storage-mapping', key: 'storage_mapping' })
    
    const userData = {
        user_id: props.match.params.id
    }
    const onSuccess = () => {
        props.history.push('/adminUser');
    }

    return (
        <div>
        <PageHeader location={props.location} routes={typeof newRoutes !== 'undefined' ? newRoutes : null} title={user && user.username} icon={<FontAwesomeIcon icon={faUser} />} />
        <Form 
            {...props}
            tabList={tabList}
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
            userData={userData}
            section="users"
            type="update"
            dispatchFunc={updateUser}
            onSuccess={onSuccess}
            form={<UserForm userId={props.match.params.id} />}
            tabs={<View currentTab={currentTab} {...props} />}
        />
    </div>

    )
}

