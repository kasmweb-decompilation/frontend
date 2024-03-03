import React, {Component} from "react";
import {Container, Row, Col} from "reactstrap";
import {withTranslation} from "react-i18next";

class PageError extends Component {
    render() {
        const { t } = this.props;
        let details =  this.props.location.state ? this.props.location.state.details : "";
        return (
            <div>
                <div className="app flex-row align-items-center bg-image">
                    <Container>
                        <Row className="justify-content-center">
                            <Col md="6">
                                <div className="clearfix">
                                    <h1 className="float-left display-3 mr-4">{t('pages.error')}</h1>
                                    <h4 className="pt-3">{t('pages.oops-something-has-gone-wrong')}</h4>
                                    <p className="text-muted float-left">{details}</p>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </div>
        );
    }
}
const PageErrorTranslated = withTranslation('common')(PageError)
export default PageErrorTranslated;
