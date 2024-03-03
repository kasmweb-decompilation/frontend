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

class GcpDnsProviderFormTemplate extends Component {

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
                gcp_project: this.props.current_provider.gcp_project,
                gcp_credentials: JSON.stringify(this.props.current_provider.gcp_credentials, null, 2),
            });
        }
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.current_provider && this.props.current_provider !== nextProps.current_provider) {
            this.props.initialize({
                dns_provider_config_name: nextProps.current_provider.dns_provider_config_name,
                dns_provider_name: nextProps.current_provider.dns_provider_name,
                gcp_project: nextProps.current_provider.gcp_project,
                gcp_credentials: JSON.stringify(nextProps.current_provider.gcp_credentials, null, 2),
            });
        }
    }


    cancelButton() {
        this.props.cancel_button(userData)
    }


    submitApi(userData) {
        userData.dns_provider_name = "gcp"
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
                        placeholder={t("providers.Example Gcp Config")}
                    />
                </FormField>
                <FormField label="Project">
                    <Field type="text"
                        name="gcp_project"
                        id="gcp_project"
                        component={renderField}
                        validate={required} required
                    />
                </FormField>
                <FormField label="Credentials (JSON)">
                    <Field type="text"
                        name="gcp_credentials"
                        id="gcp_credentials"
                        placeholder='{"name":"value"}'
                        component={renderTextArea}
                    />
                </FormField>
                <FormFooter
                    cancelButton={<button className="cancel-button tw-bg-transparent" type="cancel" onClick={() => this.props.cancel_button()}> {this.props.wizard ? t("buttons.Previous") : t("buttons.Cancel")}</button>}
                    saveButton={<Button id="save-gcp-dns" icon="save" type="submit" section="buttons" name={this.props.wizard ? t("buttons.Finish") : t("buttons.Submit")} />}
                />
            </Groups>
        );
    }
}


GcpDnsProviderFormTemplate.propTypes = {
    current_provider: Proptypes.object,
    submit_api: Proptypes.func.isRequired,
    handleSubmit: Proptypes.func,
    cancel_button: Proptypes.func,
};


let GcpDnsProviderFormWithRouter = withRouter(GcpDnsProviderFormTemplate);

let GcpDnsProviderForm = connect(state => {

    return {
        dns_provider_configs: state.dns_provider.dns_provider_configs,
    }
},

    dispatch =>
    ({

    }))(GcpDnsProviderFormWithRouter);
    const GcpDnsProviderFormTranslated = withTranslation('common')(GcpDnsProviderForm)
export default reduxForm({
    form: "DnsProviderForm",
})(GcpDnsProviderFormTranslated);
