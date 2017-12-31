import React, { Component } from 'react';
import $ from 'jquery';
import PubSub from 'pubsub-js';
import CustomInput from './components/CustomInput';
import CustomTextArea from './components/CustomTextArea';
import ErrorHandler from './ErrorHandler';

var SHOW_FORM_STATUS = "user-account-created";

class UserForm extends Component {

	constructor() {
		super();
		this.state = {editing: false, name:"", username: "", email:"", password:"", description: ""};
		//Make 'this' in each function refer to 'this' from UserForm
		this.sendForm = this.sendForm.bind(this);
		this.setName = this.setName.bind(this);
		this.setUsername = this.setUsername.bind(this);
		this.setEmail = this.setEmail.bind(this);
		this.setDescription = this.setDescription.bind(this);
		this.setPassword = this.setPassword.bind(this);
	}

  	sendForm(event) {
	    event.preventDefault();

		$.ajax({
			url:`http://localhost:8080/api/users?u-auth-token=${localStorage.getItem("auth-token")}`,
			type:"post",
			contentType:"application/json",
			dataType:"json",
			data:JSON.stringify({name:this.state.name, email:this.state.email, username:this.state.username,
				password:this.state.password, profileDescription: this.state.description}),
			success: function(response){
				PubSub.publish(SHOW_FORM_STATUS, {});
				//Change form state
				this.setState({editing: true});
				//this.setState({name:"", username: "", email:"", password:"", description: ""});
			}.bind(this),
			error: function(response){
				//Handle validation errors
				if (response.status === 400) {
					new ErrorHandler().showErrors(response.responseJSON);
				}
			},
			beforeSend: function(){
				PubSub.publish("clear-errors", {});
			}
		});
	}

	setName(event) {
		this.setState({name: event.target.value});
	}

	setUsername(event) {
		this.setState({username: event.target.value});
	}

	setEmail(event) {
		this.setState({email: event.target.value});
	}

	setDescription(event) {
		this.setState({description: event.target.value});
	}

	setPassword(event) {
		this.setState({password: event.target.value});
	}

	render() {
		const buttonStyle = "pure-button " + (this.state.editing ? "custom-button-success" : "pure-button-primary");

		return(
			<form className="pure-form pure-form-stacked" onSubmit={this.sendForm} method="post">
				<fieldset>
					<span className="custom-success">{this.state.msg}</span>
					<CustomInput id="name" type="text" value={this.state.name} required="required"
						onChange={this.setName} label="Full Name" />
					<CustomInput id="username" type="text" value={this.state.username} required="required"
						onChange={this.setUsername} label="Username" />
					<CustomInput id="email" type="email" value={this.state.email} required="required"
						onChange={this.setEmail} label="Email" />
					<CustomTextArea name="description" value={this.state.description} required=""
						onChange={this.setDescription} placeholder="Say something cool about you!" />
					<CustomInput id="password" type="password" value={this.state.password} required="required"
						onChange={this.setPassword} label="Password" />

					<button type="submit" className={buttonStyle}>Save</button>
				</fieldset>
			</form>
		);
	}
}

//Generates admin User page
export default class UserBox extends Component {

	constructor() {
		super();
		this.state = {msg: ""};
		this.loadUsers = this.loadUsers.bind(this);
	}

	componentDidMount() {
		//this.loadUsers();

		//Subscribes to reload the list when it changes
		PubSub.subscribe(SHOW_FORM_STATUS, function(topic) {
			this.setState({msg: "Your account was successfully created!"});
		}.bind(this));
	}

	//Retrieve data via GET request and re-render page
	loadUsers() {
		$.ajax({
			url:`http://localhost:8080/api/users?u-auth-token=${localStorage.getItem("auth-token")}`,
			dataType:"json",
			success:function(response){
				//Update list and re-render page
				this.setState({list:response});
			}.bind(this)
		});
	}

	render() {
		return (
	        <div>
	            <div className="header">
	                <h1>Create Your Account</h1>
	                <h2>Spend just a few minutes to create your user account and start using the wonderful Luna Forum!</h2>
	            </div>
	            <br />
	            <div className="content" id="content">
					<UserForm />
	            </div>
	        </div>
		);
	}
}