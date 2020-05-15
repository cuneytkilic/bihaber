/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Button,
  Modal,
} from 'react-native';
import firebase from 'react-native-firebase';
//import Icon from 'react-native-vector-icons/FontAwesome';

export default class tabTwo extends Component {
  static navigationOptions = {
    title: 'Derslerim',
    tabBarIcon: ({tintColor}) => (
      <Image
        source={require('../../../assets/images/contacts_book_icon.png')}
        style={{width: 20, height: 20}}
      />
    ),
  };
  constructor(props) {
    super(props);
    this.state = {
      derslerim_array: [],
      info_arr: [],
      iliskisiz_info_arr: [],
      ders_kodu: '',
      ders_adi: '',
      donem: '',
      sinif: '',
      ad_soyad: '',
      refreshing: false,
      didUpdate: false,
      degiskenX: '',
      show: false,
    };
  }
  // sayfayı aşağı kaydırarak re-render (tekrar yükeleme) yapabilmemizi sağlıyor.
  handleResfresh = () => {
    this.setState({refreshing: true}, () => {
      this.derslerim();
      this.setState({refreshing: false});
    });
  };
  derslerim = async () => {
    const fcmToken = await firebase.messaging().getToken();
    await fetch('http://bihaber.ankara.edu.tr/api/derslerim_goruntule', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        goruntulenecek_kullanici_token: fcmToken,
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        this.setState({derslerim_array: responseJson});
      });
  };
  info = async ders_id => {
    await fetch('http://bihaber.ankara.edu.tr/api/akademisyen_bilgisi', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        gonderilen_ders_id: ders_id,
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        this.setState({info_arr: responseJson});
        if (this.state.info_arr.length > 0) {
          this.setState({
            ders_kodu: this.state.info_arr[0].Ders_kodu,
            ders_adi: this.state.info_arr[0].Ders_adi,
            donem: this.state.info_arr[0].Donem,
            sinif: this.state.info_arr[0].Sinif,
            ad_soyad: this.state.info_arr[0].AdSoyad,
          });
        } else {
          this.iliskisiz_ders_bilgi(ders_id);
        }
      });
    this.setState({show: true});
  };
  iliskisiz_ders_bilgi = async gelen_ders_id => {
    await fetch('http://bihaber.ankara.edu.tr/api/ders_bilgisi', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        gonderilen_ders_id: gelen_ders_id,
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        this.setState({iliskisiz_info_arr: responseJson});
        if (this.state.iliskisiz_info_arr.length > 0) {
          this.setState({
            ders_kodu: this.state.iliskisiz_info_arr[0].Ders_kodu,
            ders_adi: this.state.iliskisiz_info_arr[0].Ders_adi,
            donem: this.state.iliskisiz_info_arr[0].Donem,
            sinif: this.state.iliskisiz_info_arr[0].Sinif,
            ad_soyad: 'Atanmış akademisyen yok',
          });
        }
      });
  };
  componentDidMount() {
    this._subscribe = this.props.navigation.addListener('didFocus', () => {
      this.derslerim();
    });
  }

  render() {
    let ad_soyad = 'Akademisyen: ' + this.state.ad_soyad;
    let donem = 'Dönem: ' + this.state.donem;
    let sinif = 'Sınıf: ' + this.state.sinif;
    return (
      <View style={styles.main}>
        <FlatList
          data={this.state.derslerim_array}
          renderItem={({item}) => (
            <View style={styles.ContainerOfPage}>
              <View
                style={{
                  width: '94%',
                  height: '100%',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: '#DDDDE6',
                  borderBottomWidth: 1,
                  borderBottomColor: '#B6B1B1',
                }}>
                <View style={{width: '26%'}}>
                  <Text style={styles.yazi_tipi}>{item.Ders_kodu} </Text>
                </View>
                <Text style={styles.ders_adi_yazi_tipi}>{item.Ders_adi}</Text>

                <TouchableOpacity
                  // Ders Hakkında Detay Gösteren "Popup(modal) Screen" Butonu
                  style={styles.icon_style}
                  onPress={() => this.info(item.Ders_id)}>
                  <Image
                    style={styles.resim_sytle}
                    source={require('../../../assets/images/information_icon.png')}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
          keyExtractor={item => item.Ders_kodu}
          refreshing={this.state.refreshing}
          onRefresh={this.handleResfresh}
        />
        {/* info modal */}
        <Modal transparent={true} visible={this.state.show}>
          <View style={{backgroundColor: '#000000aa', flex: 1}}>
            <View
              style={{
                backgroundColor: '#ffffff',
                margin: 20,
                marginTop: 100,
                marginBottom: 100,
                padding: 40,
                borderRadius: 5,
                flex: 1,
              }}>
              <View style={styles.ust_bolge}>
                <Image
                  style={styles.icon_bolgesi}
                  source={require('../../../assets/images/logo.png')}
                />
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={styles.baslik_bolgesi}>
                    {this.state.ders_kodu}
                  </Text>
                  <Text style={{marginLeft: 15}}>({this.state.ders_adi})</Text>
                </View>
              </View>
              <Text style={{marginTop: 10}}>{ad_soyad}</Text>
              <Text style={{marginTop: 10}}>{donem}</Text>
              <Text style={{marginTop: 10}}>{sinif}</Text>
            </View>

            <Button
              title="KAPAT"
              onPress={() => {
                this.setState({show: false});
              }}
            />
          </View>
        </Modal>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  ContainerOfPage: {
    flex: 1,
    paddingTop: 8,
    backgroundColor: '#DDDDE6',
    alignItems: 'center',
  },
  main: {
    flex: 1,
    backgroundColor: '#DDDDE6',
  },
  yazi_tipi: {
    margin: 5,
    color: '#246D76',
    fontWeight: 'bold',
    fontSize: 18,
  },
  resim_sytle: {
    width: 35,
    height: 35,
  },
  ders_adi_yazi_tipi: {
    flex: 1,
    left: '50%',
    color: '#246D76',
  },
  icon_style: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ust_bolge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '10%',
  },
  icon_bolgesi: {
    height: 50,
    width: 50,
  },
  baslik_bolgesi: {
    left: 10,
  },
});
