import React, { Component } from "react";
import Proptypes from "prop-types";
import ReactJson from 'react-json-view';
import iconNo from "../../../../../assets/images/icon_no.svg";
import iconYes from "../../../../../assets/images/icon_yes.svg";
import {withTranslation} from "react-i18next";

export class ViewGcpVmProviderConfig extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        const { currentVmProviderConfig, t } = this.props;
        return (
            <React.Fragment>
                <tr><td><h4>{t("providers.Name")}</h4></td><td>{currentVmProviderConfig.config_name || "-"}</td></tr>
                <tr><td><h4>{t("providers.GCP Credentials (JSON)")}</h4></td><td>
                <ReactJson src={currentVmProviderConfig.gcp_credentials}
                        name={false}
                        collapsed={false}
                        sortKeys={true}
                        collapseStringsAfterLength={40}
                        enableClipboard={false}
                        displayDataTypes={false}
                    /></td></tr>
                <tr><td><h4>{t("providers.Max Instances")}</h4></td><td>{currentVmProviderConfig.max_instances}</td></tr>
                <tr><td><h4>{t("providers.Project ID")}</h4></td><td>{currentVmProviderConfig.gcp_project}</td></tr>
                <tr><td><h4>{t("providers.Region")}</h4></td><td><span>{currentVmProviderConfig.gcp_region}</span></td></tr>
                <tr><td><h4>{t("providers.Zone")}</h4></td><td>{currentVmProviderConfig.gcp_zone}</td></tr>
                <tr><td><h4>{t("providers.Machine Type")}</h4></td><td>{currentVmProviderConfig.gcp_machine_type}</td></tr>
                <tr><td><h4>{t("providers.Machine Image")}</h4></td><td>{currentVmProviderConfig.gcp_image}</td></tr>
                <tr><td><h4>{t("providers.Boot Volume GB")}</h4></td><td>{currentVmProviderConfig.gcp_boot_volume_gb}</td></tr>
                <tr><td><h4>{t("providers.Disk Type")}</h4></td><td>{currentVmProviderConfig.gcp_disk_type}</td></tr>
                <tr><td><h4>{t("providers.Customer Managed Encryption Key (CMEK)")}</h4></td><td>{currentVmProviderConfig.gcp_cmek}</td></tr>
                <tr><td><h4>{t("providers.Network")}</h4></td><td>{currentVmProviderConfig.gcp_network}</td></tr>
                <tr><td><h4>{t("providers.Sub Network")}</h4></td><td>{currentVmProviderConfig.gcp_subnetwork}</td></tr>
                <tr><td><h4>{t("providers.Public IP")}</h4></td><td><img src={currentVmProviderConfig.gcp_public_ip ? iconYes : iconNo} alt="yesnoIcon" /></td></tr>
                <tr><td><h4>{t("providers.Network Tags (JSON)")}</h4></td><td>
                    <ReactJson src={currentVmProviderConfig.gcp_network_tags}
                        name={false}
                        collapsed={false}
                        sortKeys={true}
                        collapseStringsAfterLength={40}
                        enableClipboard={false}
                        displayDataTypes={false}
                    />
                </td></tr>
                <tr><td><h4>{t("providers.Custom Labels (JSON)")}</h4></td><td>
                    <ReactJson src={currentVmProviderConfig.gcp_custom_labels}
                        name={false}
                        collapsed={false}
                        sortKeys={true}
                        collapseStringsAfterLength={40}
                        enableClipboard={false}
                        displayDataTypes={false}
                    />
                </td></tr>
                <tr><td><h4>{t("providers.Metadata (JSON)")}</h4></td><td>
                    <ReactJson src={currentVmProviderConfig.gcp_metadata}
                        name={false}
                        collapsed={false}
                        sortKeys={true}
                        collapseStringsAfterLength={40}
                        enableClipboard={false}
                        displayDataTypes={false}
                    />
                </td></tr>
                <tr><td><h4>{t("providers.Service Account (JSON)")}</h4></td><td>
                    <ReactJson src={currentVmProviderConfig.gcp_service_account}
                        name={false}
                        collapsed={false}
                        sortKeys={true}
                        collapseStringsAfterLength={40}
                        enableClipboard={false}
                        displayDataTypes={false}
                    />
                </td></tr>
                <tr><td><h4>{t("providers.Guest Accelerators (JSON)")}</h4></td><td>
                    <ReactJson src={currentVmProviderConfig.gcp_guest_accelerators}
                        name={false}
                        collapsed={false}
                        sortKeys={true}
                        collapseStringsAfterLength={40}
                        enableClipboard={false}
                        displayDataTypes={false}
                    />
                </td></tr>
                <tr><td><h4>{t("providers.GCP Config Override (JSON)")}</h4></td><td>
                    <ReactJson src={currentVmProviderConfig.gcp_config_override}
                        name={false}
                        collapsed={false}
                        sortKeys={true}
                        collapseStringsAfterLength={40}
                        enableClipboard={false}
                        displayDataTypes={false}
                    />
                </td></tr>
                <tr><td><h4>{t("providers.Agent Startup Script")}</h4></td><td><span>{currentVmProviderConfig.startup_script}</span></td></tr>
            </React.Fragment>
        );
    }
}

ViewGcpVmProviderConfig.propTypes = {
    currentVmProviderConfig: Proptypes.object.isRequired,
};

const ViewGcpVmProviderConfigTranslated = withTranslation('common')(ViewGcpVmProviderConfig)
export default withTranslation()(ViewGcpVmProviderConfigTranslated);