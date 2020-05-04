/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {View, FlatList, Image} from 'react-native';
import All_Les_For_Main_Page from '../../pages/All_Les_For_Main_Page';
import firebase from 'react-native-firebase';

export default class TabThree extends Component {
  static navigationOptions = {
    title: 'Tüm Dersler',
    tabBarIcon: ({tintColor}) => (
      <Image
        source={require('../../../assets/images/books_icon.png')}
        style={{width: 25, height: 25}}
      />
    ),
  };
  constructor(props) {
    super(props);
    this.state = {
      kullanici_dersler: [],
      kullanici_id: [],
    };
  }
  componentDidMount() {
    //this._subscribe = this.props.navigation.addListener('didFocus', () => {
    this.getLessons_For_Current_User();
    //});
  }
  getLessons_For_Current_User = async () => {
    const fcmToken = await firebase.messaging().getToken();

    await fetch(
      'http://bihaber.ankara.edu.tr/api/Kullanici_Dersleri_Ve_Tum_Dersler',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: fcmToken,
        }),
      },
    )
      .then(response => response.json())
      .then(responseJson => {
        this.setState({kullanici_dersler: responseJson});
      })
      .catch(error => {
        console.error(error);
      });
  };
  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#DDDDE6'}}>
        <FlatList
          data={this.state.kullanici_dersler}
          renderItem={({item}) => (
            <All_Les_For_Main_Page
              derskod={item.Ders_kodu}
              dersadi={item.Ders_adi}
              dersid={item.Ders_id}
              giden_aktiflik={item.AktifSonuc}
            />
          )}
          keyExtractor={item => item.Ders_kodu}
        />
      </View>
    );
  }
}
