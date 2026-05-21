export type Tresponse<T> = {
    status: number,
    success: boolean,
    message: string,
    data?: T,
    error?: unknown
}