export interface Alert {
    item?: string | number
    text: string
    type?: string | 'default' | 'success' | 'info' | 'danger' | 'warning' | 'light' | 'dark'
    params?: Record<string, string | number>
}