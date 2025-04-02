import React from 'react'
import { Form } from 'react-final-form';
import { ModalContentInterface } from 'src/types/modal/ModalProps';
import { CustomForm, WithBorder, WithPadding } from 'dhis2-semis-components';

function ModalContent(props: ModalContentInterface) {
    const { formFields, onChange, onSubmit, onCancel, initialValues, loading } = props;

    return (
        <WithPadding p='10px 0'>
            <WithBorder type='all'>
                <WithPadding>
                    <CustomForm
                        Form={Form}
                        loading={loading}
                        withButtons={true}
                        formFields={formFields}
                        initialValues={initialValues}
                        onCancel={() => { onCancel() }}
                        onFormSubtmit={(e) => onSubmit(e)}
                        onInputChange={(e) => { onChange(e) }}
                    />
                </WithPadding>
            </WithBorder>
        </WithPadding>
    )
}

export default ModalContent