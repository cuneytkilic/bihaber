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

class Dersler extends Component {
  constructor(props) {
    super(props);

    this.state = {
      my_lessons_arr: [],
      refreshing: false,
      show: false,
      ders_id: '',
      ders_adi: '',
    };
  }
  // SAYFAYI YUKARI KAYDIRARAK RE-RENDER(TEKRAR YÜKLEME) YAPABİLMEMİZİ SAĞLIYOR.
  handleResfresh = () => {
    this.setState({refreshing: true}, () => {
      this.FetchAllLessons();
      this.setState({refreshing: false});
    });
  };
  FetchAllLessons = async () => {
    const response = await fetch('http://bihaber.ankara.edu.tr/api/GetDersler');
    const lessons = await response.json();
    this.setState({my_lessons_arr: lessons}); //html elemanlarının tekrardan render edilmesini sağlar
  };

  componentDidMount() {
    this._subscribe = this.props.navigation.addListener('didFocus', () => {
      this.FetchAllLessons();
    });
  }

  dersEklemeSayfasinaYonlendir = () => {
    this.props.navigation.navigate('AddLesson');
  };

  // Güncelle butonuna tıklandığında...
  UpdateLesson = gelen_ders_id => {
    this.props.navigation.navigate('UpdateLesson', {
      itemId: gelen_ders_id,
    });
  };

  // Sil butonuna tıklandığında...
  DeleteLesson = async gelen_ders_id => {
    await fetch('http://bihaber.ankara.edu.tr/api/DeleteLesson', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        silinecek_ders_id: this.state.ders_id,
      }),
    });
    this.setState({show: false});
  };

  render() {
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
            <Text style={styles.HeaderText}>Tüm Dersler</Text>
          </View>
          {/* Sağ Üstteki Açılır Menü */}
          <View style={styles.addIconContainer}>
            <TouchableOpacity onPress={this.dersEklemeSayfasinaYonlendir}>
              <Icon
                name="plus"
                color="white"
                size={30}
                style={styles.dersAdd}
              />
            </TouchableOpacity>
          </View>
        </View>
        {/* BODY - Tüm Dersler Listesi */}
        <View style={styles.BodyContainer}>
          <FlatList
            data={this.state.my_lessons_arr}
            //item parametresi = tablodaki attribute değerlerinin hepsini tutuyor.
            //örnek: ders_id, ders_adi, ders_adi, ...
            //tabloda kayıtlı olan her satır için renderItem fonksiyonu çalıştırılıyor.
            //Örneğin tablomuzda 5 tane kayıt(satır) var ise renderItem fonksiyonu 5 kere çağrılır.
            renderItem={({item}) => (
              <View style={styles.dersContainer}>
                {/*DÜZENLE butonu*/}
                <TouchableOpacity
                  style={styles.dersEdit}
                  onPress={() => this.UpdateLesson(item.Ders_id)}>
                  <Icon name="edit" size={20} />
                </TouchableOpacity>

                {/*SİL butonu*/}
                <TouchableOpacity
                  style={styles.dersDelete}
                  onPress={() => {
                    this.setState({
                      show: true,
                      ders_id: item.Ders_id,
                      ders_adi: item.Ders_adi,
                    });
                  }}>
                  <Icon name="trash" size={20} />
                </TouchableOpacity>
                <Text style={styles.dersText}>
                  {item.Ders_kodu} - {item.Ders_adi}
                </Text>
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
            refreshing={this.state.refreshing}
            onRefresh={this.handleResfresh}
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
              <Text>
                "{this.state.ders_adi}" dersini silmek istediğinize emin
                misiniz?
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  margin: 30,
                  justifyContent: 'space-between',
                }}>
                <Button
                  title="EVET"
                  onPress={() => this.DeleteLesson(this.state.ders_id)}
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
  dersEdit: {
    height: '100%',
    justifyContent: 'center',
    padding: 5,
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
export default Dersler;
