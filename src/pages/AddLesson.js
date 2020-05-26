/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
} from 'react-native';
import {Picker} from 'native-base';
import {Text} from 'native-base';
import {TextInput, ScrollView} from 'react-native-gesture-handler';
export default class AddLesson extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ders_kodu: '',
      ders_adi: '',
      sinif: '1.Sınıf',
      donem: 'Güz Dönemi',
      secili_akademisyen: '',
      donen_ders: [],
      height: Dimensions.get('window').height,
      width: Dimensions.get('window').width,
    };
  }
  handleChangeDersKodu = value => {
    this.setState({ders_kodu: value});
  };
  handleChangeDersAdi = value => {
    this.setState({ders_adi: value});
  };
  handleChangeAkademisyen = value => {
    this.setState({akademisyen: value});
  };
  onSinifValueChange(value) {
    this.setState({
      sinif: value,
    });
  }
  onAkademisyenValueChange(value) {
    this.setState({
      secili_akademisyen: value,
    });
  }
  onDonemValueChange(value) {
    this.setState({
      donem: value,
    });
  }
  DersEkle = async gonderilen_ders_kodu => {
    if (this.state.ders_adi !== '' && this.state.ders_kodu !== '') {
      await fetch('http://bihaber.ankara.edu.tr/api/ControlOfLesson', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gonderilen_ders_kodu: gonderilen_ders_kodu,
        }),
      })
        .then(response => response.json())
        .then(responseJson => {
          this.setState({donen_ders: responseJson});
          if (this.state.donen_ders.length > 0) {
            Alert.alert('ders zaten var');
          } else {
            this.VeriTabaninaEkle();
            this.props.navigation.navigate('Dersler');
            //Alert.alert('eklendi');
          }
        })
        .catch(error => {
          console.error(error);
        });
    } else {
      Alert.alert('Ders kodu veya ders adi boş geçilemez. ');
    }
  };

  VeriTabaninaEkle = async () => {
    await fetch('http://bihaber.ankara.edu.tr/api/DersEkle', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        gonderilen_ders_kodu: this.state.ders_kodu,
        gonderilen_ders_adi: this.state.ders_adi,
        gonderilen_sinif: this.state.sinif,
        gonderilen_donem: this.state.donem,
      }),
    })
      .then(response => response.text())
      .then(responseJson => {})
      .catch(error => {
        console.error(error);
      });
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.HeaderContainer}>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate('Dersler');
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
            <Text style={styles.HeaderText}>Ders Ekle</Text>
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
              source={require('../../assets/images/research_icon.png')}
            />
            <View style={styles.inputContainer}>
              <TextInput
                onSubmitEditing={() => this.ders_adi.focus()}
                onChangeText={this.handleChangeDersKodu}
                placeholder="Ders Kodu"
                value={this.state.ders_kodu}
                placeholderTextColor="#DDDDE6"
                style={styles.inputStyle}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                onSubmitEditing={() => this.akademisyen.focus()}
                onChangeText={this.handleChangeDersAdi}
                ref={input => (this.ders_adi = input)}
                placeholder="Ders Adı"
                value={this.state.ders_adi}
                placeholderTextColor="#DDDDE6"
                style={styles.inputStyle}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/*//Sınıf seçmek için DropDownList*/}
            <View style={styles.PickerContainer}>
              <View style={styles.sinif}>
                <Picker
                  mode="dropdown"
                  selectedValue={this.state.sinif}
                  onValueChange={this.onSinifValueChange.bind(this)}>
                  <Picker.Item label="1.Sınıf" value="1.Sınıf" color="black" />
                  <Picker.Item label="2.Sınıf" value="2.Sınıf" color="black" />
                  <Picker.Item label="3.Sınıf" value="3.Sınıf" color="black" />
                  <Picker.Item label="4.Sınıf" value="4.Sınıf" color="black" />
                </Picker>
              </View>

              {/*//Dönem seçmek için DropDownList*/}
              <View style={styles.donem}>
                <Picker
                  mode="dropdown"
                  selectedValue={this.state.donem}
                  onValueChange={this.onDonemValueChange.bind(this)}>
                  <Picker.Item label="Güz" value="Güz Dönemi" color="black" />
                  <Picker.Item
                    label="Bahar"
                    value="Bahar Dönemi"
                    color="black"
                  />
                  <Picker.Item label="Yaz" value="Yaz Dönemi" color="black" />
                </Picker>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => this.DersEkle(this.state.ders_kodu)}
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
    backgroundColor: '#DDDDE6',
    width: '70%',
    height: 40,
    marginTop: 10,
    borderRadius: 5,
    flexDirection: 'row',
  },
  sinif: {
    backgroundColor: '#acacac',
    width: '48%',
    borderRadius: 5,
    marginRight: '2%',
    justifyContent: 'center',
    paddingLeft: 5,
  },
  donem: {
    backgroundColor: '#acacac',
    width: '48%',
    borderRadius: 5,
    marginLeft: '2%',
    justifyContent: 'center',
    paddingLeft: 5,
  },
  akademisyen: {
    backgroundColor: '#acacac',
    width: '100%',
    borderRadius: 5,
    marginRight: '2%',
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
  loginForm: {
    alignItems: 'center',
    marginTop: 50,
    height: 200,
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
  backIconContainer: {
    paddingLeft: 10,
    paddingRight: 10,
    width: '23%',
    justifyContent: 'center',
    alignItems: 'center',
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
  backIcon: {
    width: 30,
    height: 30,
  },
  HeaderText: {
    fontSize: 17,
    color: 'white',
  },
});
