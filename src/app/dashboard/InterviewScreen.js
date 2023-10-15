import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { trackPromise } from 'react-promise-tracker';
import { LoadToken, token } from '../shared/LoadToken';
import { Microphone, MicrophoneText } from '../shared/Microphone';
import { LoadingIndicator } from '../shared/LoaderIndicator';
import { AudioIndicator } from '../shared/AudioIndicator';
import hark from 'hark';
import { fadeIn } from 'react-animations';
import Radium, { StyleRoot } from 'radium';
import { SpeechConfig, AudioConfig, SpeechSynthesizer, ResultReason, SpeakerAudioDestination } from 'microsoft-cognitiveservices-speech-sdk';
import { isIOS, isFirefox, isSafari } from '../shared/UserAgentParsing';
import AudioRecorder from 'audio-recorder-polyfill'

var mediaRecorder;
const speechConfig = SpeechConfig.fromSubscription(process.env.REACT_APP_SPEECH_KEY, process.env.REACT_APP_SPEECH_REGION);
speechConfig.speechSynthesisVoiceName = "en-US-SaraNeural";
let player = new SpeakerAudioDestination();

const AudioUnmute = (props) => {
  if (props.visible) {
    return (
      <button type="submit" onClick={() => {
        props.hideMute();
      }}
        className="btn btn-az-warn btn-block">Unmute Audio</button>
    );
  } else {
    return <div></div>;
  }
}

export class InterviewScreen extends Component {
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
      end_interview: false,
      microphone_on: false,
      speaking: false,
      mic_muted: false,
    }
    this.componentCleanup = this.componentCleanup.bind(this);
    this.showUnmuteButton = isIOS || isSafari;
  }
  componentCleanup() {
    player.pause();
    player.close();
  }
  componentDidMount() {
    if (!isFirefox && !isSafari) {
      navigator.wakeLock.request("screen");
    }
    window.addEventListener('beforeunload', this.componentCleanup);
    if (!this.showUnmuteButton) this.recordAndSendAudio();
  }
  componentWillUnmount() {
    this.componentCleanup();
    window.removeEventListener('beforeunload', this.componentCleanup);
  }
  hideMute = () => {
    this.showUnmuteButton = false;
    this.setState({ speaking: true });
    this.forceUpdate();
    this.recordAndSendAudio();
  }
  recordAndSendAudio = async () => {
    this.setState({ speaking: !this.showUnmuteButton });
    this.forceUpdate();
    await new Promise((resolve, reject) => {
      player = new SpeakerAudioDestination();
      player.onAudioStart = function () {
        console.log('Cognea Started Speaking');
      }
      player.onAudioEnd = function () {
        console.log('Cognea Finished Speaking');
        resolve();
      }
      const synthesizer = new SpeechSynthesizer(speechConfig, AudioConfig.fromSpeakerOutput(player));
      synthesizer.speakTextAsync(this.state.last_response,
        function (result) {
          if (result.reason === ResultReason.SynthesizingAudioCompleted) {
            console.log("TTS Synthesis finished.");
          } else {
            console.log("Speech synthesis cancelled, " + result.errorDetails +
              "\nDid you set the speech resource key and region values?");
          }
          synthesizer.close();
        },
        function (err) {
          console.log("err - " + err);
          synthesizer.close();
          reject();
        }
      );
    }).catch((e) => {
      console.log("error: ", e);
    });
    this.setState({ speaking: false });
    this.forceUpdate();

    if (navigator.mediaDevices.getUserMedia) {
      console.log('Starting to record');

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      let mimeType = 'audio/webm';
      if (isSafari || isIOS) {
        mimeType = 'audio/wav';
        window.MediaRecorder = AudioRecorder;
      }
      mediaRecorder = new MediaRecorder(stream, { mimeType: mimeType });
      mediaRecorder.start();
      this.forceUpdate();

      const micMutedTimeout = setTimeout(() => {
        this.setState({ mic_muted: true });
      }, 5000);

      const mic = hark(stream, {});
      mic.on("speaking", () => {
        clearTimeout(micMutedTimeout);
        this.setState({
          microphone_on: true,
          mic_muted: false,
        });
        this.forceUpdate();
      });
      mic.on("stopped_speaking", () => {
        this.setState({ microphone_on: false });
        this.forceUpdate();
      });

      const speech = hark(stream, { interval: 250 });
      speech.on('stopped_speaking', function () {
        console.log('Not Speaking');
        if (mediaRecorder.state === 'recording') mediaRecorder.stop(); // Triggers ondataavailable()
      });

      mediaRecorder.addEventListener('dataavailable', async e => {
        this.stopRecording();
        if (this.state.end_interview) return;

        var reader = new FileReader();
        reader.readAsDataURL(e.data);

        let metadata = this.state.metadata;

        let ai_response = await new Promise((resolve) => {
          reader.onloadend = function () {
            trackPromise(fetch(process.env.REACT_APP_BACKEND_API, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                metadata: metadata,
                interview: {
                  state: 'candidate_response',
                  candidate_response: reader.result
                }
              }),
            }).then(res => res.json()).then(data => {
              if (data.state === 'response') {
                resolve(data.ai_response);
              } else {
                console.log(data);
              }
            }));
          }
        })
        this.setState({
          last_response: ai_response,
        });
        if (this.state.end_interview) return;
        if (isIOS) {
          this.showUnmuteButton = true;
          this.forceUpdate();
        } else {
          this.recordAndSendAudio();
        }
      });
    } else {
      console.log('Recording not supported');
    }
  };
  stopRecording = async () => {
    if (mediaRecorder) {
      this.setState({ microphone_on: false });
      this.forceUpdate();
      if (mediaRecorder.state === 'recording') mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach((track) => track.stop());
    }
  };
  handleEnd = (event) => {
    event.preventDefault();
    this.setState({ end_interview: true });
    player.close();
    this.stopRecording();
    trackPromise(fetch(process.env.REACT_APP_BACKEND_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        ...this.state,
        interview: {
          state: "end_interview"
        }
      }),
    }).then(res => res.json()).then(data => {
      if (data.state === 'response') {
        let session = {
          id: this.state.metadata.id,
          session_id: this.state.metadata.session_id,
          session_container: this.state.metadata.session_container,
          last_response: data.ai_response
        };
        this.props.history.push({
          pathname: `/feedback`,
          state: session
        });
      } else {
        console.log(data);
      }
    }));
  }
  render() {
    if (this.state === null || !this.state.hasOwnProperty('last_response')) {
      return <Redirect to='/dashboard' />
    }
    return (
      <div>
        <StyleRoot>
          <LoadToken />
          <div className="container p-md-0" style={{ animation: 'x 1s', animationName: Radium.keyframes(fadeIn, 'fadeIn') }}>
            <div className="az-content-body">

              <div className="az-interviewScreen-wrapper">
                <div className="az-card-interviewScreen">
                  <div className="az-interviewScreen-header">
                    <div className="form-group">
                      <label>Cognea's Response</label>
                      <textarea className="form-control" id="ai_response" placeholder="Response" rows="10" value={this.state.last_response} readOnly />
                      <AudioUnmute visible={this.showUnmuteButton} hideMute={this.hideMute} />
                      <AudioIndicator speaking={this.state.speaking} />
                    </div>{/* form-group */}
                    <LoadingIndicator />
                    <div className="form-group">
                      {this.state.mic_muted ?
                        <div style={{ textAlign: "center" }}>
                          <h5>Cognea can't hear you, check if your microphone is muted.</h5>
                        </div> : <div></div>}
                      <Microphone microphone_on={this.state.microphone_on} />
                      <MicrophoneText microphone_on={mediaRecorder && mediaRecorder.state === 'recording'} end_interview={this.state.end_interview} />
                    </div>{/* form-group */}
                    <form onSubmit={this.handleEnd} >
                      <button type="submit" className="btn btn-az-primary btn-block">End Interview</button>
                    </form>
                  </div>{/* az-interviewScreen-header */}
                </div>{/* az-card-interviewScreen */}
              </div>{/* az-interviewScreen-wrapper */}

            </div>{/* az-content-body */}
          </div>
        </StyleRoot>
      </div>
    )
  }
}

export default InterviewScreen
