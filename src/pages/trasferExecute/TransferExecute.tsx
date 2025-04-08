import { useRecoilState } from 'recoil';
import { ProgramConfig } from 'dhis2-semis-types'
import React, { useEffect, useState } from "react";
import { TableDataRefetch, Modules } from "dhis2-semis-types"
import { IconDelete24, IconEdit24 } from "@dhis2/ui";
import { InfoPage, useDataStoreKey } from 'dhis2-semis-components'
import ModalManager from "../../components/modal/ModalManager";
import { Table, useProgramsKeys } from "dhis2-semis-components";
import EnrollmentActionsButtons from "../../components/enrollmentButtons/EnrollmentActionsButtons";
import { useGetSectionTypeLabel, useHeader, useTableData, useUrlParams, useViewPortWidth } from "dhis2-semis-functions";
import ModalManagerEnrollmentDelete from '../../components/modal/deleteEnrollment/ModalManager';
import { RowSelectionState } from '../../schemas/selectedStaffsSchema';
import SummaryModalContent from '../../components/modal/SummaryModalContent';
import { ReenrollSummaryState } from '../../schemas/summarySchema';

const TransferExecute =() => {

    const [pagination, setPagination] = useState({ page: 1, pageSize: 10, totalPages: 0 })

    const { sectionName } = useGetSectionTypeLabel();
    const dataStoreData = useDataStoreKey({ sectionType: sectionName });
    const programsValues = useProgramsKeys();
    const programData = programsValues[0]
    const [selected, setSelected] = useRecoilState(RowSelectionState)
    const { viewPortWidth } = useViewPortWidth()
    const { urlParameters, add, remove } = useUrlParams()
    const { academicYear, grade, class: section, school, schoolName } = urlParameters()
    const [openEditModal, setOpenEditModal] = useState<boolean>(false)
    const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false)
    const { getData, tableData, loading } = useTableData({ module: Modules.Enrollment, selectedDataStore: dataStoreData });
    const { columns } = useHeader({ dataStoreData, programConfigData: programData as unknown as ProgramConfig, tableColumns: [], module: Modules.Enrollment });
    const [filterState, setFilterState] = useState<{ dataElements: any, attributes: any }>({ attributes: [], dataElements: [] });
    const [refetch,] = useRecoilState(TableDataRefetch);
    const [openSummary, SetOpenSummary] = useRecoilState(ReenrollSummaryState);

    const handleOpenModal = (e: Record<string, any>, type: "edit" | "delete",) => {
        add("trackedEntity", e?.row?.trackedEntity);
        add("enrollment", e?.row?.enrollmentId);

        if (type === "delete") {
            setOpenDeleteModal(true)
        } else {
            setOpenEditModal(true)
        }
    };

    useEffect(() => {
        if (!openDeleteModal && !openEditModal) {
            remove("trackedEntity")
            remove("enrollment")
        }
    }, [openDeleteModal, openEditModal])

    const rowsActions = [
        { icon: <IconEdit24 />, color: '#277314', label: `Edition`, disabled: false, loading: false, onClick: (e: any) => handleOpenModal(e, "edit") },
        { icon: <IconDelete24 />, color: '#d64d4d', label: `Delete`, disabled: false, loading: false, onClick: (e: any) => handleOpenModal(e, "delete") },
    ];

    useEffect(() => {
        if (school) {
            void getData({ page: 1, pageSize: 10, program: programData.id as string, orgUnit: school, baseProgramStage: dataStoreData?.registration?.programStage as string, attributeFilters: filterState.attributes, dataElementFilters: [filterState.dataElements] })
        }
    }, [filterState, refetch, school])

    useEffect(() => {
        const filters = [
            academicYear !== null ? `${dataStoreData.registration.academicYear}:in:${academicYear}` : null,
            grade !== null ? `${dataStoreData.registration.grade}:in:${grade}` : null,
            section !== null ? `${dataStoreData.registration.section}:in:${section}` : null,
        ].filter(Boolean); // Remove valores nulos

        setFilterState({ ...filterState, dataElements: filters.join(",") })
    }, [academicYear, grade, section])

    return (
      <div style={{ height: "85vh" }}>
        {!(Boolean(schoolName) && Boolean(school)) ? (
          <InfoPage
            title="SEMIS-Staff-Reenrollment"
            sections={[
              {
                sectionTitle: "Follow the instructions to proceed:",
                instructions: [
                  "Select the Organization unit you want to view data",
                  "Use global filters(Class, Grade and Academic Year)",
                ],
              },
            ]}
          />
        ) : (
          <>
            <Table
              programConfig={programData}
              title="Transfers"
              viewPortWidth={viewPortWidth}
              columns={columns}
              totalElements={4}
              tableData={tableData.data}
              selectable={true}
              selected={selected}
              setSelected={setSelected}
              rowAction={rowsActions}
              defaultFilterNumber={3}
              filterState={{ attributes: [], dataElements: [] }}
              loading={loading}
              rightElements={
                <EnrollmentActionsButtons
                  filetrState={filterState}
                  selectedDataStoreKey={dataStoreData}
                  programData={programData as unknown as ProgramConfig}
                />
              }
              setFilterState={setFilterState}
              pagination={pagination}
              setPagination={setPagination}
            />
            {openEditModal && (
              <ModalManager
                open={openEditModal}
                setOpen={setOpenEditModal}
                saveMode="UPDATE"
              />
            )}
            {openSummary.created != null && openSummary.conflicts != null && (
              <SummaryModalContent
                conflictDetails={openSummary.conflictDetails}
                handleCloseModal={() =>
                  SetOpenSummary({
                    created: null,
                    conflicts: null,
                    conflictDetails: null,
                  })
                }
                created={openSummary.created}
                conflicts={openSummary.conflicts}
                open={
                  openSummary.created != null && openSummary.conflicts != null
                }
              />
            )}
            {openDeleteModal && (
              <ModalManagerEnrollmentDelete
                open={openDeleteModal}
                setOpen={setOpenDeleteModal}
                saveMode="UPDATE"
              />
            )}
          </>
        )}
      </div>
    );
}

export default TransferExecute