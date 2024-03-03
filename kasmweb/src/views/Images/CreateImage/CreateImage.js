import React from "react";
import {useTranslation} from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PageHeader, { parentRoutes } from "../../../components/Header/PageHeader";
import { Form } from "../../../components/Form"
import { faBoxesStacked } from '@fortawesome/pro-light-svg-icons/faBoxesStacked';
import { createImage } from "../../../actions/actionImage";
import ImageForm from "../ImageForm/ImageForm";
import { notifySuccess, notifyFailure } from "../../../components/Form"

const parentRouteList = parentRoutes('/workspaces')
const newRoutes = [
    ...parentRouteList.routes,
    {name: "generic.create",path:"/createworkspace",isActive: true},
];

const tabList = [
    { name: 'generic.create', key: 'form' },
]

export default function CreateImage(props) {
    const { t } = useTranslation('common');

    const onSuccess = () => {
        props.history.push('/workspaces');
    }

    const dataTransform = (userData) => {
        if (!userData.enabled) userData.enabled = false;
        userData.gpu_count = userData.gpu_count === "" ? null : userData.gpu_count ;
        userData.memory = userData.memory * 1000000;

        return userData
    }

    return (
        <div>
        <PageHeader location={props.location} routes={typeof newRoutes !== 'undefined' ? newRoutes : null} title={t('workspaces.create-workspace')} icon={<FontAwesomeIcon icon={faBoxesStacked} />} />
        <Form 
            tabList={tabList}
            currentTab="form"
            section="workspaces"
            dispatchFunc={createImage}
            dataTransform={dataTransform}
            onSuccess={onSuccess}
            form={<ImageForm editApp={props.match.params.id} />}
        />
    </div>
    )
}
