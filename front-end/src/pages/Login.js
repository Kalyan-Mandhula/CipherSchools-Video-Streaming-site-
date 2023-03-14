import { Alert, Container } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { UserLogin } from "../redux/ReduxActions/UserActions";
import { useDispatch } from "react-redux";
import axios from "axios";

const LoginUser = async (UserDetails) => {
  const { data } = await axios.post("/api/users/login", { ...UserDetails });
  return data;
};

export default function Login() {
  const [validated, setValidated] = useState(false);
  const [validCredentials, setValidCredentials] = useState(true);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const form = event.currentTarget.elements;
    const UserDetails = {
      email: form.email.value,
      password: form.password.value,
      doNotLogout: form.doNotLogout.checked,
    };
    if (event.currentTarget.checkValidity()) {
      LoginUser(UserDetails)
        .then((res) => {
          if (res.success) {
            dispatch(UserLogin(res.User));
            sessionStorage.setItem("User", JSON.stringify(res.User));
            localStorage.setItem("User", JSON.stringify(res.User));
            navigate("/");
          }
        })
        .catch((er) => {
          console.log(er);
          setValidCredentials(false);
        });
    }

    setValidated(true);
  };
  return (
    <Container style={{ width: "35%", marginTop: "2rem" }}>
      <Alert show={validCredentials === false} variant="danger">
        Email or password is incorrect
      </Alert>
      <Form noValidate validated={validated} onSubmit={(e) => handleSubmit(e)}>
        <h4>Login</h4>

        <Form.Group style={{ marginBottom: "1rem", marginTop: "1rem" }}>
          <Form.Label>Email address</Form.Label>
          <InputGroup hasValidation>
            <Form.Control
              name="email"
              type="email"
              placeholder="Enter email"
              aria-describedby="inputGroupPrepend"
              required
            />
            <Form.Control.Feedback type="invalid">
              Please choose a email address.
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>
        <Form.Group style={{ marginBottom: "1rem", marginTop: "1rem" }}>
          <Form.Label>Password</Form.Label>
          <Form.Control
            name="password"
            type="password"
            placeholder="Enter your password"
            required
          />
          <Form.Control.Feedback type="invalid">
            Please provide a valid password.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Check
            name="doNotLogout"
            label="Do not logout"
            feedback="You must agree before submitting."
            feedbackType="invalid"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Dont have an account ? </Form.Label>
          {"  "}
          <Link to="/register" className="text-danger">
            register
          </Link>
        </Form.Group>
        <Button type="submit">Login</Button>
      </Form>
    </Container>
  );
}
