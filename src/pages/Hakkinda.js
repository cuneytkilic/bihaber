import React, {Component} from 'react';
import {View, Text, StyleSheet, ImageBackground} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';

class Dersler extends Component {
  render() {
    return (
      <View style={styles.container}>
        <ImageBackground
          source={require('../../assets/images/hakkinda_bg.png')}
          style={styles.image}>
          <ScrollView>
            <Text style={styles.baslik}>BiHaber</Text>
            <Text style={styles.yazi}>
              Bu uygulama Ankara Üniversitesi Bilgisayar Mühendisliği bölümü
              için yapılmıştır.
            </Text>

            <Text style={styles.baslik}>Hazırlayanlar</Text>
            <Text style={styles.yazi}>Cüneyt KILIÇ</Text>
            <Text style={styles.yazi}>Berat Burak KAYA</Text>
            <Text style={styles.yazi}>Ömer Faruk ARSLAN</Text>

            <Text style={styles.baslik}>Danışmanlar</Text>
            <Text style={styles.yazi}>Prof.Dr. Refik SAMET</Text>

            <Text style={styles.baslik}>Teşekkürler</Text>
            <Text style={styles.yazi}>
              Proje geliştirilmesi süresince önerileri ile destek olan Arş. Gör.
              Özge MERCANOĞLU SİNCAN ve Arş. Gör. Zeynep YILDIRIM'a,
              Uygulamamızın icon tasarımını yapan Onur ŞENTÜRE'ye teşekkür
              ederiz.
            </Text>
          </ScrollView>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  baslik: {
    paddingTop: 30,
    textAlign: 'center',
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3E53AE',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    opacity: 1,
  },
  text: {
    color: 'black',
    fontWeight: 'bold',
  },
  yazi: {
    textAlign: 'center',
    fontSize: 17,
  },
});
export default Dersler;
