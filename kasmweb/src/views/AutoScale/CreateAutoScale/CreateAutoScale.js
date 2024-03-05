import React, { Component } from 'react';
import { connect } from "react-redux";
import { getFormValues, isDirty, destroy } from "redux-form";
import { Row, Col, Card, CardHeader, CardBody, Container } from "reactstrap";
import AutoScaleConfigForm from "../AutoScaleForm/AutoScaleForm";
import VmProviderConfigForm from "../../VmProvider/VmProviderConfigForm/VmProviderConfigForm";
import DnsProviderConfigForm from "../../DnsProvider/DnsProviderConfigForm/DnsProviderConfigForm";
import { createAutoScaleConfig, updateAutoScaleConfig, getAutoScaleConfigs, clearAutoScaleConfig } from '../../../actions/actionAutoScale';
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
import {withTranslation} from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faScaleBalanced } from '@fortawesome/free-solid-svg-icons/faScaleBalanced';
import PageHeader, { parentRoutes } from "../../../components/Header/PageHeader";
import { TabList } from "../../../components/Form/Form.js"

const parentRouteList = parentRoutes('/server_pools')
const newRoutes = [
    ...parentRouteList.routes,
    {name: "pools.autoscale",path:"/autoscale",isActive: true},
    {name: "generic.create",path:"/create_autoscale",isActive: true},
];

class CreateAutoScale extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 0,
            wizard: true,
            pool: new URLSearchParams(this.props.location.search).get('pool') || null,
            clone: new URLSearchParams(this.props.location.search).get('clone') || null,
            autoscale_config: null,
            vm_provider_config: null,
            dns_provider_config: null,
            steps: null,
            registerDns: false,
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

    async componentDidMount () {
        await this.props.clearAutoScaleConfig()
        if(this.state.clone !== null) {
            await this.props.getAutoScaleConfigs()
            const { autoscale_configs, t } = this.props
            const clonedConfig = {
                ...autoscale_configs.find(autoscale => autoscale.autoscale_config_id === this.state.clone)
            }
            clonedConfig.autoscale_config_name = clonedConfig.autoscale_config_name + ' (' + t("autoscale.Duplicate") + ')'
            clonedConfig.autoscale_config_id = null
            this.setState({ autoscale_config: clonedConfig })
        }
    }

    UNSAFE_componentWillReceiveProps (nextProps) {
        if (nextProps && nextProps.savedAutoScale !== this.props.savedAutoScale) {
            this.setState({ autoscale_config: nextProps.savedAutoScale })
        } 
    }

    render() {
        const { onSubmit, t } = this.props
        const { page } = this.state
        const steps = this.steps(this.state.registerDns)
        return (
            <div >
                <PageHeader location={this.props.location} routes={typeof newRoutes !== 'undefined' ? newRoutes : null} title={t('autoscale.Create AutoScale Config')} icon={<FontAwesomeIcon icon={faScaleBalanced} />} />
                <Row>
                    <Col sm={{ size: 10, order: 3, offset: 1 }}>
                        <TabList {...this.props} tabList={[{ name: 'generic.create', key: 'form'}]} currentTab={'form'} setCurrentTab={() => null} />

                        <Row>
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
                                    {page === 0 && <AutoScaleConfigForm autoscale_config={this.state.autoscale_config} createAutoScaleConfig={this.props.createAutoScaleConfig} onRegisterDns={(dns) => this.setState({ registerDns: dns })} onSubmit={() => this.submitApi('autoscale')} />}
                                    {page === 1 && <VmProviderConfigForm autoscale_config={this.state.autoscale_config} stepCount={steps.length} vm_provider_config={this.state.vm_provider_config} previousPage={this.previousPage} wizard={true} onSubmit={() => this.submitApi('vm')} />}
                                    {page === 2 && <DnsProviderConfigForm autoscale_config={this.state.autoscale_config} dns_provider_config={this.state.dns_provider_config} previousPage={this.previousPage} wizard={true} onSubmit={() => this.submitApi('dns')} />}
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>
        );
    }
}

const CreateAutoScaleTranslated = withTranslation('common')(CreateAutoScale)
export default connect(state =>
({
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
    autoscaleValues: getFormValues('AutoScaleConfigForm')(state),
    providerForm: getFormValues('VmProviderConfigForm')(state),
    providerValues: getFormValues('VmProviderForm')(state),
    providerDirty: isDirty('VmProviderForm')(state),
    dnsForm: getFormValues('DnsProviderConfigForm')(state),
    dnsValues: getFormValues('DnsProviderForm')(state),
    dnsDirty: isDirty('DnsProviderForm')(state),
}),
    dispatch =>
    ({
        getAutoScaleConfigs: () => dispatch(getAutoScaleConfigs()),
        clearAutoScaleConfig: (data) => dispatch(clearAutoScaleConfig(data)),
        createAutoScaleConfig: (data) => dispatch(createAutoScaleConfig(data)),
        updateAutoScaleConfig: (data) => dispatch(updateAutoScaleConfig(data)),
        createDnsProviderConfig: (data) => dispatch(createDnsProviderConfig(data)),
        updateDnsProviderConfig: (data) => dispatch(updateDnsProviderConfig(data)),
        createVmProviderConfig: (data) => dispatch(createVmProviderConfig(data)),
        updateVmProviderConfig: (data) => dispatch(updateVmProviderConfig(data)),
    }))(CreateAutoScaleTranslated);

