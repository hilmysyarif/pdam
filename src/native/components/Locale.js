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
      id_pelanggan: props['last_history']['id_pelanggan'],
      last_history: props['last_history'],
      total_bayar: 0,
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
      const jumlah_meteran_saat_ini = this.state.jumlah_meteran;
      const data = {
        bulan: this.state.bulan,
        tahun: this.state.tahun,
        id_pelanggan: this.state.id_pelanggan,
        jumlah_meteran: this.state.jumlah_meteran,
        foto_meteran: this.state.foto_meteran
      }
        if (!pickerResult.cancelled) {
          const response = await fetch(pickerResult.uri);
          const blob = await response.blob();
          const ref = Firebase.storage().ref().child(this.state.id_pelanggan + '-' + this.state.bulan + '-' + this.state.tahun);
          await ref.put(blob)
          .then(snapshot => {
            return snapshot.ref.getDownloadURL();
          })
          .then(downloadURL => {
              console.log(`Successfully uploaded file and got download link - ${downloadURL}`);
              this.setState({ foto_meteran: downloadURL});
              Firebase.database().ref('/history/meteran/' + Firebase.auth().currentUser.uid  + '/' + this.state.last_history['tahun'] + '/' + (this.state.last_history['bulan'])).once('value').then(function(snapshot) {
                if(snapshot.val()!= null){

                  var pemakaian_bulan_lalu = snapshot.val().jumlah_meteran;
                  var pemakaian_saat_ini = jumlah_meteran_saat_ini;
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

                    Firebase.database().ref('history/meteran/' + Firebase.auth().currentUser.uid + '/' + data["tahun"] + '/' + data["bulan"]).set({
                        bulan: data['bulan'],
                        tahun: data['tahun'],
                        id_pelanggan: data['id_pelanggan'],
                        jumlah_meteran: data['jumlah_meteran'],
                        total_bayar: total_bayar,
                        foto_meteran: data['foto_meteran'],

                    })
                  }

                }else{

                  var pemakaian_bulan_lalu = null;
                  var pemakaian_saat_ini = jumlah_meteran_saat_ini;
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

                    Firebase.database().ref('history/meteran/' + Firebase.auth().currentUser.uid + '/' + data["tahun"] + '/' + data["bulan"]).set({
                        bulan: data['bulan'],
                        tahun: data['tahun'],
                        id_pelanggan: data['id_pelanggan'],
                        jumlah_meteran: data['jumlah_meteran'],
                        total_bayar: total_bayar,
                        foto_meteran: data['foto_meteran'],

                    })
                  }
                }
              });

              console.log('berhasil menambahkan data');
          }).catch((error)=>{
              alert(error);
          });

        }

    } catch (e) {
      console.log(e);
      alert('Upload failed, sorry :(');
    } finally {
      this.setState({ uploading: false });
    }
  };

  handleChange(name, val) {
    this.setState({
      [name]: val
    });
  }

  handleSubmit() {
    alert('Mohon tunggu sebentar.. data anda sedang di proses..');
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
            Total yang harus dibayar : {item.total_bayar}
          </Text>
        </CardItem>
      </Card>
    ) : (
      <Card key={key} />
    );
  }

  render() {
    const { histories, member, error} = this.props;
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
          {(Object.values(histories) != '' && Object.keys(histories).length > 0) ? (
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
                    value={this.state.id_pelanggan || member.id_pelanggan}
                    keyboardType="default"
                    disabled={this.state.id_pelanggan ? (this.state.id_pelanggan.length > 8) ? 'disabled' : '' : ''}
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
