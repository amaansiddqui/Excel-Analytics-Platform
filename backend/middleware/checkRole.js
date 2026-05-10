const checkRole = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(403).json({ message: "Access denied: Authentication required" });
    }

    const roleHierarchy = {
      'user': 1,
      'admin': 2,
      'superadmin': 3
    };

    const userRoleLevel = roleHierarchy[req.user.role] || 0;
    const requiredRoleLevel = roleHierarchy[requiredRole] || 0;

    if (userRoleLevel < requiredRoleLevel) {
      return res.status(403).json({ message: "Access denied: Insufficient permissions" });
    }

    next();
  };
};

export default checkRole;
