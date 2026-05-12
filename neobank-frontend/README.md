# Crimson NeoBank Frontend

A modern React frontend for the Crimson NeoBank application, built with Vite, React Router, and Tailwind CSS.

## Features

- **Modern UI**: Clean, responsive design with dark theme
- **Authentication**: Login/register forms with JWT token management
- **Dashboard**: Real-time balance and transaction overview
- **Account Management**: View and create bank accounts
- **Transaction Processing**: Deposit, withdraw, and transfer money
- **Compliance Profile**: KYC profile management and verification
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Type Safety**: JavaScript with modern React patterns

## Prerequisites

- Node.js 18+
- npm or yarn
- Backend API running (see neobank-api README)

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Open browser:**
   Navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/          # React components
│   ├── Dashboard.jsx    # Main dashboard
│   ├── Login.jsx        # Login form
│   ├── Register.jsx     # Registration form
│   ├── Accounts.jsx     # Account management
│   ├── Transactions.jsx # Transaction forms
│   ├── Profile.jsx      # Compliance profile
│   └── LandingPage.jsx  # Marketing page
├── contexts/            # React contexts
│   └── AuthContext.jsx  # Authentication state
├── data/                # Legacy mock data
├── App.jsx              # Main app component
└── main.jsx             # App entry point
```

## Architecture

### State Management
- **AuthContext**: Manages authentication state and JWT tokens
- **Local State**: Component-level state for forms and data

### Routing
- **React Router**: Client-side routing
- **Protected Routes**: Automatic redirects for unauthenticated users

### API Integration
- **Axios**: HTTP client with automatic JWT header injection
- **Error Handling**: User-friendly error messages
- **Loading States**: Visual feedback during API calls

### Forms
- **React Hook Form**: Form state management and validation
- **Validation**: Client-side validation with error display

## Environment Variables

Create a `.env` file for custom configuration:

```env
VITE_API_BASE_URL=http://localhost:8080
```

## Styling

- **Tailwind CSS**: Utility-first CSS framework
- **Custom Theme**: Crimson color scheme with dark mode
- **Responsive**: Mobile-first responsive design
- **Components**: Consistent component styling

## Development

### Adding New Features

1. Create component in `src/components/`
2. Add route in `App.jsx`
3. Update navigation if needed
4. Add API calls using axios
5. Handle loading and error states

### API Integration

```javascript
import axios from 'axios';

// GET request
const response = await axios.get('/api/accounts');

// POST request
const response = await axios.post('/api/transactions/deposit', data);
```

### Authentication

The AuthContext automatically handles JWT tokens:

```javascript
import { useAuth } from '../contexts/AuthContext';

const { user, login, logout } = useAuth();
```

## Testing

### Manual Testing

1. Start backend services
2. Start frontend with `npm run dev`
3. Test user registration and login
4. Test account creation and transactions
5. Test profile updates

### Linting

```bash
npm run lint
```

## Deployment

### Build for Production

```bash
npm run build
```

This creates optimized files in the `dist/` directory.

### Serve Static Files

The built files can be served by any static file server.

### Environment Setup

For production, set the API base URL:

```env
VITE_API_BASE_URL=https://api.yourdomain.com
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Follow React best practices
2. Use functional components with hooks
3. Maintain consistent styling
4. Add proper error handling
5. Test on multiple browsers

## Troubleshooting

### Common Issues

1. **API Connection**: Ensure backend is running on correct port
2. **CORS Errors**: Check backend CORS configuration
3. **Authentication**: Clear localStorage if token issues
4. **Build Errors**: Run `npm install` to update dependencies

### Debug Mode

Set `VITE_DEBUG=true` for additional console logging.

## License

MIT License
