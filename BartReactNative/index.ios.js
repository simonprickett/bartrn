/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  ListView,
  TouchableHighlight,
  Text,
  TextInput,
  View,
  Image
} = React;

var API_BASE_URL = 'http://bart.crudworks.org/api/';
var STATION_REQUEST_URL = API_BASE_URL + 'stations';
var STATUS_REQUEST_URL = API_BASE_URL + 'status';
var SERVICE_ANNOUNCEMENTS_URL = API_BASE_URL + 'serviceAnnouncements';

var BartReactNative = React.createClass({
  getInitialState: function() {
    return {
      selectedTab: 'departures',
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
      }),
      systemStatus: { 
        traincount: '?',
        time: '?'
      },
      serviceAnnouncements: {
        bsa: {
          description: '?'
        }
      },
      loaded: false
    }
  },

  componentDidMount: function() {
    this.fetchData();
  },

  fetchData: function() {
    fetch(STATION_REQUEST_URL)
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(responseData),
          loaded: true
        });
      })
      .done();

    // TODO change to using a proper bsa call to determine no issues!
    fetch(STATUS_REQUEST_URL)
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({
          systemStatus: responseData
        });
        console.log(responseData);
      })
      .done();

    fetch(SERVICE_ANNOUNCEMENTS_URL)
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({
          serviceAnnouncements: responseData
        });
        console.log(responseData);
      })
  },

  // TODO tidy up time formatting rendering!
  render: function() {
    if (! this.state.loaded) {
      return this.renderLoadingView();
    }
    return (
      <View style={styles.pageView}>
        <View style={styles.headerImageView}>
          <Image 
            style={styles.headerImage}
            source={require('image!header')}
          />
          <Text style={styles.systemStatus}>{this.state.systemStatus.time.replace('PDT', '').replace('PST', '').replace(' ', '').replace(':00AM', 'AM').replace(':00PM', 'PM').trim()}: {this.state.systemStatus.traincount} trains operating. {this.state.serviceAnnouncements.bsa.description}</Text>
        </View>
        <View style={styles.stationListContainer}>
          <Text style={styles.textHeader}>BART Departures</Text>
          <View style={styles.stationFilter}>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              clearButtonMode="always"
              placeholder="Filter..."
              value=""
              style={styles.filterTextInput}
              onChangeText={this.searchText.bind(this)}
            />
          </View>
          <ListView
            dataSource = {this.state.dataSource}
            renderRow = {this.renderStation}
            style = {styles.listView}
          />
          <View style={styles.footerView}>
            <Text style={styles.textFooter}>React Native Demo by Simon Prickett</Text>
          </View>
        </View>
      </View>
    );
  },

  renderLoadingView: function() {
    return (
      <View style={styles.container}>
        <Text>
          Loading stations...
        </Text>
      </View>
    );
  },

  renderStation: function(station, sectionId, rowId) {
    return (
      <TouchableHighlight onPress={() => this.pressRow(rowId)}>
        <View style={styles.container}>
          <View style={styles.stationListContainer}>
            <Text style={styles.stationListItem}>{station.name}</Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  },

  searchText: function(text) {
    console.log(text);
  },

  pressRow: function(rowId) {
    console.log('hi from ' + rowId);
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },

  pageView: {
    flex: 1,
    backgroundColor: '#000000'
  },

  stationListContainer: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#F5FCFF'
  },

  stationListItem: {
    fontSize: 20,
    textAlign: 'left',
    borderColor: '#cccccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    marginTop: 5
  },

  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  listView: {
    paddingTop: 5,
    backgroundColor: '#F5FCFF',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#cccccc',
    margin: 5
  },
  stationFilter: {
    backgroundColor: '#eeeeee',
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
    marginLeft: 5,
    marginRight: 5
  },
  filterTextInput: {
    backgroundColor: 'white',
    borderColor: '#cccccc',
    borderRadius: 3,
    borderWidth: 1,
    height: 30,
    paddingLeft: 8
  },
  textHeader: {
    paddingTop: 0,
    fontSize: 25,
    textAlign: 'left',
    margin: 5
  },
  headerImageView: {
    marginTop: 20,
    marginLeft: 10,
    marginRight: 10
  },
  headerImage: {
    width: 355,
    height: 30
  },
  textFooter: {
    color: '#ffffff',
    backgroundColor: '#000000',
    textAlign: 'center',
    fontSize: 15
  },
  footerView: {
    paddingTop: 5,
    paddingBottom: 5,
    backgroundColor: '#000000',
  },
  systemStatus: {
    backgroundColor: '#000000',
    color: '#ffffff',
    textAlign: 'left',
    marginBottom: 3,
    marginTop: 3
  }
});

AppRegistry.registerComponent('BartReactNative', () => BartReactNative);
