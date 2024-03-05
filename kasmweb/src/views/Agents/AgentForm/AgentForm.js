import React,{Component} from "react";
import { Field, reduxForm } from "redux-form";
import {
    renderField,
    number,
    renderToggle,
    required,
    renderPassTextArea
} from "../../../utils/formValidations.js";
import { connect } from "react-redux";
import { getServers, updateServer, createServer} from "../../../actions/actionServer";
import { getServerPools} from "../../../actions/actionServerPool";
import { withRouter } from "react-router-dom";
import Proptypes from "prop-types";
import SelectInput from "../../../components/SelectInput/SelectInput.js";
import {getZones} from "../../../actions/actionZones";
import {withTranslation} from "react-i18next";
import { Groups, Group, FormField, Button, FormFooter } from "../../../components/Form/Form.js"

class AgentFormTemplate extends Component  {
    constructor(props){
        super(props);
        this.state  = {
            currentServer: null,
        };
    }


    UNSAFE_componentWillReceiveProps(nextProps){
        if(nextProps.servers.length > 0 && this.props.servers !== nextProps.servers && this.props.getServersLoading && this.props.fromUpdate){
            let currentServer= nextProps.servers.find(servers => servers.server_id === this.props.serverId);
            //let currentServers =  nextProps.servers.find(servers => servers.server_id === currentImage.server_id);
            this.setState({currentServer: currentServer});
            this.props.initialize({
                server_type: currentServer.server_type,
                connection_type: currentServer.connection_type,
                connection_info: JSON.stringify(currentServer.connection_info, null, 2),
                max_simultaneous_sessions: currentServer.max_simultaneous_sessions,
                hostname: currentServer.hostname,
                zone_id: currentServer.zone_id,
                memory_override: currentServer.memory_override,
                cores_override: currentServer.cores_override,
                gpus_override: currentServer.gpus_override,
                server_id: currentServer.server_id,
                enabled: currentServer.enabled,
                prune_images_mode: currentServer.prune_images_mode,
                server_pool_id: currentServer.server_pool_id,
            });
        }
    }

    componentDidMount(){
        this.props.getZones()
        this.props.getServerPools()
        if (this.props.fromUpdate){
            this.props.getServers();
        }
    }

    render(){
        const {handleSubmit, agentFormValues, zones, fromUpdate, server_pools, t} = this.props;
        let prune_images_options = [
            {label: t("agents.Off"), value: "Off"},
            {label: t("agents.Normal"), value: "Normal"},
            {label: t("agents.Aggressive"), value: "Aggressive"}
        ];
        let optionsServerType = []
        if (this.props.fromUpdate){
            optionsServerType = [{label: t("agents.Host"), value: "host"}, {label: t("agents.Desktop"), value: "Desktop"}];
        }
        else{
            optionsServerType = [{label: t("agents.Desktop"), value: "Desktop"}];
        }

        let optionsConnectionType = [{label: "KasmVNC", value: "KasmVNC"}, {label: "RDP", value: "RDP"}];
        let optionsZones = [];
        zones.map(opt => {
            optionsZones.push({label: opt.zone_name, value: opt.zone_id, zone_name: opt.zone_name });
        });
        optionsZones.sort((a, b) => (a.label.toLowerCase() > b.label.toLowerCase()) ? 1 : -1);

        let optionsServerPools = [];
        server_pools.map(opt => {
            optionsServerPools.push({label: opt.server_pool_name, value: opt.server_pool_id});
        });
        optionsServerPools.sort((a, b) => (a.label.toLowerCase() > b.label.toLowerCase()) ? 1 : -1);

        const pool = new URLSearchParams(this.props.location.search).get('pool') || null

        //const checked = true;
        return (
            <Groups onSubmit={handleSubmit(this.props.save)} section={this.props.section}>
                

                        {agentFormValues && agentFormValues.server_type === "host" ?
                        <Group title="Docker Agents" description="basic-details-description">
                                <Field type="checkbox"
                                    name="enabled"
                                    id="enabled"
                                    component={renderToggle}
                                //check={checked}
                                />
                                <Field name="prune_images_mode"
                                    selectedValue={agentFormValues && agentFormValues.prune_images_mode ? agentFormValues.prune_images_mode : ""}
                                    options={prune_images_options}
                                    validate={required} required
                                    isUpdateForm={this.props.fromUpdate}
                                    component={SelectInput}
                                />
                                <Field type="number"
                                    name="cores_override"
                                    id="cores_override"
                                    component={renderField}
                                    validate={number} required
                                />
                                <Field type="number"
                                    name="gpus_override"
                                    id="gpus_override"
                                    component={renderField}
                                    validate={number} required
                                />
                                <Field type="number"
                                    name="memory_override"
                                    id="memory_override"
                                    component={renderField}
                                    validate={number} required
                                />
                                </Group>
                            : ""}

                        {((agentFormValues && agentFormValues.server_type === "Desktop") || !this.props.fromUpdate) ?
                        <Group title="Docker Agents" description="basic-details-description">
                                <Field type="text"
                                    name="hostname"
                                    id="hostname"
                                    component={renderField}
                                    validate={required} required
                                />
                                <Field name="connection_type"
                                    selectedValue={agentFormValues && agentFormValues.connection_type ? agentFormValues.connection_type : ""}
                                    options={optionsConnectionType}
                                    validate={required} required
                                    isUpdateForm={this.props.fromUpdate}
                                    component={SelectInput}
                                />
                                <Field type="textarea"
                                    name="connection_info"
                                    id="connection_info"
                                    component={renderPassTextArea}
                                />
                                <Field type="number"
                                    name="max_simultaneous_sessions"
                                    id="max_simultaneous_sessions"
                                    component={renderField}
                                    validate={number} required
                                />
                                <Field name="zone_id"
                                    selectedValue={agentFormValues && agentFormValues.zone_id ? agentFormValues.zone_id : ""}
                                    options={optionsZones}
                                    isUpdateForm={this.props.fromUpdate}
                                    validate={required} required
                                    component={SelectInput} />
                                <Field name="server_pool_id"
                                    selectedValue={agentFormValues && agentFormValues.server_pool_id ? agentFormValues.server_pool_id : ""}
                                    options={optionsServerPools}
                                    isUpdateForm={this.props.fromUpdate}
                                    clearable={true}
                                    component={SelectInput} />
                            </Group>
                            : ""}

                    <FormFooter cancel={() => (pool) ? this.props.history.push("/update_server_pool/" + pool + '?tab=agents') :  this.props.history.push("/agents")} />

            </Groups>
        );
    }
}

AgentFormTemplate.propTypes = {
    updateServer: Proptypes.func.isRequired,
    createServer: Proptypes.func.isRequired,
    getServers: Proptypes.func.isRequired,
    history: Proptypes.object.isRequired,
    updateServerError: Proptypes.func,
    updateErrorServerMessage: Proptypes.string,
    fromUpdate: Proptypes.bool,
    servers: Proptypes.array,
    getServersLoading: Proptypes.bool,
    initialize: Proptypes.func,
    agentFormValues: Proptypes.object,
    handleSubmit: Proptypes.func,
    serverId: Proptypes.string,
    getZones: Proptypes.func,
    getServerPools: Proptypes.func,
    zones: Proptypes.array,
    server_pools: Proptypes.array,
};

const AgentFormTemplateTranslated = withTranslation('common')(AgentFormTemplate)
let AgentFormWithRouter = withRouter(AgentFormTemplateTranslated);

let AgentForm =  connect(state =>
    ({
        servers: state.servers.servers || [],
        agentFormValues: state.form && state.form.agentForm && state.form.agentForm.values ? state.form.agentForm.values : null,
        updateErrorServerMessage: state.servers.updateErrorServerMessage || null,
        updateServerError: state.servers.updateServerError || null,
        getServersLoading: state.servers.getServersLoading || false,
        zones: state.zones.zones || [],
        server_pools: state.server_pools.server_pools || [],
    }),
dispatch => 
    ({
        updateServer: (data) => dispatch(updateServer(data)),
        createServer: (data) => dispatch(createServer(data)),
        getServers: () => dispatch(getServers()),
        getZones: () => dispatch(getZones()),
        getServerPools: () => dispatch(getServerPools()),
    }))(AgentFormWithRouter);

export default reduxForm({
    form: "agentForm",
})(AgentForm);