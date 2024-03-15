import React,{ Component } from "react";
import { connect } from "react-redux";
import { getServers, deleteServer, updateServer, destroyAgentKasms,setAgentPageInfo } from "../../actions/actionServer";
import { Row, Col, Progress, UncontrolledTooltip } from "reactstrap";
import LoadingSpinner from "../../components/LoadingSpinner/index";
import { NotificationManager } from "react-notifications";
import Proptypes from "prop-types";
import DataTable from "../../components/Table/Table";
import { ConfirmAction, SettingColumn } from "../../components/Table/NewTable";
import { notifySuccess, notifyFailure, CopyToClipboard } from "../../components/Form/Form.js";
import moment from "moment";
import { withRouter } from "react-router-dom";
import Select from "react-select";
import {withTranslation} from "react-i18next";
import { bytesToSize } from"../../utils/helpers"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCubes } from '@fortawesome/free-solid-svg-icons/faCubes';
import { faPaperclip } from '@fortawesome/free-solid-svg-icons/faPaperclip';
import { faCircleMinus } from '@fortawesome/free-solid-svg-icons/faCircleMinus';
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import PageHeader from "../../components/Header/PageHeader";
import { RenderToggle } from "../../utils/formValidations";
import { Modal, ModalFooter } from "../../components/Form/Modal.js"

const ConditionalWrapper = ({ condition, wrapper, children }) => condition ? wrapper(children) : children;

class Agents extends Component{
    constructor(props) {
        super(props);  
        
        this.state = {
            modal: false,
            destroyModal: false,
            pages: 1,
            serverId: null,
            server_type: 'host',
            agentsModal: false,
            selectedAgents: [],
            forceDelete: false
        };

        this.deleteConfirm = this.deleteConfirm.bind(this);
        this.destroyKasmsConfirm = this.destroyKasmsConfirm.bind(this);
        this.deleteServerAction = this.deleteServerAction.bind(this);
        this.destroyKasmsAction = this.destroyKasmsAction.bind(this);
        this.cancelDelete = this.cancelDelete.bind(this);
        this.cancelDestroy =  this.cancelDestroy.bind(this);
        this.handleDeleteSuccess = this.handleDeleteSuccess.bind(this);
        this.handleDeleteError = this.handleDeleteError.bind(this);
        this.handleDestroyKasmSuccess = this.handleDestroyKasmSuccess.bind(this);
        this.handleDestroyKasmError = this.handleDestroyKasmError.bind(this);
        this.assignServer = this.assignServer.bind(this);
        this.cancelServersModal = this.cancelServersModal.bind(this);
        this.handleChangeServers = this.handleChangeServers.bind(this);
        this.toggleChange = this.toggleChange.bind(this);
        this.openAgentsModal = this.openAgentsModal.bind(this);
        this.unassignConfirm = this.unassignConfirm.bind(this);
        this.unassignServer = this.unassignServer.bind(this);

    }

    componentDidMount(){
        this.props.getServers();
    }

    openAgentsModal() {
        this.setState({ agentsModal: true })
    }

    unassignConfirm(serverId) {
        const { t } = this.props;
        this.setState(
            {
                confirmationOpen: true,
                confirmationDetails: {
                    details: {
                        title: t('agents.unassign', { count: 1 }),
                        text: t('agents.unassign-desc', { count: 1 }),
                        iconBg: 'tw-bg-pink-700',
                        icon: <FontAwesomeIcon icon={faTrash} />,
                        confirmBg: 'tw-bg-pink-700',
                        confirmText: t('buttons.unassign')
                    },
                },
                onAction: () => this.unassignServer(serverId)
    
            });

    }


    async toggleChange(event) {
        this.setState({ forceDelete: !!event.target.checked })
    }
    
    async assignServer() {
        await Promise.all(this.state.selectedAgents.map(async server => {
            const serverToUpdate = this.props.servers.find(all => all.server_id === server.value)
            serverToUpdate.server_pool_id = this.props.pool
            await this.props.updateServer(serverToUpdate)
        }))

        this.setState({ selectedAgents: [], agentsModal: false });
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


    cancelServersModal() {
        this.setState({ agentsModal: !this.state.agentsModal });
    }


    handleChangeServers(selectedAgents) {
        this.setState({ selectedAgents });
    }


    deleteConfirm(serverId){
        this.setState({modal: !this.state.modal, serverId: serverId});
    }

    destroyKasmsConfirm(serverId){
        this.setState({destroyModal: !this.state.destroyModal, serverId: serverId});
    }

    cancelDestroy(){
        this.setState({destroyModal: !this.state.destroyModal});
    }

    cancelDelete(){
        this.setState({modal: !this.state.modal}); 
    }

    deleteServerAction(){
        this.props.deleteServer({
            server_id: this.state.serverId,
            force: !!this.state.forceDelete
        }).
        then(() => this.handleDeleteSuccess()).
        catch(() => this.handleDeleteError());
    }

    destroyKasmsAction(){
        this.props.destroyAgentKasms(this.state.serverId).
            then(() => this.handleDestroyKasmSuccess()).
            catch(() => this.handleDestroyKasmError());
    }

    handleDeleteSuccess(){
        const {deleteServerErrorMessage, t} = this.props;
        if(deleteServerErrorMessage) {
            NotificationManager.error(deleteServerErrorMessage,t("agents.Delete Agent"), 3000);
            this.setState({modal: false});
        }
        else{
            NotificationManager.success(t("agents.Successfully Deleted Agent"),t("agents.Delete Agent"), 3000);
            this.setState({modal: false, forceDelete: false});
            this.props.getServers();
        }
    }

    handleDeleteError(){
        const {deleteServerError, t} = this.props;
        this.setState({modal: false});
        if(deleteServerError){
            NotificationManager.error(deleteServerError,t("agents.Delete Agent"), 3000);
        }
        else{
            NotificationManager.error(t("agents.Failed to Delete Agent"),t("agents.Delete Agent"), 3000);
        }
    }

    handleDestroyKasmSuccess(){
        const {destroyAgentKasmsErrorMessage, t} = this.props;
        if(destroyAgentKasmsErrorMessage) {
            NotificationManager.error(destroyAgentKasmsErrorMessage,t("agents.Delete Sessions"), 3000);
            this.setState({destroyModal: false});
        }
        else{
            NotificationManager.success(t("agents.Successfully marked Sessions for deletion"),t("agents.Delete Sessions"), 3000);
            this.setState({destroyModal: false});
            this.props.getServers();
        }
    }

    handleDestroyKasmError(){
        const {destroyAgentKasmsError, t} = this.props;
        if(destroyAgentKasmsError){
            NotificationManager.error(destroyAgentKasmsError,t("agents.Delete Sessions"), 3000);
            this.setState({destroyModal: false});
        }
        else{
            NotificationManager.error(t("agents.Failed to mark Sessions for deletion"),t("agents.Delete Sessions"), 3000);
            this.setState({destroyModal: false});
        }
    }

    render(){
        if (this.props.getServersLoading){
            return (<div> <LoadingSpinner /></div>);
        }


        const { servers, t } = this.props;
        let filtered_servers = servers.filter(x => x.server_type === this.state.server_type)

        let unattached_servers = [
            ...filtered_servers
        ]

        if (this.props.pool) {
            unattached_servers = unattached_servers.filter(config => config.server_pool_id !== this.props.pool)
            filtered_servers = filtered_servers.filter(config => config.server_pool_id === this.props.pool)
        }

        let optionsServers = [];
        unattached_servers.map(opt => {
            optionsServers.push({ label: opt.hostname, value: opt.server_id });
        });



        const UsageProgress = (field) => (data) => {
          const value = data.value;
          const percentage = _.get(data.original, field);

          return percentage < value ? (
            <Progress multi>
              <Progress
                bar
                color={percentage < 80 ? "success" : "danger"}
                value={percentage}
              />
              <Progress bar color="info" value={value - percentage} />
            </Progress>
          ) : (
            <Progress multi>
              <Progress bar color="info" value={value} />
              <Progress
                bar
                color={percentage < 80 ? "success" : "danger"}
                value={percentage - value}
              />
            </Progress>
          );
        };

        const columns = [
          {
            type: "text",
            name: t("agents.hostname"),
            accessor: "hostname",
            filterable: true,
            sortable: true,
            colSize: 'minmax(250px,1.8fr) '
          },
          {
            type: "date",
            accessor: "created",
            name: t("agents.Created"),
            filterable: true,
            sortable: true,
            colSize: 'minmax(190px,1.2fr) ',
            cell: (data) => <div>{moment(data.value).isValid() ? moment.utc(data.value).local().format("lll") : "-"}</div>
          },
          {
            type: "text",
            name: t("agents.Agent Id"),
            accessor: "server_id",
            filterable: true,
            sortable: true,
            cell: (data) => <React.Fragment><div><span id={"hostname-" + data.original.server_id}>{data.value.slice(0, 6)}...</span><CopyToClipboard value={data.value} /></div><UncontrolledTooltip placement="right" target={"hostname-" + data.original.server_id}>{data.value}</UncontrolledTooltip></React.Fragment>
          },
          {
            type: "flag",
            name: t("agents.enabled"),
            accessor: "enabled",
            filterable: true,
            sortable: true,
            overwrite: true,
            cell: (data) => <SettingColumn key={'value-' + data.original.group_setting_id} main={data.value} sub={data.colName} />
          },
          {
            type: "text",
            name: t("agents.Last Reported"),
            accessor: "last_reported_elapsed",
            filterable: false,
            sortable: true,
          },
          {
            type: "text",
            name: t("agents.Status"),
            accessor: "operational_status",
            filterable: true,
            sortable: true,
          },
          {
            type: "text",
            name: t("agents.Manager"),
            accessor: "manager.manager_hostname",
            filterable: true,
            sortable: true,
          },
          {
            type: "text",
            name: t("agents.Zone"),
            accessor: "zone.zone_name",
            filterable: true,
            sortable: true,
          },
          {
            type: "text",
            name: t("agents.Sessions"),
            accessor: "kasms.length",
            filterable: true,
            sortable: true,
          },
          {
            type: "text",
            name: t("agents.Autoscale Config"),
            accessor: "autoscale_config.autoscale_config_name",
            filterable: true,
            sortable: true,
          },
          {
            type: "text",
            name: t("agents.Provider"),
            accessor: "provider",
            filterable: true,
            sortable: true,
          },
          {
            name: t("agents.GPUs"),
            accessor: "gpus",
            filterable: true,
            sortable: true,
          },
          {
            accessor: "core_calculations.percentage",
            name: t("agents.CPU Usage"),
            filterable: true,
            sortable: true,
            cell: UsageProgress("cpu_percent")
          },
          {
            accessor: "memory_calculations.percentage",
            name: t("agents.Memory Usage"),
            filterable: true,
            sortable: true,
            cell: UsageProgress("memory_stats.percent")
          },
          {
            accessor: "prune_images_mode",
            name: t("agents.prune_images_mode"),
            filterable: true,
            sortable: true,
            showByDefault: false
        },
        {
            accessor: "agent_version",
            name: t("agents.Version"),
            filterable: true,
            sortable: true,
            showByDefault: false
        },
        {
            accessor: "instance_id",
            name: t("agents.Instance Id"),
            filterable: true,
            sortable: true,
            showByDefault: false
        },
        {
            accessor: "cores",
            name: t("agents.CPU Cores"),
            filterable: true,
            sortable: true,
            showByDefault: false
        },
        {
            accessor: "cores_override",
            name: t("agents.cores_override"),
            filterable: true,
            sortable: true,
            showByDefault: false
        },
        {
            accessor: "memory",
            name: t("agents.Memory"),
            filterable: true,
            sortable: true,
            showByDefault: false,
            cell: (data) => <div>{data.value ? bytesToSize(data.value) : "-"}</div>
        },
        {
            accessor: "memory_override",
            name: t("agents.Memory Override"),
            filterable: true,
            sortable: true,
            showByDefault: false
        },

        ];

        const actions = [
            { id: "edit", icon: "fa-pencil", description: t("buttons.Edit") },
            { id: "delete-agents", icon: "fa-trash", description: t("buttons.Delete Agents") },
            { id: "delete-sessions", icon: "fa-trash", description: t("buttons.Delete Sessions") },
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
                  <label id="force_label" className="group-label tw-flex tw-justify-center tw-items-center tw-gap-3"><b className="tw-mb-2">{t('generic.force')}:</b> <RenderToggle checked={!!this.state.forceDelete} name="force" onChange={this.toggleChange} /></label>
                  <div className="tw-text-xs">{t('agents.delete_agent_text')}</div>
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
                        title: t('agents.unassign', { count: 0 }),
                        text: t('agents.unassign-desc', { count: 0 }),
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
                    this.props.history.push(`/updateagent/${item.server_id}${haspool}`);
                break;

                case "delete-agents":
                    this.deleteConfirm(item.server_id);
                break;

                case "delete-sessions":
                    this.destroyKasmsConfirm(item.server_id);
                break;

                case "deletesingle":
                    this.props.deleteServer({
                        server_id: this.state.serverId,
                        force: !!this.state.forceDelete
                    }).
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

        return (
            <div className="profile-page">
                <ConditionalWrapper
                    condition={!this.props.inline}
                    wrapper={children => (
                        <React.Fragment>
                            <PageHeader location={this.props.location} routes={typeof newRoutes !== 'undefined' ? newRoutes : null} title={t('agents.Docker Agents')} icon={<FontAwesomeIcon icon={faCubes} />} hideBreadCrumbs={!!this.props.pool} />
                            <Row>
                                <Col sm={{ size: 10, order: 3, offset: 1 }}>
                                    {children}
                                </Col>
                            </Row>
                        </React.Fragment>
                    )}>
                    <React.Fragment>
                        {this.props.pool && (
                            <button onClick={() => this.setState({ agentsModal: true })} className="tw-ml-auto tw-rounded tw-h-10 tw-bg-slate-500 hover:tw-bg-slate-600 tw-text-sm tw-text-white tw-flex tw-items-center tw-transition">
                                <span className="tw-h-10 tw-w-12 tw-flex tw-justify-center tw-items-center tw-bg-black/10"><FontAwesomeIcon icon={faPaperclip} /></span><span className="tw-px-4">{t('buttons.Assign')}</span>
                            </button>
                        )}

                        <DataTable
                            id="agents"
                            data={filtered_servers}
                            columns={columns}
                            actions={actions}
                            multiActions={multiActions}
                            onAction={onAction}
                            mainId="server_id"
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
                    icon={<FontAwesomeIcon icon={faPlus} />}
                    iconBg="tw-bg-blue-500 tw-text-white"
                    title="agents.Assign Existing Agents(s) To This Pool"
                    contentRaw={
                        <div className="tw-text-left tw-mt-8">
                            <Select
                                name="servers"
                                multi={true}
                                options={optionsServers}
                                value={this.state.selectedAgents}
                                onChange={this.handleChangeServers}
                            />
                        </div>
                    }
                    open={this.state.agentsModal}
                    setOpen={(value) => this.setState({ agentsModal: value })}
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
                            title: t('agents.confirm_delete_sessions'),
                            text: t('agents.session_delete_confirm'),
                            iconBg: 'tw-bg-pink-700 tw-text-white',
                            icon: <FontAwesomeIcon icon={faTrash} />,
                            confirmBg: 'tw-bg-pink-700',
                            confirmText: t('buttons.Delete'),

                        }
                    }}
                    open={this.state.destroyModal}
                    setOpen={(value) => this.setState({ destroyModal: value })}
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

const AgentsTranslated = withTranslation('common')(Agents)
let AgentsWithRouter = withRouter(AgentsTranslated);

export default connect(state => 
    ({
        servers: state.servers.servers || [],
        deleteServerErrorMessage: state.servers.deleteServerErrorMessage || null,
        destroyAgentKasmsErrorMessage: state.servers.destroyAgentKasmsErrorMessage || null,
        getServersLoading: state.servers.getServersLoading || false,
        deleteServerError: state.servers.deleteServerError || null,
        destroyAgentKasmsError: state.servers.destroyAgentKasmsError || null,
        pages : {pageSize : state.servers.pageSize, pageNo : state.servers.pageNo},


    }),
dispatch => 
    ({  
        getServers: () => dispatch(getServers()),
        deleteServer: (data) => dispatch(deleteServer(data)),
        destroyAgentKasms: (data) => dispatch(destroyAgentKasms(data)),
        setPageInfo : (data)=> dispatch(setAgentPageInfo(data)),  
        updateServer: (data) => dispatch(updateServer(data)),
    }))(AgentsWithRouter);