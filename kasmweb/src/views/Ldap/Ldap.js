import React,{ Component } from "react";
import { connect } from "react-redux";
import { getLdap, deleteLdap, testLdapConfig,setLdapPageInfo } from "../../actions/actionLdap";
import { Field, reduxForm } from "redux-form";
import { Row, Col } from "reactstrap";
import { NotificationManager } from "react-notifications";
import LoadingSpinner from "../../components/LoadingSpinner/index";
import DataTable from "../../components/Table/Table";
import { withRouter } from "react-router-dom";

import { renderField, required } from "../../utils/formValidations.js";
import Proptypes from "prop-types";
import {withTranslation} from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShieldKeyhole } from '@fortawesome/pro-light-svg-icons/faShieldKeyhole';
import { faVial } from '@fortawesome/pro-light-svg-icons/faVial';
import { faTrash } from '@fortawesome/pro-light-svg-icons/faTrash';
import PageHeader from "../../components/Header/PageHeader";
import { ConfirmAction } from "../../components/Table/NewTable";
import { Modal, ModalFooter } from "../../components/Form/Modal";
import { Groups, FormField } from "../../components/Form/Form";

class Ldap extends Component{
    constructor(props){
        super(props);

        this.state = {
            modal: false,
            modalldap: false,
            pages: 1,
            ldapId: null,
            password: "",
        };

        this.ldapConfirm = this.ldapConfirm.bind(this);
        this.submitLdapConfig = this.submitLdapConfig.bind(this);
        this.deleteConfirm = this.deleteConfirm.bind(this);
        this.deleteLdapAction = this.deleteLdapAction.bind(this);
        this.handleDeleteSuccess = this.handleDeleteSuccess.bind(this);
        this.handleDeleteError = this.handleDeleteError.bind(this);
        this.toggle1 = this.toggle1.bind(this);
        this.cancelDelete = this.cancelDelete.bind(this);
    }

    ldapConfirm(ldapId){
        this.setState({modalldap: !this.state.modalldap,
            ldapId: ldapId
        });
    }

    submitLdapConfig(userData){
        let currentLdap = this.props.ldap_configs.find(ldap => ldap.ldap_id === this.state.ldapId);
        currentLdap.ldapId = this.state.ldapId,
        currentLdap.username = userData.username;
        currentLdap.password = userData.password;
        this.props.testLdapConfig(currentLdap).
            then(() => this.handleLdapConfigSuccess()).
            catch(() => this.handleLdapConfigFailure());
    }

    handleLdapConfigSuccess(){
        const {TestLdapConfigErrorMessage, t} = this.props; 
        if(TestLdapConfigErrorMessage){
            NotificationManager.error(TestLdapConfigErrorMessage,t('auth.test-ldap-config'), 3000);
        }
        else{
            NotificationManager.success(t('auth.test-ldap'), t('auth.test-ldap-config-successfully'));
            this.setState({modalldap: false});
        }
    }

    handleLdapConfigFailure(){
        const {TestLdapConfigError, t} = this.props;
        if(TestLdapConfigError){
            NotificationManager.error(TestLdapConfigError,t('auth.create-group'), 3000);
        }
        else{
            NotificationManager.error(t('auth.something-went-wrong'), t('auth.test-ldap-failed'));
            this.setState({modalldap: false});
        }
    }

    componentDidMount() {
        this.props.getLdap();
    }

    deleteConfirm(ldapId){
        this.setState({modal: !this.state.modal,
            ldapId: ldapId});
    }

    cancelDelete(){
        this.setState({modal: !this.state.modal}); 
    }

    toggle1(){
        this.setState({modalldap: !this.state.modalldap});
        this.props.initialize({ username: "", password: "" });
    }

    deleteLdapAction(){
        this.props.deleteLdap(this.state.ldapId).
            then(() => this.handleDeleteSuccess()).
            catch(() => this.handleDeleteError());
    }   

    handleDeleteSuccess(){
        const {deleteLdapErrorMessage, t} = this.props;
        this.setState({modal: false});
        if(deleteLdapErrorMessage) {
            NotificationManager.error(deleteLdapErrorMessage,t('auth.failed-to-delete-ldap'), 3000);
        }else{
            NotificationManager.success(t('auth.ldap-deleted-successfully'),t('auth.delete-ldap'), 3000);
            this.props.getLdap();
        }
    }

    handleDeleteError(){
        const {deleteLdapError, t} = this.props;
        this.setState({modal: false});
        if(deleteLdapError){
            NotificationManager.error(deleteLdapError,t('auth.failed-to-delete-ldap'), 3000);
            this.props.history.push("/ldap");
        }else{
            NotificationManager.error(t('auth.failed-to-delete-ldap'),t('auth.delete-ldap'), 3000);
            this.props.history.push("/ldap");
        }
    }

    render(){
        if (this.props.getLdapLoading){
            return (<div> <LoadingSpinner /></div>);
        }

        const { ldap_configs, handleSubmit, t } = this.props;
            
        const tableColumns = [
            {
                type: "text",
                name: t('auth.name'),
                accessor: "name",
                filterable: true,
                sortable: true,
            },
            {
                type: "text",
                name: t('auth.ldap-url'),
                accessor: "url",
                filterable: true,
                sortable: true,
            },
            {
                accessor: "search_base",
                name: t("auth.search-base"),
                filterable: true,
                sortable: true,
                showByDefault: false
            },
            {
                accessor: "search_filter",
                name: t("auth.search-filter"),
                filterable: true,
                sortable: true,
                showByDefault: false
            },
            {
                accessor: "group_membership_filter",
                name: t("auth.group-membership-filter"),
                filterable: true,
                sortable: true,
                showByDefault: false
            },
            {
                accessor: "email_attribute",
                name: t("auth.email-attribute"),
                filterable: true,
                sortable: true,
                showByDefault: false
            },
            {
                accessor: "service_account_dn",
                name: t("auth.service-account-dn"),
                filterable: true,
                sortable: true,
                showByDefault: false
            },
            {
                accessor: "search_subtree",
                name: t("auth.search-subtree"),
                filterable: true,
                sortable: true,
                showByDefault: false
            },
            {
                accessor: "auto_create_app_user",
                name: t("auth.auto-create-app-user"),
                filterable: true,
                sortable: true,
                showByDefault: false
            },
            {
                accessor: "enabled",
                name: t("auth.enabled"),
                filterable: true,
                sortable: true,
                showByDefault: false
            },

        ];

        const actions = [
            { id: "edit", icon: "fa-pencil", description: t('buttons.Edit') },
            { id: "delete", icon: "fa-trash", description: t('buttons.Delete') },
            { id: "test", icon: <FontAwesomeIcon icon={faVial} />, description: t('auth.test-ldap-connection') },
        ];

        const onAction = (action, item) => {
            switch (action) {
                case "edit":
                    this.props.history.push(`/updateldap/${item.ldap_id}`);
                break;

                case "delete":
                    this.deleteConfirm(item.ldap_id);
                break;
                case "deleteMulti":
                    item.forEach(id => {
                        this.props.deleteLdap(id).
                        then(() => this.handleDeleteSuccess()).
                        catch(() => this.handleDeleteError());
                    })
                break;

                case "test":
                    this.ldapConfirm(item.ldap_id);
                break;
            }
        }

        return (
            <div className="profile-page">
                <PageHeader location={this.props.location} routes={typeof newRoutes !== 'undefined' ? newRoutes : null} title={t('auth.ldap-configurations')} icon={<FontAwesomeIcon icon={faShieldKeyhole} />} />
                <Row>
                    <Col sm={{ size: 10, order: 3, offset: 1 }}>
                        <DataTable
                            id="ldap"
                            data={ldap_configs}
                            columns={tableColumns}
                            actions={actions}
                            onAction={onAction}
                            mainId="ldap_id"
                            add={{
                                name: t('auth.add-configuration'),
                                action: '/createldap'
                            }}
                        />
                    </Col>
                </Row>

                <Modal
                    icon={<FontAwesomeIcon icon={faShieldKeyhole} />}
                    iconBg="tw-bg-blue-500 tw-text-white"
                    title="auth.test-ldap-connection"
                    contentRaw={
                        <Groups noPadding section="auth" onSubmit={handleSubmit(this.submitLdapConfig)} className='tw-text-left tw-mt-8'>
                            <FormField label="test-user-name">
                                <Field
                                    id="username"
                                    type="text"
                                    name="username"
                                    component={renderField}
                                    validate={[required]} required
                                />
                            </FormField>
                            <FormField label="test-password">
                                <Field
                                    id="password"
                                    type="password"
                                    name="password"
                                    component={renderField}
                                    validate={[required]} required
                                />
                            </FormField>
                            <ModalFooter cancel={this.toggle1} saveName='auth.test-connection' />
                        </Groups >
                    }
                    open={this.state.modalldap}
                    setOpen={this.toggle1}
                />


                <ConfirmAction
                    confirmationDetails={{
                        action: null,
                        details: {
                            title: t('auth.delete-ldap'),
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
                    onAction={this.deleteLdapAction}
                />


            </div>
        );
    }
}

Ldap.propTypes = {
    getLdap: Proptypes.func.isRequired,
    deleteLdap: Proptypes.func.isRequired,
    deleteLdapErrorMessage: Proptypes.func,
    TestLdapConfigErrorMessage: Proptypes.string,
    testLdapConfig: Proptypes.func.isRequired,
    deleteLdapError: Proptypes.func,
    history: Proptypes.object.isRequired,
    ldap: Proptypes.array,
    getLdapLoading: Proptypes.bool,
    initialize: Proptypes.func,
    ldap_configs: Proptypes.array,
    handleSubmit:  Proptypes.func,
    className: Proptypes.func,
    TestLdapConfigError: Proptypes.string
};

let  LdapFormWithRouter = withRouter(Ldap);

let LdapForm = connect(state => ({
    ldap_configs: state.ldap_configs.ldap_configs || [],
    getLdapLoading: state.ldap_configs.getLdapLoading || false,
    deleteLdapErrorMessage: state.ldap_configs.deleteLdapErrorMessage || null,
    deleteLdapLoading: state.ldap_configs.deleteLdapLoading || false,
    deleteLdapError: state.ldap_configs.deleteLdapError || null,
    TestLdapConfigErrorMessage: state.ldap_configs.TestLdapConfigErrorMessage || null,
    TestLdapConfigLoading: state.ldap_configs.TestLdapConfigLoading || null,
    pages : {pageSize : state.ldap_configs.pageSize, pageNo : state.ldap_configs.pageNo},
}), 
dispatch => ({
    getLdap: () => dispatch(getLdap()),
    testLdapConfig: (data) => dispatch(testLdapConfig(data)),
    deleteLdap: (data) => dispatch(deleteLdap(data)),
    setPageInfo : (data)=> dispatch(setLdapPageInfo(data)),
}))(LdapFormWithRouter);
const LdapFormTranslated = withTranslation('common')(LdapForm)
export default reduxForm({
    form: "ldapForm",
})(LdapFormTranslated);