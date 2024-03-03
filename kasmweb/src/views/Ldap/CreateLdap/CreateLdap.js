import React from "react";
import LdapForm from "../LdapForm/LdapForm";
import {useTranslation} from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShieldKeyhole } from '@fortawesome/pro-light-svg-icons/faShieldKeyhole';
import PageHeader, { parentRoutes } from "../../../components/Header/PageHeader";
import { Form } from "../../../components/Form"
import { createLdap } from "../../../actions/actionLdap";

const parentRouteList = parentRoutes('/ldap')
const newRoutes = [
    ...parentRouteList.routes,
    {name: "generic.create",path:"/createldap",isActive: true},
];

const tabList = [
    { name: 'generic.create', key: 'form' },
  ]
  
export default function CreateLdap(props) {
    const { t } = useTranslation('common');

    const onSuccess = () => {
        props.history.push('/ldap');
    }

    return (
        <div>
        <PageHeader location={props.location} routes={typeof newRoutes !== 'undefined' ? newRoutes : null} title={t('auth.create-ldap-configuration')} icon={<FontAwesomeIcon icon={faShieldKeyhole} />} />
        <Form 
            tabList={tabList}
            currentTab="form"
            section="auth"
            type="create"
            dispatchFunc={createLdap}
            onSuccess={onSuccess}
            form={<LdapForm />}
        />
    </div>
    )
}
