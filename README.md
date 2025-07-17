# AquaFresh Water Hauling - React Application

A modern, professional water hauling service website built with React, Vite, and Firebase. Features a sophisticated content management system with inline editing capabilities.

## 🚀 Features

- **Modern React Architecture**: Built with Vite for fast development and optimized builds
- **Firebase Integration**: Real-time authentication and content management
- **Inline Content Editing**: Click-to-edit functionality for all content
- **Secret Admin Panel**: Secure admin access with multiple authentication methods
- **SEO Optimized**: React Helmet for meta tags and structured data
- **Responsive Design**: Mobile-first design with modern CSS
- **Content Import/Export**: Backup and restore functionality
- **Real-time Sync**: All changes automatically saved to Firebase
- **Netlify Ready**: Optimized for Netlify deployment

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, React Router
- **Backend**: Firebase (Authentication & Firestore)
- **Styling**: Modern CSS with animations
- **SEO**: React Helmet for meta management
- **UI/UX**: React Hot Toast for notifications
- **Icons**: Lucide React icons

## 📦 Installation

1. **Clone and Install**
   ```bash
   git clone <your-repo>
   cd aquafresh-landing
   npm install
   ```

2. **Firebase Setup**
   - Create a Firebase project at https://console.firebase.google.com
   - Enable Authentication (Email/Password)
   - Enable Firestore Database
   - Copy your Firebase config and update `src/firebase/config.js`

3. **Update Firebase Config**
   ```javascript
   // src/firebase/config.js
   const firebaseConfig = {
     apiKey: "your-actual-api-key",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "your-sender-id",
     appId: "your-app-id"
   };
   ```

4. **Customize Secret Key**
   ```javascript
   // src/App.jsx (line 17)
   const secretKey = 'your-custom-secret-key-2024';
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

## 🔐 Admin Access

Access the admin panel using any of these methods:

1. **URL Hash**: `yoursite.com#your-custom-secret-key-2024`
2. **URL Parameter**: `yoursite.com?admin=your-custom-secret-key-2024`
3. **Direct Route**: `yoursite.com/admin` (after initial setup)

## 🌐 Deployment on Netlify

1. **Build the Project**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Connect your Git repository to Netlify
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Or drag and drop the `dist` folder to Netlify

3. **Configure Environment Variables** (Optional)
   - Add Firebase config as environment variables in Netlify dashboard
   - Update `src/firebase/config.js` to use environment variables

## 📁 Project Structure

```
aquafresh-landing/
├── public/               # Static assets
├── src/
│   ├── components/      # React components
│   │   ├── LandingPage.jsx
│   │   ├── AdminPanel.jsx
│   │   ├── EditableElement.jsx
│   │   └── LoadingSpinner.jsx
│   ├── hooks/           # Custom React hooks
│   │   ├── useAuth.js
│   │   └── useContent.js
│   ├── firebase/        # Firebase configuration
│   │   └── config.js
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # React entry point
│   └── index.css        # Global styles
├── netlify.toml         # Netlify configuration
├── vite.config.js       # Vite configuration
└── package.json
```

## 🎨 Content Management

### Admin Features:
- **Authentication**: Firebase email/password auth
- **Inline Editing**: Click any text to edit when in edit mode
- **Real-time Sync**: All changes automatically saved
- **Content Export**: Download content as JSON backup
- **Content Import**: Restore from JSON backup
- **User Management**: Create admin accounts
- **Content Preview**: View all editable content keys

### Content Structure:
- `logo`: Company logo text
- `heroTitle`: Main headline
- `heroDescription`: Hero section description
- `servicesTitle`: Services section title
- `service[0-2]Title`: Individual service titles
- `service[0-2]Description`: Individual service descriptions
- `aboutTitle`: About section title
- `contactTitle`: Contact section title
- `contact[0-3]Title`: Contact item titles
- `contact[0-3]Content`: Contact item content

## 🔧 Customization

### Adding New Content Fields:
1. Add to `defaultContent` in `src/hooks/useContent.js`
2. Use `<EditableElement>` component in your JSX
3. Content will automatically sync to Firebase

### Styling:
- Edit `src/index.css` for global styles
- Component-specific styles are in the same file
- CSS variables for easy color customization

### SEO:
- Meta tags managed in `src/App.jsx`
- Structured data included for local business
- Sitemap and robots.txt can be added to `public/`

## 🚀 Performance Optimization

- **Code Splitting**: Automatic vendor and Firebase chunks
- **Lazy Loading**: Intersection observer for animations
- **Optimized Images**: Add image optimization for better performance
- **Caching**: Netlify headers configured for optimal caching

## 📱 Mobile Responsiveness

- Mobile-first responsive design
- Touch-friendly admin interface
- Optimized for all screen sizes
- Modern CSS Grid and Flexbox

## 🔒 Security

- **Firebase Authentication**: Secure admin access
- **Content Validation**: XSS protection
- **Secret Admin Routes**: Hidden admin panel access
- **HTTPS**: Netlify provides SSL certificates

## 🆘 Troubleshooting

### Common Issues:

1. **Firebase Connection Issues**
   - Check Firebase config in `src/firebase/config.js`
   - Verify project settings in Firebase Console
   - Ensure Firestore rules allow authenticated read/write

2. **Build Errors**
   - Run `npm run lint` to check for code issues
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`

3. **Admin Access Issues**
   - Verify secret key matches in URL and code
   - Check browser console for errors
   - Ensure Firebase Authentication is enabled

## 📞 Support

For issues or questions:
- Check the browser console for error messages
- Review Firebase Console for authentication/database issues
- Verify all configuration files are properly set up

## 🎯 Production Checklist

- [ ] Update Firebase config with production keys
- [ ] Change secret admin key
- [ ] Test all admin functionality
- [ ] Verify SEO meta tags
- [ ] Test responsive design
- [ ] Check performance with Lighthouse
- [ ] Set up Firebase security rules
- [ ] Configure domain in Netlify
- [ ] Test contact forms and phone links

---

**Built with ❤️ for AquaFresh Potable Water Services** 