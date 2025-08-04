import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Comment } from '../comments/comment.entity';
import { Like } from '../likes/like.entity';

@Entity()
@Index(['country', 'city'])
@Index(['isPublished', 'createdAt'])
@Index(['travelDate'])
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @Column({ type: 'text', nullable: true })
  summary: string;

  // Location fields (Phase 1)
  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  city: string;

  // Content enhancement (Phase 1 & 2)
  @Column({ type: 'simple-array', nullable: true })
  tags: string[];

  @Column({ type: 'simple-array', nullable: true })
  images: string[];

  // Travel metadata (Phase 2)
  @Column({ type: 'date', nullable: true })
  travelDate: Date;

  @Column({ type: 'int', nullable: true })
  duration: number; // in days

  // Status (Phase 1)
  @Column({ default: false })
  isPublished: boolean;

  // Relations
  @ManyToOne(() => User, (user) => user.articles, {
    eager: true,
    onDelete: 'CASCADE',
  })
  author: User;

  @OneToMany(() => Comment, (comment) => comment.article)
  comments: Comment[];

  @OneToMany(() => Like, (like) => like.article)
  likes: Like[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
