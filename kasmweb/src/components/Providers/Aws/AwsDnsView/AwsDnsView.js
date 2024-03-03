import React, { Component } from "react";
import Proptypes from "prop-types";
import {withTranslation} from "react-i18next";

export class ViewAwsDnsProviderConfig extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        const { currentDnsProviderConfig, t } = this.props;
        return (
            <React.Fragment>
                <tr><td><h4>{t("providers.Name")}</h4></td><td>{currentDnsProviderConfig.config_name || "-"}</td></tr>
                <tr><td><h4>{t("providers.Access Key ID")}</h4></td><td>{currentDnsProviderConfig.aws_access_key_id}</td></tr>
                <tr><td><h4>{t("providers.Access Key Secret")}</h4></td><td>{currentDnsProviderConfig.aws_secret_access_key}</td></tr>
            </React.Fragment>
        );
    }
}

ViewAwsDnsProviderConfig.propTypes = {
    currentDnsProviderConfig: Proptypes.object.isRequired,
};

const ViewAwsDnsProviderConfigTranslated = withTranslation('common')(ViewAwsDnsProviderConfig)
export default withTranslation()(ViewAwsDnsProviderConfigTranslated);