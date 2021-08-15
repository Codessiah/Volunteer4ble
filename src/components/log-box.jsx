import './log-box.scss';
import SiteContext from '../utils/site-context';
import { useContext } from 'react';
import { fapp } from '../utils/firebase';

const users = fapp.firestore().collection("users");

export default function LogBox({ log, index }) {
    let { user, userData, setUserData } = useContext(SiteContext);

    const getSum = () => {
        let s = 0;

        for (let act of log.activities) {
            s += act.hours;
        }

        return s;
    };

    const toggleInclude = () => {
        let copy = { ...userData };
        copy.logs[index].includeGoal = !copy.logs[index].includeGoal;
        setUserData(copy);

        users.doc(user.uid).update(copy);
    };

    let sum = getSum();

    return (
        <div className="logBox" title={`${log.name} : ${sum} hours completed`} includeGoal={String(log.includeGoal)} onClick={toggleInclude}>
            <h3>{log.name}</h3>
            <p>{sum} hours completed</p>
        </div>
    );
}