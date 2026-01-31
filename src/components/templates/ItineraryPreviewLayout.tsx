'use client';

import React from 'react';
import { ItineraryData } from '@/types/itinerary';
import { PreviewHeader } from '../molecules/PreviewHeader';
import { PreviewCoverSection } from '../organisms/PreviewCoverSection';
import { PreviewDaySection } from '../organisms/PreviewDaySection';
import { PreviewReceipt } from '../organisms/PreviewReceipt';

interface ItineraryPreviewLayoutProps {
  itineraryData: ItineraryData;
  memberCount?: number;
  coverImageUrl?: string;
  itemImages?: Record<string, string>;
  showAmount?: boolean;
  onBack?: () => void;
}

export const ItineraryPreviewLayout: React.FC<ItineraryPreviewLayoutProps> = ({ 
  itineraryData,
  memberCount = 1,
  coverImageUrl,
  itemImages = {},
  showAmount = true,
  onBack
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap');
        
        :root {
          --primary: #0ea5e9;
          --paper: #ffffff;
          --sand: #fffbf5;
          --text: #1f2937;
        }
        * { box-sizing: border-box; }
        body {
          margin: 0;
          font-family: 'Noto Sans JP', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: var(--sand);
          color: var(--text);
        }
        img { max-width: 100%; display: block; }
        .topbar {
          position: sticky;
          top: 0;
          z-index: 10;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 18px;
          background: rgba(255,255,255,0.9);
          backdrop-filter: blur(8px);
          border-bottom: 1px solid #e5e7eb;
        }
        .topbar button {
          border: 1px solid #e5e7eb;
          background: #f8fafc;
          border-radius: 999px;
          padding: 8px 12px;
          font-weight: 700;
          cursor: pointer;
        }
        .page {
          max-width: 960px;
          margin: 0 auto 60px;
          background: var(--paper);
          box-shadow: 0 20px 50px rgba(0,0,0,0.08);
          border-radius: 12px;
          overflow: hidden;
        }
        .cover {
          position: relative;
          height: 260px;
          background: #e5e7eb;
        }
        .cover img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: saturate(1.05);
        }
        .cover::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 60%, transparent 100%);
        }
        .cover-text {
          position: absolute;
          bottom: 24px;
          left: 24px;
          color: #fff;
          text-shadow: 0 4px 20px rgba(0,0,0,0.35);
          z-index: 1;
        }
        .cover-text h1 {
          margin: 6px 0;
          font-size: 2.2rem;
          font-weight: 700;
          letter-spacing: 0.02em;
        }
        .chip {
          display: inline-block;
          padding: 6px 10px;
          border-radius: 999px;
          background: rgba(255,255,255,0.18);
          border: 1px solid rgba(255,255,255,0.35);
          font-weight: 700;
          font-size: 0.85rem;
        }
        .content {
          padding: 28px 26px 36px;
        }
        .section-title {
          text-align: center;
          color: #9ca3af;
          letter-spacing: 0.2em;
          font-size: 0.85rem;
          text-transform: uppercase;
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 12px;
          margin: 0 auto 28px;
          width: min(260px, 70%);
        }
        .day {
          margin-bottom: 48px;
        }
        .day-head {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 18px;
        }
        .badge {
          width: 64px; height: 64px;
          border-radius: 50%;
          border: 2px dashed #d1d5db;
          display: grid;
          place-items: center;
          background: #f3f4f6;
          font-weight: 700;
          color: #1f2937;
        }
        .day-head h2 {
          margin: 0;
          font-size: 1.2rem;
          border-bottom: 2px solid rgba(14,165,233,0.3);
          display: inline-block;
          padding-bottom: 4px;
        }
        .timeline {
          position: relative;
          padding-left: 32px;
          border-left: 2px dotted #e5e7eb;
          margin-left: 14px;
        }
        .entry {
          position: relative;
          margin-bottom: 20px;
          padding-left: 16px;
        }
        .entry::before {
          content: "";
          position: absolute;
          left: -34px;
          top: 10px;
          width: 14px; height: 14px;
          background: #fff;
          border: 4px solid #d1d5db;
          border-radius: 50%;
        }
        .entry-card {
          background: #f9fafb;
          border: 1px solid #eef2f7;
          border-radius: 14px;
          padding: 12px 14px 14px;
          box-shadow: 0 10px 28px rgba(0,0,0,0.04);
        }
        .entry-time {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-weight: 700;
          color: var(--primary);
          font-size: 0.9rem;
        }
        .entry h3 {
          margin: 6px 0 6px;
          font-size: 1.05rem;
          color: #111827;
        }
        .entry p {
          margin: 0;
          color: #6b7280;
          font-size: 0.95rem;
          line-height: 1.6;
        }
        .entry img {
          margin-top: 10px;
          border-radius: 10px;
          overflow: hidden;
          max-height: 220px;
          width: 100%;
          object-fit: cover;
        }
        .cost {
          margin-top: 8px;
          padding-top: 8px;
          border-top: 1px dashed #e5e7eb;
          text-align: right;
          color: #6b7280;
          font-size: 0.9rem;
        }
        .receipt {
          margin: 50px auto 0;
          max-width: 420px;
          background: #fff;
          border: 1px solid #ede9e6;
          border-radius: 12px;
          padding: 18px;
          box-shadow: 0 18px 50px rgba(0,0,0,0.06);
          position: relative;
          overflow: hidden;
        }
        .zigzag {
          position: absolute;
          left: 0; right: 0;
          height: 6px;
          background: linear-gradient(45deg, transparent 75%, #f3f4f6 75%), linear-gradient(-45deg, transparent 75%, #f3f4f6 75%);
          background-size: 14px 14px;
          opacity: 0.5;
        }
        .zigzag.top { top: 0; }
        .zigzag.bottom { bottom: 0; transform: rotate(180deg); }
        .receipt h3 { margin: 10px 0 6px; text-align: center; }
        .receipt p { margin: 0; text-align: center; color: #9ca3af; font-size: 0.85rem; }
        .row { display: flex; justify-content: space-between; margin: 10px 0; color: #6b7280; font-size: 0.95rem; }
        .row strong { color: #111827; }
        .total { text-align: right; margin-top: 12px; }
        .total span { display: block; }
        .total .all { font-size: 1.2rem; font-weight: 700; }
        .total .per { font-size: 1.35rem; font-weight: 800; color: var(--primary); }
        footer {
          text-align: center;
          color: #9ca3af;
          margin: 26px 0 10px;
          font-size: 0.9rem;
        }
      `}</style>

      <PreviewHeader onBack={onBack} onPrint={handlePrint} />
      
      <article className="page">
        <PreviewCoverSection 
          basicInfo={itineraryData.basicInfo}
          imageUrl={coverImageUrl}
          memberCount={memberCount}
        />
        
        <div className="content">
          <div className="section-title">Travel Journal</div>
          
          {itineraryData.schedules.map((schedule, index) => (
            <PreviewDaySection 
              key={schedule.date}
              schedule={schedule}
              dayNumber={index + 1}
              itemImages={itemImages}
              showAmount={showAmount}
            />
          ))}
          
          <PreviewReceipt 
            itineraryData={itineraryData}
            memberCount={memberCount}
          />
        </div>
      </article>
      
      <footer>Created with TRIP-PLAN</footer>
    </>
  );
};