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
    }
  }

  static navigationOptions = {
    title: 'Basketball RPG'
  }

  players = [];
  teams = [];
  turnIndex = 0;
  turnDirection = "down";

  generatePlayers() {
    for (let i = 0; i < 20; i++) {
      let player = {};
      player.name = chance.bool() ? chance.name() : chance.first() + " " + chance.last();

      player.ability = 70 + chance.integer({ min: -10, max: 10 });
      chance.bool() ? player.ability += chance.integer({ min: -10, max: 19 }) : null;

      player.potential = player.ability + chance.integer({min: 50 - player.ability, max: 99 - player.ability})
      console.log(player.ability + "/" + player.potential)

      this.players.push(player);
    }
    this.displayPlayers();
  }

  displayPlayers() {
    this.players.sort((a, b) => {
      return (b.ability + b.potential/2) - (a.ability + a.potential/2);
    });

    let playersDisplay = "";
    for (let i = 0; i < this.players.length; i++) {
      playersDisplay += this.players[i].ability + " " + this.players[i].name + "\n";
    }

    this.setState({playersDisplay: playersDisplay})
  }

  generateTeams() {
    for (let i = 0; i < 2; i++) {
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
          display += "\n" + this.teams[i].players[j].ability + " " + this.teams[i].players[j].name;
        }
      }

      teamDisplayStrings.push(display);
    }

    this.setState({teamDisplay1: teamDisplayStrings[0]});
    this.setState({teamDisplay2: teamDisplayStrings[1]});
  }

  draftPlayers() {
    let draftedPlayer = this.players.shift();
    this.teams[this.turnIndex].players.push(draftedPlayer)

    if (this.turnDirection == "down") {
      this.turnIndex == this.teams.length - 1 ? this.turnDirection = "up" : this.turnIndex += 1;
    } else if (this.turnDirection == "up") {
      this.turnIndex == 0 ? this.turnDirection = "down" : this.turnIndex -= 1;
    }

    this.displayPlayers()
    this.displayTeams()
  }

  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <Button
            onPress={() => this.generatePlayers()}
            title="generate players"
            ></Button>
          <Text>{this.state.playersDisplay}</Text>
          <Button
            onPress={() => this.generateTeams()}
            title="generate teams"
            ></Button>
          <Button
            onPress={() => this.draftPlayers()}
            title="draft"
            ></Button>
        </View>
        <View style={styles.containerH}>
          <View style={styles.centerChildren}>
            <Text>{this.state.teamDisplay1}</Text>
          </View>
          <View>
            <Text>{this.state.teamDisplay2}</Text>
          </View>
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
