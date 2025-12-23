import React from 'react';

export const NivaLogo = ({ className = "w-16 h-16" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 61 61" fill="none" xmlns="http://www.w3.org/2000/svg">
    <mask id="mask0_30_18" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="0" width="61" height="61">
      <path d="M0 24.533C0 10.9838 10.9838 0 24.533 0H35.5728C49.122 0 60.1058 10.9838 60.1058 24.533V35.5728C60.1058 49.122 49.122 60.1058 35.5728 60.1058H24.533C10.9838 60.1058 0 49.122 0 35.5728V24.533Z" fill="#D9D9D9"/>
    </mask>
    <g mask="url(#mask0_30_18)">
      <path d="M0 0L60.1058 -3.36423e-06L60.1058 10.5185L-4.34865e-08 10.5185L0 0Z" fill="#A40000"/>
      <path d="M0 10.5185L60.1058 10.5185L60.1058 19.5344L-2.8991e-08 19.5344L0 10.5185Z" fill="#C81D03"/>
      <path d="M0 19.5344L60.1058 19.5344L60.1058 30.0529L-3.38228e-08 30.0529L0 19.5344Z" fill="#E62C00"/>
      <path d="M0 30.0529L60.1058 30.0529L60.1058 40.5714L-3.38228e-08 40.5714L0 30.0529Z" fill="#FB6900"/>
      <path d="M0 40.5714L60.1058 40.5714L60.1058 49.5873L-2.8991e-08 49.5873L0 40.5714Z" fill="#FC9301"/>
      <path d="M0 49.5873L60.1058 49.5873L60.1058 60.1058L-3.38228e-08 60.1058L0 49.5873Z" fill="#FDC002"/>
    </g>
  </svg>
);