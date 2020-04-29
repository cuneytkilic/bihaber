import React, {Component} from 'react';
import {View, StyleSheet, Image, TouchableOpacity, Text} from 'react-native';

import Menu, {MenuItem, Position} from 'react-native-enhanced-popup-menu';

export default class DeleteLesson extends Component {
  textRef = React.createRef();
  menuRef = null;
  setMenuRef = ref => (this.menuRef = ref);
  hideMenu = () => this.menuRef.hide();
  dersEkle = () => {
    this.hideMenu();
    this.props.navigation.navigate('AddLesson');
  };
  dersSil = () => {
    this.hideMenu();
    this.props.navigation.navigate('DeleteLesson');
  };
  dersDuzenle = () => {
    this.hideMenu();
    this.props.navigation.navigate('UpdateLesson');
  };
  showMenu = () =>
    this.menuRef.show(
      this.textRef.current,
      (this.stickTo = Position.TOP_RIGHT),
    );
  onPress = () => this.showMenu();

  render() {
    return (
      <View style={styles.container}>
        <View ref={this.textRef} style={styles.header}>
          {/* Sağ Üstteki Açılır Menü */}
          <TouchableOpacity onPress={this.onPress}>
            <Image
              source={require('../images/menu_icon.png')}
              style={styles.HeaderImage}
            />
          </TouchableOpacity>
          {/* Açılır Menü İçindekiler */}
          <Menu ref={this.setMenuRef}>
            <MenuItem onPress={() => this.dersEkle()}>Ekle</MenuItem>
            <MenuItem onPress={() => this.dersSil()}>Sil</MenuItem>
            <MenuItem onPress={() => this.dersDuzenle()}>Düzenle</MenuItem>
          </Menu>
        </View>
        <Text>delete</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'green',
    height: '100%',
    width: '100%',
    flex: 1,
  },
  header: {
    backgroundColor: 'yellow',
    height: 50,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  HeaderImage: {
    width: 40,
    height: '100%',
    backgroundColor: 'black',
  },
});
