import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  RelationId,
} from "typeorm"

import { BlogPost } from "src/blogPost/blogPost.model"

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  //Todo: commented out for simplicity during development and testing
  // @Column()
  // firstName: string

  // @Column()
  // lastName: string

  @Column({ unique: true })
  email: string

  @Column()
  password: string

  @Column({ unique: true })
  phoneNumber: string

  @CreateDateColumn()
  created: Date

  @UpdateDateColumn()
  updateDate: Date

  @RelationId((user: User) => user.blogPosts)
  blogPostsId: number[]

  //* Relations:
  @OneToMany(() => BlogPost, blogPost => blogPost.user)
  blogPosts: BlogPost[]
}
