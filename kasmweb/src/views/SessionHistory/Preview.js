import { Dialog, Transition } from "@headlessui/react";
import React, { useState, useEffect, useRef, Fragment } from "react";
import { getSessionRecording } from "../../actions/actionKasm";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from 'react-redux'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons/faTimes";
import { faDownload } from "@fortawesome/free-solid-svg-icons/faDownload";
import moment from "moment";
import classNames from "classnames";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons/faCircleNotch";
import { secondsToTime } from "../../utils/helpers";
import { faCloudArrowDown } from "@fortawesome/free-solid-svg-icons/faCloudArrowDown";
import { faCalendar } from "@fortawesome/free-solid-svg-icons/faCalendar";
import { faClock } from "@fortawesome/free-solid-svg-icons/faClock";
import { serverLog } from "../../actions/actionServerLog";
import { notifyFailure } from "../../components/Form/Form";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { Paginate } from "../../components/Form/Form";

export function Preview(props) {
  const userInfo = JSON.parse(window.localStorage.getItem("user_info"));
  const dispatch = useDispatch()
  const cancelButtonRef = useRef(null)
  const [currentVideo, setCurrentVideo] = useState(null);
  const [padding, setPadding] = useState(2);
  const [loaded, setLoaded] = useState(false);
  // const [totalDuration, setTotalDuration] = useState(0);

  const { open, setOpen, details, setPreviewDetails, maxWidth = false, showCloseButton = false } = props;
  const session_recordings = useSelector(state => state.kasms.session_recordings) || null
  const page = useSelector(state => state.kasms.page) || null
  const perPage = useSelector(state => state.kasms.per_page) || null
  const totalDuration = useSelector(state => state.kasms.total_duration) || null
  const items = useSelector(state => state.kasms.items) || null

  const start = Number((perPage * (page - 1)) + 1)

  const { t } = useTranslation('common');
  const videoRef = useRef(null)

  const poster = () => {
    let favicon_logo = window.localStorage.getItem("favicon_logo");
    if (favicon_logo && favicon_logo === '/img/favicon.png') return 'img/video-poster.png'
    return 'img/video-poster-generic.png'
  }
  useEffect(() => {
    setLoaded(true)
  }, []);

  useEffect(() => {
    if (details !== null) {
      const getRecordings = async () => {
        try {
          await dispatch(getSessionRecording({
            kasm_id: details.kasm_id
          }))
        } catch (error) {
          closePreview()
          notifyFailure({ error, notifyTitle: 'buttons.preview' })
        }
      }
      getRecordings()
    }
  }, [details]);

  useEffect(() => {
    if (session_recordings !== null && open === true) {
      setCurrentVideo(session_recordings[0])
      if (items >= 100) {
        let stringLength = String(items).length
        setPadding(stringLength)
      }
    } else {
      setCurrentVideo(null)
    }
  }, [session_recordings, open]);

  useEffect(() => {
    if (currentVideo !== null && videoRef.current) {
      videoRef.current.src = currentVideo.session_recording_download_url
      // videoRef.current.play()
    }
  }, [currentVideo]);
  const playVideo = () => {
    dispatch(serverLog({
      message: "User " + userInfo.username + " played " + details?.kasm_id + " video: " + currentVideo.session_recording_url,
      level: "info",
      "metric_name": "sessions.session_history.preview_clip",
      "kasm_id": details?.kasm_id,
      "session_location_url": currentVideo?.session_recording_url,
      "total_number_of_urls_requested": 1
    }))
  }
  const playCurrent = () => {
    videoRef.current.play()
  }

  const setVideo = (item) => {
    setCurrentVideo(item)
  }

  const closePreview = () => {
    setOpen(false)
    setCurrentVideo(null)
    setPreviewDetails(null)
  }
  const fetchData = (data) => {
    const { page } = data
    console.log()
    dispatch(getSessionRecording({
      kasm_id: details.kasm_id,
      page: page
    }))
  }

  const screenshot = (session) => {
    const image = _.get(session, 'session.session_recording_metadata.screenshot', 'img/favicon.png') || 'img/favicon.png'
    return (
      <img
        onError={(e) => e.target.src = "img/favicon.png"}
        className={classNames("active-session-icon tw-h-12", currentVideo.session_recording_download_url === session.session_recording_download_url ? '' : 'tw-grayscale')}
        src={image}
      />
    )
  }

  const downloadFile = async(event, url, name) => {
    event.preventDefault()
    event.stopPropagation()
    const videoName = String(name).replace(/^.*[\\/]/, '')
    dispatch(serverLog({
      message: "User " + userInfo.username + " downloaded " + details?.kasm_id + " video: " + name,
      level: "info",
      "metric_name": "sessions.session_history.download_session_single_clip",
      "kasm_id": details?.kasm_id,
      "session_location_url": name,
      "total_number_of_urls_requested": 1
    }))
    const response = await fetch(url)
    const blob = await response.blob()
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = videoName;
    link.click();
    link.remove();
  }

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
              <Dialog.Panel className={"tw-relative tw-transform tw-rounded-xl tw-overflow-hidden tw-bg-[var(--modal-bg)] tw-text-left tw-shadow-[0_0_15px_rgba(0,0,0,0.4)] tw-transition-all tw-w-full " + (maxWidth ? ' ' + maxWidth : ' sm:tw-max-w-7xl')}>
                <div>
                  <div className="tw-text-center ">
                    {session_recordings && loaded && <div className="tw-flex tw-flex-col md:tw-flex-row">
                      <div className="tw-bg-black tw-grow">
                      <video
                        className="tw-bg-black tw-w-full"
                        ref={videoRef}
                        controls
                        poster={poster()}
                        src={currentVideo && currentVideo.session_recording_download_url}
                        onLoadEnd={playCurrent}
                        onPlay={playVideo}
                        muted>
                      </video>
                      </div>
                      <div className="tw-w-full md:tw-max-w-sm tw-min-w-[320px] tw-relative tw-text-slate-500">
                        <div onClick={closePreview} className="tw-absolute tw-z-50 tw-top-2 tw-group tw-cursor-pointer tw-right-2 tw-flex tw-w-8 tw-h-8 tw-transition-colors tw-rounded-full tw-bg-slate-100 dark:tw-bg-black sm:tw-bg-black/5 hover:tw-bg-black/10 sm:dark:tw-bg-black/10 dark:hover:tw-bg-black/20 tw-justify-center tw-items-center"><FontAwesomeIcon className="" icon={faTimes} /></div>

                        <div className="tw-py-4 tw-text-left tw-flex tw-items-center">
                          <img className="tw-w-16 tw-mx-7" src={details && details.image_src || 'img/favicon.png'} onError={(e) => e.target.src = "img/favicon.png"} />
                          <div className="tw-flex tw-flex-col tw-leading-none">
                          <span className="tw-font-bold tw-mb-1">{details && details.image_friendly_name}</span>
                          <span className="tw-text-xs"><FontAwesomeIcon className="tw-mr-2" icon={faCalendar} />{moment(details && details.created_date).isValid() ? moment.utc(details && details.created_date).local().format("lll") : "-"}</span>
                          <span className="tw-text-xs"><FontAwesomeIcon className="tw-mr-2" icon={faClock} />{secondsToTime(totalDuration)}</span>
                          </div>
                        </div>
                        <div className="tw-flex tw-flex-col tw-overflow-y-auto md:tw-absolute tw-inset-0 tw-top-24 tw-border-0 tw-border-t tw-border-solid tw-border-[color:var(--border-color)]">
                          {session_recordings && session_recordings.map((video, index) => (
                            <div
                              className={classNames("tw-flex tw-relative tw-items-center tw-cursor-pointer tw-border-0 tw-border-b tw-border-solid tw-border-[color:var(--border-color)]", currentVideo?.session_recording_download_url === video.session_recording_download_url ? 'tw-bg-blue-500' : '')}
                              onClick={() => {
                                if (video.session_recording_download_url !== 'error') {
                                 setVideo(video)
                                }
                              }}
                            >
                              <div className={classNames("tw-flex tw-h-16 tw-items-center tw-w-full tw-relative tw-text-xs", currentVideo?.session_recording_download_url === video.session_recording_download_url ? 'tw-text-white/90' : 'text-muted-more', video.session_recording_download_url === 'error' ? 'tw-line-through' : '')}>
                                <div className={classNames("tw-absolute tw-top-0 tw-bottom-0 tw-left-0 tw-w-1", currentVideo?.session_recording_download_url === video.session_recording_download_url ? 'tw-bg-blue-500' : '')}></div>
                                <span className={classNames("video-preview tw-text-xl tw-px-6 tw-h-16 tw-w-28 tw-bg-cover tw-bg-center", video.session_recording_download_url === 'error' ? 'tw-opacity-40' : '')} style={{ backgroundImage: 'url("data:image/png;base64,' + video.session_recording_metadata.thumbnail + '")'}}>
                                </span>
                                {video.session_recording_download_url === 'error' && <div className={classNames("tw-absolute tw-top-5 tw-left-10 ")}>
                                <FontAwesomeIcon className="tw-text-red-600 tw-text-3xl tw-opacity-100" icon={faExclamationCircle} />
                              </div>}

                                <span className={classNames("tw-font-semibold tw-text-left tw-overflow-hidden tw-pl-6 tw-flex tw-flex-col", video.session_recording_download_url === 'error' ? 'tw-opacity-40' : '')}>
                                  <span className="tw-flex tw-gap-2">{t('workspaces.clip', { num: String(index + start).padStart(padding, '0') })}{video.session_recording_download_url !== 'error' && <a onClick={(e) => downloadFile(e, video.session_recording_download_url, video.session_recording_url)} className={currentVideo?.session_recording_download_url === video.session_recording_download_url ? 'tw-text-white/90 hover:tw-text-white' : 'text-muted-more'} download href={video.session_recording_download_url} target="_blank"><FontAwesomeIcon icon={faCloudArrowDown} /></a>}</span>
                                  <span className="tw-font-light">
                                    {moment(video.session_recording_metadata.timestamp * 1000).isValid() && moment.utc(video.session_recording_metadata.timestamp * 1000).local().format("lll")}
                                    
                                    </span>
                                </span>
                                <span className={classNames("tw-ml-auto tw-px-6", video.session_recording_download_url === 'error' ? 'tw-opacity-40' : '')}>{secondsToTime(video.session_recording_metadata.duration)}</span>
                              </div>
                            </div>
                          ))}
                          <Paginate fetchData={fetchData} items={items} perPage={perPage} page={page} />
                        </div>
                      </div>
                    </div>}
                    {!session_recordings && <div className="tw-h-96 tw-flex tw-items-center tw-justify-center"><FontAwesomeIcon className="tw-w-10 tw-h-10" icon={faCircleNotch} spin /></div>}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}