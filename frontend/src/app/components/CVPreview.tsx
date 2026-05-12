import { CVData } from "../context/CVContext";
import { forwardRef, useEffect, useRef, useState } from "react";

interface CVPreviewProps {
  cvData: CVData;
  isExport?: boolean;
  /** If true (default), scale the live preview to fit container width */
  fitToWidth?: boolean;
}

const CVPreview = forwardRef<HTMLDivElement, CVPreviewProps>(
  ({ cvData, isExport = false, fitToWidth = true }, ref) => {
    const templates: Record<
      string,
      React.ComponentType<{ cvData: CVData }>
    > = {
      modern: ModernTemplate,
      minimal: MinimalTemplate,
      corporate: CorporateTemplate,
      creative: CreativeTemplate,
    };

    const TemplateComponent =
      templates[cvData.templateId] || ModernTemplate;

    // For export, render template directly without wrapper/transform
    if (isExport) {
      return (
        <div
          ref={ref}
          data-cv-preview
          style={{
            colorScheme: "light",
          }}
        >
          <TemplateComponent cvData={cvData} />
        </div>
      );
    }

    // For live preview, include wrapper that scales the fixed-size template to fit the container
    const BASE_WIDTH = 794; // approx px for 210mm at 96dpi
    const BASE_HEIGHT = 1123; // approx px for 297mm at 96dpi

    const containerRef = useRef<HTMLDivElement | null>(null);
    const [scale, setScale] = useState<number>(1);

    useEffect(() => {
      if (!fitToWidth) return;
      const el = containerRef.current;
      if (!el) return;

      const update = (w: number) => {
        const newScale = Math.min(1, w / BASE_WIDTH);
        setScale(newScale);
      };

      // initial
      update(el.clientWidth || el.getBoundingClientRect().width || BASE_WIDTH);

      const ro = new ResizeObserver((entries) => {
        for (const entry of entries) {
          update(entry.contentRect.width);
        }
      });
      ro.observe(el);
      return () => ro.disconnect();
    }, [fitToWidth]);

    return (
      <div className="flex items-start justify-center rounded-lg">
        <div
          ref={containerRef}
          className="w-full max-w-full max-h-[calc(100vh-6rem)] md:max-h-none overflow-auto md:overflow-visible"
        >
          <div
            data-cv-preview
            style={{
              colorScheme: "light",
              width: BASE_WIDTH,
              height: BASE_HEIGHT,
              transform: `scale(${scale})`,
              transformOrigin: 'top center',
              margin: '0 auto',
              borderRadius: '20px'
            }}
          >
            <TemplateComponent cvData={cvData} />
          </div>
        </div>
      </div>
    );
  },
);

CVPreview.displayName = "CVPreview";

export default CVPreview;

function ModernTemplate({ cvData }: { cvData: CVData }) {
  return (
    <div className="w-[210mm] h-[297mm] bg-white p-8 shadow-lg">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white mb-6">
        <div className="flex items-center gap-4">
          {cvData.personalInfo.profileImage && (
            <img
              src={cvData.personalInfo.profileImage}
              alt="Profile"
              className="w-20 h-20 bg-white/30 rounded-full object-cover"
            />
          )}
          <div>
            <h1 className="text-2xl font-semibold">
              {cvData.personalInfo.fullName || "Your Name"}
            </h1>
            <div className="text-sm text-white/90">
              <div>{cvData.personalInfo.email}</div>
              <div>{cvData.personalInfo.phone}</div>
              <div>{cvData.personalInfo.location}</div>
            </div>
          </div>
        </div>
      </div>

      {cvData.personalInfo.summary && (
        <div className="bg-blue-50 rounded-lg p-4 mb-4">
          <div className="w-24 h-5 bg-blue-600 rounded mb-3"></div>
          <div className="space-y-2">
            <p className="text-gray-700 leading-relaxed">
              {cvData.personalInfo.summary}
            </p>
          </div>
        </div>
      )}

      {cvData.experience.length > 0 && (
        <div className="bg-blue-50 rounded-lg p-4 mb-4">
          <div className="w-24 h-5 bg-blue-600 rounded mb-3"></div>
          <div className="space-y-2">
            {cvData.experience.map((exp) => (
              <div key={exp.id} className="bg-white rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {exp.position}
                </h3>
                <p className="text-blue-600 font-medium">
                  {exp.company}
                </p>
                <p className="text-sm text-gray-500 mb-2">
                  {exp.startDate} - {exp.endDate || "Present"}
                </p>
                <p className="text-gray-700">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {cvData.education.length > 0 && (
        <div className="bg-blue-50 rounded-lg p-4 mb-4">
          <div className="w-24 h-5 bg-blue-600 rounded mb-3"></div>
          <div className="space-y-2">
            {cvData.education.map((edu) => (
              <div key={edu.id} className="bg-white rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {edu.degree} in {edu.field}
                </h3>
                <p className="text-blue-600 font-medium">{edu.school}</p>
                <p className="text-sm text-gray-500">
                  {edu.startDate} - {edu.endDate || "Present"}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {cvData.projects.length > 0 && (
        <div className="bg-blue-50 rounded-lg p-4 mb-4">
          <div className="w-24 h-5 bg-blue-600 rounded mb-3"></div>
          <div className="space-y-2">
            {cvData.projects.map((proj) => (
              <div key={proj.id} className="bg-white rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900">{proj.name}</h3>
                <p className="text-gray-700 mb-2">{proj.description}</p>
                <p className="text-sm text-blue-600">{proj.technologies}</p>
                {proj.link && (
                  <a href={proj.link} className="text-sm text-blue-500 hover:underline">
                    {proj.link}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {cvData.skills.length > 0 && (
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="w-24 h-5 bg-blue-600 rounded mb-3"></div>
          <div className="flex flex-wrap gap-2">
            {cvData.skills.map((skill, idx) => (
              <span key={idx} className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MinimalTemplate({ cvData }: { cvData: CVData }) {
  return (
    <div className="w-[210mm] h-[297mm] bg-white p-12 shadow-lg">
      <div className="text-center mb-12">
        {cvData.personalInfo.profileImage && (
          <img
            src={cvData.personalInfo.profileImage}
            alt="Profile"
            className="w-20 h-20 bg-gray-900 rounded-full mx-auto mb-3 object-cover"
          />
        )}
        <h1 className="text-3xl font-thin text-gray-900 mb-4 tracking-tight">
          {cvData.personalInfo.fullName || "Your Name"}
        </h1>
        <div className="flex flex-wrap gap-4 text-white/90">
          <span>{cvData.personalInfo.email}</span>
          <span>{cvData.personalInfo.phone}</span>
          <span>{cvData.personalInfo.location}</span>
        </div>
      </div>

      {cvData.personalInfo.summary && (
        <div className="border-t border-gray-200 pt-8 mb-8">
          <div className="w-20 h-4 bg-gray-400 mb-4"></div>
          <p className="text-gray-700 leading-loose font-light">{cvData.personalInfo.summary}</p>
        </div>
      )}

      {cvData.experience.length > 0 && (
        <div className="border-t border-gray-200 pt-8 mb-8">
          <div className="w-20 h-4 bg-gray-400 mb-4"></div>
          <div className="space-y-3">
            {cvData.experience.map((exp) => (
              <div key={exp.id}>
                <h3 className="text-lg font-light text-gray-900">{exp.position}</h3>
                <p className="text-sm text-gray-600 mb-3">{exp.company}</p>
                <p className="text-gray-700 font-light leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {cvData.education.length > 0 && (
        <div className="border-t border-gray-200 pt-8 mb-8">
          <div className="w-20 h-4 bg-gray-400 mb-4"></div>
          <div className="space-y-3">
            {cvData.education.map((edu) => (
              <div key={edu.id}>
                <h3 className="text-lg font-light text-gray-900">{edu.degree} in {edu.field}</h3>
                <p className="text-sm text-gray-600">{edu.school}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {cvData.projects.length > 0 && (
        <div className="border-t border-gray-200 pt-8 mb-8">
          <div className="w-20 h-4 bg-gray-400 mb-4"></div>
          <div className="space-y-3">
            {cvData.projects.map((proj) => (
              <div key={proj.id}>
                <h3 className="text-lg font-light text-gray-900 mb-2">{proj.name}</h3>
                <p className="text-gray-700 font-light mb-2">{proj.description}</p>
                <p className="text-xs text-gray-500">{proj.technologies}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {cvData.skills.length > 0 && (
        <div className="border-t border-gray-200 pt-8">
          <p className="text-gray-700 font-light">{cvData.skills.join(" • ")}</p>
        </div>
      )}
    </div>
  );
}

function CorporateTemplate({ cvData }: { cvData: CVData }) {
  return (
    <div className="w-[210mm] h-[297mm] bg-white shadow-lg">
      <div className="bg-slate-800 p-6 text-white">
        <div className="flex items-start gap-4">
          {cvData.personalInfo.profileImage ? (
            <img
              src={cvData.personalInfo.profileImage}
              alt="Profile"
              className="w-20 h-20 rounded-sm object-cover"
            />
          ) : (
            <div className="w-20 h-20 bg-slate-600 rounded-sm"></div>
          )}
          <div className="flex-1">
            <div className="mb-2">{cvData.personalInfo.fullName}</div>
            <div className="flex flex-wrap gap-4 text-white/90">
              <span>{cvData.personalInfo.email}</span>
              <span>{cvData.personalInfo.phone}</span>
              <span>{cvData.personalInfo.location}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 grid grid-cols-3 gap-4">
        <div className="col-span-2 space-y-4">
          {cvData.personalInfo.summary && (
            <section>
              <h2 className="text-xl font-bold text-slate-800 border-b-3 border-slate-800 pb-2 mb-4 uppercase tracking-wide">
                Professional Summary
              </h2>
              <p className="text-gray-700 leading-relaxed">{cvData.personalInfo.summary}</p>
            </section>
          )}

          {cvData.experience.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-slate-800 border-b-3 border-slate-800 pb-2 mb-4 uppercase tracking-wide">
                Work Experience
              </h2>
              <div className="space-y-6">
                {cvData.experience.map((exp) => (
                  <div key={exp.id}>
                    <h3 className="text-lg font-bold text-gray-900">{exp.position}</h3>
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span className="font-semibold">{exp.company}</span>
                      <span>{exp.startDate} - {exp.endDate || "Present"}</span>
                    </div>
                    <p className="text-gray-700">{exp.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {cvData.projects.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-slate-800 border-b-3 border-slate-800 pb-2 mb-4 uppercase tracking-wide">
                Key Projects
              </h2>
              <div className="space-y-4">
                {cvData.projects.map((proj) => (
                  <div key={proj.id}>
                    <h3 className="text-lg font-bold text-gray-900">{proj.name}</h3>
                    <p className="text-gray-700 mb-1">{proj.description}</p>
                    <p className="text-sm text-slate-600">{proj.technologies}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="space-y-6">
          {cvData.education.length > 0 && (
            <section className="bg-slate-100 p-5 rounded-sm">
              <h2 className="text-lg font-bold text-slate-800 mb-4 uppercase tracking-wide">Education</h2>
              <div className="space-y-4">
                {cvData.education.map((edu) => (
                  <div key={edu.id}>
                    <h3 className="font-bold text-gray-900 text-sm">{edu.degree}</h3>
                    <p className="text-xs text-gray-600">{edu.field}</p>
                    <p className="text-xs text-slate-700 font-semibold mt-1">{edu.school}</p>
                    <p className="text-xs text-gray-500">{edu.startDate} - {edu.endDate || "Present"}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {cvData.skills.length > 0 && (
            <section className="bg-slate-100 p-5 rounded-sm">
              <h2 className="text-lg font-bold text-slate-800 mb-4 uppercase tracking-wide">Skills</h2>
              <div className="space-y-2">
                {cvData.skills.map((skill, idx) => (
                  <div key={idx} className="text-sm text-gray-700">{skill}</div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

function CreativeTemplate({ cvData }: { cvData: CVData }) {
  return (
    <div className="w-[210mm] h-[297mm] bg-white shadow-lg">
      <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 p-6">
        <div className="flex items-center gap-8">
          {cvData.personalInfo.profileImage && (
            <img
              src={cvData.personalInfo.profileImage}
              alt="Profile"
              className="w-20 h-20 rounded-3xl object-cover border-4 border-white shadow-xl transform rotate-3"
            />
          )}
          <div className="flex-1">
            <h1 className="text-5xl font-black text-white mb-3 drop-shadow-lg">
              {cvData.personalInfo.fullName || "Your Name"}
            </h1>
            <div className="flex flex-wrap gap-4 text-white/90">
              <span>{cvData.personalInfo.email}</span>
              <span>{cvData.personalInfo.phone}</span>
              <span>{cvData.personalInfo.location}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {cvData.personalInfo.summary && (
          <section>
            <div className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-2xl mb-4 shadow-lg">
              <h2 className="text-2xl font-bold">About Me</h2>
            </div>
            <p className="ml-6 text-gray-700 leading-relaxed text-lg">
              {cvData.personalInfo.summary}
            </p>
          </section>
        )}

        {cvData.experience.length > 0 && (
          <section>
            <div className="inline-block bg-gradient-to-r from-pink-500 to-orange-500 text-white px-6 py-3 rounded-2xl mb-4 shadow-lg">
              <h2 className="text-2xl font-bold">Experience</h2>
            </div>
            <div className="ml-6 space-y-6">
              {cvData.experience.map((exp) => (
                <div
                  key={exp.id}
                  className="border-l-4 border-pink-400 pl-6"
                >
                  <h3 className="text-2xl font-bold text-gray-900">
                    {exp.position}
                  </h3>
                  <p className="text-lg text-pink-600 font-semibold">
                    {exp.company}
                  </p>
                  <p className="text-sm text-gray-500 mb-2">
                    {exp.startDate} - {exp.endDate || "Present"}
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-2 gap-6">
          {cvData.education.length > 0 && (
            <section className="bg-gradient-to-br from-orange-100 to-orange-200 rounded-3xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-orange-800 mb-4">
                Education
              </h2>
              <div className="space-y-4">
                {cvData.education.map((edu) => (
                  <div key={edu.id}>
                    <h3 className="text-lg font-bold text-gray-900">
                      {edu.degree} in {edu.field}
                    </h3>
                    <p className="text-orange-700 font-semibold">
                      {edu.school}
                    </p>
                    <p className="text-sm text-gray-600">
                      {edu.startDate} -{" "}
                      {edu.endDate || "Present"}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {cvData.projects.length > 0 && (
            <section className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-3xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-purple-800 mb-4">
                Projects
              </h2>
              <div className="space-y-4">
                {cvData.projects.map((proj) => (
                  <div key={proj.id}>
                    <h3 className="text-lg font-bold text-gray-900">
                      {proj.name}
                    </h3>
                    <p className="text-gray-700 text-sm mb-1">
                      {proj.description}
                    </p>
                    <p className="text-xs text-purple-700 font-semibold">
                      {proj.technologies}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {cvData.skills.length > 0 && (
          <section>
            <div className="inline-block bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-3 rounded-2xl mb-4 shadow-lg">
              <h2 className="text-2xl font-bold">Skills</h2>
            </div>
            <div className="ml-6 flex flex-wrap gap-3">
              {cvData.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-5 py-2 bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-full font-semibold shadow-md transform hover:scale-105 transition-transform"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}