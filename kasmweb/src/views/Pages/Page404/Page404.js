import React, {Component} from "react";
import {Container, Row, Col} from "reactstrap";
import { Link } from "react-router-dom";
import {withTranslation} from "react-i18next";

class Page404 extends Component {
    render() {
        const { t } = this.props;
        return (
            <div>
                <Link to="/" style= {{align: "left"}}> {t('pages.go-to-home')} </Link>
                <div className="app flex-row align-items-center bg-image">
                    <Container>
                        <Row className="justify-content-center">
                            <Col md="6">
                                <div className="clearfix">
                                    <h1 className="float-left display-3 mr-4">404</h1>
                                    <h4 className="pt-3">{t('pages.oops-youre-lost')}</h4>
                                    <p className="text-muted float-left">{t('pages.the-page-you-are-looking-for-w')}</p>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </div>
        );
    }
}
const Page404Translated = withTranslation('common')(Page404)
export default Page404Translated;
