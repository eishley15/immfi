import { useState, useEffect } from "react";
import Footer from "../components/Footer";
import { API_ENDPOINTS } from "../config/api";

export default function Donate() {
  const [activeForm, setActiveForm] = useState("donation");

  // Donation states (existing)
  const [donationAmount, setDonationAmount] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [donorName, setDonorName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);

  // Volunteer states (new)
  const [volName, setVolName] = useState("");
  const [volEmail, setVolEmail] = useState("");
  const [volPhone, setVolPhone] = useState("");
  const [volAvailability, setVolAvailability] = useState("");
  const [volAvailabilityOther, setVolAvailabilityOther] = useState("");
  const [volSkills, setVolSkills] = useState("");
  const [volMessage, setVolMessage] = useState("");
  const [volSubmitting, setVolSubmitting] = useState(false);
  const [volStatus, setVolStatus] = useState(null);

  // Update the handleDonation function
  const handleDonation = async (e) => {
    e.preventDefault();

    if (!donationAmount || !donorEmail) {
      alert("Please fill in amount and email");
      return;
    }

    setIsProcessing(true);
    setPaymentStatus(null);

    try {
      const intentResponse = await fetch(API_ENDPOINTS.createPayment, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: parseFloat(donationAmount),
          currency: "PHP",
          description: donorName
            ? `Donation from ${donorName} to IMMFI`
            : "Donation to IMMFI",
          metadata: {
            donor_email: donorEmail,
            donor_name: donorName || "Anonymous",
          },
        }),
      });

      if (!intentResponse.ok) {
        throw new Error("Failed to create payment intent");
      }

      const { checkoutUrl } = await intentResponse.json();

      // Redirect to PayMongo checkout
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error("Payment error:", error);
      setPaymentStatus({
        type: "error",
        message:
          "An error occurred while processing your payment. Please try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVolunteerSubmit = async (e) => {
    e.preventDefault();

    if (!volName || !volEmail || !volPhone) {
      alert("Please fill in name, email and phone");
      return;
    }

    setVolSubmitting(true);
    setVolStatus(null);

    try {
      // Send volunteer signup to backend (implement endpoint on backend if needed)
      const res = await fetch("http://localhost:3001/api/volunteer-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: volName,
          email: volEmail,
          phone: volPhone,
          availability:
            volAvailability === "other"
              ? volAvailabilityOther
              : volAvailability,
          skills: volSkills,
          message: volMessage,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to submit volunteer form");
      }

      setVolStatus({
        type: "success",
        message:
          "Thank you! Your volunteer sign-up has been received. We will contact you soon.",
      });

      // Reset volunteer form
      setVolName("");
      setVolEmail("");
      setVolPhone("");
      setVolAvailability("");
      setVolAvailabilityOther("");
      setVolSkills("");
      setVolMessage("");
    } catch (error) {
      console.error("Volunteer signup error:", error);
      setVolStatus({
        type: "error",
        message:
          "An error occurred while submitting your volunteer sign-up. Please try again later.",
      });
    } finally {
      setVolSubmitting(false);
    }
  };

  const getPaymentMethodIcon = (methodId) => {
    switch (methodId) {
      case "card":
        return "💳";
      case "gcash":
        return "📱";
      case "paymaya":
        return "💙";
      default:
        return "💳";
    }
  };

  // Add a useEffect to check payment status on return
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get("status");

    if (status === "success") {
      setPaymentStatus({
        type: "success",
        message: "Thank you! Your donation has been processed successfully.",
      });
      // Reset form
      setDonationAmount("");
      setDonorName("");
      setDonorEmail("");
      // Clear URL parameters
      window.history.replaceState({}, "", window.location.pathname);
    } else if (status === "cancelled") {
      setPaymentStatus({
        type: "error",
        message:
          "Payment was cancelled. Please try again if you wish to donate.",
      });
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  // Add a new useEffect to handle return from PayMongo checkout
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get("status");
    const paymentIntentId = params.get("payment_intent_id");

    if (status && paymentIntentId) {
      const checkPaymentStatus = async () => {
        try {
          const response = await fetch(
            `http://localhost:3001/api/payment-status/${paymentIntentId}`
          );
          const data = await response.json();

          setPaymentStatus({
            type: data.status === "succeeded" ? "success" : "error",
            message:
              data.status === "succeeded"
                ? "Thank you! Your donation has been processed successfully."
                : "The payment was not successful. Please try again.",
          });

          // Clear URL parameters
          window.history.replaceState({}, "", window.location.pathname);
        } catch (error) {
          console.error("Error checking payment status:", error);
        }
      };

      checkPaymentStatus();
    }
  }, []);

  return (
    <div>
      <div className="w-full bg-[#F4F6F3] flex justify-center items-center py-30 pb-45 px-10 relative">
        <section className="max-w-[1400px] w-full flex justify-between gap-15">
          <div className="flex flex-col justify-center max-w-[700px] w-full">
            <h1 className="montserrat text-[22px] sm:text-[28px] font-bold text-[#2E7D32] mb-6">
              Your donations brings hope.
            </h1>
            <img
              className="w-full h-auto mb-6 object-cover"
              src="/images/donatepage_hero.png"
              alt="Donations bringing hope"
            />
            <p className="lato text-[15px] sm:text-[19px] font-normal leading-[1.6] tracking-[0.02em] text-[#004428]">
              Every donation helps children with disabilities live with dignity,
              opportunity, and love. Together, we can build a more inclusive
              future.
            </p>
          </div>

          <div className="bg-white flex flex-col justify-center shadow-md rounded-xl p-6 sm:p-8 max-w-[600px] w-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="montserrat text-[18px] sm:text-[22px] font-bold text-[#004428]">
                {activeForm === "donation"
                  ? "Make a Donation"
                  : "Volunteer with Us"}
              </h2>

              <div className="flex gap-2">
                <button
                  onClick={() => setActiveForm("donation")}
                  className={`px-3 py-1 rounded ${
                    activeForm === "donation"
                      ? "bg-[#2E7D32] text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  Donation
                </button>
                <button
                  onClick={() => setActiveForm("volunteer")}
                  className={`px-3 py-1 rounded ${
                    activeForm === "volunteer"
                      ? "bg-[#2E7D32] text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  Volunteer
                </button>
              </div>
            </div>

            {/* Payment Status Messages */}
            {activeForm === "donation" && paymentStatus && (
              <div
                className={`mb-6 p-4 rounded-lg ${
                  paymentStatus.type === "success"
                    ? "bg-green-100 text-green-800 border border-green-200"
                    : "bg-red-100 text-red-800 border border-red-200"
                }`}
              >
                {paymentStatus.message}
              </div>
            )}

            {/* Volunteer Status Messages */}
            {activeForm === "volunteer" && volStatus && (
              <div
                className={`mb-6 p-4 rounded-lg ${
                  volStatus.type === "success"
                    ? "bg-green-100 text-green-800 border border-green-200"
                    : "bg-red-100 text-red-800 border border-red-200"
                }`}
              >
                {volStatus.message}
              </div>
            )}

            {/* Conditional Forms */}
            {activeForm === "donation" ? (
              <form onSubmit={handleDonation} className="space-y-6">
                {/* Donation Amount */}
                <div>
                  <label className="block montserrat text-[14px] font-medium text-[#004428] mb-2">
                    Donation Amount (PHP) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent"
                    placeholder="Enter amount"
                    required
                  />
                </div>

                {/* Optional Name */}
                <div>
                  <label className="block montserrat text-[14px] font-medium text-[#004428] mb-2">
                    Your Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent"
                    placeholder="Enter your name (optional)"
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label className="block montserrat text-[14px] font-medium text-[#004428] mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={donorEmail}
                    onChange={(e) => setDonorEmail(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition ${
                    isProcessing
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#2E7D32] hover:bg-[#1B5E20] text-white"
                  }`}
                >
                  {isProcessing
                    ? "Processing..."
                    : `Donate ₱${donationAmount || "0"}`}
                </button>

                {/* Security Notice */}
                <div className="mt-4 text-xs text-gray-600">
                  By making a donation, you agree to receive a confirmation
                  email from IMMFI. Your information is secure and will not be
                  shared.
                </div>
              </form>
            ) : (
              <form onSubmit={handleVolunteerSubmit} className="space-y-4">
                <div>
                  <label className="block montserrat text-[14px] font-medium text-[#004428] mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={volName}
                    onChange={(e) => setVolName(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label className="block montserrat text-[14px] font-medium text-[#004428] mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={volEmail}
                    onChange={(e) => setVolEmail(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div>
                  <label className="block montserrat text-[14px] font-medium text-[#004428] mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={volPhone}
                    onChange={(e) => setVolPhone(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent"
                    placeholder="Enter your phone number"
                    required
                  />
                </div>

                <div>
                  <label className="block montserrat text-[14px] font-medium text-[#004428] mb-2">
                    Availability
                  </label>
                  <select
                    value={volAvailability}
                    onChange={(e) => setVolAvailability(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent"
                  >
                    <option value="">Select your availability</option>
                    <option value="weekdays">Weekdays</option>
                    <option value="weekend">Weekend</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {volAvailability === "other" && (
                  <div>
                    <label className="block montserrat text-[14px] font-medium text-[#004428] mb-2">
                      Please specify your availability *
                    </label>
                    <input
                      type="text"
                      value={volAvailabilityOther}
                      onChange={(e) => setVolAvailabilityOther(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent"
                      placeholder="e.g. Mornings only, Evenings, Flexible"
                      required
                    />
                  </div>
                )}

                <div>
                  <label className="block montserrat text-[14px] font-medium text-[#004428] mb-2">
                    Skills / Interests
                  </label>
                  <input
                    type="text"
                    value={volSkills}
                    onChange={(e) => setVolSkills(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent"
                    placeholder="e.g. teaching, events, fundraising"
                  />
                </div>

                <div>
                  <label className="block montserrat text-[14px] font-medium text-[#004428] mb-2">
                    Message (optional)
                  </label>
                  <textarea
                    value={volMessage}
                    onChange={(e) => setVolMessage(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent"
                    placeholder="Tell us why you'd like to volunteer"
                    rows={4}
                  />
                </div>

                <button
                  type="submit"
                  disabled={volSubmitting}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition ${
                    volSubmitting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#2E7D32] hover:bg-[#1B5E20] text-white"
                  }`}
                >
                  {volSubmitting ? "Submitting..." : "Sign Up to Volunteer"}
                </button>

                <div className="mt-2 text-xs text-gray-600">
                  By signing up you agree to be contacted by IMMFI about
                  volunteer opportunities.
                </div>
              </form>
            )}

            {/* Security / Info Notice */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <span className="text-blue-600 text-sm">🔒</span>
                <div className="text-xs text-blue-800">
                  <p className="font-medium mb-1">Secure Payment & Privacy</p>
                  <p>
                    Payment information is encrypted and secure. Volunteer data
                    will be handled confidentially and only used to contact you
                    about opportunities.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
