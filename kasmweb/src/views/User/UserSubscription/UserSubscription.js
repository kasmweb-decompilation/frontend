import React, { Component } from "react";
import { connect } from "react-redux";
import { Row, Col, Table, Card, CardBody, CardHeader, Button, Spinner } from "reactstrap";
import { NotificationManager } from "react-notifications";
import Proptypes from "prop-types";
import StripeSignup from "../../../components/Stripe/Signup/Signup.js";
import { getUser, getSubscriptionInfo } from "../../../actions/actionUser";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { getNewToken } from "../../../actions/actionLogin";
import {withTranslation} from "react-i18next";

class UserSubscription extends Component {
    constructor(props) {
        super(props);
        this.state = {
            create: false
        };
        this.refreshToken = this.refreshToken.bind(this)
    }

    async componentDidMount() {

        this.props.getSubscriptionInfo()
        const user = await this.props.getUser()
        if (user && user.response) {
            this.setState({ user: user.response.user });
        }

        const search = this.props.location.search; // could be '?foo=bar'
        const params = new URLSearchParams(search);
        const event = params.get('event');
        if (event === 'create_subscription') {
            this.setState({ create: true })
            setTimeout(() => {
                this.refreshToken();
            }, 3000);
        }

    }



    async refreshToken() {
        const userInfo = JSON.parse(window.localStorage.getItem("user_info"));
        const payload_data = {
            token: userInfo.token,
            username: userInfo.username,
        };
        try {
            const data = await this.props.getNewToken(payload_data)
            if (data.response.has_subscription) {
                window.location.href = "/"
            } else {
                setTimeout(() => {
                    this.refreshToken();
                }, 2000);    
            }
        } catch (e) {
            const { t } = this.props;
            NotificationManager.error(t('users.An error occurred refreshing user token'), t("users.User Token"), 3000);
        }

    }

    render() {
        if (this.props.getUsersLoading) {
            return (<div> <LoadingSpinner /></div>);
        }

        const { user } = this.state;
        const { subSummary, subInfoLoading, billingInfo, t } = this.props
        const bgImage = () => {
            let launcher_background_url = window.localStorage.getItem("launcher_background_url");
            let bgimage = '/img/backgrounds/background1.jpg'
            if (launcher_background_url && launcher_background_url !== 'undefined') {
                bgimage = launcher_background_url
            }

            return bgimage;
        }


        return (
            <Row>
                <div className={'panelbackground'} style={{ backgroundImage: "url(" + bgImage() + ")" }}>

                    <div className="tw-flex tw-items-center" style={{ width: '100%', padding: '50px' }}>

                        <Col sm={{ size: 8, order: 3, offset: 2 }} className="tw-text-center">
                            {user && !user.program_id && billingInfo ?
                                <Card style={{ backgroundColor: 'var(--modal-bg)' }}>
                                    <CardBody className="user-setting tw-text-left">
                                        {!this.state.create ? 
                                        <StripeSignup
                                            email={user.username}
                                            user_id={user.user_id}
                                            pricingTable={billingInfo.stripe_pricing_table_id}
                                            publishableKey={billingInfo.stripe_publishable_key}
                                        />
                                        :
                                        <div className="tw-flex tw-flex-col tw-justify-center tw-items-center tw-py-10">

                                             <Spinner className="tw-mb-4" />
                                             <div>{t("users.Waiting for subscription data")}</div>
                                        </div>
                                       
                                        }
                                    </CardBody>
                                </Card>

                                :
                                ""
                            }
                        </Col>
                    </div>
                </div>

            </Row>
        );
    }
}

UserSubscription.propTypes = {
};
const UserSubscriptionTranslated = withTranslation('common')(UserSubscription)
export default connect(state =>
({
    user: state.user.user || [],
    createSub: state.user.createSub,
    subSummary: state.user.subSummary,
    billingInfo: state.user.billingInfo,
    productList: state.user.productList,
    subInfoLoading: state.user.subInfoLoading,
    getUsersLoading: state.user.getUsersLoading || null,
}),
    dispatch =>
    ({
        getUser: () => dispatch(getUser()),
        getNewToken: (payload_data) => dispatch(getNewToken(payload_data)),
        getSubscriptionInfo: () => dispatch(getSubscriptionInfo()),
    }))(UserSubscriptionTranslated);
