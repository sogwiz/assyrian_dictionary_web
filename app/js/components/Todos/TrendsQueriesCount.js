"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
class TrendsQueriesCount extends react_1.default.Component {
    constructor(props) {
        super(props);
        // --- 3. Class Method as an Arrow Function for 'this' context ---
        // Using an arrow function here automatically binds 'this' to the component instance.
        this.queryCount = () => {
            this.setState({
                isSearching: true,
                searchTime: new Date().getTime(),
                error: undefined, // Clear any previous error state
                errorObj: undefined,
                rows: [] // Clear rows on new search start
            });
            fetch('/api/stats/queries')
                .then((response) => {
                if (!response.ok) {
                    // Handle non-successful HTTP responses
                    return response.text().then(text => {
                        throw new Error(`HTTP error! status: ${response.status}, message: ${text}`);
                    });
                }
                return response.json();
            })
                .then((data) => {
                // Basic runtime validation for the expected data structure
                if (!Array.isArray(data) || (data.length > 0 && typeof data[0].count !== 'number')) {
                    console.error('API returned data in an unexpected format:', data);
                    throw new Error('Invalid data format received from API');
                }
                this.setState({
                    isSearching: false,
                    rows: data
                });
            })
                .catch((error) => {
                console.error("Error fetching queries count:", error);
                this.setState({
                    isSearching: false,
                    error: true,
                    errorObj: error,
                    rows: [] // Ensure rows is empty on error
                });
            });
        };
        this.state = {
            rows: [], // Initial state is an empty array
            isSearching: false
        };
    }
    // Lifecycle method: fetches data after the component mounts
    componentDidMount() {
        this.queryCount();
    }
    // --- 4. Render Method ---
    render() {
        // Determine the value to display.
        // If rows is empty, use default 558000, otherwise use the count from the first item.
        const value = this.state.rows.length === 0 ? 558000 : this.state.rows[0].count;
        // We explicitly type 'value' as 'number' for clarity, though TypeScript would infer it.
        return (react_1.default.createElement("div", null, value.toLocaleString()));
    }
}
exports.default = TrendsQueriesCount;
