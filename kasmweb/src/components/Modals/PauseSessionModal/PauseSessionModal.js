import React, {Component} from "react";
import { connect } from "react-redux";
import { NotificationManager } from "react-notifications";
import Proptypes from "prop-types";
import {
    pauseKasms,
} from "../../../actions/actionDashboard";
import {withTranslation} from "react-i18next";
import { ConfirmAction } from "../../Table/NewTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPause } from "@fortawesome/pro-light-svg-icons/faPause";

class PauseSessionModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            confirmClicked: false,
            title: "Pause Session",
            successMessage: "Successfully Paused Session",
            failedMessage: "Failed to Pause Session",
        };
        this.toggle = this.toggle.bind(this);
        this.confirm = this.confirm.bind(this);
        this.cancel = this.cancel.bind(this);
        this.handleSuccess = this.handleSuccess.bind(this)
        this.handleError = this.handleError.bind(this)
    }

    toggle(){
        this.props.toggleModalFunction(!this.props.showModal)
    }

    confirm(){
        this.setState({
          confirmClicked: true,
        });

        this.props.pauseKasms(this.props.kasmId)
        .then(() => this.handleSuccess())
        .catch(() => this.handleError());
    }

    handleSuccess() {
        const { funcErrorMessage, t } = this.props;
        this.props.toggleModalFunction(false)
        if (funcErrorMessage) {
          NotificationManager.error(funcErrorMessage, t("workspaces." + this.state.title), 3000);
        } else {
            this.props.onSuccess()
            NotificationManager.success(
                t("workspaces." + this.state.successMessage),
                t("workspaces." + this.state.title),
                3000
            );
        }
      }

  handleError() {
    const { funcErrorMessage, t } = this.props;
    this.props.toggleModalFunction(false)
    if (funcErrorMessage) {
      NotificationManager.error(funcErrorMessage, t("workspaces." + this.state.title), 3000);
    } else {
      NotificationManager.error(t("workspaces." + this.state.failedMessage), t("workspaces." + this.state.title), 3000);
    }
  }

    cancel(){
        this.toggle();
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
                            title: t('workspaces.Pause Session'),
                            text: t('workspaces.confirm_pause'),
                            iconBg: 'tw-bg-yellow-500 tw-text-white',
                            icon: <FontAwesomeIcon icon={faPause} />,
                            confirmBg: 'tw-bg-yellow-500',
                            confirmText: t('workspaces.Pause'),

                        }
                    }}
                    open={this.props.showModal}
                    externalClose={true}
                    setOpen={this.cancel}
                    onAction={this.confirm}
                />

            </div>
        );
    }

}

PauseSessionModal.propTypes = {
    kasmId: Proptypes.string.isRequired,
    dockerName: Proptypes.string.isRequired,
    showModal: Proptypes.bool.isRequired,
    toggleModalFunction: Proptypes.func.isRequired,
    onSuccess: Proptypes.func.isRequired,
};

function mapStateToProps(state) {
    return {
        funcErrorMessage: state.dashboard.pauseKasmsErrorMessage || null,
        funcLoading: state.dashboard.pauseKasmsLoading || null,
    };
}

function mapDispatchToProps(dispatch) {
    return({
        pauseKasms: (data) => dispatch(pauseKasms(data)),
    });
}

const PauseSessionModalTranslated = withTranslation('common')(PauseSessionModal)
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PauseSessionModalTranslated);

