"use client";

import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { userRouter } from "../../router/userRouter";
import { UserRequest } from "../../schema/userSchema";
import { Loader2 } from "lucide-react";
import api from "../../axios/api";
import { useToast } from "../toastComponent";
import { profileType } from "../../type/profileType";
import { useRouter } from "next/navigation";

interface ProfileInterface {
  email?: string;
  type: profileType;
}

export default function ProfileForm({ email, type }: ProfileInterface) {
  const [profile, setProfile] = useState<UserRequest>(Object);
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [fileName, setFileName] = useState<string | undefined>(undefined);
  const [imageFile, setImageFile] = useState<File>();

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

  console.log("Profile:", profile);

  useEffect(() => {
    const getImage = async (pathUrl: string): Promise<{ url: string }> => {
      const link = await userRouter.getImage(pathUrl);
      return link;
    };
    const fetchImage = async () => {
      setIsFetchingImage(true);
      setErrorGetImage(null);
      try {
        if (profile.pathUrl != undefined) {
          console.log("profile.pathUrl:", profile.pathUrl);
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

  const onDrop = async (acceptedFiles: File[]) => {
    let file = acceptedFiles[0];

    setFileName(file.name);

    if ((file as any).handle) {
      try {
        const handle = (file as any).handle;
        file = await handle.getFile();
      } catch (err) {
        console.error("Failed to convert FileSystemFileHandle:", err);
      }
    }

    setImageFile(file);
  };

  useEffect(() => {
    console.log("imageFile changed:", imageFile);
  }, [imageFile]);

  const router = useRouter();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
  });

  const handleLogout = () => {
    router.push("/")
  };

  const handleSave = async () => {
    const updatedProfile = {
      ...profile,
      pathUrl: `${profile.email}-${fileName}`,
    };

    if (imageFile) {
      const result = userRouter.uploadImage(imageFile, profile.email);
    }

    if(fileName){
      setProfile(updatedProfile);
    }

    try {
      const action =
        type === "create" ? userRouter.createUser : userRouter.updateUser;

      const { message, success } = await action(updatedProfile);

      showToast({
        message,
        type: success ? "success" : "error",
      });

      router.push(`/edit?email=${profile.email}`);
    } catch (err: any) {
      showToast({
        message: err.message || "Something went wrong",
        type: "error",
      });
    }
  };

  return (
    <>
      {isFetchingImage === false ? (
        <div className="max-w-lg mx-auto p-6 bg-white shadow rounded-lg mt-15">
          <h2 className="text-2xl flex justify-center font-bold mb-4">
            {profile.firstName != null ? (
              <div>{"Welcome " + profile.firstName}</div>
            ) : (
              <div>Create profile</div>
            )}
          </h2>

          {/* Profile Picture */}
          <div
            {...getRootProps({
              className: `relative w-32 h-32 mx-auto mb-4 border-2 rounded-full 
                            flex items-center justify-center cursor-pointer
                            ${
                              isDragActive
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-300"
                            }`,
            })}
          >
            <input {...getInputProps()} />

            {profile.pathUrl ? (
              <img
                src={imageUrl}
                className="w-full h-full object-cover rounded-full"
              />
            ) : imageFile != null ? (
              <img
                src={URL.createObjectURL(imageFile)}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <p className="text-gray-400 text-sm text-center">
                Drag & Drop or Click
              </p>
            )}

            <div className="absolute inset-0 bg-black/30 bg-op text-white text-sm flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-full p-2">
              Drop a file or click to update
            </div>
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
              Email {type === "update" && "(read-only)"}
            </label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              readOnly={type == "create" ? false : true}
              className={`w-full border px-3 py-2 rounded-md  ${
                type == "update" ? "cursor-not-allowed bg-gray-100" : ""
              } `}
            />
          </div>

          {type == "create" && (
            <div className="mb-3">
              <label className="block text-sm font-medium">Password</label>
              <input
                type="text"
                name="password"
                value={profile.password}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-md"
              />
            </div>
          )}

          <div className="flex">
            <div className="ml-auto">
              <button
                onClick={handleSave}
                className="w-35 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 shadow-md mr-3"
              >
                Save Changes
              </button>
              {type == "update" && (
                <button
                  onClick={handleLogout}
                  className="w-35 bg-red-600 text-white py-2 rounded-md hover:bg-red-700 shadow-md"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
      )}
    </>
  );
}
