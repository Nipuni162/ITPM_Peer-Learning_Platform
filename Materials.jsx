import { useEffect, useState } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Materials() {
  const [materials, setMaterials] = useState([]);
  const [form, setForm] = useState({
    title: "",
    subject: "",
    file: null,
  });
  const [errors, setErrors] = useState({});
  const { user } = useAuth();

  const fetchMaterials = async () => {
    try {
      const res = await API.get("/materials");
      setMaterials(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to load materials");
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.title.trim()) {
      newErrors.title = "Title is required";
    } else if (form.title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    }

    if (!form.subject.trim()) {
      newErrors.subject = "Subject is required";
    } else if (form.subject.trim().length < 2) {
      newErrors.subject = "Subject must be at least 2 characters";
    }

    if (!form.file) {
      newErrors.file = "Please choose a file";
    } else {
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      ];

      if (!allowedTypes.includes(form.file.type)) {
        newErrors.file = "Only PDF, DOC, DOCX, PPT, or PPTX files are allowed";
      }

      const maxSize = 5 * 1024 * 1024;
      if (form.file.size > maxSize) {
        newErrors.file = "File size must be less than 5MB";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const uploadMaterial = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const data = new FormData();
      data.append("title", form.title.trim());
      data.append("subject", form.subject.trim());
      data.append("file", form.file);

      await API.post("/materials/upload", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setForm({
        title: "",
        subject: "",
        file: null,
      });
      setErrors({});
      await fetchMaterials();
      alert("Material uploaded successfully");
    } catch (error) {
      alert(error.response?.data?.message || "Upload failed");
    }
  };

  const getMaterialLink = (fileUrl) => {
    if (!fileUrl) return "#";

    let normalized = String(fileUrl).replace(/\\/g, "/").trim();

    if (!normalized.startsWith("/")) {
      normalized = `/${normalized}`;
    }

    if (!normalized.startsWith("/uploads/")) {
      normalized = normalized.replace(/^\/?uploads\/?/, "/uploads/");
    }

    return `http://localhost:5000${normalized}`;
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Study Materials</h1>
          <p className="text-sm text-gray-500 mt-1">
            Tutors can upload materials, and students/tutors can view or download them.
          </p>
        </div>

        {/* SUMMARY */}
        <div className="bg-white border border-blue-100 rounded-3xl p-5 shadow-sm mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Materials Library
            </h2>
            <p className="text-sm text-gray-500">
              Browse shared study resources and newly uploaded files
            </p>
          </div>

          <div className="px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium border border-blue-200">
            {materials.length} Material{materials.length !== 1 ? "s" : ""}
          </div>
        </div>

        {/* UPLOAD FORM - TUTOR ONLY */}
        {user?.role === "tutor" && (
          <form
            onSubmit={uploadMaterial}
            className="bg-white border border-blue-100 rounded-3xl p-6 shadow-sm mb-8"
          >
            <div className="mb-5">
              <h2 className="text-xl font-semibold text-gray-900">
                Upload Material
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Share notes, PDFs, slides, and documents with students
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* TITLE */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  placeholder="Enter material title"
                  value={form.title}
                  onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                  }
                  className={`w-full bg-blue-50 border ${
                    errors.title ? "border-red-400" : "border-blue-100"
                  } rounded-2xl px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
                />
                {errors.title && (
                  <p className="text-red-500 text-xs mt-1">{errors.title}</p>
                )}
              </div>

              {/* SUBJECT */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  placeholder="Enter subject"
                  value={form.subject}
                  onChange={(e) =>
                    setForm({ ...form, subject: e.target.value })
                  }
                  className={`w-full bg-blue-50 border ${
                    errors.subject ? "border-red-400" : "border-blue-100"
                  } rounded-2xl px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
                />
                {errors.subject && (
                  <p className="text-red-500 text-xs mt-1">{errors.subject}</p>
                )}
              </div>

              {/* FILE */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Choose File
                </label>
                <input
                  type="file"
                  onChange={(e) =>
                    setForm({ ...form, file: e.target.files[0] || null })
                  }
                  className={`w-full bg-blue-50 border ${
                    errors.file ? "border-red-400" : "border-blue-100"
                  } rounded-2xl px-4 py-3 text-sm text-gray-700 file:mr-3 file:py-2 file:px-4 file:border-0 file:bg-blue-600 file:text-white file:rounded-xl file:cursor-pointer cursor-pointer focus:outline-none`}
                />
                {errors.file && (
                  <p className="text-red-500 text-xs mt-1">{errors.file}</p>
                )}
              </div>
            </div>

            {form.file && !errors.file && (
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm border border-blue-200">
                Selected: {form.file.name}
              </div>
            )}

            <button
              type="submit"
              className="mt-5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-6 py-3 rounded-xl shadow-sm transition"
            >
              Upload Material
            </button>
          </form>
        )}

        {/* MATERIALS GRID */}
        {materials.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {materials.map((m) => {
              const fileLink = getMaterialLink(m.fileUrl);

              return (
                <div
                  key={m._id}
                  className="bg-white border border-blue-100 rounded-3xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition duration-300"
                >
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center text-xl font-bold mb-4">
                    📘
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {m.title || "Untitled Material"}
                  </h3>

                  <p className="text-sm text-gray-500 mb-2">
                    Subject:{" "}
                    <span className="font-medium text-blue-700">
                      {m.subject || "N/A"}
                    </span>
                  </p>

                  {m.uploadedBy?.name && (
                    <p className="text-xs text-gray-500 mb-2">
                      Uploaded by: {m.uploadedBy.name}
                    </p>
                  )}

                  <p className="text-xs text-gray-400 mb-4 break-all">
                    {m.fileUrl || "No file path"}
                  </p>

                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100">
                      Material
                    </span>

                    {m.fileUrl ? (
                      <div className="flex gap-2">
                        <a
                          href={fileLink}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition"
                        >
                          View
                        </a>

                        <a
                          href={fileLink}
                          download
                          className="inline-block bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition"
                        >
                          Download
                        </a>
                      </div>
                    ) : (
                      <span className="text-xs text-red-500 font-medium">
                        Invalid file
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white border border-blue-100 rounded-3xl p-10 text-center shadow-sm">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-2xl font-bold">
              📚
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No materials available
            </h3>
            <p className="text-sm text-gray-500">
              Uploaded materials will appear here once added.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}