import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export class SignUpCredentials extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      fields: {
        ...this.props.location.state,
        username: "",
        email: "",
        password: "",
        repeat_password: ""
      },
      errors: {
        username: "",
        email: "",
        password: "",
        repeat_password: ""
      }
    };
    if (this.state.fields.firstname === undefined || this.state.fields.lastname === undefined 
      || this.state.fields.industry === undefined || this.state.fields.gender === undefined 
      || this.state.fields.birthday === undefined) {
        this.props.history.push({
          pathname: `/sign-up`
        });
    }
  }
  handleValidation() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;

    // TODO: Ensure username and email are unique in backend

    if (typeof fields["email"] !== "undefined") {
      let lastAtPos = fields["email"].lastIndexOf("@");
      let lastDotPos = fields["email"].lastIndexOf(".");
      if (
        !(
          lastAtPos < lastDotPos &&
          lastAtPos > 0 &&
          fields["email"].indexOf("@@") === -1 &&
          lastDotPos > 2 &&
          fields["email"].length - lastDotPos > 2
        )
      ) {
        formIsValid = false;
        errors["email"] = "Email is invalid";
      }
    }

    if (typeof fields["password"] !== "undefined") {
      if (fields["password"].length < 8) {
        formIsValid = false;
        errors["password"] = "Password must be at least 8 characters";
      } else if (!/[A-Z]/.test(fields["password"])) {
        formIsValid = false;
        errors["password"] = "Password must contain at least 1 upper case character";
      } else if (!/[a-z]/.test(fields["password"])) {
        formIsValid = false;
        errors["password"] = "Password must contain at least 1 lower case character";
      } else if (!/\d/.test(fields["password"])) {
        formIsValid = false;
        errors["password"] = "Password must contain at least 1 number";
      } else if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(fields["password"])) {
        formIsValid = false;
        errors["password"] = "Password must contain at least 1 special character";
      } else if (typeof fields["repeat_password"] !== "undefined") {
        if (fields["repeat_password"] !== fields["password"]) {
          formIsValid = false;
          errors["repeat_password"] = "Passwords do not match";
        }
      }
    }

    Object.keys(fields).forEach(function(field) {
      if (!fields[field]) {
        formIsValid = false;
        errors[field] = "Required field";
      }
    });

    this.setState({ errors: errors });
    return formIsValid;
  }
  handleChange(field, e) {
    let fields = this.state.fields;
    fields[field] = e.target.value;
    this.setState({ fields });
  }
  handleSubmit = (event) => {
    event.preventDefault();
    if (this.handleValidation()) {
      console.log(this.state.fields);
      // TODO AUTHENTICATE
      this.props.history.push({
        pathname: `/dashboard`
      });
    }
  }
  render() {
    return (
      <div>
        <div className="az-signin-wrapper">
          <div className="az-card-signin">
            <h1 className="az-logo">Cognea</h1>
            <div className="az-signin-header">
              <h2>Get Started</h2>
              <h4>Please provide the details you will use to log in.</h4>
              <form onSubmit={this.handleSubmit}>
                <div className="form-group">
                  <label>* Username</label>
                  <input type="text" className="form-control" placeholder="Enter your username" onChange={this.handleChange.bind(this, "username")} value={this.state.fields["username"]} />
                  <span style={{ color: "red" }}>{this.state.errors["username"]}</span>
                </div>{/* form-group */}
                <div className="form-group">
                  <label>* Email</label>
                  <input type="text" className="form-control" placeholder="Enter your email" onChange={this.handleChange.bind(this, "email")} value={this.state.fields["email"]} />
                  <span style={{ color: "red" }}>{this.state.errors["email"]}</span>
                </div>{/* form-group */}
                <div className="form-group">
                  <label>* Password</label>
                  <input type="password" className="form-control" placeholder="Enter your password" onChange={this.handleChange.bind(this, "password")} value={this.state.fields["password"]} />
                  <span style={{ color: "red" }}>{this.state.errors["password"]}</span>
                </div>{/* form-group */}
                <div className="form-group">
                  <label>* Re-enter Password</label>
                  <input type="password" className="form-control" placeholder="Re-enter your password" onChange={this.handleChange.bind(this, "repeat_password")} value={this.state.fields["repeat_password"]} />
                  <span style={{ color: "red" }}>{this.state.errors["repeat_password"]}</span>
                </div>{/* form-group */}
                <button type="submit" className="btn btn-az-primary btn-block">Sign Up</button>
              </form>
            </div>{/* az-signin-header */}
            <div className="az-signin-footer">
              <p>Already have an account? <Link to="/sign-in">Sign In</Link></p>
            </div>{/* az-signin-footer */}
          </div>{/* az-card-signin */}
        </div>{/* az-signin-wrapper */}
      </div>
    )
  }
}

export default SignUpCredentials
