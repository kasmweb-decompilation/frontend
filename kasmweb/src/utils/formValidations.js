import React from "react";
import _ from "lodash";
import Proptypes from "prop-types";
import i18n from '../i18n';
import {Trans} from "react-i18next";
import { notifySuccess } from "../components/Form"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock } from '@fortawesome/pro-light-svg-icons/faLock';
import { faCopy } from '@fortawesome/pro-light-svg-icons/faCopy';
import { faEye } from "@fortawesome/pro-light-svg-icons/faEye";
import { faEyeSlash } from "@fortawesome/pro-light-svg-icons/faEyeSlash";

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}  

const copyToClipboard = (str) => {
    const el = document.createElement("textarea");
    el.value = str;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    notifySuccess({
        notifyTitle: 'generic.success',
        notifySuccess: 'control_panel.Copied to Clipboard'
    })
    document.body.removeChild(el);
}

// objects
const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const UUID = /^[0-9]{8}-[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{12}$/i ;

const PASSWORD = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!#$%^&*@])(?=.{8,})/ ;

const MOBILE = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/; 

const NUMBER = /^[0-9]\d*$/;

const POSITIVE_FLOAT = /^\d+(\.\d{1,2})?$/;

const SECRET = /^[A-Z0-9]*$/;

const required = value => value || value === 0 ? undefined : <Trans i18nKey="utils.required" ns="common" />;


const secret = value => SECRET.test(value) ?  (value.length == 16 ? undefined : <Trans ns="common" i18nKey="utils.secret-is-invalid"></Trans>) : <Trans ns="common" i18nKey="utils.secret-is-invalid"></Trans>

const json = (value) => {
                            try {
                                if (!value){
                                    return undefined;
                                }
                                let js = JSON.parse(value);

                                if (js && typeof js === "object") {
                                    return undefined;
                                } else {
                                    return <Trans ns="common" i18nKey="utils.must-be-json"></Trans>;
                                }
                            } catch (e) {
                                return <Trans ns="common" i18nKey="utils.must-be-json"></Trans>;
                            }
                        };

const maxLength = max => value => value && value.length > max ? <Trans ns="common" max={max} i18nKey="utils.must-be-max-characters-or-less">Must be {{max}} characters or less</Trans> : undefined;

const number = (value) => NUMBER.test(value) ? undefined : <Trans ns="common" i18nKey="utils.must-be-a-positive-integer"></Trans>;

const empty_or_number = (value) => value === "" || value === undefined  || value === null || NUMBER.test(value) ? undefined : <Trans ns="common" i18nKey="utils.must-be-a-positive-integer"></Trans>;

const positive_float = (value) => POSITIVE_FLOAT.test(value) ? undefined : <Trans ns="common" i18nKey="utils.must-be-a-positive-number"></Trans>;

const minValue = min => value => value && value < min ? <Trans ns="common" min={min} i18nKey="utils.must-be-at-least-min">Must be at least {{min}}</Trans> : undefined;

const maxValue = max => value => value && value > max ? <Trans ns="common" max={max} i18nKey="utils.must-be-a-maximum-of-max">Must be a maximum of {{max}}</Trans> : undefined;

const multipleOf = divisor => value => value && value % divisor != 0 ? <Trans ns="common" divisor={divisor} i18nKey="utils.must-multiple-of-divisor">Must be a multiple of {{divisor}}</Trans> : undefined;

const email = (value) => EMAIL_REGEX.test(value) ? undefined : <Trans ns="common" i18nKey="utils.email-is-invalid"></Trans>;

const uuid = (value) => UUID.test(value) ? undefined : <Trans ns="common" i18nKey="utils.uuid-id-is-invalid"></Trans>;

const mobile = (value) => MOBILE.test(value) ? undefined : <Trans ns="common" i18nKey="utils.mobile-number-is-invalid"></Trans>;

const password =(value) => PASSWORD.test(value) ? undefined : <Trans ns="common" i18nKey="utils.passwords-must-be-at-least-8-c"></Trans>;

const mustMatch = (field) => (value, allValues) => { 
    const data = allValues;
    return !_.isEmpty(data) && data[field] === value ? undefined : <Trans ns="common" i18nKey="utils.fields-must-match"></Trans>;
};

const mustEnd = (ends) => (value) => value && value.endsWith(ends) ? undefined : <Trans ns="common" ends={ends} i18nKey="utils.must-end-with">Must end with {{ends}}</Trans>;

const shouldEnd = (ends) => (value) => (value && value.endsWith(ends)) || _.isEmpty(value) ? undefined : <Trans ns="common" ends={ends} i18nKey="utils.must-end-with">Must end with {{ends}}</Trans>;

const noOldPassword = (field) => (value, allValues) => { 
    const data = allValues;
    return !_.isEmpty(data) && data[field] === value ?  <Trans ns="common" i18nKey="utils.new-password-cannot-be-the-sam"></Trans> : undefined;
};

const errorToFields = (data = {}) => {
    const errors = {};
    if (data) {
        _.forEach(data.errors, (error) => {
            const key = error.source.pointer.replace("/data/attributes/", "");
            const fieldName = _.upperFirst(key.replace("_", " "));
            errors[key] = `${fieldName} ${error.detail}`;
        });
    }

    return errors;
};

class renderPass extends React.Component{
    constructor(props) {
        super(props)
        this.state = {hidden: true};
        this.toggleShow = this.toggleShow.bind(this);
    }

    toggleShow() {
        this.setState({ hidden: !this.state.hidden });
    }

    render() {
        const setId = this.props.id || this.props.input.name || null
        return (
            <div className="relative">
                <div className="password-field input">
                    {this.props.disabled && <div className="tw-absolute tw-left-3 tw-top-3 text-muted-extra"><FontAwesomeIcon icon={faLock} /></div>}
                    <input {...this.props.input} disabled={this.props.disabled} required={this.props.required || false} placeholder={this.props.placeholder}
                        id={setId}
                        type={this.state.hidden ? 'password' : 'text'}
                        className={this.props.validationError || (this.props.meta.touched && this.props.meta.error) ? " validationError" : ""}/>
                    <button type="button" className="tw-absolute tw-right-0 tw-top-0 tw-bg-transparent tw-h-full tw-flex tw-justify-center tw-items-center tw-w-8" onMouseDown={() => this.setState({ hidden: !this.state.hidden })}>{this.state.hidden ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} /> }</button>
                </div>
                <div>
                    {this.props.meta.touched && ((this.props.meta.error && <span className="error_txt">{this.props.meta.error}</span>) || (this.props.meta.warning &&
                        <span className="error_txt">{this.props.meta.warning}</span>))}
                </div>
                {this.props.validationError && <div>
                    {(this.props.validationError && <span className="error_txt">{this.props.validationError}</span>)}
                </div>}
            </div>
        );
    }
};

class renderPassTextArea extends React.Component{
    constructor(props) {
        super(props)
        this.state = {hidden: true};
        this.toggleShow = this.toggleShow.bind(this);
    }

    toggleShow() {
        this.setState({ hidden: !this.state.hidden });
    }

    render() {
        let className = this.props.validationError || (this.props.meta.touched && this.props.meta.error) ? " validationError" : ""
        if (this.state.hidden){
            className += ' input-blur'
        }
        const setId = this.props.id || this.props.input.name || null
        return (
            <div className="relative">
                {this.props.disabled && <div className="tw-absolute tw-left-3 tw-top-3 text-muted-extra"><FontAwesomeIcon icon={faLock} /></div>}
                <textarea {...this.props.input} disabled={this.props.disabled} required={this.props.required || false} placeholder={this.props.placeholder}
                    id={setId}
                    className={className}
                    style={{'minHeight':'200px'}}
                />
                <button type="button" className="tw-absolute tw-right-0 tw-top-0 tw-bg-transparent tw-h-8 tw-flex tw-justify-center tw-items-center tw-w-8" onMouseDown={() => this.setState({ hidden: !this.state.hidden })}>{this.state.hidden ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} /> }</button>
                <div>
                    {this.props.meta.touched && ((this.props.meta.error && <span className="error_txt">{this.props.meta.error}</span>) || (this.props.meta.warning &&
                        <span className="error_txt">{this.props.meta.warning}</span>))}
                </div>
                {this.props.validationError && <div>
                    {(this.props.validationError && <span className="error_txt">{this.props.validationError}</span>)}
                </div>}
            </div>
        );
    }
};



const renderField = ({ input, type, disabled, copy, autoFocus, id, required = false, placeholder,validationError, meta: { touched, error, warning } }) => {
    autoFocus = autoFocus || false
    const setId = id || input.name || null
    const preventWheelChange = (e) => {
        if (type === 'number') {
            e.target.blur()
        }
    }
    return(
        <div className="relative">
            <div className={"input" + (copy ? ' tw-pr-10' : '')}>
                {disabled && <div className="tw-absolute tw-left-3 tw-top-3 text-muted-extra"><FontAwesomeIcon icon={faLock} /></div>}
                {copy && <div onClick={() => copyToClipboard(input.value)} className="tw-absolute tw-right-0 tw-top-0 tw-bottom-0 tw-flex tw-justify-center tw-group/clip tw-items-center tw-w-10 tw-cursor-pointer"><FontAwesomeIcon className="tw-transition-all group-hover/clip:tw-scale-110" icon={faCopy} /></div>}
                <input autoFocus={autoFocus} onWheel={preventWheelChange} {...input} required={required} placeholder={placeholder} id={setId} type={type || 'text'} disabled={disabled} className={classNames(validationError || (touched && error) ? "validationError" : "", copy ? '!tw-border-r tw-border-black/10' : '')}/>
            </div>
            <div>
                {touched && ((error && <span className="error_txt">{error}</span>) || (warning && <span className="error_txt">{warning}</span>))}
            </div>
            {validationError && <div>
                {(validationError && <span className="error_txt">{validationError}</span>)}
            </div>}
        </div>
    );
};

const renderSelectField = ({ input, disabled, id, required = false, autoFocus, placeholder,validationError, meta: { touched, error, warning }, children }) => {
    autoFocus = autoFocus || false
    const setId = id || input.name || null
    return(
        <div className="relative">
            <div className="input"> 
            {disabled && <div className="tw-absolute tw-left-3 tw-top-3 text-muted-extra"><FontAwesomeIcon icon={faLock} /></div>}
            <select {...input} autoFocus={autoFocus} required={required} placeholder={placeholder} id={setId} disabled={disabled} className={validationError || (touched && error) ? " validationError" : ""}>
                {children}
            </select>
            </div>
            <div>
                {touched && ((error && <span className="error_txt">{error}</span>) || (warning && <span className="error_txt">{warning}</span>))}
            </div>
            {validationError && <div>
                {(validationError && <span className="error_txt">{validationError}</span>)}
            </div>}
        </div>
    );
};

const renderTextArea = ({ input, type, disabled, id, required = false, placeholder,validationError, meta: { touched, error, warning } }) => {
    const setId = id || input.name || null
    return(
        <div className="relative">
            <div className="input">
                {disabled && <div className="tw-absolute tw-left-3 tw-top-3 text-muted-extra"><FontAwesomeIcon icon={faLock} /></div>}
                <textarea style={{'minHeight':'200px'}} {...input} placeholder={placeholder} required={required} id={setId} type={type} disabled={disabled}  className={validationError || (touched && error) ? " validationError" : ""}/>
            </div>
            <div>
                {touched && ((error && <span className="error_txt">{error}</span>) || (warning && <span className="error_txt">{warning}</span>))}
            </div>
            {validationError && <div>
                {(validationError && <span className="error_txt">{validationError}</span>)}
            </div>}
        </div>
    );
};

const renderTextArea2 = ({ input, type, disabled, id, required = false, placeholder,validationError, meta: { touched, error, warning } }) => {
    const setId = id || input.name || null
    return(
        <div className="relative tw-w-full tw-h-full">
            <div className="tw-w-full tw-h-full">
                {disabled && <div className="tw-absolute tw-left-3 tw-top-3 text-muted-extra"><FontAwesomeIcon icon={faLock} /></div>}
                <textarea {...input} placeholder={placeholder} required={required} type={type} id={setId} disabled={disabled}  className={validationError || (touched && error) ? " tw-w-full !tw-h-full validationError" : " tw-w-full !tw-h-full"}/>
            </div>
            <div>
                {touched && ((error && <span className="error_txt">{error}</span>) || (warning && <span className="error_txt">{warning}</span>))}
            </div>
            {validationError && <div>
                {(validationError && <span className="error_txt">{validationError}</span>)}
            </div>}
        </div>
    );
};

const renderCheckbox = ({ input, disabled, checked, id, required = false, validationError, meta: { touched, error, warning } }) => {
    const setId = id || input.name || null
    return(
        <span>
            <input {...input} 
                type="checkbox"
                required={required}
                disabled={disabled}
                id={setId}
                defaultChecked={checked == true ? checked: false} 
            />

            <div>
                {touched && ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}
            </div>
            {validationError && <div>
                {(validationError && <span>{validationError}</span>)}
            </div>}
        </span>
    );
};

const renderToggle = ({ input, id, disabled, checked, required = false, validationError, meta: { touched, error, warning } }) => {
    const setId = id || input.name || null
    return(
        <React.Fragment>
            <div className="toggle tw-flex tw-items-center">
                <input {...input} 
                    id={setId}
                    required={required}
                    disabled={disabled}
                    type="checkbox"
                    defaultChecked={!!checked}
                />
                <label htmlFor={setId}>Toggle</label>

            </div>
            <div>
                {touched && ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}
            </div>
            {validationError && <div>
                {(validationError && <span>{validationError}</span>)}
            </div>}


        </React.Fragment>
    );
};

export function RenderToggle(props) {
    const { id, checked, name, onChange } = props
    const setId = id || name || null
    return (
    <React.Fragment>
    <div className="toggle tw-flex tw-items-center">
        <input
            name={name} 
            id={setId}
            type="checkbox"
            defaultChecked={!!checked}
            onChange={onChange}
        />
        <label htmlFor={setId}>Toggle</label>
    </div>
</React.Fragment>
    )
}

renderPass.propTypes = {
    input: Proptypes.object,
    type: Proptypes.string,
    placeholder: Proptypes.string,
    validationError: Proptypes.object,
    meta: Proptypes.object
};

renderPassTextArea.propTypes = {
    input: Proptypes.object,
    type: Proptypes.string,
    placeholder: Proptypes.string,
    validationError: Proptypes.object,
    meta: Proptypes.object
};

renderSelectField.propTypes = {
    input: Proptypes.object,
    placeholder: Proptypes.string,
    autoFocus: Proptypes.bool,
    validationError: Proptypes.object,
    meta: Proptypes.object
};

renderField.propTypes = {
    input: Proptypes.object,
    type: Proptypes.string,
    placeholder: Proptypes.string,
    autoFocus: Proptypes.bool,
    validationError: Proptypes.object,
    meta: Proptypes.object
};


renderCheckbox.propTypes = {
    input: Proptypes.object,
    checked: Proptypes.bool,
    validationError: Proptypes.object,
    meta: Proptypes.object
};

renderToggle.propTypes = {
    input: Proptypes.object,
    checked: Proptypes.bool,
    validationError: Proptypes.object,
    meta: Proptypes.object
};

renderTextArea.propTypes = {
    input: Proptypes.object,
    type: Proptypes.string,
    placeholder: Proptypes.string,
    validationError: Proptypes.object,
    meta: Proptypes.object
};



export {
    errorToFields,
    maxValue,
    maxLength,
    minValue,
    number,
    empty_or_number,
    positive_float,
    required,
    json,
    secret,
    email,
    mobile,
    mustMatch,
    renderPass,
    renderPassTextArea,
    renderField,
    renderSelectField,
    renderCheckbox,
    renderToggle,
    renderTextArea,
    renderTextArea2,
    password,
    uuid,
    noOldPassword,
    copyToClipboard,
    multipleOf,
    mustEnd,
    shouldEnd,
};