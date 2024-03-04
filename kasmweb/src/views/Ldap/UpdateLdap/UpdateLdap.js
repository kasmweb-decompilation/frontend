import React,{ useState } from "react";
import LdapForm from "../LdapForm/LdapForm";
import {useTranslation} from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShieldKeyhole } from '@fortawesome/free-solid-svg-icons/faShieldKeyhole';
import PageHeader, { parentRoutes } from "../../../components/Header/PageHeader";
import { Form } from "../../../components/Form"
import { updateLdap } from "../../../actions/actionLdap";
import MappingTable from "../../../components/MappingTable/";

const parentRouteList = parentRoutes('/ldap')
const newRoutes = [
    ...parentRouteList.routes,
    {name: "generic.update",path:"/updateldap",isActive: true},
];

export default function UpdateLdap(props) {
    const [currentTab, setCurrentTab] = useState('form');
    const { t } = useTranslation('common');
    
    const tabList = [
        { name: 'buttons.Edit', key: 'form' },
        { name: 'mapping.Attribute Mapping', key: 'attributemapping' },
    ]
    const userData = {
        ldap_id: props.match.params.id
    }
    const onSuccess = () => {
        props.history.push('/ldap');
    }

    return (
        <div>
            <PageHeader location={props.location} routes={typeof newRoutes !== 'undefined' ? newRoutes : null} title={t('auth.update-ldap-configuration')} icon={<FontAwesomeIcon icon={faShieldKeyhole} />} />
            <Form 
                {...props}
                tabList={tabList}
                currentTab={currentTab}
                setCurrentTab={setCurrentTab}
                userData={userData}
                section="auth"
                type="update"
                dispatchFunc={updateLdap}
                onSuccess={onSuccess}
                form={<LdapForm ldapId={props.match.params.id} />}
                tabs={
                    <div className={(currentTab === 'attributemapping' ? 'tw-block' : 'tw-hidden')}>
                        <MappingTable sso_id={props.match.params.id} sso_type="LDAP" />
                    </div>
                }
            />
        </div>

    )
}
