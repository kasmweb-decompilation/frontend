import React, { Component } from 'react';
import { connect } from "react-redux";
import { Field, reduxForm, formValueSelector } from "redux-form";
import {
    renderField,
    renderToggle,
    required,
    renderTextArea,
    json,
    number,
    positive_float, renderPassTextArea, renderPass
} from "../../../utils/formValidations.js";
import { withRouter } from "react-router-dom";
import { Form, FormGroup,Label, Row, Col, Alert } from "reactstrap";
import Proptypes from "prop-types";
import { NotificationManager } from "react-notifications";
import { getAutoScaleConfigs } from "../../../actions/actionAutoScale";
import { getLicenseStatus } from "../../../actions/actionFooter";
import { getZones } from "../../../actions/actionZones";
import { getServerPools } from "../../../actions/actionServerPool";
import { getVmProviderConfigs } from "../../../actions/actionVmProvider";
import { getDnsProviderConfigs } from "../../../actions/actionDnsProvider";
import { getLdap } from "../../../actions/actionLdap";
import ServerPoolForm from "../../ServerPools/ServerPoolForm/ServerPoolForm";
import { createServerPool } from "../../../actions/actionServerPool";


import SelectInput from "../../../components/SelectInput";
import VmProviderConfigFormTemplate from "../../VmProvider/VmProviderConfigForm/VmProviderConfigForm";
import DnsProviderConfigFormTemplate from "../../DnsProvider/DnsProviderConfigForm/DnsProviderConfigForm";
import {withTranslation} from "react-i18next";
import { Button, FormFooter, Groups, FormField } from "../../../components/Form"
import { hasAuth } from '../../../utils/axios.js';


class AutoScaleConfigFormTemplate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentAutoScaleConfig: {},
            collapseAdvanced: false,
            licensed: false,
            vmProviderModal: false,
            dnsProviderModal: false,
            serverPoolModal: false,
            disableMaxPerServer: false,
            pool: new URLSearchParams(this.props.location.search).get('pool') || null,
        };
        this.changeDnsProvider = this.changeDnsProvider.bind(this);
        this.changeServerPool = this.changeServerPool.bind(this);
        this.toggleServerPoolModal = this.toggleServerPoolModal.bind(this);
        this.cancelServerPoolModal = this.cancelServerPoolModal.bind(this);
        this.toggleVmProviderModal = this.toggleVmProviderModal.bind(this);
        this.cancelVmProviderModal = this.cancelVmProviderModal.bind(this);
        this.toggleDnsProviderModal = this.toggleDnsProviderModal.bind(this);
        this.cancelDnsProviderModal = this.cancelDnsProviderModal.bind(this);
        this.updateVmProvider = this.updateVmProvider.bind(this);
        this.updateDnsProvider = this.updateDnsProvider.bind(this);
        this.updateServerPool = this.updateServerPool.bind(this);
        this.initialize = this.initialize.bind(this);
        this.connection_type = this.connection_type.bind(this);
        this.reusableChange = this.reusableChange.bind(this);
        this.updateAgentInstalled = this.updateAgentInstalled.bind(this);
        
    }

    reusableChange(event) {
        if (this.props.autoscaleFormValues.connection_type === 'RDP' || this.props.autoscaleFormValues.connection_type === 'SSH') {
            if (event.target.checked === false) {
                this.setState({disableMaxPerServer: true});
                this.props.change('max_simultaneous_sessions_per_server', 1);
            } else {
                this.setState({disableMaxPerServer: false})
            }
        }
    }

    connection_type(type) {
        if (type === 'KasmVNC' || type === 'VNC') {
            this.setState({ disableMaxPerServer: true });
            this.props.change('max_simultaneous_sessions_per_server', 1);
        }
        if (type === 'RDP' || type === 'SSH') {
            if (this.props.autoscaleFormValues.reusable === false || this.props.autoscaleFormValues.reusable === undefined || this.props.autoscaleFormValues.reusable === null) {
                this.setState({disableMaxPerServer: true});
                this.props.change('max_simultaneous_sessions_per_server', 1);
            } else {
                this.setState({disableMaxPerServer: false})
            }
        }

    }

    changeServerPool(provider) {
        if (provider === 'new_pool') {
            this.setState({ serverPoolModal: true })
        }
    }

    toggleServerPoolModal() {
        this.setState({
            serverPoolModal: !this.state.serverPoolModal
        });
        if (this.state.serverPoolModal === true) {
            this.props.change('server_pool_id', null);
        }
    }
    cancelServerPoolModal() {
        this.setState({
            serverPoolModal: false
        });
        this.props.change('server_pool_id', null);
    }

    toggleVmProviderModal() {
        this.setState({
            vmProviderModal: !this.state.vmProviderModal
        });
        if (this.state.vmProviderModal === true) {
            this.props.change('vm_provider_config_id', null);
        }
    }
    cancelVmProviderModal() {
        this.setState({
            vmProviderModal: false
        });
        this.props.change('vm_provider_config_id', null);
    }

    changeDnsProvider(provider) {
        if (provider === 'new_provider') {
            this.setState({ dnsProviderModal: true })
        }
    }

    toggleDnsProviderModal() {
        this.setState({
            dnsProviderModal: !this.state.dnsProviderModal
        });
        if (this.state.dnsProviderModal === true) {
            this.props.change('dns_provider_config_id', null);
        }
    }
    cancelDnsProviderModal() {
        this.setState({
            dnsProviderModal: false
        });
        this.props.change('dns_provider_config_id', null);
    }



    cancelButton() {
        if (this.state.pool !== null) {
            this.props.history.push("/update_server_pool/" + this.state.pool + '?tab=autoscale');
        } else {
            this.props.history.push("/autoscale");
        }
    }


    initialize(config) {
        this.props.initialize({
            autoscale_config_name: config.autoscale_config_name,
            autoscale_type: config.autoscale_type,
            enabled: config.enabled,
            zone_id: config.zone_id,
            standby_cores: config.standby_cores,
            standby_memory_mb: config.standby_memory_mb,
            standby_gpus: config.standby_gpus,
            downscale_backoff: config.downscale_backoff,
            register_dns: config.register_dns,
            base_domain_name: config.base_domain_name,
            nginx_cert: config.nginx_cert,
            nginx_key: config.nginx_key,
            agent_cores_override: config.agent_cores_override,
            agent_memory_override_gb: config.agent_memory_override_gb,
            agent_gpus_override: config.agent_gpus_override,
            connection_type: config.connection_type,
            connection_info: config.connection_info ? JSON.stringify(config.connection_info, null, 2) : null,
            connection_port: config.connection_port,
            connection_username: config.connection_username,
            connection_password: config.connection_password,
            connection_private_key: config.connection_private_key,
            connection_passphrase: config.connection_passphrase,
            use_user_private_key: config.use_user_private_key,
            reusable: config.reusable,
            hooks: config.hooks ? JSON.stringify(config.hooks, null, 2) : null,
            minimum_pool_standby_sessions: config.minimum_pool_standby_sessions,
            max_simultaneous_sessions_per_server: config.max_simultaneous_sessions_per_server,
            vm_provider_config_id: config.vm_provider_config_id,
            dns_provider_config_id: config.dns_provider_config_id,
            server_pool_id: config.server_pool_id,
            ad_create_machine_record: config.ad_create_machine_record,
            ad_recursive_machine_record_cleanup: config.ad_recursive_machine_record_cleanup,
            ad_computer_container_dn: config.ad_computer_container_dn,
            agent_installed: config.agent_installed,
            require_checkin: config.agent_installed === true ? true : config.require_checkin,
            aggressive_scaling: config.aggressive_scaling,
            ldap_id: config.ldap_id,
        });
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.autoscale_configs && nextProps.autoscale_configs.length > 0 && this.props.autoscale_configs !== nextProps.autoscale_configs && this.props.getAutoScaleLoading && this.props.fromUpdate) {
            let currentAutoScaleConfig = nextProps.autoscale_configs.find(autoscale => autoscale.autoscale_config_id === this.props.autoscaleConfigId);
            this.setState({ currentAutoScaleConfig: currentAutoScaleConfig });
            this.initialize(currentAutoScaleConfig)
            if (currentAutoScaleConfig.connection_type === 'KasmVNC' || currentAutoScaleConfig.connection_type === 'VNC') {
                this.setState({ disableMaxPerServer: true });
            }
            if ((currentAutoScaleConfig.connection_type === 'RDP' || currentAutoScaleConfig.connection_type === 'SSH') && (currentAutoScaleConfig.reusable === false || currentAutoScaleConfig.reusable === undefined || currentAutoScaleConfig.reusable === null)) {
                this.setState({ disableMaxPerServer: true });
            }

        }
        if (nextProps.license_info && nextProps.license_info !== this.props.license_info) {
            this.setState({ licensed: nextProps.license_info.status.features.indexOf('auto_scaling') >= 0 });
        }
    }

    async componentDidMount() {
        this.props.getZones()
        this.props.getVmProviderConfigs()
        this.props.getDnsProviderConfigs()
        this.props.getLdap()
        const { license_info } = this.props;
        if (license_info && license_info.status && license_info.status.features && license_info.status.features.indexOf('auto_scaling') >= 0) {
            this.setState({ licensed: true });
        }
        try {
            await this.props.getServerPools()
            if (this.props.server_pools.length > 0 && this.state.pool !== null) {
                const pool_details = this.props.server_pools.find(pool => pool.server_pool_id === this.state.pool)
                this.props.change('server_pool_id', this.state.pool);
                this.props.change('autoscale_type', pool_details.server_pool_type);
                this.props.onTypeChange(pool_details.server_pool_type)
            }
        } catch (e) {

        }
        if (this.props.autoscale_config) {
            this.initialize(this.props.autoscale_config)
        }
    }

    updateVmProvider(data) {
        this.props.getVmProviderConfigs()
        this.props.change('vm_provider_config_id', data.vm_provider_config_id);
        this.setState({
            vmProviderModal: false
        });
    }

    updateDnsProvider(data) {
        this.props.getDnsProviderConfigs()
        this.props.change('dns_provider_config_id', data.dns_provider_config_id);
        this.setState({
            dnsProviderModal: false
        });
    }
    updateServerPool(data) {
        this.props.getServerPools()
        this.props.change('server_pool_id', data.server_pool_id);
        this.setState({
            serverPoolModal: false
        });
    }
    updateAgentInstalled(data) {
        this.props.change('agent_installed', data.target.checked);
        if (data.target.checked) {
            this.props.change('require_checkin', true);
        }
    }

    render() {
        const { handleSubmit, autoscaleFormValues, zones, server_pools, vm_provider_configs, dns_provider_configs,
            ldap_configs, t } = this.props;
        if (!this.state.licensed) {
            let license_url = `${__LICENSE_INFO_URL__}`;
            return (
                <Alert color="none" isOpen={true}>
                    <h4>{t("autoscale.Unavailable")}</h4>
                    {t("autoscale.This feature must be licensed")}
                    <hr />
                    <a href={license_url}>{t("autoscale.More Information")}</a><br />
                </Alert>
            )
        }

        let optionsZones = [];
        zones.map(opt => {
            optionsZones.push({ label: opt.zone_name, value: opt.zone_id, zone_name: opt.zone_name });
        });
        optionsZones.sort((a, b) => (a.label.toLowerCase() > b.label.toLowerCase()) ? 1 : -1);

        let optionsAutoScaleTypes = [
            { value: 'Docker Agent', label: t("autoscale.Docker Agent") },
            { value: 'Server Pool', label: t("autoscale.Server") }
        ]

        let optionServerPools = [];
        server_pools.map(opt => {
            optionServerPools.push({ label: opt.server_pool_name, value: opt.server_pool_id });
        });
        optionServerPools.sort((a, b) => (a.label.toLowerCase() > b.label.toLowerCase()) ? 1 : -1);

        let optionDnsProviders = [];
        dns_provider_configs.map(opt => {
            optionDnsProviders.push({ label: opt.dns_provider_config_name, value: opt.dns_provider_config_id });
        });
        optionDnsProviders.sort((a, b) => (a.label.toLowerCase() > b.label.toLowerCase()) ? 1 : -1);

        let optionsConnectionTypes = [
            { value: 'KasmVNC', label: 'KasmVNC' },
            { value: 'RDP', label: 'RDP' },
            { label: "VNC", value: "VNC" },
            { label: "SSH", value: "SSH" }
        ]


        let optionsLdapConfigs = [];
        ldap_configs.map(opt => {
            optionsLdapConfigs.push({ label: opt.name, value: opt.ldap_id });
        });
        optionsLdapConfigs.sort((a, b) => (a.label.toLowerCase() > b.label.toLowerCase()) ? 1 : -1);


        return (
            <Groups noPadding section="autoscale" onSubmit={handleSubmit}>
                <FormField label="Name">
                    <Field type="text"
                        name="autoscale_config_name"
                        id="autoscale_config_name"
                        component={renderField}
                        validate={required} required
                    />
                </FormField>
                <FormField label="AutoScale Type">
                    <Field name="autoscale_type"
                        selectedValue={autoscaleFormValues && autoscaleFormValues.autoscale_type ? autoscaleFormValues.autoscale_type : ""}
                        onOptionChange={this.props.onTypeChange}
                        options={optionsAutoScaleTypes}
                        isUpdateForm={this.props.fromUpdate}
                        validate={required} required
                        disabled={this.state.pool !== null || this.props.fromUpdate}
                        component={SelectInput} />
                </FormField>
                {hasAuth('pools') && <FormField label="Pool">
                    <Field name="server_pool_id"
                        selectedValue={autoscaleFormValues && autoscaleFormValues.server_pool_id}
                        options={optionServerPools}
                        isUpdateForm={this.props.fromUpdate}
                        onOptionChange={this.changeServerPool}
                        validate={required} required
                        disabled={this.state.pool !== null || this.props.fromUpdate}
                        component={SelectInput} />
                </FormField>}
                <FormField label="Enabled">
                    <Field type="checkbox"
                        name="enabled"
                        id="enabled"
                        checked={autoscaleFormValues && autoscaleFormValues.enabled}
                        component={renderToggle}
                    />
                </FormField>
                <Field type="checkbox"
                        name="aggressive_scaling"
                        component={renderToggle}
                />
                {hasAuth('zones') && <FormField label="Deployment Zone">
                    <Field name="zone_id"
                        selectedValue={autoscaleFormValues && autoscaleFormValues.zone_id ? autoscaleFormValues.zone_id : ""}
                        options={optionsZones}
                        isUpdateForm={this.props.fromUpdate}
                        validate={required} required
                        component={SelectInput} />
                </FormField>}
                {autoscaleFormValues && autoscaleFormValues.autoscale_type === "Server Pool" && (
                    <React.Fragment>
                        <Field type="checkbox"
                                name="require_checkin"
                                component={renderToggle}
                                disabled={autoscaleFormValues && autoscaleFormValues.agent_installed === true}
                        />
                        <Field type="checkbox"
                               name="agent_installed"
                               component={renderToggle}
                               onChange={this.updateAgentInstalled}
                        />
                        <FormField label="Connection Type">
                            <Field name="connection_type"
                                selectedValue={autoscaleFormValues && autoscaleFormValues.connection_type ? autoscaleFormValues.connection_type : ""}
                                options={optionsConnectionTypes}
                                validate={required} required
                                onOptionChange={this.connection_type}
                                isUpdateForm={this.props.fromUpdate}
                                component={SelectInput}
                            />
                        </FormField>
                        <FormField label="Connection Port">
                            <Field type="number"
                                name="connection_port"
                                id="connection_port"
                                component={renderField}
                                validate={number} required
                            />
                        </FormField>
                        <FormField label="Connection Username">
                            <Field type="text"
                                name="connection_username"
                                id="connection_username"
                                component={renderField}
                                validate={this.props.autoscaleFormValues && this.props.autoscaleFormValues.connection_type === 'KasmVNC' ? required : null} required={this.props.autoscaleFormValues && this.props.autoscaleFormValues.connection_type === 'KasmVNC'}
                            />
                        </FormField>
                        <FormField label="Connection Password">
                            <Field type="connection_password"
                                name="connection_password"
                                id="connection_password"
                                component={renderPass}
                                validate={this.props.autoscaleFormValues && this.props.autoscaleFormValues.connection_type === 'KasmVNC' ? required : null} required={this.props.autoscaleFormValues && this.props.autoscaleFormValues.connection_type === 'KasmVNC'}
                            />
                        </FormField>
                        {this.props.autoscaleFormValues && this.props.autoscaleFormValues.connection_type === 'SSH' && (
                            <FormField label="Use User SSH Key">
                                <Field type="checkbox"
                                    name="use_user_private_key"
                                    id="use_user_private_key"
                                    checked={autoscaleFormValues && autoscaleFormValues.use_user_private_key}
                                    component={renderToggle}
                                />
                            </FormField>
                        )}
                        {this.props.autoscaleFormValues && this.props.autoscaleFormValues.connection_type === 'SSH' && !this.props.autoscaleFormValues.use_user_private_key && (
                            <FormField label="connection_formats">
                                <Field type="textarea"
                                    name="connection_private_key"
                                    id="connection_private_key"
                                    component={renderPassTextArea}
                                    disabled={this.props.autoscaleFormValues.use_user_private_key}
                                    placeholder="-----BEGIN RSA PRIVATE KEY-----&#10;...&#10;-----END RSA PRIVATE KEY-----"
                                />
                            </FormField>
                        )}
                        {this.props.autoscaleFormValues && this.props.autoscaleFormValues.connection_type === 'SSH' && !this.props.autoscaleFormValues.use_user_private_key && (
                            <FormField label="Connection Private Key Passphrase">
                                <Field type="connection_passphrase"
                                    name="connection_passphrase"
                                    id="connection_passphrase"
                                    component={renderPass}
                                    disabled={this.props.autoscaleFormValues.use_user_private_key}
                                />
                            </FormField>
                        )}
                        <FormField label="Connection Info (JSON)">
                            <Field type="textarea"
                                name="connection_info"
                                id="connection_info"
                                component={renderTextArea}
                                validate={json}
                            />
                        </FormField>
                        <FormField label="Create Active Directory Computer Record">
                            <Field type="checkbox"
                                name="ad_create_machine_record"
                                id="ad_create_machine_record"
                                checked={autoscaleFormValues && autoscaleFormValues.ad_create_machine_record}
                                component={renderToggle}
                            />
                        </FormField>
                        {autoscaleFormValues && autoscaleFormValues.ad_create_machine_record ?
                            <React.Fragment>
                                <FormField style={{ 'padding-left': '20px' }} label="LDAP Config">
                                    <Field name="ldap_id"
                                        selectedValue={autoscaleFormValues.ldap_id}
                                        options={optionsLdapConfigs}
                                        isUpdateForm={this.props.fromUpdate}
                                        validate={required} required
                                        component={SelectInput} />
                                </FormField>
                                <FormField style={{ 'padding-left': '20px' }} label="Active Directory Computer OU DN">
                                    <Field type="text"
                                        name="ad_computer_container_dn"
                                        id="ad_computer_container_dn"
                                        component={renderField}
                                        validate={required} required
                                        placeholder="OU=KasmComputers,DC=example,DC=com"
                                    />
                                </FormField>
                                <FormField label="Recursively Cleanup Active Directory Computer Record">
                                    <Field name="ad_recursive_machine_record_cleanup"
                                        id="ad_recursive_machine_record_cleanup"
                                        checked={autoscaleFormValues && autoscaleFormValues.ad_recursive_machine_record_cleanup}
                                        type="checkbox"
                                        component={renderToggle}
                                    />
                                </FormField>

                            </React.Fragment>
                            :
                            ""
                        }
                        <FormField label="Reusable">
                            <Field name="reusable"
                                id="reusable"
                                checked={autoscaleFormValues && autoscaleFormValues.reusable}
                                type="checkbox"
                                component={renderToggle}
                                onChange={this.reusableChange}
                            />
                        </FormField>

                        <FormField label="Minimum Available Sessions">
                            <Field type="number"
                                name="minimum_pool_standby_sessions"
                                id="minimum_pool_standby_sessions"
                                component={renderField}
                                validate={number} required
                                placeholder="0"
                            />
                        </FormField>
                        <FormField label="Max Simultaneous Sessions Per Server">
                            <Field type="number"
                                name="max_simultaneous_sessions_per_server"
                                id="max_simultaneous_sessions_per_server"
                                component={renderField}
                                disabled={this.state.disableMaxPerServer}
                                validate={number} required
                                placeholder="1"
                            />
                        </FormField>
                    </React.Fragment>
                )}
                {autoscaleFormValues && autoscaleFormValues.autoscale_type === "Docker Agent" && (
                    <React.Fragment>

                        <FormField label="Standby Cores">
                            <Field
                                type="number"
                                name="standby_cores"
                                id="standby_cores"
                                component={renderField}
                                validate={number} required
                            />
                        </FormField>
                        <FormField label="Standby GPUs">
                            <Field
                                type="number"
                                name="standby_gpus"
                                id="standby_gpus"
                                component={renderField}
                                validate={number} required
                            />
                        </FormField>
                        <FormField label="Standby Memory (MB)">
                            <Field
                                type="number"
                                name="standby_memory_mb"
                                id="standby_memory_mb"
                                component={renderField}
                                validate={number} required
                            />
                        </FormField>
                        <FormField label="Downscale Backoff (Seconds)">
                            <Field
                                type="number"
                                name="downscale_backoff"
                                id="downscale_backoff"
                                component={renderField}
                                validate={number} required
                            />
                        </FormField>
                        <FormField label="Agent Cores Override">
                            <Field type="number"
                                name="agent_cores_override"
                                id="agent_cores_override"
                                component={renderField}
                                validate={number} required
                            />
                        </FormField>
                        <FormField label="Agent GPUs Override">
                            <Field type="number"
                                name="agent_gpus_override"
                                id="agent_gpus_override"
                                component={renderField}
                                validate={number} required
                            />
                        </FormField>
                        <FormField label="Agent Memory Override (GB)">
                            <Field type="number"
                                name="agent_memory_override_gb"
                                id="agent_memory_override_gb"
                                component={renderField}
                                validate={positive_float} required
                            />
                        </FormField>


                        <FormField label="Nginx Cert">
                            <Field type="text"
                                name="nginx_cert"
                                id="nginx_cert"
                                component={renderTextArea}
                                validate={required} required
                            />
                        </FormField>
                        <FormField label="Nginx Key">
                            <Field type="text"
                                name="nginx_key"
                                id="nginx_key"
                                component={renderTextArea}
                                validate={required} required
                            />
                        </FormField>
                        <FormField label="Register DNS">
                            <Field type="checkbox"
                                name="register_dns"
                                id="register_dns"
                                onChange={(value) => this.props.onRegisterDns(value.target.checked)}
                                checked={autoscaleFormValues && autoscaleFormValues.register_dns}
                                component={renderToggle}
                            />
                        </FormField>
                        {autoscaleFormValues && autoscaleFormValues.register_dns ?
                            <React.Fragment>
                                <FormField label="Base Domain Name">
                                    <Field type="text"
                                        name="base_domain_name"
                                        id="base_domain_name"
                                        component={renderField}
                                        validate={required} required
                                    />
                                </FormField>

                            </React.Fragment>
                            : ""}

                    </React.Fragment>
                )}

                <FormFooter
                    cancel={() => this.cancelButton()}
                    saveButton={hasAuth('vm_providers') && <Button id="save-autoscale" icon="save" type="submit" section="buttons" name="Next" />}
                />
            </Groups>
        );
    }
}

AutoScaleConfigFormTemplate.proptypes = {
    createAutoScaleConfig: Proptypes.func,
    updateAutoScaleConfig: Proptypes.func,
    fromUpdate: Proptypes.bool,
    zones: Proptypes.array,
    server_pools: Proptypes.array,
    vm_provider_configs: Proptypes.array,
    dns_provider_configs: Proptypes.array,
    ldap_configs: Proptypes.array,
    createServerPool: Proptypes.func.isRequired,
};

let AutoScaleConfigFormWithRouter = withRouter(AutoScaleConfigFormTemplate);


const selector = formValueSelector('AutoScaleConfigForm');

let AutoScaleConfigForm = connect(state => {

    const has_categorization_enabled = selector(state, 'enable_categorization');

    return {
        has_categorization_enabled,
        updateAutoScaleError: state.autoscale.updateAutoScaleError,
        updateAutoScaleLoading: state.autoscale.updateAutoScaleLoading,
        updatedAutoScale: state.autoscale.updatedAutoScale,
        autoscale_configs: state.autoscale.autoscale_configs,
        getAutoScaleLoading: state.autoscale.getAutoScaleLoading || false,
        license_info: state.footer && state.footer.license_info ? state.footer.license_info : null,
        autoscaleFormValues: state.form && state.form.AutoScaleConfigForm && state.form.AutoScaleConfigForm.values ? state.form.AutoScaleConfigForm.values : null,
        zones: state.zones.zones || [],
        server_pools: state.server_pools.server_pools || [],
        vm_provider_configs: state.vm_provider.vm_provider_configs || [],
        dns_provider_configs: state.dns_provider.dns_provider_configs || [],
        ldap_configs: state.ldap_configs.ldap_configs || [],
    }
},

    dispatch =>
    ({
        getAutoScaleConfigs: () => dispatch(getAutoScaleConfigs()),
        getLicenseStatus: () => dispatch(getLicenseStatus()),
        getVmProviderConfigs: () => dispatch(getVmProviderConfigs()),
        getDnsProviderConfigs: () => dispatch(getDnsProviderConfigs()),
        getZones: () => dispatch(getZones()),
        getServerPools: () => dispatch(getServerPools()),
        getLdap: () => dispatch(getLdap()),
        createServerPool: (data) => dispatch(createServerPool(data)),

    }))(AutoScaleConfigFormWithRouter);
    const AutoScaleConfigFormTranslated = withTranslation('common')(AutoScaleConfigForm)
export default reduxForm({
    form: "AutoScaleConfigForm",
})(AutoScaleConfigFormTranslated);