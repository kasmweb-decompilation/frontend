import React, { Component } from 'react';
import { connect } from "react-redux";
import { getFormValues, isDirty, destroy } from "redux-form";
import { Row, Col, Card, CardHeader, CardBody, Container } from "reactstrap";
import AutoScaleConfigForm from "../AutoScaleForm/AutoScaleForm";
import VmProviderConfigForm from "../../VmProvider/VmProviderConfigForm/VmProviderConfigForm";
import DnsProviderConfigForm from "../../DnsProvider/DnsProviderConfigForm/DnsProviderConfigForm";
import { getAutoScaleConfigs, createAutoScaleConfig, updateAutoScaleConfig } from '../../../actions/actionAutoScale';
import {
    handleSaveSuccess,
    handleSaveError,
    submitApi,
    nextPage,
    finalDestination,
    previousPage,
    addDns,
    addVm,
    addAutoscale,
    updateAutoScale,
    steps,
} from '../actions'
import { handleSaveSuccess as dnsSaveSuccess, handleSaveError as dnsSaveError } from '../../DnsProvider/actions'
import { handleSaveSuccess as vmSaveSuccess, handleSaveError as vmSaveError } from '../../VmProvider/actions'
import { createDnsProviderConfig, updateDnsProviderConfig } from '../../../actions/actionDnsProvider';
import { createVmProviderConfig, updateVmProviderConfig } from '../../../actions/actionVmProvider';
import Proptypes from "prop-types";
import {withTranslation} from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faScaleBalanced } from '@fortawesome/free-solid-svg-icons/faScaleBalanced';
import PageHeader, { parentRoutes } from "../../../components/Header/PageHeader";
import { TabList } from "../../../components/Form"
import Schedule from "../../../components/Schedule/Schedule"
import { hasAuth } from '../../../utils/axios';

const parentRouteList = parentRoutes('/server_pools')
const newRoutes = [
    ...parentRouteList.routes,
    {name: "pools.autoscale",path:"/autoscale",isActive: true},
    {name: "generic.update",path:"/update_autoscale",isActive: true},
];

const tabList = [
    { name: 'buttons.Edit', key: 'form'},
    { name: 'schedule.schedules', key: 'schedules', isHidden: !hasAuth('autoscale_schedule')}
];

class UpdateAutoScale extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 0,
            wizard: true,
            pool: new URLSearchParams(this.props.location.search).get('pool') || null,
            autoscale_config: null,
            vm_provider_config: null,
            dns_provider_config: null,
            steps: null,
            registerDns: false,
            currentTab: 'form'
        }
        this.nextPage = nextPage.bind(this)
        this.previousPage = previousPage.bind(this)
        this.submitApi = submitApi.bind(this);
        this.handleSaveSuccess = handleSaveSuccess.bind(this);
        this.handleSaveError = handleSaveError.bind(this);
        this.dnsSaveSuccess = dnsSaveSuccess.bind(this);
        this.dnsSaveError = dnsSaveError.bind(this);
        this.vmSaveSuccess = vmSaveSuccess.bind(this);
        this.vmSaveError = vmSaveError.bind(this);
        this.addDns = addDns.bind(this);
        this.addVm = addVm.bind(this);
        this.addAutoscale = addAutoscale.bind(this);
        this.finalDestination = finalDestination.bind(this);
        this.updateAutoScale = updateAutoScale.bind(this);
        this.steps = steps.bind(this);
    }

    componentDidMount(){
        this.props.getAutoScaleConfigs().then((config) => {
            const autoscale_config = config.response.autoscale_configs.find(autoscale => autoscale.autoscale_config_id === this.props.match.params.id)
            this.setState({ 
                autoscale_config: autoscale_config,
                registerDns: autoscale_config.register_dns
            })
        })
    }


    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.vm_provider_configs !== this.vm_provider_configs && nextProps.vm_provider_configs.length > 0 && this.props.savedAutoScale) {
            const vm_provider_config = nextProps.vm_provider_configs.find(provider => provider.vm_provider_config_id === this.props.savedAutoScale.vm_provider_config_id)
            this.setState({ vm_provider_config: vm_provider_config })
        }
        if (nextProps.dns_provider_configs !== this.dns_provider_configs && nextProps.dns_provider_configs.length > 0 && this.props.savedAutoScale) {
            const dns_provider_config = nextProps.dns_provider_configs.find(provider => provider.dns_provider_config_id === this.props.savedAutoScale.dns_provider_config_id)
            this.setState({ dns_provider_config: dns_provider_config })
        }

    }

    render() {
        const { t } = this.props
        const { page, currentTab } = this.state
        const steps = this.steps(this.state.registerDns)
        return (
            <div>
                <PageHeader location={this.props.location} routes={typeof newRoutes !== 'undefined' ? newRoutes : null} title={t('autoscale.Update AutoScale Config')} icon={<FontAwesomeIcon icon={faScaleBalanced} />} />
                <Row>
                    <Col sm={{ size: 10, order: 3, offset: 1 }}>
                        <TabList {...this.props} tabList={tabList} currentTab={currentTab} setCurrentTab={(value) => this.setState({ currentTab: value })} />
                        <Row className={currentTab === 'form' ? 'tw-flex' : 'tw-hidden'}>

                            <Col sm={{ size: 4, order: 3 }}>
                                <div className='md:tw-sticky tw-top-24'>
                                    <div className="progress-steps tw-flex tw-flex-col tw-my-5">
                                        {steps.map((step, index) => (
                                            <div key={step.index} className={(page === index ? 'step-active' : (page > index) ? 'step-done' : 'step-todo') + ' tw-flex tw-items-center tw-relative tw-h-12 tw-pl-10'}>
                                                <span>{t("autoscale." + step.description)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </Col>

                            <Col sm={{ size: 8, order: 3 }}>
                                <div className='tw-mt-8 tw-pb-24'>
                                    {page === 0 && <AutoScaleConfigForm autoscale_config={this.state.autoscale_config} updateAutoScaleConfig={this.props.updateAutoScaleConfig} onRegisterDns={(dns) => this.setState({ registerDns: dns })} onSubmit={() => this.submitApi('autoscale')} autoscaleConfigId={this.props.match.params.id} fromUpdate={true} />}
                                    {hasAuth('vm_providers') && page === 1 && <VmProviderConfigForm autoscale_config={this.props.savedAutoScale} stepCount={steps.length} vm_provider_config={this.state.vm_provider_config} previousPage={this.previousPage} wizard={true} onSubmit={() => this.submitApi('vm')} />}
                                    {hasAuth('dns_providers') && page === 2 && <DnsProviderConfigForm autoscale_config={this.state.autoscale_config} dns_provider_config={this.state.dns_provider_config} previousPage={this.previousPage} wizard={true} onSubmit={() => this.submitApi('dns')} />}
                                </div>
                            </Col>

                        </Row>
                        <div className={currentTab === 'schedules' ? 'tw-block' : 'tw-hidden'}>
                            <Schedule type="autoscale_config_id" autoscale_config_id={this.props.match.params.id} style="profile" />
                        </div>

                    </Col>

                </Row>
            </div>
        );
    }
}

UpdateAutoScale.propTypes = {
    updateAutoScaleConfig: Proptypes.func.isRequired,
    match: Proptypes.object
};
const UpdateAutoScaleTranslated = withTranslation('common')(UpdateAutoScale)
export default connect(state => ({
    saveAutoScaleError: state.autoscale.saveAutoScaleError,
    saveAutoScaleLoading: state.autoscale.saveAutoScaleLoading,
    savedAutoScale: state.autoscale.savedAutoScale,
    saveVmProviderError: state.vm_provider.saveVmProviderError,
    saveVmProviderLoading: state.vm_provider.saveVmProviderLoading,
    savedVmProvider: state.vm_provider.savedVmProvider,
    saveDnsProviderError: state.dns_provider.saveDnsProviderError,
    saveDnsProviderLoading: state.dns_provider.saveDnsProviderLoading,
    savedDnsProvider: state.dns_provider.savedDnsProvider,
    autoscale_configs: state.autoscale.autoscale_configs || [],
    vm_provider_configs: state.vm_provider.vm_provider_configs || [],
    dns_provider_configs: state.dns_provider.dns_provider_configs || [],
    autoscaleValues: getFormValues('AutoScaleConfigForm')(state),
    providerForm: getFormValues('VmProviderConfigForm')(state),
    providerValues: getFormValues('VmProviderForm')(state),
    providerDirty: isDirty('VmProviderForm')(state),
    dnsForm: getFormValues('DnsProviderConfigForm')(state),
    dnsValues: getFormValues('DnsProviderForm')(state),
    dnsDirty: isDirty('DnsProviderForm')(state),
}),
    dispatch => ({
        getAutoScaleConfigs: () => dispatch(getAutoScaleConfigs()),
        createAutoScaleConfig: (data) => dispatch(createAutoScaleConfig(data)),
        updateAutoScaleConfig: (data) => dispatch(updateAutoScaleConfig(data)),
        createDnsProviderConfig: (data) => dispatch(createDnsProviderConfig(data)),
        updateDnsProviderConfig: (data) => dispatch(updateDnsProviderConfig(data)),
        createVmProviderConfig: (data) => dispatch(createVmProviderConfig(data)),
        updateVmProviderConfig: (data) => dispatch(updateVmProviderConfig(data)),
    }))(UpdateAutoScaleTranslated);