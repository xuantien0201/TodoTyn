import Task from '../models/Task.js'

export const getAllTasks = async (req, res) => {
    try {
        // dùng aggregation pipeline để thao tác với bảng Task
        const result = await Task.aggregate([
            {
                //facet là 1 nhánh cho phép chạy nhiều pipeline -> chạy nhiều việc cùng 1 lúc trong 1 nhánh
                $facet: {
                    // sắp xếp nhiệm vụ theo thời gian tạo
                    tasks: [{ $sort: { createdAt: -1 } }],
                    // đếm số nhiệm vụ active
                    activeCount: [{ $match: { status: "active" } }, { $count: "count" }],
                    // đếm số nhiệm vụ hoàn thành
                    completeCount: [{ $match: { status: "complete" } }, { $count: "count" }],
                },
            },
        ]);

        const tasks = result[0].tasks; //lấy phần tử đầu tiên
        const activeCount = result[0].activeCount[0]?.count || 0; //activeCount[0] kiểm tra xem phần tử đầu tiên có phải undefined không nếu không thì count (?.count), nếu rỗng thì = 0
        const completeCount = result[0].completeCount[0]?.count || 0; //completeCount[0] kiểm tra xem phần tử đầu tiên có phải undefined không nếu không thì count (?.count), nếu rỗng thì = 0

        res.status(200).json({ tasks, activeCount, completeCount });
    } catch (error) {
        console.log("Lỗi khi gọi getAllTasks");
        res.status(500).json({ message: "Lỗi hệ thống" })
    }
}

export const createTask = async (req, res) => {
    try {
        const { title } = req.body;
        const task = new Task({ title });

        const newTask = await task.save();
        res.status(201).json(newTask);

    } catch (error) {
        console.log("Lỗi khi gọi createTask");
        res.status(500).json({ message: "Lỗi hệ thống" })

    }
}

export const updateTask = async (req, res) => {
    try {
        const { title, status, completedAt } = req.body;
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            {
                title,
                status,
                completedAt
            },
            { new: true }
        );

        if (!updatedTask) {
            return res.status(404).json({ message: "Nhiệm vụ không tồn tại" })
        }
        res.status(200).json(updatedTask);
    } catch (error) {
        console.log("Lỗi khi gọi updateTask");
        res.status(500).json({ message: "Lỗi hệ thống" });
    }
}

export const deleteTask = async (req, res) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.id);

        if (!deletedTask) {
            return res.status(404).json({ message: "Nhiệm vụ không tồn tại" });
        }
        res.status(200).json({ message: "Nhiệm vụ đã được xóa thành công" });
    } catch (error) {
        console.log("Lỗi khi gọi deleteTask", error);
        res.status(500).json({ message: "Lỗi hệ thống" })
    }
}