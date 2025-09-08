import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Toaster } from "react-hot-toast";
import CreateOrEditHr from "../pages/Hrs/CreateOrEditHr";

import LandingPage from "../pages/LandingPage";
import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";
import Layout from "../pages/MainLayout/Layout";
import Dashboard from "../pages/Dashboard";
import Hrs from "../pages/Hrs";
import Templates from "../pages/Templates/Templates";
import TemplateForm from "../pages/Templates/TemplateForm";
import MailKeys from "../pages/MailKeys";
import PageWrapper from "../components/PageWrapper";
import ProtectedRoute from "../routes/ProtectedRoute"; // 👈 Import it
import Campaigns from "../pages/Campaign/Campaigns";

const AppRoutes = () => {
  const location = useLocation();

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          className: " p-2 mt-8 mr-4", // Tailwind global style
        }}
      />
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Protected Layout Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/layout" element={<Layout />}>
              <Route
                index
                element={
                  <PageWrapper>
                    <Dashboard />
                  </PageWrapper>
                }
              />
              <Route
                path="dashboard"
                element={
                  <PageWrapper>
                    <Dashboard />
                  </PageWrapper>
                }
              />
              <Route
                path="hrs"
                element={
                  <PageWrapper>
                    <Hrs />
                  </PageWrapper>
                }
              />
              <Route
                path="hrs/add"
                element={
                  <PageWrapper>
                    <CreateOrEditHr />
                  </PageWrapper>
                }
              />
              <Route
                path="hrs/edit/:id"
                element={
                  <PageWrapper>
                    <CreateOrEditHr />
                  </PageWrapper>
                }
              />
              <Route
                path="templates"
                element={
                  <PageWrapper>
                    <Templates />
                  </PageWrapper>
                }
              />
              <Route
                path="templates/new"
                element={
                  <PageWrapper>
                    <TemplateForm />
                  </PageWrapper>
                }
              />
              <Route
                path="templates/edit/:id"
                element={
                  <PageWrapper>
                    <TemplateForm />
                  </PageWrapper>
                }
              />
              <Route
                path="templates/duplicate/:id"
                element={
                  <PageWrapper>
                    <TemplateForm />
                  </PageWrapper>
                }
              />
              <Route
                path="campaigns"
                element={
                  <PageWrapper>
                    <Campaigns />
                  </PageWrapper>
                }
              />
              <Route
                path="mailkeys"
                element={
                  <PageWrapper>
                    <MailKeys />
                  </PageWrapper>
                }
              />
            </Route>
          </Route>
        </Routes>
      </AnimatePresence>
    </>
  );
};

export default AppRoutes;
