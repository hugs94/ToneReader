import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Form, Icon, Input, Button, Checkbox } from "antd";
import { SignUpLink } from "./SignUpPage";
import { PasswordForgetLink } from "./PassForget";
import { auth } from "../firebase";
import * as routes from "../const/routes";

const FormItem = Form.Item;

const SignInPage = ({ history }) => (
  <div>
    <h1>SignIn</h1>
    <WrapSignInForm history={history} />
  </div>
);

const updateByPropertyName = (propertyName, value) => () => ({
  [propertyName]: value
});

const INITIAL_STATE = {
  email: "",
  password: "",
  error: null
};

class SignInForm extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { email, password } = this.state;
    const { history } = this.props;
    auth
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState(() => ({ ...INITIAL_STATE }));
        history.push(routes.HOME);
      })
      .catch(error => {
        this.setState(updateByPropertyName("error", error));
      });
    event.preventDefault();
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { email, password, error } = this.state;
    const isInvalid = password === "" || email === "";

    return (
      <Form onSubmit={this.onSubmit} className="login-form">
        <FormItem>
          {getFieldDecorator("Email Address", {
            rules: [{ required: true, message: "Please input your Email!" }]
          })(
            <Input
              prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />}
              value={email}
              onChange={event =>
                this.setState(updateByPropertyName("email", event.target.value))
              }
              type="text"
              placeholder="Email Address"
            />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator("password", {
            rules: [{ required: true, message: "Please input your Password!" }]
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
              value={password}
              onChange={event =>
                this.setState(
                  updateByPropertyName("password", event.target.value)
                )
              }
              type="password"
              placeholder="Password"
            />
          )}
        </FormItem>
        <FormItem>
          <PasswordForgetLink />
          <Button
            disabled={isInvalid}
            type="submit"
            htmlType="submit"
            className="login-form-button"
          >
            Log in
          </Button>
          <SignUpLink />
        </FormItem>
        <FormItem>{error && <p>{error.message}</p>}</FormItem>
      </Form>
    );
  }
}
const WrapSignInForm = Form.create()(SignInForm);
export default withRouter(SignInPage);

export { WrapSignInForm };
