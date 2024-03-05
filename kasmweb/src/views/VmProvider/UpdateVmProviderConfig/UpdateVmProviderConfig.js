import React, { Component } from "react";
import { connect } from "react-redux";
import { getFormValues } from "redux-form";
import { Row, Col, Card, CardHeader, Container } from "reactstrap";
import VmProviderConfigForm from "../VmProviderConfigForm/VmProviderConfigForm";
import Proptypes from "prop-types";
import BreadCrumbCompo from "../../../components/Breadcrumb/BreadCrumbCompo";
import { updateVmProviderConfig, getVmProviderConfigs } from "../../../actions/actionVmProvider";
import { handleSaveSuccess, handleSaveError } from '../actions'
import {withTranslation} from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCube } from '@fortawesome/free-solid-svg-icons/faCube';
import PageHeader, { parentRoutes } from "../../../components/Header/PageHeader";
import { TabList, Group } from "../../../components/Form/Form.js"

const parentRouteList = parentRoutes('/server_pools')
const newRoutes = [
    ...parentRouteList.routes,
    {name: "autoscale.VM Provider",path:"/vm_provider",isActive: true},
    {name: "generic.update",path:"/update_vm_provider",isActive: true},
];

class UpdateVmProviderConfig extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
        this.submitApi = this.submitApi.bind(this);
        this.handleSaveError = handleSaveError.bind(this);
        this.handleSaveSuccess = handleSaveSuccess.bind(this);

    }

    componentDidMount(){
        this.props.getVmProviderConfigs();
    }

    async submitApi() {
        try {
            let userData = this.props.providerValues
            userData.vm_provider_config_id = this.props.match.params.id;
            await this.props.updateVmProviderConfig(userData)
            const provider = await this.handleSaveSuccess()
        } catch (e) {
            this.handleSaveError()
        }
    }

    render() {
        const { t } = this.props;
        return (
            <div className='tw-pb-24'>
                <PageHeader location={this.props.location} routes={typeof newRoutes !== 'undefined' ? newRoutes : null} title={t('providers.update-vm-provider-config')} icon={<FontAwesomeIcon icon={faCube} />} />
                <Row>
                    <Col sm={{ size: 10, order: 3, offset: 1 }}>
                        <TabList {...this.props} tabList={[{ name: 'buttons.Edit', key: 'form' }]} currentTab={'form'} setCurrentTab={() => null} />
                        <Group section="providers" title="create-vm-config" description="create-vm-config-desc">

                            <VmProviderConfigForm
                                onSubmit={this.submitApi}
                                updateVmProviderConfig={this.props.updateVmProviderConfig}
                                VmProviderConfigId={this.props.match.params.id}
                                fromUpdate={true}
                            />
                        </Group>
                    </Col>
                </Row>
            </div>
        );
    }
}

UpdateVmProviderConfig.propTypes = {
    updateVmProviderConfig: Proptypes.func.isRequired,
    match: Proptypes.object
};
const UpdateVmProviderConfigTranslated = withTranslation('common')(UpdateVmProviderConfig)
export default connect(state => ({
    vm_provider_configs: state.vm_provider.vm_provider_configs || [],
    saveVmProviderError: state.vm_provider.saveVmProviderError,
    saveVmProviderLoading: state.vm_provider.saveVmProviderLoading,
    savedVmProvider: state.vm_provider.savedVmProvider,
    providerValues: getFormValues('VmProviderForm')(state),
}),
    dispatch => ({
        getVmProviderConfigs: () => dispatch(getVmProviderConfigs()),
        updateVmProviderConfig: (data) => dispatch(updateVmProviderConfig(data))
    }))(UpdateVmProviderConfigTranslated);
