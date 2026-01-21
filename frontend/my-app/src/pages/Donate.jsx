import { useState, useEffect } from "react";
import Footer from "../components/Footer";

export default function Donate() {
  const [activeForm, setActiveForm] = useState("donation");

  // Donation states (existing)
  const [donationAmount, setDonationAmount] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [donorName, setDonorName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [transactionRef, setTransactionRef] = useState("");

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
  const handleDonation = (e) => {
    e.preventDefault();

    if (!donationAmount || !donorEmail) {
      alert("Please fill in amount and email");
      return;
    }

    setShowPaymentMethods(true);
    setPaymentStatus(null);
  };

  const handlePaymentMethodSubmit = async (e) => {
    e.preventDefault();

    if (!selectedPaymentMethod || !transactionRef) {
      alert("Please select a payment method and enter transaction reference");
      return;
    }

    setIsProcessing(true);
    setPaymentStatus(null);

    try {
      const res = await fetch("http://localhost:3001/api/donation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(donationAmount),
          donorName: donorName || "Anonymous",
          donorEmail: donorEmail,
          paymentMethod: selectedPaymentMethod,
          transactionRef: transactionRef,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to submit donation");
      }

      setPaymentStatus({
        type: "success",
        message:
          "Thank you! Your donation has been received. We will verify the transaction shortly and send you a confirmation email.",
      });

      // Reset form
      setDonationAmount("");
      setDonorName("");
      setDonorEmail("");
      setShowPaymentMethods(false);
      setSelectedPaymentMethod("");
      setTransactionRef("");
    } catch (error) {
      console.error("Donation submission error:", error);
      setPaymentStatus({
        type: "error",
        message:
          "An error occurred while processing your donation. Please try again.",
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

  return (
    <div>
      <div className="w-full bg-[#F4F6F3] flex justify-center items-center py-8 sm:py-16 md:py-20 lg:py-30 px-4 sm:px-6 md:px-10 relative">
        <section className="max-w-[1400px] w-full flex flex-col lg:flex-row justify-between gap-6 sm:gap-8 md:gap-10 lg:gap-15">
          <div className="flex flex-col justify-center w-full lg:max-w-[700px]">
            <h1 className="montserrat text-[20px] sm:text-[24px] md:text-[26px] lg:text-[28px] font-bold text-[#2E7D32] mb-4 sm:mb-6">
              Your support brings hope.
            </h1>
            <img
              className="w-full h-auto mb-4 sm:mb-6 object-cover rounded-lg"
              src="/images/donatepage_hero.png"
              alt="Donations bringing hope"
            />
            <p className="lato text-[14px] sm:text-[15px] md:text-[17px] lg:text-[19px] font-normal leading-[1.6] tracking-[0.02em] text-[#004428]">
              Every support helps children with disabilities live with dignity,
              opportunity, and love. Together, we can build a more inclusive
              future.
            </p>
          </div>

          <div className="bg-white flex flex-col justify-center shadow-md rounded-xl p-4 sm:p-6 md:p-8 w-full lg:max-w-[600px]">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
              <h2 className="montserrat text-[16px] sm:text-[18px] md:text-[20px] lg:text-[22px] font-bold text-[#004428]">
                {activeForm === "donation"
                  ? "Make a Support"
                  : "Volunteer with Us"}
              </h2>

              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setActiveForm("donation")}
                  className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded text-sm sm:text-base transition ${
                    activeForm === "donation"
                      ? "bg-[#2E7D32] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Support
                </button>
                <button
                  onClick={() => setActiveForm("volunteer")}
                  className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded text-sm sm:text-base transition ${
                    activeForm === "volunteer"
                      ? "bg-[#2E7D32] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Volunteer
                </button>
              </div>
            </div>

            {/* Payment Status Messages */}
            {activeForm === "donation" && paymentStatus && (
              <div
                className={`mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg text-sm sm:text-base ${
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
                className={`mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg text-sm sm:text-base ${
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
              <>
                {!showPaymentMethods ? (
                  <form
                    onSubmit={handleDonation}
                    className="space-y-4 sm:space-y-6"
                  >
                    {/* Donation Amount */}
                    <div>
                      <label className="block montserrat text-[13px] sm:text-[14px] font-medium text-[#004428] mb-2">
                        Support Amount (PHP) *
                      </label>
                      <input
                        type="number"
                        min="1"
                        step="0.01"
                        value={donationAmount}
                        onChange={(e) => setDonationAmount(e.target.value)}
                        className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg text-base sm:text-lg focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent"
                        placeholder="Enter amount"
                        required
                      />
                    </div>

                    {/* Optional Name */}
                    <div>
                      <label className="block montserrat text-[13px] sm:text-[14px] font-medium text-[#004428] mb-2">
                        Your Name (Optional)
                      </label>
                      <input
                        type="text"
                        value={donorName}
                        onChange={(e) => setDonorName(e.target.value)}
                        className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg text-base sm:text-lg focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent"
                        placeholder="Enter your name (optional)"
                      />
                    </div>

                    {/* Email Address */}
                    <div>
                      <label className="block montserrat text-[13px] sm:text-[14px] font-medium text-[#004428] mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={donorEmail}
                        onChange={(e) => setDonorEmail(e.target.value)}
                        className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg text-base sm:text-lg focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent"
                        placeholder="Enter your email"
                        required
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className={`w-full py-3 px-4 rounded-lg font-medium text-base sm:text-lg transition ${
                        isProcessing
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-[#2E7D32] hover:bg-[#1B5E20] text-white"
                      }`}
                    >
                      {isProcessing
                        ? "Processing..."
                        : `Support ₱${donationAmount || "0"}`}
                    </button>

                    {/* Security Notice */}
                    <div className="mt-4 text-xs sm:text-sm text-gray-600">
                      By making a support, you agree to receive a confirmation
                      email from IMMFI. Your information is secure and will not
                      be shared.
                    </div>
                  </form>
                ) : (
                  <>
                    {/* Payment Status Messages */}
                    {paymentStatus && (
                      <div
                        className={`mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg text-sm sm:text-base ${
                          paymentStatus.type === "success"
                            ? "bg-green-100 text-green-800 border border-green-200"
                            : "bg-red-100 text-red-800 border border-red-200"
                        }`}
                      >
                        {paymentStatus.message}
                      </div>
                    )}

                    <form
                      onSubmit={handlePaymentMethodSubmit}
                      className="space-y-4 sm:space-y-8"
                    >
                      <div>
                        <h3 className="montserrat text-[15px] sm:text-[16px] font-bold text-[#004428] mb-3 sm:mb-4">
                          Select Payment Method
                        </h3>
                        <div className="space-y-2 sm:space-y-3">
                          {/* GCash Option */}
                          <label
                            className="flex items-center p-3 sm:p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition"
                            style={{
                              borderColor:
                                selectedPaymentMethod === "gcash"
                                  ? "#2E7D32"
                                  : "#e5e7eb",
                              backgroundColor:
                                selectedPaymentMethod === "gcash"
                                  ? "#f0f9ff"
                                  : "white",
                            }}
                          >
                            <input
                              type="radio"
                              name="paymentMethod"
                              value="gcash"
                              checked={selectedPaymentMethod === "gcash"}
                              onChange={(e) => {
                                setSelectedPaymentMethod(e.target.value);
                                setTransactionRef("");
                              }}
                              className="w-4 h-4 text-[#2E7D32]"
                            />
                            <div className="ml-3 flex-grow">
                              <p className="font-medium text-[14px] sm:text-base text-[#004428]">
                                GCash
                              </p>
                              <p className="text-xs sm:text-sm text-gray-600">
                                Scan QR code or send to GCash number
                              </p>
                            </div>
                          </label>

                          {/* Bank Transfer Option */}
                          <label
                            className="flex items-center p-3 sm:p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition"
                            style={{
                              borderColor:
                                selectedPaymentMethod === "bank"
                                  ? "#2E7D32"
                                  : "#e5e7eb",
                              backgroundColor:
                                selectedPaymentMethod === "bank"
                                  ? "#f0f9ff"
                                  : "white",
                            }}
                          >
                            <input
                              type="radio"
                              name="paymentMethod"
                              value="bank"
                              checked={selectedPaymentMethod === "bank"}
                              onChange={(e) => {
                                setSelectedPaymentMethod(e.target.value);
                                setTransactionRef("");
                              }}
                              className="w-4 h-4 text-[#2E7D32]"
                            />
                            <div className="ml-3 flex-grow">
                              <p className="font-medium text-[14px] sm:text-base text-[#004428]">
                                Bank Transfer
                              </p>
                              <p className="text-xs sm:text-sm text-gray-600">
                                Transfer to our bank account details
                              </p>
                            </div>
                          </label>
                        </div>
                      </div>

                      {/* Payment Details Display */}
                      {selectedPaymentMethod && (
                        <div className="p-4 sm:p-6 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="font-medium text-blue-900 mb-3 sm:mb-4 text-center text-sm sm:text-base">
                            {selectedPaymentMethod === "gcash"
                              ? "GCash Payment Details"
                              : "Bank Transfer Details"}
                          </p>

                          {selectedPaymentMethod === "gcash" ? (
                            <>
                              {/* QR Code Image for GCash */}
                              <div className="mb-4 sm:mb-6 flex justify-center">
                                <img
                                  src="/images/gcash-qr.jpeg"
                                  alt="GCash QR Code"
                                  className="w-48 sm:w-56 md:w-64 h-auto border-2 border-blue-300 rounded-lg bg-white p-2 sm:p-3 object-cover"
                                  onError={(e) => {
                                    e.target.src =
                                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Crect fill='%23f0f9ff' width='200' height='200'/%3E%3Ctext x='50%25' y='45%25' font-size='14' fill='%230369a1' text-anchor='middle' dominant-baseline='middle'%3EQR Code%3C/text%3E%3Ctext x='50%25' y='58%25' font-size='12' fill='%230369a1' text-anchor='middle' dominant-baseline='middle'%3EPlaceholder%3C/text%3E%3C/svg%3E";
                                  }}
                                />
                              </div>

                              <div className="space-y-2 sm:space-y-3">
                                <p className="text-xs sm:text-sm text-blue-800 font-medium">
                                  Amount: ₱{donationAmount}
                                </p>
                                <p className="text-xs sm:text-sm text-blue-800 leading-relaxed">
                                  Please send the amount to our GCash account.
                                  You can scan the QR code above or manually
                                  send to{" "}
                                  <strong className="font-bold text-blue-900">
                                    0921 281 6420
                                  </strong>
                                  . You will receive a reference number upon
                                  successful transfer.
                                </p>
                              </div>
                            </>
                          ) : (
                            <>
                              {/* Bank Account Details Box */}
                              <div className="space-y-3 sm:space-y-4">
                                <div className="bg-white p-4 sm:p-5 rounded-lg border-2 border-blue-300">
                                  <p className="text-xs text-blue-600 font-medium mb-2">
                                    Bank Account Details
                                  </p>
                                  <p className="text-sm sm:text-base text-gray-700 mb-3">
                                    <span className="text-gray-600">
                                      Bank Name:
                                    </span>{" "}
                                    <strong className="font-bold text-[#004428] text-base sm:text-lg">
                                      Metrobank
                                    </strong>
                                  </p>
                                  <p className="text-sm sm:text-base text-gray-700 mb-1">
                                    <span className="text-gray-600">
                                      Account Name:
                                    </span>
                                  </p>
                                  <p className="font-bold text-blue-900 text-lg sm:text-xl tracking-wide bg-blue-100 p-3 rounded border border-blue-300 text-center">
                                    Inocencio Magtoto Memorial Foundation, Inc.
                                  </p>
                                  <p className="text-sm sm:text-base text-gray-700 mb-1">
                                    <span className="text-gray-600">
                                      Account Number:
                                    </span>
                                  </p>
                                  <p className="font-bold text-blue-900 text-lg sm:text-xl tracking-wide bg-blue-100 p-3 rounded border border-blue-300 text-center">
                                    296 3 29606389 5
                                  </p>
                                </div>

                                <div className="bg-white p-3 sm:p-4 rounded border border-blue-200">
                                  <p className="text-xs sm:text-sm text-blue-800 leading-relaxed">
                                    Transfer Amount:{" "}
                                    <strong className="font-bold text-blue-900">
                                      ₱{donationAmount}
                                    </strong>
                                  </p>
                                  <p className="text-xs sm:text-sm text-blue-800 leading-relaxed mt-2">
                                    You will receive a reference number from
                                    your bank after the transfer. Please save it
                                    for your records.
                                  </p>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      )}

                      {/* Transaction Reference */}
                      <div>
                        <label className="block montserrat text-[13px] sm:text-[14px] font-medium text-[#004428] mb-2">
                          Transaction Reference Number *
                        </label>
                        <input
                          type="text"
                          value={transactionRef}
                          onChange={(e) => setTransactionRef(e.target.value)}
                          className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg text-base sm:text-lg focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent"
                          placeholder={
                            selectedPaymentMethod === "gcash"
                              ? "Enter GCash reference number (e.g., 123456789)"
                              : "Enter bank transaction reference number"
                          }
                          required
                        />
                        <p className="mt-2 text-xs text-gray-600">
                          You'll receive this in your{" "}
                          {selectedPaymentMethod === "gcash" ? "GCash" : "bank"}{" "}
                          receipt after completing the transfer
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 sm:gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setShowPaymentMethods(false);
                            setSelectedPaymentMethod("");
                            setTransactionRef("");
                          }}
                          className="flex-1 py-2 sm:py-3 px-4 rounded-lg font-medium text-sm sm:text-base border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
                        >
                          Back
                        </button>
                        <button
                          type="submit"
                          disabled={isProcessing}
                          className={`flex-1 py-2 sm:py-3 px-4 rounded-lg font-medium text-sm sm:text-base transition ${
                            isProcessing
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-[#2E7D32] hover:bg-[#1B5E20] text-white"
                          }`}
                        >
                          {isProcessing ? "Submitting..." : "Confirm Support"}
                        </button>
                      </div>

                      <div className="mt-4 text-xs text-gray-600">
                        After completing the payment, we will verify your
                        transaction and send a confirmation email within 24
                        hours.
                      </div>
                    </form>
                  </>
                )}
              </>
            ) : (
              <form
                onSubmit={handleVolunteerSubmit}
                className="space-y-3 sm:space-y-4"
              >
                <div>
                  <label className="block montserrat text-[13px] sm:text-[14px] font-medium text-[#004428] mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={volName}
                    onChange={(e) => setVolName(e.target.value)}
                    className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg text-base sm:text-lg focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label className="block montserrat text-[13px] sm:text-[14px] font-medium text-[#004428] mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={volEmail}
                    onChange={(e) => setVolEmail(e.target.value)}
                    className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg text-base sm:text-lg focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div>
                  <label className="block montserrat text-[13px] sm:text-[14px] font-medium text-[#004428] mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={volPhone}
                    onChange={(e) => setVolPhone(e.target.value)}
                    className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg text-base sm:text-lg focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent"
                    placeholder="Enter your phone number"
                    required
                  />
                </div>

                <div>
                  <label className="block montserrat text-[13px] sm:text-[14px] font-medium text-[#004428] mb-2">
                    Availability
                  </label>
                  <select
                    value={volAvailability}
                    onChange={(e) => setVolAvailability(e.target.value)}
                    className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg text-base sm:text-lg focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent"
                  >
                    <option value="">Select your availability</option>
                    <option value="weekdays">Weekdays</option>
                    <option value="weekend">Weekend</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {volAvailability === "other" && (
                  <div>
                    <label className="block montserrat text-[13px] sm:text-[14px] font-medium text-[#004428] mb-2">
                      Please specify your availability *
                    </label>
                    <input
                      type="text"
                      value={volAvailabilityOther}
                      onChange={(e) => setVolAvailabilityOther(e.target.value)}
                      className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg text-base sm:text-lg focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent"
                      placeholder="e.g. Mornings only, Evenings, Flexible"
                      required
                    />
                  </div>
                )}

                <div>
                  <label className="block montserrat text-[13px] sm:text-[14px] font-medium text-[#004428] mb-2">
                    Skills / Interests
                  </label>
                  <input
                    type="text"
                    value={volSkills}
                    onChange={(e) => setVolSkills(e.target.value)}
                    className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg text-base sm:text-lg focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent"
                    placeholder="e.g. teaching, events, fundraising"
                  />
                </div>

                <div>
                  <label className="block montserrat text-[13px] sm:text-[14px] font-medium text-[#004428] mb-2">
                    Message (optional)
                  </label>
                  <textarea
                    value={volMessage}
                    onChange={(e) => setVolMessage(e.target.value)}
                    className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg text-base sm:text-lg focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent"
                    placeholder="Tell us why you'd like to volunteer"
                    rows={4}
                  />
                </div>

                <button
                  type="submit"
                  disabled={volSubmitting}
                  className={`w-full py-3 px-4 rounded-lg font-medium text-base sm:text-lg transition ${
                    volSubmitting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#2E7D32] hover:bg-[#1B5E20] text-white"
                  }`}
                >
                  {volSubmitting ? "Submitting..." : "Sign Up to Volunteer"}
                </button>

                <div className="mt-2 text-xs sm:text-sm text-gray-600">
                  By signing up you agree to be contacted by IMMFI about
                  volunteer opportunities.
                </div>
              </form>
            )}

            {/* Security / Info Notice */}
            <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex gap-2 sm:gap-3">
                <span className="text-blue-600 text-sm flex-shrink-0">🔒</span>
                <div className="text-xs sm:text-sm text-blue-800">
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
