import React from 'react';
import PropTypes from 'prop-types';
import {
  FlatList, TouchableOpacity, RefreshControl, Image,
} from 'react-native';
import {
  Container, Content, Card, CardItem, Body, Text, Button,
} from 'native-base';
import { Actions } from 'react-native-router-flux';
import Loading from './Loading';
import Error from './Error';
import Header from './Header';
import Spacer from './Spacer';

const RecipeListing = ({
  error,
  loading,
  histories,
  reFetch,
  member,
}) => {
  // Loading
  if (loading) return <Loading />;

  // Error
  if (error) return <Error content={error} />;
  return (<Container>
    <Content padder>

      <FlatList
        numColumns={1}
        data={histories.histories}
        keyExtractor={(item, index) => index}
        renderItem={({ item }) => (
          <Card key={item.id}>
          <CardItem>
            <Text>
              Pemakaian Bulan: {item.bulan}
              {"\n"}
              Pemakaian Tahun: {item.tahun}
              {"\n"}
              ID Pelanggan : {item.id_pelanggan}
              {"\n"}
              Jumlah Pemakaian : {item.jumlah_meteran} m³
              {"\n"}
              Foto Meteran : <Image style={{
                width: 200,
                height: 200,
                resizeMode: 'contain',
              }}
             source={{ uri: item.foto_meteran}}/>
             {"\n"}
             Total yang harus dibayar :
             {
               item.total_bayar
              }
            </Text>
          </CardItem>
        </Card>
        )}
      />

      <Spacer size={20} />
    </Content>
  </Container>
  )
};

RecipeListing.propTypes = {
  error: PropTypes.string,
  reFetch: PropTypes.func,
  member: PropTypes.shape({}),
};

RecipeListing.defaultProps = {
  error: null,
  reFetch: null,
  member: {},
  histories: [],
};

export default RecipeListing;
