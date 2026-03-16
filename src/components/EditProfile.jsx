import { useEffect, useMemo, useState } from "react";
import UserCard from "./UserCard";
import axios from "axios";
import { BASE_URL, DEFAULT_PHOTO } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";

const EditProfile = ({ user }) => {
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    age: user.age || "",
    gender: user.gender || "",
    about: user.about || "",
    skills: user.skills?.join(", ") || "",
    github: user.github || "",
    portfolio: user.portfolio || "",
    photos: user.photos || [""],
  });

  const [previewForm, setPreviewForm] = useState(form);
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPreviewForm(form);
    }, 1000);

    return () => clearTimeout(timer);
  }, [form]);

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updatePhoto = (index, value) => {
    setForm((prev) => {
      const updated = [...prev.photos];
      updated[index] = value;

      return { ...prev, photos: updated };
    });
  };

  const addPhoto = () => {
    setForm((prev) => {
      if (prev.photos.length >= 5) return prev;

      return {
        ...prev,
        photos: [...prev.photos, ""],
      };
    });
  };

  const removePhoto = (index) => {
    setForm((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const saveProfile = async () => {
    try {
      setError("");

      const payload = {
        ...form,
        skills: form.skills.split(",").map((s) => s.trim()),
      };

      const res = await axios.patch(BASE_URL + "/profile/edit", payload, {
        withCredentials: true,
      });

      dispatch(addUser(res.data.data));

      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      setError(err.response?.data);
    }
  };

  const previewUser = useMemo(() => {
    return {
      ...previewForm,
      photos: previewForm.photos.length ? previewForm.photos : [DEFAULT_PHOTO],
      skills: previewForm.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };
  }, [previewForm]);

  if (!user) return null;

  return (
    <>
      <div className="max-w-6xl mx-auto sm:px-4 py-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-start overflow-x-hidden">
        {/* FORM */}
        <div className="w-full bg-white border border-gray-200 text-gray-600 rounded-2xl shadow-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Edit Profile</h2>

          {/* Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              value={form.firstName}
              onChange={(e) => updateField("firstName", e.target.value)}
              placeholder="First name"
              className="form-input"
            />
            <input
              value={form.lastName}
              onChange={(e) => updateField("lastName", e.target.value)}
              placeholder="Last name"
              className="form-input"
            />
          </div>

          {/* Age + Gender */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              value={form.age}
              onChange={(e) => updateField("age", e.target.value)}
              placeholder="Age"
              className="form-input"
            />
            <select
              value={form.gender}
              onChange={(e) => updateField("gender", e.target.value)}
              className="form-input"
            >
              <option value="">Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="others">Others</option>
            </select>
          </div>

          {/* About */}
          <textarea
            value={form.about}
            onChange={(e) => updateField("about", e.target.value)}
            placeholder="About you"
            className="form-input h-20"
          />

          {/* Skills */}
          <input
            value={form.skills}
            onChange={(e) => updateField("skills", e.target.value)}
            placeholder="Skills (React, Node, MongoDB)"
            className="form-input"
          />

          {/* Links */}
          <input
            value={form.github}
            onChange={(e) => updateField("github", e.target.value)}
            placeholder="GitHub URL"
            className="form-input"
          />

          <input
            value={form.portfolio}
            onChange={(e) => updateField("portfolio", e.target.value)}
            placeholder="Portfolio URL"
            className="form-input"
          />

          {/* Photos */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Photos</p>

            {form.photos.map((photo, i) => (
              <div key={i} className="flex gap-2 items-center">
                <img
                  src={photo || DEFAULT_PHOTO}
                  alt="preview"
                  loading="lazy"
                  className="w-14 h-14 rounded-lg object-cover border"
                />
                <input
                  value={photo}
                  onChange={(e) => updatePhoto(i, e.target.value)}
                  placeholder="Photo URL"
                  className="form-input flex-1 truncate"
                />
                <button
                  onClick={() => removePhoto(i)}
                  className="w-9 h-9 flex items-center justify-center bg-red-500 text-white rounded-lg shrink-0"
                >
                  ✕
                </button>
              </div>
            ))}

            {form.photos.length < 5 && (
              <button onClick={addPhoto} className="text-sm text-pink-600">
                + Add photo
              </button>
            )}
          </div>

          {error && (
            <p className="text-red-500 text-sm overflow-auto">{error}</p>
          )}

          <button
            onClick={saveProfile}
            className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-2 rounded-lg"
          >
            Save Profile
          </button>
        </div>

        {/* PREVIEW */}
        <div className="flex justify-center lg:sticky">
          <UserCard user={previewUser} />
        </div>
      </div>

      {showToast && (
        <div className="fixed bottom-6 right-6 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          Profile updated successfully
        </div>
      )}
    </>
  );
};

export default EditProfile;
