import React, {Component} from 'react';
import { connect } from "react-redux";
import { Field, reduxForm, formValueSelector } from "redux-form";
import { renderField, renderToggle, required } from "../../../utils/formValidations.js";
import { withRouter } from "react-router-dom";
import Proptypes from "prop-types";
import {getBrandingConfigs } from "../../../actions/actionBranding";
import { getLicenseStatus} from "../../../actions/actionFooter.js";
import {withTranslation} from "react-i18next";
import { Groups, Group, FormFooter } from "../../../components/Form/Form.js"

class BrandingConfigFormTemplate extends Component {
    constructor (props){
        super(props);
        this.state = {
            currentBranding: {},
            collapseAdvanced: false,
            licensed: false,
        };
    }

    UNSAFE_componentWillReceiveProps(nextProps){
        if(nextProps.branding_configs && nextProps.branding_configs.length > 0 && this.props.branding_configs !== nextProps.branding_configs && this.props.getBrandingLoading && this.props.fromUpdate){
            let currentBranding = nextProps.branding_configs.find(branding => branding.branding_config_id === this.props.brandingConfigId);
            this.setState({currentBranding: currentBranding});
            this.props.initialize({
                name: currentBranding.name,
                hostname: currentBranding.hostname,
                favicon_logo_url: currentBranding.favicon_logo_url,
                header_logo_url: currentBranding.header_logo_url,
                login_splash_url: currentBranding.login_splash_url,
                html_title: currentBranding.html_title,
                login_caption: currentBranding.login_caption,
                login_logo_url: currentBranding.login_logo_url,
                loading_session_text: currentBranding.loading_session_text,
                joining_session_text: currentBranding.joining_session_text,
                destroying_session_text: currentBranding.destroying_session_text,
                launcher_background_url: currentBranding.launcher_background_url,
                is_default: currentBranding.is_default,


            });
        }
    }
    // I'm thinking you can override the branding by commenting out this snippet 
    // and replacing it with this.setState({licensed: true}) to force branding to be enabled.
    componentDidMount() {
        if (this.props.fromUpdate) {
            this.props.getBrandingConfigs();
        }
        this.props.getLicenseStatus()
            .then(() => {
                const {license_info} = this.props;
                if (license_info && license_info.status && license_info.status.features && license_info.status.features.indexOf('branding') >= 0 ){
                    this.setState({licensed: true});
                }
            });
    }
    

    render() {
        const {handleSubmit, t} = this.props;
        const deny_by_default_checked = false;
        
        if (!this.state.licensed){
            let license_url = `${__LICENSE_INFO_URL__}`;
            return (
                <div>
                    <h4>{t('branding.Unavailable')}</h4>
                    {t('branding.This feature must be licensed')}
                    <hr />
                    <a href={license_url}>{t('branding.More Information')}</a><br/>
                </div>
            )
        }
        return (
            <Groups onSubmit={handleSubmit(this.props.save)} section={this.props.section}>
                <Group title="details" description="details-description">
                    <Field type="text"
                        name="name"
                        id="name"
                        component={renderField}
                        validate={required} required
                    />
                    <Field type="text"
                        name="hostname"
                        id="hostname"
                        component={renderField}
                        validate={required} required
                    />
                   </Group>
                    <Group title="default" description="default-description">

                    <Field type="checkbox"
                        name="is_default"
                        id="is_default"
                        checked={deny_by_default_checked}
                        component={renderToggle}
                    />
                    </Group>
                    <Group title="page" description="page-description">
                    <Field type="text"
                        name="html_title"
                        id="html_title"
                        component={renderField}
                        validate={required} required
                    />
                    <Field type="text"
                        name="favicon_logo_url"
                        id="favicon_logo_url"
                        component={renderField}
                        validate={required} required
                    />
                    <Field type="text"
                        name="header_logo_url"
                        id="header_logo_url"
                        component={renderField}
                        validate={required} required
                    />
                    <Field type="text"
                        name="launcher_background_url"
                        id="launcher_background_url"
                        component={renderField}
                        validate={required} required
                    />
                    </Group>
                    <Group title="login" description="login-description">

                    <Field type="text"
                        name="login_caption"
                        id="login_caption"
                        component={renderField}
                        validate={required} required
                    />
                    <Field type="text"
                        name="login_logo_url"
                        id="login_logo_url"
                        component={renderField}
                        validate={required} required
                    />
                    <Field type="text"
                        name="login_splash_url"
                        id="login_splash_url"
                        component={renderField}
                        validate={required} required
                    />
                    </Group>
                    <Group title="session" description="session-description">
                    <Field type="text"
                        name="loading_session_text"
                        id="loading_session_text"
                        component={renderField}
                        validate={required} required
                    />
                    <Field type="text"
                        name="joining_session_text"
                        id="joining_session_text"
                        component={renderField}
                        validate={required} required
                    />
                    <Field type="text"
                        name="destroying_session_text"
                        id="destroying_session_text"
                        component={renderField}
                        validate={required} required
                    />
                </Group>
                <FormFooter cancel={() => this.props.history.push("/branding")} />
            </Groups>
        );
    }
}

BrandingConfigFormTemplate.proptypes = {
    createBrandingConfig: Proptypes.func,
    updateBrandingConfig: Proptypes.func,
    fromUpdate: Proptypes.bool,
};

let BrandingConfigFormWithRouter = withRouter(BrandingConfigFormTemplate);


const selector = formValueSelector('BrandingConfigForm');

let BrandingConfigForm =  connect(state =>{

            const has_categorization_enabled = selector(state, 'enable_categorization');

            return {
                has_categorization_enabled,
                createBrandingError: state.branding.createBrandingError,
                createBrandingLoading: state.branding.createBrandingLoading,
                createdBranding: state.branding.createdBranding,
                updateBrandingError: state.branding.updateBrandingError,
                updateBrandingLoading: state.branding.updateBrandingLoading,
                updatedBranding: state.branding.updatedBranding,
                branding_configs: state.branding.branding_configs,
                getBrandingLoading: state.branding.getBrandingLoading || false,
                license_info: state.footer && state.footer.license_info ? state.footer.license_info : null,
            }
    },

    dispatch =>
        ({
            getBrandingConfigs: () => dispatch(getBrandingConfigs()),
            getLicenseStatus: () => dispatch(getLicenseStatus()),
        }))(BrandingConfigFormWithRouter);

const BrandingConfigFormTranslated = withTranslation('common')(BrandingConfigForm)

export default reduxForm({
    form: "BrandingConfigForm",
})(BrandingConfigFormTranslated);