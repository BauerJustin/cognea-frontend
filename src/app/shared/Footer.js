import React, { Component } from 'react'

export class Footer extends Component {
  render() {
    return (
      <div>
        <div className="az-footer ht-40">
          <div className="container ht-100p pd-t-0-f">
            <div className="d-sm-flex justify-content-center justify-content-sm-between py-2 w-100">
              <span className="text-muted text-center text-sm-left d-block d-sm-inline-block">
                © <a href="https://www.bootstrapdash.com/" target="_blank" rel="noopener noreferrer">bootstrapdash.com </a>2020
                © <a href="https://www.cognea.ai/" target="_blank" rel="noopener noreferrer">cognea.ai </a>2023
              </span>
              <span className="text-muted text-center text-sm-right d-block d-sm-inline-block">
                <a href="https://www.cognea.ai/termsofservice" target="_blank" rel="noopener noreferrer" className="mr-3">Terms of Service</a>
                <a href="https://www.cognea.ai/privacy" target="_blank" rel="noopener noreferrer" className="mr-3">Privacy Policy</a>
                <a href="https://www.cognea.ai/support" target="_blank" rel="noopener noreferrer">Customer Support</a>
              </span>
            </div>
          </div>{/* container */}
        </div>{/* az-footer */}
      </div>
    )
  }
}

export default Footer
