import React, { useEffect, useState } from "react";
import { Alert, Container } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { UserLogin } from "../redux/ReduxActions/UserActions";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import axios from "axios";

const FetchUser = async (id) => {
  const { data } = await axios.get(`/api/users/${id}`);
  return data;
};

export default function UserProfile() {
  const [validated, setValidated] = useState(false);
  const [Details, setDetails] = useState({});
  const [update, setupdate] = useState(false);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const UpdateProfile = async (UserDetails) => {
    const { data } = await axios.put(`/api/users/${user._id}`, {
      ...UserDetails,
    });
    return data;
  };

  useEffect(() => {
    FetchUser(user._id)
      .then((res) => setDetails(res))
      .catch((err) => console.log(err));
  }, [update]);

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const form = event.currentTarget.elements;

    const UserDetails = {
      name: form.name.value,
      email: form.email.value,
      password: form.password.value,
      img: form.img.value,
    };

    if (
      event.currentTarget.checkValidity() &&
      UserDetails.name &&
      UserDetails.password
    ) {
      UpdateProfile(UserDetails)
        .then((res) => {
          dispatch(UserLogin(res.User));
          setupdate(true);
          sessionStorage.setItem("User", JSON.stringify(res.User));
          localStorage.setItem("User", JSON.stringify(res.User));
          window.location.href = "/profile";
        })
        .catch((err) => console.log(err));
    }
    setValidated(true);
  };

  return (
    <Container style={{ width: "35%", marginTop: "2rem" }}>
      <Alert variant="success" show={update}>
        Profile updated
      </Alert>
      <Form noValidate validated={validated} onSubmit={(e) => handleSubmit(e)}>
        <h4>View/Edit your Profile</h4>
        <Form.Group
          controlId="validationCustom01"
          style={{ marginBottom: "1rem", marginTop: "1rem" }}
        >
          <Form.Label>First name</Form.Label>
          <Form.Control
            required
            type="text"
            name="name"
            placeholder="Full name"
            defaultValue={Details.name}
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
              defaultValue={Details.email}
              readOnly
              required
            />
          </InputGroup>
          <Form.Label className=" mt-2 text-secondary">
            To change email address delete your account and create new
          </Form.Label>
        </Form.Group>
        <Form.Group
          controlId="validationCustom03"
          style={{ marginBottom: "1rem", marginTop: "1rem" }}
        >
          <Form.Label>Image</Form.Label>
          <Form.Control type="url" name="img" placeholder="image url" />
          <Form.Control.Feedback type="invalid">
            Please provide a valid url.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group
          controlId="validationCustom03"
          style={{ marginBottom: "1rem", marginTop: "1rem" }}
        >
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
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
        <Button type="submit">Update</Button>
      </Form>
    </Container>
  );
}
