import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';

class Dersler extends Component {
  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          <Text style={styles.baslik}>BiHaber</Text>
          <Text style={styles.yazi}>
            Bu uygulama Ankara Üniversitesi Bilgisayar Mühendisliği bölümü için
            yapılmıştır.
          </Text>

          <Text style={styles.baslik}>Hazırlayanlar</Text>
          <Text style={styles.yazi}>Cüneyt Kılıç</Text>
          <Text style={styles.yazi}>Berat Burak Kaya</Text>
          <Text style={styles.yazi}>Ömer Faruk Arslan</Text>

          <Text style={styles.baslik}>Danışmanlar</Text>
          <Text style={styles.yazi}>Prof.Dr. Refik Samet</Text>
          <Text style={styles.yazi}>Zeynep Yıldırım</Text>
          <Text style={styles.yazi}>Özge Mercanoğlu Sincan</Text>

          <Text style={styles.baslik}>Teşekkürler</Text>
          <Text style={styles.yazi}>App Icon Tasarımcısı</Text>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  baslik: {
    paddingTop: 30,
    textAlign: 'center',
    fontFamily: 'SFUIDisplay-Bold',
    fontSize: 24,
    color: 'red',
  },
  yazi: {
    textAlign: 'center',
    fontSize: 16,
  },
});
export default Dersler;
