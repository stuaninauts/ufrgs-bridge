import React, { Component } from 'react';

export default class LoginPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            isLoggedIn: false
        };
    }

    handleInputChange = (event) => {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    }

    handleSubmit = (event) => {
        event.preventDefault();
  

        console.log("Username:", this.state.username);
        console.log("Password:", this.state.password);
        
        // testing
        if (this.state.username !== '' && this.state.password !== '') {
            this.setState({
                isLoggedIn: true
            });
        }
    }

    render() {
        if (this.state.isLoggedIn) {
            return <h1>Welcome {this.state.username}!</h1>;
        } else {
            return (
                <div>
                    <h1>Login Page</h1>
                    <form onSubmit={this.handleSubmit}>
                        <div>
                            <label>Username:</label>
                            <input
                                type="text"
                                name="username"
                                value={this.state.username}
                                onChange={this.handleInputChange}
                            />
                        </div>
                        <div>
                            <label>Password:</label>
                            <input
                                type="password"
                                name="password"
                                value={this.state.password}
                                onChange={this.handleInputChange}
                            />
                        </div>
                        <button type="submit">Login</button>
                    </form>
                </div>
            );
        }
    }
}