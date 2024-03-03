import React, { Component } from "react";
import Proptypes from "prop-types";
import ReactJson from 'react-json-view';
import {withTranslation} from "react-i18next";

export class ViewGcpDnsProviderConfig extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        const { currentDnsProviderConfig, t } = this.props;
        return (
            <React.Fragment>
                <tr><td><h4>{t("providers.Name")}</h4></td><td>{currentDnsProviderConfig.config_name || "-"}</td></tr>
                <tr><td><h4>{t("providers.Project")}</h4></td><td>{currentDnsProviderConfig.gcp_project}</td></tr>
                <tr><td><h4>{t("providers.Credentials")}</h4></td><td>
                <ReactJson src={currentDnsProviderConfig.gcp_credentials}
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

ViewGcpDnsProviderConfig.propTypes = {
    currentDnsProviderConfig: Proptypes.object.isRequired,
};

const ViewGcpDnsProviderConfigTranslated = withTranslation('common')(ViewGcpDnsProviderConfig)
export default withTranslation()(ViewGcpDnsProviderConfigTranslated);