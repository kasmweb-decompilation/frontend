import {login_saml} from "../actions/actionSSO";

export default function (state = [], action={}) {
    switch (action.type) {
        case "SET_LOGS_PAGEINFO":
        return {
            ...state,
            pageSize:action.payload.pageSize,
            pageNo : action.payload.pageNo
        }; 
        case "SET_USER_USAGE_PAGEINFO":
        return {
            ...state,
            userUsagePageSize:action.payload.pageSize,
            userUsagePageNo : action.payload.pageNo
        }; 
        case "SET_DOMAIN_USAGE_PAGEINFO":
        return {
            ...state,
            domainUsagePageSize:action.payload.pageSize,
            domainUsagePageNo : action.payload.pageNo
        };
        case "GET_REPORT_REQUESTED":
        return {
            ...state,
            getReportLoading: true,
            getReportError: null
        };
        case "GET_REPORT_SUCCESS":
            return {
                ...state,
                report: action.response,
                getReportLoading: false,
                getReportError: null,
            };
        case "GET_REPORT_FAILED":
            return {
                ...state,
                getReportLoading: false,
                getReportError: action.response
            };

        case "GET_TOTALUSERS_REQUESTED":
            return {
                ...state,
                getTotalUsersLoading: true,
                getTotalUsersError: null
            };
        case "GET_TOTALUSERS_SUCCESS":
            return {
                ...state,
                total_users: action.response.data || null,
                getTotalUsersLoading: false,
                getTotalUsersError: null,
            };
        case "GET_TOTALUSERS_FAILED":
            return {
                ...state,
                getTotalUsersLoading: false,
                getTotalUsersError: action.response
            };

        case "GET_AGENT_REQUESTED":
            return {
                ...state,
                agents: null,
                getAgentsLoading: true,
                getAgentsError: null
            };
        case "GET_AGENT_SUCCESS":
            return {
                ...state,
                agents: action.response || null,
                getAgentsLoading: false,
                getAgentsError: null,
            };
        case "GET_AGENT_FAILED":
            return {
                ...state,
                agents: null,
                getAgentsLoading: false,
                getAgentsError: action.response
            };

        case "GET_ACTIVE_USERS_REQUESTED":
            return {
                ...state,
                active_users: null,
                getActiveUsersLoading: true,
                getActiveUsersError: null
            };
        case "GET_ACTIVE_USERS_SUCCESS":
            return {
                ...state,
                active_users: action.response || null,
                getActiveUsersLoading: false,
                getActiveUsersError: null,
            };
        case "GET_ACTIVE_USERS_FAILED":
            return {
                ...state,
                getActiveUsersLoading: false,
                getActiveUsersError: action.response
            };

        case "GET_LOGINS_REQUESTED":
            return {
                ...state,
                logins_by_hour: null,
                getLoginsLoading: true,
                getReportError: null
            };
        case "GET_LOGINS_SUCCESS":
            return {
                ...state,
                logins_by_hour: action.response || null,
                getLoginsLoading: false,
                getReportError: null,
            };
        case "GET_LOGINS_FAILED":
            return {
                ...state,
                getLoginsLoading: false,
                getReportError: action.response
            };

        case "GET_KASM_LENGTH_REQUESTED":
            return {
                ...state,
                getKasmLengthLoading: true,
                getReportError: null
            };
        case "GET_KASM_LENGTH_SUCCESS":
            return {
                ...state,
                avg_kasm_duration: action.response.data || null,
                getKasmLengthLoading: false,
                getReportError: null,
            };
        case "GET_KASM_LENGTH_FAILED":
            return {
                ...state,
                getKasmLengthLoading: false,
                getReportError: action.response
            };

        case "GET_DESTROYED_KASMS_REQUESTED":
            return {
                ...state,
                getDestroyedKasmsLoading: true,
                getReportError: null
            };
        case "GET_DESTROYED_KASMS_SUCCESS":
            return {
                ...state,
                destroyed_kasms: action.response.data || null,
                getDestroyedKasmsLoading: false,
                getReportError: null,
            };
        case "GET_DESTROYED_KASMS_FAILED":
            return {
                ...state,
                getDestroyedKasmsLoading: false,
                getReportError: action.response
            };

        case "GET_CREATED_KASMS_REQUESTED":
            return {
                ...state,
                getCreatedKasmsLoading: true,
                getReportError: null
            };
        case "GET_CREATED_KASMS_SUCCESS":
            return {
                ...state,
                created_kasms: action.response.data || null,
                getCreatedKasmsLoading: false,
                getReportError: null,
            };
        case "GET_CREATED_KASMS_FAILED":
            return {
                ...state,
                getCreatedKasmsLoading: false,
                getReportError: action.response
            };

        case "GET_KASMS_REQUESTED":
            return {
                ...state,
                getKasmsLoading: true,
                getReportError: null
            };
        case "GET_KASMS_SUCCESS":
            return {
                ...state,
                kasms: action.response || null,
                getKasmsLoading: false,
                getReportError: null,
            };
        case "GET_KASMS_FAILED":
            return {
                ...state,
                getKasmsLoading: false,
                getReportError: action.response
            };
        case "GET_ERRORS_REQUESTED":
            return {
                ...state,
                getErrorLoading: true,
                getReportError: null
            };
        case "GET_ERRORS_SUCCESS":
            return {
                ...state,
                get_errors: action.response.data || null,
                getErrorLoading: false,
                getReportError: null,
            };
        case "GET_ERRORS_FAILED":
            return {
                ...state,
                getErrorLoading: false,
                getReportError: action.response
            };

        case "GET_ALERT_REQUESTED":
            return {
                ...state,
                getReportLoading: true,
                getReportError: null
            };
        case "GET_ALERT_SUCCESS":
            return {
                ...state,
                get_alert: action.response || null,
                getReportLoading: false,
                getReportError: null,
            };
        case "GET_ALERT_FAILED":
            return {
                ...state,
                getReportLoading: false,
                getReportError: action.response
            };

        case "GET_LOG_REQUESTED":
            return {
                ...state,
                logs:null,
                getLogLoading: true,
                getReportError: null
            };
        case "GET_LOG_SUCCESS":
            return {
                ...state,
                logs: action.response || null,
                getLogLoading: false,
                getReportError: null,
            };
        case "GET_LOG_FAILED":
            return {
                ...state,
                getLogLoading: false,
                getReportError: action.response
            };

        case "GET_HOSTS_REQUESTED":
            return {
                ...state,
                hosts:null,
                getHostsLoading: true,
            };
        case "GET_HOSTS_SUCCESS":
            return {
                ...state,
                hosts: action.response || null,
                getHostsLoading: false,
            };
        case "GET_HOSTS_FAILED":
            return {
                ...state,
                getHostsLoading: false,
            };

        case "GET_IMAGE_USE_REQUESTED":
            return {
                ...state,
                images:null,
                getImageUseLoading: true,
                getReportError: null
            };
        case "GET_IMAGE_USE_SUCCESS":
            return {
                ...state,
                images: action.response || null,
                getImageUseLoading: false,
                getReportError: null,
            };
        case "GET_IMAGE_USE_FAILED":
            return {
                ...state,
                getImageUseLoading: false,
                getReportError: action.response
            };

        case "GET_KASM_USE_REQUESTED":
            return {
                ...state,
                users:null,
                getKasmUseLoading: true,
            };
        case "GET_KASM_USE_SUCCESS":
            return {
                ...state,
                users: action.response || null,
                getKasmUseLoading: false,
            };
        case "GET_KASM_USE_FAILED":
            return {
                ...state,
                getKasmUseLoading: false,
            };

        case "GET_DOMAIN_USE_REQUESTED":
            return {
                ...state,
                domains: null,
                getDomainUseLoading: true,
            };
        case "GET_DOMAIN_USE_SUCCESS":
            return {
                ...state,
                domains: action.response || null,
                getDomainUseLoading: false,
            };
        case "GET_DOMAIN_USE_FAILED":
            return {
                ...state,
                getDomainUseLoading: false,
            };
        case "GET_CURRENT_KASMS_REQUESTED":
            return {
                ...state,
                current_kasms:null,
                getCurrentKasmLoading: true,
            };
        case "GET_CURRENT_KASMS_SUCCESS":
            return {
                ...state,
                current_kasms: action.response.data || null,
                getCurrentKasmLoading: false,
            };
        case "GET_CURRENT_KASMS_FAILED":
            return {
                ...state,
                getCurrentKasmLoading: false,
            };

        case "GET_CURRENT_USERS_REQUESTED":
            return {
                ...state,
                current_users:null,
                getCurrentUsersLoading: true,
            };
        case "GET_CURRENT_USERS_SUCCESS":
            return {
                ...state,
                current_users: action.response.data || null,
                getCurrentUsersLoading: false,
            };
        case "GET_CURRENT_USERS_FAILED":
            return {
                ...state,
                getCurrentUsersLoading: false,
            };

        case "GET_AGENTGRAPH_REQUESTED":
            return {
                ...state,
                agentGraph:null,
                getAgentGraphLoading: true,
            };
        case "GET_AGENTGRAPH_SUCCESS":
            return {
                ...state,
                agentGraph: action.response || null,
                getAgentGraphLoading: false,
            };
        case "GET_AGENTGRAPH_FAILED":
            return {
                ...state,
                getAgentGraphLoading: false,
            };

        default:
            return state;
    }
}