import React, { Component} from 'react';
import { connect } from "react-redux";
import { Row, Col } from "reactstrap";
import { NotificationManager } from "react-notifications";
import LoadingSpinner from "../../components/LoadingSpinner/index";
import DataTable from "../../components/Table/Table";
import {getBrandingConfigs, deleteBrandingConfig,setBrandingPageInfo} from "../../actions/actionBranding";
import {withTranslation} from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaintbrush } from '@fortawesome/free-solid-svg-icons/faPaintbrush';
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';
import PageHeader from "../../components/Header/PageHeader";
import { ConfirmAction, SettingColumn } from "../../components/Table/NewTable";

class BrandingConfig extends Component {
    constructor(props) {
        super(props);

        this.state = {
            modal: false,
            filterId: null
        };

        this.cancelDelete = this.cancelDelete.bind(this);
        this.deleteConfirm = this.deleteConfirm.bind(this);
        this.deleteBrandingAction = this.deleteBrandingAction.bind(this);
        this.handleDeleteSuccess = this.handleDeleteSuccess.bind(this);
        this.handleDeleteError = this.handleDeleteError.bind(this);
    }

    componentDidMount() {
        this.props.getBrandingConfigs();
    }

    deleteConfirm(brandingConfigId){
        this.setState({modal: !this.state.modal,
            brandingConfigId: brandingConfigId});
    }

    cancelDelete(){
        this.setState({modal: !this.state.modal});
    }

    deleteBrandingAction(){
        this.props.deleteBrandingConfig(this.state.brandingConfigId).
        then(() => this.handleDeleteSuccess()).
        catch(() => this.handleDeleteError());
    }

    handleDeleteSuccess(){
        const {deleteBrandingErrorMessage, t} = this.props;
        this.setState({modal: false});
        if(deleteBrandingErrorMessage) {
            NotificationManager.error(deleteBrandingErrorMessage,t("branding.Delete Branding Config Failed"), 3000);
        }else{
            NotificationManager.success(t("branding.Successfully Deleted Branding Config"),t("branding.Delete Branding Config"), 3000);
            this.props.getBrandingConfigs();
        }
    }

    handleDeleteError(){
        const {deleteBrandingError, t} = this.props;
        this.setState({modal: false});
        if(deleteBrandingError){
            NotificationManager.error(deleteBrandingError,t("branding.Failed to Delete Branding Config"), 3000);
        } else {
            NotificationManager.error(t("branding.Failed to Delete Branding Config"),t("branding.Delete Branding Config"), 3000);
        }
    }

    render() {
        if (this.props.getBrandingLoading) {
            return (<div> <LoadingSpinner /></div>);
        }

        const {branding_configs, t} = this.props;

        const tableColumns = [
            {
                type: "text",
                name: t("branding.name"),
                accessor: "name",
                filterable: true,
                sortable: true,
                colSize: 'minmax(200px, 1.2fr)'
            },
            {
                type: "text",
                name: t("branding.hostname"),
                accessor: "hostname",
                filterable: true,
                sortable: true,
            },
            {
                type: "flag",
                name: t("branding.is_default"),
                accessor: "is_default",
                filterable: true,
                sortable: true,
                overwrite: true,
                cell: (data) => <SettingColumn key={'is_default-' + data.original.branding_config_id} main={data.value} sub={data.colName} />
            },
            {
                accessor: "favicon_logo_url",
                name: t("branding.favicon-logo-url"),
                filterable: true,
                sortable: true,
                showByDefault: false
            },
            {
                accessor: "header_logo_url",
                name: t("branding.header_logo_url"),
                filterable: true,
                sortable: true,
                showByDefault: false
            },
            {
                accessor: "launcher_background_url",
                name: t("branding.launcher_background_url"),
                filterable: true,
                sortable: true,
                showByDefault: false
            },
            {
                accessor: "html_title",
                name: t("branding.html_title"),
                filterable: true,
                sortable: true,
                showByDefault: false
            },
            {
                accessor: "login_logo_url",
                name: t("branding.login-logo-url"),
                filterable: true,
                sortable: true,
                showByDefault: false
            },
            {
                accessor: "login_splash_url",
                name: t("branding.login_splash_url"),
                filterable: true,
                sortable: true,
                showByDefault: false
            },
            {
                accessor: "login_caption",
                name: t("branding.login_caption"),
                filterable: true,
                sortable: true,
                showByDefault: false
            },
            {
                accessor: "loading_session_text",
                name: t("branding.loading_session_text"),
                filterable: true,
                sortable: true,
                showByDefault: false
            },
            {
                accessor: "joining_session_text",
                name: t("branding.joining_session_text"),
                filterable: true,
                sortable: true,
                showByDefault: false
            },
            {
                accessor: "destroying_session_text",
                name: t("branding.destroying_session_text"),
                filterable: true,
                sortable: true,
                showByDefault: false
            },
        ];

        const actions = [
            { id: "edit", icon: "fa-pencil", description: t("buttons.Edit") },
            { id: "delete", icon: "fa-trash", description: t("buttons.Delete") },
        ];

        const onAction = (action, item) => {
            switch (action) {
                case "edit":
                    this.props.history.push(`/updatebranding/${item.branding_config_id}`);
                break;

                case "delete":
                    this.deleteConfirm(item.branding_config_id);
                break;
                case "deleteMulti":
                    item.forEach(id => {
                        this.props.deleteBrandingConfig(id).
                        then(() => this.handleDeleteSuccess()).
                        catch(() => this.handleDeleteError());
                    })
                break;

            }
        }

        return(
            <div className="profile-page">
                <PageHeader location={this.props.location} routes={typeof newRoutes !== 'undefined' ? newRoutes : null} title={t('branding.Branding Configurations')} icon={<FontAwesomeIcon icon={faPaintbrush} />} />
                <Row>
                    <Col sm={{ size: 10, order: 3, offset: 1 }}>
                        <DataTable
                            id="branding"
                            data={branding_configs}
                            columns={tableColumns}
                            actions={actions}
                            onAction={onAction}
                            mainId="branding_config_id"
                            add={{
                                name: t('branding.Add Config'),
                                action: '/createbranding'
                            }}
                        />
                    </Col>
                </Row>

                <ConfirmAction
                    confirmationDetails={{
                        action: null,
                        details: {
                            title: t('branding.Delete Branding Config'),
                            text: t('branding.confirm_delete'),
                            iconBg: 'tw-bg-pink-700 tw-text-white',
                            icon: <FontAwesomeIcon icon={faTrash} />,
                            confirmBg: 'tw-bg-pink-700',
                            confirmText: t('buttons.Delete'),

                        }
                    }}
                    open={this.state.modal}
                    externalClose={true}
                    setOpen={this.cancelDelete}
                    onAction={this.deleteBrandingAction}
                />

            </div>
        );
    }

}

const BrandingConfigTranslated = withTranslation('common')(BrandingConfig)

export default connect(state => ({
        branding_configs: state.branding.branding_configs || [],
        getBrandingLoading: state.branding.getBrandingLoading || false,
        getBrandingErrorMessage: state.branding.getBrandingErrorMessage || false,
        getBrandingError: state.branding.getBrandingError || null,
        deleteBrandingErrorMessage: state.branding.deleteBrandingErrorMessage || null,
        deleteBrandingError: state.branding.deleteBrandingError || null,
        deletedBranding: state.branding.deletedBranding || null,
        deleteBrandingLoading: state.branding.deleteBrandingLoading || null,
        pages : {pageSize : state.branding.pageSize, pageNo : state.branding.pageNo},
    }),
    dispatch => ({
        getBrandingConfigs: () => dispatch(getBrandingConfigs()),
        deleteBrandingConfig: (data) => dispatch(deleteBrandingConfig(data)),
        setPageInfo : (data)=> dispatch(setBrandingPageInfo(data)),
    }))(BrandingConfigTranslated);
