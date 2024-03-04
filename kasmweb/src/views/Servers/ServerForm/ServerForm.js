import React,{Component} from "react";
import { Field, reduxForm } from "redux-form";
import { getSettings } from "../../../actions/actionSettings";

import {
    renderField,
    number,
    renderToggle,
    required,
    renderTextArea,
    renderPass,
    json, renderPassTextArea,
} from "../../../utils/formValidations.js";
import { connect } from "react-redux";
import { getServers, updateServer, createServer} from "../../../actions/actionServer";
import { getServerPools} from "../../../actions/actionServerPool";
import { withRouter } from "react-router-dom";
import Proptypes from "prop-types";
import SelectInput from "../../../components/SelectInput";
import {getZones} from "../../../actions/actionZones";
import {withTranslation} from "react-i18next";
// New form related items
import { Groups, Group, FormField, Button, FormFooter } from "../../../components/Form"
import { Disclosure } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus } from "@fortawesome/free-solid-svg-icons/faMinus";
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";
import _ from "lodash";
import { hasAuth } from "../../../utils/axios";

class AgentFormTemplate extends Component  {
    constructor(props){
        super(props);
        this.state  = {
            currentServer: null,
            pool: new URLSearchParams(this.props.location.search).get('pool') || null,
            disableMaxPerServer: false,
        };
        this.connection_type = this.connection_type.bind(this);
    }

    connection_type(type) {
        if (type === 'KasmVNC' || type === 'VNC') {
            this.setState({ disableMaxPerServer: true })
            this.props.change('max_simultaneous_sessions', 1);
        }
        if (type === 'RDP' || type === 'SSH') {
            this.setState({ disableMaxPerServer: false })
        }
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
                friendly_name: currentServer.friendly_name,
                zone_id: currentServer.zone_id,
                server_id: currentServer.server_id,
                enabled: currentServer.enabled,
                agent_installed: currentServer.agent_installed,
                server_pool_id: currentServer.server_pool_id,
                connection_username: currentServer.connection_username,
                connection_password: currentServer.connection_password,
                connection_port: currentServer.connection_port,
                connection_private_key: currentServer.connection_private_key,
                connection_passphrase: currentServer.connection_passphrase,
                use_user_private_key: currentServer.use_user_private_key
            });
            if (currentServer.connection_type === 'KasmVNC' || currentServer.connection_type === 'VNC') {
                this.setState({disableMaxPerServer: true});
            }
        }
    }


    async componentDidMount(){
        this.props.initialize({
            enabled: false
        })
        this.props.getSettings()

        this.props.getZones()
        if (this.props.fromUpdate){
            this.props.getServers({server_id: this.props.serverId});
        }
        await this.props.getServerPools()
        this.props.change('server_pool_id', this.state.pool);

    }

    render(){
        const {handleSubmit, agentFormValues, zones, fromUpdate, server_pools, t, system_info} = this.props;

        const installInfo = () => {
            const server= this.props.servers.find(servers => servers.server_id === this.props.serverId);
            const zone = server && zones.find(e => e.zone_id === server.zone_id)
            const registration = this.props.settings.find(e => e.name === 'registration_token')
            let upstream = false
            if (zone && (zone.upstream_auth_address === 'proxy' || zone.upstream_auth_address === '$request_host$')) {
                upstream = window.location.hostname
            }
            return {
                apiPort: (zone && zone.proxy_port) || '<API_PORT>',
                apiServer: upstream || '<API_SERVER>',
                serverId: (agentFormValues && agentFormValues.server_id) || '<SERVER_ID>',
                regToken: (server && server.registration_jwt) || '<REGISTRATION_TOKEN>'
            }
        }
    

        let optionsConnectionType = [{label: "KasmVNC", value: "KasmVNC"}, {label: "RDP", value: "RDP"},
                                     {label: "VNC", value: "VNC"}, {label: "SSH", value: "SSH"}];
        let optionsZones = [];
        zones.map(opt => {
            optionsZones.push({label: opt.zone_name, value: opt.zone_id, zone_name: opt.zone_name });
        });
        optionsZones.sort((a, b) => (a.label.toLowerCase() > b.label.toLowerCase()) ? 1 : -1);

        let optionsServerPools = [];
        server_pools.map(opt => {
            if (opt.server_pool_type === 'Server Pool') {
                optionsServerPools.push({label: opt.server_pool_name, value: opt.server_pool_id});
            }
        });
        optionsServerPools.sort((a, b) => (a.label.toLowerCase() > b.label.toLowerCase()) ? 1 : -1);
        //const checked = true;
        return (
            <React.Fragment>

                { ((agentFormValues && agentFormValues.server_type === "Desktop") || ! this.props.fromUpdate ) ?
                    <Groups onSubmit={handleSubmit(this.props.save)} section={this.props.section}>
                        <Group title="basic-details" description="basic-details-description">

                            <Field type="checkbox"
                                name="enabled"
                                id="enabled"
                                component={renderToggle}
                            //check={checked}
                            />
                            <Field type="text"
                                name="friendly_name"
                                id="friendly_name"
                                component={renderField}
                                validate={required} required
                            />
                            <Field type="number"
                                name="max_simultaneous_sessions"
                                id="max_simultaneous_sessions"
                                disabled={this.state.disableMaxPerServer}
                                component={renderField}
                                validate={number} required
                            />
                            {hasAuth('zones') && <Field name="zone_id"
                                selectedValue={agentFormValues && agentFormValues.zone_id ? agentFormValues.zone_id : ""}
                                options={optionsZones}
                                isUpdateForm={this.props.fromUpdate}
                                validate={required} required
                                component={SelectInput} />}
                            {hasAuth('pools') && <Field name="server_pool_id"
                                selectedValue={agentFormValues && agentFormValues.server_pool_id ? agentFormValues.server_pool_id : ""}
                                options={optionsServerPools}
                                isUpdateForm={this.props.fromUpdate}
                                clearable={true}
                                component={SelectInput} />}
                        </Group>
                        <Group title="kasm-agent" description="kasm-agent-description">

                            <Field type="checkbox"
                                name="agent_installed"
                                component={renderToggle}
                            />
                            {this.props.agentFormValues && this.props.agentFormValues.agent_installed && fromUpdate && (
                                <Disclosure as="div" className="kasm-form-field tw-w-full tw-max-w-lg tw-mb-6">
                                {({ open }) => (
                                  <React.Fragment>
                                  <dt>
                                    <Disclosure.Button className="tw-flex tw-w-full tw-items-center tw-justify-between tw-text-left tw-bg-transparent">
                                      <span className="tw-font-semibold ">{t('servers.install-instructions')}</span>
                                      <span className="tw-ml-6 tw-flex tw-h-7 tw-items-center">
                                        {open ? (
                                          <FontAwesomeIcon icon={faMinus} className="tw-h-5 tw-w-5" />
                                        ) : (
                                          <FontAwesomeIcon icon={faPlus} className="tw-h-5 tw-w-5" />
                                        )}
                                      </span>
                                    </Disclosure.Button>
                                  </dt>
                                  <Disclosure.Panel as="dd" className="tw-mt-2">
                                    <pre className="tw-font-mono tw-bg-white/70 dark:tw-bg-slate-900/70 tw-text-color tw-shadow tw-rounded tw-p-4">{
`# Windows - Elevated Command Prompt
.\\kasm_service_installer.exe /S
net stop kasm
cd "C:\\Program Files\\Kasm"
.\\agent.exe --register-host ${installInfo().apiServer} --register-port ${installInfo().apiPort} --server-id ${installInfo().serverId} --register-token ${installInfo().regToken}
net start kasm`
                                    }</pre>
                                  </Disclosure.Panel>
                                </React.Fragment>
                              )}
                              </Disclosure>
                            )}


                        </Group>
                        <Group title="connection-details" description="connection-details-description">
                            <Field type="text"
                                name="hostname"
                                id="hostname"
                                component={renderField}
                                validate={required} required
                            />

                            <Field name="connection_type"
                                selectedValue={agentFormValues && agentFormValues.connection_type ? agentFormValues.connection_type : ""}
                                options={optionsConnectionType}
                                onOptionChange={this.connection_type}
                                validate={required} required
                                isUpdateForm={this.props.fromUpdate}
                                component={SelectInput}
                            />
                            <Field type="number"
                                name="connection_port"
                                id="connection_port"
                                component={renderField}
                                validate={number} required
                            />
                            <Field type="text"
                                name="connection_username"
                                id="connection_username"
                                component={renderField}
                                validate={this.props.agentFormValues && ['KasmVNC'].includes(this.props.agentFormValues.connection_type) ? required : null} required={this.props.agentFormValues && ['KasmVNC'].includes(this.props.agentFormValues.connection_type)}
                            />
                            <Field type="connection_password"
                                name="connection_password"
                                id="connection_password"
                                component={renderPass}
                                validate={this.props.agentFormValues && this.props.agentFormValues.connection_type === 'KasmVNC' ? required : null} required={this.props.agentFormValues && this.props.agentFormValues.connection_type === 'KasmVNC'}
                            />
                            <Field type="textarea"
                                name="connection_info"
                                id="connection_info"
                                component={renderTextArea}
                                validate={json}
                            />

                        </Group>
                        {this.props.agentFormValues && this.props.agentFormValues.connection_type === 'SSH' && (
                            <Group title="ssh-details" description="ssh-details-description">
                                <Field type="checkbox"
                                    name="use_user_private_key"
                                    id="use_user_private_key"
                                    component={renderToggle}
                                />
                                {!this.props.agentFormValues.use_user_private_key && (
                                <React.Fragment>
                                    <Field type="textarea"
                                        name="connection_private_key"
                                        id="connection_private_key"
                                        component={renderPassTextArea}
                                        disabled={this.props.agentFormValues.use_user_private_key}
                                        placeholder="-----BEGIN RSA PRIVATE KEY-----&#10;...&#10;-----END RSA PRIVATE KEY-----"
                                    />
                                    <Field type="connection_passphrase"
                                        name="connection_passphrase"
                                        id="connection_passphrase"
                                        component={renderPass}
                                        disabled={this.props.agentFormValues.use_user_private_key}
                                    />
                                </React.Fragment>
                                )}
                            </Group>
                        )}
                        <FormFooter cancel={() => (this.state.pool) ? this.props.history.push("/update_server_pool/" + this.state.pool + '?tab=servers') :  this.props.history.push("/servers")} />

                    </Groups>
            : ""}
            </React.Fragment>

        )
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

let AgentFormWithRouter = withRouter(AgentFormTemplate);

let ServerForm =  connect(state =>
    ({
        settings: state.settings.settings || [],
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
        getSettings: () => dispatch(getSettings()),
        updateServer: (data) => dispatch(updateServer(data)),
        createServer: (data) => dispatch(createServer(data)),
        getServers: (data) => dispatch(getServers(data)),
        getZones: () => dispatch(getZones()),
        getServerPools: () => dispatch(getServerPools()),
    }))(AgentFormWithRouter);
    const ServerFormTranslated = withTranslation('common')(ServerForm)
export default reduxForm({
    form: "agentForm",
})(ServerFormTranslated);