import React from "react";
import OidcConfigForm from "../OidcConfigForm/OidcConfigForm";
import {useTranslation} from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShieldKeyhole } from '@fortawesome/pro-light-svg-icons/faShieldKeyhole';
import PageHeader, { parentRoutes } from "../../../components/Header/PageHeader";
import { Form } from "../../../components/Form"
import {createOidcConfig} from '../../../actions/actionOidc';

const parentRouteList = parentRoutes('/oidc')
const newRoutes = [
    ...parentRouteList.routes,
    {name: "generic.create",path:"/createoidc",isActive: true},
];

const tabList = [
    { name: 'generic.create', key: 'form' },
  ]
  
export default function CreateOidcConfig(props) {
    const { t } = useTranslation('common');

    const onSuccess = () => {
        props.history.push('/oidc');
    }

    const userData = {
        redirect_url: "https://" + window.location.host + "/api/oidc_callback"
    }

    return (
        <div>
        <PageHeader location={props.location} routes={typeof newRoutes !== 'undefined' ? newRoutes : null} title={t('auth.create-openid-config')} icon={<FontAwesomeIcon icon={faShieldKeyhole} />} />
        <Form 
            tabList={tabList}
            currentTab="form"
            section="auth"
            type="create"
            userData={userData}
            dispatchFunc={createOidcConfig}
            onSuccess={onSuccess}
            form={<OidcConfigForm />}
        />
    </div>
    )
}
