import React from "react";
import {useTranslation} from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PageHeader, { parentRoutes } from "../../../components/Header/PageHeader";
import { Form } from "../../../components/Form"
import { faFilterList } from '@fortawesome/pro-light-svg-icons/faFilterList';
import {createUrlFilterPolicy} from '../../../actions/actionFilters';
import UrlFilterForm from "../UrlFilterForm/UrlFilterForm";

const parentRouteList = parentRoutes('/webfilter')
const newRoutes = [
    ...parentRouteList.routes,
    {name: "generic.create",path:"/createfilter",isActive: true},
];

const tabList = [
    { name: 'generic.create', key: 'form' },
]

export default function CreateUrlFilter(props) {
    const { t } = useTranslation('common');

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
        <PageHeader location={props.location} routes={typeof newRoutes !== 'undefined' ? newRoutes : null} title={t('filter.create-web-filter-policy')} icon={<FontAwesomeIcon icon={faFilterList} />} />
        <Form 
            tabList={tabList}
            currentTab="form"
            section="filter"
            type="create"
            dataTransform={dataTransform}
            dispatchFunc={createUrlFilterPolicy}
            onSuccess={onSuccess}
            form={<UrlFilterForm />}
        />
    </div>
    )
}
