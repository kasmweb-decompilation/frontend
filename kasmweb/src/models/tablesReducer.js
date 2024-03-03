export default function (state={}, action={}) {
    switch (action.type) {
    case "CONDENSED":
        return {
            ...state,
            condensed: action.value,
        };
    default:
        return state;
    }
}