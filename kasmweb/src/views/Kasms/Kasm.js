import React, { Component } from "react";
import { connect } from "react-redux";
import { getKasm, createImageFromSession } from "../../actions/actionKasm";
import { destroyKasms,setKasmPageInfo } from "../../actions/actionDashboard";
import { Link } from "react-router-dom";
import DataTable from "../../components/Table/Table"
import {
  Row,
  Col,
  UncontrolledTooltip
} from "reactstrap";
import LoadingSpinner from "../../components/LoadingSpinner/index";
import { NotificationManager } from "react-notifications";

import Proptypes from "prop-types";
import moment from "moment";
import "moment-duration-format"
import CreateImageFromSessionForm from "../../components/CreateImageFromSession";
import PauseSessionModal from "../../components/Modals/PauseSessionModal";
import StartSessionModal from "../../components/Modals/StartSessionModal";
import StopSessionModal from "../../components/Modals/StopSessionModal";
import {withTranslation} from "react-i18next";
import { bytesToSize } from"../../utils/helpers"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTable } from '@fortawesome/pro-light-svg-icons/faTable';
import { faCamera } from '@fortawesome/pro-light-svg-icons/faCamera';
import { faPlay } from '@fortawesome/pro-light-svg-icons/faPlay';
import { faPause } from '@fortawesome/pro-light-svg-icons/faPause';
import { faStop } from '@fortawesome/pro-light-svg-icons/faStop';
import { faTrash } from '@fortawesome/pro-light-svg-icons/faTrash';
import PageHeader, { parentRoutes } from "../../components/Header/PageHeader";
import { CopyToClipboard } from "../../components/Form/Form";
import { Modal as FormModal } from "../../components/Form/Modal";
import { ConfirmAction } from "../../components/Table/NewTable";


class Kasms extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      createImageSessionModal: false,
      pauseToggle: false,
      startToggle: false,
      stopToggle: false,
      pages: 1,
      kasmId: null,
      dockerName: null,
      deleteClicked: false,

    };

    this.deleteConfirm = this.deleteConfirm.bind(this);
    this.deleteKasmAction = this.deleteKasmAction.bind(this);
    this.handleDeleteSuccess = this.handleDeleteSuccess.bind(this);
    this.handleDeleteError = this.handleDeleteError.bind(this);
    this.cancelDelete = this.cancelDelete.bind(this);

    this.createImageSessionConfirm = this.createImageSessionConfirm.bind(this);
    this.togglePauseModal = this.togglePauseModal.bind(this);
    this.toggleStartModal = this.toggleStartModal.bind(this);
    this.toggleStopModal = this.toggleStopModal.bind(this);
    this.cancelCreateImageSession = this.cancelCreateImageSession.bind(this);
  }

  componentDidMount() {
    this.props.getKasm();
  }

  deleteConfirm(kasmId) {
    this.setState({ modal: !this.state.modal, kasmId: kasmId });
  }

  cancelDelete() {
    this.setState({ modal: !this.state.modal });
  }

  deleteKasmAction() {
    this.setState({ deleteClicked: true });
    this.props
      .destroyKasms(this.state.kasmId)
      .then(() => this.handleDeleteSuccess())
      .catch(() => this.handleDeleteError());
  }

  handleDeleteSuccess() {
    const { destroyKasmsErrorMessage, t } = this.props;
    this.setState({ modal: false, deleteClicked: false });
    if (destroyKasmsErrorMessage) {
      NotificationManager.error(
        destroyKasmsErrorMessage,
        t('workspaces.Failed to Delete Session'),
        3000
      );
    } else {
      NotificationManager.success(
        t('workspaces.session-deleted-successfully'),
        t('workspaces.Delete Session'),
        3000
      );
      this.props.getKasm();
    }
  }

  handleDeleteError() {
    const { destroyKasmsError, t } = this.props;
    this.setState({ modal: false, deleteClicked: false });
    if (destroyKasmsError) {
      NotificationManager.error(
        destroyKasmsError,
        t('workspaces.Failed to Delete Session'),
        3000
      );
      this.props.history.push("/kasm");
    } else {
      NotificationManager.error(t('workspaces.Failed to Delete Session'), t('workspaces.Delete Session'), 3000);
      this.props.history.push("/kasm");
    }
  }



  createImageSessionConfirm(kasmId, dockerName) {
    this.setState({ createImageSessionModal: !this.state.createImageSessionModal, kasmId: kasmId, dockerName: dockerName });
  }

  cancelCreateImageSession() {
    this.setState({ createImageSessionModal: !this.state.createImageSessionModal, kasmId: null, dockerName: null });
  }

  togglePauseModal(kasmId, dockerName) {
    this.setState({ pauseToggle: !this.state.pauseToggle, kasmId: kasmId, dockerName: dockerName });
  }

  toggleStartModal(kasmId, dockerName) {
    this.setState({ startToggle: !this.state.startToggle, kasmId: kasmId, dockerName: dockerName });
  }

  toggleStopModal(kasmId, dockerName) {
    this.setState({ stopToggle: !this.state.stopToggle, kasmId: kasmId, dockerName: dockerName });
  }

  render() {
    if (this.props.getKasmLoading) {
      return (
        <div>
          <LoadingSpinner />
        </div>
      );
    }

    const { kasms, t } = this.props;

    const tableColumns = [
      {
        type: "text",
        name: t('workspaces.workspace'),
        accessor: "image.friendly_name",
        filterable: true,
        sortable: true,
        colSize: 'minmax(200px,1.2fr) ',
        cell: (data) => (
          <div>
            <Link to={"/updateworkspace/" + data.original.image_id}>
              {data.original.image.friendly_name}
            </Link>
          </div>
        ),
      },
      {
        type: "text",
        name: t('workspaces.kasm-id'),
        accessor: "kasm_id",
        filterable: true,
        sortable: true,
        cell: (data) => <React.Fragment><div><span id={"hostname-" + data.original.kasm_id}>{data.value.slice(0, 6)}...</span><CopyToClipboard value={data.value} /></div><UncontrolledTooltip placement="right" target={"hostname-" + data.original.kasm_id}>{data.value}</UncontrolledTooltip></React.Fragment>
      },
      {
        type: "text",
        name: t('workspaces.user'),
        accessor: "user.username",
        filterable: true,
        sortable: true,
        colSize: 'minmax(200px,1.2fr) ',
        cell: (data) => (
          <div>
            <Link to={"/updateuser/" + data.original.user_id}>
              {data.original.user.username}
            </Link>
          </div>
        ),
      },
      {
        type: "text",
        name: t('workspaces.status'),
        accessor: "operational_status",
        filterable: true,
        sortable: true,
      },
      {
        type: "date",
        name: t('workspaces.last-active'),
        accessor: "keepalive_date",
        filterable: true,
        reverseSort: true,
        sortable: true,
        cell: (data) => {
          if (!data.original.user_id || !data.original.keepalive_date) {
            return "--";
          }

          const now = moment.utc(data.original.current_time);
          const then = moment.utc(data.original.keepalive_date);
          const elapsedTime = moment.duration(now.diff(then));

          if (elapsedTime.asMinutes() < 5) {
            return <span className="text-success">{t('workspaces.logged-in')}</span>
          }

          return elapsedTime.format("hh:mm:ss", { trim: false });
        },
      },
      {
        type: "text",
        name: t('workspaces.agent'),
        accessor: "server.hostname",
        filterable: true,
        sortable: true,
        cell: (data) => (
          <div>
            <Link to={(data.original.image.image_type === 'Server' ? '/update_server/' : '/updateagent/') + data.original.server_id}>
              {data.original.server.hostname}
            </Link>
          </div>
        ),
      },
      {
        type: "text",
        name: t('workspaces.zone'),
        accessor: "server.zone_name",
        filterable: true,
        sortable: true,
      },
      {
        type: "text",
        name: t('workspaces.container-ip'),
        accessor: "container_ip",
        filterable: true,
        sortable: true,
      },
      {
        type: "date",
        name: t('workspaces.Uptime'),
        accessor: "created_date",
        filterable: true,
        sortable: true,
        reverseSort: true,
        cell: (data) => {
          const now = moment.utc(this.props.current_time);
          const then = moment.utc(data.original.created_date);
          const elapsedTime = moment.duration(now.diff(then));
          const format = elapsedTime.asDays() > 1 ? "d hh:mm:ss" : "hh:mm:ss";
          return elapsedTime.format(format, { trim: false });
        },
      },
      {
        name: t("workspaces.cores"),
        accessor: "cores",
        filterable: true,
        sortable: true,
        showByDefault: false
      },
      {
        type: "date",
        name: t("workspaces.expiration"),
        accessor: "expiration_date",
        filterable: true,
        sortable: true,
        showByDefault: false,
        cell: (data) => <div>{moment(data.value).isValid() ? moment.utc(data.value).local().fromNow() : "-"}</div>
      },
      {
        name: t("workspaces.hostname"),
        accessor: "hostname",
        filterable: true,
        sortable: true,
        showByDefault: false
      },

      {
        type: "date",
        name: t("workspaces.last-accessed"),
        accessor: "keepalive_date",
        filterable: true,
        sortable: true,
        showByDefault: false,
        cell: (data) => <div>{moment(data.value).isValid() ? moment.utc(data.value).local().fromNow() : "-"}</div>
      },
      {
        name: t("workspaces.memory"),
        accessor: "memory",
        filterable: true,
        sortable: true,
        showByDefault: false,
        cell: (data) => <div>{data.value ? bytesToSize(data.value) : "-"}</div>
      },
      {
        name: t("workspaces.persistent-profile"),
        accessor: "is_persistent_profile",
        filterable: true,
        sortable: true,
        showByDefault: false
      },
      {
        name: t("workspaces.share-id"),
        accessor: "share_id",
        filterable: true,
        sortable: true,
        showByDefault: false
      },

    ];

    const actions = [
      { id: "view", icon: "fa-eye", description: t('buttons.View') },
      { id: "start", icon: <FontAwesomeIcon icon={faPlay} />, description: t('workspaces.Start'),
        isHidden: (kasm) => kasm.image.image_type !== "Container" || !["stopped", "paused", "saving"].includes(kasm.operational_status)
      },
      { id: "stop", icon: <FontAwesomeIcon icon={faStop} />, description: t('workspaces.Stop'),
        isHidden: (kasm) => kasm.image.image_type !== "Container" ||  !["running", "paused"].includes(kasm.operational_status)
      },
      { id: "pause", icon: <FontAwesomeIcon icon={faPause} />, description: t('workspaces.Pause'),
        isHidden: (kasm) =>   kasm.image.image_type !== "Container" || !["running"].includes(kasm.operational_status)
      },
      { id: "create_image", icon: <FontAwesomeIcon icon={faCamera} />, description: t('workspaces.create-image'),
       isHidden: (kasm) => kasm.image.image_type !== "Container"
      },
      { id: "delete", icon: "fa-trash", description: t('workspaces.Delete') }
    ];

    const onAction = (action, item) => {
      switch (action) {
        case "view":
          this.props.history.push(`/viewkasm/${item.kasm_id}`);
        break;

        case "delete":
          this.deleteConfirm(item.kasm_id);
        break;
        case "deleteMulti":
          item.forEach(id => {
            this.props
            .destroyKasms(id)
            .then(() => this.handleDeleteSuccess())
            .catch(() => this.handleDeleteError());
          })
        break;

        case "create_image":
          this.createImageSessionConfirm(item.kasm_id, item.image.name);
        break;

        case "pause":
          this.togglePauseModal(item.kasm_id, item.image.name);
        break;

        case "stop":
          this.toggleStopModal(item.kasm_id, item.image.name);
        break;

        case "start":
          this.toggleStartModal(item.kasm_id, item.image.name);
        break;

      }
    }

    return (
      <div className="profile-page">
        <PageHeader location={this.props.location} routes={typeof newRoutes !== 'undefined' ? newRoutes : null} title={t('workspaces.sessions')} icon={<FontAwesomeIcon icon={faTable} />} />
        <Row>
          <Col sm={{ size: 10, order: 3, offset: 1 }}>
              <DataTable
                id="sessions"
                data={kasms}
                columns={tableColumns}
                actions={actions}
                onAction={onAction}
                mainId="kasm_id"
              />
          </Col>
        </Row>

        <ConfirmAction
            confirmationDetails={{
                action: null,
                details: {
                    title: t('workspaces.Delete Session'),
                    text: t('workspaces.are-you-sure-you-want-to-delet'),
                    iconBg: 'tw-bg-pink-700 tw-text-white',
                    icon: <FontAwesomeIcon icon={faTrash} />,
                    confirmBg: 'tw-bg-pink-700',
                    confirmText: t('buttons.Delete'),

                }
            }}
            open={this.state.modal}
            externalClose={true}
            setOpen={this.cancelDelete}
            onAction={this.deleteKasmAction}
        />


        <FormModal
          open={this.state.createImageSessionModal}
          setOpen={(value) => this.setState({ createImageSessionModal: value })}
          title="workspaces.create-workspace-image-from-se"
          contentRaw={
            <CreateImageFromSessionForm
              kasmId={this.state.kasmId}
              dockerName={this.state.dockerName}
              submit_api={""}
              cancel_button={this.cancelCreateImageSession}
            />
          }
        />

        <PauseSessionModal
            kasmId={this.state.kasmId}
            dockerName={this.state.dockerName}
            showModal={this.state.pauseToggle}
            toggleModalFunction={this.togglePauseModal}
            onSuccess={this.props.getKasm}
        />

        <StartSessionModal
            kasmId={this.state.kasmId}
            dockerName={this.state.dockerName}
            showModal={this.state.startToggle}
            toggleModalFunction={this.toggleStartModal}
            onSuccess={this.props.getKasm}
        />

        <StopSessionModal
            kasmId={this.state.kasmId}
            dockerName={this.state.dockerName}
            showModal={this.state.stopToggle}
            toggleModalFunction={this.toggleStopModal}
            onSuccess={this.props.getKasm}
        />



      </div>
    );
  }
}

Kasms.propTypes = {
  getKasm: Proptypes.func.isRequired,
  kasms: Proptypes.array,
  current_time: Proptypes.string,
  destroyKasms: Proptypes.func,
  destroyKasmsErrorMessage: Proptypes.string,
  destroyKasmsError: Proptypes.string,
  createImageFromSession: Proptypes.func,
  getkasmLoading: Proptypes.bool,
  className: Proptypes.func,
  history: Proptypes.object,
  getKasmLoading: Proptypes.bool,
};
const KasmsTranslated = withTranslation('common')(Kasms)
export default connect(
  (state) => {
    return ({
    kasms: state.kasms.kasms || [],
    current_time: state.kasms.current_time || null,
    getKasmLoading: state.kasms.getKasmLoading || false,
    destroyKasmsErrorMessage: state.dashboard.destroyKasmsErrorMessage || null,
    destroyKasmsLoading: state.dashboard.destroyKasmsLoading || false,
    destroyKasmsError: state.dashboard.destroyKasmsError || null,
    createdImageSession:  state.kasms.createdImageSession || null,
    pages : {pageSize : state.dashboard.pageSize, pageNo : state.dashboard.pageNo},

  })},
  (dispatch) => ({
    getKasm: () => dispatch(getKasm()),
    destroyKasms: (data) => dispatch(destroyKasms(data)),
    setPageInfo : (data)=> dispatch(setKasmPageInfo(data)),
    createImageFromSession: (data) => dispatch(createImageFromSession(data))

  })
)(KasmsTranslated);
