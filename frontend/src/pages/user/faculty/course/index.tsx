// import ShadowCard from '@components/card/ShadowCard';
// import CommonHeader from '@components/container/CommonHeader';
// import MainDiv from '@components/container/MainDiv';
// import CourseList from '@pages/user/student/course/CourseList';

// export default function FacultyCourse() {
//     // State variables
//     const [isGrid, setIsGrid] = useState(false);
//     // Icon list
//     const iconMap = [
//         {
//             imageUrl: notifBellIcon,
//             pendingActCount: '5'
//         },
//         {
//             height: 13,
//             imageUrl: isGrid ? gridMenuIcon : listMenuIcon,
//             width: 13,
//             onIconClick: handleToggleDisplay
//         }
//     ];

//     function handleToggleDisplay() {
//         setIsGrid(!isGrid);
//     }

//     return (
//         <MainDiv>
//             <CommonHeader
//                 title="Courses"
//                 subTitle="Course List"
//                 icons={iconMap}
//             />
//             <ShadowCard isLarge>
//                 <CourseList isGrid={isGrid} />
//             </ShadowCard>
//         </MainDiv>
//     );
// };