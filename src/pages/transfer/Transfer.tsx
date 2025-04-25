// src/pages/transfer/Transfer.tsx
import React from "react";
import { useUrlParams } from "dhis2-semis-functions";
import { InfoPage } from "dhis2-semis-components";
import { Lists } from "../../pages";

const Transfer = () => {
  const { urlParameters } = useUrlParams();
  const { school, schoolName } = urlParameters();

  return (
    <div style={{ height: "85vh" }}>
      {!(Boolean(school) && Boolean(schoolName)) ? (
        <InfoPage
          title="SEMIS - Student Transfer"
          sections={[
            {
              sectionTitle: "Follow the instructions to proceed:",
              instructions: [
                "Select the Organization unit you want to view data",
                "Use global filters(Class, Grade and Academic Year)",
              ],
            },
            {
              sectionTitle: "How to perform operations:",
              instructions: [
                "Outgoing Transfer: Select outgoing tab and view outgoing Student transfer list.",
                "Incoming Transfer: Select incoming tab:",
                "Approve: Choose the Student for whom you want to approve the transfer to the selected school, click on the approve button, then confirm.",
                "Reject: Choose the Student for whom you want to reject the transfer to the selected school, click on the reject button, then confirm.",
              ],
            },
          ]}
        />
      ) : (
        <Lists />
      )}
    </div>
  );
};

export default Transfer;
