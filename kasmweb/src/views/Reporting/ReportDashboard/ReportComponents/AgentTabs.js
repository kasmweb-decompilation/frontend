import React,{ Component } from 'react';
import {Col, Row, TabContent, TabPane, NavLink, NavItem, Nav } from "reactstrap";
import classnames from 'classnames';
import AgentGraph from "./AgentGraph"
import {withTranslation} from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/pro-light-svg-icons/faExclamationTriangle';

class AgentTabs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: 0
        };

        this.toggle = this.toggle.bind(this);
    }

    toggle(tab){
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }

    static formatSizeUnits(bytes){
        if      (bytes >= 1073741824) { bytes = (bytes / 1073741824).toFixed(2) + " GB"; }
        else if (bytes >= 1048576)    { bytes = (bytes / 1048576).toFixed(2) + " MB"; }
        else if (bytes >= 1024)       { bytes = (bytes / 1024).toFixed(2) + " KB"; }
        else if (bytes > 1)           { bytes = bytes + " bytes"; }
        else if (bytes === 1)          { bytes = bytes + " byte"; }
        else                          { bytes = "0 bytes"; }
        return bytes;
    }

    render() {
        const {timeData, t} = this.props;
        const agentmap = this.props.agents.agents && this.props.agents.agents.map((agent, i) => {
            return <TabPane key={i} tabId={i} className='!tw-p-0'>
                <div className='tw-mb-5 tw-flex tw-flex-col lg:tw-flex-row tw-gap-5'>
                    <div className='tw-bg-white/70 dark:tw-bg-slate-900/70 tw-rounded-lg tw-shadow tw-p-5 tw-flex tw-gap-5 lg:tw-w-1/3'>
                    <div className='tw-flex tw-items-center tw-justify-center tw-w-1/2'>
                        <div className="tw-text-center">
                            <span className="text-muted">{t('dashboard.Status')}:</span>
                            <br/>
                            <span className={"h4" + (agent.health === 'Healthy' ? ' tw-text-emerald-700' : ' tw-text-pink-700')}>{agent.health && t('dashboard.' + agent.health)}</span>
                        </div>
                    </div>
                    <div className='tw-flex tw-items-center tw-justify-center tw-w-1/2'>
                        <div className="tw-text-center">
                            <span className="text-muted">{t('dashboard.Sessions')}:</span>
                            <br/>
                            <span className="h4">{agent.kasms && agent.kasms}</span>
                        </div>
                    </div>
                    </div>
                    <div className='tw-bg-white/70 dark:tw-bg-slate-900/70 tw-rounded-lg tw-shadow tw-p-5 tw-flex tw-flex-col lg:tw-w-1/3'>
                        <div className='tw-flex tw-gap-5'>
                            <span className='tw-w-1/2'>
                                <span className="text-muted">{t('dashboard.Total Memory')}:</span>
                            </span>
                            <span className='tw-font-semibold'>
                                {agent.memory_total && AgentTabs.formatSizeUnits(agent.memory_total)}
                            </span>
                        </div>
                        <div className='tw-flex tw-gap-5'>
                            <span className='tw-w-1/2'>
                                <span className="text-muted">{t('dashboard.Used Memory')}:</span>
                            </span>
                            <span className='tw-font-semibold'>
                                {agent.memory_used && AgentTabs.formatSizeUnits(agent.memory_used)}
                            </span>
                        </div>
                        <div className='tw-flex tw-gap-5'>
                            <span className='tw-w-1/2'>
                                <span className="text-muted">{t('dashboard.Available Memory')}:</span>
                            </span>
                            <span className='tw-font-semibold'>
                                {agent.memory_free && AgentTabs.formatSizeUnits(agent.memory_free)}
                            </span>
                        </div>
                    </div>
                    <div className='tw-bg-white/70 dark:tw-bg-slate-900/70 tw-rounded-lg tw-shadow tw-p-5 tw-flex tw-flex-col lg:tw-w-1/3'>
                        <div className='tw-flex tw-gap-5'>
                            <span className='tw-w-1/2'>
                                <span className="text-muted">{t('dashboard.Disk Capacity')}:</span>
                            </span>
                            <span className='tw-font-semibold'>
                                {agent.disk_space && AgentTabs.formatSizeUnits(agent.disk_space)}
                            </span>
                        </div>
                        <div className='tw-flex tw-gap-5'>
                            <span className='tw-w-1/2'>
                                <span className="text-muted">{t('dashboard.Used Disk Space')}:</span>
                            </span>
                            <span className='tw-font-semibold'>
                                {agent.disk_space_used && AgentTabs.formatSizeUnits(agent.disk_space_used)}
                            </span>
                        </div>
                        <div className='tw-flex tw-gap-5'>
                            <span className='tw-w-1/2'>
                                <span className="text-muted">{t('dashboard.Available Disk Space')}:</span>
                            </span>
                            <span className='tw-font-semibold'>
                                {agent.disk_space_free && AgentTabs.formatSizeUnits(agent.disk_space_free)}
                            </span>
                        </div>
                    </div>
                </div>
                <div className='tw-my-10 tw-bg-white/70 dark:tw-bg-slate-900/70 tw-rounded-lg tw-shadow tw-p-5'>
                    { <AgentGraph server_id={agent.server_id} timeData={timeData}/>}
                </div>
            </TabPane>
        });

        const agentTabs = this.props.agents.agents && this.props.agents.agents.map((data, i) => {
            return <NavItem key={i}>
                <NavLink
                    className={classnames('tw-flex tw-h-10 tw-items-center !tw-no-underline tw-rounded-lg tw-shadow', this.state.activeTab === i ? 'tw-text-color !tw-bg-white/70 dark:!tw-bg-slate-900/70' : 'text-muted-extra !tw-bg-white/30 dark:!tw-bg-slate-900/30', { active: this.state.activeTab === i })}
                    onClick={() => {
                        this.toggle(i);
                    }}
                >
                {data.name && data.name}
                {data.health !== 'Healthy' ?
                    <span className="tw-text-pink-700 tw-ml-2" ><FontAwesomeIcon icon={faExclamationTriangle} /></span>
                    : ''}
                </NavLink>
            </NavItem>
        });

        return (
            <div className='tw-flex tw-flex-col'>
                {this.props.agents.agents && this.props.agents.agents.length > 1 &&
                <Nav tabs className='tw-w-full tw-flex tw-gap-3 tw-border-b-0 tw-my-5'>
                    {agentTabs}
                </Nav>}
                <TabContent className='tw-flex-1 tw-mt-5' activeTab={this.state.activeTab}>
                    {agentmap}
                </TabContent>
            </div>
        );
    }
}
const AgentTabsTranslated = withTranslation('common')(AgentTabs)
export default AgentTabsTranslated;