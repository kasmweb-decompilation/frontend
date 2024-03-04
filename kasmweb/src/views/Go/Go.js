import React, { Component } from "react";
import { connect } from "react-redux";
import {
  destroyKasms,
  getUserKasms,
  createKasms,
  getStatusKasms,
  execKasm,
  updateKeepalive,
  getUserImages,
  getUserDefaultImage,
  startKasms,
} from "../../actions/actionDashboard";
import { logout } from "../../actions/actionLogin";
import { NotificationManager } from "react-notifications";
import Proptypes from "prop-types";
import "react-select/dist/react-select.css";
import queryString from "query-string";
import {withTranslation} from "react-i18next";
import { LaunchForm, checkRequiredSectionsAgainstLocal, localLaunchSelections } from "../../components/Form/LaunchForm";
import { Modal } from "../../components/Form/Modal";
import { KasmIcon } from "../User/UserDashboard/ListKasms";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons/faCircleNotch";

class Go extends Component {
  constructor(props) {
    super(props);
    this.state = {
      videoQuality: window.localStorage.getItem("kasm_video_quality") ? JSON.parse(window.localStorage.getItem("kasm_video_quality")) : 1,
      kasmId: "",
      currentId: null,
      url: "",
      loader: false,
      attempt: 0,
      pointPresenceValues: [],
      persistentProfileValues: [],
      showTips: true,
      toggleControlPanel: false,
      createClicked: false,
      createResumeClicked: false,
      disconnect: false,
      kasm_url: null,
      kasm_exec: null,
      launch_selections: {},
      launch_form: false,
    };
    this.createKasm = this.createKasm.bind(this);
    this.handleResumeKasm = this.handleResumeKasm.bind(this);
    this.handleCreateSuccess = this.handleCreateSuccess.bind(this);
    this.setDefault = this.setDefault.bind(this);
    this.startKasm = this.startKasm.bind(this);
    this.connectKasm = this.connectKasm.bind(this);
    this.submitLaunch = this.submitLaunch.bind(this);
  }

  connectKasm(kasm_id){
    let kasm_exec_data = {
          kasm_id: kasm_id,
          kasm_exec: this.state.kasm_exec,
          kasm_url: this.state.kasm_url,
        };
        this.props
          .execKasm(kasm_exec_data)
          .then(() => {
            this.props.history.push("/kasm/" + kasm_id);
          })
          .catch(() => {
            console.trace("Navigating browser to /");
            this.props.history.push("/");
          });
  }
  handleResumeKasm(kasm_id, kasm_exec, kasm_url) {
    this.setState({ kasmId: kasm_id, createResumeClicked: true });
    const { startKasmsErrorMessage, t } = this.props;
    this.props
      .getStatusKasms(kasm_id)
      .then(() => {
        const { kasmStatus } = this.props;
        if (kasmStatus === "paused" || kasmStatus === "stopped"){
          this.props.startKasms(kasm_id).then(() => {
            
            if (startKasmsErrorMessage) {
              NotificationManager.error(startKasmsErrorMessage, t('workspaces.Start Session'), 3000);
              this.props.history.push("/");
            }
            else{
              console.debug("Successfully Started Session");
              this.connectKasm(kasm_id)
            }
          })
          .catch((err) => {
            console.error("Failed to start Session");
            console.trace("Navigating browser to /");
            NotificationManager.error(
              t('workspaces.unable-to-restart-a-stopped-or'),
              t('workspaces.session-not-running'),
              3000
            );
            this.props.history.push("/");
          });
        }
        else{
          this.connectKasm(kasm_id)
        }
      })
      .catch(() => {
        console.trace("Navigating browser to /");
        this.props.history.push("/");
      });
  }

  createKasm(imageId, available, launchSelections) {
    const { t } = this.props;
    if (!available) {
      console.trace("Navigating browser to /");
      this.props.history.push("/");
      NotificationManager.error(
        t('workspaces.agent_download'),
        t('workspaces.Image Loading'),
        3000
      );
      return;
    }

    this.setState({ currentId: imageId, createClicked: true, kasm_exec: null });
    let currentImage = this.state.pointPresenceValues.find(
      (image) => image.imageId === imageId
    );
    let currentImage2 = this.state.persistentProfileValues.find(
      (image) => image.imageId === imageId
    );
    // For the /go url we will always use the persistent profile if its defined on the image.
    let persistent_profile_mode = "Enabled";
    window.localStorage.setItem(
      "persistent_profile_mode",
      persistent_profile_mode
    );
    this.props
      .createKasms({
        point_of_presence:
          currentImage && currentImage.value ? currentImage.value.value : "",
        persistent_profile_mode: persistent_profile_mode,
        image_id: imageId,
        x_res: window.innerWidth,
        y_res: window.innerHeight,
        kasm_url: this.state.kasm_url,
        launch_selections: launchSelections,
      })
      .then(() => {
        this.handleCreateSuccess();
      })
      .catch(() => this.handleCreateError());
  }

  handleCreateError() {
    const { createKasmsError, errorCreateMessageDetail, t } = this.props;
    this.setState({ createClicked: false });
    if (createKasmsError) {
      console.trace("Navigating browser to /");
      this.props.history.push("/");
      NotificationManager.error(createKasmsError, t('workspaces.Create Session'), 3000);
      if (errorCreateMessageDetail) {
        console.error(errorCreateMessageDetail);
      }
    } else {
      console.trace("Navigating browser to /");
      this.props.history.push("/");
      NotificationManager.error(t('workspaces.Gateway Time-out'), t('workspaces.Create Session'), 3000);
    }
  }

  handleCreateSuccess() {
    const { errorCreateMessage, errorCreateMessageDetail, t } = this.props;
    if (errorCreateMessage) {
      console.trace("Navigating browser to /");
      this.props.history.push("/");
      NotificationManager.error(errorCreateMessage, t('workspaces.Create Kasm'), 3000);
      this.setState({ createClicked: false });
      if (errorCreateMessageDetail) {
        console.error(errorCreateMessageDetail);
      }
    } else {
      const { createdKasms } = this.props;
      if (createdKasms.kasm_id) {
        NotificationManager.success(
          t('workspaces.session-created'),
          t('workspaces.successfully-created-session')
        );
        this.props.history.push("/kasm/" + createdKasms.kasm_id);
      }
    }
  }

  componentDidMount() {
    const values = queryString.parse(this.props.location.search);
    if (values.kasm_url) {
      this.setState({
        kasm_url: decodeURIComponent(values.kasm_url),
        kasm_exec: "go",
      });
    }
    this.props
      .getDefault()
      .then(() => {
        this.setDefault();
      })
      .catch(() => this.props.history.push("/userdashboard"));
  }

  setDefault() {
    const { userdefault, t } = this.props;
    let defaultID = null;

    if (userdefault && userdefault.user_image) {
      defaultID = userdefault.user_image;
    } else if (userdefault && userdefault.group_image) {
      defaultID = userdefault.group_image;
    }

    if (defaultID != null) {
      const call1 = this.props.getUserImages();
      const call2 = this.props.getUserKasms();
      Promise.all([call1, call2]).then(() => {
        this.startKasm(defaultID);
      });
    } else {
      this.props.history.push("/userprofile");
      NotificationManager.error(
        t('workspaces.select-default-in-user-setting'),
        t('workspaces.no-default-image'),
        5000
      );
    }
  }

  startKasm(defaultID) {
    const { liveKasms, availableKasms, t } = this.props;
    let defaultKasm = availableKasms.find(
      (image) => image.image_id === defaultID
    );
    if (defaultKasm) {
      liveKasms
        .sort(function (a, b) {
          return a.kasm_id.localeCompare(b.kasm_id);
        })
        .map((kasm, index) => {
          if (kasm.image.image_id === defaultID) {
            this.setState({ kasm_id: kasm.kasm_id });
            this.handleResumeKasm(kasm.kasm_id);
          }
        });
      if (typeof this.state.kasm_id === "undefined") {
        this.setState({ kasm_id: defaultKasm.image_id });

        const launchSelections = localLaunchSelections(defaultKasm.image_id)
        let allRequiredSections = false
        if (defaultKasm.launch_config && defaultKasm.launch_config.launch_form){
          allRequiredSections = checkRequiredSectionsAgainstLocal(defaultKasm.image_id, defaultKasm.launch_config.launch_form)
        }
        else {
          allRequiredSections = true
        }

        if (_.isEmpty(this.state.launch_selections) && allRequiredSections) {
          this.createKasm(defaultKasm.image_id, defaultKasm.available, launchSelections);
        } else {
          this.setState({launch_form: true})
        }
      }
    } else {
      this.props.history.push("/userprofile");
      NotificationManager.error(
        t('workspaces.default-image-not-available'),
        t('workspaces.select-default-image'),
        5000
      );
    }
  }

  submitLaunch(e) {
    e.preventDefault()

    const { availableKasms, t } = this.props;
    let defaultKasm = availableKasms && availableKasms.find(
      (image) => image.image_id === this.state.kasm_id
    ) || {}

    this.setState({launch_form: false})
    this.createKasm(defaultKasm.image_id, defaultKasm.available, this.props.launchSelections);
}

  render() {
    const { availableKasms, t } = this.props;
    let defaultKasm = availableKasms && availableKasms.find(
      (image) => image.image_id === this.state.kasm_id
    ) || {}
    const launcherBackgroundUrl = window.localStorage.getItem("launcher_background_url") || ''
    if (typeof this.state.kasm_id !== "undefined") {
    return <div className="login_box" style={{ backgroundImage: 'url("' + launcherBackgroundUrl+ '")' }}><Modal
    showCloseButton={false}
    icon={defaultKasm.image_src &&
        defaultKasm.image_src != "" ? (
        <img
            onError={this.defaultThumb}
            className="tw-rounded-full"
            src={defaultKasm.image_src}
        />
    ) : (
        <KasmIcon kasm={defaultKasm} />
    )}
    maxWidth="sm:tw-max-w-md"
    iconBg="tw-scale-[170%] -tw-mt-12 tw-mb-10 tw-relative tw-p-1.5 tw-rounded-full tw-bg-white"
    titleRaw={t("workspaces.Launch") + ' ' + defaultKasm.friendly_name}
    open={this.state.launch_form}
    setOpen={() => console.log('can\'t close')}
    contentRaw={<form onSubmit={this.submitLaunch} className="modal-inner tw-text-left tw-mt-8 tw-pb-14">
        <p className="tw-mb-8 tw-text-[var(--text-color-muted-more)]">{defaultKasm.description}</p>
        <LaunchForm data={defaultKasm} />
        <div className="tw-bg-blue-500 tw-absolute tw-left-0 tw-right-0 tw-p-3 -tw-bottom-3 !tw-rounded-xl !tw-rounded-t-none">
            {this.state.createClicked ? (
                <button
                    type="button"
                    className="actionbutton tw-bg-white/20 !tw-shadow-[0_0_9px_rgba(0,0,0,0.15)] hover:!tw-bg-white/5 tw-border-t tw-border-0 tw-border-solid tw-border-white/25 hover:tw-border-white/10"
                    style={{ cursor: "pointer" }}
                    disabled={true}
                >
                    {this.state.currentId === defaultKasm.image_id ? <div><FontAwesomeIcon icon={faCircleNotch} spin /></div> :
                        t("workspaces.Launch Session")
                    }
                </button>
            ) : (
                <button
                    type="submit"
                    className="actionbutton tw-bg-white/20 !tw-shadow-[0_0_9px_rgba(0,0,0,0.15)] hover:!tw-bg-white/5 tw-border-t tw-border-0 tw-border-solid tw-border-white/25 hover:tw-border-white/10"
                    style={{ cursor: "pointer" }}
                >
                    {t("workspaces.Launch Session")}
                </button>
            )}
        </div>
    </form>}
/></div>
  }
}
}

Go.propTypes = {
  destroyKasms: Proptypes.func.isRequired,
  logout: Proptypes.func.isRequired,
  getUserKasms: Proptypes.func.isRequired,
  getUserImages: Proptypes.func.isRequired,
  createKasms: Proptypes.func.isRequired,
  updateKeepalive: Proptypes.func.isRequired,
  getStatusKasms: Proptypes.func.isRequired,
  execKasm: Proptypes.func.isRequired,
  destroyKasmsErrorMessage: Proptypes.object,
  liveKasms: Proptypes.array,
  availableKasms: Proptypes.array,
  deleteKasmsError: Proptypes.object,
  errorCreateMessage: Proptypes.string,
  errorCreateMessageDetail: Proptypes.string,
  createKasmsError: Proptypes.string,
  createdKasms: Proptypes.object,
  statusKasms: Proptypes.object,
  getstatuskasmsError: Proptypes.object,
  execKasmError: Proptypes.object,
  errorStatusKasmsMessage: Proptypes.object,
  type: Proptypes.string,
  execKasmLoading: Proptypes.bool,
  destroyKasmsLoading: Proptypes.func,
  className: Proptypes.object,
  createKasmsLoading: Proptypes.bool,
  getDefault: Proptypes.func.isRequired,
};
const GoTranslated = withTranslation('common')(Go)
export default connect(
  (state) => ({
    errorCreateMessage: state.dashboard.errorCreateMessage || null,
    errorCreateMessageDetail: state.dashboard.errorCreateMessageDetail || null,
    deleteKasmsError: state.dashboard.deleteKasmsError || null,
    getstatuskasmsLoading: state.dashboard.getstatuskasmsLoading || null,
    execKasmLoading: state.dashboard.execKasmLoading || null,
    destroyKasmsErrorMessage: state.dashboard.destroyKasmsErrorMessage || null,
    createKasmsLoading: state.dashboard.createKasmsLoading || false,
    destroyKasmsLoading: state.dashboard.destroyKasmsLoading || null,
    createKasmsError: state.dashboard.createKasmsError || null,
    statusKasms: state.dashboard.statusKasms || null,
    kasmStatus: state.dashboard.kasmStatus || null,
    execKasmError: state.dashboard.execKasmError || null,
    errorStatusKasmsMessage: state.dashboard.errorStatusKasmsMessage || null,
    fetchedKasms: state.dashboard.kasms || [],
    createdKasms: state.dashboard.createdKasms || null,
    availableKasms: state.dashboard.availableKasms,
    liveKasms: state.dashboard.liveKasms,
    userdefault: state.dashboard.userdefault,
    launchSelections: state.images.launchSelections || {},
    startKasmsErrorMessage: state.dashboard.startKasmsErrorMessage || null,
  }),
  (dispatch) => ({
    logout: (logout_data) => dispatch(logout(logout_data)),
    destroyKasms: (data) => dispatch(destroyKasms(data)),
    getUserKasms: (payload_data) => dispatch(getUserKasms(payload_data)),
    createKasms: (data) => dispatch(createKasms(data)),
    updateKeepalive: (data) => dispatch(updateKeepalive(data)),
    getStatusKasms: (data) => dispatch(getStatusKasms(data)),
    execKasm: (data) => dispatch(execKasm(data)),
    getUserImages: (payload_data) => dispatch(getUserImages(payload_data)),
    getDefault: () => dispatch(getUserDefaultImage()),
    startKasms: (data) => dispatch(startKasms(data)),

  })
)(GoTranslated);
