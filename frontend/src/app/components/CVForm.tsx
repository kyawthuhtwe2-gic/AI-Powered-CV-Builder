import {
  CVData,
  Experience,
  Education,
  Project,
} from "../context/CVContext";
import { Plus, Trash2, Upload, X } from "lucide-react";
import { useState, useRef } from "react";

interface CVFormProps {
  cvData: CVData;
  onChange: (cvData: CVData) => void;
  onSave?: () => void;
  onCancel?: () => void;
}

export default function CVForm({
  cvData,
  onChange,
  onSave,
  onCancel,
}: CVFormProps) {
  const [dragActive, setDragActive] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addSkill = (skill: string) => {
    const trimmedSkill = skill.trim();
    if (trimmedSkill && !cvData.skills.includes(trimmedSkill)) {
      onChange({
        ...cvData,
        skills: [...cvData.skills, trimmedSkill],
      });
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    onChange({
      ...cvData,
      skills: cvData.skills.filter((s) => s !== skillToRemove),
    });
  };

  const handleSkillKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill(skillInput);
    }
  };

  const updatePersonalInfo = (field: string, value: string) => {
    onChange({
      ...cvData,
      personalInfo: { ...cvData.personalInfo, [field]: value },
    });
  };

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      updatePersonalInfo(
        "profileImage",
        e.target?.result as string,
      );
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files[0]);
    }
  };

  const addExperience = () => {
    onChange({
      ...cvData,
      experience: [
        ...cvData.experience,
        {
          id: Math.random().toString(36).substr(2, 9),
          company: "",
          position: "",
          startDate: "",
          endDate: "",
          description: "",
        },
      ],
    });
  };

  const updateExperience = (
    id: string,
    field: keyof Experience,
    value: string,
  ) => {
    onChange({
      ...cvData,
      experience: cvData.experience.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp,
      ),
    });
  };

  const removeExperience = (id: string) => {
    onChange({
      ...cvData,
      experience: cvData.experience.filter(
        (exp) => exp.id !== id,
      ),
    });
  };

  const addEducation = () => {
    onChange({
      ...cvData,
      education: [
        ...cvData.education,
        {
          id: Math.random().toString(36).substr(2, 9),
          school: "",
          degree: "",
          field: "",
          startDate: "",
          endDate: "",
        },
      ],
    });
  };

  const updateEducation = (
    id: string,
    field: keyof Education,
    value: string,
  ) => {
    onChange({
      ...cvData,
      education: cvData.education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu,
      ),
    });
  };

  const removeEducation = (id: string) => {
    onChange({
      ...cvData,
      education: cvData.education.filter(
        (edu) => edu.id !== id,
      ),
    });
  };

  const addProject = () => {
    onChange({
      ...cvData,
      projects: [
        ...cvData.projects,
        {
          id: Math.random().toString(36).substr(2, 9),
          name: "",
          description: "",
          technologies: "",
          link: "",
        },
      ],
    });
  };

  const updateProject = (
    id: string,
    field: keyof Project,
    value: string,
  ) => {
    onChange({
      ...cvData,
      projects: cvData.projects.map((proj) =>
        proj.id === id ? { ...proj, [field]: value } : proj,
      ),
    });
  };

  const removeProject = (id: string) => {
    onChange({
      ...cvData,
      projects: cvData.projects.filter(
        (proj) => proj.id !== id,
      ),
    });
  };

  return (
    <div className="space-y-8">
      <section>
        <div
          className={`mb-4 border-2 border-dashed rounded-xl p-6 text-center transition-colors ${dragActive
            ? "border-[#2563EB] bg-blue-50 dark:bg-blue-900/20"
            : "border-gray-300 dark:border-gray-600"
            }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {cvData.personalInfo.profileImage ? (
            <div className="relative inline-block">
              <img
                src={cvData.personalInfo.profileImage}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover mx-auto"
              />
              <button
                onClick={() =>
                  updatePersonalInfo("profileImage", "")
                }
                className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div>
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                Drag & drop your profile image here
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-[#2563EB] hover:underline"
              >
                or click to browse
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) =>
                  e.target.files?.[0] &&
                  handleImageUpload(e.target.files[0])
                }
                className="hidden"
              />
            </div>
          )}
        </div>

        <div className="space-y-4">
          <Input
            label="Full Name"
            value={cvData.personalInfo.fullName}
            onChange={(e) =>
              updatePersonalInfo("fullName", e.target.value)
            }
          />
          <Input
            label="Email"
            type="email"
            value={cvData.personalInfo.email}
            onChange={(e) =>
              updatePersonalInfo("email", e.target.value)
            }
          />
          <Input
            label="Phone"
            type="tel"
            value={cvData.personalInfo.phone}
            onChange={(e) =>
              updatePersonalInfo("phone", e.target.value)
            }
          />
          <Input
            label="Location"
            value={cvData.personalInfo.location}
            onChange={(e) =>
              updatePersonalInfo("location", e.target.value)
            }
          />
          <TextArea
            label="Professional Summary"
            value={cvData.personalInfo.summary}
            onChange={(e) =>
              updatePersonalInfo("summary", e.target.value)
            }
            rows={4}
          />
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Experience
          </h3>
          <button
            onClick={addExperience}
            className="flex items-center text-black gap-1 px-4 py-2 bg-gray-200 dark:bg-gray-400 dark:hover:bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm font-medium">Add</span>
          </button>
        </div>
        <div className="space-y-4">
          {cvData.experience.map((exp) => (
            <div
              key={exp.id}
              className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div className="flex justify-between mb-3">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  Work Experience
                </h4>
                <button
                  onClick={() => removeExperience(exp.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3">
                <Input
                  label="Company"
                  value={exp.company}
                  onChange={(e) =>
                    updateExperience(
                      exp.id,
                      "company",
                      e.target.value,
                    )
                  }
                />
                <Input
                  label="Position"
                  value={exp.position}
                  onChange={(e) =>
                    updateExperience(
                      exp.id,
                      "position",
                      e.target.value,
                    )
                  }
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Start Date"
                    type="month"
                    value={exp.startDate}
                    onChange={(e) =>
                      updateExperience(
                        exp.id,
                        "startDate",
                        e.target.value,
                      )
                    }
                  />
                  <Input
                    label="End Date"
                    type="month"
                    value={exp.endDate}
                    onChange={(e) =>
                      updateExperience(
                        exp.id,
                        "endDate",
                        e.target.value,
                      )
                    }
                  />
                </div>
                <TextArea
                  label="Description"
                  value={exp.description}
                  onChange={(e) =>
                    updateExperience(
                      exp.id,
                      "description",
                      e.target.value,
                    )
                  }
                  rows={3}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Education
          </h3>
          <button
            onClick={addEducation}
            className="flex items-center text-black gap-1 px-4 py-2 bg-gray-200 dark:bg-gray-400 dark:hover:bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm font-medium">Add</span>
          </button>
        </div>
        <div className="space-y-4">
          {cvData.education.map((edu) => (
            <div
              key={edu.id}
              className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div className="flex justify-between mb-3">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  Education
                </h4>
                <button
                  onClick={() => removeEducation(edu.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3">
                <Input
                  label="School"
                  value={edu.school}
                  onChange={(e) =>
                    updateEducation(
                      edu.id,
                      "school",
                      e.target.value,
                    )
                  }
                />
                <Input
                  label="Degree"
                  value={edu.degree}
                  onChange={(e) =>
                    updateEducation(
                      edu.id,
                      "degree",
                      e.target.value,
                    )
                  }
                />
                <Input
                  label="Field of Study"
                  value={edu.field}
                  onChange={(e) =>
                    updateEducation(
                      edu.id,
                      "field",
                      e.target.value,
                    )
                  }
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Start Date"
                    type="month"
                    value={edu.startDate}
                    onChange={(e) =>
                      updateEducation(
                        edu.id,
                        "startDate",
                        e.target.value,
                      )
                    }
                  />
                  <Input
                    label="End Date"
                    type="month"
                    value={edu.endDate}
                    onChange={(e) =>
                      updateEducation(
                        edu.id,
                        "endDate",
                        e.target.value,
                      )
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Projects
          </h3>
          <button
            onClick={addProject}
            className="flex items-center text-black gap-1 px-4 py-2 bg-gray-200 dark:bg-gray-400 dark:hover:bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm font-medium">Add</span>
          </button>

        </div>
        <div className="space-y-4">
          {cvData.projects.map((proj) => (
            <div
              key={proj.id}
              className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div className="flex justify-between mb-3">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  Project
                </h4>
                <button
                  onClick={() => removeProject(proj.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3">
                <Input
                  label="Project Name"
                  value={proj.name}
                  onChange={(e) =>
                    updateProject(
                      proj.id,
                      "name",
                      e.target.value,
                    )
                  }
                />
                <TextArea
                  label="Description"
                  value={proj.description}
                  onChange={(e) =>
                    updateProject(
                      proj.id,
                      "description",
                      e.target.value,
                    )
                  }
                  rows={2}
                />
                <Input
                  label="Technologies Used"
                  value={proj.technologies}
                  onChange={(e) =>
                    updateProject(
                      proj.id,
                      "technologies",
                      e.target.value,
                    )
                  }
                />
                <Input
                  label="Project Link (optional)"
                  type="url"
                  value={proj.link}
                  onChange={(e) =>
                    updateProject(
                      proj.id,
                      "link",
                      e.target.value,
                    )
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Skills
        </h3>

        <div className="space-y-4">
          <div>
            <div className="flex gap-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleSkillKeyDown}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                placeholder="Type a skill"
              />
              <button
                type="button"
                onClick={() => addSkill(skillInput)}
                className="flex items-center text-black gap-1 px-4 py-2 bg-gray-200 dark:bg-gray-400 dark:hover:bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm font-medium">Add</span>
              </button>
            </div>
          </div>

          {cvData.skills.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Your Skills (Click to remove)
              </label>
              <div className="flex flex-wrap gap-2">
                {cvData.skills.map((skill, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-full text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors cursor-pointer group"
                    title="Click to remove"
                  >
                    {skill}
                    <X className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {(onSave || onCancel) && (
          <div className="flex justify-center gap-6 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            {onCancel && (
              <button
                type="button"
                onClick={() => {
                  onChange({
                    ...cvData,
                    personalInfo: {
                      fullName: '',
                      email: '',
                      phone: '',
                      location: '',
                      summary: '',
                      profileImage: '',
                    },
                    experience: [],
                    education: [],
                    projects: [],
                    skills: [],
                  });
                }}
                className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
              >
                Cancel
              </button>
            )}
            {onSave && (
              <button
                type="button"
                onClick={onSave}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Save
              </button>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
      />
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
  rows,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows: number;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      <textarea
        value={value}
        onChange={onChange}
        rows={rows}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#2563EB] focus:border-transparent resize-none"
      />
    </div>
  );
}