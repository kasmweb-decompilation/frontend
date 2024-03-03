import React, { Component } from "react";
import Proptypes from "prop-types";
import { connect } from "react-redux";
import {
    renderField,
    required,
    renderPass
} from "../../../../utils/formValidations.js";
import { Field, reduxForm, formValueSelector } from "redux-form";
import { withRouter } from "react-router-dom";
import {withTranslation} from "react-i18next";
import { Button, FormFooter, Groups, FormField } from "../../../../components/Form"

class AwsDnsProviderFormTemplate extends Component {

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
                aws_access_key_id: this.props.current_provider.aws_access_key_id,
                aws_secret_access_key: this.props.current_provider.aws_secret_access_key,
            });
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.current_provider && this.props.current_provider !== nextProps.current_provider) {
            this.props.initialize({
                dns_provider_config_name: nextProps.current_provider.dns_provider_config_name,
                dns_provider_name: nextProps.current_provider.dns_provider_name,
                aws_access_key_id: nextProps.current_provider.aws_access_key_id,
                aws_secret_access_key: nextProps.current_provider.aws_secret_access_key,
            });
        }
    }


    cancelButton() {
        this.props.cancel_button(userData)
    }

    submitApi(userData) {
        userData.dns_provider_name = "aws"
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
                        placeholder={t("providers.Example Aws Config")}
                    />
                </FormField>
                <FormField label="Access Key ID">
                    <Field type="text"
                        name="aws_access_key_id"
                        id="aws_access_key_id"
                        component={renderField}
                        validate={required} required
                        placeholder="00000000-0000-0000-0000-000000000000"
                    />
                </FormField>
                <FormField label="Access Key Secret">
                    <Field type="password"
                        name="aws_secret_access_key"
                        id="aws_secret_access_key"
                        component={renderPass}
                        validate={required} required
                    />
                </FormField>
                <FormFooter
                    cancelButton={<button className="cancel-button tw-bg-transparent" type="cancel" onClick={() => this.props.cancel_button()}> {this.props.wizard ? t("buttons.Previous") : t("buttons.Cancel")}</button>}
                    saveButton={<Button id="save-aws-dns" icon="save" type="submit" section="buttons" name={this.props.wizard ? t("buttons.Finish") : t("buttons.Submit")} />}
                />

            </Groups>
        );
    }
}


AwsDnsProviderFormTemplate.propTypes = {
    current_provider: Proptypes.object,
    submit_api: Proptypes.func.isRequired,
    handleSubmit: Proptypes.func,
    cancel_button: Proptypes.func,
};


let AwsDnsProviderFormWithRouter = withRouter(AwsDnsProviderFormTemplate);


const selector = formValueSelector('AwsDnsProviderForm');

let AwsDnsProviderForm = connect(state => {

    return {
        dns_provider_configs: state.dns_provider.dns_provider_configs,
    }
},

    dispatch =>
    ({

    }))(AwsDnsProviderFormWithRouter);
const AwsDnsProviderFormTranslated = withTranslation('common')(AwsDnsProviderForm)
export default reduxForm({
    form: "DnsProviderForm",
})(AwsDnsProviderFormTranslated);
