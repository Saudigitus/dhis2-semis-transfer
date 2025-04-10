// src/components/HeaderFilters.jsx
import React from "react";
import { useUrlParams } from "dhis2-semis-functions";

const HeaderFilters = () => {
  const { urlParameters, add } = useUrlParams();
  const { academicYear, grade, class: section } = urlParameters();

  const handleChange = (key, event) => {
    add(key, event.target.value);
  };

  return (
    <div className="header-filters">
      <label>
        Academic Year:
        <select
          value={academicYear || ""}
          onChange={(e) => handleChange("academicYear", e)}
        >
          {/* Render options dynamically or statically */}
          <option value="">Select Year</option>
          <option value="2023">2023</option>
          <option value="2024">2024</option>
        </select>
      </label>
      <label>
        Grade:
        <select value={grade || ""} onChange={(e) => handleChange("grade", e)}>
          <option value="">Select Grade</option>
          <option value="Grade 1">Grade 1</option>
          <option value="Grade 2">Grade 2</option>
        </select>
      </label>
      <label>
        Class:
        <select
          value={section || ""}
          onChange={(e) => handleChange("class", e)}
        >
          <option value="">Select Class</option>
          <option value="A">A</option>
          <option value="B">B</option>
        </select>
      </label>
    </div>
  );
};

export default HeaderFilters;
