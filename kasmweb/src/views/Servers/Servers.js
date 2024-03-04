import React, { Component } from "react";
import { connect } from "react-redux";
import { getServers, updateServer, deleteServer, destroyAgentKasms, setAgentPageInfo } from "../../actions/actionServer";
import { Row, Col, UncontrolledTooltip } from "reactstrap";
import LoadingSpinner from "../../components/LoadingSpinner/index";
import { NotificationManager } from "react-notifications";

import Proptypes from "prop-types";
import DataTable from "../../components/Table/Table";
import { SettingColumn } from "../../components/Table/NewTable";

import moment from "moment";
import { Link, withRouter } from "react-router-dom";
import Select from "react-select";
import "react-select/dist/react-select.css";
import {withTranslation} from "react-i18next";
import { StandardColumn, ConfirmAction } from "../../components/Table/NewTable";
import { notifySuccess, notifyFailure, CopyToClipboard } from "../../components/Form";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperclip } from '@fortawesome/free-solid-svg-icons/faPaperclip';
import { faServer } from '@fortawesome/free-solid-svg-icons/faServer';
import { faCircleMinus } from '@fortawesome/free-solid-svg-icons/faCircleMinus';
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';
import PageHeader from "../../components/Header/PageHeader";
import { RenderToggle } from "../../utils/formValidations";
import { Modal, ModalFooter } from "../../components/Form/Modal";

const ConditionalWrapper = ({ condition, wrapper, children }) => condition ? wrapper(children) : children;

class Agents extends Component {
    constructor(props) {
        super(props);

        this.state = {
            modal: false,
            pages: 1,
            serverId: null,
            server_type: 'Desktop',
            serversModal: false,
            selectedServers: [],
            forceDelete: false,
            destroyModal: false,
        };

        this.deleteConfirm = this.deleteConfirm.bind(this);
        this.destroyKasmsConfirm = this.destroyKasmsConfirm.bind(this);
        this.deleteServerAction = this.deleteServerAction.bind(this);
        this.destroyKasmsAction = this.destroyKasmsAction.bind(this);
        this.cancelDelete = this.cancelDelete.bind(this);
        this.cancelDestroy = this.cancelDestroy.bind(this);
        this.handleDeleteSuccess = this.handleDeleteSuccess.bind(this);
        this.handleDeleteError = this.handleDeleteError.bind(this);
        this.handleDestroyKasmSuccess = this.handleDestroyKasmSuccess.bind(this);
        this.handleDestroyKasmError = this.handleDestroyKasmError.bind(this);
        this.assignServer = this.assignServer.bind(this);
        this.cancelServersModal = this.cancelServersModal.bind(this);
        this.handleChangeServers = this.handleChangeServers.bind(this);
        this.toggleChange = this.toggleChange.bind(this);
        this.unassignConfirm = this.unassignConfirm.bind(this);
        this.unassignServer = this.unassignServer.bind(this);

    }

    componentDidMount() {
        this.props.getServers();
    }

    async toggleChange(event) {
        this.setState({ forceDelete: !!event.target.checked })
    }

    handleChangeServers(selectedServers) {
        this.setState({ selectedServers });
    }

    unassignConfirm(serverId) {
        const { t } = this.props;
        this.setState(
            {
                confirmationOpen: true,
                confirmationDetails: {
                    details: {
                        title: t('servers.unassign', { count: 1 }),
                        text: t('servers.unassign-desc', { count: 1 }),
                        iconBg: 'tw-bg-pink-700',
                        icon: <FontAwesomeIcon icon={faTrash} />,
                        confirmBg: 'tw-bg-pink-700',
                        confirmText: t('buttons.unassign')
                    },
                },
                onAction: () => this.unassignServer(serverId)
    
            });

    }

    deleteConfirm(serverId) {
        this.setState({ modal: !this.state.modal, serverId: serverId });
    }

    destroyKasmsConfirm(serverId) {
        this.setState({ destroyModal: !this.state.destroyModal, serverId: serverId });
    }

    cancelDestroy() {
        this.setState({ destroyModal: !this.state.destroyModal });
    }

    cancelDelete() {
        this.setState({ modal: !this.state.modal });
    }

    cancelServersModal() {
        this.setState({ serversModal: !this.state.serversModal });
    }

    async assignServer() {
        await Promise.all(this.state.selectedServers.map(async server => {
            const serverToUpdate = this.props.servers.find(all => all.server_id === server.value)
            serverToUpdate.server_pool_id = this.props.pool
            await this.props.updateServer(serverToUpdate)
        }))

        this.setState({ selectedServers: [], serversModal: false });
    }

    async unassignServer(serverId) {
        const serverToUpdate = this.props.servers.find(all => all.server_id === serverId)
        serverToUpdate.server_pool_id = ''

        try {
            const { response: { error_message: errorMessage } } = await this.props.updateServer(serverToUpdate);
            notifySuccess({ errorMessage, type: 'update' })
        } catch(error) {
            notifyFailure({ error, type: 'update' })
        }
        this.setState({
            onAction: null
        })
    }

    deleteServerAction() {
        this.props.deleteServer({ server_id: this.state.serverId, force: !!this.state.forceDelete}).
            then(() => this.handleDeleteSuccess()).
            catch(() => this.handleDeleteError());
    }

    destroyKasmsAction() {
        this.props.destroyAgentKasms(this.state.serverId).
            then(() => this.handleDestroyKasmSuccess()).
            catch(() => this.handleDestroyKasmError());
    }

    handleDeleteSuccess() {
        const { deleteServerErrorMessage, t } = this.props;
        this.setState({modal: false});
        if (deleteServerErrorMessage) {
            NotificationManager.error(deleteServerErrorMessage, t('servers.delete-server'), 3000);
        }
        else {
            NotificationManager.success(t('servers.successfully-deleted-server'), t('servers.delete-server'), 3000);
            this.props.getServers();
        }
    }

    handleDeleteError() {
        const { deleteServerError, t } = this.props;
        this.setState({modal: false});
        if (deleteServerError) {
            NotificationManager.error(deleteServerError, t('servers.delete-server'), 3000);
        }
        else {
            NotificationManager.error(t('servers.failed-to-delete-server'), t('servers.delete-server'), 3000);
        }
    }

    handleDestroyKasmSuccess() {
        const { destroyAgentKasmsErrorMessage, t } = this.props;
        if (destroyAgentKasmsErrorMessage) {
            NotificationManager.error(destroyAgentKasmsErrorMessage, t('servers.delete-sessions'), 3000);
            this.setState({ destroyModal: false });
        }
        else {
            NotificationManager.success(t('servers.successfully-marked-sessions-f'), t('servers.delete-sessions'), 3000);
            this.setState({ destroyModal: false });
            this.props.getServers();
        }
    }

    handleDestroyKasmError() {
        const { destroyAgentKasmsError, t } = this.props;
        if (destroyAgentKasmsError) {
            NotificationManager.error(destroyAgentKasmsError, t('servers.delete-sessions'), 3000);
            this.setState({ destroyModal: false });
        }
        else {
            NotificationManager.error(t('servers.failed-to-mark-sessions-for-de'), t('servers.delete-sessions'), 3000);
            this.setState({ destroyModal: false });
        }
    }

    render() {
        if (this.props.getServersLoading) {
            return (<div> <LoadingSpinner /></div>);
        }


        const { servers, t } = this.props;
        let filtered_servers = servers.filter(x => x.server_type.toLowerCase() === this.state.server_type.toLowerCase())
        let unattached_servers = [
            ...filtered_servers
        ]

        if (this.props.pool) {
            unattached_servers = unattached_servers.filter(config => config.server_pool_id !== this.props.pool)
            filtered_servers = filtered_servers.filter(config => config.server_pool_id === this.props.pool)
        }

        let optionsServers = [];
        unattached_servers.map(opt => {
            optionsServers.push({ label: opt.friendly_name, value: opt.server_id });
        });


        const columns = [
            {
                type: "text",
                name: t('servers.friendly-name'),
                accessor: "friendly_name",
                filterable: true,
                sortable: true,
                overwrite: true,
                cell: (data) => <StandardColumn key={'friendly_name' + data.original.server_id} main={data.value} sub={t('servers.created') + ': ' +  moment.utc(data.original.created).local().fromNow()} first={true}></StandardColumn>

            },
            {
                type: "flag",
                name: t('servers.enabled'),
                accessor: "enabled",
                filterable: true,
                sortable: true,
                overwrite: true,
                cell: (data) => <SettingColumn key={'value-' + data.original.group_setting_id} main={data.value} sub={data.colName} />
            },
            {
                type: "text",
                name: t('servers.status'),
                accessor: "operational_status",
                filterable: true,
                sortable: true,
            },
            {
                type: "text",
                name: t('servers.hostname'),
                accessor: "hostname",
                filterable: true,
                sortable: true,
            },
            {
                type: "date",
                accessor: "created",
                name: t('servers.created'),
                filterable: true,
                sortable: true,
                showByDefault: false,
                cell: (data) => <div>{moment(data.value).isValid() ? moment.utc(data.value).local().format("lll") : "-"}</div>
            },
            {
                type: "text",
                name: t('servers.server-id'),
                accessor: "server_id",
                filterable: true,
                sortable: true,
                cell: (data) => <React.Fragment><div><span id={"hostname-" + data.original.server_id}>{data.value.slice(0, 6)}...</span><CopyToClipboard value={data.value} /></div><UncontrolledTooltip placement="right" target={"hostname-" + data.original.server_id}>{data.value}</UncontrolledTooltip></React.Fragment>
            },
            {
                type: "text",
                name: t('servers.connection-type'),
                accessor: "connection_type",
                filterable: true,
                sortable: true,
            },
            {
                type: "text",
                name: t('servers.zone'),
                accessor: "zone.zone_name",
                filterable: true,
                sortable: true,
            },
            {
                type: "text",
                name: t('servers.sessions'),
                accessor: "kasms.length",
                filterable: true,
                sortable: true,
            },
            {
                type: "text",
                name: t('servers.provider'),
                accessor: "provider",
                filterable: true,
                sortable: true,
            },
            {
                type: "text",
                name: t('servers.pool'),
                accessor: "server_pool_name",
                filterable: true,
                sortable: true,
            },
            {
                accessor: "connection_port",
                name: t("servers.connection-port"),
                filterable: true,
                sortable: true,
                showByDefault: false
            },
            {
                accessor: "connection_username",
                name: t("servers.connection-username"),
                filterable: true,
                sortable: true,
                showByDefault: false
            },
            {
                accessor: "max_simultaneous_sessions",
                name: t("servers.max-simultaneous-sessions"),
                filterable: true,
                sortable: true,
                showByDefault: false
            },
    
        ];


        const actions = [
            { id: "edit", icon: "fa-pencil", description: t('buttons.Edit') },
            { id: "deleteserver", icon: "fa-trash", description: t('servers.delete-server') },
            { id: "delete-sessions", icon: "fa-trash", description: t('servers.delete-sessions') },
        ];

        const deleteConfirm = {
            title: t('tables.delete-items'),
            text: t('tables.are-you-sure-you-want-to-delet'),
            iconBg: 'tw-bg-pink-700 tw-text-white',
            icon: <FontAwesomeIcon icon={faTrash} />,
            confirmBg: 'tw-bg-pink-700',
            confirmText: t('tables.delete'),
            additional: 
              <div className="tw-text-center">
                  <label id="force_label" className="group-label tw-flex tw-justify-center tw-items-center tw-gap-3"><b className="tw-mb-2">{t('generic.force')}:</b> <RenderToggle name="force" checked={!!this.state.forceDelete} onChange={this.toggleChange} /></label>
                  <div className="tw-text-xs">{t('servers.you-cant-delete-a-server-with-')}</div>
              </div>

        }


        let multiActions = [
            {
                name: t('buttons.Delete'),
                action: 'deleteMulti',
                confirm: deleteConfirm
            }
        ]

        if (this.props.inline) {

            multiActions = [
                {
                    name: t('buttons.unassign'),
                    action: 'unassignMulti',
                    confirm: { // If this is set, then a confirmation modal is triggered before the action is done
                        title: t('servers.unassign', { count: 0 }),
                        text: t('servers.unassign-desc', { count: 0 }),
                        iconBg: 'tw-bg-pink-700 tw-text-white',
                        icon: <FontAwesomeIcon icon={faCircleMinus} />,
                        confirmBg: 'tw-bg-pink-700',
                        confirmText: t('buttons.unassign')
                    }
                }
            ]

            actions.push({ id: 'unassign', icon: <FontAwesomeIcon icon={faCircleMinus} />, description: t('buttons.unassign') })
        }

        const haspool = (this.props.pool) ? '?pool=' + this.props.pool : ''

        const onAction = (action, item) => {
            switch (action) {
                case "edit":
                    this.props.history.push(`/update_server/${item.server_id}${haspool}`);
                    break;

                case "deleteserver":
                    this.deleteConfirm(item.server_id);
                    break;

                case "delete-sessions":
                    this.destroyKasmsConfirm(item.server_id);
                    break;

                case "deletesingle":
                    this.props.deleteServer({ server_id: this.state.serverId, force: !!this.state.forceDelete}).
                    then(() => this.handleDeleteSuccess()).
                    catch(() => this.handleDeleteError());
                break;
                
                case "deleteMulti":
                    item.forEach(id => {
                        this.props.deleteServer({ server_id: id, force: !!this.state.forceDelete}).
                        then(() => this.handleDeleteSuccess()).
                        catch(() => this.handleDeleteError());
                    })
                break;

                case "unassign":
                    this.unassignConfirm(item.server_id)
                    break;

                case "unassignMulti":
                    item.forEach(id => {
                        this.unassignServer(id)
                    })
                break;
   
            }
        }

        let agentStyle = "btn btn-outline-primary btn-block ";
        let desktopStyle = "btn btn-outline-primary btn-block";

        const create_link = {
            pathname: "/create_server"
        }
        if (this.props.pool) {
            create_link.search = 'pool=' + this.props.pool
        }

        return (
            <div className="profile-page">
                <ConditionalWrapper
                    condition={!this.props.inline}
                    wrapper={children => (
                        <React.Fragment>

                            <PageHeader location={this.props.location} routes={typeof newRoutes !== 'undefined' ? newRoutes : null} title={t('servers.servers')} icon={<FontAwesomeIcon icon={faServer} />} hideBreadCrumbs={!!this.props.pool} />
                            <Row>
                                <Col sm={{ size: 10, order: 3, offset: 1 }}>
                                    {children}
                                </Col>
                            </Row>
                        </React.Fragment>
                    )}>
                    <React.Fragment>
                        {this.props.pool && (
                            <button onClick={() => this.setState({ serversModal: true })} className="tw-ml-auto tw-rounded tw-h-10 tw-bg-slate-500 hover:tw-bg-slate-600 tw-text-sm tw-text-white tw-flex tw-items-center tw-transition">
                                <span className="tw-h-10 tw-w-12 tw-flex tw-justify-center tw-items-center tw-bg-black/10"><FontAwesomeIcon icon={faPaperclip} /></span><span className="tw-px-4">{t('buttons.Assign')}</span>
                            </button>
                        )}

                        <DataTable
                            id="servers_c"
                            data={filtered_servers}
                            columns={columns}
                            actions={actions}
                            multiActions={multiActions}
                            onAction={onAction}
                            mainId="server_id"
                            add={{
                                name: t('buttons.Add'),
                                action: create_link.pathname,
                                search: create_link.search
                            }}

                        />
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

                <Modal
                    icon={<FontAwesomeIcon icon={faServer} />}
                    iconBg="tw-bg-blue-500 tw-text-white"
                    title="buttons.Assign"
                    contentRaw={
                        <div className='tw-text-left tw-mt-8'>
                            <Select
                                name="servers"
                                multi={true}
                                options={optionsServers}
                                value={this.state.selectedServers}
                                onChange={this.handleChangeServers}
                            />
                        </div>
                    }
                    open={this.state.serversModal}
                    setOpen={this.cancelServersModal}
                    modalFooter={<ModalFooter cancel={this.cancelServersModal} saveName='buttons.Assign' save={this.assignServer} />}
                />

                <ConfirmAction
                    confirmationDetails={{
                        action: 'deletesingle',
                        details: deleteConfirm
                    }}
                    open={this.state.modal}
                    setOpen={(value) => this.setState({ modal: value })}
                    onAction={onAction}
                />

                <ConfirmAction
                    confirmationDetails={{
                        action: null,
                        details: {
                            title: t('servers.delete-sessions'),
                            text: t('servers.sessions-that-reside-on-this-s'),
                            iconBg: 'tw-bg-pink-700 tw-text-white',
                            icon: <FontAwesomeIcon icon={faTrash} />,
                            confirmBg: 'tw-bg-pink-700',
                            confirmText: t('buttons.Delete'),

                        }
                    }}
                    open={this.state.destroyModal}
                    externalClose={true}
                    setOpen={this.cancelDestroy}
                    onAction={this.destroyKasmsAction}
                />


            </div>
        );
    }
}

Agents.propTypes = {
    getServers: Proptypes.func.isRequired,
    deleteServer: Proptypes.func.isRequired,
    destroyAgentKasms: Proptypes.func.isRequired,
    deleteServerError: Proptypes.func,
    destroyAgentKasmsError: Proptypes.func,
    servers: Proptypes.array,
    getServersLoading: Proptypes.bool,
    deleteServerErrorMessage: Proptypes.func,
    destroyAgentKasmsErrorMessage: Proptypes.func,
    className: Proptypes.func
};

let AgentsWithRouter = withRouter(Agents);

const AgentsWithRouterTranslated = withTranslation('common')(AgentsWithRouter)
export default connect(state =>
({
    servers: state.servers.servers || [],
    deleteServerErrorMessage: state.servers.deleteServerErrorMessage || null,
    destroyAgentKasmsErrorMessage: state.servers.destroyAgentKasmsErrorMessage || null,
    getServersLoading: state.servers.getServersLoading || false,
    deleteServerError: state.servers.deleteServerError || null,
    destroyAgentKasmsError: state.servers.destroyAgentKasmsError || null,
    pages: { pageSize: state.servers.pageSize, pageNo: state.servers.pageNo },


}),
    dispatch =>
    ({
        getServers: () => dispatch(getServers()),
        deleteServer: (data) => dispatch(deleteServer(data)),
        destroyAgentKasms: (data) => dispatch(destroyAgentKasms(data)),
        setPageInfo: (data) => dispatch(setAgentPageInfo(data)),
        updateServer: (data) => dispatch(updateServer(data)),
    }))(AgentsWithRouterTranslated);