import React, { Component } from 'react';
import {storage} from "../firebase.js";

class ImageUpload extends Component {
    constructor(props) {
      super(props);
      this.state = {
        image: null,
        url: "",
        progress: 0
      };
    }
  
    handleChange = e => {
      if (e.target.files[0]) {
        const image = e.target.files[0];
        this.setState(() => ({ image }));
      }
    };
    removeItem(image) {
        const itemRef = storage.ref(`/images/${image}`);
        itemRef.delete().then(function() {

        }).catch(function(error) {

        })
      }
    handleUpload = () => {
      const { image } = this.state;
      const uploadTask = storage.ref(`images/${image.name}`).put(image);
      uploadTask.on(
        "state_changed",
        snapshot => {
          // progress function ...
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 1000
          );
          this.setState({ progress });
        },
        error => {
          // Error function ...
          console.log(error);
        },
        () => {
          // complete function ...
          storage
            .ref("images")
            .child(image.name)
            .getDownloadURL()
            .then(url => {
              this.setState({ url });
            });
        }
      );
    };
    render() {
      return (
        <div className="center">
          <div className="file-field input-field">
            <div className="btn">
                <input type="file" onChange={this.handleChange} />
            </div>
            <p> <h3> Progress: {this.state.progress} % </h3></p>
            <div className="row">
                <progress value={this.state.progress} max="1000" className="progress" />
            </div>
            <button
            onClick={this.handleUpload}
            className="waves-effect waves-light btn">
            Upload
          </button>
          <p> <h3> Image Preview: </h3></p>
          <img
            src={this.state.url || "https://via.placeholder.com/400x300"}
            alt="Uploaded Images"
            height="300"
            width="400"
          />
          <button
              onClick = {this.removeItem}>
              Remove Image
          </button>
          </div>
        </div>
      );
    }
  }
  
  export default ImageUpload;
