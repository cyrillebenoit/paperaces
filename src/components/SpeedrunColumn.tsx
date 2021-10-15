import React from 'react'
import {Leaderboard, LeaderboardEntry, Runner} from "../interfaces/interfaces";
import './SpeedrunColumn.css'

// function VideoButton(props: { url: string }) {
//     return <div onClick={() => window.open(props.url)}>
//         VOD
//     </div>
// }

function SpeedrunColumn(props: { data: Leaderboard, console: string, runners: Map<string, Runner> }) {
    if (!props.data[props.console]) {
        return <></>;
    }

    function formatName(id: string) {
        const runner = props.runners.get(id);
        if (!runner) {
            return <div className={"anon-runner"}>{id}</div>
        }
        return <div className={"runner"} style={{
            backgroundImage: `linear-gradient(to right, ${runner.color.left}, ${runner.color.right})`,
            fontWeight: id.length === 8 ? 'bold' : 'inherit'
        }}>{runner.name}</div>
    }

    function formatPlace(place: number) {
        return <div style={{
            margin: 'auto 0',
            padding: '0 1em',
            color: place === 1 ? '#ffc621' :
                place === 2 ? '#d4d4d4' :
                    place === 3 ? '#c17c2f' :
                        '#868686',
            fontWeight: place <= 3 ? 500 :
                'normal',
        }}>{place}</div>
    }

    function formatTime(time: number) {
        const seconds = time % 60;
        const minutes = Math.floor(time / 60) % 60;
        const hours = Math.floor(time / 3600);
        return <div className={"time"}>{hours}h{minutes < 10 ? '0' : ''}{minutes}m{seconds < 10 ? '0' : ''}{seconds}s</div>
    }

    const board = props.data[props.console]


    return (
        <div style={{flex: '1', padding: '0 1vw'}}>
            <h2 style={{textAlign: "center"}}>{props.console}</h2>
            <div className={'table-container'}>
            <table style={{
                width: "100%"
            }}>
                <tbody>
                {board.map((d: LeaderboardEntry, i: number) => {
                    return (<tr className={"lb-row"} onClick={() => window.open(d.link)} key={i}>
                        <th style={{
                            width: '5%',
                            display: "flex",
                            justifyContent: "center",
                            fontWeight: 'normal',
                            paddingRight: '1%'
                        }}>{formatPlace(d.place)}</th>
                        <th style={{
                            width: '53%',
                            display: "flex",
                            justifyContent: "center",
                            fontWeight: 'normal',
                            paddingRight: '1%'
                        }}>{formatName(d.runner)}</th>
                        <th style={{
                            width: '30%',
                            display: "flex",
                            justifyContent: "center",
                            fontWeight: 'normal'
                        }}>{formatTime(d.time)}</th>
                    </tr>);
                })}
                </tbody>
            </table>
            </div>
        </div>
    )
}

export default SpeedrunColumn