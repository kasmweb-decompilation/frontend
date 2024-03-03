import React, { Component } from "react";
import Proptypes from "prop-types";
import { connect } from "react-redux";
import {
    renderField,
    required,
    renderTextArea, renderPass,
} from "../../utils/formValidations.js";
import { Field, reduxForm } from "redux-form";
import { withRouter } from "react-router-dom";
import {createImageFromSession} from "../../actions/actionKasm";
import { NotificationManager } from "react-notifications";
import moment from "moment";
import {withTranslation} from "react-i18next";
import { Groups, FormFooter, FormField } from "../Form/Form.js";

class CreateImageFromSessionFormTemplate extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentProvider: {},
        };
        this.submitApi = this.submitApi.bind(this);
        this.cancelButton = this.cancelButton.bind(this);
        this.createImageSessionConfirm = this.createImageSessionConfirm.bind(this);
        this.handleCreateImageSessionSuccess = this.handleCreateImageSessionSuccess.bind(this);
        this.handleCreateImageSessionError = this.handleCreateImageSessionError.bind(this);
        this.cancelCreateImageSession = this.cancelCreateImageSession.bind(this);

    }

    componentDidMount() {
        if (this.props.kasmId && this.props.dockerName) {
            this.props.initialize({
                docker_image: this.props.dockerName + "-" + moment().format('YYYY-MM-DD.HH.mm')
            });
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.current_provider && this.props.current_provider !== nextProps.current_provider) {
            this.props.initialize({
            });
        }
    }

    createImageSessionConfirm(kasmId, dockerName) {
        this.setState({ createImageSessionModal: !this.state.createImageSessionModal, kasmId: kasmId, dockerName: dockerName });
    }

  cancelCreateImageSession() {
    this.setState({ createImageSessionModal: !this.state.createImageSessionModal });
  }

  handleCreateImageSessionSuccess() {
    const { createImageSessionErrorMessage, createdImageSession, t } = this.props;
    if (createImageSessionErrorMessage) {
      NotificationManager.error(
        createImageSessionErrorMessage,
        t("image_from_session.Failed to Create Image from Session"),
        3000
      );
    } else {
      NotificationManager.success(
        t("image_from_session.image_success"),
        t("image_from_session.Create Image"),
        3000
      );
      this.props.history.push("/updateworkspace/" + createdImageSession.image_id)
    }
  }

  handleCreateImageSessionError() {
    const { createImageSessionError, t } = this.props;
    if (createImageSessionError) {
      NotificationManager.error(
        createImageSessionError,
        t("image_from_session.Failed to Create Image from Session"),
        3000
      );
    } else {
      NotificationManager.error(t("image_from_session.Failed to Create Image from Session"), t("image_from_session.Create Image"), 3000);
    }
  }


    cancelButton() {
        this.props.cancel_button(userData)
    }


    submitApi(userData) {
        let data = {target_kasm: userData};
        data.target_kasm.kasm_id = this.props.kasmId;
        this.props
          .createImageFromSession(data)
          .then(() => this.handleCreateImageSessionSuccess())
          .catch(() => this.handleCreateImageSessionError());


    }

    render() {
        const { handleSubmit, t } = this.props;
        let require_registry = (this.props.createImageFromSessionFormValues && (this.props.createImageFromSessionFormValues.registry_username || this.props.createImageFromSessionFormValues.registry_url || this.props.createImageFromSessionFormValues.registry_password)) ? true : false;

        return (
            <Groups section="image_from_session" onSubmit={handleSubmit(this.submitApi)} noPadding className="tw-text-left tw-mt-8">
                <FormField label="New Docker Image">
                    <Field type="text"
                        name="docker_image"
                        id="docker_image"
                        component={renderField}
                        validate={required} required
                        placeholder={this.props.dockerName}
                    />
                </FormField>
                <FormField label="additional_changes">
                    <Field type="text"
                        name="changes"
                        id="changes"
                        component={renderTextArea}
                        placeholder={'ENV TZ="America/New_York"\nLABEL "example.com'}
                    />
                </FormField>
                <FormField label="Registry URL">
                    <Field type="text"
                        name="registry_url"
                        id="registry_url"
                        component={renderField}
                        placeholder={'https://index.docker.io/v1/'}
                        validate={require_registry ? required : null} required={require_registry}
                    />
                </FormField>
                <FormField label="Registry Username">
                    <Field type="text"
                        name="registry_username"
                        id="registry_username"
                        component={renderField}
                        placeholder={t("image_from_session.username to authenticate to docker registry")}
                        validate={require_registry ? required : null} required={require_registry}
                    />
                </FormField>
                <FormField label="Registry Password">
                    <Field type="password"
                        name="registry_password"
                        id="registry_password"
                        component={renderPass}
                        placeholder={t("image_from_session.password or token used to authenticate to docker registry")}
                        validate={require_registry ? required : null} required={require_registry}
                    />
                </FormField>
                <FormFooter cancel={() => this.props.cancel_button()} inline />
            </Groups>
        );
    }
}


CreateImageFromSessionFormTemplate.propTypes = {
    current_provider: Proptypes.object,
    submit_api: Proptypes.func.isRequired,
    handleSubmit: Proptypes.func,
    cancel_button: Proptypes.func,
    kasmId: Proptypes.string,
    dockerName: Proptypes.string,
};


let CreateImageFromSessionFormWithRouter = withRouter(CreateImageFromSessionFormTemplate);

let CreateImageFromSessionForm = connect(state => {

    return {
        createImageSessionErrorMessage: state.kasms.createImageSessionErrorMessage || null,
        createImageSessionLoading: state.kasms.createImageSessionLoading || false,
        createImageSessionError: state.kasms.createImageSessionError || null,
        createdImageSession:  state.kasms.createdImageSession || null,
        createImageFromSessionFormValues: state.form && state.form.CreateImageFromSessionForm && state.form.CreateImageFromSessionForm.values ? state.form.CreateImageFromSessionForm.values : null,

    }
},

    dispatch =>
    ({
        createImageFromSession: (data) => dispatch(createImageFromSession(data))

    }))(CreateImageFromSessionFormWithRouter);
const CreateImageFromSessionFormTranslated = withTranslation('common')(CreateImageFromSessionForm)
export default reduxForm({
    form: "CreateImageFromSessionForm",
})(CreateImageFromSessionFormTranslated);
