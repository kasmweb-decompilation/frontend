import React, {Component} from "react";
import {Tooltip} from "reactstrap";
import Proptypes from "prop-types";

class TooltipComponent extends Component {
    constructor(props){
        super(props);
        const generateID = Math.random().toString(36).substr(2, 9);
        this.state = {
          tooltipOpen: false,
          id: `tooltip-${generateID}`,
        };

        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState({
            tooltipOpen: !this.state.tooltipOpen
        });
    }

    render() {
        return (
            <div className="title-tip">
                <span id={this.state.id} >
                    {this.props.name}
                </span>
                <Tooltip
                    placement="top"
                    isOpen={this.state.tooltipOpen}
                    target={this.state.id}
                    toggle={this.toggle}
                >
                    {this.props.description}
                </Tooltip>
            </div>
        );
    }
}

TooltipComponent.propTypes = {
    description: Proptypes.string.isRequired,

};

export default TooltipComponent;
