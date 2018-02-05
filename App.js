import React from 'react';
import { StyleSheet, Text, View, Animated, Dimensions } from 'react-native';

import Bubble from './Bubble';

const randomCoords = index => {
  const windowDimensions = Dimensions.get('window');
  const x = Math.floor(
    Math.random() *
      (windowDimensions.width - 100 - windowDimensions.width * index) +
      windowDimensions.width * index
  );
  const y = Math.floor(Math.random() * (windowDimensions.height - 100));
  return { x, y };
};

const bubbleCoords = [randomCoords(0), randomCoords(0.33), randomCoords(0.66)];

class Coords {
  constructor() {
    this.originals = [...bubbleCoords];
    this.coords = bubbleCoords;
  }
  get(i) {
    return this.coords[i];
  }
  set(i, val) {
    this.coords[i] = val;
  }
}

const coords = new Coords();

export default class App extends React.Component {
  state = {
    collisionMap: null,
  };
  handleCollide = (indexes, x, y) => {
    if (indexes !== null) {
      this.setState({
        collisionMap: {
          indexes: indexes,
          x,
          y,
        },
      });
    } else if (this.state.collisionMap !== null) {
      this.setState({
        collisionMap: null,
      });
    }
  };
  render() {
    return (
      <View style={styles.container}>
        <Bubble
          color="#ff0055"
          collisionMap={this.state.collisionMap}
          coords={coords}
          index={0}
          onCollide={this.handleCollide}
        />
        <Bubble
          color="#00ff55"
          collisionMap={this.state.collisionMap}
          coords={coords}
          index={1}
          onCollide={this.handleCollide}
        />
        <Bubble
          color="#0055ff"
          collisionMap={this.state.collisionMap}
          coords={coords}
          index={2}
          onCollide={this.handleCollide}
        />
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
});
