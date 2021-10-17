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
        return <>
            {runner.country && <img className={'runner-flag'} alt={runner.country}
                                    src={`https://www.speedrun.com/images/flags/${runner.country}.png`}/>}
            <div className={"runner"} style={{
                backgroundImage: `linear-gradient(to right, ${runner.color.left}, ${runner.color.right})`,
                fontWeight: id.length === 8 ? 'bold' : 'inherit'
            }}>{runner.name}</div>
        </>
    }

    function formatPlace(place: number) {
        return <div style={{
            color: place === 1 ? '#ffc621' :
                place === 2 ? '#d4d4d4' :
                    place === 3 ? '#c17c2f' :
                        '#868686',
            fontWeight: place <= 3 ? 500 :
                300,
        }}>{place}</div>
    }

    function formatTime(time: number) {
        const seconds = time % 60;
        const minutes = Math.floor(time / 60) % 60;
        const hours = Math.floor(time / 3600);
        return <div
            className={"time"}>{hours}h{minutes < 10 ? '0' : ''}{minutes}m{seconds < 10 ? '0' : ''}{seconds}s</div>
    }

    const board = props.data[props.console]


    function formatDate(date: number) {
        if (date < 0) {
            return '';
        }

        const diff = Date.now() - date;

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const months = Math.floor(days / 30);
        const years = Math.floor(months / 12);

        let content: string;

        if (years > 0) {
            content = `${years} year${years > 1 ? 's' : ''} ago`
        } else if (months > 0) {
            content = `${months} month${months > 1 ? 's' : ''} ago`
        } else if (days > 0) {
            content = `${days} day${days > 1 ? 's' : ''} ago`
        } else {
            content = 'a few moments ago'
        }

        return content
    }

    return (
        <div className={'speedrun-column'}>
            <h2 style={{textAlign: "center"}}>{props.console}</h2>
            <div className={'table-container'}>
                <table style={{
                    width: "100%"
                }}>
                    <tbody>
                    {board.map((d: LeaderboardEntry, i: number) => {
                        return (<tr className={"lb-row"} onClick={() => {
                            window.open(d.link)
                        }} onContextMenu={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (d.video) {
                                window.open(d.video)
                            }
                        }} key={i}>
                            <th>{formatPlace(d.place)}</th>
                            <th>{formatName(d.runner)}</th>
                            <th>{formatDate(d.date)}</th>
                            <th>{formatTime(d.time)}</th>
                        </tr>);
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default SpeedrunColumn