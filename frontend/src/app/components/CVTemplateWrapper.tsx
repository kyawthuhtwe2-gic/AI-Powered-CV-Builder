import { CVData } from '../context/CVContext';
import { forwardRef } from 'react';

interface CVTemplateWrapperProps {
  children: React.ReactNode;
  cvData: CVData;
}

const CVTemplateWrapper = forwardRef<HTMLDivElement, CVTemplateWrapperProps>(
  ({ children, cvData }, ref) => {
    return (
      <div
        ref={ref}
        data-cv-preview
        style={{
          backgroundColor: '#ffffff',
          color: '#000000',
        }}
      >
        {children}
      </div>
    );
  }
);

CVTemplateWrapper.displayName = 'CVTemplateWrapper';

export default CVTemplateWrapper;
