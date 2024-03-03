import React, { Component } from 'react';
import { connect } from "react-redux";
import { Row, Col } from "reactstrap";
import { NotificationManager } from "react-notifications";
import LoadingSpinner from "../../components/LoadingSpinner/index";
import DataTable from "../../components/Table/Table";

import { getStorageProviders, deleteStorageProvider} from "../../actions/actionStorageProvider";
import {withTranslation} from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBoxArchive } from '@fortawesome/pro-light-svg-icons/faBoxArchive';
import { faTrash } from '@fortawesome/pro-light-svg-icons/faTrash';
import PageHeader from "../../components/Header/PageHeader";
import { ConfirmAction } from '../../components/Table/NewTable';

class StorageProvider extends Component {
    constructor(props) {
        super(props);

        this.state = {
            modal: false,
            filterId: null
        };

        this.cancelDelete = this.cancelDelete.bind(this);
        this.deleteConfirm = this.deleteConfirm.bind(this);
        this.deleteStorageProviderAction = this.deleteStorageProviderAction.bind(this);
        this.handleDeleteSuccess = this.handleDeleteSuccess.bind(this);
        this.handleDeleteError = this.handleDeleteError.bind(this);
    }

    componentDidMount() {
        this.props.getStorageProviders();

    }

    deleteConfirm(StoragProviderId, StorageProviderType) {
        this.setState(
            {
                modal: !this.state.modal,
                StoragProviderId: StoragProviderId,
                StorageProviderType: StorageProviderType,
            });
    }

    cancelDelete() {
        this.setState({ modal: !this.state.modal });
    }

    deleteStorageProviderAction() {
        let data = { storage_provider_id: this.state.StoragProviderId}

        this.props.deleteStorageProvider(data).
            then(() => this.handleDeleteSuccess()).
            catch(() => this.handleDeleteError());
    }

    handleDeleteSuccess() {
        const { deleteStorageProviderError, t } = this.props;
        this.setState({modal: false});
        if (deleteStorageProviderError) {
            NotificationManager.error(deleteStorageProviderError, t('storage_provider.notify-delete-title"'), 3000);
        } else {
            NotificationManager.success(t('storage_provider.notify-delete-success'), t('storage_provider.notify-delete-title'), 3000);
            this.props.getStorageProviders();
        }
    }

    handleDeleteError() {
        const { deleteStorageProviderError, t } = this.props;
        this.setState({modal: false});
        if (deleteStorageProviderError) {
            NotificationManager.error(deleteStorageProviderError, t('storage_provider.notify-delete-title'), 3000);
            this.props.history.push("/storage_providers");
        } else {
            NotificationManager.error(t('storage_provider.failed-to-delete-storage-provider-c'), t('storage_provider.notify-delete-title'), 3000);
            this.props.history.push("/storage_providers");
        }
    }

    render() {
        if (this.props.getStorageProviderLoading) {
            return (<div> <LoadingSpinner /></div>);
        }

        const { storage_providers, t } = this.props;

        const tableColumns = [
            {
                type: "text",
                name: t('storage_provider.name'),
                accessor: "name",
                filterable: true,
                sortable: true,
            },
            {
                type: "text",
                name: t('storage_provider.type'),
                accessor: "storage_provider_type",
                filterable: true,
                sortable: true,
            },
            {
                type: "flag",
                name: t('storage_provider.enabled'),
                accessor: "enabled",
                filterable: true,
                sortable: true,
            },
            {
                type: "text",
                name: t('storage_provider.default-target'),
                accessor: "default_target",
                filterable: true,
                sortable: true,
            },
        ];

        const actions = [
            { id: "edit", icon: "fa-pencil", description: t('buttons.Edit') },
            { id: "delete", icon: "fa-trash", description: t('buttons.Delete') },
        ];

        const onAction = (action, item) => {
            switch (action) {

                case "edit":
                    this.props.history.push(`/update_storage_provider/${item.storage_provider_id}`);
                    break;

                case "delete":
                    this.deleteConfirm(item.storage_provider_id, item.storage_provider_type);
                    break;
            }
        }

        return (
            <div className="profile-page">
                <PageHeader location={this.props.location} routes={typeof newRoutes !== 'undefined' ? newRoutes : null} title={t('storage_provider.storage-providers')} icon={<FontAwesomeIcon icon={faBoxArchive} />} />
                <Row>
                    <Col sm={{ size: 10, order: 3, offset: 1 }}>
                        <DataTable
                            id="storage_provider"
                            data={storage_providers}
                            columns={tableColumns}
                            actions={actions}
                            onAction={onAction}
                            mainId="storage_provider_id"
                            add={{
                                name: t('buttons.Add'),
                                action: '/create_storage_provider'
                            }}
                        />
                    </Col>
                </Row>

                <ConfirmAction
                    confirmationDetails={{
                        action: null,
                        details: {
                            title: t('storage_provider.notify-delete-title'),
                            text: t('storage_provider.are-you-sure-you-want-to-delet'),
                            iconBg: 'tw-bg-pink-700 tw-text-white',
                            icon: <FontAwesomeIcon icon={faTrash} />,
                            confirmBg: 'tw-bg-pink-700',
                            confirmText: t('buttons.Delete'),

                        }
                    }}
                    open={this.state.modal}
                    externalClose={true}
                    setOpen={this.cancelDelete}
                    onAction={this.deleteStorageProviderAction}
                />


            </div>
        );
    }

}
const StorageProviderConfigTranslated = withTranslation('common')(StorageProvider)
export default connect(state => ({
    getStorageProviderLoading: state.storage_provider.getStorageProviderLoading || false,
    getStorageProviderError: state.storage_provider.getStorageProviderError || null,
    deleteStorageProviderError: state.storage_provider.deleteStorageProviderError || null,
    deletedStorageProvider: state.storage_provider.deletedStorageProvider || null,
    deleteStorageProviderLoading: state.storage_provider.deleteStorageProviderLoading || null,
    pages: { pageSize: state.storage_provider.pageSize, pageNo: state.storage_provider.pageNo },
    storage_providers: state.storage_provider.storage_providers || []
}),
    dispatch => ({
        getStorageProviders: () => dispatch(getStorageProviders()),
        deleteStorageProvider: (data) => dispatch(deleteStorageProvider(data)),
        setPageInfo: (data) => dispatch(setProviderPageInfo(data)),
    }))(StorageProviderConfigTranslated);
