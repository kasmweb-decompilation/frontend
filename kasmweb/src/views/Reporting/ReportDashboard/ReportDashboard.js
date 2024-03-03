import React,{ Component } from "react";
import {Row, Alert, Col, Spinner, Card, CardHeader, CardBody, Collapse } from "reactstrap";
import { connect } from "react-redux";
import { NotificationManager } from "react-notifications";
import { withRouter, Link } from "react-router-dom";
import AgentTabs from "./ReportComponents/AgentTabs"
import UsageTab from "./ReportComponents/UsageTab"
import UserTable from "./ReportComponents/UserTable"
import DomainTable from "./ReportComponents/DomainTable"
import KasmTable from "./ReportComponents/KasmTable"
import moment from "moment";
import { getLogins, getTotalUsers, getErrors, getCreatedKasms, getCurrentKasms,  getCurrentUsers, getDomainUsage,
    getAgent, getActiveUsers, getAvgKasm, getDestroyedKasms, getImageUsage, getUserUsage, getAlert, getKasms,setUserUsagePageInfo,setDomainUsagePageInfo } from "../../../actions/actionReporting"
import { getKasm } from "../../../actions/actionKasm";
import Proptypes from "prop-types";
import Select from "react-select";
import {withTranslation} from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleUser } from '@fortawesome/pro-light-svg-icons/faCircleUser';
import { faClock } from '@fortawesome/pro-light-svg-icons/faClock';
import PageHeader from "../../../components/Header/PageHeader";
import { FormField, Groups, TabList } from "../../../components/Form"
import { Modal, ModalFooter } from "../../../components/Form/Modal";

var intID = 0;

const dateForDateTimeInputValue = date => new Date(date.getTime() + new Date().getTimezoneOffset() * -60 * 1000).toISOString().slice(0, 16)

class ReportDashboard extends Component{
    constructor(props) {
        super(props);
        this.state = {
            alert: true,
            endDate: dateForDateTimeInputValue(new Date()),
            startDate: dateForDateTimeInputValue(new Date(Date.now() - 60000 * 60)),
            resolution: 10,
            timePeriod: 1440,
            customModal: false,
            polling: 0,
            collapseAgents: true,
            collapseUser: true,
            collapseDomain: true,
            collapseUsage: true,
            timeData: {},
            tab: 'usage'
        };

        this.getReports = this.getReports.bind(this);
        this.changeResolution = this.changeResolution.bind(this);
        this.changeTimePeriod = this.changeTimePeriod.bind(this);
        this.toggleCustomModal = this.toggleCustomModal.bind(this);
        this.startPolling = this.startPolling.bind(this);
        this.changePoll = this.changePoll.bind(this);
        this.toggleAgents = this.toggleAgents.bind(this);
        this.toggleUser = this.toggleUser.bind(this);
        this.toggleUsage = this.toggleUsage.bind(this);
        this.toggleDomain = this.toggleDomain.bind(this);
        this.getTimeData = this.getTimeData.bind(this);
        this.updateTimeSettings = this.updateTimeSettings.bind(this);
    }

    updateTimeSettings() {
        this.getReports();
        this.toggleCustomModal()
    }

    toggleAgents() {
        if (!this.state.collapseAgents) {
            this.props.getAgent(this.state.timeData);
        }

        this.setState({collapseAgents: !this.state.collapseAgents}, () => {
            window.localStorage.setItem('collapseAgents', this.state.collapseAgents);
        });
    }

    toggleUser() {
        if (!this.state.collapseUser) {
            this.props.getUserUsage(this.state.timeData);
        }

        this.setState({collapseUser: !this.state.collapseUser}, () => {
            window.localStorage.setItem('collapseUser', this.state.collapseUser);
        });
    }

    toggleDomain() {
        if (!this.state.collapseDomain) {
            this.props.getDomainUsage(this.state.timeData);
        }

        this.setState({collapseDomain: !this.state.collapseDomain}, () => {
            window.localStorage.setItem('collapseDomain', this.state.collapseDomain);
        });
    }

    toggleUsage() {
        if (!this.state.collapseUsage) {
            let time_data = this.getTimeData();
            this.props.getCurrentKasms(this.state.timeData);
            this.props.getCurrentUsers(this.state.timeData);
            this.props.getKasms(this.state.timeData);
            this.props.getImageUsage(this.state.timeData);
            this.props.getLogins(this.state.timeData);
            this.props.getActiveUsers(this.state.timeData);
            this.props.getAvgKasm(this.state.timeData);
            this.props.getCreatedKasms(this.state.timeData);
            this.props.getErrors(this.state.timeData);
            this.props.getkasm();
        }

        this.setState({collapseUsage: !this.state.collapseUsage}, () => {
            window.localStorage.setItem('collapseUsage', this.state.collapseUsage);
        });
    }

    toggleCustomModal() {
        this.setState({customModal: !this.state.customModal});
    }

    changeResolution(res) {
        this.setState({resolution: res.value});
    }

    changeTimePeriod(res) {
        if (res.value === 1) {
            this.setState({timePeriod: res.value});
            this.toggleCustomModal();
        } else {
            // set state is asynchronous use call back function to update reports after change
            this.setState(() => {return {timePeriod: res.value};}, () => {this.getReports()});
        }
    }

    changePoll(res) {
        this.setState({polling: res.value});
    }

    getTimeData() {
        const {startDate, endDate, polling, timePeriod} = this.state;
        let time_data = {};
        if (timePeriod === 1) {
            let start_date = moment(startDate).utc().format("YYYYMMDD HH:mm");
            let end_date = moment(endDate).utc().format("YYYYMMDD HH:mm");
            let res;
            let time = moment.utc(endDate).diff(moment.utc(startDate));
            time = (time /1000) /60;
            //set a default resolution
            if (time < 61) {
                res = 1;
            } else if (time < 361) {
                res = 10;
            } else if (time < 4321) {
                res = 60
            } else
                res = 1440;
            time_data = {
                start_date: start_date,
                end_date: end_date,
                resolution: res
            };
            if (polling !== 0) {
                this.startPolling(polling)
            }
        } else {
            //Setting default options for time period selections
            if (timePeriod === 60) {
                time_data = {
                    delta: 60,
                    resolution: 1
                };
            } else if (timePeriod === 1440) {
                time_data = {
                    delta: 1440,
                    resolution: 60
                };
            } else if (timePeriod === 10080) {
                time_data = {
                    delta: 10080,
                    resolution: 1440
                };
            } else if (timePeriod === 0) {
                time_data = {
                    delta: 60,
                    resolution: 1
                };
                this.startPolling(300);
            }
            window.localStorage.setItem('report_delta', this.state.timePeriod);
        }

        this.setState({timeData: time_data});
        return time_data;
    }

    getReports(){
       let timeData = this.getTimeData();

        if (this.state.collapseUser) {
            this.props.getUserUsage(timeData);
        }

        if (this.state.collapseDomain) {
            this.props.getDomainUsage(timeData);
        }

        if (this.state.collapseAgents) {
            this.props.getAgent(timeData);
        }

        if (this.state.collapseUsage) {
            this.props.getCurrentKasms(timeData);
            this.props.getCurrentUsers(timeData);
            this.props.getKasms(timeData);
            this.props.getImageUsage(timeData);
            this.props.getLogins(timeData);
            this.props.getActiveUsers(timeData);
            this.props.getAvgKasm(timeData);
            this.props.getCreatedKasms(timeData);
            this.props.getErrors(timeData);
            this.props.getkasm();
        }
    }

    startPolling(seconds) {
        clearInterval(intID);
        intID = setInterval(this.getReports, seconds * 1000);
    }

    componentDidMount(){
        this.getReports();
        this.props.getAlert();
    }

    UNSAFE_componentWillMount() {
        this.setState({
           collapseAgents: window.localStorage.getItem('collapseAgents') ? window.localStorage.getItem('collapseAgents') === 'true' : true,
           collapseUser: window.localStorage.getItem('collapseUser') ? window.localStorage.getItem('collapseUser') === 'true' : true,
            collapseDomain: window.localStorage.getItem('collapseDomain') ? window.localStorage.getItem('collapseDomain') === 'true' : true,
           collapseUsage: window.localStorage.getItem('collapseUsage') ? window.localStorage.getItem('collapseUsage') === 'true' : true
        });
        window.localStorage.getItem('report_delta') &&
        this.setState({ timePeriod: JSON.parse(window.localStorage.getItem('report_delta'))});
    }

    componentWillUnmount() {
        clearInterval(intID);
    }

    updateStartDate(date) {
        if (!date.target['validity'].valid) return;
        this.setState({
            startDate: date.target.value
        });
    }

    updateEndDate(date) {
        if (!date.target['validity'].valid) return;
        this.setState({
            endDate: date.target.value
        });
    }

    render(){
        const {logins_by_hour, active_users, kasms, get_alert, t} = this.props;
        const {images, agents, users, domains, current_users, current_kasms } = this.props;
        const {created_kasms, avg_kasm_duration, get_errors} = this.props;
        const {getLoginsLoading, getActiveUsersLoading, getAgentsLoading, getKasmsLoading, getImageUseLoading } = this.props;
        const {getTotalUsersLoading, getKasmLengthLoading, getCurrentUsersLoading , getErrorLoading, getCurrentKasmLoading } = this.props;
        const { getKasmUseLoading } = this.props;
        const { getDomainUseLoading } = this.props;

        const timeOptions = [
            {value:0, label: t('dashboard.Real-Time')},
            {value:60, label: t('dashboard.Last Hour')},
            {value:1440, label: t('dashboard.Last Day')},
            {value:10080, label: t('dashboard.Last Week')},
            {value:1, label: t('dashboard.Custom')}
        ];
        const pollOptions = [
            {value:0, label: t('dashboard.Off')},
            {value:60, label: t('dashboard.Every Minute')},
            {value:(60 * 5), label: t('dashboard.Five Minutes')},
            {value:(60 * 10), label: t('dashboard.Ten Minutes')},
        ];
        
        return(
            <div className="reporting profile-page">
                <PageHeader title={t('dashboard.dashboard')} icon={<FontAwesomeIcon icon={faCircleUser}  />} right={(
                    <div className="tw-w-full lg:tw-w-72">
                        <small className="text-muted">{t('dashboard.Time Period')}</small><br />
                        <Select
                            clearable={false}
                            autoFocus
                            value={this.state.timePeriod}
                            options={timeOptions}
                            onChange={this.changeTimePeriod}
                        />

                    </div>
                )} />
                <Row>
                    <Col sm={12} md={{ size: 10, offset: 1 }}>
                <TabList {...this.props} tabList={[{
                    name: 'dashboard.Usage',
                    key: 'usage'
                }, {
                    name: 'dashboard.Agents',
                    key: 'agents'
                }, {
                    name: 'dashboard.User Usage',
                    key: 'userusage'
                }, {
                    name: 'dashboard.Domain Usage',
                    key: 'domainusage'
                }]} currentTab={this.state.tab} setCurrentTab={(value) => this.setState({ tab: value })} />

                    </Col>
                </Row>
                {}
                <Row className={"pt-2" + (this.state.tab === 'usage' ? ' tw-block' : ' tw-hidden')}>
                    <Col sm={12} md={{ size: 10, offset: 1 }}>
                            <UsageTab
                                active_users={active_users}
                                logins_by_hour={logins_by_hour}
                                average_kasm_duration={avg_kasm_duration}
                                created_kasms={created_kasms}
                                errors={get_errors}
                                images={images}
                                kasms={kasms}
                                start_date={this.state.startDate}
                                end_date={this.state.endDate}
                                delta={this.state.timePeriod}
                                selectOpen={this.state.customModal}
                                current_kasms={current_kasms}
                                current_users={current_users}
                                getLoginsLoading={getLoginsLoading}
                                getActiveUsersLoading={getActiveUsersLoading}
                                getTotalUsersLoading={getTotalUsersLoading}
                                getKasmLengthLoading={getKasmLengthLoading}
                                getErrorLoading={getErrorLoading}
                                getKasmsLoading={getKasmsLoading}
                                getImageUseLoading={getImageUseLoading}
                                getCurrentKasmLoading={getCurrentKasmLoading}
                                getCurrentUsersLoading={getCurrentUsersLoading}
                                live_kasms={this.props.live_kasms}
                                current_time={this.props.current_time}
                            />
                    </Col>
                </Row>

                <Row className={(this.state.tab === 'agents' ? ' tw-block' : ' tw-hidden')}>
                    <Col sm={12} md={{ size: 10, offset: 1 }}>
                                    {getAgentsLoading ?
                                        <span className={"agentcard"}><Spinner color="primary" /></span>
                                        :
                                        agents ? <AgentTabs agents={agents} timeData={this.getTimeData}/> : 'No Data'
                                    }
                    </Col>
                </Row>

                {getKasmUseLoading ?
                    <Row className={(this.state.tab === 'userusage' ? ' tw-block' : ' tw-hidden')}>
                        <Col sm={12} md={{ size: 10, offset: 1 }}>
                            <center><Spinner color="primary" /></center>
                        </Col>
                    </Row>
                    :
                    <Row className={(this.state.tab === 'userusage' ? ' tw-block' : ' tw-hidden')}>
                        <Col sm={12} md={{ size: 10, offset: 1 }}>
                                <UserTable delta={this.state.timePeriod} users={users || []} setPageInfo = {this.props.setUerUsagePageInfo} pageSize = {this.props.userUsagePages.pageSize} pageNo = {this.props.userUsagePages.pageNo} />
                        </Col>
                    </Row>
                }

                {getDomainUseLoading ?
                    <Row className={(this.state.tab === 'domainusage' ? ' tw-block' : ' tw-hidden')}>
                        <Col sm={12} md={{ size: 10, offset: 1 }}>
                                    <center><Spinner color="primary" /></center>
                        </Col>
                    </Row>
                    :
                    <Row className={(this.state.tab === 'domainusage' ? ' tw-block' : ' tw-hidden')}>
                        <Col sm={12} md={{ size: 10, offset: 1 }}>
                                        <DomainTable domains={domains || []}
                                        delta={this.state.timePeriod}
                                        setPageInfo = {this.props.setDomainUsagePageInfo}
                                        pageSize = {this.props.domainUsagePages.pageSize} pageNo = {this.props.domainUsagePages.pageNo}
                                        />
                        </Col>
                    </Row>
                }

                <Modal
                    icon={<FontAwesomeIcon icon={faClock} />}
                    iconBg="tw-bg-blue-500 tw-text-white"
                    title="dashboard.Custom Time Settings"
                    contentRaw={
                        <div className='tw-text-left tw-mt-8'>
                        <Groups noPadding section="dashboard">
                        <FormField label="Start Date">
                                <input
                                required={true}
                                onChange={(date) => this.updateStartDate(date)}
                                value={this.state.startDate}
                                        type="datetime-local"
                                    />

                            </FormField>
                            <FormField label="End Date">
                                <input
                                required={true}
                                onChange={(date) => this.updateEndDate(date)}
                                value={this.state.endDate}
                                        type="datetime-local"
                                    />

                            </FormField>
                            <FormField label="Auto-Refresh">
                            <Select
                                clearable={false}
                                autoFocus
                                value={this.state.polling}
                                options={pollOptions}
                                onChange={this.changePoll}
                            />

                            </FormField>
                        </Groups>
                        </div>
                    }
                    open={this.state.customModal}
                    setOpen={this.toggleCustomModal}
                    modalFooter={<ModalFooter cancel={this.toggleCustomModal} saveName='buttons.Update' save={this.updateTimeSettings} />}
                />

            </div>
        );
    }
}

ReportDashboard.propTypes = {
    active_users: Proptypes.object,
    logins_by_hour: Proptypes.object,
    agents: Proptypes.object,
    users: Proptypes.object,
    domains: Proptypes.object,
    images: Proptypes.object,
    total_users: Proptypes.number,
    created_kasms: Proptypes.number,
    average_kasm_duration: Proptypes.string,
    errors_reported: Proptypes.number,
};

const ReportDashboardTranslated = withTranslation('common')(ReportDashboard)

let DashboardWithRouter = withRouter(ReportDashboardTranslated);


export default connect(state =>
        ({
            active_users: state.reporting.active_users,
            agents: state.reporting.agents,
            users: state.reporting.users,
            domains: state.reporting.domains,
            images: state.reporting.images,
            total_users: state.reporting.total_users,
            average_kasm_duration: state.reporting.average_kasm_duration,
            errors_reported: state.reporting.errors_reported,
            logins_by_hour: state.reporting.logins_by_hour,
            avg_kasm_duration: state.reporting.avg_kasm_duration,
            destroyed_kasms: state.reporting.destroyed_kasms,
            created_kasms: state.reporting.created_kasms,
            get_errors: state.reporting.get_errors,
            get_alert: state.reporting.get_alert,
            getLoginsLoading: state.reporting.getLoginsLoading,
            getActiveUsersLoading: state.reporting.getActiveUsersLoading,
            getAgentsLoading: state.reporting.getAgentsLoading,
            getTotalUsersLoading: state.reporting.getTotalUsersLoading,
            getKasmLengthLoading: state.reporting.getKasmLengthLoading,
            getDestroyedKasmsLoading: state.reporting.getDestroyedKasmsLoading,
            getCreatedKasmsLoading: state.reporting.getCreatedKasmsLoading,
            getReportLoading: state.reporting.getReportLoading,
            getErrorLoading: state.reporting.getErrorLoading,
            getImageUseLoading: state.reporting.getImageUseLoading,
            getKasmsLoading: state.reporting.getKasmsLoading,
            getKasmUseLoading: state.reporting.getKasmUseLoading,
            getDomainUseLoading: state.reporting.getDomainUseLoading,
            getCurrentUsersLoading: state.reporting.getCurrentUsersLoading,
            getCurrentKasmLoading: state.reporting.getCurrentKasmLoading,
            kasms: state.reporting.kasms,
            current_kasms: state.reporting.current_kasms,
            current_users: state.reporting.current_users,
            live_kasms: state.kasms.kasms,
            current_time: state.kasms.current_time || null,
            userUsagePages : {pageSize : state.reporting.userUsagePageSize, pageNo : state.reporting.userUsagePageNo},
            domainUsagePages : {pageSize : state.reporting.domainUsagePageSize, pageNo : state.reporting.domainUsagePageNo},
        }),
    dispatch =>
        ({
            getAgent: (data) => dispatch(getAgent(data)),
            getActiveUsers: (data) => dispatch(getActiveUsers(data)),
            getLogins: (data) => dispatch(getLogins(data)),
            getAvgKasm: (data) => dispatch(getAvgKasm(data)),
            getCreatedKasms: (data) => dispatch(getCreatedKasms(data)),
            getErrors: (data) => dispatch(getErrors(data)),
            getImageUsage: (data) => dispatch(getImageUsage(data)),
            getUserUsage: (data) => dispatch(getUserUsage(data)),
            getAlert: (data) => dispatch(getAlert(data)),
            getKasms: (data) => dispatch(getKasms(data)),
            getCurrentUsers: (data) => dispatch(getCurrentUsers(data)),
            getCurrentKasms: (data) => dispatch(getCurrentKasms(data)),
            getkasm: () => dispatch(getKasm()),
            getDomainUsage: (data) => dispatch(getDomainUsage(data)),
            setUerUsagePageInfo : (data)=> dispatch(setUserUsagePageInfo(data)),
            setDomainUsagePageInfo : (data)=> dispatch(setDomainUsagePageInfo(data)),
        }))(DashboardWithRouter);