import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Gallery from "./pages/Gallery";
import Services from "./pages/Services";
import Donate from "./pages/Donate";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import BlogPost from "./pages/BlogPost";
import Developers from "./pages/Developers";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/services" element={<Services />} />
            <Route path="/donate" element={<Donate />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/blog/:id" element={<BlogPost />} />
            <Route path="/developers" element={<Developers />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
