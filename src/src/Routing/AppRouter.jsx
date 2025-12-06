import { Route, Routes } from "react-router";
import { MainLayout } from "../Layout/MainLayout";

export const AppRouter = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<MainLayout />} />
      </Routes>
    </>
  );
};
