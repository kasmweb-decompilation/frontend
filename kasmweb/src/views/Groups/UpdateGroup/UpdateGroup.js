import React,{ useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux'
import ViewGroupFormTemplate from "../ViewGroup/ViewGroup";

import GroupForm from "../GroupForm/GroupForm";
import {useTranslation} from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserGroup } from '@fortawesome/free-solid-svg-icons/faUserGroup';
import PageHeader, { parentRoutes } from "../../../components/Header/PageHeader";
import { Form, saveSuccess, saveError } from "../../../components/Form/Form.js"
import { updateGroups } from "../../../actions/actionGroup";
import { hasAuth } from "../../../utils/axios";

const parentRouteList = parentRoutes('/groups')
const newRoutes = [
    ...parentRouteList.routes,
    {name: "generic.update",path:"/updategroup",isActive: true},
];
  
export default function UpdateGroup(props) {
    const dispatch = useDispatch()
    const [currentTab, setCurrentTab] = useState('form');
    const [group, setGroup] = useState(null);
    const { t } = useTranslation('common');
    const groups = useSelector(state => state.groups.groups) || []
    const errorMessage = useSelector(state => state.groups.updateGroupsError) || null

    useEffect(() => {
        let current = groups.find(group => group.group_id === props.match.params.id);
        setGroup(current)
      }, [groups]);
    
    const tabList = [
        { name: 'buttons.Edit', key: 'form' },
        { name: 'groups.users', key: 'users' },
        { name: 'groups.permissions', key: 'permissions', isHidden: !hasAuth('group_permissions') },
        { name: 'groups.settings', key: 'settings' },
        { name: 'groups.workspaces', key: 'workspaces' },
        { name: 'groups.sso-group-mappings', key: 'sso_group_mappings' },
        { name: 'file_mapping.File Mapping', key: 'file_mapping' },
        { name: 'storage_mapping.storage-mapping', key: 'storage_mapping' },
    ]
    
    const userData = {
        group_id: props.match.params.id
    }
    const onSuccess = () => {
        props.history.push('/groups');
    }

    return (
        <div>
            <PageHeader location={props.location} routes={typeof newRoutes !== 'undefined' ? newRoutes : null} title={group ? group.name : t('groups.update-group')} icon={<FontAwesomeIcon icon={faUserGroup} />} />
            <Form 
                {...props}
                tabList={tabList}
                currentTab={currentTab}
                setCurrentTab={setCurrentTab}
                userData={userData}
                section="groups"
                type="update"
                dispatchFunc={updateGroups}
                onSuccess={onSuccess}
                form={<GroupForm groupId={props.match.params.id} />}
                tabs={<ViewGroupFormTemplate currentTab={currentTab} {...props} />}
            />
        </div>

    )
}
