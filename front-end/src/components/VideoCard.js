import { Button } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import { LinkContainer } from "react-router-bootstrap";
import axios from "axios";


function VideoCard({ DisplayEdit, Video }) {

  const DeleteVideo = async (id) => {
    await axios.delete(`/api/videos/${id}`);
    window.location.href = "/myvideos";
  };

  return (
    <Card style={{ width: "18rem", border: "none", marginTop: "2rem" }}>
      <LinkContainer
        to={`/playVideo/${Video._id}`}
        style={{ cursor: "pointer" }}
      >
        <Card.Img
          variant="top"
          src={
            Video.imgUrl
              ? Video.imgUrl
              : "https://cdn.dribbble.com/userupload/3587778/file/original-d31b94c5dd64000ece9ee7b8c8e0838e.png?compress=1&resize=400x300&vertical=top"
          }
        />
      </LinkContainer>
      <Card.Body className="ps-1 pt-2">
        <div>
          <span className="me-auto AuthorName">{Video.title}</span>
        </div>
        <div className="d-flex flex-row mt-0 justify-content-between">
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
            ></img>
            <h6 className="d-inline me-3 ms-2 AuthorName">{Video.user.name}</h6>
          </div>
          <div>
            <span className="AuthorName">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-heart"
                viewBox="0 0 16 16"
              >
                <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z" />
              </svg>{" "}
              {Video.likes.length}{" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-eye"
                viewBox="0 0 16 16"
              >
                <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
              </svg>{" "}
              {Video.views.length}{" "}
            </span>
          </div>
        </div>

        {DisplayEdit ? (
          <div className="d-flex flex-row mt-1 justify-content-between">
            <div>
              <a href={`/editVideoDetails/${Video._id}`}>edit video</a>
            </div>
            <div>
              <a
                className="text-danger"
                style={{ cursor: "pointer" }}
                onClick={() => DeleteVideo(Video._id)}
              >
                delete video
              </a>
            </div>
          </div>
        ) : (
          ""
        )}
      </Card.Body>
    </Card>
  );
}

export default VideoCard;
