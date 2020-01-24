import React, { Component } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";

import SpecialButton from "../modules/SpecialButton.js";
import InputField from "../modules/InputField.js";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTimes, faUpload, faLink } from '@fortawesome/free-solid-svg-icons'

import "../../utilities.css";
import "./EditProfile.css";

import { get, post } from "../../utilities";

//TODO: REPLACE WITH YOUR OWN CLIENT_ID
const GOOGLE_CLIENT_ID = "117624971444-gmdmhm8712dc3hriss8spnt1vgvmeqkn.apps.googleusercontent.com";

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
      location.href="/profile"
    });
  }

  handleNameChange = (event) => {
    this.setState({name: event.target.value})
  }

  handleDescChange = (event) => {
    this.setState({desc: event.target.value})
  }

  handleURLChange = (event) => {
    this.setState({profile_pic_url: event.target.value})
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

  modifyImageURL = () => {

    const img = document.getElementById("img");
    img.src = this.state.profile_pic_url;

    this.setState({profile_pic: this.state.profile_pic_url})

  }

  resizeImage = () => {
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        var filesToUploads = document.getElementById('imageInput').files;
        var file = filesToUploads[0];
        if (file) {

            var reader = new FileReader();
            // Set the image once loaded into file reader

            reader.onload = (e) => {

                var img = document.getElementById("img");
                img.src = e.target.result;

                var canvas = document.createElement("canvas");
                var ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0);

                var MAX_WIDTH = 150;
                var MAX_HEIGHT = 150;
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
        <center style={{ margin: "5em", marginTop: "30vh"}}>
          <h1>You are not logged in</h1>
          <h3>Log in to access your profile and circuits</h3>
          <br />
          <h3 style={{ maxWidth: "500px"}}>
            <GoogleLogin
              clientId={GOOGLE_CLIENT_ID}
              buttonText="Login"
              onSuccess={this.props.handleLogin}
              onFailure={(err) => console.log(err)}
            />
          </h3>
        </center>
      )
    }
    return (
      <>
        <div className="ProfilePane-container">
          <img src={ this.state.profile_pic } id="img"/>
          <div className="ProfilePane-text">
          <InputField
            type="text"
            placeholder="Display Name"
            value={this.state.name}
            onChange={this.handleNameChange}
            title="Display Name"
            defaultValue={this.state.name}
          />
          <InputField
            type="text"
            placeholder="Your Bio"
            value={this.state.desc}
            onChange={this.handleDescChange}
            title="Bio"
            defaultValue={this.state.desc}
          />
          <div className="spaceButtonsOut">
            <SpecialButton action={this.handleSubmit} title="Save Changes" icon={ faSave } className="EditProfile-button" />
            <SpecialButton action={() => location.href="/profile"} title="Discard Changes" icon={ faTimes } destructive={true}  className="EditProfile-button"/>
          </div>
          </div>
          <p id="b64" hidden></p>
          <br /><br />
          <input onChange={ this.convertImageToDataURL } type='file' id="imageInput" />
          <label htmlFor="imageInput"><FontAwesomeIcon icon={faUpload} className="icon"/> Upload Image From Desktop</label>
          <br />
          <br />
          <div style={{width: "83%"}}>
            <InputField
              type="text"
              placeholder="Photo URL"
              value={this.state.profile_pic}
              onChange={this.handleURLChange}
              title="Photo URL"
              id="imageURL"
              defaultValue={(this.state.profile_pic[0] !== "d") ? this.state.profile_pic : ""}
            />
          </div>
          <SpecialButton action={this.modifyImageURL} title="Upload Image From URL" icon={ faLink } className="EditProfile-button" />
        </div>
      </>
    );
  }
}

export default EditProfile;
