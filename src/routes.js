import React from 'react';
import { Image } from 'react-native';
import { createAppContainer, cretaeStackNavigation } from 'react-navigation';

import logo from './assets/instagram.png';

import Feed from './pages/Feed';

const Routes = createAppContainer(
  cretaeStackNavigation({
    Feed
  }, {
    headerLayoutPreset: 'center',
    defaultNavigationOptions: {
      headerTitle: <Image source={logo} />,
      headerStyle: {
        backgroundColor: '#f5f5f5'
      },
    },
  })
);

export default Routes;