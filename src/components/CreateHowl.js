import React, { Component } from 'react';
import PropTypes from 'prop-types';

//REDUX
import { connect } from 'react-redux';
import { postHowl } from '../redux/actions/dataAction';

//MUI
import { withStyles } from '@material-ui/core/styles';
import { Button, TextField, Dialog, DialogTitle, DialogContent, CircularProgress } from '@material-ui/core';
//ICON
import { Add as AddIcon, Close as CloseIcon } from '@material-ui/icons';

const styles = (theme) => ({
	submitButton: {
		position: 'relative',
		marginTop: '10px',
		left: '78%'
	},
	progressSpinner: {
		position: 'absolute'
	},
	closeButton: {
		position: 'absolute',
		left: '90%',
		top: '10%'
	}
});

class createHowl extends Component {
	state = {
		open: false,
		body: ''
	};
	static propTypes = {
		classes: PropTypes.object.isRequired,
		postHowl: PropTypes.func.isRequired,
		UI: PropTypes.object.isRequired
	};

	handleOpen = () => {
		this.setState({ open: true });
	};
	handleClose = () => {
		this.setState({ open: false });
	};

	handleChange = (event) => {
		this.setState({ [event.target.name]: event.target.value });
	};

	handleSubmit = (event) => {
		event.preventDefault();
		this.props.postHowl({
			body: this.state.body
		});
		this.setState({ open: false });
	};

	render() {
		const { classes, UI: { loading } } = this.props;
		const { body, open } = this.state;
		return (
			<div>
				<Button onClick={this.handleOpen} children="Post howl">
					<AddIcon color="primary" />
				</Button>
				<Dialog open={open} onClose={this.handleClose} fullWidth maxWidth="sm">
					<Button onClick={this.handleClose} className={classes.closeButton}>
						<CloseIcon color="secondary" />
					</Button>
					<DialogTitle>Post howl</DialogTitle>
					<DialogContent>
						<form onSubmit={this.handleSubmit}>
							<TextField
								name="body"
								type="text"
								label="Howl"
								multiline
								rows="3"
								placeholder="Howl content"
								className={classes.textField}
								onChange={this.handleChange}
								fullWidth
							/>
							<Button
								type="submit"
								variant="contained"
								color="primary"
								className={classes.submitButton}
								disabled={body.trim() === ''}
							>
								Submit{loading && <CircularProgress size={30} className={classes.progressSpinner} />}
							</Button>
						</form>
					</DialogContent>
				</Dialog>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	UI: state.UI
});

export default connect(mapStateToProps, { postHowl })(withStyles(styles)(createHowl));
