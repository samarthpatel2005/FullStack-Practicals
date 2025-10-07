const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3017;

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/tuition_admin', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('📚 Connected to MongoDB - Tuition Admin Database');
})
.catch((error) => {
    console.error('❌ MongoDB connection error:', error);
});

// Student Schema
const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    class: {
        type: String,
        required: true,
        enum: ['6th', '7th', '8th', '9th', '10th', '11th', '12th']
    },
    subject: {
        type: String,
        required: true,
        enum: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Computer Science', 'All Subjects']
    },
    feeStatus: {
        type: String,
        required: true,
        enum: ['Paid', 'Pending', 'Overdue'],
        default: 'Pending'
    },
    feeAmount: {
        type: Number,
        required: true,
        min: 0
    },
    joinDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    parentName: {
        type: String,
        required: true,
        trim: true
    },
    parentPhone: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    notes: {
        type: String,
        trim: true,
        default: ''
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const Student = mongoose.model('Student', studentSchema);

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes

// Home route - Dashboard
app.get('/', async (req, res) => {
    try {
        const totalStudents = await Student.countDocuments({ isActive: true });
        const paidStudents = await Student.countDocuments({ feeStatus: 'Paid', isActive: true });
        const pendingFees = await Student.countDocuments({ feeStatus: 'Pending', isActive: true });
        const overdueFees = await Student.countDocuments({ feeStatus: 'Overdue', isActive: true });
        
        const classDistribution = await Student.aggregate([
            { $match: { isActive: true } },
            { $group: { _id: '$class', count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]);
        
        const subjectDistribution = await Student.aggregate([
            { $match: { isActive: true } },
            { $group: { _id: '$subject', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);
        
        const totalRevenue = await Student.aggregate([
            { $match: { feeStatus: 'Paid', isActive: true } },
            { $group: { _id: null, total: { $sum: '$feeAmount' } } }
        ]);
        
        const recentStudents = await Student.find({ isActive: true })
            .sort({ createdAt: -1 })
            .limit(5);
        
        res.render('dashboard', {
            title: 'Tuition Admin Dashboard',
            totalStudents,
            paidStudents,
            pendingFees,
            overdueFees,
            classDistribution,
            subjectDistribution,
            totalRevenue: totalRevenue[0]?.total || 0,
            recentStudents
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).render('error', {
            title: 'Error',
            error: 'Failed to load dashboard data'
        });
    }
});

// View all students
app.get('/students', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';
        const classFilter = req.query.class || '';
        const subjectFilter = req.query.subject || '';
        const feeStatusFilter = req.query.feeStatus || '';
        
        let query = { isActive: true };
        
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } },
                { parentName: { $regex: search, $options: 'i' } }
            ];
        }
        
        if (classFilter) query.class = classFilter;
        if (subjectFilter) query.subject = subjectFilter;
        if (feeStatusFilter) query.feeStatus = feeStatusFilter;
        
        const students = await Student.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);
            
        const totalStudents = await Student.countDocuments(query);
        const totalPages = Math.ceil(totalStudents / limit);
        
        res.render('students', {
            title: 'All Students',
            students,
            currentPage: page,
            totalPages,
            totalStudents,
            search,
            classFilter,
            subjectFilter,
            feeStatusFilter,
            classes: ['6th', '7th', '8th', '9th', '10th', '11th', '12th'],
            subjects: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Computer Science', 'All Subjects'],
            feeStatuses: ['Paid', 'Pending', 'Overdue']
        });
    } catch (error) {
        console.error('Students view error:', error);
        res.status(500).render('error', {
            title: 'Error',
            error: 'Failed to load students data'
        });
    }
});

// Add student form
app.get('/students/add', (req, res) => {
    res.render('add-student', {
        title: 'Add New Student',
        classes: ['6th', '7th', '8th', '9th', '10th', '11th', '12th'],
        subjects: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Computer Science', 'All Subjects'],
        feeStatuses: ['Paid', 'Pending', 'Overdue']
    });
});

// Create student
app.post('/students', async (req, res) => {
    try {
        const student = new Student(req.body);
        await student.save();
        
        console.log(`✅ New student added: ${student.name}`);
        res.redirect('/students?success=Student added successfully');
    } catch (error) {
        console.error('Add student error:', error);
        
        let errorMessage = 'Failed to add student';
        if (error.code === 11000) {
            errorMessage = 'Email already exists';
        } else if (error.name === 'ValidationError') {
            errorMessage = Object.values(error.errors)[0].message;
        }
        
        res.render('add-student', {
            title: 'Add New Student',
            error: errorMessage,
            formData: req.body,
            classes: ['6th', '7th', '8th', '9th', '10th', '11th', '12th'],
            subjects: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Computer Science', 'All Subjects'],
            feeStatuses: ['Paid', 'Pending', 'Overdue']
        });
    }
});

// View single student
app.get('/students/:id', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        
        if (!student || !student.isActive) {
            return res.status(404).render('error', {
                title: 'Student Not Found',
                error: 'Student not found or has been deleted'
            });
        }
        
        res.render('student-details', {
            title: `${student.name} - Student Details`,
            student
        });
    } catch (error) {
        console.error('Student details error:', error);
        res.status(500).render('error', {
            title: 'Error',
            error: 'Failed to load student details'
        });
    }
});

// Edit student form
app.get('/students/:id/edit', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        
        if (!student || !student.isActive) {
            return res.status(404).render('error', {
                title: 'Student Not Found',
                error: 'Student not found or has been deleted'
            });
        }
        
        res.render('edit-student', {
            title: `Edit ${student.name}`,
            student,
            classes: ['6th', '7th', '8th', '9th', '10th', '11th', '12th'],
            subjects: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Computer Science', 'All Subjects'],
            feeStatuses: ['Paid', 'Pending', 'Overdue']
        });
    } catch (error) {
        console.error('Edit student form error:', error);
        res.status(500).render('error', {
            title: 'Error',
            error: 'Failed to load student data for editing'
        });
    }
});

// Update student
app.put('/students/:id', async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }
        
        console.log(`✅ Student updated: ${student.name}`);
        res.json({ success: true, message: 'Student updated successfully', student });
    } catch (error) {
        console.error('Update student error:', error);
        
        let errorMessage = 'Failed to update student';
        if (error.code === 11000) {
            errorMessage = 'Email already exists';
        } else if (error.name === 'ValidationError') {
            errorMessage = Object.values(error.errors)[0].message;
        }
        
        res.status(400).json({ success: false, message: errorMessage });
    }
});

// Delete student (soft delete)
app.delete('/students/:id', async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            { isActive: false },
            { new: true }
        );
        
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }
        
        console.log(`🗑️ Student deleted: ${student.name}`);
        res.json({ success: true, message: 'Student deleted successfully' });
    } catch (error) {
        console.error('Delete student error:', error);
        res.status(500).json({ success: false, message: 'Failed to delete student' });
    }
});

// API Routes for AJAX requests

// Get student by ID (API)
app.get('/api/students/:id', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        
        if (!student || !student.isActive) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }
        
        res.json({ success: true, student });
    } catch (error) {
        console.error('API get student error:', error);
        res.status(500).json({ success: false, message: 'Failed to get student data' });
    }
});

// Get all students (API)
app.get('/api/students', async (req, res) => {
    try {
        const students = await Student.find({ isActive: true }).sort({ createdAt: -1 });
        res.json({ success: true, students });
    } catch (error) {
        console.error('API get students error:', error);
        res.status(500).json({ success: false, message: 'Failed to get students data' });
    }
});

// Update fee status quickly
app.patch('/students/:id/fee-status', async (req, res) => {
    try {
        const { feeStatus } = req.body;
        
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            { feeStatus },
            { new: true }
        );
        
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }
        
        console.log(`💰 Fee status updated for ${student.name}: ${feeStatus}`);
        res.json({ success: true, message: 'Fee status updated successfully' });
    } catch (error) {
        console.error('Update fee status error:', error);
        res.status(500).json({ success: false, message: 'Failed to update fee status' });
    }
});

// Error handler
app.use((req, res) => {
    res.status(404).render('error', {
        title: 'Page Not Found',
        error: 'The page you are looking for does not exist.'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🎓 Tuition Admin Panel running on http://localhost:${PORT}`);
    console.log(`📊 Dashboard: http://localhost:${PORT}`);
    console.log(`👥 Students: http://localhost:${PORT}/students`);
    console.log(`➕ Add Student: http://localhost:${PORT}/students/add`);
    console.log(`🔗 MongoDB: mongodb://localhost:27017/tuition_admin`);
});

module.exports = app;