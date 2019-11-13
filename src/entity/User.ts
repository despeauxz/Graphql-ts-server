import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    BeforeInsert
} from "typeorm";
import * as bcrypt from "bcrypt";

@Entity("users")
export class User extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("varchar", { length: 255, nullable: true })
    email: string;

    @Column("varchar", { length: 255, nullable: true })
    password: string;

    @Column("boolean", { default: false })
    confirmed: boolean;

    @Column("text", { nullable: true })
    googleId: string | null

    @BeforeInsert()
    async hashPasswordBeforeInsert() {
        this.password = await bcrypt.hash(this.password, 10);
    }
}
