import React, {Component} from 'react';
import { connect } from "react-redux";
import { Field, reduxForm, formValueSelector } from "redux-form";
import {
    renderField,
    required,
    renderToggle,
    renderTextArea,
    json,
    renderSelectField
} from "../../../utils/formValidations.js";
import { withRouter } from "react-router-dom";
import Proptypes from "prop-types";
import {getStorageProviders } from "../../../actions/actionStorageProvider";
import {withTranslation} from "react-i18next";
import { Groups, Group, FormFooter } from "../../../components/Form/Form.js"

class StorageProviderConfigFormTemplate extends Component {
    constructor (props){
        super(props);
        this.state = {
            currentStorageProvider: {},
            collapseAdvanced: false,
            urlField: "",
            redirect_url: "https://" + window.location.host + "/api/cloud_storage_callback",
        };
        this.handleUrlChange = this.handleUrlChange.bind(this);
        this.toggleAdvanced = this.toggleAdvanced.bind(this);
    }

    toggleAdvanced() {
        this.setState({collapseAdvanced: !this.state.collapseAdvanced})
    }

    handleUrlChange(e) {
        this.setState({urlField: e.target.value});
    }

    UNSAFE_componentWillReceiveProps(nextProps){
        if(nextProps.storage_providers && nextProps.storage_providers.length > 0 && this.props.storage_providers !== nextProps.storage_providers && this.props.fromUpdate){
            let currentStorageProvider = nextProps.storage_providers.find(oidc => oidc.storage_provider_id === this.props.storageProviderId);
            this.setState({currentStorageProvider: currentStorageProvider, urlField : currentStorageProvider && currentStorageProvider.key ? currentStorageProvider.key : ''});
            this.props.initialize({
                storage_provider_id: currentStorageProvider.storage_provider_id,
                storage_provider_type: currentStorageProvider.storage_provider_type,
                client_id: currentStorageProvider.client_id,
                client_secret: currentStorageProvider.client_secret,
                auth_url: currentStorageProvider.auth_url,
                token_url: currentStorageProvider.token_url,
                webdav_url: currentStorageProvider.webdav_url,
                scope: currentStorageProvider.scope ? currentStorageProvider.scope.join('\n') : '',
                redirect_url: currentStorageProvider.redirect_url,
                auth_url_options: currentStorageProvider.auth_url_options ? JSON.stringify(currentStorageProvider.auth_url_options, null, 2) : '',
                volume_config: currentStorageProvider.volume_config ? JSON.stringify(currentStorageProvider.volume_config, null, 2) : '',
                mount_config: currentStorageProvider.mount_config ? JSON.stringify(currentStorageProvider.mount_config, null, 2) : '',
                root_drive_url: currentStorageProvider.root_drive_url,
                default_target: currentStorageProvider.default_target,
                enabled: currentStorageProvider.enabled,
                name: currentStorageProvider.name,
            });
        }
    }

    componentDidMount() {
        if (this.props.fromUpdate) {
            this.props.getStorageProviders();
        }
    }


    render() {
        const {handleSubmit, storageProviderFormValues, t} = this.props;
        const {redirect_url } = this.state;
        
        return (
            <Groups onSubmit={handleSubmit(this.props.save)} section={this.props.section}>
                <Group title="general" description="general-description">
                    <Field type="text"
                        name="name"
                        id="name"
                        component={renderField}
                        validate={required} required
                    />
                    <Field type="text"
                        name="storage_provider_type"
                        id="storage_provider_type"
                        component={renderSelectField}
                        clearable={false}
                        selectedValue={storageProviderFormValues && storageProviderFormValues.storage_provider_type || "Dropbox"}
                        disabled={(!!this.props.fromUpdate || (storageProviderFormValues && storageProviderFormValues.storage_provider_type))}
                        validate={required} required>
                        <option value="">{"Select"}</option>
                        <option value='Custom'>{"Custom"}</option>
                        <option value='Dropbox'>{"Dropbox"}</option>
                        <option value='Google Drive'>{"Google Drive"}</option>
                        <option value='Nextcloud'>{"Nextcloud"}</option>
                        <option value='OneDrive'>{"OneDrive"}</option>
                        <option value='S3'>{"S3"}</option>
                    </Field>
                    <Field name="enabled"
                        id="enabled"
                        type="checkbox"
                        component={renderToggle}
                    />
                    <Field type="text"
                        name="default_target"
                        id="default_target"
                        component={renderField}
                        validate={required} required
                    />
                </Group>


                {storageProviderFormValues && ["Google Drive", "Dropbox", "OneDrive", "Nextcloud"].includes(storageProviderFormValues.storage_provider_type) && (
                    <Group title="provider-details" description="provider-details-description">
                        <React.Fragment>


                            {storageProviderFormValues && ["Google Drive", "Dropbox", "OneDrive"].includes(storageProviderFormValues.storage_provider_type) && (
                                <React.Fragment>
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
                                    <Field type="text"
                                        name="auth_url"
                                        id="auth_url"
                                        component={renderField}
                                        validate={required} required
                                    />
                                    <Field type="textarea"
                                        name="auth_url_options"
                                        id="auth_url_options"
                                        component={renderTextArea}
                                        validate={[json, required]} required
                                    />
                                    <Field type="text"
                                        name="token_url"
                                        id="token_url"
                                        component={renderField}
                                        validate={required} required
                                    />
                                    <Field type="text"
                                        name="redirect_url"
                                        id="redirect_url"
                                        component={renderField}
                                        placeholder={redirect_url}
                                        validate={required} required
                                    />
                                    <Field type="textarea"
                                        name="scope"
                                        id="scope"
                                        component={renderTextArea}
                                        validate={required} required
                                    />
                                </React.Fragment>
                            )}
                            {storageProviderFormValues && ["OneDrive"].includes(storageProviderFormValues.storage_provider_type) && (
                                <Field type="text"
                                    name="root_drive_url"
                                    id="root_drive_url"
                                    component={renderField}
                                    validate={required} required
                                />
                            )}
                            {storageProviderFormValues && ["Nextcloud"].includes(storageProviderFormValues.storage_provider_type) && (
                                <React.Fragment>
                                    <Field type="text"
                                        name="webdav_url"
                                        id="webdav_url"
                                        component={renderField}
                                        validate={required} required
                                    />

                                </React.Fragment>

                            )}



                        </React.Fragment>
                    </Group>
                    )}


                {storageProviderFormValues && storageProviderFormValues.storage_provider_type && (
                <Group title="volume" description="volume-description">
                    <Field type="textarea"
                        name="volume_config"
                        id="volume_config"
                        component={renderTextArea}
                        validate={[json, required]} required
                    />

                    <Field type="textarea"
                        name="mount_config"
                        id="mount_config"
                        component={renderTextArea}
                        validate={[json, required]} required
                    />
                </Group>
                )}


                 <FormFooter cancel={() => this.props.history.push("/storage_providers")} />
            </Groups>
        );
    }
}

StorageProviderConfigFormTemplate.proptypes = {
    createStorageProvider: Proptypes.func,
    updateStorageProvider: Proptypes.func,
    fromUpdate: Proptypes.bool,
};

let StorageProviderConfigFormWithRouter = withRouter(StorageProviderConfigFormTemplate);


const selector = formValueSelector('StorageProviderConfigForm');

let StorageProviderConfigForm =  connect(state =>{


            return {
                createStorageProviderError: state.storage_provider.createStorageProviderError,
                updateStorageProviderLoading: state.storage_provider.updateStorageProviderLoading,
                updateStorageProviderError: state.storage_provider.updateStorageProviderError,
                storage_providers: state.storage_provider.storage_providers || [],
                storageProviderFormValues: state.form && state.form.StorageProviderConfigForm && state.form.StorageProviderConfigForm.values ? state.form.StorageProviderConfigForm.values : null,

            }
    },

    dispatch =>
        ({
            getStorageProviders: () => dispatch(getStorageProviders()),
        }))(StorageProviderConfigFormWithRouter);
        const StorageProviderConfigFormTranslated = withTranslation('common')(StorageProviderConfigForm)
export default reduxForm({
    form: "StorageProviderConfigForm",
})(StorageProviderConfigFormTranslated);