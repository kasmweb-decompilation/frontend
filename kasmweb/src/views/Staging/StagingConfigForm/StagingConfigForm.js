import React, {Component} from 'react';
import { connect } from "react-redux";
import { Field, reduxForm, formValueSelector } from "redux-form";
import {renderField, required, positive_float, renderToggle} from "../../../utils/formValidations.js";
import { withRouter } from "react-router-dom";
import Proptypes from "prop-types";
import {getStagingConfigs } from "../../../actions/actionStaging";
import {getAutoScaleConfigs} from "../../../actions/actionAutoScale"
import {getServerPools} from "../../../actions/actionServerPool";
import {getZones} from "../../../actions/actionZones";
import { getImages } from "../../../actions/actionImage";
import SelectInput from "../../../components/SelectInput/SelectInput.js";
import { getLicenseStatus} from "../../../actions/actionFooter.js";
import {withTranslation} from "react-i18next";
import { Groups, Group, FormFooter } from "../../../components/Form/Form.js"
import { hasAuth } from '../../../utils/axios.js';

class StagingConfigFormTemplate extends Component {
    constructor (props){
        super(props);
        this.state = {
            currentStaging: {},
            collapseAdvanced: false,
            licensed: false
        };
    }

    UNSAFE_componentWillReceiveProps(nextProps){
        if(nextProps.staging_configs && nextProps.staging_configs.length > 0 && this.props.staging_configs !== nextProps.staging_configs && this.props.getStagingLoading && this.props.fromUpdate){
            let currentStaging = nextProps.staging_configs.find(staging => staging.staging_config_id === this.props.stagingConfigId);
            this.setState({currentStaging: currentStaging});
            this.props.initialize({
                zone_id: currentStaging.zone_id,
                server_pool_id: currentStaging.server_pool_id,
                autoscale_config_id: currentStaging.autoscale_config_id,
                image_id: currentStaging.image_id,
                num_sessions: currentStaging.num_sessions,
                expiration: currentStaging.expiration,
                allow_kasm_audio: currentStaging.allow_kasm_audio,
                allow_kasm_uploads: currentStaging.allow_kasm_uploads,
                allow_kasm_downloads: currentStaging.allow_kasm_downloads,
                allow_kasm_clipboard_down: currentStaging.allow_kasm_clipboard_down,
                allow_kasm_clipboard_up: currentStaging.allow_kasm_clipboard_up,
                allow_kasm_microphone: currentStaging.allow_kasm_microphone,
                allow_kasm_gamepad: currentStaging.allow_kasm_gamepad,
                allow_kasm_webcam: currentStaging.allow_kasm_webcam,
                allow_kasm_printing: currentStaging.allow_kasm_printing
            });
        }
    }

    componentDidMount() {
        this.props.getZones();
        this.props.getImages();
        this.props.getServerPools();
        this.props.getAutoScaleConfigs()
        if (this.props.fromUpdate) {
            this.props.getStagingConfigs();
        }
        this.props.getLicenseStatus()
            .then(() => {
                const {license_info} = this.props;
                if (license_info && license_info.status && license_info.status.features && license_info.status.features.indexOf('session_staging') >= 0 ){
                    this.setState({licensed: true});
                }
            });
    }
    

    render() {
        const {handleSubmit, zones, images, stagingFormValues, server_pools, autoscale_configs, t} = this.props;
        const deny_by_default_checked = false;
        let optionsZones = [];
        zones.map(opt => {
            optionsZones.push({label: opt.zone_name, value: opt.zone_id});
        });
        optionsZones.sort((a, b) => (a.label.toLowerCase() > b.label.toLowerCase()) ? 1 : -1);


        let optionsImages = [];
        images.map(opt => {
            if (opt.image_type.toLowerCase() === "container"){
                optionsImages.push({label: opt.friendly_name, value: opt.image_id});
            }
        });
        optionsImages.sort((a, b) => (a.label.toLowerCase() > b.label.toLowerCase()) ? 1 : -1);



        let optionsServerPools = [];
        server_pools.map(opt => {
            if (opt.server_pool_type === "Docker Agent"){
                optionsServerPools.push({label: opt.server_pool_name, value: opt.server_pool_id});
            }

        });
        optionsServerPools.sort((a, b) => (a.label.toLowerCase() > b.label.toLowerCase()) ? 1 : -1);

        let optionsAutoScaleConfigs = [];
        autoscale_configs.map(opt => {
            if (stagingFormValues && stagingFormValues.zone_id && stagingFormValues.server_pool_id ){
                if (stagingFormValues.zone_id && stagingFormValues.server_pool_id )
                {
                    if (stagingFormValues.zone_id === opt.zone_id && stagingFormValues.server_pool_id === opt.server_pool_id) {
                        optionsAutoScaleConfigs.push({
                            label: opt.autoscale_config_name,
                            value: opt.autoscale_config_id
                        });
                    }
                }
                else if (stagingFormValues.server_pool_id){
                    if (stagingFormValues.server_pool_id === opt.server_pool_id) {
                        optionsAutoScaleConfigs.push({
                            label: opt.autoscale_config_name,
                            value: opt.autoscale_config_id
                        });
                    }
                }
                else if (stagingFormValues.zone_id){
                    if (stagingFormValues.zone_id === opt.zone_id) {
                        optionsAutoScaleConfigs.push({
                            label: opt.autoscale_config_name,
                            value: opt.autoscale_config_id
                        });
                    }
                }
                else{
                    optionsAutoScaleConfigs.push({label: opt.autoscale_config_name, value: opt.autoscale_config_id});
                }
            }
        });
        optionsAutoScaleConfigs.sort((a, b) => (a.label.toLowerCase() > b.label.toLowerCase()) ? 1 : -1);


         if (!this.state.licensed){
            let license_url = `${__LICENSE_INFO_URL__}`;
            return (
                <div>
                    <h4>{t('licensing.unavailable')}</h4>
                    {t('licensing.this-feature-must-be-licensed')}
                    <hr />
                    <a href={license_url}>{t('licensing.more-information')}</a><br/>
                </div>
            )
        }

        return (
            <Groups onSubmit={handleSubmit(this.props.save)} section={this.props.section}>
                <Group title="details" description="details-description">

                    {hasAuth('images') && <Field name="image_id"
                        selectedValue={stagingFormValues && stagingFormValues.image_id ? stagingFormValues.image_id : ""}
                        options={optionsImages}
                        validate={required} required
                        isUpdateForm={this.props.fromUpdate}
                        component={SelectInput}
                    />}
                    {hasAuth('zones') && <Field name="zone_id"
                        selectedValue={stagingFormValues && stagingFormValues.zone_id ? stagingFormValues.zone_id : ""}
                        options={optionsZones}
                        validate={required} required
                        isUpdateForm={this.props.fromUpdate}
                        component={SelectInput}
                    />}
                    <Field type="text"
                        name="num_sessions"
                        id="num_sessions"
                        component={renderField}
                        validate={required} required
                    />
                    <Field type="number"
                        name="expiration"
                        id="expiration"
                        component={renderField}
                        validate={[required, positive_float]} required
                    />
                    {hasAuth('pools') && <Field name="server_pool_id"
                        selectedValue={stagingFormValues && stagingFormValues.server_pool_id ? stagingFormValues.server_pool_id : ""}
                        options={optionsServerPools}
                        isUpdateForm={this.props.fromUpdate}
                        component={SelectInput}
                    />}
                    {hasAuth('autoscale') && <Field name="autoscale_config_id"
                        selectedValue={stagingFormValues && stagingFormValues.autoscale_config_id ? stagingFormValues.autoscale_config_id : ""}
                        options={optionsAutoScaleConfigs}
                        isUpdateForm={this.props.fromUpdate}
                        component={SelectInput}
                        disabled={!(stagingFormValues && stagingFormValues.zone_id && stagingFormValues.server_pool_id)}
                    />}
                </Group>
                <Group title="default-permissions" description="default-permissions-description">
                    <Field type="checkbox"
                        name="allow_kasm_audio"
                        id="allow_kasm_audio"
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
                        name="allow_kasm_downloads"
                        id="allow_kasm_downloads"
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
                        name="allow_kasm_gamepad"
                        id="allow_kasm_gamepad"
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

                </Group>
                <FormFooter cancel={() => this.props.history.push("/staging")} />
            </Groups>
        );
    }
}

StagingConfigFormTemplate.proptypes = {
    createStagingConfig: Proptypes.func,
    updateStagingConfig: Proptypes.func,
    fromUpdate: Proptypes.bool,
};

let StagingConfigFormWithRouter = withRouter(StagingConfigFormTemplate);


const selector = formValueSelector('StagingConfigForm');

let StagingConfigForm =  connect(state =>{

            const has_categorization_enabled = selector(state, 'enable_categorization');

            return {
                has_categorization_enabled,
                createStagingError: state.staging.createStagingError,
                createStagingLoading: state.staging.createStagingLoading,
                createdStaging: state.staging.createdStaging,
                updateStagingError: state.staging.updateStagingError,
                updateStagingLoading: state.staging.updateStagingLoading,
                updatedStaging: state.staging.updatedStaging,
                staging_configs: state.staging.staging_configs,
                getStagingLoading: state.staging.getStagingLoading || false,
                zones: state.zones.zones || [],
                server_pools: state.server_pools.server_pools || [],
                autoscale_configs: state.autoscale.autoscale_configs || [],
                images: state.images.images || [],
                stagingFormValues: state.form && state.form.StagingConfigForm && state.form.StagingConfigForm.values ? state.form.StagingConfigForm.values : null,
                license_info: state.footer && state.footer.license_info ? state.footer.license_info : null,

            }
    },

    dispatch =>
        ({
            getStagingConfigs: () => dispatch(getStagingConfigs()),
            getZones: () => dispatch(getZones()),
            getImages: () => dispatch(getImages()),
            getLicenseStatus: () => dispatch(getLicenseStatus()),
            getServerPools: () => dispatch(getServerPools()),
            getAutoScaleConfigs: () => dispatch(getAutoScaleConfigs()),
        }))(StagingConfigFormWithRouter);
        const StagingConfigFormTranslated = withTranslation('common')(StagingConfigForm)
export default reduxForm({
    form: "StagingConfigForm",
})(StagingConfigFormTranslated);