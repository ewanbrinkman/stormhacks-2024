import NavbarLink from '@components/NavbarLink';

const Navbar: React.FC = () => {
    return (
        <nav className="bg-blue-400 p-4">
            <div className="flex justify-between sm:justify-start items-center">
                <NavbarLink href="/">Home</NavbarLink>
                <NavbarLink href="/resources">Resources</NavbarLink>
            </div>
        </nav>
    );
};

export default Navbar;
