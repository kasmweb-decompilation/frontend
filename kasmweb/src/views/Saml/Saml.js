import React,{ Component } from "react";
import { connect } from "react-redux";
import { get_saml_configs, deleteSaml, set_saml_config, update_saml_config,setSamlPageInfo } from "../../actions/actionSaml";
import { Row, Col, InputGroup, Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { NotificationManager } from "react-notifications";
import LoadingSpinner from "../../components/LoadingSpinner/index";
import DataTable from "../../components/Table/Table";

import {withTranslation} from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShieldKeyhole } from '@fortawesome/free-solid-svg-icons/faShield';
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';
import PageHeader from "../../components/Header/PageHeader";
import { ConfirmAction } from "../../components/Table/NewTable";

class Saml extends Component{
    constructor(props) {
        super(props);
        
        this.state = {
            modal: false,
            samlId: null,
        };

        this.deleteConfirm = this.deleteConfirm.bind(this);
        this.cancelDelete = this.cancelDelete.bind(this);
        this.createSaml = this.createSaml.bind(this);
        this.deleteSamlAction = this.deleteSamlAction.bind(this);
        this.handleDeleteSuccess = this.handleDeleteSuccess.bind(this);
        this.handleDeleteError = this.handleDeleteError.bind(this);
        this.handleAddSuccess = this.handleAddSuccess.bind(this);
        this.handleAddError = this.handleAddError.bind(this);
        this.addConfig = this.addConfig.bind(this);
    }

    componentDidMount() {
        this.props.getConfigs();
    }

    addConfig(){
        let formData = {};
        formData.display_name = " ";
        this.props.set_saml(formData)
            .then(() => {
                this.createSaml();
            })
            .catch(() => {
                this.handleAddError()
            });
    }

    createSaml(){
        const {SamlErrorMessage, saml_set, t} = this.props;
        let formData = {};
        if(SamlErrorMessage) {
            NotificationManager.error(SamlErrorMessage,t('auth.failed-to-add-saml-configurati'), 3000);
        }else {
            formData.saml_id = saml_set.saml_id;
            formData.sp_acs_url = "https://" + window.location.host + "/api/acs/?id=" + saml_set.saml_id;
            formData.sp_slo_url = "https://" + window.location.host + "/api/slo/?id=" + saml_set.saml_id;
            formData.sp_entity_id = "https://" + window.location.host + "/api/metadata/?id=" + saml_set.saml_id;
            this.props.update_saml(formData)
                .then(() => {
                    this.handleAddSuccess();
                })
                .catch(() => {
                    this.handleAddError()
                });
        }
    }

    handleAddSuccess(){
        const {SamlErrorMessage, saml_set, t} = this.props;
        if(SamlErrorMessage) {
            NotificationManager.error(SamlErrorMessage,t('auth.failed-to-add-saml-configurati'), 3000);
        }else{
            NotificationManager.success(t('auth.saml-added-successfully'),t('auth.add-saml'), 3000);
            this.setState({addModal: false});
            window.location.href = "/#/updatesaml/" + saml_set.saml_id;
        }
    }

    handleAddError(){
        const {SamlError, t} = this.props;
        if(SamlError){
            NotificationManager.error(SamlError,t('auth.failed-to-add-saml-configurati'), 3000);
            this.props.history.push("/saml");
        }else{
            NotificationManager.error(t('auth.failed-to-add-saml'),t('auth.add-saml'), 3000);
            this.props.history.push("/saml");
        }
    }

    deleteConfirm(samlId){
        this.setState({modal: !this.state.modal,
            samlId: samlId});
    }

    cancelDelete(){
        this.setState({modal: !this.state.modal});
    }

    deleteSamlAction(){
        this.props.deleteSaml(this.state.samlId).
        then(() => this.handleDeleteSuccess()).
        catch(() => this.handleDeleteError());
    }

    handleDeleteSuccess(){
        const {deleteSamlErrorMessage, t} = this.props;
        this.setState({modal: false});
        if(deleteSamlErrorMessage) {
            NotificationManager.error(deleteSamlErrorMessage,t('auth.failed-to-delete-saml'), 3000);
        }else{
            NotificationManager.success(t('auth.saml-deleted-successfully'),t('auth.delete-saml'), 3000);
            this.props.getConfigs();
        }
    }

    handleDeleteError(){
        const {deleteSamlError, t} = this.props;
        this.setState({modal: false});
        if(deleteSamlError){
            NotificationManager.error(deleteSamlError,t('auth.failed-to-delete-saml'), 3000);
            this.props.history.push("/saml");
        }else{
            NotificationManager.error(t('auth.failed-to-delete-saml'),t('auth.delete-saml'), 3000);
            this.props.history.push("/saml");
        }
    }

    render(){
        if (this.props.samlConfigLoading){
            return (<div> <LoadingSpinner /></div>);
        }

        const { saml_configs, t } = this.props;
        
        const tableColumns = [
            {
                type: "text",
                name: t('auth.display-name'),
                accessor: "display_name",
                filterable: true,
                sortable: true,
            },
            {
                type: "flag",
                name: t('auth.enabled'),
                accessor: "enabled",
                filterable: true,
                sortable: true,
            },
            {
                type: "flag",
                name: t('auth.auto-login'),
                accessor: "auto_login",
                filterable: true,
                sortable: true,
            },
        ];

        const actions = [
            { id: "edit", icon: "fa-pencil", description: t('buttons.Edit') },
            { id: "delete", icon: "fa-trash", description: t('buttons.Delete') },
        ];

        const onAction = (action, item) => {
            switch (action) {
                case "edit":
                    this.props.history.push(`/updatesaml/${item.saml_id}`);
                break;

                case "delete":
                    this.deleteConfirm(item.saml_id);
                break;
                case "deleteMulti":
                    item.forEach(id => {
                        this.props.deleteSaml(id).
                        then(() => this.handleDeleteSuccess()).
                        catch(() => this.handleDeleteError());
                    })
                break;

            }
        }

        return (
            <div className="profile-page">
                <PageHeader location={this.props.location} routes={typeof newRoutes !== 'undefined' ? newRoutes : null} title={t('auth.saml-configurations')} icon={<FontAwesomeIcon icon={faShieldKeyhole} />} />
                <Row>
                    <Col sm={{ size: 10, order: 3, offset: 1 }}>
                        <DataTable
                            id="saml"
                            data={saml_configs}
                            columns={tableColumns}
                            actions={actions}
                            onAction={onAction}
                            mainId="saml_id"
                            add={{
                                name: t('auth.add-configuration'),
                                onClick: this.addConfig
                            }}        
                        />
                    </Col>
                </Row>

                <ConfirmAction
                    confirmationDetails={{
                        action: null,
                        details: {
                            title: t('auth.delete-saml'),
                            text: t('auth.are-you-sure-you-want-to-delet'),
                            iconBg: 'tw-bg-pink-700 tw-text-white',
                            icon: <FontAwesomeIcon icon={faTrash} />,
                            confirmBg: 'tw-bg-pink-700',
                            confirmText: t('buttons.Delete'),

                        }
                    }}
                    open={this.state.modal}
                    externalClose={true}
                    setOpen={this.cancelDelete}
                    onAction={this.deleteSamlAction}
                />

            </div>
        );
    }
}

Saml.propTypes = {

};

const SamlTranslated = withTranslation('common')(Saml)
export default connect(state =>
        ({
            saml_configs: state.saml.saml_configs || [],
            deleteSamlErrorMessage: state.saml.deleteSamlErrorMessage || null,
            deleteSamlLoading: state.saml.deleteSamlLoading || false,
            deleteSamlError: state.saml.deleteSamlError || null,
            SamlErrorMessage: state.saml.SamlErrorMessage || null,
            saml_set: state.saml.saml_set || null,
            SamlError: state.saml.SamlError || null,
            samlConfigLoading: state.saml.samlConfigLoading || null,
            pages : {pageSize : state.saml.pageSize, pageNo : state.saml.pageNo},
        }),
    dispatch =>
        ({
            getConfigs: () => dispatch(get_saml_configs()),
            deleteSaml: (data) => dispatch(deleteSaml(data)),
            set_saml: (formData) => dispatch(set_saml_config(formData)),
            update_saml: (formData) => dispatch(update_saml_config(formData)),
            setPageInfo : (data)=> dispatch(setSamlPageInfo(data)),
        }))(SamlTranslated);