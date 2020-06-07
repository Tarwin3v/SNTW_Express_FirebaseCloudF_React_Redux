import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import icon from "../assets/icon.png";

//REDUX
import { connect } from "react-redux";
import { signupUser } from "../redux/actions/userAction";

//MUI
import { withStyles } from "@material-ui/core/styles";
import {
  Grid,
  Typography,
  TextField,
  Button,
  CircularProgress
} from "@material-ui/core";

const styles = (theme) => ({
  form: {
    textAlign: "center"
  },
  image: {
    margin: "20px auto 20px auto"
  },
  title: {
    margin: "10px auto 10px auto"
  },
  button: {
    margin: "20px auto"
  },
  textField: {
    margin: "10px auto 10px auto"
  },
  errors: {
    color: "red",
    fontSize: "0.8rem",
    marginTop: 10
  },
  spinner: {
    left: 10
  }
});

class Signup extends Component {
  state = {
    email: "",
    password: "",
    confirmPassword: "",
    handle: "",
    errors: {}
  };

  static propTypes = {
    classes: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    UI: PropTypes.object.isRequired,
    signupUser: PropTypes.func.isRequired
  };

  static getDerivedStateFromProps(props, state) {
    if (props.UI.errors !== state.errors) {
      return {
        errors: props.UI.errors
      };
    }
    return null;
  }

  handleSubmit = (event) => {
    event.preventDefault();

    this.props.signupUser(
      {
        email: this.state.email,
        password: this.state.password,
        confirmPassword: this.state.confirmPassword,
        handle: this.state.handle
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
    const {
      classes,
      UI: { loading, errors }
    } = this.props;
    const { email, password, confirmPassword, handle } = this.state;

    return (
      <Grid container className={classes.form}>
        <Grid item sm />
        <Grid item sm>
          <img src={icon} alt="social ape logo" className={classes.image} />
          <Typography variant="h2" className={classes.title}>
            Signup
          </Typography>
          <form onSubmit={this.handleSubmit}>
            <TextField
              name="email"
              type="email"
              label="Email"
              className={classes.textField}
              value={email}
              onChange={this.handleChange}
              fullWidth
              error={errors.email ? true : false}
              helperText={errors.email}
            />
            <TextField
              name="password"
              type="password"
              label="Password"
              className={classes.textField}
              value={password}
              onChange={this.handleChange}
              fullWidth
              error={errors.password ? true : false}
              helperText={errors.password}
            />
            <TextField
              name="confirmPassword"
              type="password"
              label="Confirm Password"
              className={classes.textField}
              value={confirmPassword}
              onChange={this.handleChange}
              fullWidth
              error={errors.confirmPassword ? true : false}
              helperText={errors.confirmPassword}
            />
            <TextField
              name="handle"
              type="text"
              label="Handle"
              className={classes.textField}
              value={handle}
              onChange={this.handleChange}
              fullWidth
              error={errors.handle ? true : false}
              helperText={errors.handle}
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
              disabled={
                email.trim() === "" ||
                password.trim() === "" ||
                confirmPassword.trim() === "" ||
                handle.trim() === ""
              }
            >
              {loading ? (
                <CircularProgress
                  color="inherit"
                  size={20}
                  className={classes.spinner}
                />
              ) : (
                "Signup"
              )}
            </Button>
            <div></div>
            <Typography
              variant="caption"
              color="primary"
              component={Link}
              to="/login"
            >
              Already have an account ? Sign in here
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

export default connect(mapStateToProps, { signupUser })(
  withStyles(styles)(Signup)
);
