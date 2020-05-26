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
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

class Akademisyen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tum_duyurular: [],
      akademisyen_id: this.props.navigation.state.params.passedAkademisyen_id,
      show: false,
      showDelete: false,
      waitingDelete: false,
      loading: false,
      silinecek_duyuru_id: null,
    };
  }
  FetchAllNotifications = async () => {
    await fetch(
      'http://bihaber.ankara.edu.tr/api/GetAllNotificationsForAkademisyen',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          giden_akademisyen_id: this.state.akademisyen_id,
        }),
      },
    )
      .then(response => response.json())
      .then(responseJson => {
        this.setState({tum_duyurular: responseJson});
      })
      .catch(error => {
        console.error(error);
      });
  };
  componentDidMount() {
    this._subscribe = this.props.navigation.addListener('didFocus', () => {
      this.setState({loading: true});
      setTimeout(() => {
        this.setState({loading: false});
        this.FetchAllNotifications();
      }, 2000);
    });
  }
  deletePopup = () => {
    this.setState({showDelete: false, waitingDelete: true});
    setTimeout(() => {
      this.setState({waitingDelete: false});
      this.DeleteNotification(this.state.silinecek_duyuru_id);
    }, 2000);
  };
  BildirimEklemeSayfasinaYonlendir = () => {
    //Alert.alert(JSON.stringify(this.state.akademisyen_id));
    var gonderilen_akademisyen_id = this.state.akademisyen_id;
    this.props.navigation.navigate('AkademisyenNotifPage', {
      gonderilen_akademisyen_id,
    });
    /*this.props.navigation.navigate('AkademisyenNotifPage');*/
    this.setState({didUpdate: true});
  };
  cikis = () => {
    this.setState({show: false});
    this.props.navigation.navigate('Home');
  };
  // DÜZENLE butonuna tıklandığında...
  UpdateNotification = async gelen_bildirim_id => {
    this.props.navigation.navigate('UpdateNotificationAkademisyenPage', {
      gelen_bildirim_id,
    });
  };
  // Sil butonuna tıklandığında...
  DeleteNotification = async gelen_bildirim_id => {
    await fetch('http://bihaber.ankara.edu.tr/api/DeleteNotification', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        silinecek_bildirim_id: gelen_bildirim_id,
      }),
    });
    this.FetchAllNotifications();
  };

  render() {
    // if koşulu içine state değişkenini değiştirilecek.
    return (
      <View style={styles.container}>
        <View ref={this.textRef} style={styles.HeaderContainer}>
          <TouchableOpacity
            onPress={() => {
              this.setState({show: true});
            }}>
            <View style={styles.backIconContainer}>
              <Image
                style={styles.backIcon}
                source={require('../../assets/images/exit.png')}
              />
            </View>
          </TouchableOpacity>
          <View style={styles.PageHeaderContainer}>
            <Text style={styles.HeaderText}>Akademisyen Tüm Bildirimler</Text>
          </View>
          {/* Sağ Üstteki Bildirim ekleme butonu */}
          <TouchableOpacity onPress={this.BildirimEklemeSayfasinaYonlendir}>
            <Icon name="plus" color="white" size={30} style={styles.dersAdd} />
          </TouchableOpacity>
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
                  onPress={() => this.UpdateNotification(item.Duyuru_id)}>
                  <Icon name="edit" size={20} />
                </TouchableOpacity>
                {/*SİL butonu*/}
                <TouchableOpacity
                  style={styles.dersDelete}
                  onPress={() =>
                    this.setState({
                      silinecek_duyuru_id: item.Duyuru_id,
                      showDelete: true,
                    })
                  }>
                  <Icon name="trash" size={20} />
                </TouchableOpacity>
                <Text style={styles.dersText}>{item.Duyuru_baslik}</Text>
              </View>
            )}
          />
          {/*BEKLETMEK için popup uyarısı*/}
          <Modal transparent={true} visible={this.state.waitingDelete}>
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
                <Text>Duyuru siliniyor, lütfen bekleyiniz...</Text>
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
          {/*YÜKLENİYOR için popup uyarısı*/}
          <Modal transparent={true} visible={this.state.loading}>
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
                <Text>Duyurular yükleniyor, lütfen bekleyiniz...</Text>
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
          {/*Silmek için popup uyarısı*/}
          <Modal transparent={true} visible={this.state.showDelete}>
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
                <Text>Silmek istediğinize emin misiniz?</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    margin: 30,
                    justifyContent: 'space-between',
                  }}>
                  <Button title="EVET" onPress={() => this.deletePopup()} />
                  <Button
                    title="HAYIR"
                    onPress={() => {
                      this.setState({showDelete: false});
                    }}
                  />
                </View>
              </View>
            </View>
          </Modal>

          {/*Çıkış için popup ekranı */}
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
                <Text>Çıkış yapmak istediğinize emin misiniz?</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    margin: 30,
                    justifyContent: 'space-between',
                  }}>
                  <Button title="EVET" onPress={() => this.cikis()} />
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
  dersAdd: {
    paddingLeft: 20,
    paddingRight: 20,
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
  PageHeaderContainer: {
    backgroundColor: '#3E53AE',
    height: '100%',
    flex: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  HeaderText: {
    fontSize: 17,
    color: 'white',
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
});
export default Akademisyen;
