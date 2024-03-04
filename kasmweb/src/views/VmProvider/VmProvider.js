import React, { Component } from 'react';
import { connect } from "react-redux";
import { Row, Col } from "reactstrap";
import { NotificationManager } from "react-notifications";
import LoadingSpinner from "../../components/LoadingSpinner/index";
import DataTable from "../../components/Table/Table";

import { getVmProviderConfigs, deleteVmProviderConfig } from "../../actions/actionVmProvider";
import {withTranslation} from "react-i18next";
import { ConfirmAction, StandardColumn } from "../../components/Table/NewTable";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCube } from '@fortawesome/free-solid-svg-icons/faCube';
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';
import PageHeader, { parentRoutes } from "../../components/Header/PageHeader";

const parentRouteList = parentRoutes('/server_pools')
const newRoutes = [
    ...parentRouteList.routes,
    {name: "autoscale.VM Provider",path:"/vm_provider",isActive: true},
];

class VmProviderConfig extends Component {
    constructor(props) {
        super(props);

        this.state = {
            modal: false,
            filterId: null
        };

        this.cancelDelete = this.cancelDelete.bind(this);
        this.deleteConfirm = this.deleteConfirm.bind(this);
        this.deleteVmProviderAction = this.deleteVmProviderAction.bind(this);
        this.handleDeleteSuccess = this.handleDeleteSuccess.bind(this);
        this.handleDeleteError = this.handleDeleteError.bind(this);
    }

    componentDidMount() {
        this.props.getVmProviderConfigs();
    }

    deleteConfirm(VmProviderConfigId, VmProviderName) {
        this.setState(
            {
                modal: !this.state.modal,
                VmProviderConfigId: VmProviderConfigId,
                VmProviderName: VmProviderName,
            });
    }

    cancelDelete() {
        this.setState({ modal: !this.state.modal });
    }

    deleteVmProviderAction() {
        this.props.deleteVmProviderConfig({ vm_provider_config_id: this.state.VmProviderConfigId, vm_provider_name: this.state.VmProviderName }).
            then(() => this.handleDeleteSuccess()).
            catch(() => this.handleDeleteError());
    }

    handleDeleteSuccess() {
        const { deleteVmProviderError, t } = this.props;
        this.setState({modal: false});
        if (deleteVmProviderError) {
            NotificationManager.error(deleteVmProviderError, t('providers.delete-vm-provider-config-fail'), 3000);
        } else {
            NotificationManager.success(t('providers.successfully-deleted-vm-provid'), t('providers.delete-vm-provider-config'), 3000);
            this.props.getVmProviderConfigs();
        }
    }

    handleDeleteError() {
        const { deleteVmProviderError, t } = this.props;
        this.setState({modal: false});
        if (deleteVmProviderError) {
            NotificationManager.error(deleteVmProviderError, t('providers.failed-to-delete-vm-provider-c'), 3000);
            this.props.history.push("/vm_provider");
        } else {
            NotificationManager.error(t('providers.failed-to-delete-vm-provider-c'), t('providers.delete-vm-provider-config'), 3000);
            this.props.history.push("/vm_provider");
        }
    }

    render() {
        if (this.props.getVmProviderLoading) {
            return (<div> <LoadingSpinner /></div>);
        }

        const { vm_provider_configs, t } = this.props;

        const tableColumns = [
            {
                type: "text",
                name: t('providers.Name'),
                accessor: "vm_provider_config_name",
                filterable: true,
                sortable: true,
                overwrite: true,
                cell: (data) => <StandardColumn key={'vm_provider_config_name' + data.original.vm_provider_config_id} main={data.value} sub={data.original.vm_provider_display_name} first={true}></StandardColumn>
            },
            {
                type: "text",
                name: t('providers.provider'),
                accessor: "vm_provider_display_name",
                filterable: true,
                sortable: true,
                showByDefault: false,
            },
        ];

        const actions = [
            { id: "edit", icon: "fa-pencil", description: t('buttons.Edit') },
            { id: "delete", icon: "fa-trash", description: t('buttons.Delete') },
        ];

        const onAction = (action, item) => {
            switch (action) {
                case "view":
                    this.props.history.push(`/view_vm_provider/${item.vm_provider_config_id}`);
                    break;

                case "edit":
                    this.props.history.push(`/update_vm_provider/${item.vm_provider_config_id}`);
                    break;

                case "delete":
                    this.deleteConfirm(item.vm_provider_config_id, item.vm_provider_name);
                    break;
                case "deleteMulti":
                    item.forEach(id => {
                        const provider = this.props.vm_provider_configs.find(p => p.vm_provider_config_id === id)
                        this.props.deleteVmProviderConfig({ vm_provider_config_id: id, vm_provider_name: provider.vm_provider_name }).
                        then(() => this.handleDeleteSuccess()).
                        catch(() => this.handleDeleteError());
                    })
                    break;
    
            }
        }

        return (
            <div className="profile-page">
                <PageHeader location={this.props.location} routes={typeof newRoutes !== 'undefined' ? newRoutes : null} title={t('providers.vm-provider-configurations')} icon={<FontAwesomeIcon icon={faCube} />} />
                <Row>
                    <Col sm={{ size: 10, order: 3, offset: 1 }}>
                        <DataTable
                            id="vm_provider"
                            data={vm_provider_configs}
                            columns={tableColumns}
                            actions={actions}
                            onAction={onAction}
                            mainId="vm_provider_config_id"
                            add={{
                                name: t('buttons.Add'),
                                action: '/create_vm_provider'
                            }}
                        />
                    </Col>
                </Row>

                <ConfirmAction
                    confirmationDetails={{
                        action: null,
                        details: {
                            title: t('providers.delete-vm-provider-config'),
                            text: t('providers.are-you-sure-you-want-to-delet'),
                            iconBg: 'tw-bg-pink-700 tw-text-white',
                            icon: <FontAwesomeIcon icon={faTrash} />,
                            confirmBg: 'tw-bg-pink-700',
                            confirmText: t('buttons.Delete'),

                        }
                    }}
                    open={this.state.modal}
                    externalClose={true}
                    setOpen={this.cancelDelete}
                    onAction={this.deleteVmProviderAction}
                />

            </div>
        );
    }

}
const VmProviderConfigTranslated = withTranslation('common')(VmProviderConfig)
export default connect(state => ({
    vm_provider_configs: state.vm_provider.vm_provider_configs || [],
    getVmProviderLoading: state.vm_provider.getVmProviderLoading || false,
    getVmProviderErrorMessage: state.vm_provider.getVmProviderErrorMessage || false,
    getVmProviderError: state.vm_provider.getVmProviderError || null,
    deleteVmProviderError: state.vm_provider.deleteVmProviderError || null,
    deletedVmProvider: state.vm_provider.deletedVmProvider || null,
    deleteVmProviderLoading: state.vm_provider.deletVmeProviderLoading || null,
    pages: { pageSize: state.vm_provider.pageSize, pageNo: state.vm_provider.pageNo },
}),
    dispatch => ({
        getVmProviderConfigs: () => dispatch(getVmProviderConfigs()),
        deleteVmProviderConfig: (data) => dispatch(deleteVmProviderConfig(data)),
        setPageInfo: (data) => dispatch(setProviderPageInfo(data)),
    }))(VmProviderConfigTranslated);
