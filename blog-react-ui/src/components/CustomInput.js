import React, { Component } from 'react';
import PubSub from 'pubsub-js';

export default class CustomInput extends Component {

    constructor() {
        super();
        this.state = {errorMsg:""};
    }

    componentDidMount() {
        //Subscribe to handle validation errors
        PubSub.subscribe("validation-error", function(topic, error) {
            if (error.field === this.props.id) {
                this.setState({errorMsg:error.defaultMessage});
            }
        }.bind(this));

        //Subscribe to clear error messages
        PubSub.subscribe("clear-errors", function(topic) {
            this.setState({errorMsg:""});
        }.bind(this));
    }

	render (){
		return (
				<div className="pure-control-group">
					<label htmlFor={this.props.id}>{this.props.label}</label>
					<input {...this.props} className="pure-input-1" />
                    <span className="pure-form-message custom-error">{this.state.errorMsg}</span>
				</div>	
			);
	}
}