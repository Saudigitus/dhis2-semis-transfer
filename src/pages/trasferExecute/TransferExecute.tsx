import { useRecoilState } from "recoil";
import { ProgramConfig } from "dhis2-semis-types";
import React, { useEffect, useState } from "react";
import { TableDataRefetch, Modules } from "dhis2-semis-types";
import { useDataStoreKey } from "dhis2-semis-components";
import { Table, useProgramsKeys } from "dhis2-semis-components";
import EnrollmentActionsButtons from "../../components/enrollmentButtons/EnrollmentActionsButtons";
import { useGetSectionTypeLabel, useHeader, useTableData, useUrlParams, useViewPortWidth } from "dhis2-semis-functions";
import { RowSelectionState } from "../../schemas/selectedStaffsSchema";
import InfoPageComp from "../info/info";

const TransferExecute = () => {
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10, totalPages: 0, });
  const [tab, setSelectedTab] = useState("outgoing");
  const { sectionName } = useGetSectionTypeLabel();
  const dataStoreData = useDataStoreKey({ sectionType: sectionName });
  const programsValues = useProgramsKeys();
  const programData = programsValues[0];
  const [selected, setSelected] = useRecoilState(RowSelectionState);
  const { viewPortWidth } = useViewPortWidth();
  const { urlParameters } = useUrlParams();
  const { school, schoolName, } = urlParameters();
  const { getData, tableData, loading } = useTableData({ module: Modules.Transfer });
  const { columns } = useHeader({ dataStoreData, programConfigData: programData as unknown as ProgramConfig, tableColumns: [], programStage: dataStoreData.transfer.programStage });
  const [filterState, setFilterState] = useState<{ dataElements: any; attributes: any; }>({ attributes: [], dataElements: [] });
  const [refetch] = useRecoilState(TableDataRefetch);

  useEffect(() => {
    if (school) {
      void getData({
        page: 1,
        pageSize: 10,
        program: programData.id as string,
        orgUnit: school,
        baseProgramStage: dataStoreData?.registration?.programStage as string,
        attributeFilters: filterState.attributes,
        otherProgramStage: dataStoreData.transfer.programStage
      });
    }
  }, [filterState, refetch, school]);

  return (
    <div style={{ height: "85vh" }}>
      {!(Boolean(schoolName) && Boolean(school)) ? (
        <InfoPageComp />
      ) : (
        <>
          <Table
            programConfig={programData}
            title="Transfers"
            viewPortWidth={viewPortWidth}
            columns={columns}
            tableData={tableData.data}
            selectable={true}
            selected={selected}
            setSelected={setSelected}
            defaultFilterNumber={3}
            filterState={filterState}
            loading={loading}
            rightElements={
              <EnrollmentActionsButtons
                selectedValue={tab}
                setSelectedValue={setSelectedTab}
              />
            }
            setFilterState={setFilterState}
            pagination={pagination}
            setPagination={setPagination}
          />
        </>
      )}
    </div>
  );
};

export default TransferExecute;
