import React, {Component} from "react";
import { Link } from "react-router-dom";
import { Row, Col,  Card, CardHeader, Container, CardBody, CardFooter, Collapse, Button} from "reactstrap";
import { DISPLAY_UI_ERRORS } from "../../constants/Constants.js";
import { serverLog } from "../../actions/actionServerLog";
import { connect } from "react-redux";
import {withTranslation} from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamation } from "@fortawesome/free-solid-svg-icons/faExclamation";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  componentDidCatch(error, errorInfo) {
      this.setState({
          error: error,
          errorInfo: errorInfo
      });
      const log = {
          message: "An unhandled client error has occurred: (" + error.message + ")",
          level: "error",
          error_name: error.name,
          error_stack: error.stack,
          error_message: error.message,
          error_component_stack: errorInfo.componentStack
      };

      this.props.serverLog(log);

      const eventData = {
          type: 'error_boundary',
          value: log,
      };
      window.parent.postMessage(eventData, '*');
  }

    render() {
        const { t } = this.props;
        if (this.state.errorInfo) {
            return (
                <div className="app bg-image">
                    <br/>
                    <br/>
                    <Row>
                        <Col sm={{size: 10, order: 3, offset: 1}}>
                            <Card className="errorBoundary">
                                <CardHeader>
                                    <FontAwesomeIcon icon={faExclamation} /> <strong>{t("error_boundary.Error")}</strong>
                                </CardHeader>
                                <CardBody>
                                    <h2>{t("error_boundary.oops")}</h2>
                                    <div>
                                    {t("error_boundary.persists")}
                                    </div>
                                    <br/>
                                    <a href="/"><Button size="sm" color="dark"> {t("error_boundary.Return to Application")}</Button></a>
                                    <br/>
                                    <br/>
                                    {
                                        DISPLAY_UI_ERRORS ?
                                            <div style={{whiteSpace: 'pre-wrap'}}>
                                                {this.state.error && this.state.error.toString()}
                                                <br />
                                                {this.state.errorInfo.componentStack}
                                            </div>
                                            :
                                            ""
                                    }

                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </div>
            );
        }
        // Normally, just render children
        return this.props.children;
    }
}

const ErrorBoundaryTranslated = withTranslation('common')(ErrorBoundary)

export default connect(state =>
    ({}),
dispatch =>
    ({
        serverLog: (log) => dispatch(serverLog(log)),

    }))(ErrorBoundaryTranslated);