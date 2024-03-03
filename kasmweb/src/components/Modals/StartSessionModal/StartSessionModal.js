import React, {Component} from "react";
import { connect } from "react-redux";
import { NotificationManager } from "react-notifications";
import Proptypes from "prop-types";
import {
    startKasms,
} from "../../../actions/actionDashboard";
import {withTranslation} from "react-i18next";
import { ConfirmAction } from "../../Table/NewTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/pro-light-svg-icons/faPlay";

class StartSessionModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            confirmClicked: false,
            title: "Start Session",
            successMessage: "Successfully Started Session",
            failedMessage: "Failed to Start Session",
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

        this.props.startKasms(this.props.kasmId)
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
                            title: t('workspaces.Start Session'),
                            text: t('workspaces.confirm_start'),
                            iconBg: 'tw-bg-blue-500 tw-text-white',
                            icon: <FontAwesomeIcon icon={faPlay} />,
                            confirmBg: 'tw-bg-blue-500',
                            confirmText: t('workspaces.Start'),

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

StartSessionModal.propTypes = {
    kasmId: Proptypes.string.isRequired,
    dockerName: Proptypes.string.isRequired,
    showModal: Proptypes.bool.isRequired,
    toggleModalFunction: Proptypes.func.isRequired,
    onSuccess: Proptypes.func.isRequired,
};

function mapStateToProps(state) {
    return {
        funcErrorMessage: state.dashboard.startKasmsErrorMessage || null,
        funcLoading: state.dashboard.startKasmsLoading || null,
    };
}

function mapDispatchToProps(dispatch) {
    return({
        startKasms: (data) => dispatch(startKasms(data)),
    });
}

const StartSessionModalTranslated = withTranslation('common')(StartSessionModal)
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(StartSessionModalTranslated);

