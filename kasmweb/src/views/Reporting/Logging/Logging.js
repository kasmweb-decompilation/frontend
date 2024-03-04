import React,{ useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {Row, Col } from "reactstrap";
import LogTable from "../../../components/Table/LogTable.js";
import {useTranslation} from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRectangleList } from '@fortawesome/free-solid-svg-icons/faRectangleList';
import { faArrowRotateRight } from '@fortawesome/free-solid-svg-icons/faArrowRotateRight';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { faMinus } from '@fortawesome/free-solid-svg-icons/faMinus';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons/faArrowsRotate';
import { faFloppyDisk } from '@fortawesome/free-solid-svg-icons/faFloppyDisk';
import PageHeader from "../../../components/Header/PageHeader.js";
import { TabList } from "../../../components/Form/Form.js"
import { DescriptionColumn, StandardColumn, SettingColumn } from "../../../components/Table/NewTable";
import { getLogs, gethosts,setLogsPageInfo} from "../../../actions/actionReporting"
import moment from "moment";
import Select from "react-select";
import { Button } from "../../../components/Form/Form.js";
import { Modal } from "../../../components/Form/Modal.js"
import { cyrb53 } from "../../../utils/helpers.js";

const dateForDateTimeInputValue = date => new Date(date.getTime() + new Date().getTimezoneOffset() * -60 * 1000).toISOString().slice(0, 16)


export default function Logging(props) {

    const dispatch = useDispatch()
    const { t } = useTranslation('common');
    const [optionsMode, setOptionsMode] = useState('application');
    const [startDate, setStartDate] = useState(dateForDateTimeInputValue(new Date(Date.now() - 60000 * 60)));
    const [endDate, setEndDate] = useState(dateForDateTimeInputValue(new Date()));
    const [open, setOpen] = useState(false);
    const [details, setDetails] = useState(null);

    const [host, setHost] = useState('all');
    const [updating, setUpdating] = useState(false);
    const [application, setApplication] = useState('all');
    const [levelname, setLevelname] = useState('INFO');
    const [limit, setLimit] = useState(100);
    const [delta, setDelta] = useState(60);
    const [process, setProcess] = useState('all');
    const [search, setSearch] = useState('');
    const [searchUser, setSearchUser] = useState('');
    const [site, setSite] = useState('');
    const [category, setCategory] = useState('');
    const [allowed, setAllowed] = useState('all');
    const [moreOptions, setMoreOptions] = useState(false);
    const [fromReport, setFromReport] = useState(false);
    const [loaded, setLoaded] = useState(false);

    const logs = useSelector(state => state.reporting.logs) || null
    const hosts = useSelector(state => state.reporting.hosts) || null

    const reset = () => {
        setStartDate(dateForDateTimeInputValue(new Date(Date.now() - 60000 * 60)))
        setEndDate(dateForDateTimeInputValue(new Date()))
        setHost('all')
        setApplication('all')
        setProcess('all')
        setAllowed('all')
        setLevelname('INFO')
        setLimit(100)
        setDelta(60)
        setSearch('')
        setSearchUser('')
        setSite('')
        setCategory('')
    }

    useEffect(() => {
        const {state} = props.location
        dispatch(gethosts())

        if (state && state.optionsMode) {
            setOptionsMode(state.optionsMode)
        }
        if (state && state.level) {
            setLevelname(state.level)
        }
        if (state && state.search) {
            setSearch(state.search)
        }
        if (state && state.username) {
            setSearchUser(state.username)
        }
        if (state && state.site) {
            setSite(state.site)
        }
        if (state && state.start_date && state.end_date) {
            setStartDate(dateForDateTimeInputValue(state.start_date))
            setEndDate(dateForDateTimeInputValue(state.end_date))
            setMoreOptions(true)
        } else {
            if (state && state.delta) {
                setDelta(state.delta)
            }
        }
        if (!state || loaded) {
            updateLogs(optionsMode)
        }

        setLoaded(true)
    }, []);

    useEffect(() => {
        const {state} = props.location
        if (!state) {
            if (optionsMode === 'application') {
                setLevelname("INFO")
            } else {
                setLevelname("DEBUG")
            }
        }
    }, [optionsMode]);

    useEffect((value) => {
        if (loaded) {
            updateLogs(optionsMode)
        }
    }, [limit, delta, levelname, application, process, search, searchUser, host, site, category, allowed, startDate, endDate])

    const logClass = (level) => {
        const base = 'tw-rounded tw-text-white tw-text-center '
        if (level === 'WARNING') return base + 'tw-bg-amber-300 dark:tw-bg-amber-300/60 '
        if (level === 'ERROR') return base + 'tw-bg-pink-700 dark:tw-bg-pink-700/60'
        if (level === 'CRITICAL') return base + 'tw-bg-purple-700 dark:tw-bg-purple-700/60'
        return base + 'tw-bg-black/5 dark:tw-bg-white/5 tw-text-color'
    }

    const updateLogs = async(optionsMode) => {
        setUpdating(true)
        let filters = {};
        filters.filters = {};
        filters.exclude_filters = {};
        if (application !== 'all') {
            filters.filters.application = application;
        }
        if (host !== 'all') {
            filters.filters.host = host;
        }
        if (process !== 'all') {
            filters.filters.process = process;
        }
        if (search !== '') {
            filters.filters.search = search;
        }
        if (searchUser !== '') {
            filters.filters.searchUser = searchUser;
        }
        if (optionsMode === "filter")
        {
            filters.filters.metricName = "url_access"
        }
        else{
            filters.exclude_filters.metricName = "url_access"
        }
        if (site !== '') {
            filters.filters.site = site;
        }
        if (category !== '') {
            filters.filters.category = category;
        }
        if (allowed !== 'all') {
            filters.filters.allowed = allowed;
        }

        filters.filters.levelname = levelname;
        filters.limit = limit;
        filters.delta = delta;
        if (moreOptions || fromReport) {
            let start_date = moment(startDate).utc().format("YYYYMMDD HH:mm");
            let end_date = moment(endDate).utc().format("YYYYMMDD HH:mm");
            filters.start_date = start_date;
            filters.end_date= end_date;
            filters.delta = null;
        }
        await dispatch(getLogs(filters))
        setUpdating(false)
    }

    const tabList = [
        { name: 'logging.application', key: 'application' },
        { name: 'logging.web-filter', key: 'filter' }
    ]
    
    const applicationColumns = [
        {
            name: t('logging.timestamp'),
            accessor: "ingest_date",
            colSize: '200px',
            overwrite: true,
            cell: (data) => <StandardColumn key={'ingest_date' + cyrb53(JSON.stringify(data.original))} main={<div className={logClass(data.original.levelname)}>{data.original.levelname}</div>} sub={<div className="tw-text-center">{moment(data.value, 'YYYYMMDD HH:mm').isValid() ? moment.utc(data.value, 'YYYYMMDD HH:mm').local().format('lll') : '-'}</div>} first={true}></StandardColumn>

        },
        {
            name: t('logging.application'),
            accessor: "application",
            colSize: '150px',
        },
        {
            name: t('logging.level'),
            accessor: "levelname",
            colSize: '150px',
            cell: (data) => <div className={logClass(data.value)}>{data.value}</div>,
            showByDefault: false
        },
        {
            name: t('logging.host'),
            accessor: "host",
            colSize: '150px',
        },
        {
            name: t('logging.message'),
            accessor: "message",
            colSize: '4fr',
            overwrite: true,
            cell: (data) => <DescriptionColumn key={'description' +  cyrb53(JSON.stringify(data.original))} main={<div className="tw-text-left tw-font-mono">{data.value}</div>} />
        },
    ]
    
    const filterColumns = [
        {
            name: t('logging.timestamp'),
            accessor: "ingest_date",
            colSize: '200px',
            cell: (data) => <div>{moment(data.value, 'YYYYMMDD HH:mm').isValid() ? moment.utc(data.value, 'YYYYMMDD HH:mm').local().format('lll') : '-'}</div>
        },
        {
            name: t('logging.user'),
            accessor: "kasm_user_name",
            colSize: '150px',
        },
        {
            name: t('logging.allowed'),
            accessor: "allow",
            colSize: '150px',
            overwrite: true,
            cell: (data) => <SettingColumn key={'allow-' + cyrb53(JSON.stringify(data.original))} main={data.value} sub={data.colName} />    
        },
        {
            name: t('logging.category'),
            accessor: "category",
            colSize: '150px',
        },
        {
            name: t('logging.site'),
            accessor: "site",
            colSize: '4fr',
            overwrite: true,
            cell: (data) => <DescriptionColumn key={'site' + cyrb53(JSON.stringify(data.original))} main={<div className="tw-text-left tw-break-all">{data.value}</div>} />
        },
    ]

    const actions = [
        { id: "view", icon: "fa-eye", description: t('buttons.View') },
    ];

    const onAction = (action, item) => {
        switch (action) {
            case "view":
                setDetails(item)
                setOpen(true)
            break;

        }
    }


    const updateStart = (ev) => {
        if (!ev.target['validity'].valid) return;
        setStartDate(ev.target.value)
    }

    const updateEnd = (ev) => {
        if (!ev.target['validity'].valid) return;
        setEndDate(ev.target.value)
    }

    const appOptions = [
        {value:'kasm_api', label:t('logging.kasm-api')},
        {value:'kasm_agent', label:t('logging.kasm-agent')},
        {value:'kasm_manager', label:t('logging.kasm-manager')},
        {value:'kasm_share', label:t('logging.kasm-share')},
        {value:'kasm_ui', label:t('logging.kasm-ui')},
        {value:'connection_proxy', label:t('logging.connection-proxy')},
        {value:'session', label:t('logging.session')},
        {value:'all', label:t('logging.all')}
    ];
    const levelOptions = [
        {value:'DEBUG', label:t('logging.debug')},
        {value:'INFO', label:t('logging.info')},
        {value:'WARNING', label:t('logging.warning')},
        {value:'ERROR', label:t('logging.error')},
        {value:'CRITICAL', label:t('logging.critical')},
    ];
    const limitOptions = [
        {value:50, label:'50'},
        {value:100, label:'100'},
        {value:250, label:'250'},
        {value:500, label:'500'},
        {value:1000, label:'1000'},
    ];
    const processOptions = [
        {value:'all', label:t('logging.all')},
        {value:'admin_api_server', label:t('logging.admin-api-server')},
        {value:'cherrypy', label:t('logging.cherrypy')},
        {value:'client_api_server', label:t('logging.client-api-server')},
        {value:'__main__.handler', label:t('logging.handler')},
        {value:'manager_api_server', label:t('logging.manager-api-server')},
        {value:'public_api_server', label:t('logging.public-api-server')},
        {value:'subscription_api_server', label:t('logging.subscription-api-server')}
    ];
    const allowedOptions = [
        {value:'all', label:t('logging.all')},
        {value:'true', label:t('logging.true')},
        {value:'false', label:t('logging.false')},
    ];
    let hostOptions = [];
    if (hosts) {
        for (let host in hosts.data) {
            hostOptions.push({value: hosts.data[host].host, label: hosts.data[host].host});
        }
        hostOptions.push({value: 'all', label: t('logging.all')});
    }

    const refresh = () => {
        updateLogs(optionsMode)
    }

    function downloadObjectAsJson(exportObj, exportName){
        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj, null, 2));
        var downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href",     dataStr);
        downloadAnchorNode.setAttribute("download", exportName + ".json");
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
      }


    return (
        <div>
            <PageHeader location={props.location} routes={typeof newRoutes !== 'undefined' ? newRoutes : null} title={t('logging.logging')} icon={<FontAwesomeIcon icon={faRectangleList} />} />
            <Row>
                <Col sm={{ size: 10, order: 3, offset: 1 }}>
                    <TabList {...props} tabList={tabList} currentTab={optionsMode} setCurrentTab={setOptionsMode} />
                    <div className="tw-flex tw-gap-2 tw-flex-col sm:tw-flex-row tw-mb-6 kasm-form-field">
                        {optionsMode != "filter" &&
                            <div className="tw-w-full lg:tw-max-w-xs">
                                <small className="text-muted">{t('logging.level')}</small><br />
                                <div className="input">
                                <Select
                                    clearable={false}
                                    autoFocus
                                    value={levelname}
                                    options={levelOptions}
                                    onChange={(select) => setLevelname(select.value)}
                                />
                                </div>
                            </div>
                        }

                        <div className="tw-w-full lg:tw-max-w-xs">
                            <small className="text-muted">{t('logging.limit')}</small><br />
                            <div className="input">
                            <Select
                                clearable={false}
                                autoFocus
                                value={limit}
                                options={limitOptions}
                                onChange={(select) => setLimit(select.value)}
                            />
                            </div>
                        </div>
                        {!moreOptions &&
                            <React.Fragment>
                                <div className="tw-w-full lg:tw-max-w-xs">

                                    <small className="text-muted">{t('logging.time-in-minutes')}</small><br />
                                    <div className="input">
                                    <input
                                        value={delta}
                                        onChange={(select) => setDelta(Number(select.target.value))}
                                        type={"number"}
                                    />
                                    </div>
                                </div>
                                <div>
                                    <small className="text-muted">&nbsp;</small><br />
                                    <Button color="tw-bg-slate-500 tw-h-11 tw-text-white tw-whitespace-nowrap tw-mt-[1px]" icon={<FontAwesomeIcon icon={faPlus} />} section="logging" name="more-filters" onClick={() => setMoreOptions(true)} />
                                </div>
                            </React.Fragment>
                        }
                        <div>
                            <small className="text-muted">&nbsp;</small><br />

                            <button className="tw-bg-slate-500 tw-h-11 tw-w-11 tw-flex tw-justify-center tw-rounded tw-items-center tw-text-white tw-mt-[1px]" onClick={refresh}><FontAwesomeIcon spin={updating} icon={faArrowsRotate} /></button>
                        </div>
                    </div>
                    {moreOptions &&
                        <React.Fragment>
                            <div className="tw-flex tw-gap-2 tw-flex-wrap kasm-form-field">
                                <div className="tw-w-full lg:tw-max-w-xs">
                                    <small className="text-muted">{t('logging.start-date')}</small><br />
                                    <div className="input">
                                    <input
                                        clearIcon={null}
                                        required={true}
                                        onChange={updateStart}
                                        value={startDate}
                                        type="datetime-local"
                                    />
                                    </div>
                                </div>
                                <div className="tw-w-full lg:tw-max-w-xs">
                                    <small className="text-muted">{t('logging.end-date')}</small><br />
                                    <div className="input">
                                    <input
                                        clearIcon={null}
                                        required={true}
                                        onChange={updateEnd}
                                        value={endDate}
                                        type="datetime-local"
                                    />
                                    </div>
                                </div>
                                {optionsMode != "filter" ?
                                    <React.Fragment>
                                        <div className="tw-w-full lg:tw-max-w-xs">
                                            <small className="text-muted">{t('logging.application')}</small><br />
                                            <div className="input">
                                            < Select
                                                clearable={false}
                                                autoFocus
                                                value={application}
                                                options={appOptions}
                                                onChange={(select) => setApplication(select.value)}
                                            />
                                            </div>
                                        </div>
                                        <div className="tw-w-full lg:tw-max-w-xs">
                                            <small className="text-muted">{t('logging.process')}</small><br />
                                            <div className="input">
                                            <Select
                                                clearable={false}
                                                autoFocus
                                                value={process}
                                                options={processOptions}
                                                onChange={(select) => setProcess(select.value)}
                                            />
                                            </div>
                                        </div>
                                        <div className="tw-w-full lg:tw-max-w-xs">
                                            <small className="text-muted">{t('logging.host')}</small><br />
                                            <div className="input">
                                            <Select
                                                clearable={false}
                                                autoFocus
                                                value={host}
                                                options={hostOptions}
                                                onChange={(select) => setHost(select.value)}
                                            />
                                            </div>
                                        </div>
                                    </React.Fragment>

                                    : ''}

                                {optionsMode == "filter" ?
                                    <React.Fragment>
                                        <div className="tw-w-full lg:tw-max-w-xs">
                                            <small className="text-muted">{t('logging.search-site')}</small>
                                            <br />
                                            <div className="input">
                                            <input className={"log-search"}
                                                value={site}
                                                onChange={(select) => setSite(select.target.value)}
                                                type={"text"}
                                            />
                                            </div>
                                        </div>
                                        <div className="tw-w-full lg:tw-max-w-xs">
                                            <small className="text-muted">{t('logging.search-category')}</small>
                                            <div className="input">
                                            <input className={"log-search"}
                                                value={category}
                                                onChange={(select) => setCategory(select.target.value)}
                                                type={"text"}
                                            />
                                            </div>
                                        </div>
                                        <div className="tw-w-full lg:tw-max-w-xs">
                                            <small className="text-muted">{t('logging.search-allowed')}</small>
                                            <div className="input">
                                            <Select
                                                clearable={false}
                                                autoFocus
                                                value={allowed}
                                                options={allowedOptions}
                                                onChange={(select) => setAllowed(select.value)}
                                            />
                                            </div>
                                        </div>
                                    </React.Fragment>
                                    :
                                    <React.Fragment>
                                        <div className="tw-w-full lg:tw-max-w-xs">
                                            <small className="text-muted">{t('logging.search-message')}</small>
                                            <br />
                                            <div className="input">
                                            <input className={"log-search"}
                                                value={search}
                                                onChange={(select) => setSearch(select.target.value)}
                                                type={"text"}
                                            /></div>
                                        </div>
                                    </React.Fragment>
                                }
                                <div className="tw-w-full lg:tw-max-w-xs">
                                    <small className="text-muted">{t('logging.search-user')}</small>
                                    <div className="input">
                                    <input className={"log-search"}
                                                value={searchUser}
                                                onChange={(select) => setSearchUser(select.target.value)}
                                                type={"text"}
                                            />
                                    </div>
                                </div>

                            </div>
                            <div className="tw-flex tw-gap-2 tw-my-6">
                                <Button color="tw-bg-slate-500 tw-text-white" icon={<FontAwesomeIcon icon={faMinus} />} section="logging" name="less-filters" onClick={() => setMoreOptions(false)} />
                                <Button color="tw-bg-slate-500 tw-text-white" icon={<FontAwesomeIcon icon={faArrowRotateRight} flip="horizontal" />} section="logging" name="reset" onClick={() => { reset(); }} />

                            </div>
                        </React.Fragment>
                    }
                    {optionsMode === "filter" && (
                        <LogTable
                            id="logging-filter"
                            columns={filterColumns}
                            data={logs && logs.data}
                            search="site"
                            mainId="logging_id"
                            actions={actions}
                            onAction={onAction}
                            additionalButtons={<Button onClick={() => downloadObjectAsJson(logs.data, 'filter-export')} color="tw-bg-blue-500" icon={<FontAwesomeIcon icon={faFloppyDisk} />} section="system_info" name="Export" />}
                        />
                    )}
                    {optionsMode === "application" && (
                        <LogTable
                            id="logging-application"
                            columns={applicationColumns}
                            data={logs && logs.data}
                            search="message"
                            actions={actions}
                            onAction={onAction}
                            additionalButtons={<Button onClick={() => downloadObjectAsJson(logs.data, 'application-export')} color="tw-bg-blue-500" icon={<FontAwesomeIcon icon={faFloppyDisk} />} section="system_info" name="Export" />}
                        />
                    )}
                </Col>
            </Row>
            {open && (
                <Modal
                    contentRaw={
                        <React.Fragment>
                            <div className="tw-text-left tw-break-all">
                                {details && Object.entries(details).map(([key, data]) => {
                                    let error;
                                    if ((key === 'traceback' || key === 'error_stack') && data !== null) {
                                        error = data.split('\n').map((item, i) => {
                                            return <div className="text-danger" key={i}>{item}<br /></div>
                                        });
                                    }
                                    if ((key === 'message')) {
                                        return
                                    }
                                    return <div>
                                        {data !== null ?
                                            <div>
                                                <span className="tw-font-bold">{key}:</span> {error ? error : data}
                                            </div>
                                            : ''}
                                    </div>
                                })}
                                {details && details.message && (
                                    <React.Fragment>
                                        <div className="tw-font-bold tw-mt-6 tw-mb-3">message</div>
                                        <div className="tw-font-mono tw-whitespace-pre-wrap tw-text-xs">{details.message}</div>
                                    </React.Fragment>
                                )}
                            </div>
                            <div className="tw-mt-5 sm:tw-mt-6">
                                <div className="tw-ml-auto tw-flex tw-gap-3 tw-justify-end">
                                <Button onClick={() => downloadObjectAsJson(details, 'log-entry-export')} color="tw-bg-slate-500" icon={<FontAwesomeIcon icon={faFloppyDisk} />} section="system_info" name="Export" />
                                <Button onClick={() => setOpen(false)} color="tw-bg-slate-500" icon={<FontAwesomeIcon icon={faTimes} />} section="buttons" name="Close" />
                                </div>
                            </div>
                        </React.Fragment>
                    }
                    open={open}
                    maxWidth="sm:tw-max-w-2xl"
                    setOpen={setOpen}
                />
            )}

        </div>
    )
}
