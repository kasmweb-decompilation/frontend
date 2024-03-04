import React, {Component} from "react";
import {  Row, Col, Collapse, CardBody} from "reactstrap";
import { withRouter } from "react-router";
import Proptypes from "prop-types";
import { connect } from "react-redux";
import {Link} from "react-router-dom";
import {withTranslation} from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp } from "@fortawesome/free-solid-svg-icons/faChevronUp";

var blinker;

class ShareBanner extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chatIconColor: "black",
            blinking: "red"
        };
    }

    componentDidMount() {
        blinker = setInterval(() => {
            this.setState({blinking: this.state.blinking === 'white' ? 'red' : 'white'})
        }, 900);
    }


    componentWillUnmount() {
        clearInterval(blinker);
    }


    render() {
        const {statusKasms, t} = this.props;
        const {blinking} = this.state;
        const userInfo = JSON.parse(window.localStorage.user_info);
        let header_logo = window.localStorage.getItem('header_logo');
        header_logo = header_logo ? header_logo : "img/headerlogo.svg";
        return (
            <div >
                {statusKasms &&
                    <React.Fragment>
                        <div className="share-banner">
                            <div className="flex-width">
                                <Link to={"/"}>
                                    <img className="header_logo" src={header_logo} width="145" height="35"
                                         alt="logo"/>
                                </Link>
                            </div>
                            <span style={{width: '80%', color: '#717577', fontWeight: 'lighter', position:'absolute', textAlign:'center'}} className="justify-content-center align-self-center">
                                {statusKasms.user ?
                                    <span><span style={{color: 'rgb(0, 133, 194)', fontWeight: 'bold'}}>{t("share.Watching")}: </span>&nbsp; {statusKasms.user.username}</span>
                                    : <span><span style={{color: 'rgb(0, 133, 194)', fontWeight: 'bold'}}>{t("share.Streaming")}: </span>&nbsp; {userInfo.username}</span>
                                }
                            </span>
                            <div style={{width: '50px', paddingRight:'1em'}} className=" justify-content-center align-self-center">
                                <button data-target="#chatCollapse" onClick={this.props.toggleBanner}
                                        style={{color: this.state.chatIconColor, fontSize: '1.2em'}}>
                                    &nbsp;<FontAwesomeIcon icon={faChevronUp} />
                                </button>
                            </div>
                        </div>
                    </React.Fragment>
                }
            </div>
        );
    }
}


ShareBanner.propTypes = {
    // statusKasms: Proptypes.object.isRequired
};

ShareBanner = withRouter(ShareBanner); // eslint-disable-line
const ShareBannerTranslated = withTranslation('common')(ShareBanner)
export default connect(state =>
        ({

        }),
    dispatch =>
        ({

        }))(ShareBannerTranslated);
