import React, {Component} from "react";
import Proptypes from "prop-types";
import stopReload from "../../constants/Constants";

export default class IframeComponent extends Component {
    constructor(props) {
        super(props);
        this.iframe = this.iframe.bind(this);
    }

    iframe() {
        return {
            __html: this.props.iframe
        };
    }

    componentDidMount() {
        if (!this.props.fromJoin)
            window.addEventListener("beforeunload", stopReload, true );
    }


    componentWillUnmount() {
        if (!this.props.fromJoin)
            window.removeEventListener("beforeunload", stopReload, true);
    }

    render() {
        return (
            <div id="iframe-container" className="iframe-container">
                <div style={{height: '100%'}} dangerouslySetInnerHTML={ this.iframe() }  />
                { this.props.fromJoin &&
                    <div id="overlay" className="overlay" />
                }
            </div>
        );
    }
}

IframeComponent.propTypes = {
    iframe: Proptypes.string,
    fromJoin: Proptypes.bool
};
