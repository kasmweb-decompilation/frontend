import React from "react";

import { Spinner } from "reactstrap";
class Image extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      isError: false,
      url: this.props.src,
    };
  }

  onError() {
    const url = this.state.url !== this.props.icon ? this.props.icon : 'img/favicon.png';
    this.setState({
      isLoading: false,
      isError: true,
      url: url,
    });
  }

  onLoaded() {
    this.setState({ isLoading: false });
  }

  render() {
    const { isLoading, url } = this.state;
    const hasClass = this.state.isError || this.props.status !== 'running' ? 'tw-p-5 tw-px-20 tw-grayscale tw-opacity-30' : ''
    const displayUrl = this.props.status === 'running' ? url : (this.state.url !== this.props.icon ? this.props.icon : 'img/favicon.png')
    return (
      <div>
        <div
        className="tw-items-center tw-py-8"
        style={{
          width: "100%",
          display: isLoading ? "tw-flex" : "none"
        }}>
          <Spinner
            style={{
              width: "64px",
              height: "64px",
            }}
            color="danger"
          />
        </div>
        <img
          {...this.props}
          onError={() => this.onError()}
          onLoad={() => this.onLoaded()}
          className={hasClass}
          src={displayUrl}
          style={{
            display: isLoading ? "none" : "block",
          }}
        />
      </div>
    );
  }
}

export default Image;
