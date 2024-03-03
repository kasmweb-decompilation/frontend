import React,{ Component } from "react";
import { Link } from "react-router-dom";
import {connect} from "react-redux";
import { Row, Col, Table, Card, CardBody, CardHeader, Button} from "reactstrap";
import Proptypes from "prop-types";
import ReactJson from 'react-json-view';
import {getAutoScaleConfigs} from "../../../actions/actionAutoScale"
import iconNo from "../../../../assets/images/icon_no.svg";
import iconYes from "../../../../assets/images/icon_yes.svg";
import {withTranslation} from "react-i18next";

class ViewAutoScale extends Component{
    constructor(props){
        super(props);
         this.state = {
            currentAutoScaleConfig: {}
        }
    }
  
    componentDidMount(){
        this.props.getAutoScaleConfigs();
    }
      
    UNSAFE_componentWillReceiveProps(nextProps){
        if(nextProps.autoscale_configs.length > 0){
            let currentAutoScaleConfig = nextProps.autoscale_configs.find(autoscale_configs => autoscale_configs.autoscale_config_id === this.props.match.params.id);
            this.setState({currentAutoScaleConfig: currentAutoScaleConfig});
        }
    }

    render(){
        const {currentAutoScaleConfig} = this.state;
        const { t } = this.props;
        return (
            <div className="profile-page">
                <Row>
                    <Col sm={{ size: 8, order: 3, offset: 2 }}>
                        <Card >
                            <CardHeader>
                             <strong>{t("autoscale.View AutoScale Config")}</strong>
                            </CardHeader>
                            <CardBody>
                                <Row>
                                    <Col xs="12">
                                        <div className="profile-table">
                                            {currentAutoScaleConfig ?
                                                <Table >
                                                    <tbody>
                                                        <tr><td><h4>{t("autoscale.Id")}</h4></td><td>{currentAutoScaleConfig.autoscale_config_id || "-"}</td></tr>
                                                        <tr><td><h4>{t("autoscale.Name")}</h4></td><td>{currentAutoScaleConfig.name || "-"}</td></tr>
                                                        <tr><td><h4>{t("autoscale.Enabled")}</h4></td><td><img src={currentAutoScaleConfig.enabled ? iconYes  : iconNo } alt="iconNo"/></td></tr>
                                                        <tr><td><h4>{t("autoscale.Deployment Zone")}</h4></td><td>{currentAutoScaleConfig.zone_name || "-"}</td></tr>
                                                        <tr><td><h4>{t("autoscale.AutoScale Type")}</h4></td><td>{currentAutoScaleConfig.autoscale_type || "-"}</td></tr>
                                                        <tr><td><h4>{t("autoscale.Connection Port")}</h4></td><td>{currentAutoScaleConfig.connection_port}</td></tr>
                                                        <tr><td><h4>{t("autoscale.Connection Username")}</h4></td><td>{currentAutoScaleConfig.connection_username}</td></tr>
                                                        <tr><td><h4>{t("autoscale.Connection Password")}</h4></td><td>{currentAutoScaleConfig.connection_password ? "********" : "--"}</td></tr>
                                                        {currentAutoScaleConfig.connection_type === 'SSH' && (<tr><td><h4>{t("autoscale.Use User SSH Key")}</h4></td><td><img src={currentAutoScaleConfig.use_user_private_key? iconYes: iconNo} alt="yesnoIcon"/></td></tr>)}
                                                        {currentAutoScaleConfig.connection_type === 'SSH' && (<tr><td><h4>{t("autoscale.Connection Private Key")}</h4></td><td>{currentAutoScaleConfig.connection_private_key ? "********" : "--"}</td></tr>)}
                                                        {currentAutoScaleConfig.connection_type === 'SSH' && (<tr><td><h4>{t("autoscale.Connection Private Key Passphrase")}</h4></td><td>{currentAutoScaleConfig.connection_passphrase ? "********" : "--"}</td></tr>)}
                                                        <tr><td><h4>{t("autoscale.Connection Info")}</h4></td><td className="word-wrap">
                                                            <ReactJson src={currentAutoScaleConfig.connection_info }
                                                                name={false}
                                                                collapsed={false}
                                                                sortKeys={true}
                                                                collapseStringsAfterLength={40}
                                                                enableClipboard={false}
                                                                displayDataTypes={false}
                                                            />
                                                        </td></tr>
                                                        <tr><td><h4>{t("autoscale.Create Active Directory Computer Record")}</h4></td><td><img src={currentAutoScaleConfig.ad_create_machine_record ? iconYes  : iconNo } alt="iconNo"/></td></tr>
                                                        <tr><td><h4>{t("autoscale.LDAP ID")}</h4></td><td>{currentAutoScaleConfig.ldap_id || "-"}</td></tr>
                                                        <tr><td><h4>{t("autoscale.Active Directory Computer OU DN")}</h4></td><td>{currentAutoScaleConfig.ad_computer_container_dn || "-"}</td></tr>
                                                        <tr><td><h4>{t("autoscale.Recursively Cleanup Active Directory Computer Record")}</h4></td><td>{currentAutoScaleConfig.ad_recursive_machine_record_cleanup || "-"}</td></tr>

                                                        <tr><td><h4>{t("autoscale.VM Provider")}</h4></td><td className="word-wrap">
                                                            <ReactJson src={currentAutoScaleConfig.vm_provider_config || {}}
                                                                name={false}
                                                                collapsed={true}
                                                                sortKeys={true}
                                                                collapseStringsAfterLength={40}
                                                                enableClipboard={false}
                                                                displayDataTypes={false}
                                                            />
                                                        </td></tr>
                                                        <tr><td><h4>{t("autoscale.Standby Cores")}</h4></td><td>{currentAutoScaleConfig.standby_cores}</td></tr>
                                                        <tr><td><h4>{t("autoscale.Standby Memory (MB)")}</h4></td><td>{currentAutoScaleConfig.standby_memory_mb}</td></tr>
                                                        <tr><td><h4>{t("autoscale.Standby GPUs")}</h4></td><td>{currentAutoScaleConfig.standby_gpus}</td></tr>
                                                        <tr><td><h4>{t("autoscale.Downscale Backoff")}</h4></td><td>{currentAutoScaleConfig.downscale_backoff}</td></tr>
                                                        <tr><td><h4>{t("autoscale.Agent Cores Override")}</h4></td><td>{currentAutoScaleConfig.agent_cores_override}</td></tr>
                                                        <tr><td><h4>{t("autoscale.Agent Memory Override (GB)")}</h4></td><td>{currentAutoScaleConfig.agent_memory_override_gb}</td></tr>
                                                        <tr><td><h4>{t("autoscale.Agent GPUs Override")}</h4></td><td>{currentAutoScaleConfig.agent_gpus_override}</td></tr>
                                                        <tr><td><h4>{t("autoscale.Register DNS")}</h4></td><td><img src={currentAutoScaleConfig.register_dns ? iconYes  : iconNo } alt="iconNo"/></td></tr>
                                                        <tr><td><h4>{t("autoscale.DNS Provider")}</h4></td><td className="word-wrap">
                                                            <ReactJson src={currentAutoScaleConfig.dns_provider_config || {}}
                                                                name={false}
                                                                collapsed={true}
                                                                sortKeys={true}
                                                                collapseStringsAfterLength={40}
                                                                enableClipboard={false}
                                                                displayDataTypes={false}
                                                            />
                                                        </td></tr>
                                                        <tr><td><h4>{t("autoscale.Nginx Cert")}</h4></td><td>{currentAutoScaleConfig.nginx_cert || "-"}</td></tr>
                                                        <tr><td><h4>{t("autoscale.Nginx Key")}</h4></td><td>{currentAutoScaleConfig.nginx_key || "-"}</td></tr>
                                                    </tbody>
                                                </Table> :" "}
                                        </div>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>   
                    </Col>
                </Row>
            </div>
        );}
}

ViewAutoScale.propTypes = {
    autoscale_configs: Proptypes.array,
    match: Proptypes.object,
};
const ViewAutoScaleTranslated = withTranslation('common')(ViewAutoScale)
export default connect(state => 
    ({
        autoscale_configs: state.autoscale.autoscale_configs || [],
    }),
dispatch => 
    ({  
        getAutoScaleConfigs: () => dispatch(getAutoScaleConfigs()),
    }))(ViewAutoScaleTranslated);