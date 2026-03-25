"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
// --- 2. TrendsDefinitions Component Class Definition ---
// We extend React.Component and provide our Props and State interfaces
class TrendsDefinitions extends react_1.default.Component {
    constructor(props) {
        super(props);
        // --- 3. Class Method as an Arrow Function for 'this' context ---
        // Using an arrow function here automatically binds 'this' to the component instance,
        // avoiding the need for `const that = this;` inside the fetch promises.
        this.queryCount = () => {
            this.setState({
                isSearching: true,
                searchTime: new Date().getTime(),
                error: undefined, // Clear previous error states
                errorObj: undefined
            });
            fetch('/api/stats/dictionarydefinition')
                .then((response) => {
                if (!response.ok) {
                    // Handle HTTP errors (e.g., 404, 500)
                    return response.text().then(text => {
                        throw new Error(`HTTP error! status: ${response.status}, message: ${text}`);
                    });
                }
                return response.json();
            })
                .then((data) => {
                // Ensure data is a number, as toLocaleString expects it.
                // A simple runtime check can prevent issues if the API returns something unexpected.
                if (typeof data !== 'number') {
                    console.error('API returned non-numeric data for definition count:', data);
                    throw new Error('Invalid data format received from API');
                }
                this.setState({
                    isSearching: false,
                    rows: data
                });
            })
                .catch((error) => {
                console.error("Error fetching dictionary definitions count:", error);
                this.setState({
                    isSearching: false,
                    error: true,
                    errorObj: error
                });
            });
        };
        this.state = {
            rows: 36000, // Initial default value
            isSearching: false
        };
    }
    // Lifecycle method: fetches data after the component mounts
    componentDidMount() {
        this.queryCount();
    }
    /*
    queryCount() {
        this.setState({
            isSearching: true,
            searchTime: new Date().getTime(),
        });

        const that = this;

        fetch('/api/stats/dictionarydefinition')
            .then((response) => response.json())
            .then (data => {
                that.setState({
                    isSearching: false,
                    rows: data
                })
            })
            .catch((error) => {
                that.setState({
                    isSearching: false,
                    error: true,
                    errorObj: error
                })
              })
    }

    render() {
        return(
            <div>
              {this.state.rows.toLocaleString()}
            </div>
        );

    }
    */
    // --- 4. Render Method ---
    render() {
        return (react_1.default.createElement("div", null, this.state.rows.toLocaleString()));
    }
}
exports.default = TrendsDefinitions;
