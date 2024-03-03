import React, { Component} from 'react';
import { connect } from "react-redux";
import { Row, Col } from "reactstrap";
import { NotificationManager } from "react-notifications";
import LoadingSpinner from "../../components/LoadingSpinner/index";
import DataTable from "../../components/Table/Table";

import { Link } from "react-router-dom";
import {getStagingConfigs, deleteStagingConfig,setStagingPageInfo} from "../../actions/actionStaging.js"
import {withTranslation} from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFlask } from '@fortawesome/pro-light-svg-icons/faFlask';
import { faTrash } from '@fortawesome/pro-light-svg-icons/faTrash';
import PageHeader from "../../components/Header/PageHeader";
import { ConfirmAction } from '../../components/Table/NewTable';

class StagingConfig extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            modal: false,
            filterId: null,
        };

        this.cancelDelete = this.cancelDelete.bind(this);
        this.deleteConfirm = this.deleteConfirm.bind(this);
        this.deleteStagingAction = this.deleteStagingAction.bind(this);
        this.handleDeleteSuccess = this.handleDeleteSuccess.bind(this);
        this.handleDeleteError = this.handleDeleteError.bind(this);
    }

    componentDidMount() {
        this.props.getStagingConfigs();
    }

    deleteConfirm(stagingConfigId){
        this.setState({modal: !this.state.modal,
            stagingConfigId: stagingConfigId});
    }

    cancelDelete(){
        this.setState({modal: !this.state.modal});
    }

    deleteStagingAction(){
        this.props.deleteStagingConfig(this.state.stagingConfigId).
        then(() => this.handleDeleteSuccess()).
        catch(() => this.handleDeleteError());
    }

    handleDeleteSuccess(){
        const {deleteStagingErrorMessage, t} = this.props;
        this.setState({modal: false});
        if(deleteStagingErrorMessage) {
            NotificationManager.error(deleteStagingErrorMessage,t('staging.delete-staging-config-failed'), 3000);
        }else{
            NotificationManager.success(t('staging.successfully-deleted-staging-c'),t('staging.delete-staging-config'), 3000);
            this.props.getStagingConfigs();
        }
    }

    handleDeleteError(){
        const {deleteStagingError, t} = this.props;
        this.setState({modal: false});
        if(deleteStagingError){
            NotificationManager.error(deleteStagingError,t('staging.failed-to-delete-staging-confi'), 3000);
            this.props.history.push("/staging");
        }else{
            NotificationManager.error(t('staging.failed-to-delete-staging-confi'),t('staging.delete-staging-config'), 3000);
            this.props.history.push("/staging");
        }
    }

    render() {
        if (this.props.getStagingLoading) {
            return (<div> <LoadingSpinner /></div>);
        }
        const {staging_configs, t} = this.props;
        
        const tableColumns = [
            {
                type: "text",
                name: t('staging.image_id'),
                accessor: "image_friendly_name",
                filterable: true,
                sortable: true,
                cell: (data) => (
                    <div>
                        <Link to={"/updateworkspace/" + data.original.image_id}>
                            {data.original.image_friendly_name}
                        </Link>
                    </div>
                ),
            },
            {
                type: "text",
                name: t('staging.num_sessions'),
                accessor: "num_sessions",
                filterable: true,
                sortable: true
            },
            {
                type: "text",
                name: t('staging.current-sessions'),
                accessor: "num_current_sessions",
                filterable: true,
                sortable: true
            },
            {
                type: "text",
                name: t('staging.zone_id'),
                accessor: "zone_name",
                filterable: true,
                sortable: true
            },
            {
                type: "text",
                name: t('staging.server_pool_id'),
                accessor: "server_pool_name",
                filterable: true,
                sortable: true
            },
            {
                type: "text",
                name: t('staging.autoscale_config_id'),
                accessor: "autoscale_config_name",
                filterable: true,
                sortable: true
            },
            {
                name: t("staging.expiration"),
                accessor: "expiration",
                filterable: true,
                sortable: true,
                showByDefault: false
            },
            {
                name: t("staging.allow_kasm_audio"),
                accessor: "allow_kasm_audio",
                filterable: true,
                sortable: true,
                showByDefault: false
            },
            {
                name: t("staging.allow_kasm_clipboard_down"),
                accessor: "allow_kasm_clipboard_down",
                filterable: true,
                sortable: true,
                showByDefault: false
            },
            {
                name: t("staging.allow_kasm_clipboard_up"),
                accessor: "allow_kasm_clipboard_up",
                filterable: true,
                sortable: true,
                showByDefault: false
            },
            {
                name: t("staging.allow_kasm_downloads"),
                accessor: "allow_kasm_downloads",
                filterable: true,
                sortable: true,
                showByDefault: false
            },
            {
                name: t("staging.allow_kasm_gamepad"),
                accessor: "allow_kasm_gamepad",
                filterable: true,
                sortable: true,
                showByDefault: false
            },
            {
                name: t("staging.allow_kasm_microphone"),
                accessor: "allow_kasm_microphone",
                filterable: true,
                sortable: true,
                showByDefault: false
            },
            {
                name: t("staging.allow_kasm_uploads"),
                accessor: "allow_kasm_uploads",
                filterable: true,
                sortable: true,
                showByDefault: false
            },

        ];

        const actions = [
            { id: "edit", icon: "fa-pencil", description: t('buttons.Edit') },
            { id: "delete", icon: "fa-trash", description: t('buttons.Delete') },
        ];

        const onAction = (action, item) => {
            switch (action) {
                case "edit":
                    this.props.history.push(`/updatestaging/${item.staging_config_id}`);
                break;

                case "delete":
                    this.deleteConfirm(item.staging_config_id);
                break;
                case "deleteMulti":
                    item.forEach(id => {
                        this.props.deleteStagingConfig(id).
                        then(() => this.handleDeleteSuccess()).
                        catch(() => this.handleDeleteError());
                                    })
                break;

            }
        }

        return(
            <div className="profile-page">
                <PageHeader location={this.props.location} routes={typeof newRoutes !== 'undefined' ? newRoutes : null} title={t('staging.session-staging')} icon={<FontAwesomeIcon icon={faFlask} />} />
                <Row>
                    <Col sm={{ size: 10, order: 3, offset: 1 }}>
                        <DataTable
                            id="staging"
                            data={staging_configs}
                            columns={tableColumns}
                            actions={actions}
                            onAction={onAction}
                            mainId="staging_config_id"
                            add={{
                                name: t('staging.add-config'),
                                action: '/createstaging'
                            }}
                        />
                    </Col>
                </Row>

                <ConfirmAction
                    confirmationDetails={{
                        action: null,
                        details: {
                            title: t('staging.delete-staging-config'),
                            text: t('staging.confirm_delete'),
                            iconBg: 'tw-bg-pink-700 tw-text-white',
                            icon: <FontAwesomeIcon icon={faTrash} />,
                            confirmBg: 'tw-bg-pink-700',
                            confirmText: t('buttons.Delete'),

                        }
                    }}
                    open={this.state.modal}
                    externalClose={true}
                    setOpen={this.cancelDelete}
                    onAction={this.deleteStagingAction}
                />

            </div>
        );
    }

}
const StagingConfigTranslated = withTranslation('common')(StagingConfig)
export default connect(state => ({
        staging_configs: state.staging.staging_configs || [],
        getStagingLoading: state.staging.getStagingLoading || false,
        getStagingErrorMessage: state.staging.getStagingErrorMessage || false,
        getStagingError: state.staging.getStagingError || null,
        deleteStagingErrorMessage: state.staging.deleteStagingErrorMessage || null,
        deleteStagingError: state.staging.deleteStagingError || null,
        deletedStaging: state.staging.deletedStaging || null,
        deleteStagingLoading: state.staging.deleteStagingLoading || null,
        pages : {pageSize : state.staging.pageSize, pageNo : state.staging.pageNo},
    }),
    dispatch => ({
        getStagingConfigs: () => dispatch(getStagingConfigs()),
        deleteStagingConfig: (data) => dispatch(deleteStagingConfig(data)),
        setPageInfo : (data)=> dispatch(setStagingPageInfo(data)),

    }))(StagingConfigTranslated);
