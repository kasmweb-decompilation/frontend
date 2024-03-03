export default function (state = [], action={}) {
    switch (action.type) {
        case "SET_WEB_FILTER_PAGEINFO":
        return {
            ...state,
            pageSize:action.payload.pageSize,
            pageNo : action.payload.pageNo
        }; 
        case "GET_FILTER_REQUESTED":
            return {
                ...state,
                filters: null,
                getFilterLoading: true,
                getFilterError: null
            };
        case "GET_FILTER_SUCCESS":
            return {
                ...state,
                filters: action.response && action.response.url_filter_policies || null,
                getFilterLoading: false,
                getFilterErrorMessage: action.response && action.response.error_message || null,
            };
        case "GET_FILTER_FAILED":
            return {
                ...state,
                filters: null,
                getFilterLoading: false,
                getFilterError: action.response
            };

        case "GET_FILTER_CATEGORIES_REQUESTED":
            return {
                ...state,
                categories: {},
                getFilterCategoriesLoading: true,
                getFilterCategoriesError: null
            };
        case "GET_FILTER_CATEGORIES_SUCCESS":
            return {
                ...state,
                categories: action.response && action.response.categories || {},
                getFilterCategoriesLoading: false,
                getFilterCategoriesErrorMessage: action.response && action.response.error_message || null,
            };
        case "GET_FILTER_CATEGORIES_FAILED":
            return {
                ...state,
                categories: {},
                getFilterCategoriesLoading: false,
                getFilterCategoriesError: action.response
            };

        case "CREATE_FILTER_REQUESTED":
            return {
                ...state,
                createdFilter: null,
                createFilterLoading: true,
                createFilterError: null
            };
        case "CREATE_FILTER_SUCCESS":
            return {
                ...state,
                createdFilter: action.response && action.response.filter_policy || null,
                createFilterLoading: false,
                createFilterError: action.response && action.response.error_message || null,
            };
        case "CREATE_FILTER_FAILED":
            return {
                ...state,
                createdFilter: null,
                createFilterLoading: false,
                createFilterError: action.response
            };

        case "DELETE_FILTER_REQUESTED":
            return {
                ...state,
                deletedFilter: null,
                deleteFilterLoading: true,
                deleteFilterError: null
            };
        case "DELETE_FILTER_SUCCESS":
            return {
                ...state,
                deletedFilter: action.response && action.response.filter_policy || null,
                deleteFilterLoading: false,
                deleteFilterErrorMessage: action.response && action.response.error_message || null,
            };
        case "DELETE_FILTER_FAILED":
            return {
                ...state,
                deletedFilter: null,
                deleteFilterLoading: false,
                deleteFilterError: action.response
            };

        case "UPDATE_FILTER_REQUESTED":
            return {
                ...state,
                updatedFilter: null,
                updateFilterLoading: true,
                updateFilterError: null
            };
        case "UPDATE_FILTER_SUCCESS":
            return {
                ...state,
                updatedFilter: action.response && action.response.filter_policy || null,
                updateFilterLoading: false,
                updateFilterError: action.response && action.response.error_message || null,
            };
        case "UPDATE_FILTER_FAILED":
            return {
                ...state,
                updatedFilter: null,
                updateFilterLoading: false,
                updateFilterError: action.response
            };

        case "GET_SAFE_SEARCH_PATTERNS_REQUESTED":
            return {
                ...state,
                patterns: [],
                getSafeSearchPatternsLoading: true,
                getSafeSearchPatternsError: null
            };
        case "GET_SAFE_SEARCH_PATTERNS_SUCCESS":
            return {
                ...state,
                patterns: action.response && action.response.patterns || [],
                getSafeSearchPatternsLoading: false,
                getSafeSearchPatternsMessage: action.response && action.response.error_message || null,
            };
        case "GET_SAFE_SEARCH_PATTERNS_FAILED":
            return {
                ...state,
                patterns: {},
                getSafeSearchPatternsLoading: false,
                getSafeSearchPatternsError: action.response
            };


        default:
            return state;
    }
}