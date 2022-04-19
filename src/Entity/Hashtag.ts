import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Post } from "./Post.js";

@Entity()
export class Hashtag {
    @PrimaryGeneratedColumn()
    id: number

    @Column("varchar", { length: 255, unique: true })
    name: string

    @ManyToMany(() => Post, post => post.hashtags)
    associatedPosts: Post[]

    associatedPostsCount?: number
}