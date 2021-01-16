import { Axios as api, API_ENDPOINTS as urls } from '../../services/api.service';

export async function widgetDetails(widgetType, userInfo) {
  switch(widgetType){
    case 'announcements':
      let announcementData = await getData(userInfo, 'announcements');
      return ({
        title: 'Announcements',
        description: 'View your announcements',
        data: announcementData
      });

    case 'calendar':
      let calendarData = await getData(userInfo, 'calendar');
      return ({
        title: 'Calendar',
        description: 'View your upcoming events',
        data: calendarData
      });

    case 'contacts':
      let contactData = await getData(userInfo, 'contacts');
      return ({
        title: 'Contacts',
        description: 'View your contacts',
        data: contactData
      });

    case 'teams':
      let teamData = await getData(userInfo, 'teams');
      return ({
        title: 'Teams',
        description: 'View your teams',
        data: teamData
      });

    default:
      return '';
  }
}

async function getData(userInfo, type) {
  let userTeams = userInfo.cliques;
  let data = [];
  for (let teamId of userTeams) {
    let teamNameRequest;
    let teamName;
    switch(type) {
      case 'announcements':
        teamNameRequest = await api.get(urls.teams.fetchById(teamId));
        teamName = teamNameRequest.data.name;
        let announcementReq = await api.get(urls.announcement.fetchByTeam(teamName));
        data = data.concat(announcementReq.data);
        break;
      case 'calendar':
        teamNameRequest = await api.get(urls.teams.fetchById(teamId));
        teamName = teamNameRequest.data.name;
        let calendarRequest = await api.get(urls.event.fetchByTeam(teamName));
        data = data.concat(calendarRequest.data);
        break;
      case 'contacts':
        let contactsRequest = await api.get(urls.teams.fetchMembersById(teamId));
        let filteredContacts = contactsRequest.data.filter((contact) => {return contact.id !== userInfo.id;});
        data = data.concat(filteredContacts);
        break;
      case 'teams':
        let teamsRequest = await api.get(urls.teams.fetchById(teamId));
        data = data.concat(teamsRequest.data);
        break;
      default:
        break;
    }
  }
  let truncatedData = data.slice(0,3);
  let displayData = [];
  truncatedData.forEach((item) => {
    switch(type){
      case 'announcements':
        displayData.push(`From user ${item.creator}: ${item.announcement}`);
        break;
      case 'calendar':
        displayData.push(`${item.name} happening on ${item.start}`);
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
  });
  return displayData;
}