import React,{ Component } from "react";
import { connect } from "react-redux";
import { getSignOnURL, set_saml_config, get_saml_config, update_saml_config } from "../../../actions/actionSaml";
import { Field, reduxForm } from "redux-form";
import { Row, Col, Button as RSButton, Card, CardHeader, Alert, Container } from "reactstrap";
import { NotificationManager } from "react-notifications";
import { withRouter } from "react-router-dom";

import Proptypes from "prop-types";
import {renderToggle, renderField, renderSelectField, renderTextArea, required} from "../../../utils/formValidations";
import { getLicenseStatus} from "../../../actions/actionFooter.js";
import MappingTable from "../../../components/MappingTable/MappingTable.js";
import {withTranslation} from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShieldKeyhole } from '@fortawesome/free-solid-svg-icons/faShield';
import { faVial } from '@fortawesome/free-solid-svg-icons/faVial';
import { faList } from '@fortawesome/free-solid-svg-icons/faList';
import PageHeader, { parentRoutes } from "../../../components/Header/PageHeader";
import { TabList, FormField, ViewField, Groups, Group, FormFooter, Button } from "../../../components/Form/Form";

const parentRouteList = parentRoutes('/saml')
const newRoutes = [
    ...parentRouteList.routes,
    {name: "generic.update",path:"/updateuser",isActive: true},
];

class UpdateSaml extends Component{
    constructor(props){
        super(props);
        this.state = {
            saml_id: 0,
            relayState: "https://" + window.location.host + "/#/sso",
            licensed: false,
            currentTab: 'form'
        };
        this.copyToClipboard = this.copyToClipboard.bind(this);
        this.getURL = this.getURL.bind(this);
        this.getMetadata = this.getMetadata.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.initialize = this.initialize.bind(this);
        this.submitError = this.submitError.bind(this);
        this.submitSuccess = this.submitSuccess.bind(this);
        this.handleSSOSuccess = this.handleSSOSuccess.bind(this);
        this.handleSSOError = this.handleSSOError.bind(this);
    }

    copyToClipboard(text) {
        const el = document.createElement('textarea');
        el.value = text;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
    };

    componentDidMount() {
        this.setState({
            saml_id: this.props.match.params.id
        });
        this.initialize();
        this.props.getLicenseStatus()
            .then(() => {
                const {license_info} = this.props;
                if (license_info && license_info.status && license_info.status.features && license_info.status.features.indexOf('saml') >= 0 ){
                    this.setState({licensed: true});
                }
            });
    }

    initialize() {
        this.props.get_saml(this.props.match.params.id)
            .then(() => {
                this.props.initialize({
                    display_name: this.props.saml_config.display_name,
                    hostname: this.props.saml_config.hostname,
                    is_default: this.props.saml_config.is_default,
                    debug: this.props.saml_config.debug,
                    auto_login: this.props.saml_config.auto_login,
                    sp_entity_id: this.props.saml_config.sp_entity_id,
                    sp_acs_url: this.props.saml_config.sp_acs_url,
                    adfs: this.props.saml_config.adfs,
                    enabled: this.props.saml_config.enabled,
                    sp_slo_url: this.props.saml_config.sp_slo_url,
                    group_attribute: this.props.saml_config.group_attribute,
                    sp_name_id: this.props.saml_config.sp_name_id,
                    sp_x509_cert: this.props.saml_config.sp_x509_cert,
                    sp_private_key: this.props.saml_config.sp_private_key,
                    idp_entity_id: this.props.saml_config.idp_entity_id,
                    idp_sso_url: this.props.saml_config.idp_sso_url,
                    idp_slo_url: this.props.saml_config.idp_slo_url,
                    idp_x509_cert: this.props.saml_config.idp_x509_cert,
                    want_attribute_statement: this.props.saml_config.want_attribute_statement,
                    name_id_encrypted: this.props.saml_config.name_id_encrypted,
                    authn_request_signed: this.props.saml_config.authn_request_signed,
                    logout_request_signed: this.props.saml_config.logout_request_signed,
                    logout_response_signed: this.props.saml_config.logout_response_signed,
                    sign_metadata: this.props.saml_config.sign_metadata,
                    want_messages_signed: this.props.saml_config.want_messages_signed,
                    want_assertions_signed: this.props.saml_config.want_assertions_signed,
                    want_name_id: this.props.saml_config.want_name_id,
                    want_name_id_encrypted: this.props.saml_config.want_name_id_encrypted,
                    want_assertions_encrypted: this.props.saml_config.want_assertions_encrypted,
                    signature_algorithm: this.props.saml_config.signature_algorithm,
                    digest_algorithm: this.props.saml_config.digest_algorithm,
                    logo_url: this.props.saml_config.logo_url,
                });
            })
    }

    submitForm(formData){
        formData.saml_id = this.props.saml_config.saml_id;
        this.props.update_saml(formData)
        .then(() => this.submitSuccess())
        .catch(() => this.submitError());
    }

    submitSuccess() {
        const {update_saml_error_message, t} = this.props;
        if (update_saml_error_message){
            NotificationManager.error(update_saml_error_message,t('auth.saml-update'), 5000);
        } else {
            this.initialize();
            NotificationManager.success(t('auth.saml-configuration-updated'), t('auth.saml-update'), 5000);
            this.props.history.push("/saml");
        }
    }

    submitError() {
        const { t } = this.props;
        NotificationManager.error(t('auth.configuration-update-failed'),t('auth.saml-update'), 5000);
    }

    getURL(){
        this.props.getsso("saml_id", this.props.match.params.id)
            .then(() => this.handleSSOSuccess())
            .catch(() => this.handleSSOError());
    }

    handleSSOSuccess() {
        const {sso_url, sso_error_message, t} = this.props;
        if (sso_error_message) {
            NotificationManager.error(sso_error_message,t('auth.login-failed'), 5000);
        } else {
            if (sso_url) {
                NotificationManager.success(t('auth.login-success'), 5000);
                window.location.href = sso_url;
            }
        }
    }

    handleSSOError(){
        const {sso_error, t} = this.props;
        if (sso_error)
            NotificationManager.error(this.props.sso_error,t('auth.login-failed'), 5000);
    }

    getMetadata(){
        window.open(this.props.saml_config.sp_entity_id);
    }

    render(){
        const {handleSubmit, t} = this.props;
        const {relayState } = this.state;
        const checked = this.props.saml_config.enabled;
        const isDefault = this.props.saml_config.is_default;
        const checkedADFS = this.props.saml_config.adfs;
         if (!this.state.licensed){
            let license_url = `${__LICENSE_INFO_URL__}`;
            return (
                <div>
                    <PageHeader location={this.props.location} routes={typeof newRoutes !== 'undefined' ? newRoutes : null} title={t('auth.saml-2-0-configurations')} icon={<FontAwesomeIcon icon={faShieldKeyhole} />} />
                    <Row>
                        <Container>
                            <Col sm={{size: 8, order: 3, offset: 2}}>
                                <Card className = "user-form-container">
                                    <CardHeader>
                                        <strong>{t('auth.saml-2-0-configurations')}</strong>
                                    </CardHeader>
                                    <Alert color="none" isOpen={true}>
                                        <h4>{t('licensing.unavailable')}</h4>
                                        {t('licensing.this-feature-must-be-licensed')}
                                        <hr />
                                        <a href={license_url}>{t('licensing.more-information')}</a><br/>
                                    </Alert>
                                </Card>
                            </Col>
                        </Container>
                    </Row>
                </div>

            )
        }
        const tabList = [
            { name: 'buttons.Edit', key: 'form' },
            { name: 'mapping.Attribute Mapping', key: 'attributemapping' },
        ]
        return (
            <React.Fragment>
                <PageHeader location={this.props.location} routes={typeof newRoutes !== 'undefined' ? newRoutes : null} title={t('auth.saml-2-0-configurations')} icon={<FontAwesomeIcon icon={faShieldKeyhole} />} />

                <Row>
                    <Col sm={{ size: 10, order: 3, offset: 1 }}>
                        <TabList {...this.props} tabList={tabList} currentTab={this.state.currentTab} setCurrentTab={(value) => this.setState({ currentTab: value })} />
                        <div className={(this.state.currentTab === 'form' ? 'tw-block' : 'tw-hidden')}>
                            <Groups onSubmit={handleSubmit(this.submitForm)} section="auth">
                                <Group title="service-provider" description="service-provider-description">
                                    <Field name="enabled"
                                        id="enabled"
                                        type="checkbox"
                                        checked={checked}
                                        component={renderToggle}
                                    />
                                    <Field type="text"
                                        name="display_name"
                                        id="display_name"
                                        component={renderField}
                                    />
                                    <Field type="text"
                                        name="logo_url"
                                        id="logo_url"
                                        component={renderField}
                                    />
                                    <FormField label="host-name">
                                        <Field type="text"
                                            name="hostname"
                                            id="hostname"
                                            validate={required} required
                                            component={renderField}
                                        />
                                    </FormField>
                                    <FormField label="entity-id">
                                        <Field type="text"
                                            name="sp_entity_id"
                                            id="sp_entity_id"
                                            copy={true}
                                            component={renderField}
                                        />
                                    </FormField>
                                    <FormField label="single-sign-on-service">
                                        <Field type="text"
                                            name="sp_acs_url"
                                            id="sp_acs_url"
                                            copy={true}
                                            component={renderField}
                                        />
                                    </FormField>
                                    <FormField label="single-logout-service">
                                        <Field type="text"
                                            name="sp_slo_url"
                                            id="sp_slo_url"
                                            copy={true}
                                            component={renderField}
                                        />
                                    </FormField>
                                    <ViewField type="text"
                                        name="relay-state"
                                        value={relayState}
                                        component={renderField}
                                    />

                                    <FormField label="default">
                                        <Field name="is_default"
                                            id="default"
                                            type="checkbox"
                                            checked={isDefault}
                                            component={renderToggle}
                                        />
                                    </FormField>
                                    <Field name="auto_login"
                                        id="auto_login"
                                        type="checkbox"
                                        checked={checked}
                                        component={renderToggle}
                                    />
                                    <FormField label="group-member-attribute">
                                        <Field type="text"
                                            name="group_attribute"
                                            id="group_attribute"
                                            component={renderField}
                                        />
                                    </FormField>
                                    <FormField label="nameid-attribute">
                                        <Field type="text"
                                            name="sp_name_id"
                                            id="sp_name_id"
                                            component={renderField}
                                        />
                                    </FormField>
                                    <FormField label="x509-certificate">
                                        <Field type="text"
                                            name="sp_x509_cert"
                                            id="sp_x509_cert"
                                            component={renderTextArea}
                                        />
                                    </FormField>
                                    <FormField label="private-key">
                                        <Field type="text"
                                            name="sp_private_key"
                                            id="sp_private_key"
                                            component={renderTextArea}
                                        />
                                    </FormField>
                                    <Field name="debug"
                                        id="debug"
                                        type="checkbox"
                                        checked={checked}
                                        component={renderToggle}
                                    />

                                </Group>
                                <Group title="identity-provider" description="identity-provider-description">
                                    <FormField label="adfs-active-directory-federate">
                                        <Field name="adfs"
                                            id="adfs"
                                            type="checkbox"
                                            checked={checkedADFS}
                                            component={renderToggle}
                                        />
                                    </FormField>
                                    <FormField label="entity-id">
                                        <Field type="text"
                                            name="idp_entity_id"
                                            id="idp_entity_id"
                                            component={renderField}
                                            validate={required} required
                                        />
                                    </FormField>
                                    <FormField label="single-sign-on-service-saml-2-">
                                        <Field type="text"
                                            name="idp_sso_url"
                                            id="idp_sso_url"
                                            component={renderField}
                                            validate={required} required
                                        />
                                    </FormField>
                                    <FormField label="single-logout-service-slo-endp">
                                        <Field type="text"
                                            name="idp_slo_url"
                                            id="idp_slo_url"
                                            component={renderField}
                                        />
                                    </FormField>
                                    <FormField label="x509-certificate">
                                        <Field type="text"
                                            name="idp_x509_cert"
                                            id="idp_x509_cert"
                                            component={renderTextArea}
                                            validate={required} required
                                        />
                                    </FormField>

                                </Group>
                                <Group title="advanced-settings" description="advanced-settings-description">
                                    <Field name="want_attribute_statement"
                                        id="want_attribute_statement"
                                        type="checkbox"
                                        checked={checked}
                                        component={renderToggle}
                                    />
                                    <Field name="name_id_encrypted"
                                        id="name_id_encrypted"
                                        type="checkbox"
                                        checked={checked}
                                        component={renderToggle}
                                    />
                                    <FormField label="authn-requests-signed">
                                    <Field name="authn_request_signed"
                                        id="authn_request_signed"
                                        type="checkbox"
                                        checked={checked}
                                        component={renderToggle}
                                    />
                                    </FormField>
                                    <Field name="logout_request_signed"
                                        id="logout_request_signed"
                                        type="checkbox"
                                        checked={checked}
                                        component={renderToggle}
                                    />
                                    <Field name="logout_response_signed"
                                        id="logout_response_signed"
                                        type="checkbox"
                                        checked={checked}
                                        component={renderToggle}
                                    />
                                    <Field name="sign_metadata"
                                        id="sign_metadata"
                                        type="checkbox"
                                        checked={checked}
                                        component={renderToggle}
                                    />
                                    <Field name="want_messages_signed"
                                        id="want_messages_signed"
                                        type="checkbox"
                                        checked={checked}
                                        component={renderToggle}
                                    />
                                    <Field name="want_assertions_signed"
                                        id="want_assertions_signed"
                                        type="checkbox"
                                        checked={checked}
                                        component={renderToggle}
                                    />
                                    <Field name="want_name_id"
                                        id="want_name_id"
                                        type="checkbox"
                                        checked={checked}
                                        component={renderToggle}
                                    />
                                    <FormField label="want-encrypted-name-id">
                                        <Field name="want_name_id_encrypted"
                                            id="want_name_id_encrypted"
                                            type="checkbox"
                                            checked={checked}
                                            component={renderToggle}
                                        />
                                    </FormField>
                                    <FormField label="want-encrypted-assertions">
                                        <Field name="want_assertions_encrypted"
                                            id="want_assertions_encrypted"
                                            type="checkbox"
                                            checked={checked}
                                            component={renderToggle}
                                        />
                                    </FormField>

                                    <Field name="signature_algorithm"
                                        id="signature_algorithm"
                                        component={renderSelectField}
                                    >
                                        <option>http://www.w3.org/2000/09/xmldsig#rsa-sha1</option>
                                        <option>http://www.w3.org/2000/09/xmldsig#dsa-sha1</option>
                                        <option>http://www.w3.org/2001/04/xmldsig-more#rsa-sha256</option>
                                        <option>http://www.w3.org/2001/04/xmldsig-more#rsa-sha384</option>
                                        <option>http://www.w3.org/2001/04/xmldsig-more#rsa-sha512</option>
                                    </Field>
                                    <Field name="digest_algorithm"
                                        id="digest_algorithm"
                                        component={renderSelectField}
                                    >
                                        <option>http://www.w3.org/2000/09/xmldsig#sha1</option>
                                        <option>http://www.w3.org/2001/04/xmlenc#sha256</option>
                                        <option>http://www.w3.org/2001/04/xmldsig-more#sha384</option>
                                        <option>http://www.w3.org/2001/04/xmlenc#sha512</option>
                                    </Field>


                                </Group>
                                <FormFooter cancel={() => this.props.history.push("/saml")} />

                                <div className="tw-flex tw-justify-center tw-gap-4">
                                <Button icon={<FontAwesomeIcon icon={faVial} />} section="auth" color="tw-bg-slate-500" name="test-sso" onClick={this.getURL} />
                                <Button icon={<FontAwesomeIcon icon={faList} />} section="auth" color="tw-bg-slate-500" name="get-metadata" onClick={this.getMetadata} />
                                </div>
                                
                            </Groups>
                        </div>
                        <div className={(this.state.currentTab === 'attributemapping' ? 'tw-block' : 'tw-hidden')}>
                            <MappingTable sso_id={this.props.match.params.id} sso_type="SAML" />
                        </div>
                    </Col>

                </Row>
            </React.Fragment>
        );
    }
}

UpdateSaml.propTypes = {
    saml_requests: Proptypes.array,
    handleSubmit: Proptypes.func,
};

let  SamlFormWithRouter = withRouter(UpdateSaml);

let SamlForm = connect(state => ({
        saml_request: state.saml || [],
        saml_config: state.saml.saml_config || [],
        set_saml_error: state.saml.set_saml_error || [],
        get_saml_error: state.saml.get_saml_error || [],
        update_saml_error_message: state.saml.update_saml_error_message,
        sso_url: state.saml.sso_url,
        sso_saml_error: state.saml.sso_saml_error,
        sso_error: state.saml.sso_error,
        license_info: state.footer && state.footer.license_info ? state.footer.license_info : null,
    }),
    dispatch => ({
        getsso: (ssoType, id) => dispatch(getSignOnURL(ssoType, id)),
        set_saml: (formData) => dispatch(set_saml_config(formData)),
        update_saml: (formData) => dispatch(update_saml_config(formData)),
        get_saml: (data) => dispatch(get_saml_config(data)),
        getLicenseStatus: () => dispatch(getLicenseStatus()),
    }))(SamlFormWithRouter);
    const SamlFormTranslated = withTranslation('common')(SamlForm)
export default reduxForm({
    form: "samlForm",
})(SamlFormTranslated);
