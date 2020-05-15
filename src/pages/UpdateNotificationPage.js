/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  StyleSheet,
  Image,
  View,
  Alert,
  Text,
  TouchableOpacity,
  Dimensions,
  Modal,
} from 'react-native';
import {TextInput, ScrollView} from 'react-native-gesture-handler';

export default class UpdateNotification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token_bilgisi: '',
      ders_kodu: '',
      ders_id: '',
      baslik: '',
      icerik: '',
      gelen_bildirim_id: this.props.navigation.state.params.gelen_bildirim_id,
      tokens_arr: [],
      bildirim_durum: '',
      bildirim_detay: [],
      waitingUpdate: false,
      height: Dimensions.get('window').height,
      width: Dimensions.get('window').width,
    };
  }

  componentDidMount = async () => {
    this.NotificationDetails();
  };

  PostNotification = async () => {
    this.setState({waitingUpdate: true});
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
            this.DeletePreviousNotification();
          }
        })
        .catch(error => {
          console.error(error);
        });
      setTimeout(() => {
        this.setState({waitingUpdate: false});
        this.props.navigation.navigate('Duyurular');
      }, 10000);
    } else {
      Alert.alert('Bildirim başlığı veya bildirim içeriği boş geçilemez');
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

  NotificationDetails = async () => {
    await fetch('http://bihaber.ankara.edu.tr/api/NotificationDetails', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        giden_bildirim_id: this.state.gelen_bildirim_id,
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        this.setState({bildirim_detay: responseJson});
        this.setState({
          baslik: this.state.bildirim_detay[0].Duyuru_baslik,
          icerik: this.state.bildirim_detay[0].Duyuru_icerik,
          ders_id: this.state.bildirim_detay[0].Ders_id,
          ders_kodu: this.state.bildirim_detay[0].Ders_kodu,
        });
      })
      .catch(error => {
        console.error(error);
      });
  };
  DeletePreviousNotification = async () => {
    await fetch('http://bihaber.ankara.edu.tr/api/DeletePreviousNotification', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        giden_bildirim_id: this.state.gelen_bildirim_id,
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
              this.props.navigation.navigate('Duyurular');
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
            <Text style={styles.HeaderText}>
              Bildirim Düzenle ve Tekrar Gönder
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
              source={require('../../assets/images/megaphone.png')}
            />
            <View style={styles.inputContainer}>
              <TextInput
                onSubmitEditing={() => this.icerikInput.focus()}
                onChangeText={this.handleNotificationTitleChange}
                value={this.state.baslik}
                placeholder="Bildirim Başlık"
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
                style={styles.icerikStyle}
                autoCapitalize="none"
                autoCorrect={false}
                multiline
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                value={this.state.ders_kodu}
                style={styles.ders_kodu_Style}
                autoCapitalize="none"
                autoCorrect={false}
                autoFocus={true}
                editable={false}
              />
            </View>

            <TouchableOpacity
              onPress={() => this.PostNotification()}
              style={styles.buttonContainer}>
              <Text style={styles.buttonText}>Düzenle ve Tekrar Gönder</Text>
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
                padding: 40,
                borderRadius: 5,
                flex: 1,
                alignItems: 'center',
              }}>
              <Text>Duyuru güncelleniyor, lütfen bekleyiniz...</Text>
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
    width: '60%',
    height: 40,
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
  DropDownContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: '60%',
    height: '8%',
    marginTop: 10,
    flexDirection: 'column',
    justifyContent: 'center',
    borderRadius: 5,
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
  ders_kodu_Style: {
    flex: 1,
    color: 'black',
    textAlign: 'center',
    fontSize: 18,
    height: 50,
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
  HeaderText: {
    fontSize: 17,
    width: 255,
    marginLeft: 30,
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
});
