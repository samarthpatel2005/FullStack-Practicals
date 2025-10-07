// Job Portal Resume Upload Server - Pr-14
// Express.js server with file upload functionality using multer
// Validates PDF files up to 2MB size

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3014;

// Set up EJS as template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware for parsing form data and serving static files
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname, 'uploads'));
    },
    filename: function(req, file, cb) {
        // Generate unique filename with timestamp
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const sanitizedOriginalName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
        cb(null, 'resume_' + uniqueSuffix + '_' + sanitizedOriginalName);
    }
});

// File filter function to validate PDF files
const fileFilter = (req, file, cb) => {
    console.log('📄 File filter check:', {
        fieldname: file.fieldname,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size
    });

    // Check if file is PDF
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only PDF files are allowed! Please upload a PDF resume.'), false);
    }
};

// Configure multer with validation
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 2 * 1024 * 1024, // 2MB limit
        files: 1 // Only one file at a time
    }
});

// Utility function to format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Utility function to validate file type on server side
function validateFileType(file) {
    const allowedMimeTypes = ['application/pdf'];
    const allowedExtensions = ['.pdf'];
    
    const fileExtension = path.extname(file.originalname).toLowerCase();
    
    return allowedMimeTypes.includes(file.mimetype) && 
           allowedExtensions.includes(fileExtension);
}

// Get list of uploaded resumes
function getUploadedResumes() {
    try {
        const files = fs.readdirSync(uploadsDir);
        return files
            .filter(file => file.endsWith('.pdf'))
            .map(file => {
                const filePath = path.join(uploadsDir, file);
                const stats = fs.statSync(filePath);
                return {
                    filename: file,
                    originalName: file.replace(/^resume_\d+-\d+_/, '').replace(/_/g, ' '),
                    size: formatFileSize(stats.size),
                    uploadDate: stats.mtime.toLocaleDateString(),
                    uploadTime: stats.mtime.toLocaleTimeString()
                };
            })
            .sort((a, b) => new Date(b.uploadDate + ' ' + b.uploadTime) - new Date(a.uploadDate + ' ' + a.uploadTime));
    } catch (error) {
        console.error('Error reading uploads directory:', error);
        return [];
    }
}

// Routes

// GET route - Display job portal upload form
app.get('/', (req, res) => {
    const uploadedResumes = getUploadedResumes();
    
    res.render('job-portal', {
        title: 'Job Portal - Resume Upload',
        error: null,
        success: null,
        uploadedFile: null,
        uploadedResumes: uploadedResumes,
        totalUploads: uploadedResumes.length
    });
});

// POST route - Handle file upload
app.post('/upload-resume', (req, res) => {
    // Use multer middleware for single file upload
    upload.single('resume')(req, res, function(err) {
        const uploadedResumes = getUploadedResumes();
        
        if (err instanceof multer.MulterError) {
            // Handle multer-specific errors
            let errorMessage = '';
            
            if (err.code === 'LIMIT_FILE_SIZE') {
                errorMessage = 'File too large! Resume must be smaller than 2MB.';
            } else if (err.code === 'LIMIT_FILE_COUNT') {
                errorMessage = 'Too many files! Please upload only one resume at a time.';
            } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                errorMessage = 'Unexpected field! Please use the correct form field.';
            } else {
                errorMessage = `Upload error: ${err.message}`;
            }
            
            console.error('❌ Multer error:', err);
            
            return res.render('job-portal', {
                title: 'Job Portal - Resume Upload',
                error: errorMessage,
                success: null,
                uploadedFile: null,
                uploadedResumes: uploadedResumes,
                totalUploads: uploadedResumes.length
            });
        } else if (err) {
            // Handle other errors (like file type validation)
            console.error('❌ Upload error:', err.message);
            
            return res.render('job-portal', {
                title: 'Job Portal - Resume Upload',
                error: err.message,
                success: null,
                uploadedFile: null,
                uploadedResumes: uploadedResumes,
                totalUploads: uploadedResumes.length
            });
        }
        
        // Check if file was uploaded
        if (!req.file) {
            return res.render('job-portal', {
                title: 'Job Portal - Resume Upload',
                error: 'No file selected! Please choose a PDF resume to upload.',
                success: null,
                uploadedFile: null,
                uploadedResumes: uploadedResumes,
                totalUploads: uploadedResumes.length
            });
        }
        
        // Additional server-side validation
        if (!validateFileType(req.file)) {
            // Delete the uploaded file if validation fails
            fs.unlink(req.file.path, (unlinkErr) => {
                if (unlinkErr) console.error('Error deleting invalid file:', unlinkErr);
            });
            
            return res.render('job-portal', {
                title: 'Job Portal - Resume Upload',
                error: 'Invalid file type! Only PDF files are accepted.',
                success: null,
                uploadedFile: null,
                uploadedResumes: uploadedResumes,
                totalUploads: uploadedResumes.length
            });
        }
        
        // Extract applicant name from form data
        const applicantName = req.body.applicantName || 'Anonymous Applicant';
        const jobPosition = req.body.jobPosition || 'General Application';
        
        console.log('✅ File uploaded successfully:', {
            originalName: req.file.originalname,
            filename: req.file.filename,
            size: formatFileSize(req.file.size),
            mimetype: req.file.mimetype,
            applicantName: applicantName,
            jobPosition: jobPosition
        });
        
        // Prepare success data
        const uploadedFile = {
            originalName: req.file.originalname,
            filename: req.file.filename,
            size: formatFileSize(req.file.size),
            mimetype: req.file.mimetype,
            uploadDate: new Date().toLocaleDateString(),
            uploadTime: new Date().toLocaleTimeString(),
            applicantName: applicantName,
            jobPosition: jobPosition
        };
        
        // Re-fetch updated list
        const updatedResumes = getUploadedResumes();
        
        res.render('job-portal', {
            title: 'Job Portal - Resume Upload',
            error: null,
            success: `Resume uploaded successfully! Thank you, ${applicantName}, for applying for the ${jobPosition} position.`,
            uploadedFile: uploadedFile,
            uploadedResumes: updatedResumes,
            totalUploads: updatedResumes.length
        });
    });
});

// Route to download uploaded resume
app.get('/download/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(uploadsDir, filename);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
        return res.status(404).render('job-portal', {
            title: 'Job Portal - Resume Upload',
            error: 'File not found! The requested resume may have been deleted.',
            success: null,
            uploadedFile: null,
            uploadedResumes: getUploadedResumes(),
            totalUploads: getUploadedResumes().length
        });
    }
    
    // Send file for download
    res.download(filePath, (err) => {
        if (err) {
            console.error('Error downloading file:', err);
            res.status(500).send('Error downloading file');
        }
    });
});

// Route to delete uploaded resume (admin function)
app.delete('/delete/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(uploadsDir, filename);
    
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error('Error deleting file:', err);
            return res.status(500).json({ 
                success: false, 
                message: 'Error deleting file' 
            });
        }
        
        console.log('🗑️ File deleted:', filename);
        res.json({ 
            success: true, 
            message: 'Resume deleted successfully' 
        });
    });
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('🚨 Server error:', error);
    
    res.status(500).render('job-portal', {
        title: 'Job Portal - Resume Upload',
        error: 'Internal server error. Please try again later.',
        success: null,
        uploadedFile: null,
        uploadedResumes: getUploadedResumes(),
        totalUploads: getUploadedResumes().length
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).render('job-portal', {
        title: 'Job Portal - Page Not Found',
        error: 'Page not found! Please check the URL and try again.',
        success: null,
        uploadedFile: null,
        uploadedResumes: getUploadedResumes(),
        totalUploads: getUploadedResumes().length
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`💼 Job Portal Resume Upload Server is running on http://localhost:${PORT}`);
    console.log(`📁 Upload directory: ${uploadsDir}`);
    console.log(`📝 Accepting PDF files up to 2MB in size`);
    console.log(`🔒 File validation: PDF only, 2MB max size`);
});

module.exports = app;