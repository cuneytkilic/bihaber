import {createDrawerNavigator} from 'react-navigation-drawer';
import {createBottomTabNavigator} from 'react-navigation-tabs';

import Tab1 from '../components/Sekmeler/TabOne';
import Tab2 from '../components/Sekmeler/TabTwo';
import Tab3 from '../components/Sekmeler/TabThree';

const Tab = createBottomTabNavigator(
  {
    Tab1: Tab1,
    Tab2: Tab2,
    Tab3: Tab3,
  },
  {
    tabBarOptions: {
      activeTintColor: 'white',
      inactiveTintColor: '#212126',
      showIcon: true,
      activeBackgroundColor: '#3E53AE',
      inactiveBackgroundColor: '#afaded',
    },
  },
);

const DrawerNavigation = createDrawerNavigator({
  Home: {
    screen: Tab,
    //Add can more screen
  },
});
export default DrawerNavigation;
