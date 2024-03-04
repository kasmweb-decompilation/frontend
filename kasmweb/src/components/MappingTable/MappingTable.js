import React, { Component } from "react";
import { connect } from "react-redux";
import { getAttributeFields, createAttributeField, updateAttributeField, deleteAttributeField, getMappedFields } from "../../actions/actionAttributeMapping";
import { Input } from "reactstrap";
import Select from "react-select";
import Proptypes from "prop-types";
import DataTable from "../../components/Table/Table";
import { NotificationManager } from "react-notifications";
import {withTranslation} from "react-i18next";
import { Modal, ModalFooter } from "../Form/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListCheck } from "@fortawesome/free-solid-svg-icons/faListCheck";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import { FormField, Groups } from "../Form/Form";
import { ConfirmAction } from "../Table/NewTable";


const defaultstate = {
  userField: null,
  attributeName: '',
  addMappingModal: false,
  mappingEdit: false,
  attributeId: null,
  deleteMappingModal: false,
}

class MappingTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...defaultstate
    };
    this.openMappingAddModal = this.openMappingAddModal.bind(this);
    this.handleMappingDropDown = this.handleMappingDropDown.bind(this);
    this.addMapping = this.addMapping.bind(this);
    this.toggleMapping = this.toggleMapping.bind(this);
    this.handleSuccess = this.handleSuccess.bind(this);
    this.deleteMappingConfirm = this.deleteMappingConfirm.bind(this);
    this.toggleDeleteMappingModal = this.toggleDeleteMappingModal.bind(this);
    this.deleteMapping = this.deleteMapping.bind(this);
  }

  async addMapping(event) {
    event.preventDefault()
    event.stopPropagation()
    try {
      let data = {
        target_sso_attribute_mapping: {
          attribute_name: event.target['attributeName'].value,
          user_field: event.target['userField'].value
        }
      }
      if (this.state.mappingEdit === true) {
        data.target_sso_attribute_mapping.sso_attribute_id = this.state.attributeId;
        await this.props.updateAttributeField(data)
      } else {
        data.target_sso_attribute_mapping.sso_id = this.props.sso_id;
        await this.props.createAttributeField(data)
      }
      this.handleSuccess()
    } catch (e) {
      this.handleFailure();
    }
  }

  toggleDeleteMappingModal() {
    this.setState({
      deleteMappingModal: !this.state.deleteMappingModal,
    });
  }

  deleteMappingConfirm(sso_attribute_id) {
    this.setState(
      {
        deleteMappingModal: !this.state.deleteMappingModal,
        attributeId: sso_attribute_id
      });
  }

  handleSuccess() {
    const { successMessage, failureMessage, t } = this.props;

    if (failureMessage) {
      return this.handleFailure()
    }

    this.setState({ ...defaultstate });
    NotificationManager.success(successMessage, t("mapping.Attribute Mapping"), 3000);
    this.props.getMappedFields({ sso_id: this.props.sso_id });
  }

  handleFailure() {
    const { failureMessage, t } = this.props;
    if (failureMessage) {
      NotificationManager.error(failureMessage, t("mapping.Attribute Mapping"), 3000);
    } else {
      NotificationManager.error(t("mapping.Something Went Wrong"), t("mapping.Attribute Mapping"), 3000);
    }
  }

  async openMappingAddModal(e) {
    e.preventDefault();
    this.setState({
      ...defaultstate,
      addMappingModal: !this.state.addMappingModal,
    });
  }

  handleMappingDropDown(value) {
    this.setState({ userField: value });
  }

  toggleMapping() {
    this.setState({ addMappingModal: !this.state.addMappingModal });
  }

  async componentDidMount() {
    const mappings = await this.props.getAttributeFields();
    let maplist = []
    mappings.response.fields.forEach(element => maplist.push({
      label: element,
      value: element
    }))
    this.setState({ optMappings: maplist });
    this.props.getMappedFields({ sso_id: this.props.sso_id });
  }

  async deleteMapping() {
    const data = {
      sso_attribute_id: this.state.attributeId
    }
    try {
      await this.props.deleteAttributeField(data);
      this.handleSuccess();
    } catch (e) {
      this.handleFailure();
    }
  }

  renderAttributeMapping() {
    const { t } = this.props;
    const columns = [
      {
        type: "text",
        accessor: "user_field",
        name: t("mapping.User Field"),
        filterable: true,
        sortable: true,
        colSize: 'minmax(130px, 1.2fr)'
      },
      {
        type: "text",
        accessor: "attribute_name",
        name: t("mapping.Attribute"),
        filterable: true,
        sortable: true
      },
    ];

    const actions = [
      { id: "edit", icon: "fa-pencil", description: t("buttons.Edit") },
      { id: "delete", icon: "fa-trash", description: t("buttons.Delete") },
    ];

    const onAction = async (action, item) => {
      switch (action) {
        case "edit":
          this.setState({
            addMappingModal: true,
            mappingEdit: true,
            attributeId: item.sso_attribute_id,
            attributeName: item.attribute_name,
            userField: item.user_field
          })
          break;

        case "delete":
          this.deleteMappingConfirm(item.sso_attribute_id);
          break;
        case "deleteMulti":
            item.forEach(id => {
              const data = {
                sso_attribute_id: id
              }
              this.props.deleteAttributeField(data).
              then(() => this.handleSuccess()).
              catch(() => this.handleFailure());
            })
        break;

      }
    }

    return (
      <div>
        <DataTable
          id="sso-attribute-mapping"
          data={this.props.attributeMapping}
          columns={columns}
          actions={actions}
          onAction={onAction}
          mainId="sso_attribute_id"
          add={{
            name: t("mapping.Add SSO Mapping"),
            onClick: this.openMappingAddModal
          }}
        />
      </div>
    );
  }

  render() {
    const { attributeMapping, t } = this.props;
    let optMappings = this.state.optMappings;
    return (
      <div>
        <p className="tw-bg-slate-500 dark:tw-bg-sky-900 tw-text-white tw-p-4 tw-rounded">
          {t("mapping.map_atts", { sso_type: this.props.sso_type })}
        </p>
        {this.renderAttributeMapping(attributeMapping)}

        <Modal
          icon={<FontAwesomeIcon icon={faListCheck} />}
          iconBg="tw-bg-blue-500 tw-text-white"
          title="mapping.Attribute Mapping"
          contentRaw={
            <Groups className="tw-text-left tw-mt-8" noPadding section="mapping" onSubmit={this.addMapping}>
              <FormField label="User Field">
                <Select
                  id="state-select"
                  autoFocus
                  value={this.state.userField}
                  options={optMappings}
                  name="userField"
                  onChange={this.handleMappingDropDown}
                />
              </FormField>
              <FormField rawLabel={t("mapping.sso_attribute", { sso_type: this.props.sso_type })}>
                <Input name="attributeName" type="text" defaultValue={this.state.attributeName} />
              </FormField>
              <ModalFooter cancel={this.toggleMapping} saveName={(this.state.mappingEdit) ? "buttons.Update" : "buttons.Add"} />
            </Groups>
          }
          open={this.state.addMappingModal}
          setOpen={this.toggleMapping}

        />
        <ConfirmAction
          confirmationDetails={{
            action: null,
            details: {
              title: t('mapping.Attribute Mapping'),
              text: t('mapping.confirm_delete'),
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

MappingTable.propTypes = {
  optMappings: Proptypes.array,
  sso_id: Proptypes.string,
  sso_type: Proptypes.string,
  attributeMapping: Proptypes.array,
};
const MappingTableTranslated = withTranslation('common')(MappingTable)
export default connect(state => ({
  optMappings: state.attribute_mapping.optMappings || [],
  attributeMapping: state.attribute_mapping.attributeMapping || [],
  successMessage: state.attribute_mapping.successMessage || null,
  failureMessage: state.attribute_mapping.failureMessage || null,
}),
  dispatch => ({
    getAttributeFields: () => dispatch(getAttributeFields()),
    getMappedFields: (data) => dispatch(getMappedFields(data)),
    createAttributeField: (data) => dispatch(createAttributeField(data)),
    updateAttributeField: (data) => dispatch(updateAttributeField(data)),
    deleteAttributeField: (data) => dispatch(deleteAttributeField(data))
  }))(MappingTableTranslated);
  