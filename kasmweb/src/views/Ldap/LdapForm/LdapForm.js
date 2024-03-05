import React,{Component} from "react";
import { Field, reduxForm } from "redux-form";
import { Alert } from "reactstrap";
import { renderPass, renderField, renderToggle, required } from "../../../utils/formValidations.js";
import { connect } from "react-redux";
import { getLdap, updateLdap } from "../../../actions/actionLdap";
import { withRouter } from "react-router-dom";
import Proptypes from "prop-types";
import { getLicenseStatus} from "../../../actions/actionFooter.js";
import {withTranslation} from "react-i18next";
import { Groups, Group, FormFooter } from "../../../components/Form/Form.js"

class LdapFormTemplate extends Component  {
    constructor(props){
        super(props);
        this.state  = {
            currentLdap: null,
            licensed: false,

        };
        this.initializeForm = this.initializeForm.bind(this);
    }

    initializeForm(res){
        let currentLdap = res.response.ldap_configs.find(ldap => ldap.ldap_id === this.props.ldapId);
        this.setState({currentLdap: currentLdap});
        this.props.initialize({
            name: currentLdap.name,
            url: currentLdap.url, 
            ldap_id: currentLdap.ldap_id,
            search_filter: currentLdap.search_filter,
            group_membership_filter: currentLdap.group_membership_filter,
            search_base: currentLdap.search_base,
            service_account_dn: currentLdap.service_account_dn,
            service_account_password: currentLdap.service_account_password,
            email_attribute: currentLdap.email_attribute,
            search_subtree: currentLdap.search_subtree,
            auto_create_app_user: currentLdap.auto_create_app_user,
            username_domain_match: currentLdap.username_domain_match,
            enabled: currentLdap.enabled,
        });
    }


    componentDidMount(){
        if (this.props.fromUpdate){
            this.props.getLdap().then((res) => this.initializeForm(res)); 
        }
        this.props.getLicenseStatus()
            .then(() => {
                const {license_info} = this.props;
                if (license_info && license_info.status && license_info.status.features && license_info.status.features.indexOf('ldap') >= 0 ){
                    this.setState({licensed: true});
                }
            });
    }

    render(){
        const {handleSubmit, t} = this.props;
        const {currentLdap} =  this.state;
        const checked = currentLdap && currentLdap.enabled;
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
                <Group title="ldap-details" description="ldap-details-description">
                    <Field type="text"
                        name="name"
                        id="name"
                        component={renderField}
                        validate={required} required
                    />
                    <Field name="enabled"
                        id="enabled"
                        checked={checked}
                        type="checkbox"
                        component={renderToggle}
                    />

                    <Field
                        name="url"
                        id="url"
                        component={renderField}
                        validate={required} required
                        placeholder="e.g. ldaps://example.local:636"
                    />
                    </Group>
                    <Group title="ldap-search" description="ldap-search-description">
                    <Field type="text"
                        name="search_base"
                        id="search_base"
                        component={renderField}
                        validate={required} required
                        placeholder="e.g. OU=Employees,DC=example,DC=local"
                    />
                    <Field type="text"
                        name="search_filter"
                        id="search_filter"
                        component={renderField}
                        validate={required} required
                        placeholder="e.g. sAMAccountName={0}"
                    />
                    <Field name="search_subtree"
                        id="search_subtree"
                        checked={checked}
                        type="checkbox"
                        component={renderToggle}
                    />
                    </Group>
                    <Group title="ldap-service" description="ldap-service-description">
                    <Field type="text"
                        name="service_account_dn"
                        id="service_account_dn"
                        component={renderField}
                        validate={required} required
                        placeholder="e.g. CN=ldap_bot,CN=Users,DC=example,DC=local"
                    />
                    <Field type="password"
                        name="service_account_password"
                        id="service_account_password"
                        component={renderPass}
                        validate={required} required
                        autoComplete='random-string'
                    />
                    </Group>
                    <Group title="ldap-other" description="ldap-other-description">

                    <Field type="text"
                        name="group_membership_filter"
                        id="group_membership_filter"
                        component={renderField}
                        validate={required} required
                        placeholder="e.g &(objectClass=group)(member:1.2.840.113556.1.4.1941:={})"
                    />
                    <Field
                        name="email_attribute"
                        id="email_attribute"
                        component={renderField}
                        placeholder="mail"
                        autoComplete="off"
                    />
                    <Field
                        name="username_domain_match"
                        id="username_domain_match"
                        component={renderField}
                        placeholder="domain1.com,domain2.com"
                        autoComplete="off"
                    />
                    <Field name="auto_create_app_user"
                        id="auto_create_app_user"
                        checked={checked}
                        type="checkbox"
                        component={renderToggle}
                    />
                </Group>
                <FormFooter cancel={() => this.props.history.push("/ldap")} />
            </Groups>
        );
    }
}

LdapFormTemplate.propTypes = {
    updateLdap: Proptypes.func.isRequired,
    getLdap: Proptypes.func.isRequired,
    updatErrorWarning: Proptypes.func,
    history: Proptypes.object.isRequired,
    updateLdapError: Proptypes.func,
    createLdapError: Proptypes.func,
    fromUpdate: Proptypes.bool,
    createLdap: Proptypes.func,
    errorCreateMessage: Proptypes.string,
    ldap_configs: Proptypes.array,
    getLdapLoading: Proptypes.bool,
    errorUpdateMessage: Proptypes.string,
    initialize: Proptypes.func,
    handleSubmit: Proptypes.func,
    ldapId: Proptypes.string
};


LdapFormTemplate = reduxForm({ // eslint-disable-line
    form: "LdapFormTemplate" // a unique identifier for this form
})(LdapFormTemplate); // eslint-disable-line

LdapFormTemplate = connect(  // eslint-disable-line
    state => ({
        ldap_configs: state.ldap_configs.ldap_configs || [],
        errorCreateMessage: state.ldap_configs.errorCreateMessage || null,
        updateLdapError: state.ldap_configs.updateLdapError || null,
        getLdapLoading: state.ldap_configs.getLdapLoading || false,
        createLdapError: state.ldap_configs.createLdapError || null,
        initialValues: { enabled: true, auto_create_app_user: true, search_subtree: true },
        license_info: state.footer && state.footer.license_info ? state.footer.license_info : null,
    }),
    dispatch => 
        ({
            updateLdap: (data) => dispatch(updateLdap(data)),   
            getLdap: () => dispatch(getLdap()),
            getLicenseStatus: () => dispatch(getLicenseStatus()),
        })) 
(LdapFormTemplate);  //eslint-disable-line
const LdapFormTemplateTranslated = withTranslation('common')(LdapFormTemplate)
export default withRouter(LdapFormTemplateTranslated);