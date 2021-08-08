import './name-box.scss';
import SiteContext from '../utils/site-context';
import { useContext } from 'react';
import { fapp } from '../utils/firebase';

const users = fapp.firestore().collection("users");

export default function NameBox({ index, focus, edit, setLogIndex, setEditIndex, children }) {
    let { user, userData, setUserData } = useContext(SiteContext);

    const clickTab = () => {
        if (!focus) setEditIndex(-1);
        setLogIndex(index);
    }

    const editTab = () => setEditIndex(index);

    const looseFocus = () => setEditIndex(-1);

    const changeName = (e) => {
        e.preventDefault();

        let copy = { ...userData };
        copy.logs[index].name = e.target.name.value;
        setUserData(copy);
        setEditIndex(-1);

        users.doc(user.uid).update(copy);
    };

    const changeOrder = (e) => {
        e.stopPropagation();

        let amt = e.target.className === "up" ? -1 : 1;

        let copy = { ...userData };
        let tmp = copy.logs[index + amt];
        copy.logs[index + amt] = copy.logs[index];
        copy.logs[index] = tmp;
        setUserData(copy);
        setLogIndex(index + amt);

        users.doc(user.uid).update(copy);
    };

    return (
        <div className={`nameBox ${focus ? "focused " : ""}`} onClick={clickTab} onDoubleClick={editTab}>
            {edit ? (
                <form onSubmit={changeName}>
                    <input autoFocus name="name" defaultValue={children} onBlur={looseFocus} />
                </form>
            ) : (
                <div>
                    <div className="text" title={children}>{children}</div>

                    <div className="arrows">
                        {index > 0 ? <i className="up" onClick={changeOrder} /> : null}
                        {index < userData.logs.length - 1 ? <i className="down" onClick={changeOrder} /> : null}
                    </div>
                </div>
            )}
        </div>
    );
}