import React, { Component } from "react";
import { Spinner, Row, CardGroup, Card, CardBody } from "reactstrap";
import { Field, reduxForm } from "redux-form";
import Proptypes from "prop-types";
import { NotificationManager } from "react-notifications";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { getLoginSettings } from "../../actions/actionLogin";
import { resetEmail, passwordReset } from "../../actions/actionPasswordReset";
import { required, renderField, email } from "../../utils/formValidations.js";
import "../../../assets/style/style.css";
import ReCAPTCHA from "react-google-recaptcha";
import queryString from "query-string";
import {withTranslation} from "react-i18next";
import { Groups, Button, FormField } from "../../components/Form"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faKey } from '@fortawesome/pro-light-svg-icons/faKey';
import { faUser } from '@fortawesome/pro-light-svg-icons/faUser';
import { Modal } from "../../components/Form/Modal";

class PasswordReset extends Component {
    constructor(props) {
        super(props);
        this.state = {
            recaptcha_needed: true,
            recaptcha_value: null,
            google_recaptcha_site_key: null,
            error: true,
            loginBoxClass: "",
            loginClicked: false,
            authModal: false,
            brandingSet: false,
            do_reset: false,
            loginData: {},
            reset_username: null,
            reset_token: null,
        };
        this.handleReset = this.handleReset.bind(this);
        this.resetError = this.resetError.bind(this);
        this.toggle = this.toggle.bind(this);
        this.handleSuccess = this.handleSuccess.bind(this);
        this.handleComplete = this.handleComplete.bind(this);
        this.onCaptchaChange = this.onCaptchaChange.bind(this);
    }
    onCaptchaChange(value){
        this.setState({recaptcha_value: value});
    }

    handleReset({ username, password, password_confirm }) {
        const { t } = this.props;
        if (!this.state.recaptcha_value){
            this.resetError(t('signup.please-solve-the-recaptcha'))
        }
        else{
            if (this.state.do_reset){
                if (password != password_confirm) {
                    this.resetError(t('signup.the-passwords-do-not-match'))
                }
                else {
                    let login_data = {
                    "emailaddress": username.trim().toLowerCase(),
                    "password": password.trim(),
                    "recaptcha": this.state.recaptcha_value,
                    "reset_token": this.state.reset_token,
                    };
                    this.props.passwordReset(login_data).
                    then(() => this.handleSuccess(login_data)).
                    catch(() => this.resetError());
                }

            }
            else {
                let login_data = {
                    "emailaddress": username.trim().toLowerCase(),
                    "recaptcha": this.state.recaptcha_value
                };
                 this.props.resetEmail(login_data).
                    then(() => this.handleSuccess(login_data)).
                    catch(() => this.resetError());
             }
        }

    }

    resetError(error) {
        const { t } = this.props;
        if (error || this.props.resetEmailError ) {
            this.setState({loginBoxClass: "login_error", error:false, loginClicked: false});
            NotificationManager.error(error || this.props.resetEmailError,t('auth.password-reset-failed'), 5000);
        }
    }



    handleSuccess() {
        const { t } = this.props;
        if (this.props.resetEmailError) {
            this.setState({loginBoxClass: "login_error", error:false, loginClicked: false});
            NotificationManager.error(this.props.resetEmailError,t('auth.password-reset-failed'), 5000);
        }
        else{
           this.toggle();
        }


    }

    handleComplete(){
         window.location.href = "/#/";
    }


    toggle(){
        if (this.state.authModal){
            // The modal is being closed. Push the user to the login page
            this.handleComplete()
        }
        else{
           this.setState({authModal: !this.state.authModal, loginClicked: false});
        }
    }


    async componentDidMount() {
        const { response: settings } = await this.props.getLoginSettings();
        window.localStorage.setItem("login_logo", settings.login_logo);
        window.localStorage.setItem("login_caption", settings.login_caption);
        window.localStorage.setItem("header_logo", settings.header_logo);
        window.localStorage.setItem("login_splash_background", settings.login_splash_background);
        window.localStorage.setItem("splash_background", settings.splash_background);
        window.localStorage.setItem("html_title", settings.html_title);
        window.localStorage.setItem("favicon_logo", settings.favicon_logo);
        window.localStorage.setItem("loading_session_text", settings.loading_session_text);
        window.localStorage.setItem("joining_session_text", settings.joining_session_text);
        window.localStorage.setItem("destroying_session_text", settings.destroying_session_text);
        window.localStorage.setItem("launcher_background_url", settings.launcher_background_url);
        this.setState({brandingSet: true})

        if (settings.recaptcha && settings.recaptcha.google_recaptcha_site_key){
            this.setState({google_recaptcha_site_key: settings.recaptcha.google_recaptcha_site_key})
        }



        let reset_username = null;
        let reset_token = null;
        const values = queryString.parse(this.props.location.search);
        if (values.emailaddress) {
            reset_username = decodeURIComponent(values.emailaddress);
            this.setState({
                reset_username: decodeURIComponent(values.emailaddress),
            });
            this.props.initialize({username: reset_username});
        }
        if (values.token) {
              reset_token = decodeURIComponent(values.token);
              this.setState({
                reset_token: decodeURIComponent(values.token),
              });
        }
        if (reset_username && reset_token){
            this.setState({do_reset: true});
        }
    }

    componentWillUnmount() {
    }

    render() {
        const {login_settings, handleSubmit, t } = this.props;

        let login_splash_background = window.localStorage.getItem('login_splash_background');
        let login_logo = window.localStorage.getItem('login_logo');
        login_logo = login_logo ? login_logo : '/img/logo.svg';
        let powered_by = login_logo != "/img/logo.svg";

        let login_caption = window.localStorage.getItem('login_caption');
        login_caption = login_caption ? login_caption : 'The Container Streaming Platform®';


        let elem = document.getElementById("favicon");
        let favicon_logo = window.localStorage.getItem('favicon_logo');
        if (favicon_logo != undefined){
            elem.href=favicon_logo;
        }

        let html_title = window.localStorage.getItem('html_title');
        if (html_title != undefined){
             document.title=html_title;
        }

        return (
            <div >
                <div className="login_box tw-w-full">
                    <div className={"" + this.state.loginBoxClass}>
                        <CardGroup className="mb-0 tw-w-full">
                            <div className="tw-w-full tw-flex tw-relative lg:tw-max-w-md xl:tw-max-w-xl tw-h-screen tw-justify-center tw-bg-[image:var(--bg)] dark:tw-bg-[var(--color-echo)] dark:tw-bg-[image:none] dark:tw-border tw-border-solid tw-border-0 tw-border-r tw-border-[var(--border-color)]">
                                <div className="tw-flex tw-h-screen tw-w-full tw-justify-center tw-overflow-auto">
                                <div className="tw-p-8 login-card-top tw-my-auto tw-w-full tw-max-w-sm">
                                    <h1 className="tw-text-xl tw-font-bold tw-mb-8"><strong>{t('auth.password-reset')}</strong> </h1>
                                        <Groups onSubmit={handleSubmit(this.handleReset)} section="auth" noPadding={true}>
                                            <FormField label="your-email">
                                            <Field
                                                name="username"
                                                component={renderField}
                                                type="text"
                                                validate={[required, email]} required
                                            />

                                            </FormField>

                                        {this.state.do_reset ?
                                           <React.Fragment>
                                             <FormField section="auth" label="your-password">
                                                    <Field
                                                        name="password"
                                                        component={renderField}
                                                        type="password"
                                                        validate={required} required
                                                    />
                                                    </FormField>
                                                    <FormField section="auth" label="confirm-your-password">
                                                    <Field
                                                        name="password_confirm"
                                                        component={renderField}
                                                        type="password"
                                                        validate={required} required
                                                    />
                                                    </FormField>
                                           </React.Fragment>
                                              :
                                                ""
                                                }
                                            {this.state.recaptcha_needed ?
                                                <Row className="tw-justify-center">
                                                    <div style={{
                                                        paddingTop: "20px",
                                                        textAlign: "center",
                                                        display: "inline-block",
                                                        paddingBottom: "20px"
                                                    }}>
                                                        {this.state.google_recaptcha_site_key ?
                                                            <ReCAPTCHA
                                                                sitekey={this.state.google_recaptcha_site_key}
                                                                onChange={this.onCaptchaChange}
                                                            />
                                                            : ""
                                                        }
                                                    </div>
                                                </Row>
                                                :
                                                ""
                                            }
                                            <div className="tw-my-5">
                                                {this.state.loginClicked ? <Spinner color="primary" className="login-spinner" /> : <Button full={true} icon={<FontAwesomeIcon icon={faKey} />} large={true} type="submit" section="buttons" name="Submit" />}
                                            </div>
                                        </Groups>
                                        {this.props.login_settings && this.props.login_settings.notice_message && this.props.login_settings.notice_title &&
                                        <div className="tw-text-xs text-muted-more tw-mt-6">
                                                <h4 className="tw-text-base">{this.props.login_settings && this.props.login_settings.notice_title}</h4>
                                                <p>{this.props.login_settings && this.props.login_settings.notice_message}</p>
                                        </div>
                                        }

                                    </div>


                                </div>

                            </div>
                            <Card className="text-white tw-flex-1 !tw-bg-center login_box tw-hidden lg:tw-block"  style={{backgroundImage: 'url("' + login_splash_background + '")'}}>
                                <div className="logo-wrapper">
                                    <div className="logo-center tw-pl-24">
                                    <img src={login_logo} alt="logo"/>
                                        <CardBody className="text-center">
                                            {powered_by ?
                                            <div className="logo-bottom-txt">
                                                <p>{t('auth.powered-by-kasm-workspaces')}</p>
                                            </div>
                                            :
                                            ""}
                                            <div className = "logo-bottom-txt">
                                                <h5>{login_caption}</h5>
                                            </div>
                                        </CardBody>
                                    </div>
                                </div>
                            </Card>
                        </CardGroup>
                        <Modal
                            icon={<FontAwesomeIcon icon={faUser} />}
                            iconBg="tw-bg-blue-500 tw-text-white"
                            title="signup.success"
                            contentRaw={
                                <React.Fragment>
                                    {this.state.do_reset ?
                                        <p>{t('auth.password-reset-complete-please')}</p>
                                        :
                                        <p>{t('auth.if-an-account-by-that-name-exi')}</p>
                                    }
                                    <div className="tw-mt-5">
                                        <button type="button" className="cancelbutton tw-ml-auto" onClick={this.toggle}>{t('buttons.ok')}</button>
                                    </div>
                                </React.Fragment>
                            }
                            open={this.state.authModal}
                            setOpen={this.toggle}

                        />

                    </div>
                </div>
            </div>
        );
    }
}

PasswordReset.propTypes = {
    resetEmail: Proptypes.func.isRequired,
    fields: Proptypes.array,
    handleSubmit: Proptypes.func,
    isLoggedIn: Proptypes.bool,
    require2fa: Proptypes.bool,
    setTwoFactor: Proptypes.bool,
    user_info: Proptypes.object,
    resetError: Proptypes.string,
    history: Proptypes.object,
    initialize: Proptypes.func,
};

PasswordReset = withRouter(PasswordReset);

function mapStateToProps(state) {
    return {
        isLoading: state.passwordReset.resetEmailLoading,
        resetEmailError: state.passwordReset.resetEmailError,
        resetEmailSuccess: state.passwordReset.resetEmailSuccess,
        login_settings: state.auth.login_settings,
    };
}

function mapDispatchToProps(dispatch) {
    return ({
        getLoginSettings: () => dispatch(getLoginSettings()),
        resetEmail: (data) => dispatch(resetEmail(data)),
        passwordReset: (data) => dispatch(passwordReset(data)),
    });
}

let PasswordResetWithRouter =  withRouter(PasswordReset);

let PasswordResetComponent = connect(
    mapStateToProps,
    mapDispatchToProps
)(PasswordResetWithRouter);
const PasswordResetComponentTranslated = withTranslation('common')(PasswordResetComponent)
export default reduxForm({
    form: "PasswordResetPageForm",
    fields: ["username", "password"]
})(PasswordResetComponentTranslated);