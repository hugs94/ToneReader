import React, { Component } from "react";
import * as d3 from "d3";
import { connect } from "react-redux";
import { Row, Col, Divider } from "antd";
import { USER_TONE_DEFAULT } from "../const/emotes";
const INITIAL_STATE = {
  mood: "USER_TONE_DEFAULT"
};
class Tones extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }
  //userState is 'on load' state of mood=0
  //userMood is updated.
  componentDidUpdate() {
    const { moodState } = this.props;
    if (!moodState.userMood) {
      this.state.mood = moodState.userState;
    } else if (moodState.usersState) {
      this.state.mood = moodState.userMood;
    } else {
      this.state.mood = 0;
    }
    //console.log(this.state);
  }

  render() {
    const DemoBox = props => (
      <p className={`height-${props.value}`}>{props.children}</p>
    );

    const angerBar = d3.interpolateReds(this.state.mood[0].score);
    const fearBar = d3.interpolateYlOrBr(this.state.mood[1].score);
    const joyBar = d3.interpolateYlGn(this.state.mood[2].score);
    const sadBar = d3.interpolateYlGnBu(this.state.mood[3].score);
    const intBar = d3.interpolateCubehelixDefault(this.state.mood[4].score);
    const egoBar = d3.interpolateMagma(this.state.mood[5].score);
    const doubtBar = d3.interpolatePuBuGn(this.state.mood[6].score);
    return (
      <div className="toneContainer">
        <Row>
          <Col
            className="emotebar-anger"
            style={{
              backgroundColor: `${angerBar}`
            }}
            span={6}
          >
            <DemoBox value={100}>Anger</DemoBox>
          </Col>
          <Col
            className="emotebar-fear"
            span={6}
            style={{
              backgroundColor: `${fearBar}`
            }}
          >
            <DemoBox value={100}>Fear</DemoBox>
          </Col>
          <Col
            className="emotebar-joy"
            span={6}
            style={{
              backgroundColor: `${joyBar}`
            }}
          >
            <DemoBox value={100}>Joy</DemoBox>
          </Col>
          <Col
            className="emotebar-sad"
            span={6}
            style={{
              backgroundColor: `${sadBar}`
            }}
          >
            <DemoBox value={100}>Sad</DemoBox>
          </Col>
        </Row>
        <div className="moodDiv" />
        <Row>
          <Col
            className="emotebar-ego"
            span={8}
            style={{
              backgroundColor: `${egoBar}`
            }}
          >
            <DemoBox value={100}>Confident</DemoBox>
          </Col>
          <Col
            className="emotebar-int"
            span={8}
            style={{
              backgroundColor: `${intBar}`
            }}
          >
            <DemoBox value={100}>Analytical</DemoBox>
          </Col>
          <Col
            className="emotebar-doubt"
            span={8}
            style={{
              backgroundColor: `${doubtBar}`
            }}
          >
            <DemoBox value={100}>Tentative</DemoBox>
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  users: state.usersState.users,
  sessionState: state.sessionState,
  moodState: state.moodState
});

export default connect(mapStateToProps)(Tones);
