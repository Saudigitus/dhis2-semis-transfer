import { useRecoilState } from "recoil";
import { ProgramConfig } from "dhis2-semis-types";
import React, { useEffect, useState } from "react";
import { TableDataRefetch, Modules } from "dhis2-semis-types";
import { useDataStoreKey } from "dhis2-semis-components";
import { Table, useProgramsKeys } from "dhis2-semis-components";
import EnrollmentActionsButtons from "../../components/enrollmentButtons/EnrollmentActionsButtons";
import { useGetSectionTypeLabel, useHeader, useTableData, useUrlParams, useViewPortWidth } from "dhis2-semis-functions";
import InfoPageComp from "../info/info";
import OuNameContainer from "../../utils/common/getOrgUnit";
import ApproveTranfer from "../../components/modal/modalTransfer";
import { useLocation } from "react-router-dom";

const TransferExecute = () => {
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10, totalPages: 0, });
  const [tab, setSelectedTab] = useState<string>("incoming");
  const { sectionName } = useGetSectionTypeLabel();
  const dataStoreData = useDataStoreKey({ sectionType: sectionName });
  const programsValues = useProgramsKeys();
  const programData = programsValues[0];
  const { viewPortWidth } = useViewPortWidth();
  const { urlParameters, add } = useUrlParams();
  const { school, schoolName, position, sectionType } = urlParameters();
  const { getData, tableData, loading } = useTableData({ module: Modules.Transfer });
  const { columns } = useHeader({ dataStoreData, programConfigData: programData as unknown as ProgramConfig, tableColumns: [], programStage: dataStoreData.transfer.programStage });
  const [filterState, setFilterState] = useState<{ dataElements: any; attributes: any; }>({ attributes: [], dataElements: [] });
  const [refetch] = useRecoilState(TableDataRefetch);
  const [data, setData] = useState<any>([]);
  const [modalDetails, setModalDetails] = useState<any>({});
  const { getOuDisplayName, loaading: loadingOU } = OuNameContainer({ dataStoreData, setData, setModalDetails });
  const incomingInitialFilter = [`${dataStoreData?.transfer?.destinySchool as unknown as string}:in:${school}`];
  const location = useLocation()

  console.log(location.search?.slice(1),  "lana")
  useEffect(() => {
    if (school) {
      console.log("hererere")
      void getData({
        ...pagination,
        program: programData.id as string,
        orgUnit: position === "outgoing" ? school : undefined as unknown as string,
        baseProgramStage: dataStoreData?.registration?.programStage as string,
        attributeFilters: filterState.attributes,
        otherProgramStage: dataStoreData.transfer.programStage,
        dataElementFilters: position === "incoming" ? incomingInitialFilter : filterState.dataElements,
      })
    }
  }, [sectionType, filterState, refetch, school, tab, pagination?.page, pagination?.pageSize, position]);

  useEffect(() => {
    add('position', tab)
  }, [tab])

  useEffect(() => {
    void getOuDisplayName(tableData.data)
  }, [tableData.data])

  console.log(columns)
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
            columns={[...(columns || []), { ...columns?.[0], displayName: "Resquest time", id: "requestTime" }]}
            tableData={data}
            defaultFilterNumber={3}
            filterState={filterState}
            loading={loading || loadingOU}
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
      {modalDetails?.open && <ApproveTranfer modalDetails={modalDetails} setModalDetails={setModalDetails} />}
    </div>
  );
};

export default TransferExecute;
