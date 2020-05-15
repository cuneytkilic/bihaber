/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Modal,
  Button,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
class Duyurular extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tum_duyurular: [],
      showDelete: false,
      silinecek_duyuru_id: null,
    };
  }
  componentDidMount() {
    this._subscribe = this.props.navigation.addListener('didFocus', () => {
      this.FetchAllNotifications();
    });
  }
  deletePopup = () => {
    this.DeleteNotification(this.state.silinecek_duyuru_id);
    this.setState({showDelete: false});
  };
  FetchAllNotifications = async () => {
    const response = await fetch(
      'http://bihaber.ankara.edu.tr/api/GetAllNotifications',
    );
    const notifications = await response.json();
    this.setState({tum_duyurular: notifications});
  };

  BildirimEklemeSayfasinaYonlendir = () => {
    this.props.navigation.navigate('NotificationAddPage');
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

  // DÜZENLE butonuna tıklandığında...
  UpdateNotification = async gelen_bildirim_id => {
    this.props.navigation.navigate('UpdateNotificationPage', {
      gelen_bildirim_id,
    });
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
            <Text style={styles.HeaderText}>Tüm Bildirimler</Text>
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
        </View>
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
export default Duyurular;
