import React, { Component, useState, useEffect } from "react";
import { Link, withRouter } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import { useMsal } from '@azure/msal-react';

const UserDetails = () => {
  const { accounts } = useMsal();
  const [userAccount, setUserAccount] = useState(null);

  useEffect(() => {
    if (accounts.length > 0) {
      setUserAccount(accounts[0]);
    }
  }, [accounts]);
  return (
    <div>
      <div className="az-img-user">
        <img
          src={require("../../assets/images/profile.jpeg")}
          alt=""
        ></img>
      </div>
      {userAccount && <h6>{userAccount.idTokenClaims.given_name}</h6>}
    </div>
  );
};

function signOutClickHandler(instance) {
  const logoutRequest = {
    account: instance.getActiveAccount(),
    postLogoutRedirectUri: "https://www.cognea.ai",
  };
  instance.logoutRedirect(logoutRequest);
}

function SignOutButton() {
  const { instance } = useMsal();

  return (
    <button onClick={() => signOutClickHandler(instance)} className="dropdown-item">
      <i className="typcn typcn-power-outline"></i> Sign Out
    </button>
  );
}


export class Header extends Component {
  closeMenu(e) {
    e.target.closest(".dropdown").classList.remove("show");
    e.target.closest(".dropdown .dropdown-menu").classList.remove("show");
  }

  toggleHeaderMenu(e) {
    e.preventDefault();
    document.querySelector("body").classList.toggle("az-header-menu-show");
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      document.querySelector("body").classList.remove("az-header-menu-show");
    }
  }

  render() {
    return (
      <div>
        <div className="az-header">
          <div className="container">
            <div className="az-header-left">
              <a href="https://cognea.ai" className="az-logo">
                Cognea
              </a>
              <a
                id="azMenuShow"
                onClick={event => this.toggleHeaderMenu(event)}
                className="az-header-menu-icon d-lg-none"
                href="#/"
              >
                <span></span>
              </a>
            </div>
            <div className="az-header-menu">
              <div className="az-header-menu-header">
                <a href="https://cognea.ai" className="az-logo">
                  Cognea
                </a>
                <a
                  href="#/"
                  onClick={event => this.toggleHeaderMenu(event)}
                  className="close"
                >
                  &times;
                </a>
              </div>
              {!this.props.isInterview ?
              <ul className="nav">
                <li
                  className={
                    this.isPathActive("/dashboard")
                      ? "nav-item active"
                      : "nav-item"
                  }
                >
                  <Link to="/dashboard" className="nav-link">
                    <i className="typcn typcn-chart-area-outline"></i> Dashboard
                  </Link>
                </li>
              </ul>
              : <div></div>}
            </div>
            <div className="az-header-right">
              <Dropdown className="az-profile-menu">
                <Dropdown.Toggle as={"a"} className="az-img-user">
                  <img
                    src={require("../../assets/images/profile.jpeg")}
                    alt=""
                  ></img>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <div className="az-dropdown-header d-sm-none">
                    <a
                      href="#/"
                      onClick={event => this.closeMenu(event)}
                      className="az-header-arrow"
                    >
                      <i className="icon ion-md-arrow-back"></i>
                    </a>
                  </div>
                  <div className="az-header-profile">
                    <UserDetails />
                  </div>
                  <SignOutButton />
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </div>
      </div>
    );
  }

  isPathActive(path) {
    return this.props.location.pathname.startsWith(path);
  }
}

export default withRouter(Header);
