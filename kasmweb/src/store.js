import {createStore, compose, applyMiddleware} from "redux";
import {routerMiddleware} from "react-router-redux";
import thunk from "redux-thunk";
import createReducer from "./models/index";
import { persistStore, persistReducer } from 'redux-persist';
import { createWhitelistFilter } from "redux-persist-transform-filter";
import storage from 'redux-persist/lib/storage';

const WHITE_LIST = [
    "admin", 
    "groups", 
    "managers", 
    "attribute_mapping", 
    "zones", 
    "servers",
    "staging",
    "cast",
    "images",
    "dashboard",
    "develop",
    "filter",
    "branding",
    "ldap_configs",
    "saml",
    "system_info",
    "reporting",
    "user"
]
const TRANSFORMS = WHITE_LIST.map((item) => createWhitelistFilter(item, ["pageSize", "pageNo"]));
const persistConfig = {
    key: 'admin',
    storage: storage,
    transforms: TRANSFORMS,
    whitelist: WHITE_LIST,
  };
const pReducer = persistReducer(persistConfig, createReducer());
const storeEnhancer = compose(
    applyMiddleware(
    // must be on top to catch/report bubbled up errors
        thunk,
        routerMiddleware(history),
        // Positioning logger at the bottom will only log actions that are going to be applied to the store
        createLogger()
    ),
    // compose with https://github.com/zalmoxisus/redux-devtools-extension (Chrome Extension) if available
    window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f
);

const store = createStore(pReducer,storeEnhancer);
const persistor = persistStore(store);
export { persistor, store };

function createLogger () {
    return ({ getState }) => (next) => (action) => { // eslint-disable-line
        if (__DEVELOPMENT__) {  // eslint-disable-line
            // console.log("Action", action.type, action); // eslint-disable-line
        }
        return next(action);
    };
}