import React, { useEffect, useState } from "react";
import { Alert, Container } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const GetDetails = async (id) => {
  const { data } = await axios.get(`/api/videos//find/${id}`);
  return data;
};

const UpdateVideo = async (VideoDetails, id) => {
  const { data } = await axios.put(`/api/videos/${id}`, { ...VideoDetails });
  return data;
};

export default function EditVideoDetails() {
  const [validated, setValidated] = useState(false);
  const [Details, setDetails] = useState({});
  const [update, setupdate] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  const [ImageUrl, SetImageUrl] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const GetUrl = async (files, text) => {
    let url = "";
    if (text == "image") {
      url = "https://api.cloudinary.com/v1_1/drmatj5jb/image/upload";
      setUploadingImage(true);
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
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    GetDetails(id)
      .then((res) => setDetails(res))
      .catch((err) => console.log(err));
  }, [update]);

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const form = event.currentTarget.elements;

    const VideoDetails = {
      title: form.title.value,
      description: form.description.value,
    };

    if (event.currentTarget.checkValidity() && ImageUrl) {
      VideoDetails.imgUrl = ImageUrl;
      UpdateVideo(VideoDetails, id)
        .then((res) => {
          setDetails(res);
          setupdate(true);
          navigate("/myvideos");
        })
        .catch((err) => console.log(err));
    }

    setValidated(true);
  };

  return (
    <Container style={{ width: "35%", marginTop: "2rem" }}>
      <Alert variant="success" show={update}>
        Video Details updated
      </Alert>
      <Form noValidate validated={validated} onSubmit={(e) => handleSubmit(e)}>
        <h4>View/Edit video details</h4>
        <Form.Group
          controlId="validationCustom01"
          style={{ marginBottom: "1rem", marginTop: "1rem" }}
        >
          <Form.Label>Video title</Form.Label>
          <Form.Control
            required
            type="text"
            name="title"
            placeholder="title"
            defaultValue={Details.title}
          />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
        <Form.Group
          controlId="validationCustomUsername"
          style={{ marginBottom: "1rem", marginTop: "1rem" }}
        >
          <Form.Label>description</Form.Label>
          <InputGroup hasValidation>
            <Form.Control
              type="text"
              name="description"
              placeholder="description"
              aria-describedby="inputGroupPrepend"
              defaultValue={Details.description}
              required
            />
          </InputGroup>
        </Form.Group>
        <Form.Group
          controlId="validationCustom03"
          style={{ marginBottom: "1rem", marginTop: "1rem" }}
        >
          <Form.Label>Image url</Form.Label>
          <Form.Control
            type="file"
            name="imgUrl"
            placeholder="image url"
            onChange={(e) => GetUrl(e.target.files, "image")}
            defaultValue={Details.imgUrl}
            required
            minLength={6}
          />
          <Form.Control.Feedback type="invalid">
            Please provide a valid url
          </Form.Control.Feedback>
        </Form.Group>
        {uploadingImage ? <p>uploading...</p> : ""}
        <Button type="submit">Update</Button>
      </Form>
    </Container>
  );
}
