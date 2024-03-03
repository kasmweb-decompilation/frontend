import React, { useState, useEffect, useRef, Fragment } from "react";
import { Dialog, Transition, Menu } from '@headlessui/react'
import _ from "lodash";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleNotch } from '@fortawesome/pro-light-svg-icons/faCircleNotch';
import { faTimes } from '@fortawesome/pro-light-svg-icons/faTimes';
import { useTranslation } from "react-i18next";

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export function ModalFooter(props) {
  const { saving, cancel, save = null, saveName, color, cancelButtonText } = props
  const { t } = useTranslation('common');
  return (
    <div className="tw-mt-5 sm:tw-mt-6 sm:tw-grid sm:tw-grid-flow-row-dense sm:tw-grid-cols-2 sm:tw-gap-3">
        <button type="button" className="cancelbutton" onClick={cancel}>{cancelButtonText ? cancelButtonText : t('buttons.Cancel')}</button>
        <button disabled={saving} type={save ? 'button' : 'submit'} onClick={save ? save : null} className={classNames("actionbutton", color ? color : "tw-bg-blue-500")}>{saving ? <div><FontAwesomeIcon icon={faCircleNotch} spin /></div> : t(saveName)}</button>
    </div>
  )
}

export function Modal(props) {
    const cancelButtonRef = useRef(null)
    const { open, setOpen, title, titleRaw, content, contentRaw, icon, iconBg, buttons, modalFooter, maxWidth = false, showCloseButton = false } = props;
    const { t } = useTranslation('common');
    return (
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="tw-relative tw-z-[999999]" initialFocus={cancelButtonRef} onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="tw-ease-out tw-duration-300"
            enterFrom="tw-opacity-0"
            enterTo="tw-opacity-100"
            leave="tw-ease-in tw-duration-200"
            leaveFrom="tw-opacity-100"
            leaveTo="tw-opacity-0"
          >
            <div className="tw-fixed tw-inset-0 tw-bg-black tw-bg-opacity-70 tw-transition-opacity" />
          </Transition.Child>
          <div className="tw-fixed tw-inset-0 tw-z-[999999] tw-overflow-y-auto">
            <div className="tw-flex tw-min-h-full tw-items-center tw-justify-center tw-p-4 tw-text-center sm:tw-p-0">
              <Transition.Child
                as={Fragment}
                enter="tw-ease-out tw-duration-300"
                enterFrom="tw-opacity-0 tw-translate-y-4 sm:tw-translate-y-0 sm:tw-scale-95"
                enterTo="tw-opacity-100 tw-translate-y-0 sm:tw-scale-100"
                leave="tw-ease-in tw-duration-200"
                leaveFrom="tw-opacity-100 tw-translate-y-0 sm:tw-scale-100"
                leaveTo="tw-opacity-0 tw-translate-y-4 sm:tw-translate-y-0 sm:tw-scale-95"
              >
                <Dialog.Panel className={"tw-relative tw-transform tw-rounded-xl tw-w-full tw-bg-[var(--modal-bg)] tw-px-4 tw-pb-4 tw-pt-5 tw-text-left tw-shadow-[0_0_15px_rgba(0,0,0,0.4)] tw-transition-all sm:tw-my-8 sm:tw-w-full sm:tw-p-6" + (maxWidth ? ' ' + maxWidth : ' sm:tw-max-w-lg')}>
                  {showCloseButton && <div onClick={() => setOpen(false)} className="tw-absolute tw-top-2 tw-group tw-cursor-pointer tw-right-2 tw-flex tw-w-8 tw-h-8 tw-transition-colors tw-rounded-full tw-bg-black/5 hover:tw-bg-black/10 dark:tw-bg-black/10 dark:hover:tw-bg-black/20 tw-justify-center tw-items-center"><FontAwesomeIcon className="" icon={faTimes} /></div>}
                  <div>
                    {icon &&
                    <div className={"tw-mx-auto tw-flex tw-h-12 tw-w-12 tw-items-center tw-justify-center tw-rounded-full " + (iconBg ||'')}>
                      {icon || ''}
                    </div>}
                    <div className="tw-mt-3 tw-text-center sm:tw-mt-5">
                      {(title || titleRaw) && (<Dialog.Title as="h4" className="tw-font-semibold tw-leading-6 dark:tw-text-gray-100">
                        {titleRaw || t(title) || ''}
                      </Dialog.Title>)}
                      <div className="tw-mt-2">
                        <div className="tw-text-sm tw-text-gray-500 dark:tw-text-gray-300">
                          {contentRaw || t(content) || ''}
                        </div>
                      </div>
                    </div>
                  </div>
                  {modalFooter && (
                    <React.Fragment>
                    {modalFooter}
                    </React.Fragment>
                  )}
                  {buttons && 
                  <div className="tw-mt-5 sm:tw-mt-6 sm:tw-grid sm:tw-grid-flow-row-dense sm:tw-grid-cols-2 sm:tw-gap-3">
                    {buttons || ''}
                  </div>}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    )
  }
  