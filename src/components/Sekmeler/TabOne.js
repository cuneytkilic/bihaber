/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import Moment from 'moment';

import {
  View,
  FlatList,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  Button,
} from 'react-native';
import firebase from 'react-native-firebase';
import {ScrollView} from 'react-native-gesture-handler';

export default class TabOne extends Component {
  constructor(props) {
    super(props);
    this.state = {
      duyurularim_array: [],
      info_arr: [],
      ders_kodu: '',
      ders_adi: '',
      duyuru_baslik: '',
      duyuru_icerik: '',
      duyuru_tarih: '',
      ad_soyad: '',
      refreshing: false,
      didUpdate: false,
      show: false,
    };
  }
  // SAYFAYI YUKARI KAYDIRARAK RE-RENDER(TEKRAR YÜKLEME) YAPABİLMEMİZİ SAĞLIYOR.
  handleResfresh = () => {
    this.setState({refreshing: true}, () => {
      this.duyurularim();
      this.setState({refreshing: false});
    });
  };
  duyurularim = async () => {
    const fcmToken = await firebase.messaging().getToken();
    await fetch('http://bihaber.ankara.edu.tr/api/duyurularim_goruntule', {
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
        this.setState({duyurularim_array: responseJson});
      });
  };
  componentDidMount() {
    this._subscribe = this.props.navigation.addListener('didFocus', () => {
      this.duyurularim();
    });
  }
  static navigationOptions = {
    title: 'Duyurular',
    tabBarIcon: ({tintColor}) => (
      <Image
        source={require('../../../assets/images/bell.png')}
        style={{width: 20, height: 20}}
      />
    ),
  };
  karakter_kontrol = icerik => {
    var str = icerik;
    if (str.length <= 45) {
      return str;
    } else {
      var new_str = str.slice(0, 40);
      return new_str + '...';
    }
  };
  tarih_goster = tarih => {
    var date = tarih;
    return Moment(date).format('DD.MM.YYYY');
  };
  info = async duyuru_id => {
    await fetch('http://bihaber.ankara.edu.tr/api/duyuru_bilgisi', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        gonderilen_duyuru_id: duyuru_id,
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        this.setState({info_arr: responseJson});
        this.setState({
          ders_kodu: this.state.info_arr[0].Ders_kodu,
          ders_adi: this.state.info_arr[0].Ders_adi,
          duyuru_baslik: this.state.info_arr[0].Duyuru_baslik,
          duyuru_icerik: this.state.info_arr[0].Duyuru_icerik,
          duyuru_tarih: this.state.info_arr[0].Duyuru_tarih,
          ad_soyad: this.state.info_arr[0].AdSoyad,
        });
      });
    this.setState({show: true});
  };

  render() {
    let duyuru_icerik = this.state.duyuru_icerik;
    let ders_adi_kodu =
      '  (' + this.state.ders_kodu + ') ' + this.state.ders_adi;
    let duyuru_tarih =
      '  Gönderim Tarihi: ' + this.tarih_goster(this.state.duyuru_tarih);
    //let ad_soyad = '  Gönderen: ' + this.state.ad_soyad;
    return (
      <View style={styles.mainContainer}>
        <FlatList
          data={this.state.duyurularim_array}
          renderItem={({item}) => (
            <View style={styles.textContainer}>
              <View style={{width: '90%'}}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={styles.ders_kodu}>{item.Ders_kodu} </Text>
                  <Text style={styles.tarih}>
                    ({this.tarih_goster(item.Duyuru_tarih)})
                  </Text>
                </View>
                <Text style={styles.duyuru_icerik}>
                  {this.karakter_kontrol(item.Duyuru_icerik)}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.icon_style}
                onPress={() => this.info(item.Duyuru_id)}>
                <Image
                  source={require('../../../assets/images/information_icon.png')}
                  style={styles.resim_sytle}
                />
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={item => item.Duyuru_icerik}
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
                    {this.state.duyuru_baslik}
                  </Text>
                </View>
              </View>
              <View style={{flex: 1}}>
                <ScrollView>
                  <Text
                    style={{
                      borderRadius: 5,
                      padding: 2,
                    }}>
                    {duyuru_icerik}
                  </Text>
                </ScrollView>
                <View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Image
                      source={require('../../../assets/images/book.png')}
                      style={{width: 25, height: 25}}
                    />
                    <View style={{paddingBottom: 10}}>
                      <Text style={{paddingTop: 5}}>{ders_adi_kodu}</Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Image
                      source={require('../../../assets/images/calendar.png')}
                      style={{width: 25, height: 25}}
                    />
                    <View style={{paddingBottom: 10}}>
                      <Text style={{paddingTop: 5}}>{duyuru_tarih}</Text>
                    </View>
                  </View>
                </View>
              </View>
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
  mainContainer: {
    flex: 1,
    backgroundColor: '#DDDDE6',
  },
  textContainer: {
    width: '94%',
    marginLeft: '3%',
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DDDDE6',
    borderBottomWidth: 1,
    borderBottomColor: '#B6B1B1',
  },
  ders_kodu: {
    paddingTop: 10,
    paddingBottom: 5,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#246D76',
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
  icon_style: {
    right: 15,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  baslik_bolgesi: {
    left: 10,
    paddingRight: 25,
    fontSize: 15,
  },
  ders_adi: {
    paddingTop: 10,
    paddingBottom: 5,
    fontSize: 15,
    color: '#246D76',
  },
  duyuru_icerik: {
    width: '85%',
    left: 30,
    color: '#246D76',
  },
  resim_sytle: {
    width: 35,
    height: 35,
  },
  tarih: {
    paddingTop: 10,
    paddingBottom: 5,
    paddingLeft: 0,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#246D76',
  },
});
