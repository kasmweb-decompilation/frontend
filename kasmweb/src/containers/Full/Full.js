import React, { Component } from "react";
import { Switch, Route, Redirect, withRouter } from "react-router-dom";
import { Container } from "reactstrap";
import Header from "../../components/Header/Header.js";
import Sidebar from "../../components/Sidebar/Sidebar.js";
import getUserNavigationBarItems from "../../components/Sidebar/getUserNavigationBar.js";

import ErrorBoundary from "../../components/ErrorBoundary/ErrorBoundary.js";
import ChildrenPages from "../../components/Breadcrumb/ChildrenPages.js";

//AdminUser, CreateUser, UpdateUser
import AdminUser from "../../views/AdminUser/AdminUser.js";
import CreateUser from "../../views/AdminUser/CreateUser/CreateUser.js";
import UpdateUser from "../../views/AdminUser/UpdateUser/UpdateUser.js";

// UserDashboard, UserProfile, AdminProfile, UserSubscription
import UserDashboard from "../../views/User/UserDashboard/UserDashboard.js";
import UserSubscription from "../../views/User/UserSubscription/UserSubscription.js";

// Groups, create Groups, update Groups
import Groups from "../../views/Groups/";
import CreateGroup from "../../views/Groups/CreateGroup/CreateGroup.js";
import UpdateGroup from "../../views/Groups/UpdateGroup/UpdateGroup.js";

//images, ViewImages, CreateImages, UpdateImages, CloneImage
import Images from "../../views/Images/Images.js";
import { Registry } from "../../views/Images/Registry.js";
import CreateImage from "../../views/Images/CreateImage/CreateImage.js";
import UpdateImage from "../../views/Images/UpdateImage/UpdateImage.js";
import CloneImage from "../../views/Images/CloneImage/CloneImage.js";

//Agents, ViewAgent, UpdateAgent
import Agents from "../../views/Agents/Agents.js";
import UpdateAgent from "../../views/Agents/UpdateAgent/UpdateAgent.js";

//Managers
import Managers from "../../views/Managers/Managers.js";
import ViewManager from "../../views/Managers/ViewManager/ViewManager.js";

//zones, ViewZones, CreateZone, UpdateZone
import Zones from "../../views/Zones/Zones.js";
import CreateZone from "../../views/Zones/CreateZone/CreateZone.js";
import UpdateZone from "../../views/Zones/UpdateZone/UpdateZone.js";

//connectionproxies, ViewConnectionProxy, CreateConnectionProxy, UpdateConnectionProxy
import ConnectionProxies from "../../views/ConnectionProxies/ConnectionProxies.js";
import CreateConnectionProxy from "../../views/ConnectionProxies/CreateConnectionProxy/CreateConnectionProxy.js";
import UpdateConnectionProxy from "../../views/ConnectionProxies/UpdateConnectionProxy/UpdateConnectionProxy.js";


import ServerPools from "../../views/ServerPools/ServerPools.js";
import CreateServerPool  from "../../views/ServerPools/CreateServerPool/CreateServerPool.js"
import UpdateServerPool from "../../views/ServerPools/UpdateServerPool/UpdateServerPool.js";

import Servers from "../../views/Servers/";
import CreateServer  from "../../views/Servers/CreateServer/CreateServer.js"
import UpdateServer from "../../views/Servers/UpdateServer/UpdateServer.js";

//Kasm, ViewKasm
import Kasms from "../../views/Kasms/Kasm.js";
import ViewKasm from "../../views/Kasms/ViewKasm/ViewKasm.js";
import { SessionHistory } from "../../views/SessionHistory/History.js";

//Reporting
import ReportDashboard from "../../views/Reporting/ReportDashboard/ReportDashboard.js";
import ReportLogging from "../../views/Reporting/Logging/Logging.js";

//Settings, UpdateSettings, ViewSettings
import Settings from "../../views/Settings/Settings.js";

//Ldap, ViewLdap,CreateLdap,updateLdap
import Ldap from "../../views/Ldap/Ldap.js";
import CreateLdap from "../../views/Ldap/CreateLdap/CreateLdap.js";
import UpdateLdap from "../../views/Ldap/UpdateLdap/UpdateLdap.js";

//SAML
import Saml from "../../views/Saml/Saml.js";
import UpdateSaml from "../../views/Saml/UpdateSaml/UpdateSaml.js";

//System Info
import ViewSystemInfo from "../../views/SystemInfo/SystemInfo.js";

//kasm, join
import Kasm from "../../views/Kasm/Kasm.js";
import Join from "../../views/Join/Join.js";

//import Developers
import Developers from "../../views/Developers/Developers.js";
import CreateApi from "../../views/Developers/CreateApi/CreateApi.js";
import UpdateApi from "../../views/Developers/UpdateApi/UpdateApi.js";

//import UrlFilter
import UrlFilter from "../../views/UrlFilter/UrlFilter.js";
import CreateUrlFilter from "../../views/UrlFilter/CreateUrlFilter/CreateUrlFilter.js";
import UpdateUrlFilter from "../../views/UrlFilter/UpdateUrlFilter/UpdateUrlFilter.js";

//Logout, GetNewToken
import Logout from "../../components/Logout/Logout.js";
import { getNewToken } from "../../actions/actionLogin.js";
import { getClientSettings } from "../../actions/actionDashboard.js";
import { logout } from "../../actions/actionLogin.js";
import { NotificationManager } from "react-notifications";
import { connect } from "react-redux";
import { getLicenseStatus } from "../../actions/actionFooter.js";

import Proptypes from "prop-types";

import AutoScale from "../../views/AutoScale/AutoScale.js";
import CreateAutoScale from "../../views/AutoScale/CreateAutoScale/CreateAutoScale.js";
import ViewAutoScale from "../../views/AutoScale/ViewAutoScale/ViewAutoScale.js";
import UpdateAutoScale from "../../views/AutoScale/UpdateAutoScale/UpdateAutoScale.js";

import VmProvider from "../../views/VmProvider/VmProvider.js";
import CreateVmProviderConfig from "../../views/VmProvider/CreateVmProviderConfig/CreateVmProviderConfig.js";
import ViewVmProviderConfig from "../../views/VmProvider/ViewVmProviderConfig/ViewVmProviderConfig.js";
import UpdateVmProviderConfig from "../../views/VmProvider/UpdateVmProviderConfig/UpdateVmProviderConfig.js"

import DnsProvider from "../../views/DnsProvider/DnsProvider.js";
import CreateDnsProviderConfig from "../../views/DnsProvider/CreateDnsProviderConfig/CreateDnsProviderConfig.js";
import ViewDnsProviderConfig from "../../views/DnsProvider/ViewDnsProviderConfig/ViewDnsProviderConfig.js";
import UpdateDnsProviderConfig from "../../views/DnsProvider/UpdateDnsProviderConfig/UpdateDnsProviderConfig.js"

//import Branding
import Branding from "../../views/Branding/Branding.js";
import CreateBrandingConfig from "../../views/Branding/CreateBrandingConfig/CreateBrandingConfig.js";
import UpdateBrandingConfig from "../../views/Branding/UpdateBrandingConfig/UpdateBrandingConfig.js";

//import Staging
import Staging from "../../views/Staging/Staging.js";
import CreateStagingConfig from "../../views/Staging/CreateStagingConfig/CreateStagingConfig.js";
import UpdateStagingConfig from "../../views/Staging/UpdateStagingConfig/UpdateStagingConfig.js";

//import Cast
import Cast from "../../views/CastConfig/Cast.js";
import CreateCastConfig from "../../views/CastConfig/CreateCastConfig/CreateCastConfig.js";
import UpdateCastConfig from "../../views/CastConfig/UpdateCastConfig/UpdateCastConfig.js";

//import Oidc
import Oidc from "../../views/Oidc/Oidc.js";
import CreateOidcConfig from "../../views/Oidc/CreateOidcConfig/CreateOidcConfig.js";
import UpdateOidcConfig from "../../views/Oidc/UpdateOidcConfig/UpdateOidcConfig.js";

//import Physical Tokens
import PhysicalToken from "../../views/PhysicalToken/PhysicalToken.js";

//import Storage Provider
import StorageProvider from "../../views/StorageProvider/StorageProvider.js";
import CreateStorageProvider from "../../views/StorageProvider/CreateStorageProviderConfig/CreateStorageProviderConfig.js";
import UpdateStorageProvider from "../../views/StorageProvider/UpdateStorageProviderConfig/UpdateStorageProviderConfig.js"

import {withTranslation} from "react-i18next";
import _ from "lodash";
import { hasAuth } from "../../utils/axios.js";

const allowedPaths = [
  "/userdashboard",
  "/createkasms",
  "/userprofile",
  "/subscribe",
  "/logout",
  "/join/",
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

// User only can access allowed path logic
function AdminRoute({ component: Component, ...props }) {
  return (
    <Route
      {...props}
      render={(props) =>
          <Component {...props} />
      }
    />
  );
}

class Full extends Component {
  constructor(props, context) {
    super(props, context);
    this.refreshingToken = this.refreshingToken.bind(this);
  }

  refreshingToken() {
    const self = this;
    setInterval(function () {
      // calling API for refreshing token after 5 minutes
      const userInfo = JSON.parse(window.localStorage.getItem("user_info"));
      const payload_data = {
        token: userInfo.token,
        username: userInfo.username,
      };
      self.props.refreshTokenFunc(payload_data);
    }, 300000);
  }

  componentDidMount() {
    this.refreshingToken();
    this.props.getLicenseStatus()
    const {t} = this.props;
    this.props.getClientSettings().then((clientsettings) => {
      let idle_timeout;
      let self = this;
      setInterval(function () {
        if (
          clientsettings &&
          clientsettings.response &&
          clientsettings.response.idle_disconnect
        ) {
          idle_timeout = clientsettings.response.idle_disconnect * 60;
        } else {
          idle_timeout = 1200;
        }
        let unActiveStateSec = localStorage.getItem("unActiveStateSec");
        let user_info = localStorage.getItem("user_info");
        //FIXME: This is a hack. Sometimes the UI gets in a state where the username is cached but the token is gone
        //since I can't seem to find how this occurs, checking here to ensure the token is still there, if not, then logout
        if (user_info != null && user_info != undefined) {
          user_info = JSON.parse(user_info).token;
        }
        // Get seconds that have elaplsed since last API call was made
        var d = new Date();
        var time_elapsed = (d.getTime() - parseInt(unActiveStateSec)) / 1000;

        // Log user out if time elapsed was greater than idle_timeout
        if (time_elapsed >= idle_timeout) {
          self.props.logout();
          NotificationManager.error(t('auth.logout-due-to-idle-timeout'), t('error_boundary.Error'), 3000);
        } else if (user_info == null || user_info == undefined) {
          console.trace("Logout due to missing user_info");
          window.location.reload(true)
          NotificationManager.error(
            t('auth.connection-failed-trying-again'),
            t('error_boundary.Error'),
            3000
          );
        }
      }, 60000);
    });
  }

  render() {
    const { ...props } = this.props;
    const pathname =
      this.props.history &&
      this.props.history.location &&
      this.props.history.location.pathname;

    const hideSidebar =
      pathname === "/userdashboard" ||
      pathname === "/userprofile" ||
      pathname === "/adminprofile" ||
      pathname === "/subscribe" ||
      pathname === "/logout";

      const bgImage = () => {
        let launcher_background_url = window.localStorage.getItem("launcher_background_url");
        let bgimage = '/img/backgrounds/background1.jpg'
        if (launcher_background_url && launcher_background_url !== 'undefined') {
            bgimage = launcher_background_url
        }

        return bgimage;
    }
    const userInfo = JSON.parse(window.localStorage.getItem("user_info"));

    const authorizedViews = userInfo ? _.keys(_.pickBy(userInfo.authorized_views)) : null;
    let adminPage = 'dashboard'
    if (hasAuth('admin_dashboard') && !hasAuth('reports')) {
      const items = getUserNavigationBarItems();

      const filterItems = items.filter(function f(o) {
        if (authorizedViews.some((a) => a === o.authView)) return true
        if (o.children) {
          return (o.children = o.children.filter(f)).length
        }
      })
      adminPage = filterItems[0].children[0].url || 'dashboard'
    }


    return (
      <ErrorBoundary>
        <div className="app">
          <Header />
          <div className={`app-body  ${hideSidebar ? "sidebarHide" : ""} `}>
            {!hideSidebar && <Sidebar {...this.props} />}
            <main className="main">
              <div className={classNames("tw-fixed tw-bg-cover tw-inset-0 tw-transition-all tw-filter", pathname === '/userdashboard' ? '' : "tw-grayscale tw-opacity-10")} style={{ backgroundImage: "url(" + bgImage() + ")" }}>
              </div>
              <div className="tw-w-full tw-mx-auto tw-px-6 lg:tw-px-4">
                <Switch>
                  <Route
                    path="/userdashboard/"
                    name="UserDashboard"
                    component={UserDashboard}
                    {...props}
                  />
                  <Route
                    path="/kasm/:id"
                    name="Kasm"
                    component={Kasm}
                    {...props}
                  />
                  <Route
                    path="/join/:id"
                    name="Join"
                    component={Join}
                    {...props}
                  />
                  {userInfo && _.get(userInfo, 'authorized_views.users', false) && <AdminRoute
                    path="/adminUser"
                    name="AdminUser"
                    component={AdminUser}
                    {...props}
                  />}
                  {userInfo && _.get(userInfo, 'authorized_views.reports', false) && <AdminRoute
                    path="/dashboard/"
                    name="ReportDashboard"
                    component={ReportDashboard}
                    {...props}
                  />}
                  {userInfo && _.get(userInfo, 'authorized_views.logging', false) && <AdminRoute
                    path="/logging"
                    name="ReportLogging"
                    component={ReportLogging}
                    {...props}
                  />}
                  <AdminRoute
                    path="/access"
                    name="Access Management"
                    component={ChildrenPages}
                    {...props}
                  />
                  <AdminRoute
                    path="/infrastructure"
                    name="Infrastructure"
                    component={ChildrenPages}
                    {...props}
                  />
                  <AdminRoute
                    path="/sessions"
                    name="Sessions"
                    component={ChildrenPages}
                    {...props}
                  />
                  <AdminRoute
                    path="/workspacesection"
                    name="Workspaces"
                    component={ChildrenPages}
                    {...props}
                  />
                  {userInfo && _.get(userInfo, 'authorized_views.images', false) && <AdminRoute
                    path="/workspaces"
                    name="Images"
                    component={Images}
                    {...props}
                  />}
                  {userInfo && _.get(userInfo, 'authorized_views.registries', false) && <AdminRoute
                    path="/registry"
                    name="Registry"
                    component={Registry}
                    {...props}
                  />}
                  {userInfo && _.get(userInfo, 'authorized_views.images', false) && <AdminRoute
                    path="/createworkspace"
                    name="createImage"
                    component={CreateImage}
                    {...props}
                  />}
                  {userInfo && _.get(userInfo, 'authorized_views.images', false) && <AdminRoute
                    path="/updateworkspace/:id"
                    name="UpdateImage"
                    component={UpdateImage}
                    {...props}
                  />}
                  {userInfo && _.get(userInfo, 'authorized_views.images', false) && <AdminRoute
                    path="/cloneworkspace/:id"
                    name="CloneImage"
                    component={CloneImage}
                    {...props}
                  />}

                  <AdminRoute
                    path="/settingsection"
                    name="Settings"
                    component={ChildrenPages}
                    {...props}
                  />
                  <AdminRoute
                    path="/authsection"
                    name="Auth"
                    component={ChildrenPages}
                    {...props}
                  />
                  <AdminRoute
                    path="/diagnostics"
                    name="Diagnostics"
                    component={ChildrenPages}
                    {...props}
                  />
                  {userInfo && _.get(userInfo, 'authorized_views.users', false) && <AdminRoute
                    path="/updateuser/:id"
                    name="UpdateUser"
                    component={UpdateUser}
                    {...props}
                  />}
                  {userInfo && _.get(userInfo, 'authorized_views.users', false) && <AdminRoute
                    path="/createuser"
                    name="CreateUser"
                    component={CreateUser}
                    {...props}
                  />}
                  {userInfo && _.get(userInfo, 'authorized_views.agents', false) && <AdminRoute
                    path="/agents"
                    name="Agent"
                    component={Agents}
                    {...props}
                  />}
                  {userInfo && _.get(userInfo, 'authorized_views.managers', false) && <AdminRoute
                    path="/managers"
                    name="Managers"
                    component={Managers}
                    {...props}
                  />}
                  {userInfo && _.get(userInfo, 'authorized_views.managers', false) && <AdminRoute
                    path="/viewmanager/:id"
                    name="ViewManager"
                    component={ViewManager}
                    {...props}
                  />}
                  {userInfo && _.get(userInfo, 'authorized_views.sessions', false) && <AdminRoute
                    path="/kasm"
                    name="Sessions"
                    component={Kasms}
                    {...props}
                  />}
                  {userInfo && _.get(userInfo, 'authorized_views.sessions', false) && <AdminRoute
                    path="/sessionhistory"
                    name="SessionHistory"
                    component={SessionHistory}
                    {...props}
                  />}
                  {userInfo && _.get(userInfo, 'authorized_views.zones', false) && <AdminRoute
                    path="/zones"
                    name="Zones"
                    component={Zones}
                    {...props}
                  />}
                  {userInfo && _.get(userInfo, 'authorized_views.zones', false) && <AdminRoute
                    path="/createzone"
                    name="CreateZone"
                    component={CreateZone}
                    {...props}
                  />}
                  {userInfo && _.get(userInfo, 'authorized_views.zones', false) && <AdminRoute
                    path="/updatezone/:id"
                    name="UpdateZone"
                    component={UpdateZone}
                    {...props}
                  />}
                  {userInfo && _.get(userInfo, 'authorized_views.connection_proxies', false) && <AdminRoute
                    path="/connection_proxies"
                    name="ConnectionProxies"
                    component={ConnectionProxies}
                    {...props}
                  />}
                  {userInfo && _.get(userInfo, 'authorized_views.connection_proxies', false) && <AdminRoute
                    path="/create_connection_proxy"
                    name="CreateConnectionProxy"
                    component={CreateConnectionProxy}
                    {...props}
                  />}
                  {userInfo && _.get(userInfo, 'authorized_views.connection_proxies', false) && <AdminRoute
                    path="/update_connection_proxy/:id"
                    name="UpdateConnectionProxy"
                    component={UpdateConnectionProxy}
                    {...props}
                  />}
                  {userInfo && _.get(userInfo, 'authorized_views.pools', false) && <AdminRoute
                    path="/server_pools"
                    name="ServerPoools"
                    component={ServerPools}
                    {...props}
                  />}
                  {userInfo && _.get(userInfo, 'authorized_views.pools', false) && <AdminRoute
                    path="/create_server_pool"
                    name="CreateServerPool"
                    component={CreateServerPool}
                    {...props}
                  />}
                  {userInfo && _.get(userInfo, 'authorized_views.pools', false) && <AdminRoute
                    path="/update_server_pool/:id"
                    name="UpdateServerPool"
                    component={UpdateServerPool}
                    {...props}
                  />}
                  {userInfo && _.get(userInfo, 'authorized_views.servers', false) && <AdminRoute
                    path="/servers"
                    name="Servers"
                    component={Servers}
                    {...props}
                  />}
                  {userInfo && _.get(userInfo, 'authorized_views.servers', false) && <AdminRoute
                    path="/create_server"
                    name="CreateServer"
                    component={CreateServer}
                    {...props}
                  />}
                  {userInfo && _.get(userInfo, 'authorized_views.servers', false) && <AdminRoute
                    path="/update_server/:id"
                    name="UpdateServer"
                    component={UpdateServer}
                    {...props}
                  />}
                  <AdminRoute
                    path="/viewkasm/:id"
                    name="ViewKasm"
                    component={ViewKasm}
                    {...props}
                  />
                  {userInfo && _.get(userInfo, 'authorized_views.groups', false) && <AdminRoute
                    path="/groups"
                    name="Groups"
                    component={Groups}
                    {...props}
                  />}
                  {userInfo && _.get(userInfo, 'authorized_views.groups', false) && <AdminRoute
                    path="/creategroup"
                    name="CreateGroup"
                    component={CreateGroup}
                    {...props}
                  />}
                  {userInfo && _.get(userInfo, 'authorized_views.groups', false) && <AdminRoute
                    path="/updategroup/:id"
                    name="UpdateGroup"
                    component={UpdateGroup}
                    {...props}
                  />}
                  {userInfo && _.get(userInfo, 'authorized_views.agents', false) && <AdminRoute
                    path="/updateagent/:id"
                    name="UpdateAgent"
                    component={UpdateAgent}
                    {...props}
                  />}
                  <AdminRoute
                    path="/userprofile"
                    name="UserDashboard"
                    component={UserDashboard}
                    {...props}
                  />
                  <AdminRoute
                    path="/subscribe"
                    name="UserSubscription"
                    component={UserSubscription}
                    {...props}
                  />
                  <AdminRoute
                    path="/adminprofile"
                    name="UserDashboard"
                    component={UserDashboard}
                    {...props}
                  />
                  {userInfo && _.get(userInfo, 'authorized_views.devapi', false) && <AdminRoute
                    path="/developers"
                    name="Developers"
                    component={Developers}
                    {...props}
                  />}
                  {userInfo && _.get(userInfo, 'authorized_views.devapi', false) && <AdminRoute
                    path="/createapi"
                    name="CreateApi"
                    component={CreateApi}
                    {...props}
                  />}
                  {userInfo && _.get(userInfo, 'authorized_views.devapi', false) && <AdminRoute
                    path="/updateapi/:id"
                    name="UpdateApi"
                    component={UpdateApi}
                    {...props}
                  />}
                  {userInfo && _.get(userInfo, 'authorized_views.webfilter', false) && <AdminRoute
                    path="/webfilter"
                    name="Web Filter"
                    component={UrlFilter}
                    {...props}
                  />}
                  {userInfo && _.get(userInfo, 'authorized_views.webfilter', false) && <AdminRoute
                    path="/updatefilter/:id"
                    name="UpdateUrlFilter"
                    component={UpdateUrlFilter}
                    {...props}
                  />}
                  {userInfo && _.get(userInfo, 'authorized_views.webfilter', false) && <AdminRoute
                    path="/createfilter"
                    name="CreateUrlFilter"
                    component={CreateUrlFilter}
                    {...props}
                  />}
                  {userInfo && _.get(userInfo, 'authorized_views.settings', false) && <AdminRoute
                    path="/settings"
                    name="Settings"
                    component={Settings}
                    {...props}
                  />}
                  {userInfo && _.get(userInfo, 'authorized_views.auth', false) && <AdminRoute
                    path="/ldap"
                    name="Ldap"
                    component={Ldap}
                    {...props}
                  />}
                  {userInfo && _.get(userInfo, 'authorized_views.auth', false) && <AdminRoute
                    path="/saml"
                    name="Saml"
                    component={Saml}
                    {...props}
                  />}
                  {userInfo && _.get(userInfo, 'authorized_views.auth', false) && <AdminRoute
                    path="/updatesaml/:id"
                    name="UpdateSaml"
                    component={UpdateSaml}
                    {...props}
                  />}
                  {userInfo && _.get(userInfo, 'authorized_views.auth', false) && <AdminRoute
                    path="/createldap"
                    name="CreateLdap"
                    component={CreateLdap}
                    {...props}
                  />}
                  {userInfo && _.get(userInfo, 'authorized_views.auth', false) && <AdminRoute
                    path="/updateldap/:id"
                    name="UpdateLdap"
                    component={UpdateLdap}
                    {...props}
                  />}
                  <AdminRoute path="/logout" name="Logout" component={Logout} />
                  {userInfo && _.get(userInfo, 'authorized_views.system', false) && <AdminRoute
                    path="/systeminfo"
                    name="ViewSystemInfo"
                    component={ViewSystemInfo}
                  />}
                  {userInfo && _.get(userInfo, 'authorized_views.branding', false) && <AdminRoute
                    path="/branding"
                    name="Branding"
                    component={Branding}
                    {...props}
                  />}
                  {userInfo && _.get(userInfo, 'authorized_views.branding', false) && <AdminRoute
                    path="/updatebranding/:id"
                    name="UpdateBrandingConfig"
                    component={UpdateBrandingConfig}
                    {...props}
                  />}
                  {userInfo && _.get(userInfo, 'authorized_views.branding', false) && <AdminRoute
                    path="/createbranding"
                    name="CreateBrandingConfig"
                    component={CreateBrandingConfig}
                    {...props}
                  />}
                  {userInfo && _.get(userInfo, 'authorized_views.autoscale', false) && <AdminRoute
                    path="/autoscale"
                    name="AutoScale"
                    component={AutoScale}
                    {...props}
                  />}
                  {userInfo && _.get(userInfo, 'authorized_views.autoscale', false) && <AdminRoute
                    path="/view_autoscale/:id"
                    name="ViewAutoScale"
                    component={ViewAutoScale}
                    {...props}
                  />}
                  {userInfo && _.get(userInfo, 'authorized_views.autoscale', false) && <AdminRoute
                    path="/update_autoscale/:id"
                    name="UpdateAutoScale"
                    component={UpdateAutoScale}
                    {...props}
                  />}
                  {userInfo && _.get(userInfo, 'authorized_views.autoscale', false) && <AdminRoute
                    path="/create_autoscale"
                    name="CreateAutoScale"
                    component={CreateAutoScale}
                    {...props}
                  />}
                  {userInfo && _.get(userInfo, 'authorized_views.vm_providers', false) && <AdminRoute
                    path="/vm_provider"
                    name="VmProvider"
                    component={VmProvider}
                    {...props}
                  />}
                  {userInfo && _.get(userInfo, 'authorized_views.vm_providers', false) && <AdminRoute
                    path="/view_vm_provider/:id"
                    name="ViewVmProviderConfig"
                    component={ViewVmProviderConfig}
                    {...props}
                  />}
                  {userInfo && _.get(userInfo, 'authorized_views.vm_providers', false) && <AdminRoute
                    path="/update_vm_provider/:id"
                    name="UpdateVmProviderConfig"
                    component={UpdateVmProviderConfig}
                    {...props}
                  />}
                  {userInfo && _.get(userInfo, 'authorized_views.vm_providers', false) && <AdminRoute
                    path="/create_vm_provider"
                    name="CreateVmProviderConfig"
                    component={CreateVmProviderConfig}
                    {...props}
                  />}
                  {userInfo && _.get(userInfo, 'authorized_views.dns_providers', false) && <AdminRoute
                    path="/dns_provider"
                    name="DnsProvider"
                    component={DnsProvider}
                    {...props}
                  />}
                  {userInfo && _.get(userInfo, 'authorized_views.dns_providers', false) && <AdminRoute
                    path="/view_dns_provider/:id"
                    name="ViewDnsProviderConfig"
                    component={ViewDnsProviderConfig}
                    {...props}
                  />}
                  {userInfo && _.get(userInfo, 'authorized_views.dns_providers', false) && <AdminRoute
                    path="/update_dns_provider/:id"
                    name="UpdateDnsProviderConfig"
                    component={UpdateDnsProviderConfig}
                    {...props}
                  />}
                  {userInfo && _.get(userInfo, 'authorized_views.dns_providers', false) && <AdminRoute
                    path="/create_dns_provider"
                    name="CreateDnsProviderConfig"
                    component={CreateDnsProviderConfig}
                    {...props}
                  />}
                  {userInfo && _.get(userInfo, 'authorized_views.staging', false) && <AdminRoute
                    path="/staging"
                    name="Staging"
                    component={Staging}
                    {...props}
                  />}
                  {userInfo && _.get(userInfo, 'authorized_views.staging', false) && <AdminRoute
                    path="/updatestaging/:id"
                    name="UpdateStagingConfig"
                    component={UpdateStagingConfig}
                    {...props}
                  />}
                  {userInfo && _.get(userInfo, 'authorized_views.staging', false) && <AdminRoute
                    path="/createstaging"
                    name="CreateStagingConfig"
                    component={CreateStagingConfig}
                    {...props}
                  />}
                  {userInfo && _.get(userInfo, 'authorized_views.casting', false) && <AdminRoute
                    path="/cast"
                    name="Cast"
                    component={Cast}
                    {...props}
                  />}
                  {userInfo && _.get(userInfo, 'authorized_views.casting', false) && <AdminRoute
                    path="/updatecast/:id"
                    name="UpdateCastConfig"
                    component={UpdateCastConfig}
                    {...props}
                  />}
                  {userInfo && _.get(userInfo, 'authorized_views.casting', false) && <AdminRoute
                    path="/createcast"
                    name="CreateCastConfig"
                    component={CreateCastConfig}
                    {...props}
                  />}
                  {userInfo && _.get(userInfo, 'authorized_views.auth', false) && <AdminRoute
                    path="/oidc"
                    name="Oidc"
                    component={Oidc}
                    {...props}
                  />}
                  {userInfo && _.get(userInfo, 'authorized_views.auth', false) && <AdminRoute
                    path="/updateoidc/:id"
                    name="UpdateOidcConfig"
                    component={UpdateOidcConfig}
                    {...props}
                  />}
                  {userInfo && _.get(userInfo, 'authorized_views.auth', false) && <AdminRoute
                    path="/createoidc"
                    name="CreateOidcConfig"
                    component={CreateOidcConfig}
                    {...props}
                  />}
                  {userInfo && _.get(userInfo, 'authorized_views.physical_tokens', false) && <AdminRoute 
                    path="/physical_tokens"
                    name="PhysicalTokens"
                    component={PhysicalToken}
                  />}
                  {userInfo && _.get(userInfo, 'authorized_views.storage_providers', false) && <AdminRoute
                    path="/storage_providers"
                    name="StorageProvider"
                    component={StorageProvider}
                    {...props}
                  />}
                  {userInfo && _.get(userInfo, 'authorized_views.storage_providers', false) && <AdminRoute
                    path="/update_storage_provider/:id"
                    name="UpdateStorageProvider"
                    component={UpdateStorageProvider}
                    {...props}
                  />}
                  {userInfo && _.get(userInfo, 'authorized_views.storage_providers', false) && <AdminRoute
                    path="/create_storage_provider"
                    name="CreateStorageProvider"
                    component={CreateStorageProvider}
                    {...props}
                  />}

                  {hasAuth('admin_dashboard') ? (
                    <Redirect from="/" to={adminPage} />
                  ) : (
                    <Redirect from="/" to="/userdashboard" />
                  )}
                </Switch>
              </div>
            </main>
          </div>
        </div>
      </ErrorBoundary>
    );
  }
}

function mapStateToProps(state) {
  return {
    sessionToken: state.auth.sessionToken,
    clientsettings: state.dashboard.clientsettings || null,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    logout: (logout_data) => dispatch(logout(logout_data)),
    getClientSettings: () => dispatch(getClientSettings()),
    getLicenseStatus: () => dispatch(getLicenseStatus()),
    refreshTokenFunc: (payload_data) => {
      dispatch(getNewToken(payload_data));
    },
  };
}

AdminRoute.propTypes = {
  component: Proptypes.func,
  logout: Proptypes.func,
  clientsettings: Proptypes.object,
  location: Proptypes.object,
};
const FullTranslated = withTranslation('common')(Full)

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FullTranslated));
