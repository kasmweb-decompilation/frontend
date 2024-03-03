import React,{Component} from "react";
import { hasAuth } from "../../../utils/axios";
import { Field, reduxForm, change } from "redux-form";
import { getSystemInfo} from "../../../actions/actionSystemInfo";
import {
    renderPass,
    renderField,
    renderToggle,
    renderTextArea,
    required,
    number,
    positive_float,
    empty_or_number,
    json
} from "../../../utils/formValidations.js";
import { connect } from "react-redux";
import { getServers} from "../../../actions/actionServer";
import { getServerPools} from "../../../actions/actionServerPool";
import { getZones } from "../../../actions/actionZones";
import { getImages, getServerCustomNetworkNames, updateImages, getRegistries } from "../../../actions/actionImage";
import { withRouter } from "react-router-dom";
import Proptypes from "prop-types";
import SelectInput from "../../../components/SelectInput";
import {getUrlFilterPolicies} from "../../../actions/actionFilters"
import { completeWorkspacesList } from "../Registry"
import {withTranslation} from "react-i18next";
import { Groups, Group, FormFooter, FormField, submitFailure } from "../../../components/Form"

const renderOption = (option) => {
    return (
        <div>  {option.hostname} : {option.label} </div>
    );
};

const renderValue = (option) => {    
    return ( 
        <div> {option.hostname} : {option.label} </div>
    );
};

class ImageFormTemplate extends Component  {
    constructor(props){
        super(props);
        this.state  = {
            currentImage: null,
            currentNetwork: null,
            currentServers: null,
            currentZones: null,
            workspaceslist: null,
            selectedWorkspace: null,
        };
        this.getServerClickFunc = this.getServerClickFunc.bind(this);
        this.getServerIdFunc = this.getServerIdFunc.bind(this);
        this.getZoneIdFunc = this.getZoneIdFunc.bind(this);
        this.changeWorkspaceType = this.changeWorkspaceType.bind(this);
        this.initialize = this.initialize.bind(this);
        
    }

    initialize(currentImage) {
        this.props.initialize({
            name: currentImage.name,
            description: currentImage.description, 
            memory: currentImage.memory/1000000,
            friendly_name: currentImage.friendly_name,
            image_src: currentImage.image_src,
            cores: currentImage.cores,
            require_gpu: currentImage.require_gpu,
            gpu_count: currentImage.gpu_count,
            enabled: currentImage.enabled,
            docker_registry: currentImage.docker_registry,
            docker_token: currentImage.docker_token,
            docker_user: currentImage.docker_user,
            hash: currentImage.hash,
            persistent_profile_path: currentImage.persistent_profile_path,
            volume_mappings: currentImage.volume_mappings ? JSON.stringify(currentImage.volume_mappings, null, 2) : '',
            run_config: currentImage.run_config ? JSON.stringify(currentImage.run_config, null, 2) : '',
            exec_config: currentImage.exec_config ? JSON.stringify(currentImage.exec_config, null, 2) : '',
            launch_config: currentImage.launch_config ? JSON.stringify(currentImage.launch_config, null, 2) : '',
            categories: currentImage.categories ? currentImage.categories.join('\n') : '',
            restrict_to_network: currentImage.restrict_to_network,
            restrict_network_names: currentImage.restrict_network_names,
            allow_network_selection: currentImage.allow_network_selection,
            restrict_to_server: currentImage.restrict_to_server,
            server_id: currentImage.server_id,
            server_pool_id: currentImage.server_pool_id,
            restrict_to_zone: currentImage.restrict_to_zone,
            zone_id: currentImage.zone_id,
            filter_policy_id: currentImage.filter_policy_id,
            session_time_limit: currentImage.session_time_limit,
            hidden: currentImage.hidden,
            notes: currentImage.notes,
            image_type: currentImage.image_type,
            link_url: currentImage.link_url,
            cpu_allocation_method: currentImage.cpu_allocation_method,
            uncompressed_size_mb: currentImage.uncompressed_size_mb,
        });
    }

    UNSAFE_componentWillReceiveProps(nextProps){
        if(nextProps.images.length > 0 && this.props.images !== nextProps.images && this.props.getImagesLoading && this.props.fromUpdate){
            let currentImage = nextProps.images.find(images => images.image_id === this.props.imageId);
            let currentNetworks = nextProps.network_names.find(network_names => network_names === currentImage.network_name);
            //let currentServers =  nextProps.servers.find(servers => servers.server_id === currentImage.server_id);
            this.initialize(currentImage)
            this.setState({currentImage: currentImage});
        }
    }


    async componentDidMount(){
        this.props.getUrlFilterPolicies();
        this.props.getServers()
        this.props.getServerPools()
        if (this.props.fromUpdate){
            this.props.getImages();
            this.props.getServerCustomNetworkNames();
        }

        if(this.props.editWorkspace) {
            this.setState({
                selectedWorkspace: this.props.editWorkspace.sha
            })
            this.initialize(this.normalize(this.props.editWorkspace))
        }

        if (_.isEmpty(this.props.systemInfo)) {
            await this.props.getSystemInfo()
        }


        try {
            const registries = await this.props.getRegistries()

            let version = _.get(this.props.systemInfo, 'system_info.api.build_id', null)
            const { allWorkspaces } = completeWorkspacesList(registries.response.registries, version)

            this.setState({
                workspaceslist: {
                    workspaces: allWorkspaces
                }
            })
        } catch (e) {

        }
    }

    getServerIdFunc(){
        this.props.getServers();
    }

    getZoneIdFunc(){
        this.props.getZones();
    }

    getServerClickFunc(){
        this.props.getServerCustomNetworkNames();
    }

    normalize(app) {
        return {
            ...app,
            memory: app.memory || 2768,
            cores: app.cores || 2,
            gpu_count: app.gpu_count || 0,
            enabled: true,
            cpu_allocation_method: app.cpu_allocation_method || 'Inherit',
            image_type: 'Container',
        }
    }

    changeWorkspaceType(sha) {
        const app = this.state.workspaceslist.workspaces.find(element => element.sha === sha)
        if (app) {
            this.setState({ selectedWorkspace: sha })
            this.initialize(this.normalize(app));
        }
    }

    render(){
        const {handleSubmit, network_names, servers, zones, imageFormValues, filters, server_pools, t, agent_installed} = this.props;
        const {currentImage} =  this.state;
        const checked = currentImage && currentImage.enabled;
        const allow_network_selection = currentImage && currentImage.allow_network_selection;
        const restrict_to_network = currentImage && currentImage.restrict_to_network;
        const restrict_to_server = currentImage && currentImage.restrict_to_server;
        const restrict_to_zone = currentImage && currentImage.restrict_to_zone;
        const require_gpu = currentImage && currentImage.require_gpu;
        const hidden = currentImage && currentImage.hidden;
        const notes = currentImage && currentImage.notes;
        let options = [];
        for(let i=0 ; i < network_names.length ; i++){
            options.push({ label: network_names[i], value: network_names[i]});
        }
        options.sort((a, b) => (a.label.toLowerCase() > b.label.toLowerCase()) ? 1 : -1);

        let optionsAgent = [];
        servers.map(opt => {
            if (opt.server_type === "host") {
                optionsAgent.push({label: opt.server_id.substring(0, 6), value: opt.server_id, hostname: opt.hostname});
            }
        });
        optionsAgent.sort((a, b) => (a.label.toLowerCase() > b.label.toLowerCase()) ? 1 : -1);

        let optionServer = [];
        servers.map(opt => {
            if (opt.server_type === "Desktop" && opt.is_autoscaled === false) {
                optionServer.push({label: opt.friendly_name, value: opt.server_id, hostname: opt.hostname });
            }
        });
        optionServer.sort((a, b) => (a.label && a.label.toLowerCase() > b.label.toLowerCase()) ? 1 : -1);

        let optionServerPools = [];
        server_pools.map(opt => {
            if (opt.server_pool_type === "Server Pool") {
                optionServerPools.push({label: opt.server_pool_name, value: opt.server_pool_id});
            }
        });
        optionServerPools.sort((a, b) => (a.label.toLowerCase() > b.label.toLowerCase()) ? 1 : -1);

        let optionsZones = [];
        zones.map(opt => {
            optionsZones.push({label: opt.zone_name, value: opt.zone_id, zone_name: opt.zone_name });
        });
        optionsZones.sort((a, b) => (a.label.toLowerCase() > b.label.toLowerCase()) ? 1 : -1);

        let optionsFilters = [{label: t('workspaces.inherit'), value: "inherit"}, {label: t('workspaces.force-disabled'), value: "force_disabled"}];
        filters.map(opt => {
            optionsFilters.push({label: opt.filter_policy_name, value: opt.filter_policy_id});
        });
        optionsFilters.sort((a, b) => (a.label.toLowerCase() > b.label.toLowerCase()) ? 1 : -1);

        let filter_policy_id_value = "inherit";
        if (currentImage && currentImage.filter_policy_force_disabled) {
            filter_policy_id_value = "force_disabled";
        }
        if (imageFormValues && imageFormValues.filter_policy_id) {
            filter_policy_id_value = imageFormValues.filter_policy_id;
        }

        let optionsImageType = [{label: t('workspaces.container'), value: "Container"},   {label: t('workspaces.link'), value: "Link"}, {label: t('workspaces.server'), value: "Server"}, {label: t('workspaces.pool'), value: "Server Pool"},];
        let optionsConnectionType = [{label: "KasmVNC", value: "KasmVNC"}, {label: "RDP", value: "RDP"}];

        let optionsCpuAllocationMethods = [{label: t('workspaces.inherit'), value: "Inherit"},   {label: t('workspaces.quotas'), value: "Quotas"}, {label: t('workspaces.shares'), value: "Shares"}];

        let container_options = []
        if(this.props.architectures && this.state.workspaceslist) {
            container_options = this.state.workspaceslist.workspaces.filter(workspace => workspace.architecture.some(value => this.props.architectures.indexOf(value) !== -1))
            container_options = container_options.map(({ sha, name, author }) => ({ value: sha, label:  name + ' (' + author + ')'}))
        }
        return (
            <Groups onSubmit={handleSubmit(this.props.save)} section={this.props.section}>
                <Group title="details" description="details-description">
                    <Field name="image_type"
                        selectedValue={imageFormValues && imageFormValues.image_type ? imageFormValues.image_type : ""}
                        options={optionsImageType}
                        validate={required} required
                        isUpdateForm={this.props.fromUpdate}
                        component={SelectInput}
                        disabled={this.state.currentImage && this.state.currentImage.image_id ? true : false}
                    />
                    {this.state.workspaceslist && imageFormValues && imageFormValues.image_type === 'Container' && hasAuth('registries') &&  (
                        <Field name="selected-app"
                            selectedValue={this.state.selectedWorkspace}
                            options={container_options}
                            onChange={this.changeWorkspaceType}
                            component={SelectInput}
                        />
                    )}

                    <Field name="friendly_name"
                        id="friendly_name"
                        component={renderField}
                        validate={required} required
                    />
                    <Field name="description"
                        id="description"
                        component={renderField}
                        validate={required} required
                    />
                    <Field name="image_src"
                        id="image_src"
                        component={renderField}
                    />
                    <Field name="enabled"
                        id="enabled"
                        checked={checked}
                        type="checkbox"
                        component={renderToggle}
                    />
                    </Group>
                    {imageFormValues && imageFormValues.image_type === "Link" &&
                    <Group title="link-details" description="link-details-description">
                        <Field type="text"
                            name="link_url"
                            id="link_url"
                            component={renderField}
                            validate={required} required
                        />
                        </Group>
                    }

                    {imageFormValues && imageFormValues.image_type === "Server" && 
                    <Group title="server-details" description="server-details-description">
                        {hasAuth('servers') && <Field name="server_id"
                            selectedValue={imageFormValues.server_id}
                            options={optionServer}
                            renderOption={renderOption}
                            renderValue={renderValue}
                            isUpdateForm={this.props.fromUpdate}
                            validate={required} required
                            component={SelectInput} />}
                        <Field name="persistent_profile_path"
                            id="persistent_profile_path"
                            component={renderField}
                        />

                    </Group>
                    }

                    {imageFormValues && imageFormValues.image_type === "Server Pool" &&
                    <Group title="pool-details" description="pool-details-description">
                        {hasAuth('pools') && <Field name="server_pool_id"
                            selectedValue={imageFormValues.server_pool_id}
                            options={optionServerPools}
                            isUpdateForm={this.props.fromUpdate}
                            validate={required} required
                            component={SelectInput} />}
                        <Field name="persistent_profile_path"
                            id="persistent_profile_path"
                            component={renderField}
                        />

                            </Group>
                    }


                    {imageFormValues && imageFormValues.image_type === "Container" ?
                        <Group title="container-details" description="container-details-description">
                            <FormField label="docker-image">
                                <Field type="text"
                                    name="name"
                                    id="name"
                                    component={renderField}
                                    validate={required} required
                                />
                            </FormField>
                            <Field type="number"
                                name="cores"
                                id="cores"
                                component={renderField}
                                validate={[required, positive_float]} required
                                placeholder="2"
                                disabled={!hasAuth(['image_resources'])}
                            />
                            <FormField label="memory-mb">
                                <Field type="number"
                                    name="memory"
                                    id="memory"
                                    component={renderField}
                                    validate={[required, number]} required
                                    placeholder="2768"
                                    ref="memory"
                                    disabled={!hasAuth(['image_resources'])}
                                />

                            </FormField>
                            <Field type="number"
                                name="gpu_count"
                                id="gpu_count"
                                component={renderField}
                                validate={number} required
                                placeholder="0"
                                disabled={!hasAuth(['image_resources'])}
                            />
                            <FormField label="uncompressed-image-size-mb">
                                <Field type="number"
                                    name="uncompressed_size_mb"
                                    id="uncompressed_size_mb"
                                    component={renderField}
                                    validate={imageFormValues && imageFormValues.uncompressed_size_mb ? [number] : null}
                                    placeholder="0"
                                    disabled={!hasAuth('image_resources')}
                                />
                            </FormField>
                            <Field name="cpu_allocation_method"
                                selectedValue={imageFormValues && imageFormValues.cpu_allocation_method ? imageFormValues.cpu_allocation_method : ""}
                                options={optionsCpuAllocationMethods}
                                validate={required} required
                                isUpdateForm={this.props.fromUpdate}
                                component={SelectInput}
                                disabled={!hasAuth(['image_resources'])}
                            />
                            <Field name="docker_registry"
                                id="docker_registry"
                                component={renderField}
                                disabled={!hasAuth(['image_resources'])}
                            />
                            <FormField label="docker-registry-username">
                                <Field name="docker_user"
                                    id="docker_user"
                                    component={renderField}
                                    disabled={!hasAuth(['image_resources'])}
                                />
                            </FormField>
                            <FormField label="docker-registry-password">
                                <Field type="password"
                                    name="docker_token"
                                    id="docker_token"
                                    component={renderPass}
                                    disabled={!hasAuth(['image_resources'])}
                                />
                            </FormField>
                            <Field name="hash"
                                id="hash"
                                component={renderField}
                                disabled={!hasAuth(['image_resources'])}
                            />
                            <Field name="persistent_profile_path"
                                id="persistent_profile_path"
                                component={renderField}
                            />
                            <FormField label="volume-mappings-json">
                                <Field type="textarea"
                                    name="volume_mappings"
                                    id="volume_mappings"
                                    component={renderTextArea}
                                    disabled={!hasAuth(['image_resources'])}
                                />
                            </FormField>
                            <FormField label="docker-run-config-override-jso">
                                <Field type="textarea"
                                    name="run_config"
                                    id="run_config"
                                    component={renderTextArea}
                                    disabled={!hasAuth(['image_resources'])}
                                />
                            </FormField>
                            <FormField label="docker-exec-config-json">
                                <Field type="textarea"
                                    name="exec_config"
                                    id="exec_config"
                                    component={renderTextArea}
                                    disabled={!hasAuth(['image_resources'])}
                                />
                            </FormField>
                            {hasAuth('webfilter') && <FormField label="web-filter-policy">
                                <Field name="filter_policy_id"
                                    selectedValue={filter_policy_id_value}
                                    options={optionsFilters}
                                    isUpdateForm={this.props.fromUpdate}
                                    component={SelectInput} />
                            </FormField>}
                            <FormField label="allow-network-selection" tooltip="allow-users-to-select-the-dock">
                                <Field name="allow_network_selection"
                                    id="allow_network_selection"
                                    checked={allow_network_selection}
                                    type="checkbox"
                                    component={renderToggle}
                                />
                            </FormField>
                            {hasAuth('images') && <FormField label="restrict-image-to-docker-netwo" tooltip="kasm-images-can-be-configured-">
                                <Field name="restrict_to_network"
                                    id="restrict_to_network"
                                    checked={restrict_to_network}
                                    onChange={() => this.getServerClickFunc()}
                                    type="checkbox"
                                    component={renderToggle}
                                />
                            </FormField>}
                            {imageFormValues && imageFormValues.restrict_to_network === true && hasAuth('images') &&
                                <FormField label="docker-networks">
                                    <Field name="restrict_network_names"
                                        selectedValue={imageFormValues.restrict_network_names}
                                        options={options}
                                        validate={required} required
                                        multi
                                        isUpdateForm={this.props.fromUpdate}
                                        component={SelectInput} />
                                </FormField>
                            }
                            {hasAuth('agents') && <FormField label="restrict-image-to-kasm-agent" tooltip="kasm-images-can-be-configured--0">
                                <Field name="restrict_to_server"
                                    id="restrict_to_server"
                                    onChange={() => this.getServerIdFunc()}
                                    checked={restrict_to_server}
                                    type="checkbox"
                                    component={renderToggle}
                                />
                            </FormField>}
                            {imageFormValues && imageFormValues.restrict_to_server === true && hasAuth('agents') &&
                                <FormField label="kasm-server">
                                    <Field name="server_id"
                                        selectedValue={imageFormValues.server_id}
                                        options={optionsAgent}
                                        renderOption={renderOption}
                                        renderValue={renderValue}
                                        isUpdateForm={this.props.fromUpdate}
                                        validate={required} required
                                        component={SelectInput} />
                                </FormField>
                            }
                            {hasAuth('zones') && <FormField label="restrict-image-to-a-deployment" tooltip="kasm-images-can-be-configured--1">
                                <Field name="restrict_to_zone"
                                    id="restrict_to_zone"
                                    onChange={() => this.getZoneIdFunc()}
                                    checked={restrict_to_zone}
                                    type="checkbox"
                                    component={renderToggle}
                                />
                            </FormField>}
                            {imageFormValues && imageFormValues.restrict_to_zone === true && hasAuth('zones') &&
                                <FormField label="Deployment Zone">
                                    <Field name="zone_id"
                                        selectedValue={imageFormValues.zone_id}
                                        options={optionsZones}
                                        isUpdateForm={this.props.fromUpdate}
                                        validate={required} required
                                        component={SelectInput} />
                                </FormField>
                            }
                        </Group>
                        : ""}
                        <Group title="other-details" description="other-details-description">
                    <FormField label="categories-one-per-line">
                        <Field type="textarea"
                            name="categories"
                            id="categories"
                            component={renderTextArea}
                        />
                    </FormField>
                    {imageFormValues && imageFormValues.image_type != "Link" &&
                        <FormField label="session-time-limit-seconds">
                            <Field type="number"
                                name="session_time_limit"
                                id="session_time_limit"
                                component={renderField}
                                validate={empty_or_number}
                            />
                        </FormField>
                    }
                    <FormField label="hide-image-on-dashboard">
                        <Field name="hidden"
                            id="hidden"
                            checked={hidden}
                            type="checkbox"
                            component={renderToggle}
                        />
                    </FormField>
                    {imageFormValues && imageFormValues.image_type != "Link" &&
                        <FormField label="launch-config-json">
                            <Field type="textarea"
                                name="launch_config"
                                id="launch_config"
                                component={renderTextArea}
                                validate={json}
                            />
                        </FormField>
                    }
                    <FormField label="notes">
                        <Field type="textarea"
                            name="notes"
                            id="notes"
                            component={renderTextArea}
                        />
                    </FormField>
                </Group>
                <FormFooter cancel={() => this.props.history.push("/workspaces")} />
            </Groups>
        );
    }
}

ImageFormTemplate.propTypes = {
    updateImages: Proptypes.func.isRequired,
    getImages: Proptypes.func.isRequired,
    getServerCustomNetworkNames: Proptypes.func.isRequired,
    updatErrorWarning: Proptypes.func,
    history: Proptypes.object.isRequired,
    updateImagesError: Proptypes.func,
    updateErrorImagesMessage: Proptypes.string,
    createImagesError: Proptypes.func,
    fromUpdate: Proptypes.bool,
    fromClone: Proptypes.bool,
    errorCreateImageMessage: Proptypes.string,
    error_message: Proptypes.string,
    createImage: Proptypes.func,
    images: Proptypes.array,
    getImagesLoading: Proptypes.bool,
    initialize: Proptypes.func,
    imageFormValues: Proptypes.object,
    network_names: Proptypes.array,
    getServers: Proptypes.func,
    getServerPools: Proptypes.func,
    getZones: Proptypes.func,
    handleSubmit: Proptypes.func,
    imageId: Proptypes.string,
    servers: Proptypes.array,
    server_pools: Proptypes.array,
    zones: Proptypes.array,
    filters: Proptypes.array,
};

let ImageFormWithRouter = withRouter(ImageFormTemplate);


let ImageForm =  connect(state =>
    ({

        images: state.images.images || [],
        architectures: state.images.architectures || [],
        editWorkspace: state.images.editWorkspace || false,
        network_names: state.images.network_names || [],
        servers: state.servers.servers || [],
        server_pools: state.server_pools.server_pools || [],
        zones: state.zones.zones || [],
        filters: state.filter.filters || [],
        imageFormValues: state.form && state.form.imageForm && state.form.imageForm.values ? state.form.imageForm.values : null,
        errorCreateImageMessage: state.images.errorCreateImageMessage || null,
        updateErrorImagesMessage: state.images.updateErrorImagesMessage || null,
        error_message: state.images.error_message || null,
        updateImagesError: state.images.updateImagesError || null,
        getImagesLoading: state.images.getImagesLoading || false,
        createImagesError: state.images.createImagesError || null,
        systemInfo: state.system_info || {}
    }),
dispatch =>
    ({
        updateImages: (data) => dispatch(updateImages(data)),
        getServerCustomNetworkNames: () => dispatch(getServerCustomNetworkNames()),
        getServers: () => dispatch(getServers()),
        getServerPools: () => dispatch(getServerPools()),
        getZones: () => dispatch(getZones()),
        getImages: () => dispatch(getImages()),
        getUrlFilterPolicies: () => dispatch(getUrlFilterPolicies()),
        getRegistries: () => dispatch(getRegistries()),
        getSystemInfo: () => dispatch(getSystemInfo()),

    }))(ImageFormWithRouter);
    const ImageFormTranslated = withTranslation('common')(ImageForm)
export default reduxForm({
    form: "imageForm",
    onSubmitFail: (errors) => submitFailure(errors)
})(ImageFormTranslated);
