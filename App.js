import React from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import { Chance } from 'chance';

chance = new Chance();

export class HomeScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      playersDisplay: '',
      teamDisplay1: '',
      teamDisplay2: '',
      teamDisplay3: '',
      teamDisplay4: '',
    }
  }

  static navigationOptions = {
    title: 'Basketball RPG'
  }

  players = [];
  playerId = 0;
  teams = [];
  turnIndex = 0;
  turnDirection = "down";

  startGame() {
    this.generatePlayers();
    this.generateTeams();
    this.populateTeams();
  }

  generatePlayers() {
    for (let i = 0; i < 20; i++) {
      let player = {};
      player.id = this.playerId;
      this.playerId += 1;

      player.name = chance.bool() ? chance.name() : chance.first() + " " + chance.last();

      player.offense = 70 + chance.integer({ min: -10, max: 10 });
      chance.bool() ? player.offense += chance.integer({ min: -10, max: 19 }) : null;

      player.defense = 70 + chance.integer({ min: -10, max: 10 });
      chance.bool() ? player.defense += chance.integer({ min: -10, max: 19 }) : null;

      player.overall = this.getPlayerOverall(player);

      player.potential = player.overall + chance.integer({min: 50 - player.overall, max: 99 - player.overall})

      player.value = this.getPlayerValue(player);
      console.log(player)

      this.players.push(player);
    }
    this.displayPlayers();
  }

  getPlayerOverall(player) {
    return Math.round((player.offense + player.defense) / 2);
  }

  getPlayerValue(player) {
    return Math.round((player.overall + player.potential) / 2);
  }

  displayPlayers() {
    this.players.sort((a, b) => {
      return (b.value) - (a.value);
    });

    let playersDisplay = "";
    for (let i = 0; i < this.players.length; i++) {
      playersDisplay += this.players[i].overall + " " + this.players[i].name + "\n";
    }

    this.setState({playersDisplay: playersDisplay})
  }

  generateTeams() {
    for (let i = 0; i < 4; i++) {
      let team = {};
      let name = chance.animal();
      name.slice(-1) != "s" ? name += "s" : null;
      team.name = name;
      team.players = [];
      this.teams.push(team)
    }
    this.displayTeams();
  }

  displayTeams() {
    let teamDisplayStrings = [];

    for (let i = 0; i < this.teams.length; i++) {
      let display = this.teams[i].name;

      if (this.teams[i].players) {
        for (let j = 0; j < this.teams[i].players.length; j++) {
          display += "\n" + this.teams[i].players[j].overall + " " + this.teams[i].players[j].name;
        }
      }

      teamDisplayStrings.push(display);
    }

    this.setState({teamDisplay1: teamDisplayStrings[0]});
    this.setState({teamDisplay2: teamDisplayStrings[1]});
    this.setState({teamDisplay3: teamDisplayStrings[2]});
    this.setState({teamDisplay4: teamDisplayStrings[3]});
  }

  populateTeams() {
    let playersAmount = this.players.length;
    for (let i = 0; i < playersAmount; i++) {
      let draftedPlayer = this.players.shift();
      this.teams[this.turnIndex].players.push(draftedPlayer);
      this.teams[this.turnIndex].players.sort((a, b) => {
        return b.overall - a.overall;
      });

      if (this.turnDirection == "down") {
        this.turnIndex == this.teams.length - 1 ? this.turnDirection = "up" : this.turnIndex += 1;
      } else if (this.turnDirection == "up") {
        this.turnIndex == 0 ? this.turnDirection = "down" : this.turnIndex -= 1;
      }
    }

    this.displayPlayers();
    this.displayTeams();
  }

  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <Button
            onPress={() => this.startGame()}
            title="generate league"
            ></Button>
        </View>
        <View style={styles.container}>
          <Text>{this.state.teamDisplay1}</Text>
        </View>
        <View style={styles.container}>
          <Text>{this.state.teamDisplay2}</Text>
        </View>
        <View style={styles.container}>
          <Text>{this.state.teamDisplay3}</Text>
        </View>
        <View style={styles.container}>
          <Text>{this.state.teamDisplay4}</Text>
        </View>
      </ScrollView>
    );
  }
}

export class TestScreen extends React.Component {
  static navigationOptions = {
    title: 'Test Screen'
  }
  render() {
    return (
      <View style={styles.container}>
        <Text>works!</Text>
        <Button
          onPress={() => this.props.navigation.navigate('Home')}
          title="Go Back"
          ></Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerH: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    justifyContent: 'space-evenly',
  },
  centerChildren: {
    justifyContent: 'center'
  }
});

const RootStack = createStackNavigator({
  Home: HomeScreen,
  Test: TestScreen,
},
{
  initialRouteName: 'Home',
});

export default class App extends React.Component {
  render() {
    return <RootStack/>;
  }
}
