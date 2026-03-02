export declare class CreatePostDto {
    sql_user_id: string;
    type: 'image' | 'audio';
    title: string;
    content?: string;
    description?: string;
    provider?: string;
}
