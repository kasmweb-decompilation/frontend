import React,{ useState } from "react";
import { updateStorageProvider } from "../../../actions/actionStorageProvider";
import StorageProviderConfigForm from "../StorageProviderConfigForm/StorageProviderConfigForm";
import {useTranslation} from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBoxArchive } from '@fortawesome/pro-light-svg-icons/faBoxArchive';
import PageHeader, { parentRoutes } from "../../../components/Header/PageHeader";
import { Form } from "../../../components/Form"

const parentRouteList = parentRoutes('/storage_providers')
const newRoutes = [
    ...parentRouteList.routes,
    {name: "generic.update",path:"/update_storage_provider",isActive: true},
];

export default function UpdateStorageProvider(props) {
    const [currentTab, setCurrentTab] = useState('form');
    const { t } = useTranslation('common');
    
    const tabList = [
        { name: 'buttons.Edit', key: 'form' },
    ]
    
    const userData = {
        storage_provider_id: props.match.params.id
    }
    const onSuccess = () => {
        props.history.push('/storage_providers');
    }

    return (
        <div>
            <PageHeader location={props.location} routes={typeof newRoutes !== 'undefined' ? newRoutes : null} title={t('storage_provider.update-storage-provider')} icon={<FontAwesomeIcon icon={faBoxArchive} />} />
            <Form 
                tabList={tabList}
                currentTab={currentTab}
                userData={userData}
                section="storage_provider"
                type="update"
                dispatchFunc={updateStorageProvider}
                onSuccess={onSuccess}
                form={<StorageProviderConfigForm storageProviderId={props.match.params.id} />}
            />
        </div>

    )
}
