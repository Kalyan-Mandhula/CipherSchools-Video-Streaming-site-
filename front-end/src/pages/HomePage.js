import VideoCard from "../components/VideoCard";
import { Row } from "react-bootstrap";
import axios from "axios";
import { useEffect, useState } from "react";

const GetVideos = async () => {
  const { data } = await axios.get("/api/videos");
  return data;
};

export default function HomePage() {
  const [videos, setVideos] = useState([]);
  useEffect(() => {
    GetVideos()
      .then((res) => setVideos(res))
      .catch((err) => console.log(err));
  }, [videos]);

  return (
    <>
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
            <VideoCard key={idx} DisplayEdit={false} Video={video} />
          ))}
        </Row>
      </div>
    </>
  );
}
