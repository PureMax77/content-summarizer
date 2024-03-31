import React, { useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from "@nextui-org/react";
import { AcmeLogo } from "./Image/Logo";
import { useRouter } from "next/router";
import { PagePath } from "@/constants/common";

export default function Header() {
  const route = useRouter();

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const isSearch = route.pathname === PagePath.SEARCH;
  const isDirect = route.pathname === PagePath.DIRECTURL;

  const menuItems = [
    { title: "검색 요약", path: PagePath.SEARCH },
    { title: "URL 요약", path: PagePath.DIRECTURL },
  ];

  return (
    <Navbar isBordered onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <Link href={PagePath.ORIGIN} color="foreground">
            <AcmeLogo />
            <p className="font-bold text-inherit">Home</p>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem isActive={isSearch}>
          <Link
            color={isSearch ? "primary" : "foreground"}
            href={PagePath.SEARCH}
          >
            검색 요약
          </Link>
        </NavbarItem>
        <NavbarItem isActive={isDirect}>
          <Link
            color={isDirect ? "primary" : "foreground"}
            href={PagePath.DIRECTURL}
            // aria-current="page"
          >
            URL 요약
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        {/* <NavbarItem className="hidden lg:flex">
          <Link href="#">Login</Link>
        </NavbarItem>
        <NavbarItem>
          <Button as={Link} color="primary" href="#" variant="flat">
            Sign Up
          </Button>
        </NavbarItem> */}
      </NavbarContent>

      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem
            key={`${item}-${index}`}
            isActive={route.pathname === item.path}
          >
            <Link
              color={route.pathname === item.path ? "primary" : "foreground"}
              className="w-full"
              href={item.path}
              size="lg"
            >
              {item.title}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
