"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFetch = useFetch;
const react_1 = require("react");
function useFetch(url) {
    const [state, setState] = (0, react_1.useState)({
        data: null,
        loading: true,
        error: null,
    });
    (0, react_1.useEffect)(() => {
        let cancelled = false;
        fetch(url)
            .then(response => response.json())
            .then(data => {
            if (!cancelled) {
                setState({ data, loading: false, error: null });
            }
        })
            .catch(error => {
            if (!cancelled) {
                setState({ data: null, loading: false, error });
            }
        });
        return () => {
            cancelled = true;
        };
    }, [url]);
    return state;
}
//# sourceMappingURL=useFetch.js.map