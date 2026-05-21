export type Tresponse<T> = {
    status: number,
    success: boolean,
    message: string,
    data?: T,
    error?: unknown
}

export type ROLES = "contributor" | "maintainer";


export type JwtPayload = {
    id: number,
    name: string,
    role: string
}

export type Query = {
    sort?: 'newest' | "oldest",
    type?: 'bug' | 'feature_request',
    status?: 'open' | 'in_progress' | 'resolved'
};