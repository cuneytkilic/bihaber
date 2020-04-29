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
export default class AktfiDonem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      aktif_donem: 'Güz Dönemi',
      height: Dimensions.get('window').height,
      width: Dimensions.get('window').width,
    };
  }
  onAktifDonemValueChange(value) {
    this.setState({
      aktif_donem: value,
    });
  }

  kaydet = async () => {
    await fetch('http://bihaber.ankara.edu.tr/api/AktifDonemDegistir', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        gonderilen_aktif_donem: this.state.aktif_donem,
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        Alert.alert(
          'Güncel Dönem ' + this.state.aktif_donem + ' olarak ayarlandı.',
        );
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
              this.props.navigation.navigate('AdminPage');
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
            <Text style={styles.HeaderText}>Aktif Dönem Değiştirme</Text>
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
              source={require('../images/iliskilendirme.png')}
            />

            {/*//Aktif Dönemi seçmek için DropDownList*/}
            <View style={styles.PickerContainer}>
              <View style={styles.akademisyen}>
                <Picker
                  itemStyle={styles.pickerItem}
                  mode="dropdown"
                  selectedValue={this.state.aktif_donem}
                  onValueChange={this.onAktifDonemValueChange.bind(this)}>
                  <Picker.Item label="Güz Dönemi" value="Güz Dönemi" />
                  <Picker.Item label="Bahar Dönemi" value="Bahar Dönemi" />
                  <Picker.Item label="Yaz Dönemi" value="Yaz Dönemi" />
                </Picker>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => this.kaydet()}
              style={styles.buttonContainer}>
              <Text style={styles.buttonText}>Kaydet</Text>
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
  buttonContainer: {
    backgroundColor: '#20232a',
    marginBottom: 5,
    marginTop: 40,
    borderRadius: 20,
    height: 40,
    width: 200,
    justifyContent: 'center',
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
