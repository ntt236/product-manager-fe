import { Outlet } from 'react-router-dom';
import UserHeader from './UserHeader';
import UserFooter from './UserFooter';
import CartDrawer from '../../components/common/CartDrawer';

export default function UserLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-900 text-neutral-100">
      <UserHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <UserFooter />
      <CartDrawer />
    </div>
  );
}

