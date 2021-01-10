export function widgetDetails(widgetType) {
  switch(widgetType){
    case 'announcements':
      return ({
        title: 'Announcements',
        description: 'Announcements description'
      });

    case 'calendar':
      return ({
        title: 'Calendar',
        description: 'Calendar description'
      });

    case 'contacts':
      return ({
        title: 'Contacts',
        description: 'Contacts description'
      });

    case 'teams':
      return ({
        title: 'Teams',
        description: 'Teams description'
      });

    default:
      return '';
  }

}