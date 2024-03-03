import React, { Component } from "react";
import Select from "react-select";
import "react-select/dist/react-select.css";
import Proptypes from "prop-types";

class SelectInput extends Component {
    onChange(event) {
        if (this.props.input.onChange && event != null) {
            if (this.props.multi) {
                this.props.input.onChange(event.map(item => item.value))
            } else {
                this.props.input.onChange(event.value);
            }
        } else {
            this.props.input.onChange(null);
        }
        if (this.props.onOptionChange) {
            this.props.onOptionChange(event.value);
        }
    }

    
    render() {
        const id = this.props.input.id || this.props.input.name
        return (
            <div className="relative">
                <div className="input">
                    {this.props.isUpdateForm ?
                        <Select {...this.props}
                            id={id}
                            value={this.props.selectedValue || []}
                            onBlur={() => this.props.input.onBlur(this.props.input.value)}
                            onChange={this.onChange.bind(this)}
                            valueRenderer={this.props.renderValue}
                            optionRenderer={this.props.renderOption}
                            options={this.props.options}
                            className={this.props.validationError || (this.props.meta.touched && this.props.meta.error) ? "validationError" : ""}
                            classNames={{}}
                        /> :
                        <Select.Creatable {...this.props}
                            id={id}
                            value={this.props.selectedValue || ""}
                            onBlur={() => this.props.input.onBlur(this.props.input.value)}
                            onChange={this.onChange.bind(this)}
                            valueRenderer={this.props.renderValue}
                            optionRenderer={this.props.renderOption}
                            options={this.props.options}
                            className={this.props.validationError || (this.props.meta.touched && this.props.meta.error) ? "validationError" : ""}
                            classNames={{
                                control: 'p-2'
                            }}
                        />}
                </div>
                <div>
                    {this.props.meta.touched && ((this.props.meta.error && <span className="error_txt">{this.props.meta.error}</span>) || (this.props.meta.warning && <span className="error_txt">{this.props.meta.warning}</span>))}
                </div>
                {this.props.validationError && <div>
                    {(this.props.validationError && <span className="error_txt">{this.props.validationError}</span>)}
                </div>}
            </div>
        );
    }
}

SelectInput.propTypes = {
    input: Proptypes.object,
    options: Proptypes.array,
    isUpdateForm: Proptypes.bool,
    selectedValue: Proptypes.oneOfType([
        Proptypes.string,
        Proptypes.arrayOf(Proptypes.string),
    ]),
    renderValue: Proptypes.func,
    onOptionChange: Proptypes.func,
    renderOption: Proptypes.func,
    history: Proptypes.object,
};

export default SelectInput;