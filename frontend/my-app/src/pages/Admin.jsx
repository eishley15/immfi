import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS, getImageUrl } from "../config/api";
import { Calendar } from "../components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import { Button } from "../components/ui/button";
import { format } from "date-fns";
import { ChevronDown, ArrowUpDown, X, LogOut } from "lucide-react";

// Reusable Sort Dropdown Component
function SortDropdown({ label, options, value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="relative">
      <label className="block text-xs font-medium text-gray-500 mb-1">
        {label}
      </label>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:border-green-400 hover:bg-green-50 transition-all min-w-[160px] justify-between"
      >
        <span className="flex items-center gap-2">
          <ArrowUpDown size={14} className="text-gray-400" />
          {selectedOption?.label || "Select..."}
        </span>
        <ChevronDown
          size={14}
          className={`text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-[160px] py-1 overflow-hidden">
            {options.map((opt) => (
              <button
                key={opt.value || "default"}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full px-3 py-2 text-left text-sm hover:bg-green-50 transition-colors ${
                  value === opt.value
                    ? "bg-green-100 text-green-700 font-medium"
                    : "text-gray-700"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// Filter Chip Component
function FilterChip({ label, onClear }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
      {label}
      <button
        onClick={onClear}
        className="hover:bg-green-200 rounded-full p-0.5 transition-colors"
      >
        <X size={12} />
      </button>
    </span>
  );
}

// Sort/Filter Options
const volunteerSortOptions = [
  { value: null, label: "Default" },
  { value: "name-asc", label: "Name (A → Z)" },
  { value: "name-desc", label: "Name (Z → A)" },
  { value: "availability-weekdays", label: "Weekdays" },
  { value: "availability-weekends", label: "Weekends" },
  { value: "status-pending", label: "Pending" },
  { value: "status-approved", label: "Approved" },
];

const donationSortOptions = [
  { value: null, label: "Default" },
  { value: "date-desc", label: "Newest First" },
  { value: "date-asc", label: "Oldest First" },
  { value: "amount-desc", label: "Highest Amount" },
  { value: "amount-asc", label: "Lowest Amount" },
];

const paymentMethodOptions = [
  { value: null, label: "All Methods" },
  { value: "card", label: "Card" },
  { value: "gcash", label: "GCash" },
  { value: "grabpay", label: "GrabPay" },
  { value: "maya", label: "Maya" },
];

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

  // Sorting & Filtering State
  const [volunteerSort, setVolunteerSort] = useState(null);
  const [donationSort, setDonationSort] = useState(null);
  const [paymentMethodFilter, setPaymentMethodFilter] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  const navigate = useNavigate();

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

  const fetchVolunteers = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(API_ENDPOINTS.volunteers, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 401) {
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
        headers: { Authorization: `Bearer ${token}` },
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
    }).format(amount / 100);
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

  // Sorting function for volunteers
  const getSortedVolunteers = () => {
    if (!volunteerSort) return volunteers;

    return [...volunteers].sort((a, b) => {
      switch (volunteerSort) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "availability-weekdays":
          const weekdayOrder = { weekdays: 1, weekend: 2, other: 3 };
          return (
            (weekdayOrder[a.availability] || 99) -
            (weekdayOrder[b.availability] || 99)
          );
        case "availability-weekends":
          const weekendOrder = { weekend: 1, weekdays: 2, other: 3 };
          return (
            (weekendOrder[a.availability] || 99) -
            (weekendOrder[b.availability] || 99)
          );
        case "status-pending":
          const pendingOrder = { pending: 1, approved: 2, rejected: 3 };
          return (
            (pendingOrder[a.status] || 99) - (pendingOrder[b.status] || 99)
          );
        case "status-approved":
          const approvedOrder = { approved: 1, pending: 2, rejected: 3 };
          return (
            (approvedOrder[a.status] || 99) - (approvedOrder[b.status] || 99)
          );
        default:
          return 0;
      }
    });
  };

  // Sorting and filtering for donations
  const getFilteredAndSortedDonations = () => {
    let filtered = [...donations];

    // Filter by payment method
    if (paymentMethodFilter) {
      filtered = filtered.filter(
        (d) => d.payment_method === paymentMethodFilter
      );
    }

    // Filter by date
    if (selectedDate) {
      filtered = filtered.filter((d) => {
        const donationDate = new Date(d.created_at);
        return (
          donationDate.getFullYear() === selectedDate.getFullYear() &&
          donationDate.getMonth() === selectedDate.getMonth() &&
          donationDate.getDate() === selectedDate.getDate()
        );
      });
    }

    // Sort
    if (donationSort) {
      filtered.sort((a, b) => {
        switch (donationSort) {
          case "date-desc":
            return new Date(b.created_at) - new Date(a.created_at);
          case "date-asc":
            return new Date(a.created_at) - new Date(b.created_at);
          case "amount-desc":
            return b.amount - a.amount;
          case "amount-asc":
            return a.amount - b.amount;
          default:
            return 0;
        }
      });
    }

    return filtered;
  };

  // Clear all filters
  const clearAllFilters = () => {
    setVolunteerSort(null);
    setDonationSort(null);
    setPaymentMethodFilter(null);
    setSelectedDate(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("isAdmin");
    navigate("/admin-login");
  };

  const hasActiveFilters =
    volunteerSort || donationSort || paymentMethodFilter || selectedDate;

  // Blog post handlers
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
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (response.ok) {
        setUploadStatus({
          type: "success",
          message: "Blog post created successfully!",
        });
        setBlogPost({ title: "", subtitle: "", description: "", image: null });
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
      formData.append("subtitle", blogPost.subtitle);
      formData.append("description", blogPost.description);
      if (blogPost.image instanceof File) {
        formData.append("image", blogPost.image);
      }

      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `http://localhost:3001/api/gallery/posts/${editingPost._id}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      if (response.ok) {
        setUploadStatus({
          type: "success",
          message: "Blog post updated successfully!",
        });
        setBlogPost({ title: "", subtitle: "", description: "", image: null });
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
        headers: { Authorization: `Bearer ${token}` },
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

  const handleDeletePost = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this post? This action cannot be undone."
      )
    )
      return;
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(API_ENDPOINTS.blogPost(id), {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setUploadStatus({
          type: "success",
          message: "Blog post deleted successfully.",
        });
        setBlogPosts((prev) => prev.filter((p) => p._id !== id));
        if (editingPost && editingPost._id === id) {
          setIsEditing(false);
          setEditingPost(null);
          setBlogPost({
            title: "",
            subtitle: "",
            description: "",
            image: null,
          });
        }
      } else {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to delete blog post");
      }
    } catch (err) {
      console.error("Delete error:", err);
      setUploadStatus({
        type: "error",
        message: err.message || "Error deleting post",
      });
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-green-800">
          Admin Dashboard
        </h1>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-2 items-center flex-wrap">
          {["volunteers", "donations", "blog"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg capitalize text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "bg-green-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {tab === "blog" ? "Blog Posts" : tab}
            </button>
          ))}
          <button
            onClick={handleLogout}
            className="ml-4 px-4 py-2 rounded-lg text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 flex items-center gap-2 transition-colors"
          >
            <LogOut size={16} />
            <span className="hidden lg:inline">Logout</span>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden w-full flex flex-col gap-2">
          {["volunteers", "donations", "blog"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg capitalize text-sm font-medium transition-colors text-left ${
                activeTab === tab
                  ? "bg-green-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {tab === "blog" ? "Blog Posts" : tab}
            </button>
          ))}
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 flex items-center gap-2 transition-colors"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>

      {emailStatus && (
        <div
          className={`mb-4 p-4 rounded-lg text-sm ${
            emailStatus.includes("Error")
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {emailStatus}
        </div>
      )}

      {/* Sort/Filter Bar */}
      {(activeTab === "volunteers" || activeTab === "donations") && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-end gap-4">
            {activeTab === "volunteers" && (
              <div className="w-full sm:w-auto">
                <SortDropdown
                  label="Sort by"
                  options={volunteerSortOptions}
                  value={volunteerSort}
                  onChange={setVolunteerSort}
                />
              </div>
            )}

            {activeTab === "donations" && (
              <>
                <div className="w-full sm:w-auto">
                  <SortDropdown
                    label="Sort by"
                    options={donationSortOptions}
                    value={donationSort}
                    onChange={setDonationSort}
                  />
                </div>
                <div className="w-full sm:w-auto">
                  <SortDropdown
                    label="Payment Method"
                    options={paymentMethodOptions}
                    value={paymentMethodFilter}
                    onChange={setPaymentMethodFilter}
                  />
                </div>
                <div className="w-full sm:w-auto">
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Date
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="text-sm w-full sm:min-w-[160px] justify-start"
                      >
                        {selectedDate
                          ? format(selectedDate, "MMM dd, yyyy")
                          : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={(date) =>
                          date > new Date() || date < new Date("2024-01-01")
                        }
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </>
            )}

            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="px-3 py-2 text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors whitespace-nowrap"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Active Filter Chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100">
              <span className="text-xs text-gray-500 mr-1 self-center">
                Active:
              </span>
              {volunteerSort && (
                <FilterChip
                  label={
                    volunteerSortOptions.find((o) => o.value === volunteerSort)
                      ?.label
                  }
                  onClear={() => setVolunteerSort(null)}
                />
              )}
              {donationSort && (
                <FilterChip
                  label={
                    donationSortOptions.find((o) => o.value === donationSort)
                      ?.label
                  }
                  onClear={() => setDonationSort(null)}
                />
              )}
              {paymentMethodFilter && (
                <FilterChip
                  label={
                    paymentMethodOptions.find(
                      (o) => o.value === paymentMethodFilter
                    )?.label
                  }
                  onClear={() => setPaymentMethodFilter(null)}
                />
              )}
              {selectedDate && (
                <FilterChip
                  label={format(selectedDate, "MMM dd, yyyy")}
                  onClear={() => setSelectedDate(null)}
                />
              )}
            </div>
          )}
        </div>
      )}

      {/* Volunteers Tab */}
      {activeTab === "volunteers" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Availability
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Skills
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {getSortedVolunteers().map((volunteer) => (
                  <tr
                    key={volunteer._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {volunteer.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {volunteer.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {volunteer.phone}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 capitalize">
                      {volunteer.availability}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                          volunteer.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : volunteer.status === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {volunteer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {volunteer.skills}
                    </td>
                    <td className="px-6 py-4">
                      {volunteer.status === "pending" && (
                        <button
                          onClick={() => handleApprove(volunteer._id)}
                          className="px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 transition-colors"
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

          {/* Mobile/Tablet Card View */}
          <div className="lg:hidden divide-y divide-gray-100">
            {getSortedVolunteers().map((volunteer) => (
              <div key={volunteer._id} className="p-4 space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm md:text-base">
                      {volunteer.name}
                    </h3>
                    <p className="text-xs md:text-sm text-gray-600 truncate">
                      {volunteer.email}
                    </p>
                    <p className="text-xs md:text-sm text-gray-600">
                      {volunteer.phone}
                    </p>
                  </div>
                  <span
                    className={`px-2.5 py-1 text-xs font-medium rounded-full whitespace-nowrap flex-shrink-0 ${
                      volunteer.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : volunteer.status === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {volunteer.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs md:text-sm">
                  <div>
                    <span className="text-gray-500">Availability:</span>
                    <span className="ml-1 text-gray-900 capitalize">
                      {volunteer.availability}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Skills:</span>
                    <span className="ml-1 text-gray-900">
                      {volunteer.skills}
                    </span>
                  </div>
                </div>
                {volunteer.status === "pending" && (
                  <button
                    onClick={() => handleApprove(volunteer._id)}
                    className="w-full px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Approve & Email
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Donations Tab */}
      {activeTab === "donations" && (
        <>
          {/* Stats Cards */}
          <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-xs md:text-sm font-medium text-gray-500 mb-1">
                Total Donations
              </h3>
              <p className="text-xl md:text-2xl font-bold text-green-600">
                {formatAmount(
                  getFilteredAndSortedDonations().reduce(
                    (acc, d) => acc + d.amount,
                    0
                  )
                )}
              </p>
            </div>
            <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-xs md:text-sm font-medium text-gray-500 mb-1">
                Successful Payments
              </h3>
              <p className="text-xl md:text-2xl font-bold text-green-600">
                {
                  getFilteredAndSortedDonations().filter(
                    (d) => d.status === "paid" || d.status === "succeeded"
                  ).length
                }
              </p>
            </div>
            <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100 sm:col-span-2 lg:col-span-1">
              <h3 className="text-xs md:text-sm font-medium text-gray-500 mb-1">
                Last 30 Days
              </h3>
              <p className="text-xl md:text-2xl font-bold text-green-600">
                {formatAmount(
                  getFilteredAndSortedDonations()
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

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Donor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Payment Method
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Reference
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {getFilteredAndSortedDonations().map((donation) => (
                    <tr
                      key={donation.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDate(donation.created_at)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {donation.donor_name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {donation.donor_email}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {formatAmount(donation.amount)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                            donation.status === "paid" ||
                            donation.status === "succeeded"
                              ? "bg-green-100 text-green-700"
                              : donation.status === "failed"
                              ? "bg-red-100 text-red-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {donation.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 capitalize">
                        {donation.payment_method}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {donation.reference}
                      </td>
                      <td className="px-6 py-4">
                        {(donation.status === "paid" ||
                          donation.status === "succeeded") && (
                          <button
                            onClick={() => handleSendThankYou(donation.id)}
                            className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors"
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

            {/* Mobile/Tablet Card View */}
            <div className="lg:hidden divide-y divide-gray-100">
              {getFilteredAndSortedDonations().map((donation) => (
                <div key={donation.id} className="p-4 space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm md:text-base truncate">
                        {donation.donor_name}
                      </h3>
                      <p className="text-xs md:text-sm text-gray-600 truncate">
                        {donation.donor_email}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(donation.created_at)}
                      </p>
                    </div>
                    <span
                      className={`px-2.5 py-1 text-xs font-medium rounded-full whitespace-nowrap flex-shrink-0 ${
                        donation.status === "paid" ||
                        donation.status === "succeeded"
                          ? "bg-green-100 text-green-700"
                          : donation.status === "failed"
                          ? "bg-red-100 text-red-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {donation.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center flex-wrap gap-2">
                    <div>
                      <span className="text-lg md:text-xl font-bold text-green-600">
                        {formatAmount(donation.amount)}
                      </span>
                      <div className="text-xs text-gray-500 mt-1 capitalize">
                        via {donation.payment_method}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Reference</p>
                      <p className="text-xs text-gray-700 font-mono truncate max-w-[120px]">
                        {donation.reference}
                      </p>
                    </div>
                  </div>
                  {(donation.status === "paid" ||
                    donation.status === "succeeded") && (
                    <button
                      onClick={() => handleSendThankYou(donation.id)}
                      className="w-full px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Send Thank You Email
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Blog Posts Tab */}
      {activeTab === "blog" && (
        <div className="mt-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 mb-6">
            <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-4">
              {isEditing ? "Edit Blog Post" : "Create New Blog Post"}
            </h2>

            {uploadStatus && (
              <div
                className={`mb-4 p-4 rounded-lg text-sm ${
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
              className="space-y-4"
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
                  className="w-full p-2.5 border border-gray-200 rounded-lg focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all text-sm"
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
                    setBlogPost((prev) => ({
                      ...prev,
                      subtitle: e.target.value,
                    }))
                  }
                  className="w-full p-2.5 border border-gray-200 rounded-lg focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all text-sm"
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
                  className="w-full p-2.5 border border-gray-200 rounded-lg focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all text-sm"
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
                    setBlogPost((prev) => ({
                      ...prev,
                      image: e.target.files[0],
                    }))
                  }
                  className="w-full p-2.5 border border-gray-200 rounded-lg focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all text-sm"
                  required={!isEditing}
                />
                {isEditing && editingPost?.imageUrl && (
                  <img
                    src={getImageUrl(editingPost.imageUrl)}
                    alt="Current"
                    className="mt-2 h-32 w-full sm:w-auto object-cover rounded-lg"
                  />
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  {isEditing ? "Update Post" : "Create Post"}
                </button>
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setEditingPost(null);
                      setBlogPost({
                        title: "",
                        subtitle: "",
                        description: "",
                        image: null,
                      });
                    }}
                    className="px-4 py-2 bg-gray-500 text-white font-medium rounded-lg hover:bg-gray-600 transition-colors text-sm"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
            <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-4">
              Recent Blog Posts
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {blogPosts.map((post) => (
                <div
                  key={post._id}
                  className="border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                >
                  <img
                    src={getImageUrl(post.imageUrl)}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-800 text-sm md:text-base">
                      {post.title}
                    </h4>
                    {post.subtitle && (
                      <p className="text-sm text-gray-500 italic mt-1">
                        {post.subtitle}
                      </p>
                    )}
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {post.description}
                    </p>
                    <div className="mt-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pt-3 border-t border-gray-100">
                      <span className="text-xs text-gray-500">
                        {new Date(post.date).toLocaleDateString()}
                      </span>
                      <div className="flex gap-2 w-full sm:w-auto">
                        <button
                          onClick={() => handleEditClick(post)}
                          className="flex-1 sm:flex-none px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeletePost(post._id)}
                          className="flex-1 sm:flex-none px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
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
