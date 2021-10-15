import React, {useState} from 'react'
import './index.css'
import SpeedrunColumn from "components/SpeedrunColumn";
import {Category, Leaderboard, Runner} from "../interfaces/interfaces";
import fetch from "node-fetch";

export default () => {
    // State
    const [categories, setCategories] = useState({categories: [], active: undefined, runners: new Map()});

    const consoleVariableId = 'r8r5y2le';
    const consoles = [
        {id: 'jq6vjo71', name: "N64"},
        {id: '5lm2934q', name: "Wii VC"},
        {id: '81w7k25q', name: "Wii U VC"}
    ]

    // Fetch Categories
    if (categories.active === undefined) {
        fetch('https://www.speedrun.com/api/v1/games/pdvzq96w/categories')
            .then((res: any) => res.json())
            .then(({data}:any) => {
                const missingRunners = new Set<string>();
                let newCategories: Category[] = [];
                let newRunners: Map<string, Runner> = new Map();
                let catPromises: Promise<void>[] = [];
                let runPromises: Promise<void>[] = [];
                for (let cIndex = 0; cIndex<data.length; cIndex ++) {
                    let c = data[cIndex];
                    if (c.type === 'per-game') {
                        catPromises.push(new Promise<void>(resolve => {
                            let leaderboard: Leaderboard = {};
                            let lbPromises: (Promise<void>)[] = [];
                            for (const consoleVar of consoles) {
                                // get leaderboard for that console in selected category
                                lbPromises.push(
                                    fetch(`https://www.speedrun.com/api/v1/leaderboards/pm64/category/${c.id}?var-${consoleVariableId}=${consoleVar.id}`)
                                        .then((r:any) => r.json())
                                        .then((lb:{data: any}) => {
                                            leaderboard[consoleVar.name] = lb.data.runs.map((entry: any) => {
                                                let wasGuest = false;
                                                let randomID = (Math.random() + 1).toString(36).substring(7);
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
                                                    link: entry.run.weblink,
                                                    video: entry.run.videos && entry.run.videos.links && entry.run.videos.links.length > 0 ? entry.run.videos.links[0].uri : undefined
                                                }
                                            })
                                            return;
                                        })
                                        .catch(console.error)
                                );
                            }
                            Promise.all(lbPromises).then(() => {
                                missingRunners.forEach(r => {
                                    runPromises.push(fetch(`https://www.speedrun.com/api/v1/users/${r}`)
                                        .then((res:any) => res.json())
                                        .then(({data}:any) => {
                                            if (!data) {
                                                return
                                            }

                                            newRunners.set(data.id, {
                                                id: data.id,
                                                name: data.names && data.names.international ? data.names.international : 'Anonymous',
                                                color: {
                                                    left: data["name-style"] && data["name-style"]["color-from"] && data["name-style"]["color-from"].dark ? data["name-style"]["color-from"].dark : '#fff',
                                                    right: data["name-style"] && data["name-style"]["color-to"] && data["name-style"]["color-to"].dark ? data["name-style"]["color-to"].dark : '#fff'
                                                },
                                                country: data.location && data.location.country && data.location.country.code || undefined,
                                                link: data.weblink
                                            })
                                        })
                                        .catch(console.error)
                                    )
                                })

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


                Promise.all(catPromises.concat(runPromises))
                    .then(() => {
                        setCategories({categories: newCategories, active: newCategories.find(c => c.order === 0), runners: newRunners});
                    }).catch(console.error)
            }).catch(console.error)
    }

    // Render
    return (
        <div className={'container'}>
            <div className={'header'}>
                {categories.categories.sort((a,b)=> a.order - b.order).map((c, i) =>
                    <a key={i} className={categories.active === c ? 'active' : 'inactive'}
                       onClick={() => setCategories({
                           categories: categories.categories,
                           active: c,
                           runners: categories.runners
                       })}>{c.name}</a>)}
            </div>
            <div className={'content'}>
                <div style={{display: 'flex', justifyContent: 'center', flexWrap: "wrap"}}>
                    {categories.active && categories.active.leaderboard ? consoles.map(c =>
                        <SpeedrunColumn data={categories.active.leaderboard} console={c.name}
                                        runners={categories.runners}
                                        key={c.id}/>
                    ) : <></>}
                </div>
            </div>
        </div>
    )
}