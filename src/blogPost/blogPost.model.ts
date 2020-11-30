import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  RelationId,
} from "typeorm"

import { User } from "src/user/user.model"

@Entity()
export class BlogPost extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  title: string

  @Column()
  content: string

  @CreateDateColumn()
  created: Date

  @Column()
  createdBy: number

  @UpdateDateColumn()
  updated: Date[]

  //* we can add if we want to know orders of food
  //? however it will get clustered and unnecessorily big
  @RelationId((blogPost: BlogPost) => blogPost.user) // you need to specify target relation
  userId: number

  @ManyToOne(() => User, user => user.blogPosts)
  user: User
}
