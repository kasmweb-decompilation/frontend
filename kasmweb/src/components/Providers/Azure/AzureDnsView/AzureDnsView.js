import React, { Component } from "react";
import Proptypes from "prop-types";
import {withTranslation} from "react-i18next";

export class ViewAzureDnsProviderConfig extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        const { currentDnsProviderConfig, t } = this.props;
        return (
            <React.Fragment>
                <tr><td><h4>{t("providers.Name")}</h4></td><td>{currentDnsProviderConfig.config_name || "-"}</td></tr>
                <tr><td><h4>{t("providers.Subscription ID")}</h4></td><td>{currentDnsProviderConfig.azure_subscription_id}</td></tr>
                <tr><td><h4>{t("providers.Resource Group")}</h4></td><td>{currentDnsProviderConfig.azure_resource_group}</td></tr>
                <tr><td><h4>{t("providers.Tenant ID")}</h4></td><td><span>{currentDnsProviderConfig.azure_tenant_id}</span></td></tr>
                <tr><td><h4>{t("providers.Client ID")}</h4></td><td>{currentDnsProviderConfig.azure_client_id}</td></tr>
                <tr><td><h4>{t("providers.Client Secret")}</h4></td><td>{currentDnsProviderConfig.azure_client_secret}</td></tr>
                <tr><td><h4>{t("providers.Azure Authority")}</h4></td><td>{currentDnsProviderConfig.azure_authority}</td></tr>
                <tr><td><h4>{t("providers.Region")}</h4></td><td>{currentDnsProviderConfig.azure_region}</td></tr>
            </React.Fragment>
        );
    }
}

ViewAzureDnsProviderConfig.propTypes = {
    currentDnsProviderConfig: Proptypes.object.isRequired,
};

const ViewAzureDnsProviderConfigTranslated = withTranslation('common')(ViewAzureDnsProviderConfig)
export default withTranslation()(ViewAzureDnsProviderConfigTranslated);