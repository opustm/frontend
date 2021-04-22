import axios from 'axios';

// Change API Url based on whether API Server is remote or local
// Configure API interaction preferences
export const API_CONFIG = {
  useLocal: false, // Change this to true to use API locally
  urlRemote: 'https://opustm-api-staging.herokuapp.com/',
  urlLocal: 'http://localhost:8000/',
  baseURL: () =>
    API_CONFIG.useLocal ? API_CONFIG.urlLocal : API_CONFIG.urlRemote,
  responseType: 'json',
  timeout: 1000
};

// Configure and export Axios instance
export const Axios = axios.create({
  baseURL: API_CONFIG.baseURL(),
  responseType: API_CONFIG.responseType
});

// Configure and export API Endpoints
export const API_ENDPOINTS = {
  teams: {
    fetchAll: () => `/teams/`,
    fetchById: teamID => `/teams/${teamID}/`,
    fetchMembers: teamID => `/teams/${teamID}/members/`
  },
  user: {
    fetchAll: () => `/users/`,
    fetchById: userID => `users/${userID}/`,
    fetchTeams: userID => `/users/${userID}/teams/`,
    fetchContacts: userID => `/users/${userID}/contacts/`
  },
  event: {
    fetchAll: () => `/events/`,
    fetchById: eventID => `/events/${eventID}/`,
    fetchByTeam: teamID => `/events/team/${teamID}/`,
    fetchByUser: userID => `/events/user/${userID}/`
  },
  announcement: {
    fetchAll: () => `/announcements/`,
    fetchById: announcementID => `/announcements/${announcementID}/`,
    fetchByTeam: teamID => `/announcements/team/${teamID}/`,
    fetchByUser: userID => `/announcements/user/${userID}`
  }
};
