import React from "react";
import {useTranslation} from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PageHeader, { parentRoutes } from "../../../components/Header/PageHeader";
import { Form } from "../../../components/Form"
import { faBoxArchive } from '@fortawesome/free-solid-svg-icons/faBoxArchive';
import {createStorageProvider} from '../../../actions/actionStorageProvider';
import StorageProviderConfigForm from "../StorageProviderConfigForm/StorageProviderConfigForm";

const parentRouteList = parentRoutes('/storage_providers')
const newRoutes = [
    ...parentRouteList.routes,
    {name: "generic.create",path:"/create_storage_provider",isActive: true},
];

const tabList = [
    { name: 'generic.create', key: 'form' },
]

export default function CreateStorageProvider(props) {
    const { t } = useTranslation('common');

    const onSuccess = () => {
        props.history.push('/storage_providers');
    }

    return (
        <div>
        <PageHeader location={props.location} routes={typeof newRoutes !== 'undefined' ? newRoutes : null} title={t('storage_provider.create-storage-provider')} icon={<FontAwesomeIcon icon={faBoxArchive} />} />
        <Form 
            tabList={tabList}
            currentTab="form"
            section="storage_provider"
            dispatchFunc={createStorageProvider}
            onSuccess={onSuccess}
            form={<StorageProviderConfigForm />}
        />
    </div>
    )
}
