export const router = createBrowserRouter([
  {
    element:
      <AppLayout />
,
    errorElement: <NotFound />,
    children: [
    //   { path: "/", element: <LandingPage /> },
    //   // { path: "/", element:<LandingPage/>},
    //   { path: "/sign-in", element: <SignInPage /> },
    //   { path: "/request-reset-password", element: <RequestResetPasswordPage /> },
    //   { path: "/reset-password/:token", element: <ResetPasswordPage /> },
    //   { path: "/sign-up", element: <SignUpPage /> },
    //   { path: "/products", element: <ProductsListingPage/>},
    //   { path: "/categories/:category", element: <ProductsListingPage /> },
    //   { path: "/vehicle/:subcategory", element: <ProductsListingPage /> },
    //   { path: "/computer/:subcategory", element: <ProductsListingPage /> },
    //   { path: "/product/:productId", element: <ProductDetailsPage /> },
    //   { path: "/best-sellers", element: <BestSellingProducts/> },
    //   { path: "/deals", element: <DiscountOffers/> },
    //   { path: "/checkout", element: <ProtectedRoute requiredRole="Customer"><CheckoutPage /></ProtectedRoute> },
    //   { path: "/orders", element: <ProtectedRoute requiredRole="Customer"><OrderHistoryPage /></ProtectedRoute> },
    //   { path: "/payments", element: <ProtectedRoute requiredRole="Customer"><PaymentHistoryPage /></ProtectedRoute> },
    //   { path: "/change-password", element: <ProtectedRoute requiredRole="Customer"><ChangePasswordPage /></ProtectedRoute> },
    //   { path: "/esewa-success", element: <EsewaSuccessPage /> },
    //   // { path: "/checkout", element: <CheckoutPage/> },
    ],
  },

  {
    element: <ProtectedRoute requiredRole="Admin">
      <AdminLayout />
    </ProtectedRoute>, 
    children: [
    //   { path: "/admin/dashboard", element: <AdminDashboard /> }, 
    //   { path: "/admin/products", element: <ProductManagement/> },
    //   { path: "/admin/orders", element: <OrderManagement/>},
    //   { path: "/admin/users", element: <UserManagement/> },
    //   { path: "/admin/inventory", element: <InventoryManagement/> },
    //   { path: "/admin/payments", element: <PaymentManagement/> },
    //   { path: "/admin/reports", element: <ReportingDashboard/> },
    //   { path: "/admin/delivery", element: <DeliveryManagement/> },
    //   { path: "/admin/add-category", element: <AddCategoriesPage/> },
    //   { path: "/admin/add-subcategory", element: <AddSubcategoryManagement/> },
    //   { path: "/admin/add-brands", element: <AddBrandManagement/> },
    //   { path: "/admin/settings", element: <SettingsPage/> },
      
    ],
  },
]);
