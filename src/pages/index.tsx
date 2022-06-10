import React, {useState} from 'react'
import './index.css'
import SpeedrunColumn from "components/SpeedrunColumn";
import {Category, Leaderboard, Runner} from "../interfaces/interfaces";
import fetch from "node-fetch";
import LoadingScreen from "components/LoadingScreen";

export default () => {
    // State
    const [state, setState] = useState({
        categories: [],
        active: undefined,
    });
    const [runners, setRunners] = useState({
        runners: new Map<string, Runner>(),
        missing: new Set<string>(),
    });

    const consoleVariableId = 'r8r5y2le';
    const consoles = [
        {id: 'jq6vjo71', name: "N64"},
        {id: '5lm2934q', name: "Wii VC"},
        {id: '81w7k25q', name: "Wii U VC"},
        {id: 'jqz2x3kq', name: "Switch VC"}
    ]

    function fetchRunners(missingRunners: Set<string>, runPromises: Promise<void>[], stillMissing: Set<string>, newRunners: Map<string, Runner>): void {
        for (const r of missingRunners) {
            runPromises.push(fetch(`https://www.speedrun.com/api/v1/users/${r}`)
                .then((res: any) => res.json())
                .then((response: any) => {
                    if (!response.data) {
                        console.error("Could not find runner with id", r, response)
                        stillMissing.add(r);
                        return
                    }

                    const {data} = response;
                    newRunners.set(data.id, {
                        id: data.id,
                        name: data.names && data.names.international ? data.names.international : 'Anonymous',
                        color: {
                            left: data["name-style"] && data["name-style"]["color-from"] && data["name-style"]["color-from"].dark ? data["name-style"]["color-from"].dark : '#fff',
                            right: data["name-style"] && data["name-style"]["color-to"] && data["name-style"]["color-to"].dark ? data["name-style"]["color-to"].dark : '#fff'
                        },
                        country: data.location && data.location.country && data.location.country.code || undefined,
                        link: data.weblink
                    });
                    return;
                })
                .catch(console.error)
            )
        }
    }

// Fetch Categories
    if (state.active === undefined) {
        fetch('https://www.speedrun.com/api/v1/games/pdvzq96w/categories')
            .then((res: any) => res.json())
            .then(({data}: any) => {
                const missingRunners = new Set<string>();
                let newCategories: Category[] = [];
                let newRunners: Map<string, Runner> = new Map();
                let catPromises: Promise<void>[] = [];
                let runPromises: Promise<void>[] = [];
                for (let cIndex = 0; cIndex < data.length; cIndex++) {
                    // For each category
                    let c = data[cIndex];
                    if (c.type === 'per-game') {
                        // Create a promise to indicate all runs (of all consoles) have been fetched
                        catPromises.push(new Promise<void>(resolve => {
                            let leaderboard: Leaderboard = {};
                            let lbPromises: (Promise<void>)[] = [];
                            for (const consoleVar of consoles) {
                                // For each console
                                // Create a promise to indicate runs have been fetched for that console
                                lbPromises.push(
                                    fetch(`https://www.speedrun.com/api/v1/leaderboards/pm64/category/${c.id}?var-${consoleVariableId}=${consoleVar.id}`)
                                        .then((r: any) => r.json())
                                        .then((lb: { data: any }) => {
                                            leaderboard[consoleVar.name] = lb.data.runs.map((entry: any) => {
                                                let wasGuest = false;
                                                let randomID = (Math.random() + 1).toString(36).substring(2);
                                                if (entry.run.players[0].rel === 'guest') {
                                                    wasGuest = true;
                                                    newRunners.set(randomID, {
                                                        id: randomID,
                                                        name: entry.run.players[0].name,
                                                        color: {
                                                            left: '#fff',
                                                            right: '#fff'
                                                        },
                                                        country: undefined,
                                                        link: undefined
                                                    })
                                                } else {
                                                    missingRunners.add(entry.run.players[0].id);
                                                }
                                                return {
                                                    place: entry.place,
                                                    runner: wasGuest ? randomID : entry.run.players[0].id,
                                                    time: entry.run.times.primary_t,
                                                    date: entry.run.date ? Date.parse(entry.run.date) : -1,
                                                    link: entry.run.weblink,
                                                    video: entry.run.videos && entry.run.videos.links && entry.run.videos.links.length > 0 ? entry.run.videos.links[0].uri : undefined
                                                }
                                            })
                                        })
                                        .catch(console.error)
                                );
                            }
                            let stillMissing: Set<string> = new Set();
                            Promise.all(lbPromises).then(() => {
                                fetchRunners(missingRunners, runPromises, stillMissing, newRunners);

                                setTimeout(() => {
                                    Promise.all([...catPromises, ...runPromises])
                                        .then(() => {
                                            setState({
                                                categories: newCategories,
                                                active: newCategories.find(c => c.order === 0),
                                            });
                                            setRunners({
                                                runners: newRunners,
                                                missing: stillMissing
                                            });
                                        }).catch(console.error);
                                }, 5000);

                                newCategories.push({
                                    name: c.name,
                                    id: c.id,
                                    order: cIndex,
                                    leaderboard: leaderboard
                                })
                                resolve();
                            }).catch(console.error)
                        }))
                    }
                }
            })
            .catch(console.error)
    }

    if (runners.missing.size > 0) {
        let runPromises: Promise<void>[] = [];
        let newMissing: Set<string> = new Set();
        fetchRunners(runners.missing, runPromises, newMissing, runners.runners);
        setTimeout(() => {
            Promise.all(runPromises)
                .then(() => {
                    setRunners({
                        runners: runners.runners,
                        missing: newMissing
                    });
                }).catch(console.error);
        }, 5000);
    }

    // Render
    return (
        state.active ? <>
                <div className={'container'}>
                    <div className={'header'}>
                        {state.categories.sort((a, b) => a.order - b.order).map((c, i) =>
                            <a key={i} className={state.active === c ? 'active' : 'inactive'}
                               onClick={() => setState({
                                   categories: state.categories,
                                   active: c
                               })}>{c.name}</a>)}
                    </div>
                    <div className={'content'}>
                        <div style={{display: 'flex', justifyContent: 'center', flexWrap: "wrap", height: '100%'}}>
                            {state.active && state.active.leaderboard ? consoles.map(c => {
                                return (
                                    state.active.leaderboard[c.name].length > 0 ?
                                        <SpeedrunColumn data={state.active.leaderboard} console={c.name}
                                                        runners={runners.runners}
                                                        key={c.id}/> : <div key={c.id}/>
                                )
                            }) : <></>}
                        </div>
                    </div>
                    {/*Site under construction*/}
                    {/*Left click an entry to open the SRC page for the run*/}
                    {/*Right click an entry to open the video for the run*/}
                </div>
            </>
            : <LoadingScreen text={"Please wait while we fetch the data from Speedrun.com"}/>
    )
}
