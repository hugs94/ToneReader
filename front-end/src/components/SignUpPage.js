import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import firebase from "firebase";
import { auth, db } from "../firebase";
import * as routes from "../const/routes";
import "antd/dist/antd.css";
import "../index.css";
import { Form, Icon, Input, Button, Checkbox, Tooltip } from "antd";

const FormItem = Form.Item;
const SignUpPage = ({ history }) => (
  <div>
    <h1>SignUp</h1>
    <SignUpForm history={history} />
  </div>
);

const updateByPropertyName = (propertyName, value) => () => ({
  [propertyName]: value
});

const INITIAL_STATE = {
  displayName: "",
  email: "",
  rooms: [],
  passwordOne: "",
  passwordTwo: "",
  error: null
};

class SignUpForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { displayName, email, passwordOne } = this.state;

    const { history } = this.props;

    auth
      .doCreateUserWithEmailAndPassword(email, passwordOne)

      .then(authedUser => {
        let user = firebase.auth().currentUser;
        /*
        due to this firebase auth setup, cannot correctly set the default values displayName
        during createUserWithEmailAndPassword, must updateProfile the user after 
        account creation. other following references for displayName are for state 
        handling while the update occurs.

        this issue is not present when using account Auth signups. which are on auth,
        create a returned 'user' object with displayName value read from preset auth.
        ex: googleauth would return displayName as the name you had set from google account
        
        */
        user.updateProfile({
          displayName: displayName
        });
        let authUser = authedUser.user;
        // Create a the displayed data values on firebase database
        db.doCreateUser(authedUser.user.uid, displayName, email)
          .then(() => {
            this.setState(() => ({ ...INITIAL_STATE }));
            history.push(routes.HOME);
          })
          .catch(error => {
            this.setState(updateByPropertyName("error", error));
          });
      })
      .catch(error => {
        this.setState(updateByPropertyName("error", error));
      });

    event.preventDefault();
  };

  render() {
    const { displayName, email, passwordOne, passwordTwo, error } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === "" ||
      displayName === "" ||
      email === "";
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0
        },
        sm: {
          span: 16,
          offset: 8
        }
      }
    };

    return (
      <Form onSubmit={this.onSubmit}>
        <FormItem
          {...formItemLayout}
          label={
            <span>
              Nickname&nbsp;
              <Tooltip title="What do you want others to call you?">
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
          }
        >
          <Input
            value={displayName}
            onChange={event =>
              this.setState(
                updateByPropertyName("displayName", event.target.value)
              )
            }
            type="text"
            placeholder="Full Name"
          />
        </FormItem>
        <FormItem {...formItemLayout} label="E-mail">
          <Input
            value={email}
            onChange={event =>
              this.setState(updateByPropertyName("email", event.target.value))
            }
            type="text"
            placeholder="Email Address"
          />
        </FormItem>
        <FormItem {...formItemLayout} label="Password">
          <Input
            value={passwordOne}
            onChange={event =>
              this.setState(
                updateByPropertyName("passwordOne", event.target.value)
              )
            }
            type="password"
            placeholder="Password"
          />
        </FormItem>
        <FormItem {...formItemLayout} label="Confirm Password">
          <Input
            value={passwordTwo}
            onChange={event =>
              this.setState(
                updateByPropertyName("passwordTwo", event.target.value)
              )
            }
            type="password"
            placeholder="Confirm Password"
          />
        </FormItem>
        <FormItem {...tailFormItemLayout}>
          <Button type="submit" disabled={isInvalid} htmlType="submit">
            Sign Up
          </Button>
        </FormItem>
        <FormItem>{error && <p>{error.message}</p>}</FormItem>
      </Form>
    );
  }
}

const SignUpLink = () => (
  <p>
    Don't have an account? <Link to={routes.SIGN_UP}>Sign Up</Link>
  </p>
);

export default withRouter(SignUpPage);

export { SignUpForm, SignUpLink };
