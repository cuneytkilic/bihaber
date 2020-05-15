/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {Container, Tab, Tabs, TabHeading, Text} from 'native-base';
import PushNotification from 'react-native-push-notification';
import Tab1 from './TabOne';
import Tab2 from './TabTwo';
import Tab3 from './TabThree';
import {
  Image,
  View,
  StyleSheet,
  Button,
  KeyboardAvoidingView,
  TextInput,
  Alert,
  TouchableOpacity,
  YellowBox,
  PushNotificationIOS,
} from 'react-native';
import firebase from 'react-native-firebase';
import Icon from 'react-native-vector-icons/FontAwesome';
import AdminPage from './src/pages/Admin';
import LoginPage from './src/components/Login/Login';
import AddLesson from './src/pages/AddLesson';
import UpdateLesson from './src/pages/UpdateLesson';
import Dersler from './src/pages/Dersler';
import Duyurular from './src/pages/Duyurular';
import NotificationAddPage from './src/pages/NotificationAddPage';
import AkademisyenPage from './src/pages/AkademisyenPage';
import AkademisyenNotifPage from './src/pages/AkademisyenNotifPage';
import DersAkademisyen from './src/pages/DersAkademisyen';
import AddAkademisyen from './src/pages/AddAkademisyen';
import Akademisyen from './src/pages/Akademisyen';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import RBSheet from 'react-native-raw-bottom-sheet';
import {sha256} from 'react-native-sha256';

class MainPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      my_res_arr: [],
      user_name: '',
      password: '',
      token_control_arr: [],
    };
    YellowBox.ignoreWarnings([
      'Warning: componentWillMount is deprecated',
      'Warning: componentWillReceiveProps is deprecated',
    ]);
  }
  componentDidMount() {
    this.get_token();
  }
  get_token = async () => {
    const fcmToken = await firebase.messaging().getToken();
    await fetch('http://192.168.220.2:4550/TokenKontrol', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        giden_token: fcmToken,
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        this.setState({token_control_arr: responseJson});
        if (this.state.token_control_arr.length === 0) {
          //ekleme işlemi yapılacak
          this.token_kaydet(fcmToken);
        } else {
          console.log('token zaten var.');
        }
      })
      .catch(error => {
        console.error(error);
      });
  };
  token_kaydet = async token => {
    await fetch('http://192.168.220.2:4550/TokenKaydet', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        giden_token: token,
      }),
    })
      .then(response => response.text())
      .then(responseJson => {})
      .catch(error => {
        console.error(error);
      });
  };
  LoginKontrol = async (gelen_username, gelen_password) => {
    await fetch('http://192.168.220.2:4550/LoginProcess', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Kullanici_Ad: gelen_username,
        Sifre: gelen_password,
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        this.setState({my_res_arr: responseJson});
        if (this.state.my_res_arr.length > 0) {
          //Eğer girilen bilgiler doğruysa buraya girecek
          var yetki_control = '';
          var passedAkademisyen_id = 0;
          this.state.my_res_arr.map(x => (yetki_control = x.Yetki));
          this.state.my_res_arr.map(
            item => (passedAkademisyen_id = item.Yonetim_id),
          );

          if (yetki_control === '0') {
            this.Scrollable.close(); //bottomPage kapatmak için.
            this.setState({user_name: '', password: ''});
            this.props.navigation.navigate('AdminPage');
          } else {
            this.Scrollable.close();
            this.setState({user_name: '', password: ''});
            this.props.navigation.navigate('Akademisyen', {
              passedAkademisyen_id,
            });
          }
        } else {
          //Eğer girilen bilgiler doğru değilse buraya girecek
          Alert.alert('Uye bulunamadi.');
          this.Scrollable.close(); //bottomPage kapatmak için.
          //this.props.navigation.navigate('AdminPage');
        }
      })
      .catch(error => {
        console.error(error);
      });
  };
  FindTheAdmin = async (gelen_username, gelen_password) => {
    sha256(gelen_password).then(hashed_password => {
      this.LoginKontrol(gelen_username, hashed_password);
    });
  };
  goToMainActivity = () => {
    //Alert.alert("main activity e gidilecek");
    this.FindTheAdmin(this.state.user_name, this.state.password);
  };

  handleUserNameChange = Kullanici_Ad => {
    this.setState({user_name: Kullanici_Ad});
  };

  handlePasswordChange = password => {
    this.setState({password: password});
  };
  derslerim = async () => {
    const fcmToken = await firebase.messaging().getToken();
    await fetch('http://192.168.220.2:4550/derslerim_goruntule', {
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
  render() {
    return (
      <Container style={styles.mainContainer}>
        <View style={styles.headerContainer}>
          <View style={styles.headerLeftContainer}>
            <Image
              style={{width: 45, height: 45}}
              source={require('./src/images/logo.png')}
            />
            <Text style={{paddingLeft: 5, color: 'white', fontSize: 20}}>
              Bi'Haber
            </Text>
          </View>
          <View>
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Button
                title="Login"
                onPress={() => {
                  this.Scrollable.open();
                }}
              />

              {/* Grid Menu */}
              <RBSheet
                ref={ref => {
                  this.Scrollable = ref;
                }}
                closeOnDragDown
                customStyles={{
                  container: {
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                  },
                }}
                height={500}>
                <KeyboardAvoidingView
                  behavior="padding"
                  style={styles.container}>
                  <View style={styles.logoContainer}>
                    <Image
                      style={styles.logo}
                      source={require('./src/images/logo.png')}
                    />
                  </View>
                  <View style={styles.formContainer}>
                    <View style={styles.loginForm}>
                      <View style={styles.usernameContainer}>
                        <Icon style={styles.iconStyle} name="user" size={20} />
                        <TextInput
                          onSubmitEditing={() => this.passwordInput.focus()}
                          placeholderTextColor="rgba(255,255,255,0.4)"
                          style={styles.inputStyle}
                          autoCapitalize="none"
                          autoCorrect={false}
                          placeholder="Username"
                          value={this.state.user_name}
                          onChangeText={this.handleUserNameChange}
                        />
                      </View>
                      <View style={styles.passwordContainer}>
                        <Icon style={styles.iconStyle} name="key" size={20} />
                        <TextInput
                          ref={input => (this.passwordInput = input)}
                          placeholderTextColor="rgba(255,255,255,0.4)"
                          style={styles.inputStyle}
                          autoCapitalize="none"
                          autoCorrect={false}
                          secureTextEntry
                          placeholder="Password"
                          value={this.state.password}
                          onChangeText={this.handlePasswordChange}
                        />
                      </View>
                      <TouchableOpacity
                        onPress={() => this.goToMainActivity()}
                        style={styles.buttonContainer}>
                        <Text style={styles.buttonText}>Oturum Aç</Text>
                      </TouchableOpacity>
                      <View>
                        <TouchableOpacity>
                          <Text style={styles.text}>Şifreni mi unuttun?</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </KeyboardAvoidingView>
              </RBSheet>
            </View>
          </View>
        </View>
        <Tabs tabBarPosition="top">
          <Tab
            heading={
              <TabHeading>
                <Image
                  source={require('./assets/images/bell.png')}
                  style={{width: 25, height: 25}}
                />
                <Text>Duyurular</Text>
              </TabHeading>
            }>
            <Tab1 />
          </Tab>

          <Tab
            heading={
              <TabHeading>
                <Image
                  source={require('./assets/images/contacts_book_icon.png')}
                  style={{width: 25, height: 25}}
                />
                <Text>Derslerim</Text>
              </TabHeading>
            }>
            <Tab2 degiskenDeneme={'cuneytkilic'} />
          </Tab>

          <Tab
            heading={
              <TabHeading>
                <Image
                  source={require('./assets/images/books_icon.png')}
                  style={{width: 25, height: 25}}
                />
                <Text>Tüm Dersler</Text>
              </TabHeading>
            }>
            <Tab3 />
          </Tab>
        </Tabs>
      </Container>
    );
  }
}
const AppNavigator = createStackNavigator(
  {
    Home: MainPage,
    AdminPage: AdminPage,
    AkademisyenPage: AkademisyenPage,
    AkademisyenNotifPage: AkademisyenNotifPage,
    DersAkademisyen: DersAkademisyen,
    LoginPage: LoginPage,
    AddLesson: AddLesson,
    UpdateLesson: UpdateLesson,
    Akademisyen: Akademisyen,
    Dersler: Dersler,
    Duyurular: Duyurular,
    NotificationAddPage: NotificationAddPage,
    AddAkademisyen: AddAkademisyen,
  },
  {
    initialRouteName: 'Home',
    headerMode: 'none',
  },
);
export default createAppContainer(AppNavigator);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#20232a',
  },
  logoContainer: {
    marginTop: '30%',
  },
  logo: {
    width: 100,
    height: 100,
  },
  formContainer: {
    marginTop: 20,
    borderRadius: 10,
    backgroundColor: '#20232a',
    width: 300,
    height: 300,
  },
  loginForm: {
    alignItems: 'center',
    height: 200,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    borderRadius: 5,
    margin: 5,
    color: 'white',
    height: 40,
    width: 250,
  },
  buttonContainer: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginBottom: 5,
    marginTop: 20,
    borderRadius: 20,
    height: 40,
    width: 200,
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    padding: 5,
  },
  usernameContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    borderRadius: 5,
    margin: 5,
    height: 40,
    width: 250,
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
  iconStyle: {
    width: 20,
  },
  text: {
    marginTop: 20,
    color: 'rgba(255,255,255,0.7)',
  },
  mainContainer: {
    padding: 0,
    margin: 0,
  },
  headerContainer: {
    padding: 5,
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#3E53AE',
  },
  headerLeftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
});
//*////////////////////************************************************* */
const messaging = firebase.messaging();

messaging
  .hasPermission()
  .then(enable => {
    if (enable) {
      // user has permissions
      messaging
        .getToken()
        .then(token => {
          console.log('token degeri: ' + token);
        })
        .catch(error => {});
    } else {
      // user doesn't have permission
      messaging
        .requestPermission()
        .then(() => {})
        .catch(error => {});
    }
  })
  .catch(error => {});
//*********************************************************************** */
PushNotification.configure({
  // (optional) Called when Token is generated (iOS and Android)
  onRegister: function(token) {
    console.log('TOKEN:', token);
  },

  // (required) Called when a remote or local notification is opened or received
  onNotification: function(notification) {
    console.log('NOTIFICATION:', notification);

    // process the notification

    // required on iOS only (see fetchCompletionHandler docs: https://github.com/react-native-community/react-native-push-notification-ios)
    notification.finish(PushNotificationIOS.FetchResult.NoData);
  },

  // ANDROID ONLY: GCM or FCM Sender ID (product_number) (optional - not required for local notifications, but is need to receive remote push notifications)
  senderID: '1067143997640',

  // IOS ONLY (optional): default: all - Permissions to register.
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },

  // Should the initial notification be popped automatically
  // default: true
  popInitialNotification: true,

  /**
   * (optional) default: true
   * - Specified if permissions (ios) and token (android and ios) will requested or not,
   * - if not, you must call PushNotificationsHandler.requestPermissions() later
   */
  // bildirim gönderme isteği default olarak true verdik. Kullanıcı belki bildirimleri kapatmak isteyebilir ?
  // bildirim göndermek için izin istememiz gerekebilir ?
  requestPermissions: true,
});
