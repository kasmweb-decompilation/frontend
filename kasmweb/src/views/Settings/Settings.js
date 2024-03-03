import React,{ Component } from "react";
import { connect } from "react-redux";
import { Field, reduxForm, change} from "redux-form";
import {  Row, Col, UncontrolledTooltip, Card, CardBody, CardHeader, Form, FormGroup, CardFooter, Button, Label } from "reactstrap";
import { getSettings, updateSettings } from "../../actions/actionSettings";
import LoadingSpinner from "../../components/LoadingSpinner/index";
import { NotificationManager } from "react-notifications";
import Proptypes from "prop-types";
import {number, positive_float, renderToggle, renderPass, renderField, renderTextArea, renderPassTextArea, required, json, shouldEnd} from "../../utils/formValidations";
import TooltipComponent from "./TooltipComponent";
import {withTranslation} from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSliders } from '@fortawesome/pro-light-svg-icons/faSliders';
import PageHeader from "../../components/Header/PageHeader";
import { FormFooter, Groups, Group, FormField, TabList } from "../../components/Form/Form";

function titleCase(string)
{
    if (string === "web_filter"){
        return "Web Filter"
    }
    else {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

}

const shouldEndMp4 = shouldEnd('.mp4');

class Settings extends Component{
    constructor(props) {
        super(props);        
        this.state = {
            pages: 1,
            settingId: null,
        };

        this.initializeForm = this.initializeForm.bind(this);
        this.submitSettings = this.submitSettings.bind(this);
        this.handleUpdateSuccess = this.handleUpdateSuccess.bind(this);
        this.handleUpdateError = this.handleUpdateError.bind(this);
        this.updateSettings = this.updateSettings.bind(this);

    }

    componentDidMount(){
        this.updateSettings();
    }

    updateSettings() {
        this.props.getSettings()
            .then(() => {
                this.initializeForm();
            });
    }

    initializeForm(){
        const {settings} = this.props;
        if(settings){
            settings.map((setting) => {
                let value = setting.value;
                if (setting.value_type === 'bool') {
                    value = setting.value === 'true';
                }
                this.props.dispatch(change('settingsForm', setting.setting_id, value));
            });
        }
    }

    submitSettings(formValues) {
        let initialValues = {};
        const {settings} = this.props;
        // create array of setting id: setting value to make comparing with form values easier
        for (let set in settings){
            if (settings.hasOwnProperty(set))
                initialValues[settings[set].setting_id] = settings[set].value
        }
        //redux doesnt send empty strings...check for non existant form value to allow empty strings
        for (let setting in initialValues){
            if (initialValues.hasOwnProperty(setting)) {
                if (!formValues.hasOwnProperty(setting)) {
                    if (initialValues[setting] !== "") {
                        let settingsObj = {
                            "setting_id": setting,
                            "value": ''
                        };
                        this.props.updateSettings(settingsObj)
                            .then(() => this.handleUpdateSuccess())
                            .catch(() => this.handleUpdateError())
                    }
                }
            }
        }
        for (let setting in formValues){
            if (formValues.hasOwnProperty(setting)) {
                if (formValues[setting] !== initialValues[setting]) {
                    //adding check for boolean values being different than initial value...had caused all booleans to be sent
                    if (typeof formValues[setting] === "boolean"){
                        if (formValues[setting].toString() !== initialValues[setting]) {
                            let settingsObj = {
                                "setting_id": setting,
                                "value": formValues[setting]
                            };
                            this.props.updateSettings(settingsObj)
                                .then(() => this.handleUpdateSuccess())
                                .catch(() => this.handleUpdateError())
                        }
                    } else {
                        let settingsObj = {
                            "setting_id": setting,
                            "value": formValues[setting]
                        };
                        this.props.updateSettings(settingsObj)
                            .then(() => this.handleUpdateSuccess())
                            .catch(() => this.handleUpdateError())
                    }
                }
            }
        }

    }

    handleUpdateSuccess(){
        const {errorMessage, t} = this.props;
        if(errorMessage){
            NotificationManager.error(errorMessage, t("settings.Update Settings"), 3000);
        }
        else {
            NotificationManager.success(t("settings.Setting Updated"), t("settings.Setting Updated Successfully"));
            this.props.getSettings()
                .then(() => {
                    this.initializeForm();
                });
        }
    }

    handleUpdateError(){
        const {updateSettingsError, t} = this.props;
        if(updateSettingsError){
            NotificationManager.error(updateSettingsError,t("settings.Update Settings"), 3000);
        }
    }

    render(){
        if (this.props.getSettingsLoading){
            return (<div> <LoadingSpinner /></div>);
        }
        const {handleSubmit, settings, pristine, submitting, t} = this.props;
        let categories = {};
        //separate settings by category
        JSON.parse(JSON.stringify(settings)).map((setting) => {
            categories[setting.category] = {...categories[setting.category], [setting.name]: setting};
        });

        let settingFields = [];
        for (let category in categories) {
            if (categories.hasOwnProperty(category))
            {
                let fields = [];
                for (let setting in categories[category]) {
                    if (categories[category].hasOwnProperty(setting)) {
                        let field = categories[category][setting];
                        // ensures String and string match
                        let type = field.value_type.toLowerCase();
                        let field_name = field.name.toLowerCase();

                        if (type === "json"){

                            field.value = JSON.stringify(JSON.parse(field.value),null,2);

                            for (let set in settings){
                                if (settings.hasOwnProperty(set))
                                    if (settings[set].setting_id === field.setting_id)
                                    {
                                        settings[set].value = field.value;
                                    }
                            }
                        }
                        const addField = () => {
                            //Name is more specific so put it at the top.
                            if (field_name === 'session_recording_upload_location') {
                                return <Field
                                    type="text"
                                    name={field.setting_id}
                                    id={field.setting_id}
                                    component={renderField}
                                    validate={shouldEndMp4}
                                    placeholder={field.value}
                                />
                            }
                            if (type === 'bool') {
                                return <Field
                                    name={field.setting_id}
                                    id={field.setting_id}
                                    type="checkbox"
                                    checked={field.value === 'true'}
                                    component={renderToggle}
                                    placeholder={field.value}
                                />
                            }
                            if (type === 'string') {
                                return <Field
                                    type="text"
                                    name={field.setting_id}
                                    id={field.setting_id}
                                    component={renderField}
                                    placeholder={field.value}
                                />
                            }
                            if (type === 'password') {
                                return <Field
                                    type="password"
                                    name={field.setting_id}
                                    id={field.setting_id}
                                    component={renderPass}
                                    placeholder={field.value}
                                />
                            }
                            if (type === 'multiline_string') {
                                return <Field
                                    type="textarea"
                                    name={field.setting_id}
                                    id={field.setting_id}
                                    component={renderTextArea}
                                    placeholder={field.value}
                                />
                            }
                            if (type === 'int') {
                                return <Field
                                    name={field.setting_id}
                                    id={field.setting_id}
                                    type="number"
                                    component={renderField}
                                    validate={number} required
                                    placeholder={field.value}
                                />
                            }
                            if (type === 'float') {
                                return <Field
                                    name={field.setting_id}
                                    id={field.setting_id}
                                    type="text"
                                    component={renderField}
                                    validate={[positive_float]} required
                                    placeholder={field.value}
                                />
                            }
                            if (type === 'json_pass') {
                                return <Field
                                    name={field.setting_id}
                                    id={field.setting_id}
                                    type = "textarea"
                                    component={renderPassTextArea}
                                    validate={[required, json]} required
                                    placeholder={field.value}
                                />
                            }
                            if (type === 'json') {
                                return <Field
                                    name={field.setting_id}
                                    id={field.setting_id}
                                    type="textarea"
                                    component={renderTextArea}
                                    validate={[required, json]} required
                                    placeholder={field.value}
                                />
                            }
                        }
                        fields.push(
                            <FormField 
                                key={field.setting_id}
                                resetSection={true}
                                label={'settings.' + field.name}
                                /* 
                                KASM-4602 Removed until system is more reliable

                                additional={field.services_restart ? 
                                    <span className="tw-inline-block tw-text-xs text-muted-more">
                                        {t('settings.requires-restart')}: <span className={'tw-font-bold tw-text-pink-700 dark:tw-text-pink-500/70'}>{field.services_restart}</span>
                                    </span> : ''}
                                */
                                tooltip={'tooltip.' + field.name}>
                                {addField()}
                            </FormField>
                        );
                    }
                }
                // Finally wrap all fields in category with border and title
                settingFields.push(<Group key={category} section="settings" title={category} description={category + '-description'}>{fields}</Group>);
            }
        }

        return (
            <div className="settings">
                <PageHeader location={this.props.location} routes={typeof newRoutes !== 'undefined' ? newRoutes : null} title={t('settings.settings')} icon={<FontAwesomeIcon icon={faSliders} />} />
                <Row>
                    <Col sm={{ size: 10, offset: 1 }}>
                        <TabList tabList={[{ name: 'buttons.Edit', key: 'form'}]} currentTab="form" />
                        <Groups onSubmit={handleSubmit(this.submitSettings)} section="settings">
                            {settingFields && settingFields}
                            <FormFooter cancelButton={' '} />
                        </Groups>
                        
                    </Col>
                </Row>
            </div>
        );}

}

Settings.propTypes = {
    getSettings: Proptypes.func.isRequired,
    settings: Proptypes.array,
    updateSettings: Proptypes.func.isRequired,
    history: Proptypes.object.isRequired,
    getSettingsLoading: Proptypes.bool,
};

let SettingsForms =  connect(state => ({
    settings: state.settings.settings || [],
    getSettingsLoading: state.settings.getSettingsLoading || false,
    errorMessage: state.settings.errorMessage || null,
    updateSettingsError: state.settings.updateSettingsError || null
}),
dispatch => ({
    getSettings: () => dispatch(getSettings()),
    updateSettings: (data) => dispatch(updateSettings(data))
}))(Settings);

const SettingsTranslated = withTranslation('common')(SettingsForms)

export default reduxForm({
    form: "settingsForm",
})(SettingsTranslated);