import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { HomePage } from '@/pages/HomePage';
import { AnalyzePage } from '@/pages/AnalyzePage';
import { PlanPage } from '@/pages/PlanPage';
import { RecordPage } from '@/pages/RecordPage';
import { TipsPage } from '@/pages/TipsPage';

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-green-500 mb-4">404</h1>
        <p className="text-gray-600 mb-4">页面不存在</p>
        <a href="/" className="text-green-600 hover:underline">返回首页</a>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        <Route path="/analyze" element={<Layout><AnalyzePage /></Layout>} />
        <Route path="/plan" element={<Layout><PlanPage /></Layout>} />
        <Route path="/record" element={<Layout><RecordPage /></Layout>} />
        <Route path="/tips" element={<Layout><TipsPage /></Layout>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
