import { Button, List, ListItem, Typography } from '@mui/material';
// eslint-disable-next-line object-curly-newline
import { Control, Controller, FieldValues, Path, UseControllerProps } from 'react-hook-form';

interface ValidFileAttachmentProps<T extends FieldValues = FieldValues> extends UseControllerProps<T> {
    control: Control<T>;
    name: Path<T>;
    onFileUpload?: (files: File[]) => void;
}

export default function ValidFileAttachment<T extends FieldValues = FieldValues>({
    control,
    name,
    onFileUpload,
    ...props
}: ValidFileAttachmentProps<T>) {
    return (
        <Controller
            control={control}
            name={name}
            {...props}
            render={({ field }) => {
                const { onChange, value } = field;

                function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
                    if (e.target.files) {
                        const filesArray = Array.from(e.target.files);
                        onChange(filesArray); // update RHF
                        onFileUpload?.(filesArray);
                    }
                }

                return (
                    <div>
                        <Button variant="contained" component="label" style={{ marginTop: 16 }}>
                            Upload Attachment
                            <input
                                type="file"
                                hidden
                                multiple
                                onChange={handleFileChange}
                            />
                        </Button>

                        {value && value.length > 0 && (
                            <List>
                                {value.map((file: File, index: number) => (
                                    <ListItem key={index}>
                                        <Typography variant="body2">{file.name}</Typography>
                                    </ListItem>
                                ))}
                            </List>
                        )}
                    </div>
                );
            }}
        />
    );
}