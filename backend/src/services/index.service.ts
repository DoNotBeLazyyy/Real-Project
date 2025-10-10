import { Router } from 'express';
import accountRouter from '../routes/account.route.js';
import courseRouter from '../routes/course.route.js';
import departmentRouter from '../routes/department.route.js';
import facultyRouter from '../routes/faculty.route.js';
import programRouter from '../routes/program.route.js';
import scheduleRouter from '../routes/schedule.route.js';
import studentRouter from '../routes/student.route.js';

const apiRouter = Router();

// Routes
apiRouter.use('/student', studentRouter)
apiRouter.use('/faculty', facultyRouter)
apiRouter.use('/schedule', scheduleRouter)
apiRouter.use('/course', courseRouter)
apiRouter.use('/department', departmentRouter)
apiRouter.use('/program', programRouter)
apiRouter.use('/account', accountRouter)

export default apiRouter;