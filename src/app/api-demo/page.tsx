"use client";

import React from 'react';
import { AuthProvider } from '@/context/AuthContext';
import CampaignList from '@/components/CampaignList';
import { CampaignStatus } from '@/lib/api/types';

export default function ApiDemo() {
  return (
    <AuthProvider>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Raise3 API Integration Demo</h1>
          <p className="text-gray-600 mt-2">
            This page demonstrates integration with the Raise3 API.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Active Campaigns</h2>
            <CampaignList initialStatus={CampaignStatus.ACTIVE} />
          </div>
          
          <div className="space-y-6">
            <div className="border rounded-lg p-4 bg-white shadow-sm">
              <h2 className="text-lg font-semibold mb-4">API Features</h2>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Authentication with wallet</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Campaign management</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Smart contract integration</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Investment processing</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>User KYC and profile management</span>
                </li>
              </ul>
            </div>
            
            <div className="border rounded-lg p-4 bg-white shadow-sm">
              <h2 className="text-lg font-semibold mb-4">API Documentation</h2>
              <p className="text-sm text-gray-600 mb-4">
                Find the full API documentation at:
              </p>
              <a 
                href="https://raise3-backend.onrender.com/api-docs/" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-indigo-600 text-white px-4 py-2 rounded text-sm hover:bg-indigo-700 transition"
              >
                View API Docs
              </a>
            </div>
          </div>
        </div>
      </div>
    </AuthProvider>
  );
} 