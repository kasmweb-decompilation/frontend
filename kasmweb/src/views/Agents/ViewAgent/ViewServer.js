import _ from "lodash";
import React,{ Component } from "react";
import {connect} from "react-redux";
import { getServers} from "../../../actions/actionServer";
import { Card, CardBody } from "reactstrap";
import Proptypes from "prop-types";
import moment from "moment";
import ReactJson from 'react-json-view';
import { Progress } from 'reactstrap';
import {withTranslation} from "react-i18next";
import { Groups, Group, ViewField } from "../../../components/Form/Form.js"
import { renderField } from "../../../utils/formValidations.js";
import { bytesToSize } from "../../../utils/helpers"

class ViewServer extends Component{
    constructor(props){
        super(props);
        this.state = {
            currentServer: null
        };
    }
  
    componentDidMount(){
        this.props.getServers();
    }
      
    UNSAFE_componentWillReceiveProps(nextProps){
        if(nextProps.servers.length > 0){        	
            let currentServer = nextProps.servers.find(server => server.server_id === this.props.match.params.id);
            this.setState({currentServer: currentServer});
        }
    }

    formatSizeUnits(bytes){
      if      (bytes >= 1073741824) { bytes = (bytes / 1073741824).toFixed(2) + " GB"; }
      else if (bytes >= 1048576)    { bytes = (bytes / 1048576).toFixed(2) + " MB"; }
      else if (bytes >= 1024)       { bytes = (bytes / 1024).toFixed(2) + " KB"; }
      else if (bytes > 1)           { bytes = bytes + " bytes"; }
      else if (bytes == 1)          { bytes = bytes + " byte"; }
      else                          { bytes = "0 bytes"; }
      return bytes;
    }

    renderGPUStats() {
        const { currentServer } = this.state;
        const { t } = this.props;

        if (!currentServer || !currentServer.gpus || !currentServer.gpu_info) {
            return null;
        }

        const gpus = _(currentServer.gpu_info)
            .map((details, id) => ({
                id,
                model: details.model,
                vendor: details.vendor,
                gpuTemperature: currentServer.gpu_temp[id],
                gpuUsage: currentServer.gpu_percent[id],
                gpuMemoryUsage: currentServer.gpu_memory_used_percent[id]
            }))
            .sortBy("id")
            .value();

        return _.map(gpus, (details, index) =>
            <div className="agent-padding gpu-info" key={index}>
                <div>
                    <span className="gpu-name">{t('agents.GPU')} {index} - {details.model}</span>
                    <span className="gpu-id">({details.id})</span>
                </div>
                <div className="field">{t('agents.GPU Utilization')}: <b>{_.round(details.gpuUsage, 2)}%</b></div>
                <Progress
                    striped
                    color={details.gpuUsage > 80 ? "danger" : "success"}
                    value={details.gpuUsage} />
                <div className="field">{t('agents.Memory Utilization')}: <b>{_.round(details.gpuMemoryUsage, 2)}%</b></div>
                <Progress
                    striped
                    color={details.gpuMemoryUsage > 80 ? "danger" : "success"}
                    value={details.gpuMemoryUsage} />
                <div className="field">{t('agents.GPU Temperature')}: <b>{_.round(details.gpuTemperature, 2)}°</b></div>
                <Progress
                    striped
                    color={details.gpuTemperature > 70 ? "danger" : "success"}
                    value={details.gpuTemperature} />
            </div>
        );
    }

    render(){
        const {currentServer} = this.state;
        const { t, currentTab } = this.props;
        const managerDetails = () => {
            const details = {
                ...currentServer.manager
            }
            details.first_reported = moment(details.first_reported).isValid() ? moment.utc(details.first_reported).local().format("lll") : "-"
            details.last_reported = moment(details.last_reported).isValid() ? moment.utc(details.last_reported).local().format("lll") : "-"
            return details
        }
        return (
            <div className="profile-page">  
                {currentServer && currentTab === 'usage' && (
                    <Card >
                        <CardBody>
                            <div className="agent-padding">
                                <div className="text-left"><div className={currentServer.cpu_percent < 80 ? "box green" : "box red"}></div>{t('agents.Core Utilization')}: <b>{currentServer.cpu_percent}% </b></div>
                                <div className="text-left"><div className="box blue"></div>{t('agents.Core Allocation')}: <b>{Math.round(currentServer.core_calculations.percentage)}%  ({currentServer.core_calculations.used} of {currentServer.core_calculations.max} Cores) </b></div>
                                {currentServer.cpu_percent < currentServer.core_calculations.percentage ?
                                    (<Progress multi>
                                        <Progress striped bar color={currentServer.cpu_percent < 80 ? "success" : "danger"} value={currentServer.cpu_percent} />
                                        <Progress striped bar color="info" value={currentServer.core_calculations.percentage - currentServer.cpu_percent} />
                                    </Progress>)
                                    :
                                    (<Progress multi>
                                        <Progress striped bar color="info" value={currentServer.core_calculations.percentage} />
                                        <Progress striped bar color={currentServer.cpu_percent < 80 ? "success" : "danger"} value={currentServer.cpu_percent - currentServer.core_calculations.percentage} />
                                    </Progress>)}

                                <div className="text-left"><div className={currentServer.memory_stats.percent < 80 ? "box green" : "box red"}></div>{t('agents.Memory Utilization')}: <b>{currentServer.memory_stats.percent}% </b></div>
                                <div className="text-left"><div className="box blue"></div>{t('agents.Memory Allocation')}: <b>{Math.round(currentServer.memory_calculations.percentage)}% ({this.formatSizeUnits(currentServer.memory_calculations.used)} of {this.formatSizeUnits(currentServer.memory_calculations.max)})</b></div>
                                {currentServer.memory_stats.percent < currentServer.memory_calculations.percentage ?
                                    (<Progress multi>
                                        <Progress striped bar color={currentServer.memory_stats.percent < 80 ? "success" : "danger"} value={currentServer.memory_stats.percent} />
                                        <Progress striped bar color="info" value={currentServer.memory_calculations.percentage - currentServer.memory_stats.percent} />
                                    </Progress>)
                                    :
                                    (<Progress multi>
                                        <Progress striped bar color="info" value={currentServer.memory_calculations.percentage} />
                                        <Progress striped bar color={currentServer.memory_stats.percent < 80 ? "success" : "danger"} value={currentServer.memory_stats.percent - currentServer.memory_calculations.percentage} />
                                    </Progress>)}

                                <div className="text-left">{t('agents.Disk Usage')}: <b>{currentServer.disk_stats.percent}% </b></div>
                                <Progress striped color={currentServer.disk_stats.percent > 80 ? "danger" : "info"} value={currentServer.disk_stats.percent}></Progress>
                                <br />
                            </div>
                            {this.renderGPUStats()}
                        </CardBody>
                    </Card>
                )}

                <div className="profile-table">
                    {currentServer && currentTab === 'details' ?
                        <Groups section="agents">
                            <Group title="details" description="details-description">
                                <ViewField type="text"
                                    name="Agent Id"
                                    value={currentServer && currentServer.server_id ? currentServer.server_id : "-"}
                                    component={renderField}
                                />
                                <ViewField type="text"
                                    name="hostname"
                                    value={currentServer && currentServer.hostname ? currentServer.hostname : "-"}
                                    component={renderField}
                                />
                                <ViewField type="text"
                                    name="Operational Status"
                                    value={currentServer.operational_status ? currentServer.operational_status : "-"}
                                    component={renderField}
                                />
                                <ViewField type="text"
                                    name="Version"
                                    value={currentServer.agent_version ? currentServer.agent_version : "-"}
                                    component={renderField}
                                />
                                <ViewField type="text"
                                    name="Created"
                                    value={moment(currentServer.created).isValid() ? moment.utc(currentServer.created).local().format("lll") : "-"}
                                    component={renderField}
                                />
                                <ViewField type="text"
                                    name="Last Reported"
                                    value={currentServer.last_reported_elapsed}
                                    component={renderField}
                                />
                                <ViewField type="text"
                                    name="Last Reported Time"
                                    value={moment(currentServer.last_reported).isValid() ? moment.utc(currentServer.last_reported).local().format("lll") : "-"}
                                    component={renderField}
                                />

                            </Group>
                            <Group title="other-details" description="other-details-description">
                                <ViewField type="text"
                                    name="prune_images_mode"
                                    value={currentServer.prune_images_mode ? currentServer.prune_images_mode : "-"}
                                    component={renderField}
                                />
                                <ViewField type="text"
                                    name="Manager"
                                    value={currentServer.manager ? currentServer.manager.manager_hostname : ""}
                                    component={renderField}
                                />
                                <ViewField type="text"
                                    name="Zone"
                                    value={currentServer.manager ? currentServer.manager.zone_name : ""}
                                    component={renderField}
                                />
                                <ViewField type="text"
                                    name="Provider"
                                    value={currentServer.provider ? currentServer.provider : "-"}
                                    component={renderField}
                                />
                                <ViewField type="text"
                                    name="Instance Id"
                                    value={currentServer.instance_id ? currentServer.instance_id : "-"}
                                    component={renderField}
                                />
                                <ViewField type="text"
                                    name="CPU Cores"
                                    value={currentServer.cores ? currentServer.cores : "-"}
                                    component={renderField}
                                />
                                <ViewField type="text"
                                    name="CPU Cores Override"
                                    value={currentServer.cores_override ? currentServer.cores_override : "-"}
                                    component={renderField}
                                />
                                <ViewField type="text"
                                    name="Memory"
                                    value={currentServer.memory ? bytesToSize(currentServer.memory, false) : "-"}
                                    component={renderField}
                                />
                                <ViewField type="text"
                                    name="Memory Override"
                                    value={currentServer.memory_override ? bytesToSize(currentServer.memory_override) : "-"}
                                    component={renderField}
                                />
                                <ViewField type="text"
                                    name="Memory Stats"
                                    value={<ReactJson src={currentServer.memory_stats}
                                        name={false}
                                        collapsed={true}
                                        sortKeys={true}
                                        collapseStringsAfterLength={40}
                                        enableClipboard={false}
                                        displayDataTypes={false}
                                    />}
                                    component="blank"
                                />
                                <ViewField type="text"
                                    name="GPU Info"
                                    value={<ReactJson src={currentServer.gpu_info}
                                        name={false}
                                        collapsed={true}
                                        sortKeys={true}
                                        collapseStringsAfterLength={40}
                                        enableClipboard={false}
                                        displayDataTypes={false}
                                    />}
                                    component="blank"
                                />
                                <ViewField type="text"
                                    name="Network Interfaces"
                                    value={<ReactJson src={currentServer.network_interfaces}
                                        name={false}
                                        collapsed={true}
                                        sortKeys={true}
                                        collapseStringsAfterLength={40}
                                        enableClipboard={false}
                                        displayDataTypes={false}
                                    />}
                                    component="blank"
                                />
                                <ViewField type="text"
                                    name="Disk Stats"
                                    value={<ReactJson src={currentServer.disk_stats}
                                        name={false}
                                        collapsed={true}
                                        sortKeys={true}
                                        collapseStringsAfterLength={40}
                                        enableClipboard={false}
                                        displayDataTypes={false}
                                    />}
                                    component="blank"
                                />
                                <ViewField type="text"
                                    name="Live Sessions"
                                    value={<ReactJson src={currentServer.kasms}
                                        name={false}
                                        collapsed={true}
                                        sortKeys={true}
                                        collapseStringsAfterLength={40}
                                        enableClipboard={false}
                                        displayDataTypes={false}
                                    />}
                                    component="blank"
                                />
                                <ViewField type="text"
                                    name="Docker Images"
                                    value={<ReactJson src={currentServer.docker_images}
                                        name={false}
                                        collapsed={true}
                                        sortKeys={true}
                                        collapseStringsAfterLength={40}
                                        enableClipboard={false}
                                        displayDataTypes={false}
                                    />}
                                    component="blank"
                                />
                                <ViewField type="text"
                                    name="Docker Info"
                                    value={<ReactJson src={currentServer.docker_info}
                                        name={false}
                                        collapsed={true}
                                        sortKeys={true}
                                        collapseStringsAfterLength={40}
                                        enableClipboard={false}
                                        displayDataTypes={false}
                                    />}
                                    component="blank"
                                />
                                <ViewField type="text"
                                    name="Manager Details"
                                    value={<ReactJson src={managerDetails()}
                                        name={false}
                                        collapsed={true}
                                        sortKeys={true}
                                        collapseStringsAfterLength={40}
                                        enableClipboard={false}
                                        displayDataTypes={false}
                                    />}
                                    component="blank"
                                />

                            </Group>
                        </Groups>
                        : " "}
                </div>
            </div>
        );}
}

ViewServer.propTypes = {
    getServers: Proptypes.func.isRequired,
    servers: Proptypes.array,
    match: Proptypes.object,
};

const ViewServerTranslated = withTranslation('common')(ViewServer)

export default connect(state => 
    ({
        servers: state.servers.servers || []
    }),
dispatch => 
    ({  
        getServers: () => dispatch(getServers()),
    }))(ViewServerTranslated);
