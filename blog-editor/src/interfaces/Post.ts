/** @format */
import { ContentElement } from '@/interfaces/ContentElement';

export interface Post {
    id: string;
    created_at: string;
    updated_at: string;
    title: string;
    description: ContentElement[];
    content: ContentElement[];
    published_at: string | null;
    image: string;
    permalink: string;
    author?: {
        name: string,
        picture: string,
    };
}
