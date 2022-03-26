import { Column, Entity, PrimaryColumn, ManyToMany, JoinTable, ManyToOne } from "typeorm";
import { Post } from "./Post";

@Entity()
export class User {
    @PrimaryColumn("varchar", { "length": 255 })
    username: string;

    @Column("varchar", { "length": 255 })
    name: string

    @Column("varchar", { "length": 255 })
    avatar: string

    @Column("varchar", { "length": 255 })
    profileBanner: string

    @Column("boolean", {"default": false})
    isPrivate: boolean

    @ManyToMany(type => User, user => user.subscribed, { cascade: true })
    @JoinTable()
    subscribers: User[]

    @ManyToMany(type => User, user => user.subscribers)
    subscribed: User[]

    @ManyToOne(() => Post, post => post.author)
    posts: Post[]

    @ManyToMany(() => Post, post => post.likes)
    postsLiked: Post[]

    // Array of posts with @this_user_username
    @ManyToMany(() => Post, post => post.markedUsers)
    markedInPosts: Post[]

    subscribersCount?: number

    subscribedCount?: number

    addSubscriber(subscriber: User) {
        if (this.subscribers == null) {
            this.subscribers = new Array<User>();
        }

        this.subscribers.push(subscriber);
    }

    removeSubscriber(subscriber: User) {
        if (this.subscribers == null) {
            this.subscribers = new Array<User>();
        }
        
        this.subscribers = this.subscribers.filter(currentSubscriber => {
            return currentSubscriber.username !== subscriber.username; 
        })
    }
}