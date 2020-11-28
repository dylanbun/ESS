import React, { Component } from 'react';
import './App.css';
import firebase, {auth, provider, storage} from './firebase.js';

// Run this using 'npm start' !!!
// To do list:
// Add dropdown menu selection to display!
// Placement of boxes when displaying items?
// Need to add ability to submit photos + be seen by users
// Placement + css of dropdown for essential supplies
// Notification system to users?
class App extends Component {
  constructor() {
    super();
    this.state = {
      currentItem: '',
      username: '',
      location: '',
      kind:'',
      items: [],
      user: null
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }
  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  logout() {
    auth.signOut()
      .then(() => {
        this.setState({
          user: null
        });
      });
  }
  login() {
    auth.signInWithPopup(provider)
      .then((result)=> {
        const user = result.user;
        this.setState({
          user
        });
      });
  }
  handleSubmit(e) {
    e.preventDefault();
    const itemsRef = firebase.database().ref('items');
    const item = {
      title: this.state.currentItem,
      user: this.state.user.displayName || this.state.user.email,
      location: this.state.location,
      kind: this.state.kind
    }
    itemsRef.push(item);
    this.setState({
      currentItem: '',
      username: '',
      location: '',
      kind: ''
    });
  }
  componentDidMount() {
    const itemsRef = firebase.database().ref('items');
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user});
      }
    });
    itemsRef.on('value', (snapshot) => {
      let items = snapshot.val();
      let newState = [];
      for (let item in items) {
        newState.push({
          id: item,
          title: items[item].title,
          user: items[item].user,
          location: items[item].location,
          kind: items[item].kind
        });
      }
      this.setState({
        items: newState
      });
    });
  }
  removeItem(itemId) {
    const itemRef = firebase.database().ref(`/items/${itemId}`);
    itemRef.remove();
  }
  render() {
    return (
      <div className='app'>
        <header>
          <div className="wrapper">
            <h1>Essential Supplies Stock</h1>
            {this.state.user ?
              <button onClick={this.logout}>Logout</button>                
            :
              <button onClick={this.login}>Log In</button>              
            }
          </div>
        </header>
        {this.state.user ?
          <div>
            <div className='user-profile'>
              <img src={this.state.user.photoURL} />
            </div>
            <div className='container'>
              <section className='display-item'>
                <div className="wrapper">
                  <ul>
                    {this.state.items.map((item) => {
                      return (
                        <li key={item.id}>
                          <h3>{item.title}</h3>
                          <h3>Location: {item.location}</h3>
                          <h3> Type of supply: {item.kind}</h3>
                          <p>From {item.user}
                            {item.user === this.state.user.displayName || item.user === this.state.user.email ?
                              <button onClick={() => this.removeItem(item.id)}>Remove Item</button> : null}
                          </p>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </section>
            </div>
            <div className='container'>
              <section className='add-item'>
                <form onSubmit={this.handleSubmit}>
                  <input type="text" name="username" placeholder="What's your name?" value={this.state.user.displayName || this.state.user.email} />
                  <input type="text" name="currentItem" placeholder="What did you find?" onChange={this.handleChange} value={this.state.currentItem} />
                  <input type ="text" name ="location" placeholder ="Where did you find this?" onChange ={this.handleChange} value = {this.state.location}/>
                  <label for="item">What kind of essential supply?</label>
                  <select id="item" onChange = {this.handleChange} defaultValue = {this.state.kind}>
                      <option value="">Please choose an option</option>
                      <option value="Toilet Paper">Toilet Paper</option>
                      <option value="Pack of Water Bottles">Pack of Water Bottles</option>
                      <option value="Hand Sanitizer">Hand Sanitizer</option>
                      <option value="Canned Food">Canned Food</option>
                      <option value="Paper">Paper</option>
                  </select>
                  <button>Add Item</button>
                </form>
              </section>
            </div>
          </div>
          :
          <div className='wrapper'>
            <p> <h2> You must be logged in to see the stock.</h2></p>
          </div>
        }
      </div>
    );
  } 
}
export default App;
