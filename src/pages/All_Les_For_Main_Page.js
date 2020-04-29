import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import firebase from 'react-native-firebase';
import ToggleSwitch from 'toggle-switch-react-native';

export default class All_Les_For_Main_Page extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isActive: true,
      toggle2: false,
      aktiflik: this.props.giden_aktiflik,
      aktifDersVarmi: [],
    };
  }

  Aktiflik_Degistir = giden_ders_id => {
    this.Ders_Aktif_Mi(giden_ders_id);
    if (this.state.aktiflik === 0) {
      this.setState({aktiflik: 1});
    } else {
      this.setState({aktiflik: 0});
    }
    this.setState({aktiflik: !this.state.aktiflik});
  };

  Ders_Aktif_Mi = async giden_ders_id => {
    const fcmToken = await firebase.messaging().getToken();
    await fetch('http://bihaber.ankara.edu.tr/api/Ders_Aktif_Mi', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        kontrol_token_id: fcmToken,
        kontrol_ders_id: giden_ders_id,
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        this.setState({aktifDersVarmi: responseJson});
        if (this.state.aktifDersVarmi.length > 0) {
          //sil
          this.Delete_Kullanici_Aktif_Ders(giden_ders_id);
        } else {
          //ekle
          this.Insert_Kullanici_Aktif_Ders(giden_ders_id, fcmToken);
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  Delete_Kullanici_Aktif_Ders = async giden_ders_id => {
    const fcmToken = await firebase.messaging().getToken();
    await fetch('http://bihaber.ankara.edu.tr/api/DeleteAktifDers', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        silinecek_ders_id: giden_ders_id,
        silinecek_kullanici_token: fcmToken,
      }),
    });
  };
  Insert_Kullanici_Aktif_Ders = async (giden_ders_id, token) => {
    await fetch('http://bihaber.ankara.edu.tr/api/InsertAktifDers', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eklenecek_ders_id: giden_ders_id,
        eklenecek_kullanici_token: token,
      }),
    });
  };
  render() {
    //const {dersadi} = this.props.dersadi;
    return (
      <View style={styles.ContainerOfPage}>
        <View
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            width: '90%',
            height: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#DDDDE6',
            borderBottomWidth: 1,
            borderBottomColor: '#B6B1B1',
          }}>
          <Text
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              margin: 5,
              color: '#246D76',
              fontWeight: 'bold',
            }}>
            {this.props.dersadi}
          </Text>
          <ToggleSwitch
            isOn={this.state.aktiflik ? true : false}
            onColor="green"
            offColor="gray"
            label={this.props.derskod}
            labelStyle={{color: 'black', fontWeight: '900'}}
            size="medium"
            onToggle={() => this.Aktiflik_Degistir(this.props.dersid)}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  ContainerOfPage: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#DDDDE6',
    alignItems: 'center',
  },
});
