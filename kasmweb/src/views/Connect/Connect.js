import React, { Component } from "react";
import { connect } from "react-redux";
import "../../../assets/style/style.css";
import { login_saml } from "../../actions/actionSSO";
import { getLoginSettings } from "../../actions/actionLogin";
import Proptypes from "prop-types";
import { withRouter } from "react-router";
import { NotificationManager } from "react-notifications";
import queryString from "query-string"
import {withTranslation} from "react-i18next";

class Connect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            brandingSet: false,
        };

        this.handleError = this.handleError.bind(this);
        this.handleSuccess = this.handleSuccess.bind(this);
    }

    componentDidMount() {
        let login_data = {
            "username": "",
            "password": ""
        };
        let user_info = {};
        user_info.user_id = this.props.match.params.user_id;
        user_info.session_token = this.props.match.params.session_token;

        const values = queryString.parse(this.props.location.search);
        let query_args = [];
        let query_args_str = "";

        if (values.disable_chat && values.disable_chat === "1"){
            query_args.push("disable_chat=1");
        }
        if (values.disable_control_panel && values.disable_control_panel === "1"){
            query_args.push("disable_control_panel=1");
        }
        if (values.disable_tips && values.disable_tips === "1"){
            query_args.push("disable_tips=1");
        }
        if (values.disable_fixed_res && values.disable_fixed_res === "1"){
            query_args.push("disable_fixed_res=1");
        }

        if (query_args.length > 0){
            query_args_str = "?" + query_args.join('&');
        }

        this.props.login_saml(login_data, user_info)
            .then(() => this.handleSuccess(query_args_str))
            .catch(() => this.handleError());


        this.props.getLoginSettings().then((res) => {
             window.localStorage.setItem("login_logo", res.response.login_logo);
             window.localStorage.setItem("login_caption", res.response.login_caption);
             window.localStorage.setItem("header_logo", res.response.header_logo);
             window.localStorage.setItem("login_splash_background", res.response.login_splash_background);
             window.localStorage.setItem("splash_background", res.response.splash_background);
             window.localStorage.setItem("html_title", res.response.html_title);
             window.localStorage.setItem("favicon_logo", res.response.favicon_logo);
             window.localStorage.setItem("loading_session_text", res.response.loading_session_text);
             window.localStorage.setItem("joining_session_text", res.response.joining_session_text);
             window.localStorage.setItem("destroying_session_text", res.response.destroying_session_text);
             window.localStorage.setItem("launcher_background_url", res.response.launcher_background_url);
             this.setState({brandingSet: true})
        });

    }

    handleSuccess(query_args_str) {
        const {sso_error_message, t} = this.props;
        if (sso_error_message) {
            NotificationManager.error(sso_error_message,t('auth.login-failed'), 5000);
            this.props.history.push("/staticlogin")
        } else {
            // holds url of desired page from before login if there
            if (this.props.match.params.type === "kasm") {
                let kasm_id = this.props.match.params.kasm_id;
                if (kasm_id) {
                    window.location.href = "/#/kasm/" + kasm_id + query_args_str;
                }
            } else if (this.props.match.params.type === "join") {
                let kasm_id = this.props.match.params.kasm_id;
                if (kasm_id) {
                    window.location.href = "/#/join/" + kasm_id + query_args_str;
                }
            } else if (this.props.match.params.type === "login"){
                window.location.href = "/#/userdashboard";
            }
        }
    }

    handleError() {
        const {sso_error_message, t} = this.props;
        NotificationManager.error(sso_error_message,t('auth.login-failed'), 5000);
        this.props.history.push("/staticlogin")
    }

    render() {
        return (
            ""
        );
    }
}

Connect.propTypes = {
    history: Proptypes.object,
};

let ConnectWithRouter = withRouter(Connect);
const ConnectWithRouterTranslated = withTranslation('common')(ConnectWithRouter)
export default connect(state =>
        ({
            isLoggedIn: state.auth.isLoggedIn,
            sso_error_message: state.auth.sso_error_message,
            auto_login_kasm: state.sso.auto_login_kasm
        }),
    dispatch =>
        ({
            login_saml: (login_data, user_info) => dispatch(login_saml(login_data, user_info)),
            getLoginSettings: () => dispatch(getLoginSettings()),
        }))(ConnectWithRouterTranslated);