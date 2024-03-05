import React,{ useState } from "react";
import { useDispatch } from "react-redux";
import UserForm from "../UserForm/UserForm";
import {useTranslation} from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers } from '@fortawesome/free-solid-svg-icons/faUsers';
import PageHeader, { parentRoutes } from "../../../components/Header/PageHeader";
import { Form } from "../../../components/Form/Form.js"
import { createUser } from "../../../actions/actionAdminUser";

const parentRouteList = parentRoutes('/adminUser')
const newRoutes = [
    ...parentRouteList.routes,
    {name: "generic.create",path:"/createuser",isActive: true},
];

const tabList = [
    { name: 'generic.create', key: 'form' },
]

export default function CreateUser(props) {
    const dispatch = useDispatch()
    const [currentTab, setCurrentTab] = useState('form');
    const { t } = useTranslation('common');

    const onSuccess = () => {
        props.history.push("/adminUser");
    }

    return (
        <div>
        <PageHeader location={props.location} routes={typeof newRoutes !== 'undefined' ? newRoutes : null} title={t('users.Create User')} icon={<FontAwesomeIcon icon={faUsers} />} />
        <Form 
            tabList={tabList}
            currentTab={currentTab}
            section="users"
            title="Create User"
            successMessage="success-create"
            dispatchFunc={createUser}
            onSuccess={onSuccess}
            form={<UserForm />}
        />
    </div>

    )
}

