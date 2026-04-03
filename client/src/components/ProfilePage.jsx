import { useState, useRef } from "react";
import axios from "axios";
import { api } from "../api/notesApi";
import {
  Camera,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Globe,
  Calendar,
  Shield,
} from "lucide-react";

export default function ProfilePage() {
  const [profilePic, setProfilePic] = useState(
    "https://via.placeholder.com/120",
  );
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsUploading(true);

      // 1. Get signed url from your server
      const { data } = await api.get("/users/get-signed-url");
      console.log("Received signed URL data:", data);

      // 2. Upload directly to cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("timestamp", data.timestamp);
      formData.append("signature", data.signature);
      formData.append("api_key", data.api_key);
      formData.append("folder", data.folder);
      formData.append("public_id", data.public_id);

      const cloudinaryRes = await axios.post(
        `https://api.cloudinary.com/v1_1/${data.cloudname}/image/upload`,
        formData,
      );

      const newUrl = cloudinaryRes.data.secure_url;

      // 3. Save the URL in your DB
      await api.put("/users/update-profile", {
        profilePicture: newUrl,
      });

      // Update local state to reflect change immediately
      setProfilePic(newUrl);
      alert("Profile picture updated successfully!");
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header/Banner Area */}
        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700"></div>

        <div className="px-8 pb-8">
          <div className="relative flex flex-col md:flex-row md:items-end -mt-12 mb-6 gap-6">
            {/* Profile Picture Upload Section */}
            <div className="relative group mx-auto md:mx-0">
              <div className="w-32 h-32 rounded-full border-4 border-white shadow-md overflow-hidden bg-gray-200">
                <img
                  src={profilePic}
                  alt="profile"
                  className={`w-full h-full object-cover transition-opacity ${isUploading ? "opacity-50" : "opacity-100"}`}
                />
              </div>

              {/* Overlay Trigger */}
              <button
                onClick={() => fileInputRef.current.click()}
                disabled={isUploading}
                className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
              >
                {isUploading ? (
                  <Loader2 className="w-8 h-8 animate-spin" />
                ) : (
                  <>
                    <Camera className="w-6 h-6 mb-1" />
                    <span className="text-xs font-medium">Change</span>
                  </>
                )}
              </button>

              {/* Hidden File Input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleUpload}
                className="hidden"
                accept="image/*"
              />
            </div>

            {/* Name and Basic Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900">Jane Smith</h1>
              <p className="text-blue-600 font-medium">Senior Manager</p>
            </div>

            <div className="flex gap-2">
              <button className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                Edit Profile
              </button>
            </div>
          </div>

          <hr className="border-gray-100 my-8" />

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-sm font-uppercase tracking-wider text-gray-400 font-bold mb-4 flex items-center gap-2">
                CONTACT INFORMATION
              </h2>
              <ul className="space-y-4">
                <li className="flex items-center text-gray-600 gap-3">
                  <Mail className="w-4 h-4 text-gray-400" />{" "}
                  jane.smith@company.com
                </li>
                <li className="flex items-center text-gray-600 gap-3">
                  <Phone className="w-4 h-4 text-gray-400" /> +91 9876543210
                </li>
                <li className="flex items-center text-gray-600 gap-3">
                  <MapPin className="w-4 h-4 text-gray-400" /> New Delhi, India
                </li>
                <li className="flex items-center text-gray-600 gap-3">
                  <Globe className="w-4 h-4 text-gray-400" /> www.company.com
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-sm font-uppercase tracking-wider text-gray-400 font-bold mb-4 flex items-center gap-2">
                ACCOUNT DETAILS
              </h2>
              <div className="bg-gray-50 rounded-xl p-5 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm flex items-center gap-2">
                    <Shield className="w-4 h-4" /> Role
                  </span>
                  <span className="font-semibold text-gray-700">Manager</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">Status</span>
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                    ACTIVE
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Joined
                  </span>
                  <span className="font-medium text-gray-700">
                    Jan 15, 2024
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Section */}
          <div className="mt-12">
            <h2 className="text-sm font-uppercase tracking-wider text-gray-400 font-bold mb-6">
              RECENT ACTIVITY
            </h2>
            <div className="space-y-3">
              {[
                { title: "Followed up with Client A", date: "Mar 28, 2026" },
                { title: "Closed Deal with Client B", date: "Mar 25, 2026" },
                { title: "Updated CRM notes", date: "Mar 20, 2026" },
              ].map((activity, idx) => (
                <div
                  key={idx}
                  className="group p-4 border border-gray-100 rounded-xl hover:border-blue-200 hover:bg-blue-50 transition-all cursor-default"
                >
                  <p className="text-gray-800 font-semibold group-hover:text-blue-700 transition-colors">
                    {activity.title}
                  </p>
                  <p className="text-gray-400 text-sm uppercase tracking-tighter mt-1">
                    {activity.date}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
