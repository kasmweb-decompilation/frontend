import React, { useEffect, useState } from "react";
import BreadCrumbCompo from "../../components/Breadcrumb/BreadCrumbCompo";
import { Row, Col } from "reactstrap";
import { routes } from "../Sidebar/getUserNavigationBar"
import { useDispatch } from "react-redux";
import i18n from '../../i18n';

function findUrl(items, url) {
  if (!items) { return; }

  for (const item of items) {
    // Test current object
    if (item.url === url) { return item; }

    // Test children recursively
    const child = findUrl(item.children, url);
    if (child) { return child; }
  }
  // return {}
}


export const allRoutes = () => {
  let items = routes()
  setRoutes(items)
  return items
}

export const parentRoutes = (url) => {
  let result = findUrl(allRoutes(), url)
  result = result ||[{ routes: [] }]
  return result
}

export const setRoutes = function (o, parent = [{ name: 'sidebar.home', path: '/dashboard', isActive: false }]) {
  if (o.length > 0) {
    o.forEach((i) => {
      if (i.children && i.children.length > 0) {
        i.routes = [...parent, { name: 'sidebar.' + i.name.toLowerCase(), path: i.url, isActive: false }]
        i.children.forEach((n, index) => {
          const newParent = [...parent, { name: 'sidebar.' + i.name.toLowerCase(), path: i.url, isActive: false }]
          if (n.children) {
            n.routes = [...newParent, { name: 'sidebar.' + n.name.toLowerCase(), path: n.url, isActive: false }];
            setRoutes(n.children, n.routes);
          } else {
            n.routes = [...newParent, { name: 'sidebar.' + n.name.toLowerCase(), path: n.url, isActive: true }];
          }
        })
      } else {
        i.routes = [...parent, { name: 'sidebar.' + i.name.toLowerCase(), path: i.url, isActive: true }]
      }
    })
  }
}

export default function PageHeader(props) {
  const { routes: newRoutes = null, title, right, icon, hideBreadCrumbs, location } = props
  const [routes, setRoutes] = useState([]);
  const dispatch = useDispatch()


  useEffect(() => {
    let routes = []
    if(props && props.location) routes = parentRoutes(props.location.pathname).routes
    if (newRoutes) {
      routes = newRoutes
    }
    setRoutes(routes)
  }, []);


  useEffect(() => {
    dispatch({type: "PAGEROUTE", routes: routes})
  }, [routes]);

  return (
    <React.Fragment>
      <Row className="tw-border-0 tw-relative tw-flex tw-my-4 lg:tw-mb-0 tw-items-center lg:tw-h-20">
        <Col className="tw-flex tw-flex-col tw-gap-4 lg:tw-flex-row tw-h-full tw-items-start lg:tw-items-center" sm={{ size: 10, order: 3, offset: 1 }}>
          <h1 className="tw-text-xl tw-mb-0 tw-flex tw-gap-2 tw-items-center">
            {icon && (
              <div className="tw-text-3xl tw-px-2">{icon}</div>
            )}
            <span>{title}</span>
          </h1>
          <div className="lg:tw-ml-auto tw-w-full tw-max-w-[560px] tw-flex">
            <div className="lg:tw-ml-auto tw-w-full lg:tw-w-auto tw-flex tw-flex-col tw-items-start lg:tw-items-center tw-gap-1 tw-rounded-md tw-shadow tab-nav">
            {!hideBreadCrumbs && routes && routes.length > 0 && (
              <BreadCrumbCompo routes={routes} />
            )}
              {right}
              </div>
          </div>
        </Col>
      </Row>
    </React.Fragment>
  )
}