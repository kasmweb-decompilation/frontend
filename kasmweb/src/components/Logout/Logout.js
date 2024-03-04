import React, {Component} from "react";
import { connect } from "react-redux";
import Proptypes from "prop-types";
import { logout } from "../../actions/actionLogin";
import {withTranslation} from "react-i18next";
import { ConfirmAction } from "../Table/NewTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons/faArrowRightFromBracket";
import { RenderToggle } from "../../utils/formValidations";

class Logout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            logoutAll: false,
        };
        this.toggle = this.toggle.bind(this);
        this.confirmLogout = this.confirmLogout.bind(this);
        this.cancelLogout = this.cancelLogout.bind(this);
        this.updateLogoutAll = this.updateLogoutAll.bind(this);
    }

    toggle(){
        this.props.onChange(!this.props.showLogout)
    }

    confirmLogout(){
        let logout_data = {logout_all: this.state.logoutAll};
        this.props.logout(logout_data);
        this.toggle();
    }

    cancelLogout(){
        this.toggle();
    }

    updateLogoutAll() {
        this.setState({logoutAll: !this.state.logoutAll});
    }

    componentDidMount(){
    }

    render() {
        const { t } = this.props;
        return (
            <div>
                <ConfirmAction
                    confirmationDetails={{
                        action: null,
                        details: {
                            title: t('control_panel.Logout'),
                            text: t('control_panel.Are you sure you want to logout?'),
                            iconBg: 'tw-bg-pink-700 tw-text-white',
                            icon: <FontAwesomeIcon icon={faArrowRightFromBracket} />,
                            confirmBg: 'tw-bg-pink-700',
                            confirmText: t('control_panel.Logout'),
                            additional:
                                <div className="tw-text-center">
                                    <div className="group-label tw-flex tw-justify-center tw-items-center tw-gap-3"><label htmlFor="logoutall" id="force_label"><b className="tw-mb-2">{t('control_panel.sign_out_devices')}</b> </label><RenderToggle name="logoutall" id="logoutall" checked={!!this.state.logoutAll} onChange={this.updateLogoutAll} /></div>
                                </div>
                        }
                    }}
                    open={this.props.showLogout}
                    externalClose={true}
                    setOpen={this.cancelLogout}
                    onAction={this.confirmLogout}
                />

            </div>
        );
    }

}

Logout.propTypes = {
    logout: Proptypes.func.isRequired,
};

function mapStateToProps(state) {
    return {

    };
}

function mapDispatchToProps(dispatch) {
    return({
        logout: (logout_data) => {dispatch(logout(logout_data));},
        getLoginSettings: () => {dispatch(getLoginSettings());},
    });
}

const LogoutTranslated = withTranslation('common')(Logout)
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LogoutTranslated);

