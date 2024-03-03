import React, { Component } from "react";
import { Field, reduxForm } from "redux-form";
import { connect } from "react-redux";
import { setShowProfile, setProfileSection, setProfileDropdown } from "../../actions/actionDashboard";
import { NotificationManager } from "react-notifications";
import { PROGRAM_DATA } from "../../constants/Constants.js";
import Select from "react-select";
import { USER_NAME, USER_ID } from "../../constants/Constants";
import DataTable from "../../components/Table/Table";
import { renderField, renderTextArea, required, password, renderToggle } from "../../utils/formValidations";
import { setThemeColor, arrayToArrayBuffer, arrayBufferToBase64, getWebauthnCredential} from "../../utils/helpers.js";
import moment from "moment";
import { logout } from "../../actions/actionLogin";
import {
  getUser,
  setUserPassword,
  getUserAttributes,
  updateUserAttribute,
  getUserUsageDump,
  getSubscriptionInfo,
  getLanguages,
  getTimezones,
  getUserAuthSettings,
  webauthnGetAuthOptions,
  clearUserTwoFactor,
  checkPassword,
  setSecretAuthenticated,
  twoFactorAuthAuthenticated,
  webauthnAuthenticatedRegisterFinish,
  webauthnAuthenticatedRegisterStart,
} from "../../actions/actionUser";
import {getAvailableStorageProviders} from "../../actions/actionStorageMapping";
import Proptypes from "prop-types";
import Logout from "../Logout/Logout";
import StripeSignup from "../../components/Stripe/Signup/Signup.js";
import StripeSubscription from "../../components/Stripe/Subscription/Subscription.js";
import { getNewToken } from "../../actions/actionLogin";
import {withTranslation, Trans} from "react-i18next";
import StorageMapping from "../StorageMapping/StorageMapping";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket } from "@fortawesome/pro-light-svg-icons/faArrowRightFromBracket";
import { faKey } from "@fortawesome/pro-light-svg-icons/faKey";
import { faPencil } from "@fortawesome/pro-light-svg-icons/faPencil";
import { FormField, Groups } from "../Form/Form";
import { Modal, ModalFooter } from "../Form/Modal";
import { languages } from "../../utils/helpers";
import { SetTwoFactorModal } from "../SetTwoFactorModal/SetTwoFactorModal";
import { faChevronRight } from "@fortawesome/pro-light-svg-icons/faChevronRight";
import { faBan } from "@fortawesome/pro-light-svg-icons/faBan";
import { faArrowUpFromLine } from "@fortawesome/pro-light-svg-icons/faArrowUpFromLine";

const validate = values => {
  const errors = {};
  if (values.newPassword !== values.confirmPassword) {
    errors.confirmPassword = <Trans ns="common" i18nKey="users.Passwords Do Not Match"></Trans>;
  }
  return errors;
};

class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      keymodal: false,
      resetpasswordmodal: false,
      showLogout: false,
      clearSetTwoFactorModal: false,
      authtype: 'none',
      set2faModal: false,
      passwordModal: false,
      password: '',
      authenticatorModal: false,
    };

    this.resetPassword = this.resetPassword.bind(this);
    this.updateSSHKey = this.updateSSHKey.bind(this);
    this.updateSSHKeySuccess = this.updateSSHKeySuccess.bind(this);
    this.updateSSHKeyError = this.updateSSHKeyError.bind(this);
    this.toggleKey = this.toggleKey.bind(this);
    this.toggleReset = this.toggleReset.bind(this);
    this.dropdownTheme = this.dropdownTheme.bind(this);
    this.dropdownLanguage = this.dropdownLanguage.bind(this);
    this.dropdownTimezone = this.dropdownTimezone.bind(this);
    this.dropdownImage = this.dropdownImage.bind(this);
    this.dropdownChange = this.dropdownChange.bind(this);
    this.toggleChange = this.toggleChange.bind(this);

    this.handlePasswordResetFailure = this.handlePasswordResetFailure.bind(this);
    this.handlePasswordResetFailure = this.handlePasswordResetFailure.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.setShowProfile = this.setShowProfile.bind(this);

    this.groups = this.groups.bind(this);
    this.renderUsageDetails = this.renderUsageDetails.bind(this);
    this.resetPasswordModal = this.resetPasswordModal.bind(this);
    this.newSshModal = this.newSshModal.bind(this);
    this.details = this.details.bind(this);
    this.settings = this.settings.bind(this);
    this.sshkeys = this.sshkeys.bind(this);
    this.sessions = this.sessions.bind(this);
    this.authentication = this.authentication.bind(this);
    this.closeProfile = this.closeProfile.bind(this);

    this.downloadBlob = this.downloadBlob.bind(this);

    this.handleResponse = this.handleResponse.bind(this);
    this.refreshToken = this.refreshToken.bind(this)
    this.updateLang = this.updateLang.bind(this)
    this.clearSetTwoFactorModal = this.clearSetTwoFactorModal.bind(this);
    this.toggleClearTwoFactor = this.toggleClearTwoFactor.bind(this);
    this.submitClearMultifactor = this.submitClearMultifactor.bind(this);

    this.clearSetTwoFactorModal = this.clearSetTwoFactorModal.bind(this);
    this.handleSetSecret = this.handleSetSecret.bind(this);
    this.handleHardSetSecret = this.handleHardSetSecret.bind(this);
    this.toggle2faModal = this.toggle2faModal.bind(this);
    this.hardToken = this.hardToken.bind(this);
    this.softToken = this.softToken.bind(this);
    this.addSetTwoFactorModal = this.addSetTwoFactorModal.bind(this);
    this.noneAuthType = this.noneAuthType.bind(this)
    this.checkPassword = this.checkPassword.bind(this)
    this.togglePasswordModal = this.togglePasswordModal.bind(this)
    this.handleAuthenticator = this.handleAuthenticator.bind(this);
    this.toggleAuthenticatorModal = this.toggleAuthenticatorModal.bind(this);
    this.authenticatorModal = this.authenticatorModal.bind(this);
  }

  updateLang(lang) {
    const {i18n} = this.props;
    i18n.changeLanguage(lang.value)
    window.localStorage.setItem("i18nextLng", lang.value);
  }


  closeProfile() {
    this.props.setShowProfile(false)
    this.props.setProfileDropdown(false)
  }

  async componentDidMount() {
    let data = {
        target_storage_mapping : {
          user_id: USER_ID
        }
    }

    await Promise.all([this.props.getUserAttributes(), this.props.getUser(), this.props.getUserUsageDump(), this.props.getSubscriptionInfo(), this.props.getAvailableStorageProviders(data), this.props.getLanguages(), this.props.getTimezones(), this.props.getUserAuthSettings()]);
    this.setState({ loaded: true })
  }

  async dropdownTheme(option) {
    const { t } = this.props;
    try {
      this.dropdownChange(option.value, 'theme', 'Theme', option.label);
      setThemeColor(option.value);
    } catch (e) {

    }
  }

  async dropdownLanguage(option) {
    try {
      this.dropdownChange(option.value, 'preferred_language', 'Kasm Session Language', option.label);
    } catch (e) {

    }
  }

  async dropdownTimezone(option) {
    try {
      this.dropdownChange(option.value, 'preferred_timezone', 'Kasm Session Timezone', option.label);
    } catch (e) {

    }
  }
  dropdownImage(value) {
    const { image_id: imageId, friendly_name: friendlyName } = value;
    const { t } = this.props;
    this.dropdownChange(imageId, 'default_image', 'Default Workspace Image', friendlyName);
  }

  async dropdownChange(value, name, title, friendlyName) {
    try {
      await this.props.updateUserAttribute({
        [name]: value
      })
      this.handleSuccess(title, friendlyName)
      this.props.getUserAttributes()
    } catch (e) {
      this.handlFailure()
    }
  }

  async toggleChange(event) {
    try {
      await this.props.updateUserAttribute({
        [event.target.name]: event.target.checked
      })
      const value = (event.target.checked) ? 'On' : 'Off'
      this.handleSuccess(event.target.title, value)
    } catch (e) {
      this.handlFailure()
    }
  }

  handleSuccess(title, value) {
    const { updateUserErrorMessage, t } = this.props;
    if (updateUserErrorMessage) {
      NotificationManager.error(updateUserErrorMessage, t("profile.Update User Profile"), 5000);
    } else {
      NotificationManager.success(t('profile.successful_update', { title, value }), t("profile.Update User Profile"), 2000);
    }
  }

  handlFailure() {
    const { updateUserErrorMessage, updateUserAttrError, t } = this.props;
    if (updateUserAttrError) {
      NotificationManager.error(updateUserAttrError, t("profile.Update User Profile"));
    } else if (updateUserErrorMessage) {
      NotificationManager.error(updateUserErrorMessage, t("profile.Update User Profile"));
    } else {
      NotificationManager.error(t("profile.Error updating attribute"), t("profile.Update User Profile"));
    }
  }

  downloadBlob() {
    const { userattributes } = this.props;
    let jsonBlob = new Blob([userattributes.ssh_public_key]);
    const blobUrl = URL.createObjectURL(jsonBlob);

    const link = document.createElement("a");

    link.href = blobUrl;
    link.download = 'id_rsa.pub';

    document.body.appendChild(link);

    link.dispatchEvent(
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
      })
    );
    document.body.removeChild(link);
  };

  async registerWebauthn(){
    const {t} = this.props
    let loginData =  {
      username: this.props.username,
      password: this.state.password,
    }
    try {
      let response = await this.props.webauthnAuthenticatedRegisterStart(loginData);
      if (response.response.error_message) {
        throw new Error(response.response.error_message)
      }
      let registration_options = response.response.registration_options
      registration_options.challenge = arrayToArrayBuffer(registration_options.challenge, 'challenge')
      registration_options.user.id = arrayToArrayBuffer(registration_options.user.id, 'user.id')
      let credential = await navigator.credentials.create({
        publicKey: registration_options
      })
      let body = {
        credential: {
          id: credential.id,
          rawId: arrayBufferToBase64(credential.rawId),
          response: {
            attestationObject: arrayBufferToBase64(credential.response.attestationObject),
            clientDataJSON: arrayBufferToBase64(credential.response.clientDataJSON)
          }
        },
        request_id: response.response.request_id,
        ...loginData,
      };
      response = await this.props.webauthnAuthenticatedRegisterFinish(body);
      if (response.response.error_message) {
        throw new Error(response.response.error_message)
      }
      this.setState({set2faModal: false});
      NotificationManager.success(t('auth.successful-webauthn-register'), t('profile.register-webauthn'), 3000)
      setTimeout(this.handleLogout(), 2000);
    } catch (e) {
      NotificationManager.error(e.message,t('profile.register-webauthn'), 3000);
    }
  };

  async updateSSHKey(formData) {
    const { ssh_private_key: sshPrivateKey, ssh_passphrase: sshPassphrase } = formData;

    try {
      await this.props.updateUserAttribute({
        "ssh_private_key": sshPrivateKey,
        "ssh_passphrase": sshPassphrase,
      })
      this.updateSSHKeySuccess()
    } catch (e) {
      this.updateSSHKeyError()
    }

  }

  updateSSHKeySuccess() {
    const { updateUserErrorMessage, t } = this.props;
    if (updateUserErrorMessage) {
      NotificationManager.error(updateUserErrorMessage, t("profile.Update SSH Keys"), 5000);
    } else {
      NotificationManager.success(t("profile.Successfully updated SSH Keys"), t("profile.Update SSH Keys"), 2000);
      this.setState({ keymodal: false })
      this.props.initialize({ ssh_passphrase: "", ssh_private_key: "" });
    }
    this.props.getUserAttributes()
  }


  updateSSHKeyError() {
    const { updateUserErrorMessage, updateUserAttrError, t } = this.props;
    if (updateUserAttrError) {
      NotificationManager.error(updateUserAttrError, t("profile.Update SSH Keys"));
    } else if (updateUserErrorMessage) {
      NotificationManager.error(updateUserErrorMessage, t("profile.Update SSH Keys"));
    } else
      NotificationManager.error(t("profile.Error updating SSH Keys"), t("profile.Update SSH Keys"));
    this.props.getUserAttributes()
  }

  resetPassword(formData) {
    this.props.setUserPassword(formData)
      .then(() => { this.handlePasswordResetSuccess() })
      .catch(() => { this.handlePasswordResetFailure() });
  }

  async checkPassword(formData) {
    const {t} = this.props
    let loginResp = null
    try{
      loginResp = await this.props.checkPassword(formData)

      if (loginResp.response.error_message) {
        throw new Error(loginResp.response.error_message)
      }
      this.setState({password: formData.password, passwordModal: false, set2faModal: true, authtype: 'none'})
      // Reset password field in form
      this.props.change('password', '')
    } catch(e) {
      NotificationManager.error(e.message, t("profile.check_password"), 3000)
    }
  }

  handlePasswordResetSuccess() {
    const { errorMessage, t } = this.props;
    if (errorMessage) {
      NotificationManager.error(errorMessage, t("profile.Reset Password"), 3000);
    }
    else {
      NotificationManager.success(t("profile.Successfully Reset Password"), t("profile.Reset Password"), 3000);
      this.setState({ resetpasswordmodal: false })
      this.props.initialize({ newPassword: "", password: "", confirmPassword: "" });
      setTimeout(this.handleLogout(), 1000);
    }
  }

  handlePasswordResetFailure() {
    const { setUserPasswordError, t } = this.props;
    if (setUserPasswordError) {
      NotificationManager.error(setUserPasswordError, t("profile.Reset Password"), 3000);
    }
    else {
      NotificationManager.error(t("profile.Failed to Reset Password"), t("profile.Reset Password"), 3000);
    }

  }
  handleLogout() {
    const { t } = this.props;
    alert(t("profile.logout"));
    this.props.logout();
  }

  handleClearMultifactor() {
    this.setState({ clearSetTwoFactorModal: true })
  }

async submitClearMultifactor(data) {
    const { userAuthSettings, username, t } = this.props
    let webauthnCredential = null
    let authOptions = null
    let clearTwoFactorResp = null
    let logindata =  {
        username: username,
        password: data.password,
    }
    try{
      if (userAuthSettings.set_webauthn) {
        authOptions = await this.props.webauthnGetAuthOptions()
        
        if (authOptions.response.error_message) {
          throw new Error(authOptions.response.error_message)
        }
        webauthnCredential = await getWebauthnCredential({
            authenticationOptions: authOptions.response.webauthn_authentication_options,
            requestId: authOptions.response.request_id,
            loginData: logindata,
        })
      }
      clearTwoFactorResp = await this.props.clearUserTwoFactor({
        ...webauthnCredential,
        ...logindata,
        code: data.code,
      })
      if (clearTwoFactorResp.response.error_message) {
          throw new Error(clearTwoFactorResp.response.error_message)
      }
      
      this.setState({clearSetTwoFactorModal: false})
      NotificationManager.success(t("profile.successfully_cleared_two_factor"), t("profile.clear_two_factor"), 3000);
      setTimeout(this.handleLogout(), 2000);
    } catch (e) {
      NotificationManager.error(e.message, t("profile.clear_two_factor"), 3000);
    }
  }

  setShowProfile() {
    this.props.setShowProfile(true);
  }

  clearSetTwoFactorModal() {
    const { handleSubmit, submitting, userAuthSettings, t } = this.props;

    return (
      <Modal
        icon={<FontAwesomeIcon icon={faKey} />}
        iconBg="tw-bg-blue-500 tw-text-white"
        title="profile.remove_two_factor"
        contentRaw={
          <Groups className="tw-text-left tw-mt-8" noPadding section="profile" onSubmit={handleSubmit(this.submitClearMultifactor)}>
            <FormField label="Current Password">
              <Field
                id="password"
                type="password"
                name="password"
                component={renderField}
                validate={[required]} required
              />

            </FormField>
            {userAuthSettings.set_two_factor ?
              <FormField label="two_factor_token">
                <Field
                  name="code"
                  id="code"
                  type="text"
                  component={renderField}
                  validate={[required]} required
                />
              </FormField>
            : null}
            <ModalFooter cancel={this.toggleClearTwoFactor} saving={submitting} saveName='buttons.Submit' />
          </Groups>
        }
        open={this.state.clearSetTwoFactorModal}
        setOpen={this.toggleClearTwoFactor}
      />
    )
  }
  handleSetSecret(){
    //call auth again
    this.setState({set2faModal: false, authenticatorModal: true})
  }
  
  async handleHardSetSecret(data) {
    const { t } = this.props;
    let loginData =  {
      username: this.props.username,
      password: this.state.password,
      target_token: {serial_number: data.serial_number},
    }
    try {
      let response = await this.props.setSecretAuthenticated(loginData)
      if (response.response.error_message) {
        throw new Error(response.response.error_message)
      }
      this.setState({set2faModal: false, authenticatorModal: true});
    } catch (e) {
      NotificationManager.error(e.message,t('auth.token-registration-failed'), 3000);
    }
    
  }

  toggle2faModal(){
    this.setState({set2faModal: !this.state.set2faModal});
  }

  hardToken(){
    this.setState({authtype: 'hard'})
  }
  
  softToken(){
    this.setState({authtype: 'soft'})
  }

  async handleUseTotpButton() {
    const {t} = this.props
    let body = {
      password: this.state.password
    }
    try {
      let response = await this.props.setSecretAuthenticated(body)
      if (response.response.error_message){
        throw new Error(response.response.error_message)
      }
      this.setState({authtype: 'soft'})
    } catch (e) {
      NotificationManager.error(e.message,t('profile.set_secret'))
    }
  }

  addSetTwoFactorModal() {
    const {handleSubmit, userAuthSettings, generatedSecret, qrCode, t} = this.props
    return ( 
      <SetTwoFactorModal
        handleWebAuthn={() => this.registerWebauthn()}
        handleSoftTotp={() => this.handleSetSecret()}
        handleHardTotp={handleSubmit(this.handleHardSetSecret)}
        authType={this.state.authtype}
        open={this.state.set2faModal}
        setOpen={this.toggle2faModal}
        qrCode={qrCode}
        closeAction={() => this.toggle2faModal()}
        allow_webauthn_2fa={userAuthSettings.allow_webauthn_2fa}
        allow_totp_2fa={userAuthSettings.allow_totp_2fa}
        handleUseHardTotpButton={() => this.hardToken()}
        handleUseSoftTotpButton={() => this.handleUseTotpButton()}
        generatedSecret={generatedSecret}
        t={t}
        handleBackButton={() => this.noneAuthType()}
      />
    )
  }

  noneAuthType(){
    this.setState({authtype: 'none'})
  }

  authenticatorModal(){
    const {handleSubmit} = this.props;
    return (
      <Modal
        icon={<FontAwesomeIcon icon={faKey} />}
        iconBg="tw-bg-blue-500 tw-text-white"
        title="auth.two-factor-authentication"
        contentRaw={
          <Groups className="tw-text-left tw-mt-8" noPadding section="auth" onSubmit={handleSubmit(this.handleAuthenticator)}>
            <FormField label="enter-code">
              <Field
                  autoFocus={true}
                  name="authCode"
                  type="text"
                  component={renderField} />
            </FormField>
            <ModalFooter cancel={this.toggleAuthenticatorModal} saveName='buttons.Submit' />
          </Groups>
        }
        open={this.state.authenticatorModal}
        setOpen={this.toggleAuthenticatorModal}
      />
    )
  }

  toggleAuthenticatorModal(){
    this.setState({authenticatorModal: false})
  }

  async handleAuthenticator({ authCode }) {
    const {t} = this.props
    //Do authorization in backend
    let logindata =  {
      username: this.props.username,
      password: this.state.password,
      code: authCode,
    }
    try {
      let auth_resp = await this.props.twoFactorAuthAuthenticated(logindata)

      if (auth_resp.response.error_message) {
        throw new Error(auth_resp.response.error_message)
      }
      NotificationManager.success(t("profile.successful_add_token", t("profile.add_token"), 3000))
      this.setState({authenticatorModal: false})
      setTimeout(this.handleLogout(), 2000);
    } catch (e) {
      NotificationManager.error(e.message, t("profile.add_token"), 3000)
    }
}

  groups() {
    const { user } = this.props;
    let list = [];
    {
      user.groups && user.groups.map((group) => {
        list.push(
          <div className="tw-flex tw-h-10 tw-items-center tw-shadow-md tw-overflow-hidden tw-rounded tw-bg-white/70 dark:tw-bg-slate-900/70 dark:tw-border dark:tw-border-slate-700/70 dark:tw-border-solid" key={group.group_id}>
            <div className="tw-h-10 tw-w-20 tw-bg-blue-500 tw-flex tw-items-center tw-justify-center">
              <svg className="tw-w-6 tw-h-6 tw-fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M274.7 304H173.3c-95.73 0-173.3 77.6-173.3 173.3C0 496.5 15.52 512 34.66 512H413.3C432.5 512 448 496.5 448 477.3C448 381.6 370.4 304 274.7 304zM413.3 480H34.66C33.2 480 32 478.8 32 477.3C32 399.4 95.4 336 173.3 336H274.7C352.6 336 416 399.4 416 477.3C416 478.8 414.8 480 413.3 480zM224 256c70.7 0 128-57.31 128-128S294.7 0 224 0C153.3 0 96 57.31 96 128S153.3 256 224 256zM224 32c52.94 0 96 43.06 96 96c0 52.93-43.06 96-96 96S128 180.9 128 128C128 75.06 171.1 32 224 32zM375.1 241C392.9 250.8 412.3 256 432 256C493.8 256 544 205.8 544 144S493.8 32 432 32c-12.83 0-25.39 2.156-37.34 6.391c-8.328 2.953-12.69 12.09-9.734 20.42c2.953 8.344 12.12 12.66 20.42 9.734C413.9 65.53 422.8 64 432 64C476.1 64 512 99.89 512 144S476.1 224 432 224c-14.08 0-27.91-3.703-39.98-10.69c-7.656-4.453-17.44-1.828-21.86 5.828C365.7 226.8 368.3 236.6 375.1 241zM490.7 320H448c-8.844 0-16 7.156-16 16S439.2 352 448 352h42.67C555.4 352 608 404.6 608 469.3C608 475.2 603.2 480 597.3 480H496c-8.844 0-16 7.156-16 16s7.156 16 16 16h101.3C620.9 512 640 492.9 640 469.3C640 386.1 573 320 490.7 320z" /></svg>
            </div><div className="tw-px-6">{group.name}</div>
          </div>
        )
      }
      )
    }
    return (<div className="tw-flex tw-flex-col sm:tw-flex-row tw-gap-4 tw-mt-8">{list}</div>)
  }

  toggleKey() {
    this.setState({ keymodal: !this.state.keymodal })
  }

  toggleReset() {
    this.setState({ resetpasswordmodal: !this.state.resetpasswordmodal })
  }
  
  toggleClearTwoFactor() {
    this.setState({ clearSetTwoFactorModal: !this.state.clearSetTwoFactorModal })
  }
  
  togglePasswordModal() {
    this.setState({ passwordModal: !this.state.passwordModal })
  }

  renderKasms(kasms) {
    const { t } = this.props;
    if (kasms) {
      return (
        kasms.map((kasm, i) =>
          <div key={i} className="tw-bg-white/70 dark:tw-bg-slate-900/70 dark:tw-border dark:tw-border-slate-700/70 dark:tw-border-solid tw-rounded tw-shadow-md tw-mb-4 tw-flex tw-flex-col tw-font-normal tw-p-6 tw-py-4">

            <div className="tw-flex tw-flex-col md:tw-flex-row tw-justify-between">
              <div><span className="tw-font-bold tw-mr-2">{t("profile.ID")}:</span>{kasm.kasm_id}</div>
              <div><span className="tw-font-bold tw-mr-2">{t("profile.Started")}</span>{moment.utc(kasm.start_date).local().format("lll")}</div>
            </div>
            <div className="tw-flex tw-flex-col md:tw-flex-row tw-justify-between">
              <div><span className="tw-font-bold tw-mr-2">{t("profile.Last Accessed")}</span>{moment.utc(kasm.keepalive_date).local().format("lll")}</div>
              <div><span className="tw-font-bold tw-mr-2">{t("profile.Expires")}</span>{moment.utc(kasm.expiration_date).local().format("lll")}</div>
            </div>
          </div>
        ));
    }
  }

  renderUsageDetails() {
    const { t } = this.props;
    if (!this.props.usageDump) {
      return t("profile.No Usage");
    }

    const columns = [
      {
        type: "text",
        accessor: "image_friendly_name",
        name: t("profile.Image"),
        filterable: true,
        sortable: true,
        colSize: 'minmax(150px, 1.4fr)',
        defaultSort: false
      },
      {
        type: "date",
        accessor: "start_date",
        name: t("profile.Created"),
        filterable: true,
        sortable: true,
        defaultSort: true,
        defaultOrder: 'desc',
        cell: (data) => <div>{moment(data.value).isValid() ? <React.Fragment><div className="text-muted-more tw-text-xs">{moment.utc(data.value).local().format('ll')}</div><div>{moment.utc(data.value).local().format('LT')}</div></React.Fragment> : "-"}</div>
      },
      {
        type: "date",
        accessor: "destroyed_date",
        name: t("profile.Stopped On"),
        filterable: true,
        sortable: true,
        cell: (data) => <div>{moment(data.value).isValid() ? <React.Fragment><div className="text-muted-more tw-text-xs">{moment.utc(data.value).local().format('ll')}</div><div>{moment.utc(data.value).local().format('LT')}</div></React.Fragment> : "-"}</div>
      },
      {
        type: "text",
        accessor: "destroy_reason",
        name: t("profile.Stopped By"),
        filterable: true,
        sortable: true
      },
      {
        accessor: "usage_hours",
        name: t("profile.Usage (hours)"),
        filterable: true,
        sortable: true
      },
    ];

    return (
      <DataTable
        id="user-profilea"
        data={this.props.usageDump.account_dump}
        columns={columns}
        mainId="account_id"
        defaultSorters={[{
          id: 'start_date',
          desc: true
        }]}

      />
    )
  }

  resetPasswordModal() {
    const { handleSubmit, submitting, user, t } = this.props;

    return (
      <Modal
        icon={<FontAwesomeIcon icon={faKey} />}
        iconBg="tw-bg-blue-500 tw-text-white"
        title="auth.reset-password"
        contentRaw={
          <Groups className="tw-text-left tw-mt-8" noPadding section="profile" onSubmit={handleSubmit(this.resetPassword)}>
            <FormField label="Current Password">
              <Field
                id="password"
                type="password"
                name="password"
                component={renderField}
                validate={[required]} required
              />

            </FormField>
            <FormField label="New Password">
              <Field
                id="newPassword"
                type="password"
                name="newPassword"
                component={renderField}
                validate={[required, password]} required
              />

            </FormField>
            <FormField label="Confirm Password">
              <Field
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                component={renderField}
                validate={[required, password]} required
              />

            </FormField>
            {user.two_factor &&
              <FormField label="Reset Two Factor Authentication">
                <Field name="setTwoFactor"
                  id="setTwoFactor"
                  type="checkbox"
                  check={false}
                  component={renderToggle}
                />

              </FormField>
            }
            <ModalFooter cancel={this.toggleReset} saving={submitting} saveName='profile.Reset Password' />
          </Groups>
        }
        open={this.state.resetpasswordmodal}
        setOpen={this.toggleReset}

      />


    )
  }

  passwordModal() {
    const { handleSubmit, submitting, user, t } = this.props;

    return (
      <Modal
        icon={<FontAwesomeIcon icon={faKey} />}
        iconBg="tw-bg-blue-500 tw-text-white"
        title="profile.check_password"
        contentRaw={
          <Groups className="tw-text-left tw-mt-8" noPadding section="profile" onSubmit={handleSubmit(this.checkPassword)}>
            <FormField label={t('profile.Current Password')}>
              <Field
                id="password"
                type="password"
                name="password"
                component={renderField}
                validate={[required]} required
              />
            </FormField>
            <ModalFooter cancel={this.togglePasswordModal} saving={submitting} saveName='buttons.Submit' />
          </Groups>
        }
        open={this.state.passwordModal}
        setOpen={this.togglePasswordModal}
      />
    )
  }

  newSshModal() {
    const { handleSubmit, submitting, t } = this.props;

    return (
      <Modal
        icon={<FontAwesomeIcon icon={faKey} />}
        iconBg="tw-bg-blue-500 tw-text-white"
        title="auth.reset-password"
        contentRaw={
          <Groups className="tw-text-left tw-mt-8" noPadding section="profile" onSubmit={handleSubmit(this.updateSSHKey)}>
            <p>{t("profile.private_key_text")}</p>
            <FormField label="ssh-private-key">
              <Field
                id="ssh_private_key"
                type="ssh_private_key"
                name="ssh_private_key"
                component={renderTextArea}
                validate={[required]} required
                placeholder="-----BEGIN RSA PRIVATE KEY-----&#10;...&#10;-----END RSA PRIVATE KEY-----"
              />

            </FormField>
            <FormField label="SSH Private Key Passphrase">
              <Field
                id="ssh_passphrase"
                type="password"
                name="ssh_passphrase"
                component={renderField}
              />

            </FormField>
            <ModalFooter cancel={this.toggleKey} saving={submitting} saveName='profile.Upload New Key Pair' />
          </Groups>
        }
        open={this.state.keymodal}
        setOpen={this.toggleKey}

      />
    )
  }

  details() {
    const { user, t } = this.props;

    const canResetPassword = user.realm === "local" || user.realm === "ldap";
    return (
      <React.Fragment>
        <div className="tw-text-xl tw-mb-10 tw-flex tw-h-10 tw-items-center tw-justify-between">
          {t("profile.Profile Details")}
          {canResetPassword && (<button onClick={() => this.setState({ resetpasswordmodal: true })} className="tw-rounded tw-h-10 tw-bg-blue-500 hover:tw-bg-slate-600 tw-text-sm tw-text-white tw-flex tw-items-center tw-transition">
            <span className="tw-h-10 tw-w-12 tw-flex tw-justify-center tw-items-center tw-bg-black/10">
              <svg className="tw-w-5 tw-h-5 tw-fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M344 144C344 130.7 354.7 120 368 120C381.3 120 392 130.7 392 144C392 157.3 381.3 168 368 168C354.7 168 344 157.3 344 144zM336 352C326.5 352 317.2 351.3 308.1 349.8L280.1 376.1C276.5 381.5 270.4 384 264 384H224V424C224 437.3 213.3 448 200 448H160V488C160 501.3 149.3 512 136 512H24C10.75 512 0 501.3 0 488V392C0 385.6 2.529 379.5 7.029 375L164.9 217.2C161.7 203.1 160 190.2 160 176C160 78.8 238.8 0 336 0C433.2 0 512 78.8 512 176C512 273.2 433.2 352 336 352zM336 320C415.5 320 480 255.5 480 176C480 96.47 415.5 32 336 32C256.5 32 192 96.47 192 176C192 187.7 193.4 198.1 195.1 209.7L200.1 227.2L32 395.3V480H128V416H192V352H260.7L297 315.6L313.2 318.2C320.6 319.4 328.2 320 336 320V320z" /></svg>
            </span>
            <span className="tw-px-4">{t("profile.Reset Password")}</span>

          </button>)}

        </div>
        <div className="tw-bg-white/70 dark:tw-bg-slate-900/70 dark:tw-border dark:tw-border-slate-700/70 dark:tw-border-solid tw-rounded tw-shadow-md tw-mb-4 tw-flex tw-flex-col md:tw-flex-row tw-font-normal tw-justify-between tw-items-center tw-p-6 tw-py-4">
          <div className="tw-font-medium">{t("profile.User Name")}</div>
          <div>{user.username || (<div className="tw-opacity-40">- {t("profile.Not Set")} -</div>)}</div>
        </div>
        <div className="tw-bg-white/70 dark:tw-bg-slate-900/70 dark:tw-border dark:tw-border-slate-700/70 dark:tw-border-solid tw-rounded tw-shadow-md tw-mb-4 tw-flex tw-flex-col md:tw-flex-row tw-font-normal tw-justify-between tw-items-center tw-p-6 tw-py-4">
          <div className="tw-font-medium">{t("profile.First Name")}</div>
          <div>{user.first_name || (<div className="tw-opacity-40">- {t("profile.Not Set")} -</div>)}</div>
        </div>
        <div className="tw-bg-white/70 dark:tw-bg-slate-900/70 dark:tw-border dark:tw-border-slate-700/70 dark:tw-border-solid tw-rounded tw-shadow-md tw-mb-4 tw-flex tw-flex-col md:tw-flex-row tw-font-normal tw-justify-between tw-items-center tw-p-6 tw-py-4">
          <div className="tw-font-medium">{t("profile.Last Name")}</div>
          <div>{user.last_name || (<div className="tw-opacity-40">- {t("profile.Not Set")} -</div>)}</div>
        </div>
        <div className="tw-bg-white/70 dark:tw-bg-slate-900/70 dark:tw-border dark:tw-border-slate-700/70 dark:tw-border-solid tw-rounded tw-shadow-md tw-mb-4 tw-flex tw-flex-col md:tw-flex-row tw-font-normal tw-justify-between tw-items-center tw-p-6 tw-py-4">
          <div className="tw-font-medium">{t("profile.Organization")}</div>
          <div>{user.organization || (<div className="tw-opacity-40">- {t("profile.Not Set")} -</div>)}</div>
        </div>
        <div className="tw-bg-white/70 dark:tw-bg-slate-900/70 dark:tw-border dark:tw-border-slate-700/70 dark:tw-border-solid tw-rounded tw-shadow-md tw-mb-4 tw-flex tw-flex-col md:tw-flex-row tw-font-normal tw-justify-between tw-items-center tw-p-6 tw-py-4">
          <div className="tw-font-medium">{t("profile.Phone")}</div>
          <div>{user.phone || (<div className="tw-opacity-40">- {t("profile.Not Set")} -</div>)}</div>
        </div>
        <div className="tw-bg-white/70 dark:tw-bg-slate-900/70 dark:tw-border dark:tw-border-slate-700/70 dark:tw-border-solid tw-rounded tw-shadow-md tw-mb-4 tw-flex tw-flex-col md:tw-flex-row tw-font-normal tw-justify-between tw-items-center tw-p-6 tw-py-4">
          <div className="tw-font-medium">{t("profile.Last Session")}</div>
          <div>{moment.utc(user.last_session).local().format("lll") || (<div className="tw-opacity-40">- {t("profile.Not Set")} -</div>)}</div>
        </div>

        {user.groups && this.groups()}
      </React.Fragment>
    )
  }

  settings() {
    const { userattributes, availableKasms, allLanguages, allTimezones, t } = this.props;
    const options = [
      { value: 'Auto', label: t('profile.Auto') },
      { value: 'Dark', label: t('profile.Dark') },
      { value: 'Light', label: t('profile.Light') }
    ];

    let visibleKasms = [];
    if (availableKasms) {
      availableKasms.map(opt => {
      if (opt.enabled === true && opt.hidden === false) {
        visibleKasms.push(opt);
      }
    });
    }

    let optionLanguages = [];
    allLanguages.map(opt => {
      optionLanguages.push({ label: t("language_dropdown." + opt.label), value: opt.value});
    });

    let optionTimezones = [];
    allTimezones.map(opt => {
      optionTimezones.push({ label: opt.label, value: opt.value});
    });

    const langOptions = []
    languages().map(opt => {
      if (opt.code === 'en') {
        langOptions.push({label: opt.name, value: opt.code});
      } else {
        langOptions.push({label: opt.name + ' (' + opt.nativeName + ')', value: opt.code});
      }
    });

    return (
      <React.Fragment>
        <div className="tw-text-xl tw-flex tw-mb-10 tw-h-10 tw-items-center">{t("profile.Settings")}</div>
        <div className="tw-flex tw-flex-col tw-shadow-md tw-rounded tw-bg-white/70 dark:tw-bg-slate-900/70 dark:tw-border dark:tw-border-slate-700/70 dark:tw-border-solid tw-mb-4 md:tw-flex-row tw-font-normal tw-justify-between tw-items-center tw-p-6">
          <div className="tw-max-w-xs"><h2 className="tw-text-base">{t("profile.Auto Launch Session")}</h2><p className="tw-text-xs tw-opacity-70">{t("profile.auto_launch_text")}</p></div>
          <div className="toggle"><input title="Auto Launch Session" name="auto_login_kasm" type="checkbox" id="autolaunch" onChange={this.toggleChange} defaultChecked={userattributes.auto_login_kasm} /><label htmlFor="autolaunch">Toggle</label></div>
        </div>
        <div className="tw-flex tw-flex-col tw-shadow-md tw-rounded tw-bg-white/70 dark:tw-bg-slate-900/70 dark:tw-border dark:tw-border-slate-700/70 dark:tw-border-solid tw-mb-4 md:tw-flex-row tw-font-normal tw-justify-between tw-items-center tw-p-6">
          <div className="tw-max-w-xs"><h2 className="tw-text-base">{t("profile.Chat Sound Effects")}</h2><p className="tw-text-xs tw-opacity-70">{t("profile.sound_text")}</p></div>
          <div className="toggle"><input title="Chat Sound Effects" name="chat_sfx" type="checkbox" id="chateffects" onChange={this.toggleChange} defaultChecked={userattributes.chat_sfx} /><label htmlFor="chateffects">Toggle</label></div>
        </div>
        <div className="tw-flex tw-flex-col tw-shadow-md tw-rounded tw-bg-white/70 dark:tw-bg-slate-900/70 dark:tw-border dark:tw-border-slate-700/70 dark:tw-border-solid tw-mb-4 md:tw-flex-row tw-font-normal tw-justify-between tw-items-center tw-p-6">
          <div className="tw-max-w-xs"><h2 className="tw-text-base">{t("profile.Default Workspace Image")}</h2><p className="tw-text-xs tw-opacity-70">{t("profile.default_text")}</p></div>
          <div className="tw-w-60">
            {visibleKasms &&
              <Select
                id="state-select"
                value={userattributes.default_image}
                placeholder={t("profile.placeholder_default")}
                options={visibleKasms}
                valueKey="image_id"
                labelKey="friendly_name"
                name="selected-state"
                onChange={this.dropdownImage}
              />
            }

          </div>
        </div>
        <div className="tw-flex tw-flex-col tw-shadow-md tw-rounded tw-bg-white/70 dark:tw-bg-slate-900/70 dark:tw-border dark:tw-border-slate-700/70 dark:tw-border-solid tw-mb-4 md:tw-flex-row tw-font-normal tw-justify-between tw-items-center tw-p-6">
          <div className="tw-max-w-xs"><h2 className="tw-text-base">{t("profile.Show Tips During Session")}</h2><p className="tw-text-xs tw-opacity-70">{t("profile.tip_text")}</p></div>
          <div className="toggle"><input title="Show Tips During Session" name="show_tips" type="checkbox" id="showtips" onChange={(evt) => this.toggleChange(evt)} defaultChecked={userattributes.show_tips} /><label htmlFor="showtips">Toggle</label></div>
        </div>
        <div className="tw-flex tw-flex-col tw-shadow-md tw-rounded tw-bg-white/70 dark:tw-bg-slate-900/70 dark:tw-border dark:tw-border-slate-700/70 dark:tw-border-solid tw-mb-4 md:tw-flex-row tw-font-normal tw-justify-between tw-items-center tw-p-6">
          <div className="tw-max-w-xs"><h2 className="tw-text-base">{t("profile.Toggle Control Panel")}</h2><p className="tw-text-xs tw-opacity-70">{t("profile.control_text")}</p></div>
          <div className="toggle"><input title="Toggle Control Panel" name="toggle_control_panel" type="checkbox" id="controlpanel" onChange={this.toggleChange} defaultChecked={userattributes.toggle_control_panel} /><label htmlFor="controlpanel">Toggle</label></div>
        </div>
        <div className="tw-flex tw-flex-col tw-shadow-md tw-rounded tw-bg-white/70 dark:tw-bg-slate-900/70 dark:tw-border dark:tw-border-slate-700/70 dark:tw-border-solid tw-mb-4 md:tw-flex-row tw-font-normal tw-justify-between tw-items-center tw-p-6">
          <div className="tw-max-w-xs"><h2 className="tw-text-base">{t("profile.Theme")}</h2><p className="tw-text-xs tw-opacity-70">{t("profile.theme_text")}</p></div>
          <div className="tw-w-60">
            {userattributes &&
              <Select
                value={userattributes.theme}
                options={options}
                onChange={this.dropdownTheme}
              />
            }

          </div>
        </div>
        <div className="tw-flex tw-flex-col tw-shadow-md tw-rounded tw-bg-white/70 dark:tw-bg-slate-900/70 dark:tw-border dark:tw-border-slate-700/70 dark:tw-border-solid tw-mb-4 md:tw-flex-row tw-font-normal tw-justify-between tw-items-center tw-p-6">
          <div className="tw-max-w-xs"><h2 className="tw-text-base">{t("profile.ui-language")}</h2><p className="tw-text-xs tw-opacity-70">{t("profile.ui-language-text")}</p></div>
          <div className="tw-w-60">
            {userattributes &&
                <Select
                value={localStorage.getItem('i18nextLng') || 'en'}
                options={langOptions}
                onChange={this.updateLang}
            />
        }

          </div>
        </div>
        <div className="tw-flex tw-flex-col tw-shadow-md tw-rounded tw-bg-white/70 dark:tw-bg-slate-900/70 dark:tw-border dark:tw-border-slate-700/70 dark:tw-border-solid tw-mb-4 md:tw-flex-row tw-font-normal tw-justify-between tw-items-center tw-p-6">
          <div className="tw-max-w-xs"><h2 className="tw-text-base">{t("profile.Language")}</h2><p className="tw-text-xs tw-opacity-70">{t("profile.language_text")}</p></div>
          <div className="tw-w-60">
            {userattributes &&
                <Select
                    value={userattributes.preferred_language}
                    options={optionLanguages}
                    onChange={this.dropdownLanguage}
                />
            }

          </div>
        </div>
        <div className="tw-flex tw-flex-col tw-shadow-md tw-rounded tw-bg-white/70 dark:tw-bg-slate-900/70 dark:tw-border dark:tw-border-slate-700/70 dark:tw-border-solid tw-mb-4 md:tw-flex-row tw-font-normal tw-justify-between tw-items-center tw-p-6">
          <div className="tw-max-w-xs"><h2 className="tw-text-base">{t("profile.Timezone")}</h2><p className="tw-text-xs tw-opacity-70">{t("profile.timezone_text")}</p></div>
          <div className="tw-w-60">
            {userattributes &&
                <Select
                    value={userattributes.preferred_timezone}
                    options={optionTimezones}
                    onChange={this.dropdownTimezone}
                />
            }

          </div>
        </div>
      </React.Fragment>

    )
  }

  sshkeys() {
    const { t } = this.props;
    return (
      <React.Fragment>
        <div className="tw-text-xl tw-flex tw-mb-10 tw-h-10 tw-items-center">{t("profile.SSH Keys")}</div>
        <div className="tw-flex tw-flex-col tw-shadow-md tw-rounded tw-bg-white/70 dark:tw-bg-slate-900/70 dark:tw-border dark:tw-border-slate-700/70 dark:tw-border-solid tw-mb-4 md:tw-flex-row tw-font-normal tw-justify-between tw-items-center tw-p-6">
          <div className="tw-max-w-xs"><h2 className="tw-text-base">{t("profile.SSH Public Key")}</h2><p className="tw-text-xs tw-opacity-70">{t("profile.ssh_public_text")}</p></div>
          <div className="">
            <button onClick={() => this.downloadBlob()} className="tw-rounded tw-h-10 tw-bg-blue-500 hover:tw-bg-slate-600 tw-text-white tw-flex tw-items-center tw-transition">
              <span className="tw-h-10 tw-w-12 tw-flex tw-justify-center tw-items-center tw-bg-black/10">
                <svg className="tw-w-5 tw-h-5 tw-fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M180.7 395.3C183.8 398.4 187.9 400 192 400s8.188-1.562 11.31-4.688l144-144c6.25-6.25 6.25-16.38 0-22.62s-16.38-6.25-22.62 0L208 345.4V48C208 39.16 200.8 32 192 32S176 39.16 176 48v297.4L59.31 228.7c-6.25-6.25-16.38-6.25-22.62 0s-6.25 16.38 0 22.62L180.7 395.3zM368 448h-352C7.156 448 0 455.2 0 464S7.156 480 16 480h352c8.844 0 16-7.156 16-16S376.8 448 368 448z" /></svg>
              </span>
              <span className="tw-min-w-[176px] tw-px-2">{t("profile.Download")}</span>

            </button>
          </div>
        </div>

        <div className="tw-flex tw-flex-col tw-shadow-md tw-rounded tw-bg-white/70 dark:tw-bg-slate-900/70 dark:tw-border dark:tw-border-slate-700/70 dark:tw-border-solid tw-mb-4 md:tw-flex-row tw-font-normal tw-justify-between tw-items-center tw-p-6">
          <div className="tw-max-w-xs"><h2 className="tw-text-base">{t("profile.New Key Pair")}</h2><p className="tw-text-xs tw-opacity-70">{t("profile.key_pair_text")}</p></div>
          <div className="">
            <button onClick={() => this.setState({ keymodal: true })} className="tw-rounded tw-h-10 tw-bg-blue-500 hover:tw-bg-slate-600 tw-text-white tw-flex tw-items-center tw-transition">
              <span className="tw-h-10 tw-w-12 tw-flex tw-justify-center tw-items-center tw-bg-black/10">
                <svg className="tw-w-5 tw-h-5 tw-fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M59.31 203.3L176 86.63V384c0 8.844 7.156 16 16 16s16-7.156 16-16V86.63l116.7 116.7c6.25 6.25 16.38 6.25 22.62 0s6.25-16.38 0-22.62l-144-144C200.2 33.56 196.1 32 192 32S183.8 33.56 180.7 36.69l-144 144c-6.25 6.25-6.25 16.38 0 22.62S53.06 209.6 59.31 203.3zM368 448h-352C7.156 448 0 455.2 0 464S7.156 480 16 480h352c8.844 0 16-7.156 16-16S376.8 448 368 448z" /></svg>
              </span>
              <span className="tw-min-w-[176px] tw-px-2">{t("profile.Upload New Key Pair")}</span>

            </button>

          </div>
        </div>

      </React.Fragment>
    )
  }

  authentication(){
    const { t, userAuthSettings } = this.props;
    return (
      <React.Fragment>
        <div className="tw-text-xl tw-flex tw-mb-10 tw-h-10 tw-items-center">{t("profile.two_factor")}</div>
        <div className="tw-bg-white/70 dark:tw-bg-slate-900/70 dark:tw-border dark:tw-border-slate-700/70 dark:tw-border-solid tw-rounded tw-shadow-md tw-mb-4 tw-flex tw-flex-col md:tw-flex-row tw-font-normal tw-justify-between tw-items-center tw-p-6 tw-py-4">
          <div className="tw-font-medium">{t("profile.current_two_factor")}</div>
          <div>{userAuthSettings.set_two_factor ? t("profile.TOTP") : userAuthSettings.set_webauthn ? t("profile.webauthn") : (<div className="tw-opacity-40">- {t("profile.Not Set")} -</div>)}</div>
        </div>
        { ! userAuthSettings.set_two_factor && ! userAuthSettings.set_webauthn ?
          <div className="tw-flex tw-flex-col tw-shadow-md tw-rounded tw-bg-white/70 dark:tw-bg-slate-900/70 dark:tw-border dark:tw-border-slate-700/70 dark:tw-border-solid tw-mb-4 md:tw-flex-row tw-font-normal tw-justify-between tw-items-center tw-p-6">
            <div className="tw-max-w-xs"><h2 className="tw-text-base">{t("profile.enable_two_factor")}</h2><p className="tw-text-xs tw-opacity-70">{t("profile.add_two_factor_text")}</p></div>
            <div className="">
              <button onClick={() => this.setState({passwordModal: true, password: ''})} className="tw-rounded tw-h-10 tw-bg-blue-500 hover:tw-bg-slate-600 tw-text-white tw-flex tw-items-center tw-transition">
                <span className="tw-h-10 tw-w-12 tw-flex tw-justify-center tw-items-center tw-bg-black/10">
                  <FontAwesomeIcon viewBox="0 0 384 512" className="tw-w-5 tw-h-5 tw-fill-white" icon={faArrowUpFromLine}/>

                </span>
                <span className="tw-min-w-[176px] tw-px-2">{t("profile.add_second_factor")}</span>
              </button>
            </div>
          </div>
        : null}
        { userAuthSettings.set_two_factor || userAuthSettings.set_webauthn ?
          <div className="tw-flex tw-flex-col tw-shadow-md tw-rounded tw-bg-white/70 dark:tw-bg-slate-900/70 dark:tw-border dark:tw-border-slate-700/70 dark:tw-border-solid tw-mb-4 md:tw-flex-row tw-font-normal tw-justify-between tw-items-center tw-p-6">
            <div className="tw-max-w-xs"><h2 className="tw-text-base">{t("profile.disable_two_factor")}</h2><p className="tw-text-xs tw-opacity-70">{t("profile.remove_two_factor_text")}</p></div>
            <div className="">
              <button onClick={() => this.handleClearMultifactor()} className="tw-rounded tw-h-10 tw-bg-blue-500 hover:tw-bg-slate-600 tw-text-white tw-flex tw-items-center tw-transition">
                <span className="tw-h-10 tw-w-12 tw-flex tw-justify-center tw-items-center tw-bg-black/10">
                  <FontAwesomeIcon icon={faBan}/>
                </span>
                <span className="tw-min-w-[176px] tw-px-2">{t("profile.remove_two_factor")}</span>
              </button>
            </div>
          </div>
        : null}
      </React.Fragment>
    )
  }

  sessions() {
    const { user, t } = this.props;
    return (
      <React.Fragment>
        {user && user.kasms && user.kasms.length > 0 && (
          <div className="tw-mb-8">
            <div className="tw-text-xl tw-flex tw-mb-10 tw-h-10 tw-items-center">{t("profile.Active Sessions")}</div>
            {this.renderKasms(user.kasms)}
          </div>
        )}
        {user && (
          <React.Fragment>
            <div className="tw-text-xl tw-flex tw-mb-10 tw-h-10 tw-items-center">{t('profile.session-usage-details-last-30-')}</div>
              {this.renderUsageDetails()}
          </React.Fragment>
        )}
      </React.Fragment>

    )
  }

  showSubscription() {
    const { user } = this.props;
    let show = false;
    if (PROGRAM_DATA && PROGRAM_DATA.program_id) {
      return true
    }
    if (user && user.program_id) {
      return true
    }
    if (user && !user.program_id && this.props.subSummary) {
      return true
    }
    return show
  }

  subscriptionNav() {
    const show = this.showSubscription();
    const { t } = this.props;
    if (show) {
      return (
        <div
          className={'tw-border tw-border-solid tw-border-transparent tw-cursor-pointer tw-p-2 tw-pl-4 tw-rounded tw-flex tw-justify-between tw-items-center' + (this.props.profileSection === 'subscription' ? ' tw-bg-white/70 dark:tw-bg-slate-900/70 dark:tw-border dark:tw-border-slate-700/70 dark:tw-border-solid current' : ' hover:tw-bg-white/30 dark:hover:tw-bg-transparent dark:hover:tw-border-slate-700/40')}
          onClick={() => this.props.setProfileSection('subscription')}
        >{t("profile.Subscription Details")}
          <button className="tw-bg-transparent tw-w-8"><FontAwesomeIcon icon={faChevronRight} /></button>
        </div>
      )
    }
  }
  subscriptionNavMobile() {
    const show = this.showSubscription();
    const { t } = this.props;
    if (show) {
      return (
        <div
          className={'tw-flex tw-flex-col tw-px-4 tw-py-1 tw-rounded tw-justify-center tw-items-center ' + (this.props.profileSection === 'subscription' ? 'tw-bg-white/70 dark:tw-bg-slate-900/70 dark:tw-border dark:tw-border-slate-700/70 dark:tw-border-solid current' : 'tw-opacity-60')}
          onClick={() => this.props.setProfileSection('subscription')}
        >
          <div className="tw-h-10 tw-flex tw-items-center"><svg className="tw-w-8 tw-h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M112 0C120.8 0 128 7.164 128 16V64H320V16C320 7.164 327.2 0 336 0C344.8 0 352 7.164 352 16V64H384C419.3 64 448 92.65 448 128V448C448 483.3 419.3 512 384 512H64C28.65 512 0 483.3 0 448V128C0 92.65 28.65 64 64 64H96V16C96 7.164 103.2 0 112 0zM416 192H312V264H416V192zM416 296H312V376H416V296zM416 408H312V480H384C401.7 480 416 465.7 416 448V408zM280 376V296H168V376H280zM168 480H280V408H168V480zM136 376V296H32V376H136zM32 408V448C32 465.7 46.33 480 64 480H136V408H32zM32 264H136V192H32V264zM168 264H280V192H168V264zM384 96H64C46.33 96 32 110.3 32 128V160H416V128C416 110.3 401.7 96 384 96z"/></svg></div>
          <span className="tw-text-xs tw-font-normal">{t("profile.Plan")}</span>
        </div>
      )
    }
  }

  refreshToken() {
    const userInfo = JSON.parse(window.localStorage.getItem("user_info"));
    const payload_data = {
        token: userInfo.token,
        username: userInfo.username,
    };

    this.props.getNewToken(payload_data).then((res) => {
      window.location.href = "/"
    });

  }

  handleResponse(payload) {
    if (payload.event && payload.event === "create_subscription" || payload.event && payload.event === "change_plan") {
      setTimeout(() => {
        this.refreshToken(payload);
      }, 3000);
    }
  }

  subscription() {
    const show = this.showSubscription()
    const { user, subInfoLoading, subSummary, billingInfo, t } = this.props;
    if (show) {
      return (
        <React.Fragment>
          {
            PROGRAM_DATA && PROGRAM_DATA.program_id ?
              <React.Fragment>
                <div className="tw-text-xl tw-flex tw-mb-10 tw-h-10 tw-items-center">{t("profile.Program")}</div>
                <div className="tw-flex tw-flex-col tw-shadow-md tw-rounded tw-bg-white/70 dark:tw-bg-slate-900/70 dark:tw-border dark:tw-border-slate-700/70 dark:tw-border-solid tw-mb-4 md:tw-flex-row tw-font-normal tw-justify-between tw-items-center tw-p-6">
                  <h4>{PROGRAM_DATA.program_id}</h4>
                </div>
              </React.Fragment> : " "
          }
          {
            user && user.program_id ?
              <React.Fragment>
                <div className="tw-text-xl tw-flex tw-mb-10 tw-h-10 tw-items-center">{t("profile.Subscription Details")}</div>
                <div className="tw-flex tw-flex-col tw-shadow-md tw-rounded tw-bg-white/70 dark:tw-bg-slate-900/70 dark:tw-border dark:tw-border-slate-700/70 dark:tw-border-solid tw-mb-4 md:tw-flex-row tw-font-normal tw-justify-between tw-items-center tw-p-6">
                  <p>{t("profile.third_party_sub")}</p>
                </div>
              </React.Fragment> : " "
          }
          {
            user && !user.program_id && subSummary && billingInfo && !subInfoLoading &&
              <React.Fragment>
                <div className="tw-text-xl tw-flex tw-mb-10 tw-h-10 tw-items-center">{t("profile.Subscription Details")}</div>
                {
                  !subInfoLoading && subSummary && billingInfo ?
                    <React.Fragment>
                      <div className="tw-flex tw-flex-col tw-shadow-md tw-rounded tw-bg-white/70 dark:tw-bg-slate-900/70 dark:tw-border dark:tw-border-slate-700/70 dark:tw-border-solid tw-mb-8 md:tw-flex-row tw-font-normal tw-justify-between tw-items-center tw-p-6">
                        <StripeSubscription
                          subSummary={subSummary}
                        />
                      </div>
                      <a href={billingInfo.portal} className="tw-rounded tw-h-14 tw-bg-blue-500 hover:tw-bg-slate-600 tw-text-white hover:tw-text-white hover:tw-no-underline tw-flex tw-items-center tw-justify-center tw-transition">
                      {t("profile.Customer Portal")}
                      </a>
                    </React.Fragment>
                    :
                    <div className="tw-flex tw-flex-col tw-shadow-md tw-rounded tw-bg-white/70 dark:tw-bg-slate-900/70 dark:tw-border dark:tw-border-slate-700/70 dark:tw-border-solid tw-mb-4 md:tw-flex-row tw-font-normal tw-justify-between tw-items-center tw-p-6">
                      <StripeSignup
                        email={user.username}
                        user_id={user.user_id}
                        pricingTable={billingInfo.stripe_pricing_table_id}
                        publishableKey={billingInfo.stripe_publishable_key}
                      />

                    </div>
                }
              </React.Fragment>
          }
        </React.Fragment>
      )
    }
  }

  cloudStorage() {
    return (
        <StorageMapping type="user_id" user_id={USER_ID} style="profile" />
    )
  }


  render() {
    const userName = USER_NAME.replace(/@.*/g, "");
    const fullUserName = USER_NAME;
    const initials = USER_NAME ? USER_NAME.slice(0, 2) : "";
    const { storageProviders, t } = this.props;
    return (

      <React.Fragment>
        {this.props.showProfile && (
          <div onClick={this.closeProfile} className="tw-fixed tw-inset-0 tw-bg-black/30"></div>
        )}
        <div
          ref={this.props.forwardedRef}
          className={'profile-dropdown tw-w-72 tw-absolute tw-rounded tw-shadow tw-overflow-hidden tw-right-4 tw-top-20 tw-max-w-6xl tw-flex tw-flex-col md:tw-flex-row show' + (this.props.showProfile ? ' showprofile' : '')}
        >
          <div onClick={this.closeProfile} className={(this.props.showProfile ? 'hover:tw-bg-black/10 tw-top-0 tw-right-0 ' : 'tw-bg-black/10 hover:tw-bg-black/20 tw-top-3 tw-right-0 ') + 'tw-absolute tw-cursor-pointer tw-z-20 lg:tw-right-3 lg:tw-top-3 tw-flex tw-justify-center tw-items-center tw-w-8 tw-h-8 tw-p-2 tw-rounded-full'}>
            <svg className={(this.props.showProfile ? 'tw-h-5 tw-w-5 dark:tw-fill-white' : 'tw-h-4 tw-w-4 tw-fill-white')} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M315.3 411.3c-6.253 6.253-16.37 6.253-22.63 0L160 278.6l-132.7 132.7c-6.253 6.253-16.37 6.253-22.63 0c-6.253-6.253-6.253-16.37 0-22.63L137.4 256L4.69 123.3c-6.253-6.253-6.253-16.37 0-22.63c6.253-6.253 16.37-6.253 22.63 0L160 233.4l132.7-132.7c6.253-6.253 16.37-6.253 22.63 0c6.253 6.253 6.253 16.37 0 22.63L182.6 256l132.7 132.7C321.6 394.9 321.6 405.1 315.3 411.3z" /></svg>
          </div>

          <div className="profile-overview tw-w-72">
            <div className="tw-h-32 tw-bg-gradient-to-r tw-from-dark tw-to-blue-500 tw-border-0 tw-border-t tw-border-solid tw-border-t-white/20"></div>
            <div className="-tw-mt-14 tw-flex tw-flex-col tw-items-center">
              <div className="tw-rounded-full tw-bg-slate-700 tw-text-white tw-w-28 tw-h-28 tw-flex tw-items-center tw-justify-center tw-border-4 tw-border-solid tw-border-white">
                <span className="tw-capitalize tw-text-lg">{initials}</span>
              </div>
              <div className=" tw-mt-4 tw-text-lg">{userName}</div>
              <div className="tw-opacity-60 tw-text-sm">{fullUserName}</div>
            </div>

            <div className={'tw-flex tw-flex-col tw-gap-2 tw-p-3 tw-font-normal' + (this.props.showProfile ? ' tw-my-12' : 'tw-mt-3')}>
              {this.props.showProfile ? (
                <React.Fragment>
                  <div
                    className={'tw-border tw-border-solid tw-border-transparent tw-cursor-pointer tw-p-2 tw-pl-4 tw-rounded tw-flex tw-justify-between tw-items-center' + (this.props.profileSection === 'details' ? ' tw-bg-white/70 dark:tw-bg-slate-900/70 dark:tw-border dark:tw-border-slate-700/70 dark:tw-border-solid current' : ' hover:tw-bg-white/30 dark:hover:tw-bg-transparent dark:hover:tw-border-slate-700/40')}
                    onClick={() => this.props.setProfileSection('details')}
                  >{t("profile.Profile Details")}
                    <button className="tw-bg-transparent tw-w-8"><FontAwesomeIcon icon={faChevronRight} /></button>
                  </div>
                  {this.subscriptionNav()}
                  <div
                    className={'tw-border tw-border-solid tw-border-transparent tw-cursor-pointer tw-p-2 tw-pl-4 tw-rounded tw-flex tw-justify-between tw-items-center' + (this.props.profileSection === 'settings' ? ' tw-bg-white/70 dark:tw-bg-slate-900/70 dark:tw-border dark:tw-border-slate-700/70 dark:tw-border-solid current' : ' hover:tw-bg-white/30 dark:hover:tw-bg-transparent dark:hover:tw-border-slate-700/40')}
                    onClick={() => this.props.setProfileSection('settings')}
                  >{t("profile.Settings")}
                    <button className="tw-bg-transparent tw-w-8"><FontAwesomeIcon icon={faChevronRight} /></button>
                  </div>
                  <div
                    className={'tw-border tw-border-solid tw-border-transparent tw-cursor-pointer tw-p-2 tw-pl-4 tw-rounded tw-flex tw-justify-between tw-items-center' + (this.props.profileSection === 'sshkeys' ? ' tw-bg-white/70 dark:tw-bg-slate-900/70 dark:tw-border dark:tw-border-slate-700/70 dark:tw-border-solid current' : ' hover:tw-bg-white/30 dark:hover:tw-bg-transparent dark:hover:tw-border-slate-700/40')}
                    onClick={() => this.props.setProfileSection('sshkeys')}
                  >{t("profile.SSH Keys")}
                    <button className="tw-bg-transparent tw-w-8"><FontAwesomeIcon icon={faChevronRight} /></button>
                  </div>
                  <div
                    className={'tw-border tw-border-solid tw-border-transparent tw-cursor-pointer tw-p-2 tw-pl-4 tw-rounded tw-flex tw-justify-between tw-items-center' + (this.props.profileSection === 'sessionusage' ? ' tw-bg-white/70 dark:tw-bg-slate-900/70 dark:tw-border dark:tw-border-slate-700/70 dark:tw-border-solid current' : ' hover:tw-bg-white/30 dark:hover:tw-bg-transparent dark:hover:tw-border-slate-700/40')}
                    onClick={() => this.props.setProfileSection('sessionusage')}
                  >{t("profile.Session Usage")}
                    <button className="tw-bg-transparent tw-w-8"><FontAwesomeIcon icon={faChevronRight} /></button>
                  </div>
                  { storageProviders && storageProviders.length > 0 && (
                    <div
                      className={'tw-border tw-border-solid tw-border-transparent tw-cursor-pointer tw-p-2 tw-pl-4 tw-rounded tw-flex tw-justify-between tw-items-center' + (this.props.profileSection === 'cloudstorage' ? ' tw-bg-white/70 dark:tw-bg-slate-900/70 dark:tw-border dark:tw-border-slate-700/70 dark:tw-border-solid current' : ' hover:tw-bg-white/30 dark:hover:tw-bg-transparent dark:hover:tw-border-slate-700/40')}
                      onClick={() => this.props.setProfileSection('cloudstorage')}
                    >{t("profile.cloud-storage")}
                      <button className="tw-bg-transparent tw-w-8"><FontAwesomeIcon icon={faChevronRight} /></button>
                    </div>
                  )}
                  { this.props.userAuthSettings && this.props.userAuthSettings.allow_2fa_self_enrollment && (
                  <div
                    className={'tw-border tw-border-solid tw-border-transparent tw-cursor-pointer tw-p-2 tw-pl-4 tw-rounded tw-flex tw-justify-between tw-items-center' + (this.props.profileSection === 'twofactor' ? ' tw-bg-white/70 dark:tw-bg-slate-900/70 dark:tw-border dark:tw-border-slate-700/70 dark:tw-border-solid current' : ' hover:tw-bg-white/30 dark:hover:tw-bg-transparent dark:hover:tw-border-slate-700/40')}
                    onClick={() => this.props.setProfileSection('twofactor')}
                  >{t("profile.two_factor")}
                    <button className="tw-bg-transparent tw-w-8"><FontAwesomeIcon icon={faChevronRight} /></button>
                  </div>
                  )}
                </React.Fragment>
              ) :
                (
                  <div
                    className="tw-bg-slate-400/20 tw-p-2 tw-pl-4 tw-rounded tw-flex tw-justify-between tw-items-center"
                    onClick={() => this.setShowProfile()}
                  >{t("profile.Edit Profile")}
                    <button className="tw-rounded tw-h-8 tw-w-20 tw-bg-blue-500 tw-text-white"><FontAwesomeIcon icon={faPencil} /></button>
                  </div>
                )
              }
            </div>
            <div className="tw-flex tw-flex-col tw-gap-2 tw-p-3 tw-font-normal">
              <div
                className="tw-bg-slate-400/20 tw-p-2 tw-pl-4 tw-rounded tw-flex tw-justify-between tw-items-center"
                onClick={() => {
                  // this.setState({ isOpen: false });
                  this.setState({ showLogout: true })
                }}
              >{t("profile.Sign Out")}
                <button className="tw-rounded tw-h-8 tw-w-20 tw-bg-pink-700 tw-text-white"><FontAwesomeIcon icon={faArrowRightFromBracket} /></button>
              </div>
            </div>

          </div>
          <div className="profile-detail tw-relative">
            {this.props.showProfile && (
              <div className="profile-container tw-p-8 tw-pb-28 lg:tw-p-12 lg:tw-px-16 lg:tw-pb-12 tw-h-full tw-absolute tw-inset-0 tw-overflow-auto">
                {this.props.profileSection === 'details' && this.state.loaded && (
                  this.details()
                )}
                {this.props.profileSection === 'settings' && this.state.loaded && (
                  this.settings()
                )}
                {this.props.profileSection === 'sshkeys' && this.state.loaded && (
                  this.sshkeys()
                )}
                {this.props.profileSection === 'sessionusage' && this.state.loaded && (
                  this.sessions()
                )}
                {this.props.profileSection === 'subscription' && this.state.loaded && (
                  this.subscription()
                )}
                {this.props.profileSection === 'cloudstorage' && this.state.loaded && (
                  this.cloudStorage()
                )}

                {this.props.profileSection === 'twofactor' && this.state.loaded && (
                  this.authentication()
                )}

              </div>

            )}
            <div className="mobile-bar lg:tw-hidden tw-py-2 tw-flex tw-justify-evenly">
              <div
                className={'tw-flex tw-flex-col tw-px-4 tw-py-1 tw-rounded tw-justify-center tw-items-center ' + (this.props.profileSection === 'details' ? 'tw-bg-white/70 dark:tw-bg-slate-900/70 dark:tw-border dark:tw-border-slate-700/70 dark:tw-border-solid current' : 'tw-opacity-60')}
                onClick={() => this.props.setProfileSection('details')}
              >
                <div className="tw-h-10 tw-flex tw-items-center"><svg className="tw-w-8 tw-h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M480 288h-128c-8.836 0-16 7.164-16 16S343.2 320 352 320h128c8.836 0 16-7.164 16-16S488.8 288 480 288zM192 256c35.35 0 64-28.65 64-64S227.3 128 192 128S128 156.7 128 192S156.7 256 192 256zM192 160c17.64 0 32 14.36 32 32S209.6 224 192 224S160 209.6 160 192S174.4 160 192 160zM224 288H160c-44.18 0-80 35.82-80 80C80 376.8 87.16 384 96 384s16-7.164 16-16C112 341.5 133.5 320 160 320h64c26.51 0 48 21.49 48 48c0 8.836 7.164 16 16 16s16-7.164 16-16C304 323.8 268.2 288 224 288zM512 32H64C28.65 32 0 60.65 0 96v320c0 35.35 28.65 64 64 64h448c35.35 0 64-28.65 64-64V96C576 60.65 547.3 32 512 32zM544 416c0 17.64-14.36 32-32 32H64c-17.64 0-32-14.36-32-32V96c0-17.64 14.36-32 32-32h448c17.64 0 32 14.36 32 32V416zM480 224h-128c-8.836 0-16 7.164-16 16S343.2 256 352 256h128c8.836 0 16-7.164 16-16S488.8 224 480 224zM480 160h-128c-8.836 0-16 7.164-16 16S343.2 192 352 192h128c8.836 0 16-7.164 16-16S488.8 160 480 160z" /></svg></div>
                <span className="tw-text-xs tw-font-normal tw-flex tw-items-center tw-h-6 tw-leading-none">{t("profile.Details")}</span>
              </div>
              { this.subscriptionNavMobile() }
              <div
                className={'tw-flex tw-flex-col tw-px-4 tw-py-1 tw-rounded tw-justify-center tw-items-center ' + (this.props.profileSection === 'settings' ? 'tw-bg-white/70 dark:tw-bg-slate-900/70 dark:tw-border dark:tw-border-slate-700/70 dark:tw-border-solid current' : 'tw-opacity-60')}
                onClick={() => this.props.setProfileSection('settings')}
              >
                <div className="tw-h-10 tw-flex tw-items-center"><svg className="tw-w-8 tw-h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M0 416C0 407.2 7.164 400 16 400H81.6C89.01 363.5 121.3 336 160 336C198.7 336 230.1 363.5 238.4 400H496C504.8 400 512 407.2 512 416C512 424.8 504.8 432 496 432H238.4C230.1 468.5 198.7 496 160 496C121.3 496 89.01 468.5 81.6 432H16C7.164 432 0 424.8 0 416V416zM208 416C208 389.5 186.5 368 160 368C133.5 368 112 389.5 112 416C112 442.5 133.5 464 160 464C186.5 464 208 442.5 208 416zM352 176C390.7 176 422.1 203.5 430.4 240H496C504.8 240 512 247.2 512 256C512 264.8 504.8 272 496 272H430.4C422.1 308.5 390.7 336 352 336C313.3 336 281 308.5 273.6 272H16C7.164 272 0 264.8 0 256C0 247.2 7.164 240 16 240H273.6C281 203.5 313.3 176 352 176zM400 256C400 229.5 378.5 208 352 208C325.5 208 304 229.5 304 256C304 282.5 325.5 304 352 304C378.5 304 400 282.5 400 256zM496 80C504.8 80 512 87.16 512 96C512 104.8 504.8 112 496 112H270.4C262.1 148.5 230.7 176 192 176C153.3 176 121 148.5 113.6 112H16C7.164 112 0 104.8 0 96C0 87.16 7.164 80 16 80H113.6C121 43.48 153.3 16 192 16C230.7 16 262.1 43.48 270.4 80H496zM144 96C144 122.5 165.5 144 192 144C218.5 144 240 122.5 240 96C240 69.49 218.5 48 192 48C165.5 48 144 69.49 144 96z" /></svg></div>
                <span className="tw-text-xs tw-font-normal tw-flex tw-items-center tw-h-6 tw-leading-none">{t("profile.Settings")}</span>
              </div>
              <div
                className={'tw-flex tw-flex-col tw-px-4 tw-py-1 tw-rounded tw-justify-center tw-items-center ' + (this.props.profileSection === 'sshkeys' ? 'tw-bg-white/70 dark:tw-bg-slate-900/70 dark:tw-border dark:tw-border-slate-700/70 dark:tw-border-solid current' : 'tw-opacity-60')}
                onClick={() => this.props.setProfileSection('sshkeys')}
              >
                <div className="tw-h-10 tw-flex tw-items-center"><svg className="tw-w-8 tw-h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M344 144C344 130.7 354.7 120 368 120C381.3 120 392 130.7 392 144C392 157.3 381.3 168 368 168C354.7 168 344 157.3 344 144zM336 352C326.5 352 317.2 351.3 308.1 349.8L280.1 376.1C276.5 381.5 270.4 384 264 384H224V424C224 437.3 213.3 448 200 448H160V488C160 501.3 149.3 512 136 512H24C10.75 512 0 501.3 0 488V392C0 385.6 2.529 379.5 7.029 375L164.9 217.2C161.7 203.1 160 190.2 160 176C160 78.8 238.8 0 336 0C433.2 0 512 78.8 512 176C512 273.2 433.2 352 336 352zM336 320C415.5 320 480 255.5 480 176C480 96.47 415.5 32 336 32C256.5 32 192 96.47 192 176C192 187.7 193.4 198.1 195.1 209.7L200.1 227.2L32 395.3V480H128V416H192V352H260.7L297 315.6L313.2 318.2C320.6 319.4 328.2 320 336 320V320z" /></svg></div>
                <span className="tw-text-xs tw-font-normal tw-flex tw-items-center tw-h-6 tw-leading-none">{t("profile.SSH Keys")}</span>
              </div>
              <div
                className={'tw-flex tw-flex-col tw-px-4 tw-py-1 tw-rounded tw-justify-center tw-items-center ' + (this.props.profileSection === 'sessionusage' ? 'tw-bg-white/70 dark:tw-bg-slate-900/70 dark:tw-border dark:tw-border-slate-700/70 dark:tw-border-solid current' : 'tw-opacity-60')}
                onClick={() => this.props.setProfileSection('sessionusage')}
              >
                <div className="tw-h-10 tw-flex tw-items-center"><svg className="tw-w-8 tw-h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M320 240C311.2 240 304 232.8 304 224V15.47C304 7.074 310.5 .0432 318.9 .0026L320 0C443.7 0 544 100.3 544 224L543.1 225.1C543.1 233.5 536.9 240 528.5 240H320zM336 32.66V208H511.3C503.6 114.7 429.3 40.35 336 32.66V32.66zM256 49.61V288L412.5 444.5C419.2 451.2 418.7 462.2 411 467.7C371.8 495.6 323.8 512 272 512C139.5 512 32 404.6 32 272C32 150.7 122.1 50.34 238.1 34.25C248.2 32.99 256 40.36 256 49.61V49.61zM233.4 310.6C227.4 304.6 224 296.5 224 288V69.56C132.3 91.22 64 173.7 64 272C64 386.9 157.1 480 272 480C309.6 480 344.9 470 375.3 452.6L233.4 310.6zM499.9 447.3C493.9 452.1 484.5 452.5 478.7 446.7L347.3 315.3C337.2 305.2 344.4 288 358.6 288H558.4C567.6 288 575 295.8 573.8 305C566.1 360.9 539.1 410.6 499.9 447.3V447.3zM538.4 320H397.3L489.6 412.3C513.1 386.6 530.2 354.1 538.4 320z" /></svg></div>
                <span className="tw-text-xs tw-font-normal tw-flex tw-items-center tw-h-6 tw-leading-none">{t("profile.Usage")}</span>
              </div>
              { storageProviders && storageProviders.length > 0 && (
                <div
                  className={'tw-flex tw-flex-col tw-px-4 tw-py-1 tw-rounded tw-justify-center tw-items-center ' + (this.props.profileSection === 'cloudstorage' ? 'tw-bg-white/70 dark:tw-bg-slate-900/70 dark:tw-border dark:tw-border-slate-700/70 dark:tw-border-solid current' : 'tw-opacity-60')}
                  onClick={() => this.props.setProfileSection('cloudstorage')}
                >
                  <div className="tw-h-10 tw-flex tw-items-center"><svg className="tw-w-8 tw-h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M389.8 125.2C363.7 88.1 320.7 64 272 64c-77.4 0-140.5 61-143.9 137.5c-.6 13-9 24.4-21.3 28.8C63.2 245.7 32 287.2 32 336c0 61.9 50.1 112 112 112H512c53 0 96-43 96-96c0-36.8-20.7-68.8-51.2-84.9c-13.4-7.1-20-22.5-15.8-37.1c2-6.9 3-14.3 3-22c0-44.2-35.8-80-80-80c-12.3 0-23.9 2.8-34.3 7.7c-14.1 6.7-30.9 2.3-39.9-10.5zM272 32c59.5 0 112.1 29.5 144 74.8C430.5 99.9 446.8 96 464 96c61.9 0 112 50.1 112 112c0 10.7-1.5 21-4.3 30.8C612.3 260.2 640 302.9 640 352c0 70.7-57.3 128-128 128H144C64.5 480 0 415.5 0 336c0-62.8 40.2-116.1 96.2-135.9C100.3 106.6 177.4 32 272 32zM176 216c0-22.1 17.9-40 40-40h16c22.1 0 40 17.9 40 40v16c0 22.1-17.9 40-40 40H216c-22.1 0-40-17.9-40-40V216zm40-8c-4.4 0-8 3.6-8 8v16c0 4.4 3.6 8 8 8h16c4.4 0 8-3.6 8-8V216c0-4.4-3.6-8-8-8H216zm72-16c0-8.8 7.2-16 16-16h16c8.8 0 16 7.2 16 16v64c0 8.8-7.2 16-16 16s-16-7.2-16-16V208c-8.8 0-16-7.2-16-16zm120-16h16c22.1 0 40 17.9 40 40v16c0 22.1-17.9 40-40 40H408c-22.1 0-40-17.9-40-40V216c0-22.1 17.9-40 40-40zm-8 40v16c0 4.4 3.6 8 8 8h16c4.4 0 8-3.6 8-8V216c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8zM192 320c0-8.8 7.2-16 16-16h16c8.8 0 16 7.2 16 16v64c0 8.8-7.2 16-16 16s-16-7.2-16-16V336c-8.8 0-16-7.2-16-16zm80 24c0-22.1 17.9-40 40-40h16c22.1 0 40 17.9 40 40v16c0 22.1-17.9 40-40 40H312c-22.1 0-40-17.9-40-40V344zm40-8c-4.4 0-8 3.6-8 8v16c0 4.4 3.6 8 8 8h16c4.4 0 8-3.6 8-8V344c0-4.4-3.6-8-8-8H312zm88-32h16c8.8 0 16 7.2 16 16v64c0 8.8-7.2 16-16 16s-16-7.2-16-16V336c-8.8 0-16-7.2-16-16s7.2-16 16-16z"/></svg></div>
                  <span className="tw-text-xs tw-font-normal tw-flex tw-items-center tw-h-6 tw-leading-none">{t("profile.cloud-storage")}</span>
                </div>
              )}
              { this.props.userAuthSettings && this.props.userAuthSettings.allow_2fa_self_enrollment && (
              <div
                className={'tw-flex tw-flex-col tw-px-4 tw-py-1 tw-rounded tw-justify-center tw-items-center ' + (this.props.profileSection === 'twofactor' ? 'tw-bg-white/70 dark:tw-bg-slate-900/70 dark:tw-border dark:tw-border-slate-700/70 dark:tw-border-solid current' : 'tw-opacity-60')}
                onClick={() => this.props.setProfileSection('twofactor')}
              >
                    <div className="tw-h-10 tw-flex tw-items-center"><svg className="tw-w-8 tw-h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M344 144C344 130.7 354.7 120 368 120C381.3 120 392 130.7 392 144C392 157.3 381.3 168 368 168C354.7 168 344 157.3 344 144zM336 352C326.5 352 317.2 351.3 308.1 349.8L280.1 376.1C276.5 381.5 270.4 384 264 384H224V424C224 437.3 213.3 448 200 448H160V488C160 501.3 149.3 512 136 512H24C10.75 512 0 501.3 0 488V392C0 385.6 2.529 379.5 7.029 375L164.9 217.2C161.7 203.1 160 190.2 160 176C160 78.8 238.8 0 336 0C433.2 0 512 78.8 512 176C512 273.2 433.2 352 336 352zM336 320C415.5 320 480 255.5 480 176C480 96.47 415.5 32 336 32C256.5 32 192 96.47 192 176C192 187.7 193.4 198.1 195.1 209.7L200.1 227.2L32 395.3V480H128V416H192V352H260.7L297 315.6L313.2 318.2C320.6 319.4 328.2 320 336 320V320z" /></svg></div>
                    <span className="tw-text-xs tw-font-normal tw-flex tw-items-center tw-h-6 tw-leading-none">{t("profile.two_factor")}</span>
              </div>
              )}
            </div>

          </div>
        </div>
        {this.newSshModal()}
        {this.resetPasswordModal()}
        {this.clearSetTwoFactorModal()}
        {this.addSetTwoFactorModal()}
        {this.passwordModal()}
        {this.authenticatorModal()}
        <Logout onChange={(data) => this.setState({ showLogout: data })} showLogout={this.state.showLogout} />

      </React.Fragment>

    )
  }
}

UserProfile.propTypes = {
  // userattributes: Proptypes.object, // userattributes is inexplicably set as an empty array at some point
  availableKasms: Proptypes.array,
  submitting: Proptypes.bool,
  handleSubmit: Proptypes.func,
  all_languages: Proptypes.array,
  all_timezones: Proptypes.array,
};

function mapStateToProps(state) {
  return {
    user: state.user.user || [],
    showProfile: state.dashboard.showProfile || false,
    profileSection: state.dashboard.profileSection || 'details',
    userattributes: state.user.userattributes || null,
    availableKasms: state.dashboard.availableKasms,
    updateUserAttrError: state.user.updateUserAttrError,
    updateUserErrorMessage: state.user.updateUserErrorMessage,
    usageDump: state.user.usageDump,
    usageDumpLoading: state.user.usageDumpLoading,
    usageDumpError: state.user.usageDumpError,
    productList: state.user.productList,
    errorMessage: state.user.errorMessage || null,
    setUserPasswordError: state.user.setUserPasswordError || null,
    createSub: state.user.createSub,
    subSummary: state.user.subSummary,
    billingInfo: state.user.billingInfo,
    subInfoLoading: state.user.subInfoLoading,
    storageProviders: state.storage_mapping.storageProviders || [],
    allLanguages: state.user.allLanguages || null,
    allTimezones: state.user.allTimezones || null,
    userAuthSettings: state.user.userAuthSettings || {},
    webauthnAuthOptions: state.user.webauthnAuthOptions || {},
    requestId: state.user.requestId || null,
    generatedSecret: state.user.generatedSecret || null,
    qrCode: state.user.qrCode || null,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setShowProfile: (data) => dispatch(setShowProfile(data)),
    getUserAttributes: () => dispatch(getUserAttributes()),
    getUser: () => dispatch(getUser()),
    getUserUsageDump: () => dispatch(getUserUsageDump()),
    updateUserAttribute: (data) => dispatch(updateUserAttribute(data)),
    setProfileSection: (data) => dispatch(setProfileSection(data)),
    setProfileDropdown: (data) => dispatch(setProfileDropdown(data)),
    setUserPassword: (data) => dispatch(setUserPassword(data)),
    getSubscriptionInfo: () => dispatch(getSubscriptionInfo()),
    createSubscription: () => dispatch(createSubscription()),
    logout: (logout_data) => dispatch(logout(logout_data)),
    getNewToken: (payload_data) => dispatch(getNewToken(payload_data)),
    getAvailableStorageProviders: (data) => dispatch(getAvailableStorageProviders(data)),
    getLanguages: () => dispatch(getLanguages()),
    getTimezones: () => dispatch(getTimezones()),
    webauthnRegisterStart: () => dispatch(webauthnRegisterStart()),
    webauthnRegisterFinish: (data) => dispatch(webauthnRegisterFinish(data)),
    getUserAuthSettings: () => dispatch(getUserAuthSettings()),
    webauthnGetAuthOptions: () => dispatch(webauthnGetAuthOptions()),
    clearUserTwoFactor: (data) => dispatch(clearUserTwoFactor(data)),
    checkPassword: (data) => dispatch(checkPassword(data)),
    setSecretAuthenticated: (data) => dispatch(setSecretAuthenticated(data)),
    twoFactorAuthAuthenticated: (data) => dispatch(twoFactorAuthAuthenticated(data)),
    webauthnAuthenticatedRegisterStart: (data) => dispatch(webauthnAuthenticatedRegisterStart(data)),
    webauthnAuthenticatedRegisterFinish: (data) => dispatch(webauthnAuthenticatedRegisterFinish(data)),
  };
}

let ProfileUserForm = connect(mapStateToProps, mapDispatchToProps)(UserProfile);
const ProfileUserFormTranslated = withTranslation('common')(ProfileUserForm)
export default reduxForm({
  form: "profileuserForm",
  validate
})(ProfileUserFormTranslated);
