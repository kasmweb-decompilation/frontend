import React, { Component } from "react";
import Proptypes from "prop-types";
import { connect } from "react-redux";
import { Form, FormGroup, Label, Row, Col } from "reactstrap";
import {
    renderField,
    required,
} from "../../../../utils/formValidations.js";
import { Field, reduxForm } from "redux-form";
import { withRouter } from "react-router-dom";
import {withTranslation} from "react-i18next";
import { Button, FormFooter, Groups, FormField } from "../../../../components/Form/Form.js"

class DigitalOceanDnsProviderFormTemplate extends Component {

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
                digital_ocean_token: this.props.current_provider.digital_ocean_token,
            });
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.current_provider && this.props.current_provider !== nextProps.current_provider) {
            this.props.initialize({
                dns_provider_config_name: nextProps.current_provider.dns_provider_config_name,
                dns_provider_name: nextProps.current_provider.dns_provider_name,
                digital_ocean_token: nextProps.current_provider.digital_ocean_token,
            });
        }
    }


    cancelButton() {
        this.props.cancel_button(userData)
    }

    submitApi(userData) {
        userData.dns_provider_name = "digital_ocean"
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
                        placeholder={t("providers.Example DigitalOcean Config")}
                    />
                </FormField>
                <FormField label="Token">
                    <Field type="text"
                        name="digital_ocean_token"
                        id="digital_ocean_token"
                        component={renderField}
                        validate={required} required
                        placeholder="00000000-0000-0000-0000-000000000000"
                    />
                </FormField>
                <FormFooter
                    cancelButton={<button className="cancel-button tw-bg-transparent" type="cancel" onClick={() => this.props.cancel_button()}> {this.props.wizard ? t("buttons.Previous") : t("buttons.Cancel")}</button>}
                    saveButton={<Button id="save-do-dns" icon="save" type="submit" section="buttons" name={this.props.wizard ? t("buttons.Finish") : t("buttons.Submit")} />}
                />
            </Groups>
        );
    }
}

DigitalOceanDnsProviderFormTemplate.propTypes = {
    current_provider: Proptypes.object,
    submit_api: Proptypes.func.isRequired,
    handleSubmit: Proptypes.func,
    cancel_button: Proptypes.func,
};

let DigitalOceanDnsProviderFormWithRouter = withRouter(DigitalOceanDnsProviderFormTemplate);

let DigitalOceanDnsProviderForm = connect(state => {

    return {
        dns_provider_configs: state.dns_provider.dns_provider_configs,
    }
},

    dispatch =>
    ({

    }))(DigitalOceanDnsProviderFormWithRouter);
    const DigitalOceanDnsProviderFormTranslated = withTranslation('common')(DigitalOceanDnsProviderForm)
export default reduxForm({
    form: "DnsProviderForm",
})(DigitalOceanDnsProviderFormTranslated);
