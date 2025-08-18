"use client";

import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { userRouter } from "../router/userRouter";
import { UserRequest } from "../schema/userSchema";
import { Loader2 } from "lucide-react";
import api from "../axios/api";
import { useToast } from "../components/toastComponent";

interface Profile {
  email?: string; // base64 or URL
}

export default function ProfilePage({ email }: Profile) {
  const [profile, setProfile] = useState<UserRequest>(Object);
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [fileName, setFileName] = useState<string | undefined>(undefined);

  const [isFetchingImage, setIsFetchingImage] = useState<boolean>(false);
  const [errorGetImage, setErrorGetImage] = useState<string | null>(null);

  const showToast = useToast();

  useEffect(() => {
    const fetchUser = async () => {
      if (!email) return;
      try {
        const user = await userRouter.get(email);
        setProfile(user);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

    fetchUser();
  }, [email]);

  useEffect(() => {
    const getImage = async (pathUrl: string): Promise<{ url: string }> => {
      const link = await userRouter.getImage(pathUrl);
      return link;
    };
    const fetchImage = async () => {
      setIsFetchingImage(true);
      setErrorGetImage(null);

      try {
        if (profile.pathUrl != null) {
          const { url } = await getImage(profile.pathUrl);
          setImageUrl(url);
        }
      } catch (error: any) {
        setErrorGetImage(error.message);
      } finally {
        setIsFetchingImage(false);
      }
    };
    fetchImage();
  }, [profile.pathUrl]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setFileName(file.name);
    if (file) {
      try {
        const result = userRouter.uploadImage(file, profile.email);
      } catch (err) {
        console.error("Upload failed:", err);
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
  });

  const handleSave = async () => {
    const updatedProfile = {
      ...profile,
      pathUrl: `${profile.email}-${fileName}`,
    };

    setProfile(updatedProfile);

    const {message,success} = await userRouter.updateUser(profile);

    if(success){
      showToast({ message: message, type: "success" });
    }
    else{
      showToast({ message: message, type: "error" });
    }
    // TODO: Call API to save changes
  };

  return (
    <>
      {isFetchingImage === false ? (
        <div className="max-w-lg mx-auto p-6 bg-white shadow rounded-lg">
          <h2 className="text-2xl font-bold mb-4">My Profile</h2>

          {/* Profile Picture */}
          <div
            {...getRootProps()}
            className={`w-32 h-32 mx-auto mb-4 border-2 border-dashed rounded-full flex items-center justify-center cursor-pointer ${
              isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
            }`}
          >
            <input {...getInputProps()} />
            {profile.pathUrl ? (
              <img
                src={imageUrl}
                // alt="Profile"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <p className="text-gray-400 text-sm text-center">
                Drag & Drop or Click
              </p>
            )}
          </div>

          {/* Form Fields */}
          <div className="mb-3">
            <label className="block text-sm font-medium">First Name</label>
            <input
              type="text"
              name="firstName"
              value={profile.firstName}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-md"
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={profile.lastName}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-md"
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium">
              Email (read-only)
            </label>
            <input
              type="email"
              name="email"
              value={profile.email}
              readOnly
              className="w-full border px-3 py-2 rounded-md bg-gray-100 cursor-not-allowed"
            />
          </div>

          <button
            onClick={handleSave}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      ) : (
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
      )}
    </>
  );
}
