import React, { Component } from 'react';
import './App.css';
import firebase, { auth, provider, storage } from './firebase.js';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

// Run this using 'npm start' !!!
// Also download react-tabs, react-app and node.js
// To do :
// Make sure invalid submission cannot be submitted
const validateForm = errors => {
  let valid = true;
  Object.values(errors).forEach(val => val.length > 0 && (valid = false));
  return valid;
};

const countErrors = errors => {
  let count = 0;
  Object.values(errors).forEach(val => val.length > 0 && (count = count + 1));
  return count;
};
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formValid: false,
      errorCount: null,
      items: [],
      user: null,
      errors: {
        fullName: "",
        currentItem: "",
        location: "",
        kind: ""
      }
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
      .then((result) => {
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
      fullName: '',
      location: '',
    });
  }
  handleUpload = () => {
    const { image } = this.state;
    const uploadTask = storage.ref('images/${')
  }
  componentDidMount() {
    const itemsRef = firebase.database().ref('items');
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user });
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
  handleSubChange = event => {
    event.preventDefault();
    const { name, value } = event.target;
    let errors = this.state.errors;

    switch (name) {
      case "fullName":
        errors.fullName =
          value.length < 5 ? "Full name must be 5 letters long!" : "";
        break;
      case "currentItem":
        errors.currentItem =
          value.length < 5 ? "Item name must be 5 characters long!" : "" ;
        break;
      case "location":
        errors.location =
          value.length < 5 ? "Location must be 5 letters long!" : "";
        break;
      case "kind":
        errors.kind = 
          value.kind < 0 ? "Must select a kind of supply!" : "";
      default:
        break;
    }

    this.setState({ errors, [name]: value });
  };
  handleSubSubmit = event => {
    event.preventDefault();
    this.setState({ formValid: validateForm(this.state.errors) });
    this.setState({ errorCount: countErrors(this.state.errors) });
    if (this.state.formValid === false) {
      return false;
    }
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
      fullName: '',
      location: '',
    });
  };
  render() {
    const { errors, formValid } = this.state;
    return (
      <Tabs className="tabs-background">
        <header>
              <div className="wrapper">
                <div className="title">
                  <h1>Essential Supplies Stock</h1>
                  <p> </p>
                  <h3>Find Essential Supplies Here!</h3>
                </div>
                {this.state.user ?
                  <button onClick={this.logout}>Logout</button>
                  :
                  <button onClick={this.login}>Log In</button>
                }
              </div>
            </header>
        <TabList className="tabs">
          <Tab className="tab1">ESSENTIAL SUPPLY STOCK</Tab>
          <Tab className="tab2">ABOUT PAGE</Tab>
        </TabList>
        <TabPanel>
          <div className='app'>
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
                              <h3>Item: {item.title}</h3>
                              <h3>Location: {item.location}</h3>
                              <h3> Type of Item: {item.kind}</h3>
                              <p>From {item.user}
                                {item.user === this.state.user.displayName || item.user === this.state.user.email ?
                                  <button className="remove" onClick={() => this.removeItem(item.id)}>Remove Item</button> : null}
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
                    <form onSubmit= {this.handleSubSubmit} onChange={this.handleChange}>
                      <p className="itemlabel">Enter product information:</p>
                      <div className = 'fullName'>
                          <label htmlFor = "fullName"> Full Name </label>
                          <input type = "text" name = "fullName" value = {this.state.user.displayName || this.state.user.email}onChange = {this.handleSubChange} noValidate/>
                          {errors.fullName.length > 0 &&
                            <span className = 'error'> {errors.fullName}</span>
                          }
                      </div>
                      <div className = 'currentItem'>
                        <label htmlFor = 'currentItem'> Item </label>
                        <input type = 'text' name = "currentItem" onChange = {this.handleSubChange} noValidate/>
                        {errors.currentItem.length > 0 &&
                          <span className = 'error'> {errors.currentItem} </span>
                        }
                      </div>
                      <div>
                        <label htmlFor = 'location'> Location</label>
                        <input type = 'text' name = 'location' onChange = {this.handleSubChange} noValidate/>
                        {errors.location.length > 0 &&
                          <span className = 'error'>{errors.location} </span> 
                        }
                      </div>
                        <label htmlFor="kind">What kind of essential supply?</label>
                        <select className="dropdown" id="kind" onChange={this.handleKindChange}>
                          <option selected value="">Please choose an option</option>
                          <option value="Toilet Paper">Toilet Paper</option>
                          <option value="Pack of Water Bottles">Pack of Water Bottles</option>
                          <option value="Hand Sanitizer">Hand Sanitizer</option>
                          <option value="Dried/Canned Food">Dried/Canned Food</option>
                          <option value="Masks">Masks</option>
                          <option value = "Water Purifier"> Water Purifier</option>
                          <option value = "First Aid Kit"> First Aid Kit</option>
                          <option value = "Frozen Foods">Frozen Foods </option>
                          <option value = "Tissues"> Tissues</option>
                        </select>
                      <div>
                        <button className="submitbutton">Add Item</button>
                      </div>
                      {this.state.errorCount !== null ? <p className="form-status">Submission is {formValid ? 'valid ✅' : 'invalid ❌'}</p> : 'Form not submitted'}
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
        </TabPanel>
        <TabPanel>
            <div style={{ height: 400, padding: 20, background: 'white'}}> 
              <h1>Welcome to Essential Supply Stock!</h1>
              <h2>Helping you find essential supplies near you!</h2>
              <h1>~ ~ ~</h1>
              <p>During the Covid-19 pandemic, there have been shortages of essential supplies</p>
              <p>including toilet paper, tissues, bottled water, hand sanitizer, masks, canned food, and first aid kits.</p>
              <p>Our mission here at Essential Supplies Stock is to help users find locations where essential supplies</p>
              <p>are currently in stock, making trips to stores more meaningful and productive.</p>
              <p> <h1> Future Implementations to ESS:</h1></p>
                <ul>
                  <li> <p> Photo Submission by Users</p></li>
                  <li> <p>Autofill for addresses </p></li>
                  <li> <p>Usage of ML to help classify photos </p></li>
                  <li> <p>Notify users when an user's submission is approved by the ML</p></li>
                </ul>
            </div>
        </TabPanel>
      </Tabs>
    );
  }
}
export default App;
