import { faXmark } from "@fortawesome/free-solid-svg-icons/faXmark";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons/faEllipsis";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import React, { useState, useEffect, useRef, Fragment } from "react";
import { Transition } from "@headlessui/react";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons/faArrowRight";

export function ControlButton(props) {
    const { icon, disabledIcon, disabled = false, title, description, onClick, iconColor, type, open } = props

    let iconBg = 'tw-bg-blue-500'
    if (type === 'toggle') {
        iconBg = disabled ? 'tw-bg-gray-300' : 'tw-bg-emerald-500'
    }
    if (iconColor) {
        iconBg = iconColor
    }

    return (
        <button
            className={classNames("sidebar-icons", open ? 'tw-ring-2 tw-ring-blue-500' : '')}
            onClick={onClick}
        >
            <div className={classNames("sidebar-icon-container tw-text-white", iconBg)}>
                {!disabled && icon}
                {disabled && disabledIcon}
            </div>

            <div className="tw-flex tw-flex-col">
                <div className="tw-font-bold">{title}</div>
                <p className="tw-text-xs">
                    {description}
                </p>
            </div>
            {type === 'action' && !open && <div className="tw-ml-auto"><FontAwesomeIcon icon={faEllipsis} /></div>}
            {type === 'action' && open && <div className="tw-ml-auto"><FontAwesomeIcon icon={faXmark} /></div>}
            {type === 'redirect' && <div className="tw-ml-auto"><FontAwesomeIcon icon={faArrowRight} /></div>}
        </button>

    )
}

export function ToggleButton(props) {
    const { icon, disabledIcon, disabled = false, title, description, onClick, type, open } = props

    let iconBg = disabled ? 'tw-bg-gray-300 dark:tw-bg-gray-500' : 'tw-bg-emerald-500'

    return (
        <button
            className={classNames("sidebar-icons !tw-bg-transparent tw-flex tw-flex-col", open ? 'tw-ring-2 tw-ring-blue-500' : '')}
            onClick={onClick}
        >
            <div className={classNames("sidebar-icon-container tw-text-white", iconBg)}>
                {!disabled && icon}
                {disabled && disabledIcon}
            </div>

            <div className="tw-flex tw-flex-col">
                <div className="tw-font-bold tw-text-xs">{title}</div>
            </div>
        </button>

    )
}


export function ControlSection(props) {
    const { show, children } = props
    return (
        <Transition
            show={show}
            className="tw-w-full"
            enter="tw-transition-transform tw-duration-75"
            enterFrom="tw-scale-0"
            enterTo="tw-scale-100"
            leave="tw-transition-transform tw-duration-150"
            leaveFrom="tw-scale-100"
            leaveTo="tw-scale-0"
        >
            {children}
        </Transition>
    )

}