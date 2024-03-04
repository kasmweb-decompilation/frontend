import React,{ useState } from "react";
import {updateCastConfig} from "../../../actions/actionCast";
import CastConfigForm from "../CastConfigForm/CastConfigForm";
import {useTranslation} from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRss } from '@fortawesome/free-solid-svg-icons/faRss';
import PageHeader, { parentRoutes } from "../../../components/Header/PageHeader";
import { Form } from "../../../components/Form"
import moment from "moment";

const parentRouteList = parentRoutes('/cast')
const newRoutes = [
    ...parentRouteList.routes,
    {name: "generic.update",path:"/updatecast",isActive: true},
];

export default function UpdateCastConfig(props) {
    const [currentTab, setCurrentTab] = useState('form');
    const { t } = useTranslation('common');
    
    const tabList = [
        { name: 'buttons.Edit', key: 'form' },
    ]
    
    const userData = {
        cast_config_id: props.match.params.id
    }
    const onSuccess = () => {
        props.history.push('/cast');
    }

    const dataTransform = (userData) => {
        if (!userData.valid_until) {
            userData.valid_until = null;
        }
        else {
            userData.valid_until = moment(userData.valid_until).isValid() ? moment(userData.valid_until).utc().format('YYYY-MM-DD HH:mm:ss') : null;
        }

        return userData
    }

    return (
        <div>
            <PageHeader location={props.location} routes={typeof newRoutes !== 'undefined' ? newRoutes : null} title={t('casting.Update Casting Config')} icon={<FontAwesomeIcon icon={faRss} rotation={90} />} />
            <Form 
                tabList={tabList}
                currentTab={currentTab}
                userData={userData}
                section="casting"
                dataTransform={dataTransform}
                type="update"
                dispatchFunc={updateCastConfig}
                onSuccess={onSuccess}
                form={<CastConfigForm castConfigId={props.match.params.id} />}
            />
        </div>

    )
}
