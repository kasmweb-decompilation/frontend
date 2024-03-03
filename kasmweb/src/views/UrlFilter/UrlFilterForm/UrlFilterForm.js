import React, {Component} from 'react';
import { connect } from "react-redux";
import { Field, reduxForm, formValueSelector } from "redux-form";
import { renderField, renderSelectField, renderToggle, required, renderTextArea, json } from "../../../utils/formValidations.js";
import { withRouter } from "react-router-dom";
import { Form, FormGroup, Button as RSButton, Label, Row, Col, CardBody, CardFooter, Collapse, Alert } from "reactstrap";
import Proptypes from "prop-types";
import { NotificationManager } from "react-notifications";
import {getUrlFilterPolicies , getUrlFilterCategories, getSafeSearchPatterns} from "../../../actions/actionFilters";
import { getLicenseStatus} from "../../../actions/actionFooter";
import {withTranslation} from "react-i18next";
import { Groups, Group, FormField, Button, FormFooter } from "../../../components/Form"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/pro-light-svg-icons/faChevronDown';
import { faChevronUp } from '@fortawesome/pro-light-svg-icons/faChevronUp';

class UrlFilterFormTemplate extends Component {
    constructor (props){
        super(props);
        this.state = {
            currentFilter: {},
            collapseAdvanced: false,
            licensed: false,
        };
        this.toggleAdvanced = this.toggleAdvanced.bind(this);
    }

    toggleAdvanced() {
        this.setState({collapseAdvanced: !this.state.collapseAdvanced})
    }

    UNSAFE_componentWillReceiveProps(nextProps){
        if(nextProps.filters && nextProps.filters.length > 0 && this.props.filters !== nextProps.filters && this.props.getFilterLoading && this.props.fromUpdate){
            let currentFilter = nextProps.filters.find(filter => filter.filter_policy_id === this.props.filterPolicyId);
            this.setState({currentFilter: currentFilter});
            this.props.initialize({
                filter_policy_name: currentFilter.filter_policy_name,
                filter_policy_descriptions: currentFilter.filter_policy_descriptions,
                domain_blacklist: currentFilter.domain_blacklist ? currentFilter.domain_blacklist.join('\n') : '',
                domain_whitelist: currentFilter.domain_whitelist ? currentFilter.domain_whitelist.join('\n') : '',
                ssl_bypass_domains: currentFilter.ssl_bypass_domains ? currentFilter.ssl_bypass_domains.join('\n') : '',
                ssl_bypass_ips: currentFilter.ssl_bypass_ips ? currentFilter.ssl_bypass_ips.join('\n') : '',
                categories: currentFilter.categories,
                deny_by_default: currentFilter.deny_by_default,
                enable_categorization: currentFilter.enable_categorization,
                enable_safe_search: currentFilter.enable_safe_search,
                disable_logging: currentFilter.disable_logging,
                safe_search_patterns: currentFilter.safe_search_patterns ? JSON.stringify(currentFilter.safe_search_patterns, undefined, 4) : '[]',
            });
            if ((currentFilter.ssl_bypass_ips && currentFilter.ssl_bypass_ips.length > 0 )  ||
                currentFilter.ssl_bypass_domains && currentFilter.ssl_bypass_domains.length > 0){
                this.toggleAdvanced()
            }
        }
    }

    componentDidMount() {
        this.props.getUrlFilterCategories();

        if (this.props.fromUpdate) {
            this.props.getUrlFilterPolicies();
        }
        else{
            this.props.getSafeSearchPatterns().then((res) => {
                if (res.response && res.response.safe_search_patterns)
                {
                    this.props.initialize({safe_search_patterns: JSON.stringify(res.response.safe_search_patterns, undefined, 4)})
                }
            });

        }
        this.props.getLicenseStatus()
            .then(() => {
                const {license_info} = this.props;
                if (license_info && license_info.status && license_info.status.features && license_info.status.features.indexOf('url_categorization') >= 0 ){
                    this.setState({licensed: true});
                }
            });
    }

    create_categories(data){
        const { t } = this.props;
        if (data.length > 0) {
            return data.map(function (category, keyIndex) {
                let name = "categories." + category.id;
                return (
                    <FormGroup key={name}>
                        <Row>
                            <Col sm="6">
                                <Label htmlFor={category.id}>{category.label}</Label>
                            </Col>

                            <Col sm="6">
                                <Field type="name"
                                       name={name}
                                       id={category.id}
                                       component={renderSelectField}
                                       clearable={false}>
                                    <option value="inherit">{t('filter.inherit')}</option>
                                    <option value="allow">{t('filter.allow')}</option>
                                    <option value="deny">{t('filter.deny')}</option>
                                </Field>
                            </Col>
                        </Row>
                    </FormGroup>
                )
            })
        }
    }
    all_categories(categories) {
        const { t } = this.props;
        return (
            <div>
                 <Row>
                    <Col>
                        <Label className="form-group">{t('filter.url-categories')}</Label>
                    </Col>
                 </Row>
                <div className="categories_selection">
                    <React.Fragment>
                        {this.create_categories(categories)}
                    </React.Fragment>
                </div>
            </div>

        );
    }

    license_check() {
        const { t } = this.props;
        if (!this.state.licensed){
            let license_url = `${__LICENSE_INFO_URL__}`;
            return (
                <Alert color="none" isOpen={true}>
                    <h4>{t('licensing.unavailable')}</h4>
                    {t('licensing.this-feature-must-be-licensed')}
                    <hr />
                    <a href={license_url}>{t('licensing.more-information')}</a><br/>
                </Alert>
            )
        }
    }


    render() {
        const {handleSubmit, categories, has_categorization_enabled, t} = this.props;
        const deny_by_default_checked = false;
        const enable_categorization_checked = false;
        const enable_safe_search_checked = false;
        const disable_logging_checked = false;

        return (
            <Groups onSubmit={handleSubmit(this.props.save)} section={this.props.section}>
                <Group title="details" description="details-description">
                    <FormField label="name">
                        <Field type="text"
                            name="filter_policy_name"
                            id="filter_policy_name"
                            component={renderField}
                            validate={required} required
                        />
                    </FormField>
                    <FormField label="description">
                        <Field type="text"
                            name="filter_policy_descriptions"
                            id="filter_policy_descriptions"
                            component={renderField}
                        />
                    </FormField>
                    <Field type="checkbox"
                        name="deny_by_default"
                        id="deny_by_default"
                        checked={deny_by_default_checked}
                        component={renderToggle}
                    />
                    <FormField label="domain-blacklist-one-per-line">
                        <Field type="textarea"
                            name="domain_blacklist"
                            id="domain_blacklist"
                            component={renderTextArea}
                        />
                    </FormField>
                    <FormField label="domain-whitelist-one-per-line">
                        <Field type="textarea"
                            name="domain_whitelist"
                            id="domain_whitelist"
                            component={renderTextArea}
                        />
                    </FormField>
                    <Field type="checkbox"
                        name="disable_logging"
                        id="disable_logging"
                        checked={disable_logging_checked}
                        component={renderToggle}
                    />
                    <Field type="checkbox"
                        name="enable_safe_search"
                        id="enable_safe_search"
                        checked={enable_safe_search_checked}
                        component={renderToggle}
                    />
                    <Field type="checkbox"
                        name="enable_categorization"
                        id="enable_categorization"
                        checked={enable_categorization_checked}
                        component={renderToggle} />
                    {has_categorization_enabled && categories &&
                        this.license_check()
                    }
                    {has_categorization_enabled && categories && this.state.licensed &&
                        this.all_categories(categories)
                    }

                </Group>
                <Group title="advanced" description="advanced-description">
                    <a className='tw-mb-6 tw-text-[var(--text-color)]' onClick={this.toggleAdvanced}>
                        <strong>{t("filter.advanced")}</strong>
                        <span className="float-right">
                            {this.state.collapseAdvanced ? <FontAwesomeIcon icon={faChevronDown} /> :
                                <FontAwesomeIcon icon={faChevronUp} />}
                        </span>
                    </a>
                    <Collapse isOpen={this.state.collapseAdvanced}>
                        <hr className="tw-mt-0" />
                        <FormField label="safe_search_patterns">
                        <Field type="textarea"
                            name="safe_search_patterns"
                            id="safe_search_patterns"
                            component={renderTextArea}
                            validate={[required, json]} required
                        />
                        </FormField>
                        <FormField label="ssl-bypass-domains-one-per-lin">
                            <Field type="textarea"
                                name="ssl_bypass_domains"
                                id="ssl_bypass_domains"
                                component={renderTextArea}
                            />
                        </FormField>
                        <FormField label="ssl-bypass-ips-one-per-line">
                            <Field type="textarea"
                                name="ssl_bypass_ips"
                                id="ssl_bypass_ips"
                                component={renderTextArea}
                            />
                        </FormField>
                    </Collapse>

                </Group>
                <FormFooter cancel={() => this.props.history.push("/webfilter")} />
            </Groups>
        );
    }
}

UrlFilterFormTemplate.proptypes = {
    createUrlFilterPolicy: Proptypes.func,
    updateUrlFilterPolicy: Proptypes.func,
    fromUpdate: Proptypes.bool,
};

let UrlFilterFormWithRouter = withRouter(UrlFilterFormTemplate);


const selector = formValueSelector('UrlFilterForm');

let UrlFilterForm =  connect(state =>{

            const has_categorization_enabled = selector(state, 'enable_categorization');

            return {
                has_categorization_enabled,
                createFilterError: state.filter.createFilterError,
                createFilterLoading: state.filter.createFilterLoading,
                createdFilter: state.filter.createdFilter,
                updateFilterError: state.filter.updateFilterError,
                updateFilterLoading: state.filter.updateFilterLoading,
                updatedFilter: state.filter.updatedFilter,
                filters: state.filter.filters,
                categories: state.filter.categories || [],
                patterns: state.filter.patterns || [],
                getFilterLoading: state.filter.getFilterLoading || false,
                getSafeSearchPatternsLoading: state.filter.getSafeSearchPatternsLoading || false,
                license_info: state.footer && state.footer.license_info ? state.footer.license_info : null,
            }
    },

    dispatch =>
        ({
            getUrlFilterPolicies: () => dispatch(getUrlFilterPolicies()),
            getUrlFilterCategories: () => dispatch(getUrlFilterCategories()),
            getSafeSearchPatterns: () => dispatch(getSafeSearchPatterns()),
            getLicenseStatus: () => dispatch(getLicenseStatus()),
        }))(UrlFilterFormWithRouter);
        const UrlFilterFormTranslated = withTranslation('common')(UrlFilterForm)
export default reduxForm({
    form: "UrlFilterForm",
})(UrlFilterFormTranslated);