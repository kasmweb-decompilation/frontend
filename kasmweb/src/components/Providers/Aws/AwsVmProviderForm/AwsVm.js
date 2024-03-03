import React, { Component } from "react";
import Proptypes from "prop-types";
import { connect } from "react-redux";
import { Button as RSButton, Label, Row, Col } from "reactstrap";
import {
  renderField,
  required,
  renderTextArea,
  number,
  renderPass,
  json, renderToggle
} from "../../../../utils/formValidations.js";
import { Field, reduxForm } from "redux-form";
import { withRouter } from "react-router-dom";
import TooltipComponent from "../../../../views/Settings/TooltipComponent";
import {withTranslation} from "react-i18next";
import { Button, FormFooter, Groups, FormField } from "../../../../components/Form"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/pro-light-svg-icons/faDownload";
import { faUpload } from "@fortawesome/pro-light-svg-icons/faUpload";


class AwsProviderFormTemplate extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentProvider: {},
      uploadKeyPair: false,
    };
    this.submitApi = this.submitApi.bind(this);
    this.cancelButton = this.cancelButton.bind(this);
  }


  componentDidMount() {
    if (this.props.current_provider) {
      this.props.initialize({
        vm_provider_config_name: this.props.current_provider.vm_provider_config_name,
        vm_provider_name: this.props.current_provider.vm_provider_name,
        aws_ec2_instance_type: this.props.current_provider.aws_ec2_instance_type,
        aws_region: this.props.current_provider.aws_region,
        aws_access_key_id: this.props.current_provider.aws_access_key_id,
        aws_secret_access_key: this.props.current_provider.aws_secret_access_key,
        aws_ec2_ami_id: this.props.current_provider.aws_ec2_ami_id,
        max_instances: this.props.current_provider.max_instances,
        aws_ec2_security_group_ids: JSON.stringify(this.props.current_provider.aws_ec2_security_group_ids, null, 2),
        aws_ec2_subnet_id: this.props.current_provider.aws_ec2_subnet_id,
        startup_script: this.props.current_provider.startup_script,
        aws_ec2_iam: this.props.current_provider.aws_ec2_iam,
        aws_ec2_ebs_volume_type: this.props.current_provider.aws_ec2_ebs_volume_type,
        aws_ec2_ebs_volume_size_gb: this.props.current_provider.aws_ec2_ebs_volume_size_gb,
        aws_ec2_custom_tags: JSON.stringify(this.props.current_provider.aws_ec2_custom_tags, null, 2),
        aws_ec2_private_key: this.props.current_provider.aws_ec2_private_key,
        aws_ec2_public_key: this.props.current_provider.aws_ec2_public_key,
        aws_ec2_passphrase: this.props.current_provider.aws_ec2_passphrase,
        retrieve_password: this.props.current_provider.retrieve_password,
        aws_ec2_config_override: JSON.stringify(this.props.current_provider.aws_ec2_config_override, null, 2),
      });
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.current_provider && this.props.current_provider !== nextProps.current_provider) {
      this.props.initialize({
        vm_provider_config_name: nextProps.current_provider.vm_provider_config_name,
        vm_provider_name: nextProps.current_provider.vm_provider_name,
        aws_ec2_instance_type: nextProps.current_provider.aws_ec2_instance_type,
        aws_region: nextProps.current_provider.aws_region,
        aws_access_key_id: nextProps.current_provider.aws_access_key_id,
        aws_secret_access_key: nextProps.current_provider.aws_secret_access_key,
        aws_ec2_ami_id: nextProps.current_provider.aws_ec2_ami_id,
        max_instances: nextProps.current_provider.max_instances,
        aws_ec2_security_group_ids: JSON.stringify(nextProps.current_provider.aws_ec2_security_group_ids, null, 2),
        aws_ec2_subnet_id: nextProps.current_provider.aws_ec2_subnet_id,
        startup_script: nextProps.current_provider.startup_script,
        aws_ec2_iam: nextProps.current_provider.aws_ec2_iam,
        aws_ec2_ebs_volume_type: nextProps.current_provider.aws_ec2_ebs_volume_type,
        aws_ec2_ebs_volume_size_gb: nextProps.current_provider.aws_ec2_ebs_volume_size_gb,
        aws_ec2_custom_tags: JSON.stringify(nextProps.current_provider.aws_ec2_custom_tags, null, 2),
        aws_ec2_private_key: nextProps.current_provider.aws_ec2_private_key,
        aws_ec2_public_key: nextProps.current_provider.aws_ec2_public_key,
        aws_ec2_passphrase: nextProps.current_provider.aws_ec2_passphrase,
        retrieve_password: nextProps.current_provider.retrieve_password,
        aws_ec2_config_override: JSON.stringify(nextProps.current_provider.aws_ec2_config_override, null, 2),
      });
    }
  }

  downloadBlob() {
    let jsonBlob = new Blob([this.state.aws_ec2_public_key]);
    const blobUrl = URL.createObjectURL(jsonBlob);

    const link = document.createElement("a");

    link.href = blobUrl;
    link.download = 'id_rsa.pub';

    document.body.appendChild(link);

    link.dispatchEvent(
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
      })
    );
    document.body.removeChild(link);
  };


  cancelButton() {
    this.props.cancel_button(userData)
  }

  submitApi(userData) {
    userData.vm_provider_name = "aws"
    this.props.submit_api(userData)
  }

  render() {
    const { handleSubmit, t } = this.props;
    const { currentZone } = this.state;

    return (
      <Groups noPadding section="providers" onSubmit={handleSubmit(this.submitApi)}>
        <FormField label="Name">
          <Field type="text"
            name="vm_provider_config_name"
            id="vm_provider_config_name"
            component={renderField}
            validate={required} required
            placeholder={t("providers.Example AWS Config")}
          />
        </FormField>

        <FormField label="AWS Access Key Id">
          <Field type="text"
            name="aws_access_key_id"
            id="aws_access_key_id"
            component={renderField}
            validate={required} required
          />
        </FormField>
        <FormField label="AWS Secret Access Key">
          <Field type="password"
            name="aws_secret_access_key"
            id="aws_secret_access_key"
            component={renderPass}
            validate={required} required
          />
        </FormField>
        <FormField label="AWS Region">
          <Field type="text"
            name="aws_region"
            id="aws_region"
            component={renderField}
            validate={required} required
            placeholder="us-east-1"
          />
        </FormField>
        <FormField label="AWS EC2 AMI Id">
          <Field type="text"
            name="aws_ec2_ami_id"
            id="aws_ec2_ami_id"
            component={renderField}
            validate={required} required
          />
        </FormField>
        <FormField label="AWS EC2 Instance Type">
          <Field
            name="aws_ec2_instance_type"
            id="aws_ec2_instance_type"
            component={renderField}
            validate={required} required
            autoComplete='random-string'
            placeholder="t3.micro"
          />
        </FormField>
        <FormField label="AWS Max EC2 Nodes">
          <Field name="max_instances"
            id="max_instances"
            component={renderField}
            validate={number} required
          />
        </FormField>
        <FormField label="AWS EC2 Security Group IDs (JSON)">
          <Field type="textarea"
            name="aws_ec2_security_group_ids"
            id="aws_ec2_security_group_ids"
            component={renderTextArea}
            validate={[required, json]} required
            placeholder='["sg-xyx", "sg-123"]'
          />
        </FormField>
        <FormField label="AWS EC2 Subnet ID">
          <Field type="text"
            name="aws_ec2_subnet_id"
            id="aws_ec2_subnet_id"
            component={renderField}
            validate={required} required
          />
        </FormField>
        <FormField label="AWS EC2 EBS Volume Size (GB)">
          <Field type="number"
            name="aws_ec2_ebs_volume_size_gb"
            id="aws_ec2_ebs_volume_size_gb"
            component={renderField}
            validate={number} required
          />
        </FormField>
        <FormField label="AWS EC2 EBS Volume Type">
          <Field type="text"
            name="aws_ec2_ebs_volume_type"
            id="aws_ec2_ebs_volume_type"
            component={renderField}
            validate={required} required
          />
        </FormField>
        <FormField label="AWS EC2 IAM">
          <Field type="text"
            name="aws_ec2_iam"
            id="aws_ec2_iam"
            component={renderField}
            validate={required} required
          />
        </FormField>
        <FormField label="AWS EC2 Custom Tags (JSON)">
          <Field type="text"
            name="aws_ec2_custom_tags"
            id="aws_ec2_custom_tags"
            component={renderTextArea}
            validate={[required, json]} required
            placeholder="{}"

          />
        </FormField>
        <FormField label="AWS EC2 Startup Script">
          <Field type="textarea"
            name="startup_script"
            id="startup_script"
            component={renderTextArea}
            validate={required} required
          />
        </FormField>
        <FormField label="AWS Config Override (JSON)">
          <Field type="text"
            name="aws_ec2_config_override"
            id="aws_ec2_config_override"
            placeholder='{"instance_config": {}}'
            validate={[required, json]} required
            component={renderTextArea}
          />
        </FormField>
        <FormField label="Retrieve Windows VM Password from AWS">
          <Field type="checkbox"
            name="retrieve_password"
            id="retrieve_password"
            checked={this.props.retrieve_password && this.props.current_provider.retrieve_password}
            component={renderToggle}
          />
        </FormField>


        <Row>
          <Col>
            <Label htmlFor="startup_script" className="requiredasterisk whitespacePre">{t("providers.SSH Keys")}</Label>
          </Col>
        </Row>
        <Row>
          <Col>
            {this.state.aws_ec2_public_key && (
              <div style={{ marginTop: '15px' }}>
                <TooltipComponent
                  description={t("providers.ssh_public_tooltip")}
                  name={(
                    <RSButton className="btn-width download-btn" size="md" color="success" onClick={this.downloadBlob}>
                      <FontAwesomeIcon icon={faDownload} className="tw-mr-1" aria-hidden="true" />{t("providers.Download Public Key")}
                    </RSButton>
                  )}
                />
              </div>

            )}
            <div style={{ marginTop: '15px' }}>
              <TooltipComponent
                description={t("providers.ssh_keypair_tooltip")}
                name={(
                  <RSButton className="btn-width download-btn" size="md" color="success" onClick={() => this.setState({ uploadKeyPair: !this.state.uploadKeyPair })}>
                    <FontAwesomeIcon icon={faUpload} className="tw-mr-1" aria-hidden="true" />{t("providers.Upload New Key Pair")}
                  </RSButton>
                )}
              />
            </div>
          </Col>
        </Row>

        {this.state.uploadKeyPair && (
          <React.Fragment>
            <p style={{ marginTop: '15px' }}>{t("providers.keypair_text")}</p>
            <FormField label="formats">
              <Field type="textarea"
                name="aws_ec2_private_key"
                id="aws_ec2_private_key"
                component={renderTextArea}
                validate={required} required
                placeholder="-----BEGIN RSA PRIVATE KEY-----&#10;...&#10;-----END RSA PRIVATE KEY-----"
              />
            </FormField>
            <FormField label="SSH Private Key Passphrase">
              <Field
                id="aws_ec2_passphrase"
                type="text"
                name="aws_ec2_passphrase"
                component={renderField}
              />
            </FormField>
          </React.Fragment>
        )}


        <FormFooter
          cancelButton={<button className="cancel-button tw-bg-transparent" type="cancel" onClick={() => this.props.cancel_button()}> {this.props.wizard ? t("buttons.Previous") : t("buttons.Cancel")}</button>}
          saveButton={<Button id="save-aws-vm" icon="save" type="submit" section="buttons" name={!this.props.wizard ? 'Submit' : this.props.stepCount && this.props.stepCount > 2 ? t("buttons.Next") : t("buttons.Finish")} />}
        />

      </Groups>
    );
  }
}


AwsProviderFormTemplate.propTypes = {
  current_provider: Proptypes.object,
  submit_api: Proptypes.func.isRequired,
  handleSubmit: Proptypes.func,
  cancel_button: Proptypes.func,
};


let AwsProviderFormWithRouter = withRouter(AwsProviderFormTemplate);

let AwsProviderForm = connect(state => {

  return {
    vm_provider_configs: state.vm_provider.vm_provider_configs,
  }
},

  dispatch =>
  ({

  }))(AwsProviderFormWithRouter);
const AwsProviderFormTranslated = withTranslation('common')(AwsProviderForm)
export default reduxForm({
  form: "VmProviderForm",
})(AwsProviderFormTranslated);
