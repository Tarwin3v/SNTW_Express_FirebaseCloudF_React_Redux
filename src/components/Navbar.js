import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

//REDUX
import { connect } from 'react-redux';

// MUI
import { AppBar, Toolbar, Button, IconButton, Tooltip } from '@material-ui/core';
//ICONS
import { Home as HomeIcon, Notifications } from '@material-ui/icons';

//COMP
import CreateHowl from './CreateHowl';

const Navbar = ({ authenticated }) => {
	return (
		<AppBar>
			<Toolbar className="nav-container">
				<Tooltip title="home">
					<Button color="inherit" component={Link} to="/">
						<HomeIcon />
					</Button>
				</Tooltip>
				{authenticated && (
					<React.Fragment>
						<CreateHowl />
						<Tooltip title="notifications">
							<IconButton>
								<Notifications color="inherit" />
							</IconButton>
						</Tooltip>
					</React.Fragment>
				)}
				{!authenticated && (
					<React.Fragment>
						<Button color="inherit" component={Link} to="/login">
							Login
						</Button>
						<Button color="inherit" component={Link} to="/signup">
							Signup
						</Button>
					</React.Fragment>
				)}
			</Toolbar>
		</AppBar>
	);
};

Navbar.propTypes = {
	authenticated: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
	authenticated: state.user.authenticated
});

export default connect(mapStateToProps)(Navbar);
