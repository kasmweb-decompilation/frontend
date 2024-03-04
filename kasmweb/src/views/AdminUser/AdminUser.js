import _ from "lodash";
import React, { Component } from "react";
import { Row, Col, UncontrolledTooltip,
} from "reactstrap";
import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";
import { getAdminUsers, deleteUser, updateUser, resetPasswordFunc ,setPageInfo} from "../../actions/actionAdminUser";
import { withRouter } from "react-router-dom";
// import LoadingSpinner from "../../components/LoadingSpinner/index";
import { renderCheckbox, renderField, required, password, RenderToggle } from "../../utils/formValidations.js";
import { NotificationManager } from "react-notifications";
import Proptypes from "prop-types";
import DataTable from "../../components/Table/Table";
import moment from "moment";
import {withTranslation, Trans} from "react-i18next";
import { ImageColumn, StandardColumn, DescriptionColumn, ToggleColumn, ConfirmAction } from "../../components/Table/NewTable";
import uniqolor from 'uniqolor';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons/faUser';
import { faUserGroup } from '@fortawesome/free-solid-svg-icons/faUserGroup';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons/faCircleUser';
import { faKey } from '@fortawesome/free-solid-svg-icons/faKey';
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';
import PageHeader from "../../components/Header/PageHeader";
import { notifySuccess, notifyFailure, Groups, FormField, Button, ButtonGroup } from "../../components/Form"
import { Modal, ModalFooter } from "../../components/Form/Modal"
import { faEye } from "@fortawesome/free-solid-svg-icons/faEye";

const validate = values => {
    const errors = {};
    if (values.newPassword !== values.confirmPassword) {
        errors.confirmPassword = <Trans ns="common" i18nKey="users.Passwords Do Not Match"></Trans>;
    }
    return errors;
};

class AdminUser extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            modal: false,
            modalreset: false,
            pages: 1,
            users: [],
            userId: null,
            userName: null,
            password: "",
            confirmPassword: "",
            show:false,
            resetlocked: 0,
            resetdisabled: 0,
            force: false,
            triggerOnFetch: false,
            anonymous: false,
            anonymous_only: false
        };

        this.resetConfirm = this.resetConfirm.bind(this);
        this.resetPassword = this.resetPassword.bind(this);
        this.deleteConfirm = this.deleteConfirm.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
        this.toggle1 = this.toggle1.bind(this);
        this.toggle = this.toggle.bind(this);
        this.updateForce = this.updateForce.bind(this);
    }

    resetConfirm(userId,userName){
        this.setState({modalreset: !this.state.modalreset,
            userId: userId,
            userName: userName
        });
    }

    updateForce() {
        this.setState({force: !this.state.force});
    }

    resetPassword(userData){
        let currentUser = this.props.users.find(user => user.user_id === this.state.userId);
        currentUser.password = userData.newPassword;
        this.props.resetPasswordFunc(currentUser).
            then(() => this.handlePasswordResetSuccess()).
            catch(() => this.handlePasswordResetFailure());
    }

    handlePasswordResetSuccess(){
        const {errorResetPasswordMessage, t} = this.props;
        this.setState({modalreset: false});
        if(errorResetPasswordMessage) {
            NotificationManager.error(errorResetPasswordMessage,t("users.Reset Password"), 3000);
        }
        else {
            this.props.initialize({ password: "" });
            NotificationManager.success(t("users.Successfully Reset Password"),t("users.Reset Password"),3000);
        }
    }

    handlePasswordResetFailure(){
        const {resetPasswordError, t} = this.props;
        this.setState({modalreset: false});
        if(resetPasswordError){
            NotificationManager.error(resetPasswordError,t("users.Reset Password"), 3000);
        }
        else {
            NotificationManager.error(t("users.Failed to Reset Password"),t("users.Reset Password"), 3000);
        }
    }

    deleteConfirm(userId,userName){
        this.setState({modal: !this.state.modal,
            userId: userId,
            userName: userName});
    }

    deleteUser(){
        this.props.deleteUser(this.state.userId).
            then(() => this.handleDeleteSuccess()).
            catch(() => this.handleDeleteError());
    }

    handleDeleteSuccess(){
        const {deleteUserErrorMessage, t} = this.props;
        this.setState({modal: false});
        if(deleteUserErrorMessage) {
            NotificationManager.error(deleteUserErrorMessage, t("users.Delete User"), 3000);
        }
        else{
            NotificationManager.success(t("users.Successfully Deleted User"),t("users.Delete User"), 3000);
        }
    }

    handleDeleteError(){
        const {deleteUsersError, t} = this.props;
        this.setState({modal: false});
        if(deleteUsersError){
            NotificationManager.error(deleteUsersError,t("users.Delete User"), 3000);
        }
        else{
            NotificationManager.error(t("users.Failed to Delete User"),t("users.Delete User"), 3000);
        }
    }

    toggle1(){
        this.setState({modalreset: !this.state.modalreset});
        this.props.initialize({  newPassword: "" , confirmPassword: "" });
    }

    toggle(){
        this.setState({modal: !this.state.modal});
    }

    render() {
        const { handleSubmit, t} = this.props;

        const columns = [
            {
                type: "text",
                accessor: "username",
                name: t("users.username"),
                filterable: true,
                searchable: true,
                overwrite: true,
                cell: (data) => <ImageColumn key={'username' + data.original.user_id} image={<div style={{ backgroundColor: uniqolor(data.original.user_id).color }} className={"tw-flex inner-shadow tw-justify-center tw-items-center tw-rounded-full tw-text-white" + (this.props.condensed ? ' tw-w-14 tw-h-14 lg:tw-w-8 lg:tw-h-8' : ' tw-w-14 tw-h-14')}><FontAwesomeIcon className={this.props.condensed ? "tw-w-6 tw-h-6 lg:tw-w-4 lg:tw-h-4" : "tw-w-6 tw-h-6"} icon={faUser} /></div>} main={data.value} sub={t('users.Created') + ': ' +  moment.utc(data.original.created).local().format('ll')} first={true}></ImageColumn>
            },
            {
                type: "flag",
                accessor: "anonymous",
                name: t("users.Anonymous"),
                filterable: true,
                sortable: true,
                showByDefault: false
            },
            {
                type: "toggle",
                accessor: "locked",
                name: t("users.locked"),
                filterable: true,
                sortable: true,
                overwrite: true,
                cell: (data) => <ToggleColumn key={'locked-' + data.original.user_id + this.state.resetlocked} id="user_id" column="locked" data={data} onChange={(e) => onAction('toggle', { id: 'locked', e, data: data.original } )} />
            },
            {
                type: "toggle",
                accessor: "disabled",
                name: t("users.disabled"),
                filterable: true,
                sortable: true,
                overwrite: true,
                cell: (data) => <ToggleColumn key={'disabled-' + data.original.user_id + this.state.resetdisabled} id="user_id" column="disabled" data={data} onChange={(e) => onAction('toggle', { id: 'disabled', e, data: data.original } )} />
            },
            {
                type: "date",
                accessor: "last_session",
                name: t("users.Last Session"),
                filterable: true,
                sortable: true,
                cell: (data) => <div>{moment(data.value).isValid() ? moment.utc(data.value).local().fromNow() : "-"}</div>
            },
            {
                type: "text",
                accessor: "groups",
                name: t("users.Groups"),
                filterable: true,
                sortable: true,
                // colSize: 'minmax(130px,2fr) ',
                cell: (data) => <div className="tw-flex tw-flex-col tw-flex-1 tw-flex-wrap tw-gap-1">
                <div className="text-muted-more tw-text-xs tw-flex tw-gap-1 tw-flex-wrap lg:tw-justify-center">
                  <div className="tw-isolate tw-flex -tw-space-x-2 tw-overflow-hidden">
                    {data.original.groups && data.original.groups.length > 0 && data.original.groups.map((group, i) => {
                      return (
                        <React.Fragment key={group.group_id}>
                          <UncontrolledTooltip placement="top" target={"group-" + data.original.user_id + group.group_id}>
                            {group.name}
                          </UncontrolledTooltip>
                          <div id={'group-' + data.original.user_id + group.group_id} style={{ backgroundColor: uniqolor(group.group_id).color }} className="tw-w-8 tw-h-8 tw-flex tw-justify-center tw-items-center tw-rounded-full tw-text-white tw-ring-2 tw-ring-zinc-50 dark:tw-ring-slate-900">
                            <FontAwesomeIcon className="tw-w-3 tw-h-3" icon={faUserGroup} />
                          </div>
    
                        </React.Fragment>
                      )
                    })}
                  </div>
                </div>
              </div>
            },
            {
                accessor: "created",
                name: t("users.Created"),
                showByDefault: false,
                cell: (data) => <div>{moment(data.value).isValid() ? moment.utc(data.value).local().format("lll") : "-"}</div>
            },
            {
                accessor: "first_name",
                name: t("users.first-name"),
                filterable: true,
                sortable: true,
                showByDefault: false
            },
            {
                accessor: "last_name",
                name: t("users.last-name"),
                filterable: true,
                sortable: true,
                showByDefault: false
            },
            {
                accessor: "phone",
                name: t("users.phone"),
                filterable: true,
                sortable: true,
                showByDefault: false
            },
            {
                accessor: "organization",
                name: t("users.organization"),
                filterable: true,
                sortable: true,
                showByDefault: false
            },
            {
                accessor: "notes",
                name: t("users.notes"),
                filterable: true,
                sortable: true,
                showByDefault: false,
                overwrite: true,
                cell: (data) => <DescriptionColumn key={'notes' + data.original.user_id} main={data.value} />
            },
            {
                accessor: "realm",
                name: t("users.realm"),
                filterable: true,
                sortable: true,
                showByDefault: false
            },
      
        ];

        const actions = [
            {
                id: "edit",
                icon: "fa-pencil",
                description: t("buttons.Edit")
            },
            {
                id: "reset",
                icon: <FontAwesomeIcon icon={faKey} />,
                description: t("buttons.Reset password"),
                isHidden: (data) => data.realm !== "local" && data.realm !== "ldap"
            },
            {
                id: "deleteuser",
                icon: "fa-trash",
                description: t("buttons.Delete")
            },
        ];

        const deleteConfirm = {
            title: t('tables.delete-items'),
            text: t('tables.are-you-sure-you-want-to-delet'),
            iconBg: 'tw-bg-pink-700 tw-text-white',
            icon: <FontAwesomeIcon icon={faTrash} />,
            confirmBg: 'tw-bg-pink-700',
            confirmText: t('tables.delete'),
            additional: 
              <div className="tw-text-center">
                  <label id="force_label" className="group-label tw-flex tw-justify-center tw-items-center tw-gap-3"><b className="tw-mb-2">{t('generic.force')}:</b> <RenderToggle checked={!!this.state.force} name="force" onChange={this.updateForce} /></label>
                  <div className="tw-text-xs">{t('users.force-description')}</div>
              </div>

        }

        const multiActions = [
            {
                name: t('buttons.Delete'),
                action: 'deleteMulti',
                confirm: deleteConfirm
            }
        ]


        const onAction = async(action, item) => {
            switch (action) {
                case "view":
                    this.props.history.push(`/viewuser/${item.user_id}`);
                break;

                case "edit":
                    this.props.history.push(`/updateuser/${item.user_id}`);
                break;

                case "reset":
                    this.resetConfirm(item.user_id, item.username);
                break;

                case "deleteuser":
                    this.deleteConfirm(item.user_id, item.username);
                break;

                case "deletesingle":
                    this.props.deleteUser(this.state.userId, this.state.force).
                    then(() => {
                        this.handleDeleteSuccess()
                        this.setState({ triggerOnFetch: true })
                    }).
                    catch(() => this.handleDeleteError());
                break;

                case "deleteMulti":
                    const promises = []
                    item.forEach(id => {
                        const promise = this.props.deleteUser(id, this.state.force).
                        then(() => this.handleDeleteSuccess()).
                        catch(() => this.handleDeleteError());
                        promises.push(promise)
                    })
                    await Promise.all(promises)
                    this.setState({ triggerOnFetch: true })
                break;

                case "toggle":
                    const validToggles = ['disabled', 'locked'];
                    const username = window.localStorage.getItem("user_info") && JSON.parse(window.localStorage.getItem("user_info")).username;
                    if(username === item.data.username) {
                        this.setState({
                            ['reset' + item.id]: this.state['reset' + item.id] + 1
                        })
                        return NotificationManager.error(t("users.You cannot perform this action on your own user account"),t("users.Delete User"), 3000);
                    }
                    if(validToggles.indexOf(item.id) !== -1) {
                        let userData = item.data;
                        userData[item.id] = !userData[item.id];
                        try {
                            const { response: { error_message: errorMessage } } = await this.props.updateUser(userData);
                            notifySuccess({
                                errorMessage,
                                type: 'update'
                            })

                        } catch(error) {
                            notifyFailure({ error, type: 'update' })
                        }
                        
                    }
                break;

            }
        }

        const triggerOnFetch = () => {
            const value = _.clone(this.state.triggerOnFetch)
            if (value === true) {
                this.state.triggerOnFetch = false
            }
            return value
        }

        const onFetch = async (options) => {
            const data = {
                page: options.page,
                pageSize: options.pageSize,
                filters: options.filters,
                sortBy: options.sortBy,
                sortDirection: options.sortDirection,
                anonymous: this.state.anonymous,
                anonymous_only: this.state.anonymous_only
            }
            const details = await this.props.getAdminUsers(data)
            if (this.state.anonymous_only && (_.isEmpty(details.response) || details.response.total < 1)) {
                NotificationManager.info(t('users.no-anonymous-only'), t("users.anonymous-only"), 3000);
                updateAnonymous({ target: { value: 'hide_anon' }})
            }
        }

        const updateAnonymous = (e) => {
            switch (e.target.value) {
                case "hide_anon":
                    this.setState({ anonymous: false, anonymous_only: false })
                    break;
                case "show_anon":
                    this.setState({ anonymous: true, anonymous_only: false })
                    break;
                case "only_anon":
                    this.setState({ anonymous: true, anonymous_only: true })
                    break;
            }
            this.setState({ triggerOnFetch: true })
        }

        return (
            <div className="profile-page">
                <PageHeader location={this.props.location} routes={typeof newRoutes !== 'undefined' ? newRoutes : null} title={t('users.Users')} icon={<FontAwesomeIcon icon={faCircleUser} />} />
                <Row>
                    <Col sm={{ size: 10, order: 3, offset: 1 }}>
                                <DataTable
                                    id="admin-user"
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
                                    search="username"
                                    add={{
                                        name: t('users.Add User'),
                                        action: '/createuser'
                                    }}
                                    additionalButtons={
                                        <ButtonGroup onChange={updateAnonymous} color="tw-bg-white/70 dark:tw-bg-slate-900/70 tw-text-color" icon={<FontAwesomeIcon icon={faEye} />} section="casting" name="Anonymous">
                                            <option value="hide_anon">{t('users.anonymous-hide')}</option>
                                            <option value="show_anon">{t('users.anonymous-show')}</option>
                                            <option value="only_anon">{t('users.anonymous-only')}</option>
                                        </ButtonGroup>
                                        
                                    }
                
                                />
                    </Col>
                </Row>

                <Modal
                    icon={<FontAwesomeIcon icon={faKey} />}
                    iconBg="tw-bg-blue-500 tw-text-white"
                    title="users.Reset Password"
                    contentRaw={
                        <Groups className="tw-text-left" noPadding section="users" onSubmit={handleSubmit(this.resetPassword)}>
                            <FormField label="New Password">
                                <Field
                                    id="newPassword"
                                    type="password"
                                    name="newPassword"
                                    component={renderField}
                                    validate={[required, password]} required
                                />

                            </FormField>
                            <FormField label="Confirm Password">
                                <Field
                                    id="confirmPassword"
                                    type="password"
                                    name="confirmPassword"
                                    component={renderField}
                                    validate={[required, password]} required
                                />
                            </FormField>
                            <ModalFooter cancel={() => this.setState({ modalreset: false })} saveName='buttons.Submit' />
                        </Groups>
                    }
                    open={this.state.modalreset}
                    setOpen={(value) => this.setState({ modalreset: value })}
                />

                <ConfirmAction
                    confirmationDetails={{
                        action: 'deletesingle',
                        details: deleteConfirm
                    }}
                    open={this.state.modal}
                    setOpen={(value) => this.setState({ modal: value })}
                    onAction={onAction}
                />


            </div>
        );
    }
}


AdminUser.propTypes = {
    updateUser: Proptypes.func.isRequired,
    history: Proptypes.object.isRequired,
    updateUsersError: Proptypes.func,
    updatErrorWarning: Proptypes.func,
    resetPasswordError: Proptypes.func,
    deleteUser: Proptypes.func.isRequired,
    resetPasswordFunc: Proptypes.func,
    errorResetPasswordMessage: Proptypes.string,
    deleteUsersError: Proptypes.func,
    deleteUserErrorMessage: Proptypes.func,
    getAdminUsers: Proptypes.func.isRequired,
    initialize: Proptypes.func,
    getUsersLoading: Proptypes.bool,
    users: Proptypes.array,
    handleSubmit:  Proptypes.func,
    className: Proptypes.object 
};

const AdminUserTranslated = withTranslation('common')(AdminUser)
let  AdminUserFormWithRouter = withRouter(AdminUserTranslated);

let AdminUserForm = connect(state => {
    return ({
        users: state.admin.users || null,
        condensed: state.tables.condensed || false,
        total: state.admin.total || 0,
        usersPage: state.admin.usersPage || 0,
        errorResetPasswordMessage: state.admin.errorResetPasswordMessage || null,
        updatErrorWarning: state.admin.updatErrorWarning || null,
        resetPasswordError: state.admin.resetPasswordError || null,
        deleteUsersError: state.admin.deleteUsersError || null,
        getUsersLoading: state.admin.getUsersLoading || false,
        deleteUserErrorMessage: state.admin.deleteUserErrorMessage || null,
        pages : {pageSize : state.admin.pageSize, pageNo : state.admin.pageNo},
    })
},
dispatch => 
    ({  
        getAdminUsers: (data) => dispatch(getAdminUsers(data)),
        resetPasswordFunc: (data) => dispatch(resetPasswordFunc(data)),
        updateUser: (data) => dispatch(updateUser(data)),
        deleteUser: (data, force) => dispatch(deleteUser(data, force)),
        setPageInfo : (data)=> dispatch(setPageInfo(data)),
    }))(AdminUserFormWithRouter);


export default reduxForm({
    form: "adminuserForm",
    validate
})(AdminUserForm);
