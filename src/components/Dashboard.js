import React from 'react';
import styles from '../styles/styles';
import { Tabs, Tab, TabPanel, TabList } from 'react-web-tabs';
import Token from './Dashboard/Token';
import Revenue from './Dashboard/Revenue';
import Vehicles from './Dashboard/Vehicles';
import Details from './Dashboard/Details';
import i18n from '../i18n';
//import Language from "./Language";
import Trips from './Dashboard/Trips';
import { withRouter } from 'react-router-dom';
import Container from './Ui/Container';
import Rev from '../assets/images/revenue,svg.svg';
import Home from '../assets/images/home.svg';
import TokenLogo from '../assets/images/token.svg';
import VehicleLogo from '../assets/images/vehicles.svg';
import TripsLogo from '../assets/images/trips.svg';
//import LangSwitch from './LanguageSwitch';

class Dashboard extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      balance: 0,
      tabId: 'basic-tab-3'
    };
    i18n.changeLanguage('en'); //TODO: Remove temp lang
  }

  componentWillMount() {
    let token = localStorage.getItem('token');
    if (!token) {
      this.props.history.push('/login');
    }
  }

  // We are managing styles this way to keep them inlined for inclusion into other sites witout conflicts or additional files needed
  getStyle = tabId => {
    if (tabId === this.state.tabId.replace('basic-tab-', '') * 1) {
      return styles.tabSelected;
    }
    return styles.tab;
  };

  render() {
    return (
      <div>
        {/* <Language></Language> 
        <h2 style={styles.titleStyle}> {i18n.t('Dashboard')} </h2>
        */}
        {/* <LangSwitch /> */}
        <Tabs
          defaultTab='basic-tab-3'
          onChange={tabId => this.setState({ tabId: tabId })}
        >
          <TabList
            style={{
              display: 'flex',
              justifyContent: 'center',
              backgroundColor: '#2E283B'
            }}
          >
            <Tab tabFor='basic-tab-3' style={this.getStyle(3)}>
              <img
                className='navlogos'
                src={Rev}
                alt='revnue tab eloop one token'
              />
              {i18n.t('Revenue')}
            </Tab>
            <Tab tabFor='basic-tab-2' style={this.getStyle(2)}>
              <img
                className='navlogos'
                src={TokenLogo}
                alt=' eloop one token logo'
              />
              {i18n.t('Tokens')}
            </Tab>
            <Tab tabFor='basic-tab-4' style={this.getStyle(4)}>
              <img
                className='navlogos'
                src={VehicleLogo}
                alt=' eloop one vehicle logo'
              />
              {i18n.t('Vehicle')}
            </Tab>
            <Tab tabFor='basic-tab-5' style={this.getStyle(5)}>
              <img
                className='navlogos'
                src={TripsLogo}
                alt=' eloop one trips logo'
              />
              {i18n.t('Trips')}
            </Tab>
            <Tab tabFor='basic-tab-1' style={this.getStyle(1)}>
              <img
                className='navlogos'
                src={Home}
                alt='revnue tab eloop one token'
              />
              {i18n.t('Details')}
            </Tab>
          </TabList>
          <TabPanel tabId='basic-tab-3' style={styles.tabPanel}>
            <Revenue></Revenue>
          </TabPanel>
          <TabPanel tabId='basic-tab-2' style={styles.tabPanel}>
            <Container>
              <Token></Token>
            </Container>
          </TabPanel>
          <TabPanel tabId='basic-tab-4' style={styles.tabPanel}>
            <Container>
              <Vehicles></Vehicles>
            </Container>
          </TabPanel>
          <TabPanel tabId='basic-tab-5' style={styles.tabPanel}>
            <Container>
              <Trips></Trips>
            </Container>
          </TabPanel>
          <TabPanel tabId='basic-tab-1' style={styles.tabPanel}>
            <Container>
              <Details />
            </Container>
          </TabPanel>
        </Tabs>
      </div>
    );
  }
}

export default withRouter(Dashboard);
