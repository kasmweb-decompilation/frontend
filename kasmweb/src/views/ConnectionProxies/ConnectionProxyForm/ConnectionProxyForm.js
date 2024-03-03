import React, {Component} from 'react';
import { connect } from "react-redux";
import { Field, reduxForm, formValueSelector } from "redux-form";
import { renderField, required, positive_float } from "../../../utils/formValidations.js";
import { withRouter } from "react-router-dom";
import Proptypes from "prop-types";
import {getConnectionProxies } from "../../../actions/actionConnectionProxies";
import {getZones} from "../../../actions/actionZones";
import SelectInput from "../../../components/SelectInput";
import {withTranslation} from "react-i18next";
import { Groups, Group, FormFooter } from "../../../components/Form"
import { hasAuth } from '../../../utils/axios.js';

class ConnectionProxyFormTemplate extends Component {
    constructor (props){
        super(props);
        this.state = {
            currentConnectionProxy: {},
            collapseAdvanced: false,
        };
    }

    UNSAFE_componentWillReceiveProps(nextProps){
        if(nextProps.connection_proxies && nextProps.connection_proxies.length > 0 && this.props.connection_proxies !== nextProps.connection_proxies && this.props.getConnectionProxiesLoading && this.props.fromUpdate){
            let currentConnectionProxy = nextProps.connection_proxies.find(connection_proxy => connection_proxy.connection_proxy_id === this.props.connectionProxyId);
            this.setState({currentConnectionProxy: currentConnectionProxy});
            this.props.initialize({
                connection_proxy_type: currentConnectionProxy.connection_proxy_type,
                auth_token: currentConnectionProxy.auth_token,
                server_address: currentConnectionProxy.server_address,
                server_port: currentConnectionProxy.server_port,
                zone_id: currentConnectionProxy.zone_id,
            });
        }
    }

    componentDidMount() {
        this.props.getZones();
        if (this.props.fromUpdate) {
            this.props.getConnectionProxies();
        }
    }
    

    render() {
        const {handleSubmit, zones, connectionProxyFormValues, t} = this.props;
        const deny_by_default_checked = false;
        let optionsZones = [];
        zones.map(opt => {
            optionsZones.push({label: opt.zone_name, value: opt.zone_id});
        });

        let optionsConnectionTypes=[
            {value:'GUAC', label:'GUAC'}
        ]
        return (
            <Groups onSubmit={handleSubmit(this.props.save)} section={this.props.section}>
                <Group title="basic-details" description="basic-details-description">
                    <Field type="text"
                        name="server_address"
                        id="server_address"
                        component={renderField}
                        validate={required} required
                    />
                    <Field type="number"
                        name="server_port"
                        id="server_port"
                        component={renderField}
                        validate={[required, positive_float]} required
                    />
                    <Field name="connection_proxy_type"
                        selectedValue={connectionProxyFormValues && connectionProxyFormValues.connection_proxy_type ? connectionProxyFormValues.connection_proxy_type : ""}
                        options={optionsConnectionTypes}
                        validate={required} required
                        isUpdateForm={this.props.fromUpdate}
                        component={SelectInput}
                    />
                    <Field type="text"
                        name="auth_token"
                        id="auth_token"
                        component={renderField}
                        validate={required} required
                    />
                    {hasAuth('zones') && <Field name="zone_id"
                        selectedValue={connectionProxyFormValues && connectionProxyFormValues.zone_id ? connectionProxyFormValues.zone_id : ""}
                        options={optionsZones}
                        validate={required} required
                        isUpdateForm={this.props.fromUpdate}
                        component={SelectInput}
                    />}
                </Group>
                <FormFooter cancel={() => this.props.history.push("/connection_proxies")} />
            </Groups>
        );
    }
}

ConnectionProxyFormTemplate.proptypes = {
    createConnectionProxy: Proptypes.func,
    updateConnectionProxy: Proptypes.func,
    fromUpdate: Proptypes.bool,
};

let ConnectionProxyFormWithRouter = withRouter(ConnectionProxyFormTemplate);


const selector = formValueSelector('ConnectionProxyForm');

let ConnectionProxyForm =  connect(state =>{


            return {
                createConnectionProxyError: state.connection_proxies.createConnectionProxyError,
                createConnectionProxyLoading: state.connection_proxies.createConnectionProxyLoading,
                createdConnectionProxy: state.connection_proxies.createdConnectionProxy,
                updateConnectionProxyError: state.connection_proxies.updateConnectionProxyError,
                updateConnectionProxyLoading: state.connection_proxies.updateConnectionProxyLoading,
                updatedConnectionProxy: state.connection_proxies.updatedConnectionProxy,
                connection_proxies: state.connection_proxies.connection_proxies,
                getConnectionProxiesLoading: state.connection_proxies.getConnectionProxiesLoading || false,
                connectionProxyFormValues: state.form && state.form.ConnectionProxyForm && state.form.ConnectionProxyForm.values ? state.form.ConnectionProxyForm.values : null,
                zones: state.zones.zones || [],
            }
    },

    dispatch =>
        ({
            getConnectionProxies: () => dispatch(getConnectionProxies()),
            getZones: () => dispatch(getZones()),
        }))(ConnectionProxyFormWithRouter);
const ConnectionProxyFormTranslated = withTranslation('common')(ConnectionProxyForm)
export default reduxForm({
    form: "ConnectionProxyForm",
})(ConnectionProxyFormTranslated);