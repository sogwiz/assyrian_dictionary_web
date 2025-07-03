import React from 'react'

// --- 1. Define Interfaces for Props and State ---

/**
 * Defines the shape of the props for the TrendsQueriesCount component.
 * This component doesn't receive any specific props, so it's an empty interface.
 */
interface TrendsQueriesCountProps {}

/**
 * Defines the structure of a single query count item expected from the API.
 */
interface QueryCountItem {
  _id: number;
  count: number;
  // If there are other properties in the objects within the 'rows' array, add them here.
  // For example: id: string; timestamp: string;
}

/**
 * Defines the shape of the state for the TrendsQueriesCount component.
 */
interface TrendsQueriesCountState {
  rows: QueryCountItem[]; // 'rows' is an array of QueryCountItem objects
  isSearching: boolean;
  searchTime?: number; // Optional, set when search begins
  error?: boolean; // Optional, present only if an error occurs
  errorObj?: Error; // Optional, present if an error object is caught
}

class TrendsQueriesCount extends React.Component<TrendsQueriesCountProps, TrendsQueriesCountState> {
    constructor(props: TrendsQueriesCountProps) {
        super(props);
    
        this.state = {
          rows: [], // Initial state is an empty array
          isSearching: false
        };
    }

  // Lifecycle method: fetches data after the component mounts
  componentDidMount(): void {
    this.queryCount();
  }

  // --- 3. Class Method as an Arrow Function for 'this' context ---
  // Using an arrow function here automatically binds 'this' to the component instance.
  queryCount = (): void => {
    this.setState({
      isSearching: true,
      searchTime: new Date().getTime(),
      error: undefined, // Clear any previous error state
      errorObj: undefined,
      rows: [] // Clear rows on new search start
    });

    fetch('/api/stats/queries')
      .then((response: Response) => {
        if (!response.ok) {
          // Handle non-successful HTTP responses
          return response.text().then(text => {
            throw new Error(`HTTP error! status: ${response.status}, message: ${text}`);
          });
        }
        return response.json();
      })
      .then((data: QueryCountItem[]) => { // Expecting 'data' to be an array of QueryCountItem
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
      .catch((error: Error) => { // Type the caught error as a standard JavaScript Error
        console.error("Error fetching queries count:", error);
        this.setState({
          isSearching: false,
          error: true,
          errorObj: error,
          rows: [] // Ensure rows is empty on error
        });
      });
  };

  // --- 4. Render Method ---
  render(): React.ReactNode {
    // Determine the value to display.
    // If rows is empty, use default 558000, otherwise use the count from the first item.
    const value: number = this.state.rows.length === 0 ? 558000 : this.state.rows[0].count;
    // We explicitly type 'value' as 'number' for clarity, though TypeScript would infer it.

    return (
      <div>
        {/* Safely display the value, using toLocaleString for number formatting */}
        {value.toLocaleString()}
      </div>
    );
  }
}
    export default TrendsQueriesCount