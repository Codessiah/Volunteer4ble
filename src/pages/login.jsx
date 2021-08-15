import './login.scss';
import { useState } from "react";
import InputBox from '../components/input-box';
import CheckBox from '../components/check-box';
import { fapp, firebase } from '../utils/firebase';

export default function Login() {
    let [err, setErr] = useState(undefined);

    const formSubmit = async (e) => {
        e.preventDefault();

        setErr(undefined);

        let email = e.target.email.value;
        let password = e.target.password.value;

        if (!email || !password)
            return setErr("Incomplete form");

        await fapp.auth().setPersistence(
            e.target.persist.checked ?
                firebase.auth.Auth.Persistence.LOCAL :
                firebase.auth.Auth.Persistence.SESSION
        );

        try {
            await fapp.auth().signInWithEmailAndPassword(email, password);
        } catch (error) { setErr(error.message); }

        e.target.reset();
    }

    return (
        <div className="login">
            <h1>Login</h1>

            <form onSubmit={formSubmit}>
                <div className="set1">
                    <InputBox name="email" type="text" placeholder="Email..." />
                    <InputBox name="password" type="password" placeholder="Password..." />
                </div>

                <div className="set2">
                    <CheckBox name="persist" />
                    <label>Stay logged in</label>
                </div>

                <div className="set3">{err}</div>

                <button>Login</button>
            </form>
        </div>
    );
}
