import { Entity, ManyToMany, PrimaryColumn } from "typeorm";
import { Post } from "./Post";

@Entity()
export class Hashtag {
    @PrimaryColumn()
    name: string

    @ManyToMany(() => Post, post => post.hashtags)
    associatedPosts: Post[]
}