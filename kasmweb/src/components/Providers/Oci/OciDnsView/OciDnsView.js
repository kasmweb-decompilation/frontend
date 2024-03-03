import React, { Component } from "react";
import { connect } from "react-redux";
import Proptypes from "prop-types";
import {withTranslation} from "react-i18next";

class ViewOciDnsProviderConfig extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        const { currentDnsProviderConfig, t } = this.props;
        return (
            <React.Fragment>
                <tr><td><h4>{t("providers.Name")}</h4></td><td>{currentDnsProviderConfig.config_name || "-"}</td></tr>
                <tr><td><h4>{t("providers.User OCID")}</h4></td><td>{currentDnsProviderConfig.oci_user_ocid}</td></tr>
                <tr><td><h4>{t("providers.Private Key")}</h4></td><td>{currentDnsProviderConfig.oci_private_key}</td></tr>
                <tr><td><h4>{t("providers.Fingerprint")}</h4></td><td>{currentDnsProviderConfig.oci_fingerprint}</td></tr>
                <tr><td><h4>{t("providers.Tenancy OCID")}</h4></td><td>{currentDnsProviderConfig.oci_tenancy_ocid}</td></tr>
                <tr><td><h4>{t("providers.Region")}</h4></td><td>{currentDnsProviderConfig.oci_region}</td></tr>
                <tr><td><h4>{t("providers.Compartment OCID")}</h4></td><td>{currentDnsProviderConfig.oci_compartment_ocid}</td></tr>
            </React.Fragment>
        );
    }
}

ViewOciDnsProviderConfig.propTypes = {
    currentDnsProviderConfig: Proptypes.object.isRequired,
};
const ViewOciDnsProviderConfigTranslated = withTranslation('common')(ViewOciDnsProviderConfig)
export default connect(state =>
({
}),
    dispatch =>
    ({
    }))(ViewOciDnsProviderConfigTranslated);
