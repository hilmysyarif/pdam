import React from 'react';
import PropTypes from 'prop-types';
import {
  Container, Content, Text, Body, ListItem, InputGroup, Form, Item, Label, Input, CheckBox, Button, View,
} from 'native-base';
import Messages from './Messages';
import Loading from './Loading';
import Header from './Header';
import Spacer from './Spacer';

class UpdateProfile extends React.Component {
  static propTypes = {
    error: PropTypes.string,
    success: PropTypes.string,
    loading: PropTypes.bool.isRequired,
    onFormSubmit: PropTypes.func.isRequired,
    member: PropTypes.shape({
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      email: PropTypes.string,
      id_pelanggan: PropTypes.integer,
      alamat: PropTypes.string,
    }).isRequired,
  }

  static defaultProps = {
    error: null,
    success: null,
  }

  constructor(props) {
    super(props);
    this.state = {
      firstName: props.member.firstName || '',
      lastName: props.member.lastName || '',
      email: props.member.email || '',
      password: '',
      password2: '',
      changeEmail: false,
      changePassword: false,
      id_pelanggan: props.member.id_pelanggan || '',
      alamat: props.member.alamat || '',
      no_hp: props.member.no_hp || '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange = (name, val) => {
    this.setState({
      [name]: val,
    });
  }

  handleSubmit = () => {
    const { onFormSubmit } = this.props;
    onFormSubmit(this.state)
      .then(() => console.log('Profile Updated'))
      .catch(e => console.log(`Error: ${e}`));
  }

  render() {
    const { loading, error, success } = this.props;
    const {
      firstName,
      lastName,
      email,
      changeEmail,
      changePassword,
      id_pelanggan,
      alamat,
      no_hp,
    } = this.state;

    // Loading
    if (loading) return <Loading />;
    return (
      <Container>
        <Content padder>
          <Header
            title="Update profilku"
            content=""
          />

          {error && <Messages message={error} />}
          {success && <Messages message={success} type="success" />}

          <Form>
            <Item stackedLabel>
              <Label>
                First Name
              </Label>
              <Input
                value={firstName}
                onChangeText={v => this.handleChange('firstName', v)}
              />
            </Item>

            <Item stackedLabel>
              <Label>
                Last Name
              </Label>
              <Input
                value={lastName}
                onChangeText={v => this.handleChange('lastName', v)}
              />
            </Item>

            <Item stackedLabel>
              <Label>
                No. HP
              </Label>
              <Input
                value={no_hp}
                onChangeText={v => this.handleChange('no_hp', v)}
              />
            </Item>

            <Item stackedLabel>
              <Label>
                ID Pelanggan
              </Label>
              <Input
                value={id_pelanggan}
                onChangeText={v => this.handleChange('id_pelanggan', v)}
              />
            </Item>

            <ListItem>
                <InputGroup >
                    <Input stackedLabel onChangeText={v => this.handleChange('alamat', v)} value={alamat} label='Alamat rumah' placeholder='Alamat' />
                </InputGroup>
            </ListItem>

            <Spacer size={20} />

            <Button block onPress={this.handleSubmit}>
              <Text>
                Update Profile
              </Text>
            </Button>
          </Form>
        </Content>
      </Container>
    );
  }
}

export default UpdateProfile;
