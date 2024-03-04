import React, { useState, useEffect } from "react";
import _ from "lodash";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { t } from "i18next";
import { faEyeSlash } from "@fortawesome/free-solid-svg-icons/faEyeSlash";
import { faEye } from "@fortawesome/free-solid-svg-icons";

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export function LaunchForm(props) {
    const { data } = props
    const { image_id } = data
    if (!data.launch_config || !data.launch_config.launch_form) return // return early if there isn't a form
    const [initialForm, setInitialForm] = React.useState([]);

    const launchForm = useSelector(state => state.images.launchForm) || null
    const dispatch = useDispatch()

    const setLaunchForm = (form) => {
        dispatch({
            type: "LAUNCH_FORM",
            response: form
        })
        if (form !== null) {
            const filtered = form.filter(item => Boolean(item.allow_saving) === true && Boolean(item.user_save) === true)
            if (filtered.length > 0) {
                window.localStorage.setItem("launch_forms_" + image_id.replace(/-/gi, ''), JSON.stringify(filtered))
            } else {
                window.localStorage.removeItem("launch_forms_" + image_id.replace(/-/gi, ''))
            }
        }
    }
    const setLaunchSelection = (form) => {
        dispatch({
            type: "LAUNCH_SELECTIONS",
            response: form
        })
    }

    const reset = () => {
        window.localStorage.removeItem("launch_forms_" + image_id.replace(/-/gi, ''))
        setLaunchForm(null)
        setTimeout(() => { setLaunchForm(initialForm) })
    }

    useEffect(() => {
        setInitialForm(JSON.parse(JSON.stringify(data.launch_config.launch_form)))

        let form = JSON.parse(JSON.stringify(data.launch_config.launch_form))
        const currentSelections = JSON.parse(window.localStorage.getItem("launch_forms_" + image_id.replace(/-/gi, ''))) || null
        if (currentSelections) {
            currentSelections.forEach(selection => {
                const i = form.findIndex(x => x.key === selection.key)
                form[i] = selection
            })
        }
        setLaunchForm(form)
        return () => {
            setLaunchForm(null)
        }
    }, []);

    useEffect(() => {
        if (launchForm !== null) {
            const setLaunchSelections = launchSelections(launchForm)
            setLaunchSelection(setLaunchSelections)
        }
    }, [launchForm]);

    const saveChange = (e) => {
        const key = e.target.name.replace('save-', '');
        let current = JSON.parse(JSON.stringify(launchForm))
        let update = current.findIndex(e => e.key === key)
        if (e.target.checked) {
            current[update].user_save = true
        } else {
            delete current[update].user_save
        }
        setLaunchForm(current)
    }

    const handleChange = (e) => {
        const key = e.target.name
        const value = e.target.value
        let current = JSON.parse(JSON.stringify(launchForm))
        let update = current.findIndex(e => e.key === key)
        current[update].value = value
        setLaunchForm(current)
    }

    return (
        <React.Fragment>
            {
                launchForm && launchForm.map(form => <InputType onHandleChange={handleChange} saveChange={saveChange} key={form.key} formKey={form.key} {...form} />)
            }
            {reset && !_.isEqual(launchForm, initialForm) && <button className="tw-px-2 tw-rounded tw-bg-transparent tw-border tw-border-solid tw-border-[var(--border-color)]" type="button" onClick={reset}>{t('workspaces.Reset')}</button>}
        </React.Fragment>
    )
}



function InputType(props) {
    const { input_type } = props
    switch (input_type) {
        case 'select':
            return <SelectField {...props} />
        case 'input':
            return <InputField type="text" {...props} />
        case 'textarea':
            return <TextAreaField {...props} />
        case 'passwordtextarea':
            return <TextAreaField textareatype="password" {...props} />
        default:
            return <InputField type={input_type} {...props} />
    }
}

function launchSelections(launchForm) {
    let selections = {}
    for (let i = 0; i < launchForm.length; i++) {
        let item = launchForm[i]
        let display = false
        const { display_if } = item
        if (_.isArray(display_if) && !_.isEmpty(display_if)) {
            display = orMatch(display_if, launchForm)
        }
        if (_.isNull(display_if) || _.isEmpty(display_if)) {
            display = true
        }
        if (display) {
            selections[item.key] = item.value
        }
    }
    return selections
}

function orMatch(array, launchForm) {
    for (let i = 0; i < array.length; i++) {
        let condition = array[i]
        if (_.isArray(condition)) {
            const checkAnd = andMatch(condition, launchForm)
            if (checkAnd) {
                return true
            }
        } else {
            const findCondition = launchForm.find(el => el.key === condition.key)
            if (findCondition && findCondition.value === condition.value_regex) {
                return true
            }
        }
    }
    return false
}

function andMatch(array, launchForm) {
    for (let i = 0; i < array.length; i++) {
        let condition = array[i]
        const findCondition = launchForm.find(el => el.key === condition.key)
        if (findCondition && findCondition.value !== condition.value_regex) {
            return false
        }
    }
    return true
}

function FormField(props) {
    const { tooltip, label, children, className, display_if, saveChange, required: setRequired } = props
    const launchForm = useSelector(state => state.images.launchForm) || null

    let required = false
    if (setRequired || (children.props && children.props.required)) {
        required = true
    }

    let display = false

    if (launchForm) {
        if (_.isArray(display_if)) {
            display = orMatch(display_if, launchForm)
        }
        if (_.isNull(display_if) || _.isEmpty(display_if)) {
            display = true
        }
    }
    if (launchForm && display) {
        return (
            <div className={classNames("kasm-form-field tw-w-full tw-max-w-lg tw-mb-6", className)}>
                <div className="tw-flex tw-gap-3 tw-justify-between">
                    <div className="tw-flex tw-flex-col">
                        <label htmlFor={children.props && children.props.id} className={"tw-font-bold tw-mb-0" + (required ? ' requiredasterisk' : '')}>
                            {label}
                        </label>
                        {tooltip && <p className="tw-mb-2 tw-text-[color:rgba(var(--color-bravo),0.45)] tw-text-xs">{tooltip}</p>}
                    </div>
                </div>
                {children}
                {props.allow_saving && <div className="toggle mini tw-flex tw-mt-2 tw-text-xs tw-gap-3 tw-justify-between tw-text-[color:rgba(var(--color-bravo),0.45)] tw-items-center">{t('workspaces.remember-selected-value')}<input className="tw-absolute" name={'save-' + props.formKey} type="checkbox" id={'save-' + props.formKey} onChange={saveChange} defaultChecked={props.user_save} /><label className="tw-mb-0" htmlFor={'save-' + props.formKey}>Toggle</label></div>}
            </div>
        )
    }
}

export const localLaunchSelections = (image_id) => {
    const localSelections = JSON.parse(window.localStorage.getItem("launch_forms_" + image_id.replace(/-/gi, '')))
    let launchSelections = {}
    if (!_.isEmpty(localSelections)) {
        localSelections.forEach(selection => {
            launchSelections[selection.key] = selection.value
        })
    }
    return launchSelections
}

export const checkRequiredSectionsAgainstLocal = (image_id, form) => {

    const launchSelections = localLaunchSelections(image_id)
    const allRequiredSections = requiredSections(form, launchSelections)

    for (let i = 0; i < allRequiredSections.length; i++) {
        const section = allRequiredSections[i]
        if (_.isEmpty(launchSelections[section])) {
            return false
        }
    }
    return true
}

export const requiredSections = (form, selections) => {
    let fields = []
    form.forEach(element => {
        element.value = selections[element.key]
        const { display_if } = element
        let display = false
        if (_.isArray(display_if)) {
            display = orMatch(display_if, form)
        }
        if (_.isNull(display_if) || _.isEmpty(display_if)) {
            display = true
        }

        if (display && element.required) {
            fields.push(element.key)
        }

    })
    return fields
}

function SelectField(props) {
    const { options, help, required, value, formKey, onHandleChange } = props
    const { t } = useTranslation('common');
    return (
        <FormField tooltip={help} {...props}>
            <select
                className="input"
                required={required}
                id={formKey}
                name={formKey}
                onChange={onHandleChange}
                defaultValue={value}
            >
                <option value="">{t('workspaces.select')}</option>
                {options && options.map(opt => <option key={formKey + opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
        </FormField>
    )
}

function InputField(props) {
    const { help, required, value, formKey, onHandleChange, placeholder, validator_regex, validator_regex_description, type = 'text' } = props
    const [hidden, setHidden] = useState(true);
    const modifyType = type === 'password' && hidden === false ? 'text' : type
    return (
        <FormField tooltip={help} {...props}>
            <div className={classNames("input relative", type === 'password' ? 'password-field' : '')}>
                {props.disabled && <div className="tw-absolute tw-left-3 tw-top-3 text-muted-extra"><FontAwesomeIcon icon={faLock} /></div>}
                <input
                    type={modifyType}
                    required={required}
                    id={formKey}
                    name={formKey}
                    placeholder={placeholder}
                    onChange={onHandleChange}
                    defaultValue={value}
                    pattern={validator_regex}
                    title={validator_regex_description}
                />
                {type === 'password' && <i onMouseDown={() => setHidden(!hidden)}
                    className={classNames('!tw-top-0 !tw-right-0 tw-cursor-pointer tw-flex tw-justify-center tw-items-center tw-p-3 tw-h-full')}>
                    {hidden ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />}
                </i>}
            </div>
        </FormField>
    )

}

function TextAreaField(props) {
    const { help, required, value, formKey, onHandleChange, placeholder, textareatype = 'text' } = props
    const [hidden, setHidden] = useState(true);
    return (
        <FormField tooltip={help} {...props}>
            <div className={classNames("input relative")}>
                {props.disabled && <div className="tw-absolute tw-left-3 tw-top-3 text-muted-extra"><FontAwesomeIcon icon={faLock} /></div>}
                <textarea
                    className={classNames("tw-h-[120px]", hidden && textareatype === 'password' ? 'input-blur' : '')}
                    required={required}
                    id={formKey}
                    name={formKey}
                    placeholder={placeholder}
                    onChange={onHandleChange}
                    defaultValue={value}
                ></textarea>
                {textareatype === 'password' && <i onMouseDown={() => setHidden(!hidden)}
                    className={classNames('!tw-top-0 !tw-right-0 tw-absolute tw-cursor-pointer tw-flex tw-justify-center tw-items-center tw-p-3')}>
                    {hidden ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />}
                </i>}
            </div>
        </FormField>
    )
}
