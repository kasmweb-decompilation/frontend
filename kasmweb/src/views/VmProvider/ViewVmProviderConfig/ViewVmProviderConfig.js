import React,{ Component } from "react";
import {connect} from "react-redux";
import { Row, Col, Table, Card, CardBody, CardHeader} from "reactstrap";
import Proptypes from "prop-types";
import {getVmProviderConfigs} from "../../../actions/actionVmProvider.js"
import ViewAzureVmProviderConfig from "../../../components/Providers/Azure/AzureVmView/AzureVmView.js"
import ViewAwsVmProviderConfig from "../../../components/Providers/Aws/AwsVmView/AwsVmView.js"
import ViewDigitalOceanVmProviderConfig from "../../../components/Providers/DigitalOcean/DigitalOceanVmView/DigitalOceanVmView.js"
import ViewGcpVmProviderConfig from "../../../components/Providers/Gcp/GcpVmView/GcpVmView.js"
import ViewOciVmProviderConfig from "../../../components/Providers/Oci/OciVmView/OciVmView.js"
import ViewVsphereVmProviderConfig from "../../../components/Providers/Vsphere/VsphereVmView/VsphereVmView.js"
import {withTranslation} from "react-i18next";

class ViewVmProviderConfig extends Component{
    constructor(props){
        super(props);
         this.state = {
            currentVmProviderConfig: {}
        }
    }
  
    componentDidMount(){
        this.props.getVmProviderConfigs();
    }
      
    UNSAFE_componentWillReceiveProps(nextProps){
        if(nextProps.vm_provider_configs.length > 0){
            let currentVmProviderConfig = nextProps.vm_provider_configs.find(vm_provider_configs => vm_provider_configs.vm_provider_config_id === this.props.match.params.id);
            this.setState({currentVmProviderConfig: currentVmProviderConfig});
        }
    }

    render(){
        const {currentVmProviderConfig} = this.state;
        const { t } = this.props;
        return (
            <div className="profile-page">
                <Row>
                    <Col sm={{ size: 8, order: 3, offset: 2 }}>
                        <Card >
                            <CardHeader>
                             <strong>{t('providers.view-vm-provider-config')}</strong>
                            </CardHeader>
                            <CardBody>
                                <Row>
                                    <Col xs="12">
                                        <div className="profile-table">
                                            {currentVmProviderConfig ?
                                                <Table >
                                                    <tbody>

                                                        <tr><td><h4>{t('providers.provider')}</h4></td><td>{currentVmProviderConfig.vm_provider_display_name ||  "-"}</td></tr>
                                                        { currentVmProviderConfig.vm_provider_name  && currentVmProviderConfig.vm_provider_name === "azure" ?
                                                            <ViewAzureVmProviderConfig
                                                                currentVmProviderConfig={this.state.currentVmProviderConfig}
                                                            /> : ""
                                                        }
                                                        { currentVmProviderConfig.vm_provider_name  && currentVmProviderConfig.vm_provider_name === "aws" ?
                                                            <ViewAwsVmProviderConfig
                                                                currentVmProviderConfig={this.state.currentVmProviderConfig}
                                                            /> : ""
                                                        }
                                                        { currentVmProviderConfig.vm_provider_name  && currentVmProviderConfig.vm_provider_name === "digital_ocean" ?
                                                            <ViewDigitalOceanVmProviderConfig
                                                                currentVmProviderConfig={this.state.currentVmProviderConfig}
                                                            /> : ""
                                                        }
                                                        { currentVmProviderConfig.vm_provider_name  && currentVmProviderConfig.vm_provider_name === "gcp" ?
                                                            <ViewGcpVmProviderConfig
                                                                currentVmProviderConfig={this.state.currentVmProviderConfig}
                                                            /> : ""
                                                        }
                                                        { currentVmProviderConfig.vm_provider_name  && currentVmProviderConfig.vm_provider_name === "oci" ?
                                                            <ViewOciVmProviderConfig
                                                                currentVmProviderConfig={this.state.currentVmProviderConfig}
                                                            /> : ""
                                                        }
                                                        { currentVmProviderConfig.vm_provider_name  && currentVmProviderConfig.vm_provider_name === "vsphere" ?
                                                            <ViewVsphereVmProviderConfig
                                                                currentVmProviderConfig={this.state.currentVmProviderConfig}
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

ViewVmProviderConfig.propTypes = {
    vm_provider_configs: Proptypes.array,
    match: Proptypes.object,
};
const ViewVmProviderConfigTranslated = withTranslation('common')(ViewVmProviderConfig)
export default connect(state => 
    ({
        vm_provider_configs: state.vm_provider.vm_provider_configs || [],
    }),
dispatch => 
    ({  
        getVmProviderConfigs: () => dispatch(getVmProviderConfigs()),
    }))(ViewVmProviderConfigTranslated);