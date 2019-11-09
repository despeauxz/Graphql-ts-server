import {Entity, PrimaryGeneratedColumn, Column, BaseEntity} from "typeorm";

@Entity()
export class User extends BaseEntity {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("varchar", { length: 255 })
    email: string;

    @Column("varchar", { length: 255 })
    password: string;

    @Column("boolean", { default: false })
    confirmed: boolean;

}
