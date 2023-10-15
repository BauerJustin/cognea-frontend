import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { trackPromise } from 'react-promise-tracker';
import EmptyStar from "../../assets/images/empty-star.svg";
import FilledStar from "../../assets/images/filled-star.svg";
import { LoadToken, token } from '../shared/LoadToken';
import { LoadingIndicator } from '../shared/LoaderIndicator';
import { fadeIn } from 'react-animations';
import Radium, {StyleRoot} from 'radium';

let rating = -1;

class Stars extends Component {
  constructor(props) {
    super(props);
    this.state = { currRating: 0 };
    this.onClick = this.onClick.bind(this);
  }

  onClick(e) {
    if (e.target.className === "star") {
      this.setRating(parseInt(e.target.dataset.value));
    }
  }

  setRating(value) {
    rating = value;
    this.setState({ currRating: value });
  }

  render() {
    return [...Array(this.props.starCount).keys()].map((index) => {
      return (
        <img
          key={index}
          data-value={index + 1}
          className="star"
          onClick={this.onClick}
          src={index + 1 <= this.state.currRating ? FilledStar : EmptyStar}
          alt={
            index + 1 <= this.state.currRating ? "filled star" : "empty star"
          }
        />
      );
    });
  }
}

const StarRatingSystem = () => {
  return (
    <div>
      <Stars starCount={5} />
    </div>
  );
};

export class SubmitFeedback extends Component {
  constructor(props) {
    super(props);
    let old_state = this.props.location.state;
    this.state = {
      metadata: {
        id: old_state.id,
        session_id: old_state.session_id,
        session_container: old_state.session_container,
      },
      last_response: old_state.last_response,
      feedback: "",
      rating: rating,
      interview: {
        state: "user_feedback"
      },
      error: ""
    };
  }
  handleChange(field, e) {
    if (field === "feedback") {
      this.setState({
        feedback: e.target.value,
        rating: rating
      });
      if (rating !== -1) {
        this.setState({error: ""})
      }
    } else {
      console.log("Unknown field")
    }
  }
  handleSubmit = (event) => {
    event.preventDefault();
    if (rating !== -1) {
      trackPromise(fetch(process.env.REACT_APP_BACKEND_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...this.state,
          rating: rating
        })
      }));
      this.props.history.push({
        pathname: `/dashboard`
      });
    } else {
      this.setState({error: "Rating required"})
    }
  }
  render() {
    if (this.state === null || !this.state.hasOwnProperty('last_response')) {
      return <Redirect to='/dashboard' />
    }
    return (
      <div>
        <StyleRoot>
        <LoadToken />
        <div className="container p-md-0" style={{animation: 'x 1s', animationName: Radium.keyframes(fadeIn, 'fadeIn')}}>
          <div className="az-content-body">

            <div className="az-submitFeedback-wrapper">
              <div className="az-card-submitFeedback">
                <div className="az-submitFeedback-header">
                  <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                      <label>Cognea's Feedback</label>
                      <textarea className="form-control" id="ai_response" placeholder="Response" rows="14" value={this.state.last_response} readOnly />
                    </div>{/* form-group */}
                    <div className="form-group" style={{ textAlign: "center" }}>
                      <label>Please rank your interview from 1 to 5 stars!</label>
                      <StarRatingSystem />
                      <span style={{ color: "red" }}>{this.state.error}</span>
                    </div>{/* form-group */}
                    <LoadingIndicator />
                    <div className="form-group">
                      <label>Your Feedback</label>
                      <textarea className="form-control" onChange={this.handleChange.bind(this, "feedback")} value={this.state["feedback"]} placeholder="Please let us know how if you have any feedback or how your experience was. We read each one!" rows="8" />
                    </div>{/* form-group */}
                    <button type="submit" className="btn btn-az-primary btn-block">Submit Feedback</button>
                  </form>
                </div>{/* az-submitFeedback-header */}
              </div>{/* az-card-submitFeedback */}
            </div>{/* az-submitFeedback-wrapper */}

          </div>{/* az-content-body */}
        </div>
        </StyleRoot>
      </div>
    )
  }
}

export default SubmitFeedback
