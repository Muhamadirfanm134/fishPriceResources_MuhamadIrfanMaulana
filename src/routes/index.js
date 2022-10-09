import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AddResource from "../pages/addResource/AddResource";
import EditResource from "../pages/editResource/EditResource";
import ResourceList from "../pages/resourceList/ResourceList";
import "../App.scss";

const RoutesManagement = () => {
  return (
    <BrowserRouter>
      <div className="contentContainer">
        <Routes>
          <Route path="/" element={<ResourceList />} />
          <Route path="add" element={<AddResource />} />
          <Route path="edit/:id" element={<EditResource />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default RoutesManagement;
