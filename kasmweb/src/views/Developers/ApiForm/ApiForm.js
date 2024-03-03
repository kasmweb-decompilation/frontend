import React, {Component} from 'react';
import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";
import { renderField, renderToggle, required } from "../../../utils/formValidations.js";
import { withRouter } from "react-router-dom";
import Proptypes from "prop-types";
import {getApiConfigs} from "../../../actions/actionDevloper";
import { getLicenseStatus} from "../../../actions/actionFooter";
import {withTranslation} from "react-i18next";
import { Groups, Group, FormFooter, ViewField } from "../../../components/Form"
import moment from 'moment';

class ApiFormTemplate extends Component {
    constructor (props){
        super(props);
        this.state = {
            currentApi: {},
            apiModal: false,
            licensed: false
        };
    }

    UNSAFE_componentWillReceiveProps(nextProps){
        if(nextProps.apis && nextProps.apis.length > 0 && this.props.apis !== nextProps.apis && this.props.getAPILoading && this.props.fromUpdate){
            let currentApi = nextProps.apis.find(api => api.api_id === this.props.apiId);
            this.setState({currentApi: currentApi});
            this.props.initialize({
                name: currentApi.name,
                enabled: currentApi.enabled,
                read_only: currentApi.read_only,
                expires: moment.utc(currentApi.expires).local().format('YYYY-MM-DD HH:mm:ss')
            });
        }
    }

    componentDidMount() {
        if (this.props.fromUpdate) {
            this.props.getApiConfigs();
        }
        this.props.getLicenseStatus()
            .then(() => {
                const {license_info} = this.props;
                if (license_info && license_info.status && license_info.status.features && license_info.status.features.indexOf('developer_api') >= 0 ){
                    this.setState({licensed: true});
                }
            });
    }


    render() {
        const {handleSubmit, t} = this.props;
        const {checked, currentApi } = this.state;
        if (!this.state.licensed){
            let license_url = `${__LICENSE_INFO_URL__}`;
            return (
                <div>
                    <h4>{t('developers.unavailable')}</h4>
                    {t('developers.this-feature-must-be-licensed')}
                    <hr />
                    <a href={license_url}>{t('developers.more-information')}</a><br/>
                </div>
            )
        }

        return (
            <div>
                <Groups onSubmit={handleSubmit(this.props.save)} section={this.props.section}>
                    <Group title="details" description="details-description">
                        <Field type="text"
                            name="name"
                            id="name"
                            component={renderField}
                            validate={required} required
                        />
                        {this.props.fromUpdate && (
                        <ViewField type="text"
                            name="api_key"
                            value={currentApi && currentApi.api_key ? currentApi.api_key : "-"}
                            component={renderField}
                        />
                        )}
                        <Field name="enabled"
                            id="enabled"
                            checked={checked}
                            type="checkbox"
                            component={renderToggle}
                        />
                        <Field name="read_only"
                            id="read_only"
                            checked={checked}
                            type="checkbox"
                            component={renderToggle}
                        />
                        <Field type="datetime-local"
                            name="expires"
                            id="expires"
                            component={renderField}
                        />

                    </Group>
                    <FormFooter cancel={() => this.props.history.push("/developers")} />
                </Groups>
            </div>
        );
    }
}

ApiFormTemplate.proptypes = {
    createApi: Proptypes.func,
    updateApi: Proptypes.func,
    fromUpdate: Proptypes.bool,
};

let ApiFormWithRouter = withRouter(ApiFormTemplate);


let ApiForm =  connect(state =>
        ({
            createApiError: state.develop.createApiError,
            createAPILoading: state.develop.createAPILoading,
            createdApi: state.develop.createdApi,
            updateApiError: state.develop.updateApiError,
            updateAPILoading: state.develop.updateAPILoading,
            updatedApi: state.develop.updatedApi,
            apis: state.develop.apis,
            getAPILoading: state.develop.getAPILoading || false,
            license_info: state.footer && state.footer.license_info ? state.footer.license_info : null,
        }),
    dispatch =>
        ({
            getApiConfigs: () => dispatch(getApiConfigs()),
            getLicenseStatus: () => dispatch(getLicenseStatus()),
        }))(ApiFormWithRouter);
        const ApiFormTranslated = withTranslation('common')(ApiForm)
export default reduxForm({
    form: "ApiForm",
})(ApiFormTranslated);