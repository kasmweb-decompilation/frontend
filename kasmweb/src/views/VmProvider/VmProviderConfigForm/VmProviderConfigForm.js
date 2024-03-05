import React, { Component } from 'react';
import { connect } from "react-redux";
import { Field, reduxForm, formValueSelector, destroy } from "redux-form";
import { required } from "../../../utils/formValidations.js";
import { withRouter } from "react-router-dom";
import { FormGroup, Label, Row, Col, CardBody, CardFooter, Alert, Modal, ModalHeader, ModalBody } from "reactstrap";
import Proptypes from "prop-types";
import { NotificationManager } from "react-notifications";
import { getVmProviderConfigs } from "../../../actions/actionVmProvider";
import { getLicenseStatus } from "../../../actions/actionFooter.js";
import AzureProviderForm from "../../../components/Providers/Azure/AzureVmProviderForm/AzureVm.js";
import AwsProviderForm from "../../../components/Providers/Aws/AwsVmProviderForm/AwsVm.js";
import OciProviderForm from "../../../components/Providers/Oci/OciVmProviderForm/OciVm.js";
import DigitalOceanProviderForm from "../../../components/Providers/DigitalOcean/DigitalOceanVmProviderForm/DigitalOceanVm.js";
import GcpProviderForm from "../../../components/Providers/Gcp/GcpVmProviderForm/GcpVm.js";
import VsphereProviderForm from "../../../components/Providers/Vsphere/VsphereVmProviderForm/VsphereVm.js";
import OpenStackProviderForm from "../../../components/Providers/OpenStack/OpenStackVmProviderForm/OpenStackVm.js";

import { createVmProviderConfig, updateVmProviderConfig } from '../../../actions/actionVmProvider';
import SelectInput from "../../../components/SelectInput/SelectInput.js";
import {withTranslation} from "react-i18next";
import { Button, FormFooter, FormField } from "../../../components/Form/Form.js"

class VmProviderConfigFormTemplate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentProvider: {},
      collapseAdvanced: false,
      licensed: false,
    };
    this.cancelButton = this.cancelButton.bind(this);
    this.submitApi = this.submitApi.bind(this);
    this.changeVmProvider = this.changeVmProvider.bind(this);
    this.initialize = this.initialize.bind(this);

  }



  cancelButton() {
    if (this.props.inline) {
      this.props.cancelProviderModal()
    } else if (this.props.wizard) {
      this.props.previousPage()
    } else {
      this.props.history.push("/vm_provider");
    }
  }

  submitApi() {
    this.props.onSubmit()
  }

  changeVmProvider(provider) {
    let currentProvider = {
      vm_provider_config_name: null,
      vm_provider_config_id: null,
      vm_provider_name: null
    }
    if (provider === 'new_provider') {

    } else {
      currentProvider = this.props.vm_provider_configs.find(vmprovider => vmprovider.vm_provider_config_id === provider)
    }
    this.setState({ currentProvider: currentProvider });
    this.initialize(currentProvider, 'changeVmProvider')

  }

  initialize(config, from) {
    if (config) {
      this.props.initialize({
        vm_provider_config_name: config.vm_provider_config_name,
        vm_provider_config_id: config.vm_provider_config_id,
        vm_provider_name: config.vm_provider_name
      });
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.vm_provider_configs && nextProps.vm_provider_configs.length > 0 && this.props.vm_provider_configs !== nextProps.vm_provider_configs && this.props.getVmProviderLoading && this.props.fromUpdate) {
      let currentProvider = nextProps.vm_provider_configs.find(provider => provider.vm_provider_config_id === this.props.VmProviderConfigId);
      this.setState({ currentProvider: currentProvider });
      this.initialize(currentProvider, 'receiveProps')
    }
    if (nextProps.license_info && nextProps.license_info !== this.props.license_info) {
      this.setState({ licensed: nextProps.license_info.status.features.indexOf('auto_scaling') >= 0 });
    }

  }

  async componentDidMount() {
    const { license_info } = this.props;
    if (license_info && license_info.status && license_info.status.features && license_info.status.features.indexOf('auto_scaling') >= 0) {
      this.setState({ licensed: true });
    }
    if (this.props.autoscale_config && this.props.autoscale_config !== null && this.props.autoscale_config.vm_provider_config_id) {
      await this.props.getVmProviderConfigs();
      let currentProvider = this.props.vm_provider_configs.find(provider => provider.vm_provider_config_id === this.props.autoscale_config.vm_provider_config_id);
      this.setState({ currentProvider: currentProvider });
      this.initialize(currentProvider, 'componentDidMount')
    }
  }

  render() {
    const { handleSubmit, vmProviderFormValues, vm_provider_configs, t } = this.props;
    const deny_by_default_checked = false

    let optionProviders = [];
    vm_provider_configs.map(opt => {
      optionProviders.push({ label: opt.vm_provider_config_name, value: opt.vm_provider_config_id });
    });
    optionProviders.sort((a, b) => (a.label.toLowerCase() > b.label.toLowerCase()) ? 1 : -1);
    optionProviders.push({ label: t('providers.create-new'), value: 'new_provider' })

    if (!this.state.licensed) {
      let license_url = `${__LICENSE_INFO_URL__}`;
      return (
        <Alert color="none" isOpen={true}>
          <h4>{t('licensing.unavailable')}</h4>
          {t('licensing.this-feature-must-be-licensed')}
          <hr />
          <a href={license_url}>{t('licensing.more-information')}</a><br />
        </Alert>
      )
    }
    const optionsProviders = [
      { label: "AWS", value: "aws" },
      { label: "Azure", value: "azure" },
      { label: "Digital Ocean", value: "digital_ocean" },
      { label: "Google Cloud", value: "gcp" },
      { label: "OpenStack", value: "openstack" },
      { label: "Oracle Cloud", value: "oci" },
      { label: "VMWare Vsphere", value: "vsphere" },
    ];

    return (
      <React.Fragment>
          <FormField section="providers" label="vm-provider-configs">
            <Field name="vm_provider_config_id"
              selectedValue={vmProviderFormValues && vmProviderFormValues.vm_provider_config_id ? vmProviderFormValues.vm_provider_config_id : "new_provider"}
              options={optionProviders}
              isUpdateForm={this.props.fromUpdate}
              onOptionChange={this.changeVmProvider}
              required
              component={SelectInput} />
          </FormField>

          <FormField section="providers" label="provider">
            <Field name="vm_provider_name"
              selectedValue={vmProviderFormValues && vmProviderFormValues.vm_provider_name ? vmProviderFormValues.vm_provider_name : ""}
              options={optionsProviders}
              validate={required} required
              isUpdateForm={this.props.fromUpdate}
              component={SelectInput}
            />
          </FormField>
          {vmProviderFormValues && vmProviderFormValues.vm_provider_name === "azure" ?
            <AzureProviderForm
              current_provider={this.state.currentProvider}
              wizard={this.props.wizard}
              submit_api={this.submitApi}
              cancel_button={this.cancelButton}
              stepCount={this.props.stepCount}
            />
            : ""
          }
          {vmProviderFormValues && vmProviderFormValues.vm_provider_name === "aws" ?
            <AwsProviderForm
              current_provider={this.state.currentProvider}
              wizard={this.props.wizard}
              submit_api={this.submitApi}
              cancel_button={this.cancelButton}
              stepCount={this.props.stepCount}
            />
            : ""
          }
          {vmProviderFormValues && vmProviderFormValues.vm_provider_name === "digital_ocean" ?
            <DigitalOceanProviderForm
              current_provider={this.state.currentProvider}
              wizard={this.props.wizard}
              submit_api={this.submitApi}
              cancel_button={this.cancelButton}
              stepCount={this.props.stepCount}
            />
            : ""
          }
          {vmProviderFormValues && vmProviderFormValues.vm_provider_name === "gcp" ?
            <GcpProviderForm
              current_provider={this.state.currentProvider}
              wizard={this.props.wizard}
              submit_api={this.submitApi}
              cancel_button={this.cancelButton}
              stepCount={this.props.stepCount}
            />
            : ""
          }
          {vmProviderFormValues && vmProviderFormValues.vm_provider_name === "oci" ?
            <OciProviderForm
              current_provider={this.state.currentProvider}
              wizard={this.props.wizard}
              submit_api={this.submitApi}
              cancel_button={this.cancelButton}
              stepCount={this.props.stepCount}
            />
            : ""
          }
          {vmProviderFormValues && vmProviderFormValues.vm_provider_name === "vsphere" ?
              <VsphereProviderForm
                  current_provider={this.state.currentProvider}
                  wizard={this.props.wizard}
                  submit_api={this.submitApi}
                  cancel_button={this.cancelButton}
                  stepCount={this.props.stepCount}
              />
              : ""
          }
          {vmProviderFormValues && vmProviderFormValues.vm_provider_name === "openstack" ?
              <OpenStackProviderForm
                  current_provider={this.state.currentProvider}
                  wizard={this.props.wizard}
                  submit_api={this.submitApi}
                  cancel_button={this.cancelButton}
                  stepCount={this.props.stepCount}
              />
              : ""
          }
          {this.props.wizard && (!vmProviderFormValues || !vmProviderFormValues.vm_provider_name) && (
            <FormFooter
              cancelButton={<button className="cancel-button tw-bg-transparent" type="cancel" onClick={this.cancelButton}> {t('buttons.Previous')}</button>}
              saveButton={<Button id="save-autoscale" icon="save" type="submit" section="buttons" name={this.props.stepCount && this.props.stepCount > 2 ? t('buttons.Next') : t('buttons.Finish')} />}
            />
        
          )}

      </React.Fragment>
    );
  }
}

VmProviderConfigFormTemplate.proptypes = {
  createVmProviderConfig: Proptypes.func,
  updateVmProviderConfig: Proptypes.func,
  fromUpdate: Proptypes.bool,
};

let VmProviderConfigFormWithRouter = withRouter(VmProviderConfigFormTemplate);

const selector = formValueSelector('VmProviderConfigForm');

let VmProviderConfigForm = connect(state => {

  const has_categorization_enabled = selector(state, 'enable_categorization');

  return {
    has_categorization_enabled,
    vm_provider_configs: state.vm_provider.vm_provider_configs || [],
    getVmProviderLoading: state.vm_provider.getVmProviderLoading || false,
    license_info: state.footer && state.footer.license_info ? state.footer.license_info : null,
    vmProviderFormValues: state.form && state.form.VmProviderConfigForm && state.form.VmProviderConfigForm.values ? state.form.VmProviderConfigForm.values : null,

  }
},

  dispatch =>
  ({
    getVmProviderConfigs: () => dispatch(getVmProviderConfigs()),
    getLicenseStatus: () => dispatch(getLicenseStatus()),
    createVmProviderConfig: (data) => dispatch(createVmProviderConfig(data)),
    updateVmProviderConfig: (data) => dispatch(updateVmProviderConfig(data)),
  }))(VmProviderConfigFormWithRouter);
  const VmProviderConfigFormTranslated = withTranslation('common')(VmProviderConfigForm)
export default reduxForm({
  form: "VmProviderConfigForm",
})(VmProviderConfigFormTranslated);
