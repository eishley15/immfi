import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient, API_ENDPOINTS } from "../config/api";
import { LogOut } from "lucide-react";
import VolunteersSection from "./AdminSections/VolunteersSection";
import DonationsSection from "./AdminSections/DonationsSection";
import BlogSection from "./AdminSections/BlogSection";

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
    facebookUrl: "",
  });
  const [blogPosts, setBlogPosts] = useState([]);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [verifyingDonationId, setVerifyingDonationId] = useState(null);
  const [receiptImage, setReceiptImage] = useState(null);
  const [donationStats, setDonationStats] = useState(null);
  const [verificationNotes, setVerificationNotes] = useState(null);

  // Sorting & Filtering State
  const [volunteerSort, setVolunteerSort] = useState(null);
  const [donationSort, setDonationSort] = useState(null);
  const [paymentMethodFilter, setPaymentMethodFilter] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);
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
      fetchDonationStats();
    } else {
      fetchBlogPosts();
    }
  }, [activeTab]);

  const fetchVolunteers = async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.volunteers);
      setVolunteers(response.data);
      setLoading(false);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("isAdmin");
        localStorage.removeItem("token");
        navigate("/admin-login");
        return;
      }
      setError("Failed to fetch volunteers");
      setLoading(false);
    }
  };

  const handleApprove = async (volunteerId) => {
    try {
      const response = await apiClient.post(
        API_ENDPOINTS.volunteerApprove(volunteerId),
      );
      if (response.status === 200 || response.status === 201) {
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
      const response = await apiClient.get(API_ENDPOINTS.donations);
      setDonations(response.data.donations || []);
      setLoading(false);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("isAdmin");
        localStorage.removeItem("token");
        navigate("/admin-login");
        return;
      }
      setError("Failed to fetch donations");
      setLoading(false);
    }
  };

  const handleSendThankYou = async (donationId) => {
    try {
      const response = await apiClient.post(
        API_ENDPOINTS.donationSendThankYou(donationId),
      );
      if (response.status === 200 || response.status === 201) {
        setEmailStatus("Thank you email sent successfully!");
      } else {
        throw new Error("Failed to send thank you email");
      }
    } catch (error) {
      console.error("Error:", error);
      setEmailStatus("Error: Failed to send thank you email");
    }
  };

  const handleVerifyDonation = async (donationId) => {
    try {
      setEmailStatus(null);
      const response = await apiClient.post(
        API_ENDPOINTS.donationVerify(donationId),
        {
          notes: "Verified by admin",
          receiptImage: receiptImage,
        },
      );
      if (response.status === 200 || response.status === 201) {
        setEmailStatus(
          "Donation verified successfully and email sent to donor!",
        );
        setVerifyingDonationId(null);
        setReceiptImage(null);
        fetchDonations();
        // Refresh stats
        fetchDonationStats();
      } else {
        throw new Error("Failed to verify donation");
      }
    } catch (error) {
      console.error("Error:", error);
      setEmailStatus("Error: Failed to verify donation");
      setVerificationNotes(null);
    }
  };

  const fetchDonationStats = async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.donationStats);
      if (response.status === 200) {
        setDonationStats(response.data);
      }
    } catch (error) {
      console.error("Error fetching donation stats:", error);
    }
  };

  const handleRejectDonation = async (donationId) => {
    try {
      setEmailStatus(null);
      const response = await apiClient.post(
        `${API_ENDPOINTS.donations}/${donationId}/reject`,
        {
          notes: verificationNotes || "Rejected by admin",
        },
      );
      if (response.status === 200 || response.status === 201) {
        setEmailStatus("Donation rejected successfully!");
        setVerifyingDonationId(null);
        setReceiptImage(null);
        setVerificationNotes(null);
        fetchDonations();
        fetchDonationStats();
      } else {
        throw new Error("Failed to reject donation");
      }
    } catch (error) {
      console.error("Error:", error);
      setEmailStatus("Error: Failed to reject donation");
      setVerifyingDonationId(null);
      setReceiptImage(null);
      setVerificationNotes(null);
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
    if (!Array.isArray(donations)) {
      return [];
    }

    let filtered = [...donations];

    // Filter by payment method
    if (paymentMethodFilter) {
      filtered = filtered.filter(
        (d) => d.paymentMethod === paymentMethodFilter,
      );
    }

    // Filter by status
    if (statusFilter) {
      filtered = filtered.filter((d) => d.status === statusFilter);
    }

    // Filter by date
    if (selectedDate) {
      filtered = filtered.filter((d) => {
        const donationDate = new Date(d.createdAt);
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
            return new Date(b.createdAt) - new Date(a.createdAt);
          case "date-asc":
            return new Date(a.createdAt) - new Date(b.createdAt);
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
    setStatusFilter(null);
    setSelectedDate(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("isAdmin");
    navigate("/admin-login");
  };

  const hasActiveFilters =
    volunteerSort ||
    donationSort ||
    paymentMethodFilter ||
    statusFilter ||
    selectedDate;

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
      formData.append("facebookUrl", blogPost.facebookUrl || "");
      formData.append("createdBy", "Admin");

      const response = await apiClient.post(API_ENDPOINTS.gallery, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200 || response.status === 201) {
        setUploadStatus({
          type: "success",
          message: "Blog post created successfully!",
        });
        setBlogPost({
          title: "",
          subtitle: "",
          description: "",
          image: null,
          facebookUrl: "",
        });
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
      formData.append("facebookUrl", blogPost.facebookUrl || "");
      if (blogPost.image instanceof File) {
        formData.append("image", blogPost.image);
      }

      const response = await apiClient.put(
        API_ENDPOINTS.blogPost(editingPost._id),
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.status === 200) {
        setUploadStatus({
          type: "success",
          message: "Blog post updated successfully!",
        });
        setBlogPost({
          title: "",
          subtitle: "",
          description: "",
          image: null,
          facebookUrl: "",
        });
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
      const response = await apiClient.get(API_ENDPOINTS.gallery);
      if (response.status === 200) {
        setBlogPosts(response.data);
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
      facebookUrl: post.facebookUrl || "",
    });
    setIsEditing(true);
  };

  const handleDeletePost = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this post? This action cannot be undone.",
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

  const handlePrintVolunteers = () => {
    const volunteers = getSortedVolunteers();
    const printWindow = window.open("", "_blank");

    const printContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Volunteers Report - IMMFI</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: 'Segoe UI', Arial, sans-serif; 
          padding: 40px; 
          color: #333;
          line-height: 1.5;
        }
        .header { 
          text-align: center; 
          margin-bottom: 30px; 
          padding-bottom: 20px;
          border-bottom: 2px solid #2E7D32;
        }
        .header h1 { 
          color: #2E7D32; 
          font-size: 24px;
          margin-bottom: 5px;
        }
        .header p { 
          color: #666; 
          font-size: 12px;
        }
        .summary {
          display: flex;
          gap: 20px;
          margin-bottom: 25px;
          padding: 15px;
          background: #f9f9f9;
          border-radius: 8px;
        }
        .summary-item {
          text-align: center;
          flex: 1;
        }
        .summary-item strong {
          display: block;
          font-size: 24px;
          color: #2E7D32;
        }
        .summary-item span {
          font-size: 11px;
          color: #666;
          text-transform: uppercase;
        }
        table { 
          width: 100%; 
          border-collapse: collapse; 
          font-size: 11px;
          margin-top: 10px;
        }
        th { 
          background: #2E7D32; 
          color: white; 
          padding: 10px 8px;
          text-align: left;
          font-weight: 600;
          text-transform: uppercase;
          font-size: 10px;
        }
        td { 
          padding: 10px 8px; 
          border-bottom: 1px solid #e0e0e0;
          vertical-align: top;
        }
        tr:nth-child(even) { background: #f9f9f9; }
        tr:hover { background: #f0f7f0; }
        .status {
          display: inline-block;
          padding: 3px 8px;
          border-radius: 12px;
          font-size: 10px;
          font-weight: 600;
        }
        .status-approved { background: #dcfce7; color: #166534; }
        .status-pending { background: #fef3c7; color: #92400e; }
        .status-rejected { background: #fee2e2; color: #991b1b; }
        .footer {
          margin-top: 30px;
          padding-top: 15px;
          border-top: 1px solid #e0e0e0;
          text-align: center;
          font-size: 10px;
          color: #999;
        }
        @media print {
          body { padding: 20px; }
          .summary { break-inside: avoid; }
          tr { break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Volunteers Report</h1>
        <p>Inocencio Magtoto Memorial Foundation Inc.</p>
        <p>Generated on ${new Date().toLocaleDateString("en-PH", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}</p>
      </div>
      
      <div class="summary">
        <div class="summary-item">
          <strong>${volunteers.length}</strong>
          <span>Total Volunteers</span>
        </div>
        <div class="summary-item">
          <strong>${
            volunteers.filter((v) => v.status === "approved").length
          }</strong>
          <span>Approved</span>
        </div>
        <div class="summary-item">
          <strong>${
            volunteers.filter((v) => v.status === "pending").length
          }</strong>
          <span>Pending</span>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Availability</th>
            <th>Skills</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${volunteers
            .map(
              (v) => `
            <tr>
              <td>${v.name}</td>
              <td>${v.email}</td>
              <td>${v.phone}</td>
              <td style="text-transform: capitalize;">${v.availability}</td>
              <td>${v.skills || "-"}</td>
              <td>
                <span class="status status-${v.status}">${v.status}</span>
              </td>
            </tr>
          `,
            )
            .join("")}
        </tbody>
      </table>
      
      <div class="footer">
        <p>IMMFI Admin Dashboard • Confidential Document</p>
      </div>
    </body>
    </html>
  `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
    };
  };

  const handlePrintDonations = () => {
    const donations = getFilteredAndSortedDonations();
    const totalAmount = donations.reduce((acc, d) => acc + d.amount, 0);
    const successfulDonations = donations.filter(
      (d) =>
        d.status === "verified" ||
        d.status === "paid" ||
        d.status === "succeeded",
    );
    const printWindow = window.open("", "_blank");

    const printContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Donations Report - IMMFI</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: 'Segoe UI', Arial, sans-serif; 
          padding: 40px; 
          color: #333;
          line-height: 1.5;
        }
        .header { 
          text-align: center; 
          margin-bottom: 30px; 
          padding-bottom: 20px;
          border-bottom: 2px solid #2E7D32;
        }
        .header h1 { 
          color: #2E7D32; 
          font-size: 24px;
          margin-bottom: 5px;
        }
        .header p { 
          color: #666; 
          font-size: 12px;
        }
        .summary {
          display: flex;
          gap: 20px;
          margin-bottom: 25px;
          padding: 15px;
          background: #f9f9f9;
          border-radius: 8px;
        }
        .summary-item {
          text-align: center;
          flex: 1;
        }
        .summary-item strong {
          display: block;
          font-size: 24px;
          color: #2E7D32;
        }
        .summary-item span {
          font-size: 11px;
          color: #666;
          text-transform: uppercase;
        }
        table { 
          width: 100%; 
          border-collapse: collapse; 
          font-size: 11px;
          margin-top: 10px;
        }
        th { 
          background: #2E7D32; 
          color: white; 
          padding: 10px 8px;
          text-align: left;
          font-weight: 600;
          text-transform: uppercase;
          font-size: 10px;
        }
        td { 
          padding: 10px 8px; 
          border-bottom: 1px solid #e0e0e0;
          vertical-align: top;
        }
        tr:nth-child(even) { background: #f9f9f9; }
        tr:hover { background: #f0f7f0; }
        .amount { 
          font-weight: 600; 
          color: #2E7D32;
        }
        .status {
          display: inline-block;
          padding: 3px 8px;
          border-radius: 12px;
          font-size: 10px;
          font-weight: 600;
        }
        .status-paid, .status-succeeded, .status-verified { background: #dcfce7; color: #166534; }
        .status-pending { background: #fef3c7; color: #92400e; }
        .status-failed, .status-rejected { background: #fee2e2; color: #991b1b; }
        .footer {
          margin-top: 30px;
          padding-top: 15px;
          border-top: 1px solid #e0e0e0;
          text-align: center;
          font-size: 10px;
          color: #999;
        }
        .total-row {
          background: #f0f7f0 !important;
          font-weight: 600;
        }
        .total-row td {
          border-top: 2px solid #2E7D32;
        }
        @media print {
          body { padding: 20px; }
          .summary { break-inside: avoid; }
          tr { break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Donations Report</h1>
        <p>Inocencio Magtoto Memorial Foundation Inc.</p>
        <p>Generated on ${new Date().toLocaleDateString("en-PH", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}</p>
      </div>
      
      <div class="summary">
        <div class="summary-item">
          <strong>${new Intl.NumberFormat("en-PH", {
            style: "currency",
            currency: "PHP",
          }).format(totalAmount)}</strong>
          <span>Total Donations</span>
        </div>
        <div class="summary-item">
          <strong>${successfulDonations.length}</strong>
          <span>Successful Payments</span>
        </div>
        <div class="summary-item">
          <strong>${donations.length}</strong>
          <span>Total Transactions</span>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Donor Name</th>
            <th>Email</th>
            <th>Amount</th>
            <th>Method</th>
            <th>Reference</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${donations
            .map(
              (d) => `
            <tr>
              <td>${new Date(d.createdAt).toLocaleDateString("en-PH", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}</td>
              <td>${d.donorName}</td>
              <td>${d.donorEmail}</td>
              <td class="amount">${new Intl.NumberFormat("en-PH", {
                style: "currency",
                currency: "PHP",
              }).format(d.amount)}</td>
              <td style="text-transform: capitalize;">${d.paymentMethod}</td>
              <td style="font-family: monospace; font-size: 10px;">${
                d.transactionRef
              }</td>
              <td>
                <span class="status status-${d.status}">${d.status}</span>
              </td>
            </tr>
          `,
            )
            .join("")}
          <tr class="total-row">
            <td colspan="3" style="text-align: right;"><strong>TOTAL:</strong></td>
            <td class="amount">${new Intl.NumberFormat("en-PH", {
              style: "currency",
              currency: "PHP",
            }).format(totalAmount)}</td>
            <td colspan="3"></td>
          </tr>
        </tbody>
      </table>
      
      <div class="footer">
        <p>IMMFI Admin Dashboard • Confidential Document</p>
      </div>
    </body>
    </html>
  `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
    };
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

      {/* Volunteers Section */}
      {activeTab === "volunteers" && (
        <VolunteersSection
          volunteers={volunteers}
          volunteerSort={volunteerSort}
          setVolunteerSort={setVolunteerSort}
          handleApprove={handleApprove}
          getSortedVolunteers={getSortedVolunteers}
          handlePrintVolunteers={handlePrintVolunteers}
        />
      )}

      {/* Donations Section */}
      {activeTab === "donations" && (
        <DonationsSection
          donations={donations}
          donationStats={donationStats}
          donationSort={donationSort}
          setDonationSort={setDonationSort}
          paymentMethodFilter={paymentMethodFilter}
          setPaymentMethodFilter={setPaymentMethodFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          handleVerifyClick={(id) => setVerifyingDonationId(id)}
          handleSendThankYou={handleSendThankYou}
          handlePrintDonations={handlePrintDonations}
          getFilteredAndSortedDonations={getFilteredAndSortedDonations}
          formatAmount={formatAmount}
          formatDate={formatDate}
          verifyingDonationId={verifyingDonationId}
          receiptImage={receiptImage}
          setReceiptImage={setReceiptImage}
          verificationNotes={verificationNotes}
          setVerificationNotes={setVerificationNotes}
          emailStatus={emailStatus}
          handleVerifyDonation={handleVerifyDonation}
          handleRejectDonation={handleRejectDonation}
          setVerifyingDonationId={setVerifyingDonationId}
        />
      )}

      {/* Blog Section */}
      {activeTab === "blog" && (
        <BlogSection
          blogPost={blogPost}
          setBlogPost={setBlogPost}
          blogPosts={blogPosts}
          uploadStatus={uploadStatus}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          editingPost={editingPost}
          setEditingPost={setEditingPost}
          handleBlogSubmit={handleBlogSubmit}
          handleEditSubmit={handleEditSubmit}
          handleEditClick={handleEditClick}
          handleDeletePost={handleDeletePost}
        />
      )}
    </div>
  );
}
