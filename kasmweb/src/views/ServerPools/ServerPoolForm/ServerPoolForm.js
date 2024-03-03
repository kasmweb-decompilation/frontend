import React, { Component } from 'react';
import { connect } from "react-redux";
import { Field, reduxForm, formValueSelector } from "redux-form";
import {
    renderField,
    required,
} from "../../../utils/formValidations.js";
import SelectInput from "../../../components/SelectInput";
import { withRouter } from "react-router-dom";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import Proptypes from "prop-types";
import { NotificationManager } from "react-notifications";
import { getServerPools, updateServerPool, createServerPool } from "../../../actions/actionServerPool";
import {withTranslation} from "react-i18next";
import { Groups, Group, Button, FormFooter } from "../../../components/Form"

class ServerPoolFormTemplate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentServerPool: {},
            collapseAdvanced: false,
        };
    }



    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.server_pools && nextProps.server_pools.length > 0 && this.props.server_pools !== nextProps.server_pools && this.props.getServerPoolsLoading && this.props.fromUpdate) {
            let currentServerPool = nextProps.server_pools.find(server_pool => server_pool.server_pool_id === this.props.serverPoolId);
            this.setState({ currentServerPool: currentServerPool });
            this.props.initialize({
                server_pool_id: currentServerPool.server_pool_id,
                server_pool_name: currentServerPool.server_pool_name,
                server_pool_type: currentServerPool.server_pool_type
            });
        }
    }

    async componentDidMount() {
        try {
            await this.props.getServerPools()
            if (this.props.server_pools.length > 0 && this.props.serverPoolId !== null) {
                let currentServerPool = this.props.server_pools.find(server_pool => server_pool.server_pool_id === this.props.serverPoolId);
                this.setState({ currentServerPool: currentServerPool });    
            }
        } catch(e) {

        }

    }


    render() {
        const { handleSubmit, serverPoolFormValues, t } = this.props;
        const { currentServerPool } = this.state;
        let optionsPoolTypes = [
            { value: 'Docker Agent', label: t('pools.docker-agent') },
            { value: 'Server Pool', label: t('pools.server') }
        ]
        return (
            <Groups onSubmit={handleSubmit(this.props.save)} section={this.props.section}>
                <Group title="details" description="details-description">
                    <Field type="text"
                        name="server_pool_name"
                        id="server_pool_name"
                        component={renderField}
                        validate={required} required
                    />
                    <Field name="server_pool_type"
                        selectedValue={serverPoolFormValues && serverPoolFormValues.server_pool_type ? serverPoolFormValues.server_pool_type : ""}
                        options={optionsPoolTypes}
                        validate={required} required
                        isUpdateForm={this.props.fromUpdate}
                        disabled={this.props.fromUpdate}
                        component={SelectInput}
                    />
                </Group>
                <FormFooter cancel={() => this.props.history.push("/server_pools")} />
            </Groups>

        );
    }
}

ServerPoolFormTemplate.proptypes = {
    saveServerPool: Proptypes.func,
    fromUpdate: Proptypes.bool,
};

let ServerPoolFormWithRouter = withRouter(ServerPoolFormTemplate);


const selector = formValueSelector('ServerPoolForm');

let ServerPoolForm = connect(state => {


    return {
        saveServerPoolError: state.server_pools.saveServerPoolError,
        saveServerPoolLoading: state.server_pools.saveServerPoolLoading,
        savedServerPool: state.server_pools.savedServerPool,
        server_pools: state.server_pools.server_pools,
        getServerPoolsLoading: state.server_pools.getServerPoolsLoading || false,
        serverPoolFormValues: state.form && state.form.ServerPoolForm && state.form.ServerPoolForm.values ? state.form.ServerPoolForm.values : null,
    }
},

    dispatch =>
    ({
        getServerPools: () => dispatch(getServerPools()),
        updateServerPool: (data) => dispatch(updateServerPool(data)),
        createServerPool: (data) => dispatch(createServerPool(data)),
    }))(ServerPoolFormWithRouter);
    const ServerPoolFormTranslated = withTranslation('common')(ServerPoolForm)
export default reduxForm({
    form: "ServerPoolForm",
})(ServerPoolFormTranslated);