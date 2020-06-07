import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

//REDUX
import { connect } from 'react-redux';
import { likeHowl, unlikeHowl } from '../redux/actions/dataAction';
//MUI
import { withStyles } from '@material-ui/core/styles';
import { Card, CardContent, CardMedia, Typography, IconButton, Tooltip } from '@material-ui/core';
//ICONS
import { Chat as ChatIcon, FavoriteBorder, Favorite } from '@material-ui/icons';

//COMP
import DeleteHowl from './DeleteHowl';

const styles = (theme) => ({
	card: {
		position: 'relative',
		display: 'flex',
		marginBottom: 20
	},
	image: {
		minWidth: 200,
		objectFit: 'cover'
	},
	content: {
		padding: 25
	}
});

class Howl extends Component {
	static propTypes = {
		user: PropTypes.object.isRequired,
		howl: PropTypes.object.isRequired,
		classes: PropTypes.object.isRequired,
		likeHowl: PropTypes.func.isRequired,
		unlikeHowl: PropTypes.func.isRequired
	};

	likedHowl = () => {
		if (this.props.user.likes && this.props.user.likes.find((like) => like.howlId === this.props.howl.howlId))
			return true;
		else return false;
	};

	likeHowl = () => {
		this.props.likeHowl(this.props.howl.howlId);
	};

	unlikeHowl = () => {
		this.props.unlikeHowl(this.props.howl.howlId);
	};

	render() {
		dayjs.extend(relativeTime);
		const {
			classes,
			howl: { body, createdAt, userImage, userHandle, likeCount, commentCount, howlId },
			user: { authenticated, credentials: { handle } }
		} = this.props;

		const likeButton = !authenticated ? (
			<IconButton>
				<Link to="/login">
					<FavoriteBorder color="error" />
				</Link>
			</IconButton>
		) : this.likedHowl() ? (
			<Tooltip title="unlike">
				<IconButton onClick={this.unlikeHowl}>
					<Favorite color="error" />
				</IconButton>
			</Tooltip>
		) : (
			<Tooltip title="like">
				<IconButton onClick={this.likeHowl}>
					<FavoriteBorder color="error" />
				</IconButton>
			</Tooltip>
		);
		const deleteButton = authenticated && userHandle === handle ? <DeleteHowl howlId={howlId} /> : null;
		return (
			<Card className={classes.card}>
				<CardMedia image={userImage} title="Profile image" className={classes.image} />
				<CardContent className={classes.content}>
					<Typography variant="h5" color="primary" component={Link} to={`/users/${userHandle}`}>
						{userHandle}
					</Typography>
					{deleteButton}
					<Typography variant="body2" color="textSecondary">
						{dayjs(createdAt).fromNow()}
					</Typography>
					<Typography variant="body1">{body}</Typography>
					{likeButton}
					<span>{likeCount} Likes</span>
					<IconButton onClick={this.handleEditPicture}>
						<ChatIcon color="primary" />
					</IconButton>
					<span>{commentCount} comments</span>
				</CardContent>
			</Card>
		);
	}
}

const mapStateToProps = (state) => ({
	user: state.user
});

export default connect(mapStateToProps, { likeHowl, unlikeHowl })(withStyles(styles)(Howl));
