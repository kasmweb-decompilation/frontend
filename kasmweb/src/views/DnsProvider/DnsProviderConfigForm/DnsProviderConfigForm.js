import React, { Component } from 'react';
import { connect } from "react-redux";
import { Field, reduxForm, formValueSelector } from "redux-form";
import { required, renderCheckbox } from "../../../utils/formValidations.js";
import { withRouter } from "react-router-dom";
import { FormGroup, Label, Row, Col, CardBody, CardFooter, Alert, Modal, ModalHeader, ModalBody } from "reactstrap";
import Proptypes from "prop-types";
import { NotificationManager } from "react-notifications";
import { getDnsProviderConfigs } from "../../../actions/actionDnsProvider";
import { getLicenseStatus } from "../../../actions/actionFooter.js";
import AzureDnsProviderForm from "../../../components/Providers/Azure/AzureDnsProviderForm";
import AwsDnsProviderForm from "../../../components/Providers/Aws/AwsDnsProviderForm";
import DigitalOceanDnsProviderForm from "../../../components/Providers/DigitalOcean/DigitalOceanDnsProviderForm";
import GcpDnsProviderForm from "../../../components/Providers/Gcp/GcpDnsProviderForm";
import OciDnsProviderForm from "../../../components/Providers/Oci/OciDnsProviderForm";
import SelectInput from "../../../components/SelectInput/SelectInput.js";
import { createDnsProviderConfig, updateDnsProviderConfig } from '../../../actions/actionDnsProvider';
import {withTranslation} from "react-i18next";
import { Button, FormFooter, FormField } from "../../../components/Form/Form.js"

class DnsProviderConfigFormTemplate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentProvider: {},
            collapseAdvanced: false,
            licensed: false,
        };
        this.cancelButton = this.cancelButton.bind(this);
        this.submitApi = this.submitApi.bind(this);
        this.changeDnsProvider = this.changeDnsProvider.bind(this);
        this.initialize = this.initialize.bind(this);
    }


    submitApi() {
        this.props.onSubmit()
    }

    changeDnsProvider(provider) {
        let currentProvider = {
            dns_provider_config_name: null,
            dns_provider_config_id: null,
            dns_provider_name: null

        }
        if (provider === 'new_provider') {

        } else {
            currentProvider = this.props.dns_provider_configs.find(dnsprovider => dnsprovider.dns_provider_config_id === provider)
        }
        this.setState({ currentProvider: currentProvider });
        this.initialize(currentProvider, 'changeDnsProvider')
    }

    initialize(config, from) {
        if(config) {
            this.props.initialize({
                dns_provider_config_name: config.dns_provider_config_name,
                dns_provider_config_id: config.dns_provider_config_id,
                dns_provider_name: config.dns_provider_name
            });
        }
    }

    cancelButton() {
        if (this.props.inline) {
            this.props.cancelProviderModal()
        } else if (this.props.wizard) {
            this.props.previousPage()
        } else {
            this.props.history.push("/dns_provider");
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.dns_provider_configs && nextProps.dns_provider_configs.length > 0 && this.props.dns_provider_configs !== nextProps.dns_provider_configs && this.props.getDnsProviderLoading && this.props.fromUpdate) {
            let currentProvider = nextProps.dns_provider_configs.find(provider => provider.dns_provider_config_id === this.props.DnsProviderConfigId);
            this.setState({ currentProvider: currentProvider });
            this.initialize(currentProvider, 'receiveProps')
        }
        if (nextProps.license_info && nextProps.license_info !== this.props.license_info) {
            this.setState({ licensed: nextProps.license_info.status.features.indexOf('auto_scaling') >= 0 });
        }
    }

    componentDidMount() {
        if (this.props.fromUpdate) {
            this.props.getDnsProviderConfigs();
        }
        const { license_info } = this.props;
        if (license_info && license_info.status && license_info.status.features && license_info.status.features.indexOf('auto_scaling') >= 0) {
            this.setState({ licensed: true });
        }
        if (this.props.autoscale_config && this.props.autoscale_config !== null && this.props.autoscale_config.vm_provider_config_id) {
            let currentProvider = this.props.dns_provider_configs.find(provider => provider.dns_provider_config_id === this.props.autoscale_config.dns_provider_config_id);
            this.setState({ currentProvider: currentProvider });
            this.initialize(currentProvider, 'componentDidMount')
        }

    }

    render() {
        const { handleSubmit, dnsProviderFormValues, dns_provider_configs, t } = this.props;
        const deny_by_default_checked = false

        let optionProviders = [];
        dns_provider_configs.map(opt => {
            optionProviders.push({ label: opt.dns_provider_config_name, value: opt.dns_provider_config_id });
        });
        optionProviders.sort((a, b) => (a.label.toLowerCase() > b.label.toLowerCase()) ? 1 : -1);
        optionProviders.push({ label: t('providers.create-new'), value: 'new_provider' })


        // FIXME correct license
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
            { label: "Oracle Cloud", value: "oci" },
        ];

        return (
            <React.Fragment>
                    <FormField section="providers" label="dns-provider">
                        <Field name="dns_provider_config_id"
                            selectedValue={dnsProviderFormValues && dnsProviderFormValues.dns_provider_config_id ? dnsProviderFormValues.dns_provider_config_id : "new_provider"}
                            options={optionProviders}
                            isUpdateForm={this.props.fromUpdate}
                            onOptionChange={this.changeDnsProvider}
                            required
                            component={SelectInput} />
                    </FormField>

                    <FormField section="providers" label="provider">
                        <Field name="dns_provider_name"
                            selectedValue={dnsProviderFormValues && dnsProviderFormValues.dns_provider_name ? dnsProviderFormValues.dns_provider_name : ""}
                            options={optionsProviders}
                            validate={required} required
                            isUpdateForm={this.props.fromUpdate}
                            component={SelectInput}
                        />
                    </FormField>
                    {dnsProviderFormValues && dnsProviderFormValues.dns_provider_name === "azure" ?
                        <AzureDnsProviderForm
                            current_provider={this.state.currentProvider}
                            wizard={this.props.wizard}
                            submit_api={this.submitApi}
                            cancel_button={this.cancelButton}
                        />
                        : ""
                    }
                    {dnsProviderFormValues && dnsProviderFormValues.dns_provider_name === "aws" ?
                        <AwsDnsProviderForm
                            current_provider={this.state.currentProvider}
                            wizard={this.props.wizard}
                            submit_api={this.submitApi}
                            cancel_button={this.cancelButton}
                        />
                        : ""
                    }
                    {dnsProviderFormValues && dnsProviderFormValues.dns_provider_name === "digital_ocean" ?
                        <DigitalOceanDnsProviderForm
                            current_provider={this.state.currentProvider}
                            wizard={this.props.wizard}
                            submit_api={this.submitApi}
                            cancel_button={this.cancelButton}
                        />
                        : ""
                    }
                    {dnsProviderFormValues && dnsProviderFormValues.dns_provider_name === "gcp" ?
                        <GcpDnsProviderForm
                            current_provider={this.state.currentProvider}
                            wizard={this.props.wizard}
                            submit_api={this.submitApi}
                            cancel_button={this.cancelButton}
                        />
                        : ""
                    }
                    {dnsProviderFormValues && dnsProviderFormValues.dns_provider_name === "oci" ?
                        <OciDnsProviderForm
                            current_provider={this.state.currentProvider}
                            wizard={this.props.wizard}
                            submit_api={this.submitApi}
                            cancel_button={this.cancelButton}
                        />
                        : ""
                    }
                    {this.props.wizard && (!dnsProviderFormValues || !dnsProviderFormValues.dns_provider_name) && (
                        <FormFooter
                            cancelButton={<button className="cancel-button tw-bg-transparent" type="cancel" onClick={this.cancelButton}> {t('buttons.Previous')}</button>}
                            saveButton={<Button id="save-dns-form" icon="save" type="submit" className={"tw-bg-slate-600 tw-opacity-70 tw-text-white/60 "} section="buttons" name={t('buttons.Finish')} />}
                        />
                    )}

            </React.Fragment>
        );
    }
}

DnsProviderConfigFormTemplate.proptypes = {
    createDnsProviderConfig: Proptypes.func,
    updateDnsProviderConfig: Proptypes.func,
    fromUpdate: Proptypes.bool,
};

let DnsProviderConfigFormWithRouter = withRouter(DnsProviderConfigFormTemplate);


const selector = formValueSelector('DnsProviderConfigForm');

let DnsProviderConfigForm = connect(state => {

    const has_categorization_enabled = selector(state, 'enable_categorization');

    return {
        has_categorization_enabled,
        dns_provider_configs: state.dns_provider.dns_provider_configs || [],
        getDnsProviderLoading: state.dns_provider.getDnsProviderLoading || false,
        license_info: state.footer && state.footer.license_info ? state.footer.license_info : null,
        dnsProviderFormValues: state.form && state.form.DnsProviderConfigForm && state.form.DnsProviderConfigForm.values ? state.form.DnsProviderConfigForm.values : null,

    }
},

    dispatch =>
    ({
        getDnsProviderConfigs: () => dispatch(getDnsProviderConfigs()),
        getLicenseStatus: () => dispatch(getLicenseStatus()),
        createDnsProviderConfig: (data) => dispatch(createDnsProviderConfig(data)),
        updateDnsProviderConfig: (data) => dispatch(updateDnsProviderConfig(data)),

    }))(DnsProviderConfigFormWithRouter);
    const DnsProviderConfigFormTranslated = withTranslation('common')(DnsProviderConfigForm)
export default reduxForm({
    form: "DnsProviderConfigForm",
})(DnsProviderConfigFormTranslated);
