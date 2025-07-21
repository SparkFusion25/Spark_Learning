import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// Types of users
const USER_TYPES = {
  CHILD: 'child',
  PARENT: 'parent',
  ADMIN: 'admin'
};

// Initial state
const initialState = {
  isAuthenticated: false,
  user: null,
  userType: null,
  currentChild: null,
  loading: false,
  error: null
};

// Action types
const ActionTypes = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  SET_CURRENT_CHILD: 'SET_CURRENT_CHILD',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.LOGIN_START:
      return {
        ...state,
        loading: true,
        error: null
      };
    
    case ActionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        userType: action.payload.userType,
        loading: false,
        error: null
      };
    
    case ActionTypes.LOGIN_FAILURE:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        userType: null,
        loading: false,
        error: action.payload
      };
    
    case ActionTypes.LOGOUT:
      return {
        ...initialState
      };
    
    case ActionTypes.SET_CURRENT_CHILD:
      return {
        ...state,
        currentChild: action.payload
      };
    
    case ActionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Mock user data (replace with API calls)
const mockUsers = {
  parents: [
    {
      id: 'parent1',
      email: 'parent@family.com',
      password: 'password123',
      name: 'Sarah Johnson',
      phone: '+1 (555) 123-4567',
      subscription: 'premium',
      children: [
        {
          id: 'child1',
          name: 'Emma',
          age: 6,
          avatar: '👧',
          level: 12,
          sparkCoins: 450,
          streak: 8,
          favoriteSubject: 'reading',
          completedLessons: 47,
          totalTimeToday: 32,
          mood: 'excited'
        },
        {
          id: 'child2',
          name: 'Max',
          age: 5,
          avatar: '👦',
          level: 8,
          sparkCoins: 230,
          streak: 3,
          favoriteSubject: 'science',
          completedLessons: 31,
          totalTimeToday: 18,
          mood: 'curious'
        }
      ]
    }
  ],
  admins: [
    {
      id: 'admin1',
      email: 'admin@sparklearn.com',
      password: 'admin123',
      name: 'Admin User',
      role: 'super_admin'
    }
  ]
};

// Provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('sparklearn_user');
    const savedUserType = localStorage.getItem('sparklearn_user_type');
    
    if (savedUser && savedUserType) {
      try {
        const user = JSON.parse(savedUser);
        dispatch({
          type: ActionTypes.LOGIN_SUCCESS,
          payload: { user, userType: savedUserType }
        });
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('sparklearn_user');
        localStorage.removeItem('sparklearn_user_type');
      }
    }
  }, []);

  // Login function
  const login = async (credentials, userType) => {
    dispatch({ type: ActionTypes.LOGIN_START });

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      let user = null;

      if (userType === USER_TYPES.PARENT) {
        user = mockUsers.parents.find(
          p => p.email === credentials.email && p.password === credentials.password
        );
      } else if (userType === USER_TYPES.ADMIN) {
        user = mockUsers.admins.find(
          a => a.email === credentials.email && a.password === credentials.password
        );
      } else if (userType === USER_TYPES.CHILD) {
        // For child login, we just need to verify parent exists
        user = mockUsers.parents[0]; // Simplified for demo
      }

      if (user) {
        // Save to localStorage
        localStorage.setItem('sparklearn_user', JSON.stringify(user));
        localStorage.setItem('sparklearn_user_type', userType);

        dispatch({
          type: ActionTypes.LOGIN_SUCCESS,
          payload: { user, userType }
        });

        toast.success(
          userType === USER_TYPES.CHILD 
            ? `Welcome back! 🎉` 
            : `Welcome back, ${user.name}! 👋`
        );

        return { success: true, user, userType };
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      const errorMessage = error.message || 'Login failed. Please try again.';
      
      dispatch({
        type: ActionTypes.LOGIN_FAILURE,
        payload: errorMessage
      });

      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('sparklearn_user');
    localStorage.removeItem('sparklearn_user_type');
    localStorage.removeItem('sparklearn_current_child');
    
    dispatch({ type: ActionTypes.LOGOUT });
    toast.success('Logged out successfully! 👋');
  };

  // Set current child (for parent switching between children)
  const setCurrentChild = (child) => {
    localStorage.setItem('sparklearn_current_child', JSON.stringify(child));
    dispatch({
      type: ActionTypes.SET_CURRENT_CHILD,
      payload: child
    });
  };

  // Get children for current parent
  const getChildren = () => {
    if (state.userType === USER_TYPES.PARENT && state.user) {
      return state.user.children || [];
    }
    return [];
  };

  // Check if user has permission
  const hasPermission = (permission) => {
    if (!state.isAuthenticated) return false;
    
    switch (permission) {
      case 'view_admin':
        return state.userType === USER_TYPES.ADMIN;
      case 'view_parent_dashboard':
        return state.userType === USER_TYPES.PARENT;
      case 'play_games':
        return state.userType === USER_TYPES.CHILD || state.userType === USER_TYPES.PARENT;
      default:
        return false;
    }
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: ActionTypes.CLEAR_ERROR });
  };

  // Context value
  const value = {
    // State
    ...state,
    
    // Actions
    login,
    logout,
    setCurrentChild,
    getChildren,
    hasPermission,
    clearError,
    
    // Constants
    USER_TYPES
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Higher-order component for route protection
export const withAuth = (Component, requiredUserType = null) => {
  return function AuthenticatedComponent(props) {
    const { isAuthenticated, userType } = useAuth();
    
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    
    if (requiredUserType && userType !== requiredUserType) {
      return <Navigate to="/" replace />;
    }
    
    return <Component {...props} />;
  };
};

export default AuthContext;