import React, { Component } from "react";
import Proptypes from "prop-types";
import { connect } from "react-redux";
import { Form, FormGroup, Label, Row, Col } from "reactstrap";
import {
    renderField,
    required,
    renderTextArea,
} from "../../../../utils/formValidations.js";
import { Field, reduxForm } from "redux-form";
import { withRouter } from "react-router-dom";
import {withTranslation} from "react-i18next";
import { Button, FormFooter, Groups, FormField } from "../../../../components/Form"

class OciDnsProviderFormTemplate extends Component {

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
                dns_provider_config_name: this.props.current_provider.dns_provider_config_name,
                dns_provider_name: this.props.current_provider.dns_provider_name,
                oci_fingerprint: this.props.current_provider.oci_fingerprint,
                oci_tenancy_ocid: this.props.current_provider.oci_tenancy_ocid,
                oci_region: this.props.current_provider.oci_region,
                oci_compartment_ocid: this.props.current_provider.oci_compartment_ocid,
                oci_user_ocid: this.props.current_provider.oci_user_ocid,
                oci_private_key: this.props.current_provider.oci_private_key,
            });
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.current_provider && this.props.current_provider !== nextProps.current_provider) {
            this.props.initialize({
                dns_provider_config_name: nextProps.current_provider.dns_provider_config_name,
                dns_provider_name: nextProps.current_provider.dns_provider_name,
                oci_fingerprint: nextProps.current_provider.oci_fingerprint,
                oci_tenancy_ocid: nextProps.current_provider.oci_tenancy_ocid,
                oci_region: nextProps.current_provider.oci_region,
                oci_compartment_ocid: nextProps.current_provider.oci_compartment_ocid,
                oci_user_ocid: nextProps.current_provider.oci_user_ocid,
                oci_private_key: nextProps.current_provider.oci_private_key,
            });
        }
    }


    cancelButton() {
        this.props.cancel_button(userData)
    }


    submitApi(userData) {
        userData.dns_provider_name = "oci"
        this.props.submit_api(userData)

    }

    render() {
        const { handleSubmit, t } = this.props;

        return (
            <Groups noPadding section="providers" onSubmit={handleSubmit(this.submitApi)}>
                <FormField label="Name">
                    <Field type="text"
                        name="dns_provider_config_name"
                        id="dns_provider_config_name"
                        component={renderField}
                        validate={required} required
                        placeholder={t("providers.Example Oci Config")}
                    />
                </FormField>
                <FormField label="Fingerprint">
                    <Field type="text"
                        name="oci_fingerprint"
                        id="oci_fingerprint"
                        component={renderField}
                        validate={required} required
                        placeholder="00:00:00:00:00:00:00:00:00:00:00:00:00:00:00:00"
                    />
                </FormField>
                <FormField label="Tenancy OCID">
                    <Field type="text"
                        name="oci_tenancy_ocid"
                        id="oci_tenancy_ocid"
                        component={renderField}
                        validate={required} required
                    />
                </FormField>
                <FormField label="Region">
                    <Field type="text"
                        name="oci_region"
                        id="oci_region"
                        component={renderField}
                        validate={required} required
                        placeholder="us-ashburn-2"
                    />
                </FormField>

                <FormField label="Compartment OCID">
                    <Field type="text"
                        name="oci_compartment_ocid"
                        id="oci_compartment_ocid"
                        component={renderField}
                        validate={required} required
                    />
                </FormField>
                <FormField label="User OCID">
                    <Field type="text"
                        name="oci_user_ocid"
                        id="oci_user_ocid"
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
                <FormFooter
                    cancelButton={<button className="cancel-button tw-bg-transparent" type="cancel" onClick={() => this.props.cancel_button()}> {this.props.wizard ? t("buttons.Previous") : t("buttons.Cancel")}</button>}
                    saveButton={<Button id="save-oci-dns" icon="save" type="submit" section="buttons" name={this.props.wizard ? t("buttons.Finish") : t("buttons.Submit")} />}
                />
            </Groups>
        );
    }
}


OciDnsProviderFormTemplate.propTypes = {
    current_provider: Proptypes.object,
    submit_api: Proptypes.func.isRequired,
    handleSubmit: Proptypes.func,
    cancel_button: Proptypes.func,
};


let OciDnsProviderFormWithRouter = withRouter(OciDnsProviderFormTemplate);

let OciDnsProviderForm = connect(state => {

    return {
        dns_provider_configs: state.dns_provider.dns_provider_configs,
    }
},

    dispatch =>
    ({

    }))(OciDnsProviderFormWithRouter);
    const OciDnsProviderFormTranslated = withTranslation('common')(OciDnsProviderForm)
export default reduxForm({
    form: "DnsProviderForm",
})(OciDnsProviderFormTranslated);
