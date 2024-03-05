import React, { Component } from "react";
import { connect } from "react-redux";
import { getServerPools, deleteServerPool, setServerPoolPageInfo } from "../../actions/actionServerPool";
import { Link } from "react-router-dom";
import { Row, Col } from "reactstrap";
import { NotificationManager } from "react-notifications";
import LoadingSpinner from "../../components/LoadingSpinner/index";

import Proptypes from "prop-types";
import DataTable from "../../components/Table/Table";
import { getLicenses } from "../../actions/actionSystemInfo";
import {withTranslation} from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faObjectGroup } from '@fortawesome/free-solid-svg-icons/faObjectGroup';
import { faScaleBalanced } from '@fortawesome/free-solid-svg-icons/faScaleBalanced';
import { faCube } from '@fortawesome/free-solid-svg-icons/faCube';
import { faChartNetwork } from '@fortawesome/free-solid-svg-icons/faChartSimple';
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';
import PageHeader from "../../components/Header/PageHeader";
import { Button } from "../../components/Form/Form.js"
import { ConfirmAction } from "../../components/Table/NewTable";
import { hasAuth } from "../../utils/axios";

class ServerPools extends Component {
    constructor(props) {
        super(props);

        this.state = {
            modal: false,
            pages: 1,
            server_poolId: null,
        };

        this.deleteConfirm = this.deleteConfirm.bind(this);
        this.deleteServerPoolAction = this.deleteServerPoolAction.bind(this);
        this.handleDeleteSuccess = this.handleDeleteSuccess.bind(this);
        this.handleDeleteError = this.handleDeleteError.bind(this);
        this.cancelDelete = this.cancelDelete.bind(this);
    }

    componentDidMount() {
        this.props.getServerPools();
    }

    deleteConfirm(server_poolId) {
        this.setState({
            modal: !this.state.modal,
            server_poolId: server_poolId
        });
    }

    cancelDelete() {
        this.setState({ modal: !this.state.modal });
    }

    deleteServerPoolAction() {
        this.props.deleteServerPool(this.state.server_poolId).
            then(() => this.handleDeleteSuccess()).
            catch(() => this.handleDeleteError());
    }

    handleDeleteSuccess() {
        const { deleteServerPoolErrorMessage, t } = this.props;
        this.setState({modal: false});
        if (deleteServerPoolErrorMessage) {
            NotificationManager.error(deleteServerPoolErrorMessage, t('pools.delete-pool-failed'), 3000);
        } else {
            NotificationManager.success(t('pools.successfully-deleted-pool'), t('pools.delete-pool'), 3000);
            this.props.getServerPools();
        }
    }

    handleDeleteError() {
        const { deleteServerPoolError, t } = this.props;
        this.setState({modal: false});
        if (deleteServerPoolError) {
            NotificationManager.error(deleteServerPoolError, t('pools.failed-to-delete-pool'), 3000);
            this.props.history.push("/server_pools");
        } else {
            NotificationManager.error(t('pools.failed-to-delete-pool'), t('pools.delete-pool'), 3000);
            this.props.history.push("/server_pools");
        }
    }

    render() {
        if (this.props.getServerPoolsLoading) {
            return (<div> <LoadingSpinner /></div>);
        }

        const { server_pools, license_info, t } = this.props;

        const columns = [
            {
                type: "text",
                name: t('pools.server_pool_name'),
                accessor: "server_pool_name",
                filterable: true,
                sortable: true
            },
            {
                type: "text",
                name: t('pools.servers'),
                accessor: "servers.length",
                filterable: false,
                sortable: true
            },
            {
                type: "text",
                name: t('pools.server_pool_type'),
                accessor: "server_pool_type",
                filterable: false,
                sortable: true
            },
        ];

        const actions = [
            { id: "edit", icon: "fa-pencil", description: t('buttons.Edit') },
            { id: "delete", icon: "fa-trash", description: t('buttons.Delete') },
        ];

        const onAction = (action, item) => {
            switch (action) {
                case "edit":
                    this.props.history.push(`/update_server_pool/${item.server_pool_id}`);
                    break;

                case "delete":
                    this.deleteConfirm(item.server_pool_id);
                    break;
                case "deleteMulti":
                    item.forEach(id => {
                        this.props.deleteServerPool(id).
                        then(() => this.handleDeleteSuccess()).
                        catch(() => this.handleDeleteError());
                    })
                    break;

            }
        }

        return (
            <div className="profile-page">
                <PageHeader location={this.props.location} routes={typeof newRoutes !== 'undefined' ? newRoutes : null} title={t('pools.pools')} icon={<FontAwesomeIcon icon={faObjectGroup} />} />
                <Row>
                    <Col sm={{ size: 10, order: 3, offset: 1 }}>
                        <DataTable
                            id="server_pools"
                            data={server_pools}
                            columns={columns}
                            actions={actions}
                            onAction={onAction}
                            mainId="server_pool_id"
                            add={{
                                name: t('pools.add'),
                                action: '/create_server_pool'
                            }}
                        />
                    </Col>
                </Row>
                {license_info && license_info.status && license_info.status.features && license_info.status.features.indexOf('auto_scaling') >= 0 && (
                <Row className="tw-pb-8">
                    <Col sm={{ size: 10, order: 3, offset: 1 }}>
                        <div className="tw-flex tw-justify-between tw-flex-wrap tw-gap-3">
                            {hasAuth('autoscale') && <Link className="tw-inline-block" to={{ pathname: "/autoscale" }}><Button section="pools" icon={<FontAwesomeIcon icon={faScaleBalanced} />} name="all-autoscale-configs" color="tw-bg-slate-500" /></Link>}
                            {hasAuth('vm_providers') && <Link className="tw-inline-block" to={{ pathname: "/vm_provider" }}><Button section="pools" icon={<FontAwesomeIcon icon={faCube} />} name="all-vm-provider-configs" color="tw-bg-slate-500" /></Link>}
                            {hasAuth('dns_providers') && <Link className="tw-inline-block" to={{ pathname: "/dns_provider" }}><Button section="pools" icon={<FontAwesomeIcon icon={faChartNetwork} />} name="all-dns-provider-configs" color="tw-bg-slate-500" /></Link>}                      
                        </div>
                    </Col>
                </Row>
                )}

                <ConfirmAction
                    confirmationDetails={{
                        action: null,
                        details: {
                            title: t('pools.delete-pool'),
                            text: t('pools.are-you-sure-you-want-to-delet'),
                            iconBg: 'tw-bg-pink-700 tw-text-white',
                            icon: <FontAwesomeIcon icon={faTrash} />,
                            confirmBg: 'tw-bg-pink-700',
                            confirmText: t('buttons.Delete'),

                        }
                    }}
                    open={this.state.modal}
                    externalClose={true}
                    setOpen={this.cancelDelete}
                    onAction={this.deleteServerPoolAction}
                />

            </div>
        );
    }
}

ServerPools.propTypes = {
    getServerPools: Proptypes.func.isRequired,
    deleteServerPool: Proptypes.func.isRequired,
    deleteServerPoolErrorMessage: Proptypes.func,
    deleteServerPoolError: Proptypes.func,
    history: Proptypes.object.isRequired,
    server_pools: Proptypes.array,
    createServerPoolLoading: Proptypes.bool,
    className: Proptypes.func
};

const ServerPoolsTranslated = withTranslation('common')(ServerPools)
export default connect(state => ({
    server_pools: state.server_pools.server_pools || [],
    license_info: state.footer && state.footer.license_info ? state.footer.license_info : null,
    createServerPoolLoading: state.server_pools.createServerPoolLoading || false,
    deleteServerPoolErrorMessage: state.server_pools.deleteServerPoolErrorMessage || null,
    deleteServerPoolLoading: state.server_pools.deleteServerPoolLoading || false,
    deleteServerPoolError: state.server_pools.deleteServerPoolError || null,
    getServerPoolsLoading: state.server_pools.getServerPoolsLoading || null,
    pages: { pageSize: state.server_pools.pageSize, pageNo: state.server_pools.pageNo },
}),
    dispatch => ({
        getServerPools: () => dispatch(getServerPools()),
        getLicenses: () => dispatch(getLicenses()),
        deleteServerPool: (data) => dispatch(deleteServerPool(data)),
        setPageInfo: (data) => dispatch(setServerPoolPageInfo(data)),
    }))(ServerPoolsTranslated);