import React from 'react';
import Card, { CardContent } from './Card';

const EmptyState = ({ icon: Icon, title, description, action }) => (
  <Card className="border-dashed border-slate-700/60 bg-white/[0.02]">
    <CardContent className="flex flex-col items-center px-6 py-12 text-center">
      {Icon ? (
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-indigo-500/10 text-indigo-300">
          <Icon className="h-7 w-7" />
        </div>
      ) : null}
      <h3 className="text-xl font-bold text-white">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </CardContent>
  </Card>
);

export default EmptyState;
