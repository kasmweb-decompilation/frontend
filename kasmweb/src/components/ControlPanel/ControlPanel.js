import React, { Component } from "react";
import {
  Row,
  Col,
  ListGroupItem,
  Progress,
  Collapse,
  Table,
} from "reactstrap";
import { withRouter } from "react-router";
import { NotificationManager } from "react-notifications";
import Proptypes from "prop-types";
import { connect } from "react-redux";
import Select from "react-select";
import Slider, { createSliderWithTooltip } from "rc-slider";
import DropzoneComponent from "react-dropzone-component";
import ReactDOMServer from "react-dom/server";
import "react-toggle/style.css";
import "rc-slider/assets/index.css";
import stopReload from "../../constants/Constants";
import audio from "../../audio";
import webcam from "../../webcam";
import {
  destroyKasmShareId,
  createKasmShareId,
} from "../../actions/actionDashboard";
import configure from "../../../assets/images/configure.svg";
import deleteIcon from "../../../assets/images/delete.svg";
import redTrashCanIcon from "../../../assets/images/delete.svg";
import printer from "../../../assets/images/printer.png"; 
import download from "../../../assets/images/download-session.svg";
import clipboard from "../../../assets/images/clipboard.svg";
import apps from "../../../assets/images/workspaces.svg";
import leftArrow from "../../../assets/images/leftArrow.png";
import mute from "../../../assets/images/mute.svg";
import unmute from "../../../assets/images/unmute.svg";
import soundEnabled from "../../../assets/images/enable-sound.svg";
import soundDisabled from "../../../assets/images/disable-sound.svg";
import streaming from "../../../assets/images/streaming-session.svg";
import upload from "../../../assets/images/upload.svg";
import logout from "../../../assets/images/logout.svg";
import share from "../../../assets/images/share.svg";
import cross from "../../../assets/images/cross.png";
import file from "../../../assets/images/file.png";
import gamepad from "../../../assets/images/gamepad.svg";
import WebcamIcon from "../../../assets/images/webcam.svg";
import {withTranslation} from "react-i18next";
import { bytesToSize } from"../../utils/helpers"
import { ControlButton, ControlSection, ToggleButton } from "./ControlButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons/faArrowRightFromBracket";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons/faCircleNotch";
import { faXmark } from "@fortawesome/free-solid-svg-icons/faXmark";
import { ConfirmAction } from "../Table/NewTable";
import { RenderToggle } from "../../utils/formValidations";
import { Modal } from "../Form/Modal";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons/faChevronDown";
import { faChevronUp } from "@fortawesome/free-solid-svg-icons/faChevronUp";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons/faChevronRight";
import { faCopy } from "@fortawesome/free-solid-svg-icons/faCopy";
import { faShare } from "@fortawesome/free-solid-svg-icons/faShare";
import { faVolume } from "@fortawesome/free-solid-svg-icons/faVolume";
import { faVolumeSlash } from "@fortawesome/free-solid-svg-icons/faVolumeSlash";
import classNames from "classnames";
import { faCameraWeb } from "@fortawesome/free-solid-svg-icons/faCameraWeb";
import { faCameraWebSlash } from "@fortawesome/free-solid-svg-icons/faCameraWebSlash";
import { faMicrophone } from "@fortawesome/free-solid-svg-icons/faMicrophone";
import { faMicrophoneSlash } from "@fortawesome/free-solid-svg-icons/faMicrophoneSlash";
import { faClipboard } from "@fortawesome/free-solid-svg-icons/faClipboard";
import { faDownload } from "@fortawesome/free-solid-svg-icons/faDownload";
import { faUpload } from "@fortawesome/free-solid-svg-icons/faUpload";
import { faGauge } from "@fortawesome/free-solid-svg-icons/faGauge";
import { faExpand } from "@fortawesome/free-solid-svg-icons/faExpand";
import { faGamepad } from "@fortawesome/free-solid-svg-icons/faGamepad";
import { faGear } from "@fortawesome/free-solid-svg-icons/faGear";
import { faLayerGroup } from "@fortawesome/free-solid-svg-icons/faLayerGroup";
import { faMinimize } from "@fortawesome/free-solid-svg-icons/faMinimize";
import { faShareNodes } from "@fortawesome/free-solid-svg-icons/faShareNodes";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import { faFileInvoice } from "@fortawesome/pro-thin-svg-icons/faFileInvoice";
import { faDesktop } from "@fortawesome/free-solid-svg-icons/faDesktop";
import { faFolder } from "@fortawesome/pro-thin-svg-icons/faFolder";
import { faArrowTurnUp } from "@fortawesome/free-solid-svg-icons/faArrowTurnUp";
import { faGripDots } from "@fortawesome/free-solid-svg-icons/faGripDots";
import { Transition } from "@headlessui/react";
import { faPrint } from "@fortawesome/free-solid-svg-icons/faPrint";

const SliderWithTooltip = createSliderWithTooltip(Slider);

function KasmIcon({ kasm }) { 
  const image = _.get(kasm, 'image.image_src', 'img/favicon.png') || 'img/favicon.png'
  const name = _.get(kasm, 'image.friendly_name', '')
  return (
    <img
      onError={(e) => e.target.src = "img/favicon.png"}
      className="active-session-icon"
      src={image}
      alt={name} />
  )
}

var player;
var keepAlive;
var gamepadLoop = null;
var gamepadTimestamps = [];

const sideBarIcons = [
  {
    id: 1,
    icon: leftArrow,
    isActive: false,
  },
  {
    id: 2,
    icon: soundEnabled,
    isActive: false,
  },
  {
    id: 3,
    icon: mute,
    isActive: false,
  },
  {
    id: 4,
    icon: download,
    isActive: false,
  },
  {
    id: 5,
    icon: upload,
    isActive: false,
  },
  {
    id: 6,
    icon: streaming,
    isActive: false,
  },
  {
    id: 7,
    icon: share,
    isActive: false,
  },
  {
    id: 8,
    icon: configure,
    isActive: false,
  },
  {
    id: 9,
    icon: apps,
    isActive: false,
  },
  {
    id: 10,
    icon: logout,
    isActive: false,
  },
  {
    id: 1,
    icon: deleteIcon,
    isActive: false,
  },
];

const IS_TOUCH_DEVICE = (
  ("ontouchstart" in window) ||
  (navigator.maxTouchPoints > 0) ||
  (navigator.msMaxTouchPoints > 0)
);

const MILLISECONDS = 1000;
const IS_WINDOWS = navigator && !!(/win/i).exec(navigator.platform);

const QUALITY_FRAME_RATES = [
  24, // static
  24, // low
  24, // medium
  60, // high
  60, // extreme
  60, // lossless
];

class ControlPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      showNav: false,
      downloads: [],
      files: [],
      audio: true,
      microphone: false,
      webcam: false,
      gamepad: false,
      gamepad_url: null,
      connectedGamepads: [],
      gamepadIndexToInput: {},
      gamepadInputToIndex: {},
      gamepadInitialized: false,
      modalGamepad: false,
      collapse: false,
      currentIndex: null,
      modalclipboard: false,
      modaldownload: false,
      modalvideo: false,
      modaluploads: false,
      modaldestroy: false,
      modalsharing: false,
      modalWebcam: false,
      shareLink: null,
      message: null,
      disableIndex: [],
      clipboardText: "",
      modalAdvanced: false,
      destroyClicked: false,
      linkError: "",
      clipboardUp: false,
      clipboardDown: false,
      logoutAll: false,
      isShowDownload: false,
      isShowClipboard: false,
      isShowPrinter: false,
      keyboardControlsMode: window.localStorage.getItem("default_keyboard_controls_mode") || "auto",
      imeMode: window.localStorage.getItem("ime_mode") || "on",
      gameMode: "off",
      pointerLock: "off",
      resize: window.localStorage.getItem("kasm_resize_mode") || "remote",
      forcedResolutionWidth: Number(window.localStorage.getItem("kasm_forced_resolution_width") || "1024"),
      forcedResolutionHeight: Number(window.localStorage.getItem("kasm_forced_resolution_height") || "768"),
      framerate: Number(window.localStorage.getItem("kasm_frame_rate") || QUALITY_FRAME_RATES[this.props.videoQuality]),
      perfStats: window.localStorage.getItem("kasm_enable_perf_stats") === "true",
      showAdvancedQualitySettings: false,
      showAdvancedWebcamSettings: false,
      availableWebcams: [],
      webcamDeviceId: window.localStorage.getItem("kasm_webcam_device") || "",
      webcamQuality: Number(window.localStorage.getItem("kasm_webcam_quality")) || 5,
      webcamFps: Number(window.localStorage.getItem("kasm_webcam_fps")) || 24,
      loadin: false,
      draggingTab: false,
      tabPos: null,
      tabTop: 100,
      iconOnly: false,
      iconOnlyTimeout: null,
      controlDisplays: false
    };

    if (this.props.statusKasms.port_map.uploads) {
      this.componentConfig = {
        postUrl: `https://${this.props.statusKasms.hostname}:${this.props.statusKasms.port_map.uploads.port ? this.props.statusKasms.port_map.uploads.port : window.location.port}/${this.props.statusKasms.port_map.uploads.path}/upload`,
      };
    }
    else {
      this.componentConfig = {
        postUrl: ``,
      };
    }

    this.djsConfig = {
      withCredentials: true,
      autoProcessQueue: true,
      paramName: "file",
      maxFilesize: 200 * 1024 * 1024 * 1024, //Have to set a max file size
      maxFiles: null,
      parallelUploads: 10,
      chunking: true,
      chunkSize: 10000000,
      forceChunking: true,
      timeout: 0,
      dictDefaultMessage: this.props.t("control_panel.drop_files_text"),
      previewTemplate: ReactDOMServer.renderToStaticMarkup(<div></div>),
    };

    this.dropzone = null;

    this.showNav = this.showNav.bind(this);
    this.hideNav = this.hideNav.bind(this);
    this.toggleNav = this.toggleNav.bind(this);
    this.refreshNavState = this.refreshNavState.bind(this);
    this.confirmLogout = this.confirmLogout.bind(this);
    this.cancelLogout = this.cancelLogout.bind(this);
    this.destroyKasmsFun = this.destroyKasmsFun.bind(this);
    this.toggleFullscreen = this.toggleFullscreen.bind(this);
    this.showLogout = this.showLogout.bind(this);
    this.showDestroy = this.showDestroy.bind(this);
    this.toggleLogout = this.toggleLogout.bind(this);
    this.toggleDownload = this.toggleDownload.bind(this);
    this.toggleClipboard = this.toggleClipboard.bind(this);
    this.toggleSharing = this.toggleSharing.bind(this);
    this.toggleUploads = this.toggleUploads.bind(this);
    this.toggleDestroy = this.toggleDestroy.bind(this);
    this.toggle = this.toggle.bind(this);
    this.toggleVideo = this.toggleVideo.bind(this);
    this.showMessage = this.showMessage.bind(this);
    this.downloadsList = this.downloadsList.bind(this);
    this.handleClipboard = this.handleClipboard.bind(this);
    this.handleAudioChange = this.handleAudioChange.bind(this);
    this.handleWebcamChange = this.handleWebcamChange.bind(this);
    this.handleMicrophoneChange = this.handleMicrophoneChange.bind(this);
    this.handleSuccess = this.handleSuccess.bind(this);
    this.handleAudioProcess = this.handleAudioProcess.bind(this);
    this.destroyMicrophone = this.destroyMicrophone.bind(this);
    this.connectMicrophone = this.connectMicrophone.bind(this);
    this.receiveMessage = this.receiveMessage.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.toggleAdvanced = this.toggleAdvanced.bind(this);
    this.handlePreferLocalCursorChange = this.handlePreferLocalCursorChange.bind(
      this
    );
    this.setPreferLocalCursor = this.setPreferLocalCursor.bind(this);
    this.handleUploadprogress = this.handleUploadprogress.bind(this);
    this.handleAddedFile = this.handleAddedFile.bind(this);
    this.handleSuccessFile = this.handleSuccessFile.bind(this);
    this.resetDropzone = this.resetDropzone.bind(this);
    this.handleError = this.handleError.bind(this);
    this.clearFiles = this.clearFiles.bind(this);
    this.fileCanceled = this.fileCanceled.bind(this);
    this.copyToClipboard = this.copyToClipboard.bind(this);
    this.handleCreateShareLink = this.handleCreateShareLink.bind(this);
    this.handleDestroyShareLink = this.handleDestroyShareLink.bind(this);
    this.handleLeave = this.handleLeave.bind(this);
    this.updateLogoutAll = this.updateLogoutAll.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeAllModals = this.closeAllModals.bind(this);
    this.onGamepadConnected = this.onGamepadConnected.bind(this);
    this.onGamepadDisconnected = this.onGamepadDisconnected.bind(this);
    this.pollGamepad = this.pollGamepad.bind(this);
    this.updateGamepadInputIndex = this.updateGamepadInputIndex.bind(this);
    this.closeGamepad = this.closeGamepad.bind(this);
    this.initializeGamepads = this.initializeGamepads.bind(this);
    this.setConnectedGamepads = this.setConnectedGamepads.bind(this);
    this.setGamepadIndex = this.setGamepadIndex.bind(this);
    this.updateScalingMode = this.updateScalingMode.bind(this);
    this.handleForcedResolutionWidthChange = this.handleForcedResolutionWidthChange.bind(this);
    this.handleForcedResolutionWidthChange = this.handleForcedResolutionWidthChange.bind(this);
    this.handleForcedResolution = this.handleForcedResolution.bind(this);
    this.handleFrameRateChange = this.handleFrameRateChange.bind(this)
    this.handleSetPerfStats = this.handleSetPerfStats.bind(this);
    this.toggleAdvancedQuality = this.toggleAdvancedQuality.bind(this);
  }

  handleLeave(location) {
    console.trace("Navigating browser to " + location);
    window.removeEventListener("beforeunload", stopReload, true);
    this.props.history.push(location);
  }

  handleError(file) {
    let copy = this.state.files.slice();
    for (let i = 0; i < copy.length; i++) {
      if (file.name === copy[i].name) {
        copy[i].error = file.xhr.response;
        copy[i].color = "danger";
        this.setState({ files: copy });
      }
    }
  }

  fileCanceled(file, xhr, formData) {
    const { t } = this.props;
    xhr.ontimeout = function (e) {
      alert(t("control_panel.cancelled_upload"));
    };
  }

  clearFiles() {
    let copy = this.state.files.slice();
    for (let i = 0; i < copy.length; i++) {
      this.dropzone.removeFile(copy[i].file);
    }
    this.setState({ files: [] });
  }

  resetDropzone() {
    this.dropzone.removeAllFiles();
  }

  removeFile(file) {
    this.dropzone.removeFile(file.file);
    let copy = this.state.files.slice();
    for (let i = 0; i < copy.length; i++) {
      if (copy[i].name === file.name) {
        copy.splice(i, 1);
        this.setState({ files: copy });
      }
    }
  }

  handleAddedFile(file) {
    let copy = this.state.files.slice();
    let size = bytesToSize(file.size);
    copy.push({
      file: file,
      name: file.name,
      size: size,
      error: "",
      color: "info",
      progress: 0,
    });
    this.setState({ files: copy });
  }

  handleCreateShareLink() {
    this.props
      .createKasmShareId(this.props.statusKasms.kasm_id)
      .then(() => {
        const { createShareError, share_id } = this.props;
        if (createShareError) {
          this.setState({
            shareLink: share_id,
            linkError: createShareError,
          });
          this.props.shareEnabled(false);
        } else
          this.setState({
            shareLink: share_id,
            linkError: "",
          });
        if (!this.props.disableFixedRes) {
          this.setState({ videoQuality: 0 });
          this.props.setVideoQuality(0, QUALITY_FRAME_RATES[0]);
        }
        this.props.shareEnabled(true);

        this.copyToClipboard("https://" +
        window.location.host +
        window.location.pathname +
        "#/join/" +
        share_id)
      })
      .catch(() => {
        const { createShareError, share_id, t } = this.props;
        this.setState({
          shareLink: share_id,
          linkError: t("control_panel.Error Creating Link"),
        });
        this.props.shareEnabled(false);
      });
  }

  handleDestroyShareLink() {
    this.props
      .destroyKasmShareId(this.props.statusKasms.kasm_id)
      .then(() => {
        const { createShareError, share_id } = this.props;
        if (createShareError) {
          this.setState({
            shareLink: share_id,
            linkError: createShareError,
          });
          this.props.shareEnabled(false);
        } else
          this.setState({
            shareLink: share_id,
            linkError: "",
            videoQuality: 2,
          });
        this.props.setVideoQuality(2, QUALITY_FRAME_RATES[2]);
        this.props.shareEnabled(false);
      })
      .catch(() => {
        const { createShareError, share_id, t } = this.props;
        console.log(createShareError);
        this.setState({
          shareLink: share_id,
          linkError: t("control_panel.Error Deleting Link"),
        });
        this.props.shareEnabled(false);
      });
  }

  handleSuccessFile(file) {
    setTimeout(
      function () {
        let copy = this.state.files.slice();
        for (let i = 0; i < copy.length; i++) {
          if (copy[i].name === file.name) {
            copy.splice(i, 1);
            this.setState({ files: copy });
          }
        }
      }.bind(this),
      2000
    );
  }

  handleUploadprogress(file, progress, bytesSent) {
    let copy = this.state.files.slice();
    for (let i = 0; i < copy.length; i++) {
      if (file.name === copy[i].name) {
        let progressChunk = progress;
        progressChunk = Math.round((bytesSent / file.size) * 100);
        copy[i].progress = progressChunk;
        if (progressChunk === 100) copy[i].color = "success";
        this.setState({ files: copy });
      }
    }
  }

  handleAudioChange(enable) {
    const { statusKasms } = this.props;

    if (window.IS_USING_GUAC) {
      document.querySelector("#iframe-id").contentWindow.postMessage({
        action: "sound_enabled",
        data: enable
      }, "*");
      this.setState({ audio: enable });
      return;
    }

    if (!statusKasms.port_map.audio) {
      return;
    }

    if (enable) {
      audio.enable();
    } else {
      audio.disable();
    }

    this.setState({ audio: enable });
  }

  async handleWebcamChange(enable) {
    const { statusKasms, t } = this.props;

    if (window.IS_USING_GUAC) {
      this.setState({ webcam: false });
      return;
    }

    if (!statusKasms.port_map.webcam) {
      return;
    }

    if (enable) {
      try {
        const devices = await webcam.getAvailableDevices();

        const preferredWebcam = devices.find(device => device.id === this.state.webcamDeviceId);

        if (!preferredWebcam) {
          const deviceId = devices.length ? devices[0].id : null;

          this.setState({
            webcamDeviceId: deviceId
          });

          window.localStorage.setItem("kasm_webcam_device", deviceId);
        }

        await webcam.enable(this.state.webcamDeviceId);
      } catch(err) {
        const message = err.message || String(err)
        NotificationManager.error(message, t("control_panel.webcam"), 3000);
        return
      }
    } else {
      await webcam.disable();
    }

    this.setState({ webcam: enable });
  }

  handleMicrophoneChange(value) {
    // let value = e.target.checked;
    value ? this.connectMicrophone() : this.destroyMicrophone();
    this.setState({
      microphone: value,
    });
  }

  handlePreferLocalCursorChange(e) {
    console.log("e.target.checkede.target.checked=", e.target.checked);
    let value = e.target.checked;
    this.setPreferLocalCursor(value);
  }

  setPreferLocalCursor(v) {
    window.localStorage.setItem("kasm_prefer_local_cursor", v);
  }

  setKeyboardControlsMode(mode) {
    window.localStorage.setItem("default_keyboard_controls_mode", mode);

    this.setState({
      keyboardControlsMode: mode
    });

    if (mode === "on" || (mode === "auto" && !IS_WINDOWS && IS_TOUCH_DEVICE)) {
      document.querySelector("#iframe-id").contentWindow.postMessage({
        action: "show_keyboard_controls"
      }, "*");
    } else {
      document.querySelector("#iframe-id").contentWindow.postMessage({
        action: "hide_keyboard_controls"
      }, "*");
    }
  }

  canControlDisplays() {
    document.querySelector("#iframe-id").contentWindow.postMessage({
      action: "control_displays"
    }, "*");
  }

  updateScalingMode(mode) {
    this.setState({ resize: mode });
    this.props.setResize(mode);
  }

  handleForcedResolutionWidthChange(value) {
    this.setState({ forcedResolutionWidth: Number(value) });
  }

  handleForcedResolutionHeightChange(value) {
    this.setState({ forcedResolutionHeight: Number(value) });
  }

  async handleForcedResolution() {
    await this.props.setForcedResolution(this.state.forcedResolutionWidth, this.state.forcedResolutionHeight);
    
    if (this.state.resize !== "remote") {
      this.props.setResize(this.state.resize);
    }
  }

  handleSetPerfStats(e) {
    this.setState({ perfStats: e.target.checked });
    this.props.setPerfStats(e.target.checked);
  }

  handleFrameRateChange(value) {
    this.setState({ framerate: value });
    this.props.setFrameRate(value);
  }

  toggleAdvancedQuality(){
    this.setState({
      showAdvancedQualitySettings: !this.state.showAdvancedQualitySettings
    });
  }

  setIMEMode(mode) {
    window.localStorage.setItem("ime_mode", mode);

    this.setState({
      imeMode: mode
    });

    if (mode === "on") {
      document.querySelector("#iframe-id").contentWindow.postMessage({
        action: "enable_ime_mode"
      }, "*");
    } else {
      document.querySelector("#iframe-id").contentWindow.postMessage({
        action: "disable_ime_mode"
      }, "*");
    }
  }


  setDisplaysMode(mode) {
    if (mode === "open") {
      document.querySelector("#iframe-id").contentWindow.postMessage({
        action: "open_displays_mode"
      }, "*");
    } else {
      document.querySelector("#iframe-id").contentWindow.postMessage({
        action: "close_displays_mode"
      }, "*");
    }
  }

  setGameMode(mode) {
    // We don't set the state here to toggle the radio selection.
    //  Instead we wait for the event to bubble back up from KasmVNC that it was successful

    if (mode === "on") {
      document.querySelector("#iframe-id").contentWindow.postMessage({
        action: "enable_game_mode"
      }, "*");
    } else {
      document.querySelector("#iframe-id").contentWindow.postMessage({
        action: "disable_game_mode"
      }, "*");
    }
  }

  setPointerLock(mode) {
    // We don't set the state here to toggle the radio selection.
    //  Instead we wait for the event to bubble back up from KasmVNC that it was successful

    if (mode === "on") {
      document.querySelector("#iframe-id").contentWindow.postMessage({
        action: "enable_pointer_lock"
      }, "*");
    } else {
      document.querySelector("#iframe-id").contentWindow.postMessage({
        action: "disable_pointer_lock"
      }, "*");
    }
  }

  showLogout() {
    this.setState({
      modal: true,
      showNav: false,
    });
  }

  showDestroy() {
    this.closeAllModals();
    this.setState({
      modaldestroy: true,
      showNav: false,
    });
  }

  confirmLogout() {
    this.toggleLogout();
    window.removeEventListener("beforeunload", stopReload, true);
    let logout_data = { logout_all: this.state.logoutAll };
    this.props.logout(logout_data);
  }

  destroyKasmsFun() {
    document.querySelector("#iframe-id").contentWindow.postMessage({
      action: "terminate"
    }, "*");
    setTimeout(() => {
      this.props
        .destroyKasms(this.props.statusKasms.kasm_id)
        .then(() => this.handleDeleteSuccess())
        .catch(() => this.handleDeleteError());
      this.setState({ destroyClicked: true });
      this.handleDestroyShareLink()
      this.props.toggleLoader();
      this.toggleDestroy();
    })
  }

  handleDeleteSuccess() {
    const { destroyKasmsErrorMessage, t } = this.props;
    if (destroyKasmsErrorMessage) {
      NotificationManager.error(destroyKasmsErrorMessage, t("control_panel.Delete Session"), 3000);
    } else {
      this.handleLeave("/userdashboard");
    }
  }

  handleDeleteError() {
    const { deleteKasmsError, t } = this.props;
    if (deleteKasmsError) {
      NotificationManager.error(deleteKasmsError, t("control_panel.Delete Session"), 3000);
    } else {
      NotificationManager.error(t("control_panel.Failed to Delete Session"), t("control_panel.Delete Session"), 3000);
    }
  }

  componentDidMount() {
    this.setState({ iconOnly: false })
    if (this.props.statusKasms.share_id) {
      this.setState({ shareLink: this.props.statusKasms.share_id });
      this.props.shareEnabled(true);
    }

    if (this.props.disconnect) {
      this.setState({ showNav: false, iconOnly: false });
    }

    if (this.props.showOnStart) {
      this.setState({ showNav: false, iconOnly: false });
    }
    setTimeout(() => {
      this.setState({ loadin: true })
    }, 1500)

    this.state.iconOnlyTimeout = setTimeout(() => {
      this.setState({ iconOnly: true })
    }, 6000)

    let keepalive_interval = 10
    if (this.props.statusKasms.client_settings.keepalive_interval > 10) {
      keepalive_interval = this.props.statusKasms.client_settings.keepalive_interval
    }

    this.props.updateKeepalive(this.props.statusKasms.kasm_id);
    keepAlive = setInterval(() => {
      this.props
        .updateKeepalive(this.props.statusKasms.kasm_id)
        .then((data) => {
          if (data.response && data.response.usage_reached) {
            const { t } = this.props;
            NotificationManager.error(
              t("control_panel.Session Usage Limit Reached"),
              t("control_panel.Session Usage Limit"),
              3000
            );
            this.handleLeave("/");
          }
        });
    }, keepalive_interval * MILLISECONDS);

    const { statusKasms } = this.props;

    if (this.props.statusKasms && this.props.statusKasms.client_settings) {
      this.setState({
        clipboardUp: this.props.statusKasms.client_settings
        .allow_kasm_clipboard_up,
        clipboardDown: this.props.statusKasms.client_settings
        .allow_kasm_clipboard_down,
        audio: this.props.statusKasms.client_settings.kasm_audio_default_on,
        webcam: false
      });
    }

    // Add webcam for when the domain already allows webcam and the container supports it
    if (
      statusKasms.client_settings &&
      statusKasms.client_settings.allow_kasm_webcam &&
      statusKasms.port_map.webcam) {
      const url = `wss://${statusKasms.hostname}:${statusKasms.port_map.webcam.port ? statusKasms.port_map.webcam.port : window.location.port}/${statusKasms.port_map.webcam.path}`;
      webcam.initialize(url, this.state.webcamFps, this.state.webcamQuality);
    }

    // Add audio for when the domain already allows audio
    if (
      statusKasms.client_settings &&
      statusKasms.client_settings.allow_kasm_audio &&
      statusKasms.port_map.audio
    ) {
      audio.initialize({
        canvasEl: document.querySelector("video-canvas"),
        url: `wss://${statusKasms.hostname}:${statusKasms.port_map.audio.port ? statusKasms.port_map.audio.port : window.location.port}/${statusKasms.port_map.audio.path}/`,
        isAllowed: statusKasms.client_settings.kasm_audio_default_on
      });

      // Auto-play on desktop or on user UI action on mobile
      if (statusKasms.client_settings.kasm_audio_default_on) {
        if (!IS_TOUCH_DEVICE) {
          audio.enable();
        } else {
          document.addEventListener("touchstart", () => audio.enable(), { once: true });
        }
      }
    }

    if (window.addEventListener) {
      window.addEventListener("message", this.receiveMessage, false);
      window.addEventListener("connection_state", this.receiveMessage, false);
    } else if (window.attachEvent) {
      window.attachEvent("message", this.receiveMessage);
    }
    this.setState({ modal: false });

    window.addEventListener("blur", this.hideNav);

    // Gamepad Event Listeners
    if (
      statusKasms.client_settings &&
      statusKasms.client_settings.allow_kasm_gamepad &&
      statusKasms.port_map.gamepad
    ) {
      const gamepad_url = `wss://${statusKasms.hostname}:${statusKasms.port_map.gamepad.port ? statusKasms.port_map.gamepad.port : window.location.port}/${statusKasms.port_map.gamepad.path}/`;
      this.setState({ gamepad_url: gamepad_url })
    }
  }

  initializeGamepads() {

    this.gamepad_ws = new WebSocket(this.state.gamepad_url);
    this.gamepad_ws.onopen = evt => {
      let g = navigator.getGamepads();
      for (const gamepad of g) {
        if (gamepad != null) {
          console.log("Gamepad connected at index " + gamepad.index + ": " + gamepad.id + ". " + gamepad.buttons.length + " buttons, " + gamepad.axes.length + " axes.");
          this.setGamepadIndex(gamepad.index)
          if (this.gamepad_ws.readyState === WebSocket.OPEN) {
            this.gamepad_ws.send(JSON.stringify({
              message_type: "device_connected",
              id: gamepad.id,
              index: gamepad.index
            }));
          }
        }
      }
      this.setConnectedGamepads()
      this.setState({ gamepadInitialized: true })
    };
  }

  setConnectedGamepads() {
    let o = [];
    let g = navigator.getGamepads();
    for (const gamepad of g) {
      if (gamepad != null) {
        o.push({
          id: gamepad.id,
          index: gamepad.index,
          len_buttons: gamepad.buttons.length,
          len_axes: gamepad.axes.length,
        })
      }
    }

    this.setState({ connectedGamepads: o });

    if (gamepadLoop === null) {
      window.addEventListener("gamepadconnected", this.onGamepadConnected);
      window.addEventListener("gamepaddisconnected", this.onGamepadDisconnected);
      gamepadLoop = setInterval(this.pollGamepad, 20);
    }
    else {
      console.log(gamepadLoop);
    }
  }

  setGamepadIndex(index) {
    if (this.state.gamepadIndexToInput[index] === undefined) {
      let index_to_input = this.state.gamepadIndexToInput;
      let input_to_index = this.state.gamepadInputToIndex;

      for (let i = 0; i < 4; i++) {
        if (input_to_index[i] === undefined) {
          index_to_input[index] = i;
          input_to_index[i] = index;
          break;
        }
      }
      this.setState({
        gamepadIndexToInput: index_to_input,
        gamepadInputToIndex: input_to_index,
      })
    }
  }
  onGamepadConnected(e) {
    console.log("Gamepad connected at index " + e.gamepad.index + ": " + e.gamepad.id + ". " + e.gamepad.buttons.length + " buttons, " + e.gamepad.axes.length + " axes.")

    this.setGamepadIndex(e.gamepad.index)
    this.setConnectedGamepads()

    if (this.gamepad_ws.readyState === WebSocket.OPEN) {
      this.gamepad_ws.send(JSON.stringify({
        message_type: "device_connected",
        id: e.gamepad.id,
        index: this.state.gamepadIndexToInput[e.gamepad.index]
      }));
    }

  }
  onGamepadDisconnected(e) {
    console.log("Gamepad disconnected from index " + e.gamepad.index + ": " + e.gamepad.id)
    if (this.gamepad_ws.readyState === WebSocket.OPEN) {
      this.gamepad_ws.send(JSON.stringify({
        message_type: "device_disconnected",
        id: e.gamepad.id,
        index: this.state.gamepadIndexToInput[e.gamepad.index]
      }));
    }

    let o = [];
    let g = navigator.getGamepads();
    for (const gamepad of g) {
      if (gamepad != null) {
        o.push({
          id: gamepad.id,
          index: gamepad.index,
          len_buttons: gamepad.buttons.length,
          len_axes: gamepad.axes.length,
        })
      }
    }
    this.setState({ connectedGamepads: o });
    gamepadTimestamps = []
  }

  pollGamepad() {
    let g = navigator.getGamepads();
    let o = []
    for (const gamepad of g) {
      if (gamepad != null) {
        if (gamepadTimestamps[gamepad.index] == undefined || gamepadTimestamps[gamepad.index] != gamepad.timestamp) {
          gamepadTimestamps[gamepad.index] = gamepad.timestamp;
          let input = [this.state.gamepadIndexToInput[gamepad.index]];
          let axes_values = []
          let button_values = []
          for (let i = 0; i < 4; i++) {
            if (gamepad.axes[i] != undefined) {
              axes_values[i] = Math.floor(gamepad.axes[i] * 32767)
            }
            else {
              axes_values[i] = 0
            }
          }
          for (let i = 0; i < 17; i++) {
            if (gamepad.buttons[i] != undefined) {
              button_values[i] = gamepad.buttons[i].value
            }
            else {
              button_values[i] = 0
            }
          }
          o.push(input.concat(axes_values.concat(button_values)))
        }
        else {
        }
      }
    }
    if (o.length > 0) {
      if (this.gamepad_ws.readyState === WebSocket.OPEN) {
        this.gamepad_ws.send(JSON.stringify(o));
      }
    }
  }

  updateGamepadInputIndex(e) {
    let index_to_input = this.state.gamepadIndexToInput;
    let input_to_index = this.state.gamepadInputToIndex;
    index_to_input[e.gamepad_index] = e.value;
    input_to_index[e.value] = e.gamepad_index
    this.setState({
      gamepadIndexToInput: index_to_input,
      gamepadInputToIndex: input_to_index
    });
    if (this.gamepad_ws.readyState === WebSocket.OPEN && this.state.connectedGamepads[e.gamepad_index]) {
      this.gamepad_ws.send(JSON.stringify({
        message_type: "device_connected",
        id: this.state.connectedGamepads[e.gamepad_index].id,
        index: e.value
      }));
    }
  }

  closeGamepad() {
    if (this.gamepad_ws) {
      this.gamepad_ws.close();
    }
  }

  handleAudioProcess(event) {
    if (this.mic_ws.readyState === WebSocket.OPEN) {
      this.mic_ws.send(event.inputBuffer.getChannelData(0));
    }
  }


  handleSuccess(stream) {
    this.stream = stream;
    let AC = window.AudioContext || window.webkitAudioContext;
    this.audio_context = new AC();
    const source = this.audio_context.createMediaStreamSource(stream);

    const { statusKasms } = this.props;
    const microphone_url = `wss://${statusKasms.hostname}:${statusKasms.port_map.audio_input.port ? statusKasms.port_map.audio_input.port : window.location.port}/${statusKasms.port_map.audio_input.path}/?sample_rate=${source.context.destination.context.sampleRate}`;
    this.setState({ microphone_url });
    this.mic_ws = new WebSocket(microphone_url);

    const processor = this.audio_context.createScriptProcessor(2048, 1, 1);
    source.connect(processor);
    processor.connect(this.audio_context.destination);
    processor.onaudioprocess = this.handleAudioProcess;
  }

  connectMicrophone() {
    if (window.IS_USING_GUAC) {
      document.querySelector("#iframe-id").contentWindow.postMessage({
        action: "connect_microphone"
      }, "*");
    } else {
      navigator.mediaDevices
        .getUserMedia({ audio: true, video: false })
        .then(this.handleSuccess);
    }
  }

  destroyMicrophone() {
    if (window.IS_USING_GUAC) {
      document.querySelector("#iframe-id").contentWindow.postMessage({
        action: "disconnect_microphone"
      }, "*");

      return;
    }

    if (this.mic_ws) {
      this.mic_ws.close();
    }
    if (this.stream) {
      for (let track in this.stream.getAudioTracks()) {
        this.stream.getAudioTracks()[track].stop();
      }
    }
    if (this.audio_context) {
      this.audio_context.close();
    }
  }

  componentWillUnmount() {
    audio.disable();
    webcam.disable();
    this.destroyMicrophone();
    clearInterval(keepAlive);
    window.removeEventListener("message", this.receiveMessage, false);
    window.removeEventListener("connection_state", this.receiveMessage, false);
    window.removeEventListener("blur", this.hideNav);

    this.closeGamepad();
    clearInterval(gamepadLoop);
    gamepadLoop = null;
    window.removeEventListener("gamepadconnected", this.onGamepadConnected, false);
    window.removeEventListener("gamepaddisconnected", this.onGamepadDisconnected, false);
  }

  cancelLogout() {
    this.closeAllModals();
    this.toggleLogout();
    this.handleLeave("/");
  }

  showNav() {
    this.setState({ showNav: true, iconOnly: false });
    clearTimeout(this.state.iconOnlyTimeout)
    this.refreshNavState();
    this.canControlDisplays()
  }

  hideNav() {
    setTimeout(function () { // In firefox, changing focus causes a period where nothing has focus, https://bugzilla.mozilla.org/show_bug.cgi?id=337631#c34 
      if ( !document.hasFocus() ) { return; }
      if (this.state.showNav === true) {
        this.setState({ showNav: false, iconOnly: true });
      }
    }.bind(this))

  }

  toggleNav() {
    if (this.state.showNav) {
      this.hideNav()
    } else {
      this.showNav()
    }
  }

  refreshNavState() {
    // If the nav is open then refresh the contents if necessary
    if (this.state.modaldownload) {
      this.downloadsList();
    }

    // If the clipboard modal is open. Auto select the text. This should make the workflow of copy paste much faster
    if (this.state.modalclipboard) {
      // Chrome has a bug where the select doesnt apply immediately. Using set timeout gets around this.
      document.getElementById("clipboardtext").focus();
      setTimeout(function () {
        document.getElementById("clipboardtext").select();
      }, 50);
    }
  }

  toggleLogout() {
    this.setState({ modal: !this.state.modal });
  }

  toggleDownload() {
    if (this.state.modaldownload === false) this.downloadsList();
    this.setState({ modaldownload: !this.state.modaldownload });
  }

  toggleVideo() {
    this.setState({ modalvideo: !this.state.modalvideo });
  }

  toggleSharing() {
    this.setState({ modalsharing: !this.state.modalsharing });
  }

  toggleFullscreen() {
    const newstate = !this.props.fullscreen
    this.props.controlFullscreen(newstate)
  }

  toggleAdvanced() {
    this.setState({ modalAdvanced: !this.state.modalAdvanced });
  }

  toggleClipboard() {
    this.setState({ modalclipboard: !this.state.modalclipboard });
  }

  toggleUploads() {
    this.setState({
      modaluploads: !this.state.modaluploads,
      files: [],
      currentIndex: null,
      disableIndex: [],
      fileStatusArr: [],
      progress: 0,
    });
  }

  toggleDestroy() {
    this.setState({ modaldestroy: !this.state.modaldestroy });
  }

  toggle() {
    this.setState({ collapse: !this.state.collapse });
  }

  handleClose(e) {
    this.handleLeave("/");
  }

  receiveMessage(event) {
    console.log(event.data)
    if (event.data && event.data.action == "clipboardrx") {
      if (this.state.clipboardDown) {
        this.setState({ clipboardText: event.data.value });
      }
    } else if (
      event.data &&
      event.data.action == "disconnectrx" &&
      !this.state.destroyClicked
    ) {
      this.props.handleDisconnect();
    } else if (event.data.action == "togglenav") this.toggleNav();
    else if (event.data.action == "idle_session_timeout") {
      window.disableAPIActiveState = 1;
      setTimeout(function () {
        window.disableAPIActiveState = 0;
      }, 5000);
      this.handleLeave("/");
    } else if (event.data.action == "enable_pointer_lock") {
      this.setState({
        pointerLock: event.data.value ? "on" : "off"
      });
    } else if (event.data.action == "enable_game_mode") {
      this.setState({
        gameMode: event.data.value ? "on" : "off"
      });
    } else if (event.data.action == "get_sound_setting") {
      document.querySelector("#iframe-id").contentWindow.postMessage({
        action: "sound_enabled",
        data: this.props.statusKasms.client_settings.kasm_audio_default_on
      }, "*");
      this.setState({ audio: this.props.statusKasms.client_settings.kasm_audio_default_on });
    } else if (event.data.action == "can_control_displays" && event.data.value === true) {
      this.setState({ controlDisplays: true })
    }
  }

  showMessage(i) {
    const { fileStatusArr } = this.state;
    let element = "";

    element = fileStatusArr.find(function (element) {
      return element.index === i;
    });

    if (element) {
      if (element && element["success-status"]) {
        return (
          <span className="text-success blk_inline mt-7">
            {" "}
            {element["success-status"]}{" "}
          </span>
        );
      } else if (element && element["failure-status"]) {
        return (
          <span className="text-danger blk_inline mt-7">
            {" "}
            {element["failure-status"]}{" "}
          </span>
        );
      }
    }
    return " ";
  }

  // FIXME KASM-365 This function doesnt actually trigger an update to the DOM to show the download lists. Rather, another
  //  bug that continuously refreshes the page causing the downloads to re-appear
  async downloadsList(path = "") {
    const { hostname, port_map, operational_status } = this.props.statusKasms;
    const { t } = this.props;

    if (operational_status !== "running") {
      this.setState({ downloads: [] });
      return;
    }

    let baseUrl = `https://${hostname}:${port_map.vnc.port || window.location.port || "443"}`;

    if (port_map.downloads) {
      baseUrl += `/${port_map.downloads.path}/Downloads/Downloads`;
    } else {
      baseUrl += `/${port_map.vnc.path}/Downloads/Downloads`;
    }

    const fullUrl = `${baseUrl}/${path}?_=${Date.now()}`;

    console.log(`Download: ${fullUrl}`);

    const listingHtml = await fetch(fullUrl, {
      credentials: "include",
    }).then((response) => response.text());

    //
    const doc = document.implementation.createHTMLDocument("doc");
    doc.documentElement.innerHTML = listingHtml;

    const pathEl = doc.querySelector("h2");

    if (!pathEl) {
      this.setState({ downloads: [] });
      throw new Error(t("control_panel.invalid_downloads"));
    }

    const rootPath = pathEl.innerText.replace("/Downloads/Downloads/", "");

    const downloads = [];

    if (path !== "") {
      downloads.push({
        name: '..',
        dlink: "",
        is_dir: true,
        relative_path: ""
      });

    }

    for (let el of [...doc.getElementsByTagName("a")]) {
      const name = el.innerHTML;

      // Don't show symlinks
      if (!name.endsWith("@")) {
        downloads.push({
          name,
          dlink: `${baseUrl}/${path}${name}?_=${Date.now()}`,
          is_dir: name.endsWith("/") || name.endsWith("\\"),
          relative_path: rootPath + name
        });
      }
    }

    this.setState({ downloads });
  }

  handleClipboard(event) {
    // The websocket has a maxmium buffer size that can be safely sent.
    let maximumBufferSize = 10000;
    let clipboardText = event.target.value.slice(0, maximumBufferSize);
    this.setState({ clipboardText });

    if (this.state.clipboardUp) {
      document
        .getElementById("iframe-id")
        .contentWindow.postMessage(
          { action: "clipboardsnd", value: clipboardText },
          "*"
        );
    }
  }

  copyToClipboard(str) {
    const { t } = this.props;
    const el = document.createElement("textarea");
    el.value = str;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    NotificationManager.success(t("control_panel.share-url-copied"));
    document.body.removeChild(el);
  }

  openWindow(url) {
    window.open(
      url,
      "_blank",
      "resizable=yes,top=0,left=0,width=800,height=640"
    );
  }

  updateLogoutAll() {
    this.setState({ logoutAll: !this.state.logoutAll });
  }

  updateLogoutAll() {
    this.setState({ logoutAll: !this.state.logoutAll });
  }

  closeAllModals() {
    this.setState({
      isShowDownload: false,
      isShowClipboard: false,
      isShowPrinter: false,
      modaldownload: false,
      modalvideo: false,
      modaluploads: false,
      modalAdvanced: false,
      modalsharing: false,
      modalGamepad: false,
      modalWebcam: false
    });
  }

  openModal(key) {
    this.closeAllModals();
    this.setState({
      [key]: !this.state[key],
    });
  }

  async openWebcamModal() {
    if (this.state.modalWebcam) {
      return this.openModal("modalWebcam");
    }
    const devices = await webcam.getAvailableDevices();
    const preferredWebcam = devices.find(device => device.id === this.state.webcamDeviceId);

    if (!preferredWebcam) {
      const deviceId = devices.length ? devices[0].id : null;

      this.setState({
        webcamDeviceId: deviceId
      });

      window.localStorage.setItem("kasm_webcam_device", deviceId);
    }

    this.setState({
      availableWebcams: devices,
    });

    this.openModal("modalWebcam");
  }

  openGamepadModal() {
    if (this.state.gamepadInitialized === false) {
      this.initializeGamepads()
    }
    this.openModal("modalGamepad")
  }

  showAdvancedMenu() {
    const { statusKasms } = this.props;
    return (statusKasms.client_settings["control_panel.advanced_settings.show_prefer_local_cursor"] ||
      statusKasms.client_settings["control_panel.advanced_settings.show_keyboard_controls"] ||
      statusKasms.client_settings["control_panel.advanced_settings.show_ime_input_mode"] ||
      statusKasms.client_settings["control_panel.advanced_settings.show_game_mode"] ||
      statusKasms.client_settings["control_panel.advanced_settings.show_pointer_lock"]);
  }

  showControlPanel() {
    const { statusKasms } = this.props;
    return (this.showAdvancedMenu() ||
      statusKasms.client_settings.allow_kasm_audio ||
      statusKasms.client_settings.allow_kasm_microphone ||
      statusKasms.client_settings.allow_kasm_clipboard_up ||
      statusKasms.client_settings.allow_kasm_clipboard_down ||
      statusKasms.client_settings.allow_kasm_downloads ||
      statusKasms.client_settings.allow_kasm_uploads ||
      statusKasms.client_settings["control_panel.show_streaming_quality"] ||
      statusKasms.client_settings.allow_kasm_sharing ||
      statusKasms.client_settings.allow_kasm_gamepad ||
      statusKasms.client_settings["control_panel.show_return_to_workspaces"] ||
      statusKasms.client_settings["control_panel.show_logout"] ||
      statusKasms.client_settings["control_panel.show_delete_session"]
    )
  }

  canFullScreen() {
    const element = document.createElement('div')
    if (!!element.requestFullscreen || !!element.mozRequestFullScreen || !!element.webkitRequestFullscreen || !!element.msRequestFullscreen) {
      return true
    }
    return false
  }

  render() {
    const { disableIndex, progress, downloads, shareLink, connectedGamepads } = this.state;
    const { statusKasms, t } = this.props;
    const userInfo = JSON.parse(window.localStorage.user_info);

    const defaultPreferLocalCursor = JSON.parse(
      window.localStorage.getItem("kasm_prefer_local_cursor") || "true"
    );

    const config = this.componentConfig;
    const djsConfig = this.djsConfig;

    const progressBars = this.state.files.map((file) => (
      <div className="progressbar" key={file.name}>
        <strong>{file.name}</strong>{" "}
        <span className="float-right" style={{}}>
          {file.size}&nbsp;&nbsp;&nbsp;
          <button
            style={{
              background: "none",
              border: "none",
              margin: "0",
              padding: "0",
              cursor: "pointer",
              color: "red",
            }}
            onClick={() => this.removeFile(file)}
          >
            ✘
          </button>
        </span>
        <Progress
          animated
          className="pd=15"
          color={file.color}
          value={file.progress}
        />
        {file.error ? (
          <span style={{ color: "red" }}> {file.error} </span>
        ) : file.progress === 100 ? (
          "File Complete"
        ) : (
          ""
        )}
      </div>
    ));

    const eventHandlers = {
      init: (dz) => (this.dropzone = dz),
      addedfile: this.handleAddedFile,
      success: this.handleSuccessFile,
      uploadprogress: this.handleUploadprogress,
      error: this.handleError,
      sending: this.fileCanceled,
      queuecomplete: this.resetDropzone,
    };

    // Send an event to the parent document (kasm app) to toggle the control panel when ctl is double clicked

    var delta = 500;
    var lastKeypressTime = 0;
    if (this.props.toggle_control_panel === true) {
      document.addEventListener(
        "keyup",
        (event) => {
          const keyName = event.key;
          // CTRL and the various implementations of the mac command key
          if ([17, 224, 91, 93].indexOf(event.keyCode) > -1) {
            let thisKeypressTime = new Date();
            if (thisKeypressTime - lastKeypressTime <= delta) {
              this.toggleNav();
              thisKeypressTime = 0;
            }
            lastKeypressTime = thisKeypressTime;
          }
        },
        true
      );
    }

    const dragStart = (e) => {
      this.setState({ draggingTab: true })
    }
    const dragTab = (e) => {
      if (this.state.draggingTab) {
        this.setState({ tabTop: e.clientY - 10 })
      }
    }
    const touchDragTab = (e) => {
      e.preventDefault()
      const touch = e.touches[0]
      this.setState({ tabTop: touch.clientY - 10 })
    }

    return (
      <div>
        <canvas id="video-canvas" />
        <div className="countdown"></div>
        <div id="mySidenav"
            className={classNames(
              this.state.loadin ? 'loadin' : '',
              this.state.showNav && !this.props.hideControlPanel && this.showControlPanel()
                ? "show_nav"
                : "hide_nav"
             )}>
              <div onMouseMove={dragTab} onTouchMove={touchDragTab} onMouseUp={() => this.setState({ draggingTab: false })} onMouseLeave={() => this.setState({ draggingTab: false })} style={{ top: this.state.tabTop + 'px'}} 
              className={classNames("tab tw-touch-none", this.state.draggingTab ? 'tw-py-20 tw-pr-8 -tw-mt-20 -tw-mr-8' : '')}>
                <div className="tw-flex tw-flex-col tabinner tw-rounded-r-lg tw-overflow-hidden">
                <div
                  onMouseUp={() => this.setState({ draggingTab: false })}
                  onTouchEnd={() => this.setState({ draggingTab: false })}
                  onMouseDown={dragStart}
                  onTouchStart={dragStart}
                  className="tw-flex tw-justify-center tw-cursor-move tw-items-center tw-bg-black/5 tw-rounded-tr-lg tw-py-1">
                  <FontAwesomeIcon icon={faGripDots} />
                </div>
                <div onClick={() => { this.toggleNav() }} className="tw-cursor-pointer tw-relative tw-rounded-br-lg innertab">
                  
                <Transition
                  show={this.state.iconOnly === false}
                  enter="tw-transition-opacity tw-duration-250"
                  enterFrom="tw-opacity-0 tw-scale-0"
                  enterTo="tw-opacity-100 tw-scale-100"
                  leave="tw-transition-opacity tw-duration-250"
                  leaveFrom="tw-opacity-100 tw-scale-100"
                  leaveTo="tw-opacity-0 tw-scale-0"
                >{t('control_panel.control-panel')}</Transition>
                <Transition
                  show={this.state.iconOnly === true}
                  enter="tw-delay-300 tw-absolute tw-transition-opacity tw-duration-250"
                  enterFrom="tw-opacity-0"
                  enterTo="tw-opacity-100"
                  entered="tw-absolute"
                  leave="tw-transition-opacity tw-duration-250"
                  leaveFrom="tw-opacity-100"
                  leaveTo="tw-opacity-0"
                ><FontAwesomeIcon icon={faChevronRight} /></Transition>
                  
                  </div></div>
                </div>
          <div
          className="sidenavnew"
          >
            <div className="tw-flex tw-justify-between">
              <span className="tw-text-xl tw-font-bold">{t('control_panel.control-panel')}</span>
              <button
                className="tw-bg-transparent"
                onClick={() => {
                  if (this.state.showNav) {
                    this.closeAllModals();
                  }
                  this.hideNav()
                }}
              >
                <FontAwesomeIcon className="tw-text-xl" icon={faXmark} />
              </button>

            </div>
            <div className="sidebar-icons-list">
              
              <div className="tw-grid tw-grid-cols-4 tw-py-5">

              {statusKasms.client_settings.allow_kasm_webcam == true && (
                <ToggleButton 
                  icon={<FontAwesomeIcon size="lg" icon={faCameraWeb} />}
                  disabledIcon={<FontAwesomeIcon size="lg" icon={faCameraWebSlash} />}
                  disabled={!this.state.webcam}
                  onClick={() => this.handleWebcamChange(!this.state.webcam)}
                  type="toggle"
                  title={t("control_panel.webcam")}
                  description={this.state.webcam ? t("control_panel.Webcam Enabled") : t("control_panel.Webcam Disabled")}
                />
              )}

              {statusKasms.client_settings.allow_kasm_audio == true && (
                <ToggleButton 
                  icon={<FontAwesomeIcon size="lg" icon={faVolume} />}
                  disabledIcon={<FontAwesomeIcon size="lg" icon={faVolumeSlash} />}
                  disabled={!this.state.audio}
                  onClick={() => this.handleAudioChange(!this.state.audio)}
                  type="toggle"
                  title={t("control_panel.sound")}
                  description={this.state.audio ? t("control_panel.Sound Enabled") : t("control_panel.Sound Disabled")}
                />
              
              )}

              {statusKasms.client_settings.allow_kasm_microphone == true && (
                <ToggleButton 
                  icon={<FontAwesomeIcon size="lg" icon={faMicrophone} />}
                  disabledIcon={<FontAwesomeIcon size="lg" icon={faMicrophoneSlash} />}
                  disabled={!this.state.microphone}
                  onClick={() => this.handleMicrophoneChange(!this.state.microphone)}
                  type="toggle"
                  title={t("control_panel.microphone")}
                  description={this.state.microphone ? t("control_panel.Microphone Enabled") : t("control_panel.Microphone Disabled")}
                />
              )}
              {this.canFullScreen() && statusKasms.client_settings["control_panel.show_fullscreen"] === true && (
                <ToggleButton 
                  icon={<FontAwesomeIcon size="lg" icon={faMinimize} />}
                  disabledIcon={<FontAwesomeIcon size="lg" icon={faExpand} />}
                  disabled={!this.props.fullscreen}
                  onClick={() => this.toggleFullscreen()}
                  type="toggle"
                  title={t("control_panel.Fullscreen")}
                  description={this.props.fullscreen ? t("control_panel.exit-fullscreen") : t("control_panel.enter-fullscreen")}
                />
              )}
              </div>

              {(statusKasms.client_settings.allow_kasm_clipboard_up ||
                statusKasms.client_settings.allow_kasm_clipboard_down ==
                true) && (
                  <React.Fragment>
                    <ControlButton 
                      icon={<FontAwesomeIcon size="lg" icon={faClipboard} />}
                      onClick={() => this.openModal("isShowClipboard")}
                      type="action"
                      open={this.state.isShowClipboard}
                      title={t("control_panel.Clipboard")}
                      description={t("control_panel.clipboard-description")}
                    />
                    <ControlSection show={this.state.isShowClipboard}>
                      <div className="popup showpopup clipboard tw-relative">
                        <p>{t("control_panel.clipboard_text")}</p>
                        {statusKasms.client_settings.allow_kasm_clipboard_up ===
                          false ? (
                          <span style={{ color: "#f2a025", fontWeight: "bold" }}>
                            {" "}
                            {t("control_panel.paste_data")}
                          </span>
                        ) : (
                          ""
                        )}
                        {statusKasms.client_settings.allow_kasm_clipboard_down ===
                          false ? (
                          <span style={{ color: "#f2a025", fontWeight: "bold" }}>
                            {" "}
                            {t("control_panel.copy_data")}
                          </span>
                        ) : (
                          ""
                        )}
                        <textarea
                          value={this.state.clipboardText}
                          onChange={this.handleClipboard}
                          className="clipboard-text form-control"
                          rows="6"
                          id="clipboardtext"
                        ></textarea>
                      </div>
                    </ControlSection>
                  </React.Fragment>
                )}
              {statusKasms.client_settings.allow_kasm_printing == true && (
                <React.Fragment>
                    <ControlButton 
                      icon={<FontAwesomeIcon size="lg" icon={faPrint} />}
                      onClick={() => {
                        this.openModal("isShowPrinter");
                      }}
                      type="action"
                      open={this.state.isShowPrinter}
                      title={t("control_panel.printer-redirection")}
                      description={t("control_panel.printer-redirection-text")}
                    />
                  <ControlSection show={this.state.isShowPrinter}>
                    <div className="popup showpopup download-files tw-flex tw-flex-col tw-gap-1">
                      <p className="tw-mb-3">{t("control_panel.printer-redirection-description")}</p>
                      <img className="!tw-aspect-auto" src={printer} />
                    </div>
                  </ControlSection>
                </React.Fragment>
              )}

              {statusKasms.client_settings.allow_kasm_downloads == true && (
                <React.Fragment>
                    <ControlButton 
                      icon={<FontAwesomeIcon size="lg" icon={faDownload} />}
                      onClick={() => {
                        this.openModal("isShowDownload");
                        this.toggleDownload();
                      }}
                      type="action"
                      open={this.state.isShowDownload}
                      title={t("control_panel.Download")}
                      description={t("control_panel.Download Files")}
                    />
                  <ControlSection show={this.state.isShowDownload}>
                  <div className="popup showpopup download-files tw-flex tw-flex-col tw-gap-1">
                      <p className="tw-mb-3">{t("control_panel.download_text")}</p>

                      {downloads.length > 0 &&
                        downloads.map((download) =>
                          download.is_dir ? (
                                <button
                                  className="downloader tw-flex tw-gap-4 tw-group tw-transition-transform hover:tw-scale-105"
                                  key={download.dlink}
                                  onClick={() =>
                                    this.downloadsList(download.relative_path)
                                  }
                                >
                                  <FontAwesomeIcon size="xl" icon={faFolder} />
                                  <span className="tw-opacity-60 tw-text-xs group-hover:tw-opacity-100">{download.name}</span>
                                  {download.name === '..' ? 
                                  <FontAwesomeIcon className="tw-ml-auto" icon={faArrowTurnUp} /> : <FontAwesomeIcon className="tw-ml-auto" icon={faChevronRight} />}
                                </button>
                          ) : (
                            <a href={download.dlink} download target="_blank" className="downloader tw-flex tw-gap-4 tw-group tw-transition-transform hover:tw-scale-105" key={download.dlink}>
                              <FontAwesomeIcon size="2xl" icon={faFileInvoice} />
                                <span className="tw-opacity-60 tw-text-xs group-hover:tw-opacity-100">{download.name}</span>
                                <FontAwesomeIcon className="tw-ml-auto" icon={faDownload} />
                            </a>
                          )
                        )}
                    </div>

                  </ControlSection>
                </React.Fragment>
              )}
              {statusKasms.client_settings.allow_kasm_uploads == true && (
                <React.Fragment>
                    <ControlButton 
                      icon={<FontAwesomeIcon size="lg" icon={faUpload} />}
                      onClick={() => this.openModal("modaluploads")}
                      type="action"
                      open={this.state.modaluploads}
                      title={t("control_panel.Upload")}
                      description={t("control_panel.Upload Files")}
                    />
                    <ControlSection show={this.state.modaluploads}>

                    <div className="popup showpopup upload">
                      <DropzoneComponent
                        className="upload-file !tw-p-12"
                        config={config}
                        djsConfig={djsConfig}
                        eventHandlers={eventHandlers}
                      />
                      {progressBars}
                      <div className="btn-clear-all">
                        {this.state.files.length > 0 ? (
                          <button
                            className="mt-1 btn btn-primary"
                            onClick={() => this.clearFiles()}
                          >
                            {t("control_panel.Clear all")}
                          </button>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </ControlSection>
                </React.Fragment>
              )}

              {this.state.controlDisplays && statusKasms.client_settings["control_panel.show_display_manager"] === true && 
              <ControlButton 
                icon={<FontAwesomeIcon size="lg" icon={faDesktop} />}
                onClick={() => {
                  this.setDisplaysMode("open")
                }}
                type="action"
                open={false}
                title={t("control_panel.displays")}
                description={t("control_panel.add-and-arrange")}
              />
              }

              {statusKasms.client_settings["control_panel.show_streaming_quality"] === true && (
                <React.Fragment>
                  <ControlButton
                    icon={<FontAwesomeIcon size="lg" icon={faGauge} />}
                    onClick={() => this.openModal("modalvideo")}
                    type="action"
                    open={this.state.modalvideo}
                    title={t("control_panel.Streaming Quality")}
                    description={t("control_panel.Streaming Quality")}
                  />
                  <ControlSection show={this.state.modalvideo}>
                    {this.renderStreamingQualityModal()}
                  </ControlSection>
                </React.Fragment>
              )}

              {statusKasms.client_settings.allow_kasm_sharing == true && (
                <React.Fragment>
                  <ControlButton
                    icon={<FontAwesomeIcon size="lg" icon={faShareNodes} />}
                    onClick={() => this.openModal("modalsharing")}
                    type="action"
                    open={this.state.modalsharing}
                    title={t("control_panel.Share Instance")}
                    description={t("control_panel.Share Session")}
                  />
                  <ControlSection show={this.state.modalsharing}>

                    <div className="popup showpopup sharesession">
                      <p>{t("control_panel.share_text")}</p>
                      {shareLink ? (
                        <div>
                          <div className="d-flex">
                            <div className="share-link d-flex">
                              <button
                                className="btn btn-link share-btn"
                                onClick={() => {
                                  this.openWindow(
                                    "https://" +
                                    window.location.host +
                                    window.location.pathname +
                                    "#/join/" +
                                    shareLink
                                  );
                                }}
                              >
                                {"https://" +
                                  window.location.host +
                                  window.location.pathname +
                                  "#/join/" +
                                  shareLink}
                              </button>
                              <button
                                className="btn btn-default btn-sm copy-share-button"
                                onClick={() => {
                                  this.copyToClipboard(
                                    "https://" +
                                    window.location.host +
                                    window.location.pathname +
                                    "#/join/" +
                                    shareLink
                                  );
                                }}
                              >
                                <FontAwesomeIcon icon={faCopy} aria-hidden="true" />
                              </button>
                            </div>
                          </div>
                          <div id="share_tips">
                            <h4>{t("control_panel.Sharing Tips!")}</h4>
                            <p>{t("control_panel.tips1")}</p>
                            <p>{t("control_panel.tips2")}</p>
                          </div>
                          <button
                            className="share-kasm-btn"
                            onClick={this.handleDestroyShareLink}
                          >
                            {t("control_panel.Stop Sharing")}
                          </button>
                        </div>
                      ) : (
                        <button
                          className="share-kasm-btn"
                          onClick={this.handleCreateShareLink}
                        >
                          <FontAwesomeIcon icon={faShare} className="tw-mr-2" />
                          {t("control_panel.Share Session")}
                        </button>
                      )}
                    </div>
                    </ControlSection>
                </React.Fragment>
              )}
              {statusKasms.client_settings.allow_kasm_gamepad === true && (
                <React.Fragment>
                  <ControlButton
                    icon={<FontAwesomeIcon size="lg" icon={faGamepad} />}
                    onClick={() => this.openGamepadModal()}
                    type="action"
                    open={this.state.modalGamepad}
                    title={t("control_panel.Gamepads")}
                    description={t("control_panel.Gamepads")}
                  />
                  <ControlSection show={this.state.modalGamepad}>

                    <div className="popup showpopup gamepad-popup">
                      <p>
                      {t("control_panel.Connected Gamepads")}:
                      </p>
                      <p>
                        ({t("control_panel.Press buttons on gamepad if not shown")})
                      </p>
                      <Table className="tw-text-xs gamepad-table">
                        <tbody>
                          {connectedGamepads.length > 0 &&
                            connectedGamepads.map((connectedGamepad) =>
                              <tr key={"gamepad_tr_" + connectedGamepad.index}>
                                <td>
                                  <Select
                                    id={"gamepad_" + connectedGamepad.index}
                                    clearable={false}
                                    autoFocus
                                    value={this.state.gamepadIndexToInput[connectedGamepad.index]}
                                    options={[
                                      { value: 0, label: '0', gamepad_index: connectedGamepad.index },
                                      { value: 1, label: '1', gamepad_index: connectedGamepad.index },
                                      { value: 2, label: '2', gamepad_index: connectedGamepad.index },
                                      { value: 3, label: '3', gamepad_index: connectedGamepad.index },
                                    ]}
                                    onChange={this.updateGamepadInputIndex}
                                  />
                                </td>
                                <td >
                                  {connectedGamepad.index} : {connectedGamepad.id} : {t("control_panel.Buttons")} ({connectedGamepad.len_buttons}) : {t("control_panel.Axes")} : ({connectedGamepad.len_axes})
                                </td>
                              </tr>

                            )}
                        </tbody>
                      </Table>
                    </div>
                  </ControlSection>
                </React.Fragment>
              )}

              {statusKasms.client_settings.allow_kasm_webcam === true && (
                <React.Fragment>
                  <ControlButton
                    icon={<FontAwesomeIcon size="lg" icon={faCameraWeb} />}
                    onClick={() => this.openWebcamModal()}
                    type="action"
                    open={this.state.modalWebcam}
                    title={t("control_panel.Webcam Settings")}
                    description={t("control_panel.Webcam Settings")}
                  />
                  <ControlSection show={this.state.modalWebcam}>
                    {this.renderWebcamSettings()}
                  </ControlSection>
                </React.Fragment>
              )}

              <React.Fragment>
                {this.showAdvancedMenu() && (
                  <ControlButton
                    icon={<FontAwesomeIcon size="lg" icon={faGear} />}
                    onClick={() => this.openModal("modalAdvanced")}
                    type="action"
                    open={this.state.modalAdvanced}
                    title={t("control_panel.Advanced Settings")}
                    description={t("control_panel.Advanced Settings")}
                  />
                  
                
                )}
                <ControlSection show={this.state.modalAdvanced}>
                  <div className="popup showpopup advanced">
                    {statusKasms.client_settings["control_panel.advanced_settings.show_prefer_local_cursor"] === true && (
                      <div className="check-outer-box" style={{ marginBottom: "27px" }}>
                        <label className="check-outer">
                        {t("control_panel.Prefer Local Cursor")}
                          <input
                            type="checkbox"
                            defaultChecked={defaultPreferLocalCursor}
                            onChange={this.handlePreferLocalCursorChange}
                          />
                          <span className="checkmark"></span>
                        </label>
                      </div>
                    )}
                    {statusKasms.client_settings["control_panel.advanced_settings.show_keyboard_controls"] === true && (
                      <div>
                        <h6>{t("control_panel.Show Keyboard Controls")}</h6>
                        <div className="radio-outer-box">
                          {!IS_WINDOWS && <div className="radio-outer">
                            <input
                              type="radio"
                              value="auto"
                              id="keyboard-auto"
                              name="radio-group"
                              checked={this.state.keyboardControlsMode === "auto"}
                              onChange={() => this.setKeyboardControlsMode("auto")}
                            />
                            <label for="keyboard-auto">{t("control_panel.Auto")}</label>
                          </div>}
                          <div className="radio-outer">
                            <input
                              type="radio"
                              value="on"
                              id="keyboard-on"
                              name="radio-group"
                              checked={this.state.keyboardControlsMode === "on"}
                              onChange={() => this.setKeyboardControlsMode("on")}
                            />
                            <label for="keyboard-on">{t("control_panel.On")}</label>
                          </div>
                          <div className="radio-outer">
                            <input
                              type="radio"
                              value="off"
                              id="keyboard-off"
                              name="radio-group"
                              checked={this.state.keyboardControlsMode === "off"}
                              onChange={() => this.setKeyboardControlsMode("off")}
                            />
                            <label for="keyboard-off">{t("control_panel.Off")}</label>
                          </div>
                        </div>
                      </div>
                    )}
                    {statusKasms.client_settings["control_panel.advanced_settings.show_ime_input_mode"] === true && (
                      <div>
                        <h6>{t("control_panel.IME Input Mode")}</h6>
                        <div className="radio-outer-box">
                          <div className="radio-outer">
                            <input
                              type="radio"
                              value="on"
                              id="ime-on"
                              name="ime-radio-group"
                              checked={this.state.imeMode === "on"}
                              onChange={() => this.setIMEMode("on")}
                            />
                            <label htmlFor="ime-on">{t("control_panel.On")}</label>
                          </div>
                          <div className="radio-outer">
                            <input
                              type="radio"
                              value="off"
                              id="ime-off"
                              name="ime-radio-group"
                              checked={this.state.imeMode === "off"}
                              onChange={() => this.setIMEMode("off")}
                            />
                            <label htmlFor="ime-off">{t("control_panel.Off")}</label>
                          </div>
                        </div>
                      </div>
                    )}
                    {statusKasms.client_settings["control_panel.advanced_settings.show_game_mode"] === true && (
                      <div>
                        <h6 style={{ display: "inline" }}>{t("control_panel.Game Mode")}</h6>
                        <pre className="text-muted" style={{ display: "inline" }}> [Ctrl+Shift+2]</pre>
                        <div className="radio-outer-box">
                          <div className="radio-outer">
                            <input
                              type="radio"
                              value="on"
                              id="game-on"
                              name="game-radio-group"
                              checked={this.state.gameMode === "on"}
                              onChange={() => this.setGameMode("on")}
                            />
                            <label htmlFor="game-on">{t("control_panel.On")}</label>
                          </div>
                          <div className="radio-outer">
                            <input
                              type="radio"
                              value="off"
                              id="game-off"
                              name="game-radio-group"
                              checked={this.state.gameMode === "off"}
                              onChange={() => this.setGameMode("off")}
                            />
                            <label htmlFor="game-off">{t("control_panel.Off")}</label>
                          </div>
                        </div>
                      </div>
                    )}
                    {statusKasms.client_settings["control_panel.advanced_settings.show_pointer_lock"] === true && (
                      <div>
                        <h6 style={{ display: "inline" }}>{t("control_panel.Pointer Lock")}</h6>
                        <pre className="text-muted" style={{ display: "inline" }}> [Ctrl+Shift+3]</pre>
                        <div className="radio-outer-box">
                          <div className="radio-outer">
                            <input
                              type="radio"
                              value="on"
                              id="pointer-lock-on"
                              name="pointer-lock-radio-group"
                              checked={this.state.pointerLock === "on"}
                              onChange={() => this.setPointerLock("on")}
                            />
                            <label htmlFor="pointer-lock-on">{t("control_panel.On")}</label>
                          </div>
                          <div className="radio-outer">
                            <input
                              type="radio"
                              value="off"
                              id="pointer-lock-off"
                              name="pointer-lock-radio-group"
                              checked={this.state.pointerLock === "off"}
                              onChange={() => this.setPointerLock("off")}
                            />
                            <label htmlFor="pointer-lock-off">{t("control_panel.Off")}</label>
                          </div>
                        </div>
                      </div>
                    )}
                    
                  </div>
                </ControlSection>
              </React.Fragment>

              {statusKasms.client_settings["control_panel.show_return_to_workspaces"] === true && (
                <ControlButton
                  icon={<FontAwesomeIcon size="lg" icon={faLayerGroup} />}
                  onClick={() => this.handleLeave("/userdashboard")}
                  type="redirect"
                  title={t("control_panel.Workspaces")}
                  description={t("control_panel.workspaces-description")}
                />
              )}
              {statusKasms.client_settings["control_panel.show_logout"] === true && (
                <ControlButton
                  icon={<FontAwesomeIcon size="lg" icon={faArrowRightFromBracket} />}
                  iconColor="tw-bg-pink-700"
                  onClick={() => this.showLogout()}
                  type="redirect"
                  title={t("control_panel.Log Out")}
                  description={t("control_panel.logout-description")}
                />
              )}
              {statusKasms.client_settings["control_panel.show_delete_session"] === true && statusKasms.client_settings["allow_kasm_delete"] === true && (
                <ControlButton
                  icon={<FontAwesomeIcon size="lg" icon={faTrash} />}
                  iconColor="tw-bg-pink-700"
                  onClick={() => this.showDestroy()}
                  type="redirect"
                  title={t("control_panel.Delete Session")}
                  description={t("control_panel.delete-session-description")}
                />
              
              )}
            </div>
          </div>
        </div>

        <ConfirmAction
          confirmationDetails={{
            action: null,
            details: {
              title: t('control_panel.Logout'),
              text: t('control_panel.Are you sure you want to logout?'),
              iconBg: 'tw-bg-pink-700 tw-text-white',
              icon: <FontAwesomeIcon icon={faArrowRightFromBracket} />,
              confirmBg: 'tw-bg-pink-700',
              confirmText: t('control_panel.Logout'),
              additional:
                <div className="tw-text-center">
                  <div className="group-label tw-flex tw-justify-center tw-items-center tw-gap-3"><label htmlFor="logoutall" id="force_label"><b className="tw-mb-2">{t('control_panel.sign_out_devices')}</b> </label><RenderToggle name="logoutall" id="logoutall" checked={!!this.state.logoutAll} onChange={this.updateLogoutAll} /></div>
                </div>
            }
          }}
          open={this.state.modal}
          externalClose={true}
          setOpen={this.toggleLogout}
          onAction={this.confirmLogout}
        />      

        <Modal
          icon={this.props.statusKasms.image && this.props.statusKasms.image.image_src &&
            this.props.statusKasms.image.image_src != "" ? (
            <img
              onError={this.defaultThumb}
              className="tw-rounded-full"
              src={this.props.statusKasms.image.image_src}
            />
          ) : (
            <KasmIcon kasm={this.props.statusKasms.image} />
          )}
          maxWidth="sm:tw-max-w-sm"
          iconBg="tw-scale-[170%] -tw-mt-12 tw-mb-10 tw-relative tw-p-1.5 tw-rounded-full tw-bg-white"
          titleRaw={this.props.statusKasms.image.friendly_name}
          contentRaw={
            <div className="modal-inner tw-mt-8">
              <p className="tw-mb-8">{t('control_panel.confirm_delete')}</p>
              <button
                type="button"
                className="actionbutton tw-cursor-pointer tw-bg-pink-700"
                onClick={this.destroyKasmsFun}
              >
                {this.state.destroyClicked ? <div><FontAwesomeIcon icon={faCircleNotch} spin /></div> :
                  t("buttons.Delete")
                }
              </button>

            </div>
          }
          open={this.state.modaldestroy}
          setOpen={this.toggleDestroy}

        />

      </div>
    );
  }

  renderStreamingQualityModal() {
    const { t } = this.props;
    const qualityOptions = {
      0: t("control_panel.Static"),
      1: t("control_panel.Low"),
      2: t("control_panel.Medium"),
      3: t("control_panel.High"),
      4: t("control_panel.Extreme"),
    };

    if (typeof SharedArrayBuffer !== "undefined") {
      qualityOptions[5] = t("control_panel.Lossless");
    }

    const qualityMarks = () => {
      const marks = {};

      for (const [key] of Object.entries(qualityOptions)) {
        marks[key] = key;
      }

      return marks;
    }

    const updateVideoQuality = (quality) => {
      const qualityFrameRate = QUALITY_FRAME_RATES[quality];
      this.setState({ framerate: qualityFrameRate });
      this.props.setVideoQuality(quality, qualityFrameRate);
    }

    return (
      <div className={`popup showpopup streaming ${this.state.showAdvancedQualitySettings ? "advanced" : ""}`}>
        <p className="text-left">{t("control_panel.streaming_quality_text")}</p>

        <h6 className="tw-mt-3">
        {t("control_panel.Quality")}: {qualityOptions[this.props.videoQuality]}
        </h6>
         
        <SliderWithTooltip
          value={this.props.videoQuality}
          min={0}
          max={(Object.keys(qualityOptions).length - 1)}
          marks={qualityMarks()}
          onChange={(value) => updateVideoQuality(value)}
          step={null}
        />
         
        <div className="tw-mt-8">
          <a onClick={this.toggleAdvancedQuality}>
            <h6 className="tw-inline">{t("control_panel.Advanced")}</h6>
            <h6 className="float-right tw-inline">
              {this.state.showAdvancedQualitySettings
                ? <FontAwesomeIcon icon={faChevronDown} />
                : <FontAwesomeIcon icon={faChevronUp} />
              }
            </h6>
          </a>
        </div>

        <Collapse isOpen={this.state.showAdvancedQualitySettings}>
          {this.props.videoQuality >= 2 && (
            <div>
              <h6 className="tw-mt-3 tw-pr-2">{t("control_panel.Scaling Mode")}</h6>
              <Select
                  id="scalingMode"
                  clearable={false}
                  searchable={false}
                  autoFocus
                  value={this.state.resize}
                  options={[
                    {value: "remote", label: t("control_panel.Remote Resize")},
                    {value: "scale", label: t("control_panel.Local Scaling")},
                    {value: "off", label: t("control_panel.Off") },
                  ]}
                  onChange={(e) => this.updateScalingMode(e.value)}
              />
            </div>
          )}

          {(this.props.videoQuality >= 2 && this.state.resize !== "remote") && (
            <div>
              <h6 className="tw-mt-3">{t("control_panel.Set Resolution")}{" "}</h6>
              <Row>
                <Col>
                  <div className="tw-flex tw-gap-2 tw-items-center">
                  <input
                    type="number"
                    className="form-control tw-w-28 tw-inline"
                    value={this.state.forcedResolutionWidth}
                    onChange={(e) => this.handleForcedResolutionWidthChange(e.target.value)}
                  />
                  <span>{" "}X{" "}</span>
                  <input
                    className="form-control tw-w-28 tw-inline"
                    type="number"
                    value={this.state.forcedResolutionHeight}
                    onChange={(e) => this.handleForcedResolutionHeightChange(e.target.value)}
                  />
                  <button
                    className="tw-rounded tw-h-10 tw-bg-blue-500 hover:tw-bg-slate-600 tw-text-sm tw-text-white tw-flex tw-items-center tw-transition"
                    onClick={() => this.handleForcedResolution()}
                  >
                    <span className="tw-px-8">{t("control_panel.Set")}</span>
                    
                  </button>
                  </div>
                  </Col>
              </Row>
            </div>
          )}

          <h6 className="tw-mt-3">{t("control_panel.Max FPS")}:  {" "}{this.state.framerate}{" "}</h6>
          <SliderWithTooltip
            value={this.state.framerate}
            min={10}
            max={60}
            marks={{ 10: 10, 60: 60 }}
            onAfterChange={this.props.setFrameRate}
            onChange={this.handleFrameRateChange}
          />
          
          <h6 className="tw-mt-8">{t("control_panel.Performance Stats")}</h6>
          <div className="check-outer-box">
            <label className="check-outer">
              {t("control_panel.Enabled")}
              <input
                type="checkbox"
                checked={this.state.perfStats}
                onChange={this.handleSetPerfStats}
              />
              <span className="checkmark"></span>
            </label>
          </div>

        </Collapse>
       </div>
     )
  }

  selectWebcamById(deviceId) {
    webcam.setDevice(deviceId);
    this.setState({ webcamDeviceId: deviceId });
    window.localStorage.setItem("kasm_webcam_device", deviceId);
  }

  updateWebcamFps(fps) {
    webcam.setFPS(fps);
    this.setState({ webcamFps: fps });
    window.localStorage.setItem("kasm_webcam_fps", fps);
  }

  updateWebcamQuality(quality) {
    webcam.setQuality(quality);
    this.setState({ webcamQuality: quality });
    window.localStorage.setItem("kasm_webcam_quality", quality);
  }

  renderWebcamSettings() {
    const { t } = this.props;

    return (
      <div className={`popup showpopup !tw-pb-12 ${this.state.showAdvancedWebcamSettings ? "advanced" : ""}`}>
        <h6>{t("control_panel.Webcam Device")}</h6>
        <Select
          id="webcam-selection"
          clearable={false}
          autoFocus
          value={this.state.webcamDeviceId}
          options={this.state.availableWebcams.map(device => ({
            value: device.id,
            label: device.name
          }))}
          onChange={(device) => this.selectWebcamById(device.value)}
        />

        <div className="tw-mt-4">
          <a onClick={() => this.setState({ showAdvancedWebcamSettings: !this.state.showAdvancedWebcamSettings })}>
            <h6 className="tw-inline">{t("control_panel.Advanced")}</h6>
            <h6 className="float-right tw-inline">
              {this.state.showAdvancedWebcamSettings
                ? <FontAwesomeIcon icon={faChevronDown} />
                : <FontAwesomeIcon icon={faChevronUp} />
              }
            </h6>
          </a>
        </div>

        <Collapse isOpen={this.state.showAdvancedWebcamSettings}>
          <h6 className="tw-mt-4">{t("control_panel.Webcam Quality")}: {this.state.webcamQuality}</h6>
          <SliderWithTooltip
            value={this.state.webcamQuality}
            min={1}
            max={10}
            marks={{ 1: 1, 5: 5, 10: 10}}
            onChange={(value) => this.updateWebcamQuality(value)}
            step={1}
          />

          <h6 className="tw-mt-8">{t("control_panel.Webcam FPS")}: {this.state.webcamFps} FPS</h6>
          <SliderWithTooltip
            value={this.state.webcamFps}
            min={10}
            max={60}
            marks={{ 10: 10, 30: 30, 60: 60 }}
            onAfterChange={() => {}}
            onChange={(value) => this.updateWebcamFps(value)}
          />
        </Collapse>
      </div>
    )
  }
}

ControlPanel.propTypes = {
  logout: Proptypes.func.isRequired,
  toggleLoader: Proptypes.func.isRequired,
  destroyKasms: Proptypes.func.isRequired,
  statusKasms: Proptypes.object,
  history: Proptypes.object,
  updateKeepalive: Proptypes.func.isRequired,
  kasmId: Proptypes.func,
  videoQuality: Proptypes.number,
  setVideoQuality: Proptypes.func,
  setVideoQualityStyle: Proptypes.func,
  setResize: Proptypes.func,
  setFrameRate: Proptypes.func,
  setForcedResolution: Proptypes.func,
  setPerfStats:Proptypes.func,
  controlFullscreen: Proptypes.func,
  handleDisconnect: Proptypes.func,
  shareEnabled: Proptypes.func.isRequired,
  hideControlPanel: Proptypes.bool,
  fullscreen: Proptypes.bool,
  disableFixedRes: Proptypes.bool,
};

ControlPanel = withRouter(ControlPanel); // eslint-disable-line

const ControlPanelTranslated = withTranslation('common')(ControlPanel)

export default connect(
  (state) => ({
    share_id: state.dashboard.share_id || null,
    destroyShareLoading: state.dashboard.destroyShareLoading || null,
    destroyShareError: state.dashboard.destroyShareError || null,
    createShareLoading: state.dashboard.createShareLoading || null,
    createShareError: state.dashboard.createShareError || null,
  }),
  (dispatch) => ({
    createKasmShareId: (data) => dispatch(createKasmShareId(data)),
    destroyKasmShareId: (data) => dispatch(destroyKasmShareId(data)),
  })
)(ControlPanelTranslated);
