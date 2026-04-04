import { useState, useRef, useEffect } from "react";
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
import { useAuthStore } from "../store/useAuthStore";

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

  const { authUser} = useAuthStore();

  useEffect(() => {
    console.log("profile_pic after this is :", authUser?.profile_pic);
  }, [authUser]);

  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-8 text-gray-100">
      <div className="max-w-5xl mx-auto bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
        {/* Header Banner */}
        <div className="h-40 bg-gradient-to-r from-red-600 to-black"></div>

        <div className="px-8 pb-8">
          <div className="relative flex flex-col md:flex-row md:items-end -mt-16 mb-8 gap-6">
            {/* Profile Picture */}
            <div className="relative group mx-auto md:mx-0">
              <div className="w-32 h-32 rounded-full border-4 border-gray-900 shadow-lg overflow-hidden bg-gray-700">
                <img
                  src={authUser?.profile_pic || profilePic}
                  alt="profile"
                  onError={(e) => {
                    e.target.src = profilePic;
                  }}
                  className={`w-full h-full object-cover transition-opacity ${
                    isUploading ? "opacity-50" : "opacity-100"
                  }`}
                />
              </div>

              {/* Overlay Trigger */}
              <button
                onClick={() => fileInputRef.current.click()}
                disabled={isUploading}
                className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
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

            {/* Name and Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-white">
                {authUser?.name}
              </h1>
              <p className="text-red-400 font-medium">Senior Manager</p>
            </div>

            <div className="flex gap-2">
              <button className="px-5 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors shadow-sm">
                Edit Profile
              </button>
            </div>
          </div>

          <hr className="border-gray-700 my-8" />

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-sm tracking-wider text-gray-400 font-bold mb-4">
                CONTACT INFORMATION
              </h2>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-500" />{" "}
                  jane.smith@company.com
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gray-500" /> +91 9876543210
                </li>
                <li className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-gray-500" /> New Delhi, India
                </li>
                <li className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-gray-500" /> www.company.com
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-sm tracking-wider text-gray-400 font-bold mb-4">
                ACCOUNT DETAILS
              </h2>
              <div className="bg-gray-700 rounded-xl p-5 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm flex items-center gap-2">
                    <Shield className="w-4 h-4" /> Role
                  </span>
                  <span className="font-semibold text-gray-200">Manager</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Status</span>
                  <span className="px-2 py-1 bg-green-700 text-green-100 text-xs font-bold rounded-full">
                    ACTIVE
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Joined
                  </span>
                  <span className="font-medium text-gray-200">
                    Jan 15, 2024
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Section */}
          <div className="mt-12">
            <h2 className="text-sm tracking-wider text-gray-400 font-bold mb-6">
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
                  className="group p-4 border border-gray-700 rounded-xl hover:border-red-500 hover:bg-gray-700 transition-all cursor-default"
                >
                  <p className="text-gray-200 font-semibold group-hover:text-red-400 transition-colors">
                    {activity.title}
                  </p>
                  <p className="text-gray-500 text-sm uppercase tracking-tighter mt-1">
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
