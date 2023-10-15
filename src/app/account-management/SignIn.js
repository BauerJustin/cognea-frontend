import React, { Component } from 'react'
import {Link} from 'react-router-dom'

export class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      fields: {
        email: "",
        password: "",
      },
      error: ""
    };
  }
  handleValidation() {
    let fields = this.state.fields;
    let error = ""
    let formIsValid = true;

    Object.keys(fields).forEach(function(field) {
      if (!fields[field]) {
        formIsValid = false;
        error = "Required field";
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
              <h2>Welcome!</h2>
              <h4>Please sign in to continue</h4>
              <form onSubmit={this.handleSubmit}>
                <div className="form-group">
                  <label>Email</label>
                  <input type="text" className="form-control" placeholder="Enter your email" onChange={this.handleChange.bind(this, "email")} value={this.state.fields["email"]} />
                </div>{/* form-group */}
                <div className="form-group">
                  <label>Password</label>
                  <input type="password" className="form-control" placeholder="Enter your password" onChange={this.handleChange.bind(this, "password")} value={this.state.fields["password"]} />
                </div>{/* form-group */}
                <span style={{ color: "red" }}>{this.state.error}</span>
                <button type="submit" className="btn btn-az-primary btn-block">Sign In</button>
              </form>
            </div>{/* az-signin-header */}
            <div className="az-signin-footer">
              <p><Link to="/forget-password">Forget Password</Link></p>
              <p>Don't have an account? <Link to="/sign-up">Create an account</Link></p>
            </div>{/* az-signin-footer */}
          </div>{/* az-card-signin */}
        </div>{/* az-signin-wrapper */}
      </div>
    )
  }
}

export default SignIn
