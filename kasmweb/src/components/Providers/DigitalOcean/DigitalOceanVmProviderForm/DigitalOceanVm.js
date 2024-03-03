import React, { Component } from "react";
import Proptypes from "prop-types";
import { connect } from "react-redux";
import { Form, FormGroup, Label, Row, Col } from "reactstrap";
import {
  renderField,
  required,
  renderTextArea,
  number,
  renderPass,
} from "../../../../utils/formValidations.js";
import { Field, reduxForm } from "redux-form";
import { withRouter } from "react-router-dom";
import {withTranslation} from "react-i18next";
import { Button, FormFooter, Groups, FormField } from "../../../../components/Form"

class DigitalOceanProviderFormTemplate extends Component {

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
        digital_ocean_token: this.props.current_provider.digital_ocean_token,
        max_instances: this.props.current_provider.max_instances,
        region: this.props.current_provider.region,
        digital_ocean_droplet_image: this.props.current_provider.digital_ocean_droplet_image,
        digital_ocean_droplet_size: this.props.current_provider.digital_ocean_droplet_size,
        digital_ocean_tags: this.props.current_provider.digital_ocean_tags,
        digital_ocean_sshkey_name: this.props.current_provider.digital_ocean_sshkey_name,
        digital_ocean_firewall_name: this.props.current_provider.digital_ocean_firewall_name,
        startup_script: this.props.current_provider.startup_script,
      });
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.current_provider && this.props.current_provider !== nextProps.current_provider) {
      this.props.initialize({
        vm_provider_config_name: nextProps.current_provider.vm_provider_config_name,
        vm_provider_name: nextProps.current_provider.vm_provider_name,
        digital_ocean_token: nextProps.current_provider.digital_ocean_token,
        max_instances: nextProps.current_provider.max_instances,
        region: nextProps.current_provider.region,
        digital_ocean_droplet_image: nextProps.current_provider.digital_ocean_droplet_image,
        digital_ocean_droplet_size: nextProps.current_provider.digital_ocean_droplet_size,
        digital_ocean_tags: nextProps.current_provider.digital_ocean_tags,
        digital_ocean_sshkey_name: nextProps.current_provider.digital_ocean_sshkey_name,
        digital_ocean_firewall_name: nextProps.current_provider.digital_ocean_firewall_name,
        startup_script: nextProps.current_provider.startup_script,
      });
    }
  }

  cancelButton() {
    this.props.cancel_button(userData)
  }

  submitApi(userData) {
    userData.vm_provider_name = "digital_ocean"
    this.props.submit_api(userData)
  }

  render() {
    const { handleSubmit, t } = this.props;
    const { currentProvider } = this.state;
    return (
      <Groups noPadding section="providers" onSubmit={handleSubmit(this.submitApi)}>
        <FormField label="Name">
          <Field type="text"
            name="vm_provider_config_name"
            id="vm_provider_config_name"
            component={renderField}
            validate={required} required
            placeholder={t("providers.Example DigitalOcean Config")}
          />
        </FormField>

        <FormField label="Token">
          <Field type="password"
            name="digital_ocean_token"
            id="digital_ocean_token"
            component={renderPass}
            validate={required} required
          />
        </FormField>
        <FormField label="Max Droplets">
          <Field type="number"
            name="max_instances"
            id="max_instances"
            component={renderField}
            validate={number} required
          />
        </FormField>
        <FormField label="Region">
          <Field type="text"
            name="region"
            id="region"
            component={renderField}
            validate={required} required
          />
        </FormField>
        <FormField label="Image">
          <Field type="text"
            name="digital_ocean_droplet_image"
            id="digital_ocean_droplet_image"
            component={renderField}
            validate={required} required
          />
        </FormField>
        <FormField label="Droplet Size">
          <Field type="text"
            name="digital_ocean_droplet_size"
            id="digital_ocean_droplet_size"
            component={renderField}
            validate={required} required
          />
        </FormField>
        <FormField label="Tags">
          <Field type="textarea"
            name="digital_ocean_tags"
            id="digital_ocean_tags"
            component={renderTextArea}
            placeholder='tag1, tag2'
          />
        </FormField>
        <FormField label="SSH Key Name">
          <Field type="text"
            name="digital_ocean_sshkey_name"
            id="digital_ocean_sshkey_name"
            component={renderField}
            validate={required} required
          />
        </FormField>
        <FormField label="Firewall Name">
          <Field type="text"
            name="digital_ocean_firewall_name"
            id="digital_ocean_firewall_name"
            component={renderField}
            validate={required} required
          />
        </FormField>
        <FormField label="Startup Script">
          <Field type="text"
            name="startup_script"
            id="startup_script"
            component={renderTextArea}
            validate={required} required
          />
        </FormField>
        <FormFooter
          cancelButton={<button className="cancel-button tw-bg-transparent" type="cancel" onClick={() => this.props.cancel_button()}> {this.props.wizard ? t("buttons.Previous") : t("buttons.Cancel")}</button>}
          saveButton={<Button id="save-do-vm" icon="save" type="submit" section="buttons" name={!this.props.wizard ? 'Submit' : this.props.stepCount && this.props.stepCount > 2 ? t("buttons.Next") : t("buttons.Finish")} />}
        />
      </Groups>
    );
  }
}


DigitalOceanProviderFormTemplate.propTypes = {
  current_provider: Proptypes.object,
  submit_api: Proptypes.func.isRequired,
  handleSubmit: Proptypes.func,
  cancel_button: Proptypes.func,
};


let DigitalOceanProviderFormWithRouter = withRouter(DigitalOceanProviderFormTemplate);

let DigitalOceanProviderForm = connect(state => {

  return {
    vm_provider_configs: state.vm_provider.vm_provider_configs,
  }
},

  dispatch =>
  ({

  }))(DigitalOceanProviderFormWithRouter);
const DigitalOceanProviderFormTranslated = withTranslation('common')(DigitalOceanProviderForm)
export default reduxForm({
  form: "VmProviderForm",
})(DigitalOceanProviderFormTranslated);
