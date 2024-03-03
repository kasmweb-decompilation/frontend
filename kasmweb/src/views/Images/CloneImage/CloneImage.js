import React,{ useState } from "react";
import { createImage } from "../../../actions/actionImage";
import ImageForm from "../ImageForm/ImageForm";
import {useTranslation} from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBoxesStacked } from '@fortawesome/pro-light-svg-icons/faBoxesStacked';
import PageHeader, { parentRoutes } from "../../../components/Header/PageHeader";
import { Form } from "../../../components/Form"
import FileMapping from "../../../components/FileMapping/FileMapping";
import { notifySuccess, notifyFailure } from "../../../components/Form"

const parentRouteList = parentRoutes('/workspaces')
const newRoutes = [
    ...parentRouteList.routes,
    {name: "generic.clone",path:"/cloneworkspace",isActive: true},
];

const tabList = [
    { name: 'workspaces.clone-workspace', key: 'form' },
]

export default function CreateImage(props) {
    const { t } = useTranslation('common');

    const onSuccess = () => {
        props.history.push('/workspaces');
    }

    const dataTransform = (userData) => {
        if (!userData.enabled) userData.enabled = false;
            if (userData.memory < 256 || userData.memory > 256000) {
                notifyFailure({
                    type: 'update',
                    error: { message: t('workspaces.memory-must-be-between-256-and') }
                })
                return null
            }
            userData.gpu_count = userData.gpu_count === "" ? null : userData.gpu_count ;
            userData.memory = userData.memory * 1000000;
            userData.restrict_network_names = userData.restrict_to_network == true ? userData.restrict_network_names : [];
            userData.server_id = userData.restrict_to_server == true || userData.image_type === "Server" ? userData.server_id : "";
            userData.zone_id = userData.restrict_to_zone == true ? userData.zone_id : "";

        return userData
    }

    return (
        <div>
        <PageHeader location={props.location} routes={typeof newRoutes !== 'undefined' ? newRoutes : null} title={t('workspaces.clone-workspace')} icon={<FontAwesomeIcon icon={faBoxesStacked} />} />
        <Form 
            tabList={tabList}
            currentTab="form"
            section="workspaces"
            type="update"
            dispatchFunc={createImage}
            dataTransform={dataTransform}
            onSuccess={onSuccess}
            form={<ImageForm imageId={props.match.params.id} fromUpdate={true} fromClone={true} />}
        />
    </div>
    )
}

