import React from 'react'

// --- 1. Define Interfaces for Props and State ---

/**
 * Defines the shape of the props for the TrendsDefinitions component.
 * This component doesn't seem to receive any props, so it's an empty interface.
 */
interface TrendsDefinitionsProps {}

/**
 * Defines the shape of the state for the TrendsDefinitions component.
 */
interface TrendsDefinitionsState {
    rows: number;
    isSearching: boolean;
    searchTime?: number; // Optional, as it's only set after a fetch initiates
    error?: boolean; // Optional, only present if an error occurs
    errorObj?: Error; // Optional, only present if an error object is caught
  }

// --- 2. TrendsDefinitions Component Class Definition ---

// We extend React.Component and provide our Props and State interfaces
class TrendsDefinitions extends React.Component<TrendsDefinitionsProps, TrendsDefinitionsState> {
    constructor(props: TrendsDefinitionsProps) {
        super(props);
    
        this.state = {
          rows: 36000, // Initial default value
          isSearching: false
        };
    
    }

    // Lifecycle method: fetches data after the component mounts
    componentDidMount(): void {
        this.queryCount();
    }
    // --- 3. Class Method as an Arrow Function for 'this' context ---
    // Using an arrow function here automatically binds 'this' to the component instance,
    // avoiding the need for `const that = this;` inside the fetch promises.
    queryCount = (): void => {
        this.setState({
          isSearching: true,
          searchTime: new Date().getTime(),
          error: undefined, // Clear previous error states
          errorObj: undefined
        });
    
        fetch('/api/stats/dictionarydefinition')
          .then((response: Response) => {
            if (!response.ok) {
              // Handle HTTP errors (e.g., 404, 500)
              return response.text().then(text => {
                throw new Error(`HTTP error! status: ${response.status}, message: ${text}`);
              });
            }
            return response.json();
          })
          .then((data: number) => { // Expecting 'data' to be a number (the count)
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
          .catch((error: Error) => { // Type the caught error as a standard JavaScript Error
            console.error("Error fetching dictionary definitions count:", error);
            this.setState({
              isSearching: false,
              error: true,
              errorObj: error
            });
          });
      };
    
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
  render(): React.ReactNode {
    return (
      <div>
        {/* Safely display rows, ensuring it's a number for toLocaleString() */}
        {this.state.rows.toLocaleString()}
      </div>
    );
  }
}
    export default TrendsDefinitions