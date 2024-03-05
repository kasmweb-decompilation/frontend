import React, { Component } from "react";
import Proptypes from "prop-types";
import { connect } from "react-redux";
import {
    renderField,
    renderSelectField,
    renderToggle,
    required,
    renderTextArea,
    number,
    renderPass, minValue, json
} from "../../../../utils/formValidations.js";
import { Field, reduxForm } from "redux-form";
import { withRouter } from "react-router-dom";
import {withTranslation} from "react-i18next";
import { Button, FormFooter, Groups, FormField } from "../../../../components/Form/Form.js"

const minValue50 = minValue(50);

class AzureProviderFormTemplate extends Component {

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
                vm_provider_name: this.props.current_provider.vm_provider_name,
                azure_subscription_id: this.props.current_provider.azure_subscription_id,
                azure_resource_group: this.props.current_provider.azure_resource_group,
                azure_tenant_id: this.props.current_provider.azure_tenant_id,
                azure_client_id: this.props.current_provider.azure_client_id,
                azure_client_secret: this.props.current_provider.azure_client_secret,
                azure_region: this.props.current_provider.azure_region,
                azure_authority: this.props.current_provider.azure_authority,

                vm_provider_config_name: this.props.current_provider.vm_provider_config_name,
                max_instances: this.props.current_provider.max_instances,
                azure_vm_size: this.props.current_provider.azure_vm_size,
                azure_os_disk_type: this.props.current_provider.azure_os_disk_type,
                azure_image_reference: this.props.current_provider.azure_image_reference ? JSON.stringify(this.props.current_provider.azure_image_reference, null, 2) : null,
                azure_network_sg: this.props.current_provider.azure_network_sg,
                azure_subnet: this.props.current_provider.azure_subnet,
                azure_os_disk_size_gb: this.props.current_provider.azure_os_disk_size_gb,
                azure_tags: JSON.stringify(this.props.current_provider.azure_tags, null, 2),
                azure_os_username: this.props.current_provider.azure_os_username,
                azure_os_password: this.props.current_provider.azure_os_password,
                azure_ssh_public_key: this.props.current_provider.azure_ssh_public_key,
                startup_script: this.props.current_provider.startup_script,
                azure_config_override: this.props.current_provider.azure_config_override ? JSON.stringify(this.props.current_provider.azure_config_override, null, 2) : null,
                azure_public_ip: this.props.current_provider.azure_public_ip,
                azure_is_windows: this.props.current_provider.azure_is_windows,
            });
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.current_provider && this.props.current_provider !== nextProps.current_provider) {
            this.props.initialize({
                vm_provider_name: nextProps.current_provider.vm_provider_name,
                azure_subscription_id: nextProps.current_provider.azure_subscription_id,
                azure_resource_group: nextProps.current_provider.azure_resource_group,
                azure_tenant_id: nextProps.current_provider.azure_tenant_id,
                azure_client_id: nextProps.current_provider.azure_client_id,
                azure_client_secret: nextProps.current_provider.azure_client_secret,
                azure_region: nextProps.current_provider.azure_region,
                azure_authority: nextProps.current_provider.azure_authority,

                vm_provider_config_name: nextProps.current_provider.vm_provider_config_name,
                max_instances: nextProps.current_provider.max_instances,
                azure_vm_size: nextProps.current_provider.azure_vm_size,
                azure_os_disk_type: nextProps.current_provider.azure_os_disk_type,
                azure_image_reference: nextProps.current_provider.azure_image_reference ? JSON.stringify(nextProps.current_provider.azure_image_reference, null, 2) : null,
                azure_network_sg: nextProps.current_provider.azure_network_sg,
                azure_subnet: nextProps.current_provider.azure_subnet,
                azure_os_disk_size_gb: nextProps.current_provider.azure_os_disk_size_gb,
                azure_tags: JSON.stringify(nextProps.current_provider.azure_tags, null, 2),
                azure_os_username: nextProps.current_provider.azure_os_username,
                azure_os_password: nextProps.current_provider.azure_os_password,
                azure_ssh_public_key: nextProps.current_provider.azure_ssh_public_key,
                startup_script: nextProps.current_provider.startup_script,
                azure_config_override: nextProps.current_provider.azure_config_override ? JSON.stringify(nextProps.current_provider.azure_config_override, null, 2) : null,
                azure_public_ip: nextProps.current_provider.azure_public_ip,
                azure_is_windows: nextProps.current_provider.azure_is_windows,
            });
        }
    }


    cancelButton() {
        this.props.cancel_button(userData)
    }

    submitApi(userData) {
        userData.vm_provider_name = "azure"
        this.props.submit_api(userData)
    }

    render() {
        const { handleSubmit, t } = this.props;

        return (
            <Groups noPadding section="providers" onSubmit={handleSubmit(this.submitApi)}>

                <FormField label="Name">
                    <Field type="text"
                        name="vm_provider_config_name"
                        id="vm_provider_config_name"
                        component={renderField}
                        validate={required} required
                        placeholder={t("providers.Example Azure Config")}
                    />
                </FormField>
                <FormField label="Subscription ID">
                    <Field type="text"
                        name="azure_subscription_id"
                        id="azure_subscription_id"
                        component={renderField}
                        validate={required} required
                        placeholder="00000000-0000-0000-0000-000000000000"
                    />
                </FormField>
                <FormField label="Resource Group">
                    <Field type="text"
                        name="azure_resource_group"
                        id="azure_resource_group"
                        component={renderField}
                        validate={required} required
                        placeholder="development"
                    />
                </FormField>
                <FormField label="Tenant ID">
                    <Field type="text"
                        name="azure_tenant_id"
                        id="azure_tenant_id"
                        component={renderField}
                        validate={required} required
                        placeholder="00000000-0000-0000-0000-000000000000"
                    />
                </FormField>
                <FormField label="Client ID">
                    <Field type="text"
                        name="azure_client_id"
                        id="azure_client_id"
                        component={renderField}
                        validate={required} required
                        placeholder="00000000-0000-0000-0000-000000000000"
                    />
                </FormField>
                <FormField label="Client Secret">
                    <Field type="password"
                        name="azure_client_secret"
                        id="azure_client_secret"
                        component={renderPass}
                        validate={required} required
                    />
                </FormField>
                <FormField label="Azure Authority">
                    <Field type="text"
                        name="azure_authority"
                        id="azure_authority"
                        component={renderSelectField}
                        validate={required} required
                    >
                        <option>{t("providers.Select")}</option>
                        <option value="AZURE_PUBLIC_CLOUD">{t("providers.Azure Public Cloud")}</option>
                        <option value="AZURE_GOVERNMENT">{t("providers.Azure Government")}</option>
                        <option value="AZURE_CHINA">{t("providers.Azure China")}</option>
                        <option value="AZURE_GERMANY">{t("providers.Azure Germany")}</option>
                    </Field>
                </FormField>
                <FormField label="Region">
                    <Field type="text"
                        name="azure_region"
                        id="azure_region"
                        component={renderField}
                        validate={required} required
                        placeholder="eastus"
                    />
                </FormField>
                <FormField label="Max Instances">
                    <Field type="text"
                        name="max_instances"
                        id="max_instances"
                        component={renderField}
                        validate={number} required
                        placeholder="10"
                    />
                </FormField>
                <FormField label="VM Size">
                    <Field type="text"
                        name="azure_vm_size"
                        id="azure_vm_size"
                        component={renderField}
                        validate={required} required
                        placeholder="Standard_D2s_v3"
                    />
                </FormField>
                <FormField label="OS Disk Type">
                    <Field
                        name="azure_os_disk_type"
                        id="azure_os_disk_type"
                        component={renderField}
                        validate={required} required
                        placeholder="Premium_LRS"
                    />
                </FormField>
                <FormField label="OS Disk Size (GB)">
                    <Field type="text"
                        name="azure_os_disk_size_gb"
                        id="azure_os_disk_size_gb"
                        component={renderField}
                        validate={[number, minValue50]} required
                        placeholder="100"
                    />
                </FormField>
                <FormField label="OS Image Reference (JSON)">
                    <Field type="textarea"
                        name="azure_image_reference"
                        id="azure_image_reference"
                        validate={required} required
                        component={renderTextArea}
                        placeholder='{&#10;"publisher": "canonical",&#10;"offer": "0001-com-ubuntu-server-focal",&#10;"sku": "20_04-lts-gen2",&#10;"version": "latest"&#10;}'
                    />
                </FormField>
                <FormField label="Image is Windows">
                    <Field type="checkbox"
                        name="azure_is_windows"
                        id="azure_is_windows"
                        checked={this.props.azure_is_windows && this.props.current_provider.azure_is_windows}
                        component={renderToggle}
                    />
                </FormField>
                <FormField label="Network Security Group">
                    <Field name="azure_network_sg"
                        id="azure_network_sg"
                        component={renderField}
                        validate={required} required
                        placeholder="/subscriptions/00000000-0000-0000-0000-000000000000/resourcegroups/development/providers/Microsoft.Network/networkSecurityGroups/example-nsg"
                    />
                </FormField>
                <FormField label="Subnet">
                    <Field name="azure_subnet"
                        id="azure_subnet"
                        component={renderField}
                        validate={required} required
                        placeholder="/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/development/providers/Microsoft.Network/virtualNetworks/development-vnet/subnets/default"
                    />
                </FormField>
                <FormField label="Assign Public IP">
                    <Field type="checkbox"
                        name="azure_public_ip"
                        id="azure_public_ip"
                        checked={this.props.current_provider && this.props.current_provider.azure_public_ip}
                        component={renderToggle}
                    />
                </FormField>
                <FormField label="Tags (JSON)">
                    <Field type="textarea"
                        name="azure_tags"
                        id="azure_tags"
                        component={renderTextArea}
                        placeholder='{"name":"value"}'
                        validate={[required, json]} required
                    />
                </FormField>
                <FormField label="OS Username">
                    <Field type="text"
                        name="azure_os_username"
                        id="azure_os_username"
                        component={renderField}
                        validate={required} required
                        placeholder="testuser"
                    />
                </FormField>
                <FormField label="OS Password">
                    <Field type="password"
                        name="azure_os_password"
                        id="azure_os_password"
                        component={renderPass}
                        validate={required} required
                    />
                </FormField>
                <FormField label="SSH Public Key">
                    <Field type="textarea"
                        name="azure_ssh_public_key"
                        id="azure_ssh_public_key"
                        component={renderTextArea}
                        validate={required} required
                        placeholder="ssh-rsa AAAAAAA...."
                    />
                </FormField>
                <FormField label="Agent Startup Script">
                    <Field type="textarea"
                        name="startup_script"
                        id="startup_script"
                        component={renderTextArea}
                        validate={required} required
                        placeholder="#!/bin/bash&#10;..."
                    />
                </FormField>
                <FormField label="Config Override (JSON)">
                    <Field type="textarea"
                        name="azure_config_override"
                        id="azure_config_override"
                        component={renderTextArea}
                        placeholder='{"name" : "value"}'
                        required={[json, required]}
                    />
                </FormField>
                <FormFooter
                    cancelButton={<button className="cancel-button tw-bg-transparent" type="cancel" onClick={() => this.props.cancel_button()}> {this.props.wizard ? t("buttons.Previous") : t("buttons.Cancel")}</button>}
                    saveButton={<Button id="save-azure-vm" icon="save" type="submit" section="buttons" name={!this.props.wizard ? 'Submit' : this.props.stepCount && this.props.stepCount > 2 ? t("buttons.Next") : t("buttons.Finish")} />}
                />
            </Groups>
        );
    }
}


AzureProviderFormTemplate.propTypes = {
    current_provider: Proptypes.object,
    submit_api: Proptypes.func.isRequired,
    handleSubmit: Proptypes.func,
    cancel_button: Proptypes.func,
};


let AzureProviderFormWithRouter = withRouter(AzureProviderFormTemplate);

let AzureProviderForm = connect(state => {

    return {
        vm_provider_configs: state.vm_provider.vm_provider_configs,
    }
},

    dispatch =>
    ({

    }))(AzureProviderFormWithRouter);
const AzureProviderFormTranslated = withTranslation('common')(AzureProviderForm)
export default reduxForm({
    form: "VmProviderForm",
})(AzureProviderFormTranslated);
