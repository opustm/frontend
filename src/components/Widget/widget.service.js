import { Axios as api, API_ENDPOINTS as urls } from '../../services/api.service';
import { getContacts } from '../../services/contacts.service';
import * as Icon from 'react-icons/fi';

export async function widgetDetails(widgetType, userInfo, teamFilter) {
  switch(widgetType){
    case 'announcements':
      let announcementData = await getData(userInfo, 'announcements', teamFilter);
      return ({
        title: 'Announcements',
        description: 'View your announcements',
        icon: <Icon.FiRss style={{marginTop: '-5px'}}/>,
        data: announcementData
      });

    case 'calendar':
      let calendarData = await getData(userInfo, 'calendar', teamFilter);
      return ({
        title: 'Calendar',
        description: 'View your upcoming events',
        icon: <Icon.FiCalendar style={{marginTop: '-5px'}}/>,
        data: calendarData
      });

    case 'contacts':
      let contactData = await getData(userInfo, 'contacts', teamFilter);
      return ({
        title: 'Contacts',
        description: 'View your contacts',
        icon: <Icon.FiBook style={{marginTop: '-5px'}}/>,
        data: contactData
      });

    case 'teams':
      let teamData = await getData(userInfo, 'teams', teamFilter);
      return ({
        title: 'Teams',
        description: 'View your teams',
        icon: <Icon.FiTarget style={{marginTop: '-5px'}}/>,
        data: teamData
      });

    default:
      return '';
  }
}

async function getData(userInfo, type, teamFilter) {
  let userTeams = userInfo.cliques;
  let data = [];
  let teamNameRequest;
  let teamName;
  switch(type) {
    case 'announcements':
      if (teamFilter) {
        let announcementReq = await api.get(urls.announcement.fetchByTeam(teamFilter));
        data = data.concat(announcementReq.data);
      }
      else {
        for (let teamId of userTeams) {
          teamNameRequest = await api.get(urls.teams.fetchById(teamId));
          teamName = teamNameRequest.data.name;
          let announcementReq = await api.get(urls.announcement.fetchByTeam(teamName));
          data = data.concat(announcementReq.data);
        }
      }
      break;

    case 'calendar':
      if (teamFilter) {
        let calendarRequest = await api.get(urls.event.fetchByTeam(teamFilter));
        data = data.concat(calendarRequest.data);
      }
      else {
        for (let teamId of userTeams) {
          teamNameRequest = await api.get(urls.teams.fetchById(teamId));
          teamName = teamNameRequest.data.name;
          let calendarRequest = await api.get(urls.event.fetchByTeam(teamName));
          data = data.concat(calendarRequest.data);
        }
      }
      break;

    case 'contacts':
      if (teamFilter) {
        let contactsRequest = await api.get(urls.teams.fetchMembers(teamFilter));
        data = data.concat(contactsRequest.data);
      }
      else {
          data = await getContacts(userInfo);
      }
      break;

    case 'teams':
      for (let teamId of userTeams) {
        let teamsRequest = await api.get(urls.teams.fetchById(teamId));
        data = data.concat(teamsRequest.data);
      }
      break;

    default:
      break;
  }
  
  let truncatedData = data.slice(0,3);
  let displayData = [];
  for (let item of truncatedData) {
    switch(type){
      case 'announcements':
        let creatorReq = await api.get(urls.user.fetchById(item.creator));
        let creatorName = `${creatorReq.data.first_name} ${creatorReq.data.last_name}`
        displayData.push(`From user ${creatorName}: '${item.announcement}'`);
        break;
      case 'calendar':
        displayData.push(`'${item.name}' happening on ${item.start}`);
        break;
      case 'contacts':
        displayData.push(`${item.first_name} ${item.last_name}`);
        break;
      case 'teams':
        displayData.push(`${item.name}`);
        break;
      default:
        break;
    }
  };
  return displayData;
}