import { Column, Entity, PrimaryColumn, ManyToMany, JoinTable, ManyToOne } from "typeorm";
import { Comment } from "./Comment.js";
import { Post } from "./Post.js";
import { Reply } from "./Reply.js";

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

    @ManyToOne(() => Comment, comment => comment.author)
    comments: Comment[]

    @ManyToMany(() => Comment, comment => comment.likes)
    commentsLiked: Comment[]

    @ManyToOne(() => Reply, reply => reply.author)
    replies: Reply[]

    // Array of replies with to = this user
    @ManyToOne(() => Reply, reply => reply.to)
    repliesFor: Reply[]

    @ManyToMany(() => Reply, reply => reply.likes)
    repiesLiked: Reply[]

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