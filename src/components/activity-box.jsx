import { useState } from "react";

export default function ActivityBox({ index, actIndex, setActIndex, openProof, deleteActivity, editActivity, children }) {
    let [org, setOrg] = useState(children.org);
    let [task, setTask] = useState(children.task);
    let [hours, setHours] = useState(children.hours);

    const keyPress = (e) => e.key === 'Enter' && saveActivity();

    const saveActivity = () => {
        let conv = Number(hours);

        if (conv === isNaN || conv < 0) conv = 0;

        editActivity(index, org, task, conv);
        setActIndex(-1);

        setHours(conv);
    };

    if (index === actIndex) return (
        <>
            <input autoFocus value={org} onChange={e => setOrg(e.target.value)} onKeyPress={keyPress} />
            <input value={task} onChange={e => setTask(e.target.value)} onKeyPress={keyPress} />
            <input value={hours} onChange={e => setHours(e.target.value)} onKeyPress={keyPress} />
            <div>
                <span onClick={saveActivity} title="Save">✅</span>
                <span onClick={() => setActIndex(-1)} title="Cancel">🛑</span>
            </div>
        </>
    );

    if (actIndex === -1) return (
        <>
            <div title={children.org}><p>{children.org}</p></div>
            <div title={children.task}><p>{children.task}</p></div>
            <div title={children.hours}><p>{children.hours}</p></div>
            <div>
                <span onClick={() => setActIndex(index)} title="Edit">🔧</span>
                <span onClick={() => openProof(index)} title="Proof">{children.proof ? "🗂️" : "📁"}</span>
                <span onClick={() => deleteActivity(index)} title="Delete">❌</span>
            </div>
        </>
    );

    return (
        <>
            <div title={children.org}><p>{children.org}</p></div>
            <div title={children.task}><p>{children.task}</p></div>
            <div title={children.hours}><p>{children.hours}</p></div>
            <div></div>
        </>
    )
}
