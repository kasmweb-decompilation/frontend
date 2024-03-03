import React, { Component } from "react";
import { connect } from "react-redux";
import {
    Label, FormGroup, Input
} from "reactstrap";
import {
    getGroups, getUsersGroup, addUserToGroup, deleteUserFromGroup, getSettingsGroup, getGroupPermissions, getAllPermissions, addPermissionsGroup, removeGroupPermissions,
    addSettingsGroup, removeSettingsGroup, getImagesGroup, addImagesGroup,
    removeImagesGroup, getSettingsId, updateSettingsGroup, setGroupUserPageInfo, setGroupSettingPageInfo,
    setGroupImagePageInfo, getAllSSOs, addSsoMappingGroup, getSsoMappingsGroup, deleteSsoMappingGroup,
    updateSsoMappingGroup
} from "../../../actions/actionGroup";
import { getAdminUsers } from "../../../actions/actionAdminUser";
import { getImages } from "../../../actions/actionImage";
import { getUrlFilterPolicies } from "../../../actions/actionFilters";
import { renderField, required, number, positive_float, json, renderCheckbox, renderToggle, renderTextArea } from "../../../utils/formValidations.js";
import { NotificationManager } from "react-notifications";
import Select from "react-select";
import { Field, reduxForm } from "redux-form";
import { withRouter, Link } from "react-router-dom";
import "react-select/dist/react-select.css";
import Proptypes from "prop-types";
import DataTable from "../../../components/Table/Table";
import { DescriptionColumn, SettingColumn, ImageColumn, ConfirmAction } from "../../../components/Table/NewTable";
import { api } from '../../../utils/axios';
import FileMapping from "../../../components/FileMapping/FileMapping";
import _ from "lodash";
import {withTranslation} from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleMinus } from '@fortawesome/pro-light-svg-icons/faCircleMinus';
import { faTrash } from '@fortawesome/pro-light-svg-icons/faTrash';
import { faSliders } from '@fortawesome/pro-light-svg-icons/faSliders';
import { faBoxesStacked } from '@fortawesome/pro-light-svg-icons/faBoxesStacked';
import { faUser } from '@fortawesome/pro-light-svg-icons/faUser';
import StorageProvider from "../../StorageProvider";
import StorageMapping from "../../../components/StorageMapping";
import { Modal, ModalFooter } from "../../../components/Form/Modal"
import { Groups, FormField, ViewField, notifySuccess, notifyFailure } from "../../../components/Form/Form";
import LoadingSpinner from "../../../components/LoadingSpinner";

function getSettingDisplayValue(cellInfo, props) {
    let ret = cellInfo.original.value;
    if (cellInfo.original.value_type === "image") {
        ret = props.images.length > 0 && props.images.find(element => element.image_id === cellInfo.original.value)
            ? props.images.find(element => element.image_id === cellInfo.original.value).image_friendly_name : ""
    }
    else if (cellInfo.original.value_type === "filter_policy") {
        ret = props.filters.length > 0 && props.filters.find(element => element.filter_policy_id === cellInfo.original.value)
            ? props.filters.find(element => element.filter_policy_id === cellInfo.original.value).filter_policy_name : ""
    }
    return ret
}

class ViewGroupFormTemplate extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentGroup: null,
            userModal: false,
            settingModal: false,
            imageModal: false,
            addUserModal: false,
            addImageModal: false,
            addSettingModal: false,
            addPermissionsModal: false,
            updateSettingModal: false,
            groupSettingId: null,
            updateName: null,
            updateType: null,
            updateValue: null,
            userId: null,
            imageId: null,
            groupId: null,
            settingValue: "",
            newValue: "",
            updateUsageInterval: null,
            updateUsageType: null,
            updateUsageHours: null,
            createUsageInterval: "daily",
            createUsageType: "per_user",
            createUsageHours: null,
            addImageId: null,
            addGroupSettingId: null,
            permissionId: null,
            addUserId: null,
            userName: null,
            settings: [],
            users: [],
            images: [],
            adminUsers: [],
            adminUsersFilter: null,
            adminUsersPage: 0,
            ssos: [],
            groupMappings: [],
            updateSsoMappingModal: false,
            deleteSsoMappingModal: false,
            addSsoMappingModal: false,
            triggerOnFetch: false,
            selectedPermissions: []
        };

        this.deleteUserGroupConfirm = this.deleteUserGroupConfirm.bind(this);
        this.deleteUserGroup = this.deleteUserGroup.bind(this);
        this.deleteSettingGroupConfirm = this.deleteSettingGroupConfirm.bind(this);
        this.updateSettingGroupConfirm = this.updateSettingGroupConfirm.bind(this);
        this.deleteSettingGroup = this.deleteSettingGroup.bind(this);
        this.deleteImageGroupConfirm = this.deleteImageGroupConfirm.bind(this);
        this.deleteGroupPermissionsConfirm = this.deleteGroupPermissionsConfirm.bind(this);
        this.deleteImageGroup = this.deleteImageGroup.bind(this);
        this.addUserToGroup = this.addUserToGroup.bind(this);
        this.addPermissionsGroup = this.addPermissionsGroup.bind(this);
        this.removeGroupPermissions = this.removeGroupPermissions.bind(this);
        this.addImagesGroup = this.addImagesGroup.bind(this);
        this.addSettingsGroup = this.addSettingsGroup.bind(this);
        this.updateSettingsGroup = this.updateSettingsGroup.bind(this);
        this.openUserAddModal = this.openUserAddModal.bind(this);
        this.openImageAddModal = this.openImageAddModal.bind(this);
        this.openSettingAddModal = this.openSettingAddModal.bind(this);
        this.openPermissionsAddModal = this.openPermissionsAddModal.bind(this);
        this.toggle = this.toggle.bind(this);
        this.toggleModal2 = this.toggleModal2.bind(this);
        this.toggleSetting = this.toggleSetting.bind(this);
        this.togglePermissions = this.togglePermissions.bind(this);
        this.deleteSetConfirm = this.deleteSetConfirm.bind(this);
        this.openUpdateSettingModal = this.openUpdateSettingModal.bind(this);
        this.toggleImage = this.toggleImage.bind(this);
        this.handleUserDropDown = this.handleUserDropDown.bind(this);
        this.handleImageDropDown = this.handleImageDropDown.bind(this);
        this.handleDefaultImageDropDown = this.handleDefaultImageDropDown.bind(this);
        this.handleDefaultFilterDropDown = this.handleDefaultFilterDropDown.bind(this);
        this.updateDefaultImageDropDown = this.updateDefaultImageDropDown.bind(this);
        this.updateDefaultFilterDropDown = this.updateDefaultFilterDropDown.bind(this);
        this.handleUpdateUsageInterval = this.handleUpdateUsageInterval.bind(this);
        this.handleUpdateUsageType = this.handleUpdateUsageType.bind(this);
        this.handleUpdateUsageHours = this.handleUpdateUsageHours.bind(this);
        this.handleSettingDropDown = this.handleSettingDropDown.bind(this);
        this.handleCreateUsageInterval = this.handleCreateUsageInterval.bind(this);
        this.handleCreateUsageType = this.handleCreateUsageType.bind(this);
        this.handleCreateUsageHours = this.handleCreateUsageHours.bind(this);
        this.handlePermissionDropDown = this.handlePermissionDropDown.bind(this);
        this.handleAddSettingsGroupSuccess = this.handleAddSettingsGroupSuccess.bind(this);
        this.handleAddSettingsGroupError = this.handleAddSettingsGroupError.bind(this);
        this.handleAddImagesGroupSuccess = this.handleAddImagesGroupSuccess.bind(this);
        this.handleAddImagesGroupError = this.handleAddImagesGroupError.bind(this);
        this.handleAddUserSuccess = this.handleAddUserSuccess.bind(this);
        this.handleAddUserError = this.handleAddUserError.bind(this);
        this.handleDeleteSettingSuccess = this.handleDeleteSettingSuccess.bind(this);
        this.handleDeleteSettingError = this.handleDeleteSettingError.bind(this);
        this.handleDeleteUserSuccess = this.handleDeleteUserSuccess.bind(this);
        this.handleDeleteUserError = this.handleDeleteUserError.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.handleBlur2 = this.handleBlur2.bind(this);
        this.handleRadio = this.handleRadio.bind(this);
        this.toggleMappingModal = this.toggleMappingModal.bind(this)
        this.toggleDeleteMappingModal = this.toggleDeleteMappingModal.bind(this);
        this.openSsoMappingAddModal = this.openSsoMappingAddModal.bind(this)
        this.openUpdateSsoMappingModal = this.openUpdateSsoMappingModal.bind(this)
        this.addSsoMappingGroup = this.addSsoMappingGroup.bind(this)
        this.updateSsoMappingGroup = this.updateSsoMappingGroup.bind(this)
        this.deleteSsoMappingGroup = this.deleteSsoMappingGroup.bind(this)
        this.handleAddSsoMappingGroupSuccess = this.handleAddSsoMappingGroupSuccess.bind(this)
        this.handleAddSsoMappingGroupError = this.handleAddSsoMappingGroupError.bind(this)
        this.handleUpdateSsoMappingGroupSuccess = this.handleUpdateSsoMappingGroupSuccess.bind(this)
        this.handleUpdateSsoMappingGroupError = this.handleUpdateSsoMappingGroupError.bind(this)
        this.handleDeleteSsoMappingGroupSuccess = this.handleDeleteSsoMappingGroupSuccess.bind(this)
        this.handleDeleteSsoMappingGroupError = this.handleDeleteSsoMappingGroupError.bind(this)
        this.handleSsoDropDown = this.handleSsoDropDown.bind(this)
        this.handleSsoGlobal = this.handleSsoGlobal.bind(this)
        this.handleSsoGroupAttributes = this.handleSsoGroupAttributes.bind(this)
    }

    componentDidMount() {
        this.props.getGroups();
        this.props.getAllSSOs();
        this.props.getUrlFilterPolicies();
        // this.props.getUsersGroup(this.props.match.params.id, 0, 5);
        this.props.getSettingsGroup(this.props.match.params.id);
        this.props.getGroupPermissions(this.props.match.params.id);
        this.props.getImagesGroup(this.props.match.params.id);
        this.props.getSsoMappingsGroup(this.props.match.params.id);
    }

    deleteUserGroupConfirm(userId, userName) {
        const { t } = this.props;
        this.setState({
            userId: userId,
            userName: userName,

            confirmationOpen: true,
            confirmationDetails: {
                details: {
                    title: t('groups.remove-users', { count: 1 }),
                    text: t('groups.remove-users-desc', { count: 1 }),
                    iconBg: 'tw-bg-pink-700 tw-text-white',
                    icon: <FontAwesomeIcon icon={faCircleMinus} />,
                    confirmBg: 'tw-bg-pink-700',
                    confirmText: t('buttons.remove')
                },
            },
            onAction: this.deleteUserGroup
        })
    }

    async deleteUserGroup() {
        try {
            await this.props.deleteUserFromGroup({
                groupId: this.state.currentGroup.group_id,
                userId: this.state.userId,
            });

            await this.handleDeleteUserSuccess();
            this.setState({ triggerOnFetch: true })

        } catch (e) {
            this.handleDeleteUserError();
        }
    }

    deleteSettingGroupConfirm(groupSettingId) {
        const { t } = this.props;
        this.setState(
            {
                groupSettingId: groupSettingId,

                confirmationOpen: true,
                confirmationDetails: {
                    details: {
                        title: '',
                        text: t('groups.are-you-sure-you-want-delete-this-setting'),
                        iconBg: 'tw-bg-pink-700',
                        icon: <FontAwesomeIcon icon={faTrash} />,
                        confirmBg: 'tw-bg-pink-700',
                        confirmText: t('buttons.remove')
                    },
                },
                onAction: this.deleteSettingGroup
    
            });
    }


    updateSettingGroupConfirm(groupSettingId, name, value, type, description) {
        this.props.initialize({ inputValue: value });
        if (name === "usage_limit") {
            let data = JSON.parse(value);
            this.setState(
                {
                    updateUsageInterval: data.interval,
                    updateUsageType: data.type,
                    updateUsageHours: data.hours
                }
            );
            this.props.initialize({ update_usage_hours: data.hours });

        }
        this.setState(
            {
                updateSettingModal: !this.state.updateSettingModal,
                groupSettingId: groupSettingId,
                updateName: name,
                updateValue: value,
                updateType: type,
                newValue: value,
                description: description,
                radio1: value
            });
    }

    deleteSettingGroup() {
        let data = {};
        data = this.state.groupSettingId;
        this.props.removeSettingsGroup(data).then(() => this.handleDeleteSettingSuccess()).
            catch(() => this.handleDeleteSettingError());
    }

    deleteImageGroupConfirm(imageId) {
        const { t } = this.props;
        this.setState(
            {
                imageId: imageId,

                confirmationOpen: true,
                confirmationDetails: {
                    details: {
                        title: t('groups.remove-images', { count: 1 }),
                        text: t('groups.remove-images-desc', { count: 1 }),
                        iconBg: 'tw-bg-pink-700',
                        icon: <FontAwesomeIcon icon={faCircleMinus} />,
                        confirmBg: 'tw-bg-pink-700',
                        confirmText: t('buttons.remove')
                    },
                },
                onAction: this.deleteImageGroup
    
            });
    }

    deleteGroupPermissionsConfirm(permissionId) {
        const { t } = this.props;
        this.setState(
            {
                permissionId: permissionId,

                confirmationOpen: true,
                confirmationDetails: {
                    details: {
                        title: t('groups.remove-permissions', { count: 1 }),
                        text: t('groups.remove-permissions-desc', { count: 1 }),
                        iconBg: 'tw-bg-pink-700 tw-text-white',
                        icon: <FontAwesomeIcon icon={faCircleMinus} />,
                        confirmBg: 'tw-bg-pink-700',
                        confirmText: t('buttons.remove')
                    },
                },
                onAction: () => this.removeGroupPermissions(permissionId)
    
            });
    }


    deleteImageGroup() {
        let data = {};
        data.imageId = this.state.imageId;
        data.groupId = this.state.currentGroup.group_id;
        this.props.removeImagesGroup(data).then(() => this.handleDeleteImageSuccess()).
            catch(() => this.handleDeleteImageError());
    }

    handleDeleteImageSuccess() {
        const { errorImageMessage, t } = this.props;
        if (errorImageMessage) {
            NotificationManager.error(errorImageMessage, t('groups.delete-image-from-group'), 3000);
        }
        else {
            this.setState({ imageModal: false });
            NotificationManager.success(t('groups.successfully-deleted-workspace-from-group'), t('groups.delete-image-from-group'), 3000);
            this.props.getGroups();
            this.props.getImagesGroup(this.props.match.params.id);
        }
    }

    handleDeleteImageError() {
        const { removeImagesGroupsError, t } = this.props;
        if (removeImagesGroupsError) {
            NotificationManager.error(removeImagesGroupsError, t('groups.delete-image-from-group'), 3000);
        }
        else {
            this.setState({ imageModal: false });
            NotificationManager.error(t('groups.error-deleting-workspace-from-group'), t('groups.delete-image-from-group'), 3000);
            this.props.getGroups();
            this.props.getImagesGroup(this.props.match.params.id);
        }
    }

    handleDeleteSettingSuccess() {
        const { errorMessageRemove, t } = this.props;
        if (errorMessageRemove) {
            NotificationManager.error(errorMessageRemove, t('groups.delete-setting-to-group'), 3000);
            this.props.getGroups();
            this.props.getSettingsGroup(this.props.match.params.id);
        }
        else {
            this.setState({ settingModal: false });
            NotificationManager.success(t('groups.successfully-deleted-setting-from-group'), t('groups.delete-setting-from-group'), 3000);
            this.props.getGroups();
            this.props.getSettingsGroup(this.props.match.params.id);
        }
    }

    handleDeleteSettingError() {
        const { deleteSettingFomGroupGroupsError, t } = this.props;
        if (deleteSettingFomGroupGroupsError) {
            NotificationManager.error(deleteSettingFomGroupGroupsError, t('groups.delete-setting-from-group'), 3000);
            this.props.getGroups();
            this.props.getSettingsGroup(this.props.match.params.id);
        }
        else {
            this.setState({ settingModal: false });
            NotificationManager.error(t('groups.error-deleting-setting-from-group'), t('groups.delete-setting-from-group'), 3000);
            this.props.getGroups();
            this.props.getSettingsGroup(this.props.match.params.id);
        }
    }


    handleDeleteUserSuccess() {
        const { errorMessageDeleteUser, t } = this.props;
        if (errorMessageDeleteUser) {
            NotificationManager.error(errorMessageDeleteUser, t('groups.delete-user-from-group'), 3000);
        }
        else {
            this.setState({ userModal: false });
            NotificationManager.success(t('groups.successfully-deleted-user-from-group'), t('groups.delete-user-from-group'), 3000);
        }
    }

    handleDeleteUserError() {
        const { deleteUserFomGroupGroupsError, t } = this.props;
        if (deleteUserFomGroupGroupsError) {
            NotificationManager.error(deleteUserFomGroupGroupsError, t('groups.delete-user-from-group'), 3000);
        }
        else {
            this.setState({ userModal: false });
            NotificationManager.error(t('groups.error-deleting-user-from-group'), t('groups.delete-user-from-group'), 3000);
        }
    }

    async addUserToGroup() {
        try {
            await this.props.addUserToGroup({
                userId: this.state.addUserId,
                groupId: this.state.currentGroup.group_id,
            });

            await this.handleAddUserSuccess();
            this.setState({ triggerOnFetch: true })
            // await this.props.getUsersGroup(this.props.match.params.id)
        } catch (e) {
            this.handleAddUserError();
        }
    }

    addImagesGroup() {
        let data = {};
        data.imageId = this.state.addImageId;
        data.groupId = this.state.currentGroup.group_id;
        this.props.addImagesGroup(data).then(() => this.handleAddImagesGroupSuccess()).catch(() => this.handleAddImagesGroupError());
    }

    addSettingsGroup() {
        if (this.state.addGroupSettingId == null)
            return
        let data = {};
        data.groupId = this.state.currentGroup.group_id;
        data.groupSettingId = this.state.addGroupSettingId;
        if (this.state.value_type === "usage_limit") {
            let _data = {
                type: this.state.createUsageType,
                hours: parseFloat(this.state.createUsageHours),
                interval: this.state.createUsageInterval
            };
            data.value = JSON.stringify(_data)
        }
        else if (this.state.value_type === "json") {
            data.value = JSON.stringify(JSON.parse(this.state.settingValue), null, 2)
        }
        else {
            data.value = this.state.value_type == "bool" ? this.state.radio1 : this.state.settingValue;
        }

        this.props.addSettingsGroup(data).then(() => this.handleAddSettingsGroupSuccess()).catch(() => this.handleAddSettingsGroupError());
    }

    updateSettingsGroup() {
        let data = {};
        data.groupId = this.state.currentGroup.group_id;
        data.groupSettingId = this.state.groupSettingId;
        if (this.state.updateName === "usage_limit") {
            let _data = {
                type: this.state.updateUsageType,
                hours: parseFloat(this.state.updateUsageHours),
                interval: this.state.updateUsageInterval
            };
            data.value = JSON.stringify(_data)
        }
        else if (this.state.updateType === "json") {
            data.value = JSON.stringify(JSON.parse(this.state.newValue), null, 2)
        }
        else {
            data.value = this.state.updateType == "bool" ? this.state.radio1 : this.state.newValue;
        }

        this.props.updateSettingsGroup(data).then(() => this.handleUpdateSettingsGroupSuccess()).catch(() => this.handleUpdateSettingsGroupError());
    } //

    handleUpdateSettingsGroupSuccess() {
        const { updateSettingsGroupErrorMessage, t } = this.props;
        if (updateSettingsGroupErrorMessage) {
            NotificationManager.error(updateSettingsGroupErrorMessage, t('groups.update-setting-to-group'), 3000);
            this.setState({ updateSettingModal: false, updateType: "" });
            this.props.getGroups();
            this.props.getSettingsGroup(this.props.match.params.id);
        }
        else {
            this.setState({ updateSettingModal: false, updateType: "" });
            NotificationManager.success(t('groups.setting-updated-to-group-successfully'), t('groups.update-setting-to-group'), 3000);
            this.props.getGroups();
            this.props.getSettingsGroup(this.props.match.params.id);
            this.props.initialize({ value: "" });
        }
    }

    handleUpdateSettingsGroupError() {
        const { updateSettingsGroupsError, t } = this.props;
        if (updateSettingsGroupsError) {
            NotificationManager.error(updateSettingsGroupsError, t('groups.update-setting-to-group'), 3000);
        }
        else {
            this.setState({ updateSettingModal: false });
            NotificationManager.error(t('groups.error-in-updating-setting-to-group'), t('groups.update-setting-to-group'), 3000);
            this.props.getGroups();
            this.props.getSettingsGroup(this.props.match.params.id);
        }
    }

    handleAddSettingsGroupSuccess() {
        const { addSettingsGroupErrorMessage, t } = this.props;
        if (addSettingsGroupErrorMessage) {
            NotificationManager.error(addSettingsGroupErrorMessage, t('groups.add-setting-to-group'), 3000);
            this.setState({ addSettingModal: false, addGroupSettingId: null, currentGroup: null, value_type: undefined, description: "" });
            this.props.getGroups();
            this.props.getSettingsGroup(this.props.match.params.id);
        }
        else {
            this.setState({ addSettingModal: false, addGroupSettingId: null, currentGroup: null, value_type: undefined, description: "" });
            NotificationManager.success(t('groups.setting-added-to-group-successfully'), t('groups.add-setting-to-group'), 3000);
            this.props.getGroups();
            this.props.getSettingsGroup(this.props.match.params.id);
            this.props.initialize({ value: "" });
        }
    }

    handleAddSettingsGroupError() {
        const { addSettingsGroupsError, t } = this.props;
        if (addSettingsGroupsError) {
            NotificationManager.error(addSettingsGroupsError, t('groups.add-setting-to-group'), 3000);
        }
        else {
            this.setState({ addSettingModal: false, value_type: "" });
            NotificationManager.error(t('groups.error-in-adding-setting-to-group'), t('groups.add-setting-to-group'), 3000);
            this.props.getGroups();
            this.props.getAllSSOs();
            this.props.getSettingsGroup(this.props.match.params.id);
        }
    }

    async addPermissionsGroup() {
            const permissions = this.state.selectedPermissions.map(param => param.value)
            try {
                await this.props.addPermissionsGroup({
                    permissionIds: permissions,
                    groupId: this.state.currentGroup.group_id,
                });
                this.handleAddPermissionsGroupSuccess()

            } catch (error) {
                this.handleAddPermissionsGroupError(error)
            }
        this.setState({ selectedPermissions: [] })
    }

    async removeGroupPermissions(groupPermissionId) {
        try {
            const { response: { error_message: errorMessage } } = await this.props.removeGroupPermissions({
                groupPermissionId: groupPermissionId,
            });
            notifySuccess({
                errorMessage,
                type: 'delete',
            })
        } catch (error) {
            notifyFailure({
                error,
                type: 'delete',
            })
        }
        this.props.getGroups();
        this.props.getGroupPermissions(this.props.match.params.id);

    }

    handleAddPermissionsGroupSuccess() {
        const { addPermissionsGroupErrorMessage, t } = this.props;
        if (addPermissionsGroupErrorMessage) {
            notifyFailure({ error: { message: addPermissionsGroupErrorMessage }, type: 'create' })
            this.setState({ addPermissionsModal: false, permissionId: null, currentGroup: null, value_type: undefined, description: "" });
            this.props.getGroups();
            this.props.getGroupPermissions(this.props.match.params.id);
        }
        else {
            this.setState({ addPermissionsModal: false, permissionId: null, currentGroup: null, value_type: undefined, description: "" });
            notifySuccess({ errorMessage: false, type: 'create' })
            this.props.getGroups();
            this.props.getGroupPermissions(this.props.match.params.id);
            this.props.initialize({ value: "" });
        }
    }

    handleAddPermissionsGroupError(error) {
        const { addPermissionsGroupsError, t } = this.props;
        if (addPermissionsGroupsError) {
            notifyFailure({ error: { message: addPermissionsGroupsError }, type: 'create' })
        }
        else {
            notifyFailure({ error, type: 'create' })
        }
        this.setState({ addPermissionsModal: false, value_type: "" });
        this.props.getGroupPermissions(this.props.match.params.id);
    }

    handleAddImagesGroupSuccess() {
        const { errorAddImageMessage, t } = this.props;
        if (errorAddImageMessage) {
            NotificationManager.error(errorAddImageMessage, t('groups.add-workspace-to-group'), 3000);
        }
        else {
            NotificationManager.success(t('groups.successfully-added-workspace-to-group'), t('groups.add-workspace-to-group'), 3000);
            this.setState({ addImageModal: false });
            this.props.getGroups();
            this.props.getImagesGroup(this.props.match.params.id);
        }
    }

    handleAddImagesGroupError() {
        const { addImagesGroupsError, t } = this.props;
        if (addImagesGroupsError) {
            NotificationManager.error(addImagesGroupsError, t('groups.add-workspace-to-group'), 3000);
        }
        else {
            NotificationManager.error(t('groups.error-adding-workspace-to-group'), t('groups.add-workspace-to-group'), 3000);
            this.setState({ addImageModal: false });
            this.props.getGroups();
            this.props.getImagesGroup(this.props.match.params.id);
        }
    }

    handleAddUserSuccess() {
        const { errorMessageAddUser, t } = this.props;
        if (errorMessageAddUser) {
            NotificationManager.error(errorMessageAddUser, t('groups.add-user-to-group'), 3000);
        }
        else {
            this.setState({ addUserModal: false });
            NotificationManager.success(t('groups.successfully-added-user-to-group'), t('groups.add-user-to-group'), 3000);
        }
    }

    handleAddUserError() {
        const { addUserToGroupGroupsError, t } = this.props;
        if (addUserToGroupGroupsError) {
            NotificationManager.error(addUserToGroupGroupsError, t('groups.add-user-to-group'), 3000);
        }
        else {
            this.setState({ addUserModal: false });
            NotificationManager.error(t('groups.error-adding-user-to-group'), t('groups.add-user-to-group'), 3000);
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

    handleImageDropDown(value) {
        this.setState({ addImageId: value.image_id });
    }

    handleDefaultImageDropDown(value) {
        this.setState({ settingValue: value.image_id });
    }

    handleDefaultFilterDropDown(value) {
        this.setState({ settingValue: value.filter_policy_id });
    }

    updateDefaultImageDropDown(value) {
        this.setState({ newValue: value.image_id });
    }
    updateDefaultFilterDropDown(value) {
        this.setState({ newValue: value.filter_policy_id });
    }
    handleUpdateUsageInterval(value) {
        this.setState({ updateUsageInterval: value.value });
    }
    handleUpdateUsageType(value) {
        this.setState({ updateUsageType: value.value });
    }
    handleUpdateUsageHours(e) {
        this.setState({ updateUsageHours: e.target.value });
    }
    handleCreateUsageInterval(value) {
        this.setState({ createUsageInterval: value.value });
    }
    handleCreateUsageType(value) {
        this.setState({ createUsageType: value.value });
    }
    handleCreateUsageHours(e) {
        this.setState({ createUsageHours: e.target.value });
    }

    handleSettingDropDown(value) {
        this.setState({ addGroupSettingId: value.group_setting_id, value_type: value.value_type, setting_value: value.value, description: value.description });
    }
    handlePermissionDropDown(permission) {
        this.setState({ selectedPermissions: permission });
    }

    handleRadio(e) {
        this.setState({ radio1: e.target.value });
    }

    openUserAddModal() {
        this.setState({
            addUserId: null,
            adminUsers: [],
            adminUsersFilter: null,
            adminUsersPage: 0,
            addUserModal: !this.state.addUserModal
        });

        this.fetchUserAdmins(0);
    }

    openImageAddModal() {
        this.props.getImages();
        this.setState({ addImageModal: !this.state.addImageModal });
    }

    openSettingAddModal() {
        this.props.getSettingsId();
        this.setState({ addSettingModal: !this.state.addSettingModal });
    }
    openPermissionsAddModal() {
        this.props.getAllPermissions();
        this.setState({ addPermissionsModal: !this.state.addPermissionsModal, description: null });
    }

    togglePermissions() {
        this.setState({ addPermissionsModal: !this.state.addPermissionsModal });
        this.props.initialize({ value: "" });
    }

    openUpdateSettingModal() {
        this.setState({ updateSettingModal: !this.state.updateSettingModal });
    }

    toggle() {
        this.setState({ userModal: !this.state.userModal });
    }

    deleteSetConfirm() {
        this.setState({ settingModal: !this.state.settingModal });
    }

    toggleImage() {
        this.setState({ addImageModal: !this.state.addImageModal });
    }

    toggleModal2() {
        this.setState({ addUserModal: !this.state.addUserModal });
    }

    toggleSetting() {
        this.setState({ addSettingModal: !this.state.addSettingModal });
        this.props.initialize({ value: " " });
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.groups.length > 0) {
            let currentGroup = nextProps.groups.find(group => group.group_id === this.props.match.params.id);
            this.setState({ currentGroup: currentGroup });
        }
    }

    renderUsers() {
        const {t} = this.props;
        const columns = [
            {
                type: "text",
                accessor: "name",
                name: t('groups.user-name'),
                filterable: true,
                sortable: true
            },
        ];

        const actions = [
            { id: "remove", icon: <FontAwesomeIcon icon={faCircleMinus} />, description: t('buttons.remove') },
        ];

        const multiActions = [
            {
                name: t('buttons.remove'),
                action: 'removeMulti',
                confirm: { // If this is set, then a confirmation modal is triggered before the action is done
                    title: t('groups.remove-users', { count: 0 }),
                    text: t('groups.remove-users-desc', { count: 0 }),
                    iconBg: 'tw-bg-pink-700 tw-text-white',
                    icon: <FontAwesomeIcon icon={faCircleMinus} />,
                    confirmBg: 'tw-bg-pink-700',
                    confirmText: t('buttons.remove')
                }
            }
        ]

        const triggerOnFetch = () => {
            const value = _.clone(this.state.triggerOnFetch)
            if (value === true) {
                this.state.triggerOnFetch = false
            }
            return value
        }


        const onAction = async(action, item) => {
            switch (action) {
                case "remove":
                    this.deleteUserGroupConfirm(item.user_id, item.name);
                    break;
                case "removeMulti":
                    const promises = []
                    item.forEach(id => {
                        const promise = this.props.deleteUserFromGroup({
                            groupId: this.props.match.params.id,
                            userId: id
                        }).
                        then(() => this.handleDeleteUserSuccess()).
                        catch(() => this.handleDeleteUserError());
                        promises.push(promise)
                    })
                    await Promise.all(promises)
                    this.setState({ triggerOnFetch: true })

                    break;
    
            }
        }

        const onFetch = async (options) => {
            const page = options.page || 0
            const pageSize = options.pageSize || 20
            const group_id = this.props.match.params.id
            const filters = options.filters
            this.props.getUsersGroup(group_id, page, pageSize, filters)
        }

        return (
            <div>
                <DataTable
                    id="group-users"
                    data={this.props.users}
                    total={this.props.total}
                    columns={columns}
                    actions={actions}
                    multiActions={multiActions}
                    onAction={onAction}
                    onFetch={onFetch}
                    triggerOnFetch={triggerOnFetch()}
                    nameField="username"
                    mainId="user_id"
                    search="name"
                    add={{
                        name: t('users.Add User'),
                        onClick: this.openUserAddModal
                    }}

                />
            </div>
        );
    }

    renderSettings() {
        const {t} = this.props;
        const columns = [
            {
                type: "text",
                accessor: "name",
                name: t('groups.name'),
                filterable: true,
                sortable: true,
                showBoolValue: 'value'
            },
            {
                type: "text",
                accessor: "value",
                name: t('groups.value'),
                filterable: true,
                sortable: true,
                overwrite: true,
                cell: (data) => <SettingColumn key={'value-' + data.original.group_setting_id} main={data.value} sub={data.colName} />
            },
            {
                type: "text",
                accessor: "description",
                name: t('groups.description'),
                filterable: true,
                sortable: true,
                overwrite: true,
                cell: (data) => <DescriptionColumn key={'description-' + data.original.group_setting_id} main={data.value} />
            },

        ];

        const actions = [
            { id: "edit", icon: "fa-pencil", description: t('buttons.Edit') },
            { id: "delete", icon: "fa-trash", description: t('buttons.Delete') },
        ];

        const onAction = (action, item) => {
            switch (action) {
                case "edit":
                    this.updateSettingGroupConfirm(
                        item.group_setting_id,
                        item.name,
                        item.value,
                        item.value_type,
                        item.description
                    );
                    break;

                case "delete":
                    this.deleteSettingGroupConfirm(item.group_setting_id);
                    break;
                case "deleteMulti":
                    item.forEach(id => {
                        this.props.removeSettingsGroup(id)
                        .then(() => this.handleDeleteSettingSuccess()).
                        catch(() => this.handleDeleteSettingError());
                    })
                    break;
    
            }
        }

        return (
            <div>
                <DataTable
                    id="group-settings"
                    data={this.props.settings}
                    columns={columns}
                    actions={actions}
                    onAction={onAction}
                    mainId="group_setting_id"
                    add={{
                        name: t('groups.add-settings'),
                        onClick: this.openSettingAddModal
                    }}
                />
            </div>
        );
    }

    renderPermissions() {
        const {t} = this.props;
        const columns = [
            {
                type: "text",
                accessor: "permission_name",
                name: t('groups.name'),
            },
            {
                type: "text",
                accessor: "permission_description",
                name: t('groups.description'),
                overwrite: true,
                cell: (data) => <DescriptionColumn key={'description-' + data.original.group_setting_id} main={data.value} />
            },
            {
                type: "number",
                accessor: "permission_id",
                name: t('groups.permission-id'),
                showByDefault: false,
            },

        ];

        const actions = [
            { id: "delete", icon: "fa-trash", description: t('buttons.Delete') },
        ];

        const onAction = (action, item) => {
            switch (action) {
                case "delete":
                    this.deleteGroupPermissionsConfirm(item.group_permission_id);
                    break;
                case "deleteMulti":
                    item.forEach(id => {
                        this.removeGroupPermissions(id)
                    })
                    break;
    
            }
        }

        if (this.props.getPermissionsLoading){
            return (<div> <LoadingSpinner /></div>);
        }


        return (
            <div>
                <DataTable
                    id="group-permissions"
                    data={this.props.permissions}
                    columns={columns}
                    actions={actions}
                    onAction={onAction}
                    mainId="group_permission_id"
                    add={{
                        name: t('groups.add-permissions'),
                        onClick: this.openPermissionsAddModal
                    }}
                />
            </div>
        );
    }

    renderImages() {
        const {t} = this.props;
        const columns = [
            {
                type: "text",
                name: t('workspaces.name'),
                accessor: "image_friendly_name",
                filterable: true,
                sortable: true,
                overwrite: true,
                cell: (data) => <ImageColumn key={'image_friendly_name' + data.original.image_id} image={<img className="tw-w-16" src={data.original.image_src || 'img/favicon.png'} onError={(e) => e.target.src = "img/favicon.png"} />} main={data.value} sub={data.original.image_name || "-" } first={true}></ImageColumn>
            },

        ];

        const actions = [
            { id: "delete", icon: <FontAwesomeIcon icon={faCircleMinus} />, description: t('buttons.remove') },
        ];

        const onAction = (action, item) => {
            switch (action) {
                case "delete":
                    this.deleteImageGroupConfirm(item.image_id);
                    break;
                case "deleteMulti":
                    item.forEach(id => {
                        this.props.removeImagesGroup({
                            imageId: id,
                            groupId: this.props.match.params.id
                        }).
                        then(() => this.handleDeleteImageSuccess()).
                        catch(() => this.handleDeleteImageError());
                    })
                    break;
    
            }
        }

        return (
            <div>
                <DataTable
                    id="group-images"
                    data={this.props.images}
                    columns={columns}
                    actions={actions}
                    onAction={onAction}
                    mainId="image_id"
                    add={{
                        name: t('groups.add-workspaces'),
                        onClick: this.openImageAddModal
                    }}

                    
                />
            </div>
        );
    }

    openSsoMappingAddModal() {
        this.props.getAllSSOs();
        this.setState({
            sso_global: false,
            sso_id: null,
            sso_type: null,
            sso_group_attributes: null,
            addSsoMappingModal: !this.state.addSsoMappingModal,
        });
    }

    toggleMappingModal() {
        this.setState({ addSsoMappingModal: !this.state.addSsoMappingModal });
    }

    addSsoMappingGroup() {
        const {t} = this.props;
        let data = {};
        if (this.state.sso_id === null) {
            NotificationManager.error(t('groups.an-sso-provider-must-be-selected'), t('groups.add-sso-mapping-to-group'), 3000);
            return;
        }

        data.sso_id = this.state.sso_id;
        data.sso_group_attributes = this.state.sso_group_attributes;
        data.apply_to_all_users = this.state.sso_global;
        data.groupId = this.state.currentGroup.group_id;
        this.props.addSsoMappingGroup(data).then(() => this.handleAddSsoMappingGroupSuccess()).catch(() => this.handleAddSsoMappingGroupError());
    }

    handleAddSsoMappingGroupSuccess() {
        const { addSsoMappingMessage, t } = this.props;
        if (addSsoMappingMessage) {
            NotificationManager.error(addSsoMappingMessage, t('groups.add-sso-mapping-to-group'), 3000);
        }
        else {
            NotificationManager.success(t('groups.successfully-added-sso-mapping-to-group'), t('groups.add-sso-mapping-to-group'), 3000);
            this.setState({ addSsoMappingModal: false });
            this.props.getGroups();
            this.props.getAllSSOs();
            this.props.getSsoMappingsGroup(this.props.match.params.id);
        }
    }

    handleAddSsoMappingGroupError() {
        const { addSsoMappingGroupsError, t } = this.props;
        if (addSsoMappingGroupsError) {
            NotificationManager.error(addSsoMappingGroupsError, t('groups.add-sso-to-group-mapping'), 3000);
        }
        else {
            NotificationManager.error(t('groups.error-adding-sso-mapping-to-group'), t('groups.add-sso-to-group-mapping'), 3000);
            this.setState({ addSsoMappingModal: false });
            this.props.getGroups();
            this.props.getAllSSOs();
            this.props.getSsoMappingsGroup(this.props.match.params.id);
        }
    }

    openUpdateSsoMappingModal() {
        this.setState({ updateSsoMappingModal: !this.state.updateSsoMappingModal });
    }

    updateSsoMappingGroupConfirm(sso_group_id, sso_id, sso_type, sso_group_attributes, apply_to_all_users) {
        this.setState(
            {
                updateSsoMappingModal: !this.state.updateSsoMappingModal,
                sso_group_id: sso_group_id,
                sso_id: sso_id,
                sso_type: sso_type,
                sso_group_attributes: sso_group_attributes,
                sso_global: apply_to_all_users,
            });
    }

    updateSsoMappingGroup() {
        let data = {};
        data.sso_group_id = this.state.sso_group_id;
        data.sso_id = this.state.sso_id;
        data.sso_type = this.state.sso_type;
        data.sso_group_attributes = this.state.sso_group_attributes;
        data.apply_to_all_users = this.state.sso_global;

        this.props.updateSsoMappingGroup(data).then(() => this.handleUpdateSsoMappingGroupSuccess()).catch(() => this.handleUpdateSsoMappingGroupError());
    }

    handleUpdateSsoMappingGroupSuccess() {
        const { updateSsoMappingMessage, t } = this.props;
        if (updateSsoMappingMessage) {
            NotificationManager.error(updateSsoMappingMessage, t('groups.update-sso-group-mapping'), 3000);
        }
        else {
            NotificationManager.success(t('groups.successfully-updated-sso-to-group-mapping'), t('groups.update-sso-group-mapping'), 3000);
            this.setState({ updateSsoMappingModal: false });
            this.props.getGroups();
            this.props.getAllSSOs();
            this.props.getSsoMappingsGroup(this.props.match.params.id);
        }
    }

    handleUpdateSsoMappingGroupError() {
        const { updateSsoMappingGroupsError, t } = this.props;
        if (updateSsoMappingGroupsError) {
            NotificationManager.error(updateSsoMappingGroupsError, t('groups.update-sso-group-mapping'), 3000);
        }
        else {
            NotificationManager.error(t('groups.error-updating-sso-to-group-mapping'), t('groups.update-sso-group-mapping'), 3000);
            this.setState({ updateSsoMappingModal: false });
            this.props.getGroups();
            this.props.getAllSSOs();
            this.props.getSsoMappingsGroup(this.props.match.params.id);
        }
    }

    toggleDeleteMappingModal() {
        this.setState({ deleteSsoMappingModal: !this.state.deleteSsoMappingModal });
    }

    deleteSsoMappingGroupConfirm(ssoGroupId) {
        this.setState(
            {
                deleteSsoMappingModal: !this.state.deleteSsoMappingModal,
                ssoGroupId: ssoGroupId,
            });
    }

    deleteSsoMappingGroup() {
        let data = this.state.ssoGroupId;
        this.props.deleteSsoMappingGroup(data).then(() => this.handleDeleteSsoMappingGroupSuccess()).
            catch(() => this.handleDeleteSsoMappingGroupError());
    }

    handleDeleteSsoMappingGroupSuccess() {
        const { deleteSsoMappingMessage, t } = this.props;
        if (deleteSsoMappingMessage) {
            NotificationManager.error(deleteSsoMappingMessage, t('groups.delete-sso-to-group-mapping'), 3000);
        }
        else {
            NotificationManager.success(t('groups.successfully-deleted-sso-to-group-mapping'), t('groups.delete-sso-to-group-mapping'), 3000);
            this.setState({ deleteSsoMappingModal: false });
            this.props.getGroups();
            this.props.getAllSSOs();
            this.props.getSsoMappingsGroup(this.props.match.params.id);
        }
    }

    handleDeleteSsoMappingGroupError() {
        const { deleteSsoMappingGroupsError, t } = this.props;
        if (deleteSsoMappingGroupsError) {
            NotificationManager.error(deleteSsoMappingGroupsError, t('groups.delete-sso-to-group-mapping'), 3000);
        }
        else {
            NotificationManager.error(t('groups.error-deleting-sso-to-group-mapping'), t('groups.delete-sso-to-group-mapping'), 3000);
            this.setState({ deleteSsoMappingModal: false });
            this.props.getGroups();
            this.props.getAllSSOs();
            this.props.getSsoMappingsGroup(this.props.match.params.id);
        }
    }

    handleSsoDropDown(event) {
        this.setState({ sso_id: event.value });
    }

    handleSsoGlobal() {
        this.setState({ sso_global: !this.state.sso_global })
    }

    handleSsoGroupAttributes(value) {
        this.setState({ sso_group_attributes: value.target.value })
    }

    renderGroupMappings() {
        const {t} = this.props;
        const columns = [
            {
                type: "text",
                accessor: "sso_type",
                name: t('groups.sso-type'),
                filterable: true,
                sortable: true,
                cell: (data) => <div>{data.value == 'oidc' ? 'OpenID' : data.value.toUpperCase()}</div>
            },
            {
                type: "text",
                accessor: "sso_name",
                name: t('groups.sso-name'),
                filterable: true,
                sortable: true
            },
            {
                type: "text",
                accessor: "sso_group_attributes",
                name: t('groups.sso-group-attributes'),
                filterable: true,
                sortable: true
            },
            {
                type: "flag",
                accessor: "apply_to_all_users",
                name: t('groups.assign-all-users'),
                filterable: true,
                sortable: true,
                overwrite: true,
                cell: (data) => <SettingColumn key={'enabled-' + data.original.sso_id} main={data.value} sub={data.colName} />
            },
        ];

        const actions = [
            { id: "edit", icon: "fa-pencil", description: t('buttons.Edit') },
            { id: "delete", icon: "fa-trash", description: t('buttons.Delete') },
        ];

        const onAction = (action, item) => {
            switch (action) {
                case "edit":
                    let sso_type = null
                    let sso_id = null
                    if (item.ldap_id) {
                        sso_type = 'ldap'
                        sso_id = item.ldap_id
                    }
                    if (item.saml_id) {
                        sso_type = 'saml'
                        sso_id = item.saml_id
                    }
                    if (item.oidc_id) {
                        sso_type = 'oidc'
                        sso_id = item.oidc_id
                    }
                    this.updateSsoMappingGroupConfirm(
                        item.sso_group_id,
                        sso_id,
                        sso_type,
                        item.sso_group_attributes,
                        item.apply_to_all_users
                    );
                    break;

                case "delete":
                    this.deleteSsoMappingGroupConfirm(item.sso_group_id);
                    break;
                case "deleteMulti":
                    item.forEach(id => {
                        this.props.deleteSsoMappingGroup(id).
                        then(() => this.handleDeleteSsoMappingGroupSuccess()).
                        catch(() => this.handleDeleteSsoMappingGroupError());
                
                    })
                    break;
    
            }
        }

        return (
            <div>
                <DataTable
                    id="group-sso-mappings"
                    data={this.props.groupMappings}
                    columns={columns}
                    actions={actions}
                    onAction={onAction}
                    mainId="sso_group_id"
                    add={{
                        name: t('groups.add-sso-mapping'),
                        onClick: this.openSsoMappingAddModal
                    }}
                />
            </div>
        );
    }

    handleBlur(e) {
        this.setState({ settingValue: e.target.value });
    }

    handleBlur2(e) {
        this.setState({ newValue: e.target.value });
    }

    async fetchUserAdmins(page, filter = null) {
        const data = {
            page,
            page_size: 10,
            filters: [{
                id: "username",
                value: filter
            },
            {
                id: "exclude_group",
                value: this.props.match.params.id
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
        const { settings, handleSubmit, ssos, t } = this.props;
        const { currentGroup, value_type, description } = this.state;
        const { users } = this.props;
        const { images } = this.props;
        const { groupMappings } = this.props;
        const usage_interval_options = [
            { value: "daily", label: t('groups.daily') },
            { value: "weekly", label: t('groups.weekly') },
            { value: "monthly", label: t('groups.monthly') },
            { value: "total", label: t('groups.total') },

        ];
        const usage_type_options = [
            { value: "per_user", label: t('groups.per-user') },
            { value: "per_group", label: t('groups.per-group') }
        ];

        let allPermissionsOptions = []
        if (this.props.allPermissions.length > 0) {
            allPermissionsOptions = this.props.allPermissions.filter(elem => !this.props.permissions.find(({ permission_id }) => elem.permission_id === permission_id )).sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1).map(permission => ({ value: permission.permission_id, label: permission.friendly_name, description: permission}))
        }
        let optSettings = this.props.allSettings.slice();
        if (this.props.allSettings.length > 0) {
            for (var j = 0; j < this.props.settings.length; j++) {
                for (var i = 0; i < optSettings.length; i++) {
                    if (this.props.settings[j].name === optSettings[i].name) {
                        optSettings.splice(i, 1);
                        break;
                    }
                }
            }
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

        let ssoOptions = [];
        ssos.map(sso => {
            let sso_type = null
            if (sso.sso_type == 'oidc') {
                sso_type = 'OpenID';
            }
            else {
                sso_type = sso.sso_type.toUpperCase()
            }
            ssoOptions.push({ label: sso_type + " - " + sso.name, value: sso.id.replaceAll('-', '') });
        });

        ssoOptions.sort((a, b) => (a.label.toLowerCase() > b.label.toLowerCase()) ? 1 : -1);

        const unaddedImages = _(this.props.allimages)
            .reject(image => _.some(images, (groupImage) => groupImage.image_id === image.image_id))
            .orderBy(image => image.friendly_name.toLowerCase(), "asc")
            .value();

        const ssoFields = (props) => {
            const { section, disabled = false } = props
            return (
                <React.Fragment>
                    <FormField section={section} label="sso-provider">
                        <Select id="sso_id"
                            name="sso_id"
                            clearable={false}
                            autoFocus
                            searchable={false}
                            placeholder={t('groups.please-select-a-sso-to-map-to-this-group')}
                            value={this.state.sso_id}
                            options={ssoOptions}
                            validate={required} required
                            onChange={this.handleSsoDropDown}
                            disabled={disabled}
                        />
                    </FormField>
                    <FormField section={section} label="assign-all-users" tooltip="all-users-that-authenticate">
                        <Field name="sso_global"
                            id="sso_global"
                            type="checkbox"
                            checked={this.state.sso_global}
                            value={this.state.sso_global}
                            onChange={this.handleSsoGlobal}
                            component={renderToggle}
                        />
                    </FormField>
                    {!this.state.sso_global && 
                    <FormField section={section} label="group-attributes" tooltip="only-users-that-match">
                        <Input type="text"
                            name="sso_group_attributes"
                            id="sso_group_attributes"
                            component={renderField}
                            value={this.state.sso_group_attributes}
                            disabled={this.state.sso_global}
                            onChange={this.handleSsoGroupAttributes}
                            validate={this.state.sso_global ? null : required} required={!this.state.sso_global || false}
                            size="65"
                            placeholder="e.g. admins, users / CN=GroupName,OU=Employees,DC=example,DC=local"
                        />
                    </FormField>
                    }
                </React.Fragment>
            )
        }

        return (
            <div className="profile-page">

                {this.props.currentTab && this.props.currentTab === 'users' && (
                    <React.Fragment>
                        {this.renderUsers()}
                    </React.Fragment>
                )}
                {this.props.currentTab && this.props.currentTab === 'settings' && (
                    <React.Fragment>
                        <p className="tw-bg-slate-500 dark:tw-bg-sky-900 tw-text-white tw-p-4 tw-rounded">
                            {t('groups.group-settings-text')}
                        </p>
                        {this.renderSettings(settings)}
                    </React.Fragment>
                )}
                {this.props.currentTab && this.props.currentTab === 'permissions' && (
                    <React.Fragment>
                        {this.renderPermissions()}
                    </React.Fragment>
                )}
                {this.props.currentTab && this.props.currentTab === 'workspaces' && (
                    <React.Fragment>
                        {this.renderImages(images)}
                    </React.Fragment>
                )}
                {this.props.currentTab && this.props.currentTab === 'sso_group_mappings' && (
                    <React.Fragment>
                        {this.renderGroupMappings(groupMappings)}
                    </React.Fragment>
                )}
                {this.props.currentTab && this.props.currentTab === 'file_mapping' && (
                    <FileMapping type="group_id" group_id={this.props.match.params.id} />
                )}
                {this.props.currentTab && this.props.currentTab === 'storage_mapping' && (
                    <StorageMapping type="group_id" group_id={this.props.match.params.id} />
                )}

                {this.state.confirmationDetails && (
                    <ConfirmAction
                        confirmationDetails={this.state.confirmationDetails}
                        open={this.state.confirmationOpen}
                        setOpen={(value) => { this.setState({ confirmationOpen: value }) }}
                        onAction={this.state.onAction}
                    />

                )}


                <Modal
                    icon={<FontAwesomeIcon icon={faSliders} />}
                    iconBg="tw-bg-blue-500 tw-text-white"
                    title="groups.update-setting"
                    contentRaw={
                        <Groups className="tw-text-left tw-mt-8" noPadding section="groups" onSubmit={handleSubmit(this.updateSettingsGroup)}>
                            <FormField label="setting-name">
                                <ViewField type="text"
                                    name="group_setting"
                                    value={this.state.updateName}
                                    component={renderField}
                                />
                            </FormField>
                            {description ? (
                                <p>{description}</p>
                            ) : ""}

                            <div style={{ "marginTop": "10px" }}>
                                {this.state.updateType === undefined ? ("") : (<Label className="requiredasterisk tw-font-bold">{t('groups.value')} {this.state.updateType === "bool" ? ("") : (<span className="tw-text-xs text-muted-more">({t('groups.Type')}: {this.state.updateType})  </span>)}</Label>)}
                                {(this.state.updateType === "bool") ?
                                    (<div>
                                        <FormGroup check> <Label check> <Input type="radio" name="radio1" checked={this.state.radio1 && this.state.radio1 === "True" ? true : false} value={"True"} onChange={this.handleRadio} />{" "} {t('groups.true')} </Label> </FormGroup>
                                        <FormGroup check> <Label check> <Input type="radio" name="radio1" checked={this.state.radio1 && this.state.radio1 === "False" ? true : false} value={"False"} onChange={this.handleRadio} />{" "} {t('groups.false')} </Label> </FormGroup>
                                    </div>) :
                                    (" ")
                                }
                                {(this.state.updateType === "int") ?
                                    (<Field name="inputValue" type="text" value={this.state.newValue} component={renderField} validate={[required, number]} required placeholder={this.state.updateValue} onChange={this.handleBlur2} />)
                                    : ("")
                                }
                                {(this.state.updateType === "float") ?
                                    (<Field name="inputValue" type="text" value={this.state.newValue} component={renderField} validate={[required, positive_float]} required placeholder={this.state.updateValue} onChange={this.handleBlur2} />)
                                    : ("")
                                }
                                {(this.state.updateType === "usage_limit") ?
                                    (<div>
                                        <div className="group_form_label">Type: </div>
                                        <Select
                                            id="update-usage-type-select"
                                            autoFocus
                                            clearable={false}
                                            value={this.state.updateUsageType}
                                            options={usage_type_options}
                                            name="usage_limit_type"
                                            onChange={this.handleUpdateUsageType}
                                        />
                                        <div className="group_form_label">Interval: </div>
                                        <Select
                                            id="update-usage-interval-select"
                                            autoFocus
                                            clearable={false}
                                            value={this.state.updateUsageInterval}
                                            options={usage_interval_options}
                                            name="usage_limit_interval"
                                            onChange={this.handleUpdateUsageInterval}
                                        />
                                        <div className="group_form_label">Hours: </div>
                                        <Field
                                            name="update_usage_hours"
                                            type="text"
                                            value={this.state.updateUsageHours}
                                            component={renderField}
                                            validate={[required, positive_float]} required
                                            onChange={this.handleUpdateUsageHours}
                                        />
                                    </div>
                                    )
                                    : ("")
                                }
                                {(this.state.updateType === "json") ?
                                    (<Field name="inputValue" value={this.state.newValue} component={renderTextArea} validate={[required, json]} required placeholder={this.state.updateValue} onChange={this.handleBlur2} />)
                                    : ("")
                                }
                                {(this.state.updateType === "string") ?
                                    (<Field name="inputValue" type="text" value={this.state.newValue} component={renderField} validate={[required]} required placeholder={this.state.updateValue} onChange={this.handleBlur2} />)
                                    : ("")
                                }
                                {(this.state.updateType === "image") ?
                                    (<Select
                                        id="state-select"
                                        autoFocus
                                        value={this.state.newValue}
                                        placeholder={this.props.images.find(element => element.image_id === this.state.updateValue)
                                            ? this.props.images.find(element => element.image_id === this.state.updateValue).image_friendly_name : t('groups.no-workspace-selected')}
                                        options={this.props.images.sort((a, b) => (a.image_friendly_name.toLowerCase() > b.image_friendly_name.toLowerCase()) ? 1 : -1)}
                                        valueKey="image_id"
                                        labelKey="image_friendly_name"
                                        name="selected-state"
                                        onChange={this.updateDefaultImageDropDown}
                                    />)
                                    : ("")
                                }
                                {(this.state.updateType === "filter_policy") ?
                                    (
                                        <Select
                                            id="state-select"
                                            autoFocus
                                            value={this.state.newValue}
                                            placeholder={this.props.filters.find(element => element.filter_policy_id === this.state.updateValue)
                                                ? this.props.filters.find(element => element.filter_policy_id === this.state.updateValue).filter_policy_name : t('groups.no-policy-selected')}
                                            options={this.props.filters.sort((a, b) => (a.filter_policy_name.toLowerCase() > b.filter_policy_name.toLowerCase()) ? 1 : -1)}
                                            valueKey="filter_policy_id"
                                            labelKey="filter_policy_name"
                                            name="selected-state"
                                            onChange={this.updateDefaultFilterDropDown}
                                        />)
                                    : ("")
                                }
                            </div>
                            <ModalFooter cancel={this.openUpdateSettingModal} saveName='buttons.Submit' />
                        </Groups>
                    }
                    open={this.state.updateSettingModal}
                    setOpen={this.openUpdateSettingModal}
                />


                <Modal
                    icon={<FontAwesomeIcon icon={faSliders} />}
                    iconBg="tw-bg-blue-500 tw-text-white"
                    title="groups.add-setting"
                    contentRaw={
                        <Groups className="tw-text-left tw-mt-8" noPadding section="groups" onSubmit={handleSubmit(this.addSettingsGroup)}>


                            <FormField label="setting-name">
                                <Select
                                    id="state-select"
                                    autoFocus
                                    value={this.state.addGroupSettingId}
                                    options={optSettings.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1)}
                                    valueKey="group_setting_id"
                                    labelKey="name"
                                    name="selected-state"
                                    onChange={this.handleSettingDropDown}
                                />
                            </FormField>
                            {description ? (
                                <p>{description}</p>

                            ) : ""}
                            <div style={{ "marginTop": "10px" }}>
                                {value_type === undefined ? ("") : (<Label className="requiredasterisk tw-font-bold">{t('groups.value')} {value_type === "bool" ? ("") : (<span className="tw-text-xs text-muted-more">({t('groups.Type')}: {value_type})  </span>)}</Label>)}
                                {(value_type === "bool") ?
                                    (<div>
                                        <FormGroup check> <Label check> <Input type="radio" name="radio1" checked={this.state.radio1 && this.state.radio1 === "True" ? true : false} value={"True"} onChange={this.handleRadio} />{" "} {t('groups.true')} </Label> </FormGroup>
                                        <FormGroup check> <Label check> <Input type="radio" name="radio1" checked={this.state.radio1 && this.state.radio1 === "False" ? true : false} value={"False"} onChange={this.handleRadio} />{" "} {t('groups.false')} </Label> </FormGroup>
                                    </div>) :
                                    (" ")
                                }
                                {(value_type === "int") ?
                                    (<Field name="inputValue" type="text" value={this.state.settingValue} component={renderField} validate={[required, number]} required placeholder={value_type} onChange={this.handleBlur} />)
                                    : ("")
                                }
                                {(value_type === "float") ?
                                    (<Field name="inputValue" type="text" value={this.state.settingValue} component={renderField} validate={[required, positive_float]} required placeholder={value_type} onChange={this.handleBlur} />)
                                    : ("")
                                }
                                {(value_type === "usage_limit") ?
                                    (<div>
                                        <div className="group_form_label">Type: </div>
                                        <Select
                                            id="update-usage-type-select"
                                            autoFocus
                                            clearable={false}
                                            value={this.state.createUsageType}
                                            options={usage_type_options}
                                            name="usage_limit_type"
                                            onChange={this.handleCreateUsageType}
                                        />
                                        <div className="group_form_label">Interval: </div>
                                        <Select
                                            id="update-usage-interval-select"
                                            autoFocus
                                            clearable={false}
                                            value={this.state.createUsageInterval}
                                            options={usage_interval_options}
                                            name="usage_limit_interval"
                                            onChange={this.handleCreateUsageInterval}
                                        />
                                        <div className="group_form_label">Hours: </div>
                                        <Field
                                            name="update_usage_hours"
                                            type="text"
                                            value={this.state.createUsageHours}
                                            component={renderField}
                                            validate={[required, positive_float]} required
                                            onChange={this.handleCreateUsageHours}
                                        />
                                    </div>
                                    )
                                    : ("")
                                }
                                {(value_type === "json") ?
                                    (<Field name="inputValue" value={this.state.settingValue} component={renderTextArea} validate={[required, json]} required placeholder={value_type} onChange={this.handleBlur} />)
                                    : ("")
                                }
                                {(value_type === "string") ?
                                    (<Field name="inputValue" type="text" value={this.state.settingValue} component={renderField} validate={[required]} required placeholder={value_type} onChange={this.handleBlur} />)
                                    : ("")
                                }
                                {(value_type === "image") ?
                                    (<Select
                                        id="state-select"
                                        autoFocus
                                        value={this.state.settingValue}
                                        options={this.props.images.sort((a, b) => (a.image_friendly_name.toLowerCase() > b.image_friendly_name.toLowerCase()) ? 1 : -1)}
                                        valueKey="image_id"
                                        labelKey="image_friendly_name"
                                        name="selected-state"
                                        onChange={this.handleDefaultImageDropDown}
                                    />)
                                    : ("")
                                }
                                {(value_type === "filter_policy") ?
                                    (
                                        <Select
                                            id="state-select"
                                            autoFocus
                                            value={this.state.settingValue}
                                            options={this.props.filters.sort((a, b) => (a.filter_policy_name.toLowerCase() > b.filter_policy_name.toLowerCase()) ? 1 : -1)}
                                            valueKey="filter_policy_id"
                                            labelKey="filter_policy_name"
                                            name="selected-state"
                                            onChange={this.handleDefaultFilterDropDown}
                                        />)
                                    : ("")
                                }

                            </div>
                            <ModalFooter cancel={this.toggleSetting} saveName='buttons.Submit' />
                        </Groups>
                    }
                    open={this.state.addSettingModal}
                    setOpen={(value) => this.setState({ addSettingModal: value })}
                />


                <Modal
                    icon={<FontAwesomeIcon icon={faSliders} />}
                    iconBg="tw-bg-blue-500 tw-text-white"
                    title="groups.add-permissions"
                    contentRaw={
                        <React.Fragment>
                            <div className="tw-text-left tw-mt-8 tw-mb-10">
                                <div className="input">
                            <Select
                                autoFocus
                                closeOnSelect={false}
                                multi={true}
                                options={allPermissionsOptions}
                                name="permissions"
                                value={this.state.selectedPermissions}
                                onChange={this.handlePermissionDropDown}

                            />

                                </div>
                                {description ? (
                                    <p className="tw-mt-4">{description}</p>

                                ) : ""}

                            </div>
                        </React.Fragment>
                    }
                    open={this.state.addPermissionsModal}
                    setOpen={this.togglePermissions}
                    modalFooter={<ModalFooter cancel={this.togglePermissions} saveName='buttons.Submit' save={this.addPermissionsGroup}  />}

                />
                <Modal
                    icon={<FontAwesomeIcon icon={faBoxesStacked} />}
                    iconBg="tw-bg-blue-500 tw-text-white"
                    title="groups.add-workspace"
                    contentRaw={
                        <div className="tw-text-left tw-mt-8 input tw-mb-10">
                            <Select
                                id="state-select"
                                autoFocus
                                value={this.state.addImageId}
                                options={unaddedImages}
                                valueKey="image_id"
                                labelKey="friendly_name"
                                name="selected-state"
                                onChange={this.handleImageDropDown}

                            />
                        </div>
                    }
                    open={this.state.addImageModal}
                    setOpen={this.toggleImage}
                    modalFooter={<ModalFooter cancel={this.toggleImage} saveName='buttons.Submit' save={this.addImagesGroup} />}

                />

                <Modal
                    icon={<FontAwesomeIcon icon={faUser} />}
                    iconBg="tw-bg-blue-500 tw-text-white"
                    title="groups.add-users"
                    contentRaw={
                        <div className="tw-text-left input tw-mt-8 tw-mb-10">
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
                    modalFooter={<ModalFooter cancel={this.toggleModal2} saveName='buttons.Submit' save={this.addUserToGroup} />}
                />

                <Modal
                    icon={<FontAwesomeIcon icon={faUser} />}
                    iconBg="tw-bg-blue-500 tw-text-white"
                    title="groups.update-sso-group-mapping"
                    contentRaw={
                        <Groups className="tw-text-left tw-mt-8" noPadding section="groups" onSubmit={handleSubmit(this.updateSsoMappingGroup)}>
                            {ssoFields({ section: 'groups', disabled: true })}
                            <ModalFooter cancel={this.openUpdateSsoMappingModal} saveName='buttons.Submit' />
                        </Groups>
                    }
                    open={this.state.updateSsoMappingModal}
                    setOpen={this.openUpdateSsoMappingModal}

                />

                <Modal
                    icon={<FontAwesomeIcon icon={faUser} />}
                    iconBg="tw-bg-blue-500 tw-text-white"
                    title="groups.add-sso-group-mapping"
                    contentRaw={
                        <Groups className="tw-text-left" noPadding section="groups" onSubmit={handleSubmit(this.addSsoMappingGroup)}>
                            {ssoFields({ section: 'groups' })}
                            <ModalFooter cancel={this.toggleMappingModal} saveName='buttons.Submit' />
                        </Groups>
                    }
                    open={this.state.addSsoMappingModal}
                    setOpen={this.toggleMappingModal}

                />

                <ConfirmAction
                    confirmationDetails={{
                        action: null,
                        details: {
                            title: t('groups.are-you-sure-you-want-to-delete-this-sso-group-mapping'),
                            text: t('groups.note-users'),
                            iconBg: 'tw-bg-pink-700 tw-text-white',
                            icon: <FontAwesomeIcon icon={faTrash} />,
                            confirmBg: 'tw-bg-pink-700',
                            confirmText: t('buttons.Delete'),

                        }
                    }}
                    open={this.state.deleteSsoMappingModal}
                    externalClose={true}
                    setOpen={this.toggleDeleteMappingModal}
                    onAction={this.deleteSsoMappingGroup}
                />


            </div>
        );
    }
}

ViewGroupFormTemplate.propTypes = {
    getGroups: Proptypes.func.isRequired,
    getAllSSOs: Proptypes.func.isRequired,
    getUrlFilterPolicies: Proptypes.func.isRequired,
    addUserToGroup: Proptypes.func.isRequired,
    getSettingsGroup: Proptypes.func.isRequired,
    addSettingsGroup: Proptypes.func.isRequired,
    updateSettingsGroup: Proptypes.func.isRequired,
    removeSettingsGroup: Proptypes.func.isRequired,
    getImagesGroup: Proptypes.func.isRequired,
    getSsoMappingsGroup: Proptypes.func.isRequired,
    addSsoMappingGroup: Proptypes.func.isRequired,
    updateSsoMappingGroup: Proptypes.func.isRequired,
    deleteSsoMappingGroup: Proptypes.func.isRequired,
    addImagesGroup: Proptypes.func.isRequired,
    removeImagesGroup: Proptypes.func.isRequired,
    getUsersGroup: Proptypes.func.isRequired,
    deleteUserFromGroup: Proptypes.func.isRequired,
    getAdminUsers: Proptypes.func.isRequired,
    getImages: Proptypes.func.isRequired,
    match: Proptypes.object,
    errorImageMessage: Proptypes.object,
    removeImagesGroupsError: Proptypes.object,
    addSsoMappingGroupsError: Proptypes.object,
    updateSsoMappingGroupsError: Proptypes.object,
    deleteSsoMappingGroupsError: Proptypes.object,
    getSsoMappingGroupsError: Proptypes.object,
    history: Proptypes.object.isRequired,
    getSettingsId: Proptypes.func.isRequired,
    addSettingsGroupErrorMessage: Proptypes.string,
    addSsoMappingMessage: Proptypes.string,
    updateSsoMappingMessage: Proptypes.string,
    deleteSsoMappingMessage: Proptypes.string,
    getSsoMappingMessage: Proptypes.string,
    updateSettingsGroupErrorMessage: Proptypes.string,
    updateSettingsGroupError: Proptypes.string,
    errorMessageRemove: Proptypes.func,
    deleteSettingFomGroupGroupsError: Proptypes.func,
    errorMessageDeleteUser: Proptypes.func,
    deleteUserFomGroupGroupsError: Proptypes.func,
    addSettingsGroupsError: Proptypes.func,
    errorAddImageMessage: Proptypes.func,
    addImagesGroupsError: Proptypes.func,
    errorMessageAddUser: Proptypes.func,
    addUserToGroupGroupsError: Proptypes.func,
    getAllSSOsError: Proptypes.func,
    groups: Proptypes.array,
    ssos: Proptypes.array,
    images: Proptypes.array,
    filters: Proptypes.array,
    users: Proptypes.array,
    loading: Proptypes.func,
    settings: Proptypes.array,
    allSettings: Proptypes.array,
    groupMappings: Proptypes.array,
    fields: Proptypes.array,
    allusers: Proptypes.array,
    allimages: Proptypes.array,
    initialize: Proptypes.func,
    handleSubmit: Proptypes.func,
    className: Proptypes.func,
};

let ViewGroupFormWithRouter = withRouter(ViewGroupFormTemplate);

let ViewGroupForm = connect(state =>
({
    groups: state.groups.groups || [],
    ssos: state.groups.ssos || [],
    users: state.groups.users || [],
    total: state.groups.total || 0,
    images: state.groups.images || [],
    filters: state.filter.filters || [],
    settings: state.groups.settings || [],
    permissions: state.groups.permissions || [],
    getPermissionsLoading: state.groups.getPermissionsLoading || false,
    allSettings: state.groups.allSettings || [],
    allPermissions: state.groups.allPermissions || [],
    groupMappings: state.groups.groupMappings || [],
    allusers: state.admin.users || [],
    allimages: state.images.images || [],
    addSettingsGroupErrorMessage: state.groups.addSettingsGroupErrorMessage || "",
    updateSettingsGroupErrorMessage: state.groups.updateSettingsGroupErrorMessage || "",
    addSsoMappingMessage: state.groups.addSsoMappingMessage || "",
    updateSsoMappingMessage: state.groups.updateSsoMappingMessage || "",
    deleteSsoMappingMessage: state.groups.deleteSsoMappingMessage || "",
    addSettingsGroupsError: state.groups.addSettingsGroupsError,
    updateSettingsGroupError: state.groups.updateSettingsGroupError,
    addSsoMappingsGroupsError: state.groups.addSsoMappingsGroupsError,
    updateSsoMappingGroupsError: state.groups.updateSsoMappingGroupsError,
    deleteSsoMappingGroupsError: state.groups.deleteSsoMappingGroupsError,
    errorAddImageMessage: state.groups.errorAddImageMessage,
    addImagesGroupsError: state.groups.addImagesGroupsError,
    errorMessageAddUser: state.groups.errorMessageAddUser,
    addUserToGroupGroupsError: state.groups.addUserToGroupGroupsError,
    errorImageMessage: state.groups.errorImageMessage,
    removeImagesGroupsError: state.groups.removeImagesGroupsError,
    errorMessageRemove: state.groups.errorMessageRemove,
    deleteSettingFomGroupGroupsError: state.groups.deleteSettingFomGroupGroupsError,
    errorMessageDeleteUser: state.groups.errorMessageDeleteUser,
    deleteUserFomGroupGroupsError: state.groups.deleteUserFomGroupGroupsError,
    getAllSSOsError: state.groups.getAllSSOsError,
    userPages: { pageSize: state.groups.userPageSize, pageNo: state.groups.userPageNo },
    settingPages: { pageSize: state.groups.settingPageSize, pageNo: state.groups.settingPageNo },
    imagePages: { pageSize: state.groups.imagePageSize, pageNo: state.groups.imagePageNo },
}),
    dispatch =>
    ({
        getGroups: () => dispatch(getGroups()),
        getAllSSOs: () => dispatch(getAllSSOs()),
        addUserToGroup: (data) => dispatch(addUserToGroup(data)),
        getSettingsGroup: (groupId) => dispatch(getSettingsGroup(groupId)),
        addSettingsGroup: (data) => dispatch(addSettingsGroup(data)),
        updateSettingsGroup: (data) => dispatch(updateSettingsGroup(data)),
        removeSettingsGroup: (groupSettingId) => dispatch(removeSettingsGroup(groupSettingId)),
        getImagesGroup: (groupId) => dispatch(getImagesGroup(groupId)),
        getSsoMappingsGroup: (groupId) => dispatch(getSsoMappingsGroup(groupId)),
        addImagesGroup: (data) => dispatch(addImagesGroup(data)),
        removeImagesGroup: (data) => dispatch(removeImagesGroup(data)),
        getUsersGroup: (groupId, page, pageSize, filters) => dispatch(getUsersGroup(groupId, page, pageSize, filters)),
        deleteUserFromGroup: (data) => dispatch(deleteUserFromGroup(data)),
        getAdminUsers: () => dispatch(getAdminUsers()),
        getImages: () => dispatch(getImages()),
        getUrlFilterPolicies: () => dispatch(getUrlFilterPolicies()),
        getSettingsId: () => dispatch(getSettingsId()),
        setUserPageInfo: (data) => dispatch(setGroupUserPageInfo(data)),
        setSettingPageInfo: (data) => dispatch(setGroupSettingPageInfo(data)),
        setImagePageInfo: (data) => dispatch(setGroupImagePageInfo(data)),
        addSsoMappingGroup: (data) => dispatch(addSsoMappingGroup(data)),
        updateSsoMappingGroup: (data) => dispatch(updateSsoMappingGroup(data)),
        deleteSsoMappingGroup: (data) => dispatch(deleteSsoMappingGroup(data)),
        getAllPermissions: () => dispatch(getAllPermissions()),
        getGroupPermissions: (data) => dispatch(getGroupPermissions(data)),
        addPermissionsGroup: (data) => dispatch(addPermissionsGroup(data)),
        removeGroupPermissions: (data) => dispatch(removeGroupPermissions(data)),
        
    }))(ViewGroupFormWithRouter);
    const ViewGroupFormTranslated = withTranslation('common')(ViewGroupForm)
export default reduxForm({
    form: "viewGroupForm"
})(ViewGroupFormTranslated);
