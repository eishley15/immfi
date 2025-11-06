import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS, getImageUrl } from "../config/api";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("volunteers");
  const [volunteers, setVolunteers] = useState([]);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [emailStatus, setEmailStatus] = useState(null);
  const [blogPost, setBlogPost] = useState({
    title: "",
    subtitle: "",
    description: "",
    image: null,
  });
  const [blogPosts, setBlogPosts] = useState([]);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  // Simple authentication check
  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
    if (!isAdmin) {
      navigate("/admin-login");
    }
  }, [navigate]);

  useEffect(() => {
    if (activeTab === "volunteers") {
      fetchVolunteers();
    } else if (activeTab === "donations") {
      fetchDonations();
    } else {
      fetchBlogPosts();
    }
  }, [activeTab]);

  // Update the fetchVolunteers function to include the token
  const fetchVolunteers = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(API_ENDPOINTS.volunteers, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        // Token expired or invalid
        localStorage.removeItem("adminToken");
        localStorage.removeItem("isAdmin");
        navigate("/admin-login");
        return;
      }

      const data = await response.json();
      setVolunteers(data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch volunteers");
      setLoading(false);
    }
  };

  const handleApprove = async (volunteerId) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `http://localhost:3001/api/volunteers/${volunteerId}/approve`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setEmailStatus("Email sent successfully!");
        // Refresh volunteers list
        fetchVolunteers();
      } else {
        setEmailStatus("Failed to send email.");
      }
    } catch (err) {
      setEmailStatus("Error: Failed to approve volunteer");
    }
  };

  const fetchDonations = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("http://localhost:3001/api/donations", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("isAdmin");
        navigate("/admin-login");
        return;
      }

      const data = await response.json();
      setDonations(data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch donations");
      setLoading(false);
    }
  };

  const handleSendThankYou = async (donationId) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `http://localhost:3001/api/donations/${donationId}/send-thank-you`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setEmailStatus("Thank you email sent successfully!");
      } else {
        throw new Error("Failed to send thank you email");
      }
    } catch (error) {
      console.error("Error:", error);
      setEmailStatus("Error: Failed to send thank you email");
    }
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(amount / 100); // PayMongo amounts are in centavos
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-PH", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleBlogSubmit = async (e) => {
    e.preventDefault();
    setUploadStatus(null);

    try {
      const formData = new FormData();
      formData.append("title", blogPost.title);
      formData.append("subtitle", blogPost.subtitle);
      formData.append("description", blogPost.description);
      formData.append("image", blogPost.image);
      formData.append("createdBy", "Admin");

      const token = localStorage.getItem("adminToken");
      const response = await fetch("http://localhost:3001/api/gallery/posts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        setUploadStatus({
          type: "success",
          message: "Blog post created successfully!",
        });
        setBlogPost({ title: "", description: "", image: null });
        fetchBlogPosts();
      } else {
        throw new Error("Failed to create blog post");
      }
    } catch (error) {
      setUploadStatus({ type: "error", message: error.message });
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setUploadStatus(null);

    try {
      const formData = new FormData();
      formData.append("title", blogPost.title);
      formData.append("description", blogPost.description);
      if (blogPost.image instanceof File) {
        formData.append("image", blogPost.image);
      }

      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `http://localhost:3001/api/gallery/posts/${editingPost._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        setUploadStatus({
          type: "success",
          message: "Blog post updated successfully!",
        });
        setBlogPost({ title: "", description: "", image: null });
        setEditingPost(null);
        setIsEditing(false);
        fetchBlogPosts();
      } else {
        throw new Error("Failed to update blog post");
      }
    } catch (error) {
      setUploadStatus({ type: "error", message: error.message });
    }
  };

  const fetchBlogPosts = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("http://localhost:3001/api/gallery/posts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setBlogPosts(data);
      }
    } catch (error) {
      console.error("Error fetching blog posts:", error);
    }
  };

  const handleEditClick = (post) => {
    setEditingPost(post);
    setBlogPost({
      title: post.title,
      subtitle: post.subtitle,
      description: post.description,
      image: null,
    });
    setIsEditing(true);
  };

  useEffect(() => {
    if (activeTab === "blog") {
      fetchBlogPosts();
    }
  }, [activeTab]);

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-green-800">Admin Dashboard</h1>
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab("volunteers")}
            className={`px-4 py-2 rounded-lg ${
              activeTab === "volunteers"
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Volunteers
          </button>
          <button
            onClick={() => setActiveTab("donations")}
            className={`px-4 py-2 rounded-lg ${
              activeTab === "donations"
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Donations
          </button>
          <button
            onClick={() => setActiveTab("blog")}
            className={`px-4 py-2 rounded-lg ${
              activeTab === "blog"
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Blog Posts
          </button>
        </div>
      </div>

      {emailStatus && (
        <div
          className={`mb-4 p-4 rounded ${
            emailStatus.includes("Error")
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {emailStatus}
        </div>
      )}

      {activeTab === "volunteers" ? (
        // Existing volunteers table
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Skills
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {volunteers.map((volunteer) => (
                <tr key={volunteer._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {volunteer.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {volunteer.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {volunteer.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${
                        volunteer.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : volunteer.status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {volunteer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">{volunteer.skills}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {volunteer.status === "pending" && (
                      <button
                        onClick={() => handleApprove(volunteer._id)}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 text-sm"
                      >
                        Approve & Email
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : activeTab === "donations" ? (
        // New donations table
        <div className="overflow-x-auto">
          <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Total Donations
              </h3>
              <p className="text-2xl font-bold text-green-600">
                {formatAmount(donations.reduce((acc, d) => acc + d.amount, 0))}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Successful Payments
              </h3>
              <p className="text-2xl font-bold text-green-600">
                {
                  donations.filter(
                    (d) => d.status === "paid" || d.status === "succeeded"
                  ).length
                }
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Recent Period
              </h3>
              <p className="text-2xl font-bold text-green-600">
                {formatAmount(
                  donations
                    .filter(
                      (d) =>
                        new Date(d.created_at) >
                        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                    )
                    .reduce((acc, d) => acc + d.amount, 0)
                )}
              </p>
            </div>
          </div>

          <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Donor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reference
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {donations.map((donation) => (
                <tr key={donation.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatDate(donation.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {donation.donor_name}
                    <div className="text-xs text-gray-500">
                      {donation.donor_email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">
                    {formatAmount(donation.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        donation.status === "paid" ||
                        donation.status === "succeeded"
                          ? "bg-green-100 text-green-800"
                          : donation.status === "failed"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {donation.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {donation.payment_method}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {donation.reference}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {(donation.status === "paid" ||
                      donation.status === "succeeded") && (
                      <button
                        onClick={() => handleSendThankYou(donation.id)}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm"
                      >
                        Send Thank You
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        // New blog posts section
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Create New Blog Post</h2>

          {uploadStatus && (
            <div
              className={`mb-4 p-4 rounded ${
                uploadStatus.type === "success"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {uploadStatus.message}
            </div>
          )}

          <form
            onSubmit={isEditing ? handleEditSubmit : handleBlogSubmit}
            className="space-y-4 max-w-2xl"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={blogPost.title}
                onChange={(e) =>
                  setBlogPost((prev) => ({ ...prev, title: e.target.value }))
                }
                className="w-full p-2 border rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subtitle
              </label>
              <input
                type="text"
                value={blogPost.subtitle}
                onChange={(e) =>
                  setBlogPost((prev) => ({ ...prev, subtitle: e.target.value }))
                }
                className="w-full p-2 border rounded-md"
                placeholder="Add a brief subtitle"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={blogPost.description}
                onChange={(e) =>
                  setBlogPost((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="w-full p-2 border rounded-md"
                rows={4}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image {isEditing && "(Leave empty to keep current image)"}
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setBlogPost((prev) => ({ ...prev, image: e.target.files[0] }))
                }
                className="w-full p-2 border rounded-md"
                required={!isEditing}
              />
              {isEditing && editingPost?.imageUrl && (
                <img
                  src={getImageUrl(editingPost.imageUrl)}
                  alt="Current"
                  className="mt-2 h-32 object-cover rounded"
                />
              )}
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                {isEditing ? "Update Post" : "Create Post"}
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setEditingPost(null);
                    setBlogPost({ title: "", description: "", image: null });
                  }}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>

          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Recent Blog Posts</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {blogPosts.map((post) => (
                <div key={post._id} className="border rounded-lg p-4">
                  <img
                    src={getImageUrl(post.imageUrl)}
                    alt={post.title}
                    className="w-full h-48 object-cover rounded-md mb-2"
                  />
                  <h4 className="font-semibold">{post.title}</h4>
                  <p className="text-sm text-gray-600">{post.description}</p>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      {new Date(post.date).toLocaleDateString()}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditClick(post)}
                        className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      {/* Existing delete button if you have one */}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
