import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('about_content')
export class AboutContent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  title: string;

  @Column('text')
  shortText: string;

  @Column('text')
  fullText: string;

  @Column({ nullable: true })
  imageUrl?: string;

  @Column({ nullable: true })
  videoUrl?: string;

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
