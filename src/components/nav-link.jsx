import './nav-link.scss';
import { Link } from 'react-router-dom';

export default function NavLink({ children, ...props }) {
    return (
        <Link className="navLink" {...props}>{children}</Link>
    );
}
