import React, { Component } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";

import "../../utilities.css";
import "./EditProfile.css";

import { get, post } from "../../utilities";

//TODO: REPLACE WITH YOUR OWN CLIENT_ID
const GOOGLE_CLIENT_ID = "121479668229-t5j82jrbi9oejh7c8avada226s75bopn.apps.googleusercontent.com";

class EditProfile extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    this.state = {
      name: "",
      desc: "",
      profile_pic: ""
    };
  }

  get_values = () => {

    console.log("WOOOO")

    if (this.props.userId) {
      document.title = "Profile Editor";
      get(`/api/user`, { userId: this.props.userId }).then((user) => this.setState({ name: user.name, desc: user.description, profile_pic: user.profile_pic }))
    }

  }

  componentDidMount() {
    this.get_values()
  }

  componentDidUpdate(oldProps) {
    if (oldProps != this.props) {
      this.get_values()
    }
  }

  handleSubmit = () => {
    const body = { name: this.state.name, desc: this.state.desc, profile_pic: this.state.profile_pic };
    post("/api/save_user_changes", body).then((circuit) => {
      // HANDLE REFRESH
    });
  }

  handleNameChange = (event) => {
    this.setState({name: event.target.value})
  }

  handleDescChange = (event) => {
    this.setState({desc: event.target.value})
  }

  convertImageToDataURL = () => {

    var picker = document.getElementById('imageInput');

    if (picker.files && picker.files[0]) {
      var FR= new FileReader();

      FR.addEventListener("load", function(e) {
        document.getElementById("img").src       = e.target.result;
        document.getElementById("b64").innerHTML = e.target.result;
      });

      FR.readAsDataURL(picker.files[0]);

      this.resizeImage()
    }
  }

  resizeImage = () => {
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        var filesToUploads = document.getElementById('imageInput').files;
        var file = filesToUploads[0];
        if (file) {

            var reader = new FileReader();
            // Set the image once loaded into file reader
            reader.onload = function(e) {

                var img = document.getElementById("img");
                img.src = e.target.result;

                var canvas = document.createElement("canvas");
                var ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0);

                var MAX_WIDTH = 200;
                var MAX_HEIGHT = 200;
                var width = img.width;
                var height = img.height;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }
                canvas.width = width;
                canvas.height = height;
                var ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, width, height);

                var dataurl = canvas.toDataURL(file.type);
                document.getElementById('b64').innerHTML = dataurl;

                this.setState({profile_pic: dataurl})

            }
            reader.readAsDataURL(file);

        }

    } else {
        alert('The File APIs are not fully supported in this browser.');
    }
  }

  render() {
    if (!this.props.userId) {
      return (
        <>
        You are not logged in
        </>
      )
    }
    return (
      <>
        <img id="img" height="200" width="200" src={ this.state.profile_pic } />
        <input
          type="text"
          placeholder="Display Name"
          value={this.state.name}
          onChange={this.handleNameChange}
          className="NewPostInput-input"
        />
        <input
          type="text"
          placeholder="Your Bio"
          value={this.state.desc}
          onChange={this.handleDescChange}
          className="NewPostInput-input"
        />
        <input onChange={ this.convertImageToDataURL } type='file' id="imageInput" />
        <p id="b64" hidden></p>
        <button
          type="submit"
          className="NewPostInput-button u-pointer"
          value="Submit"
          onClick={this.handleSubmit}
        >Save Changes</button>
      </>
    );
  }
}

export default EditProfile;
