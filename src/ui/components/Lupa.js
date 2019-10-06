/**
 * Lupa - Preventative Health Care
 * @author Elijah Hampton
 * @date August  22, 2019
 * 
 * Lupa App
 */
import React, { Component } from "react";

import {
  StyleSheet,
} from "react-native";

import WorkoutView from './MainViews/WorkoutView';
import SearchView from './MainViews/search/SearchView';
import PackView from './MainViews/Packs/PackView';

import Swiper from 'react-native-swiper';

import TrainerDashboardContainer from './Navigators/TrainerTabBarComponent';

class Lupa extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currIndex: 1,
    }
  }

  render() {
    const currIndex = this.state.currIndex;
    return (
      <Swiper style={styles.appContainer}
          loop={false}
          showButtons={false}
          showsPagination={false}
          index={currIndex}>
        <TrainerDashboardContainer />
        <WorkoutView />
        <PackView />
        <SearchView />
      </Swiper>
    );
  }
}


const styles = StyleSheet.create({
  appContainer: {
    display: 'flex'
  }
});

export default Lupa;
