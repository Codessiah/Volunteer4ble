import './register.scss';
import InputBox from '../components/input-box';
import { useState } from 'react';
import { fapp, firebase } from '../utils/firebase';

const users = fapp.firestore().collection("users");

export default function Register() {
    let [err, setErr] = useState(undefined);
    let [unfilled, setUnfilled] = useState(-1);

    const validateEmail = (email) => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    const validatePassword = (password) => {
        const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/;
        return re.test(String(password));
    }

    const formSubmit = async (e) => {
        e.preventDefault();

        setErr(undefined);
        setUnfilled(-1);

        let email = e.target.email.value;
        let name = e.target.name.value;
        let password = e.target.password.value;

        if (!email) return setUnfilled(0);
        if (!name) return setUnfilled(1);
        if (!password) return setUnfilled(2);

        if (!validateEmail(email)) {
            setErr("Invalid email format");
            setUnfilled(0);
            return;
        }

        if (!validatePassword(password)) {
            setErr("Invalid password format; Minimum 8 and maximum 10 characters, at least one uppercase letter, one lowercase letter, one number and one special character");
            setUnfilled(2);
            return;
        }

        try {
            await fapp.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);

            let res = await fapp.auth().createUserWithEmailAndPassword(email, password);

            await users.doc(res.user.uid).set({
                name,
                goal: 0,
                logs: []
            });
        } catch (error) { setErr(error.message); }

        e.target.reset();
    }

    return (
        <div className="register">
            <h1>Sign Up</h1>

            <form onSubmit={formSubmit}>
                <div className="set1">
                    <InputBox name="email" type="text" placeholder="Email..." invalid={unfilled === 0} />
                    <InputBox name="name" type="text" placeholder="Full name..." invalid={unfilled === 1} />
                    <InputBox name="password" type="password" placeholder="Password..." invalid={unfilled === 2} />
                </div>

                <div className="set2">{err}</div>

                <button>Sign Up</button>
            </form>
        </div>
    );
}
