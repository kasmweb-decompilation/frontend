import React,{Component} from "react";
import { Field, reduxForm } from "redux-form";
import { renderField, required, number } from "../../../utils/formValidations.js";
import { connect } from "react-redux";
import {getGroups} from "../../../actions/actionGroup";
import { withRouter } from "react-router-dom";
import Proptypes from "prop-types";
import {withTranslation} from "react-i18next";
import { Groups, Group, FormField, Button, FormFooter } from "../../../components/Form/Form.js"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLayerPlus } from '@fortawesome/free-solid-svg-icons/faLayerPlus';


class GroupFormTemplate extends Component  {
    constructor(props){
        super(props);
        this.state  = {
            currentGroup: null,
        };
        this.initializeForm = this.initializeForm.bind(this);
        this.addMetaRow= this.addMetaRow.bind(this);
    }

    addMetaRow() {
        let currentGroup = {
            ...this.state.currentGroup
        }
        currentGroup.group_metadata = {
            ...currentGroup.group_metadata,
            ['key' + Date.now()]: ''
        }
        this.setState({currentGroup: currentGroup});
    }


    initializeForm(res){
        let currentGroup = res.response.groups.find(groups => groups.group_id === this.props.groupId);
        this.setState({currentGroup: currentGroup});

        let form_metadata = []
        if(currentGroup.group_metadata) {
            Object.keys(currentGroup.group_metadata).map((key, i) => {
                form_metadata[i] = {
                    key,
                    value: currentGroup.group_metadata[key]
                } 
            })
        }
        this.props.initialize({
            description: currentGroup.description,
            is_system: currentGroup.is_system,
            name: currentGroup.name,
            priority: currentGroup.priority,
            form_metadata
        });
    }

    componentDidMount(){
        if (this.props.fromUpdate){
            this.props.getGroups().then((res) => this.initializeForm(res));
        }
    }

    render(){
        const {handleSubmit, groupFormValues, availableKasms, t} = this.props;
        const {currentGroup} =  this.state;

        return (
                <Groups onSubmit={handleSubmit(this.props.save)} section={this.props.section}>
                    <Group title="group-details" description="group-details-description">
                            <Field type="text"
                                name="name" 
                                component={renderField} 
                                validate={required} required
                            /> 
                        <FormField section="groups" tooltip="lowest-priority-will-win">
                            <Field 
                                type="number"
                                name="priority" 
                                component={renderField} 
                                validate={[required, number]} required
                                placeholder="10"
                            /> 
                        </FormField>
                            <Field 
                                type="text"
                                name="description" 
                                component={renderField}
                            /> 
                    </Group>
                    <Group title="metadata" description="metadata-description" tooltip="add-metadata-to-a-group">
                        {currentGroup && currentGroup.group_metadata && Object.keys(currentGroup.group_metadata).map((key, i) => 
                        <div key={i} className="tw-flex tw-gap-8 tw-w-full">
                            <FormField section="groups" label="key" className="tw-w-1/2">
                                <Field type="text"
                                    name={'form_metadata['+i+'].key'}
                                    component={renderField} 
                                /> 
                            </FormField>
                            <FormField section="groups" label="value" className="tw-w-1/2">
                                <Field type="text"
                                    name={'form_metadata['+i+'].value'} 
                                    component={renderField} 
                                /> 
                            </FormField>
                        </div>
                        )}

                        <div><Button section="groups" onClick={() => this.addMetaRow()} icon={<FontAwesomeIcon icon={faLayerPlus} />} name="add-row" color="tw-bg-slate-500" /></div>

                    </Group>
                    <FormFooter cancel={() => this.props.history.push("/groups")} />

                </Groups>
        );
    }
}

GroupFormTemplate.propTypes = {
    history: Proptypes.object.isRequired,
    createGroup: Proptypes.func,
    updateGroups: Proptypes.func,
    updateGroupsError:  Proptypes.func,
    getGroups: Proptypes.func.isRequired,
    createGroupWarning: Proptypes.string,
    getAdminUsers: Proptypes.func,
    handleSubmit: Proptypes.func,
    fromUpdate: Proptypes.bool,
    errorMessageUpdateGroup: Proptypes.string,
    groupFormValues: Proptypes.object,
    getGroupsLoading: Proptypes.bool,
    userId: Proptypes.func,
    initialize: Proptypes.func,
    groupId: Proptypes.string,
    groups: Proptypes.array,

};

let GroupFormWithRouter = withRouter(GroupFormTemplate);

let GroupForm =  connect(state => 
    ({
        groups: state.groups.groups || [],
        groupFormValues: state.form && state.form.groupForm && state.form.groupForm.values ? state.form.groupForm.values : null,
        getGroupsLoading: state.admin.getGroupsLoading || false,
        errorMessageUpdateGroup: state.groups.errorMessageUpdateGroup || null,
        createGroupWarning: state.groups.createGroupWarning || null,
    }),
dispatch => 
    ({
        getGroups: () => dispatch(getGroups()),
    }))(GroupFormWithRouter);
    const GroupFormTranslated = withTranslation('common')(GroupForm)
export default reduxForm({
    form: "groupForm",
})(GroupFormTranslated);
