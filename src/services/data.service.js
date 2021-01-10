// Default Method for Fetching Application Data 
// and Interacting with Local Storage
const DataService = {
    user: () => localStorage.getItem('user'),
    token: () => localStorage.getItem('token'),
}

export default DataService;