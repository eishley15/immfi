import { useState } from "react";
import { ChevronDown, ArrowUpDown, X, Printer } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "../../components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { Button } from "../../components/ui/button";

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

const donationSortOptions = [
  { value: null, label: "Default" },
  { value: "date-desc", label: "Newest First" },
  { value: "date-asc", label: "Oldest First" },
  { value: "amount-desc", label: "Highest Amount" },
  { value: "amount-asc", label: "Lowest Amount" },
];

const paymentMethodOptions = [
  { value: null, label: "All Methods" },
  { value: "bank", label: "Bank" },
  { value: "gcash", label: "GCash" },
];

const statusFilterOptions = [
  { value: null, label: "All Status" },
  { value: "pending", label: "Pending" },
  { value: "verified", label: "Verified" },
  { value: "rejected", label: "Rejected" },
];

function StatsCard({ label, value, color }) {
  return (
    <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-xs md:text-sm font-medium text-gray-500 mb-1">
        {label}
      </h3>
      <p className={`text-xl md:text-2xl font-bold text-${color}-600`}>
        {value}
      </p>
    </div>
  );
}

export default function DonationsSection({
  donations,
  donationStats,
  donationSort,
  setDonationSort,
  paymentMethodFilter,
  setPaymentMethodFilter,
  statusFilter,
  setStatusFilter,
  selectedDate,
  setSelectedDate,
  handleVerifyClick,
  handleSendThankYou,
  handlePrintDonations,
  getFilteredAndSortedDonations,
  formatAmount,
  formatDate,
  verifyingDonationId,
  receiptImage,
  setReceiptImage,
  verificationNotes,
  setVerificationNotes,
  emailStatus,
  handleVerifyDonation,
  handleRejectDonation,
  setVerifyingDonationId,
}) {
  const clearAllFilters = () => {
    setDonationSort(null);
    setPaymentMethodFilter(null);
    setStatusFilter(null);
    setSelectedDate(null);
  };

  const hasActiveFilters =
    donationSort || paymentMethodFilter || statusFilter || selectedDate;

  // Calculate stats based on filtered donations
  const filteredDonations = getFilteredAndSortedDonations();
  const totalDonationsAmount = filteredDonations.reduce(
    (acc, d) => acc + d.amount,
    0
  );
  const verifiedCount = filteredDonations.filter(
    (d) => d.status === "verified"
  ).length;
  const pendingCount = filteredDonations.filter(
    (d) => d.status === "pending"
  ).length;
  const rejectedCount = filteredDonations.filter(
    (d) => d.status === "rejected"
  ).length;

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-end gap-4">
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
            <SortDropdown
              label="Status"
              options={statusFilterOptions}
              value={statusFilter}
              onChange={setStatusFilter}
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
          <div className="w-full sm:w-auto sm:ml-auto">
            <label className="block text-xs font-medium text-gray-500 mb-1 invisible">
              Action
            </label>
            <button
              onClick={handlePrintDonations}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-green-50 hover:border-green-400 hover:text-green-700 transition-all w-full sm:w-auto"
            >
              <Printer size={16} />
              <span>Print Report</span>
            </button>
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="px-3 py-2 text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors whitespace-nowrap"
            >
              Clear all
            </button>
          )}
        </div>

        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100">
            <span className="text-xs text-gray-500 mr-1 self-center">
              Active:
            </span>
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
            {statusFilter && (
              <FilterChip
                label={
                  statusFilterOptions.find((o) => o.value === statusFilter)
                    ?.label
                }
                onClear={() => setStatusFilter(null)}
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          label="Total Donations"
          value={new Intl.NumberFormat("en-PH", {
            style: "currency",
            currency: "PHP",
          }).format(totalDonationsAmount)}
          color="green"
        />
        <StatsCard label="Verified Count" value={verifiedCount} color="green" />
        <StatsCard label="Pending Count" value={pendingCount} color="amber" />
        <StatsCard label="Rejected Count" value={rejectedCount} color="red" />
      </div>

      {/* Table */}
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
                    {formatDate(donation.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {donation.donorName}
                    </div>
                    <div className="text-xs text-gray-500">
                      {donation.donorEmail}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {new Intl.NumberFormat("en-PH", {
                      style: "currency",
                      currency: "PHP",
                    }).format(donation.amount)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                        donation.status === "verified"
                          ? "bg-green-100 text-green-700"
                          : donation.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {donation.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 capitalize">
                    {donation.paymentMethod}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {donation.transactionRef}
                  </td>
                  <td className="px-6 py-4">
                    {donation.status === "pending" && (
                      <button
                        onClick={() => handleVerifyClick(donation.id)}
                        className="px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Verify
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
                    {donation.donorName}
                  </h3>
                  <p className="text-xs md:text-sm text-gray-600 truncate">
                    {donation.donorEmail}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDate(donation.createdAt)}
                  </p>
                </div>
                <span
                  className={`px-2.5 py-1 text-xs font-medium rounded-full whitespace-nowrap flex-shrink-0 ${
                    donation.status === "verified"
                      ? "bg-green-100 text-green-700"
                      : donation.status === "rejected"
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
                    via {donation.paymentMethod}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Reference</p>
                  <p className="text-xs text-gray-700 font-mono truncate max-w-[120px]">
                    {donation.transactionRef}
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

      {/* Verification Modal */}
      {verifyingDonationId && (
        <>
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Verify Donation
                </h2>
              </div>

              {/* Body */}
              <div className="p-6 space-y-5">
                <p className="text-gray-600 text-sm leading-relaxed">
                  Upload a receipt image and add notes to verify this donation.
                  The donor will receive a confirmation email with the receipt
                  attached.
                </p>

                {/* File Upload Section */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-800">
                    Receipt Image
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            setReceiptImage(event.target?.result);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="hidden"
                      id="receipt-upload"
                    />
                    <label
                      htmlFor="receipt-upload"
                      className="flex flex-col items-center justify-center cursor-pointer border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-green-500 hover:bg-green-50 transition-all group"
                    >
                      {receiptImage ? (
                        <div className="text-center space-y-2">
                          <img
                            src={receiptImage}
                            alt="Receipt preview"
                            className="max-h-32 mx-auto rounded-lg shadow-sm"
                          />
                          <p className="text-sm font-medium text-green-600 flex items-center justify-center gap-1">
                            <svg
                              className="w-4 h-4"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Image selected
                          </p>
                        </div>
                      ) : (
                        <div className="text-center space-y-2">
                          <svg
                            className="w-8 h-8 text-gray-400 mx-auto group-hover:text-green-500 transition-colors"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                          <p className="text-sm font-medium text-gray-700">
                            Click to upload receipt
                          </p>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, or GIF (max 10MB)
                          </p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                {/* Notes Section */}
                <div className="space-y-3">
                  <label
                    htmlFor="notes"
                    className="block text-sm font-semibold text-gray-800"
                  >
                    Verification Notes{" "}
                    <span className="text-gray-400 font-normal">
                      (Optional)
                    </span>
                  </label>
                  <textarea
                    id="notes"
                    value={verificationNotes || ""}
                    onChange={(e) => setVerificationNotes(e.target.value)}
                    placeholder="Add any notes (e.g., 'Reference verified', 'Amount confirmed', etc.)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all resize-none"
                    rows={3}
                  />
                </div>

                {/* Status Message */}
                {emailStatus && (
                  <div
                    className={`p-3 rounded-lg text-sm flex items-start gap-3 ${
                      emailStatus.includes("Error")
                        ? "bg-red-50 text-red-700 border border-red-200"
                        : "bg-green-50 text-green-700 border border-green-200"
                    }`}
                  >
                    <svg
                      className="w-5 h-5 flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{emailStatus}</span>
                  </div>
                )}
              </div>

              {/* Footer with Buttons */}
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setVerifyingDonationId(null);
                      setReceiptImage(null);
                      setVerificationNotes(null);
                    }}
                    className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      console.log(
                        "Reject button clicked, donationId:",
                        verifyingDonationId
                      );
                      handleRejectDonation(verifyingDonationId);
                    }}
                    className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors text-sm active:scale-95 duration-150"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => {
                      console.log(
                        "Verify button clicked, donationId:",
                        verifyingDonationId
                      );
                      handleVerifyDonation(verifyingDonationId);
                    }}
                    className="flex-1 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors text-sm active:scale-95 duration-150 shadow-md"
                  >
                    Verify
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
