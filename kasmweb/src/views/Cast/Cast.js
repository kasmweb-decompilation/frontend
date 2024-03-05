import React, { Component } from "react";
import { connect } from "react-redux";
import "../../../assets/style/style.css";
import { requestCastUrl } from "../../actions/actionCast";
import { Container, Row, Col, CardGroup, Card, CardBody,} from "reactstrap";
import Proptypes from "prop-types";
import { withRouter } from "react-router";
import LoadingSpinner from "../../components/LoadingSpinner/index";
import ReCAPTCHA from "react-google-recaptcha";
import { Redirect } from "react-router-dom";
import queryString from "query-string";
import {withTranslation} from "react-i18next";
import { LaunchForm, checkRequiredSectionsAgainstLocal, localLaunchSelections } from "../../components/Form/LaunchForm";
import { Modal } from "../../components/Form/Modal.js";
import { KasmIcon } from "../User/UserDashboard/ListKasms";
import _ from "lodash";

class Connect extends Component {
    constructor(props) {
        super(props);
         this.state  = {
             recaptcha_needed: false,
             google_recaptcha_site_key: null,
             doLogin: false,
             launch_form: false,
             brandingSet: false,
             doLocalError: false,
             createClicked: false,
             errorDetails: "",
             kasm_url: null,
             values: null,
             docker_network: null,
             all_query_args: null,
        };
        this.handleError = this.handleError.bind(this);
        this.handleSuccess = this.handleSuccess.bind(this);
        this.onCaptchaChange = this.onCaptchaChange.bind(this);
        this.submitLaunch = this.submitLaunch.bind(this);
    }

    componentDidMount() {
        let cast_key = this.props.match.params.cast_key;
        let kasm_url = null;
        let docker_network = null;
        const values = queryString.parse(this.props.location.search);
        this.setState({ values })
        if (values) {
            this.setState({ all_query_args: values });
        }
        if (values.kasm_url) {
            kasm_url = decodeURIComponent(values.kasm_url);
          this.setState({
            kasm_url: decodeURIComponent(values.kasm_url),
          });
        }
        if (values.docker_network) {
            docker_network = decodeURIComponent(values.docker_network);
          this.setState({
            docker_network: decodeURIComponent(values.docker_network),
          });
        }

        this.props.requestCastUrl(cast_key, kasm_url, docker_network, values, null, window.document.referrer)
            .then(() => this.handleSuccess())
            .catch(() => this.handleError());
    }

    submitLaunch(e) {
        e.preventDefault()
        this.setState({launch_form: false})
        this.props.requestCastUrl(this.props.match.params.cast_key, this.state.kasm_url, this.state.docker_network, this.state.values, null, window.document.referrer, this.props.launchSelections)
        .then(() => this.handleSuccess())
        .catch(() => this.handleError());

    }

    handleSuccess() {
        const {castResponse, requestCastError, requestCastErrorMessage, requestCastRecaptchaSiteKey, castBrandingResponse, castLaunchResponse} = this.props;
        if (castBrandingResponse){
             window.localStorage.setItem("login_logo", castBrandingResponse.login_logo);
             window.localStorage.setItem("login_caption", castBrandingResponse.login_caption);
             window.localStorage.setItem("header_logo", castBrandingResponse.header_logo);
             window.localStorage.setItem("login_splash_background", castBrandingResponse.login_splash_background);
             window.localStorage.setItem("splash_background", castBrandingResponse.splash_background);
             window.localStorage.setItem("html_title", castBrandingResponse.html_title);
             window.localStorage.setItem("favicon_logo", castBrandingResponse.favicon_logo);
             window.localStorage.setItem("loading_session_text", castBrandingResponse.loading_session_text);
             window.localStorage.setItem("joining_session_text", castBrandingResponse.joining_session_text);
             window.localStorage.setItem("destroying_session_text", castBrandingResponse.destroying_session_text);
             window.localStorage.setItem("launcher_background_url", castBrandingResponse.launcher_background_url);
             // Changing the state will force the page to re-render - applying the settings
             this.setState({brandingSet: true})
        }
        if (requestCastError) {
            if (requestCastError === "recaptcha_needed"){
                this.setState({recaptcha_needed:true, google_recaptcha_site_key: requestCastRecaptchaSiteKey})
            }
            else if (requestCastError === "launch_config_required"){
                const launchSelections = localLaunchSelections(castLaunchResponse.image_id)
                const allRequiredSections = checkRequiredSectionsAgainstLocal(castLaunchResponse.image_id, castLaunchResponse.launch_config.launch_form)

                if (_.isEmpty(this.props.match.params.launch_selections) && allRequiredSections) {
                    
                    this.props.requestCastUrl(this.props.match.params.cast_key, this.state.kasm_url, this.state.docker_network, this.state.values, null, window.document.referrer, launchSelections)
                    .then(() => this.handleSuccess())
                    .catch(() => this.handleError());
            
                } else {
                    this.setState({launch_form: true})
                }
            } 
            else if (requestCastError === "auth_required"){
                this.setState({doLogin: true})
            }
            else{
                if (castResponse && castResponse.error_url){
                    window.location.href = castResponse.error_url;
                }
                else{
                    this.setState({doLocalError: true, errorDetails: requestCastErrorMessage});
                }
            }
        } else {
            window.location.href = castResponse.kasm_url;
        }
    }

    handleError() {
        const {requestCastErrorMessage, castResponse} = this.props;
        if (castResponse && castResponse.error_url){
            window.location.href = castResponse.error_url;
        }
        else{
            this.setState({doLocalError: true, errorDetails: requestCastErrorMessage});
        }
    }

    onCaptchaChange(value){
        this.setState({recaptcha_needed:false});
        this.props.requestCastUrl(this.props.match.params.cast_key, this.state.kasm_url, this.state.docker_network, this.state.all_query_args, value, window.document.referrer, )
           .then(() => this.handleSuccess())
            .catch(() => this.handleError());

    }

    render() {
        const { t } = this.props;
        let login_logo = window.localStorage.getItem('login_logo');
        login_logo = login_logo ? login_logo : '/img/logo.svg';
        let powered_by = login_logo != "/img/logo.svg";

        let login_caption = window.localStorage.getItem('login_caption');
        login_caption = login_caption ? login_caption : 'The Container Streaming Platform®';

        let login_splash_background = window.localStorage.getItem('login_splash_background');

        let elem = document.getElementById("favicon");
        let favicon_logo = window.localStorage.getItem('favicon_logo');
        if (favicon_logo != undefined){
            elem.href=favicon_logo;
        }

        let html_title = window.localStorage.getItem('html_title');
        if (html_title != undefined){
             document.title=html_title;
        }

        if (this.state.doLogin){
            return <Redirect to={{pathname: "/login", state: {from: this.props.location}}} />
        }
        else if (this.state.doLocalError){
            return <Redirect to={{pathname: "/error", state: {details: this.state.errorDetails}}} />
        }
        else if (this.props.requestCastLoading) {
            return (<div><LoadingSpinner /></div>);
        }
        else if (this.state.launch_form) {
            return <div className="login_box" style={{ backgroundImage: 'url("' + this.props.castBrandingResponse.launcher_background_url + '")' }}><Modal
                showCloseButton={false}
                icon={this.props.castLaunchResponse.image_src &&
                    this.props.castLaunchResponse.image_src != "" ? (
                    <img
                        onError={this.defaultThumb}
                        className="tw-rounded-full"
                        src={this.props.castLaunchResponse.image_src}
                    />
                ) : (
                    <KasmIcon kasm={this.props.castLaunchResponse} />
                )}
                maxWidth="sm:tw-max-w-md"
                iconBg="tw-scale-[170%] -tw-mt-12 tw-mb-10 tw-relative tw-p-1.5 tw-rounded-full tw-bg-white"
                titleRaw={t("workspaces.Launch") + ' ' + this.props.castLaunchResponse.friendly_name}
                open={true}
                setOpen={() => console.log('can\'t close')}
                contentRaw={<form onSubmit={this.submitLaunch} className="modal-inner tw-text-left tw-mt-8 tw-pb-14">
                    <p className="tw-mb-8 tw-text-[var(--text-color-muted-more)]">{this.props.castLaunchResponse.description}</p>
                    <LaunchForm data={this.props.castLaunchResponse} />
                    <div className="tw-bg-blue-500 tw-absolute tw-left-0 tw-right-0 tw-p-3 -tw-bottom-3 !tw-rounded-xl !tw-rounded-t-none">
                        {this.state.createClicked ? (
                            <button
                                type="button"
                                className="actionbutton tw-bg-white/20 !tw-shadow-[0_0_9px_rgba(0,0,0,0.15)] hover:!tw-bg-white/5 tw-border-t tw-border-0 tw-border-solid tw-border-white/25 hover:tw-border-white/10"
                                style={{ cursor: "pointer" }}
                                disabled={true}
                            >
                                {this.state.currentId === this.props.castLaunchResponse.image_id ? <div><FontAwesomeIcon icon={faCircleNotch} spin /></div> :
                                    t("workspaces.Launch Session")
                                }
                            </button>
                        ) : (
                            <button
                                type="submit"
                                className="actionbutton tw-bg-white/20 !tw-shadow-[0_0_9px_rgba(0,0,0,0.15)] hover:!tw-bg-white/5 tw-border-t tw-border-0 tw-border-solid tw-border-white/25 hover:tw-border-white/10"
                                style={{ cursor: "pointer" }}
                            >
                                {t("workspaces.Launch Session")}
                            </button>
                        )}
                    </div>
                </form>}
            /></div>
        }
        else if (this.state.recaptcha_needed) {
            return (
               <div className="login_box" style={{backgroundImage: 'url("' + login_splash_background + '")'}}>
                    <div className={"login-flex " + this.state.loginBoxClass}>
                        <div className="cast-outer">
                            <div className="cast-middle">
                                <Container>
                                    <Row className="justify-content-center testMe">
                                        <Col sm="8" md="6" lg="5" xl="4">
                                            <div>
                                                <CardGroup className="mb-0">
                                                    <Card className="text-white card-transparent">
                                                        <div className="logo-wrapper cast-logo-wrapper">
                                                            <div className="logo-center">
                                                                <img src={login_logo} alt="logo" style={{maxWidth: "90%"}}/>
                                                                <CardBody className="text-center">
                                                                     {powered_by ?
                                                                    <div className="smaller-text">
                                                                        <p>{t('auth.powered-by-kasm-workspaces')}</p>
                                                                    </div>
                                                                    :
                                                                    ""}
                                                                    <div>
                                                                        <h6>{login_caption}</h6>
                                                                    </div>
                                                                    <div style={{paddingTop: "20px", textAlign:"center", display: "inline-block" }}>
                                                                        {this.state.google_recaptcha_site_key ?
                                                                            <ReCAPTCHA
                                                                                sitekey={this.state.google_recaptcha_site_key}
                                                                                onChange={this.onCaptchaChange}
                                                                            />
                                                                            : ""
                                                                        }
                                                                    </div>

                                                                </CardBody>
                                                            </div>
                                                        </div>
                                                    </Card>
                                                </CardGroup>
                                            </div>
                                        </Col>
                                    </Row>
                                </Container>
                            </div>
                        </div>
                    </div>
                </div>

            );
        }
        else {
            return (
                ""
            );
        }
    }
}

Connect.propTypes = {
    history: Proptypes.object,
};

let ConnectWithRouter = withRouter(Connect);
const ConnectWithRouterTranslated = withTranslation('common')(ConnectWithRouter)
export default connect(state =>
        ({
            requestCastError: state.cast.requestCastError || null,
            requestCastRecaptchaSiteKey: state.cast.requestCastRecaptchaSiteKey || null,
            castResponse: state.cast.castResponse || null,
            launchSelections: state.images.launchSelections || {},
            castBrandingResponse: state.cast.castBrandingResponse || null,
            castLaunchResponse: state.cast.castLaunchResponse || null,
            requestCastErrorMessage: state.cast.requestCastErrorMessage || null,
            requestCastLoading: state.requestCastLoading || null
        }),
    dispatch =>
        ({
            requestCastUrl: (cast_key, kasm_url, docker_network, all_query_args, recaptcha_value, referrer, launch_selections) => dispatch(requestCastUrl(cast_key, kasm_url, docker_network, all_query_args, recaptcha_value, window.document.referrer, launch_selections)),
        }))(ConnectWithRouterTranslated);