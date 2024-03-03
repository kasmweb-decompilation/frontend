import React, { Component } from "react";
import { connect } from "react-redux";
import "../../../../assets/style/style.css";
import { login_saml } from "../../../actions/actionSSO";
import Proptypes from "prop-types";
import { withRouter } from "react-router";
import { NotificationManager } from "react-notifications";
import {withTranslation} from "react-i18next";

class SSO extends Component {
    constructor(props) {
        super(props);

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
        this.props.login_saml(login_data, user_info)
            .then(() => this.handleSuccess())
            .catch(() => this.handleError());
    }

    handleSuccess() {
        const {sso_error_message, t} = this.props;
        if (sso_error_message) {
            NotificationManager.error(sso_error_message,t('auth.login-failed'), 5000);
        } else {
            // holds url of desired page from before login if there
            let con_url = window.localStorage.getItem("continuation_url");
            localStorage.removeItem("continuation_url");
            if (con_url && con_url != "/#/" && (con_url.indexOf("logout") === -1)) {
                window.location.href = con_url;
            } else if (this.props.auto_login_kasm) {
                window.location.href = "/#/go";
            } else {
                window.location.href = "/#/";
            }
        }
    }

    handleError() {
        const {sso_error_message, t} = this.props;
        NotificationManager.error(sso_error_message,t('auth.login-failed'), 5000);
        window.location.href = "/staticlogin";
    }

    render() {
        const { t } = this.props;
        return (
            <div className={"text-center"}>
                {t('pages.logging-in')}<br />
                {t('pages.if-the-page-does-not-redirect-')} <a href="/" >{t('pages.click-here')}</a>
            </div>
        );
    }
}

SSO.propTypes = {
    history: Proptypes.object,
};

SSO = withRouter(SSO);
const SSOTranslated = withTranslation('common')(SSO)
export default connect(state =>
        ({
            isLoggedIn: state.auth.isLoggedIn,
            sso_error_message: state.auth.sso_error_message,
            auto_login_kasm: state.sso.auto_login_kasm
        }),
    dispatch =>
        ({
            login_saml: (login_data, user_info) => dispatch(login_saml(login_data, user_info)),
        }))(SSOTranslated);