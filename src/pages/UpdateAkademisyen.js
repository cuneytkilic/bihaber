/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  Alert,
  Modal,
} from 'react-native';

import {sha256} from 'react-native-sha256';
import {Text} from 'native-base';
import {TextInput} from 'react-native-gesture-handler';

export default class UpdateAkademisyen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      kullanici_adi: '',
      sifre: '',
      adSoyad: '',
      height: Dimensions.get('window').height,
      width: Dimensions.get('window').width,
      password_hash: '',
      akademisyen_details: [],
      waitingUpdate: false,
      akademisyen_id: this.props.navigation.state.params
        .gonderilen_akademisyen_id,
    };
  }
  componentDidMount() {
    this.AkademisyenGetir();
  }
  handleChangeKullaniciAdi = value => {
    this.setState({kullanici_adi: value});
  };
  handleChangeSifre = value => {
    this.setState({sifre: value});
  };
  handleChangeAdSoyad = value => {
    this.setState({adSoyad: value});
  };
  AkademisyenGetir = async () => {
    await fetch('http://bihaber.ankara.edu.tr/api/AkademisyenGetir', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        server_akademisyen_id: this.state.akademisyen_id,
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        this.setState({akademisyen_details: responseJson});
        this.setState({
          kullanici_adi: this.state.akademisyen_details[0].Kullanici_Ad,
          adSoyad: this.state.akademisyen_details[0].AdSoyad,
        });
      })
      .catch(error => {
        console.error(error);
      });
  };

  sifre_hash = () => {
    sha256(this.state.sifre).then(hashed_value => {
      this.AkademisyenKaydet(hashed_value);
    });
  };

  AkademisyenKaydet = async x => {
    await fetch('http://bihaber.ankara.edu.tr/api/AkademisyenGuncelle', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        gonderilen_kullanici_adi: this.state.kullanici_adi,
        gonderilen_sifre: x,
        gonderilen_adSoyad: this.state.adSoyad,
        gonderilen_yonetim_id: this.state.akademisyen_id,
      }),
    })
      .then(response => response.text())
      .then(responseJson => {})
      .catch(error => {
        console.error(error);
      });
    this.props.navigation.navigate('AkademisyenPage');
  };
  AkademisyenGuncelle = async () => {
    this.setState({waitingUpdate: true});
    if (
      this.state.kullanici_adi !== '' &&
      this.state.adSoyad !== '' &&
      this.state.sifre !== ''
    ) {
      setTimeout(() => {
        this.setState({waitingUpdate: false});
        this.sifre_hash();
      }, 3000);
    } else {
      this.setState({waitingUpdate: false});
      Alert.alert('Tüm alanların girilmesi zorunludur.');
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.HeaderContainer}>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate('AkademisyenPage');
            }}>
            <View style={styles.backIconContainer}>
              <Image
                style={styles.backIcon}
                source={require('../../assets/images/left_arrow.png')}
              />
            </View>
          </TouchableOpacity>
          <View
            style={{
              backgroundColor: '#3E53AE',
              justifyContent: 'center',
              width: '60%',
              alignItems: 'center',
            }}>
            <Text style={styles.HeaderText}>Akademisyen Düzenle</Text>
          </View>
          <View style={styles.backIconContainer} />
        </View>
        <ScrollView style={{width: '100%'}}>
          <View
            style={{
              backgroundColor: '#DDDDE6',
              width: '100%',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: this.state.height * 0.1,
            }}>
            <Image
              style={styles.imageStyle}
              source={require('../../assets/images/user.png')}
            />
            <View style={styles.inputContainer}>
              <TextInput
                ref={input => (this.adSoyadInput = input)}
                onChangeText={this.handleChangeAdSoyad}
                placeholder="Ad Soyad"
                value={this.state.adSoyad}
                placeholderTextColor="#DDDDE6"
                style={styles.inputStyle}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                onSubmitEditing={() => this.sifreInput.focus()}
                onChangeText={this.handleChangeKullaniciAdi}
                placeholder="Kullanıcı Adı"
                value={this.state.kullanici_adi}
                placeholderTextColor="#DDDDE6"
                style={styles.inputStyle}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                onSubmitEditing={() => this.adSoyadInput.focus()}
                onChangeText={this.handleChangeSifre}
                ref={input => (this.sifreInput = input)}
                placeholder="Şifre"
                secureTextEntry
                value={this.state.sifre}
                placeholderTextColor="#DDDDE6"
                style={styles.inputStyle}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            <TouchableOpacity
              onPress={() => this.AkademisyenGuncelle()}
              style={styles.buttonContainer}>
              <Text style={styles.buttonText}>Değişiklikleri Kaydet</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        {/*BEKLETMEK için popup uyarısı*/}
        <Modal transparent={true} visible={this.state.waitingUpdate}>
          <View style={{backgroundColor: '#000000aa', flex: 1}}>
            <View
              style={{
                backgroundColor: '#ffffff',
                margin: 20,
                marginTop: 200,
                marginBottom: 200,
                paddingTop: 40,
                paddingBottom: 40,
                borderRadius: 5,
                flex: 1,
                alignItems: 'center',
              }}>
              <Text>Akademisyen güncelleniyor, lütfen bekleyiniz...</Text>
              <Image
                source={require('../../assets/images/spinner.gif')}
                style={{width: 100, height: 100}}
              />
              <View
                style={{
                  flexDirection: 'row',
                  margin: 30,
                  justifyContent: 'space-between',
                }}
              />
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  PickerContainer: {
    backgroundColor: '#20232a',
    width: '80%',
    height: 40,
    marginTop: 10,
    borderRadius: 5,
    flexDirection: 'row',
  },
  sinif: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: '46%',
    borderRadius: 5,
    marginRight: '2%',
    justifyContent: 'center',
    paddingLeft: 5,
  },
  donem: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: '50%',
    borderRadius: 5,
    marginLeft: '2%',
    justifyContent: 'center',
    paddingLeft: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    padding: 5,
    fontSize: 18,
  },
  imageStyle: {
    width: 100,
    height: 100,
  },
  formContainer: {
    paddingTop: 80,
    borderRadius: 10,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DDDDE6',
    width: 380,
    height: 500,
  },
  buttonContainer: {
    backgroundColor: '#20232a',
    marginBottom: 5,
    marginTop: 40,
    borderRadius: 20,
    height: 50,
    width: '50%',
    justifyContent: 'center',
  },
  inputContainer: {
    backgroundColor: '#acacac',
    paddingHorizontal: 10,
    borderRadius: 5,
    marginTop: 10,
    height: 50,
    width: '70%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    borderRadius: 5,
    margin: 5,
    height: 40,
    width: 250,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputStyle: {
    flex: 1,
    fontSize: 18,
  },
  container: {
    backgroundColor: '#DDDDE6',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  HeaderContainer: {
    backgroundColor: '#3E53AE',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 50,
    width: '100%',
  },
  HeaderImage: {
    width: 40,
    height: '100%',
    backgroundColor: 'black',
  },
  BodyContainer: {
    backgroundColor: '#DDDDE6',
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIconContainer: {
    paddingLeft: 10,
    paddingRight: 10,
    width: '23%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    width: 30,
    height: 30,
  },
  PageHeaderContainer: {},
  HeaderText: {
    fontSize: 17,
    color: 'white',
  },
});
