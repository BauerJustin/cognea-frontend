import React, { Component, useState, useEffect } from 'react'
import { useMsal } from '@azure/msal-react';
import { trackPromise } from 'react-promise-tracker';
import { Alert, AlertTitle } from '@mui/material'
import { LoadToken, userdata, token } from '../shared/LoadToken';
import { LoadingIndicator } from '../shared/LoaderIndicator';
import { fadeIn } from 'react-animations';
import Radium, {StyleRoot} from 'radium';
import { isIOS, isMobile } from '../shared/UserAgentParsing';

const UserDetails = () => {
  const { accounts } = useMsal();
  const [userAccount, setUserAccount] = useState(null);

  useEffect(() => {
    if (accounts.length > 0) {
      setUserAccount(accounts[0]);
      userdata.given_name = accounts[0].idTokenClaims.given_name;
      userdata.username = accounts[0].username;
      userdata.localAccountId = accounts[0].localAccountId;
      userdata.userAgent = navigator.userAgent;
    }
  }, [accounts]);
  return (
    <div>
      {userAccount && <h2 className="az-dashboard-title">Hi, welcome {userAccount.idTokenClaims.given_name}!</h2>}
    </div>
  );
};

export class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      metadata: {
        given_name: "",
        username: "",
        localAccountId: "",
        userAgent: navigator.userAgent
      },
      interview: {
        state: "start_interview",
        company: "",
        job_title: "",
        job_description: "",
        candidate_background: ""
      },
      errors: {
        company: "",
        job_title: "",
        job_description: "",
        candidate_background: ""
      },
      mic_disabled: false,
      is_mobile: isMobile && !isIOS
    };
  }
  componentDidMount() {
    this.checkMic();
  }
  checkMic = async () => {
    this.setState({mic_disabled: false});
    // eslint-disable-next-line
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,        
    }).catch(() => {
      this.setState({mic_disabled: true});
    });
  }
  handleValidation() {
    let interview = this.state.interview;
    let errors = {};
    let formIsValid = true;

    if (this.state.mic_disabled) {
      formIsValid = false;
      errors["mic"] = "Enable mic and refresh page"
    }
    if (this.state.is_mobile && userdata.username !== 'justinbauer@cognea.ai') {
      formIsValid = false;
      errors["mobile"] = "Please use a supported browser on web."
    }

    Object.keys(interview).forEach(function (field) {
      if (!interview[field]) {
        formIsValid = false;
        errors[field] = "Required field";
      }
      if ((field === "company" || field === "job_title") && interview[field].length > 50) {
        formIsValid = false;
        errors[field] = "Input too long, must be 50 characters or less.";
      }
      if ((field === "job_description" || field === "candidate_background") && interview[field].length > 5000) {
        formIsValid = false;
        errors[field] = "Input too long, must be 5000 characters or less.";
      }
    });

    this.setState({ errors: errors });
    return formIsValid;
  }
  handleChange(field, e) {
    let interview = this.state.interview;
    interview[field] = e.target.value;
    this.setState({
      interview,
      metadata: userdata
    });
  }
  handleSubmit = (event) => {
    event.preventDefault();
    if (this.handleValidation()) {
      trackPromise(fetch(process.env.REACT_APP_BACKEND_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        mode: 'cors',
        body: JSON.stringify(this.state),
      }).then(res => res.json()).then(data => {
        if (data.state === 'response') {
          let session = {
            id: data.id,
            session_id: data.session_id,
            last_response: data.ai_response,
            session_container: data.session_container,
          };
          this.props.history.push({
            pathname: `/interview`,
            state: session
          });
        } else {
          console.log(data);
        }
      }));
    }
  }
  render() {
    return (
      <div>
        <StyleRoot>
        <LoadToken />
        <div className="container p-md-0" style={{animation: 'x 1s', animationName: Radium.keyframes(fadeIn, 'fadeIn')}}>
          <div className="az-content-body">
            <div className="az-dashboard-one-title">
              <div>
                <UserDetails onChange={this.handleChange.bind(this, "metadata")} />
                <p className="az-dashboard-text">You are one step closer to landing your dream job.</p>
              </div>
            </div>{/* az-dashboard-one-title */}

            <div className="az-dashboard-nav">
              <nav className="nav">
              </nav>
            </div>

            <div className="az-interviewInput-wrapper">
              <div className="az-card-interviewInput">
                {this.state.mic_disabled ?
                  <Alert severity="error" className="mb-2">
                    <AlertTitle>Enable your Microphone</AlertTitle>
                    Enable your browser microphone and refresh the page to try again to practice interviewing. <span style={{ color: "red" }}>{this.state.errors["mic"]}</span>
                  </Alert> : <div></div>
                }
                <div className="az-interviewInput-header">
                  <Alert severity="warning" className="mb-2">
                    <AlertTitle>Welcome to the Cognea Beta!</AlertTitle>
                    <p>By creating an account or using Cognea, you acknowledge that you are bound by the <strong><a href="https://www.cognea.ai/termsofservice" target="_blank" rel="noopener noreferrer" style={{ "color": "inherit" }}>Terms of Service</a></strong>.</p>
                    Please try out our interview practice AI for <strong>free</strong>!
                    If you run into any issues please <strong>contact us</strong> through <strong><a href="https://www.cognea.ai/support" target="_blank" rel="noopener noreferrer" style={{ "color": "inherit" }}>Customer Support</a></strong> or
                    email us at <strong><a href="mailto: contact@cognea.ai" style={{ "color": "inherit" }}>contact@cognea.ai</a></strong> - Thanks :)
                  </Alert>
                  {isIOS ?
                    <Alert severity="info" className="mb-2">
                      <AlertTitle>iOS Device Detected</AlertTitle>
                      Please note that while our website is accessible on iOS devices, we recommend using web browsers on laptops/desktops for the optimal experience. The full functionality and features are best enjoyed on larger screens.
                    </Alert> : <div></div>
                  }
                  <h2>Please provide details for your interview.</h2>
                  <LoadingIndicator />
                  <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                      <label>Company</label>
                      <input type="text" className="form-control" placeholder="Google" onChange={this.handleChange.bind(this, "company")} value={this.state.interview["company"]} />
                      <span style={{ color: "red" }}>{this.state.errors["company"]}</span>
                    </div>{/* form-group */}
                    <div className="form-group">
                      <label>Role</label>
                      <input type="text" className="form-control" placeholder="Software Engineer" onChange={this.handleChange.bind(this, "job_title")} value={this.state.interview["job_title"]} />
                      <span style={{ color: "red" }}>{this.state.errors["job_title"]}</span>
                    </div>{/* form-group */}
                    <div className="form-group">
                      <label>Job Description</label>
                      <textarea className="form-control" rows="6" placeholder="Design, develop, test, deploy, and maintain high quality software" onChange={this.handleChange.bind(this, "job_description")} value={this.state.interview["job_description"]} />
                      <span style={{ color: "red" }}>{this.state.errors["job_description"]}</span>
                    </div>{/* form-group */}
                    <div className="form-group">
                      <label>Your experience</label>
                      <textarea className="form-control" rows="6" placeholder="Computer Science Graduate with experience in Full Stack development" onChange={this.handleChange.bind(this, "candidate_background")} value={this.state.interview["candidate_background"]} />
                      <span style={{ color: "red" }}>{this.state.errors["candidate_background"]}</span>
                    </div>{/* form-group */}
                    {this.state.is_mobile ?
                      <Alert severity="error" className="mb-2">
                        <AlertTitle>Unsupported Device Detected</AlertTitle>
                        <p>Please use a supported platform and browser.</p>
                        <p>We recommend using Cognea on the latest versions of Chrome, Edge, Firefox, or Safari on a Laptop/Desktop, with a working microphone and speakers.</p>
                        We apologize for any inconvenience and appreciate your understanding as we work to improve compatibility with more platforms and browsers. <span style={{ color: "red" }}>{this.state.errors["mobile"]}</span>
                      </Alert> : <div></div>
                    }
                    <button type="submit" className="btn btn-az-primary btn-block">Let's Practice</button>
                  </form>
                </div>{/* az-interviewInput-header */}
              </div>{/* az-card-interviewInput */}
            </div>{/* az-interviewInput-wrapper */}
          </div>{/* az-content-body */}
        </div>
        </StyleRoot>
      </div>
    )
  }
}

export default Dashboard