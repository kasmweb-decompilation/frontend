import React, { Component } from 'react';
import { connect } from "react-redux";
import { Row, Col, Alert } from "reactstrap";
import { NotificationManager } from "react-notifications";
import LoadingSpinner from "../../components/LoadingSpinner/index";
import DataTable from "../../components/Table/Table";
import { ConfirmAction } from "../../components/Table/NewTable";
import { notifySuccess, notifyFailure } from "../../components/Form/Form.js";
import { Link } from "react-router-dom";
import { getAutoScaleConfigs, deleteAutoScaleConfig, setAutoScalePageInfo, updateAutoScaleConfig } from "../../actions/actionAutoScale";
import { withRouter } from "react-router-dom";
import Select from "react-select";

import {withTranslation} from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faScaleBalanced } from '@fortawesome/free-solid-svg-icons/faScaleBalanced';
import { faPaperclip } from '@fortawesome/free-solid-svg-icons/faPaperclip';
import { faCircleMinus } from '@fortawesome/free-solid-svg-icons/faCircleMinus';
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';
import { faClone } from '@fortawesome/free-solid-svg-icons/faClone';
import PageHeader, { parentRoutes } from "../../components/Header/PageHeader";
import { Modal, ModalFooter } from '../../components/Form/Modal';

const parentRouteList = parentRoutes('/server_pools')
const newRoutes = [
    ...parentRouteList.routes,
    {name: "pools.autoscale",path:"/autoscale",isActive: true},
];

const ConditionalWrapper = ({ condition, wrapper, children }) => condition ? wrapper(children) : children;

class AutoScale extends Component {
    constructor(props) {
        super(props);

        this.state = {
            modal: false,
            filterId: null,
            autoscalesModal: false,
            selectedAutoScaleConfigs: [],
        };

        this.cancelDelete = this.cancelDelete.bind(this);
        this.deleteConfirm = this.deleteConfirm.bind(this);
        this.deleteAutoScaleConfigAction = this.deleteAutoScaleConfigAction.bind(this);
        this.handleDeleteSuccess = this.handleDeleteSuccess.bind(this);
        this.handleDeleteError = this.handleDeleteError.bind(this);
        this.assignAutoScaleConfigs = this.assignAutoScaleConfigs.bind(this);
        this.cancelAutoScaleConfigsModal = this.cancelAutoScaleConfigsModal.bind(this);
        this.handleChangeAutoScaleConfigs = this.handleChangeAutoScaleConfigs.bind(this);
        this.unassignConfirm = this.unassignConfirm.bind(this);
        this.unassignConfig = this.unassignConfig.bind(this);

    }

    componentDidMount() {
        this.props.getAutoScaleConfigs();
    }

    handleChangeAutoScaleConfigs(selectedAutoScaleConfigs) {
        this.setState({ selectedAutoScaleConfigs });
    }

    unassignConfirm(autoscaleConfigId) {
        const { t } = this.props;
        this.setState(
            {
                confirmationOpen: true,
                confirmationDetails: {
                    details: {
                        title: t('autoscale.unassign', { count: 1 }),
                        text: t('autoscale.unassign-desc', { count: 1 }),
                        iconBg: 'tw-bg-pink-700',
                        icon: <FontAwesomeIcon icon={faTrash} />,
                        confirmBg: 'tw-bg-pink-700',
                        confirmText: t('buttons.unassign')
                    },
                },
                onAction: () => this.unassignConfig(autoscaleConfigId)
    
            });

    }


    deleteConfirm(autoscaleConfigId) {
        this.setState({
            modal: !this.state.modal,
            autoscaleConfigId: autoscaleConfigId
        });
    }

    cancelDelete() {
        this.setState({ modal: !this.state.modal });
    }

    cancelAutoScaleConfigsModal() {
        this.setState({ autoscalesModal: !this.state.autoscalesModal });
    }

    deleteAutoScaleConfigAction() {
        this.props.deleteAutoScaleConfig(this.state.autoscaleConfigId).
            then(() => this.handleDeleteSuccess()).
            catch(() => this.handleDeleteError());
    }

    async assignAutoScaleConfigs() {
        await Promise.all(this.state.selectedAutoScaleConfigs.map(async autoscale => {
            const autoscaleToUpdate = this.props.autoscale_configs.find(all => all.autoscale_config_id === autoscale.value)
            autoscaleToUpdate.server_pool_id = this.props.pool
            await this.props.updateAutoScaleConfig(autoscaleToUpdate)
        }))

        this.setState({ selectedAutoScaleConfigs: [], autoscalesModal: false });
    }

    async unassignConfig(autoscaleConfigId) {
        const autoscaleToUpdate = this.props.autoscale_configs.find(all => all.autoscale_config_id === autoscaleConfigId)
        autoscaleToUpdate.server_pool_id = null

        try {
            const { response: { error_message: errorMessage } } = await this.props.updateAutoScaleConfig(autoscaleToUpdate);
            notifySuccess({ errorMessage, type: 'update' })
        } catch(error) {
            notifyFailure({ error, type: 'update' })
        }
        this.setState({
            onAction: null
        })
    }


    handleDeleteSuccess() {
        const { deleteBrandingErrorMessage, t } = this.props;
        this.setState({modal: false});
        if (deleteBrandingErrorMessage) {
            NotificationManager.error(deleteBrandingErrorMessage, t("autoscale.Delete AutoScale Config Failed"), 3000);
        } else {
            NotificationManager.success(t("autoscale.Successfully Deleted AutoScale Config"), t("autoscale.Delete AutoScale Config"), 3000);
            this.props.getAutoScaleConfigs();
        }
    }

    handleDeleteError() {
        const { deleteBrandingError, t } = this.props;
        this.setState({modal: false});
        if (deleteBrandingError) {
            NotificationManager.error(deleteBrandingError, t("autoscale.Failed to Delete AutoScale Config"), 3000);
            this.props.history.push("/autoscale");
        } else {
            NotificationManager.error(t("autoscale.Failed to Delete AutoScale Config"), t("autoscale.Delete AutoScale Config"), 3000);
            this.props.history.push("/autoscale");
        }
    }

    render() {
        if (this.props.getAutoScaleLoading) {
            return (<div> <LoadingSpinner /></div>);
        }

        const { autoscale_configs, license_info, t } = this.props;
        let filtered_autoscale_configs = [];
        let unattached_autoscale = []

        if (this.props.pool) {
            filtered_autoscale_configs = autoscale_configs.filter(config => config.server_pool_id === this.props.pool)
            unattached_autoscale = autoscale_configs.filter(config => config.server_pool_id !== this.props.pool && config.autoscale_type === this.props.serverPoolType)
        } else {
            filtered_autoscale_configs = autoscale_configs
            unattached_autoscale = autoscale_configs
        }

        let optionsAutoScaleConfigs = [];
        unattached_autoscale.map(opt => {
            optionsAutoScaleConfigs.push({ label: opt.autoscale_config_name, value: opt.autoscale_config_id });
        });


        const tableColumns = [
            {
                type: "text",
                name: t("autoscale.Name"),
                accessor: "autoscale_config_name",
                filterable: true,
                sortable: true,
                colSize: 'minmax(200px,1.2fr) '
            },
            {
                type: "text",
                name: t("autoscale.Type"),
                accessor: "autoscale_type",
                filterable: true,
                sortable: true,
            },
            {
                type: "flag",
                name: t("autoscale.Enabled"),
                accessor: "enabled",
                filterable: true,
                sortable: true,
            },
            {
                type: "text",
                name: t("autoscale.Zone"),
                accessor: "zone_name",
                filterable: true,
                sortable: true,
            },
            {
                type: "text",
                name: t("autoscale.Provider"),
                accessor: "vm_provider_config.vm_provider_display_name",
                filterable: true,
                sortable: true,
            },
            {
                accessor: "connection_port",
                name: t("autoscale.Connection Port"),
                filterable: true,
                sortable: true,
                showByDefault: false
            },
            {
                accessor: "connection_username",
                name: t("autoscale.Connection Username"),
                filterable: true,
                sortable: true,
                showByDefault: false
            },
            {
                accessor: "ad_create_machine_record",
                name: t("autoscale.Create Active Directory Computer Record"),
                filterable: true,
                sortable: true,
                showByDefault: false
            },
            {
                accessor: "ad_recursive_machine_record_cleanup",
                name: t("autoscale.Recursively Cleanup Active Directory Computer Record"),
                filterable: true,
                sortable: true,
                showByDefault: false
            },
            {
                accessor: "ldap_id",
                name: t("autoscale.LDAP ID"),
                filterable: true,
                sortable: true,
                showByDefault: false
            },
            {
                accessor: "ad_computer_container_dn",
                name: t("autoscale.Active Directory Computer OU DN"),
                filterable: true,
                sortable: true,
                showByDefault: false
            },
            {
                accessor: "standby_cores",
                name: t("autoscale.Standby Cores"),
                filterable: true,
                sortable: true,
                showByDefault: false
            },
            {
                accessor: "standby_memory_mb",
                name: t("autoscale.Standby Memory (MB)"),
                filterable: true,
                sortable: true,
                showByDefault: false
            },
            {
                accessor: "standby_gpus",
                name: t("autoscale.Standby GPUs"),
                filterable: true,
                sortable: true,
                showByDefault: false
            },
            {
                accessor: "downscale_backoff",
                name: t("autoscale.Downscale Backoff"),
                filterable: true,
                sortable: true,
                showByDefault: false
            },
            {
                accessor: "agent_cores_override",
                name: t("autoscale.Agent Cores Override"),
                filterable: true,
                sortable: true,
                showByDefault: false
            },
            {
                accessor: "agent_memory_override_gb",
                name: t("autoscale.Agent Memory Override (GB)"),
                filterable: true,
                sortable: true,
                showByDefault: false
            },
            {
                accessor: "agent_gpus_override",
                name: t("autoscale.Agent GPUs Override"),
                filterable: true,
                sortable: true,
                showByDefault: false
            },
            {
                accessor: "register_dns",
                name: t("autoscale.Register DNS"),
                filterable: true,
                sortable: true,
                showByDefault: false
            },

        ];

        const actions = [
            { id: "edit", icon: "fa-pencil", description: t("buttons.Edit") },
            { id: "clone", icon: <FontAwesomeIcon icon={faClone} />, description: t("buttons.Clone") },
            { id: "delete", icon: "fa-trash", description: t("buttons.Delete") },
        ];

        let multiActions = []

        if (this.props.inline) {

            multiActions = [
                {
                    name: t('buttons.unassign'),
                    action: 'unassignMulti',
                    confirm: { // If this is set, then a confirmation modal is triggered before the action is done
                        title: t('autoscale.unassign', { count: 0 }),
                        text: t('autoscale.unassign-desc', { count: 0 }),
                        iconBg: 'tw-bg-pink-700 tw-text-white',
                        icon: <FontAwesomeIcon icon={faCircleMinus} />,
                        confirmBg: 'tw-bg-pink-700',
                        confirmText: t('buttons.unassign')
                    }
                }
            ]

            actions.push({ id: 'unassign', icon: <FontAwesomeIcon icon={faCircleMinus} />, description: t('buttons.unassign') })
        }

        const haspool = (this.props.pool) ? 'pool=' + this.props.pool : ''
        const create_link = {
            pathname: "/create_autoscale"
        }
        create_link.search = haspool


        const onAction = (action, item) => {
            switch (action) {
                case "edit":
                    this.props.history.push(`/update_autoscale/${item.autoscale_config_id}?${haspool}`);
                    break;

                case "clone":
                    this.props.history.push(`/create_autoscale?clone=${item.autoscale_config_id}&${haspool}`);
                    break;

                case "delete":
                    this.deleteConfirm(item.autoscale_config_id);
                    break;
                case "deleteMulti":
                    item.forEach(id => {
                        this.props.deleteAutoScaleConfig(id).
                        then(() => this.handleDeleteSuccess()).
                        catch(() => this.handleDeleteError());
                    })
                    break;
                case "unassign":
                    this.unassignConfirm(item.autoscale_config_id)
                break;

                case "unassignMulti":
                    item.forEach(id => {
                        this.unassignConfig(id)
                    })
                break;

            }
        }
        let license_url = `${__LICENSE_INFO_URL__}`;
        let addButton = null
        if (license_info && license_info.status && license_info.status.features && license_info.status.features.indexOf('auto_scaling') >= 0) {
            addButton = {
                name: t('autoscale.Add'),
                action: create_link.pathname,
                search: create_link.search
            }
        }
        return (
            <div className="profile-page">
                <ConditionalWrapper
                    condition={!this.props.inline}
                    wrapper={children => (
                        <React.Fragment>
                            <PageHeader location={this.props.location} routes={typeof newRoutes !== 'undefined' ? newRoutes : null} title={t('autoscale.AutoScale Configurations')} icon={<FontAwesomeIcon icon={faScaleBalanced} />} hideBreadCrumbs={!!this.props.pool} />
                            <Row>
                                <Col sm={{ size: 10, order: 3, offset: 1 }}>
                                    {children}
                                </Col>
                            </Row>
                        </React.Fragment>
                    )}>


                    <React.Fragment>

                        {license_info && license_info.status && license_info.status.features && license_info.status.features.indexOf('auto_scaling') >= 0 ? (
                            <React.Fragment>
                            {this.props.pool && (
                                <button onClick={() => this.setState({ autoscalesModal: true })} className="tw-ml-auto tw-rounded tw-h-10 tw-bg-slate-500 hover:tw-bg-slate-600 tw-text-sm tw-text-white tw-flex tw-items-center tw-transition">
                                    <span className="tw-h-10 tw-w-12 tw-flex tw-justify-center tw-items-center tw-bg-black/10"><FontAwesomeIcon icon={faPaperclip} /></span><span className="tw-px-4">{t('autoscale.Assign')}</span>
                                </button>
                            )}
            
                            <DataTable
                                id="autoscale"
                                data={filtered_autoscale_configs}
                                columns={tableColumns}
                                actions={actions}
                                multiActions={multiActions}
                                onAction={onAction}
                                mainId="autoscale_config_id"
                                add={addButton}
                            />
                            </React.Fragment>
                        ) : (
                            <Alert color="none" isOpen={true}>
                                <h4>{t("autoscale.Unavailable")}</h4>
                                {t("autoscale.This feature must be licensed")}
                                <hr />
                                <a href={license_url}>{t("autoscale.More Information")}</a><br />
                            </Alert>)}
                    </React.Fragment>
                </ConditionalWrapper>

                {this.state.confirmationDetails && (
                    <ConfirmAction
                        confirmationDetails={this.state.confirmationDetails}
                        open={this.state.confirmationOpen}
                        setOpen={(value) => { this.setState({ confirmationOpen: value }) }}
                        onAction={this.state.onAction}
                    />
                )}


                <ConfirmAction
                    confirmationDetails={{
                        action: null,
                        details: {
                            title: t('autoscale.Delete AutoScale Config'),
                            text: t('autoscale.confirm_delete'),
                            iconBg: 'tw-bg-pink-700 tw-text-white',
                            icon: <FontAwesomeIcon icon={faTrash} />,
                            confirmBg: 'tw-bg-pink-700',
                            confirmText: t('buttons.Delete'),

                        }
                    }}
                    open={this.state.modal}
                    externalClose={true}
                    setOpen={this.cancelDelete}
                    onAction={this.deleteAutoScaleConfigAction}
                />

                <Modal
                    icon={<FontAwesomeIcon icon={faScaleBalanced} />}
                    iconBg="tw-bg-blue-500 tw-text-white"
                    title="buttons.Assign"
                    contentRaw={
                        <div className='tw-text-left tw-mt-8'>
                        <Select
                            name="autoscales"
                            multi={true}
                            options={optionsAutoScaleConfigs}
                            value={this.state.selectedAutoScaleConfigs}
                            onChange={this.handleChangeAutoScaleConfigs}
                        />
                        </div>
                    }
                    open={this.state.autoscalesModal}
                    setOpen={this.cancelAutoScaleConfigsModal}
                    modalFooter={<ModalFooter cancel={this.cancelAutoScaleConfigsModal} saveName='buttons.Assign' save={this.assignAutoScaleConfigs} />}
                />

            </div>
        );
    }

}

let AutoScaleWithRouter = withRouter(AutoScale);
const AutoScaleWithRouterTranslated = withTranslation('common')(AutoScaleWithRouter)
export default connect(state => ({
    autoscale_configs: state.autoscale.autoscale_configs || [],
    getAutoScaleLoading: state.autoscale.getAutoScaleLoading || false,
    getBrandingErrorMessage: state.autoscale.getBrandingErrorMessage || false,
    getBrandingError: state.autoscale.getBrandingError || null,
    deleteBrandingErrorMessage: state.autoscale.deleteBrandingErrorMessage || null,
    deleteBrandingError: state.autoscale.deleteBrandingError || null,
    deletedBranding: state.autoscale.deletedBranding || null,
    deleteBrandingLoading: state.autoscale.deleteBrandingLoading || null,
    pages: { pageSize: state.autoscale.pageSize, pageNo: state.autoscale.pageNo },
    license_info: state.footer && state.footer.license_info ? state.footer.license_info : null,
}),
    dispatch => ({
        getAutoScaleConfigs: () => dispatch(getAutoScaleConfigs()),
        updateAutoScaleConfig: (data) => dispatch(updateAutoScaleConfig(data)),
        deleteAutoScaleConfig: (data) => dispatch(deleteAutoScaleConfig(data)),
        setPageInfo: (data) => dispatch(setBrandingPageInfo(data)),
    }))(AutoScaleWithRouterTranslated);
