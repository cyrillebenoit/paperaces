
export interface LeaderboardEntry {
    place: number,
    runner: string,
    time: number,
    date: number,
    link: string,
    video?: string
}

export interface Leaderboard {
    [index: string]: LeaderboardEntry[]
}

export interface Category {
    name: string,
    id: string,
    order: number,
    leaderboard: Leaderboard
}

export interface Runner {
    name: string,
    id: string,
    color: {left: string, right: string},
    link?: string,
    country?: string
}