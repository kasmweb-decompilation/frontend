import React, {Component} from "react";
import {  Row, Col} from "reactstrap";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { Picker } from 'emoji-mart';
import 'emoji-mart/css/emoji-mart.css'
import Draggable from 'react-draggable';
import Toggle from "react-toggle";
import {withTranslation} from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp } from "@fortawesome/free-solid-svg-icons/faChevronUp";
import { faVolumeOff } from "@fortawesome/free-solid-svg-icons/faVolumeOff";
import { faLocationArrow } from "@fortawesome/free-solid-svg-icons/faLocationArrow";
import { faMinus } from "@fortawesome/free-solid-svg-icons/faMinus";
import { faSmile } from "@fortawesome/free-solid-svg-icons/faSmile";
import { faVolumeUp } from "@fortawesome/free-solid-svg-icons/faVolumeUp";


var ping;

class SmallChat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chatMessage: '',
            showEmojiPicker: false,
            height: 275,
            width: 375
        };
        this.chatBottom = React.createRef();
        this.emojiWindow = React.createRef();
        this.chatInput = React.createRef();

        this.handleChange = this.handleChange.bind(this);
        this.handleKey = this.handleKey.bind(this);
        this.scrollToBottom = this.scrollToBottom.bind(this);
        this.toggleEmojiPicker = this.toggleEmojiPicker.bind(this);
        this.addEmoji = this.addEmoji.bind(this);
        this.handleOutsideClick = this.handleOutsideClick.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
    }

    handleOutsideClick(e) {
        // ignore clicks on the component itself
        if (this.emojiWindow.contains(e.target)) {
            return;
        }
        this.toggleEmojiPicker();
    }

    addEmoji(emoji) {
        const { chatMessage } = this.state;
        const text = `${chatMessage}${emoji.native}`;
        document.removeEventListener('click', this.handleOutsideClick, false);
        this.setState({
            chatMessage: text,
            showEmojiPicker: false,
        });
        this.chatInput.current.focus();
    }

    toggleEmojiPicker(e) {
        e.stopPropagation();
        if (!this.state.showEmojiPicker) {
            // attach/remove event handler
            document.addEventListener('click', this.handleOutsideClick, false);
        } else {
            document.removeEventListener('click', this.handleOutsideClick, false);
        }
        this.setState({
            showEmojiPicker: !this.state.showEmojiPicker,
        });
    }

    scrollToBottom() {
        this.chatBottom.current.scrollIntoView({ behavior: 'auto' });
    }

    componentDidMount() {
        this.scrollToBottom();
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    handleChange(event) {
        this.setState({chatMessage: event.target.value});
    }

    handleKey(event) {
        if (event.key === 'Enter') {
            if (this.state.chatMessage !== "") {
                let msg = {
                    message: this.state.chatMessage,
                    username: this.props.username
                };
                this.props.send(JSON.stringify(msg));
                this.setState({chatMessage: ''})
            }
        }
    }

    sendMessage() {
        if (this.state.chatMessage !== "") {
            let msg = {
                message: this.state.chatMessage,
                username: this.props.username
            };
            this.props.send(JSON.stringify(msg));
            this.setState({chatMessage: ''})
        }
    }

    render() {
        const { t } = this.props;
        let mess = this.props.messages.map( (msg, idx) => {
            if (msg.chat === '' && msg.username === '') return
            let nameColor = 'text-white';
            let msgColor = 'text-white';
            let img="img/user.svg";

            if (msg.username === this.props.owner_username){
                nameColor = 'text-blue';
                img ="img/kasm_logo.svg";
            }
            else if (msg.username === this.props.username) {
                nameColor = 'text-darkturquoise';
            }
            else if (msg.username === '') {
                msgColor = 'text-darkgray';
                img="";
            }
            else {
                nameColor = 'text-darkorange';
            }

            return <li key={idx}>
                <img src={img} style={{height: "12px"}}/>
                <span className={nameColor} style={{fontWeight:"bold", fontSize:"12px"}}> {msg.username && msg.username + ": "}</span>
                <span className={msgColor} style={{fontSize:"12px"}}>{msg.chat}</span>
            </li>;
        });

        return (
            <Draggable handle=".movable" bounds=".kasm-parent" >
                <div className="small-chat-container" style={{height: this.state.height, width:this.state.width}}>
                    <div className="small-chat">
                        <div className="movable" style={{display:'flex', padding: '7px', margin: '-1px', backgroundColor: 'rgba(200,200,200,0.2)'}}>
                            <span className="text-white pl-2 pr-2" style={{width: '34px'}} onClick={this.props.toggleAudio}>
                                { this.props.audio ?
                                    <FontAwesomeIcon icon={faVolumeUp} />
                                    :
                                    <FontAwesomeIcon icon={faVolumeOff} />
                                }
                            </span>
                            <div className="text-right text-white" style={{width:'100%'}}>
                            {!this.props.allowToggle &&
                                <FontAwesomeIcon icon={faChevronUp} className="dark-hover tw-mr-2" onClick={this.props.toggleChat} />
                            }
                            <FontAwesomeIcon icon={faMinus} className="dark-hover" onClick={this.props.toggleSmallChat} />
                            </div>
                        </div>
                        <ul id="drag-cursor" className="movable">
                            {mess}
                            <div ref={this.chatBottom} />
                        </ul>
                        {this.state.showEmojiPicker ?
                            <span className="emoji-select"
                                  style={{position: 'absolute', bottom: '35px', right: '12px'}}
                                  ref={(node) => {this.emojiWindow = node}}
                            >
                                <Picker
                                    native={true}
                                    showSkinTones={false}
                                    showPreview={false}
                                    onSelect={this.addEmoji}
                                    title={""}
                                />
                            </span>
                            : null
                        }
                        <div id="no-focus">
                            <button
                                type="button"
                                className="chat-emoji-select"
                                onClick={this.toggleEmojiPicker}
                            >
                                <FontAwesomeIcon icon={faSmile} style={{paddingRight:'5px', paddingLeft:'5px', color:'#bbb', fontSize: '1.5em'}} />
                            </button>
                            <input
                                type="text"
                                placeholder={t("chat.Enter your message here")}
                                value={this.state.chatMessage}
                                onChange={this.handleChange}
                                onKeyPress={this.handleKey}
                                ref={this.chatInput}
                            />
                            <button onClick={this.sendMessage} id="chat-send" className="p-1">
                                <FontAwesomeIcon icon={faLocationArrow} />
                            </button>
                        </div>
                    </div>
                </div>
            </Draggable>
        );
    }
}


SmallChat.propTypes = {
    // hostname: Proptypes.string.isRequired,
};

SmallChat = withRouter(SmallChat); // eslint-disable-line
const SmallChatTranslated = withTranslation('common')(SmallChat)

export default connect(state =>
        ({

        }),
    dispatch =>
        ({

        }))(SmallChatTranslated);
