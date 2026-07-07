
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Post } from './Post';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100, nullable: false })
    name: string;

    @Column({ unique: true })
    email: string;
    @Column({ select: false })
    password: string;
    @OneToMany(() => Post, post => post.user)
    posts: Post[];
}