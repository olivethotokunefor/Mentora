import React, { useState } from "react";
import { motion } from "framer-motion";
import { User, Edit3, Camera, Star, Award, Heart } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";
import "./ProfilePage.css";

export function ProfilePage() {
  const { profile, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: profile?.username || "",
    bio: profile?.bio || "",
    skills_can_help: profile?.skills_can_help || [],
    skills_need_help: profile?.skills_need_help || [],
  });
  const [newSkill, setNewSkill] = useState("");
  const [newNeedHelp, setNewNeedHelp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateProfile(formData);
      setIsEditing(false);
      toast.success("Profile updated! Looking good! ✨");
    } catch (error) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const addSkill = (type) => {
    const skill = type === "can_help" ? newSkill : newNeedHelp;
    if (!skill.trim()) return;

    const fieldName = type === "can_help" ? "skills_can_help" : "skills_need_help";
    const currentSkills = formData[fieldName] || [];

    if (currentSkills.length >= 3) {
      toast.error("Maximum 3 skills allowed!");
      return;
    }

    if (currentSkills.includes(skill)) {
      toast.error("Skill already added!");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [fieldName]: [...currentSkills, skill],
    }));

    if (type === "can_help") {
      setNewSkill("");
    } else {
      setNewNeedHelp("");
    }
  };

  const removeSkill = (type, skill) => {
    const fieldName = type === "can_help" ? "skills_can_help" : "skills_need_help";
    setFormData((prev) => ({
      ...prev,
      [fieldName]: (prev[fieldName] || []).filter((s) => s !== skill),
    }));
  };

  const getPointsLevel = (points) => {
    if (points >= 100) return { level: "Wisdom Master", color: "gold", icon: "👑" };
    if (points >= 50) return { level: "Knowledge Keeper", color: "purple", icon: "🌟" };
    if (points >= 20) return { level: "Helper Friend", color: "green", icon: "🌱" };
    return { level: "New Buddy", color: "gray", icon: "🌿" };
  };

  const pointsLevel = getPointsLevel(profile?.points || 0);

  if (!profile) return null;

  return (
    <div className="profile-page">
      <div className="profile-container">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="profile-header"
        >
          <h1>Your Cozy Corner 🏠</h1>
          <p>This is where your personality shines!</p>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="profile-card"
        >
          <div className="profile-main">
            {/* Avatar */}
            <div className="profile-avatar">
              <motion.div whileHover={{ scale: 1.05 }}>
                <div className="avatar-circle">
                  {profile.avatar_url ? (
                    <img src={profile.avatar_url} alt="Avatar" className="avatar-img" />
                  ) : (
                    <User size={64} color="white" />
                  )}
                </div>
                {isEditing && (
                  <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="avatar-edit-btn"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Camera size={16} />
                  </motion.button>
                )}
              </motion.div>

              {/* Level */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="level-badge"
                style={{ backgroundColor: pointsLevel.color }}
              >
                <span>{pointsLevel.icon}</span>
                {pointsLevel.level}
              </motion.div>
            </div>

            {/* Profile Info */}
            <div className="profile-info">
              {isEditing ? (
                <div className="form-section">
                  <div>
                    <label>What should we call you?</label>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, username: e.target.value }))
                      }
                      placeholder="Your awesome username"
                    />
                  </div>
                  <div>
                    <label>Tell us about yourself! 😊</label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, bio: e.target.value }))
                      }
                      rows={4}
                      placeholder="Share your story, interests, or anything fun!"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <div className="profile-top">
                    <h2>{profile.username}</h2>
                    <motion.button
                      onClick={() => setIsEditing(true)}
                      className="edit-btn"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Edit3 size={16} /> Edit Profile
                    </motion.button>
                  </div>

                  <div className="profile-stats">
                    <div className="stat">
                      <Star size={20} />
                      <span>{profile.points} points</span>
                    </div>
                    <div className="stat">
                      <Heart size={20} />
                      <span>
                        Member since {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                  </div>

                  {profile.bio && <p className="bio">{profile.bio}</p>}
                </div>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="edit-actions">
              <motion.button
                onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    username: profile?.username || "",
                    bio: profile?.bio || "",
                    skills_can_help: profile?.skills_can_help || [],
                    skills_need_help: profile?.skills_need_help || [],
                  });
                }}
                className="cancel-btn"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>

              <motion.button
                onClick={handleSave}
                disabled={loading}
                className="save-btn"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? "Saving..." : "Save Changes ✨"}
              </motion.button>
            </div>
          )}
        </motion.div>

        {/* Skills */}
        <div className="skills-grid">
          {/* Can Help With */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="skills-card help-card"
          >
            <div className="skills-header">
              <Award size={24} />
              <h3>What vibes can you share? ✨</h3>
            </div>
            {isEditing && (
              <div className="skill-input">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="e.g., React, Design thinking..."
                  onKeyPress={(e) => e.key === "Enter" && addSkill("can_help")}
                />
                <button onClick={() => addSkill("can_help")}>Add</button>
              </div>
            )}
            <div className="skills-list">
              {(isEditing ? formData.skills_can_help : profile.skills_can_help || []).map(
                (skill) => (
                  <div key={skill} className="skill-chip">
                    <span>{skill}</span>
                    {isEditing && (
                      <button onClick={() => removeSkill("can_help", skill)}>×</button>
                    )}
                  </div>
                )
              )}
            </div>
          </motion.div>

          {/* Need Help With */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="skills-card need-card"
          >
            <div className="skills-header">
              <Heart size={24} />
              <h3>What would you love to learn? 🌱</h3>
            </div>
            {isEditing && (
              <div className="skill-input">
                <input
                  type="text"
                  value={newNeedHelp}
                  onChange={(e) => setNewNeedHelp(e.target.value)}
                  placeholder="e.g., Python, Public Speaking..."
                  onKeyPress={(e) => e.key === "Enter" && addSkill("need_help")}
                />
                <button onClick={() => addSkill("need_help")}>Add</button>
              </div>
            )}
            <div className="skills-list">
              {(isEditing ? formData.skills_need_help : profile.skills_need_help || []).map(
                (skill) => (
                  <div key={skill} className="skill-chip">
                    <span>{skill}</span>
                    {isEditing && (
                      <button onClick={() => removeSkill("need_help", skill)}>×</button>
                    )}
                  </div>
                )
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
