// ResponsiveNav.tsx
import { ElementType } from "react";
import { Link, useLocation } from "react-router-dom";
import { BotMessageSquare, CircleUser, Home } from "lucide-react";
import { ElementType } from "react";
import { Link, useLocation } from "react-router-dom";
import { BotMessageSquare, CircleUser, Home } from "lucide-react";

// Define your navigation items with activePaths
const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Chat with Genie", href: "/chat", icon: BotMessageSquare },
  { name: "Profile", href: "/profile", icon: CircleUser },
];

export const ResponsiveNav = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <>
      {/* Sidebar for large screens */}
      <div className="z-30 hidden border-r-2 lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <nav className="flex flex-1 flex-col p-4">
          {/* Center the navigation items vertically */}
          <div className="flex h-full flex-col justify-center space-y-4">
            {navItems.map((item) => (
              <NavItem key={item.href} item={item} pathname={pathname} />
            ))}
          </div>
        </nav>
      </div>
      return (
      <>
        {/* Sidebar for large screens */}
        <div className="z-30 hidden border-r-2 lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
          <nav className="flex flex-1 flex-col p-4">
            {/* Center the navigation items vertically */}
            <div className="flex h-full flex-col justify-center space-y-4">
              {navItems.map((item) => (
                <NavItem key={item.href} item={item} pathname={pathname} />
              ))}
            </div>
          </nav>
        </div>

        {/* Floating bottom tab bar for medium screens and below */}
        <div className="fixed bottom-4 left-4 right-4 z-50 md:mx-4 lg:hidden">
          <nav className="flex justify-around rounded-full bg-primary p-2 shadow-lg">
            {navItems.map((item) => (
              <BottomNavItem key={item.href} item={item} pathname={pathname} />
            ))}
          </nav>
        </div>
      </>
      );
      {/* Floating bottom tab bar for medium screens and below */}
      <div className="fixed bottom-4 left-4 right-4 z-50 md:mx-4 lg:hidden">
        <nav className="flex justify-around rounded-full bg-primary p-2 shadow-lg">
          {navItems.map((item) => (
            <BottomNavItem key={item.href} item={item} pathname={pathname} />
          ))}
        </nav>
      </div>
    </>
  );
};

interface NavItemProps {
  item: { name: string; href: string; icon: ElementType };
  pathname: string;
  onClick?: () => void;
}

const NavItem = ({ item, pathname, onClick }: NavItemProps) => {
  const isActive = pathname === item.href;
  const Icon = item.icon;

  const linkClasses = `flex items-center space-x-4 px-4 py-4 rounded-md transition-colors ${isActive
      ? "bg-primary text-white"
      : "dark:text-orange-200 hover:bg-orange-400 hover:text-foreground"
    }`;
  const linkClasses = `flex items-center space-x-4 px-4 py-4 rounded-md transition-colors ${isActive
      ? "bg-primary text-white"
      : "dark:text-orange-200 hover:bg-orange-400 hover:text-foreground"
    }`;

  return (
    <Link to={item.href} onClick={onClick} className={linkClasses}>
      <Icon className="h-8 w-8" />
      <span className="hidden lg:inline">{item.name}</span>
    </Link>
  );
  return (
    <Link to={item.href} onClick={onClick} className={linkClasses}>
      <Icon className="h-8 w-8" />
      <span className="hidden lg:inline">{item.name}</span>
    </Link>
  );
};

interface BottomNavItemProps {
  item: { name: string; href: string; icon: ElementType };
  pathname: string;
}

interface BottomNavItemProps {
  item: { name: string; href: string; icon: ElementType };
  pathname: string;
}

const BottomNavItem = ({ item, pathname }: BottomNavItemProps) => {
  const isActive = pathname === item.href;
  const Icon = item.icon;

  const linkClasses = `flex gap-1 items-center justify-center py-2 px-6 rounded-full transition-colors ${isActive
      ? "bg-orange-700 text-white"
      : "text-orange-200 hover:bg-orange-700 hover:text-foreground"
    }`;
  const linkClasses = `flex gap-1 items-center justify-center py-2 px-6 rounded-full transition-colors ${isActive
      ? "bg-orange-700 text-white"
      : "text-orange-200 hover:bg-orange-700 hover:text-foreground"
    }`;

  return (
    <Link to={item.href} className={linkClasses}>
      <Icon className="mb-1 h-6 w-6 flex-shrink-0" />
      {isActive && <span className="text-xs font-medium">{item.name}</span>}
      <span className="sr-only">{item.name}</span>
    </Link>
  );
  return (
    <Link to={item.href} className={linkClasses}>
      <Icon className="mb-1 h-6 w-6 flex-shrink-0" />
      {isActive && <span className="text-xs font-medium">{item.name}</span>}
      <span className="sr-only">{item.name}</span>
    </Link>
  );
};
