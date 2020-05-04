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
import {ScrollView} from 'react-native-gesture-handler';
export default class DersAkademisyen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ders_id: 0,
      ders_adi: '',
      akademisyen_id: 0,
      donen_ders: [],
      height: Dimensions.get('window').height,
      width: Dimensions.get('window').width,
      akademisyenler: [],
      DersAkademisyenKontrol_arr: [],
      lessons_arr: [],
    };
  }
  componentDidMount() {
    this.akademisyenler();
    this.FetchAllLessons();
  }
  handleChangeDersKodu = value => {
    this.setState({ders_kodu: value});
  };
  handleChangeDersAdi = value => {
    this.setState({ders_adi: value});
  };
  onAkademisyenValueChange(value) {
    this.setState({
      akademisyen_id: value,
    });
  }

  onDersValueChange(value) {
    this.setState({
      ders_id: value,
    });
  }

  Iliskilendir = async (gelen_ders_id, gelen_akademisyen_id) => {
    await fetch(
      'http://bihaber.ankara.edu.tr/api/DersAkademisyenIliskilendir',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ders_id: gelen_ders_id,
          akademisyen_id: gelen_akademisyen_id,
        }),
      },
    )
      .then(response => response.json())
      .then(responseJson => {})
      .catch(error => {
        console.error(error);
      });
  };

  IliskilendirKontrol = async (
    gonderilen_ders_id,
    gonderilen_akademisyen_id,
  ) => {
    await fetch('http://bihaber.ankara.edu.tr/api/DersAkademisyenKontrol', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ders_id: gonderilen_ders_id,
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        this.setState({DersAkademisyenKontrol_arr: responseJson});
        if (this.state.DersAkademisyenKontrol_arr.length > 0) {
          Alert.alert('Bu ders için ilişkilendirme daha önceden yapılmıştır.');
        } else {
          this.Iliskilendir(gonderilen_ders_id, gonderilen_akademisyen_id);
          Alert.alert('İlişkilendirme başarıyla yapıldı.');
          this.props.navigation.navigate('AdminPage');
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  akademisyenler = async () => {
    await fetch('http://bihaber.ankara.edu.tr/api/akademisyen_getir', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          akademisyenler: responseJson,
        });
        console.log(this.state.akademisyenler);
      })
      .catch(error => {
        console.error(error);
      });
  };

  FetchAllLessons = async () => {
    const response = await fetch('http://bihaber.ankara.edu.tr/api/GetDersler');
    const lessons = await response.json();
    this.setState({lessons_arr: lessons}); //html elemanlarının tekrardan render edilmesini sağlar
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
      .then(response => response.json())
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
              this.props.navigation.navigate('AdminPage');
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
              width: this.state.width * 0.75,
              alignItems: 'center',
              height: this.state.height * 0.08,
            }}>
            <Text style={styles.HeaderText}>
              Ders Akademisyen İlişkilendirme
            </Text>
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
              source={require('../../assets/images/iliskilendirme.png')}
            />

            {/*//Ders seçmek için DropDownList*/}
            <View style={styles.PickerContainer}>
              <View style={styles.akademisyen}>
                <Picker
                  itemStyle={styles.pickerItem}
                  mode="dropdown"
                  selectedValue={this.state.ders_id}
                  onValueChange={this.onDersValueChange.bind(this)}>
                  {this.state.lessons_arr.map((item, key) => (
                    <Picker.Item
                      label={item.Ders_adi}
                      value={item.Ders_id}
                      key={key}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            {/*//Akademisyen seçmek için DropDownList*/}
            <View style={styles.PickerContainer}>
              <View style={styles.akademisyen}>
                <Picker
                  itemStyle={styles.pickerItem}
                  mode="dropdown"
                  selectedValue={this.state.akademisyen_id}
                  onValueChange={this.onAkademisyenValueChange.bind(this)}>
                  {this.state.akademisyenler.map((item, key) => (
                    <Picker.Item
                      label={item.AdSoyad}
                      value={item.Yonetim_id}
                      key={key}
                    />
                  ))}
                </Picker>
              </View>
            </View>
            <TouchableOpacity
              onPress={() =>
                this.IliskilendirKontrol(
                  this.state.ders_id,
                  this.state.akademisyen_id,
                )
              }
              style={styles.buttonContainer}>
              <Text style={styles.buttonText}>İlişkilendir</Text>
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
    width: '60%',
    height: 40,
    marginTop: 10,
    borderRadius: 5,
    flexDirection: 'row',
  },
  sinif: {
    backgroundColor: '#acacac',
    width: '46%',
    borderRadius: 5,
    marginRight: '2%',
    justifyContent: 'center',
    paddingLeft: 5,
  },
  donem: {
    backgroundColor: '#acacac',
    width: '50%',
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
  HeaderText: {
    fontSize: 17,
    color: 'white',
  },
});
