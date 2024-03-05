import React, {Component} from 'react';
import { connect } from "react-redux";
import { Field, reduxForm, formValueSelector } from "redux-form";
import { renderField, required, renderToggle, renderTextArea} from "../../../utils/formValidations.js";
import { withRouter } from "react-router-dom";
import { Alert } from "reactstrap";
import Proptypes from "prop-types";
import {getOidcConfigs } from "../../../actions/actionOidc";
import { getLicenseStatus} from "../../../actions/actionFooter.js";
import {withTranslation} from "react-i18next";
import { Groups, Group, FormFooter, FormField, ViewField } from "../../../components/Form/Form.js"

class OidcConfigFormTemplate extends Component {
    constructor (props){
        super(props);
        this.state = {
            currentOidc: {},
            collapseAdvanced: false,
            urlField: "",
            licensed: false,
            redirect_url: "https://" + window.location.host + "/api/oidc_callback",
        };
        this.submitApi = this.submitApi.bind(this);
        this.handleUrlChange = this.handleUrlChange.bind(this);
        this.toggleAdvanced = this.toggleAdvanced.bind(this);
    }

    toggleAdvanced() {
        this.setState({collapseAdvanced: !this.state.collapseAdvanced})
    }

    submitApi(userData) {
        userData.redirect_url = this.state.redirect_url;
        if (this.props.fromUpdate) {
            userData.oidc_config_id = this.state.currentOidc && this.state.currentOidc.oidc_config_id;
            this.props.updateOidcConfig(userData)
                .then(() => this.handleUpdateSuccess())
                .catch(() => this.handleUpdateError());
        }else {
            this.props.createOidcConfig(userData)
                .then(() => this.handleCreateSuccess())
                .catch(() => this.handleCreateError());
        }
    }

    handleUrlChange(e) {
        this.setState({urlField: e.target.value});
    }

    cancelButton(){
        this.props.history.push("/oidc");
    }

    UNSAFE_componentWillReceiveProps(nextProps){
        if(nextProps.oidc_configs && nextProps.oidc_configs.length > 0 && this.props.oidc_configs !== nextProps.oidc_configs && this.props.getOidcLoading && this.props.fromUpdate){
            let currentOidc = nextProps.oidc_configs.find(oidc => oidc.oidc_id === this.props.oidcConfigId);
            this.setState({currentOidc: currentOidc, urlField : currentOidc && currentOidc.key ? currentOidc.key : ''});
            this.props.initialize({
                auth_url: currentOidc.auth_url,
                auto_login: currentOidc.auto_login,
                scope: currentOidc.scope ? currentOidc.scope.join('\n') : '',
                client_id: currentOidc.client_id,
                client_secret: currentOidc.client_secret,
                display_name: currentOidc.display_name,
                enabled: currentOidc.enabled,
                hostname: currentOidc.hostname,
                is_default: currentOidc.is_default,
                oidc_id: currentOidc.oidc_id,
                redirect_url: currentOidc.redirect_url,
                token_url: currentOidc.token_url,
                user_info_url: currentOidc.user_info_url,
                logo_url: currentOidc.logo_url,
                username_attribute: currentOidc.username_attribute,
                groups_attribute: currentOidc.groups_attribute,
                debug: currentOidc.debug,
            });
        }
    }

    componentDidMount() {
        if (this.props.fromUpdate) {
            this.props.getOidcConfigs();
        }
        this.props.getLicenseStatus()
            .then(() => {
                const {license_info} = this.props;
                if (license_info && license_info.status && license_info.status.features && license_info.status.features.indexOf('saml') >= 0 ){
                    this.setState({licensed: true});
                }
            });

    }

    render() {
        const {handleSubmit, t} = this.props;
        const {redirect_url } = this.state;

         if (!this.state.licensed){
            let license_url = `${__LICENSE_INFO_URL__}`;
            return (
                <Alert color="none" isOpen={true}>
                    <h4>{t('licensing.unavailable')}</h4>
                    {t('licensing.this-feature-must-be-licensed')}
                    <hr />
                    <a href={license_url}>{t('licensing.more-information')}</a><br/>
                </Alert>
            )
        }

        return (
            <Groups onSubmit={handleSubmit(this.props.save)} section={this.props.section}>
                <Group title="oidc-details" description="oidc-details-description">
                    <Field type="text"
                        name="display_name"
                        id="display_name"
                        component={renderField}
                        validate={required} required
                    />
                    <Field type="text"
                        name="logo_url"
                        id="logo_url"
                        component={renderField}
                    />
                    <Field type="checkbox"
                        name="enabled"
                        id="enabled"
                        component={renderToggle}
                    />
                    <Field type="checkbox"
                        name="auto_login"
                        id="auto_login"
                        component={renderToggle}
                    />
                    <Field type="text"
                        name="hostname"
                        id="hostname"
                        component={renderField}
                    />
                    <FormField label="default">
                        <Field type="checkbox"
                            name="is_default"
                            id="is_default"
                            component={renderToggle}
                        />
                    </FormField>
                    <Field type="text"
                        name="client_id"
                        id="client_id"
                        component={renderField}
                        validate={required} required
                    />
                    <Field type="password"
                        name="client_secret"
                        id="client_secret"
                        component={renderField}
                        validate={required} required
                    />
                    <FormField label="authorization-url">
                        <Field type="text"
                            name="auth_url"
                            id="auth_url"
                            component={renderField}
                            validate={required} required
                        />
                    </FormField>
                    <Field type="text"
                        name="token_url"
                        id="token_url"
                        component={renderField}
                        validate={required} required
                    />
                    <Field type="text"
                        name="user_info_url"
                        id="user_info_url"
                        component={renderField}
                        validate={required} required
                    />
                    <FormField label="scope-one-per-line">
                        <Field type="textarea"
                            name="scope"
                            id="scope"
                            component={renderTextArea}
                            validate={required} required
                        />
                    </FormField>
                    <Field type="text"
                        name="username_attribute"
                        id="username_attribute"
                        component={renderField}
                        validate={required} required
                    />

                    <Field type="text"
                        name="groups_attribute"
                        id="groups_attribute"
                        component={renderField}
                    />

                    <Field type="checkbox"
                        name="debug"
                        id="debug"
                        component={renderToggle}
                    />
                    <ViewField type="text"
                        name="redirect_url"
                        value={redirect_url}
                        component={renderField}
                    />

                </Group>
                <FormFooter cancel={() => this.props.history.push("/oidc")} />
            </Groups>
        );
    }
}

OidcConfigFormTemplate.proptypes = {
    createOidcConfig: Proptypes.func,
    updateOidcConfig: Proptypes.func,
    fromUpdate: Proptypes.bool,
};

let OidcConfigFormWithRouter = withRouter(OidcConfigFormTemplate);


const selector = formValueSelector('OidcConfigForm');

let OidcConfigForm =  connect(state =>{

            const has_allow_anonymous = selector(state, 'allow_anonymous');
            const has_limit_sessions = selector(state, 'limit_sessions');
            const has_limit_ips = selector(state, 'limit_ips');

            return {
                has_allow_anonymous,
                has_limit_sessions,
                has_limit_ips,
                createOidcError: state.oidc.createOidcError,
                createOidcLoading: state.oidc.createOidcLoading,
                createdOidc: state.oidc.createdOidc,
                updateOidcError: state.oidc.updateOidcError,
                updateOidcLoading: state.oidc.updateOidcLoading,
                updatedOidc: state.oidc.updatedOidc,
                oidc_configs: state.oidc.oidc_configs,
                getOidcLoading: state.oidc.getOidcLoading || false,
                oidcFormValues: state.form && state.form.OidcConfigForm && state.form.OidcConfigForm.values ? state.form.OidcConfigForm.values : null,
                license_info: state.footer && state.footer.license_info ? state.footer.license_info : null,

            }
    },

    dispatch =>
        ({
            getOidcConfigs: () => dispatch(getOidcConfigs()),
            getLicenseStatus: () => dispatch(getLicenseStatus()),
        }))(OidcConfigFormWithRouter);
        const OidcConfigFormTranslated = withTranslation('common')(OidcConfigForm)
export default reduxForm({
    form: "OidcConfigForm",
})(OidcConfigFormTranslated);