import {combineReducers} from "redux";
import {routerReducer} from "react-router-redux";
import requests from "./requests";
import authReducer from "./authReducer";
import adminUserReducer from "./adminUserReducer";
import dashboardReducer from "./dashboardReducer";
import groupsReducer from "./groupsReducer";
import adminProfileReducer from "./adminProfileReducer";
import serversReducer from "./serversReducer";
import serverPoolReducer from "./serverPoolReducer";
import managersReducer from "./managersReducer";
import zonesReducer from "./zonesReducer";
import connectionProxiesReducer from "./connectionProxiesReducer";
import settingsReducer from "./settingsReducer";
import imagesReducer from "./imagesReducer";
import ldapReducer from "./ldapReducer";
import kasmReducer from "./kasmReducer";
import userReducer from "./userReducer";
import systemInfoReducer from "./systemInfoReducer";
import footerReducer from "./footerReducer";
import samlReducer from "./samlReducer";
import oidcReducer from "./oidcReducer";
import physicalTokenReducer from "./physicalTokenReducer";
import ssoReducer from "./ssoReducer";
import reportingReducer from "./reportingReducer";
import developerReducer from "./developerReducer";
import filterReducer from "./filterReducer";
import brandingReducer from "./brandingReducer";
import autoscaleReducer from "./autoscaleReducer";
import vmproviderReducer from "./vmproviderReducer";
import dnsproviderReducer from "./dnsproviderReducer";
import serverLogReducer from "./serverLogReducer";
import stagingReducer from "./stagingReducer";
import castReducer from "./castReducer";
import tablesReducer from "./tablesReducer";
import createAccountReducer from "./createAccountReducer";
import passwordResetReducer from "./passwordResetReducer";
import attributeMappingReducer from "./attributeMappingReducer";
import fileMappingReducer from "./fileMappingReducer";
import scheduleReducer from "./scheduleReducer";
import storageMappingReducer from "./storageMappingReducer";
import storageProviderReducer from "./storageProviderReducer"

import { reducer as formReducer } from "redux-form";

export default function () {
    const appReducer = combineReducers({
        routing: routerReducer,
        auth: authReducer,
        admin: adminUserReducer,
        dashboard: dashboardReducer,
        groups: groupsReducer,
        images: imagesReducer,
        kasms: kasmReducer,
        ldap_configs: ldapReducer,
        servers: serversReducer,
        server_pools: serverPoolReducer,
        managers: managersReducer,
        zones: zonesReducer,
        connection_proxies: connectionProxiesReducer,
        settings: settingsReducer,
        profile: adminProfileReducer,
        user: userReducer,
        footer: footerReducer,
        system_info: systemInfoReducer,
        form: formReducer,
        saml: samlReducer,
        oidc: oidcReducer,
        physical_tokens: physicalTokenReducer,
        sso: ssoReducer,
        reporting: reportingReducer,
        develop: developerReducer,
        filter: filterReducer,
        branding: brandingReducer,
        autoscale: autoscaleReducer,
        vm_provider: vmproviderReducer,
        dns_provider: dnsproviderReducer,
        server_logs: serverLogReducer,
        staging: stagingReducer,
        cast: castReducer,
        createAccount: createAccountReducer,
        passwordReset: passwordResetReducer,
        attribute_mapping: attributeMappingReducer,
        file_mapping: fileMappingReducer,
        schedule: scheduleReducer,
        storage_mapping: storageMappingReducer,
        storage_provider: storageProviderReducer,
        tables: tablesReducer,
        requests
    });

    return (state, action) => {
        if (action.type === "RESET_STORE") {
            // passing undefined state will re-initialize the reducer's state
            return appReducer(undefined, action);
        } else {
            return appReducer(state, action);
        }
    };
}