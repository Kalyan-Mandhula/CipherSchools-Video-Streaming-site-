import VideoCard from "../components/VideoCard";
import { Alert, Row } from "react-bootstrap";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const GetVideos = async (id) => {
  const { data } = await axios.get(`/api/videos/GetMyVideos/${id}`);
  return data;
};

export default function MyVideos() {
  const [videos, setVideos] = useState([]);
  const id = useSelector((state) => state.user._id);
  useEffect(() => {
    GetVideos(id)
      .then((res) => setVideos(res))
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <Alert variant="danger" show={videos.length == 0 ? true : false}>
        {" "}
        You have not uploaded any videos
      </Alert>
      <div
        style={{
          display: "flex",
          height: "100vh",
          marginLeft: "5rem",
          width: "90%",
        }}
      >
        <Row>
          {videos.map((video, idx) => (
            <VideoCard key={idx} DisplayEdit={true} Video={video} />
          ))}
        </Row>
      </div>
    </>
  );
}
