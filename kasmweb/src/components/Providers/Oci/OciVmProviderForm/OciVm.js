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
  maxValue,
  json,
  renderSelectField,
  multipleOf,
} from "../../../../utils/formValidations.js";
import { Field, reduxForm, formValueSelector } from "redux-form";
import { withRouter } from "react-router-dom";
import {withTranslation} from "react-i18next";
import { Button, FormFooter, Groups, FormField } from "../../../../components/Form"

const minValue50 = minValue(50);
const maxValue120 = maxValue(120);
const multipleOf10 = multipleOf(10);
const minValue10 = minValue(10);

class OciProviderFormTemplate extends Component {

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
        oci_fingerprint: this.props.current_provider.oci_fingerprint,
        oci_tenancy_ocid: this.props.current_provider.oci_tenancy_ocid,
        oci_region: this.props.current_provider.oci_region,
        oci_compartment_ocid: this.props.current_provider.oci_compartment_ocid,
        oci_availability_domains: this.props.current_provider.oci_availability_domains ? JSON.stringify(this.props.current_provider.oci_availability_domains, null, 2) : '',
        oci_shape: this.props.current_provider.oci_shape,
        oci_image_ocid: this.props.current_provider.oci_image_ocid,
        oci_subnet_ocid: this.props.current_provider.oci_subnet_ocid,
        oci_ssh_public_key: this.props.current_provider.oci_ssh_public_key,
        startup_script: this.props.current_provider.startup_script,
        oci_user_ocid: this.props.current_provider.oci_user_ocid,
        oci_private_key: this.props.current_provider.oci_private_key,
        oci_flex_cpus: this.props.current_provider.oci_flex_cpus,
        oci_flex_memory_gb: this.props.current_provider.oci_flex_memory_gb,
        oci_boot_volume_gb: this.props.current_provider.oci_boot_volume_gb,
        oci_custom_tags: this.props.current_provider.oci_custom_tags ? JSON.stringify(this.props.current_provider.oci_custom_tags, null, 2) : '',
        oci_config_override: this.props.current_provider.oci_config_override ? JSON.stringify(this.props.current_provider.oci_config_override, null, 2) : '',
        oci_baseline_ocpu_utilization: this.props.current_provider.oci_baseline_ocpu_utilization,
        oci_nsg_ocids: this.props.current_provider.oci_nsg_ocids ? JSON.stringify(this.props.current_provider.oci_nsg_ocids, null, 2) : '',
        oci_storage_vpus_per_gb: this.props.current_provider.oci_storage_vpus_per_gb,
      });
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.current_provider && this.props.current_provider !== nextProps.current_provider) {
      this.props.initialize({
        vm_provider_config_name: nextProps.current_provider.vm_provider_config_name,
        vm_provider_name: nextProps.current_provider.vm_provider_name,
        max_instances: nextProps.current_provider.max_instances,
        oci_fingerprint: nextProps.current_provider.oci_fingerprint,
        oci_tenancy_ocid: nextProps.current_provider.oci_tenancy_ocid,
        oci_region: nextProps.current_provider.oci_region,
        oci_compartment_ocid: nextProps.current_provider.oci_compartment_ocid,
        oci_availability_domains: nextProps.current_provider.oci_availability_domains ? JSON.stringify(nextProps.current_provider.oci_availability_domains, null, 2) : '',
        oci_shape: nextProps.current_provider.oci_shape,
        oci_image_ocid: nextProps.current_provider.oci_image_ocid,
        oci_subnet_ocid: nextProps.current_provider.oci_subnet_ocid,
        oci_ssh_public_key: nextProps.current_provider.oci_ssh_public_key,
        startup_script: nextProps.current_provider.startup_script,
        oci_user_ocid: nextProps.current_provider.oci_user_ocid,
        oci_private_key: nextProps.current_provider.oci_private_key,
        oci_flex_cpus: nextProps.current_provider.oci_flex_cpus,
        oci_flex_memory_gb: nextProps.current_provider.oci_flex_memory_gb,
        oci_boot_volume_gb: nextProps.current_provider.oci_boot_volume_gb,
        oci_custom_tags: nextProps.current_provider.oci_custom_tags ? JSON.stringify(nextProps.current_provider.oci_custom_tags, null, 2) : '',
        oci_config_override: nextProps.current_provider.oci_config_override ? JSON.stringify(nextProps.current_provider.oci_config_override, null, 2) : '',
        oci_baseline_ocpu_utilization: nextProps.current_provider.oci_baseline_ocpu_utilization,
        oci_nsg_ocids: nextProps.current_provider.oci_nsg_ocids ? JSON.stringify(nextProps.current_provider.oci_nsg_ocids, null, 2) : '',
        oci_storage_vpus_per_gb: nextProps.current_provider.oci_storage_vpus_per_gb,
      });
    }
  }


  cancelButton() {
    this.props.cancel_button(userData)
  }

  submitApi(userData) {
    userData.vm_provider_name = "oci"
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
            placeholder={t("providers.Example Oci Config")}
          />
        </FormField>

        <FormField label="User OCID">
          <Field type="text"
            name="oci_user_ocid"
            id="oci_user_ocid"
            placeholder="ocid1.user.oc1..xxx"
            component={renderField}
            validate={required} required
          />
        </FormField>
        <FormField label="Fingerprint">
          <Field type="text"
            name="oci_fingerprint"
            id="oci_fingerprint"
            placeholder="xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx"
            component={renderField}
            validate={required} required
          />
        </FormField>
        <FormField label="Private Key">
          <Field type="text"
            name="oci_private_key"
            id="oci_private_key"
            placeholder="-----BEGIN PRIVATE KEY-----&#10;...&#10;-----END PRIVATE KEY-----"
            component={renderTextArea}
            validate={required} required
          />
        </FormField>
        <FormField label="Region">
          <Field type="text"
            name="oci_region"
            id="oci_region"
            placeholder="us-ashburn-1"
            component={renderField}
            validate={required} required
          />
        </FormField>
        <FormField label="Tenancy OCID">
          <Field type="text"
            name="oci_tenancy_ocid"
            id="oci_tenancy_ocid"
            placeholder="ocid1.tenancy.oc1..xxx"
            component={renderField}
            validate={required} required
          />
        </FormField>
        <FormField label="Compartment OCID">
          <Field type="text"
            name="oci_compartment_ocid"
            id="oci_compartment_ocid"
            placeholder="ocid1.compartment.oc1..xxx"
            component={renderField}
            validate={required} required
          />
        </FormField>
        <FormField label="Network Security Group OCIDs (JSON)">
          <Field type="textarea"
            name="oci_nsg_ocids"
            id="oci_nsg_ocids"
            placeholder='["ocid1.networksecuritygroup.oc1.iad.xxx", "ocid1.networksecuritygroup.oc1.iad.yyy"]'
            component={renderTextArea}
            validate={[required, json]} required
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
        <FormField label="Availability Domains">
          <Field type="textarea"
            name="oci_availability_domains"
            id="oci_availability_domains"
            placeholder='["BEol:US-ASHBURN-AD-1"]'
            component={renderTextArea}
            validate={[required, json]} required
          />
        </FormField>
        <FormField label="Image OCID">
          <Field type="text"
            name="oci_image_ocid"
            id="oci_image_ocid"
            placeholder="ocid1.image.oc1.iad.xxx"
            component={renderField}
            validate={required} required
          />
        </FormField>
        <FormField label="Shape">
          <Field type="text"
            name="oci_shape"
            id="oci_shape"
            placeholder="VM.Standard.E4.Flex"
            component={renderField}
            validate={required} required
          />
        </FormField>
        <FormField label="Flex CPUs">
          <Field type="text"
            name="oci_flex_cpus"
            id="oci_flex_cpus"
            placeholder="2"
            component={renderField}
            validate={number} required
          />
        </FormField>
        <FormField label="Burstable Base CPU Utilization">
          <Field type="text"
            name="oci_baseline_ocpu_utilization"
            id="oci_baseline_ocpu_utilization"
            component={renderSelectField}
            validate={required} required>
            <option>{t("providers.Select")}</option>
            <option value="BASELINE_1_1">{t("providers.BASELINE_1_1")}</option>
            <option value="BASELINE_1_2">{t("providers.BASELINE_1_2")}</option>
            <option value="BASELINE_1_8">{t("providers.BASELINE_1_8")}</option>
          </Field>
        </FormField>
        <FormField label="Flex Memory GB">
          <Field type="text"
            name="oci_flex_memory_gb"
            id="oci_flex_memory_gb"
            placeholder="4"
            component={renderField}
            validate={number} required
          />
        </FormField>
        <FormField label="Boot Volume GB">
          <Field type="text"
            name="oci_boot_volume_gb"
            id="oci_boot_volume_gb"
            placeholder="50"
            component={renderField}
            validate={[number, minValue50]} required
          />
        </FormField>
        <FormField label="Boot Volume VPUs Per GB">
          <Field type="text"
            name="oci_storage_vpus_per_gb"
            id="oci_storage_vpus_per_gb"
            placeholder="10"
            component={renderField}
            validate={[number, minValue10, multipleOf10, maxValue120]} required
          />
        </FormField>
        <FormField label="Custom Tags (JSON)">
          <Field type="text"
            name="oci_custom_tags"
            id="oci_custom_tags"
            placeholder='{"name":"value"}'
            component={renderTextArea}
          />
        </FormField>
        <FormField label="Subnet OCID">
          <Field type="text"
            name="oci_subnet_ocid"
            id="oci_subnet_ocid"
            placeholder="ocid1.subnet.oc1.iad.xxx"
            component={renderField}
            validate={required} required
          />
        </FormField>
        <FormField label="SSH Public Key">
          <Field type="text"
            name="oci_ssh_public_key"
            id="oci_ssh_public_key"
            placeholder="ssh-rsa XXXXXXX..."
            component={renderTextArea}
            validate={required} required
          />
        </FormField>
        <FormField label="Startup Script">
          <Field type="text"
            name="startup_script"
            id="startup_script"
            placeholder="#!/bin/bash&#10;..."
            component={renderTextArea}
            validate={required} required
          />
        </FormField>
        <FormField label="OCI Config Override (JSON)">
          <Field type="textarea"
            name="oci_config_override"
            id="oci_config_override"
            component={renderTextArea}
            placeholder='{"launch_instance_details": {}}'
            validate={[required, json]}
          />
        </FormField>
        <FormFooter
          cancelButton={<button className="cancel-button tw-bg-transparent" type="cancel" onClick={() => this.props.cancel_button()}> {this.props.wizard ? t("buttons.Previous") : t("buttons.Cancel")}</button>}
          saveButton={<Button id="save-oci-vm" icon="save" type="submit" section="buttons" name={!this.props.wizard ? 'Submit' : this.props.stepCount && this.props.stepCount > 2 ? t("buttons.Next") : t("buttons.Finish")} />}
        />
      </Groups>
    );
  }
}

OciProviderFormTemplate.propTypes = {
  current_provider: Proptypes.object,
  submit_api: Proptypes.func.isRequired,
  handleSubmit: Proptypes.func,
  cancel_button: Proptypes.func,
};

let OciProviderFormWithRouter = withRouter(OciProviderFormTemplate);

let OciProviderForm = connect(state => {

  return {
    vm_provider_configs: state.vm_provider.vm_provider_configs,
  }
},

  dispatch =>
  ({

  }))(OciProviderFormWithRouter);
  const OciProviderFormTranslated = withTranslation('common')(OciProviderForm)
export default reduxForm({
  form: "VmProviderForm",
})(OciProviderFormTranslated);
