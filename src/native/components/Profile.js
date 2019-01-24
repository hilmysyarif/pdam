import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import {
  Container, Content, List, ListItem, Body, Left, Text, Icon,
} from 'native-base';
import { Actions } from 'react-native-router-flux';
import Header from './Header';

const Profile = ({ member, logout }) => (
  <Container>
    <Content>
      <List>
        {(member && member.email)
          ? (
            <View>
              <Content padder>
                <Header
                  title={`Halo ${member.firstName},`}
                  content={`Saat ini anda masuk sebagai ${member.email}`}
                />
              </Content>
              <ListItem onPress={Actions.listpemakaian} icon>
                <Left>
                  <Icon name="ios-list" />
                </Left>
                <Body>
                  <Text>
                    History Pemakaian
                  </Text>
                </Body>
              </ListItem>
              <ListItem onPress={Actions.locale} icon>
                <Left>
                  <Icon name="ios-log-in" />
                </Left>
                <Body>
                  <Text>
                    Pemaiakan saat ini
                  </Text>
                </Body>
              </ListItem>
              <ListItem onPress={Actions.updateProfile} icon>
                <Left>
                  <Icon name="person-add" />
                </Left>
                <Body>
                  <Text>
                    Update Profilku
                  </Text>
                </Body>
              </ListItem>
              <ListItem onPress={logout} icon>
                <Left>
                  <Icon name="power" />
                </Left>
                <Body>
                  <Text>
                    Keluar
                  </Text>
                </Body>
              </ListItem>
            </View>
          )
          : (
            <View>
              <Content padder>
                <Header
                  title="Selamat datang,"
                  content="Silahkan login atau daftar untuk melanjutkan"
                />
              </Content>

              <ListItem onPress={Actions.login} icon>
                <Left>
                  <Icon name="power" />
                </Left>
                <Body>
                  <Text>
                    Masuk
                  </Text>
                </Body>
              </ListItem>
              <ListItem onPress={Actions.signUp} icon>
                <Left>
                  <Icon name="add-circle" />
                </Left>
                <Body>
                  <Text>
                    Daftar
                  </Text>
                </Body>
              </ListItem>
            </View>
          )
        }
      </List>
    </Content>
  </Container>
);

Profile.propTypes = {
  member: PropTypes.shape({}),
  logout: PropTypes.func.isRequired,
};

Profile.defaultProps = {
  member: {},
};

export default Profile;
