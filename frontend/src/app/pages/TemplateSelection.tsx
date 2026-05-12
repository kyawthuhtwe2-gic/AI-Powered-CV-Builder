import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useCV } from '../context/CVContext';
import Header from '../components/Header';
import { ArrowLeft, Check } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  description: string;
  preview: React.ReactNode;
}

export default function TemplateSelection() {
  const navigate = useNavigate();
  const { createNewCV, setCurrentCV, saveCV } = useCV();
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');

  const templates: Template[] = [
    {
      id: 'modern',
      name: 'Modern',
      description: 'Clean tech UI style with blue accents and card-based sections',
      preview: <ModernPreview />,
    },
    {
      id: 'minimal',
      name: 'Minimal',
      description: 'Ultra clean design with maximum whitespace and thin typography',
      preview: <MinimalPreview />,
    },
    {
      id: 'corporate',
      name: 'Corporate',
      description: 'Structured grid layout with formal dark navy tones',
      preview: <CorporatePreview />,
    },
    {
      id: 'creative',
      name: 'Creative',
      description: 'Bold typography with colorful accents and modern layout blocks',
      preview: <CreativePreview />,
    },
  ];

  const handleContinue = () => {
    if (selectedTemplate) {
      const newCV = createNewCV(selectedTemplate);
      // Do NOT persist the CV yet — user should explicitly save from the builder.
      setCurrentCV(newCV);
      navigate(`/builder/${newCV.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 sm:w-4 sm:h-4" />
          Back
        </button>

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Choose Your CV Template
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Select a template that best represents your professional style
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => setSelectedTemplate(template.id)}
              className={`relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden border-2 transition-all ${
                selectedTemplate === template.id
                  ? 'border-[#2563EB] shadow-lg scale-[1.02]'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              {selectedTemplate === template.id && (
                <div className="absolute top-4 right-4 z-10 w-8 h-8 bg-[#2563EB] rounded-full flex items-center justify-center">
                  <Check className="w-5 h-5 text-white" />
                </div>
              )}

              <div className="bg-gray-100 dark:bg-gray-700 w-full overflow-hidden flex justify-center items-center">
                <div className="w-[210mm] max-w-full" style={{ aspectRatio: '210 / 297' }}>
                  <div className="w-full h-full">{template.preview}</div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {template.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {template.description}
                </p>
              </div>
            </button>
          ))}
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleContinue}
            disabled={!selectedTemplate}
            className={`px-8 py-3 rounded-xl font-semibold transition-all ${
              selectedTemplate
                ? 'bg-[#2563EB] text-white hover:bg-[#1d4ed8] shadow-lg'
                : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            }`}
          >
            Continue with Selected Template
          </button>
        </div>
      </div>
    </div>
  );
}

function ModernPreview() {
  return (
    <div className="w-full h-full bg-white shadow-lg p-8">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white mb-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-white/30 rounded-full"></div>
          <div>
            <div className="w-40 h-6 bg-white/80 rounded mb-2"></div>
            <div className="w-32 h-4 bg-white/60 rounded"></div>
          </div>
        </div>
      </div>
      <div className="bg-blue-50 rounded-lg p-4 mb-4">
        <div className="w-24 h-5 bg-blue-600 rounded mb-3"></div>
        <div className="space-y-2">
          <div className="w-full h-3 bg-blue-200 rounded"></div>
          <div className="w-5/6 h-3 bg-blue-200 rounded"></div>
        </div>
      </div>
      <div className="bg-blue-50 rounded-lg p-4">
        <div className="w-24 h-5 bg-blue-600 rounded mb-3"></div>
        <div className="space-y-2">
          <div className="w-full h-3 bg-blue-200 rounded"></div>
          <div className="w-4/5 h-3 bg-blue-200 rounded"></div>
        </div>
      </div>
    </div>
  );
}

function MinimalPreview() {
  return (
    <div className="w-full h-full bg-white shadow-lg p-12">
      <div className="text-center mb-12">
        <div className="w-20 h-20 bg-gray-900 rounded-full mx-auto mb-3"></div>
        <div className="w-48 h-3 bg-gray-300 mx-auto"></div>
      </div>
      <div className="border-t border-gray-200 pt-8 mb-8">
        <div className="w-20 h-4 bg-gray-400 mb-4"></div>
        <div className="space-y-3">
          <div className="w-full h-2 bg-gray-200"></div>
          <div className="w-11/12 h-2 bg-gray-200"></div>
          <div className="w-10/12 h-2 bg-gray-200"></div>
        </div>
      </div>
      <div className="border-t border-gray-200 pt-8">
        <div className="w-20 h-4 bg-gray-400 mb-4"></div>
        <div className="space-y-3">
          <div className="w-full h-2 bg-gray-200"></div>
          <div className="w-9/12 h-2 bg-gray-200"></div>
        </div>
      </div>
    </div>
  );
}

function CorporatePreview() {
  return (
    <div className="w-full h-full bg-white shadow-lg">
      <div className="bg-slate-800 p-6 text-white">
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 bg-slate-600 rounded-sm"></div>
          <div className="flex-1">
            <div className="w-36 h-5 bg-slate-100 mb-2"></div>
            <div className="w-28 h-3 bg-slate-400"></div>
          </div>
        </div>
      </div>
      <div className="p-6 grid grid-cols-3 gap-4">
        <div className="col-span-2 space-y-4">
          <div>
            <div className="w-32 h-5 bg-slate-800 mb-3 border-b-2 border-slate-800 pb-1"></div>
            <div className="space-y-2">
              <div className="w-full h-3 bg-gray-300"></div>
              <div className="w-11/12 h-3 bg-gray-300"></div>
              <div className="w-10/12 h-3 bg-gray-300"></div>
            </div>
          </div>
          <div>
            <div className="w-32 h-5 bg-slate-800 mb-3 border-b-2 border-slate-800 pb-1"></div>
            <div className="space-y-2">
              <div className="w-full h-3 bg-gray-300"></div>
              <div className="w-5/6 h-3 bg-gray-300"></div>
            </div>
          </div>
        </div>
        <div className="bg-slate-100 p-4">
          <div className="w-16 h-4 bg-slate-700 mb-3"></div>
          <div className="space-y-2">
            <div className="w-full h-2 bg-slate-400"></div>
            <div className="w-3/4 h-2 bg-slate-400"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CreativePreview() {
  return (
    <div className="w-full h-full bg-white shadow-lg">
      <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 p-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-white rounded-2xl rotate-3"></div>
          <div>
            <div className="w-36 h-5 bg-white rounded-lg mb-2"></div>
            <div className="w-28 h-3 bg-white/80 rounded-lg"></div>
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="mb-6">
          <div className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg mb-3">
            <div className="w-24 h-4 bg-white/90"></div>
          </div>
          <div className="ml-4 space-y-2">
            <div className="w-full h-3 bg-gradient-to-r from-purple-200 to-pink-200 rounded"></div>
            <div className="w-11/12 h-3 bg-gradient-to-r from-purple-200 to-pink-200 rounded"></div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-orange-100 rounded-xl p-4">
            <div className="w-20 h-4 bg-orange-500 rounded mb-2"></div>
            <div className="space-y-1">
              <div className="w-full h-2 bg-orange-300 rounded"></div>
              <div className="w-3/4 h-2 bg-orange-300 rounded"></div>
            </div>
          </div>
          <div className="bg-purple-100 rounded-xl p-4">
            <div className="w-20 h-4 bg-purple-500 rounded mb-2"></div>
            <div className="space-y-1">
              <div className="w-full h-2 bg-purple-300 rounded"></div>
              <div className="w-3/4 h-2 bg-purple-300 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
