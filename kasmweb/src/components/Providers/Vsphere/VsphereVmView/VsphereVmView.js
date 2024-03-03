import React, { Component } from "react";
import { connect } from "react-redux";
import Proptypes from "prop-types";
import {withTranslation} from "react-i18next";

class ViewVsphereVmProviderConfig extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        const { currentVmProviderConfig, t } = this.props;
        return (
            <React.Fragment>
                <tr><td><h4>{t("providers.Name")}</h4></td><td>{currentVmProviderConfig.config_name || "-"}</td></tr>
                <tr><td><h4>{t("providers.Vsphere-Vcenter-Address")}</h4></td><td>{currentVmProviderConfig.vsphere_vcenter_address}</td></tr>
                <tr><td><h4>{t("providers.Vsphere-Vcenter-Port")}</h4></td><td>{currentVmProviderConfig.vsphere_vcenter_port}</td></tr>
                <tr><td><h4>{t("providers.Vsphere-Vcenter-Username")}</h4></td><td><span>{currentVmProviderConfig.vsphere_vcenter_username}</span></td></tr>
                <tr><td><h4>{t("providers.Vsphere-Vcenter-Password")}</h4></td><td>{currentVmProviderConfig.vsphere_vcenter_password}</td></tr>
                <tr><td><h4>{t("providers.VM-Template-Name")}</h4></td><td>{currentVmProviderConfig.vsphere_template_name}</td></tr>
                <tr><td><h4>{t("providers.Max-Instances")}</h4></td><td>{currentVmProviderConfig.max_instances}</td></tr>
                <tr><td><h4>{t("providers.Datacenter-Name")}</h4></td><td>{currentVmProviderConfig.vsphere_datacenter_name}</td></tr>
                <tr><td><h4>{t("providers.VM-Folder")}</h4></td><td>{currentVmProviderConfig.vsphere_vm_folder}</td></tr>
                <tr><td><h4>{t("providers.Datastore-Name")}</h4></td><td>{currentVmProviderConfig.vsphere_datastore}</td></tr>
                <tr><td><h4>{t("providers.Cluster-Name")}</h4></td><td>{currentVmProviderConfig.vsphere_cluster_name}</td></tr>
                <tr><td><h4>{t("providers.Resource-Pool")}</h4></td><td>{currentVmProviderConfig.vsphere_resource_pool}</td></tr>
                <tr><td><h4>{t("providers.Datastore-Cluster-Name")}</h4></td><td>{currentVmProviderConfig.vsphere_datastore_cluster_name}</td></tr>
                <tr><td><h4>{t("providers.Guest-VM-Username")}</h4></td><td>{currentVmProviderConfig.vsphere_os_username}</td></tr>
                <tr><td><h4>{t("providers.Guest-VM-Password")}</h4></td><td><span>{currentVmProviderConfig.vsphere_os_password}</span></td></tr>
                <tr><td><h4>{t("providers.Number-of-Guest-CPUs")}</h4></td><td><span>{currentVmProviderConfig.vsphere_cpus}</span></td></tr>
                <tr><td><h4>{t("providers.Amount-of-Guest-Memory(MB)")}</h4></td><td><span>{currentVmProviderConfig.vsphere_memoryMB}</span></td></tr>
                <tr><td><h4>{t("providers.What-family-of-OS-is-installed-in-the-VM")}</h4></td><td><span>{currentVmProviderConfig.vsphere_installed_OS_type}</span></td></tr>
                <tr><td><h4>{t("providers.Startup-Script")}</h4></td><td><span>{currentVmProviderConfig.startup_script}</span></td></tr>
            </React.Fragment>
        );
    }
}

ViewVsphereVmProviderConfig.propTypes = {
    currentVmProviderConfig: Proptypes.object.isRequired,
};
const ViewVsphereVmProviderConfigTranslated = withTranslation('common')(ViewVsphereVmProviderConfig)
export default connect(state =>
({
}),
    dispatch =>
    ({
    }))(ViewVsphereVmProviderConfigTranslated);
