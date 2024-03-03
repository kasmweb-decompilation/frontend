import React,{ useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import GroupForm from "../GroupForm/GroupForm";
import {useTranslation} from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserGroup } from '@fortawesome/pro-light-svg-icons/faUserGroup';
import PageHeader, { parentRoutes } from "../../../components/Header/PageHeader";
import { Form } from "../../../components/Form"
import {createGroup} from "../../../actions/actionGroup";

const parentRouteList = parentRoutes('/groups')
const newRoutes = [
    ...parentRouteList.routes,
    {name: "generic.create",path:"/createuser",isActive: true},
];

const tabList = [
    { name: 'generic.create', key: 'form' },
  ]
  
export default function CreateGroup(props) {
    const dispatch = useDispatch()
    const { t } = useTranslation('common');

    const onSuccess = () => {
        props.history.push('/groups');
    }

    return (
        <div>
        <PageHeader location={props.location} routes={typeof newRoutes !== 'undefined' ? newRoutes : null} title={t('groups.create-group')} icon={<FontAwesomeIcon icon={faUserGroup} />} />
        <Form 
            tabList={tabList}
            currentTab="form"
            section="groups"
            title="create-group"
            successMessage="successfully-created-group"
            dispatchFunc={createGroup}
            onSuccess={onSuccess}
            form={<GroupForm />}
        />
    </div>
    )
}
