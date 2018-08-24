import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Form, Icon, Input, Button } from "antd";
import { auth } from "../firebase";
import * as routes from "../const/routes";

const FormItem = Form.Item;

const PasswordForgetPage = () => (
  <div>
    <h1>Forget Password?</h1>
    <WrapPwForgetForm />
  </div>
);

const updateByPropertyName = (propertyName, value) => () => ({
  [propertyName]: value
});

const INITIAL_STATE = {
  email: "",
  error: null
};

class PasswordForgetForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { email } = this.state;

    auth
      .doPasswordReset(email)
      .then(() => {
        this.setState(() => ({ ...INITIAL_STATE }));
      })
      .catch(error => {
        this.setState(updateByPropertyName("error", error));
      });

    event.preventDefault();
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { email, error } = this.state;
    const isInvalid = email === "";

    return (
      <Form layout="inline" onSubmit={this.onSubmit}>
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
          <Button disabled={isInvalid} type="submit">
            Reset My Password
          </Button>
        </FormItem>

        <FormItem>{error && <p>{error.message}</p>}</FormItem>
      </Form>
    );
  }
}
const WrapPwForgetForm = Form.create()(PasswordForgetForm);

const PasswordForgetLink = () => (
  <p>
    <Link to={routes.PASSWORD_FORGET}>Forgot Password?</Link>
  </p>
);

export default PasswordForgetPage;

export { WrapPwForgetForm, PasswordForgetLink };
