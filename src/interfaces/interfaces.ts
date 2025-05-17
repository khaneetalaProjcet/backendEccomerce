
export interface ApiResponse<T> {
    status: boolean;
    message: string;
    data?: T;
    error?: string | null;
}

export interface User {
    
}