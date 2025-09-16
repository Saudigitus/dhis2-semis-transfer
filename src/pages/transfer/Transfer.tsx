import { useRecoilState } from "recoil";
import { ProgramConfig } from "dhis2-semis-types";
import React, { useEffect, useState } from "react";
import { TableDataRefetch, Modules } from "dhis2-semis-types";
import { Table } from "dhis2-semis-components";
import EnrollmentActionsButtons from "../../components/enrollmentButtons/EnrollmentActionsButtons";
import { useHeader, useTableData, useUrlParams, useViewPortWidth } from "dhis2-semis-functions";
import InfoPageComp from "../info/info";
import OuNameContainer from "../../utils/common/getOrgUnit";
import ApproveTranfer from "../../components/modal/modalTransfer";
import useGetSelectedKeys from "../../hooks/config/useGetSelectedKeys";
import { TabPosistion } from "../../types/tabs/TabsTypes";

const Transfer = () => {
  const [data, setData] = useState<any>([]);
  const { viewPortWidth } = useViewPortWidth();
  const { urlParameters, add } = useUrlParams();
  const [refetch] = useRecoilState(TableDataRefetch);
  const [modalDetails, setModalDetails] = useState<any>({});
  const { dataStoreData, program: programData } = useGetSelectedKeys()
  const { getData, tableData, loading } = useTableData({ module: Modules.Transfer });
  const { school, schoolName, position, sectionType, academicYear } = urlParameters;
  const [pagination, setPagination] = useState({ page: 1, pageSize: 50, totalPages: 0, totalElements: 0 });
  const { getOuDisplayName, loaading: loadingOU } = OuNameContainer({ dataStoreData, setData, setModalDetails });
  const { columns } = useHeader({ dataStoreData, programConfigData: programData as unknown as ProgramConfig, programStage: dataStoreData.transfer.programStage });
  const [filterState, setFilterState] = useState<{ dataElements: any; attributes: any; }>({ attributes: [], dataElements: [] });

  useEffect(() => {
    if (position == null || position === undefined)
      add('position', TabPosistion.INCOMING)
  }, [position])

  useEffect(() => {
    if (school) {
      void getData({
        ...pagination,
        program: programData!.id as string,
        attributeFilters: filterState.attributes,
        otherProgramStage: dataStoreData?.transfer?.programStage,
        baseProgramStage: dataStoreData?.registration?.programStage as string,
        orgUnit: position === TabPosistion.OUTGOING ? school : null as unknown as string,
        dataElementFilters: position === TabPosistion.INCOMING ?
          [`${dataStoreData?.transfer?.destinySchool as unknown as string}:in:${school}`]
          : filterState.dataElements,
      }).then((resp: any) => {
        void getOuDisplayName(resp?.data)
        setPagination((prev) => ({ ...prev, totalPages: resp?.pagination.totalPages, totalElements: resp?.pagination.totalElements }))
      });
    }
  }, [academicYear, sectionType, filterState, refetch, school, schoolName, pagination?.page, pagination?.pageSize, position]);

  return (
    <div style={{ height: "85vh" }}>
      {!(Boolean(schoolName) && Boolean(school)) ? (
        <InfoPageComp />
      ) : (
        <>
          <Table
            title="Transfers"
            programConfig={programData!}
            viewPortWidth={viewPortWidth}
            columns={[...(columns || []), { ...columns?.[0], displayName: "Resquest time", id: "requestTime" }]}
            tableData={data}
            defaultFilterNumber={3}
            filterState={filterState}
            loading={loading || loadingOU}
            setFilterState={setFilterState}
            pagination={pagination}
            setPagination={setPagination}
            rightElements={<EnrollmentActionsButtons />}
          />
          {modalDetails?.open && <ApproveTranfer modalDetails={modalDetails} setModalDetails={setModalDetails} />}
        </>
      )}
    </div>
  );
};

export default Transfer;