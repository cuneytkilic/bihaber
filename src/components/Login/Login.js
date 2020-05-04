import React, {Component} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  View,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  YellowBox,
} from 'react-native';

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      my_res_arr: [],
      user_name: '',
      password: '',
    };

    YellowBox.ignoreWarnings([
      'Warning: componentWillMount is deprecated',
      'Warning: componentWillReceiveProps is deprecated',
    ]);
  }

  FindTheAdmin = async (gelen_username, gelen_password) => {
    await fetch('http://192.168.56.1:4550/LoginProcess', {
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
          Alert.alert('sonuc döndü');
          this.props.navigation.navigate('AdminPage');
        } else {
          //Eğer girilen bilgiler doğru değilse buraya girecek
          Alert.alert('Uye bulunamadi.');
        }
      })
      .catch(error => {
        console.error(error);
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
  OturumAc() {
    return this.props.navigation.navigate('AdminPage');
  }
  render() {
    return (
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            style={styles.logo}
            source={require('../../../assets/images/logo.png')}
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
              onPress={() => this.OturumAc()}
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
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#20232a',
  },
  logoContainer: {
    paddingTop: 30,
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
    marginTop: 50,
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
    marginTop: 40,
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
  },
  iconStyle: {
    width: 20,
  },
  text: {
    marginTop: 20,
    color: 'rgba(255,255,255,0.7)',
  },
});
