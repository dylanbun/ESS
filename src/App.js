import React, { Component } from 'react';
import './App.css';
import firebase, {auth, provider, storage} from './firebase.js';
import ImageUpload from './ImageUploader/index';

// Run this using 'npm start' !!!
// To do list:
// Add dropdown menu selection to display! (Mostly done, fix 
// reset of kind state when something is input after selection)
// ^Form Validation for fixing reset
// Placement of boxes when displaying items?
// Need to add ability to submit photos + be seen by users
// Placement + css of dropdown for essential supplies
// Notification system to users?
// Turn logout button into a drop down menu with logout, about, 
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentItem: '',
      username: '',
      location: '',
      kind:'',
      photo: '',
      items: [],
      user: null
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleKindChange = this.handleKindChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }
  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }
  handleKindChange(e) {
    this.setState({
      kind: e.target.value
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
      kind: this.state.kind,
    }
    itemsRef.push(item);
    this.setState({
      currentItem: '',
      username: '',
      location: '',
    });
  }
handleUpload = () => {
  const {image} = this.state;
  const uploadTask = storage.ref('images/${')
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
        kind: items[item].kind,          
        photo: items[item].photo
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
            <div className="Title">
              <h1>Essential Supplies Stock</h1>
            </div>
            <div className="Subtitle">
              <h3>Find Essential Supplies Near You!</h3>
            </div>
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
                          <h3>Supply: {item.title}</h3>
                          <h3>Location: {item.location}</h3>
                          <h3> Type of supply: {item.kind}</h3>
                            <div> 
                              <img
                                src={this.state.url || "https://via.placeholder.com/300x300"}
                                alt="Uploaded Image from user" 
                                height="300"
                                width="308"
                              />
                            </div>
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
                <form onSubmit={this.handleSubmit} onChange={this.handleChange}>
                  <input type="text" name="username" placeholder="What's your name?" value={this.state.user.displayName || this.state.user.email} />
                  <input type="text" name="currentItem" placeholder="What did you find?" onChange = {this.handleChange}  value={this.state.currentItem} />
                  <input type ="text" name ="location" placeholder ="Where did you find this?" onChange = {this.handleChange} value = {this.state.location}/>
                  <label for="item"><h3> What kind of essential supply?</h3></label>
                  <select id="item" onChange = {this.handleKindChange}>
                      <option selected value = "">Please choose an option</option>
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
