import React, { useState } from "react";
import { Container } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UploadVideoFunc = async (VideoDetails) => {
  const { data } = await axios.post("/api/videos", { ...VideoDetails });
  return data;
};

export default function UploadVideo() {
  const [validated, setValidated] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [ImageUrl, SetImageUrl] = useState(false);
  const [VideoUrl, SetVideoUrl] = useState(false);
  const navigate = useNavigate();

  const GetUrl = async (files, text) => {
    let url = "";
    if (text == "image") {
      url = "https://api.cloudinary.com/v1_1/drmatj5jb/image/upload";
      setUploadingImage(true);
    } else {
      url = "https://api.cloudinary.com/v1_1/drmatj5jb/video/upload";
      setUploadingVideo(true);
    }
    const formData = new FormData();
    let file = files[0];
    formData.append("file", file);
    formData.append("upload_preset", "pokir1bx");
    await fetch(url, {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (text === "image") {
          SetImageUrl(data.url);
          setUploadingImage(false);
        } else if (text === "video") {
          SetVideoUrl(data.url);
          setUploadingVideo(false);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const form = event.currentTarget;
    const VideoDetails = {
      title: form.title.value,
      description: form.description.value,
    };

    if (event.currentTarget.checkValidity() && ImageUrl && VideoUrl) {
      VideoDetails.imgUrl = ImageUrl;
      VideoDetails.videoUrl = VideoUrl;
      UploadVideoFunc(VideoDetails)
        .then((res) => {
          navigate(`/playVideo/${res._id}`);
        })
        .catch((err) => console.log(err));
    }
    setValidated(true);
  };

  return (
    <Container style={{ width: "35%", marginTop: "2rem" }}>
      <Form noValidate validated={validated} onSubmit={(e) => handleSubmit(e)}>
        <h4>Upload new video</h4>
        <Form.Group
          controlId="validationCustom01"
          style={{ marginBottom: "1rem", marginTop: "1rem" }}
        >
          <Form.Label>Title</Form.Label>
          <Form.Control required type="text" placeholder="title" name="title" />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
        <Form.Group
          controlId="validationCustom02"
          style={{ marginBottom: "1rem", marginTop: "1rem" }}
        >
          <Form.Label>Description</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="description"
            name="description"
          />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
        <Form.Group
          controlId="validationCustomUsername"
          style={{ marginBottom: "1rem", marginTop: "1rem" }}
        >
          <Form.Label>Image url</Form.Label>
          <InputGroup hasValidation>
            <Form.Control
              type="file"
              name="imgUrl"
              placeholder="image url"
              aria-describedby="inputGroupPrepend"
              onChange={(e) => GetUrl(e.target.files, "image")}
              required
            />
            <Form.Control.Feedback type="invalid">
              Please choose a image .
            </Form.Control.Feedback>
          </InputGroup>
          {uploadingImage ? <p>uploading...</p> : ""}
        </Form.Group>
        <Form.Group
          controlId="validationCustom03"
          style={{ marginBottom: "1rem", marginTop: "1rem" }}
        >
          <Form.Label>Video url</Form.Label>
          <Form.Control
            name="videoUrl"
            type="file"
            placeholder="video url"
            required
            onChange={(e) => GetUrl(e.target.files, "video")}
            minLength={6}
          />
          <Form.Control.Feedback type="invalid">
            Please provide a valid video.
          </Form.Control.Feedback>
        </Form.Group>
        {uploadingVideo ? <p>uploading...</p> : ""}
        <Button type="submit">Submit</Button>
      </Form>
    </Container>
  );
}
