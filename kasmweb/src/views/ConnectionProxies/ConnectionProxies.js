import React,{ Component } from "react";
import { connect } from "react-redux";
import { getConnectionProxies, deleteConnectionProxy,setConnectionProxyPageInfo } from "../../actions/actionConnectionProxies";
import { Row, Col } from "reactstrap";
import { NotificationManager } from "react-notifications";
import LoadingSpinner from "../../components/LoadingSpinner/index";

import Proptypes from "prop-types";
import DataTable from "../../components/Table/Table";
import {getLicenses} from "../../actions/actionSystemInfo";
import {withTranslation} from "react-i18next";
import moment from "moment";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlug } from '@fortawesome/pro-light-svg-icons/faPlug';
import { faTrash } from '@fortawesome/pro-light-svg-icons/faTrash';
import PageHeader from "../../components/Header/PageHeader";
import { ConfirmAction } from "../../components/Table/NewTable";

class ConnectionProxies extends Component{
    constructor(props){
        super(props);

        this.state = {
            modal: false,
            pages: 1,
            connection_proxyId: null,
        };

        this.deleteConfirm = this.deleteConfirm.bind(this);
        this.deleteConnectionProxyAction = this.deleteConnectionProxyAction.bind(this);
        this.handleDeleteSuccess = this.handleDeleteSuccess.bind(this);
        this.handleDeleteError = this.handleDeleteError.bind(this);
        this.cancelDelete = this.cancelDelete.bind(this);
    }

    componentDidMount() {
        this.props.getConnectionProxies();
    }

    deleteConfirm(connection_proxyId){
        this.setState({modal: !this.state.modal,
            connection_proxyId: connection_proxyId});
    }

    cancelDelete(){
        this.setState({modal: !this.state.modal}); 
    }

    deleteConnectionProxyAction(){
        this.props.deleteConnectionProxy(this.state.connection_proxyId).
            then(() => this.handleDeleteSuccess()).
            catch(() => this.handleDeleteError());
    }	

    handleDeleteSuccess(){
        const {deleteConnectionProxyErrorMessage, t} = this.props;
        this.setState({modal: false});
        if(deleteConnectionProxyErrorMessage) {
            NotificationManager.error(deleteConnectionProxyErrorMessage,t("connection_proxies.Delete ConnectionProxy Failed"), 3000);
        }else{
            NotificationManager.success(t("connection_proxies.Successfully Deleted ConnectionProxy"),t("connection_proxies.Delete ConnectionProxy"), 3000);
            this.props.getConnectionProxies();
        }
    }

    handleDeleteError(){
        const {deleteConnectionProxyError, t} = this.props;
        this.setState({modal: false});
        if(deleteConnectionProxyError){
            NotificationManager.error(deleteConnectionProxyError,t("connection_proxies.Failed to Delete ConnectionProxy"), 3000);
            this.props.history.push("/connection_proxies");
        }else{
            NotificationManager.error(t("connection_proxies.Failed to Delete ConnectionProxy"),t("connection_proxies.Delete ConnectionProxy"), 3000);
            this.props.history.push("/connection_proxies");
        }
    }

    render(){
        if (this.props.getConnectionProxiesLoading){
            return (<div> <LoadingSpinner /></div>);
        }

        const { connection_proxies, t } = this.props;

        const columns = [
            {
                type: "text",
                name: t("connection_proxies.server_address"),
                accessor: "server_address",
                filterable: true,
                sortable: true
            },
            {
                type: "text",
                name: t("connection_proxies.Zone Name"),
                accessor: "zone_name",
                filterable: false,
                sortable: true
            },
            {
                type: "text",
                name: t("connection_proxies.connection_proxy_type"),
                accessor: "connection_proxy_type",
                filterable: true,
                sortable: true
            },
            {
                name: t("connection_proxies.server_port"),
                accessor: "provider",
                filterable: true,
                sortable: true,
                showByDefault: false
            },
            {
                type: "date",
                name: t("connection_proxies.first-reported"),
                accessor: "first_reported",
                filterable: true,
                sortable: true,
                showByDefault: false,
                cell: (data) => <div>{moment(data.value).isValid() ? moment.utc(data.value).local().format("lll") : "-"}</div>
            },
            {
                type: "date",
                name: t("connection_proxies.last-reported"),
                accessor: "last_reported",
                filterable: true,
                sortable: true,
                showByDefault: false,
                cell: (data) => <div>{moment(data.value).isValid() ? moment.utc(data.value).local().format("lll") : "-"}</div>
            },
    
        ];

        const actions = [
            { id: "edit", icon: "fa-pencil", description: t("buttons.Edit") },
            { id: "delete", icon: "fa-trash", description: t("buttons.Delete") },
        ];

        const onAction = (action, item) => {
            switch (action) {
                case "view":
                    this.props.history.push(`/view_connection_proxy/${item.connection_proxy_id}`);
                break;

                case "edit":
                    this.props.history.push(`/update_connection_proxy/${item.connection_proxy_id}`);
                break;

                case "delete":
                    this.deleteConfirm(item.connection_proxy_id);
                break;
                case "deleteMulti":
                    item.forEach(id => {
                        this.props.deleteConnectionProxy(id).
                        then(() => this.handleDeleteSuccess()).
                        catch(() => this.handleDeleteError());
                    })
                break;

            }
        }
        
        return (
            <div className="profile-page">
                <PageHeader location={this.props.location} routes={typeof newRoutes !== 'undefined' ? newRoutes : null} title={t('connection_proxies.Connection Proxies')} icon={<FontAwesomeIcon icon={faPlug} />} />
                <Row>
                    <Col sm={{ size: 10, order: 3, offset: 1 }}>
                        <DataTable
                            id="connection_proxies"
                            data={connection_proxies}
                            columns={columns}
                            actions={actions}
                            onAction={onAction}
                            mainId="connection_proxy_id"
                            add={{
                                name: t('connection_proxies.Add'),
                                action: '/create_connection_proxy'
                            }}
                        />
                    </Col>
                </Row>

                <ConfirmAction
                    confirmationDetails={{
                        action: null,
                        details: {
                            title: t('connection_proxies.Delete ConnectionProxy'),
                            text: t('connection_proxies.confirm_delete'),
                            iconBg: 'tw-bg-pink-700 tw-text-white',
                            icon: <FontAwesomeIcon icon={faTrash} />,
                            confirmBg: 'tw-bg-pink-700',
                            confirmText: t('buttons.Delete'),

                        }
                    }}
                    open={this.state.modal}
                    externalClose={true}
                    setOpen={this.cancelDelete}
                    onAction={this.deleteConnectionProxyAction}
                />


            </div>
        );
    }
}

ConnectionProxies.propTypes = {
    getConnectionProxies: Proptypes.func.isRequired,
    deleteConnectionProxy: Proptypes.func.isRequired,
    deleteConnectionProxyErrorMessage: Proptypes.func,
    deleteConnectionProxyError: Proptypes.func,
    history: Proptypes.object.isRequired,
    connection_proxies: Proptypes.array,
    createConnectionProxyLoading: Proptypes.bool,
    className: Proptypes.func
};

const ConnectionProxiesTranslated = withTranslation('common')(ConnectionProxies)

export default connect(state => ({
    connection_proxies: state.connection_proxies.connection_proxies || [],
    createConnectionProxyLoading: state.connection_proxies.createConnectionProxyLoading || false,
    deleteConnectionProxyErrorMessage: state.connection_proxies.deleteConnectionProxyErrorMessage || null,
    deleteConnectionProxyLoading: state.connection_proxies.deleteConnectionProxyLoading || false,
    deleteConnectionProxyError: state.connection_proxies.deleteConnectionProxyError || null,
    getConnectionProxiesLoading: state.connection_proxies.getConnectionProxiesLoading || null,
    pages : {pageSize : state.connection_proxies.pageSize, pageNo : state.connection_proxies.pageNo},
}), 
dispatch => ({
    getConnectionProxies: () => dispatch(getConnectionProxies()),
    getLicenses: () => dispatch(getLicenses()),
    deleteConnectionProxy: (data) => dispatch(deleteConnectionProxy(data)),
    setPageInfo : (data)=> dispatch(setConnectionProxyPageInfo(data)),
}))(ConnectionProxiesTranslated);