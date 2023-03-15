import React, { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/VideoPage.css";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { useSelector } from "react-redux";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Toast from "react-bootstrap/Toast";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  TelegramShareButton,
  LinkedinShareButton,
  WhatsappIcon,
  TwitterIcon,
  TelegramIcon,
  LinkedinIcon,
  FacebookIcon,
} from "react-share";

function VideoPage() {
  const { id } = useParams();
  const userId = useSelector((state) => state.user._id);
  const [Video, SetVideo] = useState();
  const [comments, setComments] = useState([]);
  const [liked, setLiked] = useState(false);
  const [commentAdded, setCommentAdded] = useState(false);
  const [displayShare, setDisplayShare] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [showA, setShowA] = useState(true);
  const URL = window.location.href;

  const toggleShowA = () => {
    setDisplayShare(false);
  };

  const LikeVideoFunc = async (liked) => {
    const { data } = await axios.put(`/api/videos/like/${Video._id}`, {
      liked: liked,
    });
    SetVideo(data);
  };

  const UploadComment = async (CommentDetails) => {
    if (userId) {
      await axios.post(`/api/comments`, { ...CommentDetails });
    }
  };

  const UploadReply = async (CommentDetails, id,index) => {
    if (userId) {
      await axios.post(`/api/comments/${id}/${index}`, { ...CommentDetails });
    }
  };

  const GetVideo = async (id) => {
    const { data } = await axios.get(`/api/videos/find/${id}`);
    return data;
  };

  const UpdateViewsFunc = async (id) => {
    if (userId) {
      const { data } = await axios.put(`/api/videos/view/${id}`, { userId });
      SetVideo(data);
    }
  };

  const SubmitComment = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    const CommentDetails = {
      videoId: Video._id,
      desc: document.getElementsByClassName("comment")[0].value,
    };
    if (event.currentTarget.checkValidity() && CommentDetails.desc) {
      UploadComment(CommentDetails)
        .then((res) => setCommentAdded(!commentAdded))
        .catch((err) => console.log(err));
      document.getElementsByClassName("comment")[0].value = "";
    }
  };

  const SubmitReply = async (event, id,idx) => {
    event.preventDefault();
    event.stopPropagation();
    const CommentDetails = {
      videoId: Video._id,
      desc: document.getElementsByClassName("reply")[0].value,
      isReply: true,
    };
    if (event.currentTarget.checkValidity() && CommentDetails.desc) {
      UploadReply(CommentDetails, id,idx)
        .then((res) => setCommentAdded(!commentAdded))
        .catch((err) => console.log(err));
      setShowReplyInput(false);
      document.getElementsByClassName("reply")[0].value = "";
    }
  };

  const GetComments = async (id) => {
    const { data } = await axios.get(`/api/comments/${id}`);
    return data;
  };

  useEffect(() => {
    GetVideo(id)
      .then((res) => {
        SetVideo(res);
        UpdateViewsFunc(res._id);
        let isLiked = res.likes.find((id) => userId == id);
        if (isLiked) {
          setLiked(true);
        }
      })
      .catch((err) => console.log(err));
    GetComments(id)
      .then((res) => {
        setComments(res);
      })
      .catch((err) => console.log(err));
  }, [id, liked, commentAdded]);

  {
    if (Video) {
      return (
        <div className="container">
          <div className="video-wrapper">
            <iframe
              width="560"
              height="315"
              src={Video.videoUrl}
              title="Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <div>
            <h5 className="mt-2">{Video.title}</h5>
          </div>
          <div className="py-2 d-flex justify-content-between">
            <div>
              <img
                className="photo ls-is-cached lazyloaded ms-0 rounded-5"
                alt="Ramotion"
                width="24"
                height="24"
                data-src="https://cdn.dribbble.com/users/25514/avatars/mini/070810be04e642201206c8fbdffcbf8a.png?1455536235"
                src={
                  Video.user.img
                    ? Video.user.img
                    : "https://cdn.dribbble.com/users/25514/avatars/mini/070810be04e642201206c8fbdffcbf8a.png?1455536235"
                }
              ></img>{" "}
              <span className="d-inline me-3 ms-2"> {Video.user.name}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                className="bi bi-eye"
                viewBox="0 0 16 16"
              >
                <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
              </svg>
              <span className="me-3"> {Video.views.length} </span>
              <span>{Video.createdAt.substring(0, 10)}</span>
            </div>
            {userId ? (
              <>
                <div
                  className="d-flex justify-content-between me-5"
                  style={{ width: "8rem" }}
                >
                  <span
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      LikeVideoFunc(!liked);
                      setLiked(!liked);
                    }}
                  >
                    {liked ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-heart-fill"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-heart"
                        viewBox="0 0 16 16"
                      >
                        <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z" />
                      </svg>
                    )}{" "}
                    <h6 className="d-inline">{Video.likes.length}</h6>
                  </span>
                  <span
                    style={{ cursor: "pointer" }}
                    onClick={() => setDisplayShare(!displayShare)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-share"
                      viewBox="0 0 16 16"
                    >
                      <path d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5zm-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z" />
                    </svg>{" "}
                    Share
                  </span>
                  {displayShare ? (
                    <Row>
                      <Col md={6} className="mb-2">
                        <Toast
                          show={showA}
                          onClose={toggleShowA}
                          className="shareOptions "
                          bg={"Light".toLowerCase()}
                        >
                          <Toast.Header></Toast.Header>
                          <Toast.Body>
                            {
                              <>
                                <WhatsappShareButton
                                  url={URL}
                                  className="me-2 ms-2 mb-1"
                                >
                                  <WhatsappIcon
                                    className="rounded-circle "
                                    size={32}
                                    round={true}
                                  />
                                  <br></br>
                                  watsapp
                                </WhatsappShareButton>

                                <TwitterShareButton
                                  url={URL}
                                  className="me-2 ms-2 mb-1"
                                >
                                  <TwitterIcon
                                    className="rounded-circle "
                                    size={32}
                                    round={true}
                                  />
                                  <br></br>
                                  twitter
                                </TwitterShareButton>

                                <FacebookShareButton
                                  url={URL}
                                  className="me-2 ms-2 mb-1"
                                >
                                  <FacebookIcon
                                    className="rounded-circle "
                                    size={32}
                                    round={true}
                                  />
                                  <br></br>
                                  facebook
                                </FacebookShareButton>

                                <LinkedinShareButton
                                  url={URL}
                                  className="me-2 ms-2 mb-1"
                                >
                                  <LinkedinIcon
                                    className="rounded-circle "
                                    size={32}
                                    round={true}
                                  />
                                  <br></br>
                                  linkedin
                                </LinkedinShareButton>

                                <TelegramShareButton
                                  url={URL}
                                  className="me-2 ms-2 mb-1"
                                >
                                  <TelegramIcon
                                    className="rounded-circle "
                                    size={32}
                                    round={true}
                                  />
                                  <br></br>
                                  telegram
                                </TelegramShareButton>
                              </>
                            }
                          </Toast.Body>
                        </Toast>
                      </Col>
                    </Row>
                  ) : (
                    ""
                  )}
                </div>
              </>
            ) : (
              ""
            )}
          </div>
          <div
            className="rounded p-3"
            style={{ backgroundColor: "rgba(187, 181, 184, 0.8)" }}
          >
            {Video.description}
          </div>
          <div className="comment-wrapper">
            <Form className="my-3">
              <InputGroup className="mb-3">
                <Form.Control
                  type="text"
                  className="comment"
                  required
                  placeholder="Add a comment"
                  onKeyDown={(e) => {
                    if (e.keyCode === 13) {
                      SubmitComment(e);
                    }
                  }}
                />
                <Button
                  variant="primary"
                  type="submit"
                  onClick={(e) => SubmitComment(e)}
                >
                  Submit
                </Button>
              </InputGroup>
              {userId ? (
                ""
              ) : (
                <p className="text-danger">login to like/share/comment</p>
              )}
            </Form>
            {comments.length > 0 &&
              comments.map((comment) => (
                <Fragment key={comment._id}>
                  {!comment.isReply ? (
                    <div>
                      <strong>{comment.user.name} </strong>{" "}
                      <span style={{ fontSize: "13px", marginLeft: "10px" }}>
                        {comment.createdAt.substring(0, 10)}
                      </span>
                      <p>
                        {comment.desc}{" "}
                        {
                          <span
                            onClick={() =>
                              setShowReplyInput(() => {
                                if (showReplyInput === false) {
                                  return comment._id;
                                } else {
                                  return false;
                                }
                              })
                            }
                          >
                            <u style={{ cursor: "pointer" }}>Reply</u>
                          </span>
                        }
                        {showReplyInput === comment._id ? (
                          <Form className="my-3">
                            <InputGroup className="mb-3">
                              <Form.Control
                                type="text"
                                className="reply"
                                required
                                placeholder="Add a comment"
                                onKeyDown={(e) => {
                                  if (e.keyCode === 13) {
                                    SubmitReply(e, comment._id,0);
                                  }
                                }}
                              />
                              <Button
                                variant="primary"
                                type="submit"
                                onClick={(e) => SubmitReply(e, comment._id,0)}
                              >
                                Submit
                              </Button>
                            </InputGroup>
                          </Form>
                        ) : (
                          ""
                        )}
                      </p>
                      <div>
                        {comment.replies.map((reply, idx) => (
                          <Fragment key={idx}>
                            <strong className="ms-4">{reply.user.name} </strong>{" "}
                            <span
                              style={{ fontSize: "13px", marginLeft: "10px" }}
                            >
                              {reply.createdAt.substring(0, 10)}
                            </span>
                            <p key={reply._id} className="ms-4">
                              {reply.desc}{" "}
                              {
                                <span
                                  onClick={() =>
                                    setShowReplyInput(() => {
                                      if (showReplyInput === false) {
                                        return reply._id;
                                      } else {
                                        return false;
                                      }
                                    })
                                  }
                                >
                                  <u style={{ cursor: "pointer" }}>Reply</u>
                                </span>
                              }
                              {showReplyInput === reply._id ? (
                                <Form className="my-3">
                                  <InputGroup className="mb-3">
                                    <Form.Control
                                      type="text"
                                      className="reply"
                                      required
                                      placeholder="Add a comment"
                                      onKeyDown={(e) => {
                                        if (e.keyCode === 13) {
                                          SubmitReply(e, comment._id,idx+1);
                                        }
                                      }}
                                    />
                                    <Button
                                      variant="primary"
                                      type="submit"
                                      onClick={(e) =>
                                        SubmitReply(e, comment._id,idx+1)
                                      }
                                    >
                                      Submit
                                    </Button>
                                  </InputGroup>
                                </Form>
                              ) : (
                                ""
                              )}
                            </p>
                          </Fragment>
                        ))}
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </Fragment>
              ))}
          </div>
        </div>
      );
    } else {
      return "";
    }
  }
}

export default VideoPage;

// import React, { useState } from 'react';

// function VideoPage() {
//   const [comments, setComments] = useState([]);
//   const videoUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ"; // Replace with your video URL

//   function addComment(comment) {
//     setComments([...comments, comment]);
//   }

//   return (
//     <div className='d-flex  flex-column align-items-center'>
//       <div>
//         <iframe style={{width:"60rem" ,height:"30rem"}}  src={videoUrl} title="Video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
//       </div>
//       <div>
//         <form
//           onSubmit={(event) => {
//             event.preventDefault();
//             const comment = event.target.elements.comment.value;
//             addComment(comment);
//             event.target.reset();
//           }}
//         >
//           <input type="text" name="comment" placeholder="Add a comment" />
//           <button type="submit">Submit</button>
//         </form>
//         {comments.map((comment, index) => (
//           <p key={index}>{comment}</p>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default VideoPage;
