import React,{ Component } from "react";
import { Field, reduxForm } from "redux-form";
import { renderField, renderTextArea, renderCheckbox, password, required, renderToggle, renderSelectField } from "../../../utils/formValidations.js";
import { getAdminUsers, getUsersId } from "../../../actions/actionAdminUser";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Proptypes from "prop-types";
import {withTranslation} from "react-i18next";
import { Groups, Group, Button, FormFooter, FormField } from "../../../components/Form/Form.js"
import { get_saml_configs } from "../../../actions/actionSaml.js";
import { getOidcConfigs } from "../../../actions/actionOidc.js";


class UserFormTemplate extends Component  {
    constructor(props){
        super(props);
        this.state  = {
            currentUser: {
                realm: 'local'
            }
        };
    }

    async componentDidMount(){
        if (this.props.fromUpdate){
            const data = await this.props.getAdminUserById(this.props.userId);

            const user = data.response.user;
            this.setState({ currentUser: user });

            this.props.initialize({
                username: user.username,
                first_name: user.first_name,
                last_name: user.last_name,
                locked: user.locked,
                disabled: user.disabled,
                notes: user.notes,
                realm: user.realm,
                oidc_id: user.oidc_id,
                saml_id: user.saml_id,
                organization: user.organization,
                phone: user.phone,
                city: user.city,
                state: user.state,
                country: user.country,
                email: user.email,
                custom_attribute_1: user.custom_attribute_1,
                custom_attribute_2: user.custom_attribute_2,
                custom_attribute_3: user.custom_attribute_3,
            });
        }
    }

    render(){
        const {handleSubmit,fromUpdate, t} = this.props;
        const {currentUser} =  this.state;
        const checked = currentUser && currentUser.locked;
        const disabledChecked = currentUser && currentUser.disabled;
        const check = false;
        const canResetPassword = currentUser && currentUser.realm === "local";

        const updateRealm = (e) => {
            const user = { ...currentUser }
            const realm = e.target.value
            user.realm = realm
            this.setState({ currentUser: user });
            if (realm == 'saml') {
                this.props.getSamlConfigs()
            }
            if (realm == 'oidc') {
                this.props.getOidcConfigs()
            }
        }
        if (currentUser || !this.props.fromUpdate) { // defaultChecked doesn't work properly without this gate
        return (
            <Groups onSubmit={handleSubmit(this.props.save)} section={this.props.section}>
                <Group title="login-info" description="login-info-description">
                    <Field
                        type="text"
                        name="username"
                        component={renderField}
                        validate={required} required
                    />
                    {fromUpdate !== true && currentUser?.realm == 'local' &&
                        <Field
                            type="password"
                            name="password"
                            component={renderField}
                            validate={[required, password]} required
                        />
                    }
                    <Field
                        name="realm"
                        disabled={fromUpdate}
                        component={renderSelectField}
                        onChange={updateRealm}
                    >
                        <option value="local">Local</option>
                        <option value="ldap">LDAP</option>
                        <option value="saml">SAML</option>
                        <option value="oidc">OIDC</option>
                    </Field>
                    {!this.props.fromUpdate && currentUser && currentUser.realm == 'oidc' && (
                        <FormField resetSection={true} label="auth.openid-configurations">
                        <Field
                            name="oidc_id"
                            disabled={fromUpdate}
                            component={renderSelectField}
                            required={currentUser.realm == 'oidc'}
                        >
                            <option value="">Select...</option>
                            {this.props.oidc_configs.map(config => <option value={config.oidc_id}>{config.display_name}</option>)}
                        </Field>
                        </FormField>
                    
                    )}
                    {!this.props.fromUpdate && currentUser && currentUser.realm == 'saml' && (
                        <FormField resetSection={true} label="auth.saml-configurations">
                        <Field
                            name="saml_id"
                            disabled={fromUpdate}
                            component={renderSelectField}
                            required={currentUser.realm == 'saml'}
                        >
                            <option value="">Select...</option>
                            {this.props.saml_configs.map(config => <option value={config.saml_id}>{config.display_name}</option>)}
                        </Field>
                        </FormField>
                    )}
                </Group>
                <Group title="actions" description="actions-description">
                        <Field name="locked"
                        id="locked"
                            checked={checked}
                            component={renderToggle}
                        />
                        <Field name="disabled"
                            checked={disabledChecked}
                            component={renderToggle}
                        />
                        <Field name="set_two_factor"
                            checked={check}
                            component={renderToggle}
                        />
                        <Field name="reset_webauthn"
                            checked={disabledChecked}
                            component={renderToggle}
                        />
                    {canResetPassword && (
                            <Field name="force_password_reset"
                                checked={false}
                                component={renderToggle}
                            />
                    )}

                </Group>

                <Group title="personal-info" description="personal-info-description">
                        <Field
                            name="email"
                            component={renderField}
                        />
                        <Field type="text"
                            name="first_name"
                            component={renderField}
                        />
                        <Field type="text"
                            name="last_name"
                            component={renderField}
                        />
                        <Field type="text"
                            name="organization"
                            component={renderField}
                        />
                        <Field
                            name="phone"
                            component={renderField}
                        />
                        <Field
                            name="city"
                            component={renderField}
                        />
                        <Field
                            name="state"
                            component={renderField}
                        />
                        <Field
                            name="country"
                            component={renderField}
                        />

                </Group>
            
                <Group title="additional-info" description="additional-info-description">
                        <Field type="text"
                            name="notes"
                            component={renderTextArea}
                        />
                        <Field
                            name="custom_attribute_1"
                            component={renderField}
                        />
                        <Field
                            name="custom_attribute_2"
                            component={renderField}
                        />
                        <Field
                            name="custom_attribute_3"
                            component={renderField}
                        />
                </Group>
                <FormFooter cancel={() => this.props.history.push("/adminUser")} />
            </Groups>
        );
        }
    }
}

UserFormTemplate.propTypes = {
    getAdminUsers: Proptypes.func.isRequired,
    getAdminUserById: Proptypes.func.isRequired,
    updatErrorWarning: Proptypes.func,
    updateUsersError: Proptypes.func,
    getUsersLoading: Proptypes.bool,
    errorUpdateMessage: Proptypes.func,
    createUserWarning: Proptypes.func,
    createUsersError: Proptypes.func,
    users: Proptypes.array,
    history: Proptypes.object.isRequired,
    handleSubmit: Proptypes.func,
    fromUpdate: Proptypes.bool, 
    userId: Proptypes.string,
    initialize: Proptypes.func,
    createUser: Proptypes.func
};


const UserFormTemplateTranslated = withTranslation('common')(UserFormTemplate)
let UserFormWithRouter = withRouter(UserFormTemplateTranslated);

let UserForm =  connect(state => 
    ({
        users: state.admin.users || [],
        errorUpdateMessage: state.admin.errorUpdateMessage || null,
        updatErrorWarning: state.admin.updatErrorWarning || null,
        getUsersLoading: state.admin.getUsersLoading || false,
        updateUsersError: state.admin.updateUsersError || null,
        createUserWarning: state.admin.createUserWarning || null,
        createUsersError: state.admin.createUsersError || null,
        oidc_configs: state.oidc.oidc_configs || [],
        saml_configs: state.saml.saml_configs || [],
    }),
dispatch => 
    ({
        getAdminUsers: () => dispatch(getAdminUsers()),
        getSamlConfigs: () => dispatch(get_saml_configs()),
        getOidcConfigs: () => dispatch(getOidcConfigs()),
        getAdminUserById: (id) => dispatch(getUsersId(id))
    }))(UserFormWithRouter);

export default reduxForm({
    form: "userForm",
    fields: ["first_name"], 
})(UserForm);