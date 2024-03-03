import React,{ Component } from "react";
import {connect} from "react-redux";
import { getSystemInfo, getLicenses, addLicense, deleteLicense,setLicensePageInfo, exportSchema, exportData, importData} from "../../actions/actionSystemInfo";
import { getLicenseStatus } from "../../actions/actionFooter";
import { Row, Col, Input } from "reactstrap";
import Proptypes from "prop-types";
import DataTable from "../../components/Table/Table";
import moment from "moment";
import { NotificationManager } from "react-notifications";
import { Alert } from 'reactstrap';
import LoadingSpinner from "../../components/LoadingSpinner";
import {renderField, required} from "../../utils/formValidations";
import {withTranslation} from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileCertificate } from '@fortawesome/pro-light-svg-icons/faFileCertificate';
import { faTrash } from '@fortawesome/pro-light-svg-icons/faTrash';
import PageHeader from "../../components/Header/PageHeader";
import { Groups, Group, ViewField, TabList, FormFooter, Button, FormField } from "../../components/Form"
import { Modal, ModalFooter } from "../../components/Form/Modal"
import { ConfirmAction } from "../../components/Table/NewTable";
import { faCloudDownload } from "@fortawesome/pro-light-svg-icons/faCloudDownload";
import { faCloudUpload } from "@fortawesome/pro-light-svg-icons/faCloudUpload";
import { hasAuth } from "../../utils/axios";

class ViewSystemInfo extends Component{
    constructor(props){
        super(props);

        this.state = {
            addLicenseModal: false,
            importModal: false,
            exportModal: false,
            deleteLicenseModal: false,
            license_key: '',
            import_config: '',
            export_key: '',
            import_key: '',
            licenseId: null,
            visible: true,
            tab: 'form'
        };

        this.openLicenseAddModal = this.openLicenseAddModal.bind(this);
        this.toggleImportModal = this.toggleImportModal.bind(this);
        this.toggleExportModal = this.toggleExportModal.bind(this);
        this.importData = this.importData.bind(this);
        this.toggleLicense = this.toggleLicense.bind(this);
        this.addLicense = this.addLicense.bind(this);
        this.handleAddLicenseSuccess = this.handleAddLicenseSuccess.bind(this);
        this.handleAddLicenseError = this.handleAddLicenseError.bind(this);
        this.handleLicenseChange = this.handleLicenseChange.bind(this);
        this.handleImportFileChange = this.handleImportFileChange.bind(this);
        this.handleImportKeyChange = this.handleImportKeyChange.bind(this);
        this.handleKeyChange = this.handleKeyChange.bind(this);
        this.deleteLicenseConfirm = this.deleteLicenseConfirm.bind(this);
        this.deleteLicense = this.deleteLicense.bind(this);
        this.handleDeleteLicenseSuccess = this.handleDeleteLicenseSuccess.bind(this);
        this.handleDeleteLicenseError = this.handleDeleteLicenseError.bind(this);
        this.onDismiss = this.onDismiss.bind(this);
        this.exportSchema = this.exportSchema.bind(this);
        this.handleExportSchemaSuccess = this.handleExportSchemaSuccess.bind(this);
        this.handleExportSchemaError = this.handleExportSchemaError.bind(this);
        this.exportData = this.exportData.bind(this);
        this.handleExportDataSuccess = this.handleExportDataSuccess.bind(this);
        this.handleExportDataError = this.handleExportDataError.bind(this);
        this.handleImportDataSuccess = this.handleImportDataSuccess.bind(this);
        this.handleImportDataError = this.handleImportDataError.bind(this);
        this.downloadBlob = this.downloadBlob.bind(this);
    }
  
    componentDidMount(){
        this.props.getSystemInfo();
        this.props.getLicenses();
    }

    openLicenseAddModal(){
        this.setState({addLicenseModal: !this.state.addLicenseModal});
    }

    toggleImportModal(){
        this.setState({importModal: !this.state.importModal, import_key: '', import_config: ''});
    }

    toggleExportModal(){
        this.setState({exportModal: !this.state.exportModal, export_key: ''});
    }

    toggleLicense(){
        this.setState({addLicenseModal: !this.state.addLicenseModal});
    }

    addLicense(){
        let data = {};
        data.license_key = this.state.license_key;
        this.props.addLicense(data).then(() => this.handleAddLicenseSuccess()).catch(() => this.handleAddLicenseError());
    }

    importData(){
        let data = {};
        data.import_data = this.state.import_config;
        data.import_format = "zip"
        data.import_key = this.state.import_key;
        this.props.importData(data).then(() => this.handleImportDataSuccess()).catch(() => this.handleImportDataError());
    }

    downloadBlob(data, fileName) {
        let jsonBlob = new Blob([data]);
        const blobUrl = URL.createObjectURL(jsonBlob);

        const link = document.createElement("a");

        link.href = blobUrl;
        link.download = fileName;

        document.body.appendChild(link);

        link.dispatchEvent(
          new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
          })
        );
        document.body.removeChild(link);
    };

    exportSchema(){
        let data = {};
        this.props.exportSchema().then(() => this.handleExportSchemaSuccess()).catch(() => this.handleExportSchemaError());
    }

    handleExportSchemaSuccess(){
        const {system_info, t} = this.props;
        if(system_info.exportSchemaError){
            NotificationManager.error(system_info.exportSchemaError, t('system_info.Export Schema'), 6000);
        }
        else{
            NotificationManager.success(t('system_info.Exported Schema Successfully'), t('system_info.Export Schema'), 3000);
            this.downloadBlob(system_info.schema, 'configuration_schema.yaml')
        }
    }

    handleExportSchemaError(){
        const {system_info, t} = this.props;
        if(system_info.exportSchemaError){
            NotificationManager.error(system_info.exportSchemaError, t('system_info.Export Schema'), 6000);
        }
        else {
            NotificationManager.error(t('system_info.Error exporting schema'), t('system_info.Export Schema'), 6000);
        }
    }

    exportData(){
        let data = {};
        data.export_key = this.state.export_key;
        this.props.exportData(data).then(() => this.handleExportDataSuccess()).catch(() => this.handleExportDataError());
    }

    handleExportDataSuccess(){
        const {system_info, t} = this.props;
        this.toggleExportModal()
        if(system_info.exportDataError){
            NotificationManager.error(system_info.exportDataError, t("system_info.Export Data"), 6000);
        }
        else{
            NotificationManager.success(t("system_info.Exported Data Successfully"), t("system_info.Export Data"), 3000)
            const binaryString = atob(system_info.data);
            const len = binaryString.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
              bytes[i] = binaryString.charCodeAt(i);
            }
            this.downloadBlob(bytes, "configuration_export.zip")
        }
    }

    handleExportDataError(){
        const {system_info, t} = this.props;
        this.toggleExportModal()
        if(system_info.exportDataError){
            NotificationManager.error(system_info.exportDataError, t("system_info.Export Data"), 6000);
        }
        else {
            NotificationManager.error(t("system_info.Error exporting data"), t("system_info.Export Data"), 6000);
        }
    }

    handleImportDataSuccess(){
        const {system_info, t} = this.props;
        if(system_info.importDataError){
            NotificationManager.error(system_info.importDataError,t("system_info.Import Data"), 6000);
        }
        else{
            NotificationManager.success(t("system_info.Imported Data"),t("system_info.Import Data"), 3000);
            this.toggleImportModal()
        }
    }

    handleImportDataError(){
        const {system_info, t} = this.props;
        if(system_info.importDataError){
            NotificationManager.error(system_info.importDataError,t("system_info.Import Data"), 6000);
        }
        else {
            NotificationManager.error(t("system_info.Error importing data"),t("system_info.Import Data"), 6000);
        }
    }

    handleLicenseChange(event) {
        this.setState({license_key: event.target.value});
    }

    handleImportFileChange(event) {
        const file = event.target.files[0];
        const reader = new FileReader()
        reader.readAsDataURL(file);
        reader.onload = () => this.setState({ import_config: reader.result.split(",").pop()})
    }

    handleImportKeyChange(event) {
        this.setState({import_key: event.target.value});
    }

    handleKeyChange(event) {
        this.setState({export_key: event.target.value});
    }

    handleAddLicenseSuccess(){
        const {system_info, t} = this.props;
        if(system_info.addLicenseError){
            NotificationManager.error(system_info.addLicenseError,t("system_info.Add License"), 6000);
        }
        else{
            NotificationManager.success(t("system_info.Added License Successfully"),t("system_info.Add License"), 3000);
            this.setState({addLicenseModal: false});
            this.props.getLicenses();
            this.props.getSystemInfo();
            this.props.getLicenseStatus();
        }
    }

    handleAddLicenseError(){
        const {system_info, t} = this.props;
        if(system_info.addLicenseError){
            NotificationManager.error(system_info.addLicenseError,t("system_info.Add License"), 6000);
        }
        else {
            NotificationManager.error(t("system_info.Error adding license"),t("system_info.Add License"), 6000);
            this.setState({addLicenseModal: false});
            this.props.getLicenses();
            this.props.getSystemInfo();
            this.props.getLicenseStatus();
        }
    }

    handleDeleteLicenseSuccess(){
        const {system_info, t} = this.props;
        if(system_info.deleteLicenseError){
            NotificationManager.error(system_info.deleteLicenseError,t("system_info.Delete License"), 6000);
        }
        else{
            NotificationManager.success(t("system_info.Deleted License Successfully"),t("system_info.Delete License"), 3000);
            this.setState({deleteLicenseModal: false});
            this.props.getLicenses();
            this.props.getSystemInfo();
            this.props.getLicenseStatus();
        }
    }

    handleDeleteLicenseError(){
        const {system_info, t} = this.props;
        if(system_info.deleteicenseError){
            NotificationManager.error(system_info.deleteLicenseError,t("system_info.Delete License"), 6000);
        }
        else {
            NotificationManager.error(t("system_info.Error deleting license"),t("system_info.Delete License"), 6000);
            this.setState({deleteLicenseModal: false});
            this.props.getLicenses();
            this.props.getSystemInfo();
            this.props.getLicenseStatus();
        }
    }

    deleteLicenseConfirm(licenseId){
        this.setState(
            {
                deleteLicenseModal: !this.state.deleteLicenseModal,
                licenseId: licenseId
            });
    }

    deleteLicense(){
        let data = {};
        data.licenseId = this.state.licenseId;
        this.props.deleteLicense(data).then(() => this.handleDeleteLicenseSuccess()).
            catch(() => this.handleDeleteLicenseError());
    }

    onDismiss() {
        this.setState({ visible: false });
    }

    render(){
        if (this.props.getSystemInfoLoading || this.props.getLicensesLoading) {
            return (<div> <LoadingSpinner /></div>);
        }
        
        const { system_info, t } = this.props;

        const tableColumns = [
            {
                type: "date",
                accessor: "expiration",
                name: t("system_info.Expiration"),
                filterable: true,
                sortable: true,
                colSize: 'minmax(240px, 1.4fr)',
                cell: (data) => (
                    <div className={"tw-flex" + (data.original.is_verified ? "" : " license_not_ok")} >
                        <div>{moment.utc(data.original.expiration).local().format('ll')} <span className="tw-text-xs text-muted-more">{moment.utc(data.original.expiration).local().format('LT')}</span></div>
                        
                    </div>
                ),
            },
            {
                type: "text",
                accessor: "sku",
                name: t("system_info.SKU"),
                filterable: true,
                sortable: true
            },
            {
                type: "text",
                accessor: "license_type",
                name: t("system_info.Type"),
                filterable: true,
                sortable: true
            },
            {
                type: "text",
                accessor: "limit",
                name: t("system_info.Limit"),
                filterable: true,
                sortable: true
            },
            {
                type: "text",
                accessor: "issued_to",
                name: t("system_info.Issued To"),
                filterable: true,
                sortable: true
            },
        ];

        const actions = [
            { id: "delete", icon: "fa-trash", description: t("system_info.Delete") },
        ];

        const onAction = (action, item) => {
            switch (action) {
                case "delete":
                    this.deleteLicenseConfirm(item.license_id);
                break;
                case "deleteMulti":
                    item.forEach(id => {
                        let data = {};
                        data.licenseId = id;
                        this.props.deleteLicense(data).
                            then(() => this.handleDeleteLicenseSuccess()).
                            catch(() => this.handleDeleteLicenseError());
                        })
                break;

            }
        }
        const kasmBuildId = `${__KASM_BUILD_ID__}`;
        const tabList = [
            { name: 'system_info.System Info', key: 'form'},
            { name: 'system_info.Licenses', key: 'licenses', isHidden: !hasAuth('license')},
            { name: 'system_info.import-export-config', key: 'importexport', isHidden: !hasAuth('system_config') },
        ]

        const licenseValue = () => {
            if (system_info && system_info.system_info.license.status.licensed) {
                return { value: t('system_info.OK'), style: { color: '#059669', fontWeight: 'bold' } }
            }
            return { value: t('system_info.Unlicensed'), style: null }
        }

        return (
            <div className="profile-page">
                <PageHeader location={this.props.location} routes={typeof newRoutes !== 'undefined' ? newRoutes : null} title={t('system_info.System Info')} icon={<FontAwesomeIcon icon={faFileCertificate} />} />
                <Row>
                    <Col sm={{ size: 10, order: 3, offset: 1 }}>
                        <TabList {...this.props} tabList={tabList} currentTab={this.state.tab} setCurrentTab={(value) => this.setState({ tab: value })} />
                        <div className={system_info && this.state.tab === 'form' ? 'tw-block' : 'tw-hidden'}>
                            <Groups section="system_info">
                                {system_info.system_info && (
                                    <React.Fragment>
                                        {system_info.system_info.update.status &&
                                            system_info.system_info.update.update_available &&
                                            <Alert className="tw-bg-blue-500 dark:tw-bg-blue-500/50 dark:tw-border-white/20 tw-text-white tw-rounded" color="primary" isOpen={this.state.visible} toggle={this.onDismiss}>
                                                <h4>{t('system_info.Update Available')}</h4>
                                                {t('system_info.Update Version')}: {system_info.system_info.update.status.latest_version}
                                                <hr className="!tw-border-t-white/20" />
                                                <a className="tw-text-white/90 tw-underline hover:tw-text-white" href={system_info.system_info.update.status.release_notes_url}>{t('system_info.Release Notes')}</a><br />
                                                {system_info.system_info.update.status.alert && system_info.system_info.update.status.alert}
                                            </Alert>}

                                        <Group section="system_info" title="details" description="details-description">
                                            <ViewField type="text"
                                                name="Web UI"
                                                value={kasmBuildId || "-"}
                                                component={renderField}
                                            />
                                            <ViewField type="text"
                                                name="Installation ID"
                                                value={system_info && system_info.system_info.db.installation_id ? system_info.system_info.db.installation_id : "-"}
                                                component={renderField}
                                            />
                                        </Group>
                                        <Group section="system_info" title="db-details" description="db-details-description">
                                            <ViewField type="text"
                                                name="Database Host"
                                                value={system_info && system_info.system_info.db.host ? system_info.system_info.db.host : "-"}
                                                component={renderField}
                                            />
                                            <ViewField type="text"
                                                name="Database Version"
                                                value={system_info && system_info.system_info.db.alembic_version ? system_info.system_info.db.alembic_version : "-"}
                                                component={renderField}
                                            />
                                        </Group>
                                        <Group section="system_info" title="api-details" description="api-details-description">

                                            <ViewField type="text"
                                                name="API Server ID"
                                                value={system_info && system_info.system_info.api.server_id ? system_info.system_info.api.server_id : "-"}
                                                component={renderField}
                                            />
                                            <ViewField type="text"
                                                name="API Server Host"
                                                value={system_info && system_info.system_info.api.server_hostname ? system_info.system_info.api.server_hostname : "-"}
                                                component={renderField}
                                            />
                                            <ViewField type="text"
                                                name="API Server Build"
                                                value={system_info && system_info.system_info.api.build_id ? system_info.system_info.api.build_id : "-"}
                                                component={renderField}
                                            />
                                            <ViewField type="text"
                                                name="API Server Zone"
                                                value={system_info && system_info.system_info.api.zone_name ? system_info.system_info.api.zone_name : "-"}
                                                component={renderField}
                                            />
                                        </Group>
                                        <Group section="system_info" title="license-details" description="license-details-description">

                                            <ViewField type="text"
                                                name="License Status"
                                                style={licenseValue().style}
                                                value={licenseValue().value}
                                                component={renderField}
                                            />
                                            <ViewField type="text"
                                                name="License Type"
                                                value={system_info && system_info.system_info.license.status.license_type ? system_info.system_info.license.status.license_type : "-"}
                                                component={renderField}
                                            />
                                            <ViewField type="text"
                                                name="License Limit"
                                                value={system_info && system_info.system_info.license.status.limit ? system_info.system_info.license.status.limit : "-"}
                                                component={renderField}
                                            />
                                            <ViewField type="text"
                                                name="License Limit Remaining"
                                                value={system_info && system_info.system_info.license.status.limit_remaining ? system_info.system_info.license.status.limit_remaining : "-"}
                                                component={renderField}
                                            />
                                        </Group>
                                    </React.Fragment>
                                )}
                            </Groups>
                        </div>
                        <div className={system_info && this.state.tab === 'licenses' ? 'tw-block' : 'tw-hidden'}>
                            <DataTable
                                id="system-info"
                                data={system_info.licenses}
                                columns={tableColumns}
                                actions={actions}
                                onAction={onAction}
                                mainId="license_id"
                                add={{
                                    name: t('system_info.Add License'),
                                    onClick: this.openLicenseAddModal
                                }}
                            />
                        </div>
                        <div className={system_info && this.state.tab === 'importexport' ? 'tw-block' : 'tw-hidden'}>
                            <div className="tw-flex tw-flex-col tw-gap-4 tw-pb-8">
                                <div className="tw-flex tw-flex-col lg:tw-flex-row tw-justify-between tw-items-center tw-gap-8 lg:tw-gap-20 tw-bg-modal-bg tw-p-6 tw-border tw-rounded tw-bg-white/70 dark:tw-bg-slate-900/70 tw-shadow tw-border-solid tw-border-transparent dark:tw-border-[color:var(--border-color)]">
                                    <div>
                                        <h4 className="tw-text-sm tw-font-bold">{t('system_info.Export Schema')}</h4>
                                        <p className="tw-m-0 tw-text-sm tw-text-[color:var(--text-color-muted)]">{t('system_info.export_schema_description')}</p>
                                    </div>
                                    <div>
                                        <button
                                            onClick={this.exportSchema}
                                            className="tw-rounded tw-h-10 tw-bg-blue-500 hover:tw-bg-slate-600 tw-text-sm tw-text-white tw-flex tw-items-center tw-transition">
                                            <span className="tw-h-10 tw-w-12 tw-flex tw-justify-center tw-items-center tw-bg-black/10">
                                                <FontAwesomeIcon icon={faCloudDownload} className="tw-text-lg" />
                                            </span>
                                            <span className="tw-px-4 tw-min-w-[144px] tw-text-center tw-whitespace-nowrap">{t('system_info.Export Schema')}</span>
                                        </button>
                                    </div>
                                </div>
                                <div className="tw-flex tw-flex-col lg:tw-flex-row tw-justify-between tw-items-center tw-gap-8 lg:tw-gap-20 tw-bg-modal-bg tw-p-6 tw-border tw-rounded tw-bg-white/70 dark:tw-bg-slate-900/70 tw-shadow tw-border-solid tw-border-transparent dark:tw-border-[color:var(--border-color)]">
                                    <div>
                                        <h4 className="tw-text-sm tw-font-bold">{t('system_info.Export Configuration')}</h4>
                                        <p className="tw-m-0 tw-text-sm tw-text-[color:var(--text-color-muted)]">{t('system_info.export_configuration_description')}</p>
                                    </div>
                                    <div>
                                        <button
                                            onClick={this.toggleExportModal}
                                            className="tw-rounded tw-h-10 tw-bg-blue-500 hover:tw-bg-slate-600 tw-text-sm tw-text-white tw-flex tw-items-center tw-transition">
                                            <span className="tw-h-10 tw-w-12 tw-flex tw-justify-center tw-items-center tw-bg-black/10">
                                                <FontAwesomeIcon icon={faCloudDownload} className="tw-text-lg" />
                                            </span>
                                            <span className="tw-px-4 tw-min-w-[144px] tw-text-center tw-whitespace-nowrap">{t('system_info.Export Config')}</span>
                                        </button>
                                    </div>
                                </div>
                                <div className="tw-flex tw-flex-col lg:tw-flex-row tw-justify-between tw-items-center tw-gap-8 lg:tw-gap-20 tw-bg-modal-bg tw-p-6 tw-border tw-rounded tw-bg-white/70 dark:tw-bg-slate-900/70 tw-shadow tw-border-solid tw-border-transparent dark:tw-border-[color:var(--border-color)]">
                                    <div>
                                        <h4 className="tw-text-sm tw-font-bold">{t('system_info.Import Configuration')}</h4>
                                        <p className="tw-m-0 tw-text-sm tw-text-[color:var(--text-color-muted)]">{t('system_info.import_config_description')}</p>
                                    </div>
                                    <div>
                                        <button
                                            onClick={this.toggleImportModal}
                                            className="tw-rounded tw-h-10 tw-bg-blue-500 hover:tw-bg-slate-600 tw-text-sm tw-text-white tw-flex tw-items-center tw-transition">
                                            <span className="tw-h-10 tw-w-12 tw-flex tw-justify-center tw-items-center tw-bg-black/10">
                                                <FontAwesomeIcon icon={faCloudUpload} className="tw-text-lg" />
                                            </span>
                                            <span className="tw-px-4 tw-min-w-[144px] tw-text-center tw-whitespace-nowrap">{t('system_info.Import Config')}</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <Modal
                            icon={<FontAwesomeIcon icon={faFileCertificate} />}
                            iconBg="tw-bg-blue-500 tw-text-white"
                            title="system_info.Add License"
                            contentRaw={
                                <div className='tw-text-left tw-mt-8'>
                                    <FormField section="system_info" label="Enter License or Activation Key">
                                        <Input type="textarea" name="text" id="exampleText" onChange={this.handleLicenseChange} rows="10" required />
                                    </FormField>
                                </div>
                            }
                            open={this.state.addLicenseModal}
                            setOpen={this.toggleLicense}
                            modalFooter={<ModalFooter cancel={this.toggleLicense} saveName='buttons.Add' save={this.addLicense} />}
                        />

                        <Modal
                            icon={<FontAwesomeIcon icon={faFileCertificate} />}
                            iconBg="tw-bg-blue-500 tw-text-white"
                            title="system_info.Import Config"
                            contentRaw={
                                <div className='tw-text-left tw-mt-8'>
                                    <FormField section="system_info" label="Import">
                                        <Input type="file" name="text" id="import_file" accept=".zip" onChange={this.handleImportFileChange} required />
                                    </FormField>
                                    <FormField section="system_info" label="Encryption Key">
                                        <Input type="password" name="text" id="import_key" onChange={this.handleImportKeyChange} required />
                                    </FormField>
                                </div>
                            }
                            open={this.state.importModal}
                            setOpen={this.toggleImportModal}
                            buttons={
                                <React.Fragment>
                                    <button type="button" className="cancelbutton" onClick={this.toggleImportModal}>{t('buttons.Cancel')}</button>
                                    <button type="button" disabled={this.state.import_key && this.state.import_config ? false : true} className="actionbutton tw-bg-blue-500" onClick={this.importData}>{t('system_info.Import')}</button>
                                </React.Fragment>
                            }
                        />

                        <Modal
                            icon={<FontAwesomeIcon icon={faFileCertificate} />}
                            iconBg="tw-bg-blue-500 tw-text-white"
                            title="system_info.Export Config"
                            contentRaw={
                                <div className='tw-text-left tw-mt-8'>
                                    <FormField section="system_info" label="Encryption Key" isRequired={true}>
                                        <Input type="password" name="text" id="key" onChange={this.handleKeyChange} required />
                                    </FormField>
                                </div>
                            }
                            open={this.state.exportModal}
                            setOpen={this.toggleExportModal}
                            buttons={
                                <React.Fragment>
                                    <button type="button" className="cancelbutton" onClick={this.toggleExportModal}>{t('buttons.Cancel')}</button>
                                    <button type="button" disabled={!this.state.export_key} className="actionbutton tw-bg-blue-500" onClick={this.exportData}>{t('system_info.Export')}</button>
                                </React.Fragment>
                            }
                        />

                        <ConfirmAction
                            confirmationDetails={{
                                action: null,
                                details: {
                                    title: t('system_info.Delete License'),
                                    text: t('system_info.Are you sure you want to delete this license?'),
                                    iconBg: 'tw-bg-pink-700 tw-text-white',
                                    icon: <FontAwesomeIcon icon={faTrash} />,
                                    confirmBg: 'tw-bg-pink-700',
                                    confirmText: t('buttons.Delete'),

                                }
                            }}
                            open={this.state.deleteLicenseModal}
                            externalClose={true}
                            setOpen={this.deleteLicenseConfirm}
                            onAction={this.deleteLicense}
                        />

                    </Col>
                </Row>
            </div>
        );
    }
}

ViewSystemInfo.propTypes = {
    getSystemInfo: Proptypes.func.isRequired,
    system_info: Proptypes.object,
    licenses: Proptypes.object,
    addLicense:  Proptypes.func.isRequired,
    getLicenses: Proptypes.func.isRequired,
    addLicenseError: Proptypes.func,
    deleteLicense: Proptypes.func.isRequired,
    getSystemInfoLoading: Proptypes.bool
};

const ViewSystemInfoTranslated = withTranslation('common')(ViewSystemInfo)

export default connect(state =>
    ({
        system_info: state.system_info || null,
        addLicenseError: state.system_info.addLicenseError || null,
        getSystemInfoLoading: state.system_info.getSystemInfoLoading || null,
        getLicensesLoading: state.system_info.getLicensesLoading || null,
        pages : {pageSize : state.system_info.pageSize, pageNo : state.system_info.pageNo},
    }),
dispatch =>
    ({
        getSystemInfo: () => dispatch(getSystemInfo()),
        getLicenses: () => dispatch(getLicenses()),
        getLicenseStatus: () => dispatch(getLicenseStatus()),
        addLicense: (data) => dispatch(addLicense(data)),
        deleteLicense: (data) => dispatch(deleteLicense(data)),
        setPageInfo : (data)=> dispatch(setLicensePageInfo(data)),
        exportSchema: () => dispatch(exportSchema()),
        exportData: (data) => dispatch(exportData(data)),
        importData: (data) => dispatch(importData(data)),
    }))(ViewSystemInfoTranslated);
