import React, { Component } from "react";
import Proptypes from "prop-types";
import { connect } from "react-redux";
import { Form, FormGroup, Label, Row, Col } from "reactstrap";
import {
  renderField,
  required,
  renderTextArea,
  number,
  renderToggle,
} from "../../../../utils/formValidations.js";
import SelectInput from "../../../../components/SelectInput";
import { Field, reduxForm, formValueSelector } from "redux-form";
import { withRouter } from "react-router-dom";
import {withTranslation} from "react-i18next";
import { Button, FormFooter, Groups, FormField } from "../../../Form/Form.js"

class OpenStackProviderFormTemplate extends Component {

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
        openstack_keystone_endpoint: this.props.current_provider.openstack_keystone_endpoint,
        openstack_nova_endpoint: this.props.current_provider.openstack_nova_endpoint,
        openstack_nova_version: this.props.current_provider.openstack_nova_version,
        openstack_glance_endpoint: this.props.current_provider.openstack_glance_endpoint,
        openstack_glance_version: this.props.current_provider.openstack_glance_version,
        openstack_cinder_endpoint: this.props.current_provider.openstack_cinder_endpoint,
        openstack_cinder_version: this.props.current_provider.openstack_cinder_version,
        openstack_project_name: this.props.current_provider.openstack_project_name,
        openstack_project_domain_name: this.props.current_provider.openstack_project_domain_name,
        openstack_user_domain_name: this.props.current_provider.openstack_user_domain_name,
        openstack_username: this.props.current_provider.openstack_username,
        openstack_password: this.props.current_provider.openstack_password,
        openstack_metadata: this.props.current_provider.openstack_metadata ? JSON.stringify(this.props.current_provider.openstack_metadata, null, 2) : '',
        openstack_image_id: this.props.current_provider.openstack_image_id,
        openstack_flavor: this.props.current_provider.openstack_flavor,
        startup_script: this.props.current_provider.startup_script,
        openstack_security_groups: this.props.current_provider.openstack_security_groups ? JSON.stringify(this.props.current_provider.openstack_security_groups, null, 2) : '',
        openstack_network_id: this.props.current_provider.openstack_network_id,
        openstack_key_name: this.props.current_provider.openstack_key_name,
        openstack_availability_zone: this.props.current_provider.openstack_availability_zone,
        openstack_config_override: this.props.current_provider.openstack_config_override ? JSON.stringify(this.props.current_provider.openstack_config_override, null, 2) : '',
        openstack_auth_method: this.props.current_provider.openstack_auth_method,
        openstack_application_credential_id: this.props.current_provider.openstack_application_credential_id,
        openstack_application_credential_secret: this.props.current_provider.openstack_application_credential_secret,
        openstack_create_volume: this.props.current_provider.openstack_create_volume,
        openstack_volume_size_gb: this.props.current_provider.openstack_volume_size_gb,
        openstack_volume_type: this.props.current_provider.openstack_volume_type,
      });
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.current_provider && this.props.current_provider !== nextProps.current_provider) {
      this.props.initialize({
        vm_provider_config_name: nextProps.current_provider.vm_provider_config_name,
        vm_provider_name: nextProps.current_provider.vm_provider_name,
        max_instances: nextProps.current_provider.max_instances,
        openstack_keystone_endpoint: nextProps.current_provider.openstack_keystone_endpoint,
        openstack_nova_endpoint: nextProps.current_provider.openstack_nova_endpoint,
        openstack_nova_version: nextProps.current_provider.openstack_nova_version,
        openstack_glance_endpoint: nextProps.current_provider.openstack_glance_endpoint,
        openstack_glance_version: nextProps.current_provider.openstack_glance_version,
        openstack_cinder_endpoint: nextProps.current_provider.openstack_cinder_endpoint,
        openstack_cinder_version: nextProps.current_provider.openstack_cindder_version,
        openstack_project_name: nextProps.current_provider.openstack_project_name,
        openstack_project_domain_name: nextProps.current_provider.openstack_project_domain_name,
        openstack_user_domain_name: nextProps.current_provider.openstack_user_domain_name,
        openstack_username: nextProps.current_provider.openstack_username,
        openstack_password: nextProps.current_provider.openstack_password,
        openstack_metadata: nextProps.current_provider.openstack_metadata ? JSON.stringify(nextProps.current_provider.openstack_metadata, null, 2) : '',
        openstack_image_id: nextProps.current_provider.openstack_image_id,
        openstack_flavor: nextProps.current_provider.openstack_flavor,
        startup_script: nextProps.current_provider.startup_script,
        openstack_security_groups: nextProps.current_provider.openstack_security_groups ? JSON.stringify(nextProps.current_provider.openstack_security_groups, null, 2) : '',
        openstack_network_id: nextProps.current_provider.openstack_network_id,
        openstack_key_name: nextProps.current_provider.openstack_key_name,
        openstack_availability_zone: nextProps.current_provider.openstack_availability_zone,
        openstack_config_override: nextProps.current_provider.openstack_config_override ? JSON.stringify(nextProps.current_provider.openstack_config_override, null, 2) : '',
        openstack_auth_method: nextProps.current_provider.openstack_auth_method,
        openstack_application_credential_id: nextProps.current_provider.openstack_application_credential_id,
        openstack_application_credential_secret: nextProps.current_provider.openstack_application_credential_secret,
        openstack_create_volume: nextProps.current_provider.openstack_create_volume,
        openstack_volume_size_gb: nextProps.current_provider.openstack_volume_size_gb == '' ? null : nextProps.current_provider.openstack_volume_size_gb,
        openstack_volume_type: nextProps.current_provider.openstack_volume_type == '' ? null : nextProps.current_provider.openstack_volume_type,
      });
    }
  }


  cancelButton() {
    this.props.cancel_button(userData)
  }

  submitApi(userData) {
    userData.vm_provider_name = "openstack"
    this.props.submit_api(userData)
  }

  render() {
    const { handleSubmit, t, vmProviderFormValues } = this.props;
    const optionsAuthMethod = [
      { label: "Application Credentials", value: "application_credentials" },
      { label: "User", value: "user" },
    ];
    console.log(vmProviderFormValues)
    return (
      <Groups noPadding section="providers" onSubmit={handleSubmit(this.submitApi)}>
          <Field type="text"
            name="vm_provider_config_name"
            id="vm_provider_config_name"
            component={renderField}
            validate={required} required
            placeholder={t("providers.example_openstack_config")}
          />
          <Field type="text"
            name="max_instances"
            id="max_instances"
            component={renderField}
            validate={number} required
            placeholder={t("10")}
          />
          <Field type="text"
            name="openstack_keystone_endpoint"
            id="openstack_keystone_endpoint"
            placeholder="https://domain:5000"
            component={renderField}
            validate={required} required
          />
          <Field type="text"
            name="openstack_nova_endpoint"
            id="openstack_nova_endpoint"
            placeholder="https://domain:8774/v2/"
            component={renderField}
            validate={required} required
          />
          <Field type="text"
            name="openstack_nova_version"
            id="openstack_nova_version"
            placeholder="2.90"
            component={renderField}
            validate={required} required
          />
          <Field type="text"
            name="openstack_glance_endpoint"
            id="openstack_glance_endpoint"
            placeholder="https://domain:9292"
            component={renderField}
            validate={required} required
          />
          <Field type="text"
            name="openstack_glance_version"
            id="openstack_glance_version"
            placeholder="2"
            component={renderField}
            validate={required} required
          />
          <Field type="text"
            name="openstack_cinder_endpoint"
            id="openstack_cinder_endpoint"
            placeholder="http://domain:8776/v3/885a0daf105e460ab6a863ea0a55932d"
            component={renderField}
            validate={required} required
          />
          <Field type="text"
            name="openstack_cinder_version"
            id="openstack_cinder_version"
            placeholder="3"
            component={renderField}
            validate={required} required
          />
          <Field type="text"
            name="openstack_project_name"
            id="openstack_project_name"
            placeholder="Admin"
            component={renderField}
            validate={required} required
          />
          <Field name="openstack_auth_method"
            selectedValue={vmProviderFormValues && vmProviderFormValues.openstack_auth_method ? vmProviderFormValues.openstack_auth_method : ""}
            options={optionsAuthMethod}
            validate={required} required
            component={SelectInput}
          />
          { vmProviderFormValues && vmProviderFormValues.openstack_auth_method && vmProviderFormValues.openstack_auth_method == "user" ?
          <React.Fragment>
            <Field type="text"
              name="openstack_project_domain_name"
              id="openstack_project_domain_name"
              placeholder="Default"
              component={renderField}
              validate={required} required
            />
            <Field type="text"
              name="openstack_user_domain_name"
              id="openstack_user_domain_name"
              placeholder="Default"
              component={renderField}
              validate={required} required
            />
            <Field type="text"
              name="openstack_username"
              id="openstack_username"
              placeholder="user"
              component={renderField}
              validate={required} required
            />
            <Field type="text"
              name="openstack_password"
              id="openstack_password"
              placeholder="*********"
              component={renderField}
              validate={required} required
            />
          </React.Fragment>
          : ""}
          { vmProviderFormValues && vmProviderFormValues.openstack_auth_method && vmProviderFormValues.openstack_auth_method == "application_credentials" ?
          <React.Fragment>
            <Field type="text"
            name="openstack_application_credential_id"
            id="openstack_application_credential_id"
            placeholder="3f6a63da76a248ec92590fd9fd5e33a2"
            component={renderField}
            validate={required} required
            />
            <Field type="text"
              name="openstack_application_credential_secret"
              id="openstack_application_credential_secret"
              placeholder="3f6a63da76a248ec92590fd9fd5e33a2"
              component={renderField}
              validate={required} required
            />
          </React.Fragment>
          : ""}
          <Field type="text"
            name="openstack_metadata"
            id="openstack_metadata"
            placeholder="{}"
            component={renderTextArea}
            validate={required} required
          />
          <Field type="text"
            name="openstack_image_id"
            id="openstack_image_id"
            placeholder="10b50ce1-a095-4c1b-9bff-66bad2b1ba57"
            component={renderField}
            validate={required} required
          />
          <Field type="text"
            name="openstack_flavor"
            id="openstack_flavor"
            placeholder="m1.medium"
            component={renderField}
            validate={required} required
          />
          <Field type="checkbox"
            id="openstack_create_volume"
            name="openstack_create_volume"
            checked={vmProviderFormValues && vmProviderFormValues.openstack_create_volume}
            component={renderToggle}
          />
          { vmProviderFormValues && vmProviderFormValues.openstack_create_volume ?
          <React.Fragment>
            <Field type="text"
              id="openstack_volume_size_gb"
              name="openstack_volume_size_gb"
              placeholder="10"
              component={renderField}
              validate={number} required
            /> 
            <Field type="text"
              id="openstack_volume_type"
              name="openstack_volume_type"
              placeholder="__DEFAULT__"
              component={renderField}
              validate={required} required
            /> 
          </React.Fragment>
          : "" }
          <Field type="text"
            name="startup_script"
            id="startup_script"
            placeholder="#!/bin/bash&#10;..."
            component={renderTextArea}
            validate={required} required
          />
          <Field type="text"
            name="openstack_security_groups"
            id="openstack_security_groups"
            placeholder="[]"
            component={renderTextArea}
            validate={required} required
          />
          <Field type="text"
            name="openstack_network_id"
            id="openstack_network_id"
            placeholder='abe95a46-bbe1-4e60-8234-e819dde9f808'
            component={renderField}
            validate={required} required
          />
          <Field type="text"
            name="openstack_key_name"
            id="openstack_key_name"
            placeholder="mykey"
            component={renderField}
            validate={required} required
          />
          <Field type="text"
            name="openstack_availability_zone"
            id="openstack_availability_zone"
            placeholder="nova"
            component={renderField}
            validate={required} required
          />
          <Field type="text"
            name="openstack_config_override"
            id="openstack_config_override"
            placeholder="{}"
            component={renderTextArea}
            validate={required} required
          />
        <FormFooter
          cancelButton={<button className="cancel-button tw-bg-transparent" type="cancel" onClick={() => this.props.cancel_button()}> {this.props.wizard ? t("buttons.Previous") : t("buttons.Cancel")}</button>}
          saveButton={<Button id="save-openstack-vm" icon="save" type="submit" section="buttons" name={!this.props.wizard ? 'Submit' : this.props.stepCount && this.props.stepCount > 2 ? t("buttons.Next") : t("buttons.Finish")} />}
        />
      </Groups>
    );
  }
}

OpenStackProviderFormTemplate.propTypes = {
  current_provider: Proptypes.object,
  submit_api: Proptypes.func.isRequired,
  handleSubmit: Proptypes.func,
  cancel_button: Proptypes.func,
};

let OpenStackProviderFormWithRouter = withRouter(OpenStackProviderFormTemplate);

let OpenStackProviderForm = connect(state => {
  console.log("form state")
  console.log(state.form)
  return {
    vm_provider_configs: state.vm_provider.vm_provider_configs,
    vmProviderFormValues: state.form && state.form.VmProviderForm && state.form.VmProviderForm.values ? state.form.VmProviderForm.values : null,
  }
},

  dispatch =>
  ({

  }))(OpenStackProviderFormWithRouter);
  const OpenStackProviderFormTranslated = withTranslation('common')(OpenStackProviderForm)
export default reduxForm({
  form: "VmProviderForm",
})(OpenStackProviderFormTranslated);
