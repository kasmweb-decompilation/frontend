import React,{ useState } from "react";
import BrandingConfigForm from "../BrandingConfigForm/BrandingConfigForm";
import {useTranslation} from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaintbrushFine } from '@fortawesome/free-solid-svg-icons/faPaintbrushFine';
import PageHeader, { parentRoutes } from "../../../components/Header/PageHeader";
import { Form } from "../../../components/Form/Form.js"
import {updateBrandingConfig} from "../../../actions/actionBranding";

const parentRouteList = parentRoutes('/branding')
const newRoutes = [
    ...parentRouteList.routes,
    {name: "generic.update",path:"/updatebranding",isActive: true},
];

export default function UpdateBrandingConfig(props) {
    const [currentTab, setCurrentTab] = useState('form');
    const { t } = useTranslation('common');
    
    const tabList = [
        { name: 'buttons.Edit', key: 'form' },
    ]
    const userData = {
        branding_config_id: props.match.params.id
    }
    const onSuccess = () => {
        props.history.push('/branding');
    }

    return (
        <div>
            <PageHeader location={props.location} routes={typeof newRoutes !== 'undefined' ? newRoutes : null} title={t('branding.Update Branding Config')} icon={<FontAwesomeIcon icon={faPaintbrushFine} />} />
            <Form 
                {...props}
                tabList={tabList}
                currentTab={currentTab}
                setCurrentTab={setCurrentTab}
                userData={userData}
                section="branding"
                type="update"
                dispatchFunc={updateBrandingConfig}
                onSuccess={onSuccess}
                form={<BrandingConfigForm brandingConfigId={props.match.params.id} />}
            />
        </div>

    )
}
