import React, { Component } from "react";
import { Row, Col } from "reactstrap";
import { connect } from "react-redux";
import {
  destroyKasms,
  getUserKasms,
  getStatusKasms,
  updateKeepalive,
  getUserImages,
} from "../../actions/actionDashboard";
import { logout } from "../../actions/actionLogin";
import { NotificationManager } from "react-notifications";
import IframeComponent from "../../components/IframeComponent/component";
import GenericModal from "../../components/GenericModal/GenericModal";
import ControlPanel from "../../components/ControlPanel/ControlPanel";
import Proptypes from "prop-types";
import "react-select/dist/react-select.css";
import {
  getUserAttributes,
  updateUserAttribute,
} from "../../actions/actionUser";
import ShareBanner from "../../components/ShareBanner";
import ChatComponent from "../../components/Chat";
import SmallChat from "../../components/Chat/SmallChat";
import message_audio from "../../../assets/audio/message_recieved.mp3";
import join_audio from "../../../assets/audio/member_joined.mp3";
import queryString from "query-string";
import stopReload from "../../constants/Constants";
import Countdown from "react-countdown";
import moment from "moment";
import {withTranslation} from "react-i18next";
import { StatusTracker } from "../../components/StatusTracker/StatusTracker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash } from "@fortawesome/free-solid-svg-icons/faEyeSlash";
import { faCircle } from "@fortawesome/free-solid-svg-icons/faCircle";
import { faComments } from "@fortawesome/free-solid-svg-icons/faComments";
import { faArrowsMaximize } from "@fortawesome/free-solid-svg-icons/faArrowsMaximize";
import { faArrowsMinimize } from "@fortawesome/free-solid-svg-icons/faArrowsMinimize";

var timeouts = [];
let run = true
var ping;

var message_recieved_audio = new Audio(message_audio);
var member_joined_audio = new Audio(join_audio);

const renderer = ({ days, hours, minutes, seconds, completed }) => {
  if (completed) {
    // Render a complete state
    return "";
  } else {
    let padded_days = ("0" + days).slice(-2);
    let padded_hours = ("0" + hours).slice(-2);
    let padded_minutes = ("0" + minutes).slice(-2);
    let padded_seconds = ("0" + seconds).slice(-2);

    return (
      <span>
        {days ? padded_days + ":" : ""}
        {hours || days ? padded_hours + ":" : ""}
        {days || hours || minutes || seconds ? padded_minutes + ":" : ""}
        {padded_seconds}
      </span>
    );
  }
};

class Kasm extends Component {
  constructor(props) {
    super(props);

    const previousSessions = JSON.parse(localStorage.getItem("connected_sessions") || "{}");
    const hasConnectedToSessionBefore = !!previousSessions[this.props.match.params.id];
    previousSessions[this.props.match.params.id] = Date.now();
    localStorage.setItem("connected_sessions", JSON.stringify(previousSessions));

    this.state = {
      hasConnectedToSessionBefore,
      videoQuality: Number(window.localStorage.getItem("kasm_video_quality") || 2),
      resize: window.localStorage.getItem("kasm_resize_mode") || "remote",
      kasmId: "",
      currentId: null,
      url: "",
      loader: false,
      attempt: 0,
      pointPresenceValues: [],
      persistentProfileValues: [],
      showTips: false,
      toggleControlPanel: false,
      chatSFX: false,
      createClicked: false,
      createResumeClicked: false,
      disconnect: false,
      sharing: false,
      fullscreen: false,
      chat: true,
      banner: true,
      smallchat: false,
      bigChat: true,
      messages: [],
      members: [],
      width: 0,
      height: 0,
      mobile: false,
      audio: true,
      destroyClicked: false,
      disableChat: false,
      disableControlPanel: false,
      disableTips: false,
      disableFixedRes: false,
      connected: false,
      timeOffset: null,
      session_time_limit_visible: true,
    };

    this.handleResumeKasm = this.handleResumeKasm.bind(this);
    this.stateFunctionUrl = this.stateFunctionUrl.bind(this);
    this.setVideoQualityStyle = this.setVideoQualityStyle.bind(this);
    this.setVideoQuality = this.setVideoQuality.bind(this);
    this.handleDisconnect = this.handleDisconnect.bind(this);
    this.provisionKasm = this.provisionKasm.bind(this);
    this.checkLiveKasms = this.checkLiveKasms.bind(this);
    this.toggleLoader = this.toggleLoader.bind(this);
    this.shareEnabled = this.shareEnabled.bind(this);
    this.controlFullscreen = this.controlFullscreen.bind(this);
    this.fullscreen = this.fullscreen.bind(this);
    this.exitFullscreen = this.exitFullscreen.bind(this);
    this.toggleChat = this.toggleChat.bind(this);
    this.setFullscreen = this.setFullscreen.bind(this);
    this.toggleBanner = this.toggleBanner.bind(this);
    this.connectSocket = this.connectSocket.bind(this);
    this.updateDimensions = this.updateDimensions.bind(this);
    this.toggleSmallChat = this.toggleSmallChat.bind(this);
    this.toggleBigChat = this.toggleBigChat.bind(this);
    this.toggleChatWindow = this.toggleChatWindow.bind(this);
    this.toggleAudio = this.toggleAudio.bind(this);
    this.receiveMessage = this.receiveMessage.bind(this);
    this.handleLeave = this.handleLeave.bind(this);
    this.onCountdownStop = this.onCountdownStop.bind(this);
    this.customNow = this.customNow.bind(this);
    this.setResize = this.setResize.bind(this);
    this.setForcedResolution = this.setForcedResolution.bind(this);
    this.setFrameRate = this.setFrameRate.bind(this);
    this.setPerfStats = this.setPerfStats.bind(this);
  }

  onCountdownStop() {
    this.handleLeave("/");
  }

  handleLeave(location) {
    window.removeEventListener("beforeunload", stopReload, true);
    console.trace("Navigating browser to " + location);
    this.props.history.push(location);
  }

  controlFullscreen(bool) {
    if (bool) {
      this.fullscreen();
    } else {
      this.exitFullscreen();
    }
  }

  shareEnabled(bool) {
    this.props.getStatusKasms(this.state.kasmId).then(() => {
      const { statusKasms } = this.props;
      const { videoQuality, toggleControlPanel, resize } = this.state;
      let url, kasm_url;
      const permissions = `autoplay; clipboard-read; clipboard-write; self; https://${statusKasms.hostname}:${statusKasms.port_map.vnc.port ? statusKasms.port_map.vnc.port : window.location.port}`;
      if (bool) {
        this.connectSocket();
        // Set Iframe up for sharing mode...take away resize and positioning
        kasm_url = `https://${statusKasms.hostname}:${statusKasms.port_map.vnc.port ? statusKasms.port_map.vnc.port : window.location.port}/${statusKasms.port_map.vnc.path}/vnc.html?video_quality=${videoQuality}&enable_webp=${statusKasms.client_settings.enable_webp}&idle_disconnect=${statusKasms.client_settings.idle_disconnect}&password=${statusKasms.token}&autoconnect=1&path=${statusKasms.port_map.vnc.path}/websockify&cursor=true&resize=${resize}&clipboard_up=${statusKasms.client_settings.allow_kasm_clipboard_up}&clipboard_down=${statusKasms.client_settings.allow_kasm_clipboard_down}&clipboard_seamless=${statusKasms.client_settings.allow_kasm_clipboard_seamless}&toggle_control_panel=${toggleControlPanel}`;
        url = `<iframe src = ${kasm_url} id='iframe-id'; style="width:100%; height:100%; border:none; margin:0; padding:0; overflow:hidden; z-index:999998;" allow="${permissions}"></iframe>`;
      } else {
        this.connection && this.connection.close();
        this.setState({
          messages: [],
          members: [],
        });
        this.connection = null;
        // Reset Iframe to standard mode
        kasm_url = `https://${statusKasms.hostname}:${statusKasms.port_map.vnc.port ? statusKasms.port_map.vnc.port : window.location.port}/${statusKasms.port_map.vnc.path}/vnc.html?video_quality=${videoQuality}&enable_webp=${statusKasms.client_settings.enable_webp}&idle_disconnect=${statusKasms.client_settings.idle_disconnect}&password=${statusKasms.token}&autoconnect=1&path=${statusKasms.port_map.vnc.path}/websockify&resize=${resize}&cursor=true&clipboard_up=${statusKasms.client_settings.allow_kasm_clipboard_up}&clipboard_down=${statusKasms.client_settings.allow_kasm_clipboard_down}&clipboard_seamless=${statusKasms.client_settings.allow_kasm_clipboard_seamless}&shared=false&toggle_control_panel=${toggleControlPanel}`;
        url = `<iframe src = ${kasm_url} id='iframe-id'; style="position:fixed; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%; border:none; margin:0; padding:0; overflow:hidden; z-index:999999;" allow="${permissions}"></iframe>`;
      }
      this.setState({
        sharing: bool,
        url: url,
      });
    });
  }

  toggleLoader() {
    this.setState({
      loader: !this.state.loader,
      destroyClicked: true,
      connected: false,
    });
  }

  stateFunctionUrl() {
    this.setState({ url: "" });
  }

  handleDisconnect() {
    this.stateFunctionUrl();
    this.setState({
      attempt: 0,
      showTips: false,
      disconnect: true,
    });
    this.delay_check_load();
  }

  handleResumeKasm(kasm_id) {
    this.setState({ kasmId: kasm_id, createResumeClicked: true });
    this.props
      .getStatusKasms(kasm_id)
      .then(() => this.handleStartKasm())
      .catch(() => {
        this.handleLeave("/");
      });
  }

  async setVideoQualityStyle(styleValue) {
    const { statusKasms } = this.props;
    let videoStyle = {
      style: styleValue > 0 ? "highbandwidth" : "lowbandwidth",
    };
    if (this.props.statusKasms.port_map.uploads){
      const url = `https://${statusKasms.hostname}:${this.props.statusKasms.port_map.uploads.port ? this.props.statusKasms.port_map.uploads.port : window.location.port}/${statusKasms.port_map.uploads.path}/style/`;
      await fetch(url, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
        credentials: "include",
        body: JSON.stringify(videoStyle),
      });
    }

  }

  async setVideoQuality(quality, frameRate) {
    window.localStorage.setItem("kasm_video_quality", quality)
    window.localStorage.setItem("kasm_frame_rate", frameRate);

    this.setVideoQualityStyle(quality);
    this.setState({ videoQuality: quality });

    document.getElementById("iframe-id") && document.getElementById("iframe-id").contentWindow.postMessage({
      action: "setvideoquality",
      qualityLevel: quality,
      frameRate: frameRate
    }, "*");
  }

  async setResize(value) {
    window.localStorage.setItem("kasm_resize_mode", value);

    document.getElementById("iframe-id").contentWindow.postMessage({
      action: "resize",
      value
    }, "*");
  }

  async setForcedResolution(width, height) {
    window.localStorage.setItem("kasm_forced_resolution_width", width);
    window.localStorage.setItem("kasm_forced_resolution_height", height);

    document.getElementById("iframe-id").contentWindow.postMessage({
      action: "set_resolution",
      value_x: width,
      value_y: height
    }, "*");
  }

  async setFrameRate(value) {
    window.localStorage.setItem("kasm_frame_rate", value)

    document.getElementById("iframe-id").contentWindow.postMessage({
      action: "setvideoquality",
      qualityLevel: this.state.videoQuality,
      frameRate: value
    }, "*");
  }

  async setPerfStats(value) {
    window.localStorage.setItem("kasm_enable_perf_stats", value);

    document.getElementById("iframe-id").contentWindow.postMessage({
      action: "set_perf_stats",
      value
    }, "*");
  }

  async setHiDPI(value) {
    window.localStorage.setItem("enable_hidpi", value);

    document.getElementById("iframe-id").contentWindow.postMessage({
      action: "enable_hidpi",
      value
    }, "*");
  }

  delay_check_load() {
    const { statusKasms, t } = this.props;

    if (!localStorage.getItem("ime_mode")) {
      const mode = statusKasms.client_settings.kasm_ime_mode_default_on;
      localStorage.setItem("ime_mode", mode ? "on" : "off");
    }

    const { videoQuality, toggleControlPanel, resize} = this.state;
    let self = this;
    const count = this.state.attempt + 1;
    const timeout = 200 * count;
    this.setState({
      loader: true,
      attempt: count,
    });
    timeouts.push(
      setTimeout(function () {
        if (count < 10) {
          let kasm_url = `https://${statusKasms.hostname}:${statusKasms.port_map.vnc.port ? statusKasms.port_map.vnc.port : window.location.port}/${statusKasms.port_map.vnc.path}/vnc.html?video_quality=${videoQuality}&enable_webp=${statusKasms.client_settings.enable_webp}&idle_disconnect=${statusKasms.client_settings.idle_disconnect}&password=${statusKasms.token}&autoconnect=1&path=${statusKasms.port_map.vnc.path}/websockify&cursor=true&resize=${resize}&clipboard_up=${statusKasms.client_settings.allow_kasm_clipboard_up}&clipboard_down=${statusKasms.client_settings.allow_kasm_clipboard_down}&clipboard_seamless=${statusKasms.client_settings.allow_kasm_clipboard_seamless}&toggle_control_panel=${toggleControlPanel}`;
          fetch(kasm_url, { method: "GET", credentials: "include" })
            .then(function (response) {
              // We defer all error showing for RDP connections to the container
              // so we need to show the frame regardless of the response status
              const isRDPConnection = response.headers.get("X-Connection-Type") === "rdp";

              if (response.status == 200 || isRDPConnection) {
                const permissions = `autoplay; clipboard-read; clipboard-write; self; https://${statusKasms.hostname}:${statusKasms.port_map.vnc.port ? statusKasms.port_map.vnc.port : window.location.port}`;
                const url = `<iframe src = ${kasm_url} id='iframe-id'; style="position:fixed; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%; border:none; margin:0; padding:0; overflow:hidden; z-index:999999;" allow="${permissions}"></iframe>`;
                self.setState({
                  url,
                  loader: false,
                });
                return true;
              }
              if (response.status == 403) {
                //This happens when kasm auth rejects the call to create a kasm
                //We should warn the user and tell them it may be from deleted cookie and to re login
                NotificationManager.error(
                  t('auth.if-problem-persists-try-loggin-0'),
                  t('auth.unauthorized-session-access'),
                  3000
                );
                //Notification did not persist through redirection. Set timeout for user to be able to read notification
                timeouts.push(
                  setTimeout(function () {
                    window.location.href = "/";
                  }, 3000)
                );
              } else {
                timeouts.push(
                  setTimeout(function () {
                    self.delay_check_load();
                  }, timeout)
                );
              }
            })
            .catch(() => {
              timeouts.push(
                setTimeout(function () {
                  self.delay_check_load();
                }, timeout)
              );
            });
        } else {
          self.setState({
            loader: false,
            attempt: 0,
          });
          NotificationManager.error(
            t('workspaces.create-resume-session-error'),
            t('workspaces.connection-failed-trying-again'),
            3000
          );
          console.trace("Navigating browser to /");
          window.location.href = "/";
        }
      }, timeout)
    );
  }

  handleStartKasm() {
    const { errorStatusKasmsMessage, kasmStarting, match, t, progress, operationalMessage } = this.props;
    this.setState({ createClicked: false, createResumeClicked: false });
    if (kasmStarting && run) {
      timeouts.push(
      setTimeout(async() => {
        await this.props.getStatusKasms(this.state.kasmID);
        this.handleStartKasm();
      }, 3000)
      )
    } else { 
      if (errorStatusKasmsMessage) {
        this.handleLeave("/");
        NotificationManager.error(errorStatusKasmsMessage, t('workspaces.session-status'), 3000);
      } else {
        const { statusKasms } = this.props;
        if (statusKasms && statusKasms.operational_status === "running") {
          if (statusKasms.share_id && !this.state.disableFixedRes) {
            this.setState({ videoQuality: 0 });
          }
          this.delay_check_load();
        }
      }
    }
  }

  setFullscreen() {
    if (document.fullscreenElement) {
      this.setState({ fullscreen: true });
    } else {
      this.setState({ fullscreen: false });
    }
  }

  componentWillUnmount() {
    document.removeEventListener("fullscreenchange", this.setFullscreen);
    document.removeEventListener("MSFullscreenChange", this.setFullscreen);
    window.removeEventListener("resize", this.updateDimensions);
    window.removeEventListener("message", this.receiveMessage, false);
    window.removeEventListener("connection_state", this.receiveMessage, false);

    run = false

    for (let x in timeouts) {
      window.clearTimeout(x);
    }
    timeouts = [];

    this.connection && this.connection.close();
    clearInterval(ping);
  }

  UNSAFE_componentWillMount() {
    this.updateDimensions();
  }

  componentDidMount() {
    const values = queryString.parse(this.props.location.search);

    run = true

    if (values.disable_chat && values.disable_chat === "1") {
      this.setState({ disableChat: true });
    }
    if (values.disable_control_panel && values.disable_control_panel === "1") {
      this.setState({ disableControlPanel: true });
    }
    // Commented out tips for now, but tips may be re-enabled in the future, if they are
    // the state tips should be set to true by default
    /*if (values.disable_tips && values.disable_tips === "1") {
      this.setState({ disableTips: true, showTips: false });
    }*/
    if (values.disable_fixed_res && values.disable_fixed_res === "1") {
      this.setState({ disableFixedRes: true });
    }

    const { userattributes, t } = this.props;

    if (this.props.match.params.id) {
      document.addEventListener("fullscreenchange", this.setFullscreen);
      document.addEventListener("MSFullscreenChange", this.setFullscreen);
      window.addEventListener("resize", this.updateDimensions);

      if (window.addEventListener) {
        window.addEventListener("message", this.receiveMessage, false);
        window.addEventListener("connection_state", this.receiveMessage, false);
      } else if (window.attachEvent) {
        window.attachEvent("message", this.receiveMessage);
      }

      let kasm_id = this.props.match.params.id;

      // check for user settings
      this.props.getUserAttributes().then(() => {
        
        if (userattributes && userattributes.show_tips === false) {
          this.setState({
            showTips: false,
          });
        }
        this.setState({
          toggleControlPanel:
            userattributes && userattributes.toggle_control_panel === undefined
              ? true
              : userattributes && userattributes.toggle_control_panel,
          chatSFX:
            userattributes && userattributes.chat_sfx === undefined
              ? true
              : userattributes && userattributes.chat_sfx,
        });
      });

      this.props
        .getUserKasms()
        .then(() => {
          this.checkLiveKasms(kasm_id);
        })
        .catch(() => {
          this.handleLeave("/");
          NotificationManager.error(
            t('workspaces.failure-to-get-live-sessions'),
            t('workspaces.session-status-0'),
            3000
          );
        });
    } else {
      this.handleLeave("/");
      NotificationManager.error(
        t('workspaces.no-kasm-id'),
        t('workspaces.session-status'),
        t('workspaces.session-status-0'),
        3000
      );
    }
  }

  receiveMessage(event) {
    if (event.data) {
      if (event.data.action === "monarch-pointermove") {
        // Catching messages from vnc iframe and sending up to Monarch app
        const eventData = event.data.value;
        eventData.kasmId = this.props.match.params.id;
        window.parent.postMessage(eventData, "*");
      } else if (event.data.action === "disconnectrx") {
        const eventData = {
          type: "disconnectrx",
          kasmId: this.props.match.params.id,
          value: event.data.value,
        };
        window.parent.postMessage(eventData, "*");
      } else if (event.data.action === "idle_session_timeout") {
        const eventData = {
          type: "idle_session_timeout",
          kasmId: this.props.match.params.id,
        };
        window.parent.postMessage(eventData, "*");
      } else if (event.data.action === "connection_state") {
        let connection_state = event.data.value;
        if (connection_state === "connected") {
          this.setState({
            connected: true,
          });
        } else {
          this.setState({
            connected: false,
          });
        }
        const eventData = {
          type: "connection_state",
          kasmId: this.props.match.params.id,
          value: event.data.value,
        };
        window.parent.postMessage(eventData, "*");
      } else if (event.data.action === "noVNC_initialized") {
        window.IS_USING_GUAC = event.data.value && event.data.value.isUsingGuac;

        const mode = window.localStorage.getItem("default_keyboard_controls_mode") || "auto";

        const isTouchDevice = (
          ("ontouchstart" in window) ||
          (navigator.maxTouchPoints > 0) ||
          (navigator.msMaxTouchPoints > 0)
        );
        const IS_WINDOWS = navigator && !!(/win/i).exec(navigator.platform);

        if (mode === "on" || (mode === "auto" && !IS_WINDOWS && isTouchDevice)) {
          document.querySelector("#iframe-id").contentWindow.postMessage({
            action: "show_keyboard_controls"
          }, "*");
        }

        const imeMode = window.localStorage.getItem("ime_mode") || "on";
        if (imeMode === "on") {
            document.querySelector("#iframe-id").contentWindow.postMessage({
                action: "enable_ime_mode"
            }, "*");
        }
      }
    }
  }

  updateDimensions() {
    if (window.innerWidth < 891) {
      this.setState({ mobile: true });
    } else {
      this.setState({ mobile: false });
    }
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  checkLiveKasms(kasm_id) {
    const { liveKasms, t } = this.props;
    let found = false;
    for (var kasm in liveKasms) {
      if (liveKasms[kasm].kasm_id.substring(0, 6) === kasm_id.substring(0, 6)) {
        found = true;
      }
    }

    if (found) {
      this.setState({ kasmID: kasm_id });
      this.provisionKasm();
    } else {
      this.handleLeave("/");
      NotificationManager.error(t('workspaces.unauthorized-session'), t('workspaces.session-status-0'), 3000);
    }
  }

  provisionKasm() {
    const { t } = this.props;
    for (let k in this.props.liveKasms) {
      if (
        this.props.liveKasms[k].kasm_id.substring(0, 6) ===
        this.state.kasmID.substring(0, 6)
      ) {
        this.handleResumeKasm(this.props.liveKasms[k].kasm_id);
        return;
      }
    }

    this.props
      .getStatusKasms(this.state.kasmID)
      .then(() => this.handleStartKasm())
      .catch(() => {
        this.handleLeave("/");
        NotificationManager.error(
          t('workspaces.get-session-status-failed'),
          t('workspaces.session-status-0'),
          3000
        );
      });
  }

  connectSocket() {
    if (!this.connection) {
      const userInfo = JSON.parse(window.localStorage.user_info);
      this.connection = new WebSocket(
        `wss://${window.location.host}/api/share/chat?share_id=${this.props.statusKasms.share_id}&username=${userInfo.username}&token=${userInfo.token}`
      );

      this.connection.onopen = (evt) => {
        let msg = {
          members: true,
        };
        this.connection.send(JSON.stringify(msg));
      };

      this.connection.onmessage = (evt) => {
        // add the new message to state
        let arr = JSON.parse(evt.data);
        if (arr["members"]) {
          this.setState({
            members: arr["members"],
          });
        }
        if (arr["history"]) {
          for (let i = 0; i < arr["history"].length; i++) {
            let m_json = JSON.parse(arr["history"][i]);
            if ("body" in m_json) {
              this.setState({
                messages: this.state.messages.concat({
                  chat: m_json["body"]["message"],
                  username: m_json["body"]["username"],
                }),
              });
            }
          }
        }
        if (arr["body"]) {
          this.setState({
            messages: this.state.messages.concat({
              chat: arr["body"]["message"],
              username: arr["body"]["username"],
            }),
          });
          if (this.state.audio && this.state.chatSFX) {
            if (arr["body"]["username"] !== "") {
              message_recieved_audio.play();
            } else {
              member_joined_audio.play();
            }
          }
        }
      };

      ping = setInterval(() => {
        if (this.connection && this.connection.readyState === WebSocket.OPEN) {
          this.connection.send("ping");
        }
      }, 25000);
    }
  }

  send(msg) {
    this.connection.send(msg);
  }

  fullscreen() {
    this.setState({ fullscreen: true }, () => {
      let element = document.getElementById("full-screen");
      if (element.requestFullscreen) element.requestFullscreen();
      else if (element.mozRequestFullScreen) element.mozRequestFullScreen();
      else if (element.webkitRequestFullscreen)
        element.webkitRequestFullscreen();
      else if (element.msRequestFullscreen) element.msRequestFullscreen();
    });
    navigator.keyboard.lock(["Escape"]);
  }

  exitFullscreen() {
    if (document.exitFullscreen) document.exitFullscreen();
    else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    else if (document.msExitFullscreen) document.msExitFullscreen();
    this.setState({ fullscreen: false });
    navigator.keyboard.unlock(["Escape"]);
  }

  toggleChat() {
    this.setState({
      smallchat: this.state.chat,
      chat: !this.state.chat,
    });
  }

  toggleBanner() {
    this.setState({
      banner: !this.state.banner,
    });
  }

  toggleSmallChat() {
    this.setState({ smallchat: !this.state.smallchat });
  }

  toggleBigChat() {
    this.setState({ bigChat: !this.state.bigChat });
  }

  toggleChatWindow() {
    if (this.state.chat) {
      if (this.state.mobile) {
        this.setState({ smallchat: !this.state.smallchat });
      } else this.setState({ bigChat: !this.state.bigChat });
    } else {
      this.setState({ smallchat: !this.state.smallchat });
    }
  }

  toggleAudio() {
    this.setState({ audio: !this.state.audio });
  }

  customNow() {
    if (this.state.timeOffset != null) {
      return Date.now() - this.state.timeOffset;
    } else {
      if (this.props.currentTime) {
        let offset =
          Date.now() - moment.utc(this.props.currentTime).local().toDate();
        this.setState({ timeOffset: offset });
        return moment.utc(this.props.currentTime).local().toDate();
      } else {
        return Date.now();
      }
    }
  }

  render() {
    const { t, statusKasms, liveKasms } = this.props;
    let kasm = statusKasms
    if (this.props.kasmStarting) {
      kasm = liveKasms.find(k => k.kasm_id === this.state.kasmId)
    }
    const userInfo = JSON.parse(window.localStorage.user_info);
    const chatContainerOverride = this.state.disableChat
      ? { height: "100%" }
      : {};
    let loadingSessionText = window.localStorage.getItem(
      "loading_session_text"
    );
    let destroyingSessionText = window.localStorage.getItem(
      "destroying_session_text"
    );
    let header_logo = window.localStorage.getItem("header_logo");
    let image_session_time_limit =
      kasm && kasm.image.session_time_limit;
    let user_session_time_limit =
      kasm &&
      kasm.client_settings.session_time_limit;
    let image_logo =
      kasm && kasm.image && kasm.image.image_src
        ? kasm.image.image_src
        : "img/favicon.png";
    let image_friendly_name =
      kasm && kasm.image
        ? kasm.image.friendly_name
        : "";
    let session_time_limit = false;
    if (user_session_time_limit) {
      if (image_session_time_limit === null) {
        session_time_limit = true;
      }
    }
    if (image_session_time_limit) {
      session_time_limit = true;
    }

    const bgImage = () => {
      let launcher_background_url = window.localStorage.getItem("launcher_background_url");
      let bgimage = '/img/backgrounds/background1.jpg'
      if (launcher_background_url && launcher_background_url !== 'undefined') {
        bgimage = launcher_background_url
      }
  
      return bgimage;
    }
  
    return (
      <div>
        {this.state.url && !this.state.loader && (
          <div id="full-screen">
            {this.state.sharing ? (
              <div className="kasm-parent">
                {this.state.banner &&
                  !this.state.fullscreen &&
                  !this.state.mobile &&
                  !this.state.disableChat && (
                    <ShareBanner
                      statusKasms={kasm}
                      toggleBanner={this.toggleBanner}
                    />
                  )}
                <div
                  className="kasm-chat-container"
                  style={chatContainerOverride}
                >
                  <div id="vertical" className="vertical">
                    {session_time_limit && this.state.session_time_limit_visible ? (
                      <div className="countdown countdown-absolute">
                        <Countdown
                          date={moment
                            .utc(kasm.expiration_date)
                            .local()
                            .toDate()}
                          onComplete={this.onCountdownStop}
                          renderer={renderer}
                          now={this.customNow}
                        />
                        <div onClick={() => this.setState({ session_time_limit_visible: false })} className="tw-absolute tw-right-0 tw-bottom-0 tw-top-0 tw-flex tw-items-center tw-px-5 tw-text-base"><FontAwesomeIcon className="tw-pointer-events-auto" icon={faEyeSlash} /></div>
                      </div>
                    ) : (
                      ""
                    )}
                    <IframeComponent iframe={this.state.url} />
                  </div>
                  {this.state.chat &&
                    !this.state.mobile &&
                    !this.state.disableChat && (
                      <React.Fragment>
                        {this.state.bigChat && (
                          <ChatComponent
                            share_id={kasm.share_id}
                            owner_username={userInfo.username}
                            username={userInfo.username}
                            toggleChat={this.toggleChat}
                            messages={this.state.messages}
                            members={this.state.members}
                            send={(msg) => this.send(msg)}
                            toggleBigChat={this.toggleBigChat}
                            toggleAudio={this.toggleAudio}
                            audio={this.state.audio}
                          />
                        )}
                      </React.Fragment>
                    )}
                </div>
                <div className="homebar">
                  <span className="homebar-id">
                    ID : {kasm.share_id}
                  </span>
                  <span className="float-right">
                    {this.state.fullscreen ? (
                      <a
                        id="fullscreen-link"
                        className="btn"
                        onClick={this.exitFullscreen}
                      >
                        <FontAwesomeIcon icon={faArrowsMinimize} />
                      </a>
                    ) : (
                      <a
                        id="fullscreen-link"
                        className="btn"
                        onClick={this.fullscreen}
                      >
                        <FontAwesomeIcon icon={faArrowsMaximize} />
                      </a>
                    )}
                  </span>
                  <span className="float-right">
                    <button
                      id="fullscreen-link"
                      className="btn btn-dark"
                      onClick={this.toggleChatWindow}
                    >
                      <FontAwesomeIcon icon={faComments} />
                    </button>
                    {/*show on toggle and fullscreen or mobile*/}
                    {(!this.state.chat || this.state.mobile) && (
                      <React.Fragment>
                        {this.state.smallchat && (
                          <SmallChat
                            share_id={kasm.share_id}
                            owner_username={userInfo.username}
                            username={userInfo.username}
                            toggleChat={this.toggleChat}
                            messages={this.state.messages}
                            members={this.state.members}
                            send={(msg) => this.send(msg)}
                            allowToggle={this.state.mobile}
                            toggleSmallChat={this.toggleSmallChat}
                            toggleAudio={this.toggleAudio}
                            audio={this.state.audio}
                          />
                        )}
                      </React.Fragment>
                    )}
                  </span>
                  <span className="float-right">
                    <FontAwesomeIcon icon={faCircle} className="text-danger recording tw-mr-2" />
                    <span className="recording-live tw-uppercase">&nbsp; {t('workspaces.live')} </span>
                  </span>
                </div>
              </div>
            ) : (
              <div id="vertical" className="vertical">
                {session_time_limit && this.state.session_time_limit_visible ? (
                  <div className="countdown countdown-fixed">
                    <Countdown
                      date={moment
                        .utc(kasm.expiration_date)
                        .local()
                        .toDate()}
                      onComplete={this.onCountdownStop}
                      renderer={renderer}
                      now={this.customNow}
                    />
                    <div onClick={() => this.setState({ session_time_limit_visible: false })} className="tw-absolute tw-right-0 tw-bottom-0 tw-top-0 tw-flex tw-items-center tw-px-5 tw-text-base"><FontAwesomeIcon className="tw-pointer-events-auto" icon={faEyeSlash} /></div>
                  </div>
                ) : (
                  ""
                )}
                <IframeComponent iframe={this.state.url} />
              </div>
            )}

            {this.state.fullscreen && <div id="headlessui-portal-root">
              {/* Important that a div is inside the portal root */}
              <div />
            </div>}

            {this.state.showTips ? <GenericModal /> : ""}
            <ControlPanel
              showOnStart={!this.state.hasConnectedToSessionBefore}
              videoQuality={this.state.videoQuality}
              setVideoQuality={this.setVideoQuality}
              setResize={this.setResize}
              setForcedResolution={this.setForcedResolution}
              setFrameRate={this.setFrameRate}
              setPerfStats={this.setPerfStats}
              setHiDPI={this.setHiDPI}
              handleDisconnect={this.handleDisconnect}
              disconnect={this.state.disconnect}
              logout={this.props.logout}
              destroyKasms={this.props.destroyKasms}
              updateKeepalive={this.props.updateKeepalive}
              kasmId={this.state.kasm_id}
              statusKasms={kasm}
              show_tips={this.props.userattributes.show_tips}
              toggle_control_panel={this.state.toggleControlPanel}
              stateFunctionUrl={this.stateFunctionUrl}
              toggleLoader={this.toggleLoader}
              shareEnabled={this.shareEnabled}
              controlFullscreen={this.controlFullscreen}
              fullscreen={this.state.fullscreen}
              sharing={this.state.sharing}
              hideControlPanel={this.state.disableControlPanel}
              disableFixedRes={this.state.disableFixedRes}
            />
          </div>
        )}
        {this.state.connected ? (
          ""
        ) : (
          <div className="kasm_background max_z">
            <div
              className="kasm_background max_z background_fade panelbackground"
              style={{ backgroundImage: 'url("' + bgImage() + '")' }}
            >
              {this.props.kasmStarting || kasm &&
              kasm.kasm_id ===
                this.props.match.params.id.split("-").join("") ? (
                
                  <div className={'tw-w-[360px] tw-h-[360px] tw-min-h-[360px] tw-shadow-[inset_0_0_15px_rgba(0,0,0,0.8),_0_0_5px_rgba(0,0,0,0.5)] tw-rounded-full tw-backdrop-blur tw-relative green-stroke tw-flex tw-justify-center tw-items-center'}>
          <StatusTracker value={kasm && kasm.kasm_id && this.props.progress[kasm.kasm_id]} />
            <div className="tw-relative tw-z-20 tw-scale-90">
            <Row>
                <Col>
                  {this.state.destroyClicked ? (
                    <div className="kasm_connect_title tw-flex tw-flex-col">
                      <span className="tw-text-base">{t('workspaces.deleting')}</span>{image_friendly_name}
                    </div>
                  ) : (
                    <div className="kasm_connect_title tw-flex tw-flex-col">
                      <span className="tw-text-base">{t('workspaces.loading-0')}</span>{image_friendly_name}
                    </div>
                  )}
                </Col>
              </Row>
              <Row>
                <Col>
                  <div className="logo-center">
                      <img
                        onError={(e) => { e.target.src = "img/favicon.png" }}
                        src={image_logo}
                        alt="logo"
                        style={{ height: "150px" }}
                      />
                  </div>
                </Col>
              </Row>
              <Row>
                <Col>
                  <div className="kasm_connect_message tw-flex tw-items-center tw-flex-col">
                    {this.state.destroyClicked ? (
                      <React.Fragment>
                        {destroyingSessionText}
                      </React.Fragment>
                    ) : (
                      <React.Fragment><div className="tw-max-w-[260px]">{(kasm && kasm.kasm_id && this.props.operationalMessage && this.props.operationalMessage[kasm.kasm_id]) || loadingSessionText}</div><div className="tw-text-2xl"></div></React.Fragment>
                    )}
                  </div>
                </Col>
              </Row>
          </div>
                  
                </div>
              ) : (
                ""
              )}

            </div>
          </div>
        )}
      </div>
      
    );
  }
}

Kasm.propTypes = {
  destroyKasms: Proptypes.func.isRequired,
  logout: Proptypes.func.isRequired,
  getUserKasms: Proptypes.func.isRequired,
  getUserImages: Proptypes.func.isRequired,
  updateKeepalive: Proptypes.func.isRequired,
  getStatusKasms: Proptypes.func.isRequired,
  availableKasms: Proptypes.array,
  statusKasms: Proptypes.object,
  errorStatusKasmsMessage: Proptypes.oneOfType([
    Proptypes.object,
    Proptypes.string
  ]),
  type: Proptypes.string,
  getstatuskasmsLoading: Proptypes.bool,
  destroyKasmsLoading: Proptypes.func,
  className: Proptypes.object,
  liveKasms: Proptypes.array,
  currentTime: Proptypes.string,
};
const KasmTranslated = withTranslation('common')(Kasm)
export default connect(
  (state) => ({
    errorCreateMessage: state.dashboard.errorCreateMessage || null,
    errorCreateMessageDetail: state.dashboard.errorCreateMessageDetail || null,
    getstatuskasmsLoading: state.dashboard.getstatuskasmsLoading || null,
    destroyKasmsErrorMessage: state.dashboard.destroyKasmsErrorMessage || null,
    destroyKasmsLoading: state.dashboard.destroyKasmsLoading || null,
    statusKasms: state.dashboard.statusKasms || null,
    kasmStarting: state.dashboard.kasmStarting || false,
    progress: state.dashboard.progress || {},
    operationalMessage: state.dashboard.operationalMessage || {},
    currentTime: state.dashboard.currentTime || null,
    errorStatusKasmsMessage: state.dashboard.errorStatusKasmsMessage || null,
    fetchedKasms: state.dashboard.kasms || [],
    createdKasms: state.dashboard.createdKasms || null,
    liveKasms: state.dashboard.liveKasms,
    userattributes: state.user.userattributes || null,
    availableKasms: state.dashboard.availableKasms,
  }),
  (dispatch) => ({
    logout: (logout_data) => dispatch(logout(logout_data)),
    destroyKasms: (data) => dispatch(destroyKasms(data)),
    getUserKasms: (payload_data) => dispatch(getUserKasms(payload_data)),
    updateKeepalive: (data) => dispatch(updateKeepalive(data)),
    getStatusKasms: (data) => dispatch(getStatusKasms(data)),
    getUserImages: (payload_data) => dispatch(getUserImages(payload_data)),
    getUserAttributes: () => dispatch(getUserAttributes()),
    updateUserAttribute: (data) => dispatch(updateUserAttribute(data)),
    kasmsFunc: (payload_data) => dispatch(getUserKasms(payload_data)),
  })
)(KasmTranslated);
