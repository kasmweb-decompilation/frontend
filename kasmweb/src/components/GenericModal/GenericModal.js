import React,{ Component } from "react";
import { Modal,ModalHeader,Button,ModalBody, ModalFooter } from "reactstrap";
import { updateUserAttribute} from "../../actions/actionUser";
import { connect } from "react-redux";
import IconCross from "../../../assets/images/cross.png";
import IconTooltipInfo from "../../../assets/images/tooltip-info.png";
import {withTranslation} from "react-i18next";

class GenericModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: true,
            checked: false
        };
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleClose() {
        this.setState({ show: false });
        this.props.updateUserAttribute({"show_tips": !this.state.checked});
    }

    toggle(){
        this.setState({ modal: !this.state.modal }); 
    }

    handleShow() {
        this.setState({ show: true });
    }

    componentDidMount(){
        this.setState({ show: true });
    }

    handleChange(){
        this.setState({
            checked: !this.state.checked
        });
    }

    render() {
      const {t} = this.props;
        return (
          <div>
            <Modal
              zIndex={999999}
              isOpen={this.state.show}
              toggle={this.handleClose}
            >
              <ModalBody>
                <div className="modal-inner">
                  <div className="opera-box">
                    <div className="opera-box-img">
                      <img src={IconTooltipInfo} />
                    </div>
                    <div className="opera-box-detail">
                      <div className="modal-item">
                        <h4>{t('control_panel.welcome-to-workspaces')}</h4>
                        <button className="close-icon" onClick={this.handleClose}>
                          <img src={IconCross} alt="close" />
                        </button>
                      </div>
                      <p className="opera-Productivity">
                        <span>{t('control_panel.the-control-panel-can-be-found')}</span>
                      </p>
                    </div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                  <p>
                    <br />
                    <br />
                    <input
                        type="checkbox"
                        defaultChecked={this.state.checked}
                        ref="complete"
                        onChange={this.handleChange}
                    />
                    <label>{t('control_panel.dont-show-tips-on-startup')}</label>
                    </p>
                  </div>
                </div>
                <div style={{textAlign: "center"}}>
                  <Button
                    className="delete-button tip-modal-button"
                    onClick={this.handleClose}>{t('control_panel.got-it')}</Button>
                </div>
              </ModalBody>
            </Modal>
          </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        updateUserErrorMessage: state.user.updateUserErrorMessage,
        updateUserAttrLoading: state.user.updateUserAttrLoading,
        updateUserAttrError: state.user.updateUserAttrError
    };
}

function mapDispatchToProps(dispatch) {
    return ({
        updateUserAttribute: (data) => dispatch(updateUserAttribute(data))
    });
}

GenericModal = connect(
    mapStateToProps,
    mapDispatchToProps
)(GenericModal);
const GenericModalTranslated = withTranslation('common')(GenericModal)
export default GenericModalTranslated;