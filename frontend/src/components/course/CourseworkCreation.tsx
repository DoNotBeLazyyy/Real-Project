
import CommonButton from '@components/buttons/CommonButton';
import ShadowCard from '@components/card/ShadowCard';
import CommonLabelField from '@components/CommonLabelField';
import CommonHeader from '@components/container/CommonHeader';
import ValidDatePicker from '@components/datepicker/ValidDatepicker';
import ValidFileAttachment from '@components/file/ValidFileAttachment';
import ValidCommonInput from '@components/input/ValidCommonInput';
import ValidTextArea from '@components/input/ValidTextArea';
import { ValidCommonSelect } from '@components/select/ValidCommonSelect';
import { Typography } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { postCoursework } from '@services/coursework.service';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';

export interface CourseWorkFormValues {
    scheduleId?: string;
    period: string;
    dueTime: string;
    dueDate: string;
    title: string;
    instruction: string;
    files: File[];
}

export const CourseWorkCreation = () => {
    // Param
    const { scheduleId: id } = useParams();
    // Ref variables
    const submitRef = useRef<HTMLButtonElement>(null);
    // State variables
    const [attachments, setAttachments] = useState<File[]>([]);
    // Schedule id
    const scheduleId = String(id);
    // Date today
    const today = new Date();
    const formattedToday = today.toISOString()
        .split('T')[0];
    // Period list
    const periodList = [
        { label: 'Prelim', value: 'prelim' },
        { label: 'Midterm', value: 'midterm' },
        { label: 'Final', value: 'final' }
    ];
    // Time option list
    const timeOptions = [
        { value: '0730', label: '07:30' },
        { value: '0800', label: '08:00' },
        { value: '0830', label: '08:30' },
        { value: '0900', label: '09:00' },
        { value: '0930', label: '09:30' },
        { value: '1000', label: '10:00' },
        { value: '1030', label: '10:30' },
        { value: '1100', label: '11:00' },
        { value: '1130', label: '11:30' },
        { value: '1200', label: '12:00' },
        { value: '1230', label: '12:30' },
        { value: '1300', label: '13:00' },
        { value: '1330', label: '13:30' },
        { value: '1400', label: '14:00' },
        { value: '1430', label: '14:30' },
        { value: '1500', label: '15:00' },
        { value: '1530', label: '15:30' },
        { value: '1600', label: '16:00' },
        { value: '1630', label: '16:30' },
        { value: '1700', label: '17:00' },
        { value: '1730', label: '17:30' },
        { value: '1800', label: '18:00' },
        { value: '1830', label: '18:30' },
        { value: '1900', label: '19:00' },
        { value: '1930', label: '19:30' }
    ];
    // Form hooks
    const methods = useForm<CourseWorkFormValues>({
        defaultValues: {
            files: [],
            instruction: '',
            period: periodList[0].value,
            dueTime: timeOptions[0].value,
            dueDate: formattedToday,
            title: ''
        }
    });
    const control = methods.control;

    function handleFileAttachment(files: File[]) {
        setAttachments(files);
    }

    function handleSubmit() {
        if (submitRef.current) {
            submitRef.current.click();
        }
    }

    async function handleCreateCourseWork() {
        const values = methods.getValues();
        const formData = new FormData();

        formData.append('scheduleId', scheduleId);
        formData.append('period', values.period);
        formData.append('dueTime', values.dueTime);
        formData.append('dueDate', values.dueDate);
        formData.append('title', values.title);
        formData.append('instruction', values.instruction);

        values.files.forEach((file: File) => {
            formData.append('files', file);
        });

        const result = await postCoursework(formData);
        console.log('result: ', result.data.result);
    }

    return (
        <div className="flex flex-col gap-[20px] w-full">
            <CommonHeader
                title="Courses"
                subTitle="Coursework Creation"
            />
            <ShadowCard>
                <div className="flex flex-col gap-[20px] p-[12px] w-full">
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <form
                            className="flex flex-col gap-[20px] w-full"
                            onSubmit={methods.handleSubmit(handleCreateCourseWork)}
                        >
                            <CommonLabelField label="Period">
                                <ValidCommonSelect
                                    name="period"
                                    control={control}
                                    options={periodList}
                                />
                            </CommonLabelField>
                            <CommonLabelField label="Due Date">
                                <ValidDatePicker
                                    name="dueDate"
                                    control={control}
                                />
                            </CommonLabelField>
                            <CommonLabelField label="Due Time">
                                <ValidCommonSelect
                                    name="dueTime"
                                    control={control}
                                    options={timeOptions}
                                />
                            </CommonLabelField>
                            <CommonLabelField label="Coursework Title">
                                <ValidCommonInput
                                    className="p-[10px] w-full"
                                    control={control}
                                    name="title"
                                />
                            </CommonLabelField>
                            <CommonLabelField label="Coursework Instruction">
                                <ValidTextArea
                                    className="bg-[#FFFFFF] outline-none"
                                    control={control}
                                    height={200}
                                    name="instruction"
                                />
                            </CommonLabelField>
                            <ValidFileAttachment
                                control={control}
                                name="files"
                                onFileUpload={handleFileAttachment}
                            />
                            <button ref={submitRef} hidden type="submit" />
                        </form>
                    </LocalizationProvider>

                    {attachments.length > 0 && (
                        <Typography variant="body2" style={{ marginTop: 8 }}>
                            {attachments.map((file) => file.name)
                                .join(', ')}
                        </Typography>
                    )}
                    <CommonButton
                        buttonLabel="Create Coursework"
                        className="bg-[#1976d2]"
                        isRoundedFull={false}
                        onButtonClick={handleSubmit}
                    />
                </div>
            </ShadowCard>
        </div>
    );
};