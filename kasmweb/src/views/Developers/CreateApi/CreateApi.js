import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux'
import {useTranslation} from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PageHeader, { parentRoutes } from "../../../components/Header/PageHeader";
import { Form, Button, CopyToClipboard } from "../../../components/Form"
import { faCodeBranch } from '@fortawesome/pro-light-svg-icons/faCodeBranch';
import { faTimes } from '@fortawesome/pro-light-svg-icons/faTimes';
import {createApiKey} from '../../../actions/actionDevloper';
import reducer from '../../../models/developerReducer';
import ApiForm from "../ApiForm/ApiForm";
import { Modal } from "../../../components/Form/Modal"
import moment from "moment";

const parentRouteList = parentRoutes('/developers')
const newRoutes = [
    ...parentRouteList.routes,
    {name: "generic.create",path:"/createuser",isActive: true},
];

export default function CreateApi(props) {
    const { t } = useTranslation('common');
    const dispatch = useDispatch()
    const [open, setOpen] = useState(false);
    const createdApi = useSelector(state => state.develop.createdApi) || false

    const tabList = [
        { name: 'generic.create', key: 'form' },
    ]    

    const onSuccess = () => {
        setOpen(true)
    }

    useEffect(() => {
      if (open === false && createdApi) {
        dispatch(reducer({type: 'RESET_CREATEDAPI'}))
        props.history.push('/updateapi/' + createdApi.api_id + '?tab=permissions')
      }
    }, [open])
    

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
        <PageHeader location={props.location} routes={typeof newRoutes !== 'undefined' ? newRoutes : null} title={t('developers.create-api-key')} icon={<FontAwesomeIcon icon={faCodeBranch} />} />
        <Form 
            tabList={tabList}
            currentTab="form"
            section="developers"
            dataTransform={dataTransform}
            dispatchFunc={createApiKey}
            onSuccess={onSuccess}
            form={<ApiForm />}
        />
        {open && (
        <Modal
            icon={<FontAwesomeIcon icon={faCodeBranch} />}
            iconBg="tw-bg-blue-100"
            title="developers.api-key"
            contentRaw={
                <div>
                <p className="tw-text-pink-700 tw-font-bold">{t('developers.please-save-the-security-credentials')}</p>
                &nbsp;
                &nbsp;
                <table className="tw-min-w-full tw-divide-y tw-divide-gray-300">
                    <tbody>
                        <tr>
                            <td className="tw-whitespace-nowrap tw-px-3 tw-py-1 tw-text-sm" align="right"><strong>{t('developers.api-key-0')} </strong></td>
                            <td align="left" className="tw-whitespace-nowrap tw-px-3 tw-py-1 tw-text-sm">{createdApi ? createdApi.api_key : ""} <CopyToClipboard className="tw-ml-1" value={createdApi ? createdApi.api_key : ""} /></td>
                        </tr>
                        <tr>
                            <td className="tw-whitespace-nowrap tw-px-3 tw-py-1 tw-text-sm" align="right"><strong>{t('developers.api-key-secret-0')} </strong></td>
                            <td align="left" className="tw-whitespace-nowrap tw-px-3 tw-py-1 tw-text-sm">{createdApi ? createdApi.api_key_secret : ""} <CopyToClipboard className="tw-ml-1" value={createdApi ? createdApi.api_key_secret : ""} /></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            }
            open={open}
            setOpen={setOpen}
            buttons={
                <React.Fragment>
                    <div></div>
                    <Button section="buttons" name="Close" icon={<FontAwesomeIcon icon={faTimes} />} className="tw-ml-auto" onClick={() => setOpen(false)} />
                </React.Fragment>
            }
        />
        )}
    </div>
    )
}
