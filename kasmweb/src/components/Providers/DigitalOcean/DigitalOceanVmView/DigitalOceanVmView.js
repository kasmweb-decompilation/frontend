import React, { Component } from "react";
import Proptypes from "prop-types";
import {withTranslation} from "react-i18next";

export class ViewDigitalOceanVmProviderConfig extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        const { currentVmProviderConfig, t } = this.props;
        return (
            <React.Fragment>
                <tr><td><h4>{t("providers.Name")}</h4></td><td>{currentVmProviderConfig.config_name || "-"}</td></tr>
                <tr><td><h4>{t("providers.Token")}</h4></td><td>{currentVmProviderConfig.digital_ocean_token}</td></tr>
                <tr><td><h4>{t("providers.Max Droplets")}</h4></td><td>{currentVmProviderConfig.max_instances}</td></tr>
                <tr><td><h4>{t("providers.Region")}</h4></td><td><span>{currentVmProviderConfig.region}</span></td></tr>
                <tr><td><h4>{t("providers.Image")}</h4></td><td>{currentVmProviderConfig.digital_ocean_droplet_image}</td></tr>
                <tr><td><h4>{t("providers.Droplet Size")}</h4></td><td>{currentVmProviderConfig.digital_ocean_droplet_size}</td></tr>
                <tr><td><h4>{t("providers.Tags")}</h4></td><td>{currentVmProviderConfig.digital_ocean_tags}</td></tr>
                <tr><td><h4>{t("providers.SSH Key Name")}</h4></td><td>{currentVmProviderConfig.digital_ocean_sshkey_name}</td></tr>
                <tr><td><h4>{t("providers.Firewall Name")}</h4></td><td>{currentVmProviderConfig.digital_ocean_firewall_name}</td></tr>
                <tr><td><h4>{t("providers.Agent Startup Script")}</h4></td><td><span>{currentVmProviderConfig.startup_script}</span></td></tr>
            </React.Fragment>
        );
    }
}

ViewDigitalOceanVmProviderConfig.propTypes = {
    currentVmProviderConfig: Proptypes.object.isRequired,
};

const ViewDigitalOceanVmProviderConfigTranslated = withTranslation('common')(ViewDigitalOceanVmProviderConfig)
export default withTranslation()(ViewDigitalOceanVmProviderConfigTranslated);