import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Hashtag } from "./Hashtag";
import { User } from "./User";

@Entity()
export class Post {
    @PrimaryGeneratedColumn()
    id: number

    @Column("datetime")
    date: Date

    @Column("datetime", { nullable: true })
    dateUpdated: Date|null

    @Column("text")
    text: string

    @ManyToMany(() => Hashtag, hashtag => hashtag.associatedPosts)
    @JoinTable()
    hashtags: Hashtag[]

    @ManyToMany(() => User, user => user.markedInPosts)
    @JoinTable()
    markedUsers: User[]

    @Column("json")
    images: string[]

    @ManyToOne(() => User, user => user.posts)
    author: User

    @ManyToMany(() => User, user => user.postsLiked, { cascade: true })
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