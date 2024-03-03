import React,{ Component } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, Filler, CategoryScale } from 'chart.js';

import moment from "moment";
import { Spinner } from "reactstrap";
import { connect } from "react-redux";
import { getAgentGraph } from "../../../../actions/actionReporting";
import Proptypes from "prop-types";
import {withTranslation} from "react-i18next";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Filler, Title);

const options = {
    tooltips: {
        enabled: true,
        mode: 'index',
        intersect: false,
        callbacks: {
            label: function(tooltipItem, data) {
                var label = data.datasets[tooltipItem.datasetIndex].label || '';

                if (label) {
                    label += ': ';
                }
                label += tooltipItem.yLabel.toFixed(0);
                return label;
            }
        }
    },
    hover: {
        mode: 'index',
        intersect: false
    },
    scales: {
        y: {
                ticks: {
                    display: true,
                    min: 0,
                    max: 100,
                },
            },
        x: {
                ticks: {
                    autoSkip: true,
                    autoSkipPadding: 60,
                    maxRotation: 0,
                    minRotation: 0,
                    userCallback: function(label) {
                        let arr = label.split(/\s+/);
                        if (arr.length === 3) {
                            arr[1] = arr[1] + ' ' + arr[2];
                            arr.length = 2;
                            return arr;
                        } else
                            return label;
                    }
                },
            },
    },
    maintainAspectRatio: false,
    elements: {
        line: {
            tension: 0.2,
            borderWidth: 3,
        },
        point: {
            radius: 1,
            hitRadius: 10,
            hoverRadius: 4,
        },
    }
};

class AgentGraph extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    createGraph() {
        const { t } = this.props;
        const convertedLabels = this.props.agentGraph && this.props.agentGraph.labels && this.props.agentGraph.labels.map((label, i) => {
            return moment.utc(label,"YYYYMMDDHHmm").local().format("MM/DD/YY LT")
        });

        let line = {};
        if (this.props.agentGraph) {
            line = {
                labels: convertedLabels,
                datasets: [
                    {
                        label: t('dashboard.Avg Disk Percent'),
                        fill: false,
                        borderColor: 'rgba(22, 163, 74, 1)',
                        backgroundColor: 'rgba(22, 163, 74, 0.1)',
                        data: this.props.agentGraph.avg_disk_percent,
                    },
                    {
                        label: t('dashboard.Avg Memory Percent'),
                        fill: true,
                        borderColor: 'rgba(59, 130, 246, 1)',
                        backgroundColor: 'rgba(59, 130, 246, 0.05)',
                        data: this.props.agentGraph.avg_memory_percent,
                    },/*
                    {
                        label: 'Max Memory Percent',
                        fill: true,
                        borderColor: 'rgba(0, 108, 255, 1)',
                        backgroundColor: 'rgba(0, 108, 255, 0.3)',
                        data: this.props.agentGraph.max_memory_percent,
                    },*/
                    {
                        label: t('dashboard.Avg CPU Percent'),
                        fill: true,
                        borderColor: 'rgba(219, 48, 13, 1)',
                        backgroundColor: 'rgba(219, 48, 13, 0.1)',
                        data: this.props.agentGraph.avg_cpu_percent,
                    },/*
                    {
                        label: 'Max CPU Percent',
                        fill: true,
                        borderColor: 'rgba(232, 111, 127, 1)',
                        backgroundColor: 'rgba(232, 111, 127, 0.3)',
                        data: this.props.agentGraph.max_cpu_percent,
                    },*/
                    {
                        label: t('dashboard.Avg GPU Percent'),
                        fill: false,
                        borderColor: 'rgba(255, 179, 71, 1)',
                        backgroundColor: 'rgba(255, 179, 71, 0.1)',
                        data: this.props.agentGraph.avg_gpu_percent,
                    },/*
                    {
                        label: 'Max GPU Percent',
                        fill: true,
                        borderColor: 'rgba(245, 130, 22, 1)',
                        backgroundColor: 'rgba(245, 130, 22, 0.3)',
                        data: this.props.agentGraph.max_gpu_percent,
                    },*/
                    {
                        label: t('dashboard.Avg GPU Memory Percent'),
                        fill: false,
                        borderColor: 'rgba(237, 237, 19, 1)',
                        backgroundColor: 'rgba(237, 237, 19, 0.1)',
                        data: this.props.agentGraph.avg_gpu_memory_percent,
                    },/*
                    {
                        label: 'Max GPU Memory Percent',
                        fill: false,
                        borderColor: 'rgba(84, 34, 195, 1)',
                        backgroundColor: 'rgba(84, 34, 195, 0.1)',
                        data: this.props.agentGraph.max_gpu_percent,
                    },*/
                    {
                        label: t('dashboard.Avg GPU Temp'),
                        fill: false,
                        borderColor: 'rgba(9, 191, 210, 1)',
                        backgroundColor: 'rgba(9, 191, 210, 0.1)',
                        data: this.props.agentGraph.avg_gpu_temp,
                    },/*
                    {
                        label: 'Max GPU Temp',
                        fill: false,
                        borderColor: 'rgba(42, 156, 168, 1)',
                        backgroundColor: 'rgba(42, 156, 168, 0.1)',
                        data: this.props.agentGraph.max_gpu_temp,
                    },*/
                ]
            };
        }
       return  <Line data={line} options={options}/>
    }

    componentDidMount() {
        let report = this.props.timeData();
        report.filters = {server_id: this.props.server_id};
        this.props.getAgentGraph(report)
            .then(() => {
                this.setState({graph: this.createGraph()})
            } );
    }

    render() {
        return (
            <React.Fragment>
                {this.state.graph ?
                    <div style={{'height': '400px'}}>
                        {this.state.graph}
                    </div>
                    :
                    <span className={"agentcard"}><Spinner color="primary" /></span>
                }
            </React.Fragment>
        );
    }
}

AgentGraph.propTypes = {
    // timeData: Proptypes.function,
    // server_id: Proptypes.string.isRequired
};

const AgentGraphTranslated = withTranslation('common')(AgentGraph)

export default connect(state =>
        ({
            agentGraph: state.reporting.agentGraph,
        }),
    dispatch =>
        ({
            getAgentGraph: (data) => dispatch(getAgentGraph(data)),
        }))(AgentGraphTranslated);