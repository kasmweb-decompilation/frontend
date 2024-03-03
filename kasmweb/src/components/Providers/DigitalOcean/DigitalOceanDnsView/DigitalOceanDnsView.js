import React, { Component } from "react";
import Proptypes from "prop-types";
import {withTranslation} from "react-i18next";

export class ViewDigitalOceanDnsProviderConfig extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        const { currentDnsProviderConfig, t } = this.props;
        return (
            <React.Fragment>
                <tr><td><h4>{t("providers.Name")}</h4></td><td>{currentDnsProviderConfig.config_name || "-"}</td></tr>
                <tr><td><h4>{t("providers.Token")}</h4></td><td>{currentDnsProviderConfig.digital_ocean_token}</td></tr>
            </React.Fragment>
        );
    }
}

ViewDigitalOceanDnsProviderConfig.propTypes = {
    currentDnsProviderConfig: Proptypes.object.isRequired,
};

const ViewDigitalOceanDnsProviderConfigTranslated = withTranslation('common')(ViewDigitalOceanDnsProviderConfig)
export default withTranslation()(ViewDigitalOceanDnsProviderConfigTranslated);