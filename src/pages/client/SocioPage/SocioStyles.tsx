import React from 'react';

const SocioStyles: React.FC = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

    .socio-root {
      font-family: 'DM Sans', sans-serif;
      background: #f1f5f9;
      min-height: 100vh;
    }
    .socio-root * { box-sizing: border-box; }

    .section-title {
      font-family: 'Syne', sans-serif;
      font-weight: 700;
    }

    .card {
      background: white;
      border-radius: 20px;
      border: 1px solid #e2e8f0;
      overflow: hidden;
    }

    .card-header {
      background: linear-gradient(135deg, #2773ee 0%, #4cb0ea 100%);
      padding: 28px 32px;
      position: relative;
      overflow: hidden;
    }
    .card-header::before {
      content: '';
      position: absolute;
      top: -40px; right: -40px;
      width: 160px; height: 160px;
      border-radius: 50%;
      background: rgba(99,102,241,0.15);
    }
    .card-header::after {
      content: '';
      position: absolute;
      bottom: -30px; left: 60px;
      width: 100px; height: 100px;
      border-radius: 50%;
      background: rgba(99,102,241,0.08);
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 12px;
      border-radius: 100px;
      font-size: 12px;
      font-weight: 600;
    }

    .pill-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 20px;
      border-radius: 12px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.18s ease;
      border: none;
    }
    .pill-btn:active { transform: scale(0.97); }

    .search-wrap {
      position: relative;
      display: flex;
      gap: 12px;
    }
    .search-input {
      flex: 1;
      padding: 14px 20px 14px 48px;
      border-radius: 16px;
      border: 2px solid #e2e8f0;
      background: white;
      font-size: 14px;
      font-family: 'DM Sans', sans-serif;
      color: #1e293b;
      outline: none;
      transition: all 0.2s;
    }
    .search-input:focus {
      border-color: #6366f1;
      box-shadow: 0 0 0 4px rgba(99,102,241,0.1);
    }
    .search-icon-wrap {
      position: absolute;
      left: 16px;
      top: 50%;
      transform: translateY(-50%);
      color: #94a3b8;
      pointer-events: none;
    }
    .search-btn {
      background: linear-gradient(135deg, #6366f1, #4f46e5);
      color: white;
      border: none;
      border-radius: 16px;
      padding: 14px 24px;
      font-weight: 700;
      font-size: 14px;
      font-family: 'DM Sans', sans-serif;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s;
      white-space: nowrap;
      box-shadow: 0 4px 12px rgba(99,102,241,0.3);
    }
    .search-btn:hover { box-shadow: 0 6px 20px rgba(99,102,241,0.4); transform: translateY(-1px); }
    .search-btn:active { transform: scale(0.97); }
    .search-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

    .results-dropdown {
      background: white;
      border-radius: 16px;
      border: 1px solid #e2e8f0;
      box-shadow: 0 8px 30px rgba(0,0,0,0.08);
      overflow: hidden;
      margin-top: 8px;
    }
    .result-item {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 14px 20px;
      cursor: pointer;
      border: none;
      background: transparent;
      width: 100%;
      text-align: left;
      border-bottom: 1px solid #f8fafc;
      transition: background 0.15s;
    }
    .result-item:last-child { border-bottom: none; }
    .result-item:hover { background: #f8fafc; }
    .result-avatar {
      width: 40px; height: 40px;
      border-radius: 12px;
      background: linear-gradient(135deg, #ede9fe, #ddd6fe);
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
      color: #6366f1;
    }

    .photo-ring {
      width: 120px; height: 120px;
      border-radius: 50%;
      border: 3px solid rgba(255,255,255,0.2);
      overflow: hidden;
      flex-shrink: 0;
      position: relative;
    }
    .photo-overlay {
      position: absolute;
      inset: 0;
      border-radius: 50%;
      background: rgba(15,23,42,0.6);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.2s;
      cursor: pointer;
      color: white;
      gap: 4px;
    }
    .photo-ring:hover .photo-overlay { opacity: 1; }

    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }
    @media (max-width: 640px) {
      .grid-2 { grid-template-columns: 1fr; }
      .card-header { padding: 20px; }
    }

    .divider { height: 1px; background: #f1f5f9; margin: 0 -32px; }

    .cost-card {
      background: linear-gradient(135deg, #eff6ff, #dbeafe);
      border: 1px solid #bfdbfe;
      border-radius: 16px;
      padding: 20px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .action-btn {
      width: 100%;
      border: none;
      border-radius: 16px;
      padding: 16px;
      font-size: 16px;
      font-weight: 700;
      font-family: 'Syne', sans-serif;
      letter-spacing: 0.3px;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
    }
    .action-btn:hover { transform: translateY(-2px); }
    .action-btn:active { transform: scale(0.98); }
    .action-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

    .btn-blue { background: linear-gradient(135deg, #6366f1, #4f46e5); color: white; box-shadow: 0 4px 16px rgba(99,102,241,0.3); }
    .btn-blue:hover { box-shadow: 0 8px 24px rgba(99,102,241,0.4); }
    .btn-green { background: linear-gradient(135deg, #22c55e, #16a34a); color: white; box-shadow: 0 4px 16px rgba(34,197,94,0.3); }
    .btn-green:hover { box-shadow: 0 8px 24px rgba(34,197,94,0.4); }
    .btn-amber { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; box-shadow: 0 4px 16px rgba(245,158,11,0.3); }
    .btn-amber:hover { box-shadow: 0 8px 24px rgba(245,158,11,0.4); }
    .btn-red { background: linear-gradient(135deg, #ef4444, #dc2626); color: white; box-shadow: 0 4px 16px rgba(239,68,68,0.25); }
    .btn-red:hover { box-shadow: 0 8px 24px rgba(239,68,68,0.35); }

    .section-chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: #f1f5f9;
      border: 1px solid #e2e8f0;
      padding: 4px 12px;
      border-radius: 100px;
      font-size: 11px;
      font-weight: 600;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 16px;
    }

    .no-results {
      background: white;
      border-radius: 14px;
      border: 1px solid #fee2e2;
      padding: 14px 20px;
      display: flex;
      align-items: center;
      gap: 10px;
      color: #f87171;
      font-size: 13px;
      font-weight: 500;
      margin-top: 8px;
    }

    .id-input {
      font-family: 'Syne', sans-serif;
      font-size: 28px;
      font-weight: 800;
      color: white;
      background: rgba(255,255,255,0.1);
      border: 1px solid rgba(255,255,255,0.2);
      border-radius: 10px;
      padding: 2px 12px;
      outline: none;
      width: 180px;
      transition: all 0.2s;
    }
    .id-input:focus { background: rgba(255,255,255,0.15); border-color: rgba(255,255,255,0.4); }
    .id-input:disabled { opacity: 0.5; cursor: not-allowed; }

    .cost-input {
      font-family: 'Syne', sans-serif;
      font-size: 24px;
      font-weight: 800;
      color: #1e3a8a;
      background: white;
      border: 2px solid #bfdbfe;
      border-radius: 12px;
      padding: 4px 14px;
      outline: none;
      width: 130px;
      text-align: right;
      transition: all 0.2s;
    }
    .cost-input:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }
    .cost-input:disabled { opacity: 0.5; cursor: not-allowed; }

    .extras-textarea {
      width: 100%;
      padding: 16px;
      border-radius: 14px;
      border: 2px solid #e2e8f0;
      font-family: 'DM Sans', sans-serif;
      font-size: 14px;
      color: #334155;
      resize: none;
      outline: none;
      transition: all 0.2s;
      background: #f8fafc;
    }
    .extras-textarea:focus { border-color: #6366f1; background: white; box-shadow: 0 0 0 3px rgba(99,102,241,0.08); }
    .extras-textarea:disabled { opacity: 0.6; cursor: not-allowed; background: #f1f5f9; }
    .extras-textarea::placeholder { color: #94a3b8; }

    .edit-toggle-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 18px;
      border-radius: 12px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      border: none;
      transition: all 0.18s;
      font-family: 'DM Sans', sans-serif;
    }
    .edit-toggle-btn.locked {
      background: rgba(255,255,255,0.15);
      color: rgba(255,255,255,0.9);
      border: 1px solid rgba(255,255,255,0.2);
    }
    .edit-toggle-btn.locked:hover { background: rgba(255,255,255,0.22); }
    .edit-toggle-btn.editing {
      background: rgba(239,68,68,0.15);
      color: #fca5a5;
      border: 1px solid rgba(239,68,68,0.3);
    }
    .edit-toggle-btn.editing:hover { background: rgba(239,68,68,0.25); }

    .row-field {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 0;
      border-bottom: 1px solid #f1f5f9;
      gap: 16px;
    }
    .row-field:last-child { border-bottom: none; }
    .row-label {
      font-size: 13px;
      font-weight: 600;
      color: #64748b;
      min-width: 140px;
      flex-shrink: 0;
    }
    .row-input {
      flex: 1;
      max-width: 220px;
    }
  `}</style>
);

export default SocioStyles;
