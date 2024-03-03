import React, { Component} from 'react';
import { connect } from "react-redux";
import { Row, Col, Input } from "reactstrap";
import { NotificationManager } from "react-notifications";
import LoadingSpinner from "../../components/LoadingSpinner/index";
import DataTable from "../../components/Table/Table";

import {getPhysicalTokens, deletePhysicalToken, setPhysicalTokenPageInfo, assignPhysicalToken, unassignPhysicalToken, uploadPhysicalToken} from "../../actions/actionPhysicalTokens"
import { getAdminUsers } from "../../actions/actionAdminUser";
import Proptypes from "prop-types";
import Select from "react-select";
import { api } from '../../utils/axios';
import {withTranslation} from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsbDrive } from '@fortawesome/pro-light-svg-icons/faUsbDrive';
import { faTrashCan } from '@fortawesome/pro-light-svg-icons/faTrashCan';
import { faUserXmark } from '@fortawesome/pro-light-svg-icons/faUserXmark';
import { faUserPlus } from '@fortawesome/pro-light-svg-icons/faUserPlus';
import { faTrash } from '@fortawesome/pro-light-svg-icons/faTrash';
import PageHeader from "../../components/Header/PageHeader";
import { Button, FormField, Groups } from '../../components/Form/Form';
import { ConfirmAction } from '../../components/Table/NewTable';
import { Modal, ModalFooter } from '../../components/Form/Modal';
import moment from 'moment';

class PhysicalToken extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            unassignModal: false,
            uploadTokenModal: false,
            deleteFileModal: false,
            confirmDeleteFileModal: false,
            filterId: null,
            addUserModal: false,
            addUserId: null,
            selectedFile: null,
            adminUsers: [],
            adminUsersFilter: null,
            adminUsersPage: 0,
        };

        this.cancelDelete = this.cancelDelete.bind(this);
        this.cancelUnassign = this.cancelUnassign.bind(this);
        this.cancelFileDelete = this.cancelFileDelete.bind(this);
        this.deleteConfirm = this.deleteConfirm.bind(this);
        this.unassignConfirm = this.unassignConfirm.bind(this);
        this.deletePhysicalTokenAction = this.deletePhysicalTokenAction.bind(this);
        this.unassignPhysicalTokenAction = this.unassignPhysicalTokenAction.bind(this);
        this.handleDeleteSuccess = this.handleDeleteSuccess.bind(this);
        this.handleDeleteError = this.handleDeleteError.bind(this);
        this.handleUploadSuccess = this.handleUploadSuccess.bind(this);
        this.handleUploadError = this.handleUploadError.bind(this);
        this.handleUpload = this.handleUpload.bind(this);
        this.handleFileDropDown = this.handleFileDropDown.bind(this);
        this.toggleUploadTokenModal = this.toggleUploadTokenModal.bind(this);
        this.toggleDeleteFileModal = this.toggleDeleteFileModal.bind(this);
        this.toggleConfirmDeleteFileModal = this.toggleConfirmDeleteFileModal.bind(this);
        this.toggleModal2 = this.toggleModal2.bind(this);
        this.deleteFileAction = this.deleteFileAction.bind(this);
        this.forceDeleteFileAction = this.forceDeleteFileAction.bind(this);
        
        this.assignUserToken = this.assignUserToken.bind(this);
        this.handleFileDropDown = this.handleFileDropDown.bind(this);
        this.fireDeleteActions = this.fireDeleteActions.bind(this);
        
        this.openUserAddModal = this.openUserAddModal.bind(this);
        this.handleUserDropDown = this.handleUserDropDown.bind(this);
        this.handleAddUserSuccess = this.handleAddUserSuccess.bind(this);
        this.handleAddUserError = this.handleAddUserError.bind(this);
    }

    handleUpload(e) {
        e.preventDefault();
        this.props.uploadPhysicalToken({
            ufile: e.target.ufile.files[0],
            zippw: e.target.zippw.value
        })
        .then(() => this.handleUploadSuccess())
        .catch(() => this.handleUploadError());
    }

    componentDidMount() {
        this.props.getPhysicalTokens();
    }

    deleteConfirm(serial_number){
        this.setState({modal: !this.state.modal,
            serial_number: serial_number});
    }

    unassignConfirm(serial_number){
        this.setState({unassignModal: !this.state.unassignModal,
            serial_number: serial_number});
    }

    cancelDelete(){
        this.setState({modal: !this.state.modal});
    }

    cancelUnassign() {
        this.setState({ unassignModal: !this.state.unassignModal })
    }

    cancelFileDelete() {
        this.setState({ deleteFileModal: !this.state.deleteFileModal })
    }

    handleUploadSuccess(){
        const {uploadPhysicalTokenError, t} = this.props;
        if(uploadPhysicalTokenError) {
            NotificationManager.error(uploadPhysicalTokenError,t('auth.upload-physical-token-failed'), 3000);
        }else{
            NotificationManager.success(t('auth.successfully-uploaded-physical'),t('auth.upload-physical-token-file'), 3000);
            this.setState({uploadTokenModal: false});
            this.props.getPhysicalTokens();
        }
    }

    handleUploadError(){
        const {uploadPhysicalTokenError, t} = this.props;
        if(uploadPhysicalTokenError){
            NotificationManager.error(uploadPhysicalTokenError,t('auth.failed-to-upload-physical-toke'), 3000);
            this.props.history.push("/physical_tokens");
        }else{
            NotificationManager.error(t('auth.failed-to-upload-token'),t('auth.upload-token'), 3000);
            this.props.history.push("/physical_tokens");
        }
    }


    handleDeleteSuccess(){
        const {deletePhysicalTokenErrorMessage, t} = this.props;
        this.setState({modal: false});
        if(deletePhysicalTokenErrorMessage) {
            NotificationManager.error(deletePhysicalTokenErrorMessage,t('auth.delete-physical-token-failed'), 3000);
        }else{
            NotificationManager.success(t('auth.successfully-deleted-physical-'),t('auth.delete-physical-token-config'), 3000);
            this.setState({deleteFileModal: false});
            this.props.getPhysicalTokens();
        }
    }

    handleDeleteError(){
        const {deletePhysicalTokenError, t} = this.props;
        this.setState({modal: false});
        if(deletePhysicalTokenError){
            NotificationManager.error(deletePhysicalTokenError,t('auth.failed-to-delete-physical-toke'), 3000);
            this.props.history.push("/physical_tokens");
        }else{
            NotificationManager.error(t('auth.failed-to-delete-token'),t('auth.delete-token'), 3000);
            this.props.history.push("/physical_tokens");
        }
    }

    unassignPhysicalTokenAction(){
        this.props.unassignPhysicalToken(this.state.serial_number).
        then(() => this.handleUnassignSuccess()).
        catch(() => this.handleUnassignError());
    }

    handleUnassignSuccess(){
        const {unassignPhysicalTokenErrorMessage, t} = this.props;
        if(unassignPhysicalTokenErrorMessage) {
            NotificationManager.error(unassignPhysicalTokenErrorMessage,t('auth.physical-token-failed'), 3000);
        }else{
            NotificationManager.success(t('auth.successfully-unassigned-physic'), t('auth.physical-token-config'), 3000);
            this.setState({unassignModal: false});
            this.props.getPhysicalTokens();
        }
    }

    handleUnassignError(){
        const {unassignPhysicalTokenError, t} = this.props;
        if(unassignPhysicalTokenError){
            NotificationManager.error(unassignPhysicalTokenError,t('auth.physical-token-config'), 3000);
            this.props.history.push("/physical_tokens");
        }else{
            NotificationManager.error(t('auth.failed-to-unassign-physical-to'), t('auth.physical-token-config'), 3000);
            this.props.history.push("/physical_tokens");
        }
    }

    handleAddUserSuccess() {
        const { errorMessageAddUser, t } = this.props;
        if (errorMessageAddUser) {
            NotificationManager.error(errorMessageAddUser, t('auth.assign-token-to-user'), 3000);
        }
        else {
            this.setState({ addUserModal: false });
            NotificationManager.success(t('auth.successfully-assigned-token-to'), t('auth.assign-token-to-user'), 3000);
            this.props.getPhysicalTokens()
        }
    }

    handleAddUserError() {
        const { addUserToTokenError, t } = this.props;
        if (addUserToTokenError) {
            NotificationManager.error(addUserToTokenError, t('auth.assign-token-to-user'), 3000);
        }
        else {
            this.setState({ addUserModal: false });
            NotificationManager.error(t('auth.error-assigning-token-to-user'), t('auth.assign-token-to-user'), 3000);
        }
    }

    handleFileDropDown(value) {
        if (value) {
            this.setState({
                selectedFile: value.seed_filename,
            });
        } else {
            this.setState({
                selectedFile: null,
            });
        }
    }


    handleUserDropDown(value) {
        if (value) {
            this.setState({
                addUserId: value.user_id,
                adminUsers: []
            });

            this.fetchUserAdmins(0, value.username);
        } else {
            this.setState({
                addUserId: null,
                adminUsers: [],
                adminUsersFilter: null,
                adminUsersPage: 0
            });

            this.fetchUserAdmins(0);
        }
    }

    assignUserToken() {
        this.props.assignPhysicalToken({ serial_number: this.state.serial_number, user_id: this.state.addUserId }).
        then(() => this.handleAddUserSuccess()).
        catch(() => this.handleAddUserError());
    }

    deletePhysicalTokenAction(){
        const serial_or_file = { "serial_number": this.state.serial_number }
        this.fireDeleteActions(serial_or_file);
    }

    deleteFileAction() {
        const serial_or_file = { "seed_filename": this.state.selectedFile }
        const assigned_tokens = this.props.physical_tokens.map(item => item.username)
        .filter((value, index, self) => self.indexOf(value) === index) // get list of unique usernames
        .filter(n => n) // remove empty elements

        if (assigned_tokens.length > 0) {
            return this.setState({ confirmDeleteFileModal: true })
        }

        if (assigned_tokens.length === 0) {
            this.fireDeleteActions(serial_or_file)
        }
    }
    forceDeleteFileAction() {
        const serial_or_file = { "seed_filename": this.state.selectedFile }
        this.setState({ confirmDeleteFileModal: false })
        this.fireDeleteActions(serial_or_file)
    }

    fireDeleteActions(serial_or_file) {
        this.props.deletePhysicalToken(serial_or_file).
        then(() => this.handleDeleteSuccess()).
        catch(() => this.handleDeleteError());
    }

    openUserAddModal(serial) {
        this.setState({
            addUserId: null,
            adminUsers: [],
            adminUsersFilter: null,
            adminUsersPage: 0,
            addUserModal: !this.state.addUserModal,
            serial_number: serial
        });

        this.fetchUserAdmins(0);
    }

    toggleModal2() {
        this.setState({ addUserModal: !this.state.addUserModal });
    }
    toggleUploadTokenModal() {
        this.setState({ uploadTokenModal: !this.state.uploadTokenModal });
    }
    toggleDeleteFileModal() {
        this.setState({ deleteFileModal: !this.state.deleteFileModal });
    }

    toggleConfirmDeleteFileModal() {
        this.setState({ confirmDeleteFileModal: !this.state.confirmDeleteFileModal });
    }

    

    async fetchUserAdmins(page, filter = null) {
        const data = {
            page,
            page_size: 5,
            filters: [{
                id: "username",
                value: filter
            }],
            sort_by: "username",
            sort_direction: "asc"
        }

        const { users } = await api.post('admin/get_users', data);

        const allUsers = _(this.state.adminUsers || [])
            .concat(users || [])
            .uniqBy("user_id")
            .value();

        this.setState({
            adminUsers: allUsers,
            adminUsersPage: page,
            adminUsersFilter: filter
        });
    }

    render() {
        if (this.props.getPhysicalTokenLoading) {
            return (<div> <LoadingSpinner /></div>);
        }

        const loadMoreAdminUsers = () => {
            this.fetchUserAdmins(this.state.adminUsersPage + 1, this.state.adminUsersFilter);
        }

        const updateAdminUsersFilter = (value) => {
            if (value) {
                this.setState({
                    adminUsers: []
                });

                this.fetchUserAdmins(0, value);
            }
        }
        const { physical_tokens, t } = this.props;

        const tableColumns = [
            {
                type: "text",
                name: t('auth.serial-name'),
                accessor: "serial_number",
                filterable: true,
                sortable: true,
            },
            {
                type: "text",
                name: t('auth.seed-filename'),
                accessor: "seed_filename",
                filterable: true,
                sortable: true,
            },
            {
                type: "text",
                name: t('auth.date-imported'),
                accessor: "created",
                filterable: true,
                sortable: true,
                cell: (data) => <div>{moment(data.value).isValid() ? moment.utc(data.value).local().format("lll") : "-"}</div>
            },
            {
                type: "text",
                name: t('auth.user'),
                accessor: "username",
                filterable: true,
                sortable: true,
            },
        ];

        const actions = [
            { id: "assign", icon: <FontAwesomeIcon icon={faUserPlus} />, description: t('auth.assign-user') },
            { id: "unassign", icon: <FontAwesomeIcon icon={faUserXmark} />, description: t('auth.unassign-user'), isHidden: (user) => !user.user_id },
            { id: "delete", icon: "fa-trash", description: t('buttons.Delete') },
        ];

        const onAction = (action, item) => {
            switch (action) {
                case "assign":
                    this.openUserAddModal(item.serial_number);
                break;
                case "unassign":
                    this.unassignConfirm(item.serial_number);
                break;
                case "delete":
                    this.deleteConfirm(item.serial_number);
                break;
                case "deleteMulti":
                    item.forEach(id => {
                        const serial_or_file = { "serial_number": id }
                        this.props.deletePhysicalToken(serial_or_file).
                        then(() => this.handleDeleteSuccess()).
                        catch(() => this.handleDeleteError());
                    })
                break;

            }
        }

        return (
            <div className="profile-page">
                <PageHeader location={this.props.location} routes={typeof newRoutes !== 'undefined' ? newRoutes : null} title={t('auth.physical-tokens')} icon={<FontAwesomeIcon icon={faUsbDrive} />} />
                <Row>
                    <Col sm={{ size: 10, order: 3, offset: 1 }}>
                        <DataTable
                            id="physical_tokens"
                            data={physical_tokens}
                            columns={tableColumns}
                            actions={actions}
                            onAction={onAction}
                            mainId="serial_number"
                            add={{
                                name: t('auth.add-config'),
                                onClick: this.toggleUploadTokenModal
                            }}
                            additionalButtons={
                                <Button onClick={this.toggleDeleteFileModal} color="tw-bg-pink-700" icon={<FontAwesomeIcon icon={faTrashCan} />} section="auth" name="delete-seed-series" />
                            }
                        />
                    </Col>
                </Row>

                <ConfirmAction
                    confirmationDetails={{
                        action: null,
                        details: {
                            title: t('auth.delete-seed-series'),
                            text: t('auth.warning-this-action-will-delet'),
                            iconBg: 'tw-bg-pink-700 tw-text-white',
                            icon: <FontAwesomeIcon icon={faTrash} />,
                            confirmBg: 'tw-bg-pink-700',
                            confirmText: t('buttons.continue'),

                        }
                    }}
                    open={this.state.confirmDeleteFileModal}
                    externalClose={true}
                    setOpen={this.toggleConfirmDeleteFileModal}
                    onAction={this.forceDeleteFileAction}
                />

                <Modal
                    icon={<FontAwesomeIcon icon={faTrash} />}
                    iconBg="tw-bg-pink-700 tw-text-white"
                    title="auth.select-a-file-to-delete"
                    contentRaw={
                        <div className='tw-text-left'>
                            <Select
                                id="seed_filename"
                                autoFocus
                                value={this.state.selectedFile}
                                options={[...new Map(this.props.physical_tokens.map(item => [item.seed_filename, item])).values()]}
                                valueKey="seed_filename"
                                labelKey="seed_filename"
                                name="seed_filename"
                                onChange={this.handleFileDropDown}
                            />
                        </div>
                    }
                    open={this.state.deleteFileModal}
                    setOpen={this.cancelFileDelete}
                    modalFooter={<ModalFooter cancel={this.cancelFileDelete} saveName='buttons.Submit' save={this.deleteFileAction} />}
                />

                <Modal
                    icon={<FontAwesomeIcon icon={faUsbDrive} />}
                    iconBg="tw-bg-blue-500 tw-text-white"
                    title="auth.upload-a-token-file"
                    contentRaw={
                        <Groups noPadding section="auth" onSubmit={this.handleUpload} encType="multipart/form-data" className='tw-text-left tw-mt-8'>
                            <FormField label="upload-physical-token-file">
                                <Input type="file" name="ufile" />
                            </FormField>
                            <FormField label="zip-password">
                                <Input
                                    type="password"
                                    name="zippw"
                                    id="zippw"
                                />
                            </FormField>
                            <ModalFooter cancel={this.toggleUploadTokenModal} saveName='buttons.Submit' />
                        </Groups >
                    }
                    open={this.state.uploadTokenModal}
                    setOpen={this.toggleUploadTokenModal}
                />
                <ConfirmAction
                    confirmationDetails={{
                        action: null,
                        details: {
                            title: t('auth.delete-token'),
                            text: t('auth.are-you-sure-you-want-to-delet-0'),
                            iconBg: 'tw-bg-pink-700 tw-text-white',
                            icon: <FontAwesomeIcon icon={faTrash} />,
                            confirmBg: 'tw-bg-pink-700',
                            confirmText: t('buttons.Delete'),

                        }
                    }}
                    open={this.state.modal}
                    externalClose={true}
                    setOpen={this.cancelDelete}
                    onAction={this.deletePhysicalTokenAction}
                />
                <Modal
                    icon={<FontAwesomeIcon icon={faUsbDrive} />}
                    iconBg="tw-bg-blue-500 tw-text-white"
                    title="auth.assign-user"
                    contentRaw={
                        <div className='tw-text-left'>
                            <Select
                                id="state-select"
                                autoFocus
                                value={this.state.addUserId}
                                options={this.state.adminUsers}
                                valueKey="user_id"
                                labelKey="username"
                                name="selected-state"
                                onChange={this.handleUserDropDown}
                                onInputChange={updateAdminUsersFilter}
                                onMenuScrollToBottom={loadMoreAdminUsers}
                            />
                        </div>
                    }
                    open={this.state.addUserModal}
                    setOpen={this.toggleModal2}
                    modalFooter={<ModalFooter cancel={this.toggleModal2} saveName='buttons.Add' save={this.assignUserToken} />}
                />
                <ConfirmAction
                    confirmationDetails={{
                        action: null,
                        details: {
                            title: t('auth.unassign-user'),
                            text: t('auth.are-you-sure-you-want-to-unass'),
                            iconBg: 'tw-bg-pink-700 tw-text-white',
                            icon: <FontAwesomeIcon icon={faUserXmark} />,
                            confirmBg: 'tw-bg-pink-700',
                            confirmText: t('auth.unassign'),

                        }
                    }}
                    open={this.state.unassignModal}
                    externalClose={true}
                    setOpen={this.cancelUnassign}
                    onAction={this.unassignPhysicalTokenAction}
                />

            </div>
        );
    }

}

PhysicalToken.propTypes = {
    unassignPhysicalToken: Proptypes.func.isRequired
};

const PhysicalTokenTranslated = withTranslation('common')(PhysicalToken)
export default connect(state => ({
        physical_tokens: state.physical_tokens.physical_tokens || [],
        getPhysicalTokenLoading: state.physical_tokens.getPhysicalTokenLoading || false,
        getPhysicalTokenErrorMessage: state.physical_tokens.getPhysicalTokenErrorMessage || false,
        getPhysicalTokenError: state.physical_tokens.getPhysicalTokenError || null,
        deletePhysicalTokenErrorMessage: state.physical_tokens.deletePhysicalTokenErrorMessage || null,
        deletePhysicalTokenError: state.physical_tokens.deletePhysicalTokenError || null,
        deletedPhysicalToken: state.physical_tokens.deletedPhysicalToken || null,
        deletePhysicalTokenLoading: state.physical_tokens.deletePhysicalTokenLoading || null,
        unassignPhysicalTokenErrorMessage: state.physical_tokens.unassignPhysicalTokenErrorMessage || null,
        unassignPhysicalTokenError: state.physical_tokens.unassignPhysicalTokenError || null,
        unassignPhysicalTokenLoading: state.physical_tokens.unassignPhysicalTokenLoading || null,
        uploadPhysicalTokenError: state.physical_tokens.uploadPhysicalTokenError || null,
        uploadPhysicalTokenLoading: state.physical_tokens.uploadPhysicalTokenLoading || null,
        
        errorMessageAddUser: state.errorMessageAddUser,
        addUserToTokenError: state.physical_tokens.addUserToTokenError,
        allusers: state.admin.users || [],
        getAdminUsers: () => dispatch(getAdminUsers()),
        pages : {pageSize : state.physical_tokens.pageSize, pageNo : state.physical_tokens.pageNo},
    }),
    dispatch => ({
        getPhysicalTokens: () => dispatch(getPhysicalTokens()),
        uploadPhysicalToken: (data) => dispatch(uploadPhysicalToken(data)),
        deletePhysicalToken: (data) => dispatch(deletePhysicalToken(data)),
        unassignPhysicalToken: (data) => dispatch(unassignPhysicalToken(data)),
        assignPhysicalToken: (data) => dispatch(assignPhysicalToken(data)),
        setPageInfo : (data)=> dispatch(setPhysicalTokenPageInfo(data)),

    }))(PhysicalTokenTranslated);