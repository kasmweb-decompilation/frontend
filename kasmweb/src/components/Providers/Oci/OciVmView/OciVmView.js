import React, { Component } from "react";
import { connect } from "react-redux";
import Proptypes from "prop-types";
import ReactJson from 'react-json-view';
import {withTranslation} from "react-i18next";

class ViewOciVmProviderConfig extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        const { currentVmProviderConfig, t } = this.props;
        return (
            <React.Fragment>
                <tr><td><h4>{t("providers.Name")}</h4></td><td>{currentVmProviderConfig.config_name || "-"}</td></tr>
                <tr><td><h4>{t("providers.User OCID")}</h4></td><td>{currentVmProviderConfig.oci_user_ocid}</td></tr>
                <tr><td><h4>{t("providers.Fingerprint")}</h4></td><td>{currentVmProviderConfig.oci_fingerprint}</td></tr>
                <tr><td><h4>{t("providers.Private Key")}</h4></td><td><span>{currentVmProviderConfig.oci_private_key}</span></td></tr>
                <tr><td><h4>{t("providers.Region")}</h4></td><td>{currentVmProviderConfig.oci_region}</td></tr>
                <tr><td><h4>{t("providers.Tenancy OCID")}</h4></td><td>{currentVmProviderConfig.oci_tenancy_ocid}</td></tr>
                <tr><td><h4>{t("providers.Compartment OCID")}</h4></td><td>{currentVmProviderConfig.oci_compartment_ocid}</td></tr>
                <tr><td><h4>{t("providers.Max Instances")}</h4></td><td>{currentVmProviderConfig.max_instances}</td></tr>
                <tr><td><h4>{t("providers.Availability Domain")}</h4></td><td>{currentVmProviderConfig.oci_availability_domain}</td></tr>
                <tr><td><h4>{t("providers.Image OCID")}</h4></td><td>{currentVmProviderConfig.oci_image_ocid}</td></tr>
                <tr><td><h4>{t("providers.Shape")}</h4></td><td>{currentVmProviderConfig.oci_shape}</td></tr>
                <tr><td><h4>{t("providers.Flex CPUs")}</h4></td><td>{currentVmProviderConfig.oci_flex_cpus}</td></tr>
                <tr><td><h4>{t("providers.Flex Memory GB")}</h4></td><td>{currentVmProviderConfig.oci_flex_memory_gb}</td></tr>
                <tr><td><h4>{t("providers.Boot Volume GB")}</h4></td><td>{currentVmProviderConfig.oci_boot_volume_gb}</td></tr>
                <tr><td><h4>{t("providers.Custom Tags (JSON)")}</h4></td><td>
                    <ReactJson src={currentVmProviderConfig.oci_custom_tags}
                        name={false}
                        collapsed={false}
                        sortKeys={true}
                        collapseStringsAfterLength={40}
                        enableClipboard={false}
                        displayDataTypes={false}
                    />
                </td></tr>
                <tr><td><h4>{t("providers.Subnet OCID")}</h4></td><td>{currentVmProviderConfig.oci_subnet_ocid}</td></tr>
                <tr><td><h4>{t("providers.SSH Public Key")}</h4></td><td><span>{currentVmProviderConfig.oci_ssh_public_key}</span></td></tr>
                <tr><td><h4>{t("providers.Startup Script")}</h4></td><td><span>{currentVmProviderConfig.startup_script}</span></td></tr>
            </React.Fragment>
        );
    }
}

ViewOciVmProviderConfig.propTypes = {
    currentVmProviderConfig: Proptypes.object.isRequired,
};
const ViewOciVmProviderConfigTranslated = withTranslation('common')(ViewOciVmProviderConfig)
export default connect(state =>
({
}),
    dispatch =>
    ({
    }))(ViewOciVmProviderConfigTranslated);
