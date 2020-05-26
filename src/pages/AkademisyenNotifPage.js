/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  StyleSheet,
  Image,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Alert,
  Modal,
} from 'react-native';
import {Picker} from 'native-base';
import {TextInput, ScrollView} from 'react-native-gesture-handler';

class AkademisyenNotifPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token_bilgisi: '',
      ders_kodu: '',
      ders_id: '',
      baslik: '',
      icerik: '',
      my_lessons_arr: [],
      tokens_arr: [],
      bildirim_durum: '',
      waitingAdd: false,
      height: Dimensions.get('window').height,
      width: Dimensions.get('window').width,
    };
  }

  FetchAllLessonsOfAkademisyen = async akademisyen_id => {
    await fetch('http://bihaber.ankara.edu.tr/api/LessonsOfAkademisyen', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        giden_akademisyen_id: akademisyen_id,
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        this.setState({my_lessons_arr: responseJson}); //html elemanlarının tekrardan render edilmesini sağlar
        this.WarningMessage();
      })
      .catch(error => {
        console.error(error);
      });
  };
  WarningMessage = () => {
    if (this.state.my_lessons_arr.length === 0) {
      Alert.alert(
        'Size atanmış ders yok!',
        'Lütfen Yönetici ile iletişime geçiniz. \n\n1) Yönetici: Özge Mercanoğlu Sincan\n2) Yönetici: Zeynep Yıldırım',
      );
      this.props.navigation.navigate('Akademisyen');
    }
  };
  componentDidMount = async () => {
    this.FetchAllLessonsOfAkademisyen(
      this.props.navigation.state.params.gonderilen_akademisyen_id,
    );
  };

  PostNotification = async () => {
    this.setState({waitingAdd: true});
    if (this.state.baslik !== '' && this.state.icerik !== '') {
      await fetch('http://bihaber.ankara.edu.tr/api/DersiAlanTokenlar', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gonderilen_ders_id: this.state.ders_id,
        }),
      })
        .then(response => response.json())
        .then(responseJson => {
          this.setState({tokens_arr: responseJson});
          if (this.state.tokens_arr.length !== 0) {
            this.state.tokens_arr.map(item => {
              this.SendNotification(item.Token_id);
            });
            this.SaveNotification();
          } else {
            this.SaveNotification(); // dersi seçen kimse yoksa bildirim veritabanına kayıt edilecek.
          }
        })
        .catch(error => {
          console.error(error);
        });
      setTimeout(() => {
        this.setState({waitingAdd: false});
        this.props.navigation.navigate('Akademisyen');
      }, 2000);
    } else {
      this.setState({waitingAdd: false});
      Alert.alert('Bildirim başlığı veya bildirim içeriği boş geçilemez.');
    }
  };

  SendNotification = async gonderilecek_token => {
    await fetch('http://bihaber.ankara.edu.tr/api/Notification', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        giden_token: gonderilecek_token,
        giden_baslik: this.state.baslik,
        giden_icerik: this.state.icerik,
        giden_ders_kodu: this.state.ders_kodu,
      }),
    })
      .then(response => response.text())
      .then(responseJson => {})
      .catch(error => {
        console.error(error);
      });
  };

  SaveNotification = async () => {
    await fetch('http://bihaber.ankara.edu.tr/api/BildirimKaydet', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        giden_baslik: this.state.baslik,
        giden_icerik: this.state.icerik,
        giden_ders_id: this.state.ders_id,
        giden_ders_kodu: this.state.ders_kodu,
      }),
    })
      .then(response => response.text())
      .then(responseJson => {})
      .catch(error => {
        console.error(error);
      });
  };

  // formdan gelen verileri state'de depoluyoruz.
  handleNotificationTitleChange = title => {
    this.setState({baslik: title});
  };
  handleNotificationContentChange = content => {
    this.setState({icerik: content});
  };
  handleNotificationLessonCodeChange = (value, index) => {
    this.setState({ders_kodu: value, ders_id: value});
  };
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.HeaderContainer}>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate('Akademisyen');
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
            <Text style={styles.HeaderText}>Bildirim Gönder</Text>
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
              source={require('../../assets/images/megaphone.png')}
            />
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Bildirim Başlık"
                onSubmitEditing={() => this.icerikInput.focus()}
                onChangeText={this.handleNotificationTitleChange}
                placeholderTextColor="#DDDDE6"
                value={this.state.baslik}
                style={styles.baslikStyle}
                autoCapitalize="none"
                autoCorrect={false}
                autoFocus={true}
              />
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                onChangeText={this.handleNotificationContentChange}
                underlineColorAndroid="transparent"
                ref={input => (this.icerikInput = input)}
                value={this.state.icerik}
                placeholder="Bildirim İçerik"
                placeholderTextColor="#DDDDE6"
                style={styles.icerikStyle}
                autoCapitalize="none"
                autoCorrect={false}
                multiline
              />
            </View>

            {/*//Dönem seçmek için DropDownList*/}

            <View style={styles.PickerContainer}>
              <View style={styles.ders_kodu}>
                <Picker
                  mode="dropdown"
                  onValueChange={(valuex, index) =>
                    this.handleNotificationLessonCodeChange(valuex, index)
                  }
                  selectedValue={this.state.ders_kodu}>
                  {this.state.my_lessons_arr.map((item, key) => (
                    <Picker.Item
                      label={item.Ders_kodu}
                      value={item.Ders_id}
                      key={key}
                      color="black"
                    />
                  ))}
                </Picker>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => this.PostNotification()}
              style={styles.buttonContainer}>
              <Text style={styles.buttonText}>Gönder</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        {/*BEKLETMEK için popup uyarısı*/}
        <Modal transparent={true} visible={this.state.waitingAdd}>
          <View style={{backgroundColor: '#000000aa', flex: 1}}>
            <View
              style={{
                backgroundColor: '#ffffff',
                margin: 20,
                marginTop: 200,
                marginBottom: 200,
                padding: 40,
                borderRadius: 5,
                flex: 1,
                alignItems: 'center',
              }}>
              <Text>Duyuru gönderiliyor, lütfen bekleyiniz...</Text>
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
    backgroundColor: '#DDDDE6',
    width: '70%',
    height: 50,
    marginTop: 10,
    borderRadius: 5,
    flexDirection: 'row',
  },
  ders_kodu: {
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
  buttonContainer: {
    backgroundColor: '#20232a',
    marginBottom: 5,
    marginTop: 40,
    borderRadius: 20,
    height: 50,
    width: '60%',
    justifyContent: 'center',
  },
  inputContainer: {
    backgroundColor: '#acacac',
    paddingHorizontal: 10,
    borderRadius: 5,
    marginTop: 10,
    width: '70%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  baslikStyle: {
    flex: 1,
    fontSize: 18,
  },
  icerikStyle: {
    flex: 1,
    height: 100,
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
  backIcon: {
    width: 30,
    height: 30,
  },
  HeaderText: {
    fontSize: 17,
    color: 'white',
  },
});

export default AkademisyenNotifPage;
