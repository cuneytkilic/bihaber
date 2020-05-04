import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  Dimensions,
} from 'react-native';
import {Picker} from 'native-base';
import {Text} from 'native-base';
import {TextInput} from 'react-native-gesture-handler';
var ders_id;

export default class UpdateLesson extends Component {
  constructor(props) {
    super(props);

    this.state = {
      guncellenecek_ders: [],
      ders_kodu: '',
      ders_adi: '',
      donem: '',
      sinif: '',
      height: Dimensions.get('window').height,
      width: Dimensions.get('window').width,
    };
  }
  UpdateLesson = async gelen_ders_id => {
    await fetch('http://bihaber.ankara.edu.tr/api/GuncellenecekDers', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // servere gönderilecek veriler
        guncellenecek_ders_id: gelen_ders_id,
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          guncellenecek_ders: responseJson,
        });
        this.setState({
          ders_kodu: this.state.guncellenecek_ders[0].Ders_kodu,
          ders_adi: this.state.guncellenecek_ders[0].Ders_adi,
          donem: this.state.guncellenecek_ders[0].Donem,
          sinif: this.state.guncellenecek_ders[0].Sinif,
        });
      })
      .catch(error => {
        console.error(error);
      });
  };
  componentDidMount() {
    ders_id = Number(
      JSON.stringify(this.props.navigation.getParam('itemId', 'default Value')),
    );
    this.UpdateLesson(ders_id);
  }
  handleChangeDersKodu = value => {
    this.setState({ders_kodu: value});
  };
  handleChangeDersAdi = value => {
    this.setState({ders_adi: value});
  };
  onSinifValueChange(value) {
    this.setState({
      sinif: value,
    });
  }
  onDonemValueChange(value) {
    this.setState({
      donem: value,
    });
  }
  Duzenle = async () => {
    await fetch('http://bihaber.ankara.edu.tr/api/UpdateLesson', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        guncellenecek_ders_id: ders_id,
        guncellenecek_ders_adi: this.state.ders_adi,
        guncellenecek_ders_kodu: this.state.ders_kodu,
        guncellenecek_donem: this.state.donem,
        guncellenecek_sinif: this.state.sinif,
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        Alert.alert('basariyla guncellendi.');
        this.props.navigation.navigate('Dersler');
      })
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
              width: this.state.width * 0.75,
              alignItems: 'center',
              height: this.state.height * 0.08,
            }}>
            <Text style={styles.HeaderText}>Ders Düzenle</Text>
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
                placeholderTextColor="gray"
                style={styles.inputStyle}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                onChangeText={this.handleChangeDersAdi}
                ref={input => (this.ders_adi = input)}
                placeholder="Ders Adı"
                value={this.state.ders_adi}
                placeholderTextColor="gray"
                style={styles.inputStyle}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/*//Sınıf seçmek için DropDownList*/}
            <View style={styles.PickerContainer}>
              <View style={styles.sinif}>
                <Picker
                  itemStyle={styles.pickerItem}
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
              onPress={() => this.Duzenle()}
              style={styles.buttonContainer}>
              <Text style={styles.buttonText}>Düzenle</Text>
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
  buttonText: {
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    padding: 5,
  },
  imageStyle: {
    width: 100,
    height: 100,
  },
  formContainer: {
    borderRadius: 10,
    paddingTop: 60,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#20232a',
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
  PageHeaderContainer: {
    backgroundColor: 'pink',
    height: '100%',
    width: '80%',
    paddingRight: '20%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  HeaderText: {
    fontSize: 17,
    color: 'white',
  },
  TextContainer: {
    flexDirection: 'row',
    height: '4%',
    marginBottom: 5,
  },
  TextInputStyle: {
    borderBottomWidth: 1,
    padding: 0,
  },
  TextStyle: {
    width: '40%',
  },
});
