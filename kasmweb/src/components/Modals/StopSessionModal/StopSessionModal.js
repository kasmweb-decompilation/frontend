import React, {Component} from "react";
import { connect } from "react-redux";
import { NotificationManager } from "react-notifications";
import Proptypes from "prop-types";
import {
    stopKasms,
} from "../../../actions/actionDashboard";
import {withTranslation} from "react-i18next";
import { ConfirmAction } from "../../Table/NewTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStop } from "@fortawesome/pro-light-svg-icons/faStop";

class StopSessionModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            confirmClicked: false,
            title: "Stop Session",
            successMessage: "Successfully Stopped Session",
            failedMessage: "Failed to Stop Session",
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

        this.props.stopKasms(this.props.kasmId)
        .then(() => this.handleSuccess())
        .catch(() => this.handleError());
    }

    handleSuccess() {
        const { funcErrorMessage, t } = this.props;
        this.toggle()
        if (funcErrorMessage) {
          NotificationManager.error(funcErrorMessage, t("workspaces." + this.state.title), 3000);
        } else {
            NotificationManager.success(
                t("workspaces." + this.state.successMessage),
                t("workspaces." + this.state.title),
                3000
            );
            this.props.onSuccess()
        }
      }

  handleError() {
    const { funcErrorMessage, t } = this.props;
    this.toggle()
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
                            title: t('workspaces.Stop Session'),
                            text: t('workspaces.confirm_stop'),
                            iconBg: 'tw-bg-pink-700 tw-text-white',
                            icon: <FontAwesomeIcon icon={faStop} />,
                            confirmBg: 'tw-bg-pink-700',
                            confirmText: t('workspaces.Stop'),

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

StopSessionModal.propTypes = {
    kasmId: Proptypes.string.isRequired,
    dockerName: Proptypes.string.isRequired,
    showModal: Proptypes.bool.isRequired,
    toggleModalFunction: Proptypes.func.isRequired,
    onSuccess: Proptypes.func.isRequired,
};

function mapStateToProps(state) {
    return {
        funcErrorMessage: state.dashboard.stopKasmsErrorMessage || null,
        funcLoading: state.dashboard.stopKasmsLoading || null,
    };
}

function mapDispatchToProps(dispatch) {
    return({
        stopKasms: (data) => dispatch(stopKasms(data)),
    });
}

const StopSessionModalTranslated = withTranslation('common')(StopSessionModal)
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(StopSessionModalTranslated);

