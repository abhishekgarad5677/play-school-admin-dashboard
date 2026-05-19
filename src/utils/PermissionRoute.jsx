import { useSelector } from "react-redux";
import NotFound from "../pages/NotFound/NotFound";

const PermissionRoute = ({ path, showInSidebar, parentPath, children }) => {
  const user = useSelector((state) => state.auth.user);
  const isSuper = user?.isSuper;
  const permissions = user?.permissions || [];

  if (isSuper) return children;

  if (showInSidebar) {
    return permissions.includes(path) ? children : <NotFound />;
  }

  const hasParentAccess = parentPath && permissions.includes(parentPath);
  const hasDirectAccess = permissions.includes(path);
  const hasFallbackAccess = !parentPath && permissions.length > 0;

  return hasParentAccess || hasDirectAccess || hasFallbackAccess ? (
    children
  ) : (
    <NotFound />
  );
};

export default PermissionRoute;
