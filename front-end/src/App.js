import { BrowserRouter, Routes, Route } from "react-router-dom";

// Header and Footer
import Footer from "./components/Footer";
import Header from "./components/Header";
import EditVideoDetails from "./pages/EditVideoDetails";
import Homepage from "./pages/HomePage"

import Login from "./pages/Login";
import MyVideos from "./pages/MyVideos";
import UserProfile from "./pages/Profile";
import Register from "./pages/Register";
import SearchResults from "./pages/SearchResults";
import UploadVideo from "./pages/UploadVideo";
import VideoPlay from "./pages/VideoPlayPage";
import ScrollToTop from "./utils/ScrollToTop";


function App() {
  return (
    <div style={{ marginBottom: "60px", fontFamily: "Roboto" }}>
      <BrowserRouter>
        <ScrollToTop />
        <Header />
        <Routes>  
        <Route path="/" element={<Homepage />}></Route>  
        <Route path="/login" element={<Login />}></Route> 
        <Route path="/register" element={<Register />}></Route> 
        <Route path="/myvideos" element={<MyVideos />}></Route>   
        <Route path="/profile" element={<UserProfile />}></Route>   
        <Route path="/myvideos" element={<MyVideos/>}></Route>   
        <Route path="/editVideoDetails/:id" element={<EditVideoDetails/>}></Route>   
        <Route path="/uploadVideo" element={<UploadVideo/>}></Route>   
        <Route path="/playVideo/:id" element={<VideoPlay/>}></Route>   
        <Route path="/searchResults/:text" element={<SearchResults/>}></Route>   
        {/* <Route path="/admin/order_Product_details/:id" element={<AdminOrderProductDetails />}></Route> */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;