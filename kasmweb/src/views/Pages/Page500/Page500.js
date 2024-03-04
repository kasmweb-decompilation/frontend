import React, {Component} from "react";
import {Container, Row, Col, Button, Input, InputGroup, InputGroupAddon, InputGroupText} from "reactstrap";
import {withTranslation} from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons/faSearch";

class Page500 extends Component {
    render() {
        const { t } = this.props;
        return (
            <div className="app flex-row align-items-center bg-image">
                <Container>
                    <Row className="justify-content-center">
                        <Col md="6">
                            <span className="clearfix">
                                <h1 className="float-left display-3 mr-4">500</h1>
                                <h4 className="pt-3">{t('pages.houston-we-have-a-problem')}</h4>
                                <p className="text-muted float-left">{t('pages.the-page-you-are-looking-for-i')}</p>
                            </span>
                            <InputGroup className="input-prepend">
                                <InputGroupAddon addonType="prepend">
                                    <InputGroupText>
                                        <FontAwesomeIcon icon={faSearch} />
                                    </InputGroupText>
                                </InputGroupAddon>
                                <Input size="16" type="text" placeholder={t('pages.what-are-you-looking-for')} />
                                <InputGroupAddon addonType="append">
                                    <Button color="info">{t('pages.search')}</Button>
                                </InputGroupAddon>
                            </InputGroup>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}
const Page500Translated = withTranslation('common')(Page500)
export default Page500Translated;
