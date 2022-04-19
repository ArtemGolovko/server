import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Post } from "./Post.js";
import { Reply } from "./Reply.js";
import { User } from "./User.js";

@Entity()
export class Comment {
    @PrimaryGeneratedColumn()
    id: number

    @Column("text")
    text: string

    @ManyToOne(() => User, user => user.comments)
    author: User

    @ManyToOne(() => Post, post => post.comments)
    post: Post

    @ManyToMany(() => User, user => user.commentsLiked)
    @JoinTable()
    likes: User[]

    @ManyToOne(() => Reply, reply => reply.comment)
    replies: Reply[]

    likesCount?: number

    addLike(user: User) {
        if (this.likes == null) {
            this.likes = new Array<User>();
        }
        this.likes.push(user);
    }

    removeLike(user: User) {
        if (this.likes == null) {
            this.likes = new Array<User>();
        }

        this.likes = this.likes.filter(currentUser => {
            return currentUser.username !== user.username; 
        })
    }
}