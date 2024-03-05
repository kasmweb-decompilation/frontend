import React from "react";
import BrandingConfigForm from "../BrandingConfigForm/BrandingConfigForm";
import {useTranslation} from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaintbrushFine } from '@fortawesome/free-solid-svg-icons/faPaintbrushFine';
import PageHeader, { parentRoutes } from "../../../components/Header/PageHeader";
import { Form } from "../../../components/Form/Form.js"
import {createBrandingConfig} from '../../../actions/actionBranding';

const parentRouteList = parentRoutes('/branding')
const newRoutes = [
    ...parentRouteList.routes,
    {name: "generic.create",path:"/createbranding",isActive: true},
];

const tabList = [
    { name: 'generic.create', key: 'form' },
  ]
  
export default function CreateBrandingConfig(props) {
    const { t } = useTranslation('common');

    const onSuccess = () => {
        props.history.push('/branding');
    }

    return (
        <div>
        <PageHeader location={props.location} routes={typeof newRoutes !== 'undefined' ? newRoutes : null} title={t('branding.Create Branding Config')} icon={<FontAwesomeIcon icon={faPaintbrushFine} />} />
        <Form 
            tabList={tabList}
            currentTab="form"
            section="branding"
            dispatchFunc={createBrandingConfig}
            onSuccess={onSuccess}
            form={<BrandingConfigForm />}
        />
    </div>
    )
}
