import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { logout } from "../../actions/auth";

export class Header extends Component {

    state = {
        smallMedia: window.matchMedia("(max-width: 250px)").matches,
        otherSmallMedia: window.matchMedia("(max-width: 293px)").matches,
        active: false,
    }

    static propTypes = {
        auth: PropTypes.object.isRequired,
        logout: PropTypes.func.isRequired,
    };

    componentDidMount() {
        const wmm1 = window.matchMedia("(max-width: 250px)");
        const wmm2 = window.matchMedia("(max-width: 293px)");
        wmm1.addEventListener("change", () => this.setState({ ...this.state, smallMedia: wmm1.matches }));
        wmm2.addEventListener("change", () => this.setState({ ...this.state, otherSmallMedia: wmm2.matches }));
    }

    handleClick = (e) => {
        if (e.currentTarget.id === "navButton") {
            this.setState({ ...this.state, "active": !this.state.active });
        }
    }

    render() {
        const { isAuthenticated, user } = this.props.auth;

        const authLinks = (
            <ul className="navbar-nav ml-auto mt-1 mt-lg-0 d-flex flex-row flex-wrap">
                <span className="navbar-text mr-3 noselect">
                    <strong>{(this.state.smallMedia && !this.state.active) || (this.state.otherSmallMedia && this.state.active) ? (user ? `${user.username}` : "") : (user ? `Welcome ${user.username}` : "")}</strong>
                </span>
                <li className="nav-item">
                    <button
                        onClick={this.props.logout}
                        className="nav-link btn btn-info btn-sm text-light noselect"
                    >
                        Logout
                    </button>
                </li>
            </ul>
        );

        const guestLinks = (
            <ul className="navbar-nav ml-auto mt-1 mt-lg-0 d-flex flex-row flex-wrap">
                <li className="nav-item mr-3">
                    <Link to="/login" className="nav-link noselect">
                        Login
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="/register" className="nav-link noselect">
                        Register
                    </Link>
                </li>
            </ul>
        );

        return (
            <nav className="navbar navbar-expand-sm navbar-light bg-light">
                <div className="container d-flex flex-row align-items-start">
                    <div>
                        <button
                            id = "navButton"
                            className="navbar-toggler"
                            type="button"
                            data-toggle="collapse"
                            data-target="#navbarTogglerDemo01"
                            aria-controls="navbarTogglerDemo01"
                            aria-expanded="false"
                            aria-label="Toggle navigation"
                            onClick = { this.handleClick }
                        >
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
                            <div className="d-flex flex-column flex-sm-row flex-md-row flex-lg-row flex-xl-row">
                                <a className="navbar-brand noselect" href="#/eventDefinitions">
                                    Events
                                </a>
                                <a className="navbar-brand noselect" href="#/schedules">
                                    Schedules
                                </a>
                            </div>
                        </div>
                    </div>
                    {isAuthenticated ? authLinks : guestLinks}
                </div>
            </nav>
        );
    }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logout })(Header);
