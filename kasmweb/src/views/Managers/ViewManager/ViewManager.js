import React,{ Component } from "react";
import {connect} from "react-redux";
import { getManagers} from "../../../actions/actionManager";
import { Row, Col } from "reactstrap";
import Proptypes from "prop-types";
import moment from "moment";
import ReactJson from 'react-json-view';
import {withTranslation} from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShieldHalved } from '@fortawesome/free-solid-svg-icons/faShieldHalved';
import PageHeader, { parentRoutes } from "../../../components/Header/PageHeader";
import { Groups, Group, ViewField } from "../../../components/Form/Form.js"
import { renderField } from "../../../utils/formValidations.js";

const parentRouteList = parentRoutes('/managers')
const newRoutes = [
    ...parentRouteList.routes,
    {name: "generic.view",path:"/viewmanager",isActive: true},
];

class ViewManager extends Component{
    constructor(props){
        super(props);
        this.state = {
            currentManager: null
        };
    }
  
    componentDidMount(){
        this.props.getManagers();
    }
      
    UNSAFE_componentWillReceiveProps(nextProps){
        if(nextProps.managers.length > 0){        	
            let currentManager = nextProps.managers.find(manager => manager.manager_id === this.props.match.params.id);
            this.setState({currentManager: currentManager});
        }
    }


    render(){
        const {currentManager} = this.state;
        const {t} = this.props;
        return (
            <div className="profile-page">  
                <PageHeader location={this.props.location} routes={typeof newRoutes !== 'undefined' ? newRoutes : null} title={t('managers.view-manager')} icon={<FontAwesomeIcon icon={faShieldHalved} />} />
                <Row>
                    <Col sm={{ size: 10, order: 3, offset: 1 }}>
                        <Groups section="managers">
                            <Group title="details" description="details-description">
                                <ViewField type="text"
                                    name="manager_id"
                                    value={currentManager && currentManager.manager_id ? currentManager.manager_id : "-"}
                                    component={renderField}
                                /> 
                                <ViewField type="text"
                                    name="manager_hostname"
                                    value={currentManager && currentManager.manager_hostname ? currentManager.manager_hostname : "-"}
                                    component={renderField}
                                /> 
                                <ViewField type="text"
                                    name="zone_name"
                                    value={currentManager && currentManager.zone_name ? currentManager.zone_name : "-"}
                                    component={renderField}
                                /> 
                                <ViewField type="text"
                                    name="manager_version"
                                    value={currentManager && currentManager.manager_version ? currentManager.manager_version : "-"}
                                    component={renderField}
                                />
                            </Group>
                            <Group title="check-in" description="check-in-description">
                                <ViewField type="text"
                                    name="first_reported"
                                    value={currentManager && moment(currentManager.first_reported).isValid() ? moment.utc(currentManager.first_reported).local().format("lll"):"-"}
                                    component={renderField}
                                /> 
                                <ViewField type="text"
                                    name="last_reported_elapsed"
                                    value={currentManager && currentManager.last_reported_elapsed ? currentManager.last_reported_elapsed : "-"}
                                    component={renderField}
                                /> 
                                <ViewField type="text"
                                    name="last_reported"
                                    value={currentManager && moment(currentManager.last_reported).isValid() ? moment.utc(currentManager.last_reported).local().format("lll"): "-"}
                                    component={renderField}
                                /> 
                            </Group>
                            <Group title="servers" description="servers-description">
                                <ViewField type="text"
                                    name="servers"
                                    value={currentManager && <ReactJson src={currentManager.servers}
                                    name={false}
                                    collapsed={true}
                                    sortKeys={true}
                                    collapseStringsAfterLength={40}
                                    enableClipboard={false}
                                    displayDataTypes={false}
                                />}
                                    component="blank"
                                /> 
                            </Group>
                        </Groups>

                    </Col>
                </Row>
            </div>
        );}
}

ViewManager.propTypes = {
    getManagers: Proptypes.func.isRequired,
    managers: Proptypes.array,
    match: Proptypes.object,
};
const ViewManagerTranslated = withTranslation('common')(ViewManager)
export default connect(state => 
    ({
        managers: state.managers.managers || []
    }),
dispatch => 
    ({  
        getManagers: () => dispatch(getManagers()),
    }))(ViewManagerTranslated);