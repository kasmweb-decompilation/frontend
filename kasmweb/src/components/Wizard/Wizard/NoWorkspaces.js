import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux'
import Wizard from "../Wizard"
import Step1 from "../Steps/NoWorkspaces"
import {Trans, useTranslation} from "react-i18next";

export default function NoWorkspaces(props) {
    const { t } = useTranslation('common');
    const name = 'FirstRun'

    const steps = [
        {
            name: t("wizard.No Workspaces installed"),
            description: <React.Fragment>
                <p>{t("wizard.no_workspaces_p1")}</p>
                <p>{t("wizard.no_workspaces_p2")}</p>
                <p><Trans i18nKey="wizard.no_workspaces_p3" ns="common">You can also view our documentation on <a target="_blank" href="https://kasmweb.com/docs/latest/guide/workspace_registry.html">Registries</a> and <a target="_blank" href="https://kasmweb.com/docs/latest/guide/workspaces.html">Workspaces</a></Trans></p>
            </React.Fragment>,
            content: <Step1 />
        }
    ]

    return (
        <Wizard
            name={name}
            steps={steps}
        />
    )
}

