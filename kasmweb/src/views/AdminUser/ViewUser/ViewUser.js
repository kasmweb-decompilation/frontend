import React,{ Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Button, Table, Col, Row, Modal, ModalHeader, ModalBody, ModalFooter, Card, CardBody, CardHeader, ListGroupItem, ListGroup} from "reactstrap";
import { getUsersId, deleteUserKasm, getAdminUsageDump, getUserGroupSettings, getUserPermissions } from "../../../actions/actionAdminUser";
import { getUserImagesEx } from "../../../actions/actionDashboard";
import {setUsagePageInfo} from "../../../actions/actionUser"
import BreadCrumbCompo from "../../../components/Breadcrumb/BreadCrumbCompo";
import DataTable from "../../../components/Table/Table";
import { DescriptionColumn, SettingColumn } from "../../../components/Table/NewTable";
import { NotificationManager } from "react-notifications";
import Proptypes from "prop-types";
import moment from "moment";
import iconNo from "../../../../assets/images/icon_no.svg";
import iconYes from "../../../../assets/images/icon_yes.svg";
import _ from "lodash";
import FileMapping from "../../../components/FileMapping/FileMapping";
import {withTranslation} from "react-i18next";
import StorageMapping from "../../../components/StorageMapping";
import { ImageColumn, StandardColumn } from "../../../components/Table/NewTable";

class ViewUser extends Component{
    constructor(props){
        super(props);

        this.state = {
            modal: false,
            modalreset: false,
            kasmId: null,
            user: null,
        };

        this.toggle = this.toggle.bind(this);
    }


    toggle(){
        this.setState({modal: !this.state.modal});
    }

   async componentDidMount() {
        const { response } = await this.props.getUsersId(this.props.match.params.id);

        this.props.getUserImagesEx({
            username: response.user.username
        });

        this.props.getUserGroupSettings({
            username: response.user.username
        });

        this.props.getUserPermissions({
            user_id: response.user.user_id
        });

        this.props.getAdminUsageDump(this.props.match.params.id);
    }

    renderKasms(kasms){
        const { t } = this.props;
        const columns = [
            {
                accessor: "kasm_id",
                name: t("users.Id"),
            },
            {
                accessor: "start_date",
                name: t("users.Start Date"),
                cell: (data) => moment.utc(data.value).local().format("lll")
            },
            {
                accessor: "expiration_date",
                name: t("users.Expiration Date"),
                cell: (data) => moment.utc(data.value).local().format("lll")
            },
            {
                accessor: "keepalive_date",
                name: t("users.Last Accessed"),
                cell: (data) => moment.utc(data.value).local().format("lll")
            }
        ]

        return (
            <DataTable
                id="user-kasms"
                data={kasms}
                columns={columns}
                mainId="kasm_id"
            />
        )

    }

    renderGroups(groups){
        const { t } = this.props;

        const columns = [
            {
                accessor: "name",
                name: t("users.Name"),
                filterable: true,
                sortable: true
            }
        ]
        return (
        <DataTable
            id="user-groups"
            data={groups}
            columns={columns}
            mainId="group_id"
        />)

    }

    renderResultantGroupsSettings() {
        const data = this.props.groupSettings || [];
        const { t } = this.props;
        const columns = [
            {
                type: "text",
                accessor: "name",
                name: t("users.Name"),
                filterable: true,
                sortable: true,
                showBoolValue: 'value'
            },
            {
                type: "text",
                accessor: "value",
                name: t("users.Value"),
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
            {
                type: "text",
                accessor: "value_type",
                name: t("users.Type"),
                filterable: true,
                sortable: true,
                showByDefault: false
            },
        ];

        return (
            <React.Fragment>
                <DataTable
                    id="user-settings"
                    data={data}
                    columns={columns}
                    mainId="group_setting_id"
                />
            </React.Fragment>
        )
    }

    renderResultantPermissions() {
        // const data = (this.props.userPermissions && this.props.userPermissions.map(el => ({ permission_name: el }))) || [];
        const data = this.props.userPermissions || [];
        const { t } = this.props;
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

        return (
            <React.Fragment>
                <DataTable
                    id="user-permissions"
                    data={data}
                    columns={columns}
                    mainId="group_permission_id"
                />
            </React.Fragment>
        )
    }

    renderResultantGroupsImages() {
        const data = this.props.availableKasms || [];
        const { t } = this.props;
        const columns = [
            {
                type: "text",
                name: t('workspaces.name'),
                accessor: "friendly_name",
                filterable: true,
                sortable: true,
                overwrite: true,
                cell: (data) => <ImageColumn key={'friendly_name' + data.original.image_id} image={<img className="tw-w-16" src={data.original.image_src || 'img/favicon.png'} onError={(e) => e.target.src = "img/favicon.png"} />} main={data.value} sub={data.original.image_type.toLowerCase() === 'container' ? data.original.name : data.original.image_type } first={true}></ImageColumn>
            },
        ];

        return (
            <React.Fragment>
                <DataTable
                    id="user-images"
                    data={data}
                    columns={columns}
                    mainId="image_id"
                />
            </React.Fragment>
        )
    }

    renderUsageDetails() {
        const data = _.get(this.props.usageDump, "account_dump", []);
        const { t } = this.props;
        const columns = [
            {
                type: "text",
                accessor: "image_friendly_name",
                name: t("users.Workspace"),
                filterable: true,
                sortable: true,
                overwrite: true,
                cell: (data) => <ImageColumn image={<img className="tw-w-16" src={data.original.image_src || 'img/favicon.png'} onError={(e) => e.target.src = "img/favicon.png"} />} main={data.value} first={true}></ImageColumn>
            },
            {
                type: "date",
                accessor: "start_date",
                name: t("users.Created"),
                filterable: true,
                sortable: true,
                overwrite: true,
                cell: (data) => <StandardColumn gap="tw-gap-1" main={<div className="tw-whitespace-nowrap tw-relative tw-translate-y-2 tw-h-7"><span className="text-muted-more tw-text-[10px] tw-w-full tw-left-0 tw-text-center tw-absolute -tw-top-3">{moment.utc(data.value).local().format('ll')}</span>{moment.utc(data.value).local().format('hh:mm:ss a')}</div>} sub={t("users.Created")} first={false}></StandardColumn>
            },
            {
                type: "date",
                accessor: "destroyed_date",
                name: t("users.Stopped On"),
                filterable: true,
                sortable: true,
                overwrite: true,
                cell: (data) => <StandardColumn gap="tw-gap-1" main={<div className="tw-whitespace-nowrap tw-relative tw-translate-y-2 tw-h-7"><span className="text-muted-more tw-text-[10px] tw-w-full tw-left-0 tw-text-center tw-absolute -tw-top-3">{moment.utc(data.value).local().format('ll')}</span>{moment.utc(data.value).local().format('hh:mm:ss a')}</div>} sub={t("users.Stopped On")} first={false}></StandardColumn>
            },
            {
                type: "text",
                accessor: "destroy_reason",
                name: t("users.Stopped By"),
                filterable: true,
                sortable: true
            },
            {
                accessor: "usage_hours",
                name: t("users.Usage (hours)"),
                filterable: true,
                sortable: true
            },
        ];

        return (
            <DataTable
                id="view-user"
                data={data}
                columns={columns}
                mainId="account_id"
                defaultSorters={[{
                  id: 'start_date',
                  desc: true
                }]}
            />
        )
    }

    render(){
        const { user, usageDumpLoading, t } = this.props;

        return (
          <div className="profile-page">

                {this.props.currentTab && this.props.currentTab === 'groups' && user && user.groups && user.groups.length > 0 && (
                            <React.Fragment>
                            <ListGroup>{this.renderGroups(user.groups)}</ListGroup>
                            </React.Fragment>
                        )}

{this.props.currentTab && this.props.currentTab === 'settings' && (
                            <React.Fragment>
                            <div className="title-head">
                                <strong>{t('users.Resultant Group Settings')}</strong>
                            </div>
                            <ListGroup>{this.renderResultantGroupsSettings()}</ListGroup>
                            </React.Fragment>
                        )}

                {this.props.currentTab && this.props.currentTab === 'permissions' && (
                            <React.Fragment>
                            <ListGroup>{this.renderResultantPermissions()}</ListGroup>
                            </React.Fragment>
                        
                )}

                {this.props.currentTab && this.props.currentTab === 'workspaces' && (
                            <React.Fragment>
                            <ListGroup>{this.renderResultantGroupsImages()}</ListGroup>
                            </React.Fragment>
                        )}

                {this.props.currentTab && this.props.currentTab === 'user_kasms' && user && user.kasms && user.kasms.length > 0 && (
                    <React.Fragment>
                      {user ? this.renderKasms(user.kasms) : " "}
                      </React.Fragment>
                )}

                {this.props.currentTab && this.props.currentTab === 'usage_details' && !usageDumpLoading && (
                  <React.Fragment>
                    {this.renderUsageDetails()}
                  </React.Fragment>
                )}

                {this.props.currentTab && this.props.currentTab === 'file_mapping' && (
                  <FileMapping type="user_id" user_id={this.props.match.params.id} />
                )}

                {this.props.currentTab && this.props.currentTab === 'storage_mapping' && (
                  <StorageMapping type="user_id" user_id={this.props.match.params.id} />
                )}

          </div>
        );
    }
}

ViewUser.propTypes = {
    history: Proptypes.object.isRequired,
    getUsersId: Proptypes.func.isRequired,
    deleteUserKasm: Proptypes.func.isRequired,
    user: Proptypes.object,
    deleteUserKasmErrorMessage: Proptypes.func,
    deleteUsersKasmError: Proptypes.func,
    match: Proptypes.object,
    className: Proptypes.func
};

const ViewUserTranslated = withTranslation('common')(ViewUser)

export default connect(state =>
    ({
        user: state.admin.user || null,
        deleteUserKasmErrorMessage: state.admin.deleteUserkasmErrorMessage || null,
        deleteUsersKasmError: state.admin.deleteUsersKasmError || null,
        usageDump: state.admin.usageDump,
        usageDumpLoading: state.admin.usageDumpLoading,
        usageDumpError: state.admin.usageDumpError,
        pages : {pageSize : state.admin.pageSize, pageNo : state.admin.pageNo},
        availableKasms: state.dashboard.availableKasms || null,
        groupSettings: state.dashboard.clientGroupSettings || null,
        userPermissions: state.dashboard.userPermissions || null
    }),
dispatch => 
    ({  
        getUsersId: (data) => dispatch(getUsersId(data)),
        getUserImagesEx: (data) => dispatch(getUserImagesEx(data)),
        getUserGroupSettings: (data) => dispatch(getUserGroupSettings(data)),
        getUserPermissions: (data) => dispatch(getUserPermissions(data)),
        deleteUserKasm: (kasmId) => dispatch(deleteUserKasm(kasmId)),
        getAdminUsageDump: (userId) => dispatch(getAdminUsageDump(userId)),
        setPageInfo : (data)=> dispatch(setUsagePageInfo(data)),

    }))(ViewUserTranslated);