/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  ImageBackground,
} from 'react-native';

class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [
        {
          id: 1,
          title: 'Ders Ekle/Çıkar/Güncelle',
          image: require('../../assets/images/research_icon.png'),
        },
        {
          id: 2,
          title: 'Akademisyen Ekle/Çıkar',
          image: require('../../assets/images/user.png'),
        },
        {
          id: 3,
          title: 'Duyuru Ekle/Sil',
          image: require('../../assets/images/megaphone.png'),
        },
        {
          id: 4,
          title: 'Ders-Akademisyen İlişkilendirme',
          image: require('../../assets/images/iliskilendirme.png'),
        },
        {
          id: 5,
          title: 'Aktif Dönem Değiştir',
          image: require('../../assets/images/exchange.png'),
        },
      ],
    };
  }

  clickEventListener(gelen) {
    switch (gelen) {
      case 1:
        this.props.navigation.navigate('Dersler');
        break;
      case 2:
        this.props.navigation.navigate('AkademisyenPage');
        break;
      case 3:
        this.props.navigation.navigate('Duyurular');
        break;
      case 4:
        this.props.navigation.navigate('DersAkademisyen');
        break;
      case 5:
        this.props.navigation.navigate('AktifDonem');
        break;
      //bunu her durum için yazarsın
    }
  }

  render() {
    return (
      <ImageBackground
        style={{
          width: '100%',
          height: '100%',
          flex: 1,
          alignItems: 'flex-start',
        }}
        backgroundColor={'#3E53AE'}>
        <View style={{paddingTop: 0, width: '100%'}}>
          <FlatList
            style={styles.list}
            contentContainerStyle={styles.listContainer}
            data={this.state.data}
            horizontal={false}
            numColumns={1}
            keyExtractor={item => {
              return item.id.toString();
            }}
            renderItem={({item}) => {
              return (
                <TouchableOpacity
                  style={styles.cardBody}
                  onPress={() => this.clickEventListener(item.id)}>
                  <Image style={styles.cardImage} source={item.image} />
                  <View style={styles.cardText}>
                    <Text style={styles.text}>{item.title}</Text>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    fontSize: 17,
  },
  list: {
    paddingTop: 50,
    height: '100%',
  },
  /******** card **************/
  cardBody: {
    alignItems: 'center',
    height: 50,
    flexDirection: 'row',
    borderRadius: 20,
    shadowColor: '#00000021',
    shadowOffset: {
      width: 10,
      height: 6,
    },
    shadowOpacity: 0.97,
    shadowRadius: 7.49,
    backgroundColor: '#F5F5F5',
    marginVertical: 20,
    flexBasis: '42%',
    marginHorizontal: 20,
  },
  cardText: {
    width: '80%',
    height: '100%',
    marginLeft: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
  },
  cardImage: {
    height: '80%',
    width: '11.6%',
    marginLeft: 10,
  },
});

export default Admin;
