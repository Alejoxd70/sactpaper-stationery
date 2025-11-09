// import { NavFooter } from '@/components/nav-footer'
import { NavMain } from '@/components/nav-main'
import { NavUser } from '@/components/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { dashboard } from '@/routes'
import { type NavItem, type SharedData } from '@/types'
import { Link, usePage } from '@inertiajs/react'
import { LayoutGrid, ShoppingCart, Package, Users, FileText, BookOpen, UserCog } from 'lucide-react'
import AppLogo from './app-logo'

const getMainNavItems = (isAdmin: boolean): NavItem[] => [
  {
    title: 'Dashboard',
    href: dashboard(),
    icon: LayoutGrid,
  },
  {
    title: 'Ventas',
    href: '/sales',
    icon: ShoppingCart,
  },
  {
    title: 'Productos',
    href: '/products',
    icon: Package,
  },
  {
    title: 'Clientes',
    href: '/customers',
    icon: Users,
  },
  {
    title: 'Contabilidad',
    href: '/accounting',
    icon: BookOpen,
  },
  {
    title: 'Reportes',
    href: '/reports',
    icon: FileText,
  },
  ...(isAdmin
    ? [{
        title: 'Usuarios',
        href: '/users',
        icon: UserCog,
      }]
    : []),
]

// const footerNavItems: NavItem[] = [
//   {
//     title: 'PAPERSACT',
//     href: '/',
//     icon: LayoutGrid,
//   },
// ]

export function AppSidebar() {
  const { auth } = usePage<SharedData>().props
  const isAdmin = auth?.user?.role === 'admin'
  const navItems = getMainNavItems(isAdmin)

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href={dashboard()} prefetch>
                <AppLogo />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>

      <SidebarFooter>
        {/* <NavFooter items={footerNavItems} className="mt-auto" /> */}
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
