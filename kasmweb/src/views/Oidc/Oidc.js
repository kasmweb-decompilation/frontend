import React, { Component} from 'react';
import { connect } from "react-redux";
import { Row, Col, Button, Modal, ModalHeader, ModalFooter } from "reactstrap";
import { NotificationManager } from "react-notifications";
import LoadingSpinner from "../../components/LoadingSpinner/index";
import DataTable from "../../components/Table/Table";

import {getOidcConfigs, deleteOidcConfig, setOidcPageInfo} from "../../actions/actionOidc.js"
import {withTranslation} from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShieldKeyhole } from '@fortawesome/pro-light-svg-icons/faShieldKeyhole';
import { faTrash } from '@fortawesome/pro-light-svg-icons/faTrash';
import PageHeader from "../../components/Header/PageHeader";
import { ConfirmAction } from '../../components/Table/NewTable';

class OidcConfig extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            filterId: null,
        };

        this.cancelDelete = this.cancelDelete.bind(this);
        this.deleteConfirm = this.deleteConfirm.bind(this);
        this.deleteOidcAction = this.deleteOidcAction.bind(this);
        this.handleDeleteSuccess = this.handleDeleteSuccess.bind(this);
        this.handleDeleteError = this.handleDeleteError.bind(this);
    }

    componentDidMount() {
        this.props.getOidcConfigs();
    }

    deleteConfirm(oidcConfigId){
        this.setState({modal: !this.state.modal,
            oidcConfigId: oidcConfigId});
    }

    cancelDelete(){
        this.setState({modal: !this.state.modal});
    }

    deleteOidcAction(){
        this.props.deleteOidcConfig(this.state.oidcConfigId).
        then(() => this.handleDeleteSuccess()).
        catch(() => this.handleDeleteError());
    }

    handleDeleteSuccess(){
        const {deleteOidcErrorMessage, t} = this.props;
        this.setState({modal: false});
        if(deleteOidcErrorMessage) {
            NotificationManager.error(deleteOidcErrorMessage,t('auth.delete-oidc-config-failed'), 3000);
        }else{
            NotificationManager.success(t('auth.successfully-deleted-oidc-conf'),t('auth.delete-oidc-config'), 3000);
            this.props.getOidcConfigs();
        }
    }

    handleDeleteError(){
        const {deleteOidcError, t} = this.props;
        this.setState({modal: false});
        if(deleteOidcError){
            NotificationManager.error(deleteOidcError,t('auth.failed-to-delete-oidc-config'), 3000);
            this.props.history.push("/oidc");
        }else{
            NotificationManager.error(t('auth.failed-to-delete-oidc-config'),t('auth.delete-oidc-config'), 3000);
            this.props.history.push("/oidc");
        }
    }

    render() {
        if (this.props.getOidcLoading) {
            return (<div> <LoadingSpinner /></div>);
        }
        
        const {oidc_configs, t} = this.props;

        const tableColumns = [
            {
                type: "text",
                name: t('auth.display-name'),
                accessor: "display_name",
                filterable: true,
                sortable: true,
            },
            {
                type: "flag",
                name: t('auth.enabled'),
                accessor: "enabled",
                filterable: true,
                sortable: true,
            },
            {
                type: "flag",
                name: t('auth.auto-login'),
                accessor: "auto_login",
                filterable: true,
                sortable: true,
            },
            {
                accessor: "logo_url",
                name: t("auth.logo-url"),
                filterable: true,
                sortable: true,
                showByDefault: false,
                colSize: 'minmax(250px,3fr) ',
                cell: (data) => <div>{data.value ? data.value : "-"}</div>
            },
            {
                accessor: "hostname",
                name: t("auth.hostname"),
                filterable: true,
                sortable: true,
                showByDefault: false
            },
            {
                accessor: "is_default",
                name: t("auth.default"),
                filterable: true,
                sortable: true,
                showByDefault: false
            },
            {
                accessor: "client_id",
                name: t("auth.client-id"),
                filterable: true,
                sortable: true,
                showByDefault: false
            },
            {
                accessor: "auth_url",
                name: t("auth.authorization-url"),
                filterable: true,
                sortable: true,
                showByDefault: false,
                colSize: 'minmax(250px,3fr) ',
                cell: (data) => <div>{data.value ? data.value : "-"}</div>
            },
            {
                accessor: "token_url",
                name: t("auth.token-url"),
                filterable: true,
                sortable: true,
                showByDefault: false,
                colSize: 'minmax(250px,3fr) ',
                cell: (data) => <div>{data.value ? data.value : "-"}</div>
            },
            {
                accessor: "user_info_url",
                name: t("auth.user-info-url"),
                filterable: true,
                sortable: true,
                showByDefault: false,
                colSize: 'minmax(250px,3fr) ',
                cell: (data) => <div>{data.value ? data.value : "-"}</div>
            },
            {
                accessor: "username_attribute",
                name: t("auth.username-attribute"),
                filterable: true,
                sortable: true,
                showByDefault: false
            },
            {
                accessor: "groups_attribute",
                name: t("auth.groups-attribute"),
                filterable: true,
                sortable: true,
                showByDefault: false
            },
            {
                accessor: "debug",
                name: t("auth.debug"),
                filterable: true,
                sortable: true,
                showByDefault: false
            },
            {
                accessor: "redirect_url",
                name: t("auth.redirect-url"),
                filterable: true,
                sortable: true,
                showByDefault: false,
                colSize: 'minmax(400px,5fr) ',
                cell: (data) => <div>{data.value ? data.value : "-"}</div>
            },
            {
                accessor: "oidc_id",
                name: t("auth.direct-login-url"),
                filterable: true,
                sortable: true,
                showByDefault: false,
                colSize: 'minmax(400px,5fr) ',
                cell: (data) => <div>{data.value ? "https://" + window.location.host + "/api/sso_login?id=" + data.value : "-"}</div>
            },

        ];

        const actions = [
            { id: "edit", icon: "fa-pencil", description: t('buttons.Edit') },
            { id: "delete", icon: "fa-trash", description: t('buttons.Delete') },
        ];

        const onAction = (action, item) => {
            switch (action) {
                case "edit":
                    this.props.history.push(`/updateoidc/${item.oidc_id}`);
                break;

                case "delete":
                    this.deleteConfirm(item.oidc_id);
                break;
                case "deleteMulti":
                    item.forEach(id => {
                        this.props.deleteOidcConfig(id).
                        then(() => this.handleDeleteSuccess()).
                        catch(() => this.handleDeleteError());
                    })
                break;

            }
        }

        return(
            <div className="profile-page">
                <PageHeader location={this.props.location} routes={typeof newRoutes !== 'undefined' ? newRoutes : null} title={t('auth.openid-configurations')} icon={<FontAwesomeIcon icon={faShieldKeyhole} />} />
                <Row>
                    <Col sm={{ size: 10, order: 3, offset: 1 }}>
                        <DataTable
                            id="oidcs"
                            data={oidc_configs}
                            columns={tableColumns}
                            actions={actions}
                            onAction={onAction}
                            mainId="oidc_id"
                            add={{
                                name: t('auth.add-config'),
                                action: '/createoidc'
                            }}
                        />
                    </Col>
                </Row>

                <ConfirmAction
                    confirmationDetails={{
                        action: null,
                        details: {
                            title: t('auth.delete-oidc-config'),
                            text: t('auth.are-you-sure-you-want-to-delet'),
                            iconBg: 'tw-bg-pink-700 tw-text-white',
                            icon: <FontAwesomeIcon icon={faTrash} />,
                            confirmBg: 'tw-bg-pink-700',
                            confirmText: t('buttons.Delete'),

                        }
                    }}
                    open={this.state.modal}
                    externalClose={true}
                    setOpen={this.cancelDelete}
                    onAction={this.deleteOidcAction}
                />

            </div>
        );
    }

}
const OidcConfigTranslated = withTranslation('common')(OidcConfig)
export default connect(state => ({
        oidc_configs: state.oidc.oidc_configs || [],
        getOidcLoading: state.oidc.getOidcLoading || false,
        getOidcErrorMessage: state.oidc.getOidcErrorMessage || false,
        getOidcError: state.oidc.getOidcError || null,
        deleteOidcErrorMessage: state.oidc.deleteOidcErrorMessage || null,
        deleteOidcError: state.oidc.deleteOidcError || null,
        deletedOidc: state.oidc.deletedOidc || null,
        deleteOidcLoading: state.oidc.deleteOidcLoading || null,
        pages : {pageSize : state.oidc.pageSize, pageNo : state.oidc.pageNo},
    }),
    dispatch => ({
        getOidcConfigs: () => dispatch(getOidcConfigs()),
        deleteOidcConfig: (data) => dispatch(deleteOidcConfig(data)),
        setPageInfo : (data)=> dispatch(setOidcPageInfo(data)),

    }))(OidcConfigTranslated);
