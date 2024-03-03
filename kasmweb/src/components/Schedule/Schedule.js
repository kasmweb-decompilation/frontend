import React, { Component } from "react";
import { connect } from "react-redux";
import { deleteSchedule, createSchedule, updateSchedule, getSchedules  } from "../../actions/actionSchedule";
import { getTimezones } from "../../actions/actionUser";
import { Field, reduxForm } from "redux-form";
import Proptypes from "prop-types";
import DataTable from "../../components/Table/Table";
import { NotificationManager } from "react-notifications";
import {withTranslation} from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBoxArchive } from '@fortawesome/pro-light-svg-icons/faBoxArchive';
import { faCircleMinus } from '@fortawesome/pro-light-svg-icons/faCircleMinus';
import { ConfirmAction } from "../../components/Table/NewTable";
import { FormField, Groups } from "../Form/Form";
import { Modal, ModalFooter } from "../Form/Modal";
import {renderField} from "../../utils/formValidations";
import SelectInput from "../SelectInput";

const defaultScheduleState = {
  daysOfTheWeek: [1, 2, 3, 4, 5],
  activeStartTime: "08:00",
  activeEndTime: "17:00",
  timezone: "Etc/UTC"
}

const defaultstate = {
  addScheduleModal: false,
  configEdit: false,
  saving: false,
  currentFile: {}
}

class Schedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...defaultstate,
      ...defaultScheduleState
    };
    this.openScheduleAddModal = this.openScheduleAddModal.bind(this);
    this.addSchedule = this.addSchedule.bind(this);
    this.handleSuccess = this.handleSuccess.bind(this);
    this.deleteScheduleConfirm = this.deleteScheduleConfirm.bind(this);
    this.deleteSchedule = this.deleteSchedule.bind(this);
    this.triggerUpdate = this.triggerUpdate.bind(this);
    this.getQueryData = this.getQueryData.bind(this);
    this.dropdownTimezone = this.dropdownTimezone.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.setActiveStartTime = this.setActiveStartTime.bind(this);
    this.setActiveEndTime = this.setActiveEndTime.bind(this);
    this.setDaysOfTheWeek = this.setDaysOfTheWeek.bind(this);

    this.props.getTimezones();
  }

  async dropdownTimezone(timezone) {
    this.setState({ timezone: timezone })
  }

  async componentDidMount() {
    let data = this.getQueryData()
    this.props.getSchedules(data);
  }

  async addSchedule(scheduleData) {
    this.setState({ saving: true })
    try {
      let data = {
        target_schedule: {
          days_of_the_week: scheduleData.daysOfTheWeek,
          active_start_time: scheduleData.activeStartTime,
          active_end_time: scheduleData.activeEndTime,
          timezone: scheduleData.timezone,
        }
      }
      if (this.props.type === "autoscale_config_id"){
        data.target_schedule.autoscale_config_id = this.props.autoscale_config_id
      }

      if (this.state.configEdit === true) {
        data.target_schedule.target_schedule_id = this.state.scheduleId;
        await this.props.updateSchedule(data)
      } else {
        await this.props.createSchedule(data)

      }

      this.handleSuccess()
    } catch (e) {
      this.handleFailure();
    }
  }

  getQueryData(){
    let data = {}
    if (this.props.type === "autoscale_config_id"){
      data = {
        target_autoscale_config_id : this.props.autoscale_config_id
      }
    }
    return data
  }

  triggerUpdate(item) {
    const editState = {
      scheduleId: item.schedule_id,
      daysOfTheWeek: item.days_of_the_week,
      activeStartTime: item.active_start_time,
      activeEndTime: item.active_end_time,
      timezone: item.timezone,
      }
    this.setState({
      ...editState,
      configEdit: true,
      addScheduleModal: true,
    })
    this.props.initialize(editState);
  }


  deleteScheduleConfirm(schedule_id) {
    const { t } = this.props;
    this.setState(
      {
        scheduleId: schedule_id,
        confirmationOpen: true,
        confirmationDetails: {
          details: {
            title: t('schedule.delete-schedules', { count: 1 }),
            text: t('schedule.delete-schedules-desc', { count: 1 }),
            iconBg: 'tw-bg-pink-700',
            icon: <FontAwesomeIcon icon={faCircleMinus} />,
            confirmBg: 'tw-bg-pink-700',
            confirmText: t('buttons.remove')
          },
        },
        onAction: this.deleteSchedule

      });
  }

  handleSuccess() {
    const { successMessage, failureMessage, t } = this.props;
    this.setState({ saving: false })
    if (failureMessage) {
      return this.handleFailure()
    }

    this.setState({ ...defaultstate });
    NotificationManager.success(t("schedule." + successMessage), t("schedule.schedule"), 3000);

    this.props.getSchedules(this.getQueryData())
  }

  handleFailure(){
    const { failureMessage, t } = this.props;
    this.setState({ saving: false })
    if (failureMessage) {
      NotificationManager.error(failureMessage, t("schedule.schedule"), 3000);
    } else {
      NotificationManager.error(t("schedule.something-went-wrong"), t("schedule.schedule"), 3000);
    }
  }

  async openScheduleAddModal(e){
    e.preventDefault();
    this.props.initialize(defaultScheduleState)
    this.setState({
      ...defaultstate,
      ...defaultScheduleState,
      addScheduleModal: !this.state.addScheduleModal,
    });
  }

  toggleModal() {
    this.setState({ addScheduleModal: !this.state.addScheduleModal });
  }

  async deleteSchedule(id) {
    const tryId = id || this.state.scheduleId
    const data = {
      target_schedule_id: tryId
    }
    try {
      await this.props.deleteSchedule(data);
      this.handleSuccess();
    } catch (e) {
      this.handleFailure();
    }
  }

  renderSchedules(schedules) {
    const { t } = this.props;
    const columns = [
      {
        type: "text",
        accessor: "days_of_the_week",
        name: t("schedule.days_of_the_week"),
        cell: (value) => {
          const daysOfWeekReference = [
            t("generic.Monday"),
            t("generic.Tuesday"),
            t("generic.Wednesday"),
            t("generic.Thursday"),
            t("generic.Friday"),
            t("generic.Saturday"),
            t("generic.Sunday")];
          let daysOfWeek = [];
          value.original.days_of_the_week.forEach(opt => {
                daysOfWeek.push(daysOfWeekReference[opt -1])});
          return daysOfWeek.join(', ');
        },
        filterable: true,
        sortable: true,
      },
      {
        type: "text",
        accessor: "active_start_time",
        name: t("schedule.active_start_time"),
        filterable: true,
        sortable: true,
      },
      {
        type: "text",
        accessor: "active_end_time",
        name: t("schedule.active_end_time"),
        filterable: true,
        sortable: true,
      },
      {
        type: "text",
        accessor: "timezone",
        name: t("schedule.timezone"),
        filterable: true,
        sortable: true,
      },
      {
        type: "text",
        accessor: "schedule_id",
        name: t("schedule.schedule_id"),
        filterable: true,
        sortable: true,
        showByDefault: false
      }
    ];

    const actions = [
      { id: "edit", icon: "fa-pencil", description: t("buttons.Edit") },
      { id: "remove", icon: <FontAwesomeIcon icon={faCircleMinus} />, description: t("buttons.remove") },
    ];

    const multiActions = [
      {
          name: t('buttons.remove'),
          action: 'removeMulti',
          confirm: { // If this is set, then a confirmation modal is triggered before the action is done
              title: t('schedule.delete-schedules', { count: 0 }),
              text: t('schedule.delete-schedules-desc', { count: 0 }),
              iconBg: 'tw-bg-pink-700',
              icon: <FontAwesomeIcon icon={faCircleMinus} />,
              confirmBg: 'tw-bg-pink-700',
              confirmText: t('buttons.remove')
          }
      }
  ]


    const onAction = async (action, item) => {
      switch (action) {
        case "edit":
          this.triggerUpdate(item)
          break;

        case "remove":
          this.deleteScheduleConfirm(item.schedule_id);
          break;
        case "removeMulti":
          item.forEach(id => {
            this.deleteSchedule(id)
          })
          break;
      }
    }

    return (

      <div>
        <DataTable
          id="schedule"
          data={schedules}
          columns={columns}
          actions={actions}
          multiActions={multiActions}
          onAction={onAction}
          mainId="schedule_id"
          add={{
            name: t("schedule.add-schedule"),
            onClick: this.openScheduleAddModal
          }}
        />
      </div>
    );
  }

  setActiveStartTime(event) {
    this.setState({ activeStartTime: event.target.value })
  }

  setActiveEndTime(event) {
    this.setState({ activeEndTime: event.target.value })
  }

  setDaysOfTheWeek(daysOfTheWeek) {
    daysOfTheWeek = daysOfTheWeek.sort();
    this.setState({ daysOfTheWeek });
  }

  render() {
    const { schedules, handleSubmit , allTimezones, t } = this.props;

    let optionTimezones = [];
    allTimezones.map(opt => {
      if (opt.label != "Auto" ) {
        optionTimezones.push({label: opt.label, value: opt.value});
      }
    });

    let optionDaysOfTheWeek = [
        {label: t("generic.Monday"),    value: 1},
        {label: t("generic.Tuesday"),   value: 2},
        {label: t("generic.Wednesday"), value: 3},
        {label: t("generic.Thursday"),  value: 4},
        {label: t("generic.Friday"),    value: 5},
        {label: t("generic.Saturday"),  value: 6},
        {label: t("generic.Sunday"),    value: 7},
    ];

    return (
      <div>
        {this.renderSchedules(schedules)}


        <Modal
          icon={<FontAwesomeIcon icon={faBoxArchive} />}
          iconBg="tw-bg-blue-500 tw-text-white"
          title="schedule.configure-schedule"
          contentRaw={
            <Groups noPadding section="schedule" className='tw-text-left tw-mt-8' onSubmit={handleSubmit(this.addSchedule)}>
              <p className="tw-pt-4 tw-text-xs" style={{ color: 'var(--text-color-muted-more)' }}>{t("schedule.configure schedule desc")}</p>
              <Field selectedValue={this.state.daysOfTheWeek}
                name="daysOfTheWeek"
                id="daysOfTheWeek"
                options={optionDaysOfTheWeek}
                multi
                onChange={this.setDaysOfTheWeek}
                required={true}
                isUpdateForm={true}
                component={SelectInput}
              />
              <FormField className="tw-flex tw-items-center tw-justify-between">
                <Field type="time"
                  value={this.state.activeStartTime}
                  name="activeStartTime"
                  id="activeStartTime"
                  required={true}
                  onChange={this.setActiveStartTime}
                  component={renderField}
                />
              </FormField>
              <FormField className="tw-flex tw-items-center tw-justify-between">
                <Field type="time"
                  value={this.state.activeEndTime}
                  name="activeEndTime"
                  id="activeEndTime"
                  required={true}
                  onChange={this.setActiveEndTime}
                  component={renderField}
                />
              </FormField>
              <Field selectedValue={this.state.timezone}
                options={optionTimezones}
                onChange={this.dropdownTimezone}
                name="timezone"
                id="timezone"
                required={true}
                isUpdateForm={true}
                component={SelectInput}
              />

              <ModalFooter saving={this.state.saving} cancel={this.toggleModal} saveName='buttons.Next' />

            </Groups>
          }
          open={this.state.addScheduleModal}
          setOpen={this.toggleModal}
        />


        {this.state.confirmationDetails && (
          <ConfirmAction
            confirmationDetails={this.state.confirmationDetails}
            open={this.state.confirmationOpen}
            setOpen={(value) => { this.setState({ confirmationOpen: value }) }}
            onAction={this.state.onAction}
          />

        )}

      </div>

    )
}}

Schedule.propTypes = {
  deleteSchedule: Proptypes.func.isRequired,
  updateSchedule: Proptypes.func.isRequired,
  createSchedule: Proptypes.func.isRequired,
  getSchedules: Proptypes.func.isRequired,
  getTimezones: Proptypes.func,
  handleSubmit: Proptypes.func,
  schedules: Proptypes.array,
  allTimezones: Proptypes.array,
};

let ScheduleForm = connect(state => ({
  successMessage: state.schedule.successMessage || null,
  failureMessage: state.schedule.failureMessage || null,
  schedules: state.schedule.schedules || [],
  allTimezones: state.user.allTimezones || [],
}),
  dispatch => ({
    deleteSchedule: (data) => dispatch(deleteSchedule(data)),
    createSchedule: (data) => dispatch(createSchedule(data)),
    updateSchedule: (data) => dispatch(updateSchedule(data)),
    getSchedules: (data) => dispatch(getSchedules(data)),
    getTimezones: () => dispatch(getTimezones()),
  }))(Schedule);
const ScheduleFormTranslated = withTranslation('common')(ScheduleForm)
export default reduxForm({
    form: "ScheduleForm",
})(ScheduleFormTranslated);
