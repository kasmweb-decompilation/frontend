import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { Form, FormGroup, Label, CustomInput } from 'reactstrap';
import {useTranslation} from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons/faCheck";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons/faChevronLeft";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons/faChevronRight";
import { faTimes } from "@fortawesome/free-solid-svg-icons/faTimes";

export default function Wizard(props) {
  const dispatch = useDispatch()
  const { t } = useTranslation('common');

  const [step, setStep] = useState(0);
  const [dontShow, setDontShow] = useState(false);
  const [close, setClose] = useState(false);
  const [visibility, setVisibility] = useState(false);
  const [wizards, setWizards] = useState({});

  useEffect(() => {
    const localWizards = JSON.parse(window.localStorage.getItem("wizards"));
    if (localWizards) {
      if (localWizards[props.name] && localWizards[props.name].dontShow === false) {
        setVisibility(true)
      }
    } else {
      setVisibility(true)
    }
  }, []);


  const steps = props.steps

  const setState = (event) => {
    setDontShow(event.target.checked)
  }


  const closeWizard = async () => {
    let update = {}
    const localWizards = JSON.parse(window.localStorage.getItem("wizards"));
    update[props.name] = {
      dontShow: dontShow
    }
    window.localStorage.setItem("wizards", JSON.stringify({
      ...localWizards,
      ...update
    }))
    setClose(true)
    await new Promise(resolve => setTimeout(resolve, 300));
    setVisibility(false)
  }

  const closeClass = close ? 'tw-scale-50 tw-opacity-0' : ''

  const stepClass = (index) => {
    const current = 'tw-bg-blue-600 tw-border-blue-200'
    const completed = 'tw-bg-blue-600 tw-border-blue-700'
    const incomplete = 'tw-border-blue-700 tw-text-blue-700'
    if (index === step) {
      return {
        style: current,
        value: index + 1
      }
    }
    if (index < step) {
      return {
        style: completed,
        value: <FontAwesomeIcon icon={faCheck} />
      }
    }
    return {
      style: incomplete,
      value: index + 1
    }
  }

  const stepForward = () => {
    const current = step
    const next = current + 1
    if (next < steps.length) {
      setStep(next)
    }
  }

  const stepBack = () => {
    const current = step
    const previous = current - 1
    if (previous >= 0) {
      setStep(previous)
    }

  }


  return (
    <React.Fragment>
      {visibility && (
        <div className={'tw-flex tw-w-full tw-max-w-6xl tw-flex-col md:tw-flex-row tw-rounded tw-shadow tw-overflow-hidden tw-transition tw-duration-300 ' + closeClass}>
          <div className="tw-flex tw-flex-col tw-bg-model-bg tw-text-sm tw-w-full md:tw-max-w-md">
            <section className=" tw-grow tw-overflow-auto tw-flex">
              {steps.length > 1 && (
                <div className="tw-flex tw-flex-col tw-font-bold tw-p-4 tw-py-10 tw-gap-4 tw-bg-blue-500">
                  {props.steps.map((st, i) => {
                    return <div className={"tw-flex tw-w-10 tw-h-10 tw-justify-center tw-items-center tw-text-white tw-rounded-full tw-shadow tw-border-2 tw-border-solid " + stepClass(i).style}>{stepClass(i).value}</div>
                  })}
                </div>
              )
              }
              <div className="tw-flex tw-flex-col">
                <div className="tw-p-12 tw-grow tw-order-2 md:tw-order-1">
                  <div className="tw-font-bold tw-text-base tw-mb-4">{steps[step].name}</div>
                  <div>{steps[step].description}</div>
                </div>
                <footer className="tw-order-1 md:tw-order-2 tw-p-6 tw-h-16 tw-border-0 md:tw-border-t md:tw-border-b-0 tw-border-b tw-border-solid tw-border-black/10 dark:tw-border-slate-700/70 tw-flex tw-justify-between tw-items-center">
                  <CustomInput onClick={setState} type="checkbox" id="exampleCustomCheckbox" label={t("wizard.Do not show again")} />
                  <button onClick={() => closeWizard()} className="tw-rounded tw-h-10 tw-bg-pink-700 hover:tw-bg-slate-600 tw-text-sm tw-text-white tw-flex tw-items-center tw-transition">
                    <span className="tw-h-10 tw-w-12 tw-flex tw-justify-center tw-items-center tw-bg-black/10"><FontAwesomeIcon icon={faTimes} /></span>
                    <span className="tw-px-4">{t("wizard.Close")}</span>
                  </button>
                </footer>

              </div>

            </section>

          </div>
          <div className="tw-flex tw-flex-col tw-bg-model-bg tw-w-full tw-grow tw-left-shadow tw-border-0 tw-border-t tw-border-solid md:tw-border-t-0 tw-border-black/10 dark:tw-border-slate-700/70">
            <section className="tw-p-12 tw-grow tw-overflow-auto">
              {steps && steps[step].content}
            </section>
            {steps.length > 1 && (
              <footer className="tw-p-6 tw-h-16 tw-border-0 tw-border-t tw-border-solid tw-border-black/10 dark:tw-border-slate-700/70 tw-flex tw-justify-end tw-gap-4 tw-items-center">
                <button onClick={() => stepBack()} className="tw-rounded tw-h-10 tw-bg-slate-500 hover:tw-bg-slate-600 tw-text-sm tw-text-white tw-flex tw-items-center tw-transition">
                  <span className="tw-h-10 tw-w-12 tw-flex tw-justify-center tw-items-center tw-bg-black/10"><FontAwesomeIcon icon={faChevronLeft} /></span>
                  <span className="tw-px-4">{t("wizard.Previous")}</span>
                </button>

                <button onClick={() => stepForward()} className="tw-rounded tw-h-10 tw-bg-blue-500 hover:tw-bg-blue-600 tw-text-sm tw-text-white tw-flex tw-items-center tw-transition">
                  <span className="tw-px-4">{t("wizard.Next")}</span>
                  <span className="tw-h-10 tw-w-12 tw-flex tw-justify-center tw-items-center tw-bg-black/10"><FontAwesomeIcon icon={faChevronRight} /></span>

                </button>

              </footer>
            )}
          </div>
        </div>
      )}
    </React.Fragment>
  )
}