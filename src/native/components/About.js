import React from 'react';
import PropTypes from 'prop-types';
import {
  FlatList, TouchableOpacity, RefreshControl, Image,
} from 'react-native';
import {
  ListItem, Container, Content,  Card, CardItem, Text, Button, H1, H2, H3, Left, Body, Icon, Right, Title
} from 'native-base';
import Spacer from './Spacer';

class About extends React.Component {

  renderCards(item, key){
    return item ? (
      <Card key={key}>
        <CardItem header bordered>
          <Text>
          {item['judul']}
          </Text>
        </CardItem>
        <CardItem>
          <Text>
            {item['content']}
          </Text>
        </CardItem>
      </Card>
    ) : (
      <Card key={key} />
    );
  }

  render() {
    const { beritas } = this.props;
    return (
      <Container>
      <Content padder>
        <H1>
          Selamat datang di {'\n'}BUMDES Apps!
        </H1>
        <Text>
          Aplikasi ini di buat untuk memudahkan pelanggan BUMDES Kertawinangun untuk mengecek tagihan bulanan ataupun meng-kalkulasi pemakaian bulanan dari
          awal hingga saat ini.
          {' '}
        </Text>
        <Text>{'\n'}</Text>
        <H2>
          Berita terbaru
        </H2>
        <FlatList
          numColumns={1}
          data={beritas}
          keyExtractor={(item, index) => index}
          renderItem={({ item }) => {
            var i = 0;
            const result = this.renderCards(item, i);
            i++;
            return result;
          }}
        />
      </Content>
    </Container>
    );
  }
}
export default About;
