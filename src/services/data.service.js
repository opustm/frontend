// Default Method for Fetching Application Data 
// and Interacting with Local Storage
export const AppData = {
    user: () => localStorage.getItem('user'),
    token: () => localStorage.getItem('token'),
}