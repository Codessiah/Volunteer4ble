import './App.scss';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import SiteContext from './utils/site-context';
import Nav from './components/nav';
import FrontPage from './pages/front';
import { fapp } from './utils/firebase';
import { useEffect, useState } from 'react';
import Login from './pages/login';
import Register from './pages/register';
import SecureRoute from './utils/secure-route';
import Profile from './pages/profile';
import Progress from './pages/progress';
import Logs from './pages/logs';

const users = fapp.firestore().collection("users");

export default function App() {
    let [user, setUser] = useState(undefined);
    let [userData, setUserData] = useState(undefined);

    useEffect(() => {
        let unsub = fapp.auth().onAuthStateChanged(u => u ? loginUser(u) : logoutUser());
        return () => unsub();
    }, []);

    const loginUser = async (u) => {
        let userDoc = { exists: false };

        do {
            userDoc = await users.doc(u.uid).get();
        } while (!userDoc.exists)

        setUser(u);
        setUserData(userDoc.data());
    };

    const templateUser = (u) => { // Remove on publish
        users.doc(u.uid).update({
            logs: [
                {
                    name: "test",
                    progress: 5,
                    includeGoal: true,
                    activities: [
                        {
                            org: "test",
                            task: "testttttttttttttttttttttttttt",
                            hours: 3
                        },
                        {
                            org: "test2",
                            task: "test2222",
                            hours: 2
                        }
                    ]
                },
                {
                    name: "test2",
                    progress: 1,
                    includeGoal: true,
                    activities: [
                        {
                            org: "test22222",
                            task: "testtt2e22e",
                            hours: 1
                        }
                    ]
                }
            ]
        })
    }

    const logoutUser = () => {
        setUser(undefined);
        setUserData(undefined);
    };

    return (
        <SiteContext.Provider value={{ user, userData, setUserData }}>
            <BrowserRouter>
                <Nav />

                <main>
                    <Switch>
                        <Route exact path="/" component={FrontPage} />

                        <SecureRoute path="/login" component={Login} redirect="/" />
                        <SecureRoute path="/register" component={Register} redirect="/" />

                        <SecureRoute authed path="/progress" component={Progress} redirect="/login" />
                        <SecureRoute authed path="/logs" component={Logs} redirect="/login" />
                        <SecureRoute authed path="/profile" component={Profile} redirect="/login" />
                    </Switch>
                </main>
            </BrowserRouter>
        </SiteContext.Provider>
    );
}
