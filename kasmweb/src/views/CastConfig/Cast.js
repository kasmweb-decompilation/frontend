import React, { Component} from 'react';
import { connect } from "react-redux";
import { Row, Col } from "reactstrap";
import { NotificationManager } from "react-notifications";
import LoadingSpinner from "../../components/LoadingSpinner/index";
import DataTable from "../../components/Table/Table";
import { Link } from "react-router-dom";
import {getCastConfigs, deleteCastConfig,setCastPageInfo} from "../../actions/actionCast.js"
import {withTranslation} from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRss } from '@fortawesome/pro-light-svg-icons/faRss';
import { faTrash } from '@fortawesome/pro-light-svg-icons/faTrash';
import PageHeader from "../../components/Header/PageHeader";
import { ConfirmAction } from '../../components/Table/NewTable';

class CastConfig extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            filterId: null,
        };

        this.cancelDelete = this.cancelDelete.bind(this);
        this.deleteConfirm = this.deleteConfirm.bind(this);
        this.deleteCastAction = this.deleteCastAction.bind(this);
        this.handleDeleteSuccess = this.handleDeleteSuccess.bind(this);
        this.handleDeleteError = this.handleDeleteError.bind(this);
    }

    componentDidMount() {
        this.props.getCastConfigs();
    }

    deleteConfirm(castConfigId){
        this.setState({modal: !this.state.modal,
            castConfigId: castConfigId});
    }

    cancelDelete(){
        this.setState({modal: !this.state.modal});
    }

    deleteCastAction(){
        this.props.deleteCastConfig(this.state.castConfigId).
        then(() => this.handleDeleteSuccess()).
        catch(() => this.handleDeleteError());
    }

    handleDeleteSuccess(){
        const {deleteCastErrorMessage, t} = this.props;
        this.setState({modal: false});
        if(deleteCastErrorMessage) {
            NotificationManager.error(deleteCastErrorMessage,t("casting.notify-delete-title"), 3000);
        }else{
            NotificationManager.success(t("casting.notify-delete-success"),t("casting.notify-delete-title"), 3000);
            this.props.getCastConfigs();
        }
    }

    handleDeleteError(){
        const {deleteCastError, t} = this.props;
        this.setState({modal: false});
        if(deleteCastError){
            NotificationManager.error(deleteCastError,t("casting.notify-delete-title"), 3000);
            this.props.history.push("/cast");
        }else{
            NotificationManager.error(t("casting.Failed to Delete Casting Config"),t("casting.notify-delete-title"), 3000);
            this.props.history.push("/cast");
        }
    }

    render() {
        if (this.props.getCastLoading) {
            return (<div> <LoadingSpinner /></div>);
        }
        
        const {cast_configs, t} = this.props;

        const tableColumns = [
            {
                type: "text",
                name: t("casting.casting_config_name"),
                accessor: "casting_config_name",
                filterable: true, 
                sortable: true,
                colSize: 'minmax(150px,1.3fr) ',
            },
            {
                type: "text",
                name: t("casting.key"),
                accessor: "key",
                filterable: true,
                sortable: true,
                colSize: 'minmax(200px,2fr) ',
                cell: (data) => <div>{"https://" + window.location.host + "/#/cast/" + data.value}</div>
            },
            {
                type: "text",
                name: t("casting.image_friendly_name"),
                accessor: "image_friendly_name",
                filterable: true,
                sortable: true,
                cell: (data) => (
                    <div>
                        <Link to={"/updateworkspace/" + (data.original && data.original.image_id || '') }>
                            {data.original && data.original.image_friendly_name}
                        </Link>
                    </div>
                ),
            },
            {
                name: t("casting.session_remaining"),
                accessor: "session_remaining",
                filterable: true,
                sortable: true
            },
            {
                type: "flag",
                name: t("casting.allow_anonymous"),
                accessor: "allow_anonymous",
                filterable: true,
                sortable: true
            },
            {
                name: t("casting.allow_kasm_audio"),
                accessor: "allow_kasm_audio",
                filterable: true,
                sortable: true,
                showByDefault: false
            },
            {
                name: t("casting.allow_kasm_clipboard_down"),
                accessor: "allow_kasm_clipboard_down",
                filterable: true,
                sortable: true,
                showByDefault: false
            },
            {
                name: t("casting.allow_kasm_clipboard_up"),
                accessor: "allow_kasm_clipboard_up",
                filterable: true,
                sortable: true,
                showByDefault: false
            },
            {
                name: t("casting.allow_kasm_downloads"),
                accessor: "allow_kasm_downloads",
                filterable: true,
                sortable: true,
                showByDefault: false
            },
            {
                name: t("casting.allow_kasm_gamepad"),
                accessor: "allow_kasm_gamepad",
                filterable: true,
                sortable: true,
                showByDefault: false
            },
            {
                name: t("casting.allow_kasm_microphone"),
                accessor: "allow_kasm_microphone",
                filterable: true,
                sortable: true,
                showByDefault: false
            },
            {
                name: t("casting.allow_kasm_uploads"),
                accessor: "allow_kasm_uploads",
                filterable: true,
                sortable: true,
                showByDefault: false
            },
            {
                name: t("casting.allow_resume"),
                accessor: "allow_resume",
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
                    this.props.history.push(`/updatecast/${item.cast_config_id}`);
                break;

                case "delete":
                    this.deleteConfirm(item.cast_config_id);
                break;
                case "deleteMulti":
                    item.forEach(id => {
                        this.props.deleteCastConfig(id).
                        then(() => this.handleDeleteSuccess()).
                        catch(() => this.handleDeleteError());
                    })
                break;

            }
        }

        return(
            <div className="profile-page">
                <PageHeader location={this.props.location} routes={typeof newRoutes !== 'undefined' ? newRoutes : null} title={t('casting.Session Casting')} icon={<FontAwesomeIcon icon={faRss} rotation={90} />} />
                <Row>
                    <Col sm={{ size: 10, order: 3, offset: 1 }}>
                        <DataTable
                            id="casts"
                            data={cast_configs}
                            columns={tableColumns}
                            actions={actions}
                            onAction={onAction}
                            mainId="cast_config_id"
                            add={{
                                name: t('casting.Add Config'),
                                action: '/createcast'
                            }}
                        />
                    </Col>
                </Row>

                <ConfirmAction
                    confirmationDetails={{
                        action: null,
                        details: {
                            title: t('casting.notify-delete-title'),
                            text: t('casting.confirm_delete'),
                            iconBg: 'tw-bg-pink-700 tw-text-white',
                            icon: <FontAwesomeIcon icon={faTrash} />,
                            confirmBg: 'tw-bg-pink-700',
                            confirmText: t('buttons.Delete'),

                        }
                    }}
                    open={this.state.modal}
                    externalClose={true}
                    setOpen={this.cancelDelete}
                    onAction={this.deleteCastAction}
                />

            </div>
        );
    }

}

const CastConfigTranslated = withTranslation('common')(CastConfig)

export default connect(state => ({
        cast_configs: state.cast.cast_configs || [],
        getCastLoading: state.cast.getCastLoading || false,
        getCastErrorMessage: state.cast.getCastErrorMessage || false,
        getCastError: state.cast.getCastError || null,
        deleteCastErrorMessage: state.cast.deleteCastErrorMessage || null,
        deleteCastError: state.cast.deleteCastError || null,
        deletedCast: state.cast.deletedCast || null,
        deleteCastLoading: state.cast.deleteCastLoading || null,
        pages : {pageSize : state.cast.pageSize, pageNo : state.cast.pageNo},
    }),
    dispatch => ({
        getCastConfigs: () => dispatch(getCastConfigs()),
        deleteCastConfig: (data) => dispatch(deleteCastConfig(data)),
        setPageInfo : (data)=> dispatch(setCastPageInfo(data)),

    }))(CastConfigTranslated);
