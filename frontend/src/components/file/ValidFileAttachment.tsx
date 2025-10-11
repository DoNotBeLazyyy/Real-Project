import { Button } from '@mui/material';
import { Control, Controller, FieldValues, UseControllerProps } from 'react-hook-form';

interface ValidFileAttachmentProps<T extends FieldValues = FieldValues> extends UseControllerProps<T> {
    control: Control<T>;
    onFileUpload?: (files: File[]) => void;
}

export default function ValidFileAttachment<T extends FieldValues = FieldValues>({
    onFileUpload,
    ...props
}: ValidFileAttachmentProps<T>) {
    return (
        <Controller
            {...props}
            render={({ field }) => {
                const { onChange } = field;

                function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
                    if (e.target.files) {
                        const filesArray = Array.from(e.target.files);
                        onChange(filesArray); // update RHF
                        onFileUpload?.(filesArray);
                    }
                }

                return (
                    <Button variant="contained" component="label" style={{ marginTop: 16 }}>
                        Upload Attachment
                        <input
                            type="file"
                            hidden
                            multiple
                            onChange={handleFileChange}
                            // do NOT spread field or set value
                        />
                    </Button>
                );
            }}
        />
    );
}