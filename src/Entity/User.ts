import {Column, Entity, PrimaryColumn} from "typeorm";

@Entity()
export class User {
    @PrimaryColumn("varchar", { "length": 255 })
    username: string;

    @Column("varchar", { "length": 255 })
    firstName: string

    @Column("varchar", { "length": 255 })
    lastName: string
}