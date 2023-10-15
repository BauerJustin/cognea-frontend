import React, { Component } from 'react'
import {Link} from 'react-router-dom'

export class ForgetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      fields: {
        password: "",
        repeat_password: "",
      },
      error: ""
    };
  }
  handleValidation() {
    let fields = this.state.fields;
    let error = "";
    let formIsValid = true;

    if (typeof fields["password"] !== "undefined") {
      if (fields["password"].length < 8) {
        formIsValid = false;
        error = "Password must be at least 8 characters";
      } else if (!/[A-Z]/.test(fields["password"])) {
        formIsValid = false;
        error = "Password must contain at least 1 upper case character";
      } else if (!/[a-z]/.test(fields["password"])) {
        formIsValid = false;
        error = "Password must contain at least 1 lower case character";
      } else if (!/\d/.test(fields["password"])) {
        formIsValid = false;
        error = "Password must contain at least 1 number";
      } else if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(fields["password"])) {
        formIsValid = false;
        error = "Password must contain at least 1 special character";
      } else if (typeof fields["repeat_password"] !== "undefined") {
        if (fields["repeat_password"] !== fields["password"]) {
          formIsValid = false;
          error = "Passwords do not match";
        }
      }
    }
    
    Object.keys(fields).forEach(function(field) {
      if (!fields[field]) {
        formIsValid = false;
        error = "Empty field";
      }
    });

    this.setState({ error: error });
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
      console.log(this.state.fields)
      // TODO reset password function
      // TODO add email confirmation page
      this.props.history.push({
        pathname: `/sign-in`
      });
    }
  }
  render() {
    return (
      <div>
        <div className="az-forgetpassword-wrapper">
          <div className="az-card-forgetpassword">
            <h1 className="az-logo">Cognea</h1>
            <div className="az-forgetpassword-header">
              <h4>Please reset your password to continue</h4>

              <form onSubmit={this.handleSubmit}>
                <div className="form-group">
                  <label>Enter new password</label>
                  <input type="password" className="form-control" placeholder="" onChange={this.handleChange.bind(this, "password")} value={this.state.fields["password"]} />
                </div>{/* form-group */}
                <div className="form-group">
                  <label>Re-enter new password</label>
                  <input type="password" className="form-control" placeholder="" onChange={this.handleChange.bind(this, "repeat_password")} value={this.state.fields["repeat_password"]} />
                </div>{/* form-group */}
                <span style={{ color: "red" }}>{this.state.error}</span>
                <button type="submit" className="btn btn-az-primary btn-block">Reset Password</button>
              </form>
            </div>{/* az-signin-header */}
            <div className="az-forgetpassword-footer">
              {/* <p><a href="#/">Forgot password?</a></p> */}
              <p>Don't have an account? <Link to="/sign-up">Create an Account</Link></p>
            </div>{/* az-signin-footer */}
          </div>{/* az-card-signin */}
        </div>{/* az-signin-wrapper */}
      </div>
    )
  }
}

export default ForgetPassword
