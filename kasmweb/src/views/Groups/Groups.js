import React,{ Component } from "react";
import { connect } from "react-redux";
import { getGroups, deleteGroup ,setGroupPageInfo} from "../../actions/actionGroup";
import { Row, Col } from "reactstrap";
import { NotificationManager } from "react-notifications";
import LoadingSpinner from "../../components/LoadingSpinner/index";

import Proptypes from "prop-types";
import DataTable from "../../components/Table/Table";
import { ImageColumn, ConfirmAction, DescriptionColumn } from "../../components/Table/NewTable";
import {withTranslation} from "react-i18next";
import uniqolor from 'uniqolor';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserGroup } from '@fortawesome/free-solid-svg-icons/faUserGroup';
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';
import PageHeader from "../../components/Header/PageHeader";
import { RenderToggle } from "../../utils/formValidations";

class Groups extends Component{
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            groupId: null,
            groupName: null,
            force: false,
        };
        this.deleteConfirm = this.deleteConfirm.bind(this);
        this.handleDeleteSuccess = this.handleDeleteSuccess.bind(this);
        this.handleDeleteError = this.handleDeleteError.bind(this);
        this.updateForce = this.updateForce.bind(this);
    }

    componentDidMount() {
        this.props.getGroups();
    }

    deleteConfirm(groupId, groupName){
        this.setState({modal: !this.state.modal,
            groupId: groupId,
            groupName: groupName});
    }

    updateForce() {
        this.setState({force: !this.state.force});
    }

    handleDeleteSuccess(){
        const {deleteGroupErrorMessage, t} = this.props;
        this.setState({modal: false});
        if(deleteGroupErrorMessage) {
            NotificationManager.error(deleteGroupErrorMessage,t('groups.delete-group-failed'), 3000);
        }else{
            NotificationManager.success(t('groups.successfully-deleted-group'),t('groups.delete-group'), 3000);
            this.props.getGroups();
        }
    }

    handleDeleteError(){
        const {deleteGroupError, t} = this.props;
        this.setState({modal: false});
        if(deleteGroupError){
            NotificationManager.error(deleteGroupError,t('groups.failed-to-delete-group'), 3000);
            this.props.history.push("/groups");
        }else{
            NotificationManager.error(t('groups.failed-to-delete-group'),t('groups.delete-group'), 3000);
            this.props.history.push("/groups");
        }
    }

    render(){
        if (this.props.getGroupsLoading){
            return (<div> <LoadingSpinner /></div>);
        }

        const { groups, t } = this.props;

        const columns = [
            {
                type: "text",
                accessor: "name",
                name: t('groups.name'),
                filterable: true,
                sortable: true,
                overwrite: true,
                cell: (data) => <ImageColumn key={'name' + data.original.group_id} image={<div style={{ backgroundColor: uniqolor(data.original.group_id).color }} className={"inner-shadow tw-flex tw-justify-center tw-items-center tw-rounded-full tw-text-white" + (this.props.condensed ? ' tw-w-14 tw-h-14 lg:tw-w-8 lg:tw-h-8' : ' tw-w-14 tw-h-14')}><FontAwesomeIcon className={this.props.condensed ? "tw-w-6 tw-h-6 lg:tw-w-4 lg:tw-h-4" : "tw-w-6 tw-h-6"} icon={faUserGroup} /></div>} main={data.value} sub={data.original.is_system ? <span>System: <span className="tw-text-red-600">Yes</span></span> : <span>System: <span className="">No</span></span>} first={true}></ImageColumn>
            },
            {
                accessor: "priority",
                name: t('groups.priority'),
                filterable: true,
                sortable: true
            },
            {
                type: "text",
                accessor: "description",
                name: t('groups.description'),
                filterable: true,
                sortable: true,
                overwrite: true,
                cell: (data) => <DescriptionColumn key={'description-' + data.original.group_id} main={data.value || '-'} />

            },
        ];

        const actions = [
            { id: "edit", icon: "fa-pencil", description: t('buttons.Edit') },
            { id: "deletegroup", icon: "fa-trash", description: t('buttons.Delete') },
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
                  <div className="tw-text-xs">{t('groups.force_delete')}</div>
              </div>

        }

        const multiActions = [
            {
                name: t('buttons.Delete'),
                action: 'deleteMulti',
                confirm: deleteConfirm
            }
        ]

        const onAction = (action, item) => {
            switch (action) {
                case "view":
                    this.props.history.push(`/viewgroup/${item.group_id}`);
                break;

                case "edit":
                    this.props.history.push(`/updategroup/${item.group_id}`);
                break;

                case "deletegroup":
                    this.deleteConfirm(item.group_id, item.name);
                break;

                case "deletesingle":
                    this.props.deleteGroup(this.state.groupId, this.state.force).
                    then(() => this.handleDeleteSuccess()).
                    catch(() => this.handleDeleteError());
                break;
                
                case "deleteMulti":
                    item.forEach(id => {
                        this.props.deleteGroup(id, this.state.force).
                        then(() => this.handleDeleteSuccess()).
                        catch(() => this.handleDeleteError());
                    })
                break;

            }
        }

        return (
            <div className="profile-page">
                <PageHeader location={this.props.location} routes={typeof newRoutes !== 'undefined' ? newRoutes : null} title={t('groups.groups')} icon={<FontAwesomeIcon icon={faUserGroup} />} />
                <Row>
                    <Col sm={{ size: 10, order: 3, offset: 1 }}>
                                <DataTable
                                    id="groups"
                                    data={groups}
                                    columns={columns}
                                    actions={actions}
                                    multiActions={multiActions}
                                    onAction={onAction}
                                    mainId="group_id"
                                    add={{
                                        name: t('groups.add-group'),
                                        action: '/creategroup'
                                    }}
                                />
                    </Col>
                </Row>

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

Groups.propTypes = {
    getGroups: Proptypes.func.isRequired,
    history: Proptypes.object.isRequired,
    deleteGroup: Proptypes.func.isRequired,
    deleteGroupErrorMessage: Proptypes.func,
    deleteGroupError: Proptypes.func,
    getGroupsLoading: Proptypes.bool,
    groups: Proptypes.array,
    className: Proptypes.func
};
const GroupsTranslated = withTranslation('common')(Groups)
export default connect(state => 
    {
    return ({
        groups: state.groups.groups || [],
        condensed: state.tables.condensed || false,
        getGroupsLoading: state.groups.getGroupsLoading || false,
        deleteGroupErrorMessage: state.groups.deleteGroupErrorMessage || null,
        deleteGroupLoading: state.groups.deleteGroupLoading || false,
        deleteGroupError: state.groups.deleteGroupError || null,
    })},
    dispatch => 
    ({  
        getGroups: () => dispatch(getGroups()),
        deleteGroup: (data, force) => dispatch(deleteGroup(data, force)),
        setPageInfo : (data)=> dispatch(setGroupPageInfo(data)),
    }))(GroupsTranslated);