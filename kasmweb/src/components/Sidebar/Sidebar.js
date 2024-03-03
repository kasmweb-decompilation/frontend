import React, {Component} from "react";
import {NavLink, Link} from "react-router-dom";
import {Badge, Nav, NavItem, NavLink as RsNavLink} from "reactstrap";
import classNames from "classnames";
import getUserNavigationBarItems from "./getUserNavigationBar";
import SidebarFooter from "./../SidebarFooter";
import SidebarForm from "./../SidebarForm";
import SidebarHeader from "./../SidebarHeader";
import SidebarMinimizer from "./../SidebarMinimizer";
import {withTranslation} from "react-i18next";
import { connect } from "react-redux";
import { Search } from "../Search/Search";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/pro-light-svg-icons/faCircle";

class Sidebar extends Component {

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.activeRoute = this.activeRoute.bind(this);
        this.hideMobile = this.hideMobile.bind(this);
        this.state = {
            open: new Set()
        };
    }

    handleClick(e, url) {
        e.preventDefault();
        e.target.parentElement.classList.toggle("open");
        if (this.state.open.has(url)) {
            this.state.open.delete(url)
        } else {
            this.state.open.add(url)
        }
    }

    activeRoute(routeName, props) {
        props.routes.forEach(element => {
            if (element.path === routeName) this.state.open.add(routeName)
        });
        return props.routes.map(r => r.path).indexOf(routeName) > -1 || this.state.open.has(routeName) ? "open" : "";
    }
    activeRouteUrl(routeName, props) {
        let active = false
        active = props.routes.map(r => r.path).indexOf(routeName) > -1
        if (routeName === '/dashboard' && props.location.pathname !== '/dashboard') active = false
        return active ? "active" : "";
    }

    hideMobile() {
        if (document.body.classList.contains("sidebar-mobile-show")) {
            document.body.classList.toggle("sidebar-mobile-show");
        }
    }

    render() {

        const props = this.props;
        const userInfo = JSON.parse(window.localStorage.getItem("user_info"));

        // badge addon to NavItem
        const badge = (badge) => {
            if (badge) {
                const classes = classNames( badge.class );
                return (<Badge className={ classes } color={ badge.variant }>{ badge.text }</Badge>);
            }
        };

        // simple wrapper for nav-title item
        const wrapper = item => { return (item.wrapper && item.wrapper.element ? (React.createElement(item.wrapper.element, item.wrapper.attributes, item.name)): item.name ); };

        // nav list section title
        const title =  (title, key) => {
            const classes = classNames( "nav-title", title.class);
            return (<li key={key} className={ classes }>{wrapper(title)} </li>);
        };

        // nav list divider
        const divider = (divider, key) => {
            const classes = classNames( "divider", divider.class);
            return (<li key={key} className={ classes }></li>);
        };

        // nav label with nav link
        const navLabel = (item, key) => {
            const classes = {
                item: classNames( "hidden-cn", item.class ),
                link: classNames( "nav-label", item.class ? item.class : ""),
                icon: classNames(
                    !item.icon ? <FontAwesomeIcon icon={faCircle} /> : item.icon ,
                    item.label.variant ? `text-${item.label.variant}` : "",
                    item.label.class ?  item.label.class : ""
                )
            };
            return (
                navLink(item, key, classes)
            );
        };

        // nav item with nav link
        const navItem = (item, key) => {
            const classes = {
                item: classNames( item.class) ,
                link: classNames( "nav-link", item.variant ? `nav-link-${item.variant}` : ""),
                icon: classNames( item.icon )
            };
            return (
                navLink(item, key, classes)
            );
        };

        // nav link
        const navLink = (item, key, classes) => {
            const url = item.url ? item.url : "";
            const { t } = this.props;
            return (
                <NavItem key={key} className={classes.item}>
                    { isExternal(url) ?
                        <RsNavLink href={url} className={classes.link} active>
                        {item.icon && <span className="tw-mr-4 tw-rounded-lg tw-w-9 tw-h-9 tw-flex tw-justify-center tw-items-center tw-bg-blue-500 tw-text-white">{item.icon}</span>}{t('sidebar.' + item.name.toLowerCase())}{badge(item.badge)}
                    </RsNavLink>
                    :
                    <NavLink to={url} className={classNames(classes.link, this.activeRouteUrl(item.url, this.props))} activeClassName="active" onClick={this.hideMobile}>
                        {item.icon && <span className="tw-mr-4 tw-rounded-lg tw-w-9 tw-h-9 tw-flex tw-justify-center tw-items-center tw-bg-blue-500 tw-text-white">{item.icon}</span>}{t('sidebar.' + item.name.toLowerCase())}{badge(item.badge)}
                    </NavLink>
                }
                </NavItem>
            );
        };

        // nav dropdown
        const navDropdown = (item, key) => {
            const { t } = this.props;
            return (
                <li key={key} className={classNames("nav-item nav-dropdown", this.activeRoute(item.url, props))}>
                    <a className="nav-link nav-dropdown-toggle" href="#" onClick={(e) => this.handleClick(e, item.url)}>
                    {item.icon && <span className="tw-mr-4 tw-rounded-lg tw-w-9 tw-h-9 tw-flex tw-justify-center tw-items-center tw-bg-blue-500 tw-text-white">{item.icon}</span>}{t('sidebar.' + item.name.toLowerCase())}
                    </a>
                    <ul className="nav-dropdown-items">
                        {navList(item.children)}
                    </ul>
                </li>);
        };

        // nav type
        const navType = (item, idx) =>
            item.title ? title(item, idx) :
                item.divider ? divider(item, idx) :
                    item.label ? navLabel(item, idx) :
                        item.children ? navDropdown(item, idx)
                            : navItem(item, idx) ;

        // nav list
        const navList = (items) => {
            return items.map( (item, index) => navType(item, index) );
        };

        const isExternal = (url) => {
            const link = url ? url.substring(0, 4) : "";
            return link === "http";
        };

        // sidebar-nav root
        const authorizedViews = userInfo && _.keys(_.pickBy(userInfo.authorized_views)) || {};
        const items = getUserNavigationBarItems();

        const filterItems = items.filter(function f(o) {
            if(!_.isEmpty(authorizedViews) && authorizedViews.some((a) => a === o.authView)) return true
          
            if (o.children) {
              return (o.children = o.children.filter(f)).length
            }
          })

        return (
            <div className="sidebar tw-bg-[image:var(--bg)] tw-bg-slate-900/5 dark:tw-bg-slate-900/30 lg:tw-bg-[image:none] tw-pb-10">
                <SidebarHeader/>
                <div className="tw-p-3 tw-relative"><Search history={this.props.history} /></div>
                <SidebarForm/>
                <nav className="sidebar-nav">
                    <Nav className="">
                        {navList(filterItems)}
                    </Nav>
                </nav>
                <SidebarFooter/>
            </div>
        );
    }
}

Sidebar = connect(  // eslint-disable-line
    state => ({
        routes: state.dashboard.routes || [],
    }),
    dispatch => 
        ({
        })) 
(Sidebar);  //eslint-disable-line


const SidebarTranslated = withTranslation('common')(Sidebar)

export default SidebarTranslated;