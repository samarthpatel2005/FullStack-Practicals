# Error Log Viewer - Practical 10

A professional web-based error log viewer built with Express.js that allows developers to browse and view server error logs through a browser interface.

## Features

- 📄 **Browse Log Files**: View all available .txt log files in a clean interface
- 🔍 **Log Content Viewer**: Read log files with syntax highlighting and search functionality
- 📊 **File Statistics**: Display line count, character count, and file information
- 🔄 **Auto-refresh**: Optional auto-refresh functionality for real-time monitoring
- 📋 **Copy & Download**: Copy log content to clipboard or download as JSON
- 🔒 **Security**: Only allows viewing .txt files for security reasons
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile devices
- ⚠️ **Error Handling**: Comprehensive error handling for missing or inaccessible files

## Project Structure

```
Pr-10/
├── server.js              # Main Express.js server
├── views/                 # EJS templates
│   ├── index.ejs         # Home page - list of log files
│   ├── log-viewer.ejs    # Log file viewer page
│   └── error.ejs         # Error page template
├── public/               # Static assets
│   ├── style.css         # CSS styles
│   └── script.js         # Client-side JavaScript
├── logs/                 # Directory for log files
│   ├── application.txt   # Sample application log
│   ├── system-startup.txt # Sample startup log
│   └── error-log.txt     # Sample error log
└── README.md             # This file
```

## Installation & Setup

1. **Navigate to the project directory:**
   ```bash
   cd "Pr-10"
   ```

2. **Install dependencies:**
   ```bash
   npm install express ejs
   ```

3. **Start the server:**
   ```bash
   npm run start:pr10
   ```
   Or directly:
   ```bash
   node server.js
   ```

4. **Access the application:**
   Open your browser and navigate to `http://localhost:3000`

## Usage

### Viewing Log Files

1. **Home Page**: Lists all available .txt files in the `logs` directory
2. **File Browser**: Click "View Log" to open any log file
3. **Search**: Use the search box to find specific content within logs
4. **Navigation**: Use breadcrumb navigation to go back to the file list

### API Endpoints

- `GET /` - Home page with list of log files
- `GET /log/:filename` - View specific log file content
- `GET /api/log/:filename` - Get log file data as JSON

### Adding Your Own Log Files

1. Place your `.txt` log files in the `logs` directory
2. Refresh the browser to see new files
3. Only `.txt` files are supported for security reasons

## Features in Detail

### Error Handling
- **File Not Found**: Displays user-friendly error message
- **Access Denied**: Handles permission issues gracefully
- **Invalid File Types**: Restricts access to .txt files only
- **Directory Missing**: Provides instructions if logs directory doesn't exist

### Security Features
- **File Type Validation**: Only .txt files are accessible
- **Path Sanitization**: Prevents directory traversal attacks
- **Error Message Sanitization**: Prevents information leakage

### User Interface Features
- **Responsive Design**: Works on all device sizes
- **Syntax Highlighting**: Highlights ERROR, WARNING, INFO, FATAL messages
- **Search Functionality**: Real-time search within log content
- **File Statistics**: Shows line count and character count
- **Copy to Clipboard**: One-click copying of log content
- **Auto-refresh**: Optional automatic page refresh

## Sample Log Files

The project includes three sample log files:

1. **application.txt** - General application logs with various error levels
2. **system-startup.txt** - System startup sequence logs
3. **error-log.txt** - HTTP error logs with status codes

## Technical Implementation

### Backend (Express.js)
- **File System Operations**: Uses Node.js `fs` module for file operations
- **Template Engine**: EJS for server-side rendering
- **Error Middleware**: Custom error handling middleware
- **Static File Serving**: Express static middleware for CSS/JS

### Frontend
- **CSS Grid & Flexbox**: Modern layout techniques
- **JavaScript Features**: Search, copy, auto-refresh functionality
- **Responsive Design**: Mobile-first approach
- **Progressive Enhancement**: Works without JavaScript

### Error Handling Strategy
1. **File Validation**: Check file existence and permissions
2. **Type Checking**: Ensure only .txt files are processed
3. **User Feedback**: Clear error messages for different scenarios
4. **Fallback Behavior**: Graceful degradation when features fail

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Development Notes

- The server automatically creates necessary directories
- Log highlighting is done client-side for performance
- File reading is synchronous for simplicity (suitable for log files)
- CORS is not needed as this serves web pages, not API responses

## Potential Enhancements

- Log file pagination for very large files
- Real-time log streaming with WebSockets
- Log filtering and advanced search
- User authentication and access control
- Log file compression and archiving
- Export functionality (PDF, CSV)

## Security Considerations

- Only .txt files are accessible
- No file writing capabilities from web interface
- Path traversal protection
- No shell command execution from user input

This tool provides a secure, user-friendly way for developers to access server logs without requiring direct server access or command-line knowledge.
