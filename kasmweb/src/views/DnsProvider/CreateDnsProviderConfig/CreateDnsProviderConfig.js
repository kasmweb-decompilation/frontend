import React, { Component } from 'react';
import { connect } from "react-redux";
import { getFormValues } from "redux-form";
import { Row, Col, Card, CardHeader, Container } from "reactstrap";
import DnsProviderConfigForm from "../DnsProviderConfigForm/DnsProviderConfigForm";
import { createDnsProviderConfig, getDnsProviderConfigs } from '../../../actions/actionDnsProvider';
import { handleSaveSuccess, handleSaveError } from '../actions'
import {withTranslation} from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChartNetwork } from '@fortawesome/free-solid-svg-icons/faChartSimple';
import PageHeader, { parentRoutes } from "../../../components/Header/PageHeader";
import { TabList, Group } from "../../../components/Form/Form.js"

const parentRouteList = parentRoutes('/server_pools')
const newRoutes = [
    ...parentRouteList.routes,
    {name: "autoscale.DNS Provider",path:"/dns_provider",isActive: true},
    {name: "generic.create",path:"/create_dns_provider",isActive: true},
];

class CreateDnsProviderConfig extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
        this.submitApi = this.submitApi.bind(this);
        this.handleSaveSuccess = handleSaveSuccess.bind(this);
        this.handleSaveError = handleSaveError.bind(this);

    }

    componentDidMount(){
        this.props.getDnsProviderConfigs();
    }

    async submitApi() {
        try {
            await this.props.createDnsProviderConfig(this.props.providerValues)
            const provider = await this.handleSaveSuccess()
        } catch (e) {
            this.handleSaveError()
        }
    }

    render() {
        const { t } = this.props;
        return (
            <div className='tw-pb-24'>
                <PageHeader location={this.props.location} routes={typeof newRoutes !== 'undefined' ? newRoutes : null} title={t('providers.create-dns-provider-config')} icon={<FontAwesomeIcon icon={faChartNetwork} />} />

                <Row>
                <Col sm={{ size: 10, order: 3, offset: 1 }}>
                <TabList {...this.props} tabList={[{ name: 'generic.create', key: 'form'}]} currentTab={'form'} setCurrentTab={() => null} />
                            <Group section="providers" title="create-dns-config" description="create-dns-config-desc">
                                <DnsProviderConfigForm
                                    onSubmit={this.submitApi}
                                    createDnsProviderConfig={this.props.createDnsProviderConfig} />
                            </Group>
                        </Col>
                </Row>
            </div>
        );
    }
}

const CreateDnsProviderConfigTranslated = withTranslation('common')(CreateDnsProviderConfig)
export default connect(state =>
({
    dns_provider_configs: state.dns_provider.dns_provider_configs || [],
    saveDnsProviderError: state.dns_provider.saveDnsProviderError,
    saveDnsProviderLoading: state.dns_provider.saveDnsProviderLoading,
    savedDnsProvider: state.dns_provider.savedDnsProvider,
    providerValues: getFormValues('DnsProviderForm')(state),
}),
    dispatch =>
    ({
        getDnsProviderConfigs: () => dispatch(getDnsProviderConfigs()),
        createDnsProviderConfig: (data) => dispatch(createDnsProviderConfig(data))
    }))(CreateDnsProviderConfigTranslated);

