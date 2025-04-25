import React from "react";
import { Paper } from "@material-ui/core";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  IconAdd16,
  DropdownButton,
} from "@dhis2/ui";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { TabsState } from "../../schemas/tabSchema";
import WorkingLists from "../../components/tabs/WorkingLists";

const dummyData: any[] = [];

export default function Lists() {
  const navigate = useNavigate();
  const selectedTab = useRecoilValue(TabsState);

  return (
    <div style={{ padding: "1rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #e0e0e0",
          paddingBottom: "0.5rem",
          marginBottom: "1rem",
        }}
      >
        <h2 style={{ fontSize: 22, margin: 0 }}>Transfer</h2>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <WorkingLists />
          <Button
            icon={<IconAdd16 />}
            onClick={() => navigate("/transfer-execute")}
          >
            Perform transfer
          </Button>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          flexWrap: "wrap",
          marginBottom: "1rem",
        }}
      >
        <DropdownButton name="registration" value="registration">
          Unique Student Registration Number
        </DropdownButton>
        <DropdownButton name="internalId" value="internalId">
          Internal ID
        </DropdownButton>
        <DropdownButton name="firstName" value="firstName">
          First name
        </DropdownButton>
        <DropdownButton name="surname" value="surname">
          Surname
        </DropdownButton>
        <DropdownButton name="moreFilters" value="moreFilters">
          More filters
        </DropdownButton>
      </div>

      <Paper elevation={1} style={{ padding: "1rem" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Unique Student Registration Number</TableCell>
              <TableCell>First name</TableCell>
              <TableCell>Surname</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Grade</TableCell>
              <TableCell>Class/Section</TableCell>
              <TableCell>Destiny School</TableCell>
              <TableCell>Transfer Status</TableCell>
              <TableCell>Request time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dummyData.length === 0 ? (
              <TableRow>
                <TableCell colSpan="9">No data to display</TableCell>
              </TableRow>
            ) : (
              dummyData.map((student, index) => (
                <TableRow key={index}>
                  <TableCell>{student.registrationNumber}</TableCell>
                  <TableCell>{student.firstName}</TableCell>
                  <TableCell>{student.surname}</TableCell>
                  <TableCell>{student.gender}</TableCell>
                  <TableCell>{student.grade}</TableCell>
                  <TableCell>{student.section}</TableCell>
                  <TableCell>{student.destinySchool}</TableCell>
                  <TableCell>
                    <span
                      style={{
                        color:
                          student.status === "Approved"
                            ? "green"
                            : student.status === "Rejected"
                            ? "red"
                            : "orange",
                      }}
                    >
                      {student.status}
                    </span>
                  </TableCell>
                  <TableCell>{student.requestTime}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
}
