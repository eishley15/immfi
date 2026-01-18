import { useState } from "react";
import { ChevronDown, ArrowUpDown, X, Printer } from "lucide-react";

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

const volunteerSortOptions = [
  { value: null, label: "Default" },
  { value: "name-asc", label: "Name (A → Z)" },
  { value: "name-desc", label: "Name (Z → A)" },
  { value: "availability-weekdays", label: "Weekdays" },
  { value: "availability-weekends", label: "Weekends" },
  { value: "status-pending", label: "Pending" },
  { value: "status-approved", label: "Approved" },
];

export default function VolunteersSection({
  volunteers,
  volunteerSort,
  setVolunteerSort,
  handleApprove,
  getSortedVolunteers,
  handlePrintVolunteers,
}) {
  const clearSort = () => setVolunteerSort(null);

  return (
    <div className="space-y-6">
      {/* Sort Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col sm:flex-row sm:items-end gap-4">
        <div className="w-full sm:w-auto">
          <SortDropdown
            label="Sort by"
            options={volunteerSortOptions}
            value={volunteerSort}
            onChange={setVolunteerSort}
          />
        </div>

        <div className="w-full sm:w-auto sm:ml-auto">
          <label className="block text-xs font-medium text-gray-500 mb-1 invisible">
            Action
          </label>
          <button
            onClick={handlePrintVolunteers}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-green-50 hover:border-green-400 hover:text-green-700 transition-all w-full sm:w-auto"
          >
            <Printer size={16} />
            <span>Print Report</span>
          </button>
        </div>

        {volunteerSort && (
          <button
            onClick={clearSort}
            className="px-3 py-2 text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors whitespace-nowrap"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Active Filters */}
      {volunteerSort && (
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-gray-500 mr-1 self-center">
            Active:
          </span>
          <FilterChip
            label={
              volunteerSortOptions.find((o) => o.value === volunteerSort)?.label
            }
            onClear={() => setVolunteerSort(null)}
          />
        </div>
      )}

      {/* Table */}
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
                  <span className="ml-1 text-gray-900">{volunteer.skills}</span>
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
    </div>
  );
}
