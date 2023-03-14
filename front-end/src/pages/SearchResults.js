import VideoCard from "../components/VideoCard";
import { Row } from "react-bootstrap";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const GetVideos = async (text) => {
  const { data } = await axios.get(`/api/videos/search/${text}`);
  return data;
};

export default function SearchResults() {
  const [videos, setVideos] = useState([]);
  const { text } = useParams();

  useEffect(() => {
    GetVideos(text)
      .then((res) => setVideos(res))
      .catch((err) => console.log(err));
  }, []);

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
