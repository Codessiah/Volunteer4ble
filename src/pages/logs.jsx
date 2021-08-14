import './logs.scss';
import SiteContext from '../utils/site-context';
import { useContext, useEffect, useState } from 'react';
import NameBox from '../components/name-box';
import { fapp, storageRef } from '../utils/firebase';
import { nanoid } from 'nanoid';
import ActivityBox from '../components/activity-box';

const users = fapp.firestore().collection("users");

export default function Logs() {
    let { user, userData, setUserData } = useContext(SiteContext);
    const storage = storageRef.child(user.uid);

    let [logIndex, setLogIndex] = useState(0);
    let [editIndex, setEditIndex] = useState(-1);

    let [actIndex, setActIndex] = useState(-1);

    let [proofIndex, setProofIndex] = useState(-1);
    let [download, setDownload] = useState(undefined);

    const addLog = () => {
        let copy = { ...userData };
        copy.logs.push({
            name: "Unnamed log",
            includeGoal: true,
            activities: []
        });
        setUserData(copy);

        if (logIndex <= -1) setLogIndex(0);
        if (logIndex >= userData.logs.length) setLogIndex(logIndex - 1);

        users.doc(user.uid).update(copy);
    };

    const includeLog = () => {
        let copy = { ...userData };
        copy.logs[logIndex].includeGoal = !copy.logs[logIndex].includeGoal;
        setUserData(copy);

        users.doc(user.uid).update(copy);
    };

    const printLog = () => {
        let acts = "", hours = 0;
        userData.logs[logIndex].activities.forEach(v => {
            acts += `
                <div><p>${v.org}</p></div>
                <div><p>${v.task}</p></div>
                <div><p>${v.hours}</p></div>
            `;

            hours += v.hours;
        });

        let content = `
            <html>
                <head>
                    <link rel="preconnect" href="https://fonts.googleapis.com">
                    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                    <link href="https://fonts.googleapis.com/css2?family=Otomanopee+One&display=swap" rel="stylesheet">

                    <style>
                        h1 { margin: 10px 0 }
                        h2 { margin: 50px 0 10px 0 }
                        h3 { margin: 5px }
                        h4 { margin: 0 }
                        p { margin: 0 }

                        body {
                            font-family: 'Otomanopee One', sans-serif;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                        }

                        .grid {
                            margin-top: 40px;
                            display: grid;
                            width: 80%;
                            border: 1px solid black;
                            grid-template-columns: 1fr 2fr 1fr;
                            column-gap: 10px;
                            grid-template-rows: 50px;
                            padding: 10px;
                        }

                        .grid .header {
                            color: white;
                        }

                        .grid div {
                            display: flex;
                            min-width: 0;
                            align-items: center;
                            justify-content: center;
                        }

                        .grid div p {
                            text-overflow: ellipsis;
                            overflow: hidden;
                            white-space: nowrap;
                        }
                    </style>
                </head>

                <body>
                    <h1>${userData.logs[logIndex].name}</h1>
                    <h3>Name: ${userData.name}</h3>

                    <div class="grid">
                        <div><p class="header">Organization</p></div>
                        <div><p class="header">Task</p></div>
                        <div><p class="header">Hours</p></div>

                        ${acts}
                    </div>
                    
                    <h2>Total hours: ${hours}</h2>
                    <h4>Track down your good deeds with</h3>
                    <h4>Volunteer4ble</h3>
                </body>
            </html>
        `;

        let printFrame = document.createElement("iframe");
        printFrame.id = "toprint";
        printFrame.name = "toprint";
        printFrame.srcdoc = content;
        printFrame.className = "hideSafely";
        document.getElementsByClassName("container")[0].appendChild(printFrame);

        printFrame.focus();
        window.frames["toprint"].focus();
        window.frames["toprint"].print();

        window.frames["toprint"].onafterprint = () => printFrame.remove();
    };

    const deleteLog = (e) => {
        if (userData.logs[logIndex].activities.length > 0 && !e.shiftKey) {
            let ask = confirm(`Are you sure you want to remove ${userData.logs[logIndex].name}`);

            if (!ask) return;
        }

        let copy = { ...userData };
        copy.logs.splice(logIndex, 1);
        setUserData(copy);

        if (logIndex <= -1) setLogIndex(0);
        if (logIndex >= userData.logs.length) setLogIndex(logIndex - 1);

        users.doc(user.uid).update(copy);
    };

    const addActivity = () => {
        let copy = { ...userData };
        copy.logs[logIndex].activities.push({
            org: "Unknown",
            task: "",
            hours: 0,
            proof: null
        });
        setUserData(copy);

        users.doc(user.uid).update(copy);
    };

    const editActivity = (index, org, task, hours) => {
        let copy = { ...userData };
        copy.logs[logIndex].activities[index] = { org, task, hours };
        setUserData(copy);

        users.doc(user.uid).update(copy);
    };

    const openProof = async (index) => {
        if (userData.logs[logIndex].activities[index].proof) {
            let url = await storage.child(userData.logs[logIndex].activities[index].proof).getDownloadURL();
            setDownload(url);
        }

        setProofIndex(index);
    };

    const resetProof = () => {
        storage.child(userData.logs[logIndex].activities[proofIndex].proof).delete();

        let copy = { ...userData };
        copy.logs[logIndex].activities[proofIndex].proof = null;
        setUserData(copy);
        setDownload(undefined);

        users.doc(user.uid).update(copy);
    }

    const proveActivity = async (e) => {
        let fid = nanoid() + "-" + e.target.files[0].name;
        await storage.child(fid).put(e.target.files[0]);

        let copy = { ...userData };
        copy.logs[logIndex].activities[proofIndex].proof = fid;
        setUserData(copy);
        setProofIndex(-1);

        users.doc(user.uid).update(copy);
    };

    const deleteActivity = (index) => {
        let copy = { ...userData };
        copy.logs[logIndex].activities.splice(index, 1);
        setUserData(copy);

        users.doc(user.uid).update(copy);
    };

    return (
        <div className="logs">
            <h1>Logs</h1>

            {proofIndex === -1 || (
                <>
                    <div className="overlay" onClick={() => setProofIndex(-1)} />

                    <div className="editBox">
                        {userData.logs[logIndex].activities[proofIndex].proof ? (
                            <div>
                                <a download="file.txt" href={download} target="_blank">Download</a>
                                <button onClick={resetProof}>Reset</button>
                            </div>
                        ) : (
                            <>
                                <input className="hideSafely" type="file" name="file" id="file" onChange={proveActivity} />
                                <label for="file">Choose file</label>
                            </>
                        )}
                    </div>
                </>
            )}

            {userData.logs.length ? (
                <div className="container" disabled={proofIndex > -1}>
                    <div className="tabs" disabled={actIndex > -1}>
                        {userData.logs.map((v, i) => <NameBox index={i} focus={i === logIndex} edit={i === editIndex} setLogIndex={setLogIndex} setEditIndex={setEditIndex}>{v.name}</NameBox>)}
                        <div className="addButton" onClick={addLog}>+</div>
                    </div>

                    <div className="console">
                        <div className="activities">
                            <div className="header"><p>Organization</p></div>
                            <div className="header"><p>Task</p></div>
                            <div className="header"><p>Hours</p></div>
                            <div className="header"><p>Actions</p></div>

                            {!(-1 < logIndex && logIndex < userData.logs.length) || (
                                <>
                                    {userData.logs[logIndex].activities.map((v, i) => <ActivityBox index={i} actIndex={actIndex} setActIndex={setActIndex} openProof={openProof} deleteActivity={deleteActivity} editActivity={editActivity}>{v}</ActivityBox>)}
                                </>
                            )}
                        </div>

                        <div className="actions">
                            <button onClick={() => addActivity()}>Add</button>
                            <button className={(-1 < logIndex && logIndex < userData.logs.length) ? userData.logs[logIndex].includeGoal ? "on" : null : null} onClick={includeLog}>Include</button>
                            <button onClick={printLog}>Print</button>
                            <button onClick={deleteLog}>Delete</button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="startOff">
                    <p>Start off by making your first log!</p>
                    <button onClick={addLog}>Create</button>
                </div>
            )}
        </div>
    );
}
