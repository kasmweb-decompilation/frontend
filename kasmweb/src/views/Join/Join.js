import React, {Component} from "react";
import { connect } from "react-redux";
import { Row, Col } from "reactstrap";
import IframeComponent from "../../components/IframeComponent/component";
import Proptypes from "prop-types";
import {getJoinKasm} from "../../actions/actionDashboard";
import {getUserAttributes} from "../../actions/actionUser";
import { NotificationManager } from "react-notifications";
import ViewPanel from "../../components/ViewPanel/ViewPanel";
import ShareBanner from "../../components/ShareBanner";
import ChatComponent from "../../components/Chat";
import SmallChat from "../../components/Chat/SmallChat";
import message_audio from "../../../assets/audio/message_recieved.mp3";
import join_audio from "../../../assets/audio/member_joined.mp3";
import {logout} from "../../actions/actionLogin";
import queryString from "query-string"
import stopReload from "../../constants/Constants";
import {withTranslation} from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments } from "@fortawesome/free-solid-svg-icons/faComments";

var message_recieved_audio = new Audio(message_audio);
var member_joined_audio = new Audio(join_audio);
var timeouts = [];
var ping;
class Join extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loader: false,
            attempt:0,
            kasmId: "",
            url: "",
            videoQuality: 1,
            toggleControlPanel: false,
            chatSFX: false,
            fullscreen: false,
            chat: true,
            banner: true,
            smallchat: false,
            bigChat:true,
            messages: [],
            members: [],
            width: 0,
            height: 0,
            mobile: false,
            audio: true,
            disableChat: false,
            disableControlPanel: false,
            disableTips: false,
            disableFixedRes: false,
            connected: false,
        };
        this.stateFunctionUrl = this.stateFunctionUrl.bind(this);
        this.handleDisconnect = this.handleDisconnect.bind(this);
        this.toggleLoader = this.toggleLoader.bind(this);
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
    }

    handleLeave(location){
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

    toggleLoader() {
        this.setState({
            loader: !this.state.loader
        });
    }

    stateFunctionUrl(){
        this.setState({url: "" });
    }

    handleDisconnect() {
        this.setState({
            attempt: 0,
            showTips: false,
            disconnect: true
        });
        this.handleStartKasm();
    }

    handleStartKasm() {
        const {joinKasmError, t} = this.props;
        if(joinKasmError) {
            this.handleLeave("/");
            NotificationManager.error(joinKasmError,t('workspaces.session-status'), 3000);
        } else {
            const { joinKasm }  = this.props;
            if (joinKasm) {
                if (window.localStorage.getItem("joined_kasms")) {
                    let recent_kasms = JSON.parse(window.localStorage.getItem("joined_kasms"));
                    if (recent_kasms.kasms.indexOf(joinKasm.share_id) === -1) {
                        recent_kasms.kasms.push(joinKasm.share_id);
                        window.localStorage.setItem("joined_kasms", JSON.stringify(recent_kasms));
                    }
                } else {
                    let joined_kasms = {kasms: [joinKasm.share_id]};
                    window.localStorage.setItem("joined_kasms", JSON.stringify(joined_kasms));
                }
                this.delay_check_load();
                this.connectSocket();
            } else{
                this.handleLeave("/");
                NotificationManager.error(t('workspaces.bad-response'),t('workspaces.session-status'), 3000);
            }
        }
    }

    delay_check_load () {
        const { joinKasm, t }  = this.props;
        const { videoQuality, toggleControlPanel }  = this.state;

        if (!localStorage.getItem("ime_mode")) {
            const mode = this.props.joinKasm.client_settings.kasm_ime_mode_default_on;
            localStorage.setItem("ime_mode", mode ? "on" : "off");
        }

        let self = this;
        const count = this.state.attempt + 1;
        const timeout = 200 * count;
        this.setState({
            loader: true,
            attempt: count
        });
        timeouts.push(setTimeout(function () {
            if (count < 10) {
                let kasm_url = `https://${joinKasm.hostname}:${joinKasm.port_map.vnc.port ? joinKasm.port_map.vnc.port : window.location.port }/${joinKasm.port_map.vnc.path}/vnc.html?video_quality=${videoQuality}&enable_webp=${joinKasm.client_settings.enable_webp}&toggle_control_panel=${toggleControlPanel}&idle_disconnect=${joinKasm.client_settings.idle_disconnect}&password=${joinKasm.view_only_token}&autoconnect=1&clipboard_up=true&clipboard_down=true&clipboard_seamless=tru&path=${joinKasm.port_map.vnc.path}/websockify&show_dot=true&resize=scale`;
                fetch(kasm_url, {method: "GET", credentials: "include"}).then(function (response) {
                    if (response.status == 200) {
                        const url = `<iframe  allow="autoplay" src = ${kasm_url} id='iframe-id'; style="width:100%; height:100%; border:none; margin:0; padding:0; overflow:hidden; z-index:999995;"></iframe>`;
                        self.setState({
                            url,
                            loader: false
                        });
                        return true;
                    }
                    if (response.status == 403) {
                        //This happens when kasm auth rejects the call to create a kasm
                        //We should warn the user and tell them it may be from deleted cookie and to re login
                        NotificationManager.error(t('auth.if-problem-persists-try-loggin'),t('auth.unauthorized-session-access'), 3000);
                        //Notification did not persist through redirection. Set timeout for user to be able to read notification
                        timeouts.push(setTimeout(function() { window.location.href = "/"; }, 3000 ));
                    }
                    else {
                        timeouts.push(setTimeout(function() { self.delay_check_load(); }, timeout ));
                    }
                }).catch(()=>{
                    timeouts.push(setTimeout(function() { self.delay_check_load(); }, timeout ));
                });
            }
            else {
                self.setState({
                    loader: false,
                    attempt: 0
                });

                NotificationManager.error(t('workspaces.create-resume-session-error'),t('workspaces.connection-failed-trying-again'), 3000);
                console.trace("Navigating browser to /");
                window.location.href = "/";
            }
        }, timeout ));
    }

    setFullscreen() {
        if (document.fullscreenElement) {
            this.setState({fullscreen:true});
        } else {
            this.setState({fullscreen:false});
        }
    }

    UNSAFE_componentWillMount() {
        this.updateDimensions();
    }


    componentDidMount(){
        document.addEventListener('fullscreenchange', this.setFullscreen);
        document.addEventListener('MSFullscreenChange', this.setFullscreen);
        window.addEventListener("resize", this.updateDimensions);
        if (window.addEventListener) {
            window.addEventListener("message", this.receiveMessage, false);
            window.addEventListener("connection_state", this.receiveMessage, false);
        } else if (window.attachEvent) {
            window.attachEvent("message", this.receiveMessage);
        }

        const values = queryString.parse(this.props.location.search);

        if (values.disable_chat && values.disable_chat === "1"){
            this.setState({disableChat: true})
        }
        if (values.disable_control_panel && values.disable_control_panel === "1"){
            this.setState({disableControlPanel: true})
        }
        if (values.disable_tips && values.disable_tips === "1"){
            this.setState({disableTips: true, showTips: false})
        }
        if (values.disable_fixed_res && values.disable_fixed_res === "1"){
            this.setState({disableFixedRes: true})
        }


        const {userattributes, t} = this.props;
        this.props.getUserAttributes()
        .then(() => {
            this.setState({
                toggleControlPanel: userattributes && userattributes.toggle_control_panel === undefined ? true : userattributes && userattributes.toggle_control_panel,
                chatSFX: userattributes.chat_sfx === undefined ? true : userattributes.chat_sfx,
            })
        });

        this.props.getJoinKasm(this.props.match.params.id).
            then(() => this.handleStartKasm()).
            catch(() => {
                this.handleLeave("/");
                NotificationManager.error(t('workspaces.get-session-status-failed'),t('workspaces.session-status-0'), 3000);
            });
    }


    componentWillUnmount() {
        document.removeEventListener("fullscreenchange", this.setFullscreen);
        document.removeEventListener("MSFullscreenChange", this.setFullscreen);
        window.removeEventListener("resize", this.updateDimensions);
        window.removeEventListener("message", this.receiveMessage, false);
        window.removeEventListener("connection_state", this.receiveMessage, false);
        for (let x in timeouts) {
            window.clearTimeout(x);
        }
        timeouts = [];
        this.connection && this.connection.close();
        clearInterval(ping);
    }


    receiveMessage(event) {
        const { joinKasm }  = this.props;
        const kasmId = joinKasm ? joinKasm.kasm_id : null;
        if (event.data) {
            if (event.data.action === 'monarch-pointermove') {
                // Catching messages from vnc iframe and sending up to Monarch app
                const eventData = event.data.value;
                eventData.shareId = this.props.match.params.id;
                eventData.kasmId = kasmId;
                window.parent.postMessage(eventData, '*');
            } else if (event.data.action === 'disconnectrx') {
                const eventData = {
                    type: 'disconnectrx',
                    shareId: this.props.match.params.id,
                    kasmId: kasmId,
                    value: event.data.value,
                };
                window.parent.postMessage(eventData, '*');
            } else if (event.data.action === 'idle_session_timeout') {
                const eventData = {
                    type: 'idle_session_timeout',
                    shareId: this.props.match.params.id,
                    kasmId: kasmId,
                };
                window.parent.postMessage(eventData, '*');
                conosle.log(eventData);
            } else if (event.data.action === 'connection_state') {
                let connection_state = event.data.value;
                if (connection_state === "connected"){
                    this.setState({
                        connected: true,
                    });
                }
                else {
                    this.setState({
                        connected: false,
                    });
                }
                const eventData = {
                    type: 'connection_state',
                    shareId: this.props.match.params.id,
                    kasmId: kasmId,
                    value: connection_state,
                };
                window.parent.postMessage(eventData, '*');
            } else if (event.data.action === "noVNC_initialized") {
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
            this.setState({mobile: true});
        } else {
            this.setState({mobile: false});
        }
        this.setState({width: window.innerWidth, height: window.innerHeight});
    }

    connectSocket() {
        if (!this.connection) {
            const userInfo = JSON.parse(window.localStorage.user_info);
            this.connection = new WebSocket(`wss://${window.location.host}/api/share/chat?share_id=${this.props.joinKasm.share_id}&username=${userInfo.username}&token=${userInfo.token}`);
            this.connection.onopen = evt => {
                let msg = {
                    members: true,
                };
                this.connection.send(JSON.stringify(msg));
            };

            this.connection.onmessage = evt => {
                // add the new message to state
                let arr = JSON.parse(evt.data);
                if (arr['members']) {
                    this.setState({
                        members: arr['members']
                    });
                }
                if (arr['history']){
                    for (let i =0; i < arr['history'].length; i++)
                    {
                        let m_json = JSON.parse(arr['history'][i]);
                        if ('body' in m_json){
                            this.setState({
                                messages: this.state.messages.concat(
                                    {
                                        chat: m_json['body']['message'],
                                        username: m_json['body']['username']
                                    })
                            });
                        }
                    }
                }
                if (arr['body']) {
                    this.setState({
                        messages: this.state.messages.concat(
                            {
                                chat: arr['body']['message'],
                                username: arr['body']['username']
                            })
                    });
                    if (this.state.audio && this.state.chatSFX) {
                        if (arr['body']['username'] !== "") {
                            message_recieved_audio.play();
                        } else {
                            member_joined_audio.play();
                        }
                    }
                }
            };

            ping = setInterval(() => {
                if (this.connection.readyState === WebSocket.OPEN) {
                    this.connection.send("ping")
                }
            }, 25000);
        }
    }

    send(msg) {
        if (this.connection.readyState === WebSocket.OPEN) {
            this.connection.send(msg);
        } else {
            console.log("Websocket is disconnected. Cannot Send message.")
        }
    }

    fullscreen() {
        this.setState({fullscreen: true}, () =>
            {
                let element = document.getElementById("full-screen");
                if (element.requestFullscreen)
                    element.requestFullscreen();
                else if (element.mozRequestFullScreen)
                    element.mozRequestFullScreen();
                else if (element.webkitRequestFullscreen)
                    element.webkitRequestFullscreen();
                else if (element.msRequestFullscreen)
                    element.msRequestFullscreen();
            }
        );
        navigator.keyboard.lock(["Escape"]);
    }

    exitFullscreen() {
        if (document.exitFullscreen)
            document.exitFullscreen();
        else if (document.mozCancelFullScreen)
            document.mozCancelFullScreen();
        else if (document.webkitExitFullscreen)
            document.webkitExitFullscreen();
        else if (document.msExitFullscreen)
            document.msExitFullscreen();
        this.setState({fullscreen: false});
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
        this.setState({smallchat: !this.state.smallchat})
    }

    toggleBigChat() {
        this.setState({bigChat: !this.state.bigChat})
    }

    toggleChatWindow() {
        if (this.state.chat) {
            if (this.state.mobile) {
                this.setState({smallchat: !this.state.smallchat})
            } else
                this.setState({bigChat: !this.state.bigChat})
        } else {
            this.setState({smallchat: !this.state.smallchat})
        }
    }

    toggleAudio() {
        this.setState({audio: !this.state.audio})
    }

    render() {
        const { t } = this.props;
        const userInfo = JSON.parse(window.localStorage.user_info);

        const chatContainerOverride =  this.state.disableChat ? {height: "100%"} : {};
        let joiningSessionText = window.localStorage.getItem('joining_session_text');
        let header_logo = window.localStorage.getItem('header_logo');
        let image_logo = this.props.joinKasm && this.props.joinKasm.image && this.props.joinKasm.image.image_src ? this.props.joinKasm.image.image_src  : 'img/favicon.png';
        let image_friendly_name = this.props.joinKasm && this.props.joinKasm.image ? this.props.joinKasm.image.friendly_name  : '';

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
                {this.state.url && !this.state.loader ?
                    <div id="full-screen">
                        (<div  className="kasm-parent">
                            { this.props.joinKasm &&
                                <React.Fragment>
                                    {this.state.banner && !this.state.fullscreen && !this.state.mobile && !this.state.disableChat &&
                                        <ShareBanner statusKasms={this.props.joinKasm} toggleBanner={this.toggleBanner}/>
                                    }
                                    <div className="kasm-chat-container" style={chatContainerOverride}>
                                        <div id="vertical" className="vertical">
                                            <IframeComponent iframe={this.state.url}/>
                                        </div>
                                        {this.state.chat && !this.state.mobile && !this.state.disableChat &&
                                            <React.Fragment>
                                                {this.state.bigChat &&
                                                <ChatComponent
                                                    owner_username={this.props.joinKasm.user.username}
                                                    share_id={this.props.joinKasm.share_id}
                                                    username={userInfo.username}
                                                    toggleChat={this.toggleChat}
                                                    messages={this.state.messages}
                                                    members={this.state.members}
                                                    send={(msg) => this.send(msg)}
                                                    toggleBigChat={this.toggleBigChat}
                                                    toggleAudio={this.toggleAudio}
                                                    audio={this.state.audio}
                                                />
                                                }
                                            </React.Fragment>
                                        }
                                    </div>
                                </React.Fragment>
                            }
                            <div className="homebar">
                                <span className="homebar-id">ID : {this.props.joinKasm ? this.props.joinKasm.share_id : ''}</span>
                                <span className="float-right">
                                {this.state.fullscreen ?
                                    <a id="fullscreen-link" className="btn" onClick={this.exitFullscreen}><i className="icon-size-actual" /></a>
                                    :
                                    <a id="fullscreen-link" className="btn" onClick={this.fullscreen}><i className="icon-size-fullscreen" /></a>
                                }
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
                                    {(!this.state.chat ||  this.state.mobile) &&
                                        <React.Fragment>
                                            {this.state.smallchat &&
                                            <SmallChat
                                                share_id={this.props.joinKasm.share_id}
                                                owner_username={this.props.joinKasm.user.username}
                                                username={userInfo.username}
                                                toggleChat={this.toggleChat}
                                                messages={this.state.messages}
                                                members={this.state.members}
                                                send={(msg) => this.send(msg)}
                                                allowToggle={(this.state.fullscreen || this.state.mobile)}
                                                toggleSmallChat = {this.toggleSmallChat}
                                                toggleAudio={this.toggleAudio}
                                                audio={this.state.audio}
                                            />
                                            }
                                        </React.Fragment>
                                    }
                                 </span>
                            </div>
                        </div>
                        <ViewPanel
                            handleDisconnect={this.handleDisconnect}
                            disconnect={this.state.disconnect}
                            logout={this.props.logout}
                            kasmId={this.state.kasm_id}
                            statusKasms={this.props.joinKasm}
                            stateFunctionUrl={this.stateFunctionUrl}
                            toggleLoader={this.toggleLoader}
                            controlFullscreen={this.controlFullscreen}
                            fullscreen={this.state.fullscreen}              
                            toggle_control_panel={this.state.toggleControlPanel}
                            hideViewPanel={this.state.disableControlPanel}
                        />
                    </div>
                    :
                    ""
                }
                { this.state.connected ? "" :

                     <div className="kasm_background max_z">
                        <div className="kasm_background max_z background_fade" style={{background: 'url("' + bgImage() + '")'}}>
                            {this.props.joinKasm && this.props.joinKasm.share_id === this.props.match.params.id.split("-").join("")  ?
                                <div>
                                    <Row><Col><div className="kasm_connect_title" >{t('workspaces.loading-0')} {image_friendly_name}</div></Col></Row>
                                    <Row><Col>
                                        <div className="logo-center">
                                            <img onError={(e) => e.target.src = "img/favicon.png"} src={image_logo} alt="logo" style={{height: "150px"}}/>
                                        </div>
                                    </Col></Row>
                                    <Row><Col>
                                        <div className="kasm_connect_message tw-flex tw-items-center tw-flex-col">
                                             {joiningSessionText}
                                        </div>
                                    </Col></Row>
                                </div>
                                :
                                ""
                                }
                        </div>
                    </div>
                }
            </div>
        );
    }
}

Join.propTypes = {
    joinKasm: Proptypes.object,
    joinKasmError: Proptypes.string,
    logout: Proptypes.func.isRequired,
};
const JoinTranslated = withTranslation('common')(Join)
export default connect( state =>
    ({
        joinKasm: state.dashboard.joinKasm || null,
        joinKasmError: state.dashboard.joinKasmError || null,
        joinKasmLoading: state.dashboard.joinKasmLoading || null,
        userattributes: state.user.userattributes || null,
    }),
    dispatch =>
    ({
        getUserAttributes: () => dispatch(getUserAttributes()),
        getJoinKasm: (data) => dispatch(getJoinKasm(data)),
        logout: (logout_data) => dispatch(logout(logout_data)),
    }))(JoinTranslated);