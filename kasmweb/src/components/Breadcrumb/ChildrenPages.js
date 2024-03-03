import React, { useState, useEffect } from "react";
import { Col, Row } from "reactstrap";
import PageHeader from "../Header/PageHeader";
import {useTranslation} from "react-i18next";
import { Link } from "react-router-dom";
import { setRoutes, allRoutes, parentRoutes } from "../Header/PageHeader";
import { useSelector } from "react-redux";




function ChildrenPages(props) {
    const { match } = props
    const { t } = useTranslation('common');
    const url = parentRoutes(match.url)
    // console.log(url)
    // console.log(props)
    // console.log(url)

    return (
        <div>
            <PageHeader routes={url.routes} title={t('sidebar.' + url.name.toLowerCase())} icon={url.icon} />
            <Row>
                <Col sm={{ size: 10, order: 3, offset: 1 }}>
                    <div className="tw-flex tw-mt-10 tw-flex-wrap tw-gap-4">
                        {url.children.map(child => (
                            <Link className="tw-text-color hover:!tw-text-white hover:!tw-no-underline tw-flex tw-relative tw-h-20 tw-justify-center tw-w-full lg:tw-w-60 tw-shadow-md lg:tw-grid lg:tw-grid-flow-col tw-group/row tw-items-center dark:tw-border dark:tw-border-slate-700/70 dark:tw-border-solid tw-rounded hover:tw-border-none tw-transition hover:tw-bg-blue-500 dark:hover:tw-bg-blue-500 dark:hover:tw-border-transparent hover:tw-z-10 hover:tw-ring-2 hover:tw-ring-blue-500 tw-bg-white/70 dark:tw-bg-slate-900/70" key={child.url} to={child.url}>{child.name}</Link>
                        ))}
                    </div>
                </Col>
            </Row>
        </div>
    )
}

export default ChildrenPages