import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Select from 'react-select';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { industries, genders } from '../../constants'

export class SignUpAccount extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      fields: {
        firstname: "",
        lastname: "",
        industry: "",
        gender: "",
        birthday: ""
      },
      errors: {
        firstname: "",
        lastname: "",
        industry: "",
        gender: "",
        birthday: ""
      }
    };
  }
  handleValidation() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;

    const names = ["firstname", "lastname"];
    names.forEach(function(name) {
      if (typeof fields[name] !== "undefined") {
        if (!fields[name].match(/^[a-zA-Z]+$/)) {
          formIsValid = false;
          errors[name] = "Name can only be letters (A-z)";
        }
      }
    });

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
  handleSelectChange(field, selected) {
    let fields = this.state.fields;
    fields[field] = selected.value;
    this.setState({ fields });
  }
  handleDateChange(field, date) {
    let fields = this.state.fields;
    fields[field] = date;
    this.setState({ fields });
  }
  handleSubmit = (event) => {
    event.preventDefault();
    if (this.handleValidation()) {
      this.props.history.push({
        pathname: `/sign-up_`,
        state: this.state.fields
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
              <h4>It's free to sign up and only takes a minute.</h4>
              <form onSubmit={this.handleSubmit}>
                <fieldset>
                  <div className="form-group">
                    <label>* First name</label>
                    <input type="text" className="form-control" placeholder="Enter your first name" onChange={this.handleChange.bind(this, "firstname")} value={this.state.fields["firstname"]} />
                    <span style={{ color: "red" }}>{this.state.errors["firstname"]}</span>
                  </div>{/* form-group */}
                  <div className="form-group">
                    <label>* Last name</label>
                    <input type="text" className="form-control" placeholder="Enter your last name" onChange={this.handleChange.bind(this, "lastname")} value={this.state.fields["lastname"]} />
                    <span style={{ color: "red" }}>{this.state.errors["lastname"]}</span>
                  </div>{/* form-group */}
                  <div className="form-group">
                    <label>* Industry</label>
                    <Select options={industries} placeholder="Select your industry" onChange={this.handleSelectChange.bind(this, "industry")} />
                    <span style={{ color: "red" }}>{this.state.errors["industry"]}</span>
                  </div>{/* form-group */}
                  <div className="form-group">
                    <label>* Gender</label>
                    <Select options={genders} placeholder="Select your gender" onChange={this.handleSelectChange.bind(this, "gender")} />
                    <span style={{ color: "red" }}>{this.state.errors["gender"]}</span>
                  </div>{/* form-group */}
                  <div className="form-group">
                    <label>* Birthday</label>
                    <div className="custom-date-picker">
                      <DatePicker
                        className="form-control"
                        placeholderText="MM/DD/YYYY"
                        selected={this.state.fields["birthday"]}
                        onChange={this.handleDateChange.bind(this, "birthday")}
                        minDate={new Date(new Date().setFullYear(new Date().getFullYear() - 100))}  // 100 years ago
                        maxDate={new Date()}
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                      />
                    </div>
                    <span style={{ color: "red" }}>{this.state.errors["birthday"]}</span>
                  </div>{/* form-group */}
                  <button type="submit" className="btn btn-az-primary btn-block">Next</button>
                </fieldset>
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

export default SignUpAccount
