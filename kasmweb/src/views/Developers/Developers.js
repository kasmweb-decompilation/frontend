import React, { Component} from 'react';
import { connect } from "react-redux";
import { Row, Col } from "reactstrap";
import { NotificationManager } from "react-notifications";
import LoadingSpinner from "../../components/LoadingSpinner/index";
import DataTable from "../../components/Table/Table";
import { ConfirmAction, SettingColumn } from "../../components/Table/NewTable"

import { Link } from "react-router-dom";
import {getApiConfigs, deleteApiKey,setDeveloperPageInfo} from "../../actions/actionDevloper"
import moment from "moment";
import {withTranslation} from "react-i18next";
import { StandardColumn } from "../../components/Table/NewTable";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCodeBranch } from '@fortawesome/pro-light-svg-icons/faCodeBranch';
import { faTrash } from '@fortawesome/pro-light-svg-icons/faTrash';
import PageHeader from "../../components/Header/PageHeader";
import { CopyToClipboard } from "../../components/Form"

class Developers extends Component {
    constructor(props) {
        super(props);

        this.state = {
            modal: false,
            apiId: null,
        };

        this.cancelDelete = this.cancelDelete.bind(this);
        this.deleteConfirm = this.deleteConfirm.bind(this);
        this.deleteApiAction = this.deleteApiAction.bind(this);
        this.handleDeleteSuccess = this.handleDeleteSuccess.bind(this);
        this.handleDeleteError = this.handleDeleteError.bind(this);
    }

    componentDidMount() {
        this.props.getApiConfigs();
    }

    deleteConfirm(apiId){
        this.setState({modal: !this.state.modal,
            apiId: apiId});
    }

    cancelDelete(){
        this.setState({modal: !this.state.modal});
    }

    deleteApiAction(){
        this.props.deleteApiKey(this.state.apiId).
        then(() => this.handleDeleteSuccess()).
        catch(() => this.handleDeleteError());
    }

    handleDeleteSuccess(){
        const {deleteApiErrorMessage, t} = this.props;
        this.setState({modal: false});
        if(deleteApiErrorMessage) {
            NotificationManager.error(deleteApiErrorMessage,t('developers.delete-api-key-failed'), 3000);
        }else{
            NotificationManager.success(t('developers.successfully-deleted-api-key'),t('developers.delete-api-key'), 3000);
            this.props.getApiConfigs();
        }
    }

    handleDeleteError(){
        const {deleteApiError, t} = this.props;
        this.setState({modal: false});
        if(deleteApiError){
            NotificationManager.error(deleteApiError,t('developers.failed-to-delete-api-key'), 3000);
            this.props.history.push("/developers");
        }else{
            NotificationManager.error(t('developers.failed-to-delete-api-key'),t('developers.delete-api-key'), 3000);
            this.props.history.push("/developers");
        }
    }


    render() {
        if (this.props.getAPILoading) {
            return (<div> <LoadingSpinner /></div>);
        }

        const expires = (data) => {
            const now = moment.utc(new Date())
            const check = moment.utc(data.value)
            const diff = check.diff(now, "hours")
            console.log(diff)
            if (diff <= 240 && diff >= 0) {
                return <span class="tw-font-semibold tw-truncate tw-w-full"><div class="tw-rounded tw-text-slate-900 tw-text-center tw-bg-amber-300 dark:tw-bg-amber-300/60 ">{moment(data.value).isValid() ? moment.utc(data.value).local().fromNow() : "-"}</div></span>
            }
            else if (diff < 0) {
                return <span class="tw-font-semibold tw-truncate tw-w-full"><div class="tw-rounded tw-text-white tw-text-center tw-bg-pink-700 dark:tw-bg-pink-700/60">{moment(data.value).isValid() ? moment.utc(data.value).local().fromNow() : "-"}</div></span>
            } else {
                return <div>{moment(data.value).isValid() ? moment.utc(data.value).local().format("lll") : "-"}</div>
            }
        
        }
    

        const {apis, t} = this.props;

        const tableColumns = [
          {
            type: "text",
            name: t('developers.name'),
            accessor: "name",
            overwrite: true,
            cell: (data) => <StandardColumn key={'name' + data.original.api_id} main={data.value} sub={t('developers.created') + ': ' +  moment.utc(data.original.created).local().fromNow()} first={true}></StandardColumn>
          },
          {
            type: "text",
            name: t('developers.api-key'),
            accessor: "api_key",
            cell: (data) => <div>{data.value} <CopyToClipboard className="tw-ml-1" value={data.value} /></div>
          },
          {
            type: "flag",
            name: t('developers.enabled'),
            accessor: "enabled",
            overwrite: true,
            cell: (data) => <SettingColumn key={'enabled' + data.original.api_id} main={data.value} sub={t('developers.enabled')}></SettingColumn>
          },
          {
            type: "flag",
            name: t('developers.read-only'),
            accessor: "read_only",
            overwrite: true,
            cell: (data) => <SettingColumn key={'read_only' + data.original.api_id} main={data.value} sub={t('developers.read-only')}></SettingColumn>
          },
          {
            type: "date",
            name: t('developers.created'),
            accessor: "created",
            showByDefault: false,
            cell: (data) => <div>{moment(data.value).isValid() ? moment.utc(data.value).local().format("lll") : "-"}</div>

          },
          {
            type: "date",
            name: t('developers.last-used'),
            accessor: "last_used",
            cell: (data) => <div>{moment(data.value).isValid() ? moment.utc(data.value).local().fromNow() : "-"}</div>
          },
          {
            type: "date",
            name: t('developers.expires'),
            accessor: "expires",
            cell: (data) => expires(data)
          },
        ];

        const actions = [
            { id: "edit", icon: "fa-pencil", description: t('buttons.Edit') },
            { id: "delete", icon: "fa-trash", description: t('buttons.Delete') },
        ];

        const onAction = (action, item) => {
            switch (action) {
                case "edit":
                    this.props.history.push(`/updateapi/${item.api_id}`);
                break;

                case "delete":
                    this.deleteConfirm(item.api_id);
                break;
                case "deleteMulti":
                    item.forEach(id => {
                        this.props.deleteApiKey(id).
                        then(() => this.handleDeleteSuccess()).
                        catch(() => this.handleDeleteError());
                    })
                break;

            }
        }

        return(
            <div className="profile-page">
                <Row className="tw-bg-slate-500 dark:tw-bg-sky-900 tw-text-white">
                    <Col className="tw-flex tw-items-center tw-gap-2 tw-justify-between tw-py-2" sm={{ size: 10, order: 3, offset: 1 }}>
                    <p className = "tw-m-0">
                            {t('developers.create-api-key-text')} <a href="https://docs.kasmweb.com">docs.kasmweb.com</a>.
                        </p>
                    </Col>
                </Row>

                <PageHeader location={this.props.location} routes={typeof newRoutes !== 'undefined' ? newRoutes : null} title={t('developers.api-keys')} icon={<FontAwesomeIcon icon={faCodeBranch} />} />
                <Row>
                    <Col sm={{ size: 10, order: 3, offset: 1 }}>
                        <DataTable
                            id="developers"
                            data={apis}
                            columns={tableColumns}
                            actions={actions}
                            onAction={onAction}
                            mainId="api_id"
                            add={{
                                name: t('developers.add-api-key'),
                                action: '/createapi'
                            }}
                        />
                    </Col>
                </Row>

                <ConfirmAction
                    confirmationDetails={{
                        action: null,
                        details: {
                            title: t('developers.delete-api-key'),
                            text: t('developers.confirm_delete'),
                            iconBg: 'tw-bg-pink-700 tw-text-white',
                            icon: <FontAwesomeIcon icon={faTrash} />,
                            confirmBg: 'tw-bg-pink-700',
                            confirmText: t('buttons.Delete'),

                        }
                    }}
                    open={this.state.modal}
                    externalClose={true}
                    setOpen={this.cancelDelete}
                    onAction={this.deleteApiAction}
                />

            </div>
        );
    }

}
const DevelopersTranslated = withTranslation('common')(Developers)
export default connect(state => ({
        apis: state.develop.apis || [],
        getAPILoading: state.develop.getAPILoading || false,
        getAPIErrorMessage: state.develop.getAPIErrorMessage || false,
        getAPIError: state.develop.getAPIError || null,
        deleteApiErrorMessage: state.develop.deleteApiErrorMessage || null,
        deleteApiError: state.develop.deleteApiError || null,
        deletedApi: state.develop.deletedApi || null,
        deleteAPILoading: state.develop.deleteAPILoading || null,
        pages : {pageSize : state.develop.pageSize, pageNo : state.develop.pageNo},
    }),
    dispatch => ({
        getApiConfigs: () => dispatch(getApiConfigs()),
        deleteApiKey: (data) => dispatch(deleteApiKey(data)),
        setPageInfo : (data)=> dispatch(setDeveloperPageInfo(data)),
    }))(DevelopersTranslated);