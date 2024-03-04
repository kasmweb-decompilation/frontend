import React,{ Component } from "react";
import { connect } from "react-redux";
import { getImages, deleteImages,setImagesPageInfo, updateImages } from "../../actions/actionImage";
import { Link } from "react-router-dom";
import { Row, Col } from "reactstrap";
import { NotificationManager } from "react-notifications";
import LoadingSpinner from "../../components/LoadingSpinner/index";

import Proptypes from "prop-types";
import DataTable from "../../components/Table/Table"
import {withTranslation, Trans} from "react-i18next";
import { ImageColumn, StandardColumn, DescriptionColumn, ToggleColumn, ConfirmAction } from "../../components/Table/NewTable";
import { bytesToSize } from"../../utils/helpers"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBoxesStacked } from '@fortawesome/free-solid-svg-icons/faBoxesStacked';
import { faClone } from '@fortawesome/free-solid-svg-icons/faClone';
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';
import PageHeader from "../../components/Header/PageHeader";
import { notifySuccess, notifyFailure } from "../../components/Form"
import { hasAuth } from "../../utils/axios";

class Images extends Component{
    constructor(props){
        super(props);

        this.state = {
            modal: false,
            pages: 1,
            imageId: null,
        };

        this.deleteConfirm = this.deleteConfirm.bind(this);
        this.deleteImageAction = this.deleteImageAction.bind(this);
        this.handleDeleteSuccess = this.handleDeleteSuccess.bind(this);
        this.handleDeleteError = this.handleDeleteError.bind(this);
        this.cancelDelete = this.cancelDelete.bind(this);
    }

    componentDidMount() {
        this.props.getImages();
    }

    deleteConfirm(imageId){
        this.setState({modal: !this.state.modal,
            imageId: imageId});
    }

    cancelDelete(){
        this.setState({modal: !this.state.modal}); 
    }

    deleteImageAction(){
        this.props.deleteImages(this.state.imageId).
            then(() => this.handleDeleteSuccess()).
            catch(() => this.handleDeleteError());
    }	

    handleDeleteSuccess(){
        const {deleteImageErrorMessage, t} = this.props;
        this.setState({modal: false});
        if(deleteImageErrorMessage) {
            NotificationManager.error(deleteImageErrorMessage,t('workspaces.delete-workspace-failed'), 3000);
        }else{
            NotificationManager.success(t('workspaces.successfully-deleted-workspace'),t('workspaces.delete-workspace'), 3000);
            this.props.getImages();
        }
    }

    handleDeleteError(){
        const {deleteImageError, t} = this.props;
        this.setState({modal: false});
        if(deleteImageError){
            NotificationManager.error(deleteImageError,t('workspaces.failed-to-delete-workspace'), 3000);
            this.props.history.push("/workspaces");
        }else{
            NotificationManager.error(t('workspaces.failed-to-delete-workspace'),t('workspaces.delete-workspace'), 3000);
            this.props.history.push("/workspaces");
        }
    }

    render(){
        if (this.props.getImagesLoading){
            return (<div> <LoadingSpinner /></div>);
        }

        const { images, t } = this.props;

        const tableColumns = [
            {
                type: "text",
                name: t('workspaces.name'),
                accessor: "friendly_name",
                filterable: true,
                sortable: true,
                overwrite: true,
                cell: (data) => <ImageColumn key={'friendly_name' + data.original.image_id} image={<img className="tw-w-16" src={data.original.image_src || 'img/favicon.png'} onError={(e) => e.target.src = "img/favicon.png"} />} main={data.value} sub={data.original.image_type.toLowerCase() === 'container' ? data.original.name : data.original.image_type } first={true}></ImageColumn>
            },
            {
                type: "flag",
                name: t('workspaces.Enabled'),
                accessor: "enabled",
                filterable: true,
                sortable: true,
                overwrite: true,
                cell: (data) => <ToggleColumn key={'enabled-' + data.original.image_id} id="image_id" column="Enabled" data={data} onChange={(e) => onAction('toggle', { id: 'enabled', data: data.original } )}/>
            },
            {
                type: "text",
                name: t('workspaces.server'),
                accessor: "server.hostname",
                filterable: true,
                sortable: true
            },
            {
                type: "text",
                name: t('workspaces.pool'),
                accessor: "server_pool.server_pool_name",
                filterable: true,
                sortable: true
            },
            {
                accessor: "available",
                name: t("workspaces.available"),
                filterable: true,
                sortable: true,
                showByDefault: false
            },
            {
                accessor: "cores",
                name: t("workspaces.cores"),
                filterable: true,
                sortable: true,
                showByDefault: false
            },
            {
                accessor: "cpu_allocation_method",
                name: t("workspaces.cpu-allocation-method"),
                filterable: true,
                sortable: true,
                showByDefault: false
            },
            {
                accessor: "default_category",
                name: t("workspaces.default-category"),
                filterable: true,
                sortable: true,
                showByDefault: false
            },
            {
                accessor: "description",
                name: t("workspaces.description"),
                filterable: true,
                sortable: true,
                showByDefault: false,
                colSize: 'minmax(200px,2fr) ',
                overwrite: true,
                cell: (data) => <DescriptionColumn key={'description' + data.original.image_id} main={data.value} />
            },
            {
                accessor: "name",
                name: t("workspaces.docker-image"),
                colSize: 'minmax(200px,2fr) ',
                showByDefault: false
            },
            {
                accessor: "docker_registry",
                name: t("workspaces.docker-registry"),
                filterable: true,
                sortable: true,
                showByDefault: false
            },
            {
                accessor: "gpu_count",
                name: t("workspaces.gpu-count"),
                filterable: true,
                sortable: true,
                showByDefault: false
            },
            {
                accessor: "hidden",
                name: t("workspaces.hidden"),
                filterable: true,
                sortable: true,
                showByDefault: false
            },
            {
                accessor: "memory",
                name: t("workspaces.memory"),
                filterable: true,
                sortable: true,
                showByDefault: false,
                cell: (data) => <div>{data.value ? bytesToSize(data.value) : "-"}</div>
            },
            {
                accessor: "notes",
                name: t("workspaces.notes"),
                filterable: true,
                sortable: true,
                showByDefault: false,
                colSize: 'minmax(200px,2fr) ',
                overwrite: true,
                cell: (data) => <DescriptionColumn key={'notes' + data.original.image_id} main={data.value} />
            },

        ];

        const actions = [
            { id: "edit", icon: "fa-pencil", description: t('buttons.Edit') },
            { id: "clone", icon: <FontAwesomeIcon icon={faClone} />, description: t('buttons.Clone') },
            { id: "delete", icon: "fa-trash", description: t('buttons.Delete') },
        ];

        const onAction = async(action, item) => {
            switch (action) {
                case "edit":
                    this.props.history.push(`/updateworkspace/${item.image_id}`);
                break;

                case "clone":
                    this.props.history.push(`/cloneworkspace/${item.image_id}`);
                break;

                case "delete":
                    this.deleteConfirm(item.image_id);
                break;
                case "deleteMulti":
                    item.forEach(id => {
                        this.props.deleteImages(id).
                        then(() => this.handleDeleteSuccess()).
                        catch(() => this.handleDeleteError());
                    })
                break;
                case "toggle":
                    const validToggles = ['enabled'];
                    if(validToggles.indexOf(item.id) !== -1) {
                        let workspaceData = {
                            ...item.data
                        }
                        workspaceData[item.id] = !item.data[item.id]; // Toggle the value passed
                        // Remove items in the object that update_image doesn't know how to handle
                        delete workspaceData.imageAttributes;
                        delete workspaceData.persistent_profile_config;
                        delete workspaceData.available;
                        delete workspaceData.zone_name;
                        delete workspaceData.filter_policy_name;
                        delete workspaceData.default_category;
                        delete workspaceData.server;
                        delete workspaceData.server_pool;
                        // convert items in the object to a format update_image can understand
                        workspaceData['volume_mappings'] = item.data['volume_mappings'] ? JSON.stringify(item.data['volume_mappings'], null, 2) : '';
                        workspaceData['run_config'] = item.data['run_config'] ? JSON.stringify(item.data['run_config'], null, 2) : '';
                        workspaceData['exec_config'] = item.data['exec_config'] ? JSON.stringify(item.data['exec_config'], null, 2) : '';
                        workspaceData['launch_config'] = item.data['launch_config'] ? JSON.stringify(item.data['launch_config'], null, 2) : '';
                        workspaceData['categories'] = item.data['categories'] ? item.data['categories'].join('\n') : '';
                        try {
                            const { response: { error_message: errorMessage } } = await this.props.updateImages(workspaceData);
                            notifySuccess({
                                errorMessage,
                                type: 'update'
                            })
                        } catch (error) {
                            notifyFailure({ error, type: 'update' })
                        }

                    }
                break;

            }
        }

        return (
            <div className="profile-page">
                { hasAuth('registries') && <Row className="tw-bg-slate-500 dark:tw-bg-sky-900 tw-text-white">
                    <Col className="tw-flex tw-flex-col lg:tw-flex-row tw-items-center tw-gap-2 tw-justify-between tw-py-2" sm={{ size: 10, order: 3, offset: 1 }}>
                        <p className="tw-mb-0"><Trans i18nKey="workspaces.workspace-registries-description" ns="common">The <Link className="tw-text-white hover:tw-text-blue-300 tw-underline tw-px-1" to={{ pathname: "/registry" }}>Workspace Registry</Link> makes it easy to add workspaces with a few simple clicks. 3rd party registries are also supported.</Trans></p>
                        <Link className="pull-right add-btn" to={{ pathname: "/registry" }}>
                            <button className="tw-rounded tw-w-full tw-h-10 tw-bg-blue-500 hover:tw-bg-slate-600 tw-text-sm tw-text-white tw-shadow tw-flex tw-items-center tw-transition">
                                <span className="tw-h-10 tw-w-12 tw-flex tw-justify-center tw-items-center tw-bg-black/10"><FontAwesomeIcon icon={faBoxesStacked} /></span>
                                <span className="tw-px-4 tw-whitespace-nowrap tw-flex-1">{t('workspaces.workspace-registry')}</span>
                            </button>
                        </Link>
                    </Col>
                </Row>}
                <PageHeader location={this.props.location} routes={typeof newRoutes !== 'undefined' ? newRoutes : null} title={t('workspaces.workspaces')} icon={<FontAwesomeIcon icon={faBoxesStacked} />} />
                <Row>
                    <Col sm={{ size: 10, order: 3, offset: 1 }}>
                                <DataTable
                                    id="images"
                                    data={images}
                                    columns={tableColumns}
                                    actions={actions}
                                    onAction={onAction}
                                    mainId="image_id"
                                    add={{
                                        name: t('workspaces.add-workspace'),
                                        action: '/createworkspace'
                                    }}
                                />
                    </Col>
                </Row>

                <ConfirmAction
                    confirmationDetails={{
                        action: null,
                        details: {
                            title: t('workspaces.delete-workspace'),
                            text: t('workspaces.are-you-sure-you-want-to-delet-1'),
                            iconBg: 'tw-bg-pink-700 tw-text-white',
                            icon: <FontAwesomeIcon icon={faTrash} />,
                            confirmBg: 'tw-bg-pink-700',
                            confirmText: t('buttons.Delete'),

                        }
                    }}
                    open={this.state.modal}
                    externalClose={true}
                    setOpen={this.cancelDelete}
                    onAction={this.deleteImageAction}
                />

            </div>
        );
    }
}

Images.propTypes = {
    getImages: Proptypes.func.isRequired,
    deleteImages: Proptypes.func.isRequired,
    deleteImageErrorMessage: Proptypes.func,
    deleteImageError: Proptypes.func,
    history: Proptypes.object.isRequired,
    images: Proptypes.array,
    createImagesLoading: Proptypes.bool,
    className: Proptypes.func
};

const ImagesTranslated = withTranslation('common')(Images)
export default connect(state => ({
    images: state.images.images || [],
    getImagesLoading: state.images.getImagesLoading || false,
    createImagesLoading: state.images.createImagesLoading || false,
    deleteImageErrorMessage: state.images.deleteImageErrorMessage || null,
    deleteImageLoading: state.images.deleteImageLoading || false,
    deleteImageError: state.images.deleteImageError || null,
    pages : {pageSize : state.images.pageSize, pageNo : state.images.pageNo},

}), 
dispatch => ({
    getImages: () => dispatch(getImages()),
    deleteImages: (data) => dispatch(deleteImages(data)),
    setPageInfo : (data)=> dispatch(setImagesPageInfo(data)),
    updateImages: (data) => dispatch(updateImages(data)),
}))(ImagesTranslated);