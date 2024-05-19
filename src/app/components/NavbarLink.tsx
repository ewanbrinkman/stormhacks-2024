import Link from 'next/link';

interface NavbarLinkProps {
    href: string;
    children?: React.ReactNode;
}

const NavbarLink: React.FC<NavbarLinkProps> = (props: NavbarLinkProps) => {
    return (
        <Link
            href={props.href}
            className="text-white text-xl font-semibold mx-8 transition duration-300 ease-in-out hover:text-gray-300"
        >
            {props.children}
        </Link>
    );
};

export default NavbarLink;
