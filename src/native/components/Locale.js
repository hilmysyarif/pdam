import React, { Component } from "react";
import PropTypes from "prop-types";
import { ImagePicker } from 'expo';
import { FlatList, Image } from "react-native";
import { Firebase, FirebaseRef } from "../../lib/firebase";
import ErrorMessages from "../../constants/errors";
import {
  Container,
  Content,
  Card,
  CardItem,
  Text,
  Form,
  Item,
  Label,
  Input,
  Button,
  View
} from "native-base";
import { Actions } from "react-native-router-flux";
import Header from "./Header";
import { translate } from "../../i18n";
import Spacer from "./Spacer";

class Locale extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      jumlah_meteran: 0,
      foto_meteran: "",
      bulan: "",
      tahun: "",
      id_pelanggan: "",
      last_history: props['last_history'],
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }



  _pickImage = async () => {
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    this._handleImagePicked(pickerResult);
  };

  _handleImagePicked = async pickerResult => {
    try {
      this.setState({ uploading: true });

      if (!pickerResult.cancelled) {
        uploadUri = this.uploadImageAsync(pickerResult.uri);
        this.setState({ foto_meteran: pickerResult.uri});
      }
    } catch (e) {
      console.log(e);
      alert('Upload failed, sorry :(');
    } finally {
      this.setState({ uploading: false });
    }
  };

   uploadImageAsync = async (uri) => {
    // Why are we using XMLHttpRequest? See:
    // https://github.com/expo/expo/issues/2402#issuecomment-443726662
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function() {
        resolve(xhr.response);
      };
      xhr.onerror = function(e) {
        console.log(e);
        reject(new TypeError('Network request failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
    });

    const ref = Firebase
      .storage()
      .ref()
      .child(this.state.tahun + '-' + this.state.bulan + '-' + this.state.id_pelanggan).put(blob)
      .then(snapshot => {
          return snapshot.ref.getDownloadURL();   // Will return a promise with the download link
      })
      .then(downloadURL => {
         return downloadURL;
      })
      .catch(error => {
         // Use to signal error if something goes wrong.
         console.log(`Failed to upload file and get link - ${error}`);
      })
    // We're done with the blob, close and release it
    // blob.close();

  }

  handleChange(name, val) {
    this.setState({
      [name]: val
    });
  }

  handleSubmit() {
    const UID = Firebase.auth().currentUser.uid;

    const data = {
      jumlah_meteran: this.state.jumlah_meteran,
      bulan: this.state.bulan,
      tahun: this.state.tahun,
      id_pelanggan: this.state.id_pelanggan,
      foto_meteran: this.state.foto_meteran,
      uid: UID
    };
    Firebase.database().ref('/history/meteran/' + UID + '/' + this.state.last_history['tahun'] + '/' + (this.state.last_history['bulan'])).once('value').then(function(snapshot) {
      if(snapshot.val()!= null){
        var pemakaian_bulan_lalu = snapshot.val().jumlah_meteran;
        var pemakaian_saat_ini = data['jumlah_meteran'];
        var total_pemakaian = pemakaian_saat_ini - pemakaian_bulan_lalu;
        var total_bayar = 0;
        if(total_pemakaian > 0){
          if(total_pemakaian >= 1 && total_pemakaian <= 10){
            total_bayar = total_pemakaian * 300;
          }else if(total_pemakaian >= 11 && total_pemakaian <= 20){
            total_bayar = total_pemakaian * 400;
          }else if(total_pemakaian >= 21 && total_pemakaian <= 30){
            total_bayar = total_pemakaian * 500;
          }else if(total_pemakaian >= 31 && total_pemakaian <= 40){
            total_bayar = total_pemakaian * 600;
          }else if(total_pemakaian >= 41){
            total_bayar = total_pemakaian * 1000;
          }

          Firebase.database().ref('history/meteran/' + UID + '/' + data['tahun'] + '/' + data['bulan']).set({
              bulan: data['bulan'],
              tahun: data['tahun'],
              id_pelanggan: data['id_pelanggan'],
              jumlah_meteran: data['jumlah_meteran'],
              total_bayar: total_bayar,
              foto_meteran: data['foto_meteran'],

          })
          console.log('berhasil menambahkan data');

        }

      }else{
        var pemakaian_bulan_lalu = null;
        var pemakaian_saat_ini = data['jumlah_meteran'];
        var total_pemakaian = pemakaian_saat_ini;
        var total_bayar = 0;
        if(total_pemakaian > 0){
          if(total_pemakaian >= 1 && total_pemakaian <= 10){
            total_bayar = total_pemakaian * 300;
          }else if(total_pemakaian >= 11 && total_pemakaian <= 20){
            total_bayar = total_pemakaian * 400;
          }else if(total_pemakaian >= 21 && total_pemakaian <= 30){
            total_bayar = total_pemakaian * 500;
          }else if(total_pemakaian >= 31 && total_pemakaian <= 40){
            total_bayar = total_pemakaian * 600;
          }else if(total_pemakaian >= 41){
            total_bayar = total_pemakaian * 1000;
          }

          Firebase.database().ref('history/meteran/' + UID + '/' + data['tahun'] + '/' + data['bulan']).set({
              bulan: data['bulan'],
              tahun: data['tahun'],
              id_pelanggan: data['id_pelanggan'],
              jumlah_meteran: data['jumlah_meteran'],
              total_bayar: total_bayar,
              foto_meteran: data['foto_meteran'],

          })
          console.log('berhasil menambahkan data');
        }
      }
    });
  }

  renderCards(item, key) {
    return item ? (
      <Card key={key}>
        <CardItem>
          <Text>
            ID Pelanggan : {item["id_pelanggan"]}
            {"\n"}
            Jumlah Pemakaian : {item.jumlah_meteran} m³
            {"\n"}
            Foto Meteran :{" "}
            <Image
              style={{
                width: 200,
                height: 200,
                resizeMode: "contain"
              }}
              source={{ uri: item.foto_meteran }}
            />
            {"\n"}
            Total yang harus dibayar :
            {item.jumlah_meteran >= 1 && item.jumlah_meteran <= 10
              ? " Rp. " + item.jumlah_meteran * 300
              : item.jumlah_meteran >= 11 && item.jumlah_meteran <= 20
              ? " Rp. " + item.jumlah_meteran * 400
              : item.jumlah_meteran >= 21 && item.jumlah_meteran <= 30
              ? " Rp. " + item.jumlah_meteran * 500
              : item.jumlah_meteran >= 31 && item.jumlah_meteran <= 40
              ? " Rp. " + item.jumlah_meteran * 600
              : item.jumlah_meteran >= 41
              ? " Rp. " + item.jumlah_meteran * 1000
              : ""}
          </Text>
        </CardItem>
      </Card>
    ) : (
      <Card key={key} />
    );
  }

  render() {
    const { histories } = this.props;
    return (
      <Container>
        <Content padder>
          <Header title="Pemakaian saat ini" />
          <Card>
            <CardItem>
              <Text>
                Pemakaian Bulan : {new Date().getMonth() + 1} -{" "}
                {new Date().getFullYear()}
                {'\n'}
                Pemakaian Bulan Lalu : {this.state.last_history['jumlah_meteran'] || 0}
              </Text>
            </CardItem>
          </Card>
          {(histories.length > 0 || histories) ? (
            <Card key={histories['id_pelanggan']}>
              <CardItem>
                <Text>
                  ID Pelanggan : {histories['id_pelanggan']}
                  {"\n"}
                  Jumlah Pemakaian : {histories['jumlah_meteran']} m³
                  {"\n"}
                  Foto Meteran :{" "}
                  <Image
                    style={{
                      width: 200,
                      height: 200,
                      resizeMode: "contain"
                    }}
                    source={{ uri: histories['foto_meteran'] }}
                  />
                  {"\n"}
                  Total yang harus dibayar :
                  {" Rp. " + histories['total_bayar']}
                </Text>
              </CardItem>
            </Card>
          ) : (
            <Card>
              <Form>
              <Item stackedLabel>
                  <Label>{translate("Pelanggan")}</Label>
                  <Input
                    autoCapitalize="none"
                    value={this.state.id_pelanggan}
                    keyboardType="default"
                    onChangeText={v => this.handleChange("id_pelanggan", v)}
                  />
                </Item>

                <Item stackedLabel>
                  <Label>{translate("Pemakaian")}</Label>
                  <Input
                    autoCapitalize="none"
                    value={this.state.jumlah_meteran}
                    keyboardType="numeric"
                    onChangeText={v => this.handleChange("jumlah_meteran", v)}
                  />
                </Item>
                <Item stackedLabel>
                  <Label>{translate("Bulan")}</Label>
                  <Input
                    autoCapitalize="none"
                    value={this.state.bulan}
                    keyboardType="numeric"
                    onChangeText={v => this.handleChange("bulan", v)}
                  />
                </Item>
                <Item stackedLabel>
                  <Label>{translate("Tahun")}</Label>
                  <Input
                    autoCapitalize="none"
                    value={this.state.tahun}
                    keyboardType="numeric"
                    onChangeText={v => this.handleChange("tahun", v)}
                  />
                </Item>
                <Item stackedLabel>
                  <Label>{translate("Foto")}</Label>

                </Item>
                <View padder>
                  <Button block onPress={this._pickImage}>
                    <Text>Pilih Foto Meteran</Text>
                  </Button>
                </View>
                <Spacer size={30} />
                <View padder>
                  <Button block onPress={this.handleSubmit}>
                    <Text>Kirim</Text>
                  </Button>
                </View>
                <Spacer size={20} />
              </Form>
            </Card>
          )}
        </Content>
      </Container>
    );
  }
}

export default Locale;
