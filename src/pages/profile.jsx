import './profile.scss';
import SiteContext from '../utils/site-context';
import { useContext } from 'react';

export default function Profile() {
    let { user } = useContext(SiteContext);

    return (
        <div className="profile">
            <h1>Your profile</h1>


        </div>
    );
}