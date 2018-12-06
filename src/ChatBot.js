import React, { Component } from 'react';
import * as firebase from 'firebase'
import KeyboardSpacer from 'react-native-keyboard-spacer'
import { Dimensions, View, ScrollView, ListView} from 'react-native';
import { withNavigation } from 'react-navigation';
import Toast from 'react-native-simple-toast';
import { firebaseApp } from './FirebaseConfig';
import { Container, Header, Title, Input, Content, Footer, Item, Button, ListItem, Icon, Thumbnail, List, Left, Right, Body, con, Text, Spinner } from 'native-base';
export default class ChatBot extends Component {
  constructor(props) {
    super(props)
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      messageInput: '',
      loading: true,
      messageList: [],
      isUpdate: false,
      valid: true,
      updateKey: ''
    }
  }
  componentWillMount() {
    try {
      firebaseApp.database().ref('ChatBot/User').on('value', data => {
        let messageObj = data.toJSON()
        this.setState({
          messageList: messageObj,
          loading: false
        })
        console.log('Data get from RealTimeDatabase :', messageObj)
      }).catch(e => console.log(e))
    } catch{
      console.log('')
    }
  }

  insertMessage() {
    if (!this.state.isUpdate) {
      var protectSameValue = firebase.database().ref().child('posts').push().key;
      firebaseApp.database().ref('ChatBot/User/' + protectSameValue).set(
        {
          message: this.state.messageInput,
          timestamp: this.getTime(),
        }
      ).then(() => {
        Toast.show('Successfully Added!')
      }).catch((err) => {
        console.log(err)
      })
    } else {
      firebaseApp.database().ref('Chatbox/chat/' + item + '/message').update(
        {
          message: this.state.messageInput,
          timestamp: this.getTime(),
        }
      ).then(() => {
        Toast.show('Successfully Updated!')
        this.setState({
          isUpdate: false
        })
      }).catch((err) => {
        console.log(err)
      })
    }
  }
  deleteMessage(item) {
    console.log('Item ===>',item)
    firebaseApp.database().ref('ChatBot/User/'+item).remove()
    .then(()=>{ Toast.show('Removed!') })
    .catch((err)=>{ console.log(err) })
  }
  updateMessage(item) {
    const data = this.state.messageList;
    this.setState({
        messageInput:data[item].message,
        isUpdate:true,
        updateKey:item
    })

  }
  getTime() {
    let date = new Date()
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let second = date.getSeconds()
    let ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    let strTime = hours + ':' + minutes + ':' + second + ' ' + ampm;
    return strTime;
  }
  checkUserInput(text) {
    if (text) {
      this.setState({
        messageInput: text,
        valid: true
      })
    } else {
      this.setState({
        messageInput: text,
        valid: false
      })
    }
  }
  handleButtonSend = () => {
    if (this.state.messageInput && this.state.isUpdate) {
      this.insertMessage(this.state.updateKey);
      this.setState({
        messageInput: '',
        valid: false
      })
    } else if (this.state.messageInput) {
      this.insertMessage();
      this.mylist._root.scrollToEnd()
      this.setState({
        messageInput: '',
        valid: false
      })
    }
    else {
      this.setState({
        valid: false
      })
    }
  }
  render() {
    return <Container>
      <Header>
          <Body>
            <Title style={styles.headerStyle}>Chat with your friend</Title>
          </Body> 
      </Header>
      {this.state.loading ? <Spinner style={{ flex: 1 }} /> :
        <Content ref={c => this.mylist = c}>
          <List dataSource={this.ds.cloneWithRows(this.state.messageList)}
            leftOpenValue={75}
            rightOpenValue={-75}
            renderRow={(item, index, obj) =>
              <ListItem avatar key={obj}>
                <Left>
                  <Thumbnail
                    style={{ marginLeft: 10, alignSelf: 'center' }}
                    small source={{ uri: 'https://via.placeholder.com/150' }} />
                </Left>
                <Body>
                  <Text>{"User"}</Text>
                  <Text note>
                    {item.message}
                  </Text>
                </Body>
                <View style={{ position: 'absolute', right: 0, border: 0, }}>
                  <Text note style={{ marginRight: 10, fontSize: 8 }}>
                    {item.timestamp}
                  </Text>
                </View>
              </ListItem>
            }
            renderLeftHiddenRow={(item, id, obj) =>
              <Button warning onPress={() => this.updateMessage(obj)}>
                <Icon active name="create" />
              </Button>
            }
            renderRightHiddenRow={(item, id, obj) =>
              <Button danger onPress={() => this.deleteMessage(obj)}>
                <Icon active name="trash" />
              </Button>
            }
          >
          </List>
        </Content>
      }
      
      <Footer>
        <Item style={styles.textInput} success>
          <Input placeholder='Message here!..'
            value={this.state.messageInput}
            onChangeText={(text) => this.checkUserInput(text)}
          />
          <Button iconLeft transparent
            success={this.state.valid}
            danger={!this.state.valid}
            onPress={() => this.handleButtonSend()}
            disabled={this.state.loading}
          >
            <Icon name='send' />
            <Text>{this.state.isUpdate ? "Update" : "Send"}</Text>
          </Button>
        </Item>
      </Footer>
      <KeyboardSpacer/>
    </Container>

  }
}
const { height, width } = Dimensions.get('window')
styles = {
  textInput: {
    width: width,
  },
  headerStyle:{
    fontSize:25,
    color:'green'
  }

}