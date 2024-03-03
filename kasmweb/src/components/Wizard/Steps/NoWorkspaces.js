import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {useTranslation} from "react-i18next";
import { hasAuth } from "../../../utils/axios";

export default function Step(props) {
  const { t } = useTranslation('common');
  return (
    <div className="tw-flex tw-h-full tw-w-full tw-items-center">
      <div className="tw-flex tw-flex-col lg:tw-flex-row tw-gap-12 tw-w-full">
        {hasAuth('registries') && <Link className="tw-flex tw-relative tw-flex-col lg:tw-w-1/2 lg:tw-h-60 tw-py-8 tw-justify-center tw-items-center tw-shadow-md tw-rounded tw-bg-gradient-to-br tw-animated-gradient tw-animate-text hover:tw-text-white  dark:tw-bg-slate-900/70 dark:tw-border dark:tw-border-slate-700/70 dark:tw-border-solid tw-text-white tw-font-bold hover:tw-no-underline" to={{ pathname: "/registry" }}>
          <div className="tw-text-5xl lg:tw-h-40 tw-py-4 tw-flex tw-items-center">
            <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '45px', fill: 'white'}} viewBox="0 0 384 512"><path d="M145.5 68c5.3-20.7 24.1-36 46.5-36s41.2 15.3 46.5 36c1.8 7.1 8.2 12 15.5 12h18c8.8 0 16 7.2 16 16v32H192 96V96c0-8.8 7.2-16 16-16h18c7.3 0 13.7-4.9 15.5-12zM192 0c-32.8 0-61 19.8-73.3 48H112C91.1 48 73.3 61.4 66.7 80H64C28.7 80 0 108.7 0 144V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V144c0-35.3-28.7-64-64-64h-2.7c-6.6-18.6-24.4-32-45.3-32h-6.7C253 19.8 224.8 0 192 0zM320 112c17.7 0 32 14.3 32 32V448c0 17.7-14.3 32-32 32H64c-17.7 0-32-14.3-32-32V144c0-17.7 14.3-32 32-32v16c0 17.7 14.3 32 32 32h96 96c17.7 0 32-14.3 32-32V112zM208 80a16 16 0 1 0 -32 0 16 16 0 1 0 32 0zM136 272a24 24 0 1 0 -48 0 24 24 0 1 0 48 0zm40-16c-8.8 0-16 7.2-16 16s7.2 16 16 16h96c8.8 0 16-7.2 16-16s-7.2-16-16-16H176zm0 96c-8.8 0-16 7.2-16 16s7.2 16 16 16h96c8.8 0 16-7.2 16-16s-7.2-16-16-16H176zm-64 40a24 24 0 1 0 0-48 24 24 0 1 0 0 48z"/></svg>
          </div>{t("wizard.Add from Registry")}
          <div class="tw-text-[10px] tw-absolute tw-top-4 tw-ins tw-inline-flex tw-shadow tw-items-center tw-font-normal tw-leading-sm tw-uppercase tw-px-3 tw-py-1 tw-bg-sky-600  tw-rounded-full">
          {t("wizard.Recommended")}
          </div>
        </Link>}
        {hasAuth('images') && <Link className="tw-flex tw-flex-col lg:tw-w-1/2 lg:tw-h-60 tw-py-8 tw-justify-center tw-items-center tw-shadow-md tw-rounded tw-bg-white/70 dark:tw-bg-slate-900/70 dark:tw-border dark:tw-border-slate-700/70 dark:tw-border-solid tw-text-text hover:tw-no-underline" to={{ pathname: "/workspaces" }}>
          <div className="tw-text-5xl lg:tw-h-40 tw-py-4 tw-flex tw-items-center">
            <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '45px', fill: 'var(--text-color)'}} viewBox="0 0 512 512"><path d="M0 96C0 60.65 28.65 32 64 32H448C483.3 32 512 60.65 512 96V416C512 451.3 483.3 480 448 480H64C28.65 480 0 451.3 0 416V96zM192 160H480V96C480 78.33 465.7 64 448 64H192V160zM160 64H64C46.33 64 32 78.33 32 96V160H160V64zM32 192V320H160V192H32zM32 352V416C32 433.7 46.33 448 64 448H160V352H32zM192 448H448C465.7 448 480 433.7 480 416V352H192V448zM480 320V192H192V320H480z"/></svg>
          </div>{t("wizard.Add Manually")}
        </Link>}
      </div>
    </div>
  )
}