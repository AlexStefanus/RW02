import React from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  mounted?: boolean;
}

const PageHeader = ({ title, subtitle, actions, mounted = true }: PageHeaderProps) => {
  return (
    <header className={`bg-white app-header border-b border-gray-200 smooth-transition ${mounted ? "smooth-reveal" : "animate-on-load"}`}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <div className="min-w-0">
          <h1 className="app-text-2xl font-bold text-black smooth-transition">{title}</h1>
          {subtitle && <p className="text-gray-600 text-xs mt-1 smooth-transition">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </header>
  );
};

export default PageHeader;
