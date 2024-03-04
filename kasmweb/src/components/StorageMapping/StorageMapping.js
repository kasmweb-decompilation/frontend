import React, { Component } from "react";
import { connect } from "react-redux";
import { deleteStorageMapping, createStorageMapping, updateStorageMapping, getStorageMappings, getAvailableStorageProviders  } from "../../actions/actionStorageMapping";
import { Field, reduxForm } from "redux-form";
import {
  renderField,
  renderPass,
  renderToggle,
  required, json,
} from "../../utils/formValidations.js";
import Proptypes from "prop-types";
import {SettingColumn} from "../../components/Table/NewTable";
import DataTable from "../../components/Table/Table";
import { NotificationManager } from "react-notifications";
import {withTranslation} from "react-i18next";
import SelectInput from "../SelectInput";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBoxArchive } from '@fortawesome/free-solid-svg-icons/faBoxArchive';
import { faCircleMinus } from '@fortawesome/free-solid-svg-icons/faCircleMinus';
import { ConfirmAction } from "../../components/Table/NewTable";
import { FormField, Groups } from "../Form/Form";
import { Modal, ModalFooter } from "../Form/Modal";

const defaultMappingState = {
  storageMappingType: 'Google Drive',
  storageMappingId: null,
  s3AccessKeyId: '',
  s3SecretAccessKey: '',
  s3Bucket: '',
  webdavUser: '',
  webdavPass: '',
  storageMappingName: '',
  storageMappingDescription: '',
  storageMappingConfig: '',
  storageMappingEnabled: true,
  storageMappingReadOnly: false,
  storageMappingTarget: '',
  storageProviderId: null,
}

const defaultstate = {
  addStorageModal: false,
  configEdit: false,
  saving: false,
  currentFile: {}
}

class StorageMapping extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...defaultstate,
      ...defaultMappingState
    };
    this.openStorageAddModal = this.openStorageAddModal.bind(this);
    this.addStorage = this.addStorage.bind(this);
    this.toggleMapping = this.toggleMapping.bind(this);
    this.handleSuccess = this.handleSuccess.bind(this);
    this.deleteStorageMappingConfirm = this.deleteStorageMappingConfirm.bind(this);
    this.deleteStorageMapping = this.deleteStorageMapping.bind(this);
    this.triggerUpdate = this.triggerUpdate.bind(this);
    this.setType = this.setType.bind(this);
    this.getQueryData = this.getQueryData.bind(this);
  }


async componentDidMount() {
  let data = this.getQueryData()
  this.props.getStorageMappings(data);
  this.props.getAvailableStorageProviders(data)
}

  async addStorage(userData) {
    this.setState({ saving: true })
    try {
      let data = {
        target_storage_mapping: {
          storage_provider_id: userData.storageProviderId,
          s3_access_key_id: userData.s3AccessKeyId,
          s3_secret_access_key: userData.s3SecretAccessKey,
          s3_bucket: userData.s3Bucket,
          webdav_user: userData.webdavUser,
          webdav_pass: userData.webdavPass,
          name: userData.storageMappingName,
          description: userData.storageMappingDescription,
          config: userData.storageMappingConfig,
          enabled: userData.storageMappingEnabled,
          read_only: userData.storageMappingReadOnly,
          return_url: window.location.href,
        }
      }
      if (this.props.type === "user_id"){
        data.target_storage_mapping.user_id = this.props.user_id
      }
      else if (this.props.type === "group_id"){
        data.target_storage_mapping.group_id = this.props.group_id
      }
      else if (this.props.type === "image_id"){
        data.target_storage_mapping.image_id = this.props.image_id
      }


      if (this.state.configEdit === true) {
        data.target_storage_mapping.storage_mapping_id = this.state.storageMappingId;
        await this.props.updateStorageMapping(data)
      } else {
        await this.props.createStorageMapping(data)

      }

      this.handleSuccess()
    } catch (e) {
      this.handleFailure();
    }
  }

  getQueryData(){
    let data = {}
    if (this.props.type === "user_id"){
      data = {
        target_storage_mapping : {
          user_id: this.props.user_id
        }
      }
    }
    else if (this.props.type === "group_id"){
      data = {
        target_storage_mapping : {
          group_id: this.props.group_id
        }
      }
    }
    else if (this.props.type === "image_id"){
      data = {
        target_storage_mapping : {
          image_id: this.props.image_id
        }
      }
    }
    return data
  }

  triggerUpdate(item) {
    const editState = {
        storageMappingId: item.storage_mapping_id,
        storageMappingName: item.storageMappingName,
        storageProviderId: item.storage_provider_id,
        storageMappingType: item.storage_provider_type,
        s3AccessKeyId: item.s3_access_key_id,
        s3SecretAccessKey: item.s3_secret_access_key,
        s3Bucket: item.s3_bucket,
        webdavUser: item.webdav_user,
        webdavPass: item.webdav_pass,
        storageMappingConfig: item.config,
        storageMappingEnabled: item.enabled,
        storageMappingReadOnly: item.read_only,
      }
      this.setState({
        ...editState,
        configEdit: true,
        addStorageModal: true,
      })
      this.props.initialize(editState);
    this.setType(item.storage_provider_id)

  }


  deleteStorageMappingConfirm(storage_mapping_id) {
    const { t } = this.props;
    this.setState(
      {
        storageMappingId: storage_mapping_id,
        confirmationOpen: true,
        confirmationDetails: {
            details: {
                title: t('storage_mapping.remove-mappings', { count: 1 }),
                text: t('storage_mapping.remove-mappings-desc', { count: 1 }),
                iconBg: 'tw-bg-pink-700',
                icon: <FontAwesomeIcon icon={faCircleMinus} />,
                confirmBg: 'tw-bg-pink-700',
                confirmText: t('buttons.remove')
            },
        },
        onAction: this.deleteStorageMapping

      });
  }

  handleSuccess() {
    const { successMessage, failureMessage, redirectUrl, t } = this.props;
    this.setState({ saving: false })
    if (failureMessage) {
      return this.handleFailure()
    }

    this.setState({ ...defaultstate });
    NotificationManager.success(t("storage_mapping." + successMessage), t("storage_mapping.storage-mapping"), 3000);

    if (redirectUrl){
      window.location.href = redirectUrl;
    }
    else{
      this.props.getStorageMappings(this.getQueryData())
    }
  }

  handleFailure() {
    const { failureMessage, t } = this.props;
    this.setState({ saving: false })
    if (failureMessage) {
      NotificationManager.error(failureMessage, t("storage_mapping.storage-mapping"), 3000);
    } else {
      NotificationManager.error(t("storage_mapping.something-went-wrong"), t("storage_mapping.storage-mapping"), 3000);
    }
  }

  async openStorageAddModal(e) {
    e.preventDefault();
    this.props.initialize(defaultMappingState)
    this.setState({
      ...defaultstate,
      ...defaultMappingState,
      addStorageModal: !this.state.addStorageModal,
    });
  }

  toggleMapping() {
    this.setState({ addStorageModal: !this.state.addStorageModal });
  }

  async deleteStorageMapping(id) {
    const tryId = id || this.state.storageMappingId
    const data = {
      target_storage_mapping: {
        storage_mapping_id: tryId
      }
    }
    try {
      await this.props.deleteStorageMapping(data);
      this.handleSuccess();
    } catch (e) {
      this.handleFailure();
    }
  }

  renderStorageMappings(storageMappings) {
    const { t } = this.props;
    const columns = [
      {
        type: "text",
        accessor: "name",
        name: t("storage_mapping.name"),
        filterable: true,
        sortable: true,
      },
      {
        type: "text",
        accessor: "storage_provider_type",
        name: t("storage_mapping.storage-provider-type"),
        filterable: true,
        sortable: true,
        showByDefault: false
      },
      {
        type: "text",
        accessor: "storage_mapping_id",
        name: t("storage_mapping.storage_mapping_id"),
        filterable: true,
        sortable: true,
        showByDefault: false
      },

      {
        type: "flag",
        accessor: "enabled",
        name: t("storage_mapping.enabled"),
        filterable: true,
        sortable: true,
        overwrite: true,
        cell: (data) => <SettingColumn key={'enabled-' + data.original.storage_mapping_id} main={data.value} sub={data.colName} />
      },
      {
        type: "flag",
        accessor: "read_only",
        name: t("storage_mapping.read_only"),
        filterable: true,
        sortable: true,
        overwrite: true,
        cell: (data) => <SettingColumn key={'read_only-' + data.original.storage_mapping_id} main={data.value} sub={data.colName} />
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
              title: t('storage_mapping.remove-mappings', { count: 0 }),
              text: t('storage_mapping.remove-mappings-desc', { count: 0 }),
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
          this.deleteStorageMappingConfirm(item.storage_mapping_id);
          break;
        case "removeMulti":
          item.forEach(id => {
            this.deleteStorageMapping(id)
          })
          break;

      }

    }

    return (

      <div>
        <DataTable
          id="user-cloud-storage"
          data={storageMappings}
          columns={columns}
          actions={actions}
          multiActions={multiActions}
          onAction={onAction}
          mainId="storage_mapping_id"
          add={{
            name: t("storage_mapping.add-storage-mapping"),
            onClick: this.openStorageAddModal
          }}
        />
      </div>
    );
  }

  setType(value) {
    const { storageProviders } = this.props;
    const storageProvider = storageProviders.find(obj => obj.storage_provider_id === value);
    if (storageProvider) {
      this.setState({
        storageMappingType: storageProvider.storage_provider_type,
        storageProviderId: value,
      })
    }
  }

  render() {
    const { storageMappings, storageProviders, handleSubmit , storageFormValues, t } = this.props;
    let optionsStorageProviders = [];
    storageProviders.map(opt => {
        optionsStorageProviders.push({label: opt.name, value: opt.storage_provider_id});
    });
    optionsStorageProviders.sort((a, b) => (a.label.toLowerCase() > b.label.toLowerCase()) ? 1 : -1);
    return (
      <div>

        <p className="tw-bg-slate-500 dark:tw-bg-sky-900 tw-text-white tw-p-4 tw-rounded">
          {t("storage_mapping.map_inside")}
        </p>
        {this.renderStorageMappings(storageMappings)}


        <Modal
          icon={<FontAwesomeIcon icon={faBoxArchive} />}
          iconBg="tw-bg-blue-500 tw-text-white"
          title="storage_mapping.configure-storage"
          contentRaw={
            <Groups noPadding section="storage_mapping" className='tw-text-left tw-mt-8' onSubmit={handleSubmit(this.addStorage)}>
              <p className="tw-pt-4 tw-text-xs" style={{ color: 'var(--text-color-muted-more)' }}>{t("storage_mapping.storage text")}</p>
              {this.state.configEdit !== true && (
                <FormField section="storage_mapping">
                  <Field type="text"
                    onChange={this.setType}
                    selectedValue={this.state.storageProviderId}
                    name="storageProviderId"
                    id="storageProviderId"
                    component={SelectInput}
                    validate={required} required
                    disabled={this.state.configEdit}
                    options={optionsStorageProviders}>
                  </Field>

                </FormField>
              )}
              <FormField section="storage_mapping" className="tw-flex tw-items-center tw-justify-between">
                <Field type="text"
                  checked={this.state.storageMappingEnabled}
                  name="storageMappingEnabled"
                  id="storageMappingEnabled"
                  component={renderToggle}
                />
              </FormField>
              <FormField section="storage_mapping" className="tw-flex tw-items-center tw-justify-between">

                <Field type="text"
                  checked={this.state.storageMappingReadOnly}
                  name="storageMappingReadOnly"
                  id="storageMappingReadOnly"
                  component={renderToggle}
                />

              </FormField>

              {this.state.storageMappingType && this.state.storageMappingType === 'S3' && (
                <React.Fragment>
                  <FormField section="storage_mapping">
                    <Field type="text"
                      name="s3AccessKeyId"
                      id="s3AccessKeyId"
                      component={renderField}
                      validate={required} required
                    />
                  </FormField>

                  <FormField section="storage_mapping">
                    <Field type="text"
                      name="s3SecretAccessKey"
                      id="s3SecretAccessKey"
                      component={renderPass}
                      validate={required} required
                    />
                  </FormField>
                  <FormField section="storage_mapping">
                    <Field type="text"
                      name="s3Bucket"
                      id="s3Bucket"
                      component={renderField}
                      validate={required} required
                    />

                  </FormField>
                </React.Fragment>
              )}
              {this.state.storageMappingType && this.state.storageMappingType === 'Nextcloud' && (
                <React.Fragment>
                  <FormField section="storage_mapping">
                    <Field type="text"
                      name="webdavUser"
                      id="webdavUser"
                      component={renderField}
                      validate={required} required
                    />

                  </FormField>
                  <FormField section="storage_mapping">
                    <Field type="text"
                      name="webdavPass"
                      id="webdavPass"
                      component={renderPass}
                      validate={required} required
                    />
                  </FormField>

                </React.Fragment>
              )}

              <ModalFooter saving={this.state.saving} cancel={this.toggleMapping} saveName='buttons.Next' />

            </Groups>
          }
          open={this.state.addStorageModal}
          setOpen={this.toggleMapping}
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

StorageMapping.propTypes = {
  StorageMappings: Proptypes.array,
};

let StorageMappingForm = connect(state => ({
  successMessage: state.storage_mapping.successMessage || null,
  failureMessage: state.storage_mapping.failureMessage || null,
  storageMappings: state.storage_mapping.storageMappings || [],
  storageProviders: state.storage_mapping.storageProviders || [],
  redirectUrl: state.storage_mapping.redirectUrl || null,
}),
  dispatch => ({
    deleteStorageMapping: (data) => dispatch(deleteStorageMapping(data)),
    createStorageMapping: (data) => dispatch(createStorageMapping(data)),
    updateStorageMapping: (data) => dispatch(updateStorageMapping(data)),
    getStorageMappings: (data) => dispatch(getStorageMappings(data)),
    getAvailableStorageProviders: (data) => dispatch(getAvailableStorageProviders(data)),
  }))(StorageMapping);
const StorageMappingFormTranslated = withTranslation('common')(StorageMappingForm)
export default reduxForm({
    form: "StorageMappingForm",
})(StorageMappingFormTranslated);
