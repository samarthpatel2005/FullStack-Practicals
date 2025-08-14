# Material-UI Login and Registration Form

A modern, responsive login and registration form built with React and Material-UI, featuring comprehensive form validation, Google OAuth integration, and an attractive user interface.

## Features

### 🎨 **Modern UI Design**
- Material-UI components with custom theming
- Gradient background with glassmorphism effects
- Responsive design that works on all devices
- Tab-based navigation between login and registration
- Smooth animations and transitions

### 🔐 **Authentication Features**
- **Login Form**: Email/password authentication with validation
- **Registration Form**: Comprehensive user registration with multiple fields
- **Google OAuth**: Sign in/up with Google integration
- **Password Security**: 
  - Password strength indicator
  - Password visibility toggle
  - Secure password validation

### ✅ **Form Validation**
- Real-time form validation using Yup schema
- Comprehensive error handling and user feedback
- Field-specific validation rules:
  - Email format validation
  - Password strength requirements
  - Phone number format validation
  - Name validation with character restrictions
  - Terms and conditions acceptance

### 📱 **User Experience**
- Loading states and form submission feedback
- Success/error notifications
- Form state management with React Hook Form
- Accessibility features
- Mobile-friendly interface

## Tech Stack

- **React** 18.2.0 - Frontend framework
- **Material-UI** 5.14.17 - Component library and theming
- **React Hook Form** 7.47.0 - Form state management
- **Yup** 1.3.3 - Schema validation
- **Google Identity Services** - OAuth integration

## Project Structure

```
LoginPage/
├── public/
│   ├── index.html          # HTML template with Google OAuth script
│   └── manifest.json       # App manifest
├── src/
│   ├── components/
│   │   ├── LoginForm.js         # Login form component
│   │   ├── RegisterForm.js      # Registration form component
│   │   └── GoogleSignInButton.js # Google OAuth button component
│   ├── App.js              # Main app component with theming and navigation
│   └── index.js            # App entry point
├── package.json            # Dependencies and scripts
└── README.md              # This file
```

## Installation and Setup

1. **Navigate to the LoginPage directory:**
   ```cmd
   cd "e:\SAMARTH\Full Stack Pr\LoginPage"
   ```

2. **Install dependencies:**
   ```cmd
   npm install
   ```

3. **Set up Google OAuth (Optional):**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing project
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add your domain to authorized origins
   - Replace `your-google-client-id.apps.googleusercontent.com` in `GoogleSignInButton.js` with your actual client ID
   - Or create a `.env` file and add:
     ```
     REACT_APP_GOOGLE_CLIENT_ID=your-actual-client-id.apps.googleusercontent.com
     ```

4. **Start the development server:**
   ```cmd
   npm start
   ```

5. **Open your browser and navigate to:**
   ```
   http://localhost:3000
   ```

## Component Details

### LoginForm Component
- Email and password fields with validation
- "Remember me" checkbox functionality
- Forgot password link
- Google sign-in integration
- Form submission with loading states

### RegisterForm Component
- First name, last name, email, and phone fields
- Password and confirm password with strength indicator
- Terms and conditions acceptance checkbox
- Comprehensive validation for all fields
- Google sign-up integration

### GoogleSignInButton Component
- Handles Google OAuth integration
- Fallback UI when Google services are unavailable
- JWT token parsing for user information
- Error handling and user feedback

## Validation Rules

### Login Form
- **Email**: Valid email format required
- **Password**: Minimum 6 characters

### Registration Form
- **First/Last Name**: 2-50 characters, letters and spaces only
- **Email**: Valid email format
- **Phone**: Exactly 10 digits
- **Password**: Minimum 8 characters with:
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - At least one special character (@$!%*?&)
- **Confirm Password**: Must match password
- **Terms**: Must be accepted

## Customization

### Theme Customization
The app uses a custom Material-UI theme defined in `App.js`. You can modify:
- Primary and secondary colors
- Typography settings
- Component overrides
- Breakpoints and spacing

### Form Validation
Validation schemas are defined using Yup in each form component. You can:
- Add new validation rules
- Modify existing validation messages
- Add custom validation functions

### Styling
The app uses Material-UI's sx prop and styled components. You can:
- Modify component styles
- Add new CSS classes
- Update the gradient background
- Change animation effects

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for educational purposes as part of a Full Stack development course.

## Notes

- The authentication is currently mocked for demonstration purposes
- Google OAuth requires proper setup with valid client credentials
- Form submissions simulate API calls with setTimeout
- All validation is client-side only in this demo

## Screenshots

The application features:
- A beautiful gradient background
- Clean, modern form design
- Tab-based navigation
- Real-time validation feedback
- Responsive layout for all screen sizes
