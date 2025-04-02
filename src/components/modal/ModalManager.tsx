import { format } from "date-fns";
import { useRecoilState } from "recoil";
import ModalContent from "./ModalContent";
import React, { useEffect, useState } from "react";
import { TableDataRefetch, Modules } from "dhis2-semis-types"
import { ModalManagerInterface } from "src/types/modal/ModalProps";
import { enrollmentPostBody, enrollmentUpdateBody } from "../../utils/enrollment";
import { formFields } from "../../utils/constants/form/enrollmentForm";
import useGetEnrollmentUpdateInitialValues from "../../hooks/form/useGetEnrollmentUpdateInitialValues";
import { ModalComponent, useDataStoreKey, useProgramsKeys, useGetUsedProgramStages, } from "dhis2-semis-components";
import { useBuildForm, useGetAttributes, useGetPatternCode, useSaveTei, useUrlParams, useGetSectionTypeLabel } from "dhis2-semis-functions";
import { NoticeBox } from "@dhis2/ui";
import { RowSelectionState } from "../../schemas/selectedStaffsSchema";
import { useReenrollStaff } from "../../hooks/tei/useReenrollStaff";

function ModalManager(props: ModalManagerInterface) {
    const { open, setOpen, saveMode } = props;
    const programsValues = useProgramsKeys();
    const programData = programsValues[1];
    const { urlParameters, useQuery } = useUrlParams();
    const { school, schoolName } = urlParameters();
    const { saveTei, loading: saving } = useSaveTei();
    const { sectionName } = useGetSectionTypeLabel();
    const [values, setValues] = useState<object>({ school, "enrollment_date": format(new Date(), "YYY-MM-dd") })
    const enrollment = useQuery().get("enrollment") as string
    const { attributes = [] } = useGetAttributes({ programData });
    const [refetch, setRefetch] = useRecoilState(TableDataRefetch);
    const trackedEntity = useQuery().get("trackedEntity") as string
    const dataStoreData = useDataStoreKey({ sectionType: sectionName });
    const programStagesToSave = useGetUsedProgramStages({ sectionType: sectionName });
    const { reenrollStaff,loadingReenroll } = useReenrollStaff()
    const { returnPattern, loadingCodes, generatedVariables } = useGetPatternCode();
    const { formData } = useBuildForm({ dataStoreData, programData, module: Modules.Enrollment });
    const [initialValues] = useState<object>({ registerschoolstaticform: schoolName, enrollment_date: format(new Date(), "yyyy-MM-dd") });
    const { getInitialValues, initialValues: updateInitialValues, loading: initialValuesLoading, enrollmentEvents } = useGetEnrollmentUpdateInitialValues()

    const [selected, setSelected] = useRecoilState(RowSelectionState)

    const clearSelected = () => {
        setSelected([])
    }

    useEffect(() => {
        if (saveMode == "CREATE") void returnPattern(attributes);

        if (saveMode == "UPDATE") void getInitialValues(trackedEntity, enrollment);
    }, [open]);

    const handleCloseModal = () => setOpen(false);

    function onChange(e: any): void {
        setValues(prevState => ({ ...prevState, [e?.name]: e?.value }))
    }

    function onSubmit(e: Record<string, any>): void {
        void reenrollStaff({ staffs: selected, formValues: values, clearSelectedStaffs: clearSelected,closeModal:handleCloseModal })
    }

    return (
        <ModalComponent
            open={open}
            handleClose={handleCloseModal}
            loading={loadingCodes || initialValuesLoading}
            title={`Bulk ${sectionName} Re-enroll ${saveMode == "UPDATE" ? "Update" : ""}`}
        >
            <NoticeBox warning title={`WARNING! ${selected?.length} rows will be affected`}>
                You are about to re-enroll the selected staffs to a new selected academic year. Please select the academic year bellow and continue
            </NoticeBox>
            <ModalContent
                loading={loadingReenroll}
                onChange={onChange}
                onSubmit={onSubmit}
                onCancel={handleCloseModal}
                formFields={formFields({ formFieldsData: formData, sectionName, dataStoreData })}
                initialValues={{ ...initialValues, ...generatedVariables, ...updateInitialValues }}
            />
        </ModalComponent>
    );
}

export default ModalManager;