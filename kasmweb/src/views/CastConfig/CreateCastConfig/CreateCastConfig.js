import React from "react";
import {useTranslation} from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PageHeader, { parentRoutes } from "../../../components/Header/PageHeader";
import { Form } from "../../../components/Form/Form.js"
import { faRss } from '@fortawesome/free-solid-svg-icons/faRss';
import {createCastConfig} from '../../../actions/actionCast';
import CastConfigForm from "../CastConfigForm/CastConfigForm";

const parentRouteList = parentRoutes('/cast')
const newRoutes = [
    ...parentRouteList.routes,
    {name: "generic.create",path:"/createcast",isActive: true},
];

export default function CreateCastConfig(props) {
    const { t } = useTranslation('common');

    const tabList = [
        { name: 'generic.create', key: 'form' },
    ]    

    const onSuccess = () => {
        props.history.push('/cast');
    }

    return (
        <div>
        <PageHeader location={props.location} routes={typeof newRoutes !== 'undefined' ? newRoutes : null} title={t('casting.notify-create-title')} icon={<FontAwesomeIcon icon={faRss} rotation={90} />} />
        <Form 
            tabList={tabList}
            currentTab="form"
            section="casting"
            type="create"
            dispatchFunc={createCastConfig}
            onSuccess={onSuccess}
            form={<CastConfigForm />}
        />
    </div>
    )
}
