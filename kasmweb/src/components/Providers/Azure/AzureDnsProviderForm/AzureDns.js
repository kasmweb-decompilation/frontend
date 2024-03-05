import React, { Component } from "react";
import Proptypes from "prop-types";
import { connect } from "react-redux";
import {
    renderField,
    renderSelectField,
    required,
    renderPass
} from "../../../../utils/formValidations.js";
import { Field, reduxForm } from "redux-form";
import { withRouter } from "react-router-dom";
import {withTranslation} from "react-i18next";
import { Button, FormFooter, Groups, FormField } from "../../../../components/Form/Form.js"

class AzureDnsProviderFormTemplate extends Component {

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
                azure_subscription_id: this.props.current_provider.azure_subscription_id,
                azure_resource_group: this.props.current_provider.azure_resource_group,
                azure_tenant_id: this.props.current_provider.azure_tenant_id,
                azure_client_id: this.props.current_provider.azure_client_id,
                azure_client_secret: this.props.current_provider.azure_client_secret,
                azure_region: this.props.current_provider.azure_region,
                azure_authority: this.props.current_provider.azure_authority,
            });
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.current_provider && this.props.current_provider !== nextProps.current_provider) {
            this.props.initialize({
                dns_provider_config_name: nextProps.current_provider.dns_provider_config_name,
                dns_provider_name: nextProps.current_provider.dns_provider_name,
                azure_subscription_id: nextProps.current_provider.azure_subscription_id,
                azure_resource_group: nextProps.current_provider.azure_resource_group,
                azure_tenant_id: nextProps.current_provider.azure_tenant_id,
                azure_client_id: nextProps.current_provider.azure_client_id,
                azure_client_secret: nextProps.current_provider.azure_client_secret,
                azure_region: nextProps.current_provider.azure_region,
                azure_authority: nextProps.current_provider.azure_authority,
            });
        }
    }


    cancelButton() {
        this.props.cancel_button(userData)
    }

    submitApi(userData) {
        userData.dns_provider_name = "azure"
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
                        placeholder={t("providers.Example Azure Config")}
                    />
                </FormField>
                <FormField label="Subscription ID">
                    <Field type="text"
                        name="azure_subscription_id"
                        id="azure_subscription_id"
                        component={renderField}
                        validate={required} required
                        placeholder="00000000-0000-0000-0000-000000000000"
                    />
                </FormField>
                <FormField label="Resource Group">
                    <Field type="text"
                        name="azure_resource_group"
                        id="azure_resource_group"
                        component={renderField}
                        validate={required} required
                        placeholder="development"
                    />
                </FormField>
                <FormField label="Tenant ID">
                    <Field type="text"
                        name="azure_tenant_id"
                        id="azure_tenant_id"
                        component={renderField}
                        validate={required} required
                        placeholder="00000000-0000-0000-0000-000000000000"
                    />
                </FormField>
                <FormField label="Client ID">
                    <Field type="text"
                        name="azure_client_id"
                        id="azure_client_id"
                        component={renderField}
                        validate={required} required
                        placeholder="00000000-0000-0000-0000-000000000000"
                    />
                </FormField>
                <FormField label="Client Secret">
                    <Field type="password"
                        name="azure_client_secret"
                        id="azure_client_secret"
                        component={renderPass}
                        validate={required} required
                    />
                </FormField>
                <FormField label="Azure Authority">
                    <Field type="text"
                        name="azure_authority"
                        id="azure_authority"
                        component={renderSelectField}
                        validate={required} required>
                        <option>{t("providers.Select")}</option>
                        <option value="AZURE_PUBLIC_CLOUD">{t("providers.Azure Public Cloud")}</option>
                        <option value="AZURE_GOVERNMENT">{t("providers.Azure Government")}</option>
                        <option value="AZURE_CHINA">{t("providers.Azure China")}</option>
                        <option value="AZURE_GERMANY">{t("providers.Azure Germany")}</option>
                    </Field>
                </FormField>
                <FormField label="Region">
                    <Field type="text"
                        name="azure_region"
                        id="azure_region"
                        component={renderField}
                        validate={required} required
                        placeholder="eastus"
                    />
                </FormField>
                <FormFooter
                    cancelButton={<button className="cancel-button tw-bg-transparent" type="cancel" onClick={() => this.props.cancel_button()}> {this.props.wizard ? t("buttons.Previous") : t("buttons.Cancel")}</button>}
                    saveButton={<Button id="save-azure-dns" icon="save" type="submit" section="buttons" name={this.props.wizard ? t("buttons.Finish") : t("buttons.Submit")} />}
                />
            </Groups>
        );
    }
}


AzureDnsProviderFormTemplate.propTypes = {
    current_provider: Proptypes.object,
    submit_api: Proptypes.func.isRequired,
    handleSubmit: Proptypes.func,
    cancel_button: Proptypes.func,
};


let AzureDnsProviderFormWithRouter = withRouter(AzureDnsProviderFormTemplate);

let AzureDnsProviderForm = connect(state => {

    return {
        dns_provider_configs: state.dns_provider.dns_provider_configs,
    }
},

    dispatch =>
    ({

    }))(AzureDnsProviderFormWithRouter);
const AzureDnsProviderFormTranslated = withTranslation('common')(AzureDnsProviderForm)
export default reduxForm({
    form: "DnsProviderForm",
})(AzureDnsProviderFormTranslated);
