/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Button,
  Modal,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
class Duyurular extends Component {
  constructor(props) {
    super(props);

    this.state = {
      teachers: [],
      yonetim_id: '',
      akademisyen_adi: '',
      show: false,
    };
  }
  FetchAllTeachers = async () => {
    const response = await fetch(
      'http://bihaber.ankara.edu.tr/api/GetAllTeachers',
    );
    const ogretmenler = await response.json();
    this.setState({tum_duyurular: ogretmenler});
  };

  componentDidMount() {
    this._subscribe = this.props.navigation.addListener('didFocus', () => {
      this.FetchAllTeachers();
    });
  }

  OgretmenEklemeSayfasinaYonlendir = () => {
    this.props.navigation.navigate('AddAkademisyen');
  };

  // Sil butonuna tıklandığında...
  DeleteTeacher = async ogretmen_id => {
    await fetch('http://bihaber.ankara.edu.tr/api/DeleteTeacher', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        silinecek_ogretmen_id: ogretmen_id,
      }),
    });
    this.FetchAllTeachers();
    this.setState({show: false});
  };

  render() {
    // if koşulu içine state değişkenini değiştirilecek.
    return (
      <View style={styles.container}>
        <View ref={this.textRef} style={styles.HeaderContainer}>
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
          <View style={styles.PageHeaderContainer}>
            <Text style={styles.HeaderText}>Akademisyen Listesi</Text>
          </View>
          {/* Sağ Üstteki Bildirim ekleme butonu */}
          <View style={styles.addIconContainer}>
            <TouchableOpacity onPress={this.OgretmenEklemeSayfasinaYonlendir}>
              <Icon
                name="plus"
                color="white"
                size={30}
                style={styles.dersAdd}
              />
            </TouchableOpacity>
          </View>
        </View>
        {/* BODY - Tüm Bildirimlerin Listesi */}
        <View style={styles.BodyContainer}>
          <FlatList
            data={this.state.tum_duyurular}
            keyExtractor={(item, index) => index.toString()}
            //item parametresi = tablodaki attribute değerlerinin hepsini tutuyor.
            //örnek: ders_id, ders_adi, ders_adi, ...
            //tabloda kayıtlı olan her satır için renderItem fonksiyonu çalıştırılıyor.
            //Örneğin tablomuzda 5 tane kayıt(satır) var ise renderItem fonksiyonu 5 kere çağrılır.
            renderItem={({item}) => (
              <View style={styles.dersContainer}>
                {/*DÜZENLE butonu*/}
                <TouchableOpacity
                  style={styles.dersDelete}
                  onPress={() =>
                    this.props.navigation.navigate('UpdateAkademisyen', {
                      gonderilen_akademisyen_id: item.Yonetim_id,
                    })
                  }>
                  <Icon name="edit" size={20} />
                </TouchableOpacity>
                {/*SİL butonu*/}
                <TouchableOpacity
                  style={styles.dersDelete}
                  onPress={() => {
                    this.setState({
                      show: true,
                      yonetim_id: item.Yonetim_id,
                      akademisyen_adi: item.AdSoyad,
                    });
                  }}>
                  <Icon name="trash" size={20} />
                </TouchableOpacity>
                <Text style={styles.dersText}>{item.AdSoyad}</Text>
              </View>
            )}
            //refreshing={this.state.refreshing}
            //onRefresh={this.handleResfresh}
          />
        </View>
        <Modal transparent={true} visible={this.state.show}>
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
              }}>
              <Text>"{this.state.akademisyen_adi}" silinsin mi?</Text>
              <View
                style={{
                  flexDirection: 'row',
                  margin: 30,
                  justifyContent: 'space-between',
                }}>
                <Button
                  title="EVET"
                  onPress={() => this.DeleteTeacher(this.state.yonetim_id)}
                />
                <Button
                  title="HAYIR"
                  onPress={() => {
                    this.setState({show: false});
                  }}
                />
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  dersContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    height: 50,
    marginTop: 5,
  },
  dersText: {
    backgroundColor: '#DDDDE6',
    borderBottomWidth: 1,
    borderBottomColor: '#B6B1B1',
    width: '80%',
    height: '100%',
    paddingLeft: '5%',
    textAlignVertical: 'center',
  },
  dersDelete: {
    height: '100%',
    justifyContent: 'center',
    padding: 5,
  },
  ogretmenEkle: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  container: {
    backgroundColor: 'green',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  HeaderContainer: {
    backgroundColor: '#3E53AE',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
  },
  BodyContainer: {
    backgroundColor: '#DDDDE6',
    width: '100%',
    flex: 10,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  HeaderText: {
    fontSize: 17,
    color: 'white',
  },
  PageHeaderContainer: {
    backgroundColor: '#3E53AE',
    height: '100%',
    flex: 10,
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
  addIconContainer: {
    width: '15%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    width: 30,
    height: 30,
  },
});
export default Duyurular;
