import React,{ useState } from "react";
import OidcConfigForm from "../OidcConfigForm/OidcConfigForm";
import {useTranslation} from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShieldKeyhole } from '@fortawesome/free-solid-svg-icons/faShieldKeyhole';
import PageHeader, { parentRoutes } from "../../../components/Header/PageHeader";
import { Form } from "../../../components/Form"
import {updateOidcConfig} from "../../../actions/actionOidc";
import MappingTable from "../../../components/MappingTable/";

const parentRouteList = parentRoutes('/oidc')
const newRoutes = [
    ...parentRouteList.routes,
    {name: "generic.update",path:"/updateoidc",isActive: true},
];

export default function UpdateOidcConfig(props) {
    const [currentTab, setCurrentTab] = useState('form');
    const { t } = useTranslation('common');
    
    const tabList = [
        { name: 'buttons.Edit', key: 'form' },
        { name: 'mapping.Attribute Mapping', key: 'attributemapping' },
    ]
    const userData = {
        redirect_url: "https://" + window.location.host + "/api/oidc_callback",
        oidc_config_id: props.match.params.id
    }
    const onSuccess = () => {
        props.history.push('/oidc');
    }

    return (
        <div>
            <PageHeader location={props.location} routes={typeof newRoutes !== 'undefined' ? newRoutes : null} title={t('auth.update-openid-config')} icon={<FontAwesomeIcon icon={faShieldKeyhole} />} />
            <Form 
                {...props}
                tabList={tabList}
                currentTab={currentTab}
                setCurrentTab={setCurrentTab}
                userData={userData}
                section="auth"
                type="update"
                dispatchFunc={updateOidcConfig}
                onSuccess={onSuccess}
                form={<OidcConfigForm oidcConfigId={props.match.params.id} />}
                tabs={
                    <div className={(currentTab === 'attributemapping' ? 'tw-block' : 'tw-hidden')}>
                        <MappingTable sso_id={props.match.params.id} sso_type="OIDC" />
                    </div>
                }
            />
        </div>

    )
}
