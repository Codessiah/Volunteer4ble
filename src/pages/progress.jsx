import './progress.scss';
import { ChartDonutUtilization } from '@patternfly/react-charts';
import SiteContext from '../utils/site-context';
import { useContext } from 'react';
import { useState } from 'react';
import { fapp } from '../utils/firebase';

const users = fapp.firestore().collection("users");

export default function Progress() {
    let { user, userData, setUserData } = useContext(SiteContext);

    let [num, setNum] = useState(userData.goal);

    const changeNum = (e) => saveNum(e.target.value);

    const saveNum = numm => {
        let newnum = Math.floor(Number(numm));

        if (isNaN(newnum) || newnum < 0) return;
        setNum(newnum);

        let copy = { ...userData };
        copy.goal = newnum;
        setUserData(copy);

        users.doc(user.uid).update({ goal: newnum });
    }

    const getSum = () => {
        let s = 0;

        for (let log of userData.logs) {
            for (let act of log.activities) {
                s += act.hours;
            }
        }

        return s;
    }

    let sum = getSum();
    let percentage = userData.goal ? Math.floor(sum / userData.goal * 100) > 100 ? 100 : Math.floor(sum / userData.goal * 100) : 0;

    return (
        <div className="progress">
            <div className="chart">
                <ChartDonutUtilization
                    constrainToVisibleArea={true}
                    data={{ x: 'Finished hours', y: percentage }}
                    subTitle={percentage !== 100 ? `${sum} / ${userData.goal}` : "You made it!"}
                    title={`${percentage}%`}
                    labels={({ datum }) => datum.x ? "Finished" : "Unfinished"}
                />
            </div>

            <h1>Configuration</h1>

            <div className="conf">
                <button onClick={() => saveNum(num - 1)}>-</button>
                <input value={num} onChange={changeNum} />
                <button onClick={() => saveNum(num + 1)}>+</button>
            </div>
        </div>
    );
}