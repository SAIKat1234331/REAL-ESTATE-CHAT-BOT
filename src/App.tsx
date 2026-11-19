import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { MarketplaceProvider } from './context/MarketplaceContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { PropertiesPage } from './pages/PropertiesPage';
import { PropertyDetailsPage } from './pages/PropertyDetailsPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDetailsPage } from './pages/ProjectDetailsPage';
import { DevelopersPage } from './pages/DevelopersPage';
import { AgentsPage } from './pages/AgentsPage';
import { SavedAndComparePage } from './pages/SavedAndComparePage';
import { GuidesPage } from './pages/GuidesPage';
import { AuthPage } from './pages/AuthPage';
import { AddPropertyPage } from './pages/AddPropertyPage';
import { DashboardPage } from './pages/DashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { StaticInfoPage } from './pages/StaticInfoPage';

const ScrollToTop: React.FC = () => {
  const { pathname, search } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, search]);
  return null;
};

export default function App() {
  return (
    <MarketplaceProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col bg-white text-[#202B3C]">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/properties" element={<PropertiesPage />} />
              <Route path="/properties/:id" element={<PropertyDetailsPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/projects/:id" element={<ProjectDetailsPage />} />
              <Route path="/developers" element={<DevelopersPage />} />
              <Route path="/agents" element={<AgentsPage />} />
              <Route path="/saved" element={<SavedAndComparePage defaultTab="saved" />} />
              <Route path="/compare" element={<SavedAndComparePage defaultTab="compare" />} />
              <Route path="/guides" element={<GuidesPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/list-property" element={<AddPropertyPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="/about" element={<StaticInfoPage page="about" />} />
              <Route path="/contact" element={<StaticInfoPage page="contact" />} />
              <Route path="/privacy" element={<StaticInfoPage page="privacy" />} />
              <Route path="/terms" element={<StaticInfoPage page="terms" />} />
              <Route path="*" element={<HomePage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </MarketplaceProvider>
  );
}
