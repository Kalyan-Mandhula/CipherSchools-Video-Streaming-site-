import React, { useState } from "react";
import { Alert, Container } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { Link } from "react-router-dom";
import axios from "axios";
import { UserLogin } from "../redux/ReduxActions/UserActions";
import { useDispatch } from "react-redux";

const RegisterUser = async (UserDetails) => {
  const { data } = await axios.post("/api/users/register", { ...UserDetails });
  return data;
};

export default function Register() {
  const dispatch = useDispatch();
  const [validated, setValidated] = useState(false);
  const [AlertMessage, setAlertMessage] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const form = event.currentTarget;
    const UserDetails = {
      name: form.name.value,
      email: form.email.value,
      password: form.password.value,
    };

    if (event.currentTarget.checkValidity()) {
      RegisterUser(UserDetails)
        .then((res) => {
          if (res.success) {
            dispatch(UserLogin(res.User));
            sessionStorage.setItem("User", JSON.stringify(res.User));
            window.location.href = "/";
          } else {
            setAlertMessage(res);
          }
        })
        .catch((err) => console.log(err));
    }
    setValidated(true);
  };

  return (
    <Container style={{ width: "35%", marginTop: "2rem" }}>
      <Alert variant="danger" show={AlertMessage ? true : false}>
        {AlertMessage}
      </Alert>
      <Form noValidate validated={validated} onSubmit={(e) => handleSubmit(e)}>
        <h4>Create Account</h4>
        <Form.Group
          controlId="validationCustom01"
          style={{ marginBottom: "1rem", marginTop: "1rem" }}
        >
          <Form.Label>First name</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="First name"
            name="name"
          />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
        <Form.Group
          controlId="validationCustomUsername"
          style={{ marginBottom: "1rem", marginTop: "1rem" }}
        >
          <Form.Label>Email address</Form.Label>
          <InputGroup hasValidation>
            <Form.Control
              type="email"
              name="email"
              placeholder="Enter email"
              aria-describedby="inputGroupPrepend"
              required
            />
            <Form.Control.Feedback type="invalid">
              Please choose a email address.
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>
        <Form.Group
          controlId="validationCustom03"
          style={{ marginBottom: "1rem", marginTop: "1rem" }}
        >
          <Form.Label>Password</Form.Label>
          <Form.Control
            name="password"
            type="password"
            placeholder="Enter your password"
            required
            minLength={6}
          />
          <Form.Control.Feedback type="invalid">
            Please provide a valid password.
          </Form.Control.Feedback>
          <Form.Label className=" mt-2 text-secondary">
            Password should have atleast six letters
          </Form.Label>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Alreay have an account ? </Form.Label>
          {"  "}
          <Link to="/login" className="text-danger">
            Login
          </Link>
        </Form.Group>
        <Button type="submit">Register</Button>
      </Form>
    </Container>
  );
}
