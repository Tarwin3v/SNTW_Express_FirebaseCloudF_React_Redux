import React, { Component } from "react";
import PropTypes from "prop-types";

//REDUX
import { connect } from "react-redux";
import { getHowls } from "../redux/actions/dataAction";

//MUI
import { Grid } from "@material-ui/core";

//COMP
import Howl from "../components/Howl";
import Profile from "../components/Profile";

class Home extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    getHowls: PropTypes.func.isRequired
  };
  componentDidMount() {
    this.props.getHowls();
  }

  render() {
    const { howls, loading } = this.props.data;
    let recentHowls = !loading ? (
      howls.map((howl, idx) => <Howl key={idx} howl={howl} />)
    ) : (
      <p>Loading ...</p>
    );
    return (
      <Grid container spacing={10}>
        <Grid item sm={8} xs={12}>
          {recentHowls}
        </Grid>
        <Grid item sm={4} xs={12}>
          <Profile />
        </Grid>
      </Grid>
    );
  }
}

const mapStateToProps = (state) => ({
  data: state.data
});

export default connect(mapStateToProps, { getHowls })(Home);
