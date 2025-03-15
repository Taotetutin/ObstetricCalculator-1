import { PropsWithChildren } from "react";

interface BaseCalculatorProps extends PropsWithChildren {
  title?: string;
  description?: string;
  formSection: React.ReactNode;
  resultSection?: React.ReactNode;
}

export default function BaseCalculator({
  title,
  description,
  formSection,
  resultSection,
  children
}: BaseCalculatorProps) {
  return (
    <div className="h-full flex flex-col">
      {/* Header section - fixed height */}
      {(title || description) && (
        <div className="flex-shrink-0 mb-4">
          {title && <h2 className="text-xl font-semibold text-blue-700">{title}</h2>}
          {description && <p className="text-gray-600 mt-1">{description}</p>}
        </div>
      )}

      {/* Form section - takes minimum required space */}
      <div className="flex-shrink-0 space-y-4">
        {formSection}
      </div>

      {/* Results section - scrollable if needed */}
      {resultSection && (
        <div className="mt-4 flex-1 overflow-y-auto">
          {resultSection}
        </div>
      )}

      {/* Additional content if needed */}
      {children}
    </div>
  );
}
