export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = (userData, token) => {
    setLoading(true);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    localStorage.setItem("userid", userData._id);
    localStorage.setItem("role", userData.role);
    setUser(userData);
    setIsAuthenticated(true);
    setLoading(false);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("userid");
    localStorage.removeItem("role");
    setUser(null);
    setIsAuthenticated(false);
    setLoading(false);
  };

  // Check authentication status on mount and when localStorage changes
  useEffect(() => {
    const checkAuth = () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");
      
      if (token && storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Error parsing stored user:", error);
          logout();
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setLoading(false);
    };

    checkAuth();

    // Listen for storage changes (when localStorage is updated from other tabs/windows)
    const handleStorageChange = (e) => {
      if (e.key === "token" || e.key === "user") {
        checkAuth();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;