export interface AuditLog {
    id: number;
    user_id: number | null;
    username: string;
    user_role: string;
    action: string;
    entity: string;
    entity_id: number | null;
    description: string;
    old_data: any | null;
    new_data: any | null;
    ip_address: string | null;
    created_at: string;
}