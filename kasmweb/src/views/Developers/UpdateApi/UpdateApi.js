import React,{ useState } from "react";
import {updateApiConfigs} from "../../../actions/actionDevloper";
import ApiForm from "../ApiForm/ApiForm";
import {useTranslation} from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCodeBranch } from '@fortawesome/free-solid-svg-icons/faCodeBranch';
import PageHeader, { parentRoutes } from "../../../components/Header/PageHeader";
import { Form } from "../../../components/Form"
import { hasAuth } from "../../../utils/axios";
import ViewApi from "../ViewApi/ViewApi";
import moment from "moment";

const parentRouteList = parentRoutes('/developers')
const newRoutes = [
    ...parentRouteList.routes,
    {name: "generic.update",path:"/updateapi",isActive: true},
];

export default function UpdateApi(props) {
    const [currentTab, setCurrentTab] = useState('form');
    const { t } = useTranslation('common');
    
    const tabList = [
        { name: 'buttons.Edit', key: 'form' },
        { name: 'groups.permissions', key: 'permissions', isHidden: !hasAuth('group_permissions') },
    ]
    
    const userData = {
        api_id: props.match.params.id
    }
    const onSuccess = () => {
        props.history.push('/developers');
    }

    const dataTransform = (userData) => {
        if (!userData.enabled) {
            userData.enabled = false;
        }
        if (!userData.read_only) {
            userData.read_only = false;
        }
        if (!userData.expires) {
            userData.expires = null;
        } else {
            userData.expires = moment(userData.expires).isValid() ? moment(userData.expires).utc().format('YYYY-MM-DD HH:mm:ss') : null;
        }

        return userData
    }

    return (
        <div>
            <PageHeader location={props.location} routes={typeof newRoutes !== 'undefined' ? newRoutes : null} title={t('developers.update-api')} icon={<FontAwesomeIcon icon={faCodeBranch} />} />
            <Form 
                {...props}
                tabList={tabList}
                setCurrentTab={setCurrentTab}
                currentTab={currentTab}
                userData={userData}
                section="developers"
                dataTransform={dataTransform}
                type="update"
                dispatchFunc={updateApiConfigs}
                onSuccess={onSuccess}
                form={<ApiForm apiId={props.match.params.id} />}
                tabs={<ViewApi currentTab={currentTab} {...props} />}
            />
        </div>

    )
}
