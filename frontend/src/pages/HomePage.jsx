import AddTask from '@/components/AddTask'
import DateTimeFilter from '@/components/DateTimeFilter'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import StatsAndFilters from '@/components/StatsAndFilters'
import TaskList from '@/components/TaskList'
import TaskListPagination from '@/components/TaskListPagination'
import { Pagination } from '@/components/ui/pagination'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import api from '@/lib/axios'

const HomePage = () => {
  const [taskBuffer, setTaskBuffer] = useState([]); //Buffer: chỉ là dữ liệu thô cần xử lý
  const [activeTaskCount, setActiveTaskCount] = useState(0);
  const [completeTaskCount, setCompleteTaskCount] = useState(0);
  const [filter, setFilter] = useState('all');


  // chạy 1 lần duy nhất khi component render
  useEffect(() => {
    fetchTasks();
  }, [])

  //logic
  //khai báo API bất đồng bộ thì gọi async
  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks");
      setTaskBuffer(res.data.tasks);
      setActiveTaskCount(res.data.activeCount);
      setCompleteTaskCount(res.data.completeCount);

    } catch (error) {
      console.error("Lỗi xảy ra khi truy xuất tasks: ", error);
      toast.error("Lỗi xảy ra khi truy vấn tasks")
    }
  }

  //biến 
  //lọc danh sách nhiệm vụ theo trạng thái
  const filteredTasks = taskBuffer.filter((task) => {
  switch (filter) {
    case 'active':
      return task.status === 'active';
    case 'completed':
      return task.status === 'complete';
    default: // mặc định là giữ nguyên all 
      return true;
  }
});
const handleTaskChanged = () => {
  fetchTasks();
}

return (
  <div className="min-h-screen w-full relative">
    {/* Dashed Grid */}
    <div
      className="absolute inset-0 z-0"
      style={{
        backgroundImage: `
        linear-gradient(to right, #e7e5e4 1px, transparent 1px),
        linear-gradient(to bottom, #e7e5e4 1px, transparent 1px)
      `,
        backgroundSize: "20px 20px",
        backgroundPosition: "0 0, 0 0",
        maskImage: `
        repeating-linear-gradient(
          to right,
          black 0px,
          black 3px,
          transparent 3px,
          transparent 8px
        ),
        repeating-linear-gradient(
          to bottom,
          black 0px,
          black 3px,
          transparent 3px,
          transparent 8px
        )
      `,
        WebkitMaskImage: `
        repeating-linear-gradient(
          to right,
          black 0px,
          black 3px,
          transparent 3px,
          transparent 8px
        ),
        repeating-linear-gradient(
          to bottom,
          black 0px,
          black 3px,
          transparent 3px,
          transparent 8px
        )
      `,
        maskComposite: "intersect",
        WebkitMaskComposite: "source-in",
      }}
    />
    {/* Your Content/Components */}
    <div className='container pt-8 mx-auto relative z-10'>
      <div className='w-full max-w-2xl -6 mx-auto space-y-6'>

        {/* Đầu trang */}
        <Header />
        {/* Tạo nhiệm vụ */}
        <AddTask
          handleNewTaskAdded={handleTaskChanged}
         />
        {/* Thống kê và bộ lọc */}
        <StatsAndFilters
          filter={filter}
          setFilter={setFilter}
          activeTasksCount={activeTaskCount}
          completedTasksCount={completeTaskCount}
        />
        {/* Danh sách nhiệm vụ */}
        <TaskList 
        filteredTasks={filteredTasks}
        filter = {filter}
        handleTaskChanged = {handleTaskChanged}
        />
        {/* Phân trang và lọc theo Date */}
        <div className='flex flex-col items-center justify-between gap-6 sm:flex-row'>
          <TaskListPagination />
          <DateTimeFilter />
        </div>
        {/* Footer */}
        <Footer
          activeTasksCount={activeTaskCount}
          completedTasksCount={completeTaskCount}
        />
      </div>
    </div>
  </div >

)
}

export default HomePage