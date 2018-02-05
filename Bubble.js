import React from 'react';
import { StyleSheet, Text, View, Animated, PanResponder } from 'react-native';

function collision(p1x, p1y, r1, p2x, p2y, r2) {
  var a;
  var x;
  var y;

  a = r1 + r2;
  x = p1x - p2x;
  y = p1y - p2y;

  if (a > Math.sqrt(x * x + y * y)) {
    return true;
  } else {
    return false;
  }
}

export default class Bubble extends React.Component {
  state = {
    moving: false,
  };
  popped: false;
  componentWillMount() {
    this._animatedValue = new Animated.ValueXY();
    this._value = { x: 0, y: 0 };

    this._animatedValue.addListener(value => (this._value = value));
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderGrant: (e, gestureState) => {
        this._animatedValue.setOffset({ x: this._value.x, y: this._value.y });
        this._animatedValue.setValue({ x: 0, y: 0 });
        this.setState({
          moving: true,
        });
      },
      onPanResponderMove: (e, gestureState) => {
        if (this.popped) {
          return;
        }
        this.props.coords.coords.map((coord, index) => {
          if (index !== this.props.index) {
            let p1x = this.props.coords.get(this.props.index).x + 50;
            let p1y = this.props.coords.get(this.props.index).y + 50;
            let p2x = this.props.coords.get(index).x + 50;
            let p2y = this.props.coords.get(index).y + 50;
            if (collision(p1x, p1y, 50, p2x, p2y, 50)) {
              const xDiff = p1x - p2x;
              const yDiff = p1y - p2y;

              const limit = Math.max(Math.abs(xDiff), Math.abs(yDiff));

              if (limit < 50) {
                alert('POP!');
                this.popped = true;
                return;
              }

              this.props.onCollide([this.props.index, index], xDiff, yDiff);
            } else {
              if (
                this.props.collisionMap &&
                this.props.collisionMap.indexes.indexOf(index) !== -1
              ) {
                this.props.onCollide(null);
              }
            }
          }
        });

        let x = this._animatedValue.x.__getValue();
        let y = this._animatedValue.y.__getValue();

        this.props.coords.set(this.props.index, {
          x: this.props.coords.originals[this.props.index].x + x,
          y: this.props.coords.originals[this.props.index].y + y,
        });

        Animated.event([
          null,
          { dx: this._animatedValue.x, dy: this._animatedValue.y },
        ])(e, gestureState);
      },
      onPanResponderRelease: () => {
        Animated.spring(this._animatedValue, {
          toValue: { x: 0, y: 0 },
        }).start(() => {
          this.popped = false;
        });
        this.props.onCollide(null);
        this.props.coords.set(this.props.index, {
          x: this.props.coords.originals[this.props.index].x,
          y: this.props.coords.originals[this.props.index].y,
        });

        this.setState({
          moving: false,
        });
      },
    });
  }
  getCollisionData() {
    if (this.props.collisionMap === null) {
      return {};
    } else {
      if (
        this.props.collisionMap.indexes &&
        this.props.collisionMap.indexes.indexOf(this.props.index) !== -1
      ) {
        let scaleY = 1 - (100 - Math.abs(this.props.collisionMap.y)) / 100;
        let scaleX = 1 - (100 - Math.abs(this.props.collisionMap.x)) / 100;
        return [scaleY > scaleX ? { scaleY } : { scaleX }];
      }
      return {};
    }
  }
  render() {
    return (
      <Animated.View
        style={[
          styles.bubble,
          {
            zIndex: this.state.moving === true ? 1000 : 0,
            backgroundColor: this.props.color || '#ff0055',
            position: 'absolute',
            left: this.props.coords.originals[this.props.index].x,
            top: this.props.coords.originals[this.props.index].y,
            transform: [
              { translateX: this._animatedValue.x },
              { translateY: this._animatedValue.y },
              ...this.getCollisionData(),
            ],
          },
        ]}
        {...this._panResponder.panHandlers}
      />
    );
  }
}

const styles = StyleSheet.create({
  bubble: {
    height: 100,
    width: 100,
    borderRadius: 50,
  },
});
