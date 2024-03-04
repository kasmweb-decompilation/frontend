import React, { Component } from 'react';
import { connect } from "react-redux";
import { Field, reduxForm, formValueSelector } from "redux-form";
import { renderField, required, number, renderToggle, renderTextArea } from "../../../utils/formValidations.js";
import { withRouter } from "react-router-dom";
import { Collapse } from "reactstrap";
import Proptypes from "prop-types";
import moment from "moment";
import { getCastConfigs } from "../../../actions/actionCast";
import { getGroups } from "../../../actions/actionGroup";
import { getImages } from "../../../actions/actionImage";
import SelectInput from "../../../components/SelectInput";
import { getLicenseStatus } from "../../../actions/actionFooter";
import { withTranslation } from "react-i18next";
import { Groups, Group, FormFooter, FormField } from "../../../components/Form"
import { CopyToClipboard } from '../../../components/Form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons/faChevronDown';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons/faChevronUp';
import { hasAuth } from '../../../utils/axios.js';

class CastConfigFormTemplate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentCast: {},
            collapseAdvanced: false,
            urlField: "",
            licensed: false,
            casting_config_name: "",
        };
        this.handleUrlChange = this.handleUrlChange.bind(this);
        this.toggleAdvanced = this.toggleAdvanced.bind(this);
    }

    toggleAdvanced() {
        this.setState({ collapseAdvanced: !this.state.collapseAdvanced })
    }


    handleUrlChange(e) {
        this.setState({ urlField: e.target.value });
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.cast_configs && nextProps.cast_configs.length > 0 && this.props.cast_configs !== nextProps.cast_configs && this.props.getCastLoading && this.props.fromUpdate) {
            let currentCast = nextProps.cast_configs.find(cast => cast.cast_config_id === this.props.castConfigId);
            this.setState({
                currentCast: currentCast, urlField: currentCast && currentCast.key ? currentCast.key : '',
                casting_config_name: currentCast && currentCast.casting_config_name ? currentCast.casting_config_name : currentCast.key
            });
            this.props.initialize({
                image_id: currentCast.image_id,
                group_id: currentCast.group_id,
                allowed_referrers: currentCast.allowed_referrers ? currentCast.allowed_referrers.join('\n') : '',
                limit_sessions: currentCast.limit_sessions,
                session_remaining: currentCast.session_remaining,
                limit_ips: currentCast.limit_ips,
                ip_request_limit: currentCast.ip_request_limit,
                ip_request_seconds: currentCast.ip_request_seconds,
                error_url: currentCast.error_url,
                enable_sharing: currentCast.enable_sharing,
                disable_control_panel: currentCast.disable_control_panel,
                disable_tips: currentCast.disable_tips,
                disable_fixed_res: currentCast.disable_fixed_res,
                key: currentCast.key,
                allow_resume: currentCast.allow_resume,
                allow_anonymous: currentCast.allow_anonymous,
                require_recaptcha: currentCast.require_recaptcha,
                kasm_url: currentCast.kasm_url,
                dynamic_kasm_url: currentCast.dynamic_kasm_url,
                dynamic_docker_network: currentCast.dynamic_docker_network,
                enforce_client_settings: currentCast.enforce_client_settings,
                allow_kasm_audio: currentCast.allow_kasm_audio,
                allow_kasm_uploads: currentCast.allow_kasm_uploads,
                allow_kasm_downloads: currentCast.allow_kasm_downloads,
                allow_kasm_clipboard_down: currentCast.allow_kasm_clipboard_down,
                allow_kasm_clipboard_up: currentCast.allow_kasm_clipboard_up,
                allow_kasm_microphone: currentCast.allow_kasm_microphone,
                allow_kasm_sharing: currentCast.allow_kasm_sharing,
                allow_kasm_gamepad: currentCast.allow_kasm_gamepad,
                allow_kasm_webcam: currentCast.allow_kasm_webcam,
                allow_kasm_printing: currentCast.allow_kasm_printing,
                kasm_audio_default_on: currentCast.kasm_audio_default_on,
                kasm_ime_mode_default_on: currentCast.kasm_ime_mode_default_on,
                valid_until: moment.utc(currentCast.valid_until).local().format('YYYY-MM-DD HH:mm:ss'),
                casting_config_name: currentCast.casting_config_name,
                remote_app_configs: currentCast.remote_app_configs ? JSON.stringify(currentCast.remote_app_configs, null, 2) : ''
            });
        }
    }

    componentDidMount() {
        this.props.getImages();
        this.props.getGroups();
        if (this.props.fromUpdate) {
            this.props.getCastConfigs();
        }
        this.props.getLicenseStatus()
            .then(() => {
                const { license_info } = this.props;
                if (license_info && license_info.status && license_info.status.features && license_info.status.features.indexOf('session_casting') >= 0) {
                    this.setState({ licensed: true });
                }
            });

    }


    render() {
        const { handleSubmit, images, groups, castFormValues, has_allow_anonymous, has_limit_ips, has_limit_sessions,
            has_enforce_client_settings, t } = this.props;
        let optionsImages = [];
        images.map(opt => {
            if (opt.image_type != "Link") {
                optionsImages.push({ label: opt.friendly_name, value: opt.image_id });
            }
        });
        let optionsGroups = [];
        groups.map(opt => {
            optionsGroups.push({ label: opt.name, value: opt.group_id });
        });

        const hasCurrent = this.state.currentCast && groups.some(el => el.group_id === this.state.currentCast.group_id)
        if (!hasCurrent && !_.isEmpty(this.state.currentCast)) {
            optionsGroups.push({ label: this.state.currentCast.group_name, value: this.state.currentCast.group_id });
        }

        optionsImages.sort((a, b) => (a.label?.toLowerCase() > b.label?.toLowerCase()) ? 1 : -1);
        optionsGroups.sort((a, b) => (a.label?.toLowerCase() > b.label?.toLowerCase()) ? 1 : -1);

        if (!this.state.licensed) {
            let license_url = `${__LICENSE_INFO_URL__}`;
            return (
                <div>
                    <h4>{t('casting.Unavailable')}</h4>
                    {t('casting.This feature must be licensed')}
                    <hr />
                    <a href={license_url}>{t('casting.More Information')}</a><br />
                </div>
            )
        }


        return (
            <Groups onSubmit={handleSubmit(this.props.save)} section={this.props.section}>
                <Group title="details" description="details-description">
                    <Field type="text"
                        name="casting_config_name"
                        id="casting_config_name"
                        component={renderField}
                        isUpdateForm={this.props.fromUpdate}
                        validate={required} required

                    />
                    <FormField 
                        label={'key'}
                        additional={<span className="tw-inline-block tw-text-xs text-muted-more">
                                {"https://" + window.location.host + "/#/cast/"}<span className={'tw-font-bold tw-text-emerald-700 dark:tw-text-emerald-500/70'}>{this.state.urlField}</span>
                                <CopyToClipboard value={"https://" + window.location.host + "/#/cast/" + this.state.urlField} />
                            </span>}
                    >
                    <Field type="text"
                        name="key"
                        id="key"
                        component={renderField}
                        validate={required} required
                        onChange={this.handleUrlChange}
                    />
                    </FormField>
                    {hasAuth('images') && <Field name="image_id"
                        selectedValue={castFormValues && castFormValues.image_id ? castFormValues.image_id : ""}
                        options={optionsImages}
                        validate={required} required
                        isUpdateForm={this.props.fromUpdate}
                        component={SelectInput}
                    />}
                    <Field type="checkbox"
                        name="allow_resume"
                        id="allow_resume"
                        component={renderToggle}
                    />
                     <hr className="tw-mt-0" />
                    <Field type="checkbox"
                        name="allow_anonymous"
                        id="allow_anonymous"
                        component={renderToggle}
                    />
                    {has_allow_anonymous && (
                        <React.Fragment>
                            <Field type="checkbox"
                                name="require_recaptcha"
                                id="require_recaptcha"
                                component={renderToggle}
                            />
                            <Field name="group_id"
                                selectedValue={castFormValues && castFormValues.group_id ? castFormValues.group_id : ""}
                                options={optionsGroups}
                                validate={has_allow_anonymous ? required : null} required={has_allow_anonymous}
                                isUpdateForm={this.props.fromUpdate}
                                component={SelectInput}
                            />
                        </React.Fragment>
                    )}
                    <hr className="tw-mt-0" />
                    <Field type="checkbox"
                        name="limit_sessions"
                        id="limit_sessions"
                        component={renderToggle}
                    />
                    {has_limit_sessions ?
                        <Field type="number"
                            name="session_remaining"
                            id="session_remaining"
                            component={renderField}
                            validate={number} required
                        />
                        : ""
                    }
                     <hr className="tw-mt-0" />
                    <Field type="checkbox"
                        name="limit_ips"
                        id="limit_ips"
                        component={renderToggle}
                    />
                    {has_limit_ips && (
                        <React.Fragment>
                            <Field type="number"
                                name="ip_request_limit"
                                id="ip_request_limit"
                                component={renderField}
                                validate={number} required
                            />
                            <Field type="number"
                                name="ip_request_seconds"
                                id="ip_request_seconds"
                                component={renderField}
                                validate={number} required
                            />
                        </React.Fragment>
                    )}
                    </Group>
                    <Group title="advanced" description="advanced-description">
                    <a className='tw-mb-6 tw-text-[var(--text-color)]' onClick={this.toggleAdvanced}>
                        <strong>{t("casting.advanced")}</strong>
                        <span className="float-right">
                            {this.state.collapseAdvanced ? <FontAwesomeIcon icon={faChevronDown} /> :
                                <FontAwesomeIcon icon={faChevronUp} />}
                        </span>
                    </a>
                    <Collapse isOpen={this.state.collapseAdvanced}>
                        <hr className="tw-mt-0" />
                        <Field type="text"
                            name="kasm_url"
                            id="kasm_url"
                            component={renderField}
                        />
                        <Field type="checkbox"
                            name="dynamic_kasm_url"
                            id="dynamic_kasm_url"
                            component={renderToggle}
                        />
                        <Field type="checkbox"
                            name="dynamic_docker_network"
                            id="dynamic_docker_network"
                            component={renderToggle}
                        />
                        <Field type="text"
                            name="error_url"
                            id="error_url"
                            component={renderField}
                        />
                        <Field type="checkbox"
                            name="disable_control_panel"
                            id="disable_control_panel"
                            component={renderToggle}
                        />
                        <Field type="checkbox"
                            name="disable_tips"
                            id="disable_tips"
                            component={renderToggle}
                        />
                        <Field type="checkbox"
                            name="enable_sharing"
                            id="enable_sharing"
                            component={renderToggle}
                        />
                        <Field type="checkbox"
                            name="disable_fixed_res"
                            id="disable_fixed_res"
                            component={renderToggle}
                        />
                        <Field type="text"
                            name="allowed_referrers"
                            id="allowed_referrers"
                            component={renderTextArea}
                        />
                        <Field type="checkbox"
                            name="enforce_client_settings"
                            id="enforce_client_settings"
                            component={renderToggle}
                        />

                        {has_enforce_client_settings && 
                            <React.Fragment>
                                <Field type="checkbox"
                                    name="allow_kasm_audio"
                                    id="allow_kasm_audio"
                                    component={renderToggle}
                                />
                                <Field type="checkbox"
                                    name="kasm_audio_default_on"
                                    id="kasm_audio_default_on"
                                    component={renderToggle}
                                />
                                <Field type="checkbox"
                                    name="allow_kasm_downloads"
                                    id="allow_kasm_downloads"
                                    component={renderToggle}
                                />
                                <Field type="checkbox"
                                    name="allow_kasm_clipboard_down"
                                    id="allow_kasm_clipboard_down"
                                    component={renderToggle}
                                />
                                <Field type="checkbox"
                                    name="allow_kasm_clipboard_up"
                                    id="allow_kasm_clipboard_up"
                                    component={renderToggle}
                                />
                                <Field type="checkbox"
                                    name="allow_kasm_microphone"
                                    id="allow_kasm_microphone"
                                    component={renderToggle}
                                />
                                <Field type="checkbox"
                                    name="allow_kasm_uploads"
                                    id="allow_kasm_uploads"
                                    component={renderToggle}
                                />
                                <Field type="checkbox"
                                    name="allow_kasm_sharing"
                                    id="allow_kasm_sharing"
                                    component={renderToggle}
                                />
                                <Field type="checkbox"
                                    name="allow_kasm_gamepad"
                                    id="allow_kasm_gamepad"
                                    component={renderToggle}
                                />
                                <Field type="checkbox"
                                    name="kasm_ime_mode_default_on"
                                    id="kasm_ime_mode_default_on"
                                    component={renderToggle}
                                />
                                <Field type="checkbox"
                                    name="allow_kasm_webcam"
                                    id="allow_kasm_webcam"
                                    component={renderToggle}
                                />
                                <Field type="checkbox"
                                    name="allow_kasm_printing"
                                    id="allow_kasm_printing"
                                    component={renderToggle}
                                />
                            </React.Fragment>
                        }
                        <Field type="textarea"
                            name="remote_app_configs"
                            id="remote_app_configs"
                            component={renderTextArea}
                        />
                        <Field type="datetime-local"
                            name="valid_until"
                            id="valid_until"
                            component={renderField}
                        />
                    </Collapse>

                </Group>
                <FormFooter cancel={() => this.props.history.push("/cast")} />
            </Groups>
        );
    }
}

CastConfigFormTemplate.proptypes = {
    createCastConfig: Proptypes.func,
    updateCastConfig: Proptypes.func,
    fromUpdate: Proptypes.bool,
};

let CastConfigFormWithRouter = withRouter(CastConfigFormTemplate);


const selector = formValueSelector('CastConfigForm');

let CastConfigForm = connect(state => {

    const has_allow_anonymous = selector(state, 'allow_anonymous');
    const has_limit_sessions = selector(state, 'limit_sessions');
    const has_limit_ips = selector(state, 'limit_ips');
    const has_enforce_client_settings = selector(state, 'enforce_client_settings');

    return {
        has_allow_anonymous,
        has_limit_sessions,
        has_limit_ips,
        has_enforce_client_settings,
        createCastError: state.cast.createCastError,
        createCastLoading: state.cast.createCastLoading,
        createdCast: state.cast.createdCast,
        updateCastError: state.cast.updateCastError,
        updateCastLoading: state.cast.updateCastLoading,
        updatedCast: state.cast.updatedCast,
        cast_configs: state.cast.cast_configs,
        getCastLoading: state.cast.getCastLoading || false,
        images: state.images.images || [],
        groups: state.groups.groups || [],
        castFormValues: state.form && state.form.CastConfigForm && state.form.CastConfigForm.values ? state.form.CastConfigForm.values : null,
        license_info: state.footer && state.footer.license_info ? state.footer.license_info : null,

    }
},

    dispatch =>
    ({
        getCastConfigs: () => dispatch(getCastConfigs()),
        getImages: () => dispatch(getImages()),
        getGroups: () => dispatch(getGroups()),
        getLicenseStatus: () => dispatch(getLicenseStatus()),
    }))(CastConfigFormWithRouter);

const CastConfigFormTranslated = withTranslation('common')(CastConfigForm)

export default reduxForm({
    form: "CastConfigForm",
})(CastConfigFormTranslated);
