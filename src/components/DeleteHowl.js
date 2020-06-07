import React, { Component } from 'react';
import PropTypes from 'prop-types';

//REDUX
import { connect } from 'react-redux';
import { deleteHowl } from '../redux/actions/dataAction';

//MUI
import { withStyles } from '@material-ui/core/styles';
import { Dialog, DialogActions, DialogTitle, Button, Tooltip } from '@material-ui/core';

//ICONS
import { Clear as ClearIcon } from '@material-ui/icons';

const styles = (theme) => ({
	deleteButton: {
		position: 'absolute',
		left: '90%',
		top: '10%'
	}
});

class DeleteHowl extends Component {
	state = {
		open: false
	};

	static propTypes = {
		classes: PropTypes.object.isRequired,
		deleteHowl: PropTypes.func.isRequired,
		howlId: PropTypes.string.isRequired
	};

	handleOpen = () => {
		this.setState({ open: true });
	};

	handleClose = () => {
		this.setState({ open: false });
	};

	deleteHowl = () => {
		this.props.deleteHowl(this.props.howlId);
		this.setState({ open: false });
	};

	render() {
		const { classes } = this.props;
		return (
			<React.Fragment>
				<Tooltip title="Delete">
					<Button onClick={this.handleOpen} className={classes.deleteButton}>
						<ClearIcon color="secondary" />
					</Button>
				</Tooltip>
				<Dialog open={this.state.open} onClose={this.handleClose} fullWidth maxWidth="sm">
					<DialogTitle>Do you want to delete this howl?</DialogTitle>
					<DialogActions>
						<Button onClick={this.handleClose} color="secondary" children="No" variant="contained" />
						<Button onClick={this.deleteHowl} color="primary" children="Yes" variant="contained" />
					</DialogActions>
				</Dialog>
			</React.Fragment>
		);
	}
}

export default connect(null, { deleteHowl })(withStyles(styles)(DeleteHowl));
