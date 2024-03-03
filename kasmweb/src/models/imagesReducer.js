export default function (state={}, action={}) {
    switch (action.type) {
    case "SET_IMAGES_PAGEINFO":
        return {
            ...state,
            pageSize:action.payload.pageSize,
            pageNo : action.payload.pageNo
        }; 
    case "CREATE_IMAGES_REQUESTED":
        return {
            ...state,
            editWorkspace: false,
            createImagesLoading: true,
            createimagesError: null
        };
    case "CREATE_IMAGES_SUCCESS": 
        return {
            ...state,
            errorCreateImageMessage: action.response && action.response.error_message ? action.response.error_message : null,
            createImagesLoading: false,
            createImagesError: null
        };
    case "CREATE_IMAGES_FAILED":
        return {
            ...state,
            createImagesLoading: false,
            createImagesError: action.error
        };

    case "GET_IMAGES_REQUESTED":
        return {
            ...state,
            images: null,
            getImagesLoading: true,
            getImagesError: null
        };
    case "GET_IMAGES_SUCCESS": 
        return {
            ...state,
            images: action.response.images,
            getImagesLoading: false,
            getImagesError: null
        };
    case "GET_IMAGES_FAILED":
        return {
            ...state,
            images: null,
            getImagesLoading: false,
            getImagesError: action.error
        };

    case "UPDATE_IMAGES_REQUESTED":
        return {
            ...state,
            updateImagesLoading: true,
            updateImagesError: null
        };
    case "UPDATE_IMAGES_SUCCESS": 
        return {
            ...state,
            updateErrorImagesMessage: action.response && action.response.error_message ? action.response.error_message : null,
            updateImagesLoading: false,
            updateImagesError: null
        };
    case "UPDATE_IMAGES_FAILED":
        return {
            ...state,
            updateImagesLoading: false,
            updateImagesError: action.error
        };

    case "DELETE_IMAGES_REQUESTED":
        return {
            ...state,
            deleteImagesLoading: true,
            deleteImagesError: null
        };
    case "DELETE_IMAGES_SUCCESS": 
        return {
            ...state,
            deleteImagesLoading: false,
            deleteImageErrorMessage: action.response && action.response.error_message ? action.response.error_message : null,
            deleteImagesError: null
        };
    case "DELETE_IMAGES_FAILED":
        return {
            ...state,
            deleteImagesLoading: false,
            deleteImagesError: action.error
        };

    case "GET_SERVER_CUSTOM_NETWORK_REQUESTED":
        return {
            ...state,
            network: null,
            getNetworksLoading: true,
            getNetworksError: null
        };
    case "GET_SERVER_CUSTOM_NETWORK_SUCCESS": 
        return {
            ...state,
            network_names: action.response.network_names,
            getNetworksLoading: false,
            getNetworksError: null
        };
    case "GET_SERVER_CUSTOM_NETWORK_FAILED":
        return {
            ...state,
            images: null,
            getNetworksLoading: false,
            getNetworksError: action.error
        };
    case "UPDATE_SERVER_REQUESTED":
        return {
            ...state,
            updateServerLoading: true,
            updateServerError: null
        };
    case "UPDATE_SERVER_SUCCESS":
        return {
            ...state,
            updateErrorServerMessage: action.response && action.response.error_message ? action.response.error_message : null,
            updateServerLoading: false,
            updateServerError: null
        };
    case "UPDATE_SERVER_FAILED":
        return {
            ...state,
            updateServerLoading: false,
            updateServerError: action.error
        };
    case "EDIT_WORKSPACE":
        return {
            ...state,
            editWorkspace: action.response,
        };
    case "GET_REGISTRIES_REQUESTED":
        return {
            ...state,
            // registries: [],
            architectures: [],
            updateRegistriesError: null
        };
    case "GET_REGISTRIES_SUCCESS":
        let allCategories = []
        action.response.registries.map(registry => {
            registry.workspaces.map(workspace => {
                if (workspace.categories) {
                    allCategories = [
                        ...new Set(allCategories),
                        ...new Set(workspace.categories)
                    ]
                }
    
            })
        })
        return {
            ...state,
            registries: action.response.registries,
            allCategories: allCategories,
            architectures: action.response.architectures,
            registryError: action.response && action.response.error_message ? action.response.error_message : null,
        };
    case "GET_REGISTRIES_FAILED":
        return {
            ...state,
            registries: [],
            architectures: [],
            updateRegistriesError: action.error
        };

    case "CREATE_REGISTRY_REQUESTED":
        return {
            ...state,
            registry: [],
            registryError: null
        };

    case "CREATE_REGISTRY_SUCCESS":
        return {
            ...state,
            registry: action.response.registry,
            registryError: action.response && action.response.error_message ? action.response.error_message : null,
        };
    case "CREATE_REGISTRY_FAILED":
        return {
            ...state,
            updateRegistryError: action.error,
            registryError: action.response && action.response.error_message ? action.response.error_message : null,
        };

    case "UPDATE_REGISTRY_REQUESTED":
        return {
            ...state,
            registry: [],
            registryError: null
        };

    case "UPDATE_REGISTRY_SUCCESS":
        return {
            ...state,
            registry: action.response.registry,
            registryError: action.response && action.response.error_message ? action.response.error_message : null,
        };
    case "UPDATE_REGISTRY_FAILED":
        return {
            ...state,
            updateRegistryError: action.error,
            registryError: action.response && action.response.error_message ? action.response.error_message : null,
        };

    case "DELETE_REGISTRY_REQUESTED":
        return {
            ...state,
            updateRegistryError: null
        };
    case "DELETE_REGISTRY_SUCCESS":
        return {
            ...state,
        };
    case "DELETE_REGISTRY_FAILED":
        return {
            ...state,
            updateRegistryError: action.error
        };
    case "LAUNCH_FORM":
        return {
            ...state,
            launchForm: action.response
        }
    case "LAUNCH_SELECTIONS":
        return {
            ...state,
            launchSelections: action.response
        }

    default:
        return state;
    }
}