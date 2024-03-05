import React, { Component} from 'react';
import { connect } from "react-redux";
import { Row, Col } from "reactstrap";
import { NotificationManager } from "react-notifications";
import LoadingSpinner from "../../components/LoadingSpinner/index";
import DataTable from "../../components/Table/Table";

import {getUrlFilterPolicies, deleteUrlFilterPolicy,setWebFilterPageInfo} from "../../actions/actionFilters"
import {withTranslation} from "react-i18next";
import { ConfirmAction, DescriptionColumn, StandardColumn } from "../../components/Table/NewTable";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilterList } from '@fortawesome/free-solid-svg-icons/faFilter';
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';
import PageHeader from "../../components/Header/PageHeader";

class UrlFilter extends Component {
    constructor(props) {
        super(props);

        this.state = {
            modal: false,
            filterId: null,
        };

        this.cancelDelete = this.cancelDelete.bind(this);
        this.deleteConfirm = this.deleteConfirm.bind(this);
        this.deleteFilterAction = this.deleteFilterAction.bind(this);
        this.handleDeleteSuccess = this.handleDeleteSuccess.bind(this);
        this.handleDeleteError = this.handleDeleteError.bind(this);
    }

    componentDidMount() {
        this.props.getUrlFilterPolicies();
    }

    deleteConfirm(filterId){
        this.setState({modal: !this.state.modal,
            filterId: filterId});
    }

    cancelDelete(){
        this.setState({modal: !this.state.modal});
    }

    deleteFilterAction(){
        this.props.deleteUrlFilterPolicy(this.state.filterId).
        then(() => this.handleDeleteSuccess()).
        catch(() => this.handleDeleteError());
    }

    handleDeleteSuccess(){
        const {deleteFilterErrorMessage, t} = this.props;
        this.setState({modal: false});
        if(deleteFilterErrorMessage) {
            NotificationManager.error(deleteFilterErrorMessage,t('filter.delete-web-filter-policy-faile'), 3000);
        }else{
            NotificationManager.success(t('filter.successfully-deleted-web-filte'),t('filter.delete-web-filter-policy'), 3000);
            this.props.getUrlFilterPolicies();
        }
    }

    handleDeleteError(){
        const {deleteFilterError, t} = this.props;
        this.setState({modal: false});
        if(deleteFilterError){
            NotificationManager.error(deleteFilterError,t('filter.failed-to-delete-web-filter-po'), 3000);
            this.props.history.push("/webfilter");
        }else{
            NotificationManager.error(t('filter.failed-to-delete-web-filter-po'),t('filter.delete-web-filter-policy'), 3000);
            this.props.history.push("/webfilter");
        }
    }

    render() {
        if (this.props.getFilterLoading) {
            return (<div> <LoadingSpinner /></div>);
        }

        const {filters, t} = this.props;

        const tableColumns = [
            {
                type: "text",
                name: t('filter.name'),
                accessor: "filter_policy_name",
                filterable: true,
                sortable: true,
            },
            {
                type: "text",
                name: t('filter.description'),
                accessor: "filter_policy_descriptions",
                filterable: true,
                sortable: true,
                overwrite: true,
                cell: (data) => <DescriptionColumn key={'filter_policy_descriptions' + data.original.filter_policy_id} main={data.value || '-'} first={false} />
            },
            {
                accessor: "deny_by_default",
                name: t("filter.deny-by-default"),
                filterable: true,
                sortable: true,
                showByDefault: false
            },
            {
                accessor: "disable_logging",
                name: t("filter.disable-logging"),
                filterable: true,
                sortable: true,
                showByDefault: false
            },
            {
                accessor: "enable_categorization",
                name: t("filter.enable-categorization"),
                filterable: true,
                sortable: true,
                showByDefault: false
            },
            {
                accessor: "enable_safe_search",
                name: t("filter.enable-safe-search"),
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
                    this.props.history.push(`/updatefilter/${item.filter_policy_id}`);
                break;

                case "delete":
                    this.deleteConfirm(item.filter_policy_id);
                break;
                case "deleteMulti":
                    item.forEach(id => {
                        this.props.deleteUrlFilterPolicy(id).
                        then(() => this.handleDeleteSuccess()).
                        catch(() => this.handleDeleteError());
                                    })
                break;

            }
        }

        return(
            <div className="profile-page">
                <PageHeader location={this.props.location} routes={typeof newRoutes !== 'undefined' ? newRoutes : null} title={t('filter.web-filter-policies')} icon={<FontAwesomeIcon icon={faFilterList} />} />
                <Row>
                    <Col sm={{ size: 10, order: 3, offset: 1 }}>
                        <DataTable
                            id="webfilters"
                            data={filters}
                            columns={tableColumns}
                            actions={actions}
                            onAction={onAction}
                            mainId="filter_policy_id"
                            add={{
                                name: t('filter.add-policy'),
                                action: '/createfilter'
                            }}
                        />
                    </Col>
                </Row>

                <ConfirmAction
                    confirmationDetails={{
                        action: null,
                        details: {
                            title: t('filter.delete-web-filter-policy'),
                            text: t('filter.are-you-sure-you-want-to-delet'),
                            iconBg: 'tw-bg-pink-700 tw-text-white',
                            icon: <FontAwesomeIcon icon={faTrash} />,
                            confirmBg: 'tw-bg-pink-700',
                            confirmText: t('buttons.Delete'),

                        }
                    }}
                    open={this.state.modal}
                    externalClose={true}
                    setOpen={this.cancelDelete}
                    onAction={this.deleteFilterAction}
                />


            </div>
        );
    }

}
const UrlFilterTranslated = withTranslation('common')(UrlFilter)
export default connect(state => ({
        filters: state.filter.filters || [],
        categories: state.filter.categories || [],
        getFilterLoading: state.filter.getFilterLoading || false,
        getFilterErrorMessage: state.filter.getFilterErrorMessage || false,
        getFilterError: state.filter.getFilterError || null,
        deleteFilterErrorMessage: state.filter.deleteFilterErrorMessage || null,
        deleteFilterError: state.filter.deleteFilterError || null,
        deletedFilter: state.filter.deletedFilter || null,
        deleteFilterLoading: state.filter.deleteFilterLoading || null,
        pages : {pageSize : state.filter.pageSize, pageNo : state.filter.pageNo},
    }),
    dispatch => ({
        getUrlFilterPolicies: () => dispatch(getUrlFilterPolicies()),
        deleteUrlFilterPolicy: (data) => dispatch(deleteUrlFilterPolicy(data)),
       setPageInfo : (data)=> dispatch(setWebFilterPageInfo(data)),

    }))(UrlFilterTranslated);
