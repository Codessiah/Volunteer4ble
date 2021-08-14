import './profile.scss';
import SiteContext from '../utils/site-context';
import { useContext } from 'react';
import InputBox from '../components/input-box';
import { fapp } from '../utils/firebase';

const users = fapp.firestore().collection("users");

export default function Profile() {
    let { user, userData, setUserData } = useContext(SiteContext);

    const saveName = (e) => {
        e.preventDefault();

        let newname = e.target.name.value;

        if (newname.length === 0) {
            alert("Please enter a valid name!");
            return;
        }

        let copy = { ...userData };
        copy.name = newname;
        setUserData(copy);

        users.doc(user.uid).update({ name: newname });

        e.target.reset();
    }

    return (
        <div className="profile">
            <div>
                <h1>Your profile</h1>

                <form onSubmit={saveName}>
                    <div>
                        <label>Name</label>
                        <button>Save</button>
                    </div>

                    <InputBox name="name" placeholder={userData.name} />
                </form>
            </div>
        </div>
    );
}