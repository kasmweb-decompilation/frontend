import React,{ Component } from "react";
import {connect} from "react-redux";
import { getKasmId} from "../../../actions/actionKasm";
import { Row, Col} from "reactstrap";
import Proptypes from "prop-types";
import moment from "moment";
import {withTranslation} from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTable } from '@fortawesome/free-solid-svg-icons/faTable';
import PageHeader, { parentRoutes } from "../../../components/Header/PageHeader";
import { Groups, Group, ViewField, TabList, FormFooter, Button } from "../../../components/Form"
import { renderField } from "../../../utils/formValidations.js";
import { bytesToSize } from "../../../utils/helpers"

const parentRouteList = parentRoutes('/kasm')
const newRoutes = [
    ...parentRouteList.routes,
    {name: "generic.view",path:"/viewkasm",isActive: true},
];

class ViewKasm extends Component{
    constructor(props){
        super(props);
        this.state = {
            tab: 'form',
        }
    }
  
    componentDidMount(){
        this.props.getKasmId(this.props.match.params.id);
    }

    render(){
        const {kasm, t} = this.props;

        const tabList = [
            { name: 'workspaces.session', key: 'form'},
            { name: 'workspaces.agent', key: 'agent'},
            { name: 'workspaces.workspace', key: 'workspace'},
            { name: 'workspaces.user', key: 'user'},
        ]

        let url = "";
        if (kasm != null)
            url = "https://" + kasm.hostname + window.location.pathname  + "#/kasm/" + kasm.kasm_id.substring(0, 6);
        return (
            <div className="profile-page">
                <PageHeader location={this.props.location} routes={typeof newRoutes !== 'undefined' ? newRoutes : null} title={t('workspaces.session')} icon={<FontAwesomeIcon icon={faTable} />} />
                <Row>
                    <Col sm={{ size: 10, order: 3, offset: 1 }}>
                        <TabList {...this.props} tabList={tabList} currentTab={this.state.tab} setCurrentTab={(value) => this.setState({ tab: value })} />
                        <div className={kasm && this.state.tab === 'form' ? 'tw-block' : 'tw-hidden'}>
                            <Groups section="workspaces">
                                <Group title="details-session" description="details-session-description">
                                    <ViewField type="text"
                                        name="id"
                                        value={kasm && kasm.kasm_id ? kasm.kasm_id : "-"}
                                        component={renderField}
                                    />
                                    <ViewField type="text"
                                        name="url"
                                        value={url}
                                        component={renderField}
                                    />
                                    <ViewField type="text"
                                        name="created"
                                        value={kasm && moment(kasm.created_date).isValid() ? moment.utc(kasm.created_date).local().format("lll") : "-"}
                                        component={renderField}
                                    />
                                    <ViewField type="text"
                                        name="assigned"
                                        value={kasm && kasm.start_date ? moment.utc(kasm.start_date).local().format("lll") : '-'}
                                        component={renderField}
                                    />
                                    <ViewField type="text"
                                        name="expiration"
                                        value={kasm && moment(kasm.expiration_date).isValid() ? moment.utc(kasm.expiration_date).local().format("lll") : "-"}
                                        component={renderField}
                                    />
                                    <ViewField type="text"
                                        name="last-accessed"
                                        value={kasm && moment(kasm.keepalive_date).isValid() ? moment.utc(kasm.keepalive_date).local().fromNow() : "-"}
                                        component={renderField}
                                    />
                                    <ViewField type="text"
                                        name="ip-address"
                                        value={kasm && kasm.container_ip ? kasm.container_ip : "-"}
                                        component={renderField}
                                    />
                                    <ViewField type="text"
                                        name="cores"
                                        value={kasm && kasm.cores ? kasm.cores : "-"}
                                        component={renderField}
                                    />
                                    <ViewField type="text"
                                        name="memory"
                                        value={kasm && kasm.memory ? bytesToSize(kasm.memory) : "-"}
                                        component={renderField}
                                    />
                                    <ViewField type="text"
                                        name="status"
                                        value={kasm && kasm.operational_status ? kasm.operational_status : "-"}
                                        component={renderField}
                                    />
                                    <ViewField type="text"
                                        name="point-of-presence"
                                        value={kasm && kasm.point_of_presence ? kasm.point_of_presence : "-"}
                                        component={renderField}
                                    />
                                </Group>
                            </Groups>
                        </div>
                        <div className={kasm && this.state.tab === 'agent' ? 'tw-block' : 'tw-hidden'}>
                            <Groups section="agents">
                                <Group title="details-session" description="details-session-description">
                                    <ViewField type="text"
                                        name="id"
                                        value={kasm && kasm.server_id ? kasm.server_id : "-"}
                                        component={renderField}
                                    />
                                    <ViewField type="text"
                                        name="hostname"
                                        value={kasm && kasm.server.hostname ? kasm.server.hostname : "-"}
                                        component={renderField}
                                    />
                                    <ViewField type="text"
                                        name="Zone"
                                        value={kasm && kasm.server.zone_name ? kasm.server.zone_name : "-"}
                                        component={renderField}
                                    />
                                    <ViewField type="text"
                                        name="Provider"
                                        value={kasm && kasm.server.provider ? kasm.server.provider : "-"}
                                        component={renderField}
                                    />
                                </Group>
                            </Groups>
                        </div>
                        <div className={kasm && this.state.tab === 'workspace' ? 'tw-block' : 'tw-hidden'}>
                            <Groups section="workspaces">
                                <Group title="details-session" description="details-session-description">
                                    <ViewField type="text"
                                        name="id"
                                        value={kasm && kasm.image_id ? kasm.image_id : "-"}
                                        component={renderField}
                                    />
                                    <ViewField type="text"
                                        name="docker-image"
                                        value={kasm && kasm.image.name ? kasm.image.name : "-"}
                                        component={renderField}
                                    />
                                    <ViewField type="text"
                                        name="friendly-name"
                                        value={kasm && kasm.image.friendly_name ? kasm.image.friendly_name : "-"}
                                        component={renderField}
                                    />
                                </Group>
                            </Groups>
                        </div>
                        <div className={kasm && this.state.tab === 'user' ? 'tw-block' : 'tw-hidden'}>
                            <Groups section="users">
                                <Group title="details-session" description="details-session-description">
                                    <ViewField type="text"
                                        name="Id"
                                        value={kasm && kasm.user_id ? kasm.user_id : "-"}
                                        component={renderField}
                                    />
                                    <ViewField type="text"
                                        name="username"
                                        value={kasm && kasm.user.username ? kasm.user.username : "-"}
                                        component={renderField}
                                    />
                                </Group>
                            </Groups>
                        </div>
                        <FormFooter cancelButton={<Button className="tw-bg-slate-500" icon={<FontAwesomeIcon icon={faTable} />} type="cancel" section="buttons" name="back" onClick={() => this.props.history.push("/kasm")} />} saveButton={' '} />
                    </Col>
                </Row>
            </div>
        );}
}

ViewKasm.propTypes = {
    getKasmId: Proptypes.func.isRequired,
    kasm: Proptypes.object,
    match: Proptypes.object,
};
const ViewKasmTranslated = withTranslation('common')(ViewKasm)
export default connect(state => 
    ({
        kasm: state.kasms.kasm || null,
        getKasm_IdLoading: state.kasms.getKasm_IdLoading || false,
    }),
dispatch => 
    ({  
        getKasmId: (data) => dispatch(getKasmId(data)),
    }))(ViewKasmTranslated);
