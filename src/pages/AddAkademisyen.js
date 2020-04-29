import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';

import {sha256} from 'react-native-sha256';
import {Text} from 'native-base';
import {TextInput} from 'react-native-gesture-handler';

export default class AddLesson extends Component {
  constructor(props) {
    super(props);
    this.state = {
      kullanici_adi: '',
      sifre: '',
      adSoyad: '1',
      donem: 'Güz',
      height: Dimensions.get('window').height,
      width: Dimensions.get('window').width,
      password_hash: '',
    };
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
  AkademisyenKaydet = async x => {
    await fetch('http://bihaber.ankara.edu.tr/api/AkademisyenEkle', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        gonderilen_kullanici_adi: this.state.kullanici_adi,
        gonderilen_sifre: x,
        gonderilen_adSoyad: this.state.adSoyad,
      }),
    })
      .then(response => response.json())
      .then(responseJson => {})
      .catch(error => {
        console.error(error);
      });
    Alert.alert('Akademisyen başarıyla eklendi.');
    this.props.navigation.navigate('AkademisyenPage');
  };
  AkademisyenEkle = async () => {
    if (
      this.state.kullanici_adi !== '' &&
      this.state.sifre !== '' &&
      this.state.adSoyad !== ''
    ) {
      sha256(this.state.sifre).then(hashed_value => {
        this.AkademisyenKaydet(hashed_value);
      });
    } else {
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
                source={require('../images/left-arrow.png')}
              />
            </View>
          </TouchableOpacity>
          <View
            style={{
              backgroundColor: '#3E53AE',
              justifyContent: 'center',
              width: this.state.width * 0.75,
              alignItems: 'center',
              height: this.state.height * 0.08,
            }}>
            <Text style={styles.HeaderText}>Akademisyen Ekle</Text>
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
              source={require('../images/user.png')}
            />
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
            <View style={styles.inputContainer}>
              <TextInput
                ref={input => (this.adSoyadInput = input)}
                onChangeText={this.handleChangeAdSoyad}
                placeholder="Ad Soyad"
                value={this.state.akademisyen}
                placeholderTextColor="#DDDDE6"
                style={styles.inputStyle}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            <TouchableOpacity
              onPress={() => this.AkademisyenEkle(this.state.kullanici_adi)}
              style={styles.buttonContainer}>
              <Text style={styles.buttonText}>Ekle</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
    height: 40,
    width: 200,
    justifyContent: 'center',
  },
  inputContainer: {
    backgroundColor: '#acacac',
    paddingHorizontal: 10,
    borderRadius: 5,
    marginTop: 10,
    height: 40,
    width: '60%',
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
    flex: 1,
    height: '100%',
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
