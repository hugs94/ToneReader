import React, { Component } from "react";
import { Form, Icon, Input, Button } from "antd";
import { auth } from "../firebase";

const FormItem = Form.Item;
const updateByPropertyName = (propertyName, value) => () => ({
  [propertyName]: value
});

const INITIAL_STATE = {
  passwordOne: "",
  passwordTwo: "",
  error: null
};

class PasswordChangeForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { passwordOne } = this.state;

    auth
      .doPasswordUpdate(passwordOne)
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
    const { passwordOne, passwordTwo, error } = this.state;
    const isInvalid = passwordOne !== passwordTwo || passwordOne === "";

    return (
      <Form onSubmit={this.onSubmit}>
        <FormItem>
          {getFieldDecorator("Email Address", {
            rules: [{ required: true, message: "Please input your Email!" }]
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
              value={passwordOne}
              onChange={event =>
                this.setState(
                  updateByPropertyName("passwordOne", event.target.value)
                )
              }
              type="password"
              placeholder="Current Password"
            />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator("Email Address", {
            rules: [{ required: true, message: "Please input your Email!" }]
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
              value={passwordTwo}
              onChange={event =>
                this.setState(
                  updateByPropertyName("passwordTwo", event.target.value)
                )
              }
              type="password"
              placeholder="New Password"
            />
          )}
        </FormItem>
        <FormItem>
          <Button type="submit" disabled={isInvalid} htmlType="submit">
            Update Password
          </Button>
        </FormItem>

        <FormItem>{error && <p>{error.message}</p>}</FormItem>
      </Form>
    );
  }
}
const WrapPasswordChangeForm = Form.create()(PasswordChangeForm);

export default WrapPasswordChangeForm;
