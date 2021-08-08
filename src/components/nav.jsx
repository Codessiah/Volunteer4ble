import './nav.scss';
import { Link } from 'react-router-dom';
import NavLink from './nav-link';
import SiteContext from '../utils/site-context';
import { useContext } from 'react';
import { fapp } from '../utils/firebase';

export default function Nav({ className }) {
    let { user } = useContext(SiteContext);

    return (
        <nav className={className}>
            <Link className="logo" to="/">Volunteer4ble</Link>

            <div className="context">{user ? (
                <>
                    <div className="logout" onClick={() => fapp.auth().signOut()}>Logout</div>
                    <NavLink to="/progress">Progress</NavLink>
                    <NavLink to="/logs">Logs</NavLink>
                    <NavLink to="/profile">Profile</NavLink>
                </>
            ) : (
                <>
                    <NavLink to="/login">Login</NavLink>
                    <NavLink to="/register">Sign Up</NavLink>
                </>
            )}</div>
        </nav>
    );
}
