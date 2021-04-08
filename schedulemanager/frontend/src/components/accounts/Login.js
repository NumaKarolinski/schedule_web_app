import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { login } from "../../actions/auth";

export class Login extends Component {
    state = {
        username: "",
        password: "",
        pageHeight: window.innerHeight,
    };

    static propTypes = {
        login: PropTypes.func.isRequired,
        isAuthenticated: PropTypes.bool,
    };

    componentDidMount() {
        window.addEventListener('resize', () => this.setState({ ...this.state, pageHeight: window.innerHeight }));
    }

    onSubmit = (e) => {
        e.preventDefault();
        this.props.login(this.state.username, this.state.password);
    };

    onChange = (e) =>
        this.setState({
            [e.target.name]: e.target.value,
        });

    render() {
        if (this.props.isAuthenticated) {
            return <Redirect to="/" />;
        }

        const { username, password, pageHeight } = this.state;

        const smallMedia = pageHeight <= 435.2;
        
        const labelClasses = smallMedia ? "noselect mb-1" : "noselect";

        const inputClasses = smallMedia ? "form-control py-0" : "form-control";

        const divGroupClasses = smallMedia ? "form-group mb-1" : "form-group";

        return (
            <div className="col-md-6 m-auto">
                <div className = { "card card-body" + (smallMedia ? " py-1" : "") }>
                    <p className = { "text-center noselect" + (smallMedia ? " mb-1 h3" : " h2") }>Login</p>
                    <form onSubmit={this.onSubmit}>
                        <div className = { divGroupClasses }>
                            <label className = { labelClasses }>Username</label>
                            <input
                              type="text"
                              className = { inputClasses }
                              style = { smallMedia ? { height: "30px" } : null}
                              name="username"
                              onChange={this.onChange}
                              value={username}
                            />
                        </div>
                        <div className = { divGroupClasses }>
                            <label className = { labelClasses }>Password</label>
                            <input
                              type="password"
                              className = { inputClasses }
                              style = { smallMedia ? { height: "30px" } : null}
                              name="password"
                              onChange={this.onChange}
                              value={password}
                            />
                        </div>
                        <div className = { smallMedia ? "d-flex flex-row flex-wrap mt-2" : "d-flex flex-row flex-wrap" }>
                            <div className="form-group mt-0 mb-2 mr-2 ml-0">
                                <button type="submit" className = { smallMedia ? "btn btn-primary px-2 py-1" : "btn btn-primary" }>Login</button>
                            </div>
                            <div className = "noselect d-flex flex-row flex-wrap mt-0 mx-0 mb-2" style = {{ alignItems: "center", width: "209.4px" }}>
                                <p className = "my-0 ml-0 mr-1">Don't have an account?</p>
                                <Link to="/register">Register</Link>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { login })(Login);
