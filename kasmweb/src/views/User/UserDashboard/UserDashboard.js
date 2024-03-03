import React, { Component } from "react";
import { connect } from "react-redux";
import LoadingSpinner from "../../../components/LoadingSpinner/index";
import { getUserKasms, getUserImages, clearSearch } from "../../../actions/actionDashboard";
import ListKasms from "./ListKasms";
import { Col, Row, Card, CardBody, Progress } from "reactstrap";
import Proptypes from "prop-types";
import { logout, logoutControlled } from "../../../actions/actionLogin";
import { getSubscriptionInfo } from "../../../actions/actionUser";
import StripeSubscription from "../../../components/Stripe/Subscription/Subscription.js";
import {
    IS_ANONYMOUS,
    DASHBOARD_REDIRECT,
    REQUIRE_SUBSCRIPTION,
    HAS_SUBSCRIPTION
} from "../../../constants/Constants.js";
import {withTranslation} from "react-i18next";

class UserDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            kasmID: "",
            showSubscription: false
        };
    }

    UNSAFE_componentWillMount(){
        let dashboard_redirect = window.localStorage.getItem("user_info") && JSON.parse(window.localStorage.getItem("user_info")).dashboard_redirect;
        if (dashboard_redirect){
            this.props.logoutControlled().then(() => {
                window.location.href = dashboard_redirect;
            }).catch(() => {
                window.location.href = dashboard_redirect;
            });

        }

        let require_subscription = window.localStorage.getItem("user_info") && JSON.parse(window.localStorage.getItem("user_info")).require_subscription;
        let has_subscription = window.localStorage.getItem("user_info") && JSON.parse(window.localStorage.getItem("user_info")).has_subscription;
        if (require_subscription && !has_subscription){
            window.location.href = "/#/subscribe";
        }
    }

    async componentDidMount() {
        const userInfo = JSON.parse(window.localStorage.user_info);
        const payload_data = {
            "token": userInfo.token,
            "username": userInfo.username
        };
        this.props.kasmsFunc(payload_data);
        this.props.imageFunc(payload_data);
        this.props.clearSearch();
        if (userInfo.require_subscription && userInfo.has_subscription && !userInfo.has_plan) {
            try {
                await this.props.getSubscriptionInfo()
                this.setState({ showSubscription: true })
            } catch (e) {
                console.log('Error looking up subscription details')
            }
        }
    }

    render() {
        const { t } = this.props;
        if (IS_ANONYMOUS === false) {
            if (this.props.getuserkasmsLoading) {
                return (<div><LoadingSpinner /></div>);
            }

            if (this.state.showSubscription && this.props.subSummary) {
                return (
                    <Row>
                        <div className={'panelbackground'} style={{ background: "transparent" }}>

                            <div className="tw-w-full tw-flex tw-items-center" style={{ padding: '50px' }}>

                                <Col sm={{ size: 6, order: 3, offset: 3 }} className="tw-text-center">
                                    <Card style={{ backgroundColor: 'var(--modal-bg)' }}>
                                        <CardBody className="user-setting tw-text-left">
                                            <StripeSubscription
                                                subSummary={this.props.subSummary}
                                            />

                                        </CardBody>
                                    </Card>
                                    <div className="tw-flex tw-w-full tw-gap-4">
                                        <a href={this.props.billingInfo && this.props.billingInfo.portal} className="tw-rounded tw-grow tw-h-14 tw-bg-slate-600 hover:tw-bg-slate-800 tw-text-white hover:tw-text-white hover:tw-no-underline tw-flex tw-items-center tw-justify-center tw-transition">
                                            {t('users.Customer Portal')}
                                        </a>
                                        <a href="/#/subscribe" className="tw-rounded tw-grow tw-h-14 tw-bg-blue-500 hover:tw-bg-slate-800 tw-text-white hover:tw-text-white hover:tw-no-underline tw-flex tw-items-center tw-justify-center tw-transition">
                                            {t('users.Subscribe')}
                                        </a>
                                    </div>
                                </Col>
                            </div>
                        </div >

                    </Row >

                );
            }

            return (
                <div>
                    <Row>
                        <Col sm={{size: 12, order: 0, offset: 0}}>
                            <ListKasms kasmID={this.state.kasmID}/>
                        </Col>
                    </Row>
                </div>
            );
        }
        else{
            return ("");
        }
    }
}


UserDashboard.propTypes = {
    imageFunc: Proptypes.func.isRequired,
    kasmsFunc: Proptypes.func.isRequired,
    clearSearch: Proptypes.func.isRequired,
    liveKasms: Proptypes.array,
    availableKasms: Proptypes.array,
    getuserkasmsLoading: Proptypes.bool,
    history: Proptypes.object.isRequired,
};

function mapStateToProps(state) {
    return {
        isLoggedIn: state.auth.isLoggedIn,
        loginError: state.dashboard.loginError,
        availableKasms: state.dashboard.availableKasms,
        liveKasms: state.dashboard.liveKasms,
        getuserkasmsLoading: state.dashboard.getuserkasmsLoading,
        subSummary: state.user.subSummary,
        billingInfo: state.user.billingInfo,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        imageFunc: (payload_data) => {dispatch(getUserImages(payload_data));},
        kasmsFunc: (payload_data) => {dispatch(getUserKasms(payload_data));},
        clearSearch: () => { dispatch(clearSearch())},
        logout: (logout_data) => {dispatch(logout(logout_data));},
        getSubscriptionInfo: () => dispatch(getSubscriptionInfo()),
        logoutControlled: (logout_data) => dispatch(logoutControlled(logout_data))
    };
}
const UserDashboardTranslated = withTranslation('common')(UserDashboard)
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UserDashboardTranslated);
