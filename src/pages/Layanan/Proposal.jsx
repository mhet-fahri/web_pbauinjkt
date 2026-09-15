import React from 'react';

const Proposal = () => {
  return (
    <div className="pt-[120px] lg:pt-[140px] h-screen w-full flex flex-col bg-slate-50 dark:bg-slate-950">
      <div className="flex-grow w-full h-full relative">
        <iframe 
          src="https://proposal.pbafitkuinjkt.id/" 
          title="Sistem Proposal PBA"
          className="absolute inset-0 w-full h-full border-none shadow-inner"
          allowFullScreen
        />
      </div>
    </div>
  );
};

export default Proposal;

