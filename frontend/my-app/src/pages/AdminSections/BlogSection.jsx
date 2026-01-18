import { getImageUrl } from "../../config/api";

export default function BlogSection({
  blogPost,
  setBlogPost,
  blogPosts,
  uploadStatus,
  isEditing,
  setIsEditing,
  editingPost,
  setEditingPost,
  handleBlogSubmit,
  handleEditSubmit,
  handleEditClick,
  handleDeletePost,
}) {
  return (
    <div className="mt-2 space-y-6">
      {/* Create/Edit Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Facebook Post URL (Optional)
            </label>
            <input
              type="url"
              value={blogPost.facebookUrl || ""}
              onChange={(e) =>
                setBlogPost((prev) => ({
                  ...prev,
                  facebookUrl: e.target.value,
                }))
              }
              className="w-full p-2.5 border border-gray-200 rounded-lg focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all text-sm"
              placeholder="https://facebook.com/..."
            />
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
                    facebookUrl: "",
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

      {/* Blog Posts Grid */}
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
  );
}
