import React, { Component } from "react";
import Proptypes from "prop-types";
import { connect } from "react-redux";
import { Form, FormGroup, Label, Row, Col } from "reactstrap";
import {
  renderField,
  required,
  renderTextArea,
  number,
  minValue,
  renderPass,
} from "../../../../utils/formValidations.js";
import { Field, reduxForm } from "redux-form";
import { withRouter } from "react-router-dom";
import SelectInput from "../../../SelectInput";
import {withTranslation} from "react-i18next";
import { Button, FormFooter, Groups, FormField } from "../../../../components/Form"

const minValue50 = minValue(50);

class VsphereProviderFormTemplate extends Component {

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
        vsphere_vcenter_address: this.props.current_provider.vsphere_vcenter_address,
        vsphere_vcenter_port: this.props.current_provider.vsphere_vcenter_port,
        vsphere_vcenter_username: this.props.current_provider.vsphere_vcenter_username,
        vsphere_vcenter_password: this.props.current_provider.vsphere_vcenter_password,
        vsphere_template_name: this.props.current_provider.vsphere_template_name,
        vsphere_datacenter_name: this.props.current_provider.vsphere_datacenter_name,
        vsphere_vm_folder: this.props.current_provider.vsphere_vm_folder,
        vsphere_datastore: this.props.current_provider.vsphere_datastore,
        vsphere_cluster_name: this.props.current_provider.vsphere_cluster_name,
        vsphere_resource_pool: this.props.current_provider.vsphere_resource_pool,
        vsphere_datastore_cluster_name: this.props.current_provider.vsphere_datastore_cluster_name,
        startup_script: this.props.current_provider.startup_script,
        vsphere_os_username: this.props.current_provider.vsphere_os_username,
        vsphere_os_password: this.props.current_provider.vsphere_os_password,
        vsphere_cpus: this.props.current_provider.vsphere_cpus,
        vsphere_memoryMB: this.props.current_provider.vsphere_memoryMB,
        vsphere_installed_OS_type: this.props.current_provider.vsphere_installed_OS_type,
      });
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.current_provider && this.props.current_provider !== nextProps.current_provider) {
      this.props.initialize({
        vm_provider_config_name: nextProps.current_provider.vm_provider_config_name,
        vm_provider_name: nextProps.current_provider.vm_provider_name,
        max_instances: nextProps.current_provider.max_instances,
        vsphere_vcenter_address: nextProps.current_provider.vsphere_vcenter_address,
        vsphere_vcenter_port: nextProps.current_provider.vsphere_vcenter_port,
        vsphere_vcenter_username: nextProps.current_provider.vsphere_vcenter_username,
        vsphere_vcenter_password: nextProps.current_provider.vsphere_vcenter_password,
        vsphere_template_name: nextProps.current_provider.vsphere_template_name,
        vsphere_datacenter_name: nextProps.current_provider.vsphere_datacenter_name,
        vsphere_vm_folder: nextProps.current_provider.vsphere_vm_folder,
        vsphere_datastore: nextProps.current_provider.vsphere_datastore,
        vsphere_cluster_name: nextProps.current_provider.vsphere_cluster_name,
        vsphere_resource_pool: nextProps.current_provider.vsphere_resource_pool,
        vsphere_datastore_cluster_name: nextProps.current_provider.vsphere_datastore_cluster_name,
        startup_script: nextProps.current_provider.startup_script,
        vsphere_os_username: nextProps.current_provider.vsphere_os_username,
        vsphere_os_password: nextProps.current_provider.vsphere_os_password,
        vsphere_cpus: nextProps.current_provider.vsphere_cpus,
        vsphere_memoryMB: nextProps.current_provider.vsphere_memoryMB,
        vsphere_installed_OS_type: nextProps.current_provider.vsphere_installed_OS_type,
      });
    }
  }


  cancelButton() {
    this.props.cancel_button(userData)
  }

  submitApi(userData) {
    userData.vm_provider_name = "vsphere"
    this.props.submit_api(userData)
  }

  render() {
    const { handleSubmit, VsphereProviderFormValues, t } = this.props;

    let optionsOSTypes = [
      { value: 'Linux', label: 'Linux' },
      { value: 'Windows', label: 'Windows' }
    ]

    return (
      <Groups noPadding section="providers" onSubmit={handleSubmit(this.submitApi)}>
        <FormField label="Name">
          <Field type="text"
            name="vm_provider_config_name"
            id="vm_provider_config_name"
            component={renderField}
            validate={required} required
            placeholder={t("providers.Example-Vsphere-Config")}
          />
        </FormField>

        <FormField label="Vsphere-Vcenter-Address">
          <Field type="text"
            name="vsphere_vcenter_address"
            id="vsphere_vcenter_address"
            placeholder="vsphere.example.com"
            component={renderField}
            validate={required} required
          />
        </FormField>
        <FormField label="Vsphere-Vcenter-Port">
          <Field type="text"
            name="vsphere_vcenter_port"
            id="vsphere_vcenter_port"
            placeholder="443"
            component={renderField}
            validate={required} required
          />
        </FormField>
        <FormField label="Vsphere-Vcenter-Username">
          <Field type="text"
            name="vsphere_vcenter_username"
            id="vsphere_vcenter_username"
            placeholder="administrator@vsphere.local"
            component={renderField}
            validate={required} required
          />
        </FormField>
        <FormField label="Vsphere-Vcenter-Password">
          <Field type="password"
            name="vsphere_vcenter_password"
            id="vsphere_vcenter_password"
            placeholder={t("providers.Password")}
            component={renderPass}
            validate={required} required
          />
        </FormField>
        <FormField label="VM-Template-Name">
          <Field type="text"
            name="vsphere_template_name"
            id="vsphere_template_name"
            placeholder={t("providers.Example-Template-Name")}
            component={renderField}
            validate={required} required
          />
        </FormField>
        <FormField label="Max-Instances">
          <Field type="number"
            name="max_instances"
            id="max_instances"
            placeholder="10"
            component={renderField}
            validate={number} required
          />
        </FormField>
        <FormField label="Datacenter-Name">
          <Field type="text"
            name="vsphere_datacenter_name"
            id="vsphere_datacenter_name"
            placeholder={t("providers.Datacenter-Name")}
            component={renderField}
            validate={required} required
          />
        </FormField>
        <FormField label="VM-Folder">
          <Field type="text"
            name="vsphere_vm_folder"
            id="vsphere_vm_folder"
            placeholder={t("providers.VM-Folder")}
            component={renderField}
          />
        </FormField>
        <FormField label="Datastore-Name">
          <Field type="text"
            name="vsphere_datastore"
            id="vsphere_datastore"
            placeholder={t("providers.Vsphere-Datastore-Name")}
            component={renderField}
          />
        </FormField>
        <FormField label="Cluster-Name">
          <Field type="text"
            name="vsphere_cluster_name"
            id="vsphere_cluster_name"
            placeholder={t("providers.Cluster")}
            component={renderField}
          />
        </FormField>
        <FormField label="Resource-Pool">
          <Field type="text"
            name="vsphere_resource_pool"
            id="vsphere_resource_pool"
            placeholder={t("providers.Resource-Pool-Name")}
            component={renderField}
          />
        </FormField>
        <FormField label="Datastore-Cluster-Name">
          <Field type="text"
            name="vsphere_datastore_cluster_name"
            id="vsphere_datastore_cluster_name"
            placeholder={t("providers.Datastore-Cluster-Name")}
            component={renderField}
          />
        </FormField>
        <FormField label="Guest-VM-Username">
          <Field type="text"
            name="vsphere_os_username"
            id="vsphere_os_username"
            placeholder="admin"
            component={renderField}
            validate={required} required
          />
        </FormField>
        <FormField label="Guest-VM-Password">
          <Field type="password"
            name="vsphere_os_password"
            id="vsphere_os_password"
            placeholder={t("providers.Password")}
            component={renderPass}
            validate={required} required
          />
        </FormField>
        <FormField label="Number-of-Guest-CPUs">
          <Field type="text"
            name="vsphere_cpus"
            id="vsphere_cpus"
            placeholder="4"
            component={renderField}
            validate={number} required
          />
        </FormField>
        <FormField label="Amount-of-Guest-Memory(MB)">
          <Field type="text"
            name="vsphere_memoryMB"
            id="vsphere_memoryMB"
            placeholder="8192"
            component={renderField}
            validate={number} required
          />
        </FormField>
        <FormField label="What-family-of-OS-is-installed-in-the-VM">
          <Field name="vsphere_installed_OS_type"
            id="vsphere_installed_OS_type"
            selectedValue={VsphereProviderFormValues && VsphereProviderFormValues.vsphere_installed_OS_type ? VsphereProviderFormValues.vsphere_installed_OS_type : ""}
            options={optionsOSTypes}
            component={SelectInput}
            validate={required} required
          />
        </FormField>
        <FormField label="Startup-Script-(Bash-for-Linux-or-Powershell-for-Windows)">
          <Field type="text"
            name="startup_script"
            id="startup_script"
            placeholder="#!/bin/bash&#10;..."
            component={renderTextArea}
            validate={required} required
          />
        </FormField>
        <FormFooter
          cancelButton={<button className="cancel-button tw-bg-transparent" type="cancel" onClick={() => this.props.cancel_button()}> {this.props.wizard ? t("buttons.Previous") : t("buttons.Cancel")}</button>}
          saveButton={<Button id="save-vsphere-vm" icon="save" type="submit" section="buttons" name={!this.props.wizard ? 'Submit' : this.props.stepCount && this.props.stepCount > 2 ? t("buttons.Next") : t("buttons.Finish")} />}
        />

      </Groups>
    );
  }
}

VsphereProviderFormTemplate.propTypes = {
  current_provider: Proptypes.object,
  submit_api: Proptypes.func.isRequired,
  handleSubmit: Proptypes.func,
  cancel_button: Proptypes.func,
  VsphereProviderFormValues: Proptypes.object,
};

let VsphereProviderFormWithRouter = withRouter(VsphereProviderFormTemplate);

let VsphereProviderForm = connect(state => {

  return {
    vm_provider_configs: state.vm_provider.vm_provider_configs,
    VsphereProviderFormValues: state.form && state.form.VmProviderForm && state.form.VmProviderForm.values ? state.form.VmProviderForm.values : null,
  }
},

  dispatch =>
  ({

  }))(VsphereProviderFormWithRouter);
  const VsphereProviderFormTranslated = withTranslation('common')(VsphereProviderForm)
export default reduxForm({
  form: "VmProviderForm",
})(VsphereProviderFormTranslated);
