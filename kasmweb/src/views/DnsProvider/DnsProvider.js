import React, { Component } from 'react';
import { connect } from "react-redux";
import { Row, Col } from "reactstrap";
import { NotificationManager } from "react-notifications";
import LoadingSpinner from "../../components/LoadingSpinner/index";
import DataTable from "../../components/Table/Table";

import { Link } from "react-router-dom";
import { getDnsProviderConfigs, deleteDnsProviderConfig } from "../../actions/actionDnsProvider";
import {withTranslation} from "react-i18next";
import { StandardColumn, ConfirmAction } from "../../components/Table/NewTable";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChartNetwork } from '@fortawesome/free-solid-svg-icons/faChartSimple';
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';
import PageHeader, { parentRoutes } from "../../components/Header/PageHeader";

const parentRouteList = parentRoutes('/server_pools')
const newRoutes = [
    ...parentRouteList.routes,
    {name: "autoscale.DNS Provider",path:"/dns_provider",isActive: true},
];

class DnsProviderConfig extends Component {
    constructor(props) {
        super(props);

        this.state = {
            modal: false,
            filterId: null
        };

        this.cancelDelete = this.cancelDelete.bind(this);
        this.deleteConfirm = this.deleteConfirm.bind(this);
        this.deleteDnsProviderAction = this.deleteDnsProviderAction.bind(this);
        this.handleDeleteSuccess = this.handleDeleteSuccess.bind(this);
        this.handleDeleteError = this.handleDeleteError.bind(this);
    }

    componentDidMount() {
        this.props.getDnsProviderConfigs();
    }

    deleteConfirm(DnsProviderConfigId, DnsProviderConfigName) {
        this.setState({
            modal: !this.state.modal,
            DnsProviderConfigId: DnsProviderConfigId,
            DnsProviderConfigName: DnsProviderConfigName
        });
    }

    cancelDelete() {
        this.setState({ modal: !this.state.modal });
    }

    deleteDnsProviderAction() {
        this.props.deleteDnsProviderConfig(this.state.DnsProviderConfigId, this.state.DnsProviderConfigName).
            then(() => this.handleDeleteSuccess()).
            catch(() => this.handleDeleteError());
    }

    handleDeleteSuccess() {
        const { deleteDnsProviderError, t } = this.props;
        this.setState({modal: false});
        if (deleteDnsProviderError) {
            NotificationManager.error(deleteDnsProviderError, t('providers.delete-dns-provider-config-fai'), 3000);
        } else {
            NotificationManager.success(t('providers.successfully-deleted-dns-provi'), t('providers.delete-dns-provider-config'), 3000);
            this.props.getDnsProviderConfigs();
        }
    }

    handleDeleteError() {
        const { deleteDnsProviderError, t } = this.props;
        this.setState({modal: false});
        if (deleteDnsProviderError) {
            NotificationManager.error(deleteDnsProviderError, t('providers.failed-to-delete-dns-provider-'), 3000);
            this.props.history.push("/dns_provider");
        } else {
            NotificationManager.error(t('providers.failed-to-delete-dns-provider-'), t('providers.delete-dns-provider-config'), 3000);
            this.props.history.push("/dns_provider");
        }
    }

    render() {
        if (this.props.getDnsProviderLoading) {
            return (<div> <LoadingSpinner /></div>);
        }

        const { dns_provider_configs, t } = this.props;

        const tableColumns = [
            {
                type: "text",
                name: t('providers.Name'),
                accessor: "dns_provider_config_name",
                filterable: true,
                sortable: true,
                overwrite: true,
                cell: (data) => <StandardColumn key={'dns_provider_config_name' + data.original.dns_provider_config_id} main={data.value} sub={data.original.dns_provider_display_name} first={true}></StandardColumn>
            },
            {
                type: "text",
                name: t('providers.provider'),
                accessor: "dns_provider_display_name",
                filterable: true,
                sortable: true,
                showByDefault: false
            },
        ];

        const actions = [
            { id: "edit", icon: "fa-pencil", description: t('buttons.Edit') },
            { id: "delete", icon: "fa-trash", description: t('buttons.Delete') },
        ];

        const onAction = (action, item) => {
            switch (action) {
                case "view":
                    this.props.history.push(`/view_dns_provider/${item.dns_provider_config_id}`);
                    break;

                case "edit":
                    this.props.history.push(`/update_dns_provider/${item.dns_provider_config_id}`);
                    break;

                case "delete":
                    this.deleteConfirm(item.dns_provider_config_id, item.dns_provider_name);
                    break;
                case "deleteMulti":
                    item.forEach(id => {
                        const provider = this.props.dns_provider_configs.find(p => p.dns_provider_config_id === id)
                        this.props.deleteDnsProviderConfig(id, provider.dns_provider_name).
                        then(() => this.handleDeleteSuccess()).
                        catch(() => this.handleDeleteError());
                                })
                    break;
    
            }
        }

        return (
            <div className="profile-page">
                <PageHeader location={this.props.location} routes={typeof newRoutes !== 'undefined' ? newRoutes : null} title={t('providers.dns-provider-configurations')} icon={<FontAwesomeIcon icon={faChartNetwork} />} />
                <Row>
                    <Col sm={{ size: 10, order: 3, offset: 1 }}>
                        <DataTable
                            id="dns_provider"
                            data={dns_provider_configs}
                            columns={tableColumns}
                            actions={actions}
                            onAction={onAction}
                            mainId="dns_provider_config_id"
                            add={{
                                name: t('buttons.Add'),
                                action: '/create_dns_provider'
                            }}
                        />
                    </Col>
                </Row>

                <ConfirmAction
                    confirmationDetails={{
                        action: null,
                        details: {
                            title: t('providers.delete-dns-provider-config'),
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
                    onAction={this.deleteDnsProviderAction}
                />

            </div>
        );
    }

}
const DnsProviderConfigTranslated = withTranslation('common')(DnsProviderConfig)
export default connect(state => ({
    dns_provider_configs: state.dns_provider.dns_provider_configs || [],
    getDnsProviderLoading: state.dns_provider.getDnsProviderLoading || false,
    getDnsProviderErrorMessage: state.dns_provider.getDnsProviderErrorMessage || false,
    getDnsProviderError: state.dns_provider.getDnsProviderError || null,
    deleteDnsProviderError: state.dns_provider.deleteDnsProviderError || null,
    deletedDnsProvider: state.dns_provider.deletedDnsProvider || null,
    deleteDnsProviderLoading: state.dns_provider.deletDnsProviderLoading || null,
    pages: { pageSize: state.dns_provider.pageSize, pageNo: state.dns_provider.pageNo },
}),
    dispatch => ({
        getDnsProviderConfigs: () => dispatch(getDnsProviderConfigs()),
        deleteDnsProviderConfig: (dns_provider_config_id, dns_provider_name) => dispatch(deleteDnsProviderConfig(dns_provider_config_id, dns_provider_name)),
        setPageInfo: (data) => dispatch(setProviderPageInfo(data)),
    }))(DnsProviderConfigTranslated);
