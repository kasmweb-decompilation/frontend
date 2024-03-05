import React,{Component} from "react";
import { Field, reduxForm, formValueSelector } from "redux-form";
import { Form, FormGroup, Label, Row, Col, CardBody, CardFooter, TabContent, TabPane, Nav, NavItem, NavLink } from "reactstrap";
import classnames from 'classnames';
import { renderPass, renderField, renderSelectField, renderToggle, required, minValue, renderTextArea, number, positive_float } from "../../../utils/formValidations.js";
import { connect } from "react-redux";
import { getZones, updateZone } from "../../../actions/actionZones";
import { NotificationManager } from "react-notifications";
import { withRouter } from "react-router-dom";
import Proptypes from "prop-types";
import {getLicenses} from "../../../actions/actionSystemInfo.js";
import {withTranslation} from "react-i18next";
// New form related items
import { Groups, Group, FormField, Button, FormFooter } from "../../../components/Form/Form.js"

const minValue50 = minValue(50);

class ZoneFormTemplate extends Component  {
    constructor(props){
        super(props);
        this.state  = {
            currentZone: null,
            auto_scaling: false,
            activeTab: 0
        };
        this.submitZone= this.submitZone.bind(this);
        this.initializeForm = this.initializeForm.bind(this);
        this.toggle = this.toggle.bind(this);
    }

    toggle(tab){
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }


    submitZone(userData){
        if (!userData.auto_scaling_enabled)
            userData.auto_scaling_enabled = false;
        if (!userData.register_dns)
            userData.register_dns = false;
        if (userData.auto_scaling_enabled && !userData.aws_enabled)
            userData.aws_enabled = false;
        if (userData.auto_scaling_enabled && !userData.digital_ocean_enabled)
            userData.digital_ocean_enabled = false;
        if (this.props.fromUpdate){
            userData.zone_id = this.props.zoneId;
            this.props.updateZone(userData).
                then(() => this.handleUpdateSuccess()).
                catch(() => this.handleUpdateError());
        }
        else {
            this.props.createZone(userData).
                then(() => this.handleCreateSuccess()).
                catch(() => this.handleCreateError());
        }
    }



    initializeForm(res){
        let currentZone = res.response.zones.find(zone => zone.zone_id === this.props.zoneId);
        this.setState({currentZone: currentZone});
        this.props.initialize({
            auto_scaling_enabled: currentZone.auto_scaling_enabled,
            register_dns: currentZone.register_dns,
            dns_registration_provider: currentZone.dns_registration_provider,
            base_domain_name: currentZone.base_domain_name,
            allow_origin_domain: currentZone.allow_origin_domain,
            upstream_auth_address: currentZone.upstream_auth_address,
            proxy_connections: currentZone.proxy_connections,
            proxy_hostname: currentZone.proxy_hostname,
            proxy_path: currentZone.proxy_path,
            proxy_port: currentZone.proxy_port,
            nginx_cert: currentZone.nginx_cert,
            nginx_key: currentZone.nginx_key,
            zone_name: currentZone.zone_name,
            load_strategy: currentZone.load_strategy,
            prioritize_static_agents: currentZone.prioritize_static_agents,
            search_alternate_zones: currentZone.search_alternate_zones,
            standby_cores: currentZone.standby_cores,
            standby_gpus: currentZone.standby_gpus,
            standby_memory_mb: currentZone.standby_memory_mb,
            downscale_backoff: currentZone.downscale_backoff,
            zone_id: currentZone.zone_id,
            aws_enabled: currentZone.aws_enabled,
            aws_region: currentZone.aws_region,
            aws_access_key_id: currentZone.aws_access_key_id,
            aws_secret_access_key: currentZone.aws_secret_access_key,
            ec2_agent_ami_id: currentZone.ec2_agent_ami_id,
            agent_cores_override: currentZone.agent_cores_override,
            agent_gpus_override: currentZone.agent_gpus_override,
            agent_memory_override_gb: currentZone.agent_memory_override_gb,
            ec2_agent_instance_type: currentZone.ec2_agent_instance_type,
            ec2_agent_key_pair_name: currentZone.ec2_agent_key_pair_name,
            aws_max_ec2_nodes: currentZone.aws_max_ec2_nodes,
            ec2_agent_security_group_ids:  JSON.stringify(currentZone.ec2_agent_security_group_ids),
            ec2_agent_subnet_id: currentZone.ec2_agent_subnet_id,
            ec2_agent_startup_script: currentZone.ec2_agent_startup_script,
            ec2_agent_iam: currentZone.ec2_agent_iam,
            ec2_agent_ebs_volume_type: currentZone.ec2_agent_ebs_volume_type,
            ec2_agent_ebs_volume_size_gb: currentZone.ec2_agent_ebs_volume_size_gb,
            ec2_custom_tags: JSON.stringify(currentZone.ec2_custom_tags),
            ec2_config_override: JSON.stringify(currentZone.ec2_config_override),
            digital_ocean_enabled: currentZone.digital_ocean_enabled,
            digital_ocean_max_droplets: currentZone.digital_ocean_max_droplets,
            digital_ocean_token: currentZone.digital_ocean_token,
            digital_ocean_region: currentZone.digital_ocean_region,
            digital_ocean_droplet_image: currentZone.digital_ocean_droplet_image,
            digital_ocean_droplet_size: currentZone.digital_ocean_droplet_size,
            digital_ocean_tags: currentZone.digital_ocean_tags,
            digital_ocean_sshkey_name: currentZone.digital_ocean_sshkey_name,
            digital_ocean_firewall_name: currentZone.digital_ocean_firewall_name,
            digital_ocean_startup_script: currentZone.digital_ocean_startup_script,
            oci_enabled: currentZone.oci_enabled,
            oci_user_ocid: currentZone.oci_user_ocid,
            oci_fingerprint: currentZone.oci_fingerprint,
            oci_private_key: currentZone.oci_private_key,
            oci_max_instances: currentZone.oci_max_instances,
            oci_tenancy_ocid: currentZone.oci_tenancy_ocid,
            oci_region: currentZone.oci_region,
            oci_compartment_ocid: currentZone.oci_compartment_ocid,
            oci_availability_domain: currentZone.oci_availability_domain,
            oci_shape: currentZone.oci_shape,
            oci_flex_cpus: currentZone.oci_flex_cpus,
            oci_flex_memory_gb: currentZone.oci_flex_memory_gb,
            oci_boot_volume_gb: currentZone.oci_boot_volume_gb,
            oci_custom_tags: JSON.stringify(currentZone.oci_custom_tags),
            oci_image_ocid: currentZone.oci_image_ocid,
            oci_subnet_ocid: currentZone.oci_subnet_ocid,
            oci_ssh_public_key: currentZone.oci_ssh_public_key,
            oci_startup_script: currentZone.oci_startup_script,
            gcp_enabled: currentZone.gcp_enabled,
            gcp_max_instances: currentZone.gcp_max_instances,
            gcp_project: currentZone.gcp_project,
            gcp_region: currentZone.gcp_region,
            gcp_zone: currentZone.gcp_zone,
            gcp_machine_type: currentZone.gcp_machine_type,
            gcp_image: currentZone.gcp_image,
            gcp_startup_script: currentZone.gcp_startup_script,
            gcp_boot_volume_gb: currentZone.gcp_boot_volume_gb,
            gcp_disk_type: currentZone.gcp_disk_type,
            gcp_cmek: currentZone.gcp_cmek,
            gcp_network: currentZone.gcp_network,
            gcp_subnetwork: currentZone.gcp_subnetwork,
            gcp_public_ip: currentZone.gcp_public_ip,
            gcp_network_tags: JSON.stringify(currentZone.gcp_network_tags),
            gcp_custom_labels: JSON.stringify(currentZone.gcp_custom_labels),
            gcp_credentials: currentZone.gcp_credentials,
            gcp_metadata: JSON.stringify(currentZone.gcp_metadata),
            gcp_service_account: JSON.stringify(currentZone.gcp_service_account),
            gcp_guest_accelerators: JSON.stringify(currentZone.gcp_guest_accelerators),
            gcp_config_override: JSON.stringify(currentZone.gcp_config_override),
            azure_enabled: currentZone.azure_enabled,
            azure_max_instances: currentZone.azure_max_instances,
            azure_subscription_id: currentZone.azure_subscription_id,
            azure_resource_group: currentZone.azure_resource_group,
            azure_tenant_id: currentZone.azure_tenant_id,
            azure_client_id: currentZone.azure_client_id,
            azure_client_secret: currentZone.azure_client_secret,
            azure_region: currentZone.azure_region,
            azure_vm_size: currentZone.azure_vm_size,
            azure_os_disk_type: currentZone.azure_os_disk_type,
            azure_image_reference: JSON.stringify(currentZone.azure_image_reference),
            azure_network_sg: currentZone.azure_network_sg,
            azure_subnet: currentZone.azure_subnet,
            azure_os_disk_size_gb: currentZone.azure_os_disk_size_gb,
            azure_tags: JSON.stringify(currentZone.azure_tags),
            azure_os_username: currentZone.azure_os_username,
            azure_os_password: currentZone.azure_os_password,
            azure_ssh_public_key: currentZone.azure_ssh_public_key,
            azure_startup_script: currentZone.azure_startup_script,
            azure_config_override: JSON.stringify(currentZone.azure_config_override),
            azure_public_ip: currentZone.azure_public_ip,
            azure_authority: currentZone.azure_authority,
        });
    }


    componentDidMount(){
        if (this.props.fromUpdate){
            this.props.getZones().then((res) => this.initializeForm(res));
        }
        this.props.getLicenses()
            .then(() => {
                const {licenses} = this.props;
                for (let i in licenses) {
                    if (licenses[i].is_verified == true && licenses[i].features && licenses[i].features.auto_scaling === true) {
                        this.setState({auto_scaling: true})
                    }
                }
            });

    }

    render(){
        const {handleSubmit, has_aws_enabled, has_do_enabled, has_oci_enabled, has_gcp_enabled, has_azure_enabled,
            has_scaling_enabled, has_proxy, has_dns, has_dns_registration_provider, t} = this.props;
        const {currentZone} =  this.state;
        const aws_enabled_checked = currentZone && currentZone.aws_enabled;
        const digital_ocean_enabled_checked = currentZone && currentZone.digital_ocean_enabled;
        const oci_enabled_checked = currentZone && currentZone.oci_enabled;
        const gcp_enabled_checked = currentZone && currentZone.gcp_enabled;
        const azure_enabled_checked = currentZone && currentZone.azure_enabled;
        const gcp_public_ip_checked = currentZone && currentZone.gcp_public_ip;
        const azure_public_ip_checked = currentZone && currentZone.azure_public_ip;
        const scaling_enabled_checked = currentZone && currentZone.auto_scaling_enabled;
        const register_dns_enabled_checked = currentZone && currentZone.dns_registration_provider;
        const proxy_checked = currentZone && currentZone.proxy_connections;
        const prioritize_static_agents_checked = currentZone && currentZone.prioritize_static_agents;
        const search_alternate_zones_checked = currentZone && currentZone.search_alternate_zones;
        const do_required = has_do_enabled || has_dns_registration_provider === 'digital_ocean';
        const aws_required = has_aws_enabled || has_dns_registration_provider === 'aws';
        const oci_required = has_oci_enabled || has_dns_registration_provider === 'oci';
        const gcp_required = has_gcp_enabled || has_dns_registration_provider === 'gcp';
        const azure_required = has_azure_enabled || has_dns_registration_provider === 'azure';


        return (
            <Groups onSubmit={handleSubmit(this.props.save)} section={this.props.section}>
                <Group title="basic-details" description="basic-details-description">

                                <Field type="text"
                                    name="zone_name"
                                    id="zone_name"
                                    component={renderField} 
                                    validate={required} required
                                /> 
                                <Field type="text"
                                       name="allow_origin_domain"
                                       id="allow_origin_domain"
                                       component={renderField}
                                       validate={required} required
                                />
                                <Field type="text"
                                       name="upstream_auth_address"
                                       id="upstream_auth_address"
                                       component={renderField}
                                       validate={required} required
                                />
                                <Field type="text"
                                       name="load_strategy"
                                       id="load_strategy"
                                       component={renderSelectField}
                                       clearable={false}>
                                    <option value="least_load">{t('zones.least-load')}</option>
                                    <option value="most_load">{t('zones.most-load')}</option>
                                    <option value="least_kasms">{t('zones.least-sessions')}</option>
                                    <option value="most_kasms">{t('zones.most-sessions')}</option>
                                </Field>
                                <Field type="checkbox"
                                       name="search_alternate_zones"
                                       id="search_alternate_zones"
                                       checked = {search_alternate_zones_checked}
                                       component={renderToggle}
                                />
                                <Field type="checkbox"
                                        name="prioritize_static_agents"
                                        id="prioritize_static_agents"
                                        checked = {prioritize_static_agents_checked}
                                        component={renderToggle}
                                />
                                </Group>
 <Group title="proxy-details" description="proxy-details-description">
                                <Field type="checkbox"
                                       name="proxy_connections"
                                       id="proxy_connections"
                                       checked = {proxy_checked}
                                       component={renderToggle}
                                />
                                
                    { has_proxy &&
                       <React.Fragment>
                                        <Field type="text"
                                               name="proxy_hostname"
                                               id="proxy_hostname"
                                               component={renderField}
                                               validate={required} required
                                        />
                                        <Field type="text"
                                               name="proxy_path"
                                               id="proxy_path"
                                               component={renderField}
                                               validate={required} required
                                        />
                                        <Field
                                            type="number"
                                            name="proxy_port"
                                            id="proxy_port"
                                            component={renderField}
                                            validate={number} required
                                        />
                       </React.Fragment>
                    }
                     </Group>
                <FormFooter cancel={() => this.props.history.push("/zones")} />
            </Groups>
        );
    }
}

ZoneFormTemplate.propTypes = {
    updateZone: Proptypes.func.isRequired,
    getZones: Proptypes.func.isRequired,
    updatErrorWarning: Proptypes.func,
    history: Proptypes.object.isRequired,
    updateZoneError: Proptypes.func,
    createZoneError: Proptypes.func,
    fromUpdate: Proptypes.bool,
    createZone: Proptypes.func,
    errorCreateMessage: Proptypes.string,
    zones: Proptypes.array,
    getZoneLoading: Proptypes.bool,
    errorUpdateMessage: Proptypes.string,
    initialize: Proptypes.func,
    handleSubmit: Proptypes.func,
    licenses: Proptypes.array,
    zoneId: Proptypes.string
};


ZoneFormTemplate = reduxForm({ // eslint-disable-line
    form: "ZoneFormTemplate" // a unique identifier for this form
})(ZoneFormTemplate); // eslint-disable-line

const selector = formValueSelector('ZoneFormTemplate');

ZoneFormTemplate = connect(  // eslint-disable-line
    state => {
        const has_scaling_enabled = selector(state, 'auto_scaling_enabled');
        const has_aws_enabled = selector(state, 'aws_enabled');
        const has_do_enabled = selector(state, 'digital_ocean_enabled');
        const has_oci_enabled = selector(state, 'oci_enabled');
        const has_gcp_enabled = selector(state, 'gcp_enabled');
        const has_azure_enabled = selector(state, 'azure_enabled');
        const has_proxy = selector(state, 'proxy_connections');
        const has_dns = selector(state, 'register_dns');
        const has_dns_registration_provider = selector(state, 'dns_registration_provider');

        return {
            has_aws_enabled,
            has_do_enabled,
            has_oci_enabled,
            has_gcp_enabled,
            has_azure_enabled,
            has_scaling_enabled,
            has_proxy,
            has_dns,
            has_dns_registration_provider,
            zones: state.zones.zones || [],
            errorCreateMessage: state.zones.errorCreateMessage || null,
            errorUpdateMessage: state.zones.errorUpdateMessage || null,
            updateZoneError: state.zones.updateZoneError || null,
            getZoneLoading: state.zones.getZoneLoading || false,
            createZoneError: state.zones.createZoneError || null,
            initialValues: {enabled: true, auto_create_app_user: true, search_subtree: true},
            licenses: state.system_info.licenses
        }
    },
    dispatch => 
        ({
            updateZone: (data) => dispatch(updateZone(data)),
            getLicenses: () => dispatch(getLicenses()),
            getZones: () => dispatch(getZones())
        })) 
(ZoneFormTemplate);  //eslint-disable-line
const ZoneFormTemplateTranslated = withTranslation('common')(ZoneFormTemplate)
export default withRouter(ZoneFormTemplateTranslated);