import React, { Component } from 'react';
import { Col, Row, Card, CardBody, Spinner, CardHeader, Progress, Collapse, Button } from "reactstrap";

import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip } from 'chart.js';

import moment from "moment";
import { withRouter, Link } from "react-router-dom";
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
//import KasmTable from "./KasmTable"; // commented because not used

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faKey } from '@fortawesome/free-solid-svg-icons/faKey';
import { faTable } from '@fortawesome/free-solid-svg-icons/faTable';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons/faChevronRight';
import { faLaptop } from '@fortawesome/free-solid-svg-icons/faLaptop';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons/faTriangleExclamation';
import { faUsers } from '@fortawesome/free-solid-svg-icons/faUsers';
import {withTranslation} from "react-i18next";
import Table from '../../../../components/Table/Table';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip);

const makeSparkLineData = (labels, data, variant, label) => {
    const convertedLabels = labels && labels.map((label, i) => {
        return moment.utc(label, "YYYYMMDDHHmm").local().format("MM/DD LT")
    });
    const graph = {
        labels: convertedLabels,
        datasets: [
            {
                backgroundColor: 'transparent',
                borderColor: variant ? variant : '#c2cfd6',
                data: data,
                label: label ? label : "data"
            },
        ],
    };
    return graph;
};

const sparklineChartOpts = {
    tooltips: {
        enabled: false,
        custom: CustomTooltips
    },
    hover: {
        mode: 'index',
        intersect: false
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        x: {
                display: false,
            },
        y: {
                display: false,
            },
    },
    elements: {
        line: {
            borderWidth: 2,
            tension: .4,
        },
        point: {
            radius: 0,
            hitRadius: 10,
            hoverRadius: 4,
            hoverBorderWidth: 3,
        },
    },
    legend: {
        display: false,
    },
    layout: {
        padding: {
            left: 10,
            right: 10,
            top: 10,
            bottom: 10
        }
    },
};

const chartwrapper = {
    position: 'absolute',
    top: '10px',
    left: '50%',
    float: 'right',
    width: '50%'
};

const max = arr => arr !== undefined && arr.reduce((a, b) => Math.max(a, b));
const sum = arr => arr !== undefined && arr.reduce((a, b) => a + b, 0);

class Tabs extends Component {
    constructor(props) {
        super(props);
    }


    formatSeconds(secs) {
        if (secs < 60) {
            return <div className='text-muted tw-font-bold'><span className='tw-font-bold tw-text-color'>{secs}</span>s</div>
        } else if (secs < 3600) {
            let minutes = Math.floor(secs / 60);
            let seconds = secs % 60;
            return <div className='text-muted tw-font-bold'><span className='tw-font-bold tw-text-color'>{minutes}</span>m <span className='tw-font-bold tw-text-color'>{seconds}</span>s</div>
        } else {
            let hour = Math.floor(secs / 3600);
            secs = secs - hour * 3600;
            let minutes = Math.floor(secs / 60);
            let seconds = secs % 60;
            return <div className='text-muted tw-font-bold'><span className='tw-font-bold tw-text-color'>{hour}</span>h <span className='tw-font-bold tw-text-color'>{minutes}</span>m <span className='tw-font-bold tw-text-color'>{seconds}</span>s</div>
        }
    }

    render() {
        const { active_users, logins_by_hour, images, kasms, current_users, current_kasms, t } = this.props;
        const { getLoginsLoading, getActiveUsersLoading, getKasmLengthLoading,
            getErrorLoading, getKasmsLoading, getImageUseLoading,
            getCurrentUsersLoading, getCurrentKasmLoading } = this.props;
        let img_data = [];
        let img_progress = null;
        if (images && images.data) {
            if (images) {
                for (let x in images.data) {
                    img_data.push(images.data[x].count);
                }
            }
            let arr = JSON.parse(JSON.stringify(images.data));
            arr.sort((a, b) => {
                if (a.count === b.count) {
                    return 0
                } else if (a.count < b.count) {
                    return 1
                } else {
                    return -1
                }
            });
            let max_img = sum(img_data);
            img_progress = arr && arr.map((data, i) => {
                return <div key={i} className="progress-group">
                    <div className="progress-group-header">
                        <img className="progress-group-icon" src={data.image_src || "img/favicon.png"} onError={(e) => e.target.src = "img/favicon.png"} />
                        <span className="title"><strong>{data.friendly_name}</strong></span>
                        <span className="ml-auto font-weight-bold">{data.count ? Math.round((data.count / max_img) * 100) : 0}%</span>
                    </div>
                    <div className="progress-group-bars">
                        <Progress style={{ height: '4px' }} color="warning" value={(data.count / max_img) * 100} />
                    </div>
                </div>
            });
        }

        const columns = [
            {
                name: t('dashboard.session-id'),
                accessor: "kasm_id",
                cell: (data) => <div className='tw-py-2'><Link className="buttonLink hover:tw-ml-0" to={"/viewkasm/" + data.value}>{data.value.slice(0, 6)}... <span className="buttonLinkIcon"><FontAwesomeIcon icon={faChevronRight} /></span></Link></div>
            },
            {
                name: t('dashboard.User'),
                accessor: "user.username",
                cell: (data) => <div className='tw-p-2'><Link className="buttonLink" to={"/updateuser/" + data.original.user_id}>{data.value}<span className="buttonLinkIcon"><FontAwesomeIcon icon={faChevronRight} /></span></Link></div>
            },
            {
                name: t('dashboard.Image'),
                accessor: "image.friendly_name",
                cell: (data) => <div className='tw-p-2'><Link className="buttonLink" to={"/updateworkspace/" + data.original.image_id}>{data.value}<span className="buttonLinkIcon"><FontAwesomeIcon icon={faChevronRight} /></span></Link></div>
            },
            {
                name: t('dashboard.Uptime'),
                accessor: "created_date",
                cell: (data) => <div>{moment.utc(data.original.current_time).diff(moment.utc(data.original.created_date), "days" ) ?
                moment.utc(data.original.current_time).diff(moment.utc(data.original.created_date), "days" ) + "d:" : ""}
               {moment.utc(moment.utc(this.props.current_time).diff(moment.utc(data.original.created_date), "hh:mm:ss")).format("HH:mm:ss")}</div>
            },
        ]
        return (


            <React.Fragment>
                <h4>{t('dashboard.Usage')}</h4>
                <dl className="tw-my-5 tw-grid tw-grid-cols-1 tw-gap-5 lg:tw-grid-cols-2 xl:tw-grid-cols-4">
                    <div className="tw-relative tw-overflow-hidden tw-rounded-lg tw-bg-white/70 dark:tw-bg-slate-900/70 tw-px-4 tw-pb-12 tw-pt-5 tw-shadow dark:tw-border dark:tw-border-solid dark:tw-border-slate-400/10 sm:tw-px-6 sm:tw-pt-6">
                        <dt>
                            <div className="tw-absolute tw-rounded-md tw-bg-blue-500 tw-p-3">
                                <svg className="tw-h-6 tw-w-6 tw-text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"></path>
                                </svg>
                            </div>
                            <p className="tw-ml-16 tw-truncate tw-text-sm tw-font-medium text-muted tw-mb-0">{t('dashboard.Max Active Users')}</p>
                        </dt>
                        {getActiveUsersLoading ? <Spinner color="primary" /> :
                            <React.Fragment>
                                {active_users &&
                                    <React.Fragment>
                                        <dd className="tw-ml-16 tw-flex tw-items-baseline tw-pb-6 sm:tw-pb-7">
                                            <p className="tw-text-2xl tw-font-semibold tw-text-color">{active_users.users && max(active_users.users)}</p>
                                            <div className="tw-h-12 tw-absolute tw-bottom-14 tw-left-2 tw-right-2">
                                                <Line
                                                    data={makeSparkLineData(active_users.labels, active_users.users, "#33b5e5", "Users:")}
                                options={sparklineChartOpts} width={300} height={48} />
                                            </div>

                                            <div className="tw-absolute tw-inset-x-0 tw-bottom-0 tw-bg-gray-50 dark:tw-bg-slate-400/5 tw-px-4 tw-py-4 sm:tw-px-6">
                                                <div className="tw-text-sm">
                                                    &nbsp;
                                                </div>
                                            </div>
                                        </dd>

                                    </React.Fragment>}
                            </React.Fragment>
                        }
                    </div>
                    <div className="tw-relative tw-overflow-hidden tw-rounded-lg tw-bg-white/70 dark:tw-bg-slate-900/70 tw-px-4 tw-pb-12 tw-pt-5 tw-shadow dark:tw-border dark:tw-border-solid dark:tw-border-slate-400/10 sm:tw-px-6 sm:tw-pt-6">
                        <dt>
                            <div className="tw-absolute tw-rounded-md tw-bg-blue-500 tw-p-3">
                                <svg className="tw-h-6 tw-w-6 tw-text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"></path>
                                </svg>
                            </div>
                            <p className="tw-ml-16 tw-truncate tw-text-sm tw-font-medium text-muted tw-mb-0">{t('dashboard.Successful Logins')}</p>
                        </dt>
                        {getLoginsLoading ? <Spinner color="success" /> :
                            <React.Fragment>
                                {logins_by_hour &&
                                    <React.Fragment>
                                        <dd className="tw-ml-16 tw-flex tw-items-baseline tw-pb-6 sm:tw-pb-7">
                                            <p className="tw-text-2xl tw-font-semibold tw-text-color">{sum(logins_by_hour.success_login)}</p>
                                            <div className="tw-h-12 tw-absolute tw-bottom-14 tw-left-2 tw-right-2">
                                                <Line
                                                    data={makeSparkLineData(logins_by_hour.labels, logins_by_hour.success_login, "#007E33", "Logins:")}
                                                    options={sparklineChartOpts} width={300} height={48} />
                                            </div>

                                            <div className="tw-absolute tw-inset-x-0 tw-bottom-0 tw-bg-gray-50 dark:tw-bg-slate-400/5 tw-px-4 tw-py-4 sm:tw-px-6">
                                                <div className="tw-text-sm">
                                                    <Link
                                                        className="buttonLink"
                                                        to={{
                                                            pathname: '/logging',
                                                            state: {
                                                                level: 'INFO',
                                                                search: 'Successful authentication attempt',
                                                                start_date: this.props.selectOpen ? this.props.start_date : null,
                                                                end_date: this.props.selectOpen ? this.props.end_date : null,
                                                                delta: this.props.delta,
                                                            }
                                                        }}
                                                    >
                                                        View all<span className="buttonLinkIcon"><FontAwesomeIcon icon={faChevronRight} /></span>
                                                    </Link>
                                                </div>
                                            </div>
                                        </dd>

                                    </React.Fragment>}
                            </React.Fragment>
                        }
                    </div>

                    <div className="tw-relative tw-overflow-hidden tw-rounded-lg tw-bg-white/70 dark:tw-bg-slate-900/70 tw-px-4 tw-pb-12 tw-pt-5 tw-shadow dark:tw-border dark:tw-border-solid dark:tw-border-slate-400/10 sm:tw-px-6 sm:tw-pt-6">
                        <dt>
                            <div className="tw-absolute tw-rounded-md tw-bg-blue-500 tw-p-3">
                                <FontAwesomeIcon className="tw-w-6 tw-h-6 tw-text-white" icon={faKey} />
                            </div>
                            <p className="tw-ml-16 tw-truncate tw-text-sm tw-font-medium text-muted tw-mb-0">{t('dashboard.Failed Logins')}</p>
                        </dt>
                        {getLoginsLoading ? <Spinner color="warning" /> :
                            <React.Fragment>
                                {logins_by_hour &&
                                    <React.Fragment>
                                        <dd className="tw-ml-16 tw-flex tw-items-baseline tw-pb-6 sm:tw-pb-7">
                                            <p className="tw-text-2xl tw-font-semibold tw-text-color">{sum(logins_by_hour.failed_login)}</p>
                                            <div className="tw-h-12 tw-absolute tw-bottom-14 tw-left-2 tw-right-2">
                                                <Line data={makeSparkLineData(logins_by_hour.labels, logins_by_hour.failed_login, "#CC0000", "Failed Logins:")} options={sparklineChartOpts} width={300} height={48} />
                                            </div>

                                            <div className="tw-absolute tw-inset-x-0 tw-bottom-0 tw-bg-gray-50 dark:tw-bg-slate-400/5 tw-px-4 tw-py-4 sm:tw-px-6">
                                                <div className="tw-text-sm">
                                                    <Link
                                                        className="buttonLink"
                                                        to={{
                                                            pathname: '/logging',
                                                            state: {
                                                                level: 'WARNING',
                                                                search: 'attempt',
                                                                start_date: this.props.selectOpen ? this.props.start_date : null,
                                                                end_date: this.props.selectOpen ? this.props.end_date : null,
                                                                delta: this.props.delta,
                                                            }
                                                        }}
                                                    >
                                                        View all<span className="buttonLinkIcon"><FontAwesomeIcon icon={faChevronRight} /></span>
                                                    </Link>
                                                </div>
                                            </div>
                                        </dd>

                                    </React.Fragment>}
                            </React.Fragment>
                        }
                    </div>

                    <div className="tw-relative tw-overflow-hidden tw-rounded-lg tw-bg-white/70 dark:tw-bg-slate-900/70 tw-px-4 tw-pb-12 tw-pt-5 tw-shadow dark:tw-border dark:tw-border-solid dark:tw-border-slate-400/10 sm:tw-px-6 sm:tw-pt-6">
                        <dt>
                            <div className="tw-absolute tw-rounded-md tw-bg-blue-500 tw-p-3">
                                <FontAwesomeIcon className="tw-w-6 tw-h-6 tw-text-white" icon={faTable} />
                            </div>
                            <p className="tw-ml-16 tw-truncate tw-text-sm tw-font-medium text-muted tw-mb-0">{t('dashboard.Created Sessions')}</p>
                        </dt>
                        {getKasmsLoading ? <Spinner color="info" /> :
                            <React.Fragment>
                                {kasms &&
                                    <React.Fragment>
                                        <dd className="tw-ml-16 tw-flex tw-items-baseline tw-pb-6 sm:tw-pb-7">
                                            <p className="tw-text-2xl tw-font-semibold tw-text-color">{this.props.created_kasms ? this.props.created_kasms : 0}</p>
                                            <div className="tw-h-12 tw-absolute tw-bottom-14 tw-left-2 tw-right-2">
                                                <Line data={makeSparkLineData(kasms.labels, kasms.kasms, "#ffbb33", "Sessions:")} options={sparklineChartOpts} width={300} height={48} />
                                            </div>

                                            <div className="tw-absolute tw-inset-x-0 tw-bottom-0 tw-bg-gray-50 dark:tw-bg-slate-400/5 tw-px-4 tw-py-4 sm:tw-px-6">
                                                <div className="tw-text-sm">
                                                    <Link
                                                        className="buttonLink"
                                                        to={{
                                                            pathname: '/logging',
                                                            state: {
                                                                level: 'INFO',
                                                                search: 'Creating Kasm',
                                                                start_date: this.props.selectOpen ? this.props.start_date : null,
                                                                end_date: this.props.selectOpen ? this.props.end_date : null,
                                                                delta: this.props.delta,
                                                            }
                                                        }}
                                                    >
                                                        View all<span className="buttonLinkIcon"><FontAwesomeIcon icon={faChevronRight} /></span>
                                                    </Link>
                                                </div>
                                            </div>
                                        </dd>

                                    </React.Fragment>}
                            </React.Fragment>
                        }
                    </div>
                </dl>

                <div className='tw-my-5 tw-mt-10 tw-flex tw-flex-col lg:tw-flex-row tw-gap-5'>
                    <div className="scalar_reports lg:tw-w-1/2">
                        <h4 className="">{t('dashboard.Current Statistics')}</h4>
                        <div className='tw-flex tw-flex-col lg:tw-flex-row tw-gap-5 tw-mt-5'>
                            <div className='lg:tw-w-1/2 tw-flex tw-flex-col tw-gap-5'>
                                <div className='tw-flex tw-items-center tw-relative tw-overflow-hidden tw-rounded-lg tw-bg-white/70 dark:tw-bg-slate-900/70 tw-p-6 tw-shadow dark:tw-border dark:tw-border-solid dark:tw-border-slate-400/10'>
                                    <div className="tw-rounded-md tw-bg-blue-500 tw-p-3 tw-mr-3">
                                        <FontAwesomeIcon className="tw-w-6 tw-h-6 tw-text-white" icon={faLaptop} />
                                    </div>
                                    <div className='tw-flex tw-flex-col tw-mr-6'>
                                        <small className="tw-text-sm tw-font-medium text-muted">{t('dashboard.AVG TIME')}</small>

                                        <span className={"tw-font-semibold tw-text-color tw-text-base"} style={{ whiteSpace: 'nowrap' }}>
                                            {getKasmLengthLoading ? <React.Fragment><Spinner size={'sm'} color={'primary'} /><br /></React.Fragment>
                                                :
                                                <React.Fragment>
                                                    {this.props.average_kasm_duration ?
                                                        this.formatSeconds(Math.round(this.props.average_kasm_duration))
                                                        : <React.Fragment>0s<br /></React.Fragment>
                                                    }
                                                </React.Fragment>}
                                        </span>
                                    </div>
                                </div>
                                <Link
                                    className="tw-group tw-block !tw-no-underline"
                                    to={{
                                        pathname: '/logging',
                                        state: {
                                            level: 'ERROR',
                                            start_date: this.props.selectOpen ? this.props.start_date : null,
                                            end_date: this.props.selectOpen ? this.props.end_date : null,
                                            delta: this.props.delta,
                                        }
                                    }}>
                                    <span className='tw-flex tw-items-center tw-relative tw-transition-colors tw-overflow-hidden tw-rounded-lg tw-bg-white/70 dark:tw-bg-slate-900/70 group-hover:tw-bg-white/80 dark:group-hover:tw-bg-slate-900/90 tw-p-6 tw-shadow dark:tw-border dark:tw-border-solid dark:tw-border-slate-400/10'>
                                        <span className="tw-rounded-md tw-bg-pink-700 tw-p-3 tw-mr-3">
                                            <FontAwesomeIcon className="tw-w-6 tw-h-6 tw-text-white" icon={faTriangleExclamation} />
                                        </span>

                                        <span className='tw-flex tw-flex-col tw-mr-6'>
                                            <small className="tw-text-sm tw-font-medium text-muted">{t('dashboard.ERRORS')}</small>
                                            {getErrorLoading ? <React.Fragment><Spinner size={'sm'} color={'danger'} /><br /></React.Fragment>
                                                :
                                                <React.Fragment>
                                                    <span className={"tw-text-pink-700 tw-font-semibold tw-text-xl"}>{this.props.errors || 0}</span>

                                                </React.Fragment>
                                            }

                                        </span>

                                        <span className="tw-absolute tw-right-0 tw-top-0 tw-bottom-0 tw-flex tw-w-12 tw-justify-center tw-items-center tw-transition-colors tw-bg-gray-50 dark:tw-bg-slate-400/5 tw-text-[var(--text-color)] group-hover:tw-bg-white dark:group-hover:tw-bg-slate-400/5">
                                            <FontAwesomeIcon icon={faChevronRight} />
                                        </span>

                                    </span>
                                </Link>


                            </div>
                            <div className='lg:tw-w-1/2 tw-flex tw-flex-col tw-gap-5'>


                                <div className='tw-flex tw-items-center tw-relative tw-overflow-hidden tw-rounded-lg tw-bg-white/70 dark:tw-bg-slate-900/70 tw-p-6 tw-shadow dark:tw-border dark:tw-border-solid dark:tw-border-slate-400/10'>
                                    <div className="tw-rounded-md tw-bg-blue-500 tw-p-3 tw-mr-3">
                                        <FontAwesomeIcon className="tw-w-6 tw-h-6 tw-text-white" icon={faUsers} />
                                    </div>
                                    <div className='tw-flex tw-flex-col tw-mr-6'>
                                        <small className="tw-text-sm tw-font-medium text-muted">{t('dashboard.USERS')}</small>

                                        <span className={"tw-font-semibold tw-text-color"} style={{ whiteSpace: 'nowrap' }}>
                                            {getCurrentUsersLoading ? <React.Fragment><Spinner size={'sm'} color={'success'} /><br /></React.Fragment>
                                                :
                                                <React.Fragment>
                                                    <span className={"tw-text-xl"}>
                                                        {current_users ? current_users
                                                            : '0'}
                                                    </span><br />
                                                </React.Fragment>
                                            }
                                        </span>
                                    </div>


                                </div>

                                <div className='tw-flex tw-items-center tw-relative tw-overflow-hidden tw-rounded-lg tw-bg-white/70 dark:tw-bg-slate-900/70 tw-p-6 tw-shadow dark:tw-border dark:tw-border-solid dark:tw-border-slate-400/10'>
                                    <div className="tw-rounded-md tw-bg-blue-500 tw-p-3 tw-mr-3">
                                        <FontAwesomeIcon className="tw-w-6 tw-h-6 tw-text-white" icon={faTable} />
                                    </div>
                                    <div className='tw-flex tw-flex-col tw-mr-6'>
                                        <small className="tw-text-sm tw-font-medium text-muted">{t('workspaces.workspaces')}</small>

                                        <span className={"tw-font-semibold tw-text-color"} style={{ whiteSpace: 'nowrap' }}>
                                            {getCurrentKasmLoading ? <React.Fragment><Spinner size={'sm'} color={'warning'} /><br /></React.Fragment>
                                                :
                                                <React.Fragment>
                                                    <span className={"tw-text-xl"}>{current_kasms || 0}</span><br />
                                                </React.Fragment>
                                            }
                                        </span>
                                    </div>



                                </div>
                            </div>
                        </div>
                    </div >
                    <div className="scrollbar lg:tw-w-1/2" style={{ minWidth: '305px' }}>
                        <h4 className="">{t('dashboard.Image Usage')}</h4>
                        <div className="tw-relative tw-h-[219px] tw-mt-5 tw-overflow-y-auto tw-rounded-lg tw-bg-white/70 dark:tw-bg-slate-900/70 tw-px-4 tw-py-5 tw-shadow dark:tw-border dark:tw-border-solid dark:tw-border-slate-400/10 sm:tw-px-6 sm:tw-pt-6">
                            {getImageUseLoading ? <span className={"text-center"}><Spinner color='warning' /></span> :
                                <ul className='' style={{ paddingInlineStart: '0px' }} >
                                    {img_progress && img_progress}
                                </ul>
                            }
                        </div>
                    </div>
                </div>
                {this.props.live_kasms && this.props.live_kasms.length > 0 &&
                    <React.Fragment>
                        <h4 className="tw-pt-4 tw-mb-0">{t('dashboard.Live Sessions')}</h4>
                        <Table
                            id="live_kasms"
                            data={this.props.live_kasms}
                            columns={columns}
                            readOnly={false}
                        />
                    </React.Fragment>
                }

            </React.Fragment>
        );
    }
}
const TabsTranslated = withTranslation('common')(Tabs)
export default TabsTranslated;