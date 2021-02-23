import axios from "axios";

// Change API Url based on whether API Server is remote or local
// Configure API interaction preferences
export const API_CONFIG = {
    useLocal : true, // Change this to true to use API locally
    urlRemote : "https://opustm-api-staging.herokuapp.com/",
    urlLocal : 'http://localhost:8000/',
    baseURL : () => API_CONFIG.useLocal ? 
        API_CONFIG.urlLocal : API_CONFIG.urlRemote,
    responseType : "json",
    timeout : 1000,
}

// Configure and export Axios instance
export const Axios = axios.create({
    baseURL: API_CONFIG.baseURL(),
    responseType : API_CONFIG.responseType,
});

// Configure and export API Endpoints
export const API_ENDPOINTS = {
    teams : {
        fetchAll: () => `/teams/`,
        fetchById: (teamID) => `/teams/${teamID}/`,
        fetchMembers : (teamID) => `/teams/${teamID}/members/`,
        fetchRelatedTeams: (teamName) => `/relatedCliques/${teamName}/`,
    },
    user : {
        fetchAll: () => `/users/`,
        fetchById: (userID) => `users/${userID}/`,
        fetchTeams: (userID) => `/users/${userID}/teams/`,
        fetchContacts: (userID) => `/users/${userID}/contacts/`,
        fetchSchedule: (userID) => `/users/${userID}/schedule/`
    },
    request : {
        fetchAll: () => `/requests/`,
        fetchById: (requestID) => `/requests/${requestID}/`,
        fetchByTeam: (teamID) => `/requests/team/${teamID}/`,
        fetchByUser: (userID) => `/requests/team/${userID}/`,
    },
    event : {
        fetchAll: () => `/events/`,
        fetchById : (eventID) => `/events/${eventID}/`,
        fetchByTeam: (teamID) => `/events/team/${teamID}/`,
        fetchByUser: (userID) => `/events/user/${userID}/`
    },
    announcement : {
        fetchAll: () => `/announcements/`,
        fetchById: (announcementID) => `/announcements/${announcementID}/`,
        fetchByTeam : (teamID) => `/announcements/team/${teamID}/`,
        fetchByUser: (userID) => `/announcements/user/${userID}`,
    },
    invitation : {
        fetchAll : () => `/invitations/`,
    },
    schedule : {},
    message : {},
    todo : {},
}

// Legacy: Do not use. Instead, use API_CONFIG.baseURL
export default function APIHost() {
    console.warn("Function APIHost is depreciated due to inconsistency. Use API_CONFIG.baseURL instead")
    return API_CONFIG.baseURL()
};
