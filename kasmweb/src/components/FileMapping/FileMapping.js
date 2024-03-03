import React, { Component } from "react";
import { connect } from "react-redux";
import { getFileMappings, createFileMapping, deleteFileMapping, updateFileMapping, uploadFileMapping } from "../../actions/actionFileMapping";
import { Modal, ModalFooter, Form, Button, Label} from "reactstrap";
import { Field, reduxForm, formValueSelector } from "redux-form";
import { renderField, renderSelectField, renderTextArea2, renderToggle, required } from "../../utils/formValidations.js";
import Proptypes from "prop-types";
import DataTable from "../../components/Table/Table";
import { ConfirmAction, SettingColumn, ToggleColumn } from "../../components/Table/NewTable";
import { NotificationManager } from "react-notifications";
import Dropzone from "react-dropzone";
import {withTranslation} from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from "@fortawesome/pro-light-svg-icons/faTrash";
import { faFloppyDisk } from "@fortawesome/pro-light-svg-icons/faFloppyDisk";
import { faCircleNotch } from "@fortawesome/pro-light-svg-icons/faCircleNotch";

const defaultMappingState = {
  fileMapType: 'text',
  fileMapName: '',
  fileMapDescription: '',
  fileMapDestination: '',
  fileMapContent: '',
  fileMapId: null,
  fileMapExecutable: false,
  fileMapWritable: false
}

const defaultstate = {
  addMappingModal: false,
  mappingEdit: false,
  deleteMappingModal: false,
  saving: false,
  currentFile: {}
}

class FileMapping extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...defaultstate,
      ...defaultMappingState
    };
    this.openMappingAddModal = this.openMappingAddModal.bind(this);
    this.addMapping = this.addMapping.bind(this);
    this.toggleMapping = this.toggleMapping.bind(this);
    this.handleSuccess = this.handleSuccess.bind(this);
    this.deleteMappingConfirm = this.deleteMappingConfirm.bind(this);
    this.toggleDeleteMappingModal = this.toggleDeleteMappingModal.bind(this);
    this.deleteMapping = this.deleteMapping.bind(this);
    this.setType = this.setType.bind(this);
    this.toggleState = this.toggleState.bind(this);
  }

async componentDidMount() {
  this.props.getFileMappings({ [this.props.type]: this.props[this.props.type] });
}

  async addMapping(userData) {
    this.setState({ saving: true })

    try {
      let data = {
        target_file_map: {
          name: userData.fileMapName,
          description: userData.fileMapDescription,
          destination: userData.fileMapDestination,
          content: this.state.fileMapType === 'text' && userData.fileMapContent || null,
          is_executable: userData.fileMapExecutable,
          is_writable: userData.fileMapWritable,
          file_type: userData.fileMapType,
          ufile: this.state.fileMapType === 'binary' && this.state.currentFile || null,
        }
      }

      data.target_file_map[this.props.type] = this.props[this.props.type];
      if (data.target_file_map.file_type === 'binary') {
        if (this.state.mappingEdit === true) {
          data.target_file_map.file_map_id = this.state.fileMapId;
        }
        await this.props.uploadFileMapping(data)
      } else {
        if (this.state.mappingEdit === true) {
          data.target_file_map.file_map_id = this.state.fileMapId;
          await this.props.updateFileMapping(data)
        } else {
          await this.props.createFileMapping(data)

        }
      }
      this.handleSuccess()
    } catch (e) {
      this.handleFailure();
    }
  }

  async toggleState(e, userData) {
    const validToggles = ['is_writable', 'is_executable'];
    if(validToggles.indexOf(e.target.name) !== -1) {
    try {
      let data = {
        target_file_map: {
          ...userData
        }
      }

      data.target_file_map[e.target.name] = e.target.checked;
      await this.props.updateFileMapping(data)
      this.handleSuccess()
    } catch (e) {
      this.handleFailure();
    }
  }

  } 

  toggleDeleteMappingModal() {
    this.setState({
      deleteMappingModal: !this.state.deleteMappingModal,
    });
  }

  deleteMappingConfirm(file_map_id) {
    this.setState(
      {
        deleteMappingModal: !this.state.deleteMappingModal,
        fileMapId: file_map_id
      });
  }

  handleSuccess() {
    const { successMessage, failureMessage, t } = this.props;
    this.setState({ saving: false })

    if (failureMessage) {
      return this.handleFailure()
    }

    this.setState({ ...defaultstate });
    NotificationManager.success(t("file_mapping.notify-update-success"), t("file_mapping.File Mapping"), 3000);
    this.props.getFileMappings({ [this.props.type]: this.props[this.props.type] });
  }

  handleFailure() {
    const { failureMessage, t } = this.props;
    this.setState({ saving: false })
    if (failureMessage) {
      NotificationManager.error(failureMessage, t("file_mapping.File Mapping"), 3000);
    } else {
      NotificationManager.error(t("file_mapping.Something Went Wrong"), t("file_mapping.File Mapping"), 3000);
    }
  }

  async openMappingAddModal(e) {
    e.preventDefault();
    this.props.initialize(defaultMappingState)
    this.setState({
      ...defaultstate,
      ...defaultMappingState,
      addMappingModal: !this.state.addMappingModal,
    });
  }

  toggleMapping() {
    this.setState({ addMappingModal: !this.state.addMappingModal });
  }

  async deleteMapping(id) {
    const tryId = id || this.state.fileMapId
    const data = {
      target_file_map: {
        file_map_id: tryId //this.state.file_map_id
      }
    }
    try {
      await this.props.deleteFileMapping(data);
      this.handleSuccess();
    } catch (e) {
      this.handleFailure();
    }
  }

  renderFileMapping() {
    const { t } = this.props;
    const columns = [
      {
        type: "text",
        accessor: "name",
        name: t("file_mapping.Name"),
        filterable: true,
        sortable: true,
      },
      {
        type: "text",
        accessor: "description",
        name: t("file_mapping.Description"),
        filterable: true,
        sortable: true
      },
      {
        type: "text",
        accessor: "destination",
        name: t("file_mapping.Destination"),
        filterable: true,
        sortable: true
      },
      {
        type: "text",
        accessor: "is_writable",
        name: t("file_mapping.Writable"),
        overwrite: true,
        cell: (data) => <ToggleColumn key={'is_writable-' + data.original.file_map_id} id="file_map_id" column="is_writable" data={data} onChange={(e) => this.toggleState(e, data.original)} />
      },
      {
        type: "text",
        accessor: "is_executable",
        name: t("file_mapping.Executable"),
        overwrite: true,
        cell: (data) => <ToggleColumn key={'is_executable-' + data.original.file_map_id} id="file_map_id" column="is_executable" data={data} onChange={(e) => this.toggleState(e, data.original)} />
      },
    ];

    const actions = [
      { id: "edit", icon: "fa-pencil", description: t("buttons.Edit") },
      { id: "delete", icon: "fa-trash", description: t("buttons.Delete") },
    ];

    const onAction = async (action, item) => {
      switch (action) {
        case "edit":
          const editState = {
            fileMapId: item.file_map_id,
            fileMapType: item.file_type,
            fileMapName: item.name,
            fileMapDescription: item.description,
            fileMapDestination: item.destination,
            fileMapContent: item.content,
            fileMapExecutable: item.is_executable,
            fileMapWritable: item.is_writable,
          }
          this.setState({
            ...editState,
            mappingEdit: true,
            addMappingModal: true,
          })
          this.props.initialize(editState);
        
          break;

        case "delete":
          this.deleteMappingConfirm(item.file_map_id);
          break;
        case "deleteMulti":
          item.forEach(id => {
            this.deleteMapping(id)
          })
          break;

      }
    }

    return (
      <div>
        <DataTable
          id="image-file-mapping"
          data={this.props.fileMapping.filter(el => el[this.props.type] === this.props[this.props.type].replace(/-/g, ""))}
          columns={columns}
          actions={actions}
          onAction={onAction}
          mainId="file_map_id"
          add={{
            name: t("file_mapping.Add File Mapping"),
            onClick: this.openMappingAddModal
          }}
        />
      </div>
    );
  }

  setType(event) {
    this.setState({ fileMapType: event.target.value })
  }

  render() {
    const { fileMapping, handleSubmit, t } = this.props;
    return (
      <div>
                  <p className="tw-bg-slate-500 dark:tw-bg-sky-900 tw-text-white tw-p-4 tw-rounded">
                  {t("file_mapping.map_inside")}
                  </p>
                {this.renderFileMapping(fileMapping)}
        <Modal style={{ maxWidth: '100%', minHeight: '100vh' }} centered={false} isOpen={this.state.addMappingModal} toggle={this.toggleMapping} className="blank-modal tw-p-4 md:tw-p-10">
          <Form onSubmit={handleSubmit(this.addMapping)}>
              <div className="tw-flex tw-flex-col md:tw-flex-row">
                <div className="tw-flex tw-flex-col tw-w-full md:tw-max-w-xs tw-p-8">
                  <div className="tw-font-bold tw-uppercase tw-tracking-loose">{t("file_mapping.File Mapping")}</div>
                  <p className="tw-pt-4 tw-text-xs" style={{ color: 'var(--text-color-muted-more)'}}>{t("file_mapping.mapping_text")}</p>
                  <div className="tw-mb-6">
                    <Label className="requiredasterisk tw-text-xs tw-font-bold">{t("file_mapping.Type")}:&nbsp;</Label>
                    <Field type="text"
                        onChange={this.setType}
                        name="fileMapType"
                        id="fileMapType"
                        component={renderSelectField}
                        validate={required} required
                        disabled={this.state.mappingEdit}
                    >
                      <option value='text'>{t("file_mapping.Text")}</option>
                      <option value='binary'>{t("file_mapping.File Upload")}</option>
                    </Field>

                  </div>
                  <div className="tw-mb-6">
                    <Label className="requiredasterisk tw-text-xs tw-font-bold">{t("file_mapping.Name")}:&nbsp;</Label>
                    <Field type="text"
                        name="fileMapName"
                        id="fileMapName"
                        component={renderField}
                        validate={required} required
                    />
                  </div>
                  <div className="tw-mb-6">
                    <Label className="requiredasterisk tw-text-xs tw-font-bold">{t("file_mapping.Description")}:&nbsp;</Label>
                    <Field type="text"
                        name="fileMapDescription"
                        id="fileMapDescription"
                        component={renderField}
                        validate={required} required
                    />

                  </div>
                  <div className="tw-mb-6">
                    <Label className="requiredasterisk tw-text-xs tw-font-bold">{t("file_mapping.Destination Path")}:&nbsp;</Label>
                    <Field type="text"
                        name="fileMapDestination"
                        id="fileMapDestination"
                        component={renderField}
                        validate={required} required
                    />
                  </div>
                  <div className="tw-flex tw-items-center tw-justify-between">
                    <label className="tw-text-xs tw-font-bold" htmlFor="fileMapExecutable">{t("file_mapping.Executable")}:</label>
                    <Field type="text"
                        checked={this.state.fileMapExecutable || false}
                        name="fileMapExecutable"
                        id="fileMapExecutable"
                        component={renderToggle}
                    />
                  </div>

                  <div className="tw-mb-6 tw-flex tw-items-center tw-justify-between">
                    <label className="tw-text-xs tw-font-bold" htmlFor="fileMapWritable">{t("file_mapping.Writable")}:</label>
                    <Field type="text"
                        checked={this.state.fileMapWritable || false}
                        name="fileMapWritable"
                        id="fileMapWritable"
                        component={renderToggle}
                    />

                  </div>
                </div>
                <div className="tw-w-full tw-flex tw-items-center tw-justify-center tw-left-shadow tw-border-solid tw-border-0 tw-border-black/10 dark:tw-border-slate-700/70 md:tw-border-l tw-p-8">
                  {this.state.fileMapType && this.state.fileMapType === 'text' && (
                    <Field 
                      className=""
                      type="textarea"
                        name="fileMapContent"
                        id="fileMapContent"
                        component={renderTextArea2}
                        validate={required} required
                    />
                  )}
                  {this.state.fileMapType && this.state.fileMapType === 'binary' && (
                    <div className="drag-area tw-flex tw-items-center tw-h-full tw-justify-center tw-w-full">
                      <Dropzone onDrop={acceptedFiles => this.setState({ currentFile: acceptedFiles[0]})} className="tw-flex tw-flex-col tw-h-full tw-items-center tw-justify-center tw-w-full tw-border-2 tw-border-gray-300 tw-border-dashed tw-rounded-lg tw-cursor-pointer tw-bg-gray-50 dark:hover:bg-bray-800 dark:tw-bg-gray-700 hover:bg-gray-100 dark:tw-border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                      <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-p-5 tw-pb-6">
                                <svg aria-hidden="true" className="tw-w-10 tw-h-10 tw-mb-3 tw-text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                                <p className="tw-mb-2 tw-text-center tw-text-sm tw-text-gray-500 dark:tw-text-gray-400"><span className="tw-font-semibold">{t("file_mapping.Click to upload")}</span> {t("file_mapping.or drag and drop")} <br />({t("file_mapping.filesize")})</p>
                                { this.state.currentFile && this.state.currentFile.type && this.state.currentFile.type.startsWith('image') && <p><img className="tw tw-h-10 tw-object-contain" src={this.state.currentFile.preview} /></p>}
                                { this.state.currentFile  && <p className="tw-text-xs tw-text-gray-500 dark:tw-text-gray-400">{this.state.currentFile.name}</p>}

                            </div>
                      </Dropzone>
                    </div> 
                  )}
                </div>
              </div>
            <ModalFooter className="tw-border-black/10 dark:tw-border-slate-700/70">
              <Button onClick={this.toggleMapping}
                className="cancel-button"
                style={{color: 'var(--text-color)'}}
                size="sm" color="basic"> {t("buttons.Cancel")}</Button>
                <button type="submit" disabled={this.state.saving} className="tw-rounded tw-h-10 tw-bg-blue-500 hover:tw-bg-blue-600 tw-text-sm tw-text-white tw-flex tw-items-center tw-transition">
                  <span className="tw-px-4">{t("buttons.Save")}</span>
                  <span className="tw-h-10 tw-w-12 tw-flex tw-justify-center tw-items-center tw-bg-black/10">{!this.state.saving ? <FontAwesomeIcon icon={faFloppyDisk} /> :  <FontAwesomeIcon icon={faCircleNotch} spin />}</span>
                </button>
            </ModalFooter>
          </Form>
        </Modal>


        <ConfirmAction
          confirmationDetails={{
            action: null,
            details: {
              title: t('file_mapping.File Mapping'),
              text: t('file_mapping.confirm_delete'),
              iconBg: 'tw-bg-pink-700 tw-text-white',
              icon: <FontAwesomeIcon icon={faTrash} />,
              confirmBg: 'tw-bg-pink-700',
              confirmText: t('buttons.Delete'),

            }
          }}
          open={this.state.deleteMappingModal}
          externalClose={true}
          setOpen={this.toggleDeleteMappingModal}
          onAction={this.deleteMapping}
        />

      </div>
    )
  }
}

FileMapping.propTypes = {
  optMappings: Proptypes.array,
  sso_id: Proptypes.string,
  sso_type: Proptypes.string,
  fileMapping: Proptypes.array,
};

let FileMappingForm = connect(state => ({
  optMappings: state.file_mapping.optMappings || [],
  fileMapping: state.file_mapping.fileMapping || [],
  successMessage: state.file_mapping.successMessage || null,
  failureMessage: state.file_mapping.failureMessage || null,
}),
  dispatch => ({
    getFileMappings: (data) => dispatch(getFileMappings(data)),
    createFileMapping: (data) => dispatch(createFileMapping(data)),
    updateFileMapping: (data) => dispatch(updateFileMapping(data)),
    uploadFileMapping: (data) => dispatch(uploadFileMapping(data)),
    deleteFileMapping: (data) => dispatch(deleteFileMapping(data))
  }))(FileMapping);
const FileMappingFormTranslated = withTranslation('common')(FileMappingForm)
export default reduxForm({
    form: "FileMappingForm",
})(FileMappingFormTranslated);
