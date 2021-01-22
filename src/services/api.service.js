import axios from "axios";

// Change APIHost based on whether API Server is remote or local
// Configure API interaction preferences
const API_CONFIG = {
    useLocal : false, // Change this to true to use API locally
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
        fetchAll : `/cliques/`,
        fetchById : (id) => `/cliques/${id}/`,
        fetchDetails : (name) => `/cliqueDetails/${name}/`,
        fetchMembers : (name) => `/cliqueMembers/${name}/`,
        fetchMembersById: (id) => `/cliqueidMembers/${id}/`,
        fetchByUsername: (username) => `/userCliques/${username}/`,
        fetchRelatedTeams: (teamName) => `/relatedCliques/${teamName}/`
    },
    user : {
        fetchAll: `/users/`,
        fetchByUsername: (username) => `userDetails/${username}/`,
        fetchById: (id) => `/users/${id}/`
    },
    invitation : {},
    request : {},
    event : {
        fetchAll: `/events/`,
        fetchById : (id) => `/events/${id}/`,
        fetchByTeam: (teamName) => `/cliqueEvents/${teamName}/`,
        fetchByUsername: (username) => `/userEvents/${username}/`
    },
    schedule : {},
    announcement : {
        fetchAll : `/announcements/`,
        fetchByTeam : (teamName) => `/cliqueAnnouncements/${teamName}/`,
        fetchById: (announcementId) => `/announcements/${announcementId}/`
    },
    message : {},
    todo : {},
}

// Legacy: Do not use. Instead, use API_CONFIG.baseURL
export default function APIHost() {return API_CONFIG.baseURL()};
