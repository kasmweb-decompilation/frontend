import React,{ useState } from "react";
import { useSelector } from 'react-redux'
import { updateImages } from "../../../actions/actionImage";
import ImageForm from "../ImageForm/ImageForm";
import {useTranslation} from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBoxesStacked } from '@fortawesome/free-solid-svg-icons/faBoxesStacked';
import PageHeader, { parentRoutes } from "../../../components/Header/PageHeader";
import { Form } from "../../../components/Form/Form.js"
import FileMapping from "../../../components/FileMapping/FileMapping";
import StorageMapping from "../../../components/StorageMapping";
import { notifySuccess, notifyFailure } from "../../../components/Form/Form.js"

const parentRouteList = parentRoutes('/workspaces')
const newRoutes = [
    ...parentRouteList.routes,
    {name: "generic.update",path:"/updateworkspace",isActive: true},
];

export default function UpdateImage(props) {
    const [currentTab, setCurrentTab] = useState('form');
    const { t } = useTranslation('common');
    const images = useSelector(state => state.images.images) || null
    const servers = useSelector(state => state.servers.servers) || null
    const current = (images) ? images.find(el => el.image_id === props.match.params.id) : null
    const current_server = (current && servers) ? servers.find(el => el.server_id === current.server_id) : null

    let tabList = [
        { name: 'buttons.Edit', key: 'form' },
    ]
    let agent_installed = false
    if (current && current.image_type === 'Server' && current_server) {
        agent_installed = current_server.agent_installed
    }
    if (current && (current.image_type === 'Container' || current.image_type === 'Server' || current.image_type === 'Server Pool')) {
        tabList.push({ name: 'file_mapping.File Mapping', key: 'filemapping' })
        tabList.push({ name: 'storage_mapping.storage-mapping', key: 'storagemapping' })
    }
    
    const userData = {
        image_id: props.match.params.id
    }
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
            <PageHeader location={props.location} routes={typeof newRoutes !== 'undefined' ? newRoutes : null} title={t('workspaces.update-workspace')} icon={<FontAwesomeIcon icon={faBoxesStacked} />} />
            <Form 
                tabList={tabList}
                currentTab={currentTab}
                setCurrentTab={setCurrentTab}
                userData={userData}
                section="workspaces"
                type="update"
                dispatchFunc={updateImages}
                dataTransform={dataTransform}
                onSuccess={onSuccess}
                form={<ImageForm imageId={props.match.params.id} agent_installed={agent_installed} />}
                tabs={
                    <React.Fragment>
                    <div className={(currentTab === 'filemapping' ? 'tw-block': 'tw-hidden')}>
                        <FileMapping type="image_id" image_id={props.match.params.id} />
                    </div>
                    <div className={(currentTab === 'storagemapping' ? 'tw-block': 'tw-hidden')}>
                        <StorageMapping type="image_id" image_id={props.match.params.id} />
                    </div>
                    </React.Fragment>
                }
            />
        </div>

    )
}
