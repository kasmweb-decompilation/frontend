import React,{ Component } from "react";
import { connect } from "react-redux";
import { getZones, deleteZone,setZonePageInfo } from "../../actions/actionZones";
import { Link } from "react-router-dom";
import { Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, Card, CardBody, CardHeader } from "reactstrap";
import { NotificationManager } from "react-notifications";
import LoadingSpinner from "../../components/LoadingSpinner/index";

import Proptypes from "prop-types";
import BreadCrumbCompo from "../../components/Breadcrumb/BreadCrumbCompo";
import DataTable from "../../components/Table/Table";
import {getLicenses} from "../../actions/actionSystemInfo";
import {withTranslation} from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMap } from '@fortawesome/free-solid-svg-icons/faMap';
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';
import PageHeader from "../../components/Header/PageHeader";
import { ConfirmAction } from "../../components/Table/NewTable";

class Zones extends Component{
    constructor(props){
        super(props);

        this.state = {
            modal: false,
            pages: 1,
            zoneId: null,
        };

        this.deleteConfirm = this.deleteConfirm.bind(this);
        this.deleteZoneAction = this.deleteZoneAction.bind(this);
        this.handleDeleteSuccess = this.handleDeleteSuccess.bind(this);
        this.handleDeleteError = this.handleDeleteError.bind(this);
        this.cancelDelete = this.cancelDelete.bind(this);
    }

    componentDidMount() {
        this.props.getZones();
    }

    deleteConfirm(zoneId){
        this.setState({modal: !this.state.modal,
            zoneId: zoneId});
    }

    cancelDelete(){
        this.setState({modal: !this.state.modal}); 
    }

    deleteZoneAction(){
        this.props.deleteZone(this.state.zoneId).
            then(() => this.handleDeleteSuccess()).
            catch(() => this.handleDeleteError());
    }	

    handleDeleteSuccess(){
        const {deleteZoneErrorMessage, t} = this.props;
        this.setState({modal: false});
        if(deleteZoneErrorMessage) {
            NotificationManager.error(deleteZoneErrorMessage,t('zones.delete-zone-failed'), 3000);
        }else{
            NotificationManager.success(t('zones.successfully-deleted-zone'),t('zones.delete-zone'), 3000);
            this.props.getZones();
        }
    }

    handleDeleteError(){
        const {deleteZoneError, t} = this.props;
        this.setState({modal: false});
        if(deleteZoneError){
            NotificationManager.error(deleteZoneError,t('zones.failed-to-delete-zone'), 3000);
            this.props.history.push("/zones");
        }else{
            NotificationManager.error(t('zones.failed-to-delete-zone'),t('zones.delete-zone'), 3000);
            this.props.history.push("/zones");
        }
    }

    render(){
        if (this.props.getZonesLoading){
            return (<div> <LoadingSpinner /></div>);
        }

        const { zones, t } = this.props;

        const columns = [
            {
                type: "text",
                name: t('zones.zone-name'),
                accessor: "zone_name",
                filterable: true,
                sortable: true,
                colSize: 'minmax(130px,2fr) ',
            },
            {
                type: "text",
                name: t('zones.managers'),
                accessor: "managers.length",
                filterable: false,
                sortable: true
            },
            {
                type: "text",
                name: t('zones.agents'),
                accessor: "servers.length",
                filterable: true,
                sortable: true
            },
            {
                type: "text",
                name: t('zones.sessions'),
                accessor: "num_kasms",
                filterable: true,
                sortable: true
            },
            {
                type: "text",
                name: t('zones.cores'),
                accessor: "available_cores",
                filterable: true,
                sortable: true
            },
            {
                type: "text",
                name: t('zones.gpus'),
                accessor: "available_gpus",
                filterable: true,
                sortable: true
            },
            {
                type: "text",
                name: t('zones.memory-gb'),
                accessor: "available_memory",
                filterable: true,
                sortable: true,
                cell: (data) => <div>{(data.value / 1000 / 1000 / 1000).toFixed(1)}</div>
            },
            {
                accessor: "primary_manager.zone_name",
                name: t("zones.primary-manager"),
                filterable: true,
                sortable: true,
                showByDefault: false
            },
            {
                accessor: "allow_origin_domain",
                name: t("zones.allow-origin-domain"),
                filterable: true,
                sortable: true,
                showByDefault: false
            },
            {
                accessor: "upstream_auth_address",
                name: t("zones.upstream-auth-address"),
                filterable: true,
                sortable: true,
                showByDefault: false
            },
            {
                accessor: "proxy_connections",
                name: t("zones.proxy-connections"),
                filterable: true,
                sortable: true,
                showByDefault: false
            },
            {
                accessor: "proxy_hostname",
                name: t("zones.proxy-hostname"),
                filterable: true,
                sortable: true,
                showByDefault: false
            },
            {
                accessor: "proxy_path",
                name: t("zones.proxy-path"),
                filterable: true,
                sortable: true,
                showByDefault: false
            },
            {
                accessor: "proxy_port",
                name: t("zones.proxy-port"),
                filterable: true,
                sortable: true,
                showByDefault: false
            },
            {
                accessor: "load_strategy",
                name: t("zones.load-strategy"),
                filterable: true,
                sortable: true,
                showByDefault: false
            },
            {
                accessor: "prioritize_static_agents",
                name: t("zones.prioritize-static-agents"),
                filterable: true,
                sortable: true,
                showByDefault: false
            },
            {
                accessor: "search_alternate_zones",
                name: t("zones.search-alternate-zones"),
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
                case "view":
                    this.props.history.push(`/viewzone/${item.zone_id}`);
                break;

                case "edit":
                    this.props.history.push(`/updatezone/${item.zone_id}`);
                break;

                case "delete":
                    this.deleteConfirm(item.zone_id);
                break;
                case "deleteMulti":
                    item.forEach(id => {
                        this.props.deleteZone(id).
                        then(() => this.handleDeleteSuccess()).
                        catch(() => this.handleDeleteError());
                    })
                break;

            }
        }
        
        return (
            <div className="profile-page">
                <PageHeader location={this.props.location} routes={typeof newRoutes !== 'undefined' ? newRoutes : null} title={t('zones.deployment-zones')} icon={<FontAwesomeIcon icon={faMap} />} />
                <Row>
                    <Col sm={{ size: 10, order: 3, offset: 1 }}>
                                <DataTable
                                    id="zones"
                                    data={zones}
                                    columns={columns}
                                    actions={actions}
                                    onAction={onAction}
                                    mainId="zone_id"
                                    add={{
                                        name: t('zones.add-zone'),
                                        action: '/createzone'
                                    }}
                                />
                    </Col>
                </Row>

                <ConfirmAction
                    confirmationDetails={{
                        action: null,
                        details: {
                            title: t('zones.delete-zone'),
                            text: t('zones.confirm_delete'),
                            iconBg: 'tw-bg-pink-700 tw-text-white',
                            icon: <FontAwesomeIcon icon={faTrash} />,
                            confirmBg: 'tw-bg-pink-700',
                            confirmText: t('buttons.Delete'),

                        }
                    }}
                    open={this.state.modal}
                    externalClose={true}
                    setOpen={this.cancelDelete}
                    onAction={this.deleteZoneAction}
                />


            </div>
        );
    }
}

Zones.propTypes = {
    getZones: Proptypes.func.isRequired,
    deleteZone: Proptypes.func.isRequired,
    deleteZoneErrorMessage: Proptypes.func,
    deleteZoneError: Proptypes.func,
    history: Proptypes.object.isRequired,
    zones: Proptypes.array,
    createZoneLoading: Proptypes.bool,
    className: Proptypes.func
};

const ZonesTranslated = withTranslation('common')(Zones)
export default connect(state => ({
    zones: state.zones.zones || [],
    createZoneLoading: state.zones.createZoneLoading || false,
    deleteZoneErrorMessage: state.zones.deleteZoneErrorMessage || null,
    deleteZoneLoading: state.zones.deleteZoneLoading || false,
    deleteZoneError: state.zones.deleteZoneError || null,
    getZonesLoading: state.zones.getZonesLoading || null,
    pages : {pageSize : state.zones.pageSize, pageNo : state.zones.pageNo},
}), 
dispatch => ({
    getZones: () => dispatch(getZones()),
    getLicenses: () => dispatch(getLicenses()),
    deleteZone: (data) => dispatch(deleteZone(data)),
    setPageInfo : (data)=> dispatch(setZonePageInfo(data)),
}))(ZonesTranslated);