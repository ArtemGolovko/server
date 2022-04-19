import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Comment } from "./Comment.js";
import { User } from "./User.js";

@Entity()
export class Reply {
    @PrimaryGeneratedColumn()
    id: number

    @Column("text")
    text: string

    @ManyToOne(() => Comment, comment => comment.replies)
    comment: Comment

    @ManyToOne(() => User, user => user.replies)
    author: User

    @ManyToOne(() => User, user => user.repliesFor)
    to: User|null

    @ManyToMany(() => User, user => user.repiesLiked)
    @JoinTable()
    likes: User[]

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