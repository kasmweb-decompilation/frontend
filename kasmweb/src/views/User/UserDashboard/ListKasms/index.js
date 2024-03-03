import React, { Component, useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import { setShowProfile, setProfileSection, setProfileDropdown } from "../../../../actions/actionDashboard";
import "react-circular-progressbar/dist/styles.css";
import {
  Card,
  Button,
  CardBody,
  Row,
  ModalBody,
  Col,
  Spinner,
  UncontrolledTooltip,
} from "reactstrap";
import { connect } from "react-redux";
import RemainingTime from "./RemainingTime";
import Proptypes from "prop-types";
import Select from "react-select";
import "react-select/dist/react-select.css";
import moment from "moment";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import ReactHtmlParser from "react-html-parser";
import {
  destroyKasms,
  stopKasms,
  pauseKasms,
  startKasms,
  getUserKasms,
  updateUserKasms,
  createKasms,
  getStatusKasms,
  updateKeepalive,
  getUserImages,
  getViewedKasms,
  getDockedSessions,
  setDockedSessions,
  getClientSettings,
} from "../../../../actions/actionDashboard";
import Image from "./image";
import { logout } from "../../../../actions/actionLogin";
import _ from "lodash";
import { NotificationManager } from "react-notifications";
import LoadingSpinner from "../../../../components/LoadingSpinner/index";
import { getUserUsageSummary } from "../../../../actions/actionUser";
import Wizard from "../../../../components/Wizard/Wizard/NoWorkspaces";
import {withTranslation, useTranslation} from "react-i18next";
import { Modal } from "../../../../components/Form/Modal";
import { ConfirmAction } from "../../../../components/Table/NewTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/pro-light-svg-icons/faCircleNotch";
import { faTrash } from "@fortawesome/pro-light-svg-icons/faTrash";
import { FormField } from "../../../../components/Form/Form";
import { faAlignJustify } from "@fortawesome/pro-light-svg-icons/faAlignJustify";
import { faExclamationTriangle } from "@fortawesome/pro-light-svg-icons/faExclamationTriangle";
import { faGlobe } from "@fortawesome/pro-light-svg-icons/faGlobe";
import { hasAuth } from "../../../../utils/axios";
import { LaunchForm } from "../../../../components/Form/LaunchForm";

var intervalID;
var timeouts = [];



const isDeletingStatus = (kasm) => {
  const deleting = [
    'deleting',
    'user_delete_pending',
    'admin_delete_pending'
  ]
  return _.includes(deleting, kasm.operational_status)
}

const isPausingStatus = (kasm) => {
  const pausing = [
    'pausing',
  ]
  return _.includes(pausing, kasm.operational_status)
}

const isStoppingStatus = (kasm) => {
  const stopping = [
    'stopping',
  ]
  return _.includes(stopping, kasm.operational_status)
}

const statusesThatShowSession = (kasm) => {
  const status = [
    'running',
    'stopped',
    'paused',
    'starting',
    'saving',
    'requested',
    'provisioning',
    'assigned',
    'deleting',
    'user_delete_pending',
    'admin_delete_pending',
    'stopping',
    'pausing'
  ]
  return _.includes(status, kasm.operational_status)
}


export function KasmIcon({ kasm }) {
  const image = _.get(kasm, 'image.image_src', 'img/favicon.png') || 'img/favicon.png'
  const name = _.get(kasm, 'image.friendly_name', '')
  return (
    <img
      onError={(e) => e.target.src = "img/favicon.png"}
      className="active-session-icon"
      src={image}
      alt={name} />
  )
}

function StatusIndicator({ kasm, position }) {
  let statusIndicatorClass = ' tw-bg-green-500 tw-animate-pulse'
  if (kasm.operational_status === 'paused') {
    statusIndicatorClass = ' tw-bg-yellow-500'
  }
  if (kasm.operational_status === 'stopped' || isDeletingStatus(kasm)) {
    statusIndicatorClass = ' tw-bg-red-500'
  }

  return (
    <span className={"tw-flex tw-z-10 tw-absolute tw-h-3 tw-rounded-full tw-w-3 tw-shadow-[0_0_0_2px_rgba(0,0,0,0.5)] " + position}>
      <span className={ "tw-absolute tw-inline-flex tw-h-full tw-w-full tw-rounded-full tw-opacity-75" + statusIndicatorClass}></span>
    </span>

  )
}

function SingleKasm({ kasm, screenShot, moveToDock, moveToDockMoving, onHandleResumeKasm, onDeleteConfirm, onStopConfirm, onPauseConfirm, onMinimizeSession, onMaximizeSession, client_settings, docked, createResumeClicked }) {
  const image = _.get(kasm, 'image.image_src', 'img/favicon.png') || 'img/favicon.png'
  const { t } = useTranslation('common');
  const [showOptions, setShowOptions] = useState(false);
  const currentTime = moment.utc()

  const expires = () => {
    if (kasm.operational_status === 'running') {
      if (currentTime > moment.utc(kasm.expiration_date)) {
        return <React.Fragment><Spinner color="primary" style={{ width: "14px", height: "14px", marginLeft: "30px" }} /></React.Fragment>
      } else {
        return <React.Fragment>{t("workspaces.Expires")} <RemainingTime className="tw-inline" current_time={moment.utc()} expiration_date={kasm.expiration_date} /></React.Fragment>
      }
    }
    else if (isDeletingStatus(kasm)) {
      return <span className={"tw-capitalize" + (isDeletingStatus(kasm) ? ' tw-text-red-600 tw-font-bold' : '')}>{isDeletingStatus(kasm) ? 'deleting' : kasm.operational_status} {isDeletingStatus(kasm) && (kasm.operational_progress + '%')}</span>
    }
    else if (isStoppingStatus(kasm)) {
      return <span className={"tw-capitalize" + (isStoppingStatus(kasm) ? ' tw-text-red-600 tw-font-bold' : '')}>{isStoppingStatus(kasm) ? 'stopping' : kasm.operational_status} {isStoppingStatus(kasm) && (kasm.operational_progress + '%')}</span>
    }
    else if (isPausingStatus(kasm)) {
      return <span className={"tw-capitalize" + (isPausingStatus(kasm) ? ' tw-text-yellow-600 tw-font-bold' : '')}>{isPausingStatus(kasm) ? 'pausing' : kasm.operational_status} {isPausingStatus(kasm) && (kasm.operational_progress + '%')}</span>
    }
  }
  return (
    <div id={'kasm' + kasm.kasm_id} style={{
      position: (moveToDock !== null && moveToDock.kasm_id === kasm.kasm_id) ? 'fixed' : 'relative',
      left: (moveToDock !== null && moveToDock.kasm_id === kasm.kasm_id) ? moveToDock.left + 'px' : '0',
      top: (moveToDock !== null && moveToDock.kasm_id === kasm.kasm_id) ? moveToDock.top + 'px' : '0',
      transform: (moveToDockMoving !== false && moveToDock !== null && moveToDock.kasm_id === kasm.kasm_id) ? 'translate(' + moveToDock.tx + 'px,' + moveToDock.ty + 'px) scale(10%)' : '',
    }} className={(moveToDock !== null && moveToDock.kasm_id === kasm.kasm_id && moveToDockMoving ? 'moving ' : '') + (moveToDock !== null && moveToDock.kasm_id === kasm.kasm_id ? 'moveToDock ' : '') + 'live-kasm-single'}>
      {kasm && !docked &&
      <button className="minimize tw-bg-transparent tw-cursor-pointer hover:tw-bg-yellow-500 hover:tw-border-yellow-700 tw-group" onClick={() => onMinimizeSession(kasm.kasm_id)}>
        <svg className="tw-fill-[color:var(--text-color)] group-hover:tw-fill-black" style={{ width: '9px' }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M0 256c0-17.7 14.3-32 32-32H480c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32z"/></svg>
      </button>
      }
      {kasm && docked &&
      <button className="minimize tw-bg-transparent hover:tw-bg-green-500 hover:tw-border-green-700 tw-group" onClick={() => onMaximizeSession(kasm.kasm_id)}>
        <svg className="tw-fill-[color:var(--text-color)] group-hover:tw-fill-black" style={{ width: '9px' }}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M240 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H176V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H384c17.7 0 32-14.3 32-32s-14.3-32-32-32H240V80z"/></svg>
      </button>
      }
      <div className="live-kasm-single-title tw-flex tw-items-center">
        <div className="icon-container"><KasmIcon kasm={kasm} /></div>
        <div className="tw-flex tw-flex-col single-details">
          <div className="single-title tw-whitespace-nowrap tw-overflow-ellipsis tw-overflow-hidden tw-max-w-[180px]">{kasm.image.friendly_name}</div>
          <div className="single-subline">{t("workspaces.Uptime")} <UpTime className="tw-inline tw-mr-4" start_date={kasm.start_date} /> {expires()}</div>
        </div>
      </div>

      <div className="live-kasm-single-preview tw-flex tw-justify-center tw-items-center">
        <div className="tw-p-1 tw-px-3 tw-text-xs tw-rounded tw-flex tw-z-10 tw-absolute tw-top-3 tw-right-3 tw-bg-slate-900/60 tw-text-white/80 tw-font-bold tw-justify-center tw-shadow">
          {kasm.kasm_id.slice(0,6)}
        </div>

        <StatusIndicator kasm={kasm} position="tw-bottom-3 tw-right-3" />
        <Image
          className="livekasmimg"
          status={kasm.operational_status}
          src={screenShot ? screenShot : ''}
          icon={image}
          alt="livekasmbg"
        />
      {!isDeletingStatus(kasm) && (
      <div className={ 'tw-absolute tw-inset-0 tw-bg-slate-900/90 tw-z-20 tw-transition-all tw-duration-300 tw-flex tw-flex-wrap tw-justify-evenly tw-items-center tw-py-4' + (showOptions ? ' tw-opacity-100 tw-scale-100' : ' tw-opacity-0 tw-scale-0')}>

        {kasm.operational_status === "running" && client_settings.allow_kasm_pause && kasm.image.image_type == "Container" &&
          <button
              className="text stop tw-group tw-flex tw-gap-2 tw-flex-col tw-items-center tw-text-slate-400 hover:tw-text-slate-300 tw-transition-all tw-duration-500 tw-uppercase tw-tracking-widest !tw-text-[10px] tw-bg-transparent tw-p-4 tw-py-1"
              onClick={(event) =>
                  onPauseConfirm(event, kasm)
              }
          >
              <span
                  className="tw-w-4 tw-h-4">
                <svg
                    className="tw-w-full tw-fill-slate-400 group-hover:tw-fill-yellow-500 tw-transition-all tw-duration-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"><path
                    d="M48 479h96c26.5 0 48-21.5 48-48V79c0-26.5-21.5-48-48-48H48C21.5 31 0 52.5 0 79v352c0 26.5 21.5 48 48 48zM32 79c0-8.8 7.2-16 16-16h96c8.8 0 16 7.2 16 16v352c0 8.8-7.2 16-16 16H48c-8.8 0-16-7.2-16-16V79zm272 400h96c26.5 0 48-21.5 48-48V79c0-26.5-21.5-48-48-48h-96c-26.5 0-48 21.5-48 48v352c0 26.5 21.5 48 48 48zM288 79c0-8.8 7.2-16 16-16h96c8.8 0 16 7.2 16 16v352c0 8.8-7.2 16-16 16h-96c-8.8 0-16-7.2-16-16V79z"/></svg>
              </span>
              {t("workspaces.Pause")}
          </button>
        }
        {(kasm.operational_status === "running" || kasm.operational_status === "paused") && client_settings.allow_kasm_stop && kasm.image.image_type == "Container" &&
          <button
              className="text stop tw-group tw-flex tw-gap-2 tw-flex-col tw-items-center tw-text-slate-400 hover:tw-text-slate-300 tw-transition-all tw-duration-500 tw-uppercase tw-tracking-widest !tw-text-[10px] tw-bg-transparent tw-p-4 tw-py-1"
              onClick={(event) =>
                  onStopConfirm(event, kasm)
              }
          >
            <span
                className="tw-w-4 tw-h-4">
              <svg className="tw-w-full tw-fill-slate-400 group-hover:tw-fill-red-500 tw-transition-all tw-duration-500" xmlns="http://www.w3.org/2000/svg"
                   viewBox="0 0 512 512"><path
                  d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm16 400c0 8.8-7.2 16-16 16H48c-8.8 0-16-7.2-16-16V80c0-8.8 7.2-16 16-16h352c8.8 0 16 7.2 16 16v352z"/></svg>
            </span>
            {t("workspaces.Stop")}
          </button>
         }
        {client_settings.allow_kasm_delete &&
          <button
            className="text delete tw-group tw-flex tw-gap-2 tw-flex-col tw-items-center tw-text-slate-400 hover:tw-text-slate-300 tw-transition-all tw-duration-500 tw-uppercase tw-tracking-widest !tw-text-[10px] tw-bg-transparent tw-p-4 tw-py-1"
            onClick={(event) =>
              onDeleteConfirm(event, kasm)
            }
          >
          <span className="tw-w-4 tw-h-4">
            <svg className="tw-w-full tw-fill-slate-400 group-hover:tw-fill-red-600 tw-transition-all tw-duration-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M432 64C440.8 64 448 71.16 448 80C448 88.84 440.8 96 432 96H413.7L388.2 452.6C385.9 486.1 357.1 512 324.4 512H123.6C90.01 512 62.15 486.1 59.75 452.6L34.29 96H16C7.164 96 0 88.84 0 80C0 71.16 7.164 64 16 64H111.1L137 22.56C145.8 8.526 161.2 0 177.7 0H270.3C286.8 0 302.2 8.526 310.1 22.56L336.9 64H432zM177.7 32C172.2 32 167.1 34.84 164.2 39.52L148.9 64H299.1L283.8 39.52C280.9 34.84 275.8 32 270.3 32H177.7zM381.6 96H66.37L91.67 450.3C92.87 467 106.8 480 123.6 480H324.4C341.2 480 355.1 467 356.3 450.3L381.6 96z" /></svg>
          </span>
          {t("workspaces.Delete")}
        </button>

        }
        </div>
        )}
      </div>
      {!isDeletingStatus(kasm) && !isStoppingStatus(kasm) && !isPausingStatus(kasm) && (
      <div className="live-kasm-single-buttons">
        {createResumeClicked === false &&
        <button
          className="text resume tw-group tw-uppercase tw-tracking-widest !tw-text-[11px] tw-w-1/2 tw-flex tw-justify-center"
          onClick={() => onHandleResumeKasm(kasm)}
        >
          <span className="button-icon">
            {<svg className="tw-w-full tw-transition-all tw-duration-500 group-hover:tw-fill-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M24.52 38.13C39.66 29.64 58.21 29.99 73.03 39.04L361 215C375.3 223.8 384 239.3 384 256C384 272.7 375.3 288.2 361 296.1L73.03 472.1C58.21 482 39.66 482.4 24.52 473.9C9.377 465.4 0 449.4 0 432V80C0 62.64 9.377 46.63 24.52 38.13V38.13zM56.34 66.35C51.4 63.33 45.22 63.21 40.17 66.04C35.13 68.88 32 74.21 32 80V432C32 437.8 35.13 443.1 40.17 445.1C45.22 448.8 51.41 448.7 56.34 445.7L344.3 269.7C349.1 266.7 352 261.6 352 256C352 250.4 349.1 245.3 344.3 242.3L56.34 66.35z" /></svg>}
          </span>
          {t("workspaces.Resume")}
        </button>
        }
        {createResumeClicked &&  <button className="text resume tw-text-color tw-w-1/2 tw-flex tw-justify-center"><FontAwesomeIcon icon={faCircleNotch} className="tw-text-lg" spin /></button>}
        { (client_settings.allow_kasm_delete || client_settings.allow_kasm_stop || client_settings.allow_kasm_pause) &&
        <button className="tw-group tw-w-1/2 tw-flex tw-justify-end"
        onClick={() => setShowOptions(!showOptions)}>
          <svg className={"tw-w-5 tw-mr-8 tw-transition-all tw-duration-500 group-hover:tw-fill-blue-500" + (showOptions ? ' tw-fill-blue-500' : ' tw-fill-text')} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M480 256C480 291.3 451.3 320 416 320C380.7 320 352 291.3 352 256C352 220.7 380.7 192 416 192C451.3 192 480 220.7 480 256zM416 224C398.3 224 384 238.3 384 256C384 273.7 398.3 288 416 288C433.7 288 448 273.7 448 256C448 238.3 433.7 224 416 224zM320 256C320 291.3 291.3 320 256 320C220.7 320 192 291.3 192 256C192 220.7 220.7 192 256 192C291.3 192 320 220.7 320 256zM256 224C238.3 224 224 238.3 224 256C224 273.7 238.3 288 256 288C273.7 288 288 273.7 288 256C288 238.3 273.7 224 256 224zM32 256C32 220.7 60.65 192 96 192C131.3 192 160 220.7 160 256C160 291.3 131.3 320 96 320C60.65 320 32 291.3 32 256zM96 288C113.7 288 128 273.7 128 256C128 238.3 113.7 224 96 224C78.33 224 64 238.3 64 256C64 273.7 78.33 288 96 288z"/></svg>
        </button>
        }


      </div>
      )}
    </div>
  );

}


function UsageCounter({ props, state }) {

  const { usageSummary } = props;
  const { t } = useTranslation('common');
  const [showinfo, setShowinfo] = useState(false);
  let interval = "";
  let intervalTranslation = {
    total: "",
    monthly: t("workspaces.This Month"),
    weekly: t("workspaces.This Week"),
    daily: t("workspaces.Today"),
  };

  if (usageSummary && usageSummary.usage_limit_remaining) {
    let percent = 0;
    if (usageSummary.usage_limit_remaining > 0) {
      percent =
        100 -
        (usageSummary.usage_limit_remaining /
          usageSummary.usage_limit_hours) *
        100;
    } else {
      percent = 100;
    }

    let color = "info";

    if (percent > 70) {
      color = "warning";
    } 
    if (percent > 90) {
      color = "danger";
    } 
  }

  if (usageSummary) {
    interval = intervalTranslation[usageSummary.usage_limit_interval];
    if (usageSummary.usage_limit_type === "per_group") {
      interval += ". " + t("workspaces.shared_usage");
    }
  }

  const limitHours = (usageSummary && usageSummary.usage_limit_hours) || 0;
  const remainingHours =
    (usageSummary &&
      usageSummary.usage_limit_remaining &&
      usageSummary.usage_limit_remaining < 0
      ? 0
      : usageSummary &&
      usageSummary.usage_limit_remaining &&
      usageSummary.usage_limit_remaining.toFixed(1)) || 0;

  let percentage = ((limitHours - remainingHours) / limitHours) * 100;

  if (remainingHours === 0) percentage = 100;

  const isRed = percentage > 75 ? true : false;
  const isYellow = percentage > 50 && percentage <= 75 ? true : false;
  const isGreen = percentage > 0 && percentage <= 50 ? true : false;



  return (
    <div className="session-container">
      {usageSummary && usageSummary.usage_limit ? (
        <React.Fragment>
          <div
            className={`session-single usage ${isRed
              ? "red-stroke"
              : isYellow
                ? "yellow-stroke"
                : isGreen
                  ? "green-stroke"
                  : ""
              }`}
            onClick={() => setShowinfo(!showinfo)}
          >
            <CircularProgressbar
              value={percentage && percentage.toFixed()}
              text={`${percentage && percentage.toFixed()
                }%`}
            />
          </div>
          <Card className={'mb-4 session-details ' + (showinfo === true ? 'show' : 'hide')}>
            <div className="session-header"><h4>{t("workspaces.Usage details")} - {interval}</h4></div>
            <CardBody>
              <div
                className={`display ${isRed
                  ? "red-stroke"
                  : isYellow
                    ? "yellow-stroke"
                    : isGreen
                      ? "green-stroke"
                      : ""
                  }`}
              >

                <CircularProgressbar
                  value={percentage && percentage.toFixed()}
                  text={`${percentage && percentage.toFixed()
                    }%`}
                />
              </div>
              <div style={{ marginTop: '30px' }} className="time-wrapper">
                <div className="item">
                  <div className="uptime">{t("workspaces.Allowance")}</div>
                  <div className="text-value">{usageSummary.usage_limit_hours} {t("workspaces.hours")}</div>
                </div>
                <div className="item">
                  <div className="uptime">{t("workspaces.Used")}</div>
                  <div className="text-value">{(usageSummary.usage_limit_hours - usageSummary.usage_limit_remaining).toFixed(1)} {t("workspaces.hours")}</div>
                </div>
              </div>

              <div style={{ marginTop: '30px' }} className="standalone-div text-center">
                <button onClick={() => {
                  props.setProfileSection('sessionusage');
                  props.setProfileDropdown(true);
                  props.setShowProfile(true);
                }} className="tw-mx-auto tw-rounded tw-h-10 tw-bg-blue-500 hover:tw-bg-slate-600 tw-text-white tw-flex tw-items-center tw-transition">
                  <span className="tw-w-44">{t("workspaces.More details on usage")}</span>

                </button>

              </div>
            </CardBody>
          </Card>
        </React.Fragment>
      ) : (
        ""
      )}
    </div>
  )

}


function UpTime(props) {
  let current = moment.utc(props.current_time)
  let start = moment.utc(props.start_date)

  if(!start.isValid()) {
    return <div className={props.className}>-</div>
  }

  return (
    <div className={props.className}>
      {current
        .diff(start, 'days')
        ? current.diff(start, 'days') + 'd '
        : ""}
      {current
        .diff(start, 'hours')
        ? moment.utc(current.diff(start, 'hh:mm:ss')).format("HH[h] ")
        : ""}
      {moment.utc(current.diff(start, 'hh:mm:ss')).format("mm[m]")}
    </div>
  )
}

class Listkasms extends Component {
  constructor(props) {
    super(props);
    this.containerRef = React.createRef();
    this.launchRef = React.createRef();
    this.state = {
      isSessionScreenshotLoaded: false,
      modal: false,
      stopModal: false,
      pauseModal: false,
      deleteConfirm: null,
      stopConfirm: null,
      videoQuality: window.localStorage.getItem("kasm_video_quality") ? JSON.parse(window.localStorage.getItem("kasm_video_quality")) : 1,
      kasmId: "",
      deleteKasmName: "",
      deleteKasmImage: "",
      stopKasmName: "",
      stopKasmImage: "",
      pauseKasmName: "",
      pauseKasmImage: "",
      currentId: null,
      url: "",
      activeCard: false,
      loader: false,
      attempt: 0,
      progressBarValues: [],
      pointPresenceValues: [],
      persistentProfileValues: [],
      zoneSelections: {},
      networkSelections: {},
      refreshing: false,
      updating: false,
      showTips: true,
      toggleControlPanel: false,
      createClicked: false,
      createResumeClicked: false,
      disconnect: false,
      deleteClicked: false,
      stopClicked: false,
      pauseClicked: false,
      dropdownOpen: false,
      availableKasms: [],
      isLaunchModal: false,
      zoneDropDown: false,
      appToLaunch: null,
      selectedKasmData: {},
      valueGroups: {},
      isPickerShow: false,
      searchTerm: "",
      showResetConfirmationDialog: false,
      resetConfirmationText: "",
      activeKasmItem: null,
      moveToDock: null,
      moveToDockMoving: false,
      liveKasms: [],
      processing: false,
      tiletype: 'rectangular',
      openTabIn: 'current'
    };
    this.deleteConfirm = this.deleteConfirm.bind(this);
    this.stopConfirm = this.stopConfirm.bind(this);
    this.pauseConfirm = this.pauseConfirm.bind(this);
    this.destroyKasms = this.destroyKasms.bind(this);
    this.stopKasms = this.stopKasms.bind(this);
    this.pauseKasms = this.pauseKasms.bind(this);
    this.initializePointsofPresence = this.initializePointsofPresence.bind(
      this
    );
    this.initializePersistentProfile = this.initializePersistentProfile.bind(
      this
    );
    this.initializeZones = this.initializeZones.bind(this);
    this.initializeNetworks = this.initializeNetworks.bind(this);
    this.renderLiveKasms = this.renderLiveKasms.bind(this);
    this.renderDockKasms = this.renderDockKasms.bind(this);
    this.renderAvailableKasms = this.renderAvailableKasms.bind(this);
    this.toggle = this.toggle.bind(this);
    this.toggleStopModal = this.toggleStopModal.bind(this);
    this.togglePauseModal = this.togglePauseModal.bind(this);
    this.toggleCard = this.toggleCard.bind(this);
    this.createKasm = this.createKasm.bind(this);
    this.handlePointPresenceDropDown = this.handlePointPresenceDropDown.bind(
      this
    );
    this.handlePersistentProfileDropDown = this.handlePersistentProfileDropDown.bind(
      this
    );
    this.handleResumeKasm = this.handleResumeKasm.bind(this);
    this.stateFunctionUrl = this.stateFunctionUrl.bind(this);
    this.toggleDrop = this.toggleDrop.bind(this);
    this.updateProgressBarValue = this.updateProgressBarValue.bind(this);
    this.handleDisconnect = this.handleDisconnect.bind(this);
    this.defaultThumb = this.defaultThumb.bind(this);
    this.renderJoinedKasms = this.renderJoinedKasms.bind(this);
    this.toggleDropDown = this.toggleDropDown.bind(this);
    this.launchModal = this.launchModal.bind(this);
    this.toggleLaunchModal = this.toggleLaunchModal.bind(this);
    this.toggleZone = this.toggleZone.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.togglePicker = this.togglePicker.bind(this);
    this.verifyResetConfirmation = this.verifyResetConfirmation.bind(this);
    this.openLink = this.openLink.bind(this);
    this.showKasmInfo = this.showKasmInfo.bind(this);
    this.minimizeSession = this.minimizeSession.bind(this);
    this.filteredKasms = this.filteredKasms.bind(this);
    this.dockedWorkspaces = this.dockedWorkspaces.bind(this);
    this.liveWorkspaces = this.liveWorkspaces.bind(this);
    this.menuBarRef = React.createRef(null);
  }

  filteredKasms() {
    const { liveKasms } = this.props;

    let filteredKasms = []
    if (liveKasms && liveKasms.length > 0){
      filteredKasms = liveKasms.filter((i)=> statusesThatShowSession(i))
    }

    return filteredKasms
  }

  dockedWorkspaces() {
    let workspaces = this.filteredKasms()
    workspaces = workspaces.filter(x => this.props.dockedSessions.includes(x.kasm_id))
    return workspaces
  }

  liveWorkspaces() {
    let workspaces = this.filteredKasms()
    workspaces = workspaces.filter(x => !this.props.dockedSessions.includes(x.kasm_id))
    return workspaces
  }

  openLink(url) {
    console.log("Opening URL " + url)
    if (this.state.openTabIn === 'new' || this.state.openTabIn === 'window') {
      const inWindow = (this.state.openTabIn === 'window') ? 'resizable=yes,top=0,left=0,width=800,height=640' : null
      window.open(url, '_blank', inWindow)
    } else {
      window.location.href = url;
    }
  }

  async updateDockedSessions(kasm_id) {
    const kasm = this.props.liveKasms.find(o => o.kasm_id === kasm_id)
    const dockedSessions = [
      ...this.props.dockedSessions,
      kasm.kasm_id
    ];

    await this.props.setDockedSessions(dockedSessions)
  }

  async minimizeSession(kasm_id) {
    const start = document.getElementById('kasm' + kasm_id); // Active session that minimise was clicked on
    const startposition = start.getBoundingClientRect()

    const node = this.containerRef.current; // Docked session container
    const rect = node.getBoundingClientRect();

    this.setState({
      moveToDock: {
        kasm_id: kasm_id,
        left: startposition.x - 20,
        top: startposition.y - 100
      }
    })

    await new Promise(resolve => setTimeout(resolve, 50)); // A small pause is needed overwise the move doesn't trigger
    this.setState({
      moveToDockMoving: true, moveToDock: {
        ...this.state.moveToDock,
        kasm_id: kasm_id,
        tx: rect.x - this.state.moveToDock.left - 125,
        ty: rect.y - this.state.moveToDock.top - 180
      }
    })

    await new Promise(resolve => setTimeout(resolve, 300)); // The animation moving to the dock takes 300ms so wait for it to finish before updating the docked list
    await this.updateDockedSessions(kasm_id)
    this.setState({ moveToDockMoving: false, moveToDock: null });
  }
  async maximiseSession(kasm_id) {
    let arr = [...this.props.dockedSessions];
    const indexOfObject = arr.indexOf(kasm_id);
    arr.splice(indexOfObject, 1);
    await this.props.setDockedSessions(arr)
  }

  togglePicker() {
    this.setState(({ isPickerShow }) => ({
      isPickerShow: !isPickerShow,
    }));

    if (!this.state.isPickerShow) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }

  defaultThumb(e) {
    e.target.src = "img/favicon.png";
  }
  toggleZone() {
    this.setState({
      zoneDropDown: !this.state.zoneDropDown,
    });
  }

  launchModal(selectedData) {
    this.setState({
      isLaunchModal: !this.state.isLaunchModal,
      selectedKasmData: selectedData,
    });
  }
  toggleLaunchModal(event) {
    this.setState({
      isLaunchModal: !this.state.isLaunchModal,
    });
  }

  // Update the value in response to user picking event
  handleChange(name, value) {
    this.setState(({ valueGroups }) => ({
      valueGroups: {
        ...valueGroups,
        [name]: value,
      },
    }));
  }

  stateFunctionUrl() {
    this.setState({ url: "" });
  }

  deleteConfirm(event, kasm) {
    event.stopPropagation();
    this.setState({ modal: !this.state.modal, kasmId: kasm.kasm_id, deleteKasmName: kasm.image.friendly_name, deleteKasmImage: kasm.image.image_src });
  }

  stopConfirm(event, kasm) {
    event.stopPropagation();
    this.setState({ stopModal: !this.state.stopModal, kasmId: kasm.kasm_id, stopKasmName: kasm.image.friendly_name, stopKasmImage: kasm.image.image_src });
  }

  pauseConfirm(event, kasm) {
    event.stopPropagation();
    this.setState({ pauseModal: !this.state.pauseModal, kasmId: kasm.kasm_id, pauseKasmName: kasm.image.friendly_name, pauseKasmImage: kasm.image.image_src });
  }

  handleDisconnect() {
    this.stateFunctionUrl();
    this.setState({
      attempt: 0,
      showTips: false,
      disconnect: true,
    });
    this.delay_check_load();
  }

  toggleDropDown() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen,
    });
  }

  handleResumeKasm(kasm) {
    this.setState({ kasmId: kasm.kasm_id, createResumeClicked: true });

    if (kasm.operational_status === "stopped" || kasm.operational_status === "paused" || kasm.operational_status === "saving"){
      this.props
      .startKasms(kasm.kasm_id)
      .then(() => this.handleStartSuccess(kasm))
      .catch(() => this.handleStartError());
    }
    else{
      this.props
      .getStatusKasms(kasm.kasm_id)
      .then(() => {
        if (this.state.openTabIn === 'new' || this.state.openTabIn === 'window') {
          const inWindow = (this.state.openTabIn === 'window') ? 'resizable=yes,top=0,left=0,width=800,height=640' : null
          window.open("/#/kasm/" + kasm.kasm_id, '_blank', inWindow)
          timeouts.push(setTimeout(function () { this.props.getUserKasms({ getuserkasmsLoading: false }) }.bind(this), 10000)) // update after 10 seconds to give time for session to update
        } else {
          this.props.history.push("/kasm/" + kasm.kasm_id);
        }
      })
      .catch(
        () => this.setState({ kasmId: kasm.kasm_id, createResumeClicked: false }),
        "Unable to Fetch API Data"
      );
    }


  }

  destroyKasms() {
    this.setState({
      deleteClicked: true,
    });

    this.props
      .destroyKasms(this.state.kasmId)
      .then(() => this.handleDeleteSuccess())
      .catch(() => this.handleDeleteError());
  }

  stopKasms() {
    this.setState({
      stopClicked: true,
    });

    this.props
      .stopKasms(this.state.kasmId)
      .then(() => this.handleStopSuccess())
      .catch(() => this.handleStopError());
  }
  
  pauseKasms() {
    this.setState({
      pauseClicked: true,
    });

    this.props
      .pauseKasms(this.state.kasmId)
      .then(() => this.handlePauseSuccess())
      .catch(() => this.handlePauseError());
  }

  toggle() {
    this.setState({ modal: !this.state.modal });
  }

  toggleStopModal() {
    this.setState({ stopModal: !this.state.stopModal });
  }
  
  togglePauseModal() {
    this.setState({ pauseModal: !this.state.pauseModal });
  }

  handlePointPresenceDropDown(imageId, value) {
    let pointPresenceValues = this.state.pointPresenceValues;
    pointPresenceValues.map((image) => {
      if (image.imageId === imageId) {
        image.value = value;
      }
    });
    this.setState({ pointPresenceValues });
  }

  handlePersistentProfileDropDown(imageId, value) {
    let persistentProfileValues = this.state.persistentProfileValues;
    persistentProfileValues.map((image) => {
      if (image.imageId === imageId) {
        image.value = value;
      }
    });
    this.setState({ persistentProfileValues });
  }

  handleZoneDropDown(imageId, value) {
    let zoneSelections = this.state.zoneSelections;

    zoneSelections[imageId] = value;
    this.setState({ zoneSelections: zoneSelections });
  }

  handleNetworksDropDown(imageId, value) {
    let networkSelections = this.state.networkSelections;

    networkSelections[imageId] = value;
    this.setState({ networkSelections: networkSelections });
  }

  toggleCard() {
    this.state({ card3: !this.state.card3 });
  }

  handleDeleteSuccess() {
    const { destroyKasmsErrorMessage, t } = this.props;
    if (destroyKasmsErrorMessage) {
      NotificationManager.error(destroyKasmsErrorMessage, t("workspaces.Delete Session"), 3000);
    } else {
      this.setState({ modal: false, deleteClicked: false });
      this.props.getUserKasms({ getuserkasmsLoading: false });
      this.props.getUserUsageSummary();
      NotificationManager.success(
        t("workspaces.Successfully Deleted Session"),
        t("workspaces.Delete Session"),
        3000
      );
    }
  }

  handleStopSuccess() {
    const { stopKasmsErrorMessage, t } = this.props;
    if (stopKasmsErrorMessage) {
      NotificationManager.error(stopKasmsErrorMessage, t("workspaces.Stop Session"), 3000);
      this.setState({ stopClicked: false });
    } else {
      this.setState({ stopModal: false, stopClicked: false });
      this.props.getUserKasms({ getuserkasmsLoading: false });
      this.props.getUserUsageSummary();
      NotificationManager.success(
        t("workspaces.Successfully Stopped Session"),
        t("workspaces.Stop Session"),
        3000
      );
    }
  }
  
  handlePauseSuccess() {
    const { pauseKasmsErrorMessage, t } = this.props;
    if (pauseKasmsErrorMessage) {
      NotificationManager.error(pauseKasmsErrorMessage, t("workspaces.Pause Session"), 3000);
      this.setState({ pauseClicked: false });
    } else {
      this.setState({ pauseModal: false, pauseClicked: false });
      this.props.getUserKasms({ getuserkasmsLoading: false });
      this.props.getUserUsageSummary();
      NotificationManager.success(
        t("workspaces.Successfully Paused Session"),
        t("workspaces.Pause Session"),
        3000
      );
    }
  }


  handleStartSuccess(kasm) {
    const { startKasmsErrorMessage, t } = this.props;
    if (startKasmsErrorMessage) {
      NotificationManager.error(startKasmsErrorMessage, t("workspaces.Start Session"), 3000);
    } else {
      const userInfo = JSON.parse(window.localStorage.user_info);
      this.setState({ modal: false, createResumeClicked: false });
      this.props.getUserKasms({ getuserkasmsLoading: false });
      this.props.getUserUsageSummary();
      NotificationManager.success(
        t("workspaces.Successfully Started Session"),
        t("workspaces.Start Session"),
        3000
      );
      this.props
      .getStatusKasms(kasm.kasm_id)
      .then(() => {
        if (this.state.openTabIn === 'new' || this.state.openTabIn === 'window') {
          const inWindow = (this.state.openTabIn === 'window') ? 'resizable=yes,top=0,left=0,width=800,height=640' : null
          window.open("/#/kasm/" + kasm.kasm_id, '_blank', inWindow)
          timeouts.push(setTimeout(function () { this.props.getUserKasms({ getuserkasmsLoading: false }) }.bind(this), 10000)) // update after 10 seconds to give time for session to update
        } else {
          this.props.history.push("/kasm/" + kasm.kasm_id);
        }
      })
      .catch(
        () => this.setState({ kasmId: kasm.kasm_id, createResumeClicked: false }),
        "Unable to Fetch API Data"
      );
    }
  }

  verifyResetConfirmation(text) {
    if (text === "reset") {
      this.setState({
        resetConfirmationText: text,
        showResetConfirmationDialog: false
      }, () =>
        this.createKasm(this.state.selectedKasmData.image_id, this.state.selectedKasmData.available)
      );
    }
  }

  createKasm(imageId, available) {
    const { t } = this.props;
    if (!available) {
      NotificationManager.error(
        t("workspaces.agent_download"),
        t("workspaces.Image Loading"),
        3000
      );
      return;
    }

    // make sure the user confirmed resetting a persistent profile
    const persistentProfileSettings = this.state.persistentProfileValues.find(profile =>
      profile.imageId === imageId
    );

    if (persistentProfileSettings.value.value === "Reset" && this.state.resetConfirmationText !== "reset") {
      this.setState({ showResetConfirmationDialog: true });
      return;
    }

    this.setState({ currentId: imageId, createClicked: true, resetConfirmationText: "" });
    let currentImage = this.state.pointPresenceValues.find(
      (image) => image.imageId === imageId
    );
    let currentImage2 = this.state.persistentProfileValues.find(
      (image) => image.imageId === imageId
    );
    let selectedZone = this.state.zoneSelections[imageId];
    let selectedNetwork = this.state.networkSelections[imageId];
    let persistent_profile_mode =
      currentImage2 && currentImage2.value ? currentImage2.value.value : "";
    window.localStorage.setItem(
      "persistent_profile_mode",
      persistent_profile_mode
    );
    this.props
      .createKasms({
        point_of_presence:
          currentImage && currentImage.value ? currentImage.value.value : "",
        persistent_profile_mode: persistent_profile_mode,
        image_id: imageId,
        x_res: window.innerWidth,
        y_res: window.innerHeight,
        zone_id: selectedZone && selectedZone.value ? selectedZone.value : "",
        network_id: selectedNetwork && selectedNetwork.value ? selectedNetwork.value : "",
        launch_selections: this.props.launchSelections || {}
      })
      .then(() => {
        this.handleCreateSuccess();
      })
      .catch(() => this.handleCreateError());
  }

  handleDeleteError() {
    const { deleteKasmsError, t } = this.props;
    this.setState({ modal: false, createClicked: false, deleteClicked: false, stopClicked: false, pauseClicked: false });
    if (deleteKasmsError) {
      NotificationManager.error(deleteKasmsError, t("workspaces.Delete Session"), 3000);
    } else {
      NotificationManager.error(t("workspaces.Failed to Delete Session"), t("workspaces.Delete Session"), 3000);
    }
  }

  handleStopError() {
    const { stopKasmsError, t } = this.props;
    this.setState({ stopModal: false, stopClicked: false });
    if (stopKasmsError) {
      NotificationManager.error(stopKasmsError, t("workspaces.Stop Session"), 3000);
    } else {
      NotificationManager.error(t("workspaces.Failed to Stop Session"), t("workspaces.Stop Session"), 3000);
    }
  }
  
  handlePauseError() {
    const { pauseKasmsError, t } = this.props;
    this.setState({ pauseModal: false, pauseClicked: false });
    if (pauseKasmsError) {
      NotificationManager.error(pauseKasmsError, t("workspaces.Pause Session"), 3000);
    } else {
      NotificationManager.error(t("workspaces.Failed to Pause Session"), t("workspaces.Pause Session"), 3000);
    }
  }

  handleStartError() {
    const { startKasmsError, t } = this.props;
    this.setState({ createClicked: false, deleteClicked: false, startClicked: false});
    if (startKasmsError) {
      NotificationManager.error(startKasmsError, t("workspaces.Start Session"), 3000);
    } else {
      NotificationManager.error(t("workspaces.Failed to Start Session"), t("workspaces.Start Session"), 3000);
    }
  }

  handleCreateError() {
    const { createKasmsError, errorCreateMessageDetail, t } = this.props;
    this.setState({ createClicked: false });
    if (createKasmsError) {
      NotificationManager.error(createKasmsError, t("workspaces.Create Session"), 3000);
      if (errorCreateMessageDetail) {
        console.error(errorCreateMessageDetail);
      }
    } else {
      NotificationManager.error(t("workspaces.Gateway Time-out"), t("workspaces.Create Session"), 3000);
    }
  }

  handleCreateSuccess() {
    const { errorCreateMessage, errorCreateMessageDetail, t } = this.props;
    this.setState({ createClicked: false });
    if (errorCreateMessage) {
      NotificationManager.error(errorCreateMessage, t("workspaces.Create Kasm"), 3000);
      if (errorCreateMessageDetail) {
        console.error(errorCreateMessageDetail);
      }
    } else {
      NotificationManager.success(t("workspaces.Kasm Created"), t("workspaces.Successfully Created Kasm"));
      const { createdKasms, getStatusKasms } = this.props;
      if (createdKasms.kasm_id) {
        if (this.state.openTabIn === 'new' || this.state.openTabIn === 'window') {
          const inWindow = (this.state.openTabIn === 'window') ? 'resizable=yes,top=0,left=0,width=800,height=640' : null
          window.open("/#/kasm/" + createdKasms.kasm_id, '_blank', inWindow)
          this.toggleLaunchModal()
          this.props.getUserKasms({ getuserkasmsLoading: false })
          timeouts.push(setTimeout(function () { this.props.getUserKasms({ getuserkasmsLoading: false }) }.bind(this), 10000)) // update after 10 seconds to give screenshot time to generate
        } else {
          this.props.history.push("/kasm/" + createdKasms.kasm_id);
        }
      }
    }
  }

  toggleDrop(index) {
    index === this.state.activeCard
      ? this.setState({ activeCard: null })
      : this.setState({ activeCard: index });
  }

  updateProgressBarValue() {
    let dataCopy = [];
    const self = this;
    this.props.liveKasms &&
      this.props.liveKasms.length > 0 &&
      this.props.liveKasms.map((kasm) => {
        const now = new Date();
        const utc = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
        const start_date = new Date(kasm.start_date);
        const end_date = new Date(kasm.expiration_date);
        let seconds = (end_date - start_date) / 1000;
        dataCopy.push({
          current_time: (utc - start_date) / 1000,
          expiry_time: seconds,
        });
      });

    intervalID = setInterval(function () {
      dataCopy.map((item, index) => {
        dataCopy[index].current_time = item.current_time + 1;
      });
      // FIXME KASM-365. Setting the state causes the full page to be re-rendered
      self.setState({ progressBarValues: dataCopy });
    }, 1000);
  }

  initializePointsofPresence(availableKasms) {
    let pointPresenceValues = [];
    availableKasms.map((kasm) =>
      pointPresenceValues.push({ imageId: kasm.image_id, value: "" })
    );
    this.setState({ pointPresenceValues });
  }

  initializePersistentProfile(availableKasms) {
    let persistentProfileValues = [];

    let cached_persistent_profile_mode = window.localStorage.getItem(
      "persistent_profile_mode"
    );
    if (
      !cached_persistent_profile_mode ||
      (cached_persistent_profile_mode &&
        cached_persistent_profile_mode != "Disabled")
    ) {
      cached_persistent_profile_mode = "Enabled";
    }

    availableKasms.map((kasm) =>
      persistentProfileValues.push({
        imageId: kasm.image_id,
        value: {
          key: cached_persistent_profile_mode,
          value: cached_persistent_profile_mode,
        },
      })
    );
    this.setState({ persistentProfileValues });
  }

  initializeZones(availableKasms) {
    let zoneSelections = {};

    availableKasms.map((kasm) => (zoneSelections[kasm.image_id] = ""));
    this.setState({ zoneSelections: zoneSelections });
  }

  initializeNetworks(availableKasms) {
    let networkSelections = {};

    availableKasms.map((kasm) => (networkSelections[kasm.image_id] = ""));
    this.setState({ networkSelections: networkSelections });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.availableKasms) {
      const newArray =
        this.state.availableKasms && this.state.availableKasms.length > 0
          ? this.state.availableKasms
          : this.props.availableKasms;
      this.setState({
        availableKasms: newArray,
      });
    }

    if (
      this.props.availableKasms !== nextProps.availableKasms &&
      nextProps.availableKasms &&
      nextProps.availableKasms.length > 0
    ) {
      this.initializePointsofPresence(nextProps.availableKasms);
      this.initializePersistentProfile(nextProps.availableKasms);
      this.initializeZones(nextProps.availableKasms);
      this.initializeNetworks(nextProps.availableKasms);
    }
  }

  componentWillUnmount() {
    //Stops memory leak from setInterval calls
    this.setState({processing: false})
    if (intervalID) {
      window.clearInterval(intervalID);
    }
    for (let x in timeouts) {
      window.clearTimeout(x);
    }
    timeouts = [];
  }

  componentDidMount() {
    this.setState({processing: true})
    if (window.localStorage.getItem("joined_kasms")) {
      let viewed_kasms = JSON.parse(window.localStorage.getItem("joined_kasms"))
        .kasms;
      this.props.getViewedKasms(viewed_kasms);
    }
    this.props.availableKasms &&
      this.initializePointsofPresence(this.props.availableKasms);
    this.props.availableKasms &&
      this.initializePersistentProfile(this.props.availableKasms);
    this.props.availableKasms &&
      this.initializeZones(this.props.availableKasms);
    this.props.availableKasms &&
      this.initializeNetworks(this.props.availableKasms);
    this.updateProgressBarValue(this.props.liveKasms);
    this.props.getUserUsageSummary();

    this.props.getDockedSessions(this.props.liveKasms)
    this.props.getClientSettings()

    if (window.localStorage.getItem("openTabIn")) {
      this.setState({
        openTabIn: window.localStorage.getItem("openTabIn")
      })
    }

    this.checkStatus()
    this.setState({
      availableKasms: this.props.availableKasms,
    });
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.availableKasms !== this.props.availableKasms) {
      this.setState({ availableKasms: this.props.availableKasms })
    }

  }

  checkStatus() {
    const { liveKasms } = this.props;
    let filteredKasms = []
    if (liveKasms && liveKasms.length > 0){
      filteredKasms = liveKasms.filter((i)=> i.operational_status!=='running')
    }
    if (filteredKasms.length > 0 && this.state.processing) {
      timeouts.push(
      setTimeout(async() => {
        await this.props.getUserKasms({getuserkasmsLoading:false})
        this.checkStatus()
      }, 10000)
      )
    }
  }

  showKasmInfo(index) {
    if (this.state.activeKasmItem === index) {
      index = null
    }
    this.setState({ activeKasmItem: index })
  }


  renderDockKasms() {
    const { t } = this.props;
    if (this.state.loader) {
      return (
        <div>
          <div
            className={
              this.props.statusKasms &&
                this.props.statusKasms.is_persistent_profile
                ? "loaderStatus"
                : ""
            }
          >
            {t("workspaces.loading_profile")}
          </div>
          <div className="loaderBg">
            {" "}
            <LoadingSpinner />
          </div>
        </div>
      );
    }

    const liveKasms = this.dockedWorkspaces();

    return (
      <React.Fragment>
        {liveKasms && liveKasms.length > 0 ? (
          <React.Fragment>

            {liveKasms
              .map((kasm, index) => {
                const screenShot = kasm.kasm_id && kasm.operational_status === 'running'
                  ? `${__CLOUD_SERVER__}get_kasm_screenshot?kasm_id=${kasm.kasm_id}&width=1000&height=1000`
                  : '';

                return (
                  <div className="session-container tw-relative tw-z-20 tw-group/dock" key={'session'+kasm.kasm_id}>
                    <div className="session-single tw-relative tw-z-20" onClick={() => this.maximiseSession(kasm.kasm_id)}>
                      <div className="icon-container group-hover/dock:tw-scale-110 tw-transition-transform"><KasmIcon kasm={kasm} /></div>
                      <StatusIndicator kasm={kasm} position="tw-top-0 tw-right-0" />
                      <RemainingTime className="time-remaining" current_time={moment.utc()} expiration_date={kasm.expiration_date} />

                    </div>
                    <div className="tw-absolute tw-opacity-0 tw-scale-0 tw-z-10 tw-transition-all tw-duration-300 lg:group-hover/dock:tw-block lg:group-hover/dock:tw-scale-100 lg:group-hover/dock:tw-opacity-100 tw-left-5 -tw-translate-x-1/2 tw-bottom-8 tw-pb-8">
                    <SingleKasm
                    createResumeClicked={this.state.createResumeClicked}
                    kasm={kasm}
                    screenShot={screenShot}
                    docked={true}
                    moveToDock={this.state.moveToDock}
                    moveToDockMoving={this.state.moveToDockMoving}
                    onHandleResumeKasm={this.handleResumeKasm}
                    onDeleteConfirm={this.deleteConfirm}
                    onStopConfirm={this.stopConfirm}
                    onPauseConfirm={this.pauseConfirm}
                    client_settings={this.props.clientsettings || {}}
                    onMaximizeSession={() => this.maximiseSession(kasm.kasm_id)}
                    key={'docked' + kasm.kasm_id} />

                    </div>
                  </div>
                );
              })}
          </React.Fragment>
        ) : null}

      </React.Fragment>
    );
  }

  renderLiveKasms() {
    const { t } = this.props;
    if (this.state.loader) {
      return (
        <div>
          <div
            className={
              this.props.statusKasms &&
                this.props.statusKasms.is_persistent_profile
                ? "loaderStatus"
                : ""
            }
          >
            {t("workspaces.loading_profile")}
          </div>
          <div className="loaderBg">
            {" "}
            <LoadingSpinner />
          </div>
        </div>
      );
    }

    const filteredKasms = this.filteredKasms()
    const undockedKasms = this.liveWorkspaces()

    let doRefresh = false;
    let updating = false;

    // We want to refresh the Live Kasms data every so often if there is a delete_pending Kams. it should get cleaned up shortly after.

    const currentTime = moment.utc()

    if (filteredKasms && filteredKasms.length > 0) {
      for (let i in filteredKasms) {
        if (filteredKasms[i].operational_status === "delete_pending" || filteredKasms[i].operational_status === "deleting" || filteredKasms[i].operational_status === "pausing" || filteredKasms[i].operational_status === "stopping") {
          doRefresh = true;
        }
        if (filteredKasms[i].operational_status === "running" && currentTime > moment.utc(filteredKasms[i].expiration_date)) {
          updating = true;
        }

      }
    }
    if (doRefresh && !this.state.refreshing) {
      this.state.refreshing = true
      timeouts.push(
      setTimeout(() => {
        const userInfo = JSON.parse(window.localStorage.user_info);
        this.props.getUserKasms({ getuserkasmsLoading: false });
        this.props.getDockedSessions(this.props.liveKasms);
        this.state.refreshing = false
      }, 10000)
      )
    }
    if (updating && !this.state.updating) {
      this.state.updating = true
      timeouts.push(
      setTimeout(() => {
        this.props.updateUserKasms();
        this.state.updating = false
      }, 3000)
      )
    }
    if (undockedKasms && undockedKasms.length <= 0) {
      return null
    }
    return (
      <div className="live-kasms">
        {undockedKasms && undockedKasms.length > 0 ? (
          <React.Fragment>

            {undockedKasms
              .sort(function (a, b) {
                return a.kasm_id.localeCompare(b.kasm_id);
              })
              .map((kasm, index) => {
                const screenShot = kasm.kasm_id && kasm.operational_status === "running"
                  ? `${__CLOUD_SERVER__}get_kasm_screenshot?kasm_id=${kasm.kasm_id}&width=1000&height=1000`
                  : '';
                return (
                  <SingleKasm
                    createResumeClicked={this.state.createResumeClicked}
                    kasm={kasm}
                    screenShot={screenShot}
                    moveToDock={this.state.moveToDock}
                    moveToDockMoving={this.state.moveToDockMoving}
                    onHandleResumeKasm={this.handleResumeKasm}
                    onDeleteConfirm={this.deleteConfirm}
                    onStopConfirm={this.stopConfirm}
                    onPauseConfirm={this.pauseConfirm}
                    onMinimizeSession={this.minimizeSession}
                    key={'live'+kasm.kasm_id}
                    client_settings={this.props.clientsettings || {}}/>
                )
              })}
          </React.Fragment>
        ) : null}
      </div>
    );
  }

  renderAvailableKasms() {
    if (this.state.loader) {
      return (
        <div className="loaderBg">
          {" "}
          <LoadingSpinner />
        </div>
      );
    }
    const { availableKasms } = this.state;
    const { searchText, selectedCategory, t } = this.props;
    const { persistentProfileValues, pointPresenceValues } = this.state;
    let keysSorted;
    let kasms =
      availableKasms && availableKasms.length > 0 ? [...availableKasms] : [];
    const lowerSearch = searchText.toLowerCase();
    if (searchText !== "") {
      kasms = kasms.filter((i) => {
        const category = i.categories.filter((i) =>
          i.toLowerCase().includes(lowerSearch)
        );
        return (
          i.friendly_name.toLowerCase().includes(lowerSearch) ||
          category.length > 0
        );
      });
    }
    if (selectedCategory !== null && selectedCategory.id !== 'all') {
      kasms = kasms.filter((kasm) => {
        return kasm.categories.includes(selectedCategory.label);
      });
    }
    // filter into 2 groups
    const enabledKasms = kasms.filter(k => k.enabled === true).sort(function (a, b) {
      return a.friendly_name.localeCompare(b.friendly_name);
    })

    const disabledKasms = kasms.filter(k => k.enabled === false).sort(function (a, b) {
      return a.friendly_name.localeCompare(b.friendly_name);
    })

    const groupedKasms = [
      ...enabledKasms,
      ...disabledKasms,
    ]

    const filteredKasms = this.liveWorkspaces()

    return (
      <div className={this.state.isLaunchModal ? 'modalopen' : ''}>
        {availableKasms && availableKasms.length > 0 ? (
          <div className={"panelContainerBody sm:tw-p-10" + (filteredKasms && filteredKasms.length > 0 ? ' lg:!tw-pl-80' : '')}>
            <div className="tw-max-w-5xl tw-animate-[fadeIn_0.3s_ease-in-out] tw-flex tw-flex-col tw-w-full tw-mx-auto tw-my-auto tw-py-10" key={this.props.selectedCategory && this.props.selectedCategory.label}>
              <div className="tw-flex tw-flex-wrap tw-gap-1 tw-justify-center">
                {groupedKasms
                  .map((kasm, index) => {
                    let currentImage =
                      pointPresenceValues && pointPresenceValues.length > 0
                        ? pointPresenceValues.find(
                          (image) => image.imageId === kasm.image_id
                        )
                        : "";
                    let currentImage2 =
                      persistentProfileValues &&
                        persistentProfileValues.length > 0
                        ? persistentProfileValues.find(
                          (image) => image.imageId === kasm.image_id
                        )
                        : null;
                    if (kasm.hidden) {
                      return;
                    } else if (kasm.enabled === true) {
                      return (
                        <div
                          className={this.state.tiletype + ' tile tw-transition-all tw-relative tw-cursor-pointer tw-group tw-flex tw-p-2 tw-items-center tw-justify-center tw-bg-slate-100/90 dark:tw-bg-slate-900/90 tw-shadow tw-rounded hover:tw-shadow-xl hover:tw-bg-gradient-to-r hover:tw-from-dark hover:tw-to-blue-500'}
                          key={kasm.image_id}
                        >
                          <div
                            className="tw-w-full tw-h-full"
                            onClick={() => this.launchModal(kasm)}
                          >
                            {kasm.available || !kasm.enabled ? (
                              ""
                            ) : (
                              <span className="warning-icon tw-z-20">
                                <FontAwesomeIcon icon={faExclamationTriangle} id={"_" + kasm.image_id} className="text-danger tw-font-2xl" />
                                <UncontrolledTooltip
                                  target={"_" + kasm.image_id}
                                >
                                  {t("workspaces.no_image")}
                                </UncontrolledTooltip>
                              </span>
                            )}
                            {kasm.image_type === "Link" ? (
                              <div>
                                <span className="warning-icon tw-z-20">
                                  <FontAwesomeIcon icon={faGlobe} id={"_" + kasm.image_id} className="tw-font-2xl" />
                                  <UncontrolledTooltip
                                    target={"_" + kasm.image_id}
                                  >
                                    {t("workspaces.opens_externally")}
                                  </UncontrolledTooltip>
                                </span>
                              </div>
                            ): ("") }
                            <div className="show-grid tw-flex tw-h-full tw-items-center">
                              <div
                                className="kasmcard-img tw-flex tw-h-full tw-w-20 tw-mx-4 tw-items-center"
                                xs={5}
                                sm={4}
                                md={3}
                                lg={4}
                                xl={4}
                              >
                                {kasm.image_src && kasm.image_src != "" ? (
                                  <img
                                    onError={this.defaultThumb}
                                    className=" "
                                    src={kasm.image_src}
                                  />
                                ) : (
                                  <div className="img tw-flex tw-justify-center">
                                    <KasmIcon kasm={kasm} />
                                  </div>
                                )}
                              </div>
                              <div
                                className="kasmcard-detail settingPad"
                              >
                                <h5 className="">
                                  {kasm.friendly_name}
                                </h5>
                                <p>{kasm.default_category}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    } else {
                      return (
                        <div
                          className={this.state.tiletype + ' tile tw-transition-all disabled tw-cursor-pointer tw-group tw-flex tw-p-2 tw-items-center tw-justify-center tw-bg-slate-100/50 dark:tw-bg-slate-900/30 tw-shadow tw-rounded'}
                          key={index}
                        >
                          <div
                            className="tw-w-full"
                            onClick={() => this.launchModal(kasm)}
                          >
                            {kasm.available || !kasm.enabled ? (
                              ""
                            ) : (
                              <div>
                                <span className="warning-icon">
                                  <FontAwesomeIcon icon={faExclamationTriangle} id={"_" + kasm.image_id} className="text-danger tw-font-2xl" />
                                  <UncontrolledTooltip
                                    target={"_" + kasm.image_id}
                                  >
                                    {t("workspaces.no_image")}
                                  </UncontrolledTooltip>
                                </span>
                              </div>
                            )}
                            <div className="show-grid tw-flex tw-h-full tw-items-center tw-opacity-30">
                              <div
                                className="kasmcard-img tw-flex tw-h-full tw-w-20 tw-mx-4 tw-items-center"
                                xs={5}
                                sm={4}
                                md={3}
                                lg={4}
                                xl={4}
                              >
                                {kasm.image_src && kasm.image_src != "" ? (
                                  <img
                                    onError={this.defaultThumb}
                                    className=" "
                                    src={kasm.image_src}
                                  />
                                ) : (
                                  <KasmIcon kasm={kasm} />
                                )}
                              </div>
                              <div
                                className="kasmcard-detail settingPad"
                              >
                                <h5 className="">
                                  {kasm.friendly_name}
                                </h5>
                                <p>{kasm.default_category}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  })}
              </div>
            </div>
          </div>
        ) : (
          <div className="tw-p-8 tw-py-20 !tw-h-full !tw-min-h-screen tw-flex tw-items-center">
            {availableKasms && hasAuth(['images', 'registries']) &&
              <div className="tw-flex tw-items-center tw-justify-center lg:tw-p-12 tw-w-full">
                <Wizard />
              </div>
            }
          </div>
        )}
      </div>
    );
  }

  renderJoinedKasms() {
    const { viewedKasms, viewKasmsLoading, t } = this.props;
    if (viewKasmsLoading) {
      return <div>{t("workspaces.loading")}</div>;
    }
    let recent_kasms =
      viewedKasms &&
      viewedKasms.map((kasm, i) => {
        return (
          <Col md="5" xl={3} className="join-shared-kasm" key={i}>
            <Link style={{ color: "black" }} to={"/join/" + kasm.share_id}>
              <Card className={"join-shared-kasm-card"}>
                <Row>
                  <div>
                    {kasm.image_src && kasm.image_src !== "" ? (
                      <img
                        onError={this.defaultThumb}
                        className="thumbnails float-left"
                        src={kasm.image_src}
                      />
                    ) : (
                      <KasmIcon className="thumbnails float-left" kasm={kasm} />
                    )}
                  </div>
                  <div style={{ paddingLeft: "10px" }}>
                    <h5 className="">{kasm.image}</h5>
                    {t("workspaces.Host")}: {kasm.user} <br />
                    {t("workspaces.Share ID")}: {kasm.share_id}
                  </div>
                </Row>
              </Card>
            </Link>
          </Col>
        );
      });
    return (
      <div className="panelContainer">
        <div className="panelContainerHeading">
          <FontAwesomeIcon icon={faAlignJustify} id={"_" + kasm.image_id} className="tw-mr-1" />
          <strong>{t("workspaces.Recently Viewed Sessions")}</strong>
        </div>
        <div className="panelContainerBody">
          <Row>{recent_kasms}</Row>
        </div>
      </div>
    );
  }

  render() {
    const { liveKasms, t } = this.props;
    const {
      selectedKasmData,
      pointPresenceValues,
      persistentProfileValues,
      valueGroups,
      isPickerShow,
    } = this.state;

    let currentImage =
      pointPresenceValues && pointPresenceValues.length > 0
        ? pointPresenceValues.find(
          (image) => image.imageId === selectedKasmData.image_id
        )
        : "";

    let currentImage2 =
      persistentProfileValues && persistentProfileValues.length > 0
        ? persistentProfileValues.find(
          (image) => image.imageId === selectedKasmData.image_id
        )
        : null;

    const maskStyle = {
      display: isPickerShow ? "block" : "none",
    };

    const pickerModalClass = `picker-modal${isPickerShow ? " picker-modal-toggle" : ""
      }`;

    const scrollMenuBar = (offset) => {
      if (!this.menuBarRef.current) {
        return;
      }

      this.menuBarRef.current.scrollTo({
        top: 0,
        left: this.menuBarRef.current.scrollLeft + offset,
        behavior: "smooth"
      });
    };

    const showDock = () => {
      const dockedSessions = this.dockedWorkspaces()

      if (this.props.usageSummary && this.props.usageSummary.usage_limit) {
        return true
      }
      if (dockedSessions && dockedSessions.length > 0) {
        return true
      }
      return false
    }

    const currentKasm = this.props.liveKasms && this.props.liveKasms.find(e => e.kasm_id === this.state.kasmId)

    const handleLaunchSubmit = (e) => {
      e.preventDefault()
      if(selectedKasmData.image_type === "Link") {
        this.openLink(selectedKasmData.link_url)
        this.setState({ isLaunchModal: false })
        return
      }
      this.createKasm(
        selectedKasmData.image_id,
        selectedKasmData.available
      )
    }

    return (
      <div className="kasm-outer">
        <Row>
          <div className={'panelbackground' + (this.props.showProfile ? ' showprofile' : '')} style={{ background: "transparent" }}>
            <div className="left-section col-lg-12 p-0">
              { this.props.liveKasms && this.props.liveKasms.length > 0 && this.props.clientsettings ? this.renderLiveKasms() : ''}
              {this.renderAvailableKasms()}
            </div>

            <div className={'activesessions tw-bg-white/30 dark:tw-bg-slate-900/30 ' + (showDock() ? 'active' : '')}>

              <div ref={this.containerRef} className="session-list">
                {this.props.usageSummary && this.props.usageSummary.usage_limit && (
                  <UsageCounter props={this.props} state={this.state} />
                )}
                {this.renderDockKasms()}
              </div>


              <Modal
                showCloseButton={true}
                icon={currentKasm && currentKasm.image_src &&
                  currentKasm.image_src != "" ? (
                  <img
                    onError={this.defaultThumb}
                    className="tw-rounded-full"
                    src={currentKasm.image_src}
                  />
                ) : (
                  <KasmIcon kasm={currentKasm} />
                )}
                maxWidth="sm:tw-max-w-sm"
                iconBg="tw-scale-[170%] -tw-mt-12 tw-mb-10 tw-relative tw-p-1.5 tw-rounded-full tw-bg-white"
                title='workspaces.Delete Session'
                contentRaw={
                  <div className="modal-inner tw-mt-8">
                    <p className="tw-mb-8">{t('workspaces.Delete the currently running session')}</p>
                    <button
                      type="button"
                      className="actionbutton tw-cursor-pointer tw-bg-pink-700"
                      onClick={this.destroyKasms}
                    >
                      {this.state.deleteClicked ? <div><FontAwesomeIcon icon={faCircleNotch} spin /></div> :
                        t("buttons.Delete")
                      }
                    </button>

                  </div>
                }
                open={this.state.modal}
                setOpen={this.toggle}

              />




              {this.props.clientsettings && this.props.clientsettings.allow_kasm_stop && (
                <Modal
                  showCloseButton={true}
                  icon={currentKasm && currentKasm.image_src &&
                    currentKasm.image_src != "" ? (
                    <img
                      onError={this.defaultThumb}
                      className="tw-rounded-full"
                      src={currentKasm.image_src}
                    />
                  ) : (
                    <KasmIcon kasm={currentKasm} />
                  )}
                  maxWidth="sm:tw-max-w-sm"
                  iconBg="tw-scale-[170%] -tw-mt-12 tw-mb-10 tw-relative tw-p-1.5 tw-rounded-full tw-bg-white"
                  title='workspaces.Stop Session'
                  contentRaw={
                    <div className="modal-inner tw-mt-8">
                      <p className="tw-mb-8">{t('workspaces.confirm_stop')}</p>
                      <button
                        type="button"
                        className="actionbutton tw-cursor-pointer tw-bg-pink-700"
                        onClick={this.stopKasms}
                      >
                        {this.state.stopClicked ? <div><FontAwesomeIcon icon={faCircleNotch} spin /></div> :
                          t("workspaces.Stop")
                        }
                      </button>

                    </div>
                  }
                  open={this.state.stopModal}
                  setOpen={this.toggleStopModal}
                />

              )}
              
              {this.props.clientsettings && this.props.clientsettings.allow_kasm_pause && (

              <Modal
                showCloseButton={true}
                icon={currentKasm && currentKasm.image_src &&
                  currentKasm.image_src != "" ? (
                  <img
                    onError={this.defaultThumb}
                    className="tw-rounded-full"
                    src={currentKasm.image_src}
                  />
                ) : (
                  <KasmIcon kasm={currentKasm} />
                )}
                maxWidth="sm:tw-max-w-sm"
                iconBg="tw-scale-[170%] -tw-mt-12 tw-mb-10 tw-relative tw-p-1.5 tw-rounded-full tw-bg-white"
                title='workspaces.Pause Session'
                contentRaw={
                  <div className="modal-inner tw-mt-8">
                    <p className="tw-mb-8">{t('workspaces.confirm_pause')}</p>
                    <button
                      type="button"
                      className="actionbutton tw-cursor-pointer tw-bg-yellow-500"
                      onClick={this.pauseKasms}
                    >
                      {this.state.pauseClicked ? <div><FontAwesomeIcon icon={faCircleNotch} spin /></div> :
                        t("workspaces.Pause")
                      }
                    </button>

                  </div>
                }
                open={this.state.pauseModal}
                setOpen={this.togglePauseModal}

              />


              )}

                <Modal
                  showCloseButton={true}
                  icon={selectedKasmData.image_src &&
                    selectedKasmData.image_src != "" ? (
                    <img
                      onError={this.defaultThumb}
                      className="tw-rounded-full"
                      src={selectedKasmData.image_src}
                    />
                  ) : (
                    <KasmIcon kasm={selectedKasmData} />
                  )}
                  maxWidth="sm:tw-max-w-md"
                  iconBg="tw-scale-[170%] -tw-mt-12 tw-mb-10 tw-relative tw-p-1.5 tw-rounded-full tw-bg-white"
                  titleRaw={t("workspaces.Launch") + ' ' + selectedKasmData.friendly_name}
                  contentRaw={
                    <form onSubmit={handleLaunchSubmit} ref={this.launchRef} className="modal-inner tw-text-left tw-mt-8 tw-pb-14">
                      <p className="tw-mb-8 tw-text-[var(--text-color-muted-more)]">{selectedKasmData.description}</p>
                      {selectedKasmData &&
                        selectedKasmData.persistent_profile_settings && selectedKasmData.enabled &&
                        selectedKasmData.persistent_profile_settings.length > 0 ? (
                        <FormField section="workspaces" label="Persistent Profile">
                          <Select
                            className="input"
                            id={"persistent_profile_" + selectedKasmData.image_id}
                            key={selectedKasmData.image_id}
                            value={currentImage2 ? currentImage2.value : ""}
                            options={selectedKasmData.persistent_profile_settings.map(
                              (val) => {
                                return { key: t("workspaces." + val), value: val };
                              }
                            )}
                            valueKey="value"
                            labelKey="key"
                            name="image_id"
                            onChange={this.handlePersistentProfileDropDown.bind(
                              this,
                              selectedKasmData.image_id
                            )}
                          />
                        </FormField>
                      ) : (
                        ""
                      )}

                      {selectedKasmData &&
                        selectedKasmData.zones && selectedKasmData.enabled &&
                        selectedKasmData.zones.length > 0 && (selectedKasmData.image_type === "Container" ||
                          selectedKasmData.image_type === "Server Pool") ? (
                        <FormField section="workspaces" label="Deployment Zone">
                          <Select
                            className="input"
                            id={"zone_" + selectedKasmData.image_id}
                            key={selectedKasmData.image_id}
                            value={
                              this.state.zoneSelections[selectedKasmData.image_id]
                            }
                            options={selectedKasmData.zones.map((val) => {
                              return { key: val.zone_name, value: val.zone_id };
                            })}
                            valueKey="value"
                            labelKey="key"
                            name="image_id"
                            onChange={this.handleZoneDropDown.bind(
                              this,
                              selectedKasmData.image_id
                            )}
                            clearable={false}
                          />
                        </FormField>
                      ) : (
                        ""
                      )}

                      {selectedKasmData &&
                        selectedKasmData.networks && selectedKasmData.enabled &&
                        selectedKasmData.networks.length > 0 ? (
                        <FormField section="workspaces" label="Network">
                          <Select
                            className="input"
                            id={"zone_" + selectedKasmData.image_id}
                            key={selectedKasmData.image_id}
                            value={
                              this.state.networkSelections[selectedKasmData.image_id]
                            }
                            options={selectedKasmData.networks.map((val) => {
                              return { key: val.network_name, value: val.network_id };
                            })}
                            valueKey="value"
                            labelKey="key"
                            name="image_id"
                            onChange={this.handleNetworksDropDown.bind(
                              this,
                              selectedKasmData.image_id
                            )}
                            clearable={false}
                          />
                        </FormField>
                      ) : (
                        ""
                      )}

                      <FormField section="workspaces" label="Open Session In" className="">
                        <Select
                          className="input"
                          id={"open_session_in_" + selectedKasmData.image_id}
                          key={selectedKasmData.image_id}
                          value={this.state.openTabIn}
                          options={[
                            {
                              value: 'current',
                              key: t("workspaces.Current Tab")
                            },
                            {
                              value: 'new',
                              key: t("workspaces.New Tab")
                            },
                            {
                              value: 'window',
                              key: t("workspaces.New Window")
                            }
                          ]}
                          valueKey="value"
                          labelKey="key"
                          name="image_id"
                          onChange={(e) => {
                            this.setState({ openTabIn: e.value })
                            window.localStorage.setItem('openTabIn', e.value)
                          }
                          }
                        />
                      </FormField>
                      <LaunchForm data={selectedKasmData} />
                      {selectedKasmData.enabled === true ? (
                        <div className="tw-bg-blue-500 tw-absolute tw-left-0 tw-right-0 tw-p-3 -tw-bottom-3 !tw-rounded-xl !tw-rounded-t-none">
                          {this.state.createClicked ? (
                            <button
                              type="button"
                              className="actionbutton tw-bg-white/20 !tw-shadow-[0_0_9px_rgba(0,0,0,0.15)] hover:!tw-bg-white/5 tw-border-t tw-border-0 tw-border-solid tw-border-white/25 hover:tw-border-white/10"
                              style={{ cursor: "pointer" }}
                              disabled={true}
                            >
                              {this.state.currentId === selectedKasmData.image_id ? <div><FontAwesomeIcon icon={faCircleNotch} spin /></div> :
                                selectedKasmData.image_type === "Link" ? t("workspaces.Open External Link") : t("workspaces.Launch Session")
                              }
                            </button>
                          ) : (
                              <button
                                type="submit"
                                className="actionbutton tw-bg-white/20 !tw-shadow-[0_0_9px_rgba(0,0,0,0.15)] hover:!tw-bg-white/5 tw-border-t tw-border-0 tw-border-solid tw-border-white/25 hover:tw-border-white/10"
                                style={{ cursor: "pointer" }}
                                disabled={
                                  selectedKasmData.available
                                    ? this.props.createKasmsLoading &&
                                    this.state.currentId ===
                                    selectedKasmData.image_id
                                    : false
                                }
                              >
                                {selectedKasmData.image_type === "Link" ? t("workspaces.Open External Link") : t("workspaces.Launch Session")}
                              </button>
                          )}
                        </div>
                      ) : (
                        <div className="disabled-image-message">{ReactHtmlParser(this.props.disabledImageMessage)}</div>
                      )}
                    </form>
                  }
                  open={this.state.isLaunchModal}
                  setOpen={this.toggleLaunchModal}

                />


              <Modal
                showCloseButton={true}
                    icon={<FontAwesomeIcon icon={faTrash} />}
                    iconBg="tw-bg-pink-700 tw-text-white"
                    title="workspaces.Confirm"
                    contentRaw={
                      <div className="tw-mt-8">
  
                          <p>{t("workspaces.confirm_reset")}</p>
                          <p>{t("workspaces.data_erased")}</p>
                          <p dangerouslySetInnerHTML={ {__html: t('workspaces.please_type', { text: '<b>"reset"</b>', interpolation: {escapeValue: false}})} } />
  
                          <div className="input">
                            <input
                              type="text"
                              className="form-control mr-sm-2"
                              style={{ backgroundImage: "none" }}
                              onChange={(e) => this.verifyResetConfirmation(e.target.value)}
                            />
                      </div>
                    </div>
  
                    }
                    open={this.state.showResetConfirmationDialog}
                    setOpen={() => this.setState({ showResetConfirmationDialog: false })}

                />

            </div>
          </div>
        </Row>
      </div>
    );
  }
}

Listkasms.propTypes = {
  destroyKasms: Proptypes.func.isRequired,
  stopKasms: Proptypes.func.isRequired,
  pauseKasms: Proptypes.func.isRequired,
  startKasms: Proptypes.func.isRequired,
  logout: Proptypes.func.isRequired,
  getUserKasms: Proptypes.func.isRequired,
  createKasms: Proptypes.func.isRequired,
  updateKeepalive: Proptypes.func.isRequired,
  getStatusKasms: Proptypes.func.isRequired,
  destroyKasmsErrorMessage: Proptypes.object,
  stopKasmsErrorMessage: Proptypes.object,
  pauseKasmsErrorMessage: Proptypes.object,
  startKasmsErrorMessage: Proptypes.object,
  liveKasms: Proptypes.array,
  availableKasms: Proptypes.array,
  deleteKasmsError: Proptypes.object,
  errorCreateMessage: Proptypes.string,
  errorCreateMessageDetail: Proptypes.string,
  createKasmsError: Proptypes.string,
  createdKasms: Proptypes.object,
  statusKasms: Proptypes.object,
  getstatuskasmsError: Proptypes.object,
  errorStatusKasmsMessage: Proptypes.object,
  type: Proptypes.string,
  getstatuskasmsLoading: Proptypes.bool,
  destroyKasmsLoading: Proptypes.bool,
  stopKasmsLoading: Proptypes.bool,
  pauseKasmsLoading: Proptypes.bool,
  startKasmsLoading: Proptypes.bool,
  className: Proptypes.object,
  createKasmsLoading: Proptypes.bool,
  history: Proptypes.object.isRequired,
};

Listkasms = withRouter(Listkasms);
const ListkasmsTranslated = withTranslation('common')(Listkasms)

export default connect(
  (state) => ({
    dockedSessions: state.dashboard.dockedSessions || [],
    errorCreateMessage: state.dashboard.errorCreateMessage || null,
    errorCreateMessageDetail: state.dashboard.errorCreateMessageDetail || null,
    deleteKasmsError: state.dashboard.deleteKasmsError || null,
    getstatuskasmsLoading: state.dashboard.getstatuskasmsLoading || null,
    destroyKasmsErrorMessage: state.dashboard.destroyKasmsErrorMessage || null,
    stopKasmsErrorMessage: state.dashboard.stopKasmsErrorMessage || null,
    pauseKasmsErrorMessage: state.dashboard.pauseKasmsErrorMessage || null,
    startKasmsErrorMessage: state.dashboard.startKasmsErrorMessage || null,
    createKasmsLoading: state.dashboard.createKasmsLoading || false,
    destroyKasmsLoading: state.dashboard.destroyKasmsLoading || null,
    startKasmsLoading: state.dashboard.startKasmsLoading || null,
    createKasmsError: state.dashboard.createKasmsError || null,
    statusKasms: state.dashboard.statusKasms || null,
    getstatuskasmsError: state.dashboard.getstatuskasmsError || null,
    errorStatusKasmsMessage: state.dashboard.errorStatusKasmsMessage || null,
    fetchedKasms: state.dashboard.kasms || [],
    createdKasms: state.dashboard.createdKasms || null,
    availableKasms: state.dashboard.availableKasms,
    disabledImageMessage: state.dashboard.disabledImageMessage,
    liveKasms: state.dashboard.liveKasms,
    viewedKasms: state.dashboard.viewedKasms,
    viewKasmsLoading: state.dashboard.viewKasmsLoading,
    usageSummary: state.user.usageSummary,
    searchText: state.dashboard.search || '',
    selectedCategory: state.dashboard.selectedCategory || null,
    launchSelections: state.images.launchSelections || {},
    showProfile: state.dashboard.showProfile || false,
    login_settings: state.auth.login_settings,
    clientsettings: state.dashboard.clientsettings || null,
  }),
  (dispatch) => ({
    logout: (logout_data) => dispatch(logout(logout_data)),
    imageFunc: (payload_data) => dispatch(getUserImages(payload_data)),
    destroyKasms: (data) => dispatch(destroyKasms(data)),
    stopKasms: (data) => dispatch(stopKasms(data)),
    pauseKasms: (data) => dispatch(pauseKasms(data)),
    startKasms: (data) => dispatch(startKasms(data)),
    getUserKasms: (data) => dispatch(getUserKasms(data)),
    updateUserKasms: (data) => dispatch(updateUserKasms(data)),
    createKasms: (data) => dispatch(createKasms(data)),
    updateKeepalive: (data) => dispatch(updateKeepalive(data)),
    getStatusKasms: (data) => dispatch(getStatusKasms(data)),
    getViewedKasms: (data) => dispatch(getViewedKasms(data)),
    setDockedSessions: (data) => dispatch(setDockedSessions(data)),
    getDockedSessions: (data) => dispatch(getDockedSessions(data)),
    getUserUsageSummary: (payload_data) => dispatch(getUserUsageSummary()),
    setShowProfile: (data) => dispatch(setShowProfile(data)),
    setProfileSection: (data) => dispatch(setProfileSection(data)),
    setProfileDropdown: (data) => dispatch(setProfileDropdown(data)),
    getClientSettings: () => dispatch(getClientSettings()),
  })
)(ListkasmsTranslated);
