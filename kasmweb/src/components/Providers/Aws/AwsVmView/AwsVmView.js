import React, { Component } from "react";
import Proptypes from "prop-types";
import ReactJson from 'react-json-view';
import {withTranslation} from "react-i18next";

export class ViewAwsVmProviderConfig extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        const { currentVmProviderConfig, t } = this.props;
        return (
            <React.Fragment>
                <tr><td><h4>{t("providers.Name")}</h4></td><td>{currentVmProviderConfig.config_name || "-"}</td></tr>
                <tr><td><h4>{t("providers.AWS Access Key Id")}</h4></td><td>{currentVmProviderConfig.aws_access_key_id}</td></tr>
                <tr><td><h4>{t("providers.AWS Secret Access Key")}</h4></td><td>{currentVmProviderConfig.aws_secret_access_key}</td></tr>
                <tr><td><h4>{t("providers.AWS Region")}</h4></td><td><span>{currentVmProviderConfig.aws_region}</span></td></tr>
                <tr><td><h4>{t("providers.AWS EC2 AMI Id")}</h4></td><td>{currentVmProviderConfig.aws_ec2_ami_id}</td></tr>
                <tr><td><h4>{t("providers.AWS EC2 Instance Type")}</h4></td><td>{currentVmProviderConfig.aws_ec2_instance_type}</td></tr>
                <tr><td><h4>{t("providers.AWS EC2 Key Pair Name")}</h4></td><td>{currentVmProviderConfig.aws_ec2_key_pair_name}</td></tr>
                <tr><td><h4>{t("providers.AWS Max EC2 Nodes")}</h4></td><td>{currentVmProviderConfig.max_instances}</td></tr>
                <tr><td><h4>{t("providers.AWS EC2 Security Group IDs (JSON)")}</h4></td><td>
                    <ReactJson src={currentVmProviderConfig.aws_ec2_security_group_ids}
                        name={false}
                        collapsed={false}
                        sortKeys={true}
                        collapseStringsAfterLength={40}
                        enableClipboard={false}
                        displayDataTypes={false}
                    />
                </td></tr>

                <tr><td><h4>{t("providers.AWS EC2 Subnet ID")}</h4></td><td>{currentVmProviderConfig.aws_ec2_subnet_id}</td></tr>
                <tr><td><h4>{t("providers.AWS EC2 EBS Volume Size (GB)")}</h4></td><td>{currentVmProviderConfig.aws_ec2_ebs_volume_size_gb}</td></tr>
                <tr><td><h4>{t("providers.AWS EC2 EBS Volume Type")}</h4></td><td>{currentVmProviderConfig.aws_ec2_ebs_volume_type}</td></tr>
                <tr><td><h4>{t("providers.AWS EC2 IAM")}</h4></td><td>{currentVmProviderConfig.aws_ec2_iam}</td></tr>
                <tr><td><h4>{t("providers.AWS EC2 Custom Tags (JSON)")}</h4></td><td>
                    <ReactJson src={currentVmProviderConfig.aws_ec2_custom_tags}
                        name={false}
                        collapsed={false}
                        sortKeys={true}
                        collapseStringsAfterLength={40}
                        enableClipboard={false}
                        displayDataTypes={false}
                    />
                </td></tr>
                <tr><td><h4>{t("providers.AWS EC2 Startup Script")}</h4></td><td><span>{currentVmProviderConfig.startup_script}</span></td></tr>
                <tr><td><h4>{t("providers.AWS Config Override (JSON)")}</h4></td><td>
                    <ReactJson src={currentVmProviderConfig.aws_ec2_config_override}
                        name={false}
                        collapsed={false}
                        sortKeys={true}
                        collapseStringsAfterLength={40}
                        enableClipboard={false}
                        displayDataTypes={false}
                    />
                </td></tr>
                <tr><td><h4>{t("providers.Retrieve Windows VM Password from AWS")}</h4></td><td><span>{currentVmProviderConfig.retrieve_password}</span></td></tr>
            </React.Fragment>
        );
    }
}

ViewAwsVmProviderConfig.propTypes = {
    currentVmProviderConfig: Proptypes.object.isRequired,
};

const ViewAwsVmProviderConfigTranslated = withTranslation('common')(ViewAwsVmProviderConfig)
export default withTranslation()(ViewAwsVmProviderConfigTranslated);