import React, { Component, useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import { ConfirmAction, DescriptionColumn } from "../../../components/Table/NewTable";
import LoadingSpinner from "../../../components/LoadingSpinner";
import DataTable from "../../../components/Table/Table";
import { t } from "i18next";
import { getAllPermissions } from "../../../actions/actionGroup";
import { addPermissionsApi, getApiPermissions, removeApiPermissions } from "../../../actions/actionDevloper";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSliders } from "@fortawesome/pro-light-svg-icons/faSliders";
import Select from "react-select";
import { Modal, ModalFooter } from "../../../components/Form/Modal";
import { faCircleMinus } from "@fortawesome/pro-light-svg-icons/faCircleMinus";
import { notifyFailure, notifySuccess } from "../../../components/Form/Form";

export default function ViewApi(props) {
    const { currentTab } = props
    const dispatch = useDispatch()
    const [openPermissionsModal, setOpenPermissionsModal] = useState(false);
    const [confirmaDelete, setConfirmDelete] = useState(false);
    const [selectedPermissions, setSelectedPermissions] = useState([])
    const [currentPermission, setCurrentPermission] = useState(null)
    const permissions = useSelector(state => state.develop.permissions) || []
    const allPermissions = useSelector(state => state.groups.allPermissions) || []
    const getPermissionsLoading = useSelector(state => state.develop.getPermissionsLoading) || false

    useEffect(() => {
        dispatch(getAllPermissions())
        dispatch(getApiPermissions(props.match.params.id))
    }, []);


    const renderPermissions = () => {
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
                    setCurrentPermission(item.group_permission_id)
                    setConfirmDelete(true)
                    break;
                case "deleteMulti":
                    item.forEach(id => {
                        deleteApiPermission(id)
                    })
                    break;
            }
        }

        if (getPermissionsLoading){
            return (<div> <LoadingSpinner /></div>);
        }

        return (
            <div>
                <DataTable
                    id="group-permissions"
                    data={permissions}
                    columns={columns}
                    actions={actions}
                    onAction={onAction}
                    mainId="group_permission_id"
                    add={{
                        name: t('groups.add-permissions'),
                        onClick: () => setOpenPermissionsModal(true)
                    }}
                />
            </div>
        );
    }

    const handlePermissionDropDown = (permission) => {
        setSelectedPermissions(permission)
    }

    const addPermissionsApiFunc = async () => {
        const permissions = selectedPermissions.map(param => param.value)
        try {
            const { response: { error_message: errorMessage } } = await dispatch(addPermissionsApi({
                permissionIds: permissions,
                apiId: props.match.params.id,
            }));
            notifySuccess({
                errorMessage,
                type: 'create',
            })

        } catch (error) {
            notifyFailure({
                error,
                type: 'create',
            })
        }
        dispatch(getApiPermissions(props.match.params.id));
        setOpenPermissionsModal(false)
        setSelectedPermissions([])
    }

    const deleteApiPermission = async (id) => {
        const perm = id || currentPermission
        try {
            const { response: { error_message: errorMessage } } = await dispatch(removeApiPermissions({
                apiPermissionId: perm,
            }));
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
        setCurrentPermission(null)
        dispatch(getApiPermissions(props.match.params.id));
    }

    let allPermissionsOptions = []
    if (allPermissions.length > 0) {
        allPermissionsOptions = allPermissions.filter(elem => !permissions.find(({ permission_id }) => elem.permission_id === permission_id)).sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1).map(permission => ({ value: permission.permission_id, label: permission.friendly_name, description: permission }))
    }

    return (
        <React.Fragment>
            <div className={(currentTab === 'permissions' ? 'tw-block' : 'tw-hidden')}>
                {renderPermissions()}
            </div>
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
                                    value={selectedPermissions}
                                    onChange={handlePermissionDropDown}
                                />
                            </div>
                        </div>
                    </React.Fragment>
                }
                open={openPermissionsModal}
                setOpen={setOpenPermissionsModal}
                modalFooter={<ModalFooter cancel={() => setOpenPermissionsModal(false)} saveName='buttons.Submit' save={addPermissionsApiFunc} />}
            />

            <ConfirmAction
                confirmationDetails={{
                    details: {
                        title: t('groups.remove-permissions', { count: 1 }),
                        text: t('groups.remove-permissions-desc', { count: 1 }),
                        iconBg: 'tw-bg-pink-700 tw-text-white',
                        icon: <FontAwesomeIcon icon={faCircleMinus} />,
                        confirmBg: 'tw-bg-pink-700',
                        confirmText: t('buttons.remove')
                    }
                }}
                open={confirmaDelete}
                setOpen={setConfirmDelete}
                onAction={deleteApiPermission}
            />


        </React.Fragment>
    )
}
