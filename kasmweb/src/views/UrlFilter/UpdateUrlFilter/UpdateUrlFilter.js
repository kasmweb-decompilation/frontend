import React,{ useState } from "react";
import {updateUrlFilterPolicy} from "../../../actions/actionFilters";
import UrlFilterForm from "../UrlFilterForm/UrlFilterForm";
import {useTranslation} from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilterList } from '@fortawesome/free-solid-svg-icons/faFilterList';
import PageHeader, { parentRoutes } from "../../../components/Header/PageHeader";
import { Form } from "../../../components/Form"

const parentRouteList = parentRoutes('/webfilter')
const newRoutes = [
    ...parentRouteList.routes,
    {name: "generic.update",path:"/updatefilter",isActive: true},
];

export default function UpdateUrlFilter(props) {
    const [currentTab, setCurrentTab] = useState('form');
    const { t } = useTranslation('common');
    
    const tabList = [
        { name: 'buttons.Edit', key: 'form' },
    ]
    
    const userData = {
        filter_policy_id: props.match.params.id
    }
    const onSuccess = () => {
        props.history.push('/webfilter');
    }

    const dataTransform = (userData) => {
        if (!userData.categories){
            userData.categories = {};
        }
        return userData
    }

    return (
        <div>
            <PageHeader location={props.location} routes={typeof newRoutes !== 'undefined' ? newRoutes : null} title={t('filter.update-web-filter-policy')} icon={<FontAwesomeIcon icon={faFilterList} />} />
            <Form 
                tabList={tabList}
                currentTab={currentTab}
                userData={userData}
                section="filter"
                type="update"
                dataTransform={dataTransform}
                dispatchFunc={updateUrlFilterPolicy}
                onSuccess={onSuccess}
                form={<UrlFilterForm filterPolicyId={props.match.params.id} />}
            />
        </div>
    )
}
