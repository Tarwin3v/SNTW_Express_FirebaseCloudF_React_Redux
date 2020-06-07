import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import icon from '../assets/icon.png';

// REDUX
import { connect } from 'react-redux';
import { loginUser } from '../redux/actions/userAction';

//MUI
import { withStyles } from '@material-ui/core/styles';
import { Grid, Typography, TextField, Button, CircularProgress } from '@material-ui/core';

const styles = (theme) => ({
	form: {
		textAlign: 'center'
	},
	image: {
		margin: '20px auto 20px auto'
	},
	title: {
		margin: '10px auto 10px auto'
	},
	button: {
		margin: '20px auto'
	},
	textField: {
		margin: '10px auto 10px auto'
	},
	errors: {
		color: 'red',
		fontSize: '0.8rem',
		marginTop: 10
	},
	spinner: {
		left: 10
	}
});

class Login extends Component {
	state = {
		email: '',
		password: ''
	};

	static propTypes = {
		classes: PropTypes.object.isRequired,
		loginUser: PropTypes.func.isRequired,
		user: PropTypes.object.isRequired,
		UI: PropTypes.object.isRequired
	};

	handleSubmit = (event) => {
		event.preventDefault();

		this.props.loginUser(
			{
				email: this.state.email,
				password: this.state.password
			},
			this.props.history
		);
	};

	handleChange = (event) => {
		this.setState({
			[event.target.name]: event.target.value
		});
	};

	render() {
		const { classes, UI: { loading, errors } } = this.props;

		const { email, password } = this.state;

		return (
			<Grid container className={classes.form}>
				<Grid item sm />
				<Grid item sm>
					<img src={icon} alt="social ape logo" className={classes.image} />
					<Typography variant="h2" className={classes.title}>
						Login
					</Typography>
					<form onSubmit={this.handleSubmit}>
						<TextField
							id="email"
							name="email"
							type="email"
							label="Email"
							className={classes.textField}
							value={email}
							onChange={this.handleChange}
							fullWidth
						/>
						<TextField
							id="password"
							name="password"
							type="password"
							label="Password"
							className={classes.textField}
							value={password}
							onChange={this.handleChange}
							fullWidth
						/>
						{errors.general && (
							<Typography variant="body2" className={classes.errors}>
								{errors.general}
							</Typography>
						)}
						<Button
							type="submit"
							variant="contained"
							color="primary"
							className={classes.button}
							disabled={email.trim() === '' || password.trim() === ''}
						>
							{loading ? (
								<CircularProgress color="inherit" size={20} className={classes.spinner} />
							) : (
								'Login'
							)}
						</Button>
						<div />
						<Typography variant="caption" color="primary" component={Link} to="/signup">
							dont have an account ? Sign up here
						</Typography>
					</form>
				</Grid>
				<Grid item sm />
			</Grid>
		);
	}
}

const mapStateToProps = (state) => ({
	user: state.user,
	UI: state.UI
});

const mapActionsToProps = {
	loginUser
};

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(Login));
