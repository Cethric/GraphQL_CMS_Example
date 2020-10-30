/** @format */
import { ContentElement } from '@/interfaces/ContentElement';

export interface PostHistory {
    title: string;
    content: ContentElement[];
    description: ContentElement[];
}

export interface PostAuthor {
    name: string;
    picture: string;
}

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
    author?: PostAuthor;
    post_histories?: PostHistory[];
}
