import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import dayjs from "dayjs";

//REDUX
import { connect } from "react-redux";
import { logout, uploadImage } from "../redux/actions/userAction";

//MUI
import { withStyles } from "@material-ui/core/styles";
import {
  Button,
  Paper,
  Link as MuiLink,
  Typography,
  IconButton
} from "@material-ui/core";
//ICONS
import {
  LocationOn,
  Link as LinkIcon,
  CalendarToday,
  Edit as EditIcon,
  KeyboardReturn
} from "@material-ui/icons";

//COMP
import EditDetails from "./EditDetails";

const styles = (theme) => ({
  paper: {
    padding: 20
  },
  profile: {
    "& .image-wrapper": {
      textAlign: "center",
      position: "relative"
    },
    "& .profile-image": {
      width: 200,
      height: 200,
      objectFit: "cover",
      maxWidth: "100%",
      borderRadius: "50%"
    },
    "& .profile-details": {
      textAlign: "center",
      "& span, svg": {
        verticalAlign: "middle"
      },
      "& a": {
        color: theme.palette.primary.main
      }
    },
    "& hr": {
      border: "none",
      margin: "0 0 10px 0"
    },
    "& svg.button": {
      "&:hover": {
        cursor: "pointer"
      }
    }
  },
  buttons: {
    textAlign: "center",
    "& a": {
      margin: "20px 10px"
    }
  }
});

export class Profile extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    logout: PropTypes.func.isRequired,
    uploadImage: PropTypes.func.isRequired
  };

  handleImageUpload = (event) => {
    event.preventDefault();
    const image = event.target.files[0];
    const formData = new FormData();
    formData.append("image", image, image.name);

    this.props.uploadImage(formData);
  };

  handleEditPicture = () => {
    const fileInput = document.getElementById("fileInput");
    fileInput.click();
  };

  handleLogout = () => {
    this.props.logout();
  };

  render() {
    const {
      classes,
      user: {
        credentials: { handle, createdAt, imageUrl, website, location },
        loading,
        authenticated
      }
    } = this.props;

    let profileMarkup = !loading ? (
      authenticated ? (
        <Paper className={classes.paper}>
          <div className={classes.profile}>
            <div className="image-wrapper">
              <img
                src={imageUrl}
                alt={`profile of ${handle}`}
                className="profile-image"
              />
              <input
                type="file"
                onChange={this.handleImageUpload}
                hidden="hidden"
                id="fileInput"
              />
            </div>
            <hr />

            <div className="profile-details">
              <div>
                <IconButton onClick={this.handleEditPicture}>
                  <EditIcon color="primary" />
                </IconButton>
                <EditDetails />
                <IconButton onClick={this.handleLogout}>
                  <KeyboardReturn color="error" />
                </IconButton>
              </div>
              <MuiLink
                variant="h5"
                component={Link}
                to={`/users/${handle}`}
                color="primary"
              >
                @{handle}
              </MuiLink>
              <hr />
              {location && (
                <>
                  <LocationOn color="primary" />
                  <span>{location}</span>
                  <hr />
                </>
              )}
              {website && (
                <>
                  <LinkIcon color="primary" />
                  <a href={website} target="_blank" rel="noopener noreferrer">
                    {" "}
                    {website}
                  </a>
                  <hr />
                </>
              )}
              <CalendarToday color="primary" />{" "}
              <span>Joined {dayjs(createdAt).format("MMM YYYY")}</span>
            </div>
          </div>
        </Paper>
      ) : (
        <Paper className={classes.paper}>
          <Typography variant="body2" align="center">
            No profile found, please Login
          </Typography>
          <div className={classes.buttons}>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/login"
            >
              Login
            </Button>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/signup"
            >
              Signup
            </Button>
          </div>
        </Paper>
      )
    ) : (
      <p>Loading...</p>
    );

    return profileMarkup;
  }
}

const mapStateToProps = (state) => ({
  user: state.user
});

const mapActionsToProps = {
  logout,
  uploadImage
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(Profile));
