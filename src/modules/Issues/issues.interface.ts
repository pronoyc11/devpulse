export interface Tissues {
    title: string,
    description: string,
    type: string,
    status?: string
}

export interface TissuesFull {
    title?: string,
    description?: string,
    type?: string,
    status?: string,
    created_at?: string,
    updated_at?: string
}