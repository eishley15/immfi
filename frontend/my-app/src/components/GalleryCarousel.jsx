import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS, getImageUrl } from "../config/api";
import { Link } from "react-router-dom";

export default function GalleryCarousel() {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        console.log("Fetching from:", API_ENDPOINTS.gallery);
        const response = await fetch(API_ENDPOINTS.gallery);
        if (!response.ok) {
          throw new Error("Failed to fetch blog posts");
        }
        const data = await response.json();
        console.log("Fetched data:", data);
        setBlogPosts(data);
      } catch (err) {
        console.error("Error fetching blog posts:", err);
        setError("Failed to load gallery items");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading gallery...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full py-6 sm:py-8 md:py-10 lg:py-12 px-3 sm:px-4 md:px-6 lg:px-8">
      <div className="w-full max-w-[1600px] mx-auto">
        {blogPosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
            {blogPosts.map((post) => (
              <div
                key={post._id}
                className="group flex flex-col bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-green-200 transform hover:-translate-y-2"
              >
                {/* Image Container */}
                <div className="relative overflow-hidden aspect-[16/9] bg-gray-100">
                  <img
                    src={getImageUrl(post.imageUrl)}
                    alt={post.title}
                    loading="lazy"
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                    onError={(e) => {
                      console.error("Image failed to load:", post.imageUrl);
                      e.target.src = "/placeholder-image.jpg";
                    }}
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Hover Content on Image */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 md:p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <p className="text-white text-xs sm:text-sm leading-relaxed line-clamp-3">
                      {post.description}
                    </p>
                  </div>

                  {/* Corner Badge */}
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg">
                    <span className="text-[10px] sm:text-xs font-semibold text-green-700">
                      IMMFI
                    </span>
                  </div>
                </div>

                {/* Content Container */}
                <div className="p-5 sm:p-6 md:p-7 flex flex-col flex-grow">
                  {/* Title */}
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-1 line-clamp-2 group-hover:text-green-700 transition-colors duration-300">
                    {post.title}
                  </h3>

                  {/* Subtitle */}
                  <p className="text-xs sm:text-sm text-gray-600 mb-2 italic">
                    {post.subtitle}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="text-[10px] sm:text-xs text-gray-500 font-medium">
                        {new Date(post.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Read More Button (appears on hover) */}
                  <Link to={`/blog/${post._id}`}>
                    <button className="mt-4 w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-2 sm:py-2.5 rounded-lg font-semibold text-xs sm:text-sm opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:from-green-700 hover:to-green-800 shadow-lg">
                      View Details
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-12 sm:py-16 md:py-20">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 text-gray-800">
              No Gallery Posts Yet
            </h3>
            <p className="text-sm sm:text-base text-gray-400">
              Check back soon for inspiring stories and updates!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
