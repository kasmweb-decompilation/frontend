import React, { Component } from "react";
import {
  Table,
} from "reactstrap";
import { post } from "axios";
import { withRouter } from "react-router";
import "react-toggle/style.css";
import Toggle from "react-toggle";
import moment from "moment";
import JSMpeg from "jsmpeg-player";
import Proptypes from "prop-types";
import "rc-slider/assets/index.css";
import { connect } from "react-redux";
import Select from "react-select";
import Slider, { createSliderWithTooltip } from "rc-slider";
import { NotificationManager } from "react-notifications";
import stopReload from "../../constants/Constants";
import {
  destroyKasmShareId,
  createKasmShareId,
} from "../../actions/actionDashboard";
import ChatComponent from "../Chat/ChatComponent";
import soundEnabled from "../../../assets/images/soundEnabled.png";
import soundDisabled from "../../../assets/images/soundDisabled.png";
import leftArrow from "../../../assets/images/leftArrow.png";
import logout from "../../../assets/images/logout.svg";
import apps from "../../../assets/images/apps.png";
import cross from "../../../assets/images/cross.png";
import audio from "../../audio";
import gamepad from "../../../assets/images/gamepad.svg";
import {withTranslation} from "react-i18next";
import { ConfirmAction } from "../Table/NewTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket } from "@fortawesome/pro-light-svg-icons/faArrowRightFromBracket";
import { RenderToggle } from "../../utils/formValidations";
import { faAngleRight } from "@fortawesome/pro-light-svg-icons/faAngleRight";
import { ControlButton } from "../ControlPanel/ControlButton";
import { faVolume } from "@fortawesome/pro-light-svg-icons/faVolume";
import { faVolumeSlash } from "@fortawesome/pro-light-svg-icons/faVolumeSlash";
import { faXmark } from "@fortawesome/pro-light-svg-icons/faXmark";
import { faExpand } from "@fortawesome/pro-light-svg-icons/faExpand";
import { faGamepad } from "@fortawesome/pro-light-svg-icons/faGamepad";
import { faLayerGroup } from "@fortawesome/pro-light-svg-icons/faLayerGroup";
import { faMinimize } from "@fortawesome/pro-light-svg-icons/faMinimize";

var player;
var keepAlive;
var renderNav;
var gamepadLoop = null;
var gamepadTimestamps = [];

const IS_TOUCH_DEVICE = (
  ("ontouchstart" in window) ||
  (navigator.maxTouchPoints > 0) ||
  (navigator.msMaxTouchPoints > 0)
);

class ViewPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      showNav: false,
      audio: true,
      microphone: false,
      gamepad: false,
      gamepad_url: null,
      connectedGamepads: [],
      gamepadIndexToInput: {},
      gamepadInputToIndex: {},
      gamepadInitialized: false,
      modalGamepad: false,
      collapse: false,
      currentIndex: null,
      shareLink: null,
      message: null,
      disableIndex: [],
      modalAdvanced: false,
      logoutAll: false,
    };

    this.showNav = this.showNav.bind(this);
    this.hideNav = this.hideNav.bind(this);
    this.toggleNav = this.toggleNav.bind(this);
    this.confirmLogout = this.confirmLogout.bind(this);
    this.cancelLogout = this.cancelLogout.bind(this);
    this.showLogout = this.showLogout.bind(this);
    this.toggleLogout = this.toggleLogout.bind(this);
    this.toggle = this.toggle.bind(this);
    this.showMessage = this.showMessage.bind(this);
    this.handleAudioChange = this.handleAudioChange.bind(this);
    this.receiveMessage = this.receiveMessage.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.copyToClipboard = this.copyToClipboard.bind(this);
    this.hideNavDelay = this.hideNavDelay.bind(this);
    this.handleLeave = this.handleLeave.bind(this);
    this.updateLogoutAll = this.updateLogoutAll.bind(this);
    this.onGamepadConnected = this.onGamepadConnected.bind(this);
    this.onGamepadDisconnected = this.onGamepadDisconnected.bind(this);
    this.pollGamepad = this.pollGamepad.bind(this);
    this.updateGamepadInputIndex = this.updateGamepadInputIndex.bind(this);
    this.closeGamepad = this.closeGamepad.bind(this);
    this.initializeGamepads = this.initializeGamepads.bind(this);
    this.setConnectedGamepads = this.setConnectedGamepads.bind(this);
    this.setGamepadIndex = this.setGamepadIndex.bind(this);
    this.toggleFullscreen = this.toggleFullscreen.bind(this);
  }

  handleLeave(location) {
    console.trace("Navigating browser to " + location);
    window.removeEventListener("beforeunload", stopReload, true);
    this.props.history.push(location);
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

  showLogout() {
    this.setState({
      modal: true,
      showNav: false,
    });
  }

  confirmLogout() {
    this.toggleLogout();
    window.removeEventListener("beforeunload", stopReload, true);
    let logout_data = { logout_all: this.state.logoutAll };
    this.props.logout(logout_data);
  }

  receiveMessage(event) {
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
    } else if (event.data.action == "get_sound_setting") {
      document.querySelector("#iframe-id").contentWindow.postMessage({
        action: "sound_enabled",
        data: this.props.statusKasms.client_settings.kasm_audio_default_on
      }, "*");
      this.setState({ audio: this.props.statusKasms.client_settings.kasm_audio_default_on });
    }
  }

  componentDidMount() {
    this.props.statusKasms.share_id &&
      this.setState({ shareLink: this.props.statusKasms.share_id });

    if (this.props.disconnect) {
      this.setState({ showNav: false });
    }

    if (window.addEventListener) {
      window.addEventListener("message", this.receiveMessage, false);
    } else if (window.attachEvent) {
      window.attachEvent("message", this.receiveMessage);
    }
    this.setState({ modal: false });

    if (this.props.statusKasms && this.props.statusKasms.client_settings) {
      this.setState({
        audio: this.props.statusKasms.client_settings.kasm_audio_default_on,
      });
    }

    // Add audio for when the domain already allows audio and add event listener to re establish audio on first
    // click to resolve sync problems
    const { statusKasms } = this.props;

    if (
      statusKasms.client_settings &&
      statusKasms.client_settings.allow_kasm_audio &&
      statusKasms.client_settings.kasm_audio_default_on &&
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
    } else if (window.attachEvent) {
      window.attachEvent("message", this.receiveMessage);
    }

    window.addEventListener("blur", this.hideNavDelay);
    // Gamepad Event Listeners
    if (
      statusKasms.client_settings &&
      statusKasms.client_settings.allow_kasm_gamepad &&
      statusKasms.port_map.gamepad
    ) {
      const gamepad_url = `wss://${statusKasms.hostname}:${statusKasms.port_map.gamepad.port ? statusKasms.port_map.gamepad.port : window.location.port }/${statusKasms.port_map.gamepad.path}/`;
      this.setState({gamepad_url: gamepad_url})


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
        this.setState({gamepadInitialized: true})
    };
  }

  setConnectedGamepads(){
    let o = [];
    let g = navigator.getGamepads();
    for (const gamepad of g){
      if (gamepad != null) {
        o.push({
          id: gamepad.id,
          index: gamepad.index,
          len_buttons: gamepad.buttons.length,
          len_axes: gamepad.axes.length,
        })
      }
    }

    this.setState({connectedGamepads: o});

    if (gamepadLoop === null){
      window.addEventListener("gamepadconnected", this.onGamepadConnected);
      window.addEventListener("gamepaddisconnected", this.onGamepadDisconnected);
      gamepadLoop = setInterval(this.pollGamepad, 20);
    }
    else{
      console.log(gamepadLoop);
    }
  }

  setGamepadIndex(index){
    if (this.state.gamepadIndexToInput[index] === undefined){
      let index_to_input = this.state.gamepadIndexToInput;
      let input_to_index = this.state.gamepadInputToIndex;

      for (let i = 0; i < 4; i++) {
        if (input_to_index[i] === undefined){
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
  onGamepadConnected (e) {
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
    for (const gamepad of g){
      if (gamepad != null) {
        o.push({
          id: gamepad.id,
          index: gamepad.index,
          len_buttons: gamepad.buttons.length,
          len_axes: gamepad.axes.length,
        })
      }
    }
    this.setState({connectedGamepads: o});
    gamepadTimestamps = []
  }

  pollGamepad(){
    let g = navigator.getGamepads();
    let o = []
    for (const gamepad of g){
      if (gamepad != null) {
        if (gamepadTimestamps[gamepad.index] == undefined || gamepadTimestamps[gamepad.index] != gamepad.timestamp ){
          gamepadTimestamps[gamepad.index] = gamepad.timestamp;
          let input = [this.state.gamepadIndexToInput[gamepad.index]];
          let axes_values = []
          let button_values = []
          for (let i = 0; i < 4; i++) {
            if (gamepad.axes[i] != undefined){
              axes_values[i] = Math.floor(gamepad.axes[i] * 32767)
            }
            else{
              axes_values[i] = 0
            }
          }
          for (let i = 0; i < 17; i++) {
            if (gamepad.buttons[i] != undefined){
              button_values[i] = gamepad.buttons[i].value
            }
            else{
              button_values[i] = 0
            }
          }
          o.push(input.concat(axes_values.concat(button_values)))
        }
        else{
        }
      }
    }
    if (o.length > 0){
      if (this.gamepad_ws.readyState === WebSocket.OPEN) {
        this.gamepad_ws.send(JSON.stringify(o));
      }
    }

  }

  updateGamepadInputIndex(e){
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


  hideNavDelay() {
    renderNav = setTimeout(() => {
      if (document.activeElement instanceof HTMLIFrameElement) {
        this.hideNav();
      }
    }, 10);
  }

  componentWillUnmount() {
    audio.disable();
    clearInterval(keepAlive);
    clearTimeout(renderNav);
    window.removeEventListener("blur", this.hideNavDelay);
    window.removeEventListener("message", this.receiveMessage, false);
    this.closeGamepad();
    clearInterval(gamepadLoop);
    gamepadLoop = null;
    window.removeEventListener("gamepadconnected", this.onGamepadConnected, false);
    window.removeEventListener("gamepaddisconnected", this.onGamepadDisconnected, false);
  }

  cancelLogout() {
    this.toggleLogout();
    this.handleLeave("/");
  }

  showNav() {
    this.setState({ showNav: true });
  }

  hideNav() {
    this.setState({ showNav: false });
  }

  toggleNav() {
    this.setState({ showNav: !this.state.showNav });
  }

  toggleLogout() {
    this.setState({ modal: !this.state.modal });
  }

  toggleFullscreen() {
    const newstate = !this.props.fullscreen
    this.props.controlFullscreen(newstate)
  }

  toggle() {
    this.setState({ collapse: !this.state.collapse });
  }

  handleClose(e) {
    this.handleLeave("/");
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

  copyToClipboard(str) {
    const el = document.createElement("textarea");
    el.value = str;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
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

  closeAllModals() {
    this.setState({
      modalGamepad: false,
    });
  }

  openModal(key) {
    this.closeAllModals();
    this.setState({
      [key]: true,
    });
  }

  openGamepadModal(){
    if (this.state.gamepadInitialized === false){
      this.initializeGamepads()
    }
    this.openModal("modalGamepad")
  }

  canFullScreen() {
    const element = document.createElement('div')
    if (!!element.requestFullscreen || !!element.mozRequestFullScreen || !!element.webkitRequestFullscreen || !!element.msRequestFullscreen) {
      return true
    }
    return false
  }


  showViewPanel(){
    const { statusKasms } = this.props;
    return (statusKasms.client_settings.allow_kasm_audio ||
            statusKasms.client_settings.allow_kasm_gamepad ||
            statusKasms.client_settings["control_panel.show_return_to_workspaces"] ||
            statusKasms.client_settings["control_panel.show_logout"] ||
            statusKasms.client_settings["control_panel.show_delete_session"]
    )
  }

  render() {
    const { statusKasms, t } = this.props;
    const { connectedGamepads } = this.state
    const userInfo = JSON.parse(window.localStorage.user_info);
    const navOverride = this.props.hideViewPanel && !this.showViewPanel() ? { display: "None" } : {};

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
    return (
      <div>
        <canvas id="video-canvas" />
        {this.showViewPanel() && !this.state.showNav && (
        <FontAwesomeIcon
          icon={faAngleRight}
          id="nav_toggle"
          className="toggle_icon"
          onClick={this.showNav}
          aria-hidden="true"
          style={navOverride}
        />
        )}
        {statusKasms && (
          <div
            id="mySidenav"
            className={
              this.state.showNav && !this.props.hideViewPanel && this.showViewPanel()
                ? "sidenavnew show_nav"
                : "sidenavnew hide_nav"
            }
          >
              <div className="tw-flex tw-justify-between tw-mb-3">
              <span className="tw-text-xl tw-font-bold">Control Panel</span>
              <button
                className="tw-bg-transparent"
                onClick={() => {
                  this.setState({
                    showNav: !this.state.showNav,
                  });
                }}
              >
                <FontAwesomeIcon className="tw-text-xl" icon={faXmark} />
              </button>

            </div>

            <div className="sidebar-icons-list">

              {statusKasms.client_settings.allow_kasm_audio == true && statusKasms.port_map.audio && (
              <ControlButton 
                icon={<FontAwesomeIcon size="lg" icon={faVolume} />}
                disabledIcon={<FontAwesomeIcon size="lg" icon={faVolumeSlash} />}
                disabled={!this.state.audio}
                onClick={() => this.handleAudioChange(!this.state.audio)}
                type="toggle"
                title={t("control_panel.sound")}
                description={this.state.audio ? t("control_panel.Sound Enabled") : t("control_panel.Sound Disabled")}
              />
              
              )}
              {this.canFullScreen() && statusKasms.client_settings["control_panel.show_fullscreen"] === true && (
                  <ControlButton 
                    icon={<FontAwesomeIcon size="lg" icon={faMinimize} />}
                    disabledIcon={<FontAwesomeIcon size="lg" icon={faExpand} />}
                    disabled={!this.props.fullscreen}
                    onClick={() => this.toggleFullscreen()}
                    type="toggle"
                    title={t("control_panel.Fullscreen")}
                    description={this.props.fullscreen ? t("control_panel.exit-fullscreen") : t("control_panel.enter-fullscreen")}
                  />
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
                      <button
                        className="cross"
                        onClick={() => {
                          this.setState({
                            modalGamepad: false,
                          });
                        }}
                      >
                        <img src={cross} alt="cross" />
                      </button>
                      <div className="streamingwithicon">
                        <img src={gamepad} alt="gamepad" />
                        <h5>{t("control_panel.Gamepads")}</h5>
                      </div>
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
            </div>
          </div>
        )}
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

      </div>
    );
  }
}

ViewPanel.propTypes = {
  logout: Proptypes.func.isRequired,
  statusKasms: Proptypes.object,
  history: Proptypes.object,
  kasmId: Proptypes.func,
  videoQuality: Proptypes.number,
  setVideoQuality: Proptypes.func,
  handleDisconnect: Proptypes.func,
  hideViewPanel: Proptypes.bool,
  controlFullscreen: Proptypes.func,
  fullscreen: Proptypes.bool,
};

ViewPanel = withRouter(ViewPanel); // eslint-disable-line

const ViewPanelTranslated = withTranslation('common')(ViewPanel)

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
)(ViewPanelTranslated);
