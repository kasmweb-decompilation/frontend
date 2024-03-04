import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import { PersistGate } from 'redux-persist/integration/react';
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";
import browserHistory from "history/createBrowserHistory";
import './i18n';

// Styles
// Import Flag Icons Set
import "flag-icon-css/css/flag-icon.min.css";
// Import Simple Line Icons Set
import "simple-line-icons/css/simple-line-icons.css";
// Import Main styles for this application
import "../scss/style.scss";
// Temp fix for reactstrap
import "../scss/core/_dropdown-menu-right.scss";
import "react-notifications/dist/react-notifications.css";
import Proptypes from "prop-types";

//Styles for the dropzone component
import "react-dropzone-component/styles/filepicker.css";
import "dropzone/dist/min/dropzone.min.css";

import "./tailwind.css";

// Containers
import Full from "./containers/Full/";
import { Provider } from "react-redux";
import { NotificationContainer } from "react-notifications";

// Views
import Login from "./views/Pages/Login/Login.js";
import SSO from "./views/Pages/SSO/SSO.js";
import Connect from "./views/Connect/Connect.js";
import Cast from "./views/Cast/Cast.js";
import Page404 from "./views/Pages/Page404/Page404.js";
import Page500 from "./views/Pages/Page500/Page500.js";
import PageError from "./views/Pages/Error/PageError.js";
import Signup from "./views/Signup/Signup.js";
import PasswordReset from "./views/PasswordReset/PasswordReset.js";
import {store,persistor} from "./store";
import Go from "./views/Go/";
// import "../assets/style/main.css";

import LoadingSpinner from "./components/LoadingSpinner/index";

import UserDashboard from "./views/User/UserDashboard";
import { reload as reloadConstants } from "./constants/Constants";

require("es6-promise").polyfill();
require("isomorphic-fetch");

function loggedIn() {
    if(JSON.parse(window.localStorage.getItem("user_info")).token != null 
      && JSON.parse(window.localStorage.getItem("user_info")).token != undefined)
    {
        return true;
    }
    return false;
}

function requireAuth() {
    if (!loggedIn()) {
        return true;
    }
    else {
        return false;
    }
}


// In some instances either the username or token my get removed from the local storage user_info structure
//  This function ensures they are set. Callers may use this function to determine if the user is in a proper state
//  else the login page will be rendered.

function validUserInfo(user_info, rest){
    if (user_info) {
        try {
            let parsed_user_info = user_info;
            if (typeof user_info === 'string') {
                parsed_user_info = JSON.parse(user_info)
            }
            if (parsed_user_info.username && parsed_user_info.token) {
                return true;
            }
        }
        catch (err){
            console.error("Error parsing user_info." + err)
        }
    }
    return false;
}

function PrivateRoute ({component: Component, ...rest}) {
    const user_info = window.localStorage.getItem("user_info");

    if (user_info) {
        reloadConstants();
    }

    return (
        <Route
            {...rest}
            render={(props) => validUserInfo(user_info, rest)
                ? <Component {...props} />
                : <Redirect to={{pathname: "/login", state: {from: props.location}}} />}
        />
    );
}

// Start :: Set Theme color //
    const storedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const defaultDark = storedTheme === "Dark" || (storedTheme === null && prefersDark);

    // Start :: for selected color active
    const currentThemeColor = localStorage.getItem("themecolor");
    if (currentThemeColor === null) {
        localStorage.setItem("themecolor", "Auto");
    }
    // End :: for selected color active

    // if (defaultDark) {
    //     document.body.classList.remove("light","dark");

    //     localStorage.setItem("theme", "dark");
    //     document.body.classList.add("dark");
    // } else {
    //     document.body.classList.remove("light","dark");

    //     if (prefersDark) {
    //         localStorage.setItem("theme", "dark");
    //         document.body.classList.add("dark");
    //     } else {
    //         localStorage.setItem("theme", "light");
    //         document.body.classList.add("light");
    //     }
    // }

    if (localStorage.getItem("themecolor") === "Auto") {
        document.body.classList.remove("light","dark", "tw-dark");
        
        if (defaultDark) {
            localStorage.setItem("theme", "Dark");
            document.body.classList.add("dark", "tw-dark");
        } else {
            if (prefersDark) {
                localStorage.setItem("theme", "Dark");
                document.body.classList.add("dark", "tw-dark");
            } else {
                localStorage.setItem("theme", "Light");
                document.body.classList.add("light");
            }
        }
    } else if (localStorage.getItem("themecolor") === "Light") {
        document.body.classList.remove("light","dark", "tw-dark");

        localStorage.setItem("theme", "Light");
        document.body.classList.add("light");
    } else if (localStorage.getItem("themecolor") === "Dark") {
        document.body.classList.remove("light","dark", "tw-dark");
        
        localStorage.setItem("theme", "Dark");
        document.body.classList.add("dark", "tw-dark");
    }

    // Start :: On browser theme mode change
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
        // alert(localStorage.getItem("themecolor"));
        document.body.classList.remove("light","dark", "tw-dark");

        if (localStorage.getItem("themecolor") === "Auto") {
            const newColorScheme = event.matches ? "dark" : "light";
            document.body.classList.add(newColorScheme);
            if(newColorScheme === 'dark') {
                document.body.classList.add("tw-dark");
            }
        } else if (localStorage.getItem("themecolor") === "Light") {
            localStorage.setItem("theme", "Light");
            document.body.classList.add("light");
        } else if (localStorage.getItem("themecolor") === "Dark") {
            localStorage.setItem("theme", "Dark");
            document.body.classList.add("dark", "tw-dark");
        }
    });
    // End :: On browser theme mode change


// End :: Set Theme color //

// Set Timezone
window.localStorage.setItem('timezone', Intl.DateTimeFormat().resolvedOptions().timeZone)

ReactDOM.render((
    <div>
    <Suspense fallback={<LoadingSpinner />}>
    <NotificationContainer/>
    <Provider store={store} history={browserHistory}>
    <PersistGate  persistor={persistor}>
        <HashRouter>
            <Switch>
                <Route exact path="/login" name="Login Page" render={() => (
                    validUserInfo(window.localStorage.getItem("user_info")) ? (
                        <Redirect to="/"/>
                    ) : (
                        <Login/>
                    )
                )}/>
                <Route onEnter={requireAuth} exact path="/login" name="Login Page" component={Login}/>
                <Route onEnter={requireAuth} exact path="/staticlogin" name="Login Page" component={Login}/>
                <Route exact path="/sso/:user_id/:session_token" name="SSO" component={SSO}/>
                <Route exact path="/connect/:type/:kasm_id/:user_id/:session_token" name="Connect" component={Connect}/>
                <Route exact path="/cast/:cast_key" name="Cast" component={Cast}/>
                <Route exact path="/404" name="Page 404" component={Page404}/>
                <Route exact path="/500" name="Page 500" component={Page500}/>
                <Route exact path="/error" name="Error" component={PageError}/>
                <Route exact path="/signup" name="Signup" component={Signup}/>
                <Route exact path="/reset" name="Signup" component={PasswordReset}/>
                <PrivateRoute authed={requireAuth} exact path="/go" name="Go" component={Go} />
                <PrivateRoute authed={requireAuth} path="/" name="Home" component={Full} />
            </Switch>
        </HashRouter>
    </PersistGate>
    </Provider>
    </Suspense>
    </div>
), document.getElementById("root"));

PrivateRoute.propTypes = {
    location: Proptypes.object,
    component: Proptypes.func
};
