import React, { ReactNode } from "react";
import { FadeIn } from "./animations";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <FadeIn>
          <h1 className="text-3xl font-bold bg-gradient-to-l from-primary to-primary/70 bg-clip-text text-transparent inline-block mb-2">
            {title}
          </h1>
        </FadeIn>
        {description && (
          <FadeIn delay={0.1}>
            <p className="text-muted-foreground">{description}</p>
          </FadeIn>
        )}
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
  );
}
