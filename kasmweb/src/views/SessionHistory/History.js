import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { getSessionHistory, getSessionRecording } from "../../actions/actionKasm";
import { useTranslation } from "react-i18next";
import PageHeader from "../../components/Header/PageHeader";
import { Row, Col, UncontrolledTooltip } from "reactstrap";
import DataTable from "../../components/Table/Table"
import { ImageColumn } from "../../components/Table/NewTable";
import { CopyToClipboard, notifyFailure } from "../../components/Form/Form";
import { Link } from "react-router-dom";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTable } from "@fortawesome/pro-light-svg-icons/faTable";
import { faUser } from "@fortawesome/pro-light-svg-icons/faUser";
import { faXmark } from "@fortawesome/pro-light-svg-icons/faXmark";
import { faCalendar } from "@fortawesome/pro-light-svg-icons/faCalendar";
import { faCloudArrowDown } from "@fortawesome/pro-light-svg-icons/faCloudArrowDown";
import { Preview } from "./Preview";
import { downloadZip } from "client-zip";
import { Modal } from "../../components/Form/Modal";
import { faCircleNotch } from "@fortawesome/pro-light-svg-icons/faCircleNotch";
import { serverLog } from "../../actions/actionServerLog";

export function SessionHistory(props) {
  const userInfo = JSON.parse(window.localStorage.getItem("user_info"));
  const dispatch = useDispatch()
  const [changeFilterUsername, setChangeFilterUsername] = useState(false);
  const [changeFilterCreated, setChangeFilterCreated] = useState(false);
  const [filterUsername, setFilterUsername] = useState('');
  const [filterCreatedStart, setFilterCreatedStart] = useState(null);
  const [filterCreatedEnd, setFilterCreatedEnd] = useState(null);
  const [preview, setPreview] = useState(false);
  const [previewDetails, setPreviewDetails] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadPercent, setDownloadPercent] = useState(0);

  const [triggerOnFetch, setTriggerOnFetch] = useState(false);

  const history = useSelector(state => state.kasms.history) || null

  const { t } = useTranslation('common');

  const columns = [
    {
      type: "text",
      name: t('workspaces.workspace'),
      accessor: "image_friendly_name",
      overwrite: true,
      defaultSort: false,
      searchable: true,
      cell: (data) => <ImageColumn key={'image_friendly_name' + data.original.account_id} image={<img className="tw-w-16" src={data.original.image_src || 'img/favicon.png'} onError={(e) => e.target.src = "img/favicon.png"} />} main={data.value} sub={data.original.image_name} first={true}></ImageColumn>

    },
    {
      type: "date",
      accessor: "created_date",
      name: t("workspaces.created"),
      colSize: 'minmax(190px,1.2fr) ',
      defaultSort: true,
      defaultOrder: 'desc',
      cell: (data) => <div>{moment(data.value).isValid() ? moment.utc(data.value).local().format("lll") : "-"}</div>
    },
    {
      name: t('users.Usage (hours)'),
      accessor: "usage_hours",
      showByDefault: true,
    },
    {
      type: "text",
      name: t('workspaces.kasm-id'),
      accessor: "kasm_id",
      searchable: true,
      cell: (data) => <React.Fragment><div><span id={"hostname-" + data.original.kasm_id}>{data.value.slice(0, 6)}...</span><CopyToClipboard value={data.value} /></div><UncontrolledTooltip placement="right" target={"hostname-" + data.original.kasm_id}>{data.value}</UncontrolledTooltip></React.Fragment>
    },
    {
      type: "text",
      name: t('workspaces.user'),
      searchable: true,
      accessor: "user_name",
      colSize: 'minmax(200px,1.2fr) ',
      cell: (data) => (
        <div>
          <Link to={"/updateuser/" + data.original.user_id}>
            {data.original.user_name}
          </Link>
        </div>
      ),
    },
    {
      type: "text",
      name: t('workspaces.recordings'),
      accessor: "session_recordings",
      cell: (data) => (
        <div>
          {data.original?.session_recordings?.length || 0}
        </div>
      ),
    },
    {
      type: "text",
      name: t('workspaces.destroy-reason'),
      accessor: "destroy_reason",
      showByDefault: false,
    },
    {
      type: "date",
      name: t('workspaces.destroy-date'),
      accessor: "destroyed_date",
      showByDefault: false,
      cell: (data) => <div>{moment(data.value).isValid() ? moment.utc(data.value).local().format("lll") : "-"}</div>
    },
  ]

  const actions = [
    { id: "preview", icon: "fa-eye", description: t('buttons.preview'), isHidden: (data) => !data.session_recordings?.length > 0 },
    { id: "download", icon: <FontAwesomeIcon icon={faCloudArrowDown} />, description: t('buttons.download'), isHidden: (data) => !data.session_recordings?.length > 0 },
  ];

  const onAction = async (action, item) => {
    switch (action) {
      case "preview":
        setPreview(true)
        setPreviewDetails(item)
        break;
      case 'download':
        setDownloading(true)
        setDownloadPercent(0)

        try {
          const download = await dispatch(getSessionRecording({
            kasm_id: item.kasm_id
          }))
          let urls = download.response.session_recordings.map(rec => rec.session_recording_download_url)
          let location_urls = download.response.session_recordings.map(rec => rec.session_recording_url)
          dispatch(serverLog({
            message: "User " + userInfo.username + " downloaded entire session: " + item.kasm_id,
            level: "info",
            "metric_name": "sessions.session_history.download_all_session_clips",
            "kasm_id": item.kasm_id,
            "session_location_urls": location_urls,
            "total_number_of_urls_requested": location_urls.length
          }))

          let updateAmount = 0
          async function* lazyFetch() {
            for (const url of urls) {
              const finished = await fetch(url)
              const amount = 100 / urls.length
              updateAmount += amount
              setDownloadPercent(Math.round(updateAmount))
              yield finished
            }
          }
          const blob = await downloadZip(lazyFetch()).blob()
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = item.kasm_id + '.zip';
          link.click();
          link.remove();
        } catch (error) {
          notifyFailure({ error, notifyTitle: 'buttons.download' })
        }
        setDownloading(false)
        break;
    }
  }


  useEffect(() => {
    setTriggerOnFetch(true)
  }, [filterUsername]);

  useEffect(() => {
    if (filterCreatedStart && filterCreatedEnd) {
      setTriggerOnFetch(true)
    }
  }, [filterCreatedStart, filterCreatedEnd]);

  const triggerOnFetchFunc = () => {

    const value = _.clone(triggerOnFetch)
    if (value === true) {
      setTimeout(() => {
        setTriggerOnFetch(false)
      }, 50)
    }
    return value
  }

  const onFetch = async (options) => {

    let filters = []
    let or_filters = []
    if (options.filters) {
      options.filters.forEach((filter) => {
        if (filter.id === "image_friendly_name") {
          or_filters.push(filter)
        } else if (filter.id === "user_name") {
          or_filters.push(filter)
        } else if (filter.id === "kasm_id") {
          or_filters.push(filter)
        } else {
          filters.push(filter)
        }
      }) 
    }
    if (filterUsername) {
      filters.push({
        id: 'user_name',
        value: filterUsername,
      })
    }
    if (filterCreatedStart && filterCreatedEnd) {
      filters.push({
        id: 'created_date',
        value: {
          from: filterCreatedStart + ' 00:00:00',
          to: filterCreatedEnd + ' 23:59:59'
        },
      })
    }
    const data = {
      page: options.page,
      pageSize: options.pageSize,
      filters: filters,
      or_filters: or_filters,
      sortBy: options.sortBy,
      sortDirection: options.sortDirection,
    }
    dispatch(getSessionHistory(data))
  }

  const additionalFilters = () => {
    return (
      <React.Fragment>
        <div className="tw-w-full tw-flex tw-justify-between tw-h-8">
          <span><FontAwesomeIcon className="tw-mr-2 tw-opacity-60" icon={faUser} /> {t('workspaces.user')}</span>
          <span onClick={() => setChangeFilterUsername(!changeFilterUsername)} className="text-muted-more tw-cursor-pointer hover:tw-font-semibold">{filterUsername} ></span>
        </div>
        {changeFilterUsername && (
          <React.Fragment>
            <div className="tw-relative tw-mb-3 tw-mt-2">
              <input onChange={(e) => setFilterUsername(e.target.value)} value={filterUsername} className="tw-block tw-w-full tw-rounded-md tw-border-0 tw-py-1.5 tw-pl-3 tw-pr-10 tw-ring-1 tw-ring-inset tw-ring-[color:var(--border-color)] focus:tw-ring-2 focus:tw-ring-blue-500 sm:tw-text-sm sm:tw-leading-6" />
              <div onClick={() => setChangeFilterUsername(false)} className="tw-absolute -tw-right-6 tw-top-0 tw-h-full tw-flex tw-items-center tw-cursor-pointer">
                <FontAwesomeIcon className="tw-w-4 tw-h-4" icon={faXmark} />
              </div>
            </div>

          </React.Fragment>
        )}
        <div className="tw-w-full tw-flex tw-justify-between tw-h-8">
          <span><FontAwesomeIcon className="tw-mr-2 tw-opacity-60" icon={faCalendar} /> {t('workspaces.created')}</span>
          <span onClick={() => setChangeFilterCreated(!changeFilterCreated)} className="text-muted-more tw-cursor-pointer hover:tw-font-semibold">{filterUsername} ></span>
        </div>
        {changeFilterCreated && (
          <React.Fragment>
            <div className="tw-relative tw-mb-3 tw-mt-2">
            <input type="date" onChange={(e) => setFilterCreatedStart(e.target.value)} value={filterCreatedStart} className="tw-block tw-w-full tw-rounded-md tw-border-0 tw-py-1.5 tw-pl-3 tw-pr-10 tw-ring-1 tw-ring-inset tw-ring-[color:var(--border-color)] focus:tw-ring-2 focus:tw-ring-blue-500 sm:tw-text-sm sm:tw-leading-6" />
            <input type="date" onChange={(e) => setFilterCreatedEnd(e.target.value)} value={filterCreatedEnd} className="tw-block tw-w-full tw-rounded-md tw-border-0 tw-py-1.5 tw-pl-3 tw-pr-10 tw-ring-1 tw-ring-inset tw-ring-[color:var(--border-color)] focus:tw-ring-2 focus:tw-ring-blue-500 sm:tw-text-sm sm:tw-leading-6" />
              <div onClick={() => setChangeFilterCreated(false)} className="tw-absolute -tw-right-6 tw-top-0 tw-h-full tw-flex tw-items-center tw-cursor-pointer">
                <FontAwesomeIcon className="tw-w-4 tw-h-4" icon={faXmark} />
              </div>
            </div>

          </React.Fragment>
        )}
      </React.Fragment>
    )
  }

  return (
    <div className="profile-page">
      <PageHeader location={props.location} routes={typeof newRoutes !== 'undefined' ? newRoutes : null} title={t('workspaces.session-history')} icon={<FontAwesomeIcon icon={faTable} />} />
      <Row>
        <Col sm={{ size: 10, order: 3, offset: 1 }}>
          <DataTable
            id="history"
            data={history && history.sessions}
            columns={columns}
            onFetch={onFetch}
            triggerOnFetch={triggerOnFetchFunc()}
            total={history && history.total}
            additionalFilters={additionalFilters()}
            actions={actions}
            onAction={onAction}
            mainId="account_id"
          />
        </Col>
      </Row>
      <Preview
        open={preview}
        setOpen={setPreview}
        details={previewDetails}
        setPreviewDetails={setPreviewDetails}
      />
      <Modal
        contentRaw={<div className="tw-h-36 tw-mb-3 sm:tw-mb-5 tw-flex tw-items-center tw-justify-center"><FontAwesomeIcon className="tw-w-20 tw-h-20" icon={faCircleNotch} spin />
          <div className="tw-absolute tw-inset-0 tw-flex tw-justify-center tw-items-center">{downloadPercent}%</div></div>}
        open={downloading}
        setOpen={setDownloading}
      />
    </div>

  )
}