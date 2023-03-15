import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { LinkContainer } from "react-router-bootstrap";
import SocketIo from "socket.io-client";
import { MDBBadge, MDBIcon } from "mdb-react-ui-kit";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Toast from "react-bootstrap/Toast";
import { Alert, InputGroup } from "react-bootstrap";
import { UserLogout } from "../redux/ReduxActions/UserActions";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Mssgs } from "../redux/ReduxActions/Mssgs";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const GetDetails = async (id) => {
  const { data } = await axios.get(`/api/videos/find/${id}`);
  return data;
};

window.onunload = function () {
  localStorage.clear();
};

function Header() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const mssgs = useSelector((state) => state.mssgs);

  const navigate = useNavigate();
  const [notification, setNotification] = useState(false);
  const [openMssgs, setOpenMessages] = useState(false);
  const [showA, setShowA] = useState(true);
  const [show, setShow] = useState(false);
  const toggleShowA = () => {
    setOpenMessages(false);
    setNotification(false);
  };

  useEffect(() => {
    const socket = SocketIo();
    socket.on("VideoAdded", (obj) => {
      GetDetails(obj.documentKey._id)
        .then((data) => {
          console.log(obj)
          let mssg =
            data.user.name +
            ' added "' +
            data.title +
            '" .Visit the video page for more details.';
          dispatch(Mssgs(mssg));
          setNotification(true);
          setShow(true);
        })
        .catch((err) => console.log(err));
    });
  }, []);

  const SearchVideos = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    const text = document.getElementsByClassName("SearchBar")[0].value;
    if (text.length > 0) {
      navigate(`/searchResults/${text}`);
    }
  };

  return (
    <>
      {(show && user._id) ? (
        <Alert
          className="notificationAlert"
          variant="info"
          onClose={() => setShow(false)}
          dismissible
        >
          <Alert.Heading>New message recieved</Alert.Heading>
        </Alert>
      ) : (
        ""
      )}
      <Navbar bg="light" expand="lg">
        <Container fluid>
          <Navbar.Brand className="ms-xl-5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="23"
              height="25"
              fill="currentColor"
              className="bi bi-play-circle mb-1"
              viewBox="0 0 16 16"
            >
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
              <path d="M6.271 5.055a.5.5 0 0 1 .52.038l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .271-.445z" />
            </svg>{" "}
            ViewNow
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <LinkContainer to="/">
              <Nav.Link href="/" className="ms-xl-3">
                Home
              </Nav.Link>
            </LinkContainer>
            <Nav
              className="me-auto ms-auto my-2 my-lg-0"
              style={{ maxHeight: "100px" }}
              navbarScroll
            >
              <InputGroup>
                <Form.Group
                  controlId="formBasicPassword"
                  style={{ width: "25rem" }}
                >
                  <Form.Control
                    type="text"
                    className="rounded-0 rounded-start h-100  Search SearchBar "
                    placeholder="Search ..."
                    style={{ border: "none"   }}
                    onKeyDown={(e) => {
                      if (e.keyCode === 13) {
                        SearchVideos(e);
                      }
                    }}
                  />
                </Form.Group>
                <Button
                  variant="warning"
                  className="rounded-right"
                  onClick={(e) => SearchVideos(e)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-search"
                    viewBox="0 0 16 16"
                  >
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                  </svg>
                </Button>
              </InputGroup>
            </Nav>
            <Nav className="me-5">
              {user.name ? (
                <>
                  {
                    <a
                      href="#!"
                      className="mt-2 me-3 position-relative "
                      onClick={() => {
                        setOpenMessages(!openMssgs);
                        setNotification(false);
                      }}
                    >
                      <MDBIcon fas icon="envelope" size="lg" className="" />
                      {notification ? (
                        <span class="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle">
                          <span className="visually-hidden">New alerts</span>
                        </span>
                      ) : (
                        ""
                      )}
                    </a>
                  }
                  {openMssgs ? (
                    <Row>
                      <Col md={6} className="mb-2">
                        <Toast
                          show={showA}
                          onClose={toggleShowA}
                          className="toastMssg "
                          bg={"Light".toLowerCase()}
                        >
                          <Toast.Header>
                            <img
                              src="holder.js/20x20?text=%20"
                              className="rounded me-2"
                              alt=""
                            />
                            <strong className="me-auto">Notifications</strong>
                            <small>3 mins ago</small>
                          </Toast.Header>
                          <Toast.Body>
                            {mssgs.length > 0 ? (
                              <ul>
                                {mssgs.map((mssg, idx) => (
                                  <li key={idx}>{mssg}</li>
                                ))}
                              </ul>
                            ) : (
                              <p>No new notifications</p>
                            )}
                          </Toast.Body>
                        </Toast>
                      </Col>
                    </Row>
                  ) : (
                    ""
                  )}

                  <LinkContainer to="/uploadVideo">
                    <Nav.Link href="/uploadVideo">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-cloud-upload"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.406 1.342A5.53 5.53 0 0 1 8 0c2.69 0 4.923 2 5.166 4.579C14.758 4.804 16 6.137 16 7.773 16 9.569 14.502 11 12.687 11H10a.5.5 0 0 1 0-1h2.688C13.979 10 15 8.988 15 7.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 2.825 10.328 1 8 1a4.53 4.53 0 0 0-2.941 1.1c-.757.652-1.153 1.438-1.153 2.055v.448l-.445.049C2.064 4.805 1 5.952 1 7.318 1 8.785 2.23 10 3.781 10H6a.5.5 0 0 1 0 1H3.781C1.708 11 0 9.366 0 7.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383z"
                        />
                        <path
                          fillRule="evenodd"
                          d="M7.646 4.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V14.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3z"
                        />
                      </svg>{" "}
                      upload
                    </Nav.Link>
                  </LinkContainer>
                  <NavDropdown
                    id="nav-dropdown-dark-example"
                    title={user.name}
                    menuVariant="dark"
                  >
                    <LinkContainer to="/profile">
                      <NavDropdown.Item href="/profile">
                        My Profile
                      </NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/myvideos">
                      <NavDropdown.Item href="/myvideos">
                        My Videos
                      </NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/logout">
                      <NavDropdown.Item
                        href="/logout"
                        onClick={() => dispatch(UserLogout())}
                      >
                        Logout
                      </NavDropdown.Item>
                    </LinkContainer>
                  </NavDropdown>
                </>
              ) : (
                <>
                  <LinkContainer to="/login">
                    <Nav.Link href="/login">login</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to="/register">
                    <Nav.Link href="/register">register</Nav.Link>
                  </LinkContainer>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default Header;
