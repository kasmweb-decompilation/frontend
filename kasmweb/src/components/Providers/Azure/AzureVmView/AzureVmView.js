import React, { Component } from "react";
import Proptypes from "prop-types";
import ReactJson from 'react-json-view';
import iconNo from "../../../../../assets/images/icon_no.svg";
import iconYes from "../../../../../assets/images/icon_yes.svg";
import {withTranslation} from "react-i18next";

export class ViewAzureVmProviderConfig extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        const { currentVmProviderConfig, t } = this.props;
        return (
            <React.Fragment>
                <tr><td><h4>{t("providers.Name")}</h4></td><td>{currentVmProviderConfig.config_name || "-"}</td></tr>
                <tr><td><h4>{t("providers.Subscription ID")}</h4></td><td>{currentVmProviderConfig.azure_subscription_id}</td></tr>
                <tr><td><h4>{t("providers.Resource Group")}</h4></td><td>{currentVmProviderConfig.azure_resource_group}</td></tr>
                <tr><td><h4>{t("providers.Tenant ID")}</h4></td><td><span>{currentVmProviderConfig.azure_tenant_id}</span></td></tr>
                <tr><td><h4>{t("providers.Client ID")}</h4></td><td>{currentVmProviderConfig.azure_client_id}</td></tr>
                <tr><td><h4>{t("providers.Client Secret")}</h4></td><td>{currentVmProviderConfig.azure_client_secret}</td></tr>
                <tr><td><h4>{t("providers.Azure Authority")}</h4></td><td>{currentVmProviderConfig.azure_authority}</td></tr>
                <tr><td><h4>{t("providers.Region")}</h4></td><td>{currentVmProviderConfig.azure_region}</td></tr>
                <tr><td><h4>{t("providers.Max Instances")}</h4></td><td>{currentVmProviderConfig.azure_max_instances}</td></tr>
                <tr><td><h4>{t("providers.VM Size")}</h4></td><td>{currentVmProviderConfig.azure_vm_size}</td></tr>
                <tr><td><h4>{t("providers.OS Disk Type")}</h4></td><td>{currentVmProviderConfig.azure_os_disk_type}</td></tr>
                <tr><td><h4>{t("providers.OS Disk Size (GB)")}</h4></td><td>{currentVmProviderConfig.azure_os_disk_size_gb}</td></tr>
                <tr><td><h4>{t("providers.OS Image Reference (JSON)")}</h4></td><td>
                    <ReactJson src={currentVmProviderConfig.azure_image_reference}
                        name={false}
                        collapsed={false}
                        sortKeys={true}
                        collapseStringsAfterLength={40}
                        enableClipboard={false}
                        displayDataTypes={false}
                    />
                </td></tr>
                <tr><td><h4>{t("providers.Network Security Group")}</h4></td><td>{currentVmProviderConfig.azure_network_sg}</td></tr>
                <tr><td><h4>{t("providers.Subnet")}</h4></td><td>{currentVmProviderConfig.azure_subnet}</td></tr>
                <tr><td><h4>{t("providers.Assign Public IP")}</h4></td><td><img src={currentVmProviderConfig.azure_public_ip ? iconYes : iconNo} alt="yesnoIcon" /></td></tr>
                <tr><td><h4>{t("providers.Tags (JSON)")}</h4></td><td>
                    <ReactJson src={currentVmProviderConfig.azure_tags}
                        name={false}
                        collapsed={false}
                        sortKeys={true}
                        collapseStringsAfterLength={40}
                        enableClipboard={false}
                        displayDataTypes={false}
                    />
                </td></tr>
                <tr><td><h4>{t("providers.OS Username")}</h4></td><td>{currentVmProviderConfig.azure_os_username}</td></tr>
                <tr><td><h4>{t("providers.OS Password")}</h4></td><td><span>{currentVmProviderConfig.azure_os_password}</span></td></tr>
                <tr><td><h4>{t("providers.SSH Public Key")}</h4></td><td><span>{currentVmProviderConfig.azure_ssh_public_key}</span></td></tr>
                <tr><td><h4>{t("providers.Agent Startup Script")}</h4></td><td><span>{currentVmProviderConfig.azure_startup_script}</span></td></tr>
                <tr><td><h4>{t("providers.Config Override (JSON)")}</h4></td><td>
                    <ReactJson src={currentVmProviderConfig.azure_config_override}
                        name={false}
                        collapsed={false}
                        sortKeys={true}
                        collapseStringsAfterLength={40}
                        enableClipboard={false}
                        displayDataTypes={false}
                    />
                </td></tr>
            </React.Fragment>
        );
    }
}

ViewAzureVmProviderConfig.propTypes = {
    currentVmProviderConfig: Proptypes.object.isRequired,
};

const ViewAzureVmProviderConfigTranslated = withTranslation('common')(ViewAzureVmProviderConfig)
export default withTranslation()(ViewAzureVmProviderConfigTranslated);