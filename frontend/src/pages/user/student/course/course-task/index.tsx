import messageIcon from '@assets/icons/message-icon.svg';
import ShadowCard from '@components/card/ShadowCard';
import CommonHeader from '@components/container/CommonHeader';
import MainDiv from '@components/container/MainDiv';
import CourseInstructionArea from '@pages/user/student/course/course-task/CourseInstructionArea';
import CourseSubmissionArea from '@pages/user/student/course/course-task/CourseSubmissionArea';
import { FileMapProps } from '@pages/user/student/course/course-task/FileAttachment';

export default function CourseTask() {
    const iconMap = [
        {
            imageUrl: messageIcon,
            pendingActCount: '5'
        }
    ];
    const fileList: FileMapProps[] = [
        {
            fileName: 'report.docx',
            fileDescription: 'Word Document'
        },
        {
            fileName: 'presentation.pptx',
            fileDescription: 'PowerPoint Presentation'
        },
        {
            fileName: 'data.xlsx',
            fileDescription: 'Excel Spreadsheet'
        },
        {
            fileName: 'data2.xlsx',
            fileDescription: 'Excel Spreadsheet'
        },
        {
            fileName: 'data3.xlsx',
            fileDescription: 'Excel Spreadsheet'
        },
        {
            fileName: 'data4.xlsx',
            fileDescription: 'Excel Spreadsheet'
        }
    ];

    return (
        <MainDiv>
            <CommonHeader
                icons={iconMap}
                subTitle="ITC-129 LEC (MWF / 8:00AM - 10:00AM)"
                title="Computer Organization"
            />
            <ShadowCard isLarge>
                <div className="flex flex-col gap-[16px] h-full p-[16px] w-full">
                    <CourseInstructionArea fileList={fileList} />
                    <CourseSubmissionArea fileList={fileList} />
                </div>
            </ShadowCard>
        </MainDiv>
    );
}