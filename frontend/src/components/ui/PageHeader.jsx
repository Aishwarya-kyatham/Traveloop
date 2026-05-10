import React from 'react';

const PageHeader = ({ eyebrow, title, description, actions }) => (
  <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
    <div className="max-w-3xl">
      {eyebrow ? <div className="section-label mb-4">{eyebrow}</div> : null}
      <h1 className="text-4xl font-extrabold leading-tight text-white md:text-5xl">{title}</h1>
      {description ? <p className="mt-3 text-base leading-7 text-slate-400">{description}</p> : null}
    </div>
    {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
  </div>
);

export default PageHeader;
