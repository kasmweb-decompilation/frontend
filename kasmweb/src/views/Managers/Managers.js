import React,{ Component } from "react";
import { connect } from "react-redux";
import { getManagers, deleteManager,setManagerPageInfo } from "../../actions/actionManager";
import { Row, Col } from "reactstrap";
import LoadingSpinner from "../../components/LoadingSpinner/index";
import { NotificationManager } from "react-notifications";

import Proptypes from "prop-types";
import DataTable from "../../components/Table/Table"
import {withTranslation} from "react-i18next";
import { ConfirmAction, StandardColumn } from "../../components/Table/NewTable";
import moment from "moment";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShieldHalved } from '@fortawesome/pro-light-svg-icons/faShieldHalved';
import { faTrash } from '@fortawesome/pro-light-svg-icons/faTrash';
import PageHeader from "../../components/Header/PageHeader";

class Managers extends Component{
    constructor(props) {
        super(props);
                
        this.state = {
            modal: false,
            pages: 1,
            managerId: null,
        };

        this.deleteConfirm = this.deleteConfirm.bind(this);
        this.deleteManagerAction = this.deleteManagerAction.bind(this);
        this.cancelDelete = this.cancelDelete.bind(this);
        this.handleDeleteSuccess = this.handleDeleteSuccess.bind(this);
        this.handleDeleteError = this.handleDeleteError.bind(this);
    }

    componentDidMount(){
        this.props.getManagers();
    }

    deleteConfirm(managerId){
        this.setState({modal: !this.state.modal, managerId: managerId});
    }

    cancelDelete(){
        this.setState({modal: !this.state.modal}); 
    }

    deleteManagerAction(){
        this.props.deleteManager(this.state.managerId).
            then(() => this.handleDeleteSuccess()).
            catch(() => this.handleDeleteError());
    }

    handleDeleteSuccess(){
        const {deleteManagerErrorMessage, t} = this.props;
        this.setState({modal: false});
        if(deleteManagerErrorMessage) {
            NotificationManager.error(deleteManagerErrorMessage,t('managers.delete-manager'), 3000);
        }
        else{
            NotificationManager.success(t('managers.manager-deleted-succ'),t('managers.delete-manager'), 3000);
            this.props.getManagers();
        }
    }

    handleDeleteError(){
        const {deleteManagerError, t} = this.props;
        this.setState({modal: false});
        if(deleteManagerError){
            NotificationManager.error(deleteManagerError,t('managers.delete-manager'), 3000);
        }
        else{
            NotificationManager.error(t('managers.delete-manager-faile'),t('managers.delete-manager'), 3000);
        }
    }

    render(){
        if (this.props.getManagersLoading){
            return (<div> <LoadingSpinner /></div>);
        }
        
        const { managers, t } = this.props;

        const columns = [
            {
                type: "text",
                name: t('managers.manager_hostname'),
                accessor: "manager_hostname",
                filterable: true,
                sortable: true,
                overwrite: true,
                cell: (data) => <StandardColumn key={'manager_hostname' + data.original.manager_id} main={data.value} sub={t('managers.last_reported') + ': ' +  moment.utc(data.original.last_reported).local().fromNow()} first={true}></StandardColumn>
            },
            {
                type: "text",
                name: t('managers.last_reported'),
                accessor: "last_reported_elapsed",
                filterable: false,
                sortable: true,
                showByDefault: false
            },
            {
                type: "text",
                name: t('managers.zone_name'),
                accessor: "zone_name",
                filterable: true,
                sortable: true
            },
            {
                type: "text",
                name: t('zones.primary-manager'),
                accessor: "is_primary",
            },
            {
                name: t('managers.servers'),
                accessor: "servers.length",
                filterable: true,
                sortable: true
            },
            {
                accessor: "manager_version",
                name: t("managers.manager_version"),
                filterable: true,
                sortable: true,
                showByDefault: false
            },
            {
                accessor: "first_reported",
                name: t("managers.first_reported"),
                filterable: true,
                sortable: true,
                showByDefault: false,
                cell: (data) => <div>{moment(data.value).isValid() ? moment.utc(data.value).local().format("lll") : "-"}</div>
            },

        ];

        const actions = [
            { id: "view", icon: "fa-eye", description: t('buttons.View') },
            { id: "delete", icon: "fa-trash", description: t('buttons.Delete') },
        ];

        const onAction = (action, item) => {
            switch (action) {
                case "view":
                    this.props.history.push(`/viewmanager/${item.manager_id}`);
                break;

                case "delete":
                    this.deleteConfirm(item.manager_id);
                break;
                case "deleteMulti":
                    item.forEach(id => {
                        this.props.deleteManager(id).
                        then(() => this.handleDeleteSuccess()).
                        catch(() => this.handleDeleteError());
                    })
                break;

            }
        }

        return (
            <div className="profile-page">
                <PageHeader location={this.props.location} routes={typeof newRoutes !== 'undefined' ? newRoutes : null} title={t('managers.managers')} icon={<FontAwesomeIcon icon={faShieldHalved} />} />
                
                <Row>
                    <Col sm={{ size: 10, order: 3, offset: 1 }}>
                                <DataTable
                                    id="managers"
                                    data={managers}
                                    columns={columns}
                                    actions={actions}
                                    onAction={onAction}
                                    mainId="manager_id"
                                />
                    </Col>
                </Row>

                <ConfirmAction
                    confirmationDetails={{
                        action: null,
                        details: {
                            title: t('managers.delete-manager'),
                            text: t('managers.confirm_delete'),
                            iconBg: 'tw-bg-pink-700 tw-text-white',
                            icon: <FontAwesomeIcon icon={faTrash} />,
                            confirmBg: 'tw-bg-pink-700',
                            confirmText: t('buttons.Delete'),

                        }
                    }}
                    open={this.state.modal}
                    externalClose={true}
                    setOpen={this.cancelDelete}
                    onAction={this.deleteManagerAction}
                />

            </div>
        );
    }
}

Managers.propTypes = {
    getManagers: Proptypes.func.isRequired,
    deleteManager: Proptypes.func.isRequired,
    deleteManagerError: Proptypes.func,
    managers: Proptypes.array,
    getManagersLoading: Proptypes.bool,
    deleteManagerErrorMessage: Proptypes.func,
    className: Proptypes.func
};

const ManagersTranslated = withTranslation('common')(Managers)
export default connect(state => 
    ({
        managers: state.managers.managers || [],
        deleteManagerErrorMessage: state.managers.deleteManagerErrorMessage || null,
        getManagersLoading: state.managers.getManagersLoading || false,
        deleteManagerError: state.managers.deleteManagerError || null,
        pages : {pageSize : state.managers.pageSize, pageNo : state.managers.pageNo},
    }),
dispatch => 
    ({  
        getManagers: () => dispatch(getManagers()),
        deleteManager: (data) => dispatch(deleteManager(data)),
        setPageInfo : (data)=> dispatch(setManagerPageInfo(data)), 
    }))(ManagersTranslated);
