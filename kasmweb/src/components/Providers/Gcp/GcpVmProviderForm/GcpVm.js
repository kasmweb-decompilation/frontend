import React, { Component } from "react";
import Proptypes from "prop-types";
import { connect } from "react-redux";
import { Form, FormGroup, Label, Row, Col } from "reactstrap";
import {
    renderField,
    renderToggle,
    required,
    renderTextArea,
    number,
    minValue,
} from "../../../../utils/formValidations.js";
import { Field, reduxForm } from "redux-form";
import { withRouter } from "react-router-dom";
import {withTranslation} from "react-i18next";
import { Button, FormFooter, Groups, FormField } from "../../../../components/Form"

const minValue50 = minValue(50);

class GcpProviderFormTemplate extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentProvider: {},
        };
        this.submitApi = this.submitApi.bind(this);
        this.cancelButton = this.cancelButton.bind(this);
    }

    componentDidMount() {
        if (this.props.current_provider) {
            this.props.initialize({
                vm_provider_config_name: this.props.current_provider.vm_provider_config_name,
                vm_provider_name: this.props.current_provider.vm_provider_name,

                max_instances: this.props.current_provider.max_instances,
                gcp_project: this.props.current_provider.gcp_project,
                gcp_region: this.props.current_provider.gcp_region,
                gcp_zone: this.props.current_provider.gcp_zone,
                gcp_machine_type: this.props.current_provider.gcp_machine_type,
                gcp_image: this.props.current_provider.gcp_image,
                startup_script: this.props.current_provider.startup_script,
                gcp_boot_volume_gb: this.props.current_provider.gcp_boot_volume_gb,
                gcp_cmek: this.props.current_provider.gcp_cmek,
                gcp_disk_type: this.props.current_provider.gcp_disk_type,
                gcp_network: this.props.current_provider.gcp_network,
                gcp_subnetwork: this.props.current_provider.gcp_subnetwork,
                gcp_public_ip: this.props.current_provider.gcp_public_ip,
                gcp_network_tags: this.props.current_provider.gcp_network_tags ? JSON.stringify(this.props.current_provider.gcp_network_tags, null, 2) : '',
                gcp_custom_labels: this.props.current_provider.gcp_custom_labels ? JSON.stringify(this.props.current_provider.gcp_custom_labels, null, 2) : '',
                gcp_credentials: this.props.current_provider.gcp_credentials && this.props.current_provider.gcp_credentials === '**********' ? this.props.current_provider.gcp_credentials : JSON.stringify(this.props.current_provider.gcp_credentials, null, 2),
                gcp_metadata: this.props.current_provider.gcp_metadata ? JSON.stringify(this.props.current_provider.gcp_metadata, null, 2) : '',
                gcp_service_account: this.props.current_provider.gcp_service_account ? JSON.stringify(this.props.current_provider.gcp_service_account, null, 2) : '',
                gcp_guest_accelerators: this.props.current_provider.gcp_guest_accelerators ? JSON.stringify(this.props.current_provider.gcp_guest_accelerators, null, 2) : '',
                gcp_config_override: this.props.current_provider.gcp_config_override ? JSON.stringify(this.props.current_provider.gcp_config_override, null, 2) : '',
            });
        }
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.current_provider && this.props.current_provider !== nextProps.current_provider) {
            this.props.initialize({
                vm_provider_config_name: nextProps.current_provider.vm_provider_config_name,
                vm_provider_name: nextProps.current_provider.vm_provider_name,

                max_instances: nextProps.current_provider.max_instances,
                gcp_project: nextProps.current_provider.gcp_project,
                gcp_region: nextProps.current_provider.gcp_region,
                gcp_zone: nextProps.current_provider.gcp_zone,
                gcp_machine_type: nextProps.current_provider.gcp_machine_type,
                gcp_image: nextProps.current_provider.gcp_image,
                startup_script: nextProps.current_provider.startup_script,
                gcp_boot_volume_gb: nextProps.current_provider.gcp_boot_volume_gb,
                gcp_cmek: nextProps.current_provider.gcp_cmek,
                gcp_disk_type: nextProps.current_provider.gcp_disk_type,
                gcp_network: nextProps.current_provider.gcp_network,
                gcp_subnetwork: nextProps.current_provider.gcp_subnetwork,
                gcp_public_ip: nextProps.current_provider.gcp_public_ip,
                gcp_network_tags: nextProps.current_provider.gcp_network_tags ? JSON.stringify(nextProps.current_provider.gcp_network_tags, null, 2) : '',
                gcp_custom_labels: nextProps.current_provider.gcp_custom_labels ? JSON.stringify(nextProps.current_provider.gcp_custom_labels, null, 2) : '',
                gcp_credentials: nextProps.current_provider.gcp_credentials && nextProps.current_provider.gcp_credentials === '**********' ? nextProps.current_provider.gcp_credentials : JSON.stringify(this.props.current_provider.gcp_credentials, null, 2),
                gcp_metadata: nextProps.current_provider.gcp_metadata ? JSON.stringify(nextProps.current_provider.gcp_metadata, null, 2) : '',
                gcp_service_account: nextProps.current_provider.gcp_service_account ? JSON.stringify(nextProps.current_provider.gcp_service_account, null, 2) : '',
                gcp_guest_accelerators: nextProps.current_provider.gcp_guest_accelerators ? JSON.stringify(nextProps.current_provider.gcp_guest_accelerators, null, 2) : '',
                gcp_config_override: nextProps.current_provider.gcp_config_override ? JSON.stringify(nextProps.current_provider.gcp_config_override, null, 2) : '',
            });
        }
    }


    cancelButton() {
        this.props.cancel_button(userData)
    }

    submitApi(userData) {
        userData.vm_provider_name = "gcp"
        this.props.submit_api(userData)
    }

    render() {
        const { handleSubmit, t } = this.props;
        const { currentZone } = this.state;
        const gcp_public_ip_checked = currentZone && currentZone.gcp_public_ip;

        return (
            <Groups noPadding section="providers" onSubmit={handleSubmit(this.submitApi)}>
                <FormField label="Name">
                    <Field type="text"
                        name="vm_provider_config_name"
                        id="vm_provider_config_name"
                        component={renderField}
                        validate={required} required
                        placeholder={t("providers.Example Google Cloud Config")}
                    />
                </FormField>
                <FormField label="GCP Credentials (JSON)">
                    <Field type="text"
                        name="gcp_credentials"
                        id="gcp_credentials"
                        placeholder='{"foo" : "bar"}'
                        component={renderTextArea}
                        validate={required} required
                    />
                </FormField>
                <FormField label="Max Instances">
                    <Field type="number"
                        name="max_instances"
                        id="max_instances"
                        placeholder="10"
                        component={renderField}
                        validate={number} required
                    />
                </FormField>
                <FormField label="Project ID">
                    <Field type="text"
                        name="gcp_project"
                        id="gcp_project"
                        placeholder="project-name"
                        component={renderField}
                        validate={required} required
                    />
                </FormField>
                <FormField label="Region">
                    <Field type="text"
                        name="gcp_region"
                        id="gcp_region"
                        placeholder="us-east4"
                        component={renderField}
                        validate={required} required
                    />
                </FormField>
                <FormField label="Zone">
                    <Field type="text"
                        name="gcp_zone"
                        id="gcp_zone"
                        placeholder="us-east4-b"
                        component={renderField}
                        validate={required} required
                    />
                </FormField>
                <FormField label="Machine Type">
                    <Field type="text"
                        name="gcp_machine_type"
                        id="gcp_machine_type"
                        placeholder="e2-standard-2"
                        component={renderField}
                        validate={required} required
                    />
                </FormField>
                <FormField label="Machine Image">
                    <Field type="text"
                        name="gcp_image"
                        id="gcp_image"
                        placeholder="projects/debian-cloud/global/images/debian-10-buster-v20211209"
                        component={renderField}
                        validate={required} required
                    />
                </FormField>
                <FormField label="Boot Volume GB">
                    <Field type="text"
                        name="gcp_boot_volume_gb"
                        id="gcp_boot_volume_gb"
                        placeholder="50"
                        component={renderField}
                        validate={[number, minValue50]} required
                    />
                </FormField>
                <FormField label="Disk Type">
                    <Field type="text"
                        name="gcp_disk_type"
                        id="gcp_disk_type"
                        placeholder="pd-ssd"
                        component={renderField}
                        validate={required} required
                    />
                </FormField>
                <FormField label="Customer Managed Encryption Key (CMEK)">
                    <Field type="text"
                        name="gcp_cmek"
                        id="gcp_cmek"
                        placeholder="projects/project-name/locations/global/keyRings/my-keyring/cryptoKeys/my-key"
                        component={renderField}
                    />
                </FormField>
                <FormField label="Network">
                    <Field type="text"
                        name="gcp_network"
                        id="gcp_network"
                        placeholder="projects/project-name/global/networks/default"
                        component={renderField}
                        validate={required} required
                    />
                </FormField>
                <FormField label="Sub Network">
                    <Field type="text"
                        name="gcp_subnetwork"
                        id="gcp_subnetwork"
                        placeholder="projects/project-name/regions/us-east4/subnetworks/default"
                        component={renderField}
                        validate={required} required
                    />
                </FormField>
                <FormField label="Public IP">
                    <Field type="checkbox"
                        name="gcp_public_ip"
                        id="gcp_public_ip"
                        checked={gcp_public_ip_checked}
                        component={renderToggle}
                    />
                </FormField>
                <FormField label="Network Tags (JSON)">
                    <Field type="text"
                        name="gcp_network_tags"
                        id="gcp_network_tags"
                        placeholder='["https-server"]'
                        component={renderTextArea}
                    />
                </FormField>
                <FormField label="Custom Labels (JSON)">
                    <Field type="text"
                        name="gcp_custom_labels"
                        id="gcp_custom_labels"
                        placeholder='{"foo" : "bar"}'
                        component={renderTextArea}
                    />
                </FormField>
                <FormField label="Metadata (JSON)">
                    <Field type="text"
                        name="gcp_metadata"
                        id="gcp_metadata"
                        placeholder='[{}]'
                        component={renderTextArea}
                    />
                </FormField>
                <FormField label="Service Account (JSON)">
                    <Field type="text"
                        name="gcp_service_account"
                        id="gcp_service_account"
                        placeholder='{}'
                        component={renderTextArea}
                    />
                </FormField>
                <FormField label="Guest Accelerators (JSON)">
                    <Field type="text"
                        name="gcp_guest_accelerators"
                        id="gcp_guest_accelerators"
                        placeholder='[]'
                        component={renderTextArea}
                    />
                </FormField>
                <FormField label="GCP Config Override (JSON)">
                    <Field type="text"
                        name="gcp_config_override"
                        id="gcp_config_override"
                        placeholder='{}'
                        component={renderTextArea}
                    />
                </FormField>
                <FormField label="Startup Script">
                    <Field type="text"
                        name="startup_script"
                        id="startup_script"
                        placeholder="#!/bin/bash&#10;..."
                        component={renderTextArea}
                    />
                </FormField>
                <FormFooter
                    cancelButton={<button className="cancel-button tw-bg-transparent" type="cancel" onClick={() => this.props.cancel_button()}> {this.props.wizard ? t("buttons.Previous") : t("buttons.Cancel")}</button>}
                    saveButton={<Button id="save-gcp-vm" icon="save" type="submit" section="buttons" name={!this.props.wizard ? 'Submit' : this.props.stepCount && this.props.stepCount > 2 ? t("buttons.Next") : t("buttons.Finish")} />}
                />
            </Groups>
        );
    }
}

GcpProviderFormTemplate.propTypes = {
    current_provider: Proptypes.object,
    submit_api: Proptypes.func.isRequired,
    handleSubmit: Proptypes.func,
    cancel_button: Proptypes.func,
};

let GcpProviderFormWithRouter = withRouter(GcpProviderFormTemplate);

let GcpProviderForm = connect(state => {

    return {
        vm_provider_configs: state.vm_provider.vm_provider_configs,
    }
},

    dispatch =>
    ({

    }))(GcpProviderFormWithRouter);
    const GcpProviderFormTranslated = withTranslation('common')(GcpProviderForm)
export default reduxForm({
    form: "VmProviderForm",
})(GcpProviderFormTranslated);
