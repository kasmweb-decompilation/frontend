import React,{ Component } from "react";
import {connect} from "react-redux";
import { Row, Col, Table, Card, CardBody, CardHeader, Button} from "reactstrap";
import Proptypes from "prop-types";
import {getDnsProviderConfigs} from "../../../actions/actionDnsProvider.js"
import ViewAzureVmProviderConfig from "../../../components/Providers/Azure/AzureDnsView/AzureDnsView.js";
import ViewAwsVmProviderConfig from "../../../components/Providers/Aws/AwsDnsView/AwsDnsView.js";
import ViewDigitalOceanVmProviderConfig from "../../../components/Providers/DigitalOcean/DigitalOceanDnsView/DigitalOceanDnsView.js";
import ViewGcpVmProviderConfig from "../../../components/Providers/Gcp/GcpDnsView/GcpDnsView.js";
import ViewOciVmProviderConfig from "../../../components/Providers/Oci/OciDnsView/OciDnsView.js";
import {withTranslation} from "react-i18next";

class ViewDnsProviderConfig extends Component{
    constructor(props){
        super(props);
         this.state = {
            currentDnsProviderConfig: {}
        }
    }
  
    componentDidMount(){
        this.props.getDnsProviderConfigs();
    }
      
    UNSAFE_componentWillReceiveProps(nextProps){
        if(nextProps.dns_provider_configs.length > 0){
            let currentDnsProviderConfig = nextProps.dns_provider_configs.find(dns_provider_configs => dns_provider_configs.dns_provider_config_id === this.props.match.params.id);
            this.setState({currentDnsProviderConfig: currentDnsProviderConfig});
        }
    }

    render(){
        const {currentDnsProviderConfig} = this.state;
        const { t } = this.props;
        return (
            <div className="profile-page">
                <Row>
                    <Col sm={{ size: 8, order: 3, offset: 2 }}>
                        <Card >
                            <CardHeader>
                             <strong>{t('providers.view-dns-provider-config')}</strong>
                            </CardHeader>
                            <CardBody>
                                <Row>
                                    <Col xs="12">
                                        <div className="profile-table">
                                            {currentDnsProviderConfig ?
                                                <Table >
                                                    <tbody>
                                                        <tr><td><h4>{t('providers.provider')}</h4></td><td>{currentDnsProviderConfig.dns_provider_display_name ||  "-"}</td></tr>
                                                        { currentDnsProviderConfig.dns_provider_name  && currentDnsProviderConfig.dns_provider_name === "azure" ?
                                                            <ViewAzureVmProviderConfig
                                                                currentDnsProviderConfig={this.state.currentDnsProviderConfig}
                                                            /> : ""
                                                        }
                                                        { currentDnsProviderConfig.dns_provider_name  && currentDnsProviderConfig.dns_provider_name === "aws" ?
                                                            <ViewAwsVmProviderConfig
                                                                currentDnsProviderConfig={this.state.currentDnsProviderConfig}
                                                            /> : ""
                                                        }
                                                        { currentDnsProviderConfig.dns_provider_name  && currentDnsProviderConfig.dns_provider_name === "digital_ocean" ?
                                                            <ViewDigitalOceanVmProviderConfig
                                                                currentDnsProviderConfig={this.state.currentDnsProviderConfig}
                                                            /> : ""
                                                        }
                                                        { currentDnsProviderConfig.dns_provider_name  && currentDnsProviderConfig.dns_provider_name === "gcp" ?
                                                            <ViewGcpVmProviderConfig
                                                                currentDnsProviderConfig={this.state.currentDnsProviderConfig}
                                                            /> : ""
                                                        }
                                                        { currentDnsProviderConfig.dns_provider_name  && currentDnsProviderConfig.dns_provider_name === "oci" ?
                                                            <ViewOciVmProviderConfig
                                                                currentDnsProviderConfig={this.state.currentDnsProviderConfig}
                                                            /> : ""
                                                        }
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

ViewDnsProviderConfig.propTypes = {
    dns_provider_configs: Proptypes.array,
    match: Proptypes.object,
};
const ViewDnsProviderConfigTranslated = withTranslation('common')(ViewDnsProviderConfig)
export default connect(state => 
    ({
        dns_provider_configs: state.dns_provider.dns_provider_configs || [],
    }),
dispatch => 
    ({  
        getDnsProviderConfigs: () => dispatch(getDnsProviderConfigs()),
    }))(ViewDnsProviderConfigTranslated);